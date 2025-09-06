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
          background-color: #f3f4f6 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        [data-scope="tabs"] [data-part="trigger"][data-state="active"] {
          background-color: #f3f4f6 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        [data-scope="tabs"] [data-part="trigger"][data-state="active"]:hover {
          background-color: #e5e7eb !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        /* 额外的选择器以确保兼容性 */
        .chakra-tabs__tab {
          font-size: 18px !important;
          font-weight: 700 !important;
          padding: 16px 24px !important;
          min-height: 60px !important;
          transition: all 0.2s ease !important;
        }
        .chakra-tabs__tab:hover {
          background-color: #f3f4f6 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        .chakra-tabs__tab[data-state="active"] {
          background-color: #f3f4f6 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .chakra-tabs__tab[data-state="active"]:hover {
          background-color: #e5e7eb !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }
        /* 通用选择器作为后备 */
        button[role="tab"]:hover {
          background-color: #f3f4f6 !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        }
        button[role="tab"][data-state="active"] {
          background-color: #f3f4f6 !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        button[role="tab"][data-state="active"]:hover {
          background-color: #e5e7eb !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
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
          {tabs.map((tab) => {
            const isActive = currentTab === tab.key;
            return (
              <Tabs.Trigger 
                key={tab.key} 
                value={tab.key}
                className="px-6 py-4 font-bold text-gray-700 hover:text-purple-600 data-[state=active]:text-purple-600 data-[state=active]:border-b-2 data-[state=active]:border-purple-600 transition-all duration-200 rounded-lg"
                style={{ 
                  fontSize: '18px',
                  fontWeight: '700',
                  lineHeight: '1.2',
                  padding: '16px 24px',
                  minHeight: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  boxShadow: isActive ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isActive ? 'rgba(0, 0, 0, 0.08)' : 'transparent';
                  e.currentTarget.style.boxShadow = isActive ? 'inset 0 2px 4px rgba(0, 0, 0, 0.1)' : 'none';
                }}
              >
                {tab.name}
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
      </Tabs.Root>

      <VirtualPostList />
    </div>
  );
}
