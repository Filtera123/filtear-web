import { useState, useRef, useCallback, useEffect } from 'react';

interface UseDynamicHeightOptions {
  defaultExpanded?: boolean;
  animationDuration?: number;
}

interface UseDynamicHeightReturn {
  isExpanded: boolean;
  measuredHeight: number | null;
  isLoading: boolean;
  measureRef: React.RefObject<HTMLDivElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  remeasure: () => Promise<void>;
  getContainerStyle: () => React.CSSProperties;
}

export function useDynamicHeight({
  defaultExpanded = false,
  animationDuration = 300,
}: UseDynamicHeightOptions = {}): UseDynamicHeightReturn {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const measureRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 测量内容高度
  const remeasure = useCallback(async (): Promise<void> => {
    if (!measureRef.current) return;

    setIsLoading(true);
    
    // 等待DOM更新
    await new Promise(resolve => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve);
      });
    });
    
    try {
      const height = measureRef.current.scrollHeight;
      setMeasuredHeight(height);
    } catch (error) {
      console.warn('高度测量失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 展开
  const expand = useCallback(async () => {
    setIsExpanded(true);
    // 立即触发测量
    setTimeout(remeasure, 0);
  }, [remeasure]);

  // 收起
  const collapse = useCallback(() => {
    setIsExpanded(false);
    setMeasuredHeight(null);
  }, []);

  // 切换展开收起状态
  const toggle = useCallback(() => {
    if (isExpanded) {
      collapse();
    } else {
      expand();
    }
  }, [isExpanded, expand, collapse]);

  // 计算容器样式
  const getContainerStyle = useCallback((): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transition: `height ${animationDuration}ms ease-in-out`,
      overflow: 'hidden',
    };

    if (!isExpanded) {
      return {
        ...baseStyle,
        height: 0,
      };
    }

    if (measuredHeight !== null && !isLoading) {
      return {
        ...baseStyle,
        height: measuredHeight,
      };
    }

    // 正在测量中或首次展开
    return {
      ...baseStyle,
      height: 'auto',
      overflow: 'visible',
    };
  }, [isExpanded, measuredHeight, isLoading, animationDuration]);

  return {
    isExpanded,
    measuredHeight,
    isLoading,
    measureRef,
    containerRef,
    toggle,
    expand,
    collapse,
    remeasure,
    getContainerStyle,
  };
} 