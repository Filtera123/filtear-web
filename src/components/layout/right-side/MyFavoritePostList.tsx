import { cn } from '@utils/cn';
import { Link, useLocation } from 'react-router-dom';

export default function MyFavoritePostList() {
  const location = useLocation();

  const navItems = [
    { path: '/favorite/1', label: '我的收藏 1' },
    { path: '/favorite/2', label: '我的收藏 2' },
    { path: '/favorite/3', label: '我的收藏 3' },
  ];

  return (
    <div className=" bg-white rounded-b-sm p-4">
      <h1>我的收藏</h1>
      <nav className="flex flex-col p-4">
        {navItems.map(({ path, label }) => (
          <Link key={path} to={path}>
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
