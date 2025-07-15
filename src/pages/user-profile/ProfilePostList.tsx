import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import BasePostCard from '../../components/post-card/BasePostCard';
import type { ProfileTab, WorksFilterType, ViewMode } from '../UserProfile.types';
import { VIEW_MODES } from '../UserProfile.types';
import { cn } from '../../utils/cn';

interface ProfilePostListProps {
  posts: any[];
  currentTab: ProfileTab;
  currentWorksFilter: WorksFilterType;
  viewMode: ViewMode;
  isLoading: boolean;
  isCurrentUser: boolean;
}

// 按月份和年份对帖子进行分组
interface GroupedPosts {
  [yearMonth: string]: {
    year: string;
    month: string;
    posts: any[];
  };
}

export default function ProfilePostList({ 
  posts, 
  currentTab, 
  currentWorksFilter, 
  viewMode,
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

  // 如果是网格视图，按月份分组展示
  if (viewMode === VIEW_MODES.Grid) {
    // 对帖子按月份和年份进行分组
    const groupedPosts = posts.reduce((acc: GroupedPosts, post) => {
      const date = new Date(post.createdAt);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const yearMonth = `${year}-${month}`;
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          year,
          month,
          posts: []
        };
      }
      
      acc[yearMonth].posts.push(post);
      return acc;
    }, {});
    
    // 按时间降序排序
    const sortedMonths = Object.keys(groupedPosts).sort().reverse();

    // 获取月份名称
    const getMonthName = (month: string) => {
      const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      return monthNames[parseInt(month) - 1];
    };
    
    // 获取帖子预览内容
    const getPostPreview = (post: any) => {
      if (post.type === 'image' && post.images && post.images.length > 0) {
        return (
          <img 
            src={post.images[0].url} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        );
      } else if (post.type === 'video' && post.video) {
        return (
          <img 
            src={post.video.thumbnail} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        );
      } else {
        // 文字内容预览
        return (
          <div className="p-3 flex flex-col h-full">
            <h3 className="text-sm font-semibold mb-1 line-clamp-1">{post.title}</h3>
            <p className="text-xs text-gray-600 line-clamp-3">{post.content}</p>
          </div>
        );
      }
    };
    
    // 生成帖子链接
    const getPostUrl = (post: any) => {
      switch (post.type) {
        case 'article':
          return `/post/article/${post.id}`;
        case 'image':
          return `/post/image/${post.id}`;
        case 'video':
          return `/post/video/${post.id}`;
        case 'dynamic':
          return `/post/dynamic/${post.id}`;
        default:
          return `/post/${post.id}`;
      }
    };

    return (
      <div className="container mx-auto py-6 px-4">
        {sortedMonths.map((yearMonth) => {
          const { year, month, posts: monthPosts } = groupedPosts[yearMonth];
          return (
            <div key={yearMonth} className="mb-10">
              <h2 className="text-xl font-bold mb-4">{year}年 / {getMonthName(month)}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthPosts.map((post: any) => (
                  <Link 
                    to={getPostUrl(post)} 
                    state={post}
                    key={post.id} 
                    className="block aspect-square bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-full h-full relative">
                      {getPostPreview(post)}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* 加载更多提示 */}
        <div className="flex justify-center py-8">
          <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            加载更多
          </button>
        </div>
      </div>
    );
  }

  // 列表视图
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