import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface User {
  id: string;
  nickname: string;
  username: string;
  avatar: string;
  bio: string;
  isFollowing: boolean;
  isVerified?: boolean;
  followerCount: number;
}

// 模拟API调用
const fetchFollowList = async (userId: string, type: 'followers' | 'following'): Promise<User[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 模拟数据
  return Array.from({ length: 15 }, (_, i) => ({
    id: `user_${type}_${i}`,
    nickname: type === 'followers' ? `鸡娜加客凉皮` : `欧梦到西洲-Adventure`,
    username: `@user${i + 1}`,
    avatar: `https://picsum.photos/60/60?random=${i + 1}`,
    bio: type === 'followers' ? '暂无简介' : 'I am a writer 平时喜欢写写小说 超爱汉服系 身在江南，北京也算我的第二故乡',
    isFollowing: Math.random() > 0.5,
    isVerified: Math.random() > 0.7,
    followerCount: Math.floor(Math.random() * 1000),
  }));
};

export default function FollowListPage() {
  const { userId, type } = useParams<{ userId: string; type: 'followers' | 'following' }>();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'followers' | 'following'>(type || 'followers');

  // 获取用户列表
  useEffect(() => {
    if (userId) {
      setLoading(true);
      fetchFollowList(userId, selectedTab)
        .then(setUsers)
        .finally(() => setLoading(false));
    }
  }, [userId, selectedTab]);

  const handleUserClick = (user: User) => {
    navigate(`/user/${user.id}`);
  };

  const handleFollowToggle = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing }
        : user
    ));
  };

  const formatNumber = (num: number): string => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleTabSwitch = (newType: 'followers' | 'following') => {
    setSelectedTab(newType);
    // 更新URL但不触发页面重新加载
    navigate(`/user/${userId}/${newType}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* 返回按钮 */}
          <button
            onClick={handleGoBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>返回</span>
          </button>

          {/* Tab切换 */}
          <div className="flex space-x-8">
            <button
              onClick={() => handleTabSwitch('followers')}
              className={`py-2 text-base font-medium border-b-2 transition-colors ${
                selectedTab === 'followers'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              关注
            </button>
            <button
              onClick={() => handleTabSwitch('following')}
              className={`py-2 text-base font-medium border-b-2 transition-colors ${
                selectedTab === 'following'
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              粉丝
            </button>
          </div>

          {/* 右侧占位，保持居中对齐 */}
          <div className="w-16"></div>
        </div>
      </div>

      {/* 用户列表 */}
      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3">
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  {/* 用户头像 */}
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.nickname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {user.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* 用户信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 truncate">{user.nickname}</span>
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-1">{user.bio}</div>
                    <div className="text-sm text-gray-500 mt-1">粉丝 {formatNumber(user.followerCount)}</div>
                  </div>
                </div>

                {/* 关注按钮 */}
                <button
                  onClick={() => handleFollowToggle(user.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors border ${
                    user.isFollowing
                      ? 'bg-white text-orange-500 border-orange-500 hover:bg-orange-50'
                      : 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {user.isFollowing ? '已关注' : '关注'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-lg">暂无{selectedTab === 'followers' ? '关注者' : '粉丝'}</p>
          </div>
        )}
      </div>
    </div>
  );
} 