import { useCallback, useEffect, useRef } from 'react';
import { useScrollPositionStore } from '../stores/scrollPositionStore';

interface UseTabScrollRestorationOptions {
  // 基础路径（通常是页面路径）
  basePath: string;
  // 当前活跃的tab
  activeTab: string;
  // 保存频率限制（毫秒）
  saveThrottleMs?: number;
  // 恢复延迟（毫秒）
  restoreDelayMs?: number;
}

export const useTabScrollRestoration = ({
  basePath,
  activeTab,
  saveThrottleMs = 200,
  restoreDelayMs = 150,
}: UseTabScrollRestorationOptions) => {
  const {
    saveScrollPosition,
    getScrollPosition,
  } = useScrollPositionStore();

  // 创建tab的路径标识符
  const getTabKey = useCallback((tab: string) => {
    return `${basePath}#tab-${tab}`;
  }, [basePath]);

  // 节流保存的定时器引用
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollTimeRef = useRef<number>(0);
  const previousTabRef = useRef<string>(activeTab);

  // 保存当前tab的滚动位置（带节流）
  const saveCurrentTabPosition = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollTimeRef.current < 50) return; // 最小间隔50ms
    lastScrollTimeRef.current = now;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const tabKey = getTabKey(activeTab);
      const x = window.scrollX || window.pageXOffset;
      const y = window.scrollY || window.pageYOffset;
      
      // 只在滚动位置大于0时保存
      if (x > 0 || y > 0) {
        saveScrollPosition(tabKey, x, y);
        console.log(`[Tab滚动保存] ${tabKey} -> (${x}, ${y})`);
      }
    }, saveThrottleMs);
  }, [activeTab, getTabKey, saveScrollPosition, saveThrottleMs]);

  // 恢复指定tab的滚动位置
  const restoreTabPosition = useCallback((tab: string) => {
    const tabKey = getTabKey(tab);
    const savedPosition = getScrollPosition(tabKey);

    if (!savedPosition) {
      console.log(`[Tab滚动恢复] 没有保存的位置: ${tabKey}`);
      return;
    }

    console.log(`[Tab滚动恢复] 恢复位置: ${tabKey} -> (${savedPosition.x}, ${savedPosition.y})`);

    let attempts = 0;
    const maxAttempts = 8;

    const attemptRestore = () => {
      attempts++;
      
      // 检查当前位置是否已经接近目标位置
      const currentX = window.scrollX || window.pageXOffset;
      const currentY = window.scrollY || window.pageYOffset;
      
      if (
        Math.abs(currentX - savedPosition.x) < 10 &&
        Math.abs(currentY - savedPosition.y) < 10
      ) {
        console.log(`[Tab滚动恢复] 位置已正确: ${tabKey}`);
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

      if (documentHeight < savedPosition.y + window.innerHeight && attempts < maxAttempts) {
        console.log(`[Tab滚动恢复] 第${attempts}次尝试 - 页面高度不足，等待加载...`);
        setTimeout(attemptRestore, Math.min(attempts * 100, 400));
        return;
      }

      // 执行滚动恢复
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
            `[Tab滚动恢复] 完成: ${tabKey} -> (${newX}, ${newY}) (目标: ${savedPosition.x}, ${savedPosition.y})`
          );
        }, 50);
      } catch (error) {
        console.warn(`[Tab滚动恢复] 失败:`, error);
      }
    };

    setTimeout(attemptRestore, restoreDelayMs);
  }, [getTabKey, getScrollPosition, restoreDelayMs]);

  // 手动保存指定tab的位置
  const saveTabPosition = useCallback((tab: string) => {
    const tabKey = getTabKey(tab);
    const x = window.scrollX || window.pageXOffset;
    const y = window.scrollY || window.pageYOffset;
    saveScrollPosition(tabKey, x, y);
    console.log(`[Tab滚动保存] 手动保存: ${tabKey} -> (${x}, ${y})`);
  }, [getTabKey, saveScrollPosition]);

  // 清除指定tab的滚动位置
  const clearTabPosition = useCallback((tab: string) => {
    const tabKey = getTabKey(tab);
    useScrollPositionStore.getState().clearScrollPosition(tabKey);
    console.log(`[Tab滚动清除] 清除位置: ${tabKey}`);
  }, [getTabKey]);

  // 监听滚动事件，自动保存当前tab的位置
  useEffect(() => {
    const handleScroll = saveCurrentTabPosition;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveCurrentTabPosition]);

  // 当activeTab变化时，保存上一个tab的位置并恢复新tab的位置
  useEffect(() => {
    const previousTab = previousTabRef.current;
    
    if (previousTab !== activeTab) {
      // 保存上一个tab的位置
      if (previousTab) {
        const prevTabKey = getTabKey(previousTab);
        const x = window.scrollX || window.pageXOffset;
        const y = window.scrollY || window.pageYOffset;
        if (x > 0 || y > 0) {
          saveScrollPosition(prevTabKey, x, y);
          console.log(`[Tab切换] 保存 ${prevTabKey} 位置: (${x}, ${y})`);
        }
      }

      // 恢复新tab的位置
      setTimeout(() => {
        restoreTabPosition(activeTab);
      }, 50); // 给一点时间让DOM更新

      previousTabRef.current = activeTab;
    }
  }, [activeTab, getTabKey, saveScrollPosition, restoreTabPosition]);

  return {
    saveTabPosition,
    clearTabPosition,
    restoreTabPosition,
    saveCurrentTabPosition,
  };
}; 