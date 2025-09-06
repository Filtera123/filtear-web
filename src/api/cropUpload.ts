// 带裁剪功能的文件上传API

import { uploadFile } from './file';
import { validateFile } from '../utils/fileUtils';
import { cropImageToFile, type CropArea, type CropConfig, CROP_PRESETS } from '../utils/imageCrop';
import type { BaseApiResponse, FileUploadResponse, FileUploadOptions } from './types';

export interface CropUploadOptions extends Omit<FileUploadOptions, 'compress'> {
  /** 裁剪类型 */
  cropType?: keyof typeof CROP_PRESETS;
  /** 自定义裁剪配置 */
  customCropConfig?: Partial<CropConfig>;
  /** 是否自动裁剪（使用默认配置） */
  autoCrop?: boolean;
  /** 自定义裁剪区域 */
  cropArea?: CropArea;
}

export interface CropUploadResult extends FileUploadResponse {
  /** 裁剪后的图片尺寸 */
  croppedSize?: {
    width: number;
    height: number;
  };
  /** 原图尺寸 */
  originalSize?: {
    width: number;
    height: number;
  };
}

/**
 * 上传并裁剪图片
 * @param file 原始图片文件
 * @param cropArea 裁剪区域
 * @param options 上传选项
 * @returns Promise<上传结果>
 */
export async function uploadWithCrop(
  file: File,
  cropArea: CropArea,
  options: CropUploadOptions = {}
): Promise<BaseApiResponse<CropUploadResult>> {
  try {
    const {
      cropType = 'avatar',
      customCropConfig = {},
      type = 'post-image',
      onProgress,
    } = options;

    // 验证原始文件
    const validation = validateFile(file, type);
    if (!validation.valid) {
      return {
        code: 400,
        message: validation.error || '文件验证失败',
      };
    }

    // 获取裁剪配置
    const cropConfig = { ...CROP_PRESETS[cropType], ...customCropConfig };

    // 创建图片元素以获取原始尺寸
    const image = await createImageElement(file);
    const originalSize = {
      width: image.naturalWidth,
      height: image.naturalHeight,
    };

    // 执行裁剪
    const croppedFile = await cropImageToFile(
      image,
      cropArea,
      cropConfig,
      `cropped-${cropType}-${Date.now()}.jpg`
    );

    const croppedSize = {
      width: cropConfig.outputWidth || cropArea.width,
      height: cropConfig.outputHeight || cropArea.height,
    };

    // 上传裁剪后的文件
    const uploadResult = await uploadFile(croppedFile, {
      type,
      compress: false, // 已经裁剪处理过了
      onProgress,
    });

    if (uploadResult.code === 200 && uploadResult.data) {
      return {
        code: 200,
        message: uploadResult.message,
        data: {
          ...uploadResult.data,
          croppedSize,
          originalSize,
        },
      };
    } else {
      return uploadResult;
    }
  } catch (error) {
    console.error('裁剪上传失败:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '裁剪上传失败',
    };
  }
}

/**
 * 智能头像上传（自动裁剪为正方形）
 * @param file 图片文件
 * @param onProgress 进度回调
 * @returns Promise<上传结果>
 */
export async function uploadAvatarWithAutoCrop(
  file: File,
  onProgress?: (progress: number) => void
): Promise<BaseApiResponse<CropUploadResult>> {
  try {
    // 验证文件
    const validation = validateFile(file, 'avatar');
    if (!validation.valid) {
      return {
        code: 400,
        message: validation.error || '头像文件验证失败',
      };
    }

    // 加载图片并计算裁剪区域
    const image = await createImageElement(file);
    const { naturalWidth: width, naturalHeight: height } = image;

    // 计算居中的正方形裁剪区域
    const size = Math.min(width, height);
    const cropArea: CropArea = {
      x: (width - size) / 2,
      y: (height - size) / 2,
      width: size,
      height: size,
    };

    return await uploadWithCrop(file, cropArea, {
      type: 'avatar',
      cropType: 'avatar',
      onProgress,
    });
  } catch (error) {
    console.error('智能头像上传失败:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '头像上传失败',
    };
  }
}

/**
 * 智能背景图上传（自动裁剪为16:9）
 * @param file 图片文件
 * @param onProgress 进度回调
 * @returns Promise<上传结果>
 */
export async function uploadBackgroundWithAutoCrop(
  file: File,
  onProgress?: (progress: number) => void
): Promise<BaseApiResponse<CropUploadResult>> {
  try {
    // 验证文件
    const validation = validateFile(file, 'post-image');
    if (!validation.valid) {
      return {
        code: 400,
        message: validation.error || '背景图文件验证失败',
      };
    }

    // 加载图片并计算裁剪区域
    const image = await createImageElement(file);
    const { naturalWidth: width, naturalHeight: height } = image;

    // 计算居中的16:9裁剪区域
    const aspectRatio = 16 / 9;
    let cropWidth: number;
    let cropHeight: number;

    if (width / height > aspectRatio) {
      // 图片较宽，以高度为准
      cropHeight = height;
      cropWidth = cropHeight * aspectRatio;
    } else {
      // 图片较高，以宽度为准
      cropWidth = width;
      cropHeight = cropWidth / aspectRatio;
    }

    const cropArea: CropArea = {
      x: (width - cropWidth) / 2,
      y: (height - cropHeight) / 2,
      width: cropWidth,
      height: cropHeight,
    };

    return await uploadWithCrop(file, cropArea, {
      type: 'post-image',
      cropType: 'background',
      onProgress,
    });
  } catch (error) {
    console.error('智能背景图上传失败:', error);
    return {
      code: 500,
      message: error instanceof Error ? error.message : '背景图上传失败',
    };
  }
}

/**
 * 创建图片元素
 * @param file 图片文件
 * @returns Promise<HTMLImageElement>
 */
function createImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('图片加载失败'));
    };

    image.src = url;
  });
}

/**
 * 裁剪并压缩图片（不上传）
 * @param file 原始图片文件
 * @param cropArea 裁剪区域
 * @param config 裁剪配置
 * @returns Promise<裁剪后的文件>
 */
export async function cropOnly(
  file: File,
  cropArea: CropArea,
  config: CropConfig = {}
): Promise<File> {
  const image = await createImageElement(file);
  return await cropImageToFile(image, cropArea, config);
}

/**
 * 获取图片的建议裁剪区域
 * @param file 图片文件
 * @param aspectRatio 目标宽高比
 * @returns Promise<建议的裁剪区域>
 */
export async function getSuggestedCropArea(
  file: File,
  aspectRatio: number = 1
): Promise<CropArea> {
  const image = await createImageElement(file);
  const { naturalWidth: width, naturalHeight: height } = image;

  let cropWidth: number;
  let cropHeight: number;

  if (width / height > aspectRatio) {
    cropHeight = height;
    cropWidth = cropHeight * aspectRatio;
  } else {
    cropWidth = width;
    cropHeight = cropWidth / aspectRatio;
  }

  return {
    x: (width - cropWidth) / 2,
    y: (height - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
}

/**
 * 批量裁剪上传
 * @param files 文件列表
 * @param cropAreas 对应的裁剪区域列表
 * @param options 上传选项
 * @returns Promise<批量上传结果>
 */
export async function batchUploadWithCrop(
  files: File[],
  cropAreas: CropArea[],
  options: CropUploadOptions = {}
): Promise<{
  success: Array<{ file: File; result: CropUploadResult }>;
  failed: Array<{ file: File; error: string }>;
}> {
  if (files.length !== cropAreas.length) {
    throw new Error('文件数量与裁剪区域数量不匹配');
  }

  const results = {
    success: [] as Array<{ file: File; result: CropUploadResult }>,
    failed: [] as Array<{ file: File; error: string }>,
  };

  for (let i = 0; i < files.length; i++) {
    try {
      const response = await uploadWithCrop(files[i], cropAreas[i], options);
      if (response.code === 200 && response.data) {
        results.success.push({
          file: files[i],
          result: response.data,
        });
      } else {
        results.failed.push({
          file: files[i],
          error: response.message,
        });
      }
    } catch (error) {
      results.failed.push({
        file: files[i],
        error: error instanceof Error ? error.message : '上传失败',
      });
    }
  }

  return results;
}

