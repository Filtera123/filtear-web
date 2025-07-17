import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { BaseNotification } from '../../mocks/notifications/data';
import { Image } from '../ui';

// 格式化时间显示
const formatTime = (dateString: string): string => {
  const now = new Date();
  const time = new Date(dateString);
  const diffMs = now.getTime() - time.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return time.toLocaleDateString('zh-CN');
  }
};

// 获取帖子显示标题
const getPostTitle = (post: any): string => {
  if (post.title) {
    return post.title;
  }
  if (post.content) {
    return post.content.slice(0, 20) + (post.content.length > 20 ? '...' : '');
  }
  return `${post.type === 'image' ? '图片' : post.type === 'video' ? '视频' : '动态'}内容`;
};

interface NotificationItemProps {
  notification: BaseNotification;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (notification.user) {
      navigate(`/user/${notification.user.id}`);
    }
  };

  const handlePostClick = () => {
    if (notification.post) {
      navigate(`/post/${notification.post.id}`);
    }
  };

  const getActionText = () => {
    switch (notification.type) {
      case 'like':
        return '赞了你的';
      case 'comment':
        return '评论了你的';
      case 'follow':
        return '关注了你';
      case 'system':
        return '';
      default:
        return '';
    }
  };

  if (notification.type === 'system') {
    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div className="flex-1">
          <div className="font-medium text-gray-900 mb-1">系统通知</div>
          <div className="text-gray-700 text-sm leading-relaxed">
            {notification.content}
          </div>
          <div className="text-gray-500 text-xs mt-2">
            {formatTime(notification.createdAt)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100">
      {/* 用户头像 */}
      <div 
        className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
        onClick={handleUserClick}
      >
        {notification.user?.avatar ? (
          <Image 
            src={notification.user.avatar} 
            alt={notification.user.name}
            className="w-full h-full object-cover"
            fallbackSrc={`https://via.placeholder.com/40x40?text=${notification.user?.name?.[0] || '?'}`}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-xs">
              {notification.user?.name?.[0] || '?'}
            </span>
          </div>
        )}
      </div>

      {/* 消息内容 */}
      <div className="flex-1">
        <div className="text-sm text-gray-700 leading-relaxed">
          <span 
            className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
            onClick={handleUserClick}
          >
            {notification.user?.name}
          </span>
          <span className="mx-1">{getActionText()}</span>
          {notification.post && (
            <span className="text-gray-700">
              {notification.post.type === 'article' ? '文章' : 
               notification.post.type === 'image' ? '图片' :
               notification.post.type === 'video' ? '视频' : '动态'}
            </span>
          )}
        </div>

        {/* 帖子信息 */}
        {notification.post && (
          <div 
            className="mt-2 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={handlePostClick}
          >
            <div className="flex items-start space-x-3">
              {notification.post.image && (
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={notification.post.image} 
                    alt="帖子图片"
                    className="w-full h-full object-cover"
                    fallbackText="帖子图片"
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="font-medium text-gray-900 text-sm mb-1">
                  {getPostTitle(notification.post)}
                </div>
                {notification.post.content && (
                  <div className="text-gray-600 text-xs line-clamp-2">
                    {notification.post.content}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 评论内容 */}
        {notification.type === 'comment' && notification.content && (
          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
            <div className="text-gray-700 text-sm">
              "{notification.content}"
            </div>
          </div>
        )}

        {/* 时间 */}
        <div className="text-gray-500 text-xs mt-2">
          {formatTime(notification.createdAt)}
        </div>
      </div>
    </div>
  );
} 