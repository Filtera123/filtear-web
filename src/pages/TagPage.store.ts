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
import { useTagSubscriptionStore } from '../stores/tagSubscriptionStore';
import type { TagItem } from '../components/tag/tag.type';

// 标签页tab的滚动状态
interface TagTabScrollState {
  scrollOffset: number;
  visitedBefore: boolean;
}

interface TagPageStore extends TagPageState {
  // Tab滚动状态
  tabs: Record<TagPageTab, TagTabScrollState>;
  
  // Actions
  setCurrentTab: (tab: TagPageTab) => void;
  setCurrentLatestSubTab: (subTab: LatestSubTab) => void;
  setCurrentHotSubTab: (subTab: HotSubTab) => void;
  setCurrentContentFilter: (filter: ContentFilter) => void;
  setViewMode: (mode: ViewMode) => void;
  setTagDetail: (tag: TagDetail | null) => void;
  setIsLoading: (loading: boolean) => void;
  
  // 滚动位置管理
  updateScrollOffset: (tab: TagPageTab, offset: number) => void;
  markTabAsVisited: (tab: TagPageTab) => void;
  
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

// 从localStorage获取保存的当前tab，如果没有则使用默认值
const getSavedCurrentTab = (): TagPageTab => {
  try {
    const savedTab = localStorage.getItem('tagPageCurrentTab');
    return savedTab === 'dynamic' || savedTab === 'hot' || savedTab === 'latest' ? savedTab : 'latest';
  } catch (error) {
    return 'latest';
  }
};

const initialState: TagPageState = {
  currentTab: getSavedCurrentTab(),
  currentLatestSubTab: 'latest_publish',
  currentHotSubTab: 'daily',
  currentContentFilter: 'all',
  viewMode: getSavedViewMode(),
  tagDetail: null,
  isLoading: false,
};

const initialTabsState: Record<TagPageTab, TagTabScrollState> = {
  latest: { scrollOffset: 0, visitedBefore: false },
  hot: { scrollOffset: 0, visitedBefore: false },
  dynamic: { scrollOffset: 0, visitedBefore: false },
};

export const useTagPageStore = create<TagPageStore>((set, get) => ({
  ...initialState,
  tabs: initialTabsState,
  
  setCurrentTab: (tab) => {
    // 保存当前tab到localStorage
    try {
      localStorage.setItem('tagPageCurrentTab', tab);
    } catch (error) {
      console.warn('Failed to save current tab to localStorage', error);
    }
    
    return set(() => ({
      currentTab: tab,
    }));
  },
  
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
  
  updateScrollOffset: (tab, offset) => {
    const state = get();
    set({
      tabs: {
        ...state.tabs,
        [tab]: { ...state.tabs[tab], scrollOffset: offset },
      },
    });
  },
  
  markTabAsVisited: (tab) => {
    const state = get();
    set({
      tabs: {
        ...state.tabs,
        [tab]: { ...state.tabs[tab], visitedBefore: true },
      },
    });
  },
  
  toggleSubscription: () => {
    const state = get();
    if (!state.tagDetail) return;

    // 获取全局订阅状态管理器的方法
    const { followTag, unfollowTag } = useTagSubscriptionStore.getState();
    
    const isCurrentlySubscribed = state.tagDetail.isSubscribed;
    const newSubscriptionState = !isCurrentlySubscribed;

    // 同步更新全局订阅状态
    if (newSubscriptionState) {
      // 订阅 - 添加到全局订阅列表
      const tagItem: TagItem = {
        id: state.tagDetail.id,
        name: state.tagDetail.name,
        color: state.tagDetail.color || '#7E44C6',
        isPopular: false
      };
      followTag(tagItem);
    } else {
      // 取消订阅 - 从全局订阅列表中移除
      unfollowTag(state.tagDetail.id);
    }

    // 更新本地状态
    set((state) => ({
      tagDetail: state.tagDetail ? {
        ...state.tagDetail,
        isSubscribed: newSubscriptionState,
      } : null,
    }));
  },
  
  toggleBlock: () => set((state) => ({
    tagDetail: state.tagDetail ? {
      ...state.tagDetail,
      isBlocked: !state.tagDetail.isBlocked,
    } : null,
  })),
  
  resetState: () => set((state) => ({
    ...initialState,
    // 保留当前视图模式和当前tab，不重置
    viewMode: state.viewMode,
    currentTab: state.currentTab,
    // 保留滚动状态，不重置
    tabs: state.tabs,
  })),
})); 