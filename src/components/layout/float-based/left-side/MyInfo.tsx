export default function MyInfo() {
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/notifications', label: '消息通知' },
    { path: '/messages', label: '私信' },
    { path: '/likes', label: '我的喜欢' },
    { path: '/profile', label: '个人主页' },
    { path: '/creator', label: '创作者中心' },
    { path: '/blocked', label: '屏蔽设置' },
    { path: '/store', label: '店铺' },
    { path: '/settings', label: '设置' },
  ];
  return (
    <div className="bg-white p-4 rounded-b-sm">
      <h1 className="text-lg font-semibold mb-2">Filtera Fanarts</h1>
      <nav className="flex flex-col space-y-1">
        {navItems.map(({ path, label }) => (
          <a
            key={path}
            href={path}
            className="py-1 px-4 transition-colors hover:bg-gray-100 rounded text-sm"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
