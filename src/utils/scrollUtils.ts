/**
 * 滚动位置管理的工具函数
 */

// 节流函数
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastCallTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    if (now - lastCallTime >= delay) {
      func(...args);
      lastCallTime = now;
    } else {
      timeoutId = setTimeout(() => {
        func(...args);
        lastCallTime = Date.now();
      }, delay - (now - lastCallTime));
    }
  };
};

// 检查元素是否在视口中
export const isElementInViewport = (element: Element): boolean => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// 获取页面的可滚动高度
export const getScrollableHeight = (): number => {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  );
};

// 获取当前滚动位置
export const getCurrentScrollPosition = () => {
  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
};

// 平滑滚动到指定位置
export const smoothScrollTo = (x: number, y: number, behavior: ScrollBehavior = 'smooth') => {
  try {
    window.scrollTo({
      left: x,
      top: y,
      behavior,
    });
  } catch (error) {
    // 降级处理：如果不支持 smooth behavior，直接跳转
    window.scrollTo(x, y);
  }
};

// 检查是否接近目标位置
export const isNearPosition = (
  current: { x: number; y: number },
  target: { x: number; y: number },
  threshold: number = 10
): boolean => {
  return (
    Math.abs(current.x - target.x) < threshold &&
    Math.abs(current.y - target.y) < threshold
  );
};

// 创建路径标识符
export const createPathKey = (pathname: string, search: string = '', customKey: string = ''): string => {
  const basePath = pathname + search;
  return customKey ? `${basePath}#${customKey}` : basePath;
};

// 延迟执行函数
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// 等待页面高度足够
export const waitForSufficientHeight = async (
  targetHeight: number,
  maxWaitMs: number = 3000,
  checkIntervalMs: number = 100
): Promise<boolean> => {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const currentHeight = getScrollableHeight();
    if (currentHeight >= targetHeight) {
      return true;
    }
    await delay(checkIntervalMs);
  }
  
  return false;
}; 