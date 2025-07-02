import { MyInfo, MySubscriptionsTags } from './left-side';

export default function SideBar() {
  return (
    <aside className="w-64 pt-4 pb-10 flex flex-col h-full overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-6 flex-grow">
        <MyInfo />
        <MySubscriptionsTags />
        {/* 广告位容器 - 添加底部间距并确保完整显示 */}
        <div className="bg-white border border-gray-200 p-4 rounded-b-sm text-center min-h-[200px] flex items-center justify-center mb-4">
          我是个卑微的广告位
        </div>
        {/* 添加额外空间确保滚动到底部时广告位完全可见 */}
        <div className="h-10"></div>
      </div>
    </aside>
  );
}
