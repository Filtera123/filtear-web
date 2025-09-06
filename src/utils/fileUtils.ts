// 文件处理工具函数

import type {
  FileValidationResult,
  FileTypeConfig,
  ImageCompressOptions,
} from '../api/types';

import {
  FILE_TYPE_CONFIGS,
  ERROR_MESSAGES,
} from '../api/types';

/**
 * 验证文件是否符合要求
 * @param file 文件对象
 * @param type 文件用途类型
 * @returns 验证结果
 */
export function validateFile(
  file: File,
  type: keyof typeof FILE_TYPE_CONFIGS = 'post-image'
): FileValidationResult {
  if (!file) {
    return {
      valid: false,
      error: ERROR_MESSAGES.INVALID_FILE,
      errorCode: 'INVALID_FILE',
    };
  }

  const config = FILE_TYPE_CONFIGS[type];
  if (!config) {
    return {
      valid: false,
      error: ERROR_MESSAGES.INVALID_FILE,
      errorCode: 'INVALID_FILE',
    };
  }

  // 检查文件类型
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: ERROR_MESSAGES.FORMAT_NOT_SUPPORTED,
      errorCode: 'FORMAT_NOT_SUPPORTED',
    };
  }

  // 检查文件大小
  if (file.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `${ERROR_MESSAGES.SIZE_TOO_LARGE}，最大允许${maxSizeMB}MB`,
      errorCode: 'SIZE_TOO_LARGE',
    };
  }

  return { valid: true };
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * 获取文件扩展名
 * @param filename 文件名
 * @returns 扩展名（包含点号）
 */
export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  return lastDotIndex !== -1 ? filename.slice(lastDotIndex) : '';
}

/**
 * 判断是否为图片文件
 * @param file 文件对象
 * @returns 是否为图片
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * 判断是否为视频文件
 * @param file 文件对象
 * @returns 是否为视频
 */
export function isVideoFile(file: File): boolean {
  return file.type.startsWith('video/');
}

/**
 * 创建文件预览URL
 * @param file 文件对象
 * @returns Promise<预览URL>
 */
export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('只支持图片文件预览'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * 压缩图片文件
 * @param file 图片文件
 * @param options 压缩选项
 * @returns Promise<压缩后的文件>
 */
export function compressImage(
  file: File,
  options: ImageCompressOptions = {}
): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!isImageFile(file)) {
      reject(new Error('只能压缩图片文件'));
      return;
    }

    const {
      quality = 0.8,
      maxWidth = 1920,
      maxHeight = 1080,
      outputFormat = 'jpeg',
    } = options;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 计算新的尺寸
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制并压缩图片
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error(ERROR_MESSAGES.COMPRESS_FAILED));
            return;
          }

          const compressedFile = new File(
            [blob],
            file.name.replace(/\.[^/.]+$/, `.${outputFormat}`),
            {
              type: `image/${outputFormat}`,
              lastModified: Date.now(),
            }
          );

          resolve(compressedFile);
        },
        `image/${outputFormat}`,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error(ERROR_MESSAGES.COMPRESS_FAILED));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * 批量验证文件
 * @param files 文件列表
 * @param type 文件用途类型
 * @returns 验证结果数组
 */
export function validateFiles(
  files: File[],
  type: keyof typeof FILE_TYPE_CONFIGS = 'post-image'
): Array<{ file: File; validation: FileValidationResult }> {
  return files.map((file) => ({
    file,
    validation: validateFile(file, type),
  }));
}

/**
 * 过滤有效文件
 * @param files 文件列表
 * @param type 文件用途类型
 * @returns 有效文件列表
 */
export function filterValidFiles(
  files: File[],
  type: keyof typeof FILE_TYPE_CONFIGS = 'post-image'
): File[] {
  return files.filter((file) => validateFile(file, type).valid);
}

/**
 * 生成唯一文件名
 * @param originalName 原始文件名
 * @returns 新的唯一文件名
 */
export function generateUniqueFileName(originalName: string): string {
  const extension = getFileExtension(originalName);
  const baseName = originalName.replace(extension, '');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  
  return `${baseName}_${timestamp}_${random}${extension}`;
}

/**
 * 文件转Base64
 * @param file 文件对象
 * @returns Promise<Base64字符串>
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // 移除data:image/jpeg;base64,前缀，只返回Base64内容
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsDataURL(file);
  });
}

/**
 * 下载文件
 * @param url 下载链接
 * @param filename 文件名
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 获取文件的MD5哈希值（简化版，用于文件去重）
 * @param file 文件对象
 * @returns Promise<文件标识符>
 */
export function getFileIdentifier(file: File): Promise<string> {
  return new Promise((resolve) => {
    // 简化版：使用文件名、大小、最后修改时间生成标识符
    const identifier = `${file.name}_${file.size}_${file.lastModified}`;
    resolve(btoa(identifier)); // Base64编码
  });
}
