import { useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollPositionStore } from '../stores/scrollPositionStore';

interface UseScrollRestorationOptions {
  // 是否启用自动保存
  autoSave?: boolean;
  // 保存频率限制（毫秒）
  saveThrottleMs?: number;
  // 恢复延迟（毫秒）
  restoreDelayMs?: number;
  // 恢复最大重试次数
  maxRestoreAttempts?: number;
  // 自定义路径标识符（用于区分相同路由的不同状态，如tab切换）
  customKey?: string;
}

export const useScrollRestoration = (options: UseScrollRestorationOptions = {}) => {
  const {
    autoSave = true,
    saveThrottleMs = 200,
    restoreDelayMs = 100,
    maxRestoreAttempts = 10,
    customKey = '',
  } = options;

  const location = useLocation();
  const {
    saveScrollPosition,
    getScrollPosition,
    setCurrentPath,
    cleanupExpiredPositions,
  } = useScrollPositionStore();

  // 创建路径标识符
  const getPathKey = useCallback(() => {
    const basePath = location.pathname + location.search;
    return customKey ? `${basePath}#${customKey}` : basePath;
  }, [location.pathname, location.search, customKey]);

  // 节流保存的定时器引用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);

  // 保存滚动位置（带节流）
  const saveCurrentScrollPosition = useCallback(() => {
    if (!autoSave) return;

    const now = Date.now();
    if (now - lastScrollTimeRef.current < 50) return; // 最小间隔50ms
    lastScrollTimeRef.current = now;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const pathKey = getPathKey();
      const x = window.scrollX || window.pageXOffset;
      const y = window.scrollY || window.pageYOffset;
      
      // 只在滚动位置大于0时保存
      if (x > 0 || y > 0) {
        saveScrollPosition(pathKey, x, y);
        console.log(`[滚动保存] 保存位置: ${pathKey} -> (${x}, ${y})`);
      }
    }, saveThrottleMs);
  }, [autoSave, saveThrottleMs, getPathKey, saveScrollPosition]);

  // 恢复滚动位置
  const restoreScrollPosition = useCallback(() => {
    const pathKey = getPathKey();
    const savedPosition = getScrollPosition(pathKey);

    if (!savedPosition) {
      console.log(`[滚动恢复] 没有保存的位置: ${pathKey}`);
      return;
    }

    console.log(`[滚动恢复] 尝试恢复位置: ${pathKey} -> (${savedPosition.x}, ${savedPosition.y})`);

    let attempts = 0;
    const attemptRestore = () => {
      attempts++;
      
      // 检查当前位置是否已经接近目标位置
      const currentX = window.scrollX || window.pageXOffset;
      const currentY = window.scrollY || window.pageYOffset;
      
      if (
        Math.abs(currentX - savedPosition.x) < 10 &&
        Math.abs(currentY - savedPosition.y) < 10
      ) {
        console.log(`[滚动恢复] 位置已正确: ${pathKey}`);
        return;
      }

      // 检查页面是否已加载足够内容
      const documentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );

      if (documentHeight < savedPosition.y + window.innerHeight && attempts < maxRestoreAttempts) {
        console.log(`[滚动恢复] 第${attempts}次尝试 - 页面高度不足，等待加载...`);
        setTimeout(attemptRestore, Math.min(attempts * 100, 500));
        return;
      }

      // 执行滚动
      try {
        window.scrollTo({
          left: savedPosition.x,
          top: savedPosition.y,
          behavior: attempts <= 2 ? 'instant' : 'smooth',
        });

        // 验证滚动结果
        setTimeout(() => {
          const newX = window.scrollX || window.pageXOffset;
          const newY = window.scrollY || window.pageYOffset;
          console.log(
            `[滚动恢复] 恢复完成: ${pathKey} -> (${newX}, ${newY}) (目标: ${savedPosition.x}, ${savedPosition.y})`
          );
        }, 50);
      } catch (error) {
        console.warn(`[滚动恢复] 恢复失败:`, error);
      }
    };

    setTimeout(attemptRestore, restoreDelayMs);
  }, [getPathKey, getScrollPosition, restoreDelayMs, maxRestoreAttempts]);

  // 手动保存当前滚动位置
  const saveNow = useCallback(() => {
    const pathKey = getPathKey();
    const x = window.scrollX || window.pageXOffset;
    const y = window.scrollY || window.pageYOffset;
    saveScrollPosition(pathKey, x, y);
    console.log(`[滚动保存] 手动保存: ${pathKey} -> (${x}, ${y})`);
  }, [getPathKey, saveScrollPosition]);

  // 清除当前路径的滚动位置
  const clearCurrent = useCallback(() => {
    const pathKey = getPathKey();
    useScrollPositionStore.getState().clearScrollPosition(pathKey);
    console.log(`[滚动清除] 清除位置: ${pathKey}`);
  }, [getPathKey]);

  // 设置滚动监听器
  useEffect(() => {
    if (!autoSave) return;

    const handleScroll = saveCurrentScrollPosition;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSave, saveCurrentScrollPosition]);

  // 路径变化时的处理
  useEffect(() => {
    const pathKey = getPathKey();
    setCurrentPath(pathKey);

    // 清理过期数据
    cleanupExpiredPositions();

    // 恢复滚动位置
    restoreScrollPosition();

    // 页面卸载时保存位置
    const handleBeforeUnload = () => {
      saveNow();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // 页面切换时保存当前位置
      saveNow();
    };
  }, [location.pathname, location.search, customKey, restoreScrollPosition, saveNow, setCurrentPath, cleanupExpiredPositions, getPathKey]);

  return {
    saveNow,
    clearCurrent,
    restoreScrollPosition,
    pathKey: getPathKey(),
  };
}; 