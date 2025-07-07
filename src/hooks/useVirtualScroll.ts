import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// 虚拟滚动配置
interface VirtualScrollConfig {
  itemHeight: number; // 默认项目高度
  overscan?: number; // 超出可视区域的缓冲项目数
  containerHeight?: number; // 容器高度（如果不使用窗口滚动）
  threshold?: number; // 触发加载更多的阈值
  onLoadMore?: () => void; // 加载更多的回调
  hasMore?: boolean; // 是否还有更多数据
  loading?: boolean; // 是否正在加载
}

// 虚拟滚动状态
interface VirtualScrollState {
  scrollTop: number;
  isScrolling: boolean;
  visibleRange: { start: number; end: number };
  totalHeight: number;
  averageHeight: number;
}

// 虚拟滚动返回值
interface VirtualScrollReturn {
  containerStyle: React.CSSProperties;
  itemStyle: (index: number) => React.CSSProperties;
  visibleItems: number[];
  totalHeight: number;
  scrollElementRef: React.RefObject<HTMLDivElement | null>;
  measureItem: (index: number, element: HTMLElement) => void;
  scrollToItem: (index: number, align?: 'start' | 'center' | 'end') => void;
  scrollToTop: () => void;
  isScrolling: boolean;
  visibleRange: { start: number; end: number };
  forceRemeasure: (index: number) => void;
  disableTransition: boolean; // 是否禁用过渡动画
}

export function useVirtualScroll(
  totalItems: number,
  config: VirtualScrollConfig
): VirtualScrollReturn {
  const {
    itemHeight = 400,
    overscan = 5,
    threshold = 200,
    onLoadMore,
    hasMore = true,
    loading = false,
  } = config;

  const scrollElementRef = useRef<HTMLDivElement>(null);
  const isScrollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemHeightsRef = useRef<Map<number, number>>(new Map());
  const measureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 虚拟滚动状态
  const [state, setState] = useState<VirtualScrollState>({
    scrollTop: 0,
    isScrolling: false,
    visibleRange: { start: 0, end: Math.min(totalItems, overscan * 2) },
    totalHeight: 0,
    averageHeight: itemHeight,
  });

  // 计算项目的偏移位置
  const getItemOffset = useCallback((index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemHeightsRef.current.get(i) || state.averageHeight;
    }
    return offset;
  }, [state.averageHeight]);

  // 计算总高度
  const calculateTotalHeight = useCallback(() => {
    let total = 0;
    for (let i = 0; i < totalItems; i++) {
      total += itemHeightsRef.current.get(i) || state.averageHeight;
    }
    return total;
  }, [totalItems, state.averageHeight]);

  // 计算可见范围
  const calculateVisibleRange = useCallback((scrollTop: number) => {
    if (totalItems === 0) {
      return { start: 0, end: 0 };
    }

    const containerHeight = window.innerHeight;
    let start = 0;
    let end = totalItems;

    // 找到第一个可见项目
    let currentOffset = 0;
    for (let i = 0; i < totalItems; i++) {
      const itemHeight = itemHeightsRef.current.get(i) || state.averageHeight;
      if (currentOffset + itemHeight >= scrollTop) {
        start = Math.max(0, i - overscan);
        break;
      }
      currentOffset += itemHeight;
    }

    // 找到最后一个可见项目
    currentOffset = getItemOffset(start);
    for (let i = start; i < totalItems; i++) {
      const itemHeight = itemHeightsRef.current.get(i) || state.averageHeight;
      if (currentOffset > scrollTop + containerHeight + overscan * state.averageHeight) {
        end = Math.min(totalItems, i + overscan);
        break;
      }
      currentOffset += itemHeight;
    }

    return { start, end };
  }, [totalItems, overscan, state.averageHeight, getItemOffset]);

  // 滚动事件处理
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const visibleRange = calculateVisibleRange(scrollTop);
    const totalHeight = calculateTotalHeight();

    setState(prev => ({
      ...prev,
      scrollTop,
      isScrolling: true,
      visibleRange,
      totalHeight,
    }));

    // 触发加载更多
    if (onLoadMore && hasMore && !loading) {
      const { scrollTop: currentScrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollHeight - currentScrollTop <= clientHeight + threshold) {
        onLoadMore();
      }
    }

    // 停止滚动检测
    if (isScrollingTimeoutRef.current) {
      clearTimeout(isScrollingTimeoutRef.current);
    }
    isScrollingTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, isScrolling: false }));
    }, 150);
  }, [calculateVisibleRange, calculateTotalHeight, onLoadMore, hasMore, loading, threshold]);

  // 测量项目高度
  const measureItem = useCallback((index: number, element: HTMLElement) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const height = rect.height;

    if (height > 0) {
      const currentHeight = itemHeightsRef.current.get(index);
      if (currentHeight === undefined || Math.abs(currentHeight - height) > 2) {
        itemHeightsRef.current.set(index, height);

        // 更新平均高度
        const heights = Array.from(itemHeightsRef.current.values());
        const averageHeight = heights.reduce((sum, h) => sum + h, 0) / heights.length;

        // 防抖更新状态
        if (measureTimeoutRef.current) {
          clearTimeout(measureTimeoutRef.current);
        }
        measureTimeoutRef.current = setTimeout(() => {
          const totalHeight = calculateTotalHeight();
          const visibleRange = calculateVisibleRange(state.scrollTop);

          setState(prev => ({
            ...prev,
            averageHeight: Math.max(averageHeight, 100),
            totalHeight,
            visibleRange,
          }));
        }, 50);
      }
    }
  }, [calculateTotalHeight, calculateVisibleRange, state.scrollTop]);

  // 强制重新测量 - 优化版本，保持当前视觉焦点不变
  const forceRemeasure = useCallback((index: number) => {
    // 记录当前滚动状态和视觉锚点
    const currentScrollTop = window.scrollY;
    const currentItemOffset = getItemOffset(index);
    const currentItemHeight = itemHeightsRef.current.get(index) || state.averageHeight;
    
    // 计算当前项目在屏幕中的相对位置
    const itemTopInViewport = currentItemOffset - currentScrollTop;
    const itemBottomInViewport = itemTopInViewport + currentItemHeight;
    const isItemPartiallyVisible = itemTopInViewport < window.innerHeight && itemBottomInViewport > 0;
    
    // 清除该项目的高度缓存
    itemHeightsRef.current.delete(index);
    
    // 使用 requestAnimationFrame 确保在下一帧进行重新计算
    requestAnimationFrame(() => {
      // 获取新的高度（如果DOM已经更新）
      const element = document.querySelector(`[data-post-index="${index}"]`) as HTMLElement;
      if (element) {
        const rect = element.getBoundingClientRect();
        const newHeight = rect.height;
        
        if (newHeight > 0) {
          const heightDiff = newHeight - currentItemHeight;
          
          // 如果当前项目部分可见（用户正在查看），则不调整滚动位置
          // 让内容在原地自然展开，用户可以手动滚动查看新内容
          if (!isItemPartiallyVisible && Math.abs(heightDiff) > 10) {
            // 只有当项目完全不在视口中，且滚动位置在该项目之后时，才调整滚动位置
            // 这样可以防止下方项目位置的突然跳跃
            if (currentScrollTop > currentItemOffset + currentItemHeight) {
              const newScrollTop = currentScrollTop + heightDiff;
              
              window.scrollTo({
                top: Math.max(0, newScrollTop),
                behavior: 'auto'
              });
            }
          }
          
          // 更新高度缓存
          itemHeightsRef.current.set(index, newHeight);
        }
      }
      
      // 重新计算总高度和可见范围
      const totalHeight = calculateTotalHeight();
      const visibleRange = calculateVisibleRange(window.scrollY);
      
      setState(prev => ({
        ...prev,
        totalHeight,
        visibleRange,
      }));
    });
  }, [getItemOffset, state.averageHeight, calculateTotalHeight, calculateVisibleRange]);

  // 滚动到指定项目
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    const offset = getItemOffset(index);
    const itemHeight = itemHeightsRef.current.get(index) || state.averageHeight;
    
    let scrollTop = offset;
    
    if (align === 'center') {
      scrollTop = offset - (window.innerHeight - itemHeight) / 2;
    } else if (align === 'end') {
      scrollTop = offset - (window.innerHeight - itemHeight);
    }
    
    window.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth',
    });
  }, [getItemOffset, state.averageHeight]);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  // 监听滚动事件
  useEffect(() => {
    // 节流滚动事件
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      if (isScrollingTimeoutRef.current) {
        clearTimeout(isScrollingTimeoutRef.current);
      }
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, [handleScroll]);

  // 当总项目数变化时重新计算
  useEffect(() => {
    const totalHeight = calculateTotalHeight();
    const visibleRange = calculateVisibleRange(state.scrollTop);
    
    setState(prev => ({
      ...prev,
      totalHeight,
      visibleRange,
    }));
  }, [totalItems, calculateTotalHeight, calculateVisibleRange, state.scrollTop]);

  // 计算可见项目数组
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = state.visibleRange.start; i < state.visibleRange.end; i++) {
      if (i < totalItems) {
        items.push(i);
      }
    }
    return items;
  }, [state.visibleRange, totalItems]);

  // 容器样式
  const containerStyle: React.CSSProperties = {
    height: state.totalHeight,
    position: 'relative',
  };

  // 项目样式
  const itemStyle = useCallback((index: number): React.CSSProperties => {
    const offset = getItemOffset(index);
    
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      transform: `translateY(${offset}px)`,
      willChange: 'transform',
    };
  }, [getItemOffset]);

  return {
    containerStyle,
    itemStyle,
    visibleItems,
    totalHeight: state.totalHeight,
    scrollElementRef,
    measureItem,
    scrollToItem,
    scrollToTop,
    isScrolling: state.isScrolling,
    visibleRange: state.visibleRange,
    forceRemeasure,
    disableTransition: false, // 简化实现，不使用动态禁用
  };
} 