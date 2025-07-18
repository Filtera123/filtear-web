import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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

interface VideoDetailModalProps {
  post: VideoPost;
  onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ post, onClose }) => {
  const { likes, isLike, handleLike, comments, views, formatNumber } = usePostActions(post);

  // 支持 ESC 关闭
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const modalContent = (
    <div className="fixed inset-0 z-50 flex w-full min-h-screen text-white" style={{ background: 'rgba(0,0,0,0.85)' }} onClick={onClose}>
      {/* 视频区域+评论区 */}
      <div className="flex flex-1">
        {/* 左侧视频区 */}
        <div className="flex-1 flex flex-col items-center justify-center relative" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-center p-4 w-full">
            <video
              src={post.video.url}
              poster={post.video.thumbnail}
              controls
              autoPlay
              className="rounded-2xl bg-black"
              style={{ width: '960px', maxWidth: '90vw', height: '540px', maxHeight: '80vh', objectFit: 'contain' }}
            >
              您的浏览器不支持视频播放。
            </video>
          </div>
        </div>
        {/* 右侧信息 + 评论 */}
        <aside className="w-[360px] p-4 bg-white text-black overflow-y-auto border-l border-gray-200" onClick={e => e.stopPropagation()}>
          {/* 作者信息 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <img src={post.authorAvatar} alt="头像" className="w-8 h-8 rounded-full mr-2" />
              <div className="text-sm font-medium">{post.author}</div>
            </div>
            <button className="text-sm text-blue-500">关注</button>
          </div>
          {/* 发布时间和正文 */}
          <div className="text-xs text-gray-500 mb-2">{post.createdAt}</div>
          <div className="text-sm text-gray-700 mb-4">{post.content}</div>
          {/* 浏览 评论 点赞 */}
          <div className="flex space-x-4 text-xs text-gray-500 mb-4">
            <div className="text-gray-600 text-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">{formatNumber(views)}</span>
            <button className="text-gray-600 hover:text-blue-500 text-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <span className="text-sm text-gray-600">{formatNumber(comments)}</span>
            {/* 点赞 */}
            <button
              onClick={handleLike}
              className={`text-xl transition-colors ${isLike ? 'text-red-500' : 'text-red-600 hover:text-red-500'}`}
            >
              {isLike ? (
                <svg className="w-6 h-6 fill-red-500" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              )}
            </button>
            <span className="text-sm text-gray-600">{formatNumber(likes)}</span>
          </div>
          {/* 评论区 */}
          <CommentSection postId={post.id} comments={post.commentList || []} />
        </aside>
      </div>
      {/* 关闭按钮 */}
      <button onClick={onClose} className="absolute top-6 left-6 z-50 bg-black bg-opacity-70 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-opacity-100">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
  return createPortal(modalContent, document.body);
};

export default VideoDetailModal;
