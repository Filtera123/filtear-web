import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTagPageStore } from './TagPage.store';
import { Tabs } from '@chakra-ui/react';
import { 
  TAG_PAGE_TABS, 
  LATEST_SUB_TABS, 
  HOT_SUB_TABS, 
  CONTENT_FILTERS,
  VIEW_MODES,
  type TagPageTab,
  type LatestSubTab,
  type HotSubTab,
  type ContentFilter,
  type ViewMode,
  type TagDetail 
} from './TagPage.types';
import TagVirtualPostList from './TagVirtualPostList';
import { cn } from '../utils/cn';
import { useScrollDirection } from '../hooks/useScrollDirection';

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();
  const tagName = tag || '';
  
  const {
    currentTab,
    currentLatestSubTab,
    currentHotSubTab,
    currentContentFilter,
    viewMode,
    tagDetail,
    setCurrentTab,
    setCurrentLatestSubTab,
    setCurrentHotSubTab,
    setCurrentContentFilter,
    setViewMode,
    setTagDetail,
    resetState,
  } = useTagPageStore();

  // 使用滚动方向检测hook
  const { isVisible } = useScrollDirection({ 
    threshold: 20 // 滚动20px后才触发显示/隐藏
  });

  // 初始化标签详情数据
  useEffect(() => {
    if (tagName) {
      // 这里应该调用真实的API获取标签详情
      const mockTagDetail: TagDetail = {
        id: tagName,
        name: tagName,
        description: `这是关于 ${tagName} 的专栏页面`,
        stats: {
          viewCount: Math.floor(Math.random() * 100000) + 10000,
          postCount: Math.floor(Math.random() * 5000) + 100,
          followerCount: Math.floor(Math.random() * 10000) + 500,
        },
        isSubscribed: Math.random() > 0.5,
        isBlocked: false,
        color: '#7E44C6',
      };
      setTagDetail(mockTagDetail);
    }
  }, [tagName, setTagDetail]);

  // 清理状态
  useEffect(() => {
    return () => {
      resetState();
    };
  }, [resetState]);

  // 获取当前子分类选项
  const getSubTabs = () => {
    switch (currentTab) {
      case 'latest':
        return [
          { key: LATEST_SUB_TABS.LatestPublish, name: '最新发布', current: currentLatestSubTab === 'latest_publish' },
          { key: LATEST_SUB_TABS.LatestComment, name: '最新评论', current: currentLatestSubTab === 'latest_comment' },
        ];
      case 'hot':
        return [
          { key: HOT_SUB_TABS.Daily, name: '日榜', current: currentHotSubTab === 'daily' },
          { key: HOT_SUB_TABS.Weekly, name: '周榜', current: currentHotSubTab === 'weekly' },
          { key: HOT_SUB_TABS.Monthly, name: '月榜', current: currentHotSubTab === 'monthly' },
          { key: HOT_SUB_TABS.All, name: '全部', current: currentHotSubTab === 'all' },
        ];
      case 'dynamic':
        return []; // 动态tab没有子分类
      default:
        return [];
    }
  };

  // 处理子分类切换
  const handleSubTabChange = (subTab: string) => {
    if (currentTab === 'latest') {
      setCurrentLatestSubTab(subTab as LatestSubTab);
    } else if (currentTab === 'hot') {
      setCurrentHotSubTab(subTab as HotSubTab);
    }
  };

  // 当切换到动态tab时，自动设置内容过滤器为'all'
  useEffect(() => {
    if (currentTab === 'dynamic' && currentContentFilter !== 'all') {
      setCurrentContentFilter('all');
    }
  }, [currentTab, currentContentFilter, setCurrentContentFilter]);

  // 获取可用的内容过滤器选项（动态tab只有全部选项）
  const availableFilters = useMemo(() => {
    if (currentTab === 'dynamic') {
      return [{ key: CONTENT_FILTERS.All, name: '全部' }];
    }
    return [
      { key: CONTENT_FILTERS.All, name: '全部' },
      { key: CONTENT_FILTERS.Image, name: '图片' },
      { key: CONTENT_FILTERS.Text, name: '文字' },
    ];
  }, [currentTab]);

  // 切换视图模式
  const toggleViewMode = () => {
    setViewMode(viewMode === VIEW_MODES.List ? VIEW_MODES.Grid : VIEW_MODES.List);
  };

  // 即使标签详情还未加载完成，也显示tab栏和帖子列表
  // 标签详情的加载状态由右侧栏组件处理

  return (
    <div className="w-full relative">
      {/* Tab切换区 - 固定在顶部，支持智能显示/隐藏 */}
      <div 
        className={cn(
          'sticky top-0 bg-white/75 z-50 backdrop-blur-sm border-b border-gray-200',
          'transition-transform duration-300 ease-in-out',
          isVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        {/* 第一级Tab - 进一步缩小高度，增大字体 */}
        <Tabs.Root
          value={currentTab}
          onValueChange={(details) => setCurrentTab(details.value as TagPageTab)}
        >
          <div className="flex justify-between items-center px-6 py-1">
            <Tabs.List className="flex justify-center items-center gap-8">
              <Tabs.Trigger 
                value={TAG_PAGE_TABS.Latest}
                className="text-base font-medium"
              >
                最新
              </Tabs.Trigger>
              <Tabs.Trigger 
                value={TAG_PAGE_TABS.Hot}
                className="text-base font-medium"
              >
                最热
              </Tabs.Trigger>
              <Tabs.Trigger 
                value={TAG_PAGE_TABS.Dynamic}
                className="text-base font-medium"
              >
                动态
              </Tabs.Trigger>
            </Tabs.List>
            
            {/* 视图切换按钮 - 移到第一级tab栏 */}
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
        </Tabs.Root>

        {/* 第二级Tab - 子分类和内容过滤器放在同一行 */}
        {currentTab !== 'dynamic' && (
          <div className="flex justify-between items-center px-6 py-2.5 border-t border-gray-100">
            {/* 左侧：子分类切换 */}
            <div className="flex items-center gap-4">
                              {getSubTabs().map((subTab) => (
                  <button
                    key={subTab.key}
                    onClick={() => handleSubTabChange(subTab.key)}
                    className={cn(
                      'px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                      subTab.current
                        ? 'text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                    style={subTab.current ? { backgroundColor: '#7E44C6' } : {}}
                  >
                    {subTab.name}
                  </button>
                ))}
            </div>

            <div className="flex items-center gap-4">
              {/* 右侧：内容过滤器按钮组 */}
              {availableFilters.length > 1 && (
                <div className="bg-gray-50 rounded-full p-1 border border-gray-200">
                  <div className="flex gap-0">
                    {availableFilters.map((filter) => (
                      <button
                        key={filter.key}
                        onClick={() => setCurrentContentFilter(filter.key as ContentFilter)}
                        className={cn(
                          'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                          currentContentFilter === filter.key
                            ? 'bg-white shadow-sm border font-semibold' 
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                        )}
                        style={currentContentFilter === filter.key ? { 
                          color: '#7E44C6',
                          borderColor: '#d4c4f9'
                        } : {}}
                      >
                        {filter.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 帖子列表 */}
      <TagVirtualPostList tagName={tagName} />
    </div>
  );
} 