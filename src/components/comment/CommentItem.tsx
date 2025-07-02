import React from 'react';
import { type Comment } from './comment.type';

interface Props {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onReplyClick?: (comment: Comment) => void; // 新增：点击回复按钮的回调
  onUserClick?: (userId: string) => void;
  level?: number; // 嵌套层级，用于控制缩进
}

// 格式化时间显示
const formatTime = (dateString: string): string => {
  const now = new Date();
  const commentTime = new Date(dateString);
  const diffMs = now.getTime() - commentTime.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
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
    return commentTime.toLocaleDateString('zh-CN');
  }
};

// 格式化数字显示
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function CommentItem({ comment, onLike, onReply, onReplyClick, onUserClick, level = 0 }: Props) {
  const maxLevel = 2; // 最大嵌套层级
  const marginLeft = Math.min(level, maxLevel) * 20; // 每层缩进20px，最多2层

  return (
    <div className="py-2" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="flex space-x-3">
        {/* 用户头像 */}
        <div 
          className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all flex-shrink-0"
          onClick={() => onUserClick?.(comment.userId)}
        >
          <img 
            src={comment.userAvatar} 
            alt={comment.userName} 
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = `<span class="text-white font-medium text-xs">${comment.userName[0]}</span>`;
            }}
          />
        </div>

        {/* 评论内容 */}
        <div className="flex-1 min-w-0">
          {/* 用户名和时间 */}
          <div className="flex items-center space-x-2 mb-1">
            <span 
              className="font-medium text-sm text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onUserClick?.(comment.userId)}
            >
              {comment.userName}
            </span>
            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
          </div>

          {/* 评论文本 */}
          <div className="text-sm text-gray-800 mb-1.5 break-words">
            {comment.content}
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-4">
            {/* 点赞按钮 */}
            <button 
              onClick={() => onLike?.(comment.id)}
              className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
            >
              {comment.isLiked ? (
                <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
              {comment.likes > 0 && (
                <span className="text-xs">{formatNumber(comment.likes)}</span>
              )}
            </button>

            {/* 回复按钮 */}
            {level < maxLevel && (
              <button 
                onClick={() => onReplyClick?.(comment)}
                className="text-xs text-gray-500 hover:text-blue-500 transition-colors"
              >
                回复
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 递归渲染回复 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1.5">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onReplyClick={onReplyClick}
              onUserClick={onUserClick}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
} 