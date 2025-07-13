import React, { useCallback, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { BasePostCard } from '../components/post-card';
import { PostType, type PostTypeValue } from '../components/post-card/post.types';
import { useTagPageStore } from './TagPage.store';
import type { TagPageTab, LatestSubTab, HotSubTab, ContentFilter } from './TagPage.types';

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
  const {
    currentTab,
    currentLatestSubTab,
    currentHotSubTab,
    currentContentFilter,
  } = useTagPageStore();

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

  // 虚拟化配置
  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? filteredPosts.length + 1 : filteredPosts.length,
    estimateSize: () => 200,
    overscan: 5,
    getScrollElement: () => window,
    scrollMargin: 0,
  });

  const items = virtualizer.getVirtualItems();

  // 无限滚动逻辑
  useEffect(() => {
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
  }, [items, filteredPosts.length, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

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