import { CreativeCenter, GlobalSearchBar, MyFavoritePostList, RecentlyViewed } from './right-side';

export default function RightSideBar() {
  return (
    <aside className="w-64 flex flex-col gap-6 pt-6">
      <GlobalSearchBar />
      <CreativeCenter />
      <RecentlyViewed />
      <MyFavoritePostList />
      <div className="bg-white p-4 rounded-b-sm text-center h-[200px]">我是个卑微的广告位</div>
      <button className="bg-blue-500 text-white rounded-full w-12 h-12 text-center">Top</button>
    </aside>
  );
}
