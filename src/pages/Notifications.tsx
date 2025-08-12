import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommentNotifications,
  FollowNotifications,
  LikeNotifications,
  SystemNotifications,
} from '../components/notifications';

// 标签页类型
type TabType = 'like' | 'comment' | 'follow' | 'system';

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<TabType>('like');
  const navigate = useNavigate();

  const tabs = [
    { key: 'like' as TabType, label: '喜欢', component: LikeNotifications },
    { key: 'comment' as TabType, label: '评论和@', component: CommentNotifications },
    { key: 'follow' as TabType, label: '粉丝', component: FollowNotifications },
    { key: 'system' as TabType, label: '系统通知', component: SystemNotifications },
  ];

  // 处理标签切换
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // 处理设置按钮点击
  const handleSettingsClick = () => {
    navigate('/settings?section=messages');
  };

  // 获取当前激活标签的组件
  const ActiveComponent = tabs.find((tab) => tab.key === activeTab)?.component || LikeNotifications;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* 顶部标签区域 */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-4 pb-0">
          {/* 标签容器 - 优化间距和布局 */}
          <div className="flex-1 flex gap-2"> {/* 增加标签之间的间距 */}
            {tabs.map((tab) => (
              <div key={tab.key} className="flex-1 relative">
                <button
                  onClick={() => handleTabChange(tab.key)}
                  className={`w-full py-2 px-6 text-center font-medium text-sm transition-all duration-200 relative rounded-t-lg ${ // 优化内边距和圆角
                    activeTab === tab.key
                      ? 'text-purple-600 bg-purple-50 font-semibold' // 增强激活状态
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                  {/* 底部指示器 - 优化位置和样式 */}
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-0.5 rounded-full transition-all duration-200"
                    style={{ 
                      backgroundColor: activeTab === tab.key ? '#7E44C6' : 'transparent'
                    }}
                  />
                </button>
                {/* 移除竖线分割线，减少视觉拥挤 */}
              </div>
            ))}
          </div>

          {/* 设置按钮 */}
          <div className="ml-4 pl-4 border-l border-gray-200">
            <button 
              onClick={handleSettingsClick}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 动态渲染当前选中的标签页内容 */}
      <ActiveComponent />
    </div>
  );
}
