import { GlobalSearchBar } from './float-based/right-side';
import { useTagPageStore } from '../../pages/TagPage.store';
import { cn } from '../../utils/cn';

export default function TagPageRightSideBar() {
  const { tagDetail, toggleSubscription, toggleBlock } = useTagPageStore();

  // 处理回到顶部的函数 - 与主页右侧栏相同的实现
  const handleScrollToTop = () => {
    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!tagDetail) {
    return (
      <aside className="w-full flex flex-col pt-4 h-full relative">
        <div className="flex flex-col gap-6 flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
          <GlobalSearchBar />
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
        
        {/* 悬浮固定的Top按钮 - 与主页右侧栏相同的位置和样式 */}
        <button
          onClick={handleScrollToTop}
          className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors absolute bottom-4 left-4 z-50"
        >
          Top
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-full flex flex-col pt-4 h-full relative">
      <div className="flex flex-col gap-6 flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* 搜索框 */}
        <GlobalSearchBar />
        
        {/* 标签信息卡片 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          {/* 标签名称和图标 */}
          <div className="flex items-center space-x-3 mb-4">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: tagDetail.color }}
            >
              #
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900 truncate" title={tagDetail.name}>
                {tagDetail.name.length > 15 ? `${tagDetail.name.slice(0, 15)}...` : tagDetail.name}
              </h2>
              {tagDetail.description && (
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {tagDetail.description}
                </p>
              )}
            </div>
          </div>
          
          {/* 统计信息 */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">浏览量</span>
              <span className="font-semibold text-gray-900">
                {tagDetail.stats.viewCount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">发帖数</span>
              <span className="font-semibold text-gray-900">
                {tagDetail.stats.postCount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">关注者</span>
              <span className="font-semibold text-gray-900">
                {tagDetail.stats.followerCount.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-col gap-2">
            <button
              onClick={toggleSubscription}
              className={cn(
                'w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                tagDetail.isSubscribed
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>{tagDetail.isSubscribed ? '★' : '☆'}</span>
              <span>{tagDetail.isSubscribed ? '已订阅' : '订阅'}</span>
            </button>
            
            <button
              onClick={toggleBlock}
              className={cn(
                'w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors',
                tagDetail.isBlocked
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <span>🚫</span>
              <span>{tagDetail.isBlocked ? '已屏蔽' : '屏蔽'}</span>
            </button>
          </div>
        </div>
        
        {/* 添加底部空间 */}
        <div className="h-16"></div>
      </div>

      {/* 悬浮固定的Top按钮 - 与主页右侧栏相同的位置和样式 */}
      <button
        onClick={handleScrollToTop}
        className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors absolute bottom-4 left-4 z-50"
      >
        Top
      </button>
    </aside>
  );
} 