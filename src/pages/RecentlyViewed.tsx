import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrowsingHistoryStore, type BrowsingRecord } from '@/stores/browsingHistoryStore';
import { Image } from '@/components/ui';
import MasonryLayout from '@/components/ui/MasonryLayout';
import TumblrCard from '@/components/ui/TumblrCard';
import { PostType, type PostItem } from '@/components/post-card/post.types';
import { BasePostCard } from '@/components/post-card';
import { cn } from '@/utils/cn';
import { getRandomIpLocation } from '@/utils/mockData';

// 视图模式类型
type ViewMode = 'list' | 'grid';

const VIEW_MODES = {
  List: 'list' as const,
  Grid: 'grid' as const,
};

// 从localStorage获取保存的视图模式
const getSavedViewMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem('recentlyViewedMode');
    return (saved === 'grid' || saved === 'list') ? saved : VIEW_MODES.List;
  } catch {
    return VIEW_MODES.List;
  }
};

// 时间格式化工具函数
const formatViewTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 3) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

// 将浏览记录转换为PostItem格式
// 基于字符串生成固定的hash值
const generateHashFromString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

const convertBrowsingRecordToPostItem = (record: BrowsingRecord): PostItem => {
  // 基于帖子ID生成固定的数据，确保数据一致性
  const idHash = generateHashFromString(record.id);
  const authorHash = generateHashFromString(record.author);
  
  const basePost = {
    id: record.id,
    author: record.author,
    authorAvatar: record.authorAvatar || `https://via.placeholder.com/40x40?text=${record.author[0]}`,
    authorIpLocation: getRandomIpLocation(idHash),
    createdAt: record.viewTime,
    updatedAt: record.viewTime,
    slug: `browsing-${record.id}`,
    summary: record.title,
    category: typeDisplayMap[record.type],
    categorySlug: record.type,
    title: record.title,
    tags: [{ 
      id: record.type, 
      name: typeDisplayMap[record.type],
      color: '#3b82f6'
    }],
    isLike: false,
    // 基于ID生成固定的数据，而不是随机数据
    likes: (idHash % 50) + 10, // 10-59的固定点赞数
    comments: (idHash % 20) + 5, // 5-24的固定评论数 
    commentList: [],
    views: (idHash % 200) + 50, // 50-249的固定浏览数
    isFollowing: (authorHash % 10) < 3, // 基于作者ID生成固定的关注状态（30%概率）
  };

  // 根据类型返回不同的PostItem
  switch (record.type) {
    case 'article':
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: record.title,
        abstract: `这是一篇关于${record.title}的文章...`,
        wordCount: (idHash % 3000) + 1000, // 基于ID生成固定字数
      };
    
    case 'image':
      // 确保图片帖子至少有一张图片，避免详情页出错
      const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format';
      return {
        ...basePost,
        type: PostType.IMAGE,
        content: record.title,
        images: [{
          url: record.thumbnail || defaultThumbnail,
          alt: record.title || '图片内容',
          width: 800,
          height: 600,
        }],
      };
    
    case 'video':
      return {
        ...basePost,
        type: PostType.VIDEO,
        content: record.title,
        video: {
          url: 'https://example.com/sample-video.mp4', // 使用示例视频URL
          thumbnail: record.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format',
          duration: 780, // 13分钟转换为秒
          width: 1920,
          height: 1080,
        },
      };
    
    case 'dynamic':
      return {
        ...basePost,
        type: PostType.DYNAMIC,
        content: record.title,
        images: record.thumbnail ? [{
          url: record.thumbnail,
          alt: record.title,
        }] : undefined,
      };
    
    default:
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: record.title,
        abstract: `这是一篇关于${record.title}的内容...`,
        wordCount: (idHash % 2000) + 500, // 基于ID生成固定字数
      };
  }
};

export default function RecentlyViewed() {
  const { records, removeRecord, cleanupDuplicates } = useBrowsingHistoryStore();
  const [viewMode, setViewMode] = useState<ViewMode>(getSavedViewMode());
  
  // 页面加载时清理重复数据
  useEffect(() => {
    cleanupDuplicates();
  }, [cleanupDuplicates]);
  
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // 按时间排序的记录
  const sortedRecords = records
    .slice()
    .sort((a, b) => new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime());

  // 将浏览记录转换为PostItem列表
  const postItems = useMemo(() => {
    const items = sortedRecords.map(record => {
      const converted = convertBrowsingRecordToPostItem(record);
      // 为每个帖子添加来源页面信息
      return {
        ...converted,
        fromPage: '/recently-viewed'
      };
    });
    return items;
  }, [sortedRecords]);

  // 切换视图模式
  const toggleViewMode = () => {
    const newMode = viewMode === VIEW_MODES.List ? VIEW_MODES.Grid : VIEW_MODES.List;
    setViewMode(newMode);
    
    // 保存到localStorage
    try {
      localStorage.setItem('recentlyViewedMode', newMode);
    } catch (error) {
      console.warn('Failed to save view mode to localStorage', error);
    }
  };

  // 处理用户点击
  const handleUserProfileClick = useCallback((e: React.MouseEvent, record: BrowsingRecord) => {
    e.stopPropagation();
    navigate(`/user/${record.author}`);
  }, [navigate]);

  // 获取帖子当前的点赞状态
  const getPostLikeStatus = useCallback((record: BrowsingRecord) => {
    return likedPosts[record.id] !== undefined ? likedPosts[record.id] : false;
  }, [likedPosts]);

  // 处理点赞点击
  const handleLikeClick = useCallback((e: React.MouseEvent, record: BrowsingRecord) => {
    e.stopPropagation();
    
    setLikedPosts(prev => {
      const currentLikeState = prev[record.id] !== undefined ? prev[record.id] : false;
      const newLikeState = !currentLikeState;
      
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, record.id);
      
      return {
        ...prev,
        [record.id]: newLikeState
      };
    });
  }, []);

  // 处理删除记录
  const handleRemoveRecord = useCallback((e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    removeRecord(recordId);
  }, [removeRecord]);

  // Tumblr卡片的点赞处理
  const handleTumblrLikeClick = useCallback((post: PostItem, liked: boolean) => {
    setLikedPosts(prev => ({
      ...prev,
      [post.id]: liked,
    }));
    console.log(`${liked ? '点赞' : '取消点赞'}帖子:`, post.id);
  }, []);

  // Tumblr卡片的用户点击处理
  const handleTumblrUserClick = useCallback((username: string) => {
    navigate(`/user/${username}`);
  }, [navigate]);

  // Tumblr卡片的评论点击处理
  const handleTumblrCommentClick = useCallback((post: PostItem) => {
    // 跳转到详情页并滚动到评论区
    navigate(`/post/${post.id}`, { 
      state: { 
        ...post, 
        scrollToComments: true,
        fromPage: '/recently-viewed' // 记录来源页面
      } 
    });
  }, [navigate]);



  // 网格视图渲染卡片  
  const renderGridCard = (record: BrowsingRecord) => {
    const isLiked = getPostLikeStatus(record);

    return (
      <div
        key={record.id}
        className="bg-white rounded-md shadow-sm border border-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow relative group"
        onClick={() => {
          const postData = convertBrowsingRecordToPostItem(record);
          navigate(record.url, { 
            state: {
              ...postData,
              fromPage: '/recently-viewed' // 记录来源页面
            }
          });
        }}
      >
        {/* 删除按钮 */}
        <button
          onClick={(e) => handleRemoveRecord(e, record.id)}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 text-gray-500 hover:text-red-500 transition-all"
          title="删除此记录"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 卡片内容区域 */}
        <div className="flex-grow relative">
          {/* 图片 / 视频 / 纯文本预览 */}
          {record.type === 'image' && record.thumbnail ? (
            <Image
              src={record.thumbnail}
              alt={record.title}
              className="w-full h-full object-cover"
            />
          ) : record.type === 'video' && record.thumbnail ? (
            <div className="h-full w-full bg-gray-100 relative">
              <Image
                src={record.thumbnail}
                alt="视频缩略图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : record.thumbnail ? (
            <div className="h-full w-full bg-gray-100 relative">
              <Image
                src={record.thumbnail}
                alt={record.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-4 h-full overflow-hidden bg-gray-50">
              <p className="text-sm line-clamp-6 text-gray-700">
                {record.title}
              </p>
            </div>
          )}
        </div>

        {/* 卡片底部信息区域 */}
        <div className="p-3 border-t border-gray-100 bg-white">
          {/* 标题 */}
          <h3 className="text-sm font-medium line-clamp-2 mb-2 text-gray-900">
            {record.title}
          </h3>
          
          {/* 作者信息行 */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span 
              className="truncate hover:text-blue-600 cursor-pointer max-w-[100px]"
              onClick={(e) => handleUserProfileClick(e, record)}
            >
              {record.author}
            </span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full flex-shrink-0">
              {typeDisplayMap[record.type]}
            </span>
          </div>
          
          {/* 底部操作行 */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {formatViewTime(record.viewTime)}
            </span>
            
            {/* 点赞按钮 */}
            <button
              onClick={(e) => handleLikeClick(e, record)}
              className={cn(
                'flex items-center space-x-1 text-xs transition-colors',
                isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              )}
            >
              <svg
                className={cn('w-4 h-4', isLiked ? 'fill-current' : '')}
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span>{isLiked ? 1 : 0}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="w-full">
        {/* 头部 */}
        <div className="mb-6 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">最近浏览</h1>
              <p className="text-gray-500 mt-1">
                共 {records.length} 条浏览记录
              </p>
            </div>
            
            {/* 视图切换按钮 */}
            <button
              onClick={toggleViewMode}
              className={cn(
                'p-2 rounded-md border',
                viewMode === VIEW_MODES.Grid 
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
              aria-label={viewMode === VIEW_MODES.List ? '切换到网格视图' : '切换到列表视图'}
            >
              {viewMode === VIEW_MODES.List ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* 浏览记录 */}
        {sortedRecords.length > 0 ? (
          viewMode === VIEW_MODES.List ? (
            // 列表视图 - 完全复用主页帖子卡片格式
            <div className="space-y-0">
              {postItems.map((postItem) => (
                <BasePostCard key={postItem.id} post={postItem} />
              ))}
            </div>
          ) : (
            // 瀑布流网格视图
            <div className="px-4">
              <MasonryLayout 
                columns={{ default: 2, md: 3, lg: 3, xl: 4 }}
                gap="1rem"
                className="max-w-7xl mx-auto"
              >
                {postItems.map((postItem) => (
                                     <TumblrCard
                     key={postItem.id}
                     post={postItem}
                     onLikeClick={handleTumblrLikeClick}
                     onUserClick={handleTumblrUserClick}
                     onCommentClick={handleTumblrCommentClick}
                     maxImageHeight={400}
                   />
                ))}
              </MasonryLayout>
            </div>
          )
        ) : (
          <div className="bg-white rounded-lg p-8 text-center mx-4">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无浏览记录</h3>
            <p className="text-gray-500 mb-4">
              开始浏览内容后，您的浏览历史将显示在这里
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              去首页浏览
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 