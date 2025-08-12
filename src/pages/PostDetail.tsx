import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Tag from '../components/tag/Tag';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();

  // 模拟帖子数据
  const post = {
    id: parseInt(postId || '1'),
    title: '《满月浮的月夜》- 原神同人小说',
    author: '墨染青花',
    authorAvatar: '/default-avatar.png',
    createdAt: '2024-01-15T10:30:00Z',
    content: `夜幕降临，璃月港的灯火星星点点亮起。钟离站在石板路上，月光洒在他的肩头上，为这位岩王帝君罩上了几分温柔...

这是一个关于璃月港月夜的故事。在这个宁静的夜晚，古老的传说与现实交织，展现出一幅美丽而神秘的画卷。

钟离慢慢走过熟悉的街道，每一块石板都承载着千年的记忆。月光如水般倾泻下来，照亮了这个古老港口的每一个角落。

在远处，传来了悠扬的笛声，那是来自往昔的回响，诉说着璃月港不为人知的故事...`,
    tags: ['原神', '小说', '虚构', '满月', '同人小说'],
    likes: 234,
    comments: 1200,
    views: 1567,
    isLike: false,
    isFavorite: false,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        {/* 返回按钮 */}
        <Link 
          to="/" 
          className="inline-flex items-center hover:opacity-80 transition-opacity mb-6"
          style={{ color: '#7E44C6' }}
        >
          ← 返回列表
        </Link>

        {/* 文章标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* 作者信息 */}
        <div className="flex items-center space-x-3 mb-6">
          <Link to={`/user/${post.author}`}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:opacity-90 transition-all" style={{ backgroundColor: '#7E44C6' }}>
              <span className="text-white font-medium">{post.author[0]}</span>
            </div>
          </Link>
          <div>
            <Link 
              to={`/user/${post.author}`}
              className="font-medium text-gray-900 hover:opacity-80 transition-opacity"
            style={{ color: '#7E44C6' }}
            >
              {post.author}
            </Link>
            <div className="text-sm text-gray-500">
              发布于 {new Date(post.createdAt).toLocaleDateString('zh-CN')}
            </div>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="prose max-w-none mb-6">
          {post.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-gray-700 mb-4 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag, index) => (
            <Link key={`${tag}-${index}`} to={`/tag/${encodeURIComponent(tag)}`}>
              <Tag tag={{ name: tag }} />
            </Link>
          ))}
        </div>

        {/* 文章统计 */}
        <div className="flex items-center justify-between py-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-gray-500">
            <span className="flex items-center space-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{post.views} 浏览</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{post.likes} 点赞</span>
            </span>
            <span className="flex items-center space-x-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{post.comments} 评论</span>
            </span>
          </div>
        </div>

        {/* 评论区域 */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">评论区</h3>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            评论功能开发中...
          </div>
        </div>
      </div>
    </div>
    </div>
  );
} 