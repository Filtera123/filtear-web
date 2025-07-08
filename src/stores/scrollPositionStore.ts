import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 滚动位置数据结构
interface ScrollPosition {
  x: number;
  y: number;
  timestamp: number;
}

// 页面滚动状态
interface PageScrollState {
  scrollPosition: ScrollPosition;
  lastVisited: number;
}

// 全局滚动位置状态
interface ScrollPositionState {
  // 存储各个路径的滚动位置
  positions: Record<string, PageScrollState>;
  
  // 当前活动的路径
  currentPath: string;
  
  // 操作方法
  saveScrollPosition: (path: string, x: number, y: number) => void;
  getScrollPosition: (path: string) => ScrollPosition | null;
  clearScrollPosition: (path: string) => void;
  clearAllPositions: () => void;
  setCurrentPath: (path: string) => void;
  
  // 清理过期数据 (7天前的数据)
  cleanupExpiredPositions: () => void;
}

export const useScrollPositionStore = create<ScrollPositionState>()(
  persist(
    (set, get) => ({
      positions: {},
      currentPath: '',

      saveScrollPosition: (path: string, x: number, y: number) => {
        const now = Date.now();
        set((state) => ({
          positions: {
            ...state.positions,
            [path]: {
              scrollPosition: { x, y, timestamp: now },
              lastVisited: now,
            },
          },
        }));
      },

      getScrollPosition: (path: string) => {
        const state = get();
        const pageState = state.positions[path];
        return pageState?.scrollPosition || null;
      },

      clearScrollPosition: (path: string) => {
        set((state) => {
          const newPositions = { ...state.positions };
          delete newPositions[path];
          return { positions: newPositions };
        });
      },

      clearAllPositions: () => {
        set({ positions: {} });
      },

      setCurrentPath: (path: string) => {
        set({ currentPath: path });
      },

      cleanupExpiredPositions: () => {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        set((state) => {
          const newPositions: Record<string, PageScrollState> = {};
          Object.entries(state.positions).forEach(([path, pageState]) => {
            if (pageState.lastVisited > sevenDaysAgo) {
              newPositions[path] = pageState;
            }
          });
          return { positions: newPositions };
        });
      },
    }),
    {
      name: 'scroll-position-storage',
      partialize: (state) => ({
        positions: state.positions,
        // currentPath 不需要持久化
      }),
      version: 1,
    }
  )
); 