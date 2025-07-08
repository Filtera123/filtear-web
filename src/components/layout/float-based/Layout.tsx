import { Outlet } from 'react-router-dom';
import { ScrollRestoration } from '../../ScrollRestoration';
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
        {/* 为每个页面提供独立的滚动位置管理 */}
        <ScrollRestoration>
          <Outlet />
        </ScrollRestoration>
      </main>
      
      {/* 右侧边栏 - 使用sticky定位，允许内部滚动 */}
      <div className="w-64 sticky top-0 h-screen overflow-hidden">
        <RightSideBar />
      </div>
    </div>
  );
}
