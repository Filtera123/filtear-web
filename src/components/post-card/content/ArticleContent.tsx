import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Blockquote, Float } from '@chakra-ui/react';
import type { ArticlePost } from '../post.types';

interface ArticleContentProps {
  post: ArticlePost;
}

export default function ArticleContent({ post }: ArticleContentProps) {
  const navigate = useNavigate();

  const onPostClick = () => {
    navigate(`/post/article/${post.id}`, { 
      state: {
        ...post,
        fromPage: window.location.pathname // 记录当前页面路径
      }
    });
  };

  return (
    <div>
      {/* 帖子标题 */}
      <h2
        className="text-lg font-semibold text-gray-900 mb-4 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}
        onClick={onPostClick}
      >
        {post.title}
      </h2>

      {post.abstract && (
        <>
          {/* 引言上方横线 */}
          <hr className="border-gray-200 mb-4" />
          
          <Blockquote.Root
            variant="plain"
            className="text-gray-700 ml-4 cursor-pointer hover:text-gray-900 mb-4 italic"
            onClick={onPostClick}
          >
            <Float placement="top-start" offsetY="2">
              <Blockquote.Icon />
            </Float>
            <Blockquote.Content cite="Uzumaki Naruto">
              <span className="line-clamp-3">{post.abstract}</span>
            </Blockquote.Content>
            <Blockquote.Caption>
              — <cite>{post.author}</cite>
            </Blockquote.Caption>
          </Blockquote.Root>
          
          {/* 引言下方横线 */}
          <hr className="border-gray-200 mb-4" />
        </>
      )}

      {/* 帖子内容 */}
      <div
        className={`text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors ${
          post.abstract ? 'line-clamp-7' : 'line-clamp-9'
        }`}
        style={{ fontFamily: "'Source Han Sans CN', 'Noto Sans CJK SC', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif" }}
        onClick={onPostClick}
      >
        {post.content}
      </div>

      {/* 文章字数指示器 */}
      <div className="flex items-center text-gray-500 text-xs mb-3">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span>全文 {post.wordCount.toLocaleString()} 字</span>
      </div>
    </div>
  );
}