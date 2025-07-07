import React, { useState } from 'react';
import CommentItem from './CommentItem';
import ReplyModal from './ReplyModal';
import { type Comment } from './comment.type';

interface Props {
  postId: number;
  comments: Comment[];
  onAddComment?: (postId: number, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onUserClick?: (userId: string) => void;
  onBlockComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  onBlockUser?: (userId: string) => void;
  onPostClick?: (postId: number) => void; // 新增：点击查看帖子详情的回调
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
}

// 递归计算评论总数（包括所有回复）
const getTotalCommentCount = (comments: Comment[]): number => {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
  }, 0);
};

// 限制评论显示数量（包括回复），返回截断后的评论列表
const limitComments = (comments: Comment[], maxCount: number): { limitedComments: Comment[], totalUsed: number } => {
  const result: Comment[] = [];
  let used = 0;
  
  for (const comment of comments) {
    if (used >= maxCount) break;
    
    // 创建评论副本
    const commentCopy: Comment = { ...comment, replies: [] };
    used++; // 当前评论占用1个名额
    
    // 如果还有剩余名额且有回复，递归处理回复
    if (used < maxCount && comment.replies && comment.replies.length > 0) {
      const remainingCount = maxCount - used;
      const { limitedComments: limitedReplies, totalUsed: repliesUsed } = limitComments(comment.replies, remainingCount);
      commentCopy.replies = limitedReplies;
      used += repliesUsed;
    }
    
    result.push(commentCopy);
  }
  
  return { limitedComments: result, totalUsed: used };
};

export default function CommentSection({ 
  postId, 
  comments, 
  onAddComment, 
  onLikeComment, 
  onReplyComment, 
  onUserClick,
  onBlockComment,
  onReportComment,
  onBlockUser,
  onPostClick,
  currentUserId,
  currentUserName = '当前用户',
  currentUserAvatar = '/default-avatar.png'
}: Props) {
  const [newComment, setNewComment] = useState('');
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyToComment, setReplyToComment] = useState<Comment | null>(null);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      onAddComment?.(postId, newComment.trim());
      setNewComment('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitComment();
    }
  };



  const handleReplyClick = (comment: Comment) => {
    setReplyToComment(comment);
    setReplyModalOpen(true);
  };

  const handleReplySubmit = (commentId: string, content: string) => {
    onReplyComment?.(commentId, content);
    setReplyModalOpen(false);
    setReplyToComment(null);
  };

  const handleReplyModalClose = () => {
    setReplyModalOpen(false);
    setReplyToComment(null);
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

  // 计算总评论数（包括所有回复）
  const totalCommentCount = getTotalCommentCount(comments);
  
  // 限制显示的评论数量
  const displayedComments = limitComments(comments, 5).limitedComments;
  const hasMoreComments = totalCommentCount > 5;

        return (
    <div className="mt-4">

      {/* 新评论输入框 */}
      <div className="flex space-x-3 mb-4">
        {/* 当前用户头像 */}
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
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

        {/* 输入框和发送按钮 */}
        <div className="flex-1 flex space-x-2">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="写下你的评论..."
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
            maxLength={500}
          />
          <button
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors self-end"
          >
            发送
          </button>
        </div>
      </div>

      {/* 字数限制提示 */}
      {newComment.length > 400 && (
        <div className="text-xs text-gray-500 mb-2 text-right">
          {newComment.length}/500
        </div>
      )}

              {/* 评论列表 */}
        {comments.length > 0 && (
          <div className="border-t border-gray-100">
            {/* 显示评论列表 */}
            {displayedComments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onLike={onLikeComment}
                onReply={onReplyComment}
                onReplyClick={handleReplyClick}
                onUserClick={onUserClick}
                onBlockComment={handleBlockComment}
                onReportComment={handleReportComment}
                onBlockUser={handleBlockUser}
                level={0}
              />
            ))}
            
            {/* 查看帖子详情按钮 */}
            {hasMoreComments && (
              <div className="py-3 text-center border-t border-gray-50">
                <button 
                  onClick={() => onPostClick?.(postId)}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>查看全部 {totalCommentCount} 条评论</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 无评论提示 */}
        {comments.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
            暂无评论，快来发表第一条评论吧！
          </div>
        )}

        {/* 回复弹窗 */}
        <ReplyModal
          isOpen={replyModalOpen}
          comment={replyToComment}
          onReply={handleReplySubmit}
          onClose={handleReplyModalClose}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
        />
    </div>
  );
} 