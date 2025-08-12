import { useState } from 'react';
import { Popover } from '@chakra-ui/react';
import { type Comment } from './comment.type';
import { useReportContext } from '../report';
import { getSimpleLocation } from '@/utils/ipLocation';

interface Props {
  comment: Comment;
  onLike?: (commentId: string) => void;
  onReply?: (commentId: string, content: string) => void;
  onReplyClick?: (comment: Comment) => void; // 新增：点击回复按钮的回调
  onUserClick?: (userId: string) => void;
  onBlockComment?: (commentId: string) => void; // 新增：屏蔽评论
  onReportComment?: (commentId: string) => void; // 新增：举报评论
  onBlockUser?: (userId: string) => void; // 新增：屏蔽用户
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

export default function CommentItem({ 
  comment, 
  onLike, 
  onReply, 
  onReplyClick, 
  onUserClick, 
  onBlockComment,
  onReportComment,
  onBlockUser,
  level = 0 
}: Props) {
  const maxLevel = 2; // 最大嵌套层级
  const marginLeft = Math.min(level, maxLevel) * 20; // 每层缩进20px，最多2层
  const { openReportModal } = useReportContext();
  const [showReplies, setShowReplies] = useState(false); // 新增：控制回复显示状态

  const handleMenuAction = (action: 'block' | 'report') => {
    
    switch (action) {
      case 'block':
        // 屏蔽该条特定评论
        console.log(`屏蔽评论: ${comment.id}`);
        onBlockComment?.(comment.id);
        break;
      case 'report':
        console.log(`举报评论: ${comment.id}`);
        // 使用举报模态窗口
        openReportModal(comment.id, 'comment', comment.userId);
        onReportComment?.(comment.id);
        break;
    }
  };

  return (
    <div className="py-2" style={{ marginLeft: `${marginLeft}px` }}>
      <div className="flex space-x-3">
        {/* 用户头像 */}
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:opacity-90 transition-all flex-shrink-0"
          style={{ backgroundColor: '#7E44C6' }}
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
              className="font-medium text-sm text-gray-900 cursor-pointer hover:opacity-80 transition-opacity"
              style={{ color: '#7E44C6' }}
              onClick={() => onUserClick?.(comment.userId)}
            >
              {comment.userName}
            </span>
            <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
            {comment.userIpLocation && (
              <span className="text-xs text-gray-400">
                {getSimpleLocation(comment.userIpLocation)}
              </span>
            )}
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
                className="text-xs text-gray-500 hover:opacity-80 transition-opacity"

                onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#7E44C6'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#6b7280'}
              >
                回复
              </button>
            )}

            {/* 更多操作按钮 */}
            <Popover.Root 
              positioning={{ 
                placement: 'bottom-end',
                strategy: 'absolute'
              }}
              modal={false}
            >
              <Popover.Trigger asChild>
                <button 
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded"
                  title="更多操作"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </Popover.Trigger>
              
              <Popover.Positioner>
                <Popover.Content 
                  className="bg-white border-[0.5px] border-gray-200 rounded-lg shadow-lg py-1"
                  style={{ zIndex: 9999, width: '60px', minWidth: '60px', maxWidth: '60px' }}
                >
                  <button
                    onClick={() => handleMenuAction('block')}
                    className="w-full px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    屏蔽
                  </button>
                  <button
                    onClick={() => handleMenuAction('report')}
                    className="w-full px-2 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    举报
                  </button>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </div>
        </div>
      </div>

      {/* 递归渲染回复 */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-1.5">
          {/* 始终显示第一条回复 */}
          <CommentItem
            key={comment.replies[0].id}
            comment={comment.replies[0]}
            onLike={onLike}
            onReply={onReply}
            onReplyClick={onReplyClick}
            onUserClick={onUserClick}
            onBlockComment={onBlockComment}
            onReportComment={onReportComment}
            onBlockUser={onBlockUser}
            level={level + 1}
          />

          {/* 如果有多条回复，显示展开/折叠按钮和剩余回复 */}
          {comment.replies.length > 1 && (
            <>
              {/* 展开/折叠剩余回复按钮 */}
              <button 
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center space-x-1 text-xs hover:opacity-80 transition-opacity mb-2 ml-8"
                style={{ color: '#7E44C6' }}
              >
                <svg 
                  className={`w-3 h-3 transform transition-transform ${showReplies ? 'rotate-90' : 'rotate-0'}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span>
                  {showReplies ? '收起' : '展开'}剩余 {comment.replies.length - 1} 条回复
                </span>
              </button>

              {/* 剩余回复列表 */}
              {showReplies && (
                <div>
                  {comment.replies.slice(1).map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      onLike={onLike}
                      onReply={onReply}
                      onReplyClick={onReplyClick}
                      onUserClick={onUserClick}
                      onBlockComment={onBlockComment}
                      onReportComment={onReportComment}
                      onBlockUser={onBlockUser}
                      level={level + 1}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 