import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { IconHeart, IconMessage, IconRepeat, IconBookmark } from '@tabler/icons-react';
import { Tabs } from '@chakra-ui/react';

// Define types for different result categories
type User = {
  id: string;
  name: string;
  username?: string;
  avatar: string;
};

type Tag = {
  name: string;
  count: number;
};

type Post = {
  id: string;
  title: string;
  content: string;
  images?: string[];
  user: User;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
};

type Activity = {
  id: string;
  content: string;
  user: User;
  createdAt: string;
};

// Define search tab types
const SEARCH_TABS = {
  All: 'all',
  Tags: 'tags',
  Posts: 'posts',
  Activities: 'activities',
  Users: 'users',
} as const;

type SearchTab = (typeof SEARCH_TABS)[keyof typeof SEARCH_TABS];

// Mock data source - in real app this would come from API
const allTags: Tag[] = [
  { name: '#日语摄影青年', count: 17839 },
  { name: '#日语摄影展示', count: 5810 },
  { name: '#日语摄影使用', count: 3074 },
  { name: '#摄影技巧', count: 12560 },
  { name: '#日语摄影OC', count: 1962 },
  { name: '#风景摄影', count: 8924 },
  { name: '#人像摄影', count: 9876 },
  { name: '#动物摄影', count: 6543 },
  { name: '#日常摄影', count: 7412 },
  { name: '#旅行摄影', count: 11234 },
  { name: '#黑白摄影', count: 4321 },
  { name: '#胶片摄影', count: 5642 },
  { name: '#城市摄影', count: 7823 },
  { name: '#微距摄影', count: 3412 },
  { name: '#星空摄影', count: 2894 },
];

const allUsers: User[] = [
  { id: '1', name: '日语摄影', username: '@shishizhingyuan45980', avatar: 'https://example.com/avatar1.jpg' },
  { id: '2', name: '风景摄影师', username: '@landscape26449', avatar: 'https://example.com/avatar2.jpg' },
  { id: '3', name: '人像艺术家', username: '@portrait69278', avatar: 'https://example.com/avatar3.jpg' },
  { id: '4', name: '旅行摄影', username: '@travel88386', avatar: 'https://example.com/avatar4.jpg' },
  { id: '5', name: '城市记录者', username: '@cityscape79681', avatar: 'https://example.com/avatar5.jpg' },
  { id: '6', name: '微距世界', username: '@macro69383', avatar: 'https://example.com/avatar6.jpg' },
  { id: '7', name: '黑白艺术', username: '@blackwhiteart', avatar: 'https://example.com/avatar7.jpg' },
  { id: '8', name: '胶片时光', username: '@filmera', avatar: 'https://example.com/avatar8.jpg' },
  { id: '9', name: '自然光影', username: '@naturallight30843', avatar: 'https://example.com/avatar9.jpg' },
  { id: '10', name: '星空追逐者', username: '@stargazer', avatar: 'https://example.com/avatar10.jpg' },
];

const allPosts: Post[] = [
  {
    id: '1',
    title: '如何拍摄日落美景',
    content: '分享一些拍摄绝美日落的实用技巧，包括光圈设置、快门速度和构图建议。',
    user: allUsers[1],
    createdAt: '2023-11-24',
    likes: 150,
    comments: 35,
    shares: 12,
    images: ['https://example.com/sunset.jpg']
  },
  {
    id: '2',
    title: '城市街拍入门指南',
    content: '城市街拍需要敏锐的观察力和快速的反应，本文分享如何捕捉城市中稍纵即逝的精彩瞬间。',
    user: allUsers[4],
    createdAt: '2023-11-23',
    likes: 89,
    comments: 17,
    shares: 5,
    images: ['https://example.com/street.jpg']
  },
  {
    id: '3',
    title: '星空摄影器材推荐',
    content: '分享适合星空摄影的相机、镜头和三脚架，以及如何选择适合的拍摄地点和时间。',
    user: allUsers[9],
    createdAt: '2023-11-22',
    likes: 210,
    comments: 42,
    shares: 19,
    images: ['https://example.com/stars.jpg']
  },
  {
    id: '4',
    title: '人像摄影用光技巧',
    content: '好的光线是人像摄影的灵魂，本文介绍自然光和人工光的运用技巧，以及如何塑造不同风格的人像光效。',
    user: allUsers[2],
    createdAt: '2023-11-20',
    likes: 178,
    comments: 29,
    shares: 15,
    images: ['https://example.com/portrait.jpg']
  },
  {
    id: '5',
    title: '微距摄影的世界',
    content: '探索微距摄影的奇妙世界，从昆虫到花朵，分享如何用微距镜头捕捉细微之处的壮丽景象。',
    user: allUsers[5],
    createdAt: '2023-11-18',
    likes: 132,
    comments: 23,
    shares: 8,
    images: ['https://example.com/macro.jpg']
  }
];

const allActivities: Activity[] = [
  {
    id: '1',
    content: '刚刚参加了一个风景摄影工作坊，学到了很多实用技巧！',
    user: allUsers[1],
    createdAt: '2024-01-22'
  },
  {
    id: '2',
    content: '分享一组城市夜景作品，请大家多多指教。',
    user: allUsers[4],
    createdAt: '2024-01-21'
  },
  {
    id: '3',
    content: '昨晚拍摄的银河，感谢老天爷给了一个晴朗的夜空！',
    user: allUsers[9],
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    content: '最近尝试了一些新的人像光线设置，效果出乎意料的好。',
    user: allUsers[2],
    createdAt: '2024-01-19'
  },
  {
    id: '5',
    content: '新入手了一个微距镜头，花了一天时间在花园里拍摄小昆虫。',
    user: allUsers[5],
    createdAt: '2024-01-18'
  },
  {
    id: '6',
    content: '黑白摄影真的能让照片更具情感和故事性。',
    user: allUsers[6],
    createdAt: '2024-01-17'
  }
];

const SearchResults: React.FC = () => {
  const { query = '' } = useParams<{ query: string }>();
  const [activeTab, setActiveTab] = useState<SearchTab>(SEARCH_TABS.All);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Define tabs
  const tabs = [
    {
      key: SEARCH_TABS.All,
      name: '综合',
    },
    {
      key: SEARCH_TABS.Tags,
      name: '标签',
    },
    {
      key: SEARCH_TABS.Posts,
      name: '作品',
    },
    {
      key: SEARCH_TABS.Activities,
      name: '动态',
    },
    {
      key: SEARCH_TABS.Users,
      name: '用户',
    },
  ];
  
  // Filter results based on search query
  const filteredTags = useMemo(() => {
    if (!query) return [];
    return allTags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);
  
  const filteredUsers = useMemo(() => {
    if (!query) return [];
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) || 
      (user.username && user.username.toLowerCase().includes(query.toLowerCase()))
    );
  }, [query]);
  
  const filteredPosts = useMemo(() => {
    if (!query) return [];
    return allPosts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      post.content.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);
  
  const filteredActivities = useMemo(() => {
    if (!query) return [];
    return allActivities.filter(activity => 
      activity.content.toLowerCase().includes(query.toLowerCase()) || 
      activity.user.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  useEffect(() => {
    // Simulate API request
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const renderTabContent = () => {
    if (loading) {
      return <div className="py-8 text-center">加载中...</div>;
    }

    // If no results for any category
    if (filteredTags.length === 0 && 
        filteredUsers.length === 0 && 
        filteredPosts.length === 0 && 
        filteredActivities.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">没有找到与 "{query}" 相关的内容</p>
        </div>
      );
    }

    switch (activeTab) {
      case SEARCH_TABS.Tags:
        return renderTagsTab();
      case SEARCH_TABS.Posts:
        return renderPostsTab();
      case SEARCH_TABS.Activities:
        return renderActivitiesTab();
      case SEARCH_TABS.Users:
        return renderUsersTab();
      case SEARCH_TABS.All:
      default:
        return renderAllTab();
    }
  };

  const renderAllTab = () => {
    // Only show sections that have results
    return (
      <div className="space-y-6">
        {filteredTags.length > 0 && renderTagsPreview()}
        {filteredPosts.length > 0 && renderPostsPreview()}
        {filteredUsers.length > 0 && renderUsersPreview()}
        {filteredActivities.length > 0 && renderActivitiesPreview()}
      </div>
    );
  };

  const renderTagsTab = () => {
    if (filteredTags.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">没有找到与 "{query}" 相关的标签</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">热度</h3>
            <div className="text-sm text-gray-500">热度排序 从高到低</div>
          </div>
          <div className="grid grid-cols-1 gap-y-4">
            {filteredTags.map((tag) => (
              <div key={tag.name} className="flex justify-between items-center p-4 bg-white hover:bg-gray-50 rounded-md cursor-pointer">
                <div className="text-base">{tag.name}</div>
                <div className="text-sm text-gray-500">{tag.count}帖子</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPostsTab = () => {
    if (filteredPosts.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">没有找到与 "{query}" 相关的作品</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="text-xl font-medium mb-2">{post.title}</div>
              <div className="mb-4">{post.content}</div>
              {post.images && post.images.length > 0 && (
                <div className="mb-4">
                  <img src={post.images[0]} alt={post.title} className="w-full h-48 object-cover rounded-md" />
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center"><IconHeart size={16} className="mr-1" /> {post.likes}</span>
                  <span className="flex items-center"><IconMessage size={16} className="mr-1" /> {post.comments}</span>
                  <span className="flex items-center"><IconRepeat size={16} className="mr-1" /> {post.shares}</span>
                </div>
                <div>{post.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActivitiesTab = () => {
    if (filteredActivities.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">没有找到与 "{query}" 相关的动态</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-y-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="bg-white p-4 rounded-md shadow-sm">
              <div className="flex items-center mb-3">
                <img 
                  src={activity.user.avatar} 
                  alt={activity.user.name} 
                  className="w-10 h-10 rounded-full mr-3"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'}
                />
                <div>
                  <div className="font-medium">{activity.user.name}</div>
                  <div className="text-sm text-gray-500">{activity.user.username}</div>
                </div>
                <div className="ml-auto text-sm text-gray-500">{activity.createdAt}</div>
              </div>
              <div className="mb-4">{activity.content}</div>
              <div className="flex justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center"><IconHeart size={16} className="mr-1" /> 0</span>
                  <span className="flex items-center"><IconMessage size={16} className="mr-1" /> 0</span>
                  <span className="flex items-center"><IconRepeat size={16} className="mr-1" /> 0</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsersTab = () => {
    if (filteredUsers.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-gray-500">没有找到与 "{query}" 相关的用户</p>
        </div>
      );
    }
    
    return (
      <div className="mt-4">
        <div className="grid grid-cols-1 gap-y-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="bg-white p-4 rounded-md shadow-sm flex items-center">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-12 h-12 rounded-full mr-3"
                onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48'}
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-gray-500">{user.username}</div>
              </div>
              <button className="ml-auto px-4 py-1 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
                关注
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Preview sections for the "All" tab
  const renderTagsPreview = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">相关标签</h3>
          <button 
            className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#7E44C6' }}
            onClick={() => setActiveTab(SEARCH_TABS.Tags)}
          >
            查看全部
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredTags.slice(0, 5).map((tag) => (
            <div 
              key={tag.name} 
              className="bg-gray-100 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-200"
            >
              {tag.name} <span className="text-gray-500">({tag.count})</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPostsPreview = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">相关作品</h3>
          <button 
            className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#7E44C6' }}
            onClick={() => setActiveTab(SEARCH_TABS.Posts)}
          >
            查看全部
          </button>
        </div>
        <div className="space-y-4">
          {filteredPosts.slice(0, 2).map((post) => (
            <div key={post.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="text-lg font-medium mb-2">{post.title}</div>
              <div className="text-sm text-gray-600 mb-2">{post.content}</div>
              <div className="flex justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-2">
                  <span className="flex items-center"><IconHeart size={14} className="mr-1" /> {post.likes}</span>
                  <span className="flex items-center"><IconMessage size={14} className="mr-1" /> {post.comments}</span>
                </div>
                <div>{post.createdAt}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUsersPreview = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">相关用户</h3>
          <button 
            className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#7E44C6' }}
            onClick={() => setActiveTab(SEARCH_TABS.Users)}
          >
            查看全部
          </button>
        </div>
        <div className="space-y-3">
          {filteredUsers.slice(0, 3).map((user) => (
            <div key={user.id} className="flex items-center">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-10 h-10 rounded-full mr-3"
                onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40'}
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-gray-500">{user.username}</div>
              </div>
              <button className="ml-auto px-3 py-1 border border-gray-300 rounded-full text-xs hover:bg-gray-100">
                关注
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderActivitiesPreview = () => {
    return (
      <div className="bg-white p-4 rounded-md shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">相关动态</h3>
          <button 
            className="text-sm hover:opacity-80 transition-opacity" style={{ color: '#7E44C6' }}
            onClick={() => setActiveTab(SEARCH_TABS.Activities)}
          >
            查看全部
          </button>
        </div>
        <div className="space-y-3">
          {filteredActivities.slice(0, 2).map((activity) => (
            <div key={activity.id} className="border-b pb-3 last:border-b-0 last:pb-0">
              <div className="flex items-center mb-2">
                <img 
                  src={activity.user.avatar} 
                  alt={activity.user.name} 
                  className="w-8 h-8 rounded-full mr-2"
                  onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32'}
                />
                <div className="text-sm font-medium">{activity.user.name}</div>
                <div className="ml-auto text-xs text-gray-500">{activity.createdAt}</div>
              </div>
              <div className="text-sm">{activity.content}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full relative">
      {/* Tab navigation similar to home page */}
      <Tabs.Root
        defaultValue={activeTab}
        onValueChange={(details) => {
          setActiveTab(details.value as SearchTab);
        }}
        className="sticky top-0 bg-white/75 z-50 backdrop-blur-sm"
        size="lg"
      >
        <Tabs.List className="flex justify-center items-center gap-4">
          {tabs.map((tab) => (
            <Tabs.Trigger key={tab.key} value={tab.key}>
              {tab.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>
      
      {/* Search results content */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SearchResults; 