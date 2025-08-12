import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { type Comment } from './comment.type';

interface Props {
  isOpen: boolean;
  comment: Comment | null;
  onReply: (commentId: string, content: string) => void;
  onClose: () => void;
  currentUserName?: string;
  currentUserAvatar?: string;
}

export default function ReplyModal({ 
  isOpen, 
  comment, 
  onReply, 
  onClose, 
  currentUserName = '当前用户',
  currentUserAvatar = '/default-avatar.png'
}: Props) {
  const [replyContent, setReplyContent] = useState('');

  // 重置内容当弹窗关闭时
  useEffect(() => {
    if (!isOpen) {
      setReplyContent('');
    }
  }, [isOpen]);

  // 防止背景滚动，同时避免页面偏移
  useEffect(() => {
    if (isOpen) {
      // 获取滚动条宽度
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // 保存当前样式
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      
      // 禁止body滚动并补偿滚动条宽度
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
      
      return () => {
        // 恢复body样式
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (replyContent.trim() && comment) {
      onReply(comment.id, replyContent.trim());
      setReplyContent('');
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !comment) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 弹窗头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">回复@{comment.userName}</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 原评论内容 */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7E44C6' }}>
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
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 mb-1">{comment.userName}</div>
              <div className="text-sm text-gray-700 break-words">{comment.content}</div>
            </div>
          </div>
        </div>

        {/* 回复输入区域 */}
        <div className="p-4">
          <div className="flex space-x-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#7E44C6' }}>
              <img 
                src={currentUserAvatar} 
                alt={currentUserName} 
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.innerHTML = `<span class="text-white font-medium text-xs">${currentUserName[0]}</span>`;
                }}
              />
            </div>
            <div className="flex-1">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="发布你的回复..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none"

                onFocus={(e) => {
                  (e.target as HTMLElement).style.outline = `2px solid #7E44C6`;
        (e.target as HTMLElement).style.borderColor = 'transparent';
                }}
                onBlur={(e) => {
                  (e.target as HTMLElement).style.outline = 'none';
        (e.target as HTMLElement).style.borderColor = '#d1d5db';
                }}
                rows={4}
                maxLength={500}
                autoFocus
              />
            </div>
          </div>

          {/* 字数限制提示 */}
          {replyContent.length > 400 && (
            <div className="text-xs text-gray-500 mb-3 text-right">
              {replyContent.length}/500
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={!replyContent.trim()}
              className="px-4 py-2 text-white text-sm rounded-lg hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-opacity"
              style={{ backgroundColor: '#7E44C6' }}
            >
              回复
            </button>
          </div>

          {/* 快捷键提示 */}
          <div className="mt-3 text-xs text-gray-400 text-center">
            Ctrl + Enter 快速发布
          </div>
        </div>
      </div>
    </div>
  );

  // 使用 Portal 将模态框渲染到 document.body
  return createPortal(modalContent, document.body);
} 