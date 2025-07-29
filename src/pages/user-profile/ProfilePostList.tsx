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
  isInitialLoad: boolean;
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
  isCurrentUser,
  isInitialLoad
}: ProfilePostListProps) {

  // 首次加载且无数据时显示骨架屏
  if (isLoading && posts.length === 0 && isInitialLoad) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="bg-white p-4 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // 空状态
  if (!isLoading && posts.length === 0) {
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

    // 格式化日期为 "月日" 格式（用于hover效果）
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}月${day}日`;
    };

    // 格式化归档标题（显示年份，但当前年份不显示）
    const formatArchiveTitle = (month: string, year: string) => {
      const currentYear = new Date().getFullYear().toString();
      const monthName = getMonthName(month);
      
      if (year === currentYear) {
        return `${monthName} / `;
      } else {
        return `${year}年${monthName} / `;
      }
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
              <h2 className="text-xl font-bold mb-4">{formatArchiveTitle(month, year)}{monthPosts.length}篇文章</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {monthPosts.map((post: any) => (
                  <Link 
                    to={getPostUrl(post)} 
                    state={{
                      ...post,
                      fromPage: window.location.pathname // 记录当前用户个人主页的路径
                    }}
                    key={post.id} 
                    className="block aspect-square bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="w-full h-full relative">
                      {getPostPreview(post)}
                      
                      {/* Hover 覆盖层 - 显示日期和点赞数 */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out flex flex-col items-center justify-center backdrop-blur-sm">
                        <div className="text-white text-center px-6 py-4 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 shadow-2xl transform scale-95 group-hover:scale-100 transition-transform duration-300">
                          <div className="text-lg font-bold mb-3 tracking-wider text-shadow-sm">
                            {formatDate(post.createdAt)}
                          </div>
                          <div className="text-sm font-semibold opacity-95 flex items-center justify-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                            <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            <span className="font-mono">{post.likes || 0}</span>
                          </div>
                        </div>
                      </div>
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
        <BasePostCard key={post.id || index} post={post} />
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