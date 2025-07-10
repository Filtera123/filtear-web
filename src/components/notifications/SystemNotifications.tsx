import React from 'react';
import NotificationItem from './NotificationItem';
import { systemNotifications, type BaseNotification } from '../../mocks/notifications/data';

export function SystemNotifications() {
  return (
    <div className="p-4">
      {/* 系统通知标题和描述 */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">系统通知</h3>
        <p className="text-sm text-gray-500">来自平台的重要通知和公告</p>
      </div>

      {/* 通知列表 */}
      <div className="space-y-3">
        {systemNotifications.length > 0 ? (
          systemNotifications.map((notification: BaseNotification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4 19h4a1 1 0 001-1v-1a3 3 0 013-3h1m0-4h4a2 2 0 012 2v1a2 2 0 01-2 2h-3a1 1 0 00-1 1v1a2 2 0 002 2"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">暂无系统通知</p>
          </div>
        )}
      </div>
    </div>
  );
} 