import { Link } from 'react-router-dom';
import { IconAB2 } from '@tabler/icons-react';

export default function MyInfo() {
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/notifications', label: '消息通知' },
    { path: '/creator-center', label: '创作者中心' },
    { path: '/settings?section=privacy-block', label: '屏蔽管理' },
    { path: '/settings', label: '设置' },
  ];
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm">
      <h1 className="text-lg font-semibold mb-2 pl-4">Filtera Fanarts</h1>
      <nav className="flex flex-col space-y-1">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className="py-2 px-4 w-fit flex gap-2 transition-colors hover:bg-gray-100 rounded-xl text-md"
          >
            <IconAB2 stroke={2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
