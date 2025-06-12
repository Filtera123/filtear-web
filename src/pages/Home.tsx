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
      name: '特别关心',
      current: false,
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-sm ${tab.current ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>
      <div className="">
        <RecommendedPost />
      </div>
    </div>
  );
}
