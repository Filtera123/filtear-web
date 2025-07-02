import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Tag from '../components/tag/Tag';

export default function TagPage() {
  const { tag } = useParams<{ tag: string }>();

  // 模拟该标签下的文章数据
  const posts = [
    {
      id: 1,
      title: '《满月浮的月夜》- 原神同人小说',
      author: '墨染青花',
      createdAt: '2024-01-15',
      views: 1567,
      likes: 234,
      comments: 12,
    },
    {
      id: 2,
      title: '璃月港的传说与故事',
      author: '云中君',
      createdAt: '2024-01-14',
      views: 892,
      likes: 156,
      comments: 8,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* 返回按钮 */}
        <Link 
          to="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← 返回首页
        </Link>

        {/* 标签信息 */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Tag tag={tag || ''} className="text-lg px-4 py-2" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">#{tag} 专栏</h1>
              <p className="text-gray-600">探索与 "{tag}" 相关的精彩内容</p>
            </div>
          </div>

          {/* 标签统计 */}
          <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
              <div className="text-sm text-gray-600">文章数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.views, 0)}
              </div>
              <div className="text-sm text-gray-600">总浏览量</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {posts.reduce((sum, post) => sum + post.likes, 0)}
              </div>
              <div className="text-sm text-gray-600">总点赞数</div>
            </div>
          </div>
        </div>

        {/* 文章列表 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">相关文章</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link 
                      to={`/post/${post.id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>by {post.author}</span>
                      <span>{post.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
} 