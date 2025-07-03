import React, { useState } from 'react';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { styled, Tab } from '@mui/material';
import MySubscriptionsPostList from './MySubscriptionsPostList';
import RecommendedPost from './RecommendedPost';
import MyFollowList from './MyFollowList';

const CustomerTabPanel = styled(TabPanel)(({ theme }) => ({
  padding: 0,
  minHeight: 'calc(100vh - 100px)', // 确保有足够的高度
}));

export default function Home() {
  const tabs = [
    {
      key: 'recommended',
      name: '为你推荐',
      current: true,
    },
    {
      key: 'subscriptions',
      name: '我的订阅',
      current: false,
    },
    {
      key: 'following',
      name: '我的关注',
      current: false,
    },
  ];

  const [activeTab, setActiveTab] = useState('recommended');

  const handleTabClick = (key: string) => {
    setActiveTab(key);
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
            <RecommendedPost isActive={activeTab === 'recommended'} />
          </CustomerTabPanel>
          
          <CustomerTabPanel value="subscriptions">
            <MySubscriptionsPostList isActive={activeTab === 'subscriptions'} />
          </CustomerTabPanel>
          
          <CustomerTabPanel value="following">
            <MyFollowList isActive={activeTab === 'following'} />
          </CustomerTabPanel>
        </div>
      </TabContext>
    </div>
  );
}
