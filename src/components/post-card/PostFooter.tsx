import React, { useState } from 'react';
import CommentSection from '../comment/CommentSection';
import type { BasePost } from './post.types';

interface PostFooterProps {
  post: BasePost;
  onLike?: (postId: number) => void;
  onAddComment?: (postId: number, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onUserClick?: (userId: string) => void;
  onBlockComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  onBlockUser?: (userId: string) => void;
}

// 格式化数字显示（如1.2k）
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function PostFooter({ 
  post, 
  onLike, 
  onAddComment, 
  onLikeComment, 
  onReplyComment, 
  onUserClick,
  onBlockComment,
  onReportComment,
  onBlockUser
}: PostFooterProps) {
  const [showCommentSection, setShowCommentSection] = useState(false);

  // 处理评论区展开收起
  const handleToggleComments = () => {
    console.log(`[评论区切换] 帖子 ${post.id} ${showCommentSection ? '收起' : '展开'}评论区`);
    setShowCommentSection(!showCommentSection);
  };

  const handleBlockComment = (commentId: string) => {
    onBlockComment?.(commentId);
    console.log('屏蔽评论:', commentId);
  };

  const handleReportComment = (commentId: string) => {
    onReportComment?.(commentId);
    console.log('举报评论:', commentId);
  };

  const handleBlockUser = (userId: string) => {
    onBlockUser?.(userId);
    console.log('屏蔽用户:', userId);
  };

  return (
    <>
      {/* 底部交互按钮 */}
      <div className="flex items-center space-x-6 pt-3 border-t border-gray-100">
        {/* 浏览量 */}
        <div className="flex items-center space-x-1 text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="text-sm">{formatNumber(post.views || 0)}</span>
        </div>

        {/* 点赞 */}
        <button 
          onClick={() => onLike?.(post.id)}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          {post.isLike ? (
            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span className="text-sm">{formatNumber(post.likes)}</span>
        </button>

        {/* 评论 */}
        <button 
          onClick={handleToggleComments}
          className={`flex items-center space-x-1 transition-colors ${
            showCommentSection 
              ? 'text-blue-500' 
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm">{formatNumber(post.comments)}</span>
        </button>
      </div>

      {/* 评论区 */}
      {showCommentSection && (
        <CommentSection
          postId={post.id}
          comments={post.commentList || []}
          onAddComment={onAddComment}
          onLikeComment={onLikeComment}
          onReplyComment={onReplyComment}
          onUserClick={onUserClick}
          onBlockComment={handleBlockComment}
          onReportComment={handleReportComment}
          onBlockUser={handleBlockUser}
        />
      )}
    </>
  );
} 