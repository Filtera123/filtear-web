import { Outlet } from 'react-router-dom';
import RightSideBar from './RightSideBar';
import SideBar from './SideBar';

export default function FloatBasedLayout() {
  return (
    <div className="relative h-screen flex lg:max-w-4/5 mx-auto justify-between overflow-hidden">
      {/* 将 lg:max-w-3/5 改为 lg:max-w-4/5 */}
      <SideBar />
      <main className="flex-1 px-3 h-full">
        <Outlet />
      </main>
      <RightSideBar />
    </div>
  );
}
