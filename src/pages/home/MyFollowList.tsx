import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { FullPostCard } from '../../components/post-card';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import PostArea from './PostArea';

interface Post {
  id: number;
  author: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  category: string;
  categorySlug: string;
  readingTime: number;
  title: string;
  content: string;
  tags: string[];
  isLike: boolean;
  likes: number;
  comments: number;
  commentList?: Comment[];
  views?: number;
  isFollowing?: boolean;
}

interface MyFollowListProps {
  isActive: boolean;
}

// 生成模拟帖子的函数
const generateMockPosts = (startId: number, count: number): Post[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    return {
      id,
      title: `关注帖子 ${id + 1}`,
      author: `关注用户${(id % 3) + 1}`,
      authorAvatar: '/default-avatar.png',
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `follow-post-${id}`,
      category: '关注内容',
      categorySlug: 'following',
      readingTime: Math.floor(Math.random() * 10) + 1,
      content: `这是第 ${id + 1} 个关注帖子的内容...`,
      tags: ['关注', '热门', '讨论'],
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 20),
      commentList: [],
      views: Math.floor(Math.random() * 500) + 50,
      isFollowing: true,
    };
  });
};

export default function MyFollowList({ isActive }: MyFollowListProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // 处理各种事件的回调函数
  const handleFollow = useCallback((userId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.author === userId ? { ...post, isFollowing: !post.isFollowing } : post
      )
    );
  }, []);

  const handleLike = useCallback((postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLike: !post.isLike,
              likes: post.isLike ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  }, []);

  const handleUserClick = useCallback(
    (userId: string) => {
      navigate(`/user/${userId}`);
    },
    [navigate]
  );

  const handlePostClick = useCallback(
    (postId: number) => {
      navigate(`/post/${postId}`);
    },
    [navigate]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      navigate(`/tag/${encodeURIComponent(tag)}`);
    },
    [navigate]
  );

  const handleReport = useCallback((postId: number, type: 'post' | 'user') => {
    alert(`您已举报该${type === 'post' ? '帖子' : '用户'}，我们将尽快处理`);
  }, []);

  const handleBlock = useCallback(
    (postId: number, type: 'post' | 'user') => {
      if (type === 'post') {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
        alert('已屏蔽该帖子');
      } else {
        const post = posts.find((p) => p.id === postId);
        if (post) {
          setPosts((prevPosts) => prevPosts.filter((p) => p.author !== post.author));
          alert(`已屏蔽用户 ${post.author}`);
        }
      }
    },
    [posts]
  );

  const handleUnfollow = useCallback((userId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.author === userId ? { ...post, isFollowing: false } : post))
    );
  }, []);

  const handleAddComment = useCallback((postId: number, content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: 'currentUser',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              commentList: [newComment, ...(post.commentList || [])],
              comments: (post.commentList?.length || 0) + 1,
            }
          : post
      )
    );
  }, []);

  const handleLikeComment = useCallback((commentId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        commentList: post.commentList?.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                isLiked: !comment.isLiked,
                likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
              }
            : comment
        ),
      }))
    );
  }, []);

  const handleReplyComment = useCallback((commentId: string, content: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      userId: 'currentUser',
      userName: '当前用户',
      userAvatar: '/default-avatar.png',
      content,
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        commentList: post.commentList?.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                replies: [newReply, ...(comment.replies || [])],
              }
            : comment
        ),
      }))
    );
  }, []);

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log(`加载关注帖子第 ${page + 1} 页`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPosts = generateMockPosts(page * 5, 5);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载4页（20个帖子）
    if (nextPage >= 4) {
      setHasMore(false);
    }

    setLoading(false);
  }, [page, hasMore, loading]);

  // 使用无限滚动Hook
  useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMorePosts,
  });

  // 只有当组件激活且未初始化时才加载第一页
  useEffect(() => {
    if (isActive && !initialized) {
      console.log('初始化关注帖子数据');
      setInitialized(true);
      loadMorePosts();
    }
  }, [isActive, initialized, loadMorePosts]);

  // 如果未激活则不渲染
  if (!isActive) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 gap-4">
        <PostArea />
        <div className="flex justify-end items-center mb-4 gap-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">最新</button>
          <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">最热</button>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <FullPostCard
              key={post.id}
              post={post}
              onFollow={handleFollow}
              onLike={handleLike}
              onUserClick={handleUserClick}
              onPostClick={handlePostClick}
              onTagClick={handleTagClick}
              onReport={handleReport}
              onBlock={handleBlock}
              onUnfollow={handleUnfollow}
              onAddComment={handleAddComment}
              onLikeComment={handleLikeComment}
              onReplyComment={handleReplyComment}
            />
          ))}

          {/* 加载指示器 */}
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">加载更多帖子...</span>
            </div>
          )}

          {/* 没有更多内容提示 */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="bg-gray-100 rounded-lg p-4">
                🎉 已加载全部内容！共 {posts.length} 个帖子
              </div>
            </div>
          )}

          {/* 空状态 */}
          {posts.length === 0 && !loading && initialized && (
            <div className="text-center py-8 text-gray-500">暂无关注内容</div>
          )}
        </div>
      </div>
    </div>
  );
}
