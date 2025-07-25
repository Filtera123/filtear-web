import { create } from 'zustand';
import type { UserProfileInfo, UserProfileState, ProfileTab, WorksFilterType, ViewMode } from './UserProfile.types';
import { ProfileTabs, WorksFilter, VIEW_MODES } from './UserProfile.types';

// 从localStorage获取保存的视图模式，如果没有则使用默认值
const getSavedViewMode = (): ViewMode => {
  try {
    const savedViewMode = localStorage.getItem('userProfileViewMode');
    return savedViewMode === VIEW_MODES.Grid ? VIEW_MODES.Grid : VIEW_MODES.List;
  } catch (error) {
    // 如果发生错误（如隐私模式下），则返回默认值
    return VIEW_MODES.List;
  }
};

export const useUserProfileStore = create<UserProfileState & {
  // Actions
  setUserInfo: (userInfo: UserProfileInfo) => void;
  setCurrentTab: (tab: ProfileTab) => void;
  setCurrentWorksFilter: (filter: WorksFilterType) => void;
  setViewMode: (mode: ViewMode) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPosts: (posts: any[]) => void;
  setIsFollowing: (following: boolean) => void;
  toggleFollow: () => void;
  resetState: () => void;
  setIsInitialLoad: (isInitial: boolean) => void;
  setIsUserInfoLoading: (loading: boolean) => void;
  setIsPostsLoading: (loading: boolean) => void;
  // 新增缓存相关方法
  getCachedPosts: (userId: string, tab: ProfileTab, filter: WorksFilterType) => any[] | null;
  setCachedPosts: (userId: string, tab: ProfileTab, filter: WorksFilterType, posts: any[]) => void;
  clearCache: () => void;
}>((set, get) => ({
  // Initial state
  userInfo: null,
  currentTab: ProfileTabs.WORKS,
  currentWorksFilter: WorksFilter.ALL,
  viewMode: getSavedViewMode(),
  isLoading: false, // 保留用于向后兼容
  error: null,
  posts: [],
  isFollowing: false,
  isInitialLoad: true,
  isUserInfoLoading: false,
  isPostsLoading: false,
  // 新增缓存状态
  postsCache: {} as Record<string, any[]>,

  // Actions
  setUserInfo: (userInfo) => set({ userInfo }),
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  setCurrentWorksFilter: (filter) => set({ currentWorksFilter: filter }),
  
  setViewMode: (mode) => {
    // 保存视图模式到localStorage
    try {
      localStorage.setItem('userProfileViewMode', mode);
    } catch (error) {
      // 忽略可能的错误（如隐私模式）
      console.warn('Failed to save view mode to localStorage', error);
    }
    
    return set(() => ({
      viewMode: mode,
    }));
  },
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setPosts: (posts) => set({ posts }),
  
  setIsFollowing: (following) => set({ isFollowing: following }),
  
  setIsInitialLoad: (isInitial) => set({ isInitialLoad: isInitial }),
  
  setIsUserInfoLoading: (loading) => set({ isUserInfoLoading: loading }),
  
  setIsPostsLoading: (loading) => set({ isPostsLoading: loading }),
  
  toggleFollow: () => {
    const { isFollowing, userInfo } = get();
    if (userInfo) {
      set({ 
        isFollowing: !isFollowing,
        userInfo: {
          ...userInfo,
          followerCount: isFollowing ? userInfo.followerCount - 1 : userInfo.followerCount + 1
        }
      });
    }
  },

  resetState: () => set({
    userInfo: null,
    currentTab: ProfileTabs.WORKS,
    currentWorksFilter: WorksFilter.ALL,
    viewMode: getSavedViewMode(), // 保留当前视图模式，不重置
    isLoading: false,
    error: null,
    posts: [],
    isFollowing: false,
    isInitialLoad: true,
    isUserInfoLoading: false,
    isPostsLoading: false,
    postsCache: {},
  }),

  // 新增缓存相关方法
  getCachedPosts: (userId: string, tab: ProfileTab, filter: WorksFilterType) => {
    const cacheKey = `${userId}-${tab}-${filter}`;
    const cache = get().postsCache;
    return cache[cacheKey] || null;
  },

  setCachedPosts: (userId: string, tab: ProfileTab, filter: WorksFilterType, posts: any[]) => {
    const cacheKey = `${userId}-${tab}-${filter}`;
    const state = get();
    set({
      postsCache: {
        ...state.postsCache,
        [cacheKey]: posts
      }
    });
  },

  clearCache: () => set({ postsCache: {} }),
}));

// 生成基于字符串的固定hash值
const generateHashFromString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// 模拟获取用户信息的API
export const mockGetUserInfo = (userId: string): Promise<UserProfileInfo | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟当前用户为 "user123"
      const isCurrentUser = userId === 'user123';
      
      // 模拟一个无效的用户ID
      if (userId === 'invalid' || userId === 'notfound') {
        // 返回null表示找不到用户，而不是抛出错误
        // 实际API可能返回404状态码
        resolve(null);
        return;
      }
      
      // 模拟服务器错误
      if (userId === 'error') {
        reject(new Error('服务器错误'));
        return;
      }
      
      // 基于用户ID生成固定的头像ID
      const avatarId = generateHashFromString(userId) % 100;
      
      resolve({
        id: userId,
        nickname: isCurrentUser ? '我的昵称' : `用户${userId}`,
        username: `@${userId}`,
        avatar: `https://picsum.photos/id/${avatarId}/100/100`,
        bio: isCurrentUser ? '这是我的个性签名，可以编辑' : `这是${userId}的个性签名`,
        ipLocation: '上海',
        followerCount: Math.floor(Math.random() * 1000) + 100,
        followingCount: Math.floor(Math.random() * 500) + 50,
        likeCount: Math.floor(Math.random() * 5000) + 1000,
        isVerified: Math.random() > 0.5,
        joinDate: '2023-01-01',
        isCurrentUser,
        isFollowing: isCurrentUser ? undefined : Math.random() > 0.5,
      });
    }, 500);
  });
};

// 模拟获取用户帖子的API
export const mockGetUserPosts = (userId: string, tab: ProfileTab, filter: WorksFilterType): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = Array.from({ length: 10 }, (_, i) => {
        const postType = filter === WorksFilter.ALL ? ['article', 'image', 'video', 'dynamic'][Math.floor(Math.random() * 4)] : filter;
        const basePost = {
          id: `${userId}-post-${i}`,
          author: `用户${userId}`,
          authorAvatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/40/40`,
          content: `这是${tab}类型的第${i + 1}个帖子内容。这里是更详细的内容描述，包含了更多的文字内容，用于展示帖子的具体信息。`,
          title: `帖子标题 ${i + 1}`,
          type: postType,
          tags: [
            { id: `tag-${i}`, name: `标签${i}` },
            { id: `tag-${i + 1}`, name: `标签${i + 1}` }
          ],
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50),
          views: Math.floor(Math.random() * 1000) + 100,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          slug: `post-${i}`,
          category: '默认分类',
          categorySlug: 'default',
          isLike: Math.random() > 0.5,
          isFollowing: Math.random() > 0.5,
          commentList: [],
        };

        // 根据帖子类型添加特定属性
        switch (postType) {
          case 'article':
            return {
              ...basePost,
              abstract: `这是第${i + 1}个文章的摘要描述。`,
              wordCount: Math.floor(Math.random() * 2000) + 500,
            };
          case 'image':
            return {
              ...basePost,
              images: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, imgIndex) => ({
                url: `https://picsum.photos/id/${50 + i + imgIndex}/400/300`,
                alt: `图片 ${imgIndex + 1}`,
                width: 400,
                height: 300,
              })),
            };
          case 'video':
            return {
              ...basePost,
              video: {
                url: `https://example.com/video-${i}.mp4`,
                thumbnail: `https://picsum.photos/id/${70 + i}/400/300`,
                duration: Math.floor(Math.random() * 300) + 30,
                width: 1920,
                height: 1080,
              },
            };
          case 'dynamic':
            return {
              ...basePost,
              images: Math.random() > 0.5 ? Array.from({ length: Math.floor(Math.random() * 2) + 1 }, (_, imgIndex) => ({
                url: `https://picsum.photos/id/${80 + i + imgIndex}/400/300`,
                alt: `动态图片 ${imgIndex + 1}`,
              })) : undefined,
            };
          default:
            return basePost;
        }
      });
      resolve(posts);
    }, 300);
  });
}; 