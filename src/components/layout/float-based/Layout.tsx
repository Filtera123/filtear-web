import { Outlet } from 'react-router-dom';
import RightSideBar from './RightSideBar';
import SideBar from './SideBar';

export default function FloatBasedLayout() {
  return (
    <div className="relative min-h-screen flex lg:max-w-4/5 mx-auto justify-between">
      {/* 左侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="w-64 sticky top-0 h-screen overflow-hidden">
        <SideBar />
      </div>
      
      {/* 主内容区域 - 使用全局滚动 */}
      <main className="flex-1 px-3 min-h-screen">
        <Outlet />
      </main>
      
      {/* 右侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="w-64 sticky top-0 h-screen overflow-hidden">
        <RightSideBar />
      </div>
    </div>
  );
}
