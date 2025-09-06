import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DynamicPost } from '../post.types';

export interface DynamicContentProps {
  post: DynamicPost;
}

export default function DynamicContent({ post }: DynamicContentProps) {
  const navigate = useNavigate();
  const onPostClick = () => {
    navigate(`/post/dynamic/${post.id}`, {
      state: {
        ...post,
        fromPage: window.location.pathname // 记录当前页面路径
      }
    });
  };
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setImageLoadErrors((prev) => new Set(prev).add(index));
  };

  // 根据图片数量决定布局样式
  const getImageGridClass = (imageCount: number) => {
    switch (imageCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-3';
    }
  };

  return (
    <div>
      {/* 帖子标题 */}
      <h2
        className="text-lg font-semibold text-gray-900 mb-4 leading-tight cursor-pointer hover:text-purple-600 transition-colors"
        style={{ fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif" }}
        onClick={onPostClick}
      >
        {post.title}
      </h2>

      {/* 动态内容 */}
      <div
        className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 7,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          fontFamily: "'Source Han Sans CN', 'Source Han Sans', sans-serif"
        }}
        onClick={onPostClick}
      >
        {post.content}
      </div>

      {/* 配图展示 */}
      {post.images && post.images.length > 0 && (
        <div className="mb-3 mr-10">
          <div className={`grid gap-2 ${getImageGridClass(post.images.length)}`}>
            {post.images.slice(0, 9).map((image, index) => {
              const isLastItem = index === 8 && post.images!.length > 9;
              const remainingCount = post.images!.length - 9;

              return (
                <div
                  key={index}
                  className={`relative overflow-hidden bg-gray-100 cursor-pointer hover:opacity-95 transition-opacity ${
                    post.images!.length === 1 ? 'aspect-[4/3]' : 'aspect-square'
                  }`}
                  onClick={onPostClick}
                >
                  {!imageLoadErrors.has(index) ? (
                    <>
                      <img
                        src={image.url}
                        alt={image.alt || `${post.title} - 配图 ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(index)}
                      />

                      {/* 显示剩余图片数量 */}
                      {isLastItem && remainingCount > 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-lg font-medium">+{remainingCount}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 图片数量提示 */}
          {post.images.length > 1 && (
            <div className="flex items-center justify-between mt-2 text-gray-500 text-xs">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>共 {post.images.length} 张图片</span>
              </div>

              <button
                onClick={onPostClick}
                className="hover:opacity-80 transition-opacity"
                style={{ color: '#7E44C6' }}
              >
                查看全部
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
