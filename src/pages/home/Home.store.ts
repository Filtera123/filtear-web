import { create } from 'zustand';
import type { HomeTabs } from './type.ts';
import { HOME_TABS } from './type.ts';

// Zustand store 状态类型（简化，主要存储 UI 状态）
interface TabScrollState {
  scrollOffset: number;
  visitedBefore: boolean;
}

interface AppStore {
  tabs: Record<HomeTabs, TabScrollState>;
  currentTab: HomeTabs;
  setCurrentTab: (tab: HomeTabs) => void;
  updateScrollOffset: (tab: HomeTabs, offset: number) => void;
  markTabAsVisited: (tab: HomeTabs) => void;
  resetState: () => void;
}

// Zustand store（简化，主要管理滚动状态）
export const useHomePostListStore = create<AppStore>((set, get) => ({
  tabs: {
    [HOME_TABS.Recommended]: { scrollOffset: 0, visitedBefore: false },
    [HOME_TABS.Subscriptions]: { scrollOffset: 0, visitedBefore: false },
    [HOME_TABS.Following]: { scrollOffset: 0, visitedBefore: false },
  },
  currentTab: HOME_TABS.Recommended,

  setCurrentTab: (tab: HomeTabs) => {
    set({ currentTab: tab });
  },

  updateScrollOffset: (tab: HomeTabs, offset: number) => {
    const state = get();
    set({
      tabs: {
        ...state.tabs,
        [tab]: { ...state.tabs[tab], scrollOffset: offset },
      },
    });
  },

  markTabAsVisited: (tab: HomeTabs) => {
    const state = get();
    set({
      tabs: {
        ...state.tabs,
        [tab]: { ...state.tabs[tab], visitedBefore: true },
      },
    });
  },

  resetState: () =>
    set({
      tabs: {
        [HOME_TABS.Recommended]: { scrollOffset: 0, visitedBefore: false },
        [HOME_TABS.Subscriptions]: { scrollOffset: 0, visitedBefore: false },
        [HOME_TABS.Following]: { scrollOffset: 0, visitedBefore: false },
      },
      currentTab: HOME_TABS.Recommended,
    }),
}));
