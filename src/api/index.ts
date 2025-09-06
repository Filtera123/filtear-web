// API模块统一导出

// 文件上传下载相关
export {
  uploadFile,
  uploadFiles,
  downloadFile,
  uploadAvatar,
  preprocessAvatarFile,
  useUploadProgress,
} from './file';

// 类型定义
export type {
  BaseApiResponse,
  FileUploadResponse,
  FileDownloadResponse,
  FileUploadOptions,
  FileValidationResult,
  FileTypeConfig,
  ImageCompressOptions,
  BatchUploadResult,
  FilePreview,
} from './types';

// 常量导出
export {
  FILE_TYPE_CONFIGS,
  ERROR_MESSAGES,
} from './types';

// 文件工具函数
export {
  validateFile,
  validateFiles,
  filterValidFiles,
  formatFileSize,
  getFileExtension,
  isImageFile,
  isVideoFile,
  createFilePreview,
  compressImage,
  generateUniqueFileName,
  fileToBase64,
  downloadFile as downloadFileToLocal,
  getFileIdentifier,
} from '../utils/fileUtils';

// 便捷的组合函数
export {
  createFileUploader,
  createBatchUploader,
  createImageUploader,
  createVideoUploader,
} from './uploaders';

// 裁剪上传功能
export {
  uploadWithCrop,
  uploadAvatarWithAutoCrop,
  uploadBackgroundWithAutoCrop,
  cropOnly,
  getSuggestedCropArea,
  batchUploadWithCrop,
  type CropUploadOptions,
  type CropUploadResult,
} from './cropUpload';

// 图片裁剪工具
export {
  calculateInitialCrop,
  createCroppedCanvas,
  cropImageToFile,
  cropImageToBase64,
  constrainCropArea,
  scaleCropArea,
  CROP_PRESETS,
  type CropArea,
  type CropConfig,
} from '../utils/imageCrop';

// 发布相关功能
export {
  publishContent,
  validatePublishData,
  type BasePublishData,
  type ImagePublishData,
  type VideoPublishData,
  type DynamicPublishData,
  type PublishData,
  type PublishResult,
  type PublishProgressCallback,
} from './publish';
