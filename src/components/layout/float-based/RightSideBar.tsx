import { GlobalSearchBar, RecentlyViewed, UserProfile } from './right-side';
import LegalInfo from './right-side/LegalInfo'; // 导入新组件
import { useHomePostListStore } from '@pages/home/Home.store.ts';

export default function RightSideBar() {
  const { currentTab, updateScrollOffset } = useHomePostListStore();
  
  // 处理回到顶部的函数 - 改为全局窗口滚动并清除滚动位置记录
  const handleScrollToTop = () => {
    // 清除当前tab的滚动位置记录，防止自动恢复
    updateScrollOffset(currentTab, 0);
    
    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside className="w-full flex flex-col pt-4 h-full relative">
      {/* 主要内容区域 - 添加overflow-x-hidden和scrollbar-hide */}
      <div className="flex flex-col gap-6 flex-grow overflow-y-auto overflow-x-hidden scrollbar-hide">
        <GlobalSearchBar />
        <UserProfile />
        <div className="space-y-2">
          <RecentlyViewed />
          <LegalInfo />
          <div className="h-16"></div> {/* 添加额外滚动空间 */}
        </div>
      </div>

      {/* 悬浮固定的Top按钮 - 调整到左下角，最上层显示 */}
      <button
        onClick={handleScrollToTop}
        className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-gray-50 border border-gray-200 transition-colors absolute bottom-4 left-4 z-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7" />
        </svg>
      </button>
    </aside>
  );
}
