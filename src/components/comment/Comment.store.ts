import { create } from 'zustand';
import { type Comment } from './comment.type';

interface CommentStoreState {
  expandedComments: Record<string, boolean>;
  comments: Record<string, Comment[]>; // 存储每个帖子的评论数据
  toggleComments: (postId: string) => void;
  setComments: (postId: string, comments: Comment[]) => void;
  toggleCommentLike: (postId: string, commentId: string) => void;
  addComment: (postId: string, comment: Comment) => void;
}

// 递归更新评论或回复的点赞状态
const updateCommentLike = (comments: Comment[], commentId: string): Comment[] => {
  return comments.map(comment => {
    if (comment.id === commentId) {
      return {
        ...comment,
        isLiked: !comment.isLiked,
        likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
      };
    }
    if (comment.replies) {
      return {
        ...comment,
        replies: updateCommentLike(comment.replies, commentId)
      };
    }
    return comment;
  });
};

export const useCommentStore = create<CommentStoreState>((set, get) => ({
  expandedComments: {},
  comments: {},
  
  toggleComments: (postId) =>
    set((state) => ({
      expandedComments: {
        ...state.expandedComments,
        [postId]: !state.expandedComments[postId],
      },
    })),
    
  setComments: (postId, comments) =>
    set((state) => ({
      comments: {
        ...state.comments,
        [postId]: comments,
      },
    })),
    
  toggleCommentLike: (postId, commentId) =>
    set((state) => {
      const postComments = state.comments[postId] || [];
      const updatedComments = updateCommentLike(postComments, commentId);
      
      return {
        comments: {
          ...state.comments,
          [postId]: updatedComments,
        },
      };
    }),
    
  addComment: (postId, comment) =>
    set((state) => {
      const postComments = state.comments[postId] || [];
      
      return {
        comments: {
          ...state.comments,
          [postId]: [...postComments, comment],
        },
      };
    }),
}));
