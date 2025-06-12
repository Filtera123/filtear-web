import { Outlet } from 'react-router-dom';
import RightSideBar from './RightSideBar';
import SideBar from './SideBar';

export default function Layout() {
  return (
    <div className="relative min-h-screen flex lg:max-w-3/5 mx-auto justify-between ">
      <SideBar />
      <main className="flex-1 px-6">
        <div className="relative py-6 lg:py-10">
          <Outlet />
        </div>
      </main>
      <RightSideBar />
    </div>
  );
}
