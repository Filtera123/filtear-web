import { GlobalSearchBar, RecentlyViewed, UserProfile } from './right-side';
import LegalInfo from './right-side/LegalInfo'; // 导入新组件

export default function RightSideBar() {
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
      <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-colors absolute bottom-4 left-4 z-10">
        Top
      </button>
    </aside>
  );
}
