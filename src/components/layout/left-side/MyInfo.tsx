export default function MyInfo() {
  const navItems = [
    { path: '/', label: '首页' },
    { path: '/about', label: '个人主页' },
    { path: '/about', label: '消息通知' },
    { path: '/about', label: '私信' },
    { path: '/about', label: '设置' },
  ];
  return (
    <div className="bg-white p-4 rounded-b-sm">
      <h1 className="text-lg font-semibold mb-4">创意星球</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map(({ path, label }) => (
          <a
            key={path}
            href={path}
            className="py-2 px-4 transition-colors hover:bg-gray-100 rounded"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
