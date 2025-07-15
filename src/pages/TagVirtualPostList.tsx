import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { BasePostCard } from '../components/post-card';
import { PostType, type PostTypeValue } from '../components/post-card/post.types';
import { useTagPageStore } from './TagPage.store';
import type { TagPageTab, LatestSubTab, HotSubTab, ContentFilter, ViewMode } from './TagPage.types';
import { useNavigate } from 'react-router-dom';

// 定义返回类型
interface TagPostsResponse {
  list: any[];
  page: number;
  hasMore: boolean;
}

// 模拟获取标签下的帖子数据
const fetchTagPosts = async (
  tagName: string,
  tab: TagPageTab,
  subTab: LatestSubTab | HotSubTab | null,
  contentFilter: ContentFilter,
  pageParam: number = 0
): Promise<TagPostsResponse> => {
  // 这里应该调用真实的API，现在用模拟数据
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const pageSize = 10;
  const posts = Array.from({ length: pageSize }, (_, i) => {
    const postType = getPostTypeByFilter(contentFilter, i);
    const basePost = {
      id: `${tab}-${subTab}-${contentFilter}-${pageParam}-${i}`,
      title: `关于 #${tagName} 的帖子 ${pageParam * pageSize + i + 1}`,
      content: `这是关于 ${tagName} 标签的内容，当前筛选：${tab} - ${subTab} - ${contentFilter}`,
      author: `用户${i + 1}`,
      authorAvatar: `https://picsum.photos/40/40?random=${i}`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      slug: `post-${i}`,
      category: '技术',
      categorySlug: 'tech',
      type: postType,
      tags: [{ id: '1', name: tagName, isPopular: true }],
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
      isFollowing: Math.random() > 0.8,
    };

    // 根据帖子类型添加特定属性
    switch (postType) {
      case PostType.ARTICLE:
        return {
          ...basePost,
          abstract: `这是关于 ${tagName} 的文章摘要...`,
          wordCount: Math.floor(Math.random() * 5000) + 500, // 500-5500字
        };
      case PostType.IMAGE:
        return {
          ...basePost,
          images: [
            {
              url: `https://picsum.photos/400/300?random=${i}`,
              alt: `图片${i}`,
              width: 400,
              height: 300,
            }
          ],
        };
      case PostType.VIDEO:
        return {
          ...basePost,
          video: {
            url: `https://example.com/video${i}.mp4`,
            thumbnail: `https://picsum.photos/400/300?random=${i}`,
            duration: Math.floor(Math.random() * 300) + 30, // 30-330秒
            width: 720,
            height: 480,
          },
        };
      case PostType.DYNAMIC:
        return {
          ...basePost,
          images: Math.random() > 0.5 ? [
            {
              url: `https://picsum.photos/400/300?random=${i}`,
              alt: `动态图片${i}`,
            }
          ] : undefined,
        };
      default:
        return basePost;
    }
  });

  return {
    list: posts,
    page: pageParam,
    hasMore: pageParam < 10, // 模拟最多10页
  };
};

// 根据内容过滤器获取对应的帖子类型
const getPostTypeByFilter = (filter: ContentFilter, index: number): PostTypeValue => {
  switch (filter) {
    case 'image':
      return PostType.IMAGE;
    case 'text':
      return PostType.ARTICLE;
    case 'all':
      // 随机返回不同类型
      const types = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO];
      return types[index % types.length];
    default:
      return PostType.ARTICLE;
  }
};

interface TagVirtualPostListProps {
  tagName: string;
}

export default function TagVirtualPostList({ tagName }: TagVirtualPostListProps) {
  const navigate = useNavigate();
  const {
    currentTab,
    currentLatestSubTab,
    currentHotSubTab,
    currentContentFilter,
    viewMode
  } = useTagPageStore();

  // 本地状态管理点赞状态
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // 确定当前的子tab
  const currentSubTab = useMemo(() => {
    switch (currentTab) {
      case 'latest':
        return currentLatestSubTab;
      case 'hot':
        return currentHotSubTab;
      case 'dynamic':
        return null; // 动态tab没有子分类
      default:
        return null;
    }
  }, [currentTab, currentLatestSubTab, currentHotSubTab]);

  // 生成查询key
  const queryKey = useMemo(() => [
    'tag-posts',
    tagName,
    currentTab,
    currentSubTab,
    currentContentFilter,
  ], [tagName, currentTab, currentSubTab, currentContentFilter]);

  // 使用 React Query 获取数据
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<TagPostsResponse>({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      fetchTagPosts(tagName, currentTab, currentSubTab, currentContentFilter, pageParam as number),
    getNextPageParam: (lastPage: TagPostsResponse) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5分钟内认为数据是新鲜的
  });

  // 展平所有页面的数据
  const allPosts = useMemo(() => {
    return data?.pages.flatMap((page: TagPostsResponse) => page.list) ?? [];
  }, [data]);

  // 过滤帖子类型（对于动态tab，只显示动态类型的帖子）
  const filteredPosts = useMemo(() => {
    if (currentTab === 'dynamic') {
      return allPosts.filter(post => post.type === PostType.DYNAMIC);
    }
    return allPosts;
  }, [allPosts, currentTab]);

  // 虚拟化配置 - 仅在列表视图下使用
  const virtualizer = useWindowVirtualizer({
    count: viewMode === 'list' ? (hasNextPage ? filteredPosts.length + 1 : filteredPosts.length) : 0,
    estimateSize: () => 200,
    overscan: 5,
    getScrollElement: () => window,
    scrollMargin: 0,
  });

  const items = virtualizer.getVirtualItems();

  // 无限滚动逻辑 - 列表视图
  useEffect(() => {
    if (viewMode !== 'list') return;
    
    const [lastItem] = [...items].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= filteredPosts.length - 1 &&
      hasNextPage &&
      !isFetching &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [items, filteredPosts.length, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, viewMode]);

  // 无限滚动逻辑 - 网格视图
  useEffect(() => {
    if (viewMode !== 'grid') return;
    
    const handleScroll = () => {
      if (!hasNextPage || isFetching || isFetchingNextPage) return;
      
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        fetchNextPage();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, viewMode]);

  // 获取类型标签颜色
  const getTypeColor = (postType: PostTypeValue) => {
    switch (postType) {
      case PostType.ARTICLE:
        return 'bg-blue-100 text-blue-800';
      case PostType.IMAGE:
        return 'bg-green-100 text-green-800';
      case PostType.VIDEO:
        return 'bg-purple-100 text-purple-800';
      case PostType.DYNAMIC:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型显示名称
  const getTypeName = (postType: PostTypeValue) => {
    switch (postType) {
      case PostType.ARTICLE:
        return '文章';
      case PostType.IMAGE:
        return '图片';
      case PostType.VIDEO:
        return '视频';
      case PostType.DYNAMIC:
        return '动态';
      default:
        return '未知';
    }
  };

  // 根据帖子类型生成正确的URL
  const getPostDetailUrl = useCallback((post: any) => {
    switch (post.type) {
      case PostType.ARTICLE:
        return `/post/article/${post.id}`;
      case PostType.IMAGE:
        return `/post/image/${post.id}`;
      case PostType.VIDEO:
        return `/post/video/${post.id}`;
      case PostType.DYNAMIC:
        return `/post/dynamic/${post.id}`;
      default:
        return `/post/${post.id}`;
    }
  }, []);

  // 处理帖子点击
  const handlePostClick = useCallback((post: any) => {
    navigate(getPostDetailUrl(post), { state: post });
  }, [navigate, getPostDetailUrl]);

  // 处理用户点击
  const handleUserProfileClick = useCallback((e: React.MouseEvent, post: any) => {
    e.stopPropagation();
    navigate(`/user/${post.author}`);
  }, [navigate]);

  // 处理点赞点击
  const handleLikeClick = useCallback((e: React.MouseEvent, post: any) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击事件
    
    // 更新本地点赞状态
    setLikedPosts(prev => {
      const currentLikeState = prev[post.id] !== undefined ? prev[post.id] : post.isLike;
      const newLikeState = !currentLikeState;
      
      // 在真实场景下，这里应该调用API更新点赞状态
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, post.id);
      
      return {
        ...prev,
        [post.id]: newLikeState
      };
    });
  }, []);

  // 获取帖子当前的点赞状态
  const getPostLikeStatus = useCallback((post: any) => {
    // 如果本地状态中有该帖子的点赞状态，则使用本地状态，否则使用帖子原始状态
    return likedPosts[post.id] !== undefined ? likedPosts[post.id] : post.isLike;
  }, [likedPosts]);

  // 获取内容预览
  const getContentPreview = (content: string) => {
    return content?.substring(0, 150) || '无内容';
  };

  // 网格视图渲染卡片
  const renderGridCard = (post: any) => {
    const isLiked = getPostLikeStatus(post);

    return (
      <div
        key={post.id}
        className="bg-white rounded-md shadow-sm border border-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handlePostClick(post)}
      >
        {/* 卡片内容区域 */}
        <div className="flex-grow relative">
          {/* 图片 / 视频 / 纯文本预览 */}
          {post.type === PostType.IMAGE && post.images && post.images.length > 0 ? (
            <img
              src={post.images[0].url}
              alt={post.images[0].alt || '图片'}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200?text=图片加载失败';
              }}
            />
          ) : post.type === PostType.VIDEO && post.video ? (
            <div className="h-full w-full bg-gray-100 relative">
              <img
                src={post.video.thumbnail}
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
          ) : (
            <div className="p-4 h-full overflow-hidden">
              <p className="text-sm line-clamp-6 text-gray-700">
                {getContentPreview(post.content)}
              </p>
            </div>
          )}
        </div>

        {/* 卡片底部信息区域 */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-base font-medium mb-2 line-clamp-1">{post.title}</h3>

          <div className="flex justify-between items-center text-xs text-gray-500">
            {/* 作者头像 + 名字 */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
              onClick={(e) => handleUserProfileClick(e, post)}
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                <img
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="truncate max-w-[80px]">{post.author}</span>
            </div>

            {/* 点赞按钮 */}
            <span
              className={`flex items-center cursor-pointer ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
              onClick={(e) => handleLikeClick(e, post)}
            >
              <svg
                className="w-4 h-4 mr-0.5"
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
              {/* 动态显示点赞数量，如果点赞了就+1 */}
              {post.likes + (isLiked && !post.isLike ? 1 : 0) - (!isLiked && post.isLike ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">正在加载帖子...</span>
      </div>
    );
  }

  if (filteredPosts.length === 0 && !isFetching) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="bg-gray-100 rounded-lg p-8">
          <p className="text-lg mb-2">暂无相关帖子</p>
          <p className="text-sm">该标签下暂时没有符合条件的内容</p>
        </div>
      </div>
    );
  }

  // 列表视图渲染
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualItem) => {
              const post = filteredPosts[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                  data-index={virtualItem.index}
                  className="mb-4"
                >
                  {post && (
                    <div className="relative">
                      {/* 类型标签 */}
                      <div className="absolute -top-2 -left-2 z-10">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getTypeColor(post.type)}`}
                        >
                          {getTypeName(post.type)}
                        </div>
                      </div>

                      <BasePostCard post={post} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 加载指示器 */}
        {isFetching && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">正在加载更多内容...</span>
          </div>
        )}

        {/* 没有更多内容提示 */}
        {!hasNextPage && filteredPosts.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            <div className="bg-gray-100 rounded-lg p-4">
              🎉 已加载全部内容
            </div>
          </div>
        )}
      </div>
    );
  }

  // 网格视图渲染
  return (
    <div className="py-4">
      {/* 网格视图 */}
      <div className="grid grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* 把每条帖子渲染成卡片 */}
        {filteredPosts.map((post) => (
          <div key={post.id} className="h-auto" style={{ minHeight: '280px' }}>
            {renderGridCard(post)}
          </div>
        ))}

        {/* 加载更多指示器 */}
        {isFetchingNextPage && (
          <div className="col-span-full py-4 flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            <span className="ml-2">加载更多...</span>
          </div>
        )}
      </div>

      {/* 没有更多内容提示 */}
      {!hasNextPage && filteredPosts.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="bg-gray-100 rounded-lg p-4">
            🎉 已加载全部内容
          </div>
        </div>
      )}
    </div>
  );
} 