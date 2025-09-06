// 文件上传下载API接口

import type {
  BaseApiResponse,
  FileUploadResponse,
  FileDownloadResponse,
  FileUploadOptions,
  BatchUploadResult,
} from './types';

import {
  ERROR_MESSAGES,
} from './types';

import {
  validateFile,
  compressImage,
  isImageFile,
  generateUniqueFileName,
} from '../utils/fileUtils';

import { API_CONFIG, getApiUrl, apiRequest } from '../config/api';

// API基础配置
const DEFAULT_TIMEOUT = 30000; // 30秒超时

// 模拟网络延迟（开发环境）
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 上传单个文件
 * @param file 文件对象
 * @param options 上传选项
 * @returns Promise<上传结果>
 */
export async function uploadFile(
  file: File,
  options: FileUploadOptions = {}
): Promise<BaseApiResponse<FileUploadResponse>> {
  try {
    const {
      type = 'post-image',
      compress = true,
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      onProgress,
    } = options;

    // 文件验证
    const validation = validateFile(file, type);
    if (!validation.valid) {
      return {
        code: 400,
        message: validation.error || ERROR_MESSAGES.INVALID_FILE,
      };
    }

    let fileToUpload = file;

    // 如果是图片且需要压缩
    if (isImageFile(file) && compress && type !== 'avatar') {
      try {
        fileToUpload = await compressImage(file, {
          quality,
          maxWidth,
          maxHeight,
        });
      } catch (error) {
        console.warn('图片压缩失败，使用原图上传:', error);
        fileToUpload = file;
      }
    }

    // 头像特殊处理：如果超过5MB则强制压缩
    if (type === 'avatar' && file.size > 5 * 1024 * 1024) {
      try {
        fileToUpload = await compressImage(file, {
          quality: 0.7,
          maxWidth: 800,
          maxHeight: 800,
        });
      } catch (error) {
        return {
          code: 400,
          message: '头像文件过大且压缩失败，请选择较小的图片',
        };
      }
    }

    // 创建FormData
    const formData = new FormData();
    formData.append('file', fileToUpload);

    // 在实际环境中，这里会发送真实的HTTP请求
    return await uploadFileRequest(formData, {
      onProgress,
      timeout: DEFAULT_TIMEOUT,
    });

  } catch (error) {
    console.error('文件上传失败:', error);
    return {
      code: 500,
      message: ERROR_MESSAGES.UPLOAD_FAILED,
    };
  }
}

/**
 * 实际的文件上传请求（可替换为真实的API调用）
 * @param formData 表单数据
 * @param options 请求选项
 * @returns Promise<上传结果>
 */
async function uploadFileRequest(
  formData: FormData,
  options: {
    onProgress?: (progress: number) => void;
    timeout?: number;
  } = {}
): Promise<BaseApiResponse<FileUploadResponse>> {
  const { onProgress, timeout = DEFAULT_TIMEOUT } = options;

  // 在开发环境中使用模拟上传（临时启用，等后端9300端口开放后再切换）
  if (process.env.NODE_ENV === 'development') {
    return simulateFileUpload(formData, onProgress);
  }

  // 真实上传逻辑（开发和生产环境都使用）
  const uploadUrl = getApiUrl('/api/file/upload');
  console.log('🚀 使用真实API上传文件到:', uploadUrl);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const timeoutId = setTimeout(() => {
      xhr.abort();
      reject(new Error('上传超时'));
    }, timeout);

    // 监听上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      clearTimeout(timeoutId);
      try {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } catch (error) {
        reject(new Error('响应解析失败'));
      }
    });

    xhr.addEventListener('error', () => {
      clearTimeout(timeoutId);
      reject(new Error(ERROR_MESSAGES.NETWORK_ERROR));
    });

    xhr.open('POST', uploadUrl);
    
    // 添加必要的请求头（如认证token等）
    const token = localStorage.getItem('auth_token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    xhr.send(formData);
  });
}

/**
 * 模拟文件上传（开发环境）
 * @param formData 表单数据
 * @param onProgress 进度回调
 * @returns Promise<模拟上传结果>
 */
async function simulateFileUpload(
  formData: FormData,
  onProgress?: (progress: number) => void
): Promise<BaseApiResponse<FileUploadResponse>> {
  const file = formData.get('file') as File;
  
  if (!file) {
    return {
      code: 400,
      message: '未找到上传文件',
    };
  }

  // 模拟上传进度
  if (onProgress) {
    for (let i = 0; i <= 100; i += 10) {
      await delay(100);
      onProgress(i);
    }
  } else {
    await delay(1000 + Math.random() * 2000); // 1-3秒随机延迟
  }

  // 生成模拟的OSS key
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const fileExtension = file.name.split('.').pop();
  const ossKey = `/dev/${timestamp}_${randomStr}.${fileExtension}`;

  return {
    code: 200,
    message: '上传成功',
    data: {
      key: ossKey,
      compressedKey: isImageFile(file) ? `${ossKey}_compressed` : undefined,
      size: file.size,
      type: file.type,
      originalName: file.name,
    },
  };
}

/**
 * 批量上传文件
 * @param files 文件列表
 * @param options 上传选项
 * @returns Promise<批量上传结果>
 */
export async function uploadFiles(
  files: File[],
  options: FileUploadOptions = {}
): Promise<BatchUploadResult> {
  const results: BatchUploadResult = {
    success: [],
    failed: [],
  };

  // 并发上传（最多同时上传3个文件）
  const concurrency = 3;
  const chunks = [];
  
  for (let i = 0; i < files.length; i += concurrency) {
    chunks.push(files.slice(i, i + concurrency));
  }

  for (const chunk of chunks) {
    const promises = chunk.map(async (file) => {
      try {
        const response = await uploadFile(file, options);
        if (response.code === 200 && response.data) {
          results.success.push({
            file,
            result: response.data,
          });
        } else {
          results.failed.push({
            file,
            error: response.message,
          });
        }
      } catch (error) {
        results.failed.push({
          file,
          error: error instanceof Error ? error.message : '上传失败',
        });
      }
    });

    await Promise.all(promises);
  }

  return results;
}

/**
 * 下载文件
 * @param fileName 文件在OSS中的key
 * @returns Promise<下载链接>
 */
export async function downloadFile(
  fileName: string
): Promise<BaseApiResponse<FileDownloadResponse>> {
  try {
    if (!fileName) {
      return {
        code: 400,
        message: '文件名不能为空',
      };
    }

    // 在开发环境中使用模拟下载（已注释，现在直接使用真实API）
    // if (process.env.NODE_ENV === 'development') {
    //   return simulateFileDownload(fileName);
    // }

    // 真实下载逻辑（开发和生产环境都使用）
    const downloadUrl = `${getApiUrl(API_CONFIG.ENDPOINTS.FILE_DOWNLOAD)}?fileName=${encodeURIComponent(fileName)}`;
    console.log('🚀 使用真实API下载文件:', downloadUrl);
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    console.error('文件下载失败:', error);
    return {
      code: 500,
      message: ERROR_MESSAGES.NETWORK_ERROR,
    };
  }
}

/**
 * 模拟文件下载（开发环境）
 * @param fileName 文件名
 * @returns Promise<模拟下载结果>
 */
async function simulateFileDownload(
  fileName: string
): Promise<BaseApiResponse<FileDownloadResponse>> {
  await delay(500); // 模拟网络延迟

  // 模拟检查文件是否存在
  if (fileName.includes('notfound')) {
    return {
      code: 404,
      message: '文件不存在或已被删除',
    };
  }

  // 生成模拟的预签名URL
  const baseUrl = 'https://example-bucket.oss-cn-hangzhou.aliyuncs.com';
  const timestamp = Math.floor(Date.now() / 1000);
  const expires = 3600; // 1小时
  const signature = Math.random().toString(36).substring(2, 15);
  
  const mockUrl = `${baseUrl}${fileName}?x-oss-expires=${expires}&x-oss-signature=${signature}&x-oss-date=${timestamp}`;

  return {
    code: 200,
    message: '获取下载链接成功',
    data: {
      url: mockUrl,
      expiresAt: (timestamp + expires) * 1000, // 转换为毫秒时间戳
    },
  };
}

/**
 * 获取上传进度钩子函数
 * @returns 进度状态和回调函数
 */
export function useUploadProgress() {
  let progress = 0;
  let isUploading = false;

  const setProgress = (newProgress: number) => {
    progress = Math.max(0, Math.min(100, newProgress));
  };

  const startUpload = () => {
    isUploading = true;
    progress = 0;
  };

  const finishUpload = () => {
    isUploading = false;
    progress = 100;
  };

  const resetProgress = () => {
    isUploading = false;
    progress = 0;
  };

  return {
    progress,
    isUploading,
    setProgress,
    startUpload,
    finishUpload,
    resetProgress,
  };
}

/**
 * 预处理头像上传
 * @param file 头像文件
 * @returns Promise<处理后的文件>
 */
export async function preprocessAvatarFile(file: File): Promise<File> {
  // 头像特殊处理逻辑
  const validation = validateFile(file, 'avatar');
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // 如果文件过大，强制压缩
  if (file.size > 5 * 1024 * 1024) {
    return await compressImage(file, {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 800,
      outputFormat: 'jpeg',
    });
  }

  return file;
}

/**
 * 上传头像的便捷方法
 * @param file 头像文件
 * @param onProgress 进度回调
 * @returns Promise<上传结果>
 */
export async function uploadAvatar(
  file: File,
  onProgress?: (progress: number) => void
): Promise<BaseApiResponse<FileUploadResponse>> {
  try {
    const processedFile = await preprocessAvatarFile(file);
    return await uploadFile(processedFile, {
      type: 'avatar',
      compress: false, // 已经预处理过了
      onProgress,
    });
  } catch (error) {
    return {
      code: 400,
      message: error instanceof Error ? error.message : '头像上传失败',
    };
  }
}
