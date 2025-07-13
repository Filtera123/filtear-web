import React, { useState } from 'react';
import { IconUser, IconUsers, IconHeart, IconEdit, IconSettings, IconUserPlus, IconUserMinus } from '@tabler/icons-react';
import type { UserProfileInfo } from '../UserProfile.types';

interface ProfileHeaderProps {
  userInfo: UserProfileInfo;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onEditProfile?: () => void;
  onAccountSettings?: () => void;
}

export default function ProfileHeader({ 
  userInfo, 
  isFollowing, 
  onToggleFollow, 
  onEditProfile, 
  onAccountSettings 
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBio, setEditingBio] = useState(userInfo.bio);

  const handleSaveBio = () => {
    // 这里应该调用API保存bio
    console.log('保存个性签名:', editingBio);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingBio(userInfo.bio);
    setIsEditing(false);
  };

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-start justify-between">
        {/* 左侧：用户基本信息 */}
        <div className="flex items-start space-x-4">
          {/* 头像 */}
          <div className="relative">
            <img
              src={userInfo.avatar}
              alt={userInfo.nickname}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-gray-100"
            />
            {userInfo.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* 用户名和基本信息 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-2xl font-bold text-gray-900 truncate">{userInfo.nickname}</h1>
              <span className="text-lg text-gray-500">{userInfo.username}</span>
            </div>
            
            {/* 统计数据 */}
            <div className="flex items-center space-x-6 mb-2">
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <IconUsers size={16} />
                <span>{formatNumber(userInfo.followerCount)} 关注者</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <IconUser size={16} />
                <span>{formatNumber(userInfo.followingCount)} 粉丝</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <IconHeart size={16} />
                <span>{formatNumber(userInfo.likeCount)} 热度</span>
              </div>
            </div>

            {/* IP 地址 */}
            <div className="text-sm text-gray-500 mb-2">
              IP: {userInfo.ipLocation}
            </div>

            {/* 个性签名 */}
            <div className="max-w-md">
              {isEditing ? (
                <div className="space-y-2">
                  <textarea
                    value={editingBio}
                    onChange={(e) => setEditingBio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                    rows={2}
                    placeholder="输入个性签名..."
                    maxLength={100}
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSaveBio}
                      className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">{userInfo.bio}</span>
                  {userInfo.isCurrentUser && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <IconEdit size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center space-x-3">
          {userInfo.isCurrentUser ? (
            // 自己的主页：显示编辑和设置按钮
            <>
              <button
                onClick={onEditProfile}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <IconEdit size={16} />
                <span>编辑个人资料</span>
              </button>
              <button
                onClick={onAccountSettings}
                className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <IconSettings size={16} />
                <span>账户设置</span>
              </button>
            </>
          ) : (
            // 他人的主页：显示关注/取消关注按钮
            <button
              onClick={onToggleFollow}
              className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                isFollowing
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isFollowing ? (
                <>
                  <IconUserMinus size={16} />
                  <span>取消关注</span>
                </>
              ) : (
                <>
                  <IconUserPlus size={16} />
                  <span>关注</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 