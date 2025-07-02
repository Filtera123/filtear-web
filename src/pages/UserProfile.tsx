import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* 用户信息 */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center">
            <span className="text-white font-medium text-2xl">{userId?.[0]?.toUpperCase()}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{userId}</h1>
            <p className="text-gray-600">个人主页</p>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">文章</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">128</div>
            <div className="text-sm text-gray-600">关注者</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">45</div>
            <div className="text-sm text-gray-600">关注中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1.2k</div>
            <div className="text-sm text-gray-600">获赞</div>
          </div>
        </div>

        {/* 用户简介 */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">个人简介</h2>
          <p className="text-gray-700">
            这是 {userId} 的个人主页。在这里您可以查看TA的所有文章、关注列表和其他相关信息。
          </p>
        </div>

        {/* 返回按钮 */}
        <Link 
          to="/" 
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
    </div>
  );
} 