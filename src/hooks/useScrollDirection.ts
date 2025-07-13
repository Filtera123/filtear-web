import { useState, useEffect, useRef } from 'react';

interface UseScrollDirectionOptions {
  threshold?: number; // 滚动阈值，超过这个值才会触发显示/隐藏
  initialDirection?: 'up' | 'down';
}

export function useScrollDirection(options: UseScrollDirectionOptions = {}) {
  const { threshold = 10, initialDirection = 'up' } = options;
  
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>(initialDirection);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      
      // 如果滚动到顶部附近，总是显示
      if (scrollY < threshold) {
        setIsVisible(true);
        setScrollDirection('up');
        lastScrollY.current = scrollY;
        ticking.current = false;
        return;
      }

      // 计算滚动方向
      const direction = scrollY > lastScrollY.current ? 'down' : 'up';
      
      // 只有当滚动距离超过阈值时才更新状态
      if (Math.abs(scrollY - lastScrollY.current) >= threshold) {
        setScrollDirection(direction);
        setIsVisible(direction === 'up');
        lastScrollY.current = scrollY;
      }
      
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScrollDirection);
        ticking.current = true;
      }
    };

    // 初始化
    lastScrollY.current = window.scrollY;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return {
    scrollDirection,
    isVisible,
    scrollY: lastScrollY.current,
  };
} 