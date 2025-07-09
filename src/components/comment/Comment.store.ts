import { create } from 'zustand';

interface CommentStoreState {
  expandedComments: Record<string, boolean>;
  toggleComments: (postId: string) => void;
}

export const useCommentStore = create<CommentStoreState>((set) => ({
  expandedComments: {},
  toggleComments: (postId) =>
    set((state) => ({
      expandedComments: {
        ...state.expandedComments,
        [postId]: !state.expandedComments[postId],
      },
    })),
}));
