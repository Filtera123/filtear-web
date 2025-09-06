// 图片裁剪工具函数

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropConfig {
  aspectRatio?: number; // 宽高比，如 1 表示正方形，16/9 表示16:9
  minWidth?: number;    // 最小宽度
  minHeight?: number;   // 最小高度
  maxWidth?: number;    // 最大宽度
  maxHeight?: number;   // 最大高度
  outputWidth?: number; // 输出图片宽度
  outputHeight?: number; // 输出图片高度
  outputQuality?: number; // 输出质量 0-1
}

/**
 * 计算居中的初始裁剪区域
 * @param imageWidth 图片宽度
 * @param imageHeight 图片高度
 * @param aspectRatio 目标宽高比
 * @returns 裁剪区域
 */
export function calculateInitialCrop(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number = 1
): CropArea {
  let cropWidth: number;
  let cropHeight: number;

  if (imageWidth / imageHeight > aspectRatio) {
    // 图片比较宽，以高度为准
    cropHeight = imageHeight;
    cropWidth = cropHeight * aspectRatio;
  } else {
    // 图片比较高，以宽度为准
    cropWidth = imageWidth;
    cropHeight = cropWidth / aspectRatio;
  }

  // 居中定位
  const x = (imageWidth - cropWidth) / 2;
  const y = (imageHeight - cropHeight) / 2;

  return {
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.min(cropWidth, imageWidth),
    height: Math.min(cropHeight, imageHeight),
  };
}

/**
 * 创建裁剪后的Canvas
 * @param image 原始图片元素
 * @param cropArea 裁剪区域
 * @param outputWidth 输出宽度
 * @param outputHeight 输出高度
 * @returns Canvas元素
 */
export function createCroppedCanvas(
  image: HTMLImageElement,
  cropArea: CropArea,
  outputWidth?: number,
  outputHeight?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('无法创建Canvas上下文');
  }

  // 设置输出尺寸
  const finalWidth = outputWidth || cropArea.width;
  const finalHeight = outputHeight || cropArea.height;

  canvas.width = finalWidth;
  canvas.height = finalHeight;

  // 启用图像平滑
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 绘制裁剪区域到Canvas
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    finalWidth,
    finalHeight
  );

  return canvas;
}

/**
 * 将裁剪区域转换为File对象
 * @param image 原始图片元素
 * @param cropArea 裁剪区域
 * @param config 裁剪配置
 * @param fileName 输出文件名
 * @returns Promise<File>
 */
export function cropImageToFile(
  image: HTMLImageElement,
  cropArea: CropArea,
  config: CropConfig = {},
  fileName: string = 'cropped-image.jpg'
): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      const {
        outputWidth = cropArea.width,
        outputHeight = cropArea.height,
        outputQuality = 0.9,
      } = config;

      const canvas = createCroppedCanvas(
        image,
        cropArea,
        outputWidth,
        outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('图片裁剪失败'));
            return;
          }

          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });

          resolve(file);
        },
        'image/jpeg',
        outputQuality
      );
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * 将裁剪区域转换为Base64
 * @param image 原始图片元素
 * @param cropArea 裁剪区域
 * @param config 裁剪配置
 * @returns Base64字符串
 */
export function cropImageToBase64(
  image: HTMLImageElement,
  cropArea: CropArea,
  config: CropConfig = {}
): string {
  const {
    outputWidth = cropArea.width,
    outputHeight = cropArea.height,
    outputQuality = 0.9,
  } = config;

  const canvas = createCroppedCanvas(
    image,
    cropArea,
    outputWidth,
    outputHeight
  );

  return canvas.toDataURL('image/jpeg', outputQuality);
}

/**
 * 约束裁剪区域在图片边界内
 * @param cropArea 裁剪区域
 * @param imageWidth 图片宽度
 * @param imageHeight 图片高度
 * @param aspectRatio 宽高比
 * @returns 约束后的裁剪区域
 */
export function constrainCropArea(
  cropArea: CropArea,
  imageWidth: number,
  imageHeight: number,
  aspectRatio?: number
): CropArea {
  let { x, y, width, height } = cropArea;

  // 如果有宽高比约束，调整尺寸
  if (aspectRatio && aspectRatio > 0) {
    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }
  }

  // 确保不超出图片边界
  if (x + width > imageWidth) {
    x = imageWidth - width;
  }
  if (y + height > imageHeight) {
    y = imageHeight - height;
  }

  // 确保不小于0
  x = Math.max(0, x);
  y = Math.max(0, y);

  // 如果调整后的位置导致尺寸超出边界，再次调整尺寸
  width = Math.min(width, imageWidth - x);
  height = Math.min(height, imageHeight - y);

  return { x, y, width, height };
}

/**
 * 缩放裁剪区域（用于响应式显示）
 * @param cropArea 原始裁剪区域
 * @param scale 缩放比例
 * @returns 缩放后的裁剪区域
 */
export function scaleCropArea(cropArea: CropArea, scale: number): CropArea {
  return {
    x: cropArea.x * scale,
    y: cropArea.y * scale,
    width: cropArea.width * scale,
    height: cropArea.height * scale,
  };
}

/**
 * 预设的裁剪配置
 */
export const CROP_PRESETS = {
  // 头像 - 正方形
  avatar: {
    aspectRatio: 1,
    outputWidth: 400,
    outputHeight: 400,
    outputQuality: 0.9,
  } as CropConfig,

  // 背景图 - 16:9
  background: {
    aspectRatio: 16 / 9,
    outputWidth: 1920,
    outputHeight: 1080,
    outputQuality: 0.85,
  } as CropConfig,

  // 封面图 - 4:3
  cover: {
    aspectRatio: 4 / 3,
    outputWidth: 800,
    outputHeight: 600,
    outputQuality: 0.85,
  } as CropConfig,

  // 横幅 - 21:9
  banner: {
    aspectRatio: 21 / 9,
    outputWidth: 1260,
    outputHeight: 540,
    outputQuality: 0.85,
  } as CropConfig,

  // 自由裁剪
  free: {
    outputQuality: 0.9,
  } as CropConfig,
} as const;

