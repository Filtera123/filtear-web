// 真实API测试组件

import React, { useState } from 'react';
import { uploadFile, downloadFile } from '@/api';

export const RealApiTest: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const testUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);
    setUploadResult(null);

    try {
      console.log('📋 开始测试真实API上传...');
      console.log('📁 文件信息:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const result = await uploadFile(file, {
        type: 'post-image',
        compress: true,
        onProgress: (progress) => {
          console.log(`📈 上传进度: ${progress}%`);
          setProgress(progress);
        }
      });

      console.log('📤 上传响应:', result);
      setUploadResult(result);

      if (result.code === 200) {
        console.log('✅ 上传成功!');
        console.log('🔑 OSS Key:', result.data?.key);
      } else {
        console.log('❌ 上传失败:', result.message);
        setError(result.message);
      }

    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '未知错误';
      console.error('💥 上传异常:', err);
      setError(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const testDownload = async (ossKey: string) => {
    try {
      console.log('📋 开始测试真实API下载...');
      console.log('🔑 OSS Key:', ossKey);

      const result = await downloadFile(ossKey);
      console.log('📥 下载响应:', result);

      if (result.code === 200) {
        console.log('✅ 下载链接获取成功!');
        console.log('🔗 下载URL:', result.data?.url);
        // 在新窗口打开下载链接
        if (result.data?.url) {
          window.open(result.data.url, '_blank');
        }
      } else {
        console.log('❌ 下载失败:', result.message);
        alert(`下载失败: ${result.message}`);
      }
    } catch (err) {
      console.error('💥 下载异常:', err);
      alert('下载异常，请查看控制台');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              <strong>真实API测试模式</strong><br />
              现在将直接连接后端API。请确保后端服务正在运行并且可以访问。
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-bold mb-4">🧪 文件上传API测试</h1>

        {/* 上传测试 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择文件进行上传测试
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) testUpload(file);
              }}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {/* 上传进度 */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上传中...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* 错误显示 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
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

          {/* 上传结果 */}
          {uploadResult && (
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">上传结果</h3>
              <pre className="text-xs text-gray-600 overflow-x-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
              
              {uploadResult.code === 200 && uploadResult.data?.key && (
                <div className="mt-3">
                  <button
                    onClick={() => testDownload(uploadResult.data.key)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    测试下载此文件
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* API配置信息 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">🔧 API配置信息</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div><strong>上传接口:</strong> POST /api/file/upload</div>
          <div><strong>下载接口:</strong> GET /api/file/download</div>
          <div><strong>认证Token:</strong> {localStorage.getItem('auth_token') ? '✅ 已设置' : '❌ 未设置'}</div>
        </div>
      </div>

      {/* 调试信息 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 调试提示</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 打开浏览器开发者工具查看网络请求</li>
          <li>• 检查控制台日志了解详细信息</li>
          <li>• 确保后端服务在正确的地址运行</li>
          <li>• 检查CORS配置和认证token</li>
        </ul>
      </div>
    </div>
  );
};

