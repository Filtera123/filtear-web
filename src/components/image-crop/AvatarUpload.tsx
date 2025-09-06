// 头像上传组件（带裁剪功能）

import React, { useState } from 'react';
import { ImageCropModal } from './ImageCropModal';
import { uploadFile } from '../../api';
import { validateFile } from '../../utils/fileUtils';

interface AvatarUploadProps {
  /** 当前头像URL */
  currentAvatar?: string;
  /** 上传成功回调 */
  onUploadSuccess: (avatarUrl: string, ossKey: string) => void;
  /** 上传失败回调 */
  onUploadError?: (error: string) => void;
  /** 自定义样式类名 */
  className?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 头像尺寸 */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onUploadSuccess,
  onUploadError,
  className = '',
  disabled = false,
  size = 'md',
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // 尺寸映射
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  // 文件选择处理
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件
    const validation = validateFile(file, 'avatar');
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
        type: 'avatar',
        compress: false, // 已经裁剪过了，不需要再压缩
        onProgress: setUploadProgress,
      });

      if (result.code === 200 && result.data) {
        // 生成头像URL（这里需要根据实际OSS配置调整）
        const avatarUrl = `https://your-oss-domain.com${result.data.key}`;
        onUploadSuccess(avatarUrl, result.data.key);
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

  return (
    <div className={`relative inline-block ${className}`}>
      {/* 头像显示区域 */}
      <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200`}>
        {currentAvatar ? (
          <img
            src={currentAvatar}
            alt="头像"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* 上传进度遮罩 */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-1"></div>
              <div className="text-white text-xs">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* 悬停效果 */}
        {!isUploading && !disabled && (
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* 文件选择按钮 */}
      {!disabled && (
        <label className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
        </label>
      )}

      {/* 裁剪模态框 */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageFile={selectedFile}
        cropType="avatar"
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
      />
    </div>
  );
};

