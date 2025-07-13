import React from 'react';
import { Tabs } from '@chakra-ui/react';
import { cn } from '../../utils/cn';
import type { ProfileTab, WorksFilterType } from '../UserProfile.types';
import { ProfileTabs as ProfileTabsConstant, WorksFilter } from '../UserProfile.types';

interface ProfileTabsProps {
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  onTabChange: (tab: ProfileTab) => void;
  onWorksFilterChange: (filter: WorksFilterType) => void;
  isCurrentUser: boolean;
}

export default function ProfileTabs({ 
  currentTab, 
  currentWorksFilter, 
  onTabChange, 
  onWorksFilterChange, 
  isCurrentUser 
}: ProfileTabsProps) {
  // Tab配置
  const tabs = [
    {
      key: ProfileTabsConstant.WORKS,
      name: '作品',
      current: currentTab === ProfileTabsConstant.WORKS,
    },
    {
      key: ProfileTabsConstant.DYNAMICS,
      name: '动态',
      current: currentTab === ProfileTabsConstant.DYNAMICS,
    },
    {
      key: ProfileTabsConstant.LIKES,
      name: '喜欢',
      current: currentTab === ProfileTabsConstant.LIKES,
      // 他人主页可能不显示喜欢tab（根据隐私设置）
      hidden: !isCurrentUser,
    },
  ];

  // 作品过滤器选项
  const worksFilters = [
    {
      key: WorksFilter.ALL,
      name: '全部',
      current: currentWorksFilter === WorksFilter.ALL,
    },
    {
      key: WorksFilter.ARTICLES,
      name: '文章',
      current: currentWorksFilter === WorksFilter.ARTICLES,
    },
    {
      key: WorksFilter.IMAGES,
      name: '图片',
      current: currentWorksFilter === WorksFilter.IMAGES,
    },
    {
      key: WorksFilter.VIDEOS,
      name: '视频',
      current: currentWorksFilter === WorksFilter.VIDEOS,
    },
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
      {/* 主要Tab切换 */}
      <Tabs.Root
        value={currentTab}
        onValueChange={(details) => onTabChange(details.value as ProfileTab)}
      >
        <Tabs.List className="flex justify-center items-center gap-8 px-6 py-3">
          {tabs.filter(tab => !tab.hidden).map((tab) => (
            <Tabs.Trigger 
              key={tab.key}
              value={tab.key}
              className={cn(
                'text-base font-medium px-4 py-2 rounded-md transition-colors',
                tab.current 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              )}
            >
              {tab.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      {/* 作品Tab的过滤器 */}
      {currentTab === ProfileTabsConstant.WORKS && (
        <div className="flex justify-center items-center px-6 py-3 border-t border-gray-100">
          <div className="bg-gray-50 rounded-full p-1 border border-gray-200">
            <div className="flex gap-0">
              {worksFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => onWorksFilterChange(filter.key as WorksFilterType)}
                  className={cn(
                    'px-6 py-2 rounded-full text-sm font-medium transition-all duration-200',
                    filter.current
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200 font-semibold'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  )}
                >
                  {filter.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 