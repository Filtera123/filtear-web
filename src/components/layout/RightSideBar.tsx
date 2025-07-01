import { UserProfile, GlobalSearchBar, RecentlyViewed, LegalInfo } from './right-side';

export default function RightSideBar() {
  const handleScrollToTop = () => {
    // 优先尝试找到主内容滚动容器
    const mainElement = document.querySelector('main');
    
    if (mainElement) {
      // 滚动主内容区域到顶部
      mainElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // 添加视觉反馈
      console.log('滚动到主内容区域顶部');
    } else {
      // 备选方案：尝试其他可能的滚动容器
      const contentContainer = document.querySelector('[class*="overflow-y-auto"]');
      const bodyElement = document.body;
      
      if (contentContainer && contentContainer !== mainElement) {
        contentContainer.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log('滚动到内容容器顶部');
      } else {
        // 最后备选方案：滚动整个窗口
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        console.log('滚动到窗口顶部');
      }
    }
  };

  return (
    <aside className="w-64 flex flex-col pt-6 h-full relative">
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
      
      {/* 悬浮固定的Top按钮 - 调整到左下角 */}
      <button 
        onClick={handleScrollToTop}
        className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 absolute bottom-4 left-4 z-10 transform hover:scale-105"
        title="回到顶部"
      >
        <svg 
          className="w-5 h-5" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M5 10l7-7m0 0l7 7m-7-7v18" 
          />
        </svg>
      </button>
    </aside>
  );
}
