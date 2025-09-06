// 图片裁剪上传演示组件

import React, { useState } from 'react';
import { AvatarUpload } from './AvatarUpload';
import { BackgroundUpload } from './BackgroundUpload';
import { ImageCropModal } from './ImageCropModal';
import {
  uploadAvatarWithAutoCrop,
  uploadBackgroundWithAutoCrop,
  getSuggestedCropArea,
  cropOnly,
  type CropArea,
} from '../../api';

export const CropUploadDemo: React.FC = () => {
  // 头像状态
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarKey, setAvatarKey] = useState<string>('');

  // 背景图状态
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [backgroundKey, setBackgroundKey] = useState<string>('');

  // 手动裁剪状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [cropType, setCropType] = useState<'avatar' | 'background' | 'cover'>('avatar');

  // 智能裁剪状态
  const [isAutoUploading, setIsAutoUploading] = useState(false);
  const [autoUploadProgress, setAutoUploadProgress] = useState(0);

  // 错误状态
  const [error, setError] = useState<string>('');

  // 头像上传成功
  const handleAvatarUploadSuccess = (url: string, key: string) => {
    setAvatarUrl(url);
    setAvatarKey(key);
    setError('');
    console.log('头像上传成功:', { url, key });
  };

  // 背景图上传成功
  const handleBackgroundUploadSuccess = (url: string, key: string) => {
    setBackgroundUrl(url);
    setBackgroundKey(key);
    setError('');
    console.log('背景图上传成功:', { url, key });
  };

  // 上传错误处理
  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    console.error('上传失败:', errorMsg);
  };

  // 手动裁剪文件选择
  const handleManualCropFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'background' | 'cover'
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setCropType(type);
    setIsCropModalOpen(true);
    setError('');
  };

  // 手动裁剪完成
  const handleManualCropComplete = async (croppedFile: File) => {
    setIsCropModalOpen(false);
    console.log('裁剪完成:', {
      originalName: selectedFile?.name,
      croppedName: croppedFile.name,
      croppedSize: croppedFile.size,
    });
    
    // 这里可以继续上传裁剪后的文件
    alert(`裁剪完成！文件大小: ${(croppedFile.size / 1024).toFixed(1)}KB`);
    setSelectedFile(null);
  };

  // 智能头像上传
  const handleSmartAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAutoUploading(true);
    setAutoUploadProgress(0);
    setError('');

    try {
      const result = await uploadAvatarWithAutoCrop(file, (progress) => {
        setAutoUploadProgress(progress);
      });

      if (result.code === 200 && result.data) {
        const url = `https://your-oss-domain.com${result.data.key}`;
        setAvatarUrl(url);
        setAvatarKey(result.data.key);
        
        console.log('智能头像上传成功:', {
          key: result.data.key,
          originalSize: result.data.originalSize,
          croppedSize: result.data.croppedSize,
        });
        
        alert('智能头像上传成功！已自动裁剪为正方形。');
      } else {
        setError(result.message);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '智能上传失败';
      setError(errorMsg);
    } finally {
      setIsAutoUploading(false);
    }
  };

  // 智能背景图上传
  const handleSmartBackgroundUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAutoUploading(true);
    setAutoUploadProgress(0);
    setError('');

    try {
      const result = await uploadBackgroundWithAutoCrop(file, (progress) => {
        setAutoUploadProgress(progress);
      });

      if (result.code === 200 && result.data) {
        const url = `https://your-oss-domain.com${result.data.key}`;
        setBackgroundUrl(url);
        setBackgroundKey(result.data.key);
        
        console.log('智能背景图上传成功:', {
          key: result.data.key,
          originalSize: result.data.originalSize,
          croppedSize: result.data.croppedSize,
        });
        
        alert('智能背景图上传成功！已自动裁剪为16:9比例。');
      } else {
        setError(result.message);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : '智能上传失败';
      setError(errorMsg);
    } finally {
      setIsAutoUploading(false);
    }
  };

  // 预览裁剪区域
  const handlePreviewCrop = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const cropArea = await getSuggestedCropArea(file, 1); // 正方形
      console.log('建议的裁剪区域:', cropArea);
      
      const croppedFile = await cropOnly(file, cropArea, {
        outputWidth: 200,
        outputHeight: 200,
        outputQuality: 0.9,
      });
      
      const previewUrl = URL.createObjectURL(croppedFile);
      
      // 创建预览窗口
      const preview = window.open('', '_blank', 'width=400,height=400');
      if (preview) {
        preview.document.write(`
          <html>
            <head><title>裁剪预览</title></head>
            <body style="margin:0;padding:20px;text-align:center;">
              <h3>裁剪预览</h3>
              <img src="${previewUrl}" style="max-width:100%;border:1px solid #ccc;"/>
              <p>文件大小: ${(croppedFile.size / 1024).toFixed(1)}KB</p>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('预览失败:', error);
      alert('预览失败，请选择有效的图片文件');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🖼️ 图片裁剪上传演示</h1>
        <p className="text-gray-600">体验头像、背景图等不同场景的裁剪上传功能</p>
      </div>

      {/* 错误显示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">错误</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：组件化上传 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">📱 组件化上传</h2>

          {/* 头像上传 */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">头像上传（1:1 正方形）</h3>
            <div className="flex items-center space-x-4">
              <AvatarUpload
                currentAvatar={avatarUrl}
                onUploadSuccess={handleAvatarUploadSuccess}
                onUploadError={handleUploadError}
                size="lg"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  点击头像选择图片，自动打开裁剪框进行裁剪
                </p>
                {avatarKey && (
                  <p className="text-xs text-green-600">
                    ✅ OSS Key: {avatarKey}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 背景图上传 */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">背景图上传（16:9 横向）</h3>
            <BackgroundUpload
              currentBackground={backgroundUrl}
              onUploadSuccess={handleBackgroundUploadSuccess}
              onUploadError={handleUploadError}
              height="150px"
            />
            {backgroundKey && (
              <p className="text-xs text-green-600 mt-2">
                ✅ OSS Key: {backgroundKey}
              </p>
            )}
          </div>
        </div>

        {/* 右侧：API演示 */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">⚡ API演示</h2>

          {/* 智能上传 */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">智能自动裁剪</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  智能头像上传（自动裁剪为正方形）
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSmartAvatarUpload}
                  disabled={isAutoUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  智能背景图上传（自动裁剪为16:9）
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSmartBackgroundUpload}
                  disabled={isAutoUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
              </div>

              {isAutoUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>智能上传中...</span>
                    <span>{autoUploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${autoUploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 手动裁剪 */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">手动裁剪</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => document.getElementById('manual-avatar')?.click()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  裁剪头像（1:1）
                </button>
                
                <button
                  onClick={() => document.getElementById('manual-background')?.click()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  裁剪背景图（16:9）
                </button>

                <button
                  onClick={() => document.getElementById('manual-cover')?.click()}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  裁剪封面图（4:3）
                </button>
              </div>

              <input
                id="manual-avatar"
                type="file"
                accept="image/*"
                onChange={(e) => handleManualCropFileSelect(e, 'avatar')}
                className="hidden"
              />
              <input
                id="manual-background"
                type="file"
                accept="image/*"
                onChange={(e) => handleManualCropFileSelect(e, 'background')}
                className="hidden"
              />
              <input
                id="manual-cover"
                type="file"
                accept="image/*"
                onChange={(e) => handleManualCropFileSelect(e, 'cover')}
                className="hidden"
              />
            </div>
          </div>

          {/* 预览功能 */}
          <div className="border rounded-lg p-6 bg-white">
            <h3 className="text-lg font-medium mb-4">裁剪预览</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择图片预览裁剪效果
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePreviewCrop}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                会在新窗口显示裁剪预览，不会上传
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-6">
        <h3 className="text-lg font-medium text-blue-800 mb-3">📖 使用说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h4 className="font-medium mb-2">🎯 组件化上传</h4>
            <ul className="space-y-1">
              <li>• 头像：自动裁剪为1:1正方形，适合用户头像</li>
              <li>• 背景图：自动裁剪为16:9横向，适合页面背景</li>
              <li>• 支持拖拽调整裁剪区域和大小</li>
              <li>• 实时预览裁剪效果</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">⚡ API功能</h4>
            <ul className="space-y-1">
              <li>• 智能裁剪：自动计算最佳裁剪区域</li>
              <li>• 手动裁剪：自定义裁剪区域和比例</li>
              <li>• 预览功能：不上传，仅预览裁剪效果</li>
              <li>• 批量处理：支持多文件同时裁剪</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 裁剪模态框 */}
      <ImageCropModal
        isOpen={isCropModalOpen}
        imageFile={selectedFile}
        cropType={cropType}
        onCropComplete={handleManualCropComplete}
        onCancel={() => {
          setIsCropModalOpen(false);
          setSelectedFile(null);
        }}
      />
    </div>
  );
};

