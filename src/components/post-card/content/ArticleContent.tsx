import React from 'react';
import type { ArticlePost } from '../post.types';

interface ArticleContentProps {
  post: ArticlePost;
  onPostClick?: (postId: number) => void;
}

export default function ArticleContent({ post, onPostClick }: ArticleContentProps) {
  // 计算引言大约占用的行数
  const calculateAbstractLines = (text: string) => {
    // 大约每60个字符为一行，这是一个估算
    const charactersPerLine = 60;
    const lines = Math.ceil(text.length / charactersPerLine);
    return Math.min(lines, 3); // 引言最多3行
  };

  // 计算正文可用的行数
  const getContentLineClamp = () => {
    if (!post.abstract) {
      return 7; // 没有引言时，正文可以用全部7行
    }
    
    const abstractLines = calculateAbstractLines(post.abstract);
    const horizontalLines = 2; // 上下两条横线占2行
    const availableLines = 7 - abstractLines - horizontalLines;
    
    return Math.max(1, availableLines); // 至少保留1行给正文
  };

  const contentLineClamp = getContentLineClamp();

  return (
    <div>
      {/* 帖子标题 */}
      <h2 
        className="text-lg font-semibold text-gray-900 mb-3 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={() => onPostClick?.(post.id)}
      >
        {post.title}
      </h2>

      {/* 文章引言 */}
      {post.abstract && (
        <div className="mb-3">
          <hr className="mb-2 border-gray-200" />
          <div 
            className="text-gray-600 text-sm leading-relaxed italic cursor-pointer hover:text-gray-800 transition-colors"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: Math.min(3, 7 - 2 - 1), // 引言最多3行，或者总共7行减去2条横线再减去至少1行正文
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
            onClick={() => onPostClick?.(post.id)}
          >
            {post.abstract}
          </div>
          <hr className="mt-2 border-gray-200" />
        </div>
      )}

      {/* 帖子内容 */}
      <div 
        className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: contentLineClamp,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
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