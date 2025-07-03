import { useCallback, useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  loading: boolean;
  threshold?: number; // 距离底部多少像素时触发加载
  onLoadMore: () => void;
}

export const useInfiniteScroll = ({
  hasMore,
  loading,
  threshold = 200,
  onLoadMore,
}: UseInfiniteScrollOptions) => {
  const loadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    if (loadingRef.current || !hasMore || loading) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    // 当滚动到接近底部时触发加载
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      console.log('触发无限滚动加载');
      onLoadMore();
    }
  }, [hasMore, loading, threshold, onLoadMore]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    loadingRef,
  };
}; 