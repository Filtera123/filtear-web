// 背景图上传组件（带裁剪功能）

import React, { useState } from 'react';
import { ImageCropModal } from './ImageCropModal';
import { uploadFile } from '../../api';
import { validateFile } from '../../utils/fileUtils';

interface BackgroundUploadProps {
  /** 当前背景图URL */
  currentBackground?: string;
  /** 上传成功回调 */
  onUploadSuccess: (backgroundUrl: string, ossKey: string) => void;
  /** 上传失败回调 */
  onUploadError?: (error: string) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 高度尺寸 */
  height?: string;
  /** 裁剪类型 */
  cropType?: 'background' | 'cover' | 'banner';
}

export const BackgroundUpload: React.FC<BackgroundUploadProps> = ({
  currentBackground,
  onUploadSuccess,
  onUploadError,
  className = '',
  disabled = false,
  height = '200px',
  cropType = 'background',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 文件选择处理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件
    const validation = validateFile(file, 'post-image');
    if (!validation.valid) {
      onUploadError?.(validation.error || '文件验证失败');
      return;
    }

    setSelectedFile(file);
    setIsCropModalOpen(true);
  };

  // 裁剪完成处理
  const handleCropComplete = async (croppedFile: File) => {
    setIsCropModalOpen(false);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadFile(croppedFile, {
        type: 'post-image',
        compress: false, // 已经裁剪过了，不需要再压缩
        onProgress: setUploadProgress,
      });

      if (result.code === 200 && result.data) {
        // 生成背景图URL（这里需要根据实际OSS配置调整）
        const backgroundUrl = `https://your-oss-domain.com${result.data.key}`;
        onUploadSuccess(backgroundUrl, result.data.key);
      } else {
        onUploadError?.(result.message || '上传失败');
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '上传异常';
      onUploadError?.(errorMsg);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setSelectedFile(null);
  };

  // 移除背景图
  const handleRemoveBackground = () => {
    onUploadSuccess('', '');
  };

  const cropTypeNames = {
    background: '背景图',
    cover: '封面图',
    banner: '横幅图',
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* 背景图显示区域 */}
      <div 
        className="relative w-full rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200"
        style={{ height }}
      >
        {currentBackground ? (
          <img
            src={currentBackground}
            alt={cropTypeNames[cropType]}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <p className="text-sm">点击上传{cropTypeNames[cropType]}</p>
            </div>
          </div>
        )}

        {/* 上传进度遮罩 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <div className="text-sm">上传中... {uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* 悬停效果 */}
        {!isUploading && !disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex space-x-4">
              <button
                onClick={() => document.getElementById(`bg-upload-${cropType}`)?.click()}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>更换</span>
              </button>
              
              {currentBackground && (
                <button
                  onClick={handleRemoveBackground}
                  className="bg-red-500 bg-opacity-70 hover:bg-opacity-90 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>移除</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 隐藏的文件选择输入框 */}
      <input
        id={`bg-upload-${cropType}`}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading || disabled}
      />

      {/* 上传按钮（无背景图时显示） */}
      {!currentBackground && !disabled && (
        <label
          htmlFor={`bg-upload-${cropType}`}
          className="absolute inset-0 cursor-pointer"
        />
      )}

      {/* 裁剪模态框 */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageFile={selectedFile}
        cropType={cropType}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

