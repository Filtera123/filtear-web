import React, { useCallback, useEffect } from 'react';
import { useHomePostListStore } from '@pages/home/Home.store.ts';
import type { HomeTabs } from '@pages/home/type.ts';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { BasePostCard } from '../../components/post-card';
import { PostType, type PostTypeValue } from '../../components/post-card/post.types';
import { fetchTweets } from './data.mock';
import PostArea from './PostArea';

// 获取类型配置
const getTypeConfig = (type: HomeTabs) => {
  const configs = {
    recommended: {
      name: '推荐',
      loadingText: '加载更多精彩内容...',
      completedText: '已加载全部推荐内容！',
      emptyText: '暂无推荐内容',
      pageSize: 8,
      maxPages: 20, // 增加最大页数以测试虚拟滚动
    },
    subscriptions: {
      name: '订阅',
      loadingText: '加载更多订阅内容...',
      completedText: '已加载全部订阅内容！',
      emptyText: '暂无订阅内容',
      pageSize: 6,
      maxPages: 15,
    },
    following: {
      name: '关注',
      loadingText: '加载更多关注内容...',
      completedText: '已加载全部关注内容！',
      emptyText: '暂无关注内容',
      pageSize: 6,
      maxPages: 15,
    },
  };
  return configs[type];
};

interface Props {
  type?: HomeTabs;
}

// 自定义 hook 使用 React Query
const useTweetsInfiniteQuery = (tab: HomeTabs) => {
  return useInfiniteQuery({
    queryKey: ['tweets', tab],
    queryFn: ({ pageParam = 0 }) => fetchTweets(tab, pageParam as number),
    getNextPageParam: (lastPage: any) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 0,
  });
};

const VirtualPostList: React.FC<Props> = () => {
  const { tabs, currentTab, updateScrollOffset, markTabAsVisited } = useHomePostListStore();

  const config = getTypeConfig(currentTab);

  // 使用 React Query 获取数据
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useTweetsInfiniteQuery(currentTab);

  // 展平所有页面的数据
  const allPosts = data?.pages.flatMap((page) => page.list) ?? [];

  const currentTabState = tabs[currentTab];

  // 虚拟化配置
  const virtualizer = useWindowVirtualizer({
    count: hasNextPage ? allPosts.length + 1 : allPosts.length,
    estimateSize: () => 200,
    overscan: 5,
    initialOffset: currentTabState.scrollOffset,
    getScrollElement: () => window,
    scrollMargin: 0,
  });

  const items = virtualizer.getVirtualItems();

  const handleScroll = useCallback(() => {
    updateScrollOffset(currentTab, window.scrollY);
  }, [currentTab, updateScrollOffset]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 切换 tab 时的处理
  useEffect(() => {
    const tabState = tabs[currentTab];

    if (!tabState.visitedBefore) {
      // 首次访问，从顶部开始
      window.scrollTo(0, 0);
      markTabAsVisited(currentTab);
    } else {
      // 已访问过，恢复到上次位置
      setTimeout(() => {
        window.scrollTo(0, tabState.scrollOffset);
      }, 0);
    }
  }, [currentTab, tabs, markTabAsVisited]);

  // 无限滚动逻辑
  useEffect(() => {
    const [lastItem] = [...items].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= allPosts.length - 1 &&
      hasNextPage &&
      !isFetching &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [items, allPosts.length, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);



  return (
    <div className="min-h-screen">
      <PostArea />

      <div
        style={{
          height: `${virtualizer.getTotalSize() + 72 + 24}px`,
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
            const post = allPosts[virtualItem.index];

            return (
              <div
                key={virtualItem.key}
                ref={virtualizer.measureElement}
                data-index={virtualItem.index}
              >
                {post && (
                  <div className="relative">
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderBottomColor: '#7E44C6' }}></div>
          <span className="ml-2 text-gray-600">{config.loadingText}</span>
        </div>
      )}

      {/* 没有更多内容提示 */}
      {!hasNextPage && items.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="bg-gray-100 rounded-lg p-4">🎉 No more data</div>
        </div>
      )}

      {/* 空状态 */}
      {items.length === 0 && !isFetching && (
        <div className="text-center py-8 text-gray-500">{config.emptyText}</div>
      )}
    </div>
  );
};

export default VirtualPostList;
