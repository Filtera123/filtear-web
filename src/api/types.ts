// 文件上传API类型定义

// 基础API响应类型
export interface BaseApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 文件上传响应数据类型
export interface FileUploadResponse {
  /** 文件在OSS中的唯一标识（key） */
  key: string;
  /** 压缩图key（仅图片文件） */
  compressedKey?: string;
  /** 文件大小（字节） */
  size: number;
  /** 文件类型 */
  type: string;
  /** 原始文件名 */
  originalName: string;
}

// 文件下载响应数据类型
export interface FileDownloadResponse {
  /** 预签名下载链接 */
  url: string;
  /** 链接过期时间（Unix时间戳） */
  expiresAt: number;
}

// 文件上传选项
export interface FileUploadOptions {
  /** 文件用途类型 */
  type?: 'avatar' | 'post-image' | 'video' | 'attachment';
  /** 是否需要压缩（图片文件） */
  compress?: boolean;
  /** 压缩质量 0-1 */
  quality?: number;
  /** 最大宽度（像素） */
  maxWidth?: number;
  /** 最大高度（像素） */
  maxHeight?: number;
  /** 进度回调函数 */
  onProgress?: (progress: number) => void;
}

// 文件验证结果
export interface FileValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 错误信息 */
  error?: string;
  /** 错误代码 */
  errorCode?: 'FORMAT_NOT_SUPPORTED' | 'SIZE_TOO_LARGE' | 'INVALID_FILE';
}

// 支持的文件类型配置
export interface FileTypeConfig {
  /** 允许的MIME类型 */
  allowedTypes: string[];
  /** 最大文件大小（字节） */
  maxSize: number;
  /** 文件扩展名 */
  extensions: string[];
}

// 图片压缩选项
export interface ImageCompressOptions {
  /** 压缩质量 0-1 */
  quality?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 最大高度 */
  maxHeight?: number;
  /** 输出格式 */
  outputFormat?: 'jpeg' | 'png' | 'webp';
}

// 批量上传结果
export interface BatchUploadResult {
  /** 成功上传的文件 */
  success: Array<{
    file: File;
    result: FileUploadResponse;
  }>;
  /** 上传失败的文件 */
  failed: Array<{
    file: File;
    error: string;
  }>;
}

// 文件预览信息
export interface FilePreview {
  /** 文件对象 */
  file: File;
  /** 预览URL */
  previewUrl: string;
  /** 上传状态 */
  status: 'pending' | 'uploading' | 'success' | 'error';
  /** 上传进度 0-100 */
  progress: number;
  /** 上传结果 */
  result?: FileUploadResponse;
  /** 错误信息 */
  error?: string;
}

// 常量定义
export const FILE_TYPE_CONFIGS: Record<string, FileTypeConfig> = {
  avatar: {
    allowedTypes: ['image/jpeg', 'image/png'],
    maxSize: 5 * 1024 * 1024, // 5MB
    extensions: ['.jpg', '.jpeg', '.png'],
  },
  'post-image': {
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxSize: 10 * 1024 * 1024, // 10MB
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
  video: {
    allowedTypes: ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'],
    maxSize: 100 * 1024 * 1024, // 100MB
    extensions: ['.mp4', '.avi', '.mov', '.wmv'],
  },
  attachment: {
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    maxSize: 20 * 1024 * 1024, // 20MB
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx'],
  },
};

// 错误消息映射
export const ERROR_MESSAGES = {
  FORMAT_NOT_SUPPORTED: '文件格式不支持',
  SIZE_TOO_LARGE: '文件大小超出限制',
  INVALID_FILE: '无效的文件',
  NETWORK_ERROR: '网络错误，请稍后重试',
  UPLOAD_FAILED: '上传失败',
  COMPRESS_FAILED: '图片压缩失败',
} as const;
