import React, { useEffect, useRef, useState } from 'react';
import { IconTag, IconUser, IconArticle } from '@tabler/icons-react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: { type: 'tag' | 'user' | 'article'; value: string; link: string }) => void;
  layout?: 'vertical' | 'horizontal';
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Article {
  id: string;
  title: string;
  link: string;
  summary: string;
  tags: string[];
}

interface Tag {
  tag: string;
  link: string;
  postsCount: number; // 添加一个字段来存储每个标签的帖子数量
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSuggestionClick, layout = 'vertical' }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true); // 控制显示建议的状态

  const defaultAvatar = 'https://example.com/default-avatar.jpg'; // 默认头像链接
  const suggestionsRef = useRef<HTMLDivElement>(null); // 引用搜索建议的容器

  useEffect(() => {
    // 添加点击事件监听器
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false); // 点击外部时，隐藏建议框
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // 清理事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!query) {
      setShowSuggestions(false); // 如果没有查询内容，隐藏建议框
      return;
    }
    setShowSuggestions(true); // 如果有查询内容，显示建议框

    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // 清除上次的定时器
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      // 模拟搜索 API 请求
      const usersData: User[] = [
        { id: '1', name: 'ni', avatar: 'https://example.com/avatar1.jpg' },
        { id: '2', name: 'ninja', avatar: 'https://example.com/avatar2.jpg' },
        { id: '3', name: 'ni feng', avatar: 'https://example.com/avatar3.jpg' },
      ];
      const articlesData: Article[] = [
        {
          id: 'nihao',
          title: 'nihao 文章',
          link: '/post/article/nihao',
          summary: '这是一篇关于nihao的文章...',
          tags: ['#ni', '#ninja'],
        },
        {
          id: 'ninjago',
          title: 'ninjago 文章',
          link: '/post/article/ninjago',
          summary: '这是一篇关于ninjago的文章...',
          tags: ['#ninjago', '#MBTI'],
        },
        {
          id: 'mbti',
          title: 'MBTI测试',
          link: '/post/article/mbti',
          summary: '这是一篇关于MBTI测试的文章...',
          tags: ['#MBTI'],
        },
      ];
      const tagsData: Tag[] = [
        { tag: '#ni', link: '/tag/ni', postsCount: 318 },
        { tag: '#ninja', link: '/tag/ninja', postsCount: 1716 },
        { tag: '#ni feng', link: '/tag/ni_feng', postsCount: 356 },
        { tag: '#瓶邪雨村', link: '/tag/瓶邪雨村', postsCount: 500 },
        { tag: '#瓶邪tag', link: '/tag/瓶邪tag', postsCount: 450 },
      ];

      // 根据查询条件筛选数据
      const filteredUsers = usersData.filter((user) =>
        user.name.toLowerCase().includes(query.toLowerCase())
      );
      const filteredArticles = articlesData.filter(
        (article) =>
          article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.summary.toLowerCase().includes(query.toLowerCase())
      );
      const filteredTags = tagsData.filter((tag) =>
        tag.tag.toLowerCase().includes(query.toLowerCase())
      );

      setUsers(filteredUsers);
      setArticles(filteredArticles);
      setTags(filteredTags);

      setLoading(false);
    }, 500); // 500 毫秒延迟

    setDebounceTimeout(timeout);
  }, [query]);

  return (
    <div
      className={`absolute bg-white w-full mt-2 border border-gray-300 rounded-lg z-10 max-h-96 overflow-y-auto ${layout === 'horizontal' ? 'p-4' : ''}`}
      style={{ boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15), 0 0 10px rgba(0, 0, 0, 0.1)' }}
      ref={suggestionsRef}
    >
      {loading && <div className="px-4 py-2 text-sm text-gray-500">加载中...</div>}

      {layout === 'horizontal' ? (
        <div className="flex flex-row gap-4 w-full">
          {/* 标签栏 */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <IconTag size={16} style={{ color: '#7E44C6' }} />
              相关标签
            </div>
            <div className="flex flex-col space-y-2">
              {tags.length > 0 ? tags.map((tag) => (
                <a
                  key={tag.tag}
                  href={tag.link}
                  onClick={e => {
                    e.preventDefault();
                    onSuggestionClick({ type: 'tag', value: tag.tag.replace(/^#+/, ''), link: tag.link });
                    setShowSuggestions(false);
                  }}
                  className="flex flex-col px-2 py-1 text-black bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                >
                  <span className="text-sm font-medium">#{tag.tag.replace(/^#+/, '')}</span>
                  <span className="text-xs text-gray-600 mt-1">{tag.postsCount} 个最新帖子</span>
                </a>
              )) : <div className="text-xs text-gray-400">无</div>}
            </div>
          </div>
          {/* 用户栏 */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <IconUser size={16} style={{ color: '#7E44C6' }} />
              相关用户
            </div>
            <div className="flex flex-wrap gap-2">
              {users.length > 0 ? users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSuggestionClick({ type: 'user', value: user.name, link: `/user/${user.id}` });
                    setShowSuggestions(false);
                  }}
                  className="flex items-center w-40 px-2 py-2 bg-white hover:bg-gray-100 cursor-pointer rounded-lg transition-colors shadow-sm"
                  style={{ minHeight: 40 }}
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.name}
                    onError={e => (e.currentTarget.src = defaultAvatar)}
                    className="w-7 h-7 rounded-full mr-2 border border-gray-200 object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-base leading-tight truncate">{user.name}</span>
                    <span className="text-xs text-gray-400 truncate">ID: {user.id}</span>
                  </div>
                </div>
              )) : <div className="text-xs text-gray-400">无</div>}
            </div>
          </div>
          {/* 文章栏 */}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-1">
              <IconArticle size={16} className="text-green-500" />
              相关文章
            </div>
            <div className="flex flex-col space-y-2">
              {articles.length > 0 ? articles.map((article) => (
                <div
                  key={article.title}
                  onClick={() => {
                    onSuggestionClick({ type: 'article', value: article.title, link: article.link });
                    setShowSuggestions(false);
                  }}
                  className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded"
                >
                  <div className="text-sm font-semibold truncate">{article.title}</div>
                  <div className="text-xs text-gray-600 truncate">{article.summary}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )) : <div className="text-xs text-gray-400">无</div>}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 相关标签 */}
          {query && showSuggestions && tags.length > 0 && (
            <div>
              <div className="px-4 py-2 font-bold text-sm text-gray-700 flex items-center gap-1">
                <IconTag size={16} style={{ color: '#7E44C6' }} />
                相关标签
              </div>
              <div className="flex flex-col space-y-2">
                {tags.map((tag) => (
                  <a
                    key={tag.tag}
                    href={tag.link}
                    onClick={(e) => {
                      e.preventDefault();
                      onSuggestionClick({ type: 'tag', value: tag.tag.replace(/^#+/, ''), link: tag.link });
                      setShowSuggestions(false);
                    }}
                    className="flex flex-col px-4 py-2 text-black bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium">#{tag.tag.replace(/^#+/, '')}</span>{' '}
                      {tag.tag === '#ni' && <span className="text-xs text-gray-500">小说</span>}
                    </div>
                    <span className="text-xs text-gray-600 mt-1">{tag.postsCount} 个最新帖子</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* 相关用户卡片 */}
          {query && showSuggestions && users.length > 0 && (
            <div>
              <div className="px-4 py-2 font-bold text-sm text-gray-700 flex items-center gap-1">
                <IconUser size={16} style={{ color: '#7E44C6' }} />
                相关用户
              </div>
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    onSuggestionClick({ type: 'user', value: user.name, link: `/user/${user.id}` });
                    setShowSuggestions(false);
                  }}
                  className="flex items-center px-4 py-3 mb-2 bg-white hover:bg-gray-100 cursor-pointer rounded-xl transition-colors shadow-sm"
                  style={{ minHeight: 56 }}
                >
                  <img
                    src={user.avatar || defaultAvatar}
                    alt={user.name}
                    onError={(e) => e.currentTarget.src = defaultAvatar}
                    className="w-10 h-10 rounded-full mr-4 border border-gray-200 object-cover"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-lg leading-tight truncate">{user.name}</span>
                    <span className="text-sm text-gray-400 truncate">ID: {user.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 相关文章卡片 */}
          {query && showSuggestions && articles.length > 0 && (
            <div>
              <div className="px-4 py-2 font-bold text-sm text-gray-700 flex items-center gap-1">
                <IconArticle size={16} className="text-green-500" />
                相关文章
              </div>
              {articles.map((article) => (
                <div
                  key={article.title}
                  onClick={() => {
                    onSuggestionClick({ type: 'article', value: article.title, link: article.link });
                    setShowSuggestions(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b"
                >
                  <div className="text-lg font-semibold">{article.title}</div>
                  <div className="text-sm text-gray-600">{article.summary}</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {query && !loading && tags.length === 0 && users.length === 0 && articles.length === 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">没有找到相关内容</div>
      )}
    </div>
  );
};

export default SearchSuggestions;
