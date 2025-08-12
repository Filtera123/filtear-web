import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

export default function UserProfile() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeAccount, setActiveAccount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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

  // 处理退出登录点击 - 显示确认弹窗
  const handleLogout = () => {
    setIsExpanded(false);
    setShowLogoutConfirm(true);
  };

  // 确认退出登录
  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    // 清除登录状态
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    // 跳转到登录页
    navigate('/login');
  };

  // 取消退出登录
  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  // 禁用背景滚动
  useEffect(() => {
    if (showLogoutConfirm) {
      // 保存当前滚动位置
      const scrollY = window.scrollY;
      const body = document.body;
      
      // 获取滚动条宽度
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // 禁用滚动并防止内容跳动
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        // 恢复滚动
        body.style.position = '';
        body.style.top = '';
        body.style.width = '';
        body.style.overflow = '';
        body.style.paddingRight = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [showLogoutConfirm]);

  return (
    <div className=" bg-white p-4 relative border border-gray-200 rounded-sm" ref={containerRef}>
      {/* 用户信息头部 - 显示当前登录账号 */}
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Link to="/user/user123" className="flex items-center">
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
        <div className="flex items-center">
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* 弹窗式下拉菜单 - 仅显示其他账号 */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-b-sm border border-gray-200 z-10 overflow-hidden">
          {otherAccounts.length > 0 ? (
            <div className="p-2 space-y-1">
              {otherAccounts.map((account) => (
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
            <button className="w-full text-left text-sm hover:bg-gray-100 p-3" style={{ color: '#7E44C6' }}>
              添加更多账号
            </button>
          </div>

          <div className="border-t">
            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-500 hover:bg-gray-100 p-3"
            >
              退出登录
            </button>
          </div>
        </div>
      )}

      {/* 退出登录确认弹窗 */}
      {showLogoutConfirm && createPortal(
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30" 
          style={{ 
            zIndex: 9999, 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh'
          }}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">确认退出登录</h3>
            <p className="text-gray-600 mb-6">您确定要退出当前账号吗？退出后需要重新登录才能继续使用。</p>
            <div className="flex space-x-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                确认退出
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
