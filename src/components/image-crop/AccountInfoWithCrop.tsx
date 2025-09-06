// 集成裁剪功能的用户设置页面示例

import React, { useState } from 'react';
import { AvatarUpload, BackgroundUpload } from './index';

export const AccountInfoWithCrop: React.FC = () => {
  // 用户信息状态
  const [userInfo, setUserInfo] = useState({
    avatar: '',
    avatarKey: '',
    background: '',
    backgroundKey: '',
    nickname: '用户昵称',
    bio: '这是一段个人简介...',
    email: 'user@example.com',
    phone: '+86 138 0013 8000',
  });

  // 错误状态
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // 头像上传成功
  const handleAvatarUploadSuccess = (url: string, key: string) => {
    setUserInfo(prev => ({
      ...prev,
      avatar: url,
      avatarKey: key,
    }));
    setSuccess('头像更新成功！');
    setError('');
    
    // 这里可以调用API保存到后端
    console.log('保存头像到后端:', key);
  };

  // 背景图上传成功
  const handleBackgroundUploadSuccess = (url: string, key: string) => {
    setUserInfo(prev => ({
      ...prev,
      background: url,
      backgroundKey: key,
    }));
    setSuccess('背景图更新成功！');
    setError('');
    
    // 这里可以调用API保存到后端
    console.log('保存背景图到后端:', key);
  };

  // 上传错误处理
  const handleUploadError = (errorMsg: string) => {
    setError(errorMsg);
    setSuccess('');
  };

  // 保存其他信息
  const handleSaveInfo = () => {
    // 这里可以调用API保存昵称、简介等信息
    setSuccess('个人信息保存成功！');
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* 背景图区域 */}
        <div className="relative">
          <BackgroundUpload
            currentBackground={userInfo.background}
            onUploadSuccess={handleBackgroundUploadSuccess}
            onUploadError={handleUploadError}
            height="200px"
            className="rounded-t-lg"
          />
          
          {/* 头像区域 - 覆盖在背景图上 */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <AvatarUpload
                currentAvatar={userInfo.avatar}
                onUploadSuccess={handleAvatarUploadSuccess}
                onUploadError={handleUploadError}
                size="xl"
                className="border-4 border-white shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* 用户信息表单 */}
        <div className="pt-20 p-6">
          {/* 成功/错误消息 */}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">基本信息</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  昵称
                </label>
                <input
                  type="text"
                  value={userInfo.nickname}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人简介
                </label>
                <textarea
                  value={userInfo.bio}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* 联系信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">联系方式</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号码
                </label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 保存按钮 */}
          <div className="flex justify-end mt-6 pt-6 border-t">
            <button
              onClick={handleSaveInfo}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              保存更改
            </button>
          </div>
        </div>
      </div>

      {/* 图片信息显示（调试用） */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">🔧 调试信息</h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div><strong>头像Key:</strong> {userInfo.avatarKey || '未设置'}</div>
          <div><strong>背景图Key:</strong> {userInfo.backgroundKey || '未设置'}</div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">📖 使用说明</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 点击头像或背景图区域可以上传新图片</li>
          <li>• 图片会自动打开裁剪框，可以拖拽调整裁剪区域</li>
          <li>• 头像会自动裁剪为正方形，背景图裁剪为16:9比例</li>
          <li>• 裁剪完成后会自动上传到服务器</li>
        </ul>
      </div>
    </div>
  );
};

