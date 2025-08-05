import { Link } from 'react-router-dom';
import { 
  IconHome, 
  IconBell, 
  IconUser, 
  IconFilter, 
  IconSettings 
} from '@tabler/icons-react';

export default function MyInfo() {
  const navItems = [
    { path: '/', label: '首页', icon: IconHome },
    { path: '/notifications', label: '消息通知', icon: IconBell },
    { path: '/creator-center', label: '创作者中心', icon: IconUser },
    { path: '/settings?section=privacy-block', label: '屏蔽管理', icon: IconFilter },
    { path: '/settings', label: '设置', icon: IconSettings },
  ];
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm">
      <h1 className="text-lg font-semibold mb-2 pl-4">Filtera Fanarts</h1>
      <nav className="flex flex-col space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className="py-2 px-4 w-full flex gap-2 transition-colors hover:bg-gray-100 rounded-xl text-md"
          >
            <Icon stroke={2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
