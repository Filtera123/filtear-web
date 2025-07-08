import React, { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useHomePostListStore } from '@/pages/home/Home.store.ts';
import { rootQueryClient } from '@/RootQuery.provider.tsx';
import CommentSection from '../comment/CommentSection';
import type { BasePost } from './post.types';

// 模拟点赞 API
const toggleLike = async (
  tweetId: string,
  isLiked: boolean
): Promise<{ success: boolean; likes: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 模拟偶尔的失败
  if (Math.random() < 0.1) {
    throw new Error('Failed to toggle like');
  }

  return {
    success: true,
    likes: isLiked ? Math.floor(Math.random() * 1000) + 1 : Math.floor(Math.random() * 1000),
  };
};

// 模拟转发 API
const toggleRetweet = async (
  tweetId: string,
  isRetweeted: boolean
): Promise<{ success: boolean; retweets: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  if (Math.random() < 0.1) {
    throw new Error('Failed to toggle retweet');
  }

  return {
    success: true,
    retweets: isRetweeted ? Math.floor(Math.random() * 100) + 1 : Math.floor(Math.random() * 100),
  };
};

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
  onPostClick?: (postId: number) => void;
  onHeightChange?: () => void;
}

// 格式化数字显示（如1.2k）
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function PostFooter({ post }: PostFooterProps) {
  const [showCommentSection, setShowCommentSection] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const { currentTab } = useHomePostListStore();

  // 点赞 mutation
  const likeMutation = useMutation({
    mutationFn: (isLiked: boolean) => toggleLike(post.id, isLiked),
    onMutate: async (isLiked) => {
      // 乐观更新
      await rootQueryClient.cancelQueries({ queryKey: ['tweets', currentTab] });

      const previousData = rootQueryClient.getQueryData(['tweets', currentTab]);

      rootQueryClient.setQueryData(['tweets', currentTab], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            list: page.list.map((t: BasePost) => {
              return t.id === post.id
                ? { ...t, isLike: isLiked, likes: isLiked ? t.likes + 1 : t.likes - 1 }
                : t;
            }),
          })),
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // 回滚乐观更新
      if (context?.previousData) {
        rootQueryClient.setQueryData(['tweets', currentTab], context.previousData);
      }
    },
    onSuccess: (data, isLiked) => {
      // 使用服务器返回的准确数据更新
      rootQueryClient.setQueryData(['tweets', currentTab], (old: any) => {
        if (!old) return old;

        // TODO: 前后端联调：更新帖子列表中的点赞状态

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            list: page.list.map((t: BasePost) => (t.id === post.id ? { ...t } : t)),
          })),
        };
      });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(!post.isLike);
  };

  return (
    <div className="flex justify-between flex-col border-t border-gray-100">
      {/* 底部交互按钮 */}
      <div className="flex items-center gap-6 pt-3  justify-between">
        <div className="flex items-center space-x-6 flex-1 justify-between">
          {/* 浏览量 */}
          <div className="flex items-center space-x-1 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-sm">{formatNumber(post.views || 0)}</span>
          </div>

          {/* 评论 */}
          <button
            onClick={() => {
              setShowCommentSection(!showCommentSection);
            }}
            disabled={isAnimating}
            className={`flex items-center space-x-1 transition-colors cursor-pointer ${
              showCommentSection ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
            } ${isAnimating ? 'opacity-70' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm">{formatNumber(post.comments)}</span>
          </button>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 cursor-pointer transition-colors"
          >
            {post.isLike ? (
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
            <span className="text-sm">{formatNumber(post.likes)}</span>
          </button>
        </div>
        <div>SC</div>
      </div>

      {/* 评论区 - 简化动画，只使用高度变化 */}
      <div
        ref={commentSectionRef}
        className="comment-section-container overflow-hidden transition-all duration-200 ease-out will-change-[max-height]"
        style={{
          maxHeight: showCommentSection ? '2000px' : '0px',
        }}
      >
        {(showCommentSection || isAnimating) && (
          <div className="pt-4">
            <CommentSection postId={post.id} comments={post.commentList || []} />
          </div>
        )}
      </div>
    </div>
  );
}
