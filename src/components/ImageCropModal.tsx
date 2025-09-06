// 简化的图片裁剪弹窗组件

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropModalProps {
  open: boolean;
  imageFile: File | null;
  cropType: 'avatar' | 'background';
  onCropComplete: (croppedFile: File) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  open,
  imageFile,
  cropType,
  onCropComplete,
  onCancel,
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

  // 获取裁剪配置
  const getCropConfig = () => {
    if (cropType === 'avatar') {
      return {
        aspectRatio: 1, // 1:1 正方形
        outputWidth: 400,
        outputHeight: 400,
      };
    } else {
      return {
        aspectRatio: 16 / 9, // 16:9 横向
        outputWidth: 1200,
        outputHeight: 675,
      };
    }
  };

  // 加载图片
  useEffect(() => {
    if (!imageFile || !open) return;

    const url = URL.createObjectURL(imageFile);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile, open]);

  // 计算初始裁剪区域
  const calculateInitialCrop = useCallback((imgWidth: number, imgHeight: number, aspectRatio: number) => {
    let cropWidth: number;
    let cropHeight: number;

    if (imgWidth / imgHeight > aspectRatio) {
      // 图片比较宽，以高度为准
      cropHeight = imgHeight;
      cropWidth = cropHeight * aspectRatio;
    } else {
      // 图片比较高，以宽度为准
      cropWidth = imgWidth;
      cropHeight = cropWidth / aspectRatio;
    }

    // 居中定位
    const x = (imgWidth - cropWidth) / 2;
    const y = (imgHeight - cropHeight) / 2;

    return {
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, imgWidth),
      height: Math.min(cropHeight, imgHeight),
    };
  }, []);

  // 图片加载完成
  const handleImageLoad = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const container = containerRef.current;
    
    const originalWidth = img.naturalWidth;
    const originalHeight = img.naturalHeight;
    setImageSize({ width: originalWidth, height: originalHeight });

    // 计算显示尺寸
    const containerWidth = container.clientWidth - 40;
    const containerHeight = 400; // 固定高度
    
    let displayWidth: number;
    let displayHeight: number;
    
    if (originalWidth / originalHeight > containerWidth / containerHeight) {
      displayWidth = Math.min(containerWidth, originalWidth);
      displayHeight = (displayWidth / originalWidth) * originalHeight;
    } else {
      displayHeight = Math.min(containerHeight, originalHeight);
      displayWidth = (displayHeight / originalHeight) * originalWidth;
    }

    setDisplaySize({ width: displayWidth, height: displayHeight });
    const newScale = displayWidth / originalWidth;
    setScale(newScale);

    // 计算初始裁剪区域
    const config = getCropConfig();
    const initialCrop = calculateInitialCrop(originalWidth, originalHeight, config.aspectRatio);
    setCropArea(initialCrop);
  }, [calculateInitialCrop]);

  // 约束裁剪区域
  const constrainCropArea = useCallback((area: CropArea) => {
    const config = getCropConfig();
    let { x, y, width, height } = area;

    // 保持宽高比
    if (config.aspectRatio) {
      if (width / height > config.aspectRatio) {
        width = height * config.aspectRatio;
      } else {
        height = width / config.aspectRatio;
      }
    }

    // 确保不超出边界
    if (x + width > imageSize.width) {
      x = imageSize.width - width;
    }
    if (y + height > imageSize.height) {
      y = imageSize.height - height;
    }

    x = Math.max(0, x);
    y = Math.max(0, y);

    width = Math.min(width, imageSize.width - x);
    height = Math.min(height, imageSize.height - y);

    return { x, y, width, height };
  }, [imageSize]);

  // 鼠标事件处理
  const handleMouseDown = useCallback((e: React.MouseEvent, action: 'drag' | 'resize') => {
    e.preventDefault();
    setDragStart({ x: e.clientX, y: e.clientY });
    
    if (action === 'drag') {
      setIsDragging(true);
    } else {
      setIsResizing(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging && !isResizing) return;

    const deltaX = (e.clientX - dragStart.x) / scale;
    const deltaY = (e.clientY - dragStart.y) / scale;

    if (isDragging) {
      const newCropArea = constrainCropArea({
        x: cropArea.x + deltaX,
        y: cropArea.y + deltaY,
        width: cropArea.width,
        height: cropArea.height,
      });
      setCropArea(newCropArea);
    } else if (isResizing) {
      const config = getCropConfig();
      let newWidth = cropArea.width + deltaX;
      let newHeight = cropArea.height + deltaY;

      if (config.aspectRatio) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          newHeight = newWidth / config.aspectRatio;
        } else {
          newWidth = newHeight * config.aspectRatio;
        }
      }

      const newCropArea = constrainCropArea({
        x: cropArea.x,
        y: cropArea.y,
        width: newWidth,
        height: newHeight,
      });
      setCropArea(newCropArea);
    }

    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isResizing, dragStart, cropArea, scale, constrainCropArea]);

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

  // 执行裁剪
  const handleCropConfirm = async () => {
    if (!imageRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法创建Canvas上下文');

      const config = getCropConfig();
      canvas.width = config.outputWidth;
      canvas.height = config.outputHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        imageRef.current,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        0,
        0,
        config.outputWidth,
        config.outputHeight
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            throw new Error('裁剪失败');
          }

          const croppedFile = new File(
            [blob],
            `cropped-${cropType}-${Date.now()}.jpg`,
            {
              type: 'image/jpeg',
              lastModified: Date.now(),
            }
          );

          onCropComplete(croppedFile);
        },
        'image/jpeg',
        0.9
      );
    } catch (error) {
      console.error('裁剪失败:', error);
      alert('图片裁剪失败，请重试');
    }
  };

  // 重置裁剪区域
  const handleReset = () => {
    if (imageSize.width > 0 && imageSize.height > 0) {
      const config = getCropConfig();
      const initialCrop = calculateInitialCrop(imageSize.width, imageSize.height, config.aspectRatio);
      setCropArea(initialCrop);
    }
  };

  const cropTypeNames = {
    avatar: '头像',
    background: '背景图',
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        裁剪{cropTypeNames[cropType]}
        {cropType === 'avatar' && <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>1:1 正方形</Typography>}
        {cropType === 'background' && <Typography variant="caption" color="textSecondary" sx={{ ml: 1 }}>16:9 横向</Typography>}
      </DialogTitle>
      
      <DialogContent>
        <Box
          ref={containerRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
            overflow: 'hidden',
            position: 'relative',
            backgroundColor: '#f5f5f5',
          }}
        >
          {imageUrl && (
            <Box
              sx={{
                position: 'relative',
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
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />

              {/* 遮罩层 */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
              <Box
                sx={{
                  position: 'absolute',
                  left: cropArea.x * scale,
                  top: cropArea.y * scale,
                  width: cropArea.width * scale,
                  height: cropArea.height * scale,
                  border: '2px solid white',
                  cursor: 'move',
                  boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
                }}
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
              >
                {/* 网格线 */}
                <Box sx={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
                  <Box sx={{ position: 'absolute', top: '33.33%', left: 0, right: 0, borderTop: '1px solid white' }} />
                  <Box sx={{ position: 'absolute', top: '66.66%', left: 0, right: 0, borderTop: '1px solid white' }} />
                  <Box sx={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, borderLeft: '1px solid white' }} />
                  <Box sx={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, borderLeft: '1px solid white' }} />
                </Box>

                {/* 调整手柄 */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    width: 12,
                    height: 12,
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    cursor: 'nw-resize',
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    handleMouseDown(e, 'resize');
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleReset} color="secondary">
          重置
        </Button>
        <Button onClick={onCancel}>
          取消
        </Button>
        <Button 
          onClick={handleCropConfirm} 
          variant="contained"
          sx={{
            backgroundColor: '#7E44C6',
            '&:hover': { backgroundColor: '#6D38B1' }
          }}
        >
          确认裁剪
        </Button>
      </DialogActions>
    </Dialog>
  );
};

