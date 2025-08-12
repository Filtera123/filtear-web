import { useState, useEffect } from 'react';
import { CollapsibleCommentSection } from '../components/comment';
import type { Comment } from '../components/comment/comment.type';
import { IP_LOCATIONS } from '@/utils/mockData';

// 模拟评论数据
const generateMockComments = (count: number): Comment[] => {
  const comments: Comment[] = [];
  
  for (let i = 1; i <= count; i++) {
    const ipLocations = IP_LOCATIONS;
    
    const comment: Comment = {
      id: `comment-${i}`,
      userId: `user-${i}`,
      userName: `用户${i}`,
      userAvatar: `https://i.pravatar.cc/32?img=${i}`,
      userIpLocation: ipLocations[i % ipLocations.length],
      content: `这是第${i}条评论的内容。${i % 3 === 0 ? '这条评论比较长，包含了更多的文字内容，用来测试不同长度评论的显示效果和高度计算功能。' : ''}`,
      createdAt: new Date(Date.now() - i * 60000).toISOString(),
      likes: Math.floor(Math.random() * 50),
      isLiked: Math.random() > 0.7,
      replies: i <= 3 ? [
        {
          id: `reply-${i}-1`,
          userId: `user-${i + 10}`,
          userName: `回复者${i}`,
          userAvatar: `https://i.pravatar.cc/32?img=${i + 10}`,
          userIpLocation: ipLocations[(i + 1) % ipLocations.length],
          content: `这是对第${i}条评论的回复`,
          createdAt: new Date(Date.now() - i * 30000).toISOString(),
          likes: Math.floor(Math.random() * 20),
          isLiked: Math.random() > 0.8,
        }
      ] : undefined,
    };
    comments.push(comment);
  }
  
  return comments;
};

export default function CommentDemo() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(5);

  // 模拟异步加载评论数据
  const loadComments = async (count: number) => {
    setIsLoading(true);
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newComments = generateMockComments(count);
    setComments(newComments);
    setIsLoading(false);
  };

  // 初始加载
  useEffect(() => {
    loadComments(commentCount);
  }, []);

  const handleAddComment = (_postId: string, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      userName: '当前用户',
      userAvatar: 'https://i.pravatar.cc/32?img=1',
      userIpLocation: '北京',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    setComments(prev => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          isLiked: !comment.isLiked,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
        };
      }
      return comment;
    }));
  };

  const handleReplyComment = (commentId: string, content: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      userId: 'current-user',
      userName: '当前用户',
      userAvatar: 'https://i.pravatar.cc/32?img=1',
      userIpLocation: '北京',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
        };
      }
      return comment;
    }));
  };

  const handleLoadMoreComments = () => {
    const newCount = commentCount + 5;
    setCommentCount(newCount);
    loadComments(newCount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* 页面标题 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              动态高度评论区演示
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              演示评论区的展开收起和动态高度计算功能
            </p>
          </div>

          {/* 模拟帖子内容 */}
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold mb-2">示例帖子标题</h2>
            <p className="text-gray-700 leading-relaxed">
              这是一个示例帖子的内容。评论区采用了动态高度计算技术，
              能够根据评论内容的实际高度来调整展开时的容器高度，
              提供流畅的展开收起动画效果。
            </p>
          </div>

          {/* 控制面板 */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => loadComments(3)}
                  className="px-3 py-1 text-sm text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7E44C6' }}
                  disabled={isLoading}
                >
                  加载3条评论
                </button>
                <button
                  onClick={() => loadComments(8)}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                  disabled={isLoading}
                >
                  加载8条评论
                </button>
                <button
                  onClick={() => loadComments(15)}
                  className="px-3 py-1 text-sm text-white rounded hover:opacity-90 transition-opacity" style={{ backgroundColor: '#7E44C6' }}
                  disabled={isLoading}
                >
                  加载15条评论
                </button>
              </div>
              
              {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2" style={{ borderBottomColor: '#7E44C6' }}></div>
                  <span>加载中...</span>
                </div>
              )}
            </div>
          </div>

          {/* 动态高度评论区 */}
          <div className="px-6">
            <CollapsibleCommentSection
              postId="demo-post"
              comments={comments}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReplyComment={handleReplyComment}
              onUserClick={(userId: string) => console.log('点击用户:', userId)}
              onBlockComment={(commentId: string) => console.log('屏蔽评论:', commentId)}
              onReportComment={(commentId: string) => console.log('举报评论:', commentId)}
              onBlockUser={(userId: string) => console.log('屏蔽用户:', userId)}
              onPostClick={handleLoadMoreComments}
              currentUserId="current-user"
              currentUserName="当前用户"
              currentUserAvatar="https://i.pravatar.cc/32?img=1"
              defaultExpanded={false}
              maxDisplayComments={5}
            />
          </div>

          {/* 说明文字 */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">功能说明：</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 评论区支持展开/收起，带有平滑动画效果</li>
              <li>• 自动计算内容高度，确保展开时高度刚好合适</li>
              <li>• 最多显示5条评论，超出部分可通过"查看全部"按钮查看</li>
              <li>• 绝对定位的隐藏容器用于测量实际内容高度</li>
              <li>• 支持异步数据加载后的高度重新计算</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 