// 图片裁剪模态框组件

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  calculateInitialCrop,
  cropImageToFile,
  constrainCropArea,
  type CropArea,
  type CropConfig,
  CROP_PRESETS,
} from '../../utils/imageCrop';

interface ImageCropModalProps {
  /** 是否显示模态框 */
  isOpen: boolean;
  /** 原始图片File对象 */
  imageFile: File | null;
  /** 裁剪类型 */
  cropType: keyof typeof CROP_PRESETS;
  /** 裁剪完成回调 */
  onCropComplete: (croppedFile: File) => void;
  /** 取消回调 */
  onCancel: () => void;
  /** 自定义裁剪配置 */
  customConfig?: Partial<CropConfig>;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageFile,
  cropType,
  onCropComplete,
  onCancel,
  customConfig = {},
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cropConfig = { ...CROP_PRESETS[cropType], ...customConfig };

  // 加载图片
  useEffect(() => {
    if (!imageFile || !isOpen) return;

    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile, isOpen]);

  // 图片加载完成后初始化裁剪区域
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    
    // 获取图片原始尺寸
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    setImageSize({ width: originalWidth, height: originalHeight });

    // 计算显示尺寸（适应容器）
    const containerWidth = container.clientWidth - 40; // 留边距
    const containerHeight = container.clientHeight - 200; // 留出按钮和标题空间
    
    let displayWidth: number;
    let displayHeight: number;
    
    if (originalWidth / originalHeight > containerWidth / containerHeight) {
      // 图片较宽，以宽度为准
      displayWidth = Math.min(containerWidth, originalWidth);
      displayHeight = (displayWidth / originalWidth) * originalHeight;
    } else {
      // 图片较高，以高度为准
      displayHeight = Math.min(containerHeight, originalHeight);
      displayWidth = (displayHeight / originalHeight) * originalWidth;
    }

    setDisplaySize({ width: displayWidth, height: displayHeight });
    const newScale = displayWidth / originalWidth;
    setScale(newScale);

    // 计算初始裁剪区域
    const initialCrop = calculateInitialCrop(
      originalWidth,
      originalHeight,
      cropConfig.aspectRatio || 1
    );

    setCropArea(initialCrop);
  }, [cropConfig.aspectRatio]);

  // 鼠标按下开始拖拽
  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  }, []);

  // 鼠标移动
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    if (isDragging) {
      // 拖拽移动
      const newCropArea = constrainCropArea(
        {
          x: cropArea.x + deltaX,
          y: cropArea.y + deltaY,
          width: cropArea.width,
          height: cropArea.height,
        },
        imageSize.width,
        imageSize.height,
        cropConfig.aspectRatio
      );
      setCropArea(newCropArea);
    } else if (isResizing) {
      // 调整大小
      let newWidth = cropArea.width + deltaX;
      let newHeight = cropArea.height + deltaY;

      // 保持宽高比
      if (cropConfig.aspectRatio) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / cropConfig.aspectRatio;
        } else {
          newWidth = newHeight * cropConfig.aspectRatio;
        }
      }

      const newCropArea = constrainCropArea(
        {
          x: cropArea.x,
          y: cropArea.y,
          width: newWidth,
          height: newHeight,
        },
        imageSize.width,
        imageSize.height,
        cropConfig.aspectRatio
      );
      setCropArea(newCropArea);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, cropArea, scale, imageSize, cropConfig.aspectRatio]);

  // 鼠标抬起
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // 绑定全局鼠标事件
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // 确认裁剪
  const handleCropConfirm = async () => {
    if (!imageRef.current) return;

    try {
      const img = imageRef.current;
      const croppedFile = await cropImageToFile(
        img,
        cropArea,
        cropConfig,
        `cropped-${cropType}-${Date.now()}.jpg`
      );
      
      onCropComplete(croppedFile);
    } catch (error) {
      console.error('裁剪失败:', error);
      alert('图片裁剪失败，请重试');
    }
  };

  // 重置裁剪区域
  const handleReset = () => {
    if (imageSize.width > 0 && imageSize.height > 0) {
      const initialCrop = calculateInitialCrop(
        imageSize.width,
        imageSize.height,
        cropConfig.aspectRatio || 1
      );
      setCropArea(initialCrop);
    }
  };

  if (!isOpen) return null;

  const cropTypeNames = {
    avatar: '头像',
    background: '背景图',
    cover: '封面图',
    banner: '横幅',
    free: '自由裁剪',
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* 标题栏 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {cropTypeNames[cropType]}裁剪
            {cropConfig.aspectRatio && (
              <span className="text-sm text-gray-500 ml-2">
                比例 {cropConfig.aspectRatio === 1 ? '1:1' : 
                      cropConfig.aspectRatio === 16/9 ? '16:9' :
                      cropConfig.aspectRatio === 4/3 ? '4:3' :
                      cropConfig.aspectRatio === 21/9 ? '21:9' :
                      cropConfig.aspectRatio?.toFixed(2)}
              </span>
            )}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ×
          </button>
        </div>

        {/* 裁剪区域 */}
        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 overflow-hidden"
          style={{ minHeight: '400px' }}
        >
          {imageUrl && (
            <div 
              className="relative"
              style={{ 
                width: displaySize.width,
                height: displaySize.height,
              }}
            >
              {/* 原始图片 */}
              <img
                ref={imageRef}
                src={imageUrl}
                alt="待裁剪图片"
                onLoad={handleImageLoad}
                className="w-full h-full object-contain"
                draggable={false}
              />

              {/* 遮罩层 */}
              <div
                className="absolute inset-0 bg-black bg-opacity-50"
                style={{
                  clipPath: `polygon(
                    0% 0%, 
                    0% 100%, 
                    ${(cropArea.x * scale)}px 100%, 
                    ${(cropArea.x * scale)}px ${(cropArea.y * scale)}px, 
                    ${((cropArea.x + cropArea.width) * scale)}px ${(cropArea.y * scale)}px, 
                    ${((cropArea.x + cropArea.width) * scale)}px ${((cropArea.y + cropArea.height) * scale)}px, 
                    ${(cropArea.x * scale)}px ${((cropArea.y + cropArea.height) * scale)}px, 
                    ${(cropArea.x * scale)}px 100%, 
                    100% 100%, 
                    100% 0%
                  )`,
                }}
              />

              {/* 裁剪框 */}
              <div
                className="absolute border-2 border-white cursor-move"
                style={{
                  left: cropArea.x * scale,
                  top: cropArea.y * scale,
                  width: cropArea.width * scale,
                  height: cropArea.height * scale,
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* 网格线 */}
                <div className="absolute inset-0 opacity-50">
                  <div className="absolute top-1/3 left-0 right-0 border-t border-white"></div>
                  <div className="absolute top-2/3 left-0 right-0 border-t border-white"></div>
                  <div className="absolute left-1/3 top-0 bottom-0 border-l border-white"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 border-l border-white"></div>
                </div>

                {/* 调整手柄 */}
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border border-gray-400 cursor-nw-resize"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            重置
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleCropConfirm}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              确认裁剪
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

