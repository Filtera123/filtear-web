import React, { useState, useEffect } from 'react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Article {
  title: string;
  link: string;
  summary: string;
  tags: string[];
}

interface Tag {
  tag: string;
  link: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ query, onSuggestionClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const defaultAvatar = 'https://example.com/default-avatar.jpg'; // 默认头像链接

  useEffect(() => {
    if (!query) return;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
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
          title: 'nihao 文章', 
          link: '/article/nihao',
          summary: '这是一篇关于nihao的文章...', 
          tags: ['#ni', '#ninja']
        },
        { 
          title: 'ninjago 文章', 
          link: '/article/ninjago',
          summary: '这是一篇关于ninjago的文章...', 
          tags: ['#ninjago', '#MBTI']
        },
        { 
          title: 'MBTI测试', 
          link: '/article/mbti',
          summary: '这是一篇关于MBTI测试的文章...', 
          tags: ['#MBTI']
        },
      ];
      const tagsData: Tag[] = [
        { tag: '#ni', link: '/tag/ni' },
        { tag: '#ninja', link: '/tag/ninja' },
        { tag: '#ni feng', link: '/tag/ni_feng' },
      ];

      const filteredUsers = usersData.filter(user => user.name.toLowerCase().includes(query.toLowerCase()));
      const filteredArticles = articlesData.filter(article => article.title.toLowerCase().includes(query.toLowerCase()) || article.summary.toLowerCase().includes(query.toLowerCase()));
      const filteredTags = tagsData.filter(tag => tag.tag.toLowerCase().includes(query.toLowerCase()));

      setUsers(filteredUsers);
      setArticles(filteredArticles);
      setTags(filteredTags);

      setLoading(false);
    }, 500); // 500 毫秒延迟

    setDebounceTimeout(timeout);
  }, [query]);

  return (
    <div className="absolute bg-white w-full mt-2 border border-gray-300 rounded-sm z-10 max-h-96 overflow-y-auto">
      {loading && (
        <div className="px-4 py-2 text-sm text-gray-500">加载中...</div>
      )}

      {/* 相关标签 */}
      {query && tags.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关标签</div>
          {tags.map((tag) => (
            <a
              key={tag.tag}
              href={tag.link}
              onClick={(e) => { 
                e.preventDefault(); 
                onSuggestionClick(tag.tag); // 触发父组件传递的事件
              }}
              className="inline-block mr-2 mb-2 px-3 py-1 text-black bg-gray-200 rounded-md hover:bg-gray-300 cursor-pointer"
            >
              #{tag.tag}
            </a>
          ))}
        </div>
      )}

      {/* 相关用户卡片 */}
      {query && users.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关用户</div>
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => { 
                onSuggestionClick(user.name); // 触发父组件事件，添加到历史记录
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
      {query && articles.length > 0 && (
        <div>
          <div className="px-4 py-2 font-bold text-sm text-gray-700">相关文章</div>
          {articles.map((article) => (
            <div
              key={article.title}
              onClick={() => { 
                onSuggestionClick(article.link); // 触发父组件事件，添加到历史记录
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
                      onSuggestionClick(tag); // 触发父组件事件，添加到历史记录
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