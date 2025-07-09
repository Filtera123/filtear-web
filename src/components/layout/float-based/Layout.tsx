import { Outlet } from 'react-router-dom';
import RightSideBar from './RightSideBar';
import SideBar from './SideBar';

export default function FloatBasedLayout() {
  return (
    <div className="relative flex lg:max-w-8/12 mx-auto min-h-screen">
      {/* 左侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="flex-1 sticky top-0 h-screen overflow-hidden border-gray-200 border-r pr-4">
        <SideBar />
      </div>

      {/* 主内容区域 - 使用全局滚动 */}
      <main className="w-[55%] h-full">
        <Outlet />
      </main>

      {/* 右侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="flex-1 sticky top-0 h-screen overflow-hidden border-gray-200 border-l pl-4">
        <RightSideBar />
      </div>
    </div>
  );
}
