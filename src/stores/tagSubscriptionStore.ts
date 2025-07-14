import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TagItem } from '../components/tag/tag.type';

interface TagSubscriptionState {
  subscribedTags: TagItem[];
  blockedTags: TagItem[];
  tempOrderedTags: TagItem[] | null;
  searchQuery: string;
}

interface TagSubscriptionStore extends TagSubscriptionState {
  // Actions
  followTag: (tag: TagItem) => void;
  unfollowTag: (tagId: string) => void;
  blockTag: (tagId: string) => void;
  unblockTag: (tagId: string) => void;
  reorderTags: (startIndex: number, endIndex: number) => void;
  saveTagOrder: () => void;
  discardTagOrder: () => void;
  setSearchQuery: (query: string) => void;
  getFilteredTags: () => TagItem[];
  getTopTags: (limit: number) => TagItem[];
}

const initialState: TagSubscriptionState = {
  subscribedTags: [
    { id: '1', name: '前端', color: 'blue', isPopular: true },
    { id: '2', name: '后端', color: 'green' },
    { id: '3', name: '全栈', color: 'purple' },
    { id: '4', name: 'AI', color: 'red', isPopular: true },
    { id: '5', name: '云计算', color: 'orange' },
    { id: '6', name: '大数据', color: 'indigo' },
    { id: '7', name: '区块链', color: 'teal' },
    { id: '8', name: '移动开发', color: 'pink' },
    { id: '9', name: 'UI/UX', color: 'amber' },
    { id: '10', name: '测试', color: 'emerald' },
    { id: '11', name: 'DevOps', color: 'slate' },
    { id: '12', name: '网络安全', color: 'rose' },
  ],
  blockedTags: [],
  tempOrderedTags: null,
  searchQuery: '',
};

export const useTagSubscriptionStore = create<TagSubscriptionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      followTag: (tag) => set((state) => ({
        subscribedTags: [tag, ...state.subscribedTags]
      })),
      
      unfollowTag: (tagId) => set((state) => {
        const tag = state.subscribedTags.find(tag => tag.id === tagId || (tagId === tag.name));
        return {
          subscribedTags: state.subscribedTags.filter((tag) => tag.id !== tagId && (tagId !== tag.name)),
          tempOrderedTags: state.tempOrderedTags 
            ? state.tempOrderedTags.filter((tag) => tag.id !== tagId && (tagId !== tag.name)) 
            : null
        };
      }),
      
      blockTag: (tagId) => set((state) => {
        // Find the tag to be blocked
        const tagToBlock = state.subscribedTags.find(tag => tag.id === tagId || (tagId === tag.name));
        
        if (!tagToBlock) return state;
        
        // Add to blocked tags and remove from subscribed tags
        return {
          subscribedTags: state.subscribedTags.filter(tag => tag.id !== tagId && (tagId !== tag.name)),
          blockedTags: [...state.blockedTags, tagToBlock],
          tempOrderedTags: state.tempOrderedTags 
            ? state.tempOrderedTags.filter((tag) => tag.id !== tagId && (tagId !== tag.name)) 
            : null
        };
      }),
      
      unblockTag: (tagId) => set((state) => ({
        blockedTags: state.blockedTags.filter(tag => tag.id !== tagId && (tagId !== tag.name))
      })),
      
      reorderTags: (startIndex, endIndex) => set((state) => {
        const sourceArray = state.tempOrderedTags || state.subscribedTags;
        const result = Array.from(sourceArray);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        
        return {
          tempOrderedTags: result
        };
      }),
      
      saveTagOrder: () => set((state) => {
        if (!state.tempOrderedTags) return state;
        
        return {
          subscribedTags: state.tempOrderedTags,
          tempOrderedTags: null
        };
      }),
      
      discardTagOrder: () => set({
        tempOrderedTags: null
      }),
      
      setSearchQuery: (query) => set({
        searchQuery: query
      }),
      
      getFilteredTags: () => {
        const { subscribedTags, tempOrderedTags, searchQuery } = get();
        const tagsToFilter = tempOrderedTags || subscribedTags;
        
        if (!searchQuery) return tagsToFilter;
        
        return tagsToFilter.filter((tag) => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      },
      
      getTopTags: (limit) => {
        // If limit is very large or undefined, return all tags
        const { subscribedTags } = get();
        if (!limit || limit >= subscribedTags.length) {
          return subscribedTags;
        }
        return subscribedTags.slice(0, limit);
      }
    }),
    {
      name: 'tag-subscriptions',
    }
  )
); 