import React, { useState, useRef, useEffect } from 'react';
import { getNotificationsByType, getPaginatedNotifications } from '../../mocks/notifications/data';
import NotificationItem from './NotificationItem';

export default function FollowNotifications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isJumpingPage, setIsJumpingPage] = useState(false);
  const [jumpPageInput, setJumpPageInput] = useState('');
  const jumpInputRef = useRef<HTMLInputElement>(null);

  // 获取关注类型的通知
  const filteredNotifications = getNotificationsByType('follow');
  const paginationData = getPaginatedNotifications(filteredNotifications, currentPage, 50);
  const currentNotifications = paginationData.data;
  const totalPages = paginationData.totalPages;

  // 处理页码跳转
  const handlePageJump = () => {
    const pageNum = parseInt(jumpPageInput);
    if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
      alert(`请输入1到${totalPages}之间的有效页码`);
      return;
    }
    setCurrentPage(pageNum);
    setIsJumpingPage(false);
    setJumpPageInput('');
  };

  // 处理跳转输入框的键盘事件
  const handleJumpInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageJump();
    } else if (e.key === 'Escape') {
      setIsJumpingPage(false);
      setJumpPageInput('');
    }
  };

  // 自动聚焦跳转输入框
  useEffect(() => {
    if (isJumpingPage && jumpInputRef.current) {
      jumpInputRef.current.focus();
    }
  }, [isJumpingPage]);

  return (
    <div>
      {/* 消息列表区域 */}
      <div className="min-h-[400px]">
        {currentNotifications.length > 0 ? (
          currentNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <p className="text-lg">暂无粉丝通知</p>
          </div>
        )}
      </div>

      {/* 底部翻页区域 */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
              >
                上一页
              </button>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:bg-gray-100 disabled:text-gray-400 hover:bg-gray-50 transition-colors"
              >
                下一页
              </button>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {isJumpingPage ? (
                <div className="flex items-center space-x-2">
                  <input
                    ref={jumpInputRef}
                    type="number"
                    value={jumpPageInput}
                    onChange={(e) => setJumpPageInput(e.target.value)}
                    onKeyDown={handleJumpInputKeyDown}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                    min="1"
                    max={totalPages}
                  />
                  <button
                    onClick={handlePageJump}
                    className="px-2 py-1 text-white rounded text-xs hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#7E44C6' }}
                  >
                    跳转
                  </button>
                  <button
                    onClick={() => {
                      setIsJumpingPage(false);
                      setJumpPageInput('');
                    }}
                    className="px-2 py-1 border border-gray-300 rounded text-xs hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <span
                  onClick={() => setIsJumpingPage(true)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: '#7E44C6' }}
                >
                  {currentPage}/{totalPages}页
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 