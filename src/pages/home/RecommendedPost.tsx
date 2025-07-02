import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { FullPostCard } from './../../components/post-card';
import PostArea from './PostArea';

// 类型定义
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

// 生成模拟评论的函数
const generateMockComments = (postId: number): Comment[] => {
  const commentCount = Math.floor(Math.random() * 10) + 8; // 8-17条评论
  return Array.from({ length: commentCount }, (_, i) => {
    const comment: Comment = {
      id: `comment-${postId}-${i}`,
      userId: `user${(i % 3) + 1}`,
      userName: `评论用户${(i % 3) + 1}`,
      userAvatar: '/default-avatar.png',
      content:
        i % 5 === 0
          ? `很有深度的内容！第 ${i + 1} 条评论：这个话题让我想到了很多，期待作者能够继续深入讨论这个问题。`
          : i % 5 === 1
            ? `支持！第 ${i + 1} 条评论：写得非常好，学到了很多新知识，感谢分享！`
            : i % 5 === 2
              ? `有不同看法。第 ${i + 1} 条评论：我觉得还可以从另一个角度来看这个问题，比如...`
              : i % 5 === 3
                ? `收藏了！第 ${i + 1} 条评论：这种类型的内容正是我在寻找的，已经分享给朋友了。`
                : `第 ${i + 1} 条评论：很实用的内容，对我帮助很大，希望能看到更多类似的分享！`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      likes: Math.floor(Math.random() * 20),
      isLiked: Math.random() > 0.8,
      replies:
        Math.random() > 0.7
          ? [
              {
                id: `reply-${postId}-${i}-1`,
                userId: `user${((i + 1) % 3) + 1}`,
                userName: `回复用户${((i + 1) % 3) + 1}`,
                userAvatar: '/default-avatar.png',
                content: `回复评论 ${i + 1} 的内容...`,
                createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                likes: Math.floor(Math.random() * 5),
                isLiked: false,
              },
            ]
          : undefined,
    };
    return comment;
  });
};

// 生成模拟标签的函数
const generateMockTags = (postId: number): string[] => {
  const allTags = [
    '推荐',
    '热门',
    '讨论',
    '分享',
    '技术',
    '生活',
    '学习',
    '工作',
    '娱乐',
    '游戏',
    '音乐',
    '电影',
    '美食',
    '旅行',
    '摄影',
    '艺术',
    '设计',
    '科技',
    '新闻',
    '体育',
    '健康',
    '时尚',
    '书籍',
    '动漫',
    '宠物',
    '家居',
    '汽车',
    '数码',
    '投资',
    '创业',
  ];

  // 根据帖子ID决定标签数量，有些帖子有很多标签用于测试展开功能
  let tagCount;
  if (postId % 4 === 0) {
    tagCount = Math.floor(Math.random() * 8) + 8; // 8-15个标签
  } else if (postId % 3 === 0) {
    tagCount = Math.floor(Math.random() * 5) + 5; // 5-9个标签
  } else {
    tagCount = Math.floor(Math.random() * 3) + 2; // 2-4个标签
  }

  // 确保不超过20个标签
  tagCount = Math.min(tagCount, 20);

  // 随机选择标签
  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
};

// 生成模拟帖子的函数
const generateMockPosts = (startId: number, count: number): Post[] => {
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const commentList = generateMockComments(id);
    const tags = generateMockTags(id);

    return {
      id,
      title: `推荐帖子 ${id + 1}`,
      author: `用户${(id % 5) + 1}`,
      authorAvatar: '/default-avatar.png',
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `recommended-post-${id}`,
      category: '推荐内容',
      categorySlug: 'recommended',
      readingTime: Math.floor(Math.random() * 10) + 1,
      content: `这是第 ${id + 1} 个推荐帖子的内容，包含有趣的话题和讨论。内容会根据不同的帖子而变化，让用户有不同的阅读体验...`,
      tags,
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 500),
      comments: commentList.length,
      commentList,
      views: Math.floor(Math.random() * 1000) + 100,
      isFollowing: Math.random() > 0.6,
    };
  });
};

export default function RecommendedPost() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loadingRef = useRef(false); // 防止重复加载的引用

  // 处理关注/取消关注
  const handleFollow = useCallback((userId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.author === userId ? { ...post, isFollowing: !post.isFollowing } : post
      )
    );
  }, []);

  // 处理点赞/取消点赞
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

  // 处理用户点击
  const handleUserClick = useCallback(
    (userId: string) => {
      console.log('跳转到用户主页', userId);
      navigate(`/user/${userId}`);
    },
    [navigate]
  );

  // 处理帖子点击
  const handlePostClick = useCallback(
    (postId: number) => {
      console.log('跳转到帖子详情页', postId);
      navigate(`/post/${postId}`);
    },
    [navigate]
  );

  // 处理标签点击
  const handleTagClick = useCallback(
    (tag: string) => {
      console.log('跳转到标签专栏页', tag);
      navigate(`/tag/${encodeURIComponent(tag)}`);
    },
    [navigate]
  );

  // 处理举报
  const handleReport = useCallback((postId: number, type: 'post' | 'user') => {
    console.log(`举报${type}`, postId);
    alert(`您已举报该${type === 'post' ? '帖子' : '用户'}，我们将尽快处理`);
  }, []);

  // 处理屏蔽
  const handleBlock = useCallback(
    (postId: number, type: 'post' | 'user') => {
      console.log(`屏蔽${type}`, postId);
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

  // 处理取消关注
  const handleUnfollow = useCallback((userId: string) => {
    console.log('取消关注', userId);
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.author === userId ? { ...post, isFollowing: false } : post))
    );
  }, []);

  // 处理添加评论
  const handleAddComment = useCallback((postId: number, content: string) => {
    console.log('添加评论', postId, content);
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

  // 处理评论点赞
  const handleLikeComment = useCallback((commentId: string) => {
    console.log('点赞评论', commentId);
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

  // 处理回复评论
  const handleReplyComment = useCallback((commentId: string, content: string) => {
    console.log('回复评论', commentId, content);
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
    // 防止重复加载
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    console.log(`加载第 ${page + 1} 页，起始ID: ${page * 10}`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newPosts = generateMockPosts(page * 10, 10);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载6页（60个帖子）
    if (nextPage >= 6) {
      setHasMore(false);
      console.log('已加载完所有内容');
    }

    setLoading(false);
    loadingRef.current = false;
  }, [page, hasMore]);

  // 滚动监听函数（带防抖）
  const handleScroll = useCallback(() => {
    if (loadingRef.current || !hasMore) return;

    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const { scrollTop, scrollHeight, clientHeight } = mainElement;

    // 当滚动到接近底部时（距离底部200px以内）
    if (scrollHeight - scrollTop <= clientHeight + 200) {
      console.log('触发加载更多');
      loadMorePosts();
    }
  }, [loadMorePosts, hasMore]);

  // 初始化加载
  useEffect(() => {
    // 只在组件首次挂载时加载第一页
    if (posts.length === 0 && page === 0 && !loadingRef.current) {
      loadMorePosts();
    }
  }, []); // 空依赖数组，只在挂载时运行一次

  // 滚动监听
  useEffect(() => {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-1 gap-4">
        <PostArea />
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
          {posts.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">暂无推荐内容</div>
          )}
        </div>
      </div>
    </div>
  );
}
