import { create } from 'zustand';
import type { ArticleItem } from './article-editor/use-article-editor';

export interface DraftStore {
  drafts: ArticleItem[];
  setDraft: (draft: ArticleItem[]) => void;
  addDraft: (article: ArticleItem) => void;
  deleteDraft: (articleId: string) => void;
  updateDraft: (article: ArticleItem) => void;
  clearDraft: () => void;
}

export const useDraftStore = create<DraftStore>((set) => ({
  drafts: [],
  setDraft: (drafts) => set({ drafts }),
  addDraft: (article) => set((state) => ({ drafts: [...state.drafts, article] })),
  deleteDraft: (articleId) =>
    set((state) => ({
      drafts: state.drafts.filter((article) => article.id !== articleId),
    })),
  updateDraft: (article) =>
    set((state) => ({
      drafts: state.drafts.map((draftArticle) =>
        draftArticle.id === article.id ? { ...draftArticle, ...article } : draftArticle
      ),
    })),
  clearDraft: () => set({ drafts: [] }),
}));
