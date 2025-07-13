// TagPage 的 tab 类型定义
export type TagPageTab = 'latest' | 'hot' | 'dynamic';

export const TAG_PAGE_TABS = {
  Latest: 'latest',
  Hot: 'hot',
  Dynamic: 'dynamic',
} as const;

// 最新tab的子分类
export type LatestSubTab = 'latest_publish' | 'latest_comment';

export const LATEST_SUB_TABS = {
  LatestPublish: 'latest_publish',
  LatestComment: 'latest_comment',
} as const;

// 最热tab的子分类
export type HotSubTab = 'daily' | 'weekly' | 'monthly' | 'all';

export const HOT_SUB_TABS = {
  Daily: 'daily',
  Weekly: 'weekly',
  Monthly: 'monthly',
  All: 'all',
} as const;

// 内容类型过滤
export type ContentFilter = 'all' | 'image' | 'text';

export const CONTENT_FILTERS = {
  All: 'all',
  Image: 'image',
  Text: 'text',
} as const;

// 标签统计信息
export interface TagStats {
  viewCount: number;
  postCount: number;
  followerCount: number;
}

// 标签详情
export interface TagDetail {
  id: string;
  name: string;
  description?: string;
  stats: TagStats;
  isSubscribed: boolean;
  isBlocked: boolean;
  color?: string;
  icon?: string;
}

// TagPage store 状态
export interface TagPageState {
  currentTab: TagPageTab;
  currentLatestSubTab: LatestSubTab;
  currentHotSubTab: HotSubTab;
  currentContentFilter: ContentFilter;
  tagDetail: TagDetail | null;
  isLoading: boolean;
} 