import React, { useState } from 'react';
import type { VideoPost } from '../post.types';
import { useNavigate } from 'react-router-dom';

interface VideoContentProps {
  post: VideoPost;
  onVideoClick?: () => void;
}

// 格式化视频时长
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default function VideoContent({ post, onVideoClick }: VideoContentProps) {
  const navigate = useNavigate();
  const onPostClick = () => {
    if (onVideoClick) {
      onVideoClick();
    } else {
      navigate(`/post/video/${post.id}`, { 
        state: { 
          ...post,
          fromPage: window.location.pathname // 记录当前页面路径
        } 
      });
    }
  };
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onVideoClick) {
      onVideoClick();
    } else {
      setIsPlaying(true);
    }
  };

  return (
    <div>
      {/* 帖子标题 */}
      <h2
        className="text-lg font-semibold text-gray-900 mb-2 leading-tight cursor-pointer hover:text-blue-600 transition-colors"
        onClick={onPostClick}
      >
        {post.title}
      </h2>

      {/* 视频描述 */}
      {post.content && (
        <div
          className="text-gray-700 text-sm leading-relaxed mb-3 cursor-pointer hover:text-gray-900 transition-colors"
          onClick={onPostClick}
        >
          {post.content}
        </div>
      )}

      {/* 视频播放区域 */}
      <div className="mb-3">
        <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
          {!videoError ? (
            <>
              {!isPlaying ? (
                // 视频封面
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={handleVideoClick}
                >
                  <img
                    src={post.video.thumbnail}
                    alt={`${post.title} - 视频封面`}
                    className="w-full h-full object-cover"
                    onError={handleVideoError}
                  />

                  {/* 播放按钮覆层 */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-40 transition-all">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  {/* 视频时长标签 */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {formatDuration(post.video.duration)}
                  </div>
                </div>
              ) : (
                // 视频播放器
                <div className="w-full h-full cursor-pointer" onClick={handleVideoClick}>
                  <video
                    src={post.video.url}
                    controls
                    autoPlay
                    className="w-full h-full"
                    onError={handleVideoError}
                    poster={post.video.thumbnail}
                  >
                    您的浏览器不支持视频播放。
                  </video>
                </div>
              )}
            </>
          ) : (
            // 视频加载错误时的占位符
            <div
              className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
              onClick={onPostClick}
            >
              <svg className="w-16 h-16 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">视频无法加载</span>
              <span className="text-xs mt-1">点击查看详情</span>
            </div>
          )}
        </div>

        {/* 视频信息 */}
        <div className="flex items-center justify-between mt-2 text-gray-500 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>时长 {formatDuration(post.video.duration)}</span>
            </div>
            {post.video.width && post.video.height && (
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span>{post.video.width}×{post.video.height}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
