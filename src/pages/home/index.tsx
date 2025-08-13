import { Tabs } from '@chakra-ui/react';
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

  return (
    <div className="w-full relative">
      <style>{`
        [data-scope="tabs"] [data-part="trigger"] {
          font-size: 18px !important;
          font-weight: 700 !important;
          padding: 16px 24px !important;
          min-height: 60px !important;
          transition: all 0.2s ease !important;
        }
        [data-scope="tabs"] [data-part="trigger"]:hover {
          background-color: rgba(0, 0, 0, 0.08) !important;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
        .chakra-tabs__tab {
          font-size: 18px !important;
          font-weight: 700 !important;
          padding: 16px 24px !important;
          min-height: 60px !important;
          transition: all 0.2s ease !important;
        }
        .chakra-tabs__tab:hover {
          background-color: rgba(0, 0, 0, 0.08) !important;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
      <Tabs.Root
        defaultValue={currentTab}
        onValueChange={(details) => {
          setCurrentTab(details.value as HomeTabs);
        }}
        className="sticky! top-0 bg-white/75 z-50 backdrop-blur-sm"
      >
        <Tabs.List className="flex justify-center items-center gap-6">
          {tabs.map((tab) => (
            <Tabs.Trigger 
              key={tab.key} 
              value={tab.key}
              className="px-6 py-4 font-bold text-gray-700 hover:text-purple-600 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 transition-all duration-200 rounded-lg"
              style={{ 
                fontSize: '18px !important',
                fontWeight: '700 !important',
                lineHeight: '1.2 !important',
                padding: '16px 24px !important',
                minHeight: '60px !important',
                display: 'flex !important',
                alignItems: 'center !important',
                justifyContent: 'center !important'
              }}
            >
              {tab.name}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <VirtualPostList />
    </div>
  );
}
