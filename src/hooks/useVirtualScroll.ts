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
  itemHeights: Map<number, number>;
  averageHeight: number;
  startOffset: number;
  endOffset: number;
  disableTransition: boolean; // 禁用过渡动画
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
  const offsetCacheRef = useRef<Map<number, number>>(new Map());
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 虚拟滚动状态
  const [state, setState] = useState<VirtualScrollState>({
    scrollTop: 0,
    isScrolling: false,
    visibleRange: { start: 0, end: 0 },
    totalHeight: 0,
    itemHeights: new Map(),
    averageHeight: itemHeight,
    startOffset: 0,
    endOffset: 0,
    disableTransition: false,
  });

  // 计算项目的累积偏移量
  const calculateItemOffset = useCallback((index: number): number => {
    // 使用缓存提高性能
    if (offsetCacheRef.current.has(index)) {
      return offsetCacheRef.current.get(index)!;
    }

    let offset = 0;
    const itemHeights = itemHeightsRef.current;

    for (let i = 0; i < index; i++) {
      offset += itemHeights.get(i) || state.averageHeight;
    }

    offsetCacheRef.current.set(index, offset);
    return offset;
  }, [state.averageHeight]);

  // 根据滚动位置计算可见项目范围
  const calculateVisibleRange = useCallback((scrollTop: number) => {
    if (totalItems === 0) {
      return { start: 0, end: 0 };
    }

    const containerHeight = window.innerHeight;
    const itemHeights = itemHeightsRef.current;
    let start = 0;
    let end = 0;

    // 找到第一个可见项目
    let accumulatedHeight = 0;
    for (let i = 0; i < totalItems; i++) {
      const currentItemHeight = itemHeights.get(i) || state.averageHeight;
      if (accumulatedHeight + currentItemHeight > scrollTop) {
        start = i;
        break;
      }
      accumulatedHeight += currentItemHeight;
    }

    // 找到最后一个可见项目
    let visibleHeight = 0;
    for (let i = start; i < totalItems; i++) {
      const currentItemHeight = itemHeights.get(i) || state.averageHeight;
      visibleHeight += currentItemHeight;
      if (visibleHeight > containerHeight) {
        end = i + 1;
        break;
      }
    }

    // 如果没有找到结束位置，说明所有项目都可见
    if (end === 0) {
      end = totalItems;
    }

    // 添加缓冲区
    const bufferedStart = Math.max(0, start - overscan);
    const bufferedEnd = Math.min(totalItems, end + overscan);

    return { start: bufferedStart, end: bufferedEnd };
  }, [totalItems, state.averageHeight, overscan]);

  // 更新平均高度
  const updateAverageHeight = useCallback(() => {
    const itemHeights = itemHeightsRef.current;
    if (itemHeights.size > 0) {
      const totalHeight = Array.from(itemHeights.values()).reduce((sum, height) => sum + height, 0);
      const averageHeight = totalHeight / itemHeights.size;
      
      setState(prev => ({
        ...prev,
        averageHeight: Math.max(averageHeight, 100), // 最小高度100px
      }));
    }
  }, []);

  // 计算总高度
  const calculateTotalHeight = useCallback(() => {
    const itemHeights = itemHeightsRef.current;
    let totalHeight = 0;

    for (let i = 0; i < totalItems; i++) {
      totalHeight += itemHeights.get(i) || state.averageHeight;
    }

    return totalHeight;
  }, [totalItems, state.averageHeight]);

  // 滚动事件处理
  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const visibleRange = calculateVisibleRange(scrollTop);
    
    // 计算起始和结束偏移
    const startOffset = calculateItemOffset(visibleRange.start);
    const endOffset = calculateTotalHeight() - calculateItemOffset(visibleRange.end);

    setState(prev => ({
      ...prev,
      scrollTop,
      isScrolling: true,
      visibleRange,
      startOffset,
      endOffset,
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
  }, [
    calculateVisibleRange,
    calculateItemOffset,
    calculateTotalHeight,
    onLoadMore,
    hasMore,
    loading,
    threshold,
  ]);

  // 测量项目高度
  const measureItem = useCallback((index: number, element: HTMLElement) => {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const height = rect.height;
    
    // 只有当高度有意义时才更新
    if (height > 0) {
      const currentHeight = itemHeightsRef.current.get(index);
      
      // 只有当高度发生明显变化时才更新缓存（避免1-2px的微小差异）
      if (currentHeight === undefined || Math.abs(currentHeight - height) > 2) {
        itemHeightsRef.current.set(index, height);
        
        // 清除相关的偏移缓存
        for (let i = index; i < totalItems; i++) {
          offsetCacheRef.current.delete(i);
        }
        
        // 使用防抖来更新状态，避免频繁重新渲染
        if (!updateTimeoutRef.current) {
          updateTimeoutRef.current = setTimeout(() => {
            updateAverageHeight();
            
            const visibleRange = calculateVisibleRange(state.scrollTop);
            const startOffset = calculateItemOffset(visibleRange.start);
            const endOffset = calculateTotalHeight() - calculateItemOffset(visibleRange.end);
            
            setState(prev => ({
              ...prev,
              visibleRange,
              startOffset,
              endOffset,
              totalHeight: calculateTotalHeight(),
            }));
            
            updateTimeoutRef.current = null;
          }, 16); // 提高到60fps，让动画更流畅
        }
      }
    }
  }, [totalItems, state.scrollTop, updateAverageHeight, calculateVisibleRange, calculateItemOffset, calculateTotalHeight]);

  // 强制重新测量指定项目的高度
  const forceRemeasure = useCallback((index: number) => {
    // 防止频繁调用，添加防抖，但缩短时间以支持实时动画
    const now = Date.now();
    const lastMeasureKey = `measure_${index}`;
    const lastMeasureTime = (window as any)[lastMeasureKey] || 0;
    
    if (now - lastMeasureTime < 50) { // 缩短到50ms，允许更频繁的更新
      return;
    }
    (window as any)[lastMeasureKey] = now;
    
    console.log(`[虚拟滚动] 强制重新测量帖子 ${index} 的高度`);
    
    // 清除该项目的高度缓存，强制重新测量
    itemHeightsRef.current.delete(index);
    
    // 清除相关的偏移缓存
    for (let i = index; i < totalItems; i++) {
      offsetCacheRef.current.delete(i);
    }
    
    // 立即更新，让位置调整与动画同步
    requestAnimationFrame(() => {
      setState(prev => ({
        ...prev,
        totalHeight: calculateTotalHeight(),
      }));
    });
  }, [totalItems, calculateTotalHeight]);

  // 滚动到指定项目
  const scrollToItem = useCallback((index: number, align: 'start' | 'center' | 'end' = 'start') => {
    const offset = calculateItemOffset(index);
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
  }, [calculateItemOffset, state.averageHeight]);

  // 滚动到顶部
  const scrollToTop = useCallback(() => {
    console.log('[虚拟滚动] 返回顶部，重置状态和缓存');
    
    // 立即重置虚拟滚动状态并禁用过渡动画
    setState(prev => ({
      ...prev,
      scrollTop: 0,
      isScrolling: false,
      visibleRange: { start: 0, end: Math.min(totalItems, overscan * 2) },
      startOffset: 0,
      endOffset: calculateTotalHeight() - (calculateItemOffset(Math.min(totalItems, overscan * 2)) || 0),
      disableTransition: true, // 临时禁用过渡动画
    }));
    
    // 清除所有缓存，强制重新测量
    offsetCacheRef.current.clear();
    
    // 停止任何正在进行的测量更新
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    if (isScrollingTimeoutRef.current) {
      clearTimeout(isScrollingTimeoutRef.current);
      isScrollingTimeoutRef.current = null;
    }
    
    // 滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    
    // 在滚动完成后重新计算可见范围并重新启用过渡动画
    setTimeout(() => {
      const visibleRange = calculateVisibleRange(0);
      const startOffset = 0;
      const endOffset = calculateTotalHeight() - calculateItemOffset(visibleRange.end);
      
      setState(prev => ({
        ...prev,
        scrollTop: 0,
        isScrolling: false,
        visibleRange,
        startOffset,
        endOffset,
        disableTransition: false, // 重新启用过渡动画
      }));
    }, 100);
  }, [totalItems, overscan, calculateTotalHeight, calculateItemOffset, calculateVisibleRange]);

  // 监听滚动事件
  useEffect(() => {
    const handleScrollThrottled = () => {
      handleScroll();
    };

    window.addEventListener('scroll', handleScrollThrottled, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollThrottled);
  }, [handleScroll]);

  // 当总项目数变化时重新计算
  useEffect(() => {
    const visibleRange = calculateVisibleRange(state.scrollTop);
    const totalHeight = calculateTotalHeight();
    
    setState(prev => ({
      ...prev,
      visibleRange,
      totalHeight,
    }));
  }, [totalItems, calculateVisibleRange, calculateTotalHeight, state.scrollTop]);

  // 计算可见项目数组
  const visibleItems = useMemo(() => {
    const items = [];
    for (let i = state.visibleRange.start; i < state.visibleRange.end; i++) {
      items.push(i);
    }
    return items;
  }, [state.visibleRange]);

  // 容器样式
  const containerStyle: React.CSSProperties = {
    height: state.totalHeight,
    position: 'relative',
    overflow: 'hidden',
  };

  // 项目样式
  const itemStyle = useCallback((index: number): React.CSSProperties => {
    const offset = calculateItemOffset(index);
    
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      transform: `translateY(${offset}px)`,
      willChange: 'transform',
    };
  }, [calculateItemOffset]);

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
    disableTransition: state.disableTransition,
  };
} 