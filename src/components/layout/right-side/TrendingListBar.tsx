import { cn } from '@utils/cn';
import { Link, useLocation } from 'react-router-dom';

export default function TrendingListBar() {
  const location = useLocation();

  const navItems = [
    { path: '/trending', label: 'Trending' },
    { path: '/top', label: 'Top' },
    { path: '/new', label: 'New' },
  ];

  return (
    <div className="w-64 bg-white p-4 rounded-b-sm">
      <h1>热门话题</h1>
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
