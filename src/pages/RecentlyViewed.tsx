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
import { mockPosts } from '@/mocks/post/data';
import { useCommentStore } from '@/components/comment/Comment.store';

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

const convertBrowsingRecordToPostItem = (record: BrowsingRecord, storeComments: Record<string, any> = {}): PostItem => {
  // 尝试从mockPosts中找到真实的帖子数据
  const realPost = mockPosts.find(post => post.id === record.id);
  
  // 基于帖子ID生成固定的数据，确保数据一致性
  const idHash = generateHashFromString(record.id);
  const authorHash = generateHashFromString(record.author);
  
  // 获取评论数据：优先使用store中的数据，然后是真实帖子的评论，最后是空数组
  const commentList = storeComments[record.id] || realPost?.commentList || [];
  
  const basePost = {
    id: record.id,
    author: record.author,
    authorAvatar: record.authorAvatar || realPost?.authorAvatar || `https://via.placeholder.com/40x40?text=${record.author[0]}`,
    authorIpLocation: realPost?.authorIpLocation || getRandomIpLocation(idHash),
    createdAt: realPost?.createdAt || record.viewTime,
    updatedAt: realPost?.updatedAt || record.viewTime,
    slug: realPost?.slug || `browsing-${record.id}`,
    summary: (realPost as any)?.abstract || record.title,
    category: realPost?.category || typeDisplayMap[record.type],
    categorySlug: realPost?.categorySlug || record.type,
    title: record.title,
    tags: realPost?.tags || [{ 
      id: record.type, 
      name: typeDisplayMap[record.type],
      color: '#7E44C6'
    }],
    isLike: realPost?.isLike || false,
    // 优先使用真实数据，否则使用固定生成的数据
    likes: realPost?.likes || ((idHash % 50) + 10), // 10-59的固定点赞数
    comments: commentList.length || realPost?.comments || ((idHash % 20) + 5), // 使用真实评论数量
    commentList: commentList,
    views: realPost?.views || ((idHash % 200) + 50), // 50-249的固定浏览数
    isFollowing: realPost?.isFollowing || ((authorHash % 10) < 3), // 基于作者ID生成固定的关注状态（30%概率）
  };

  // 根据类型返回不同的PostItem
  switch (record.type) {
    case 'article':
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: realPost?.content || record.title,
        abstract: (realPost as any)?.abstract || `这是一篇关于${record.title}的文章...`,
        wordCount: (realPost as any)?.wordCount || ((idHash % 3000) + 1000), // 基于ID生成固定字数
      };
    
    case 'image':
      // 确保图片帖子至少有一张图片，避免详情页出错
      const defaultThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format';
      return {
        ...basePost,
        type: PostType.IMAGE,
        content: realPost?.content || record.title,
        images: (realPost as any)?.images || [{
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
        content: realPost?.content || record.title,
        video: (realPost as any)?.video || {
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
        content: realPost?.content || record.title,
        images: (realPost as any)?.images || (record.thumbnail ? [{
          url: record.thumbnail,
          alt: record.title,
        }] : undefined),
      };
    
    default:
      return {
        ...basePost,
        type: PostType.ARTICLE,
        content: realPost?.content || record.title,
        abstract: (realPost as any)?.abstract || `这是一篇关于${record.title}的内容...`,
        wordCount: (realPost as any)?.wordCount || ((idHash % 2000) + 500), // 基于ID生成固定字数
      };
  }
};

export default function RecentlyViewed() {
  const { records, removeRecord, cleanupDuplicates } = useBrowsingHistoryStore();
  const { comments: storeComments } = useCommentStore();
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
      const converted = convertBrowsingRecordToPostItem(record, storeComments);
      // 为每个帖子添加来源页面信息
      return {
        ...converted,
        fromPage: '/recently-viewed'
      };
    });
    return items;
  }, [sortedRecords, storeComments]);

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

  // 处理BasePostCard的点赞
  const handleBasePostLike = useCallback((post: PostItem) => {
    setLikedPosts(prev => {
      const currentLikeState = prev[post.id] !== undefined ? prev[post.id] : false;
      const newLikeState = !currentLikeState;
      
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, post.id);
      
      return {
        ...prev,
        [post.id]: newLikeState
      };
    });
  }, []);

  // 处理BasePostCard的用户点击
  const handleBasePostUserClick = useCallback((userId: string) => {
    navigate(`/user/${userId}`);
  }, [navigate]);

  // 处理BasePostCard的帖子点击
  const handleBasePostClick = useCallback((post: PostItem) => {
    // 根据帖子类型跳转到相应的详情页
    let detailUrl = '';
    switch (post.type) {
      case PostType.ARTICLE:
        detailUrl = `/post/article/${post.id}`;
        break;
      case PostType.IMAGE:
        detailUrl = `/post/image/${post.id}`;
        break;
      case PostType.VIDEO:
        detailUrl = `/post/video/${post.id}`;
        break;
      case PostType.DYNAMIC:
        detailUrl = `/post/dynamic/${post.id}`;
        break;
      default:
        detailUrl = `/post/article/${(post as any).id}`;
    }
    navigate(detailUrl, { state: post });
  }, [navigate]);

  // 处理BasePostCard的评论添加
  const handleBasePostAddComment = useCallback((postId: string, content: string) => {
    console.log('在最近浏览页面添加评论:', postId, content);
    // 这里可以添加评论逻辑，或者跳转到详情页
  }, []);

  // 处理BasePostCard的评论点赞
  const handleBasePostLikeComment = useCallback((commentId: string) => {
    console.log('点赞评论:', commentId);
  }, []);

  // 处理BasePostCard的回复评论
  const handleBasePostReplyComment = useCallback((commentId: string, content: string) => {
    console.log('回复评论:', commentId, content);
  }, []);



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
                  ? 'bg-purple-50 border-purple-200 text-purple-600'
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
              {postItems.map((postItem) => {
                // 更新帖子的点赞状态
                const updatedPost = {
                  ...postItem,
                  isLike: likedPosts[postItem.id] !== undefined ? likedPosts[postItem.id] : false
                };
                
                return (
                  <BasePostCard 
                    key={postItem.id} 
                    post={updatedPost}
                    onLike={() => handleBasePostLike(updatedPost)}
                    onUserClick={() => handleBasePostUserClick(updatedPost.author)}
                    onPostClick={() => handleBasePostClick(updatedPost)}
                    onAddComment={handleBasePostAddComment}
                    onLikeComment={handleBasePostLikeComment}
                    onReplyComment={handleBasePostReplyComment}
                  />
                );
              })}
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
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#7E44C6' }}
            >
              去首页浏览
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 