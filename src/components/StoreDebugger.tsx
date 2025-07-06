import React, { useState, useEffect } from 'react';
import { usePostListStore } from '../stores/postListStore';

export const StoreDebugger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentScrollY, setCurrentScrollY] = useState(0);
  const { tabs, activeTab, resetAllTabs, saveScrollPosition } = usePostListStore();

  // 实时更新滚动位置
  useEffect(() => {
    const updateScrollPosition = () => {
      setCurrentScrollY(window.scrollY);
    };

    updateScrollPosition(); // 初始化
    window.addEventListener('scroll', updateScrollPosition);
    
    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
    };
  }, []);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          调试 Store
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Store 状态</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-3">
        <div>
          <strong>当前 Tab:</strong> {activeTab}
        </div>
        
        {Object.entries(tabs).map(([tabName, tabState]) => (
          <div key={tabName} className={`border rounded p-2 ${activeTab === tabName ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="font-semibold text-sm flex justify-between items-center">
              <span>{tabName}</span>
              {activeTab === tabName && <span className="text-blue-500 text-xs">当前</span>}
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>帖子数: {tabState.posts.length}</div>
              <div>页数: {tabState.page}</div>
              <div>还有更多: {tabState.hasMore ? '是' : '否'}</div>
              <div>已初始化: {tabState.initialized ? '是' : '否'}</div>
              <div>加载中: {tabState.loading ? '是' : '否'}</div>
              <div className="font-medium text-blue-600">
                滚动位置: {Math.round(tabState.scrollPosition)}px
              </div>
              <div>总高度: {Math.round(tabState.totalSize)}px</div>
              {tabState.visibleRange && (
                <div>可见范围: {tabState.visibleRange.start}-{tabState.visibleRange.end}</div>
              )}
            </div>
          </div>
        ))}
        
        <div className="text-xs text-gray-500 mb-2 space-y-1">
          <div>当前页面滚动位置: {Math.round(currentScrollY)}px</div>
          <div>当前活跃tab: {activeTab}</div>
          <div>当前tab存储位置: {Math.round(tabs[activeTab].scrollPosition)}px</div>
          <div className={`${Math.abs(currentScrollY - tabs[activeTab].scrollPosition) > 100 ? 'text-red-600' : 'text-green-600'}`}>
            位置偏差: {Math.round(Math.abs(currentScrollY - tabs[activeTab].scrollPosition))}px
          </div>
        </div>
        
        <div className="space-y-2">
          <button
            onClick={() => {
              const currentPos = window.scrollY;
              console.log('[调试] 当前滚动位置:', currentPos);
              console.log('[调试] Store中保存的位置:', tabs[activeTab].scrollPosition);
              // 立即保存当前位置
              saveScrollPosition(activeTab, currentPos);
              console.log('[调试] 已立即保存当前位置');
            }}
            className="w-full bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
          >
            立即保存当前位置
          </button>
          
          <button
            onClick={() => {
              window.scrollTo({ top: window.scrollY + 500, behavior: 'smooth' });
            }}
            className="w-full bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
          >
            向下滚动 500px
          </button>
          
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
          >
            回到顶部
          </button>
          
          <button
            onClick={() => {
              console.log('[调试] 当前所有 tab 状态:', tabs);
              console.log('[调试] LocalStorage 内容:', localStorage.getItem('post-list-storage'));
            }}
            className="w-full bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
          >
            打印调试信息
          </button>
          
          <button
            onClick={resetAllTabs}
            className="w-full bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            重置所有数据
          </button>
        </div>
      </div>
    </div>
  );
}; 