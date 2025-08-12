import React from 'react';
import { Tabs } from '@chakra-ui/react';
import { cn } from '../../utils/cn';
import type { ProfileTab, WorksFilterType, ViewMode } from '../UserProfile.types';
import { ProfileTabs as ProfileTabsConstant, WorksFilter, VIEW_MODES } from '../UserProfile.types';

interface ProfileTabsProps {
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  viewMode: ViewMode;
  onTabChange: (tab: ProfileTab) => void;
  onWorksFilterChange: (filter: WorksFilterType) => void;
  onViewModeChange: (mode: ViewMode) => void;
  isCurrentUser: boolean;
}

export default function ProfileTabs({ 
  currentTab, 
  currentWorksFilter, 
  viewMode,
  onTabChange, 
  onWorksFilterChange, 
  onViewModeChange,
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

  // 切换视图模式
  const toggleViewMode = () => {
    onViewModeChange(viewMode === VIEW_MODES.List ? VIEW_MODES.Grid : VIEW_MODES.List);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm">
      {/* 主要Tab切换 */}
      <Tabs.Root
        value={currentTab}
        onValueChange={(details) => onTabChange(details.value as ProfileTab)}
      >
        <div className="flex items-center justify-between px-6 py-3">
          {/* 左侧Tab列表 */}
          <div className="flex-1"></div>
          <Tabs.List className="flex justify-center items-center gap-8">
            {tabs.filter(tab => !tab.hidden).map((tab) => (
              <Tabs.Trigger 
                key={tab.key}
                value={tab.key}
                className={cn(
                  'text-base font-medium px-4 py-2 rounded-md transition-colors',
                  tab.current 
                    ? 'bg-purple-50' 
                    : 'text-gray-700 hover:opacity-80'
                )}
                style={tab.current ? { color: '#7E44C6', backgroundColor: '#f3f0ff' } : {}}
              >
                {tab.name}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {/* 右侧视图切换按钮 */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleViewMode}
              className={cn(
                'p-2 rounded-md border',
                viewMode === VIEW_MODES.Grid 
                  ? 'border-purple-200' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
              style={viewMode === VIEW_MODES.Grid ? { 
                backgroundColor: '#f3f0ff', 
                borderColor: '#d4c4f9',
                color: '#7E44C6'
              } : {}}
              aria-label={viewMode === VIEW_MODES.List ? '切换到网格视图' : '切换到列表视图'}
            >
              {viewMode === VIEW_MODES.List ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" y1="10" x2="3" y2="10" />
                  <line x1="21" y1="6" x2="3" y2="6" />
                  <line x1="21" y1="14" x2="3" y2="14" />
                  <line x1="21" y1="18" x2="3" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Tabs.Root>


    </div>
  );
} 