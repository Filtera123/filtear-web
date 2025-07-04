import React from 'react';
import type { ArticlePost } from '../post.types';

interface ArticleContentProps {
  post: ArticlePost;
  onPostClick?: (postId: number) => void;
}

export default function ArticleContent({ post, onPostClick }: ArticleContentProps) {
  return (
    <div>
      {/* 帖子标题 */}
      <h2 
        className="text-lg font-semibold text-gray-900 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.title}
      </h2>

      {/* 帖子内容 */}
      <div 
        className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.content}
      </div>

      {/* 文章字数指示器 */}
      <div className="flex items-center text-gray-500 text-xs mb-3">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>全文 {post.wordCount.toLocaleString()} 字</span>
      </div>
    </div>
  );
} 