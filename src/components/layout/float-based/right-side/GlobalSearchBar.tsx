import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchSuggestions from './SearchSuggestions';

interface HistoryItem {
  name: string;
  time: string;
}

const STORAGE_KEY = 'globalSearchHistory';

const GlobalSearchBar: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  // 1. 从 localStorage 初始化历史；如果没有，则使用默认示例
  const [historyList, setHistoryList] = useState<HistoryItem[]>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw) as HistoryItem[];
      } catch {
        // 若解析失败，就回落到示例数据
      }
    }
    return [
      { name: 'ganggang', time: '2025-07-06T12:00:00' },
      { name: '你', time: '2025-07-06T13:00:00' },
      { name: 'younglife', time: '2025-07-06T14:00:00' },
      { name: '青春摄影', time: '2025-07-06T15:00:00' },
    ];
  });

  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // 2. 每次 historyList 改变都写入 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historyList));
  }, [historyList]);

  const formatTime = (time: string) => {
    const now = new Date();
    const recordTime = new Date(time);
    const diff = now.getTime() - recordTime.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '刚刚';
    if (hours < 1) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 3) return `${days} 天前`;
    return '';
  };

  const addToHistory = (searchQuery: string) => {
    const newEntry: HistoryItem = {
      name: searchQuery,
      time: new Date().toISOString(),
    };

    setHistoryList(prev => {
      const deduped = prev.filter(item => item.name !== searchQuery);
      return [newEntry, ...deduped].slice(0, 10);
    });
  };

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setQuery(item.name);
    addToHistory(item.name);
    navigate(`/search-results/${item.name}`);
  }, [navigate]);

  const handleClear = () => {
    setQuery('');
  };

  const handleFocus = () => {
    if (query === '') {
      setIsHistoryVisible(true);
    }
  };

  const handleDeleteHistory = useCallback((index: number) => {
    setHistoryList(prev => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!query) return;
    if (debounceTimeout) clearTimeout(debounceTimeout);

    const timeout = setTimeout(() => {
      console.log('Fetching suggestions for:', query);
    }, 500);
    setDebounceTimeout(timeout);
  }, [query]);

  const handleEnterKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim() !== '') {
      addToHistory(query);
      navigate(`/search-results/${query}`);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (searchInputRef.current && !searchInputRef.current.contains(e.target as Node)) {
      setIsHistoryVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleClearAllHistory = () => {
    setHistoryList([]);
  };

  return (
    <div className="flex justify-center">
      <div className="relative w-full max-w-md">
        <input
          ref={searchInputRef}
          name="global-search"
          type="text"
          placeholder="搜索你感兴趣的内容..."
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          value={query}
          // 3. 限制最大输入长度为 30
          maxLength={30}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onKeyDown={handleEnterKey}
          className="w-full pl-4 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors border border-purple-300 hover:border-gray-400 focus:border-purple-500"
        />

        {query && (
          <button
            onClick={handleClear}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-600"
          >
            清除
          </button>
        )}

        <SearchSuggestions
          query={query}
          onSuggestionClick={(suggestion) => {
            setQuery(suggestion.value);
            addToHistory(suggestion.value);
            if (suggestion.type === 'tag') {
              navigate(suggestion.link);
            } else if (suggestion.type === 'user') {
              navigate(suggestion.link);
            } else if (suggestion.type === 'article') {
              navigate(suggestion.link);
            } else {
              navigate(`/search-results/${suggestion.value}`);
            }
          }}
        />

        {isHistoryVisible && !query && (
          <div className="absolute bg-white w-full mt-2 border border-gray-300 rounded-sm z-10 max-h-96 overflow-y-auto">
            <div className="flex justify-between px-4 py-2 font-bold text-sm">
              <span>最近搜索</span>
              <button onClick={handleClearAllHistory} className="text-gray-500 text-sm">
                清除所有
              </button>
            </div>
            {historyList.map((item, index) => (
              item.name && (
                <div
                  key={index}
                  onClick={() => handleHistoryClick(item)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <span className="text-black font-bold">{item.name}</span>
                  <span className="text-gray-500 text-xs ml-2">{formatTime(item.time)}</span>
                  {hoveredIndex === index && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(index);
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-200 p-1 rounded-full"
                    >
                      x
                    </button>
                  )}
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalSearchBar;