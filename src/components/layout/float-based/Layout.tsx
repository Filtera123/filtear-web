import { Outlet } from 'react-router-dom';

import RightSideBar from './RightSideBar';
import SideBar from './SideBar';

export default function FloatBasedLayout() {
  return (
    <div className="relative min-h-screen flex lg:max-w-8/12 mx-auto justify-evenly">
      {/* 左侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="flex-1 sticky top-0 h-screen overflow-hidden">
        <SideBar />
      </div>

      {/* 主内容区域 - 使用全局滚动 */}
      <main className="w-[60%] px-3 min-h-screen">
        <Outlet />
      </main>

      {/* 右侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="flex-1 sticky top-0 h-screen overflow-hidden">
        <RightSideBar />
      </div>
    </div>
  );
}
