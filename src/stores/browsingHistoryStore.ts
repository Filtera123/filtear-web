import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BrowsingRecord {
  id: string;
  title: string;
  author: string;
  authorId?: string; // 新增：作者ID，用于导航
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
  cleanupDuplicates: () => void;
}

export const useBrowsingHistoryStore = create<BrowsingHistoryState>()(
  persist(
    (set, get) => ({
      records: [],
      
      addRecord: (record) => {
        set((state) => {
          console.log('添加浏览记录:', record);
          console.log('当前记录:', state.records.map(r => ({ id: r.id, title: r.title })));
          
          // 检查是否已存在相同帖子的记录（按ID或标题+作者去重）
          const existingIndex = state.records.findIndex(r => 
            r.id === record.id || (r.title === record.title && r.author === record.author)
          );
          console.log('找到已存在记录的索引:', existingIndex);
          
          const newRecord: BrowsingRecord = {
            ...record,
            viewTime: new Date().toISOString(),
          };
          
          let newRecords;
          if (existingIndex >= 0) {
            // 如果已存在，移除旧记录，添加新记录到开头
            console.log('移除旧记录，添加新记录');
            const existingRecord = state.records[existingIndex];
            newRecords = [newRecord, ...state.records.filter(r => 
              r.id !== record.id && !(r.title === record.title && r.author === record.author)
            )];
          } else {
            // 如果不存在，直接添加到开头
            console.log('添加新记录到开头');
            newRecords = [newRecord, ...state.records];
          }
          
          console.log('更新后的记录:', newRecords.map(r => ({ id: r.id, title: r.title })));
          
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
      
      cleanupDuplicates: () => {
        set((state) => {
          console.log('清理重复记录前:', state.records.length);
          const seen = new Set<string>();
          const uniqueRecords = state.records.filter(record => {
            const key = `${record.title}-${record.author}`;
            if (seen.has(key)) {
              console.log('发现重复记录:', record.title);
              return false;
            }
            seen.add(key);
            return true;
          });
          console.log('清理重复记录后:', uniqueRecords.length);
          return { records: uniqueRecords };
        });
      },
    }),
    {
      name: 'browsing-history', // localStorage key
      version: 1,
    }
  )
); 