import React, { useState, useRef, useEffect } from 'react';
import { Popover } from '@chakra-ui/react';
import { IconUser, IconUsers, IconHeart, IconEdit, IconSettings, IconUserPlus, IconUserMinus, IconChevronLeft, IconUserX, IconFlag } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { useReportContext } from '../../components/report';
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
  const navigate = useNavigate();
  const { openReportModal } = useReportContext();

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

  // 返回上一页
  const handleGoBack = () => {
    navigate(-1);
  };

  // 处理举报用户
  const handleReportUser = () => {
    console.log(`举报用户: ${userInfo.id}`);
    openReportModal(userInfo.id, 'user', userInfo.id);
  };

  // 处理屏蔽用户
  const handleBlockUser = () => {
    console.log(`屏蔽用户: ${userInfo.id}`);
    // TODO: 调用API屏蔽用户
  };

  return (
    <div className="relative">
      {/* 背景图片 */}
      <div 
        className="w-full h-96 bg-cover bg-center" 
        style={{ 
          backgroundImage: `url(https://picsum.photos/id/${Math.floor(Math.random() * 100)}/1200/400)`,
          boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.3)'
        }}
      >
        {/* 返回按钮 */}
        <button 
          onClick={handleGoBack} 
          className="absolute top-4 left-4 bg-white/80 hover:bg-white text-gray-700 py-1 px-3 rounded-full transition-colors flex items-center"
        >
          <IconChevronLeft size={20} />
          <span className="ml-1 font-medium">返回</span>
        </button>
      </div>

      <div className="bg-white border-b border-gray-200 px-6 pt-4 pb-6">
        {/* 用户信息行 */}
        <div className="flex items-center py-2">
          {/* 头像 */}
          <div className="relative">
            <img
              src={userInfo.avatar}
              alt={userInfo.nickname}
              className="w-20 h-20 rounded-full object-cover ring-2 ring-white border border-gray-200"
            />
            {userInfo.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>

          {/* 用户名和基本信息 - 在头像右侧 */}
          <div className="ml-4 flex-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900 truncate">{userInfo.nickname}</h1>
              <span className="text-base text-gray-500">{userInfo.username}</span>
            </div>
          </div>
        </div>
        
        {/* 统计数据等内容移到背景图下方 */}
        <div className="flex items-start justify-between">
          {/* 左侧：用户基本信息 */}
          <div className="flex-1 min-w-0">
            {/* 粉丝和关注等数据 */}
            <div className="flex items-center space-x-6 mb-3">
              <button 
                onClick={() => navigate(`/user/${userInfo.id}/followers`)}
                className="flex flex-col items-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="font-semibold text-lg">{formatNumber(userInfo.followerCount)}</span>
                <span className="text-sm text-gray-500">关注者</span>
              </button>
              <button 
                onClick={() => navigate(`/user/${userInfo.id}/following`)}
                className="flex flex-col items-center hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <span className="font-semibold text-lg">{formatNumber(userInfo.followingCount)}</span>
                <span className="text-sm text-gray-500">粉丝</span>
              </button>
              <div className="flex flex-col items-center px-3 py-2">
                <span className="font-semibold text-lg">{formatNumber(userInfo.likeCount)}</span>
                <span className="text-sm text-gray-500">热度</span>
              </div>
            </div>

            {/* 个性签名和IP信息 */}
            <div className="space-y-2">
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
              
              {/* IP 地址 */}
              <div className="text-xs text-gray-500">
                IP: {userInfo.ipLocation}
              </div>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-2">
            {userInfo.isCurrentUser ? (
              // 自己的主页：显示编辑资料按钮
              <button
                onClick={onEditProfile}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white/90 text-gray-700 rounded-full text-sm hover:bg-white transition-colors"
              >
                <IconEdit size={14} />
                <span>编辑资料</span>
              </button>
            ) : (
              // 他人的主页：显示关注/取消关注按钮
              <button
                onClick={onToggleFollow}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm transition-colors ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? (
                  <span>已关注</span>
                ) : (
                  <span>关注</span>
                )}
              </button>
            )}
            
            {/* 更多选项按钮 - 只在查看别人的主页时显示 */}
            {!userInfo.isCurrentUser && (
              <Popover.Root 
                positioning={{ 
                  placement: 'bottom-end',
                  strategy: 'absolute'
                }}
                modal={false}
              >
                <Popover.Trigger asChild>
                  <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    </svg>
                  </button>
                </Popover.Trigger>

                <Popover.Positioner>
                  <Popover.Content 
                    className="bg-white rounded-lg shadow-lg border-[0.5px] border-gray-200 py-1"
                    style={{ zIndex: 9999, width: '70px', minWidth: '70px', maxWidth: '70px' }}
                  >
                    <button
                      onClick={handleBlockUser}
                      className="w-full flex items-center space-x-1 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconUserX size={14} />
                      <span>屏蔽</span>
                    </button>
                    <button
                      onClick={handleReportUser}
                      className="w-full flex items-center space-x-1 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconFlag size={14} />
                      <span>举报</span>
                    </button>
                  </Popover.Content>
                </Popover.Positioner>
              </Popover.Root>
            )}
          </div>
        </div>




      </div>
    </div>
  );
} 