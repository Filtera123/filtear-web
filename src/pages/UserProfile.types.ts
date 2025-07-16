// 用户个人主页相关类型定义
export interface UserProfileInfo {
  id: string;
  nickname: string;
  username: string; // @username格式
  avatar: string;
  bio: string; // 个性签名
  ipLocation: string; // IP地址
  followerCount: number; // 关注者数量
  followingCount: number; // 粉丝数量
  likeCount: number; // 获赞数量
  isVerified: boolean; // 是否认证
  joinDate: string; // 加入时间
  isCurrentUser: boolean; // 是否是当前用户
  isFollowing?: boolean; // 是否已关注（他人主页时显示）
}

// 个人主页Tab类型
export const ProfileTabs = {
  WORKS: 'works',
  DYNAMICS: 'dynamics',
  LIKES: 'likes'
} as const;

export type ProfileTab = typeof ProfileTabs[keyof typeof ProfileTabs];

// 作品过滤器类型
export const WorksFilter = {
  ALL: 'all',
  ARTICLES: 'articles',
  IMAGES: 'images',
  VIDEOS: 'videos'
} as const;

export type WorksFilterType = typeof WorksFilter[keyof typeof WorksFilter];

// 视图模式类型
export type ViewMode = 'list' | 'grid';

export const VIEW_MODES = {
  List: 'list',
  Grid: 'grid',
} as const;

// 用户个人主页状态
export interface UserProfileState {
  userInfo: UserProfileInfo | null;
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  viewMode: ViewMode;
  isLoading: boolean;
  error: string | null;
  posts: any[]; // 使用现有的帖子类型
  isFollowing: boolean;
}

// 定义API响应类型
export type UserProfileResponse = UserProfileInfo | null; 