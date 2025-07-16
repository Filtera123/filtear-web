import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BasePost } from './post.types';
import { useReportContext } from '../report';

interface PostHeaderProps {
  post: BasePost;
}

// 格式化时间显示
const formatTime = (dateString: string): string => {
  const now = new Date();
  const postTime = new Date(dateString);
  const diffMs = now.getTime() - postTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return postTime.toLocaleDateString('zh-CN');
  }
};

export default function PostHeader({ post }: PostHeaderProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isFollowing, setIsFollowing] = useState(post.isFollowing);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openReportModal } = useReportContext();

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 处理用户名点击
  const handleUserClick = () => {
    navigate(`/user/${post.author}`);
  };

  // 处理关注按钮点击
  const handleFollowClick = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      // 这里可以添加API调用逻辑
      console.log(`关注用户: ${post.author}`);
    }
  };

  // 处理取消关注
  const handleUnfollowClick = () => {
    setIsFollowing(false);
    setShowMoreMenu(false);
    // 这里可以添加API调用逻辑
    console.log(`取消关注用户: ${post.author}`);
  };

  // 处理举报
  const handleReport = () => {
    console.log(`举报: ${post.id}`);
    setShowMoreMenu(false);
    // 使用举报模态窗口
    openReportModal(post.id, 'post', post.author);
  };

  // 处理屏蔽帖子 - 永久屏蔽这条特定的帖子（除非在屏蔽设置里解除）
  const handleBlockPost = () => {
    console.log(`屏蔽帖子: ${post.id}`);
    setShowMoreMenu(false);
    // TODO: 调用API将此帖子ID添加到用户的屏蔽帖子列表中
    // blockPostAPI(post.id);
  };

  // 处理屏蔽用户 - 屏蔽该用户的所有帖子
  const handleBlockUser = () => {
    console.log(`屏蔽用户: ${post.author}`);
    setShowMoreMenu(false);
    // TODO: 调用API将此用户添加到用户的屏蔽用户列表中
    // blockUserAPI(post.author);
  };

  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        {/* 用户名和时间 */}
        <div>
          <div
            className="font-medium text-gray-900 text-sm cursor-pointer hover:text-blue-600 transition-colors"
            onClick={handleUserClick}
          >
            {post.author}
          </div>
          <div className="text-gray-500 text-xs">{formatTime(post.createdAt)}</div>
        </div>
      </div>

      {/* 关注按钮和更多选项 */}
      <div className="flex items-center space-x-2">
        <button
          onClick={isFollowing ? undefined : handleFollowClick}
          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
            isFollowing
              ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer'
          }`}
          disabled={isFollowing}
        >
          {isFollowing ? '已关注' : '关注'}
        </button>

        {/* 更多选项按钮 */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </button>

          {/* 下拉菜单 */}
          {showMoreMenu && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              {isFollowing && (
                <button
                  onClick={handleUnfollowClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  取消关注
                </button>
              )}
              <button
                onClick={handleBlockPost}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                屏蔽帖子
              </button>
              <button
                onClick={handleBlockUser}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                屏蔽用户
              </button>
              <button
                onClick={handleReport}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                举报
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
