import { create } from 'zustand';
import type { UserProfileInfo, UserProfileState, ProfileTab, WorksFilterType } from './UserProfile.types';
import { ProfileTabs, WorksFilter } from './UserProfile.types';

export const useUserProfileStore = create<UserProfileState & {
  // Actions
  setUserInfo: (userInfo: UserProfileInfo) => void;
  setCurrentTab: (tab: ProfileTab) => void;
  setCurrentWorksFilter: (filter: WorksFilterType) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setPosts: (posts: any[]) => void;
  setIsFollowing: (following: boolean) => void;
  toggleFollow: () => void;
  resetState: () => void;
}>((set, get) => ({
  // Initial state
  userInfo: null,
  currentTab: ProfileTabs.WORKS,
  currentWorksFilter: WorksFilter.ALL,
  isLoading: false,
  error: null,
  posts: [],
  isFollowing: false,

  // Actions
  setUserInfo: (userInfo) => set({ userInfo }),
  
  setCurrentTab: (tab) => set({ currentTab: tab }),
  
  setCurrentWorksFilter: (filter) => set({ currentWorksFilter: filter }),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setPosts: (posts) => set({ posts }),
  
  setIsFollowing: (following) => set({ isFollowing: following }),
  
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
    isLoading: false,
    error: null,
    posts: [],
    isFollowing: false,
  }),
}));

// 模拟获取用户信息的API
export const mockGetUserInfo = (userId: string): Promise<UserProfileInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟当前用户为 "user123"
      const isCurrentUser = userId === 'user123';
      
      resolve({
        id: userId,
        nickname: isCurrentUser ? '我的昵称' : `用户${userId}`,
        username: `@${userId}`,
        avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
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