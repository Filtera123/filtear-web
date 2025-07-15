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
  CONTENT_FILTERS,
  ViewMode 
} from './TagPage.types';
import { VIEW_MODES } from './TagPage.types';

interface TagPageStore extends TagPageState {
  // Actions
  setCurrentTab: (tab: TagPageTab) => void;
  setCurrentLatestSubTab: (subTab: LatestSubTab) => void;
  setCurrentHotSubTab: (subTab: HotSubTab) => void;
  setCurrentContentFilter: (filter: ContentFilter) => void;
  setViewMode: (mode: ViewMode) => void;
  setTagDetail: (tag: TagDetail | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // 订阅/取消订阅标签
  toggleSubscription: () => void;
  
  // 屏蔽/取消屏蔽标签
  toggleBlock: () => void;
  
  // 重置状态
  resetState: () => void;
}

// 从localStorage获取保存的视图模式，如果没有则使用默认值
const getSavedViewMode = (): ViewMode => {
  try {
    const savedViewMode = localStorage.getItem('tagPageViewMode');
    return savedViewMode === VIEW_MODES.Grid ? VIEW_MODES.Grid : VIEW_MODES.List;
  } catch (error) {
    // 如果发生错误（如隐私模式下），则返回默认值
    return VIEW_MODES.List;
  }
};

const initialState: TagPageState = {
  currentTab: 'latest',
  currentLatestSubTab: 'latest_publish',
  currentHotSubTab: 'daily',
  currentContentFilter: 'all',
  viewMode: getSavedViewMode(),
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
  
  setViewMode: (mode) => {
    // 保存视图模式到localStorage
    try {
      localStorage.setItem('tagPageViewMode', mode);
    } catch (error) {
      // 忽略可能的错误（如隐私模式）
      console.warn('Failed to save view mode to localStorage', error);
    }
    
    return set(() => ({
      viewMode: mode,
    }));
  },
  
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
  
  resetState: () => set((state) => ({
    ...initialState,
    // 保留当前视图模式，不重置
    viewMode: state.viewMode,
  })),
})); 