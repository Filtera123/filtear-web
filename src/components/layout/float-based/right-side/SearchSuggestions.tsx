import React, { useEffect, useRef, useState } from 'react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: { type: 'tag' | 'user' | 'article'; value: string; link: string }) => void;
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

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSuggestionClick }) => {
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
      className="absolute bg-white w-full mt-2 border border-gray-300 rounded-sm z-10 max-h-96 overflow-y-auto"
      ref={suggestionsRef}
    >
      {loading && <div className="px-4 py-2 text-sm text-gray-500">加载中...</div>}

      {/* 相关标签 */}
      {query && showSuggestions && tags.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关标签</div>
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
                  {/* 标签显示 */}
                  <span className="text-sm font-medium">#{tag.tag.replace(/^#+/, '')}</span>{' '}
                  {/* 去除重复的 # 符号 */}
                  {/* 添加关联标签 */}
                  {tag.tag === '#ni' && <span className="text-xs text-gray-500">小说</span>}
                </div>
                {/* 帖子数量显示在下一行 */}
                <span className="text-xs text-gray-600 mt-1">{tag.postsCount} 个最新帖子</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 相关用户卡片 */}
      {query && showSuggestions && users.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关用户</div>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                onSuggestionClick({ type: 'user', value: user.name, link: `/user/${user.id}` });
                setShowSuggestions(false);
              }}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer border-b rounded-lg mb-2"
           >
              <img
                src={user.avatar || defaultAvatar}
                alt={user.name}
                onError={(e) => e.currentTarget.src = defaultAvatar}
                className="w-8 h-8 rounded-full mr-2"
              />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* 相关文章卡片 */}
      {query && showSuggestions && articles.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关文章</div>
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
              <div className="mt-1">
                {article.tags.map((tag) => (
                  <a
                    key={tag}
                    href={`/tag/${tag}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSuggestionClick({ type: 'tag', value: tag.replace(/^#+/, ''), link: `/tag/${tag.replace(/^#+/, '')}` });
                      setShowSuggestions(false);
                    }}
                    className="text-blue-500 mr-2"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {query && !loading && tags.length === 0 && users.length === 0 && articles.length === 0 && (
        <div className="px-4 py-2 text-sm text-gray-500">没有找到相关内容</div>
      )}
    </div>
  );
};

export default SearchSuggestions;
