import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Popover } from '@chakra-ui/react';
import CommentSection from '@/components/comment/CommentSection';
import type { VideoPost } from '@/components/post-card/post.types';
import { usePostActions } from '@/hooks/usePostActions';
import { useBrowsingHistoryStore } from '@/stores/browsingHistoryStore';
import { useReportContext } from '@/components/report';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 格式化时间显示
const formatTime = (dateString: string): string => {
  const now = new Date();
  const postTime = new Date(dateString);
  const diffMs = now.getTime() - postTime.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return diffMinutes < 1 ? '刚刚' : `${diffMinutes}分钟前`;
  } else if (diffHours < 24) {
    return `${diffHours}小时前`;
  } else if (diffDays < 30) {
    return `${diffDays}天前`;
  } else {
    return postTime.toLocaleDateString('zh-CN');
  }
};

interface VideoDetailModalProps {
  post: VideoPost;
  onClose: () => void;
}

const VideoDetailModal: React.FC<VideoDetailModalProps> = ({ post, onClose }) => {
  const { 
    likes, 
    isLike, 
    handleLike, 
    comments, 
    views, 
    formatNumber,
    isFollowing,
    handleFollow,
    handleUnfollow,
    handleBlockUser,
    handleReportPost,
    handleBlockPost
  } = usePostActions(post);
  const { addRecord } = useBrowsingHistoryStore();
  const { openReportModal } = useReportContext();

  // 添加安全检查，确保post和video存在
  if (!post || !post.video) {
    console.error('VideoDetailModal: 无效的帖子数据', post);
    console.error('Post type:', post?.type);
    console.error('Post video:', post?.video);
    
    // 返回错误提示而不是直接渲染
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
          <h2 className="text-lg font-bold mb-4">加载失败</h2>
          <p className="text-gray-600 mb-4">视频数据无效或缺失</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            关闭
          </button>
        </div>
      </div>
    );
  }

  // 禁用背景滚动
  useEffect(() => {
    // 保存当前滚动位置
    const scrollY = window.scrollY;
    const body = document.body;
    
    // 获取滚动条宽度
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    // 禁用滚动并防止内容跳动
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      // 恢复滚动
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflow = '';
      body.style.paddingRight = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // 记录浏览历史
  useEffect(() => {
    addRecord({
      id: post.id,
      title: post.title || '视频内容',
      author: post.author,
      authorAvatar: post.authorAvatar,
      type: 'video',
      url: `/post/video/${post.id}`,
      thumbnail: post.video.thumbnail,
    });
  }, [post.id]); // 只依赖 post.id，避免重复添加

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
            <button
              onClick={isFollowing ? handleUnfollow : handleFollow}
              className={`text-sm transition-colors ${
                isFollowing ? 'text-gray-500' : 'text-blue-500 hover:text-blue-600'
              }`}
            >
              {isFollowing ? '已关注' : '关注'}
            </button>
          </div>
          {/* 发布时间和正文 */}
          <div className="text-xs text-gray-500 mb-2">{formatTime(post.createdAt)}</div>
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
            {/* 更多操作按钮 */}
            <Popover.Root 
              positioning={{ 
                placement: 'bottom-end',
                strategy: 'absolute'
              }}
              modal={false}
            >
              <Popover.Trigger asChild>
                <button className="text-gray-600 hover:text-gray-800 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                  </svg>
                </button>
              </Popover.Trigger>

              <Popover.Positioner>
                <Popover.Content 
                  className="bg-white rounded-lg shadow-lg border-[0.5px] border-gray-200 py-1"
                  style={{ zIndex: 9999, width: '80px', minWidth: '80px', maxWidth: '80px' }}
                >
                  {isFollowing && (
                    <button
                      onClick={handleUnfollow}
                      className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      取消关注
                    </button>
                  )}
                  <button
                    onClick={handleBlockPost}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    屏蔽帖子
                  </button>
                  <button
                    onClick={handleBlockUser}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    屏蔽用户
                  </button>
                  <button
                    onClick={() => openReportModal(post.id, 'post', post.author)}
                    className="w-full text-left px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    举报
                  </button>
                </Popover.Content>
              </Popover.Positioner>
            </Popover.Root>
          </div>
          {/* 评论区 */}
          <CommentSection postId={post.id} comments={post.commentList || []} showAllComments={true} />
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
