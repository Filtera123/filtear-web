import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { BasePostCard } from './../../components/post-card';
import { PostType, type PostItem } from '../../components/post-card/post.types';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import PostArea from './PostArea';

interface MySubscriptionsPostListProps {
  isActive: boolean;
}

export default function MySubscriptionsPostList({ isActive }: MySubscriptionsPostListProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // 生成模拟评论的函数
  const generateMockComments = useCallback((postId: number): Comment[] => {
    const commentCount = Math.floor(Math.random() * 12) + 5; // 5-16条评论
    return Array.from({ length: commentCount }, (_, i) => {
      const comment: Comment = {
        id: `comment-${postId}-${i}`,
        userId: `user${(i % 4) + 1}`,
        userName: `订阅用户${(i % 4) + 1}`,
        userAvatar: '/default-avatar.png',
        content:
          i % 5 === 0
            ? `精彩内容！第 ${i + 1} 条评论：订阅你的频道真是太值得了，每次都有新的收获。`
            : i % 5 === 1
              ? `赞！第 ${i + 1} 条评论：这类内容正是我需要的，希望能持续更新。`
              : i % 5 === 2
                ? `学到了！第 ${i + 1} 条评论：讲解得很清楚，对我的工作很有帮助。`
                : i % 5 === 3
                  ? `感谢分享！第 ${i + 1} 条评论：已经转发给同事了，大家都觉得很有用。`
                  : `期待更多！第 ${i + 1} 条评论：希望能看到更多这样高质量的内容。`,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        likes: Math.floor(Math.random() * 25),
        isLiked: Math.random() > 0.75,
        replies:
          Math.random() > 0.5
            ? [
                {
                  id: `reply-${postId}-${i}-1`,
                  userId: `user${((i + 2) % 4) + 1}`,
                  userName: `作者回复${((i + 2) % 4) + 1}`,
                  userAvatar: '/default-avatar.png',
                  content: `感谢关注！会继续努力输出优质内容。`,
                  createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
                  likes: Math.floor(Math.random() * 5),
                  isLiked: false,
                },
              ]
            : undefined,
      };
      return comment;
    });
  }, []);

  // 生成模拟标签的函数
  const generateSubscriptionTags = useCallback((postId: number): string[] => {
    const subscriptionTags = [
      '订阅',
      '优质内容',
      '专业',
      '原创',
      '深度解析',
      '实战经验',
      '行业动态',
      '技术前沿',
      '创新思维',
      '生活分享',
      '学习笔记',
      '工作心得',
      '成长记录',
      '效率提升',
      '思考总结',
      '案例分析',
      '趋势观察',
      '方法论',
      '最佳实践',
      '干货分享',
    ];

    // 订阅内容通常标签丰富，质量较高
    let tagCount;
    if (postId % 3 === 0) {
      tagCount = Math.floor(Math.random() * 6) + 8; // 8-13个标签
    } else {
      tagCount = Math.floor(Math.random() * 4) + 4; // 4-7个标签
    }

    const shuffled = [...subscriptionTags].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, tagCount);
  }, []);

  // 生成模拟订阅帖子的函数
  const generateSubscriptionPosts = useCallback((startId: number, count: number): PostItem[] => {
    const postTypes = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC];
    const authors = ['知识博主王老师', '设计师李小姐', '技术UP主小明', '生活达人张姐', '创业导师陈总'];
    const categories = ['知识分享', '设计灵感', '技术教程', '生活美学', '创业心得'];
    
    return Array.from({ length: count }).map((_, i) => {
      const id = startId + i;
      const commentList = generateMockComments(id);
      const tags = generateSubscriptionTags(id);
      const typeIndex = id % 4;
      const type = postTypes[typeIndex];
      const author = authors[id % authors.length];
      const category = categories[id % categories.length];

      const basePost = {
        id,
        type,
        author,
        authorAvatar: `https://avatars.githubusercontent.com/u/${id + 2000}?v=4`,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
        updatedAt: new Date().toISOString(),
        slug: `subscription-post-${id}`,
        category,
        categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
        tags,
        isLike: Math.random() > 0.5,
        likes: Math.floor(Math.random() * 500) + 100,
        comments: commentList.length,
        commentList,
        views: Math.floor(Math.random() * 1200) + 300,
        isFollowing: Math.random() > 0.3, // 大部分是关注的，但也有一些不是
      };

      // 根据类型生成不同的内容
      switch (type) {
        case PostType.ARTICLE:
          return {
            ...basePost,
            type: PostType.ARTICLE,
            title: `${author}的深度解析：${id % 4 === 0 ? '行业发展趋势观察' : id % 4 === 1 ? '核心技能提升指南' : id % 4 === 2 ? '成功案例详细分析' : '前沿理论深度解读'} - 第 ${id + 1} 期`,
            content: `欢迎来到${category}专栏的第 ${id + 1} 期内容。作为长期关注这个领域的专业人士，我想和订阅用户分享一些${id % 4 === 0 ? '对当前行业发展趋势的深度观察，包括市场变化、技术革新和未来机会' : id % 4 === 1 ? '关于核心技能提升的系统性方法，从基础能力到高级技巧的完整路径' : id % 4 === 2 ? '成功案例的深度剖析，从策略制定到执行落地的详细过程' : '前沿理论的深度解读，结合实际应用场景的思考和启发'}。这篇文章将为你带来全新的视角和实用的洞察...`,
            wordCount: Math.floor(Math.random() * 10000) + 4000,
          };

        case PostType.IMAGE:
          const imageCount = Math.floor(Math.random() * 6) + 3;
          return {
            ...basePost,
            type: PostType.IMAGE,
            title: `${author}的精选作品：${id % 3 === 0 ? '创意设计作品展示' : id % 3 === 1 ? '生活美学记录' : '专业摄影分享'} - 第 ${id + 1} 集`,
            content: `本期为订阅用户带来精心挑选的${id % 3 === 0 ? '创意设计作品，展示了从概念构思到最终呈现的完整创作过程，每一个设计细节都承载着独特的思考' : id % 3 === 1 ? '生活美学记录，用镜头捕捉日常生活中的美好瞬间，分享发现美、记录美的心得体会' : '专业摄影作品，从构图到后期处理的全流程解析，帮助大家提升摄影技能和审美水平'}。希望这些内容能够激发你的创作灵感！`,
            images: Array.from({ length: imageCount }, (_, imgIndex) => ({
              url: `https://images.unsplash.com/photo-${1580000000000 + id * 1000 + imgIndex}?w=800&auto=format`,
              alt: `精选作品 ${imgIndex + 1}`,
              width: 800,
              height: 600
            }))
          };

        case PostType.VIDEO:
          return {
            ...basePost,
            type: PostType.VIDEO,
            title: `${author}的精品课程：${id % 3 === 0 ? '零基础入门教程' : id % 3 === 1 ? '进阶技巧讲解' : '实战项目演示'} - 第 ${id + 1} 课`,
            content: `本期视频课程时长${Math.floor(Math.random() * 25) + 15}分钟，为订阅用户提供${id % 3 === 0 ? '零基础入门教程，从基础概念到初步实践的全面指导，确保每个初学者都能跟上节奏' : id % 3 === 1 ? '进阶技巧的详细讲解，深入探讨高级方法和优化策略，帮助有一定基础的学员突破瓶颈' : '真实项目的完整演示，从需求分析到方案实施的全过程展示，让理论与实践完美结合'}。课程内容干货满满，建议大家准备好笔记！`,
            video: {
              url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${1600 + (id % 3)}x${900 + (id % 2) * 80}_3mb.mp4`,
              thumbnail: `https://images.unsplash.com/photo-${1680000000000 + id * 1000}?w=800&auto=format`,
              duration: Math.floor(Math.random() * 1500) + 900, // 15-40分钟
              width: 1920,
              height: 1080
            }
          };

        case PostType.DYNAMIC:
          const dynamicImageCount = Math.floor(Math.random() * 5) + 2;
          return {
            ...basePost,
            type: PostType.DYNAMIC,
            title: `${author}的日常分享：${id % 4 === 0 ? '创作过程记录' : id % 4 === 1 ? '行业见闻分享' : id % 4 === 2 ? '学习心得总结' : '生活感悟记录'} ✨`,
            content: `${id % 4 === 0 ? '记录今天的创作过程，从灵感迸发到作品完成的整个历程' : id % 4 === 1 ? '分享最近在行业会议上的见闻，很多新趋势和机会值得关注' : id % 4 === 2 ? '总结最近学习的新知识，整理一些实用的方法和技巧' : '生活中的一些感悟和思考，希望能给正在努力的朋友们一些启发'}！和订阅用户分享这些珍贵的时刻，感谢大家一直以来的支持和关注 🙏 附上一些过程图片，记录这段美好的时光 #创作日记 #专业成长 #生活记录`,
            images: dynamicImageCount > 0 ? Array.from({ length: dynamicImageCount }, (_, imgIndex) => ({
              url: `https://images.unsplash.com/photo-${1480000000000 + id * 100 + imgIndex * 15}?w=400&auto=format`,
              alt: `日常分享 ${imgIndex + 1}`
            })) : undefined
          };

        default:
          return {
            ...basePost,
            type: PostType.ARTICLE,
            title: `${author}的分享 ${id + 1}`,
            content: '默认内容',
            wordCount: 4000,
          };
      }
    });
  }, [generateMockComments, generateSubscriptionTags]);

  // 初始帖子数据（精选内容）
  const initialPosts: PostItem[] = [
    {
      id: 1,
      type: PostType.ARTICLE,
      author: '知识博主王老师',
      authorAvatar: 'https://avatars.githubusercontent.com/u/2001?v=4',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      slug: 'premium-content-1',
      category: '知识分享',
      categorySlug: 'knowledge-sharing',
      title: '深度解析：现代前端开发的核心理念与实践',
      content: '在快速发展的前端技术生态中，掌握核心理念比追逐具体技术更重要。这篇文章将从架构设计、开发效率、用户体验三个维度，为你解析现代前端开发的本质规律...',
      wordCount: 8500,
      tags: [
        '前端开发', '架构设计', '技术理念', '最佳实践', '经验分享', '深度解析',
        '现代前端', '开发效率', '用户体验', '技术趋势', '核心技能', '专业成长'
      ],
      isLike: false,
      likes: 856,
      comments: 12,
      commentList: generateMockComments(1),
      views: 3241,
      isFollowing: true,
    },
    {
      id: 2,
      type: PostType.VIDEO,
      author: '技术UP主小明',
      authorAvatar: 'https://avatars.githubusercontent.com/u/2002?v=4',
      createdAt: '2024-01-14T08:20:00Z',
      updatedAt: '2024-01-14T08:20:00Z',
      slug: 'premium-video-2',
      category: '技术教程',
      categorySlug: 'tech-tutorial',
      title: '【精品课程】从零到一：微服务架构设计实战 - 第1期',
      content: '本期20分钟视频课程，将手把手教你设计一个完整的微服务架构。从服务拆分、数据库设计到部署运维，覆盖微服务开发的各个环节。课程内容基于真实项目经验，实用性极强！',
      video: {
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1600x900_3mb.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1680000000000?w=800&auto=format',
        duration: 1200, // 20分钟
        width: 1920,
        height: 1080
      },
      tags: [
        '微服务', '架构设计', '实战教程', '系统设计', '后端开发', '技术课程',
        '服务拆分', '数据库设计', '部署运维', '项目经验', '技术分享', '深度教学'
      ],
      isLike: true,
      likes: 1247,
      comments: 8,
      commentList: generateMockComments(2),
      views: 2189,
      isFollowing: true,
    },
    {
      id: 3,
      type: PostType.IMAGE,
      author: '设计师李小姐',
      authorAvatar: 'https://avatars.githubusercontent.com/u/2003?v=4',
      createdAt: '2024-01-13T19:45:00Z',
      updatedAt: '2024-01-13T19:45:00Z',
      slug: 'premium-design-3',
      category: '设计灵感',
      categorySlug: 'design-inspiration',
      title: '2024年度设计趋势：极简主义与情感化设计的完美融合',
      content: '分享一组2024年最新的设计作品，展示极简主义与情感化设计结合的独特魅力。每一个设计细节都经过精心打磨，从色彩搭配到布局设计，都体现了现代设计的前沿理念。',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1580000000000?w=800&auto=format',
          alt: '极简设计作品1',
          width: 800,
          height: 600
        },
        {
          url: 'https://images.unsplash.com/photo-1580000001000?w=800&auto=format',
          alt: '极简设计作品2',
          width: 800,
          height: 600
        },
        {
          url: 'https://images.unsplash.com/photo-1580000002000?w=800&auto=format',
          alt: '极简设计作品3',
          width: 800,
          height: 600
        },
        {
          url: 'https://images.unsplash.com/photo-1580000003000?w=800&auto=format',
          alt: '极简设计作品4',
          width: 800,
          height: 600
        }
      ],
      tags: [
        '设计趋势', '极简主义', '情感化设计', '2024设计', '视觉设计', '创意灵感',
        '设计理念', '现代设计', '色彩搭配', '布局设计', '设计作品', '美学思考'
      ],
      isLike: false,
      likes: 623,
      comments: 6,
      commentList: generateMockComments(3),
      views: 1456,
      isFollowing: false,
    },
  ];

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log(`加载订阅帖子第 ${page + 1} 页，起始ID: ${page * 6}`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    let newPosts: PostItem[] = [];
    if (page === 0) {
      // 第一页加载初始数据
      newPosts = initialPosts;
    } else {
      // 后续页面加载新数据
      newPosts = generateSubscriptionPosts(page * 6, 6);
    }

    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载5页（30个帖子）
    if (nextPage >= 5) {
      setHasMore(false);
      console.log('已加载完所有订阅内容');
    }

    setLoading(false);
  }, [page, hasMore, loading, initialPosts, generateSubscriptionPosts]);

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

  const handleBlockComment = useCallback((commentId: string) => {
    alert(`已屏蔽评论 ${commentId}`);
    console.log('屏蔽评论:', commentId);
  }, []);

  const handleReportComment = useCallback((commentId: string) => {
    alert(`已举报评论 ${commentId}，我们将尽快处理`);
    console.log('举报评论:', commentId);
  }, []);

  const handleBlockUser = useCallback((userId: string) => {
    alert(`已屏蔽用户 ${userId}`);
    setPosts((prevPosts) => prevPosts.filter((post) => post.author !== userId));
    console.log('屏蔽用户:', userId);
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

  // 根据类型获取类型标签颜色
  const getTypeColor = (type: PostType) => {
    switch (type) {
      case PostType.ARTICLE:
        return 'bg-blue-100 text-blue-800';
      case PostType.IMAGE:
        return 'bg-green-100 text-green-800';
      case PostType.VIDEO:
        return 'bg-purple-100 text-purple-800';
      case PostType.DYNAMIC:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取类型显示名称
  const getTypeName = (type: PostType) => {
    switch (type) {
      case PostType.ARTICLE:
        return '文章';
      case PostType.IMAGE:
        return '图片';
      case PostType.VIDEO:
        return '视频';
      case PostType.DYNAMIC:
        return '动态';
      default:
        return '未知';
    }
  };

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
            <div key={post.id} className="relative">
              {/* 类型标签 */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getTypeColor(post.type)}`}>
                  {getTypeName(post.type)}
                </div>
              </div>
              
              <BasePostCard
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
                onBlockComment={handleBlockComment}
                onReportComment={handleReportComment}
                onBlockUser={handleBlockUser}
              />
            </div>
          ))}

          {/* 加载指示器 */}
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">加载更多订阅内容...</span>
            </div>
          )}

          {/* 没有更多内容提示 */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="bg-gray-100 rounded-lg p-4">
                🎉 已加载全部订阅内容！共 {posts.length} 个帖子
                <div className="text-sm mt-2 text-gray-400">
                  包含文章、图片、视频、动态四种类型
                </div>
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
