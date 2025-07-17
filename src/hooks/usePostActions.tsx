import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useHomePostListStore } from '@/pages/home/Home.store.ts';
import { rootQueryClient } from '@/RootQuery.provider.tsx';
import type { BasePost } from '@/components/post-card/post.types';
import type { Comment } from '@/components/comment/comment.type';

export const formatNumber = (num?: number): string => {
  if (typeof num !== 'number') return '0'; // 防御性处理
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 递归计算评论总数（包括所有回复）
const getTotalCommentCount = (comments: Comment[]): number => {
  return comments.reduce((count, comment) => {
    return count + 1 + (comment.replies ? getTotalCommentCount(comment.replies) : 0);
  }, 0);
};

// 模拟点赞 API
const toggleLike = async (
  postId: string,
  isLiked: boolean
): Promise<{ success: boolean; likes: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (Math.random() < 0.1) throw new Error('Failed to toggle like');
  return {
    success: true,
    likes: isLiked ? Math.floor(Math.random() * 1000) : Math.floor(Math.random() * 1000),
  };
};

export function usePostActions(post?: BasePost) {
  const { currentTab } = useHomePostListStore();
  const navigate = useNavigate();

  // ✅ 本地点赞
  const [isLike, setIsLike] = useState(post?.isLike ?? false);
  const [likes, setLikes] = useState(post?.likes ?? 0);

  // ✅ 本地关注状态
  const [isFollowing, setIsFollowing] = useState(post?.isFollowing ?? false);

  // ✅ 计算实际的评论总数
  const actualCommentCount = getTotalCommentCount(post?.commentList || []);

  const likeMutation = useMutation({
    mutationFn: (liked: boolean) => toggleLike(post?.id ?? '', liked),
    onMutate: async (liked) => {
      setIsLike(liked);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));

      await rootQueryClient.cancelQueries({ queryKey: ['tweets', currentTab] });

      const previousData = rootQueryClient.getQueryData(['tweets', currentTab]);

      rootQueryClient.setQueryData(['tweets', currentTab], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            list: page.list.map((t: BasePost) =>
              t.id === post?.id ? { ...t, isLike: liked, likes: liked ? t.likes + 1 : t.likes - 1 } : t
            ),
          })),
        };
      });

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      setIsLike(post?.isLike ?? false);
      setLikes(post?.likes ?? 0);
      if (context?.previousData) {
        rootQueryClient.setQueryData(['tweets', currentTab], context.previousData);
      }
    },
  });

  const handleLike = () => {
    likeMutation.mutate(!isLike);
  };

  // ✅ 关注/取关
  const handleFollow = () => {
    if (!isFollowing) {
      setIsFollowing(true);
      if (post?.author) {
        console.log(`关注用户: ${post.author}`);
      }
    }
  };

  const handleUnfollow = () => {
    setIsFollowing(false);
    if (post?.author) {
      console.log(`取消关注用户: ${post.author}`);
    }
  };

  // ✅ 点击作者头像或名字跳转
  const handleUserClick = () => {
    if (post?.author) {
      navigate(`/user/${post.author}`);
    }
  };

  // ✅ 举报/屏蔽
  const handleBlockUser = () => {
    if (post?.author) {
      console.log(`屏蔽用户: ${post.author}`);
    }
  };
  const handleReportUser = () => {
    if (post?.author) {
      console.log(`举报用户: ${post.author}`);
    }
  };
  const handleBlockPost = () => {
    if (post?.id) {
      console.log(`屏蔽帖子: ${post.id}`);
    }
  };
  const handleReportPost = () => {
    if (post?.id) {
      console.log(`举报帖子: ${post.id}`);
    }
  };

  return {
    likes,
    isLike,
    handleLike,
    comments: actualCommentCount,
    views: post?.views ?? 0,
    formatNumber,

    isFollowing,
    handleFollow,
    handleUnfollow,

    handleUserClick,
    handleBlockUser,
    handleReportUser,
    handleBlockPost,
    handleReportPost,
  };
}