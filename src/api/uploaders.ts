// 便捷的文件上传器组合函数

import { uploadFile, uploadFiles } from './file';
import type {
  FileUploadOptions,
  FilePreview,
  BatchUploadResult,
  BaseApiResponse,
  FileUploadResponse,
} from './types';
import {
  validateFile,
  filterValidFiles,
  createFilePreview,
  isImageFile,
  isVideoFile,
} from '../utils/fileUtils';

/**
 * 创建通用文件上传器
 * @param defaultOptions 默认上传选项
 * @returns 上传器对象
 */
export function createFileUploader(defaultOptions: FileUploadOptions = {}) {
  return {
    /**
     * 上传单个文件
     */
    async upload(
      file: File,
      options: FileUploadOptions = {}
    ): Promise<BaseApiResponse<FileUploadResponse>> {
      const mergedOptions = { ...defaultOptions, ...options };
      return await uploadFile(file, mergedOptions);
    },

    /**
     * 验证文件
     */
    validate(file: File) {
      return validateFile(file, defaultOptions.type);
    },

    /**
     * 创建文件预览
     */
    async createPreview(file: File): Promise<string> {
      return await createFilePreview(file);
    },
  };
}

/**
 * 创建批量文件上传器
 * @param defaultOptions 默认上传选项
 * @returns 批量上传器对象
 */
export function createBatchUploader(defaultOptions: FileUploadOptions = {}) {
  return {
    /**
     * 批量上传文件
     */
    async uploadAll(
      files: File[],
      options: FileUploadOptions = {}
    ): Promise<BatchUploadResult> {
      const mergedOptions = { ...defaultOptions, ...options };
      return await uploadFiles(files, mergedOptions);
    },

    /**
     * 过滤有效文件
     */
    filterValid(files: File[]): File[] {
      return filterValidFiles(files, defaultOptions.type);
    },

    /**
     * 创建文件预览列表
     */
    async createPreviews(files: File[]): Promise<FilePreview[]> {
      const previews: FilePreview[] = [];

      for (const file of files) {
        try {
          const previewUrl = isImageFile(file) 
            ? await createFilePreview(file) 
            : '';
          
          previews.push({
            file,
            previewUrl,
            status: 'pending',
            progress: 0,
          });
        } catch (error) {
          previews.push({
            file,
            previewUrl: '',
            status: 'error',
            progress: 0,
            error: error instanceof Error ? error.message : '预览失败',
          });
        }
      }

      return previews;
    },

    /**
     * 逐个上传文件（带进度跟踪）
     */
    async uploadSequentially(
      files: File[],
      options: FileUploadOptions = {},
      onFileProgress?: (fileIndex: number, file: File, progress: number) => void,
      onFileComplete?: (fileIndex: number, file: File, result: BaseApiResponse<FileUploadResponse>) => void
    ): Promise<BatchUploadResult> {
      const results: BatchUploadResult = {
        success: [],
        failed: [],
      };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          const result = await uploadFile(file, {
            ...defaultOptions,
            ...options,
            onProgress: (progress) => {
              onFileProgress?.(i, file, progress);
            },
          });

          onFileComplete?.(i, file, result);

          if (result.code === 200 && result.data) {
            results.success.push({
              file,
              result: result.data,
            });
          } else {
            results.failed.push({
              file,
              error: result.message,
            });
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : '上传失败';
          results.failed.push({
            file,
            error: errorMsg,
          });

          onFileComplete?.(i, file, {
            code: 500,
            message: errorMsg,
          });
        }
      }

      return results;
    },
  };
}

/**
 * 创建图片上传器
 * @param options 图片上传选项
 * @returns 图片上传器对象
 */
export function createImageUploader(options: Omit<FileUploadOptions, 'type'> = {}) {
  const defaultOptions: FileUploadOptions = {
    type: 'post-image',
    compress: true,
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    ...options,
  };

  const baseUploader = createFileUploader(defaultOptions);

  return {
    ...baseUploader,

    /**
     * 上传头像
     */
    async uploadAvatar(
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<BaseApiResponse<FileUploadResponse>> {
      return await uploadFile(file, {
        type: 'avatar',
        compress: true,
        quality: 0.7,
        maxWidth: 800,
        maxHeight: 800,
        onProgress,
      });
    },

    /**
     * 上传帖子图片
     */
    async uploadPostImage(
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<BaseApiResponse<FileUploadResponse>> {
      return await uploadFile(file, {
        ...defaultOptions,
        type: 'post-image',
        onProgress,
      });
    },

    /**
     * 创建图片预览
     */
    async createImagePreview(file: File): Promise<string> {
      if (!isImageFile(file)) {
        throw new Error('只能为图片文件创建预览');
      }
      return await createFilePreview(file);
    },
  };
}

/**
 * 创建视频上传器
 * @param options 视频上传选项
 * @returns 视频上传器对象
 */
export function createVideoUploader(options: Omit<FileUploadOptions, 'type'> = {}) {
  const defaultOptions: FileUploadOptions = {
    type: 'video',
    compress: false, // 视频不压缩
    ...options,
  };

  const baseUploader = createFileUploader(defaultOptions);

  return {
    ...baseUploader,

    /**
     * 上传视频文件
     */
    async uploadVideo(
      file: File,
      onProgress?: (progress: number) => void
    ): Promise<BaseApiResponse<FileUploadResponse>> {
      if (!isVideoFile(file)) {
        return {
          code: 400,
          message: '只能上传视频文件',
        };
      }

      return await uploadFile(file, {
        ...defaultOptions,
        onProgress,
      });
    },

    /**
     * 获取视频信息
     */
    async getVideoInfo(file: File): Promise<{
      duration: number;
      width: number;
      height: number;
      size: number;
    }> {
      return new Promise((resolve, reject) => {
        if (!isVideoFile(file)) {
          reject(new Error('只能获取视频文件信息'));
          return;
        }

        const video = document.createElement('video');
        const url = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          resolve({
            duration: video.duration,
            width: video.videoWidth,
            height: video.videoHeight,
            size: file.size,
          });
          URL.revokeObjectURL(url);
        };

        video.onerror = () => {
          reject(new Error('无法读取视频信息'));
          URL.revokeObjectURL(url);
        };

        video.src = url;
      });
    },

    /**
     * 创建视频缩略图
     */
    async createVideoThumbnail(file: File): Promise<string> {
      return new Promise((resolve, reject) => {
        if (!isVideoFile(file)) {
          reject(new Error('只能为视频文件创建缩略图'));
          return;
        }

        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const url = URL.createObjectURL(file);

        video.onloadeddata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              reject(new Error('缩略图生成失败'));
            }
            URL.revokeObjectURL(url);
          }, 'image/jpeg', 0.8);
        };

        video.onerror = () => {
          reject(new Error('视频加载失败'));
          URL.revokeObjectURL(url);
        };

        video.src = url;
        video.currentTime = 1; // 获取第1秒的帧作为缩略图
      });
    },
  };
}
