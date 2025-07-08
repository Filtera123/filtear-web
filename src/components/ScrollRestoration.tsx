import { useEffect } from 'react';
import { useScrollRestoration } from '../hooks/useScrollRestoration';

interface ScrollRestorationProps {
  children: React.ReactNode;
  // 自定义标识符，用于区分相同路由的不同状态
  customKey?: string;
  // 是否启用自动滚动管理
  enabled?: boolean;
  // 保存频率限制（毫秒）
  saveThrottleMs?: number;
  // 恢复延迟（毫秒）
  restoreDelayMs?: number;
}

export const ScrollRestoration: React.FC<ScrollRestorationProps> = ({
  children,
  customKey,
  enabled = true,
  saveThrottleMs = 200,
  restoreDelayMs = 100,
}) => {
  const { saveNow } = useScrollRestoration({
    autoSave: enabled,
    saveThrottleMs,
    restoreDelayMs,
    customKey,
  });

  // 组件卸载时保存滚动位置
  useEffect(() => {
    if (!enabled) return;

    return () => {
      // 在组件卸载时保存当前位置
      saveNow();
    };
  }, [enabled, saveNow]);

  return <>{children}</>;
};

// HOC 版本，用于包装组件
export const withScrollRestoration = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ScrollRestorationProps, 'children'>
) => {
  const WithScrollRestorationComponent = (props: P) => {
    return (
      <ScrollRestoration {...options}>
        <WrappedComponent {...props} />
      </ScrollRestoration>
    );
  };

  WithScrollRestorationComponent.displayName = `withScrollRestoration(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithScrollRestorationComponent;
}; 