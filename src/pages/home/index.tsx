import React from 'react';
import { TabContext, TabList } from '@mui/lab';
import { Tab } from '@mui/material';
import { useHomePostListStore } from './Home.store.ts';
import { HOME_TABS, type HomeTabs } from './type.ts';
import VirtualPostList from './VirtualPostList';

export default function Home() {
  const tabs = [
    {
      key: HOME_TABS.Recommended,
      name: '为你推荐',
      current: true,
    },
    {
      key: HOME_TABS.Subscriptions,
      name: '我的订阅',
      current: false,
    },
    {
      key: HOME_TABS.Following,
      name: '我的关注',
      current: false,
    },
  ];
  // 从store获取活跃tab，保持状态一致性
  const { currentTab, setCurrentTab } = useHomePostListStore();

  const handleTabClick = (key: HomeTabs) => {
    setCurrentTab(key);
  };

  return (
    <div className="w-full px-4 min-h-screen">
      <TabContext value={currentTab}>
        <div className="flex justify-center items-center mb-4 sticky top-0 bg-white z-50">
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
                  currentTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              />
            ))}
          </TabList>
        </div>

        <div className="min-h-screen">
          <VirtualPostList />
        </div>
      </TabContext>
    </div>
  );
}
