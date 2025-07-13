import { Outlet } from 'react-router-dom';
import SideBar from './float-based/SideBar';
import TagPageRightSideBar from './TagPageRightSideBar';

export default function TagPageLayout() {
  return (
    <div className="relative flex lg:max-w-4/5 mx-auto min-h-screen">
      {/* 左侧边栏 - 使用sticky定位，允许内部滚动，保持绝对宽度不变 */}
      <div className="w-[20%] sticky top-0 h-screen overflow-hidden border-gray-200 border-r pr-4">
        <SideBar />
      </div>

      {/* 主内容区域 - 与首页中间区域保持一致的宽度 */}
      <main className="w-[55%] h-full">
        <Outlet />
      </main>

      {/* 右侧边栏 - 与首页布局一致，包含搜索框和标签信息 */}
      <div className="w-[25%] sticky top-0 h-screen overflow-hidden border-gray-200 border-l pl-4">
        <TagPageRightSideBar />
      </div>
    </div>
  );
} 