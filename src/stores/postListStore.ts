import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type PostItem } from '../components/post-card/post.types';
import { type PostListType } from '../pages/home/PostList';

// 单个 tab 的状态
interface TabState {
  posts: PostItem[];
  page: number;
  hasMore: boolean;
  initialized: boolean;
  loading: boolean;
  scrollPosition: number;
  totalSize: number;
  visibleRange: { start: number; end: number } | null;
}

// Store 状态
interface PostListState {
  tabs: Record<PostListType, TabState>;
  activeTab: PostListType;
  
  // Actions
  setActiveTab: (tab: PostListType) => void;
  initializeTab: (tab: PostListType) => void;
  addPosts: (tab: PostListType, posts: PostItem[]) => void;
  setTabLoading: (tab: PostListType, loading: boolean) => void;
  setTabPage: (tab: PostListType, page: number) => void;
  setTabHasMore: (tab: PostListType, hasMore: boolean) => void;
  updatePost: (tab: PostListType, postId: number, updates: Partial<PostItem>) => void;
  removePost: (tab: PostListType, postId: number) => void;
  removePostsByAuthor: (tab: PostListType, author: string) => void;
  
  // 滚动位置相关
  saveScrollPosition: (tab: PostListType, position: number) => void;
  saveTotalSize: (tab: PostListType, size: number) => void;
  saveVisibleRange: (tab: PostListType, range: { start: number; end: number }) => void;
  getScrollPosition: (tab: PostListType) => number;
  
  // 重置相关
  resetTab: (tab: PostListType) => void;
  resetAllTabs: () => void;
}

// 默认 tab 状态
const defaultTabState: TabState = {
  posts: [],
  page: 0,
  hasMore: true,
  initialized: false,
  loading: false,
  scrollPosition: 0,
  totalSize: 0,
  visibleRange: null,
};

// 创建默认状态
const createDefaultTabs = (): Record<PostListType, TabState> => ({
  recommended: { ...defaultTabState },
  subscriptions: { ...defaultTabState },
  following: { ...defaultTabState },
});

export const usePostListStore = create<PostListState>()(
  persist(
    (set, get) => ({
      tabs: createDefaultTabs(),
      activeTab: 'recommended',

      setActiveTab: (tab: PostListType) => {
        set({ activeTab: tab });
      },

      initializeTab: (tab: PostListType) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              initialized: true,
            },
          },
        }));
      },

      addPosts: (tab: PostListType, newPosts: PostItem[]) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              posts: [...state.tabs[tab].posts, ...newPosts],
            },
          },
        }));
      },

      setTabLoading: (tab: PostListType, loading: boolean) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              loading,
            },
          },
        }));
      },

      setTabPage: (tab: PostListType, page: number) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              page,
            },
          },
        }));
      },

      setTabHasMore: (tab: PostListType, hasMore: boolean) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              hasMore,
            },
          },
        }));
      },

      updatePost: (tab: PostListType, postId: number, updates: Partial<PostItem>) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              posts: state.tabs[tab].posts.map((post) =>
                post.id === postId ? { ...post, ...updates } : post
              ),
            },
          },
        }));
      },

      removePost: (tab: PostListType, postId: number) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              posts: state.tabs[tab].posts.filter((post) => post.id !== postId),
            },
          },
        }));
      },

      removePostsByAuthor: (tab: PostListType, author: string) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              posts: state.tabs[tab].posts.filter((post) => post.author !== author),
            },
          },
        }));
      },

      saveScrollPosition: (tab: PostListType, position: number) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              scrollPosition: position,
            },
          },
        }));
      },

      saveTotalSize: (tab: PostListType, size: number) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              totalSize: size,
            },
          },
        }));
      },

      saveVisibleRange: (tab: PostListType, range: { start: number; end: number }) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: {
              ...state.tabs[tab],
              visibleRange: range,
            },
          },
        }));
      },

      getScrollPosition: (tab: PostListType) => {
        return get().tabs[tab].scrollPosition;
      },

      resetTab: (tab: PostListType) => {
        set((state) => ({
          tabs: {
            ...state.tabs,
            [tab]: { ...defaultTabState },
          },
        }));
      },

      resetAllTabs: () => {
        set({ tabs: createDefaultTabs() });
      },
    }),
    {
      name: 'post-list-storage',
      // 只持久化部分状态，加载状态等运行时状态不需要持久化
      partialize: (state) => ({
        tabs: Object.fromEntries(
          Object.entries(state.tabs).map(([key, tab]) => [
            key,
            {
              posts: tab.posts,
              page: tab.page,
              hasMore: tab.hasMore,
              initialized: tab.initialized,
              scrollPosition: tab.scrollPosition,
              totalSize: tab.totalSize,
              visibleRange: tab.visibleRange,
              loading: false, // 不持久化加载状态
            },
          ])
        ) as Record<PostListType, TabState>,
        activeTab: state.activeTab,
        // isTabSwitching 不持久化，这是运行时状态
      }),
      // 1小时后过期，避免数据过旧
      version: 1,
    }
  )
);

// 滚动位置管理的 Hook
export const useScrollPositionManager = () => {
  const { saveScrollPosition, getScrollPosition } = usePostListStore();

  // 保存滚动位置（带节流）
  const saveScrollPositionThrottled = React.useMemo(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return (tab: PostListType, position: number) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveScrollPosition(tab, position);
      }, 200); // 200ms 节流
    };
  }, [saveScrollPosition]);

  // 恢复滚动位置 - 改进版本，等待虚拟滚动准备好
  const restoreScrollPosition = React.useCallback((tab: PostListType, containerRef?: React.RefObject<HTMLElement | null>) => {
    const position = getScrollPosition(tab);
    if (position <= 0) {
      console.log(`[滚动恢复] ${tab} 没有保存的滚动位置，跳过恢复`);
      return;
    }

    console.log(`[滚动恢复] 尝试恢复 ${tab} 的滚动位置到: ${position}px`);

    const attemptRestore = (attempt: number = 1, maxAttempts: number = 10) => {
      // 先检查当前滚动位置，如果已经接近目标位置就不需要恢复了
      const currentPosition = window.scrollY;
      if (Math.abs(currentPosition - position) < 50) {
        console.log(`[滚动恢复] 当前位置 ${currentPosition}px 已接近目标位置 ${position}px，无需恢复`);
        return;
      }

      // 检查容器是否准备好
      const container = containerRef?.current;
      if (container) {
        const containerHeight = container.style.height;
        const hasHeight = containerHeight && containerHeight !== '0px';
        
        if (hasHeight) {
          console.log(`[滚动恢复] 第${attempt}次尝试 - 容器已准备好，高度: ${containerHeight}`);
          
          // 使用更可靠的滚动方式
          const scrollOptions: ScrollToOptions = { 
            top: position, 
            behavior: attempt <= 2 ? 'instant' : 'smooth' 
          };
          
          window.scrollTo(scrollOptions);
          
          // 验证滚动是否成功
          setTimeout(() => {
            const newPosition = window.scrollY;
            if (Math.abs(newPosition - position) < 100) {
              console.log(`[滚动恢复] 恢复成功: ${newPosition}px (目标: ${position}px)`);
            } else {
              console.log(`[滚动恢复] 恢复可能失败: 当前 ${newPosition}px, 目标 ${position}px`);
            }
          }, 100);
          
          return;
        }
      }

      // 如果容器还没准备好，继续等待
      if (attempt < maxAttempts) {
        const delay = attempt <= 3 ? 150 : 300; // 增加延迟时间
        console.log(`[滚动恢复] 第${attempt}次尝试失败 (容器未准备好)，${delay}ms后重试...`);
        setTimeout(() => attemptRestore(attempt + 1, maxAttempts), delay);
      } else {
        console.log(`[滚动恢复] 达到最大重试次数，强制恢复位置`);
        window.scrollTo({ top: position, behavior: 'smooth' });
      }
    };

    // 稍微延迟开始，确保DOM更新完成
    setTimeout(() => attemptRestore(), 50);
  }, [getScrollPosition]);

  return {
    saveScrollPosition: saveScrollPositionThrottled,
    restoreScrollPosition,
    getScrollPosition,
  };
}; 