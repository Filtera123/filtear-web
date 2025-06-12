import { cn } from '@utils/cn';
import { Link, useLocation } from 'react-router-dom';
import { MyInfo, MySubscriptionsTags } from './left-side';

export default function SideBar() {
  return (
    <aside className="w-64 pt-6  flex flex-col gap-6">
      <MyInfo />
      <MySubscriptionsTags />
    </aside>
  );
}
