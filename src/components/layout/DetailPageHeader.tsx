import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconSearch } from '@tabler/icons-react';
import SearchSuggestions from './float-based/right-side/SearchSuggestions';

interface DetailPageHeaderProps {
  className?: string;
}

export default function DetailPageHeader({ className = '' }: DetailPageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search-results/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 左侧导航 */}
          <div className="flex items-center space-x-3">
            {/* 返回按钮 */}
            <button
              onClick={() => {
                // 检查是否有指定的来源页面
                if (location.state?.fromPage) {
                  navigate(location.state.fromPage);
                } else {
                  // 尝试返回上一页，如果没有历史记录则回到首页
                  if (window.history.length > 1) {
                    navigate(-1);
                  } else {
                    navigate('/');
                  }
                }
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
              title="返回"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* 主页按钮 */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-purple-50 hover:bg-purple-100 transition-colors group"
              title="主页"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>
          </div>

          {/* 中间搜索框 */}
          <div className="flex-1 max-w-xl mx-4 relative">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full bg-white rounded-full shadow-md transition-all"
            >
              <input
                type="text"
                placeholder="搜索Filtera"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full h-9 pl-4 pr-2 bg-transparent rounded-full focus:outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                type="submit"
                className="flex-shrink-0 bg-transparent hover:bg-transparent text-purple-600 rounded-full h-8 w-8 flex items-center justify-center mr-1"
                aria-label="Search"
              >
                <IconSearch size={20} className="text-purple-600" />
              </button>
            </form>
            {showSuggestions && searchQuery && (
              <SearchSuggestions
                query={searchQuery}
                onSuggestionClick={(suggestion) => {
                  setSearchQuery(suggestion.value);
                  setShowSuggestions(false);
                  if (suggestion.type === 'tag' || suggestion.type === 'user' || suggestion.type === 'article') {
                    navigate(suggestion.link);
                  } else {
                    navigate(`/search-results/${suggestion.value}`);
                  }
                }}
                layout="horizontal"
              />
            )}
          </div>

          {/* 右侧功能区 */}
          <div className="flex items-center space-x-3">
            {/* 消息通知 */}
            <button
              onClick={() => navigate('/notifications')}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-yellow-50 hover:bg-yellow-100 transition-colors group"
              title="消息通知"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {/* 未读消息红点 */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
            </button>

            {/* 设置 */}
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group"
              title="设置"
            >
              <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* 用户头像 */}
            <button
              onClick={() => navigate('/user/current')}
              className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              title="用户中心"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white text-sm font-medium">我</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 