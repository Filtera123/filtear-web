import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CommentSection from '@/components/comment/CommentSection';
import type { VideoPost } from '@/components/post-card/post.types';
import { usePostActions } from '@/hooks/usePostActions';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default function VideoDetail() {
  const location = useLocation();
  const { id } = useParams();
  const post = location.state?.post as VideoPost | undefined;
  const navigate = useNavigate();

  if (!post) return <div>Loading...</div>;

  const { likes, isLike, handleLike, comments, views, formatNumber } = usePostActions(post);

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex w-full min-h-screen">
      {/* 视频主体 */}
      <main className="flex-1 p-4 flex flex-col items-center ">
        {/* 返回按钮 */}
        <button
      onClick={handleBack}
      className="absolute top-4 left-4 z-10 rounded-full bg-black bg-opacity-50 text-white w-8 h-8 flex items-center justify-center hover:bg-opacity-80 transition-colors"
    >
      ←
    </button>

        {/* 视频播放器 */}
        <div className="relative w-full max-w-5xl m-5 aspect-video bg-black text-white rounded-3xl overflow-hidden">
          <video
            src={post.video.url}
            poster={post.video.thumbnail}
            controls
            autoPlay
            className="w-full h-full"
          >
            您的浏览器不支持视频播放。
          </video>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center px-4 py-2 text-xs text-white bg-black bg-opacity-50">
            <div className="flex space-x-4">
              <span>播放/暂停</span>
              <span>时长 {formatDuration(post.video.duration)}</span>
            </div>
            <div className="flex space-x-4">
              <span>分辨率</span>
              <span>小窗</span>
              <span>全屏</span>
              <span>扬声器</span>
            </div>
          </div>
        </div>
      </main>

      {/* 右侧信息 + 评论 */}
      <aside className="w-1/4 p-4 border-l border-gray-200 flex flex-col">
        {/* 作者信息 */}
        <div className="flex items-center justify-between m-1">
          <div className="flex items-center">
            <img src={post.authorAvatar} alt="头像" className="w-8 h-8 rounded-full mr-2" />
            <div className="text-sm">{post.author}</div>
          </div>
          <button className="text-sm text-blue-500">关注</button>
        </div>
        <div className="text-xs text-gray-400 mb-4">{post.createdAt}</div>

        {/* 正文 */}
        <div className="text-sm text-gray-800 mb-4">{post.content}</div>

        {/* 观看 */}
        <div className="flex space-x-4 text-xs text-gray-500 mb-4">
          <div className="text-gray-600 text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
          <span className="text-sm text-gray-600">{formatNumber(views)}</span>

          <button className="text-gray-600 hover:text-blue-500 text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
          <span className="text-sm text-gray-600">{formatNumber(comments)}</span>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className={`text-xl transition-colors ${
              isLike ? 'text-red-500' : 'text-red-600 hover:text-red-500'
            }`}
          >
            {isLike ? (
              <svg className="w-6 h-6 fill-red-500" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            )}
          </button>
          <span className="text-sm text-gray-600">{formatNumber(likes)}</span>
        </div>

        {/* 热门评论 */}

        <div id="comment-section" className="mt-8">
          <CommentSection postId={post.id} comments={post.commentList || []} />
        </div>
      </aside>
    </div>
  );
}
