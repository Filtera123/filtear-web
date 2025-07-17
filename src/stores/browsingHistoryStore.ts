import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrowsingRecord {
  id: string;
  title: string;
  author: string;
  authorAvatar?: string;
  type: 'article' | 'image' | 'dynamic' | 'video';
  viewTime: string; // ISO date string
  url: string;
  thumbnail?: string; // 缩略图
}

interface BrowsingHistoryState {
  records: BrowsingRecord[];
  addRecord: (record: Omit<BrowsingRecord, 'viewTime'>) => void;
  getRecentRecords: (limit?: number) => BrowsingRecord[];
  clearHistory: () => void;
  removeRecord: (id: string) => void;
}

export const useBrowsingHistoryStore = create<BrowsingHistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addRecord: (record) => {
        set((state) => {
          // 检查是否已存在相同帖子的记录
          const existingIndex = state.records.findIndex(r => r.id === record.id);
          const newRecord: BrowsingRecord = {
            ...record,
            viewTime: new Date().toISOString(),
          };
          
          let newRecords;
          if (existingIndex >= 0) {
            // 如果已存在，移除旧记录，添加新记录到开头
            newRecords = [newRecord, ...state.records.filter(r => r.id !== record.id)];
          } else {
            // 如果不存在，直接添加到开头
            newRecords = [newRecord, ...state.records];
          }
          
          // 只保留最新的50条记录
          return {
            records: newRecords.slice(0, 50),
          };
        });
      },
      
      getRecentRecords: (limit = 10) => {
        const { records } = get();
        return records
          .sort((a, b) => new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime())
          .slice(0, limit);
      },
      
      clearHistory: () => {
        set({ records: [] });
      },
      
      removeRecord: (id: string) => {
        set((state) => ({
          records: state.records.filter(r => r.id !== id),
        }));
      },
    }),
    {
      name: 'browsing-history', // localStorage key
      version: 1,
    }
  )
); 