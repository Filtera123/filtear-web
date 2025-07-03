import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { FullPostCard } from './../../components/post-card';
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

interface MySubscriptionsPostListProps {
  isActive: boolean;
}

export default function MySubscriptionsPostList({ isActive }: MySubscriptionsPostListProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // 初始帖子数据
  const initialPosts: Post[] = [
    {
      id: 1,
      author: '墨染青花',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      slug: 'sample-post',
      category: '原神',
      categorySlug: 'genshin',
      readingTime: 5,
      title: '《满月浮的月夜》- 原神同人小说',
      content:
        '夜幕降临，璃月港的灯火星星点点亮起。钟离站在石板路上，月光洒在他的肩头上，为这位岩王帝君罩上了几分温柔...',
      tags: [
        '原神',
        '小说',
        '虚构',
        '满月',
        '同人小说',
        '璃月港',
        '钟离',
        '岩王帝君',
        '月夜',
        '浪漫',
        '文学创作',
        '游戏同人',
        '中文小说',
        '幻想',
        '古风',
        '温柔',
        '诗意',
        '夜景',
      ],
      isLike: false,
      likes: 234,
      comments: 8,
      commentList: [
        {
          id: 'comment-1-1',
          userId: 'user1',
          userName: '云中君',
          userAvatar: '/default-avatar.png',
          content: '写得真好！钟离的形象刻画得很生动，期待后续！',
          createdAt: '2024-01-15T12:00:00Z',
          likes: 5,
          isLiked: false,
          replies: [
            {
              id: 'reply-1-1-1',
              userId: 'user2',
              userName: '墨染青花',
              userAvatar: '/default-avatar.png',
              content: '谢谢支持！后续会更精彩的～',
              createdAt: '2024-01-15T12:30:00Z',
              likes: 2,
              isLiked: true,
            },
          ],
        },
        {
          id: 'comment-1-2',
          userId: 'user3',
          userName: '风之诗人',
          userAvatar: '/default-avatar.png',
          content: '璃月港的夜景描写很有画面感，仿佛能看到月光下的钟离',
          createdAt: '2024-01-15T14:00:00Z',
          likes: 8,
          isLiked: true,
        },
        {
          id: 'comment-1-3',
          userId: 'user4',
          userName: '旅行者',
          userAvatar: '/default-avatar.png',
          content: '收藏了！什么时候更新下一章？',
          createdAt: '2024-01-15T16:00:00Z',
          likes: 3,
          isLiked: false,
        },
        {
          id: 'comment-1-4',
          userId: 'user5',
          userName: '璃月商人',
          userAvatar: '/default-avatar.png',
          content: '钟离先生的气质描写太棒了！特别是那种古老而深邃的感觉',
          createdAt: '2024-01-15T17:30:00Z',
          likes: 12,
          isLiked: false,
        },
        {
          id: 'comment-1-5',
          userId: 'user6',
          userName: '岩王帝君粉',
          userAvatar: '/default-avatar.png',
          content: '月光下的钟离真的太有魅力了，这段描写让我想到了很多往事',
          createdAt: '2024-01-15T18:00:00Z',
          likes: 7,
          isLiked: true,
        },
        {
          id: 'comment-1-6',
          userId: 'user7',
          userName: '小说爱好者',
          userAvatar: '/default-avatar.png',
          content: '文笔很好，情景描写很细腻，能感受到那种宁静的氛围',
          createdAt: '2024-01-15T19:15:00Z',
          likes: 4,
          isLiked: false,
        },
        {
          id: 'comment-1-7',
          userId: 'user8',
          userName: '夜行者',
          userAvatar: '/default-avatar.png',
          content: '建议可以再加一些背景音乐的描述，会更有代入感',
          createdAt: '2024-01-15T20:00:00Z',
          likes: 2,
          isLiked: false,
        },
        {
          id: 'comment-1-8',
          userId: 'user9',
          userName: '月夜读者',
          userAvatar: '/default-avatar.png',
          content: '这个故事让我想起了璃月港的那些传说，很有意境',
          createdAt: '2024-01-15T21:30:00Z',
          likes: 9,
          isLiked: true,
        },
      ],
      views: 1567,
      isFollowing: false,
    },
    {
      id: 2,
      author: '科技探索者',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-14T08:20:00Z',
      updatedAt: '2024-01-14T08:20:00Z',
      slug: 'tech-post',
      category: '科技',
      categorySlug: 'technology',
      readingTime: 8,
      title: 'AI技术发展趋势与未来展望',
      content:
        '人工智能技术正在以前所未有的速度发展，从机器学习到深度学习，从自然语言处理到计算机视觉...',
      tags: [
        'AI',
        '人工智能',
        '机器学习',
        '深度学习',
        '科技趋势',
        '未来展望',
        '技术发展',
        '创新',
        '数据科学',
        '算法',
        '神经网络',
        '自动化',
      ],
      isLike: true,
      likes: 456,
      comments: 7,
      commentList: [
        {
          id: 'comment-2-1',
          userId: 'user5',
          userName: '码农小张',
          userAvatar: '/default-avatar.png',
          content: '很有见地的分析！AI确实是未来发展的重要方向',
          createdAt: '2024-01-14T10:00:00Z',
          likes: 3,
          isLiked: false,
        },
        {
          id: 'comment-2-2',
          userId: 'user6',
          userName: '数据分析师',
          userAvatar: '/default-avatar.png',
          content: '期待看到更多关于AI在各行业应用的案例分享',
          createdAt: '2024-01-14T11:30:00Z',
          likes: 1,
          isLiked: true,
        },
        {
          id: 'comment-2-3',
          userId: 'user10',
          userName: 'AI研究员',
          userAvatar: '/default-avatar.png',
          content: '深度学习的发展确实令人惊叹，但我觉得还需要关注AI的伦理问题',
          createdAt: '2024-01-14T12:00:00Z',
          likes: 15,
          isLiked: false,
        },
        {
          id: 'comment-2-4',
          userId: 'user11',
          userName: '产品经理',
          userAvatar: '/default-avatar.png',
          content: '从产品角度看，AI技术的商业化还有很长的路要走',
          createdAt: '2024-01-14T13:30:00Z',
          likes: 8,
          isLiked: true,
        },
        {
          id: 'comment-2-5',
          userId: 'user12',
          userName: '机器学习工程师',
          userAvatar: '/default-avatar.png',
          content: '自然语言处理这块发展特别快，GPT系列模型真的改变了很多东西',
          createdAt: '2024-01-14T14:45:00Z',
          likes: 22,
          isLiked: true,
        },
        {
          id: 'comment-2-6',
          userId: 'user13',
          userName: '计算机视觉专家',
          userAvatar: '/default-avatar.png',
          content: '计算机视觉在自动驾驶、医疗影像等领域的应用前景非常广阔',
          createdAt: '2024-01-14T15:20:00Z',
          likes: 11,
          isLiked: false,
        },
        {
          id: 'comment-2-7',
          userId: 'user14',
          userName: '创业者',
          userAvatar: '/default-avatar.png',
          content: '对于创业公司来说，如何利用AI技术创造价值是个关键问题',
          createdAt: '2024-01-14T16:10:00Z',
          likes: 5,
          isLiked: false,
        },
      ],
      views: 892,
      isFollowing: true,
    },
    {
      id: 3,
      author: '美食家小王',
      authorAvatar: '/default-avatar.png',
      createdAt: '2024-01-13T19:45:00Z',
      updatedAt: '2024-01-13T19:45:00Z',
      slug: 'food-post',
      category: '美食',
      categorySlug: 'food',
      readingTime: 5,
      title: '家常菜的温暖记忆',
      content:
        '每一道家常菜都承载着温暖的记忆，从小时候妈妈做的红烧肉，到现在自己学会的各种菜谱...',
      tags: ['美食', '家常菜', '烹饪', '记忆', '温暖'],
      isLike: false,
      likes: 123,
      comments: 0,
      commentList: [],
      views: 445,
      isFollowing: false,
    },
  ];

  // 生成更多订阅帖子的函数
  const generateMorePosts = (startId: number, count: number): Post[] => {
    return Array.from({ length: count }).map((_, i) => {
      const id = startId + i;
      return {
        id,
        title: `订阅帖子 ${id + 1}`,
        author: `订阅用户${(id % 4) + 1}`,
        authorAvatar: '/default-avatar.png',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        updatedAt: new Date().toISOString(),
        slug: `subscription-post-${id}`,
        category: '订阅内容',
        categorySlug: 'subscription',
        readingTime: Math.floor(Math.random() * 10) + 1,
        content: `这是第 ${id + 1} 个订阅帖子的内容...`,
        tags: ['订阅', '内容', '更新'],
        isLike: Math.random() > 0.6,
        likes: Math.floor(Math.random() * 300),
        comments: Math.floor(Math.random() * 15),
        commentList: [],
        views: Math.floor(Math.random() * 800) + 100,
        isFollowing: Math.random() > 0.5,
      };
    });
  };

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

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log(`加载订阅帖子第 ${page + 1} 页`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    let newPosts: Post[] = [];
    if (page === 0) {
      // 第一页加载初始数据
      newPosts = initialPosts;
    } else {
      // 后续页面加载新数据
      newPosts = generateMorePosts(page * 5, 5);
    }

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载5页
    if (nextPage >= 5) {
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
      console.log('初始化订阅帖子数据');
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
            <div className="text-center py-8 text-gray-500">暂无订阅内容</div>
          )}
        </div>
      </div>
    </div>
  );
}
