import { create } from 'zustand';
import type { ArticleItem } from './article-editor/use-article-editor';

const initArticle: ArticleItem = {
  title: '',
  summary: '',
  contentItems: [],
};

export interface ArticleEditorStore {
  article: ArticleItem;
  setArticle: (article: ArticleItem) => void;
  updateArticle: (article: ArticleItem) => void;
  clearArticle: () => void;
}

export const useArticleEditorStore = create<ArticleEditorStore>((set) => ({
  article: initArticle,
  setArticle: (article) =>
    set({
      article,
    }),
  updateArticle: (article) =>
    set((state) => ({
      article: {
        ...state.article,
        ...article,
      },
    })),
  clearArticle: () => set({ article: initArticle }),
}));
