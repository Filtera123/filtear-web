import { useState } from 'react';
import MySubscriptionsPostList from './home/MySubscriptionsPostList';
import RecommendedPost from './home/RecommendedPost';

export default function Home() {
  const tabs = [
    {
      name: '为你推荐',
      current: true,
    },
    {
      name: '我的订阅',
      current: false,
    },
    {
      name: '我的关注',
      current: false,
    },
  ];

  const [activeTab, setActiveTab] = useState('为你推荐');

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <div className="w-full p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`px-4 py-2 rounded-sm transition-colors ${activeTab === tab.name ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="">
        {activeTab === '为你推荐' && <RecommendedPost />}
        {activeTab === '我的订阅' && <MySubscriptionsPostList />}
        {activeTab === '我的关注' && <div>我的关注内容区域</div>}
      </div>
    </div>
  );
}
