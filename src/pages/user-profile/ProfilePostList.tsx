import React from 'react';
import BasePostCard from '../../components/post-card/BasePostCard';
import type { ProfileTab, WorksFilterType } from '../UserProfile.types';

interface ProfilePostListProps {
  posts: any[];
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  isLoading: boolean;
  isCurrentUser: boolean;
}

export default function ProfilePostList({ 
  posts, 
  currentTab, 
  currentWorksFilter, 
  isLoading, 
  isCurrentUser 
}: ProfilePostListProps) {
  // 加载状态
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-500">加载中...</span>
        </div>
      </div>
    );
  }

  // 空状态
  if (posts.length === 0) {
    const getEmptyMessage = () => {
      switch (currentTab) {
        case 'works':
          return isCurrentUser ? '您还没有发布任何作品' : 'TA还没有发布任何作品';
        case 'dynamics':
          return isCurrentUser ? '您还没有发布任何动态' : 'TA还没有发布任何动态';
        case 'likes':
          return isCurrentUser ? '您还没有喜欢任何内容' : 'TA的喜欢内容不公开';
        default:
          return '暂无内容';
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-900 mb-2">{getEmptyMessage()}</p>
          <p className="text-sm text-gray-500">
            {isCurrentUser && currentTab === 'works' && '开始创作你的第一个作品吧！'}
            {isCurrentUser && currentTab === 'dynamics' && '分享你的想法和动态吧！'}
          </p>
        </div>
      </div>
    );
  }

  // 渲染帖子列表
  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <div key={post.id || index} className="bg-white">
          <BasePostCard post={post} />
        </div>
      ))}
      
      {/* 加载更多提示 */}
      <div className="flex justify-center py-8">
        <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
          加载更多
        </button>
      </div>
    </div>
  );
} 