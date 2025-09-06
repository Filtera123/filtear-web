// 文件上传演示组件

import React, { useState } from 'react';
import {
  uploadFile,
  uploadAvatar,
  createImageUploader,
  createBatchUploader,
  validateFile,
  formatFileSize,
  type FilePreview,
} from '@/api';

interface UploadDemoProps {
  onUploadSuccess?: (key: string) => void;
}

export const FileUploadDemo: React.FC<UploadDemoProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 头像上传示例
  const handleAvatarUpload = async (file: File) => {
    // 先验证文件
    const validation = validateFile(file, 'avatar');
    if (!validation.valid) {
      setError(validation.error || '文件验证失败');
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadAvatar(file, (progress) => {
        setProgress(progress);
      });

      if (result.code === 200) {
        alert('头像上传成功！');
        onUploadSuccess?.(result.data?.key || '');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  // 批量图片上传示例
  const handleBatchImageUpload = async (files: File[]) => {
    const batchUploader = createBatchUploader({
      type: 'post-image',
      compress: true,
      quality: 0.8,
    });

    try {
      // 创建预览
      const previews = await batchUploader.createPreviews(files);
      setPreviews(previews);

      // 逐个上传
      const result = await batchUploader.uploadSequentially(
        files,
        {},
        (fileIndex, file, progress) => {
          // 更新对应文件的进度
          setPreviews(prev => prev.map((preview, index) => 
            index === fileIndex 
              ? { ...preview, progress, status: 'uploading' as const }
              : preview
          ));
        },
        (fileIndex, file, result) => {
          // 更新对应文件的状态
          setPreviews(prev => prev.map((preview, index) => 
            index === fileIndex 
              ? { 
                  ...preview, 
                  status: result.code === 200 ? 'success' as const : 'error' as const,
                  result: result.data,
                  error: result.code !== 200 ? result.message : undefined
                }
              : preview
          ));
        }
      );

      console.log('批量上传完成:', result);
    } catch (error) {
      console.error('批量上传失败:', error);
    }
  };

  // 单文件上传示例
  const handleSingleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const result = await uploadFile(file, {
        type: 'post-image',
        compress: true,
        quality: 0.9,
        onProgress: setProgress,
      });

      if (result.code === 200) {
        alert('文件上传成功！');
        console.log('上传结果:', result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-6">文件上传演示</h1>

      {/* 头像上传 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">头像上传</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleAvatarUpload(file);
            }}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="text-sm text-gray-600">
            支持 JPG、PNG 格式，最大 5MB
          </p>
        </div>
      </div>

      {/* 单文件上传 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">单文件上传</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleSingleFileUpload(file);
            }}
            disabled={isUploading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* 批量上传 */}
      <div className="border rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">批量图片上传</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (files.length > 0) handleBatchImageUpload(files);
            }}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          
          {/* 预览和进度 */}
          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div key={index} className="border rounded-lg p-2 space-y-2">
                  {preview.previewUrl && (
                    <img
                      src={preview.previewUrl}
                      alt={preview.file.name}
                      className="w-full h-24 object-cover rounded"
                    />
                  )}
                  <div className="text-xs">
                    <p className="truncate" title={preview.file.name}>
                      {preview.file.name}
                    </p>
                    <p className="text-gray-500">
                      {formatFileSize(preview.file.size)}
                    </p>
                  </div>
                  
                  {/* 状态显示 */}
                  {preview.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-purple-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${preview.progress}%` }}
                      />
                    </div>
                  )}
                  
                  {preview.status === 'success' && (
                    <p className="text-xs text-green-600">✓ 上传成功</p>
                  )}
                  
                  {preview.status === 'error' && (
                    <p className="text-xs text-red-600" title={preview.error}>
                      ✗ 上传失败
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
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
              <h3 className="text-sm font-medium text-red-800">上传失败</h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 头像上传：仅支持 JPG、PNG 格式，最大 5MB</li>
          <li>• 单文件上传：支持各种图片格式，会自动压缩</li>
          <li>• 批量上传：可选择多个图片文件，支持进度监控</li>
          <li>• 开发环境使用模拟API，生产环境需要配置真实后端</li>
        </ul>
      </div>
    </div>
  );
};
