import { create } from 'zustand';
import type { 
  TagPageState, 
  TagPageTab, 
  LatestSubTab, 
  HotSubTab, 
  ContentFilter, 
  TagDetail,
  TAG_PAGE_TABS,
  LATEST_SUB_TABS,
  HOT_SUB_TABS,
  CONTENT_FILTERS 
} from './TagPage.types';

interface TagPageStore extends TagPageState {
  // Actions
  setCurrentTab: (tab: TagPageTab) => void;
  setCurrentLatestSubTab: (subTab: LatestSubTab) => void;
  setCurrentHotSubTab: (subTab: HotSubTab) => void;
  setCurrentContentFilter: (filter: ContentFilter) => void;
  setTagDetail: (tag: TagDetail | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // 订阅/取消订阅标签
  toggleSubscription: () => void;
  
  // 屏蔽/取消屏蔽标签
  toggleBlock: () => void;
  
  // 重置状态
  resetState: () => void;
}

const initialState: TagPageState = {
  currentTab: 'latest',
  currentLatestSubTab: 'latest_publish',
  currentHotSubTab: 'daily',
  currentContentFilter: 'all',
  tagDetail: null,
  isLoading: false,
};

export const useTagPageStore = create<TagPageStore>((set) => ({
  ...initialState,
  
  setCurrentTab: (tab) => set(() => ({
    currentTab: tab,
  })),
  
  setCurrentLatestSubTab: (subTab) => set(() => ({
    currentLatestSubTab: subTab,
  })),
  
  setCurrentHotSubTab: (subTab) => set(() => ({
    currentHotSubTab: subTab,
  })),
  
  setCurrentContentFilter: (filter) => set(() => ({
    currentContentFilter: filter,
  })),
  
  setTagDetail: (tag) => set(() => ({
    tagDetail: tag,
  })),
  
  setIsLoading: (loading) => set(() => ({
    isLoading: loading,
  })),
  
  toggleSubscription: () => set((state) => ({
    tagDetail: state.tagDetail ? {
      ...state.tagDetail,
      isSubscribed: !state.tagDetail.isSubscribed,
    } : null,
  })),
  
  toggleBlock: () => set((state) => ({
    tagDetail: state.tagDetail ? {
      ...state.tagDetail,
      isBlocked: !state.tagDetail.isBlocked,
    } : null,
  })),
  
  resetState: () => set(() => ({
    ...initialState,
  })),
})); 