import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { create } from 'zustand';
import { Tabs } from '@chakra-ui/react';
import { cn } from '../utils/cn';
import { IconUser, IconUsers, IconHeart, IconEdit, IconSettings, IconUserPlus, IconUserMinus } from '@tabler/icons-react';
import BasePostCard from '../components/post-card/BasePostCard';

// 用户个人主页相关类型定义
interface UserProfileInfo {
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
const ProfileTabsEnum = {
  WORKS: 'works',
  DYNAMICS: 'dynamics',
  LIKES: 'likes'
} as const;

type ProfileTab = typeof ProfileTabsEnum[keyof typeof ProfileTabsEnum];

// 作品类型过滤器
const WorksFilter = {
  ALL: 'all',
  ARTICLES: 'article',
  IMAGES: 'image',
  VIDEOS: 'video'
} as const;

type WorksFilterType = typeof WorksFilter[keyof typeof WorksFilter];

// 用户统计数据
interface UserStats {
  followerCount: number;
  followingCount: number;
  likeCount: number;
  postCount: number;
  totalViews: number;
}

// 用户个人主页状态
interface UserProfileState {
  userInfo: UserProfileInfo | null;
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  isLoading: boolean;
  error: string | null;
  posts: any[]; // 使用现有的帖子类型
  isFollowing: boolean;
  
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
}

// 状态管理store
const useUserProfileStore = create<UserProfileState>((set, get) => ({
  // Initial state
  userInfo: null,
  currentTab: ProfileTabsEnum.WORKS,
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
    currentTab: ProfileTabsEnum.WORKS,
    currentWorksFilter: WorksFilter.ALL,
    isLoading: false,
    error: null,
    posts: [],
    isFollowing: false,
  }),
}));

// 模拟获取用户信息的API
const mockGetUserInfo = (userId: string): Promise<UserProfileInfo> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟当前登录用户为 "user123"
      const isCurrentUser = userId === 'user123';
      
      // 固定当前用户的信息，避免随机变化
      if (isCurrentUser) {
        resolve({
          id: userId,
          nickname: '我的昵称',
          username: '@user123',
          avatar: 'https://picsum.photos/id/64/100/100',
          bio: '这是我的个性签名，可以编辑',
          ipLocation: '上海',
          followerCount: 888,
          followingCount: 233,
          likeCount: 6666,
          isVerified: true,
          joinDate: '2023-01-01',
          isCurrentUser: true,
          isFollowing: undefined,
        });
      } else {
        resolve({
          id: userId,
          nickname: `用户${userId}`,
          username: `@${userId}`,
          avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/100/100`,
          bio: `这是${userId}的个性签名`,
          ipLocation: '未知地区',
          followerCount: Math.floor(Math.random() * 1000) + 100,
          followingCount: Math.floor(Math.random() * 500) + 50,
          likeCount: Math.floor(Math.random() * 5000) + 1000,
          isVerified: Math.random() > 0.5,
          joinDate: '2023-01-01',
          isCurrentUser: false,
          isFollowing: Math.random() > 0.5,
        });
      }
    }, 500);
  });
};

// 模拟获取用户帖子的API
const mockGetUserPosts = (userId: string, tab: ProfileTab, filter: WorksFilterType): Promise<any[]> => {
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

// 个人主页顶部信息区组件
function ProfileHeader({ 
  userInfo, 
  isFollowing, 
  onToggleFollow, 
  onEditProfile
}: {
  userInfo: UserProfileInfo;
  isFollowing: boolean;
  onToggleFollow: () => void;
  onEditProfile?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingBio, setEditingBio] = useState(userInfo.bio);
  const navigate = useNavigate();

  const handleSaveBio = () => {
    // 这里应该调用API保存bio
    console.log('保存个性签名:', editingBio);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditingBio(userInfo.bio);
    setIsEditing(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 模拟背景图片URL（实际应该从用户信息中获取）
  const backgroundImageUrl = `https://picsum.photos/id/${Math.floor(Math.random() * 30) + 10}/1200/400`;

  return (
    <div className="relative">
      {/* 背景图片 */}
      {/* 返回按钮 - 固定在内容区域左上角 */}
      <div className="sticky top-0 left-0 z-50 w-0 h-0">
        <button 
          onClick={handleGoBack}
          className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div 
        className="w-full h-64 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >

        {/* 编辑背景图片按钮 - 仅自己可见 */}
        {userInfo.isCurrentUser && (
          <button 
            onClick={() => console.log('编辑背景图片')}
            className="absolute bottom-4 right-4 flex items-center space-x-1 px-3 py-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white text-sm transition-colors"
          >
            <IconEdit size={14} />
            <span>编辑封面</span>
          </button>
        )}
      </div>

      {/* 用户信息区域 - 位置上移，头像部分覆盖背景图 */}
      <div className="bg-white border-b border-gray-200 p-6 pt-0 relative">
        <div className="flex items-start justify-between -mt-14">
          {/* 左侧：用户基本信息 */}
          <div className="flex items-start space-x-4">
            {/* 头像 - 覆盖在背景图上 */}
            <div className="relative">
              <img
                src={userInfo.avatar}
                alt={userInfo.nickname}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white"
              />
              {userInfo.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* 用户名和基本信息 - 位置调整为头像右侧 */}
            <div className="flex-1 min-w-0 pt-14">
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{userInfo.nickname}</h1>
                <span className="text-lg text-gray-500">{userInfo.username}</span>
              </div>
              
              {/* 统计数据 */}
              <div className="flex items-center space-x-6 mb-2">
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <IconUsers size={16} />
                  <span>{formatNumber(userInfo.followerCount)} 关注者</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <IconUser size={16} />
                  <span>{formatNumber(userInfo.followingCount)} 粉丝</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <IconHeart size={16} />
                  <span>{formatNumber(userInfo.likeCount)} 热度</span>
                </div>
              </div>

              {/* IP 地址 */}
              <div className="text-sm text-gray-500 mb-2">
                IP: {userInfo.ipLocation}
              </div>

              {/* 个性签名 */}
              <div className="max-w-md">
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingBio}
                      onChange={(e) => setEditingBio(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm resize-none"
                      rows={2}
                      placeholder="输入个性签名..."
                      maxLength={100}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveBio}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                      >
                        保存
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-400"
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                                  <div>
                  <span className="text-sm text-gray-700">{userInfo.bio}</span>
                </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex items-center space-x-3 pt-14">
                      {userInfo.isCurrentUser ? (
            // 自己的主页：只显示编辑资料按钮
            <button
              onClick={onEditProfile}
              className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <IconEdit size={16} />
              <span>编辑资料</span>
            </button>
          ) : (
            // 他人的主页：显示关注/取消关注按钮
              <button
                onClick={onToggleFollow}
                className={`flex items-center space-x-1 px-4 py-2 rounded-md transition-colors ${
                  isFollowing
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {isFollowing ? (
                  <>
                    <IconUserMinus size={16} />
                    <span>取消关注</span>
                  </>
                ) : (
                  <>
                    <IconUserPlus size={16} />
                    <span>关注</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
          </div>
          </div>
  );
}

// Tab切换组件
function ProfileTabs({ 
  currentTab, 
  currentWorksFilter, 
  onTabChange, 
  onWorksFilterChange, 
  isCurrentUser 
}: {
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  onTabChange: (tab: ProfileTab) => void;
  onWorksFilterChange: (filter: WorksFilterType) => void;
  isCurrentUser: boolean;
}) {
  // Tab配置
  const tabs = [
    {
      key: ProfileTabsEnum.WORKS,
      name: '作品',
      current: currentTab === ProfileTabsEnum.WORKS,
    },
    {
      key: ProfileTabsEnum.DYNAMICS,
      name: '动态',
      current: currentTab === ProfileTabsEnum.DYNAMICS,
    },
    {
      key: ProfileTabsEnum.LIKES,
      name: '喜欢',
      current: currentTab === ProfileTabsEnum.LIKES,
      // 他人主页可能不显示喜欢tab（根据隐私设置）
      hidden: !isCurrentUser,
    },
  ];

  // 作品过滤器选项
  const worksFilters = [
    {
      key: WorksFilter.ALL,
      name: '全部',
      current: currentWorksFilter === WorksFilter.ALL,
    },
    {
      key: WorksFilter.ARTICLES,
      name: '文章',
      current: currentWorksFilter === WorksFilter.ARTICLES,
    },
    {
      key: WorksFilter.IMAGES,
      name: '图片',
      current: currentWorksFilter === WorksFilter.IMAGES,
    },
    {
      key: WorksFilter.VIDEOS,
      name: '视频',
      current: currentWorksFilter === WorksFilter.VIDEOS,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 backdrop-blur-sm">
      {/* 主要Tab切换 */}
      <Tabs.Root
        value={currentTab}
        onValueChange={(details) => onTabChange(details.value as ProfileTab)}
      >
        <Tabs.List className="flex justify-center items-center gap-8 px-6 py-3">
          {tabs.filter(tab => !tab.hidden).map((tab) => (
            <Tabs.Trigger 
              key={tab.key}
              value={tab.key}
              className={cn(
                'text-base font-medium px-4 py-2 rounded-md transition-colors',
                tab.current 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              )}
            >
              {tab.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {/* 作品Tab的过滤器 */}
      {currentTab === ProfileTabsEnum.WORKS && (
        <div className="flex justify-center items-center px-6 py-3 border-t border-gray-100">
          <div className="bg-gray-50 rounded-full p-1 border border-gray-200">
            <div className="flex gap-0">
              {worksFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => onWorksFilterChange(filter.key as WorksFilterType)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    filter.current
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200 font-semibold'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  )}
                >
                  {filter.name}
                </button>
              ))}
          </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 帖子列表组件
function ProfilePostList({ 
  posts, 
  currentTab, 
  currentWorksFilter, 
  isLoading, 
  isCurrentUser 
}: {
  posts: any[];
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  isLoading: boolean;
  isCurrentUser: boolean;
}) {
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  // 空状态
  if (posts.length === 0) {
    const getEmptyMessage = () => {
      switch (currentTab) {
        case 'works':
          return isCurrentUser ? '您还没有发布任何作品' : 'TA还没有发布任何作品';
        case 'dynamics':
          return isCurrentUser ? '您还没有发布任何动态' : 'TA还没有发布任何动态';
        case 'likes':
          return isCurrentUser ? '您还没有喜欢任何内容' : 'TA的喜欢内容不公开';
        default:
          return '暂无内容';
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">{getEmptyMessage()}</p>
          <p className="text-sm text-gray-500">
            {isCurrentUser && currentTab === 'works' && '开始创作你的第一个作品吧！'}
            {isCurrentUser && currentTab === 'dynamics' && '分享你的想法和动态吧！'}
          </p>
        </div>
      </div>
    );
  }

  // 渲染帖子列表
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div key={post.id || index} className="bg-white">
          <BasePostCard post={post} />
        </div>
      ))}
      
      {/* 加载更多提示 */}
      <div className="flex justify-center py-8">
        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          加载更多
        </button>
      </div>
    </div>
  );
}

// 主组件
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const {
    userInfo,
    currentTab,
    currentWorksFilter,
    isLoading,
    error,
    posts,
    isFollowing,
    setUserInfo,
    setCurrentTab,
    setCurrentWorksFilter,
    setIsLoading,
    setError,
    setPosts,
    setIsFollowing,
    toggleFollow,
    resetState,
  } = useUserProfileStore();

  // 获取用户信息
  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userInfo = await mockGetUserInfo(userId);
        setUserInfo(userInfo);
        
        if (userInfo.isFollowing !== undefined) {
          setIsFollowing(userInfo.isFollowing);
        }
      } catch (error) {
        setError('获取用户信息失败');
        console.error('获取用户信息失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [userId, setUserInfo, setIsFollowing, setIsLoading, setError]);

  // 获取帖子列表
  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const posts = await mockGetUserPosts(userId, currentTab, currentWorksFilter);
        setPosts(posts);
      } catch (error) {
        setError('获取帖子列表失败');
        console.error('获取帖子列表失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId, currentTab, currentWorksFilter, setPosts, setIsLoading, setError]);

  // 清理状态
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  // 处理Tab切换
  const handleTabChange = (tab: ProfileTab) => {
    setCurrentTab(tab);
  };

  // 处理作品过滤器切换
  const handleWorksFilterChange = (filter: WorksFilterType) => {
    setCurrentWorksFilter(filter);
  };

  // 处理关注/取消关注
  const handleToggleFollow = () => {
    toggleFollow();
    // 这里应该调用API更新关注状态
    console.log('切换关注状态:', !isFollowing);
  };

  // 处理编辑资料
  const handleEditProfile = () => {
    // 跳转到设置页的编辑资料部分
    navigate('/settings'); // 默认就会打开编辑资料页面
  };

  // 如果没有用户ID，显示错误
  if (!userId) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">用户不存在</h1>
          <p className="text-gray-600">请检查链接是否正确</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (isLoading && !userInfo) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  // 没有用户信息
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">用户不存在</h1>
          <p className="text-gray-600">找不到指定的用户</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 用户信息头部 */}
      <ProfileHeader
        userInfo={userInfo}
        isFollowing={isFollowing}
        onToggleFollow={handleToggleFollow}
        onEditProfile={handleEditProfile}
      />

      {/* Tab切换区域 */}
      <ProfileTabs
        currentTab={currentTab}
        currentWorksFilter={currentWorksFilter}
        onTabChange={handleTabChange}
        onWorksFilterChange={handleWorksFilterChange}
        isCurrentUser={userInfo.isCurrentUser}
      />

      {/* 帖子列表 */}
      <div className="bg-gray-50 min-h-screen">
        <ProfilePostList
          posts={posts}
          currentTab={currentTab}
          currentWorksFilter={currentWorksFilter}
          isLoading={isLoading}
          isCurrentUser={userInfo.isCurrentUser}
        />
    </div>
    </div>
  );
} 