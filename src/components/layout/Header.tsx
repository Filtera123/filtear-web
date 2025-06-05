import { cn } from '@utils/cn';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页' },
    { path: '/about', label: '关于' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container h-14 max-w-screen-2xl">
        <div className="flex h-14 items-center justify-between">
          <Link
            to="/"
            className="mr-6 flex items-center space-x-2 font-bold text-primary-600 hover:text-primary-700 transition-colors"
          >
            <span className="text-lg">My App</span>
          </Link>

          <nav className="flex items-center space-x-6 text-sm">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  location.pathname === path ? 'text-foreground font-medium' : 'text-foreground/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </nav>
    </header>
  );
}
