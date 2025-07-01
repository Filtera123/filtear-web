import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAccount, setActiveAccount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 账号数据：第一个为当前登录账号，后续为其他可切换账号
  const accounts = [
    { nickname: '用户名', id: '@user12345', avatar: 'https://picsum.photos/id/64/40/40' },
    { nickname: '测试用户', id: '@testuser', avatar: 'https://picsum.photos/id/65/40/40' },
  ];

  // 点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 获取当前登录账号信息
  const currentAccount = accounts[activeAccount];
  // 获取其他账号列表（排除当前登录账号）
  const otherAccounts = accounts.filter((_, index) => index !== activeAccount);

  return (
    <div className="w-64 bg-white p-4 rounded-b-sm relative" ref={containerRef}>
      {/* 用户信息头部 - 显示当前登录账号 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Link to="/profile" className="flex items-center">
          <img
            src={currentAccount.avatar}
            alt="User Avatar"
            className="rounded-full w-10 h-10 mr-2"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm">{currentAccount.nickname}</span>
            <span className="text-xs text-gray-500">{currentAccount.id}</span>
          </div>
        </Link>
        <svg
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* 弹窗式下拉菜单 - 仅显示其他账号 */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-b-sm border border-gray-200 z-10 overflow-hidden">
          {otherAccounts.length > 0 ? (
            <div className="p-2 space-y-1">
              {otherAccounts.map((account, _index) => (
                <div 
                  key={account.id} 
                  className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 查找原始数组中的索引
                    const originalIndex = accounts.findIndex((item) => item.id === account.id);
                    setActiveAccount(originalIndex);
                    setIsExpanded(false);
                  }}
                >
                  <img
                    src={account.avatar}
                    alt={account.nickname}
                    className="rounded-full w-8 h-8 mr-2"
                  />
                  <div>
                    <span className="text-sm">{account.nickname}</span>
                    <p className="text-xs text-gray-500">{account.id}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 text-center text-sm text-gray-500">暂无其他账号</div>
          )}

          <div className="border-t">
            <button className="w-full text-left text-sm text-blue-500 hover:bg-gray-100 p-3">
              添加更多账号
            </button>
          </div>

          <div className="border-t">
            <button className="w-full text-left text-sm text-red-500 hover:bg-gray-100 p-3">
              退出登录
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
