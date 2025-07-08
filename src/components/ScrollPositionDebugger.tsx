import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScrollPositionStore } from '../stores/scrollPositionStore';
import { getCurrentScrollPosition } from '../utils/scrollUtils';

interface ScrollPositionDebuggerProps {
  enabled?: boolean;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const ScrollPositionDebugger: React.FC<ScrollPositionDebuggerProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
}) => {
  const location = useLocation();
  const { positions, currentPath } = useScrollPositionStore();
  const [currentScroll, setCurrentScroll] = useState(getCurrentScrollPosition());
  const [isVisible, setIsVisible] = useState(false);

  // 监听滚动事件更新当前位置
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      setCurrentScroll(getCurrentScrollPosition());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled]);

  if (!enabled) return null;

  const positionStyles: Record<string, React.CSSProperties> = {
    'top-left': { top: 10, left: 10 },
    'top-right': { top: 10, right: 10 },
    'bottom-left': { bottom: 10, left: 10 },
    'bottom-right': { bottom: 10, right: 10 },
  };

  const currentPathData = positions[currentPath];
  const allPaths = Object.keys(positions);

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        maxWidth: '300px',
        cursor: 'pointer',
      }}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
        📍 滚动位置调试器 {isVisible ? '🔽' : '▶️'}
      </div>
      
      {isVisible && (
        <>
          <div style={{ marginBottom: '8px' }}>
            <div><strong>当前路径:</strong> {location.pathname}</div>
            <div><strong>当前位置:</strong> ({currentScroll.x}, {currentScroll.y})</div>
          </div>

          {currentPathData && (
            <div style={{ marginBottom: '8px' }}>
              <div><strong>已保存位置:</strong></div>
              <div>
                x: {currentPathData.scrollPosition.x}, 
                y: {currentPathData.scrollPosition.y}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.7 }}>
                保存时间: {new Date(currentPathData.scrollPosition.timestamp).toLocaleTimeString()}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '8px' }}>
            <div><strong>所有保存的路径 ({allPaths.length}):</strong></div>
            <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '10px' }}>
              {allPaths.map((path) => {
                const data = positions[path];
                return (
                  <div 
                    key={path} 
                    style={{ 
                      padding: '2px 0',
                      opacity: path === currentPath ? 1 : 0.6,
                      backgroundColor: path === currentPath ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    }}
                  >
                    <div>{path}</div>
                    <div style={{ fontSize: '9px' }}>
                      ({data.scrollPosition.x}, {data.scrollPosition.y})
                      - {new Date(data.lastVisited).toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            点击折叠/展开
          </div>
        </>
      )}
    </div>
  );
}; 