import React, { useState, useEffect } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { styled, Tab } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useTabScrollRestoration } from '../../hooks/useTabScrollRestoration';
import { usePostListStore } from '../../stores/postListStore';
import VirtualPostList, { type PostListType } from './VirtualPostList';

const CustomerTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: 0,
  minHeight: 'calc(100vh - 100px)', // 确保有足够的高度
}));

export default function Home() {
  const tabs = [
    {
      key: 'recommended' as PostListType,
      name: '为你推荐',
      current: true,
    },
    {
      key: 'subscriptions' as PostListType,
      name: '我的订阅',
      current: false,
    },
    {
      key: 'following' as PostListType,
      name: '我的关注',
      current: false,
    },
  ];

  const location = useLocation();
  
  // 从store获取活跃tab，保持状态一致性
  const { activeTab: storeActiveTab, setActiveTab: setStoreActiveTab } = usePostListStore();
  const [activeTab, setActiveTab] = useState<PostListType>(storeActiveTab);

  // 使用专门的tab滚动位置管理
  const { saveTabPosition } = useTabScrollRestoration({
    basePath: location.pathname,
    activeTab,
    saveThrottleMs: 200,
    restoreDelayMs: 150,
  });

  // 同步本地状态和store状态
  useEffect(() => {
    setActiveTab(storeActiveTab);
  }, [storeActiveTab]);

  const handleTabClick = (key: PostListType) => {
    // 切换tab前保存当前滚动位置
    saveTabPosition(activeTab);
    
    console.log(`[Tab切换] 从 ${activeTab} 切换到 ${key}`);
    
    // 更新状态
    setActiveTab(key);
    setStoreActiveTab(key);
  };

  return (
    <div className="w-full px-4 min-h-screen">
      <TabContext value={activeTab}>
        <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-50 py-2">
          <TabList
            onChange={(e, newValue) => {
              handleTabClick(newValue);
            }}
            className="flex"
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                value={tab.key}
                label={tab.name}
                className={`px-4 py-2 rounded-sm transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              />
            ))}
          </TabList>
        </div>
        
        <div className="min-h-screen">
          <CustomerTabPanel value="recommended">
            <VirtualPostList 
              type="recommended" 
              isActive={activeTab === 'recommended'}
              key="recommended-tab" 
            />
          </CustomerTabPanel>
          
          <CustomerTabPanel value="subscriptions">
            <VirtualPostList 
              type="subscriptions" 
              isActive={activeTab === 'subscriptions'}
              key="subscriptions-tab"
            />
          </CustomerTabPanel>
          
          <CustomerTabPanel value="following">
            <VirtualPostList 
              type="following" 
              isActive={activeTab === 'following'}
              key="following-tab"
            />
          </CustomerTabPanel>
        </div>
      </TabContext>
    </div>
  );
}
