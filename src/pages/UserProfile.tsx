import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileHeader from './user-profile/ProfileHeader';
import ProfilePostList from './user-profile/ProfilePostList';
import ProfileTabs from './user-profile/ProfileTabs';
import { mockGetUserInfo, mockGetUserPosts, useUserProfileStore } from './UserProfile.store';
import type { ProfileTab, ViewMode, WorksFilterType } from './UserProfile.types';

// 主组件
export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const {
    userInfo,
    currentTab,
    currentWorksFilter,
    viewMode,
    isLoading,
    error,
    posts,
    isFollowing,
    setUserInfo,
    setCurrentTab,
    setCurrentWorksFilter,
    setViewMode,
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

        const userData = await mockGetUserInfo(userId);

        // 如果API返回了用户信息，则设置状态
        if (userData) {
          setUserInfo(userData);

          if (userData.isFollowing !== undefined) {
            setIsFollowing(userData.isFollowing);
          }
        } else {
          // 如果API明确返回null表示用户不存在
          setError('找不到指定的用户');
        }
      } catch (error) {
        // 处理网络错误、服务器错误等
        setError('获取用户信息失败，请稍后再试');
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

  // 处理视图模式切换
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
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
      <div className="flex items-center justify-center py-20 bg">
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

  // 如果不是加载中，但没有用户信息，且没有错误信息，则继续等待数据
  if (!userInfo && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">正在获取用户信息...</span>
        </div>
      </div>
    );
  }

  // 确保用户信息存在
  if (!userInfo) {
    // 这种情况通常不会发生，因为前面已经处理了所有情况
    // 但为了类型安全和以防万一，我们仍然添加这个检查
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">无法加载用户资料</h1>
          <p className="text-gray-600">请刷新页面重试</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            刷新页面
          </button>
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
        viewMode={viewMode}
        onTabChange={handleTabChange}
        onWorksFilterChange={handleWorksFilterChange}
        onViewModeChange={handleViewModeChange}
        isCurrentUser={userInfo.isCurrentUser}
      />

      {/* 帖子列表 */}
      <div className="bg-gray-50 min-h-screen">
        <ProfilePostList
          posts={posts}
          currentTab={currentTab}
          currentWorksFilter={currentWorksFilter}
          viewMode={viewMode}
          isLoading={isLoading}
          isCurrentUser={userInfo.isCurrentUser}
        />
      </div>
    </div>
  );
}
