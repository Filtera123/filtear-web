import React, { useState } from 'react';
import { type Comment } from './comment.type';
import CommentItem from './CommentItem';
import ReplyModal from './ReplyModal';

interface Props {
  postId: string;
  comments: Comment[];
  onAddComment?: (postId: string, content: string) => void;
  onLikeComment?: (commentId: string) => void;
  onReplyComment?: (commentId: string, content: string) => void;
  onUserClick?: (userId: string) => void;
  onBlockComment?: (commentId: string) => void;
  onReportComment?: (commentId: string) => void;
  onBlockUser?: (userId: string) => void;
  onPostClick?: (postId: string) => void; // 修改：使用string类型保持一致
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  showAllComments?: boolean; // 新增：是否显示所有评论（详情页使用）
  hideCommentInput?: boolean; // 新增：是否隐藏评论输入框（用于固定评论输入框的场景）
}

// 递归计算评论总数（包括所有回复）
const getTotalCommentCount = (comments: Comment[]): number => {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
  }, 0);
};

// 限制评论显示数量（包括回复），返回截断后的评论列表
const limitComments = (
  comments: Comment[],
  maxCount: number
): { limitedComments: Comment[]; totalUsed: number } => {
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
      const { limitedComments: limitedReplies, totalUsed: repliesUsed } = limitComments(
        comment.replies,
        remainingCount
      );
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
  currentUserAvatar = '/default-avatar.png',
  showAllComments = false, // 默认不显示所有评论
  hideCommentInput = false, // 默认显示评论输入框
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

  // 根据showAllComments决定显示的评论数量
  const displayedComments = showAllComments 
    ? comments  // 详情页显示所有评论
    : limitComments(comments, 5).limitedComments;  // 主页显示限制数量
  const hasMoreComments = !showAllComments && totalCommentCount > 5;

  return (
    <div className="mt-4">
      {/* 新评论输入框 */}
      {!hideCommentInput && (
        <>
          <div className="mb-4">
            {/* 输入框和发送按钮 */}
            <div className="flex items-center space-x-2">
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

              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="写下你的评论..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-full outline-none focus:border-blue-500"
                maxLength={500}
              />

              <button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className={`px-3 py-2 text-sm rounded-full transition-colors ${
                  newComment.trim() 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                发送
              </button>
            </div>

            {/* 字数限制提示 */}
            {newComment.length > 400 && (
              <div className="text-xs text-gray-500 mt-1 text-right">{newComment.length}/500</div>
            )}
          </div>
        </>
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
            <div className="py-3 border-t border-gray-50">
              <button
                onClick={() => onPostClick?.(postId)}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center space-x-1"
              >
                <span>查看全部 {totalCommentCount} 条评论</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
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
