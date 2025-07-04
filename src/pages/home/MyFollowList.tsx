import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { BasePostCard } from '../../components/post-card';
import { PostType, type PostItem } from '../../components/post-card/post.types';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import PostArea from './PostArea';

interface MyFollowListProps {
  isActive: boolean;
}

// 生成模拟评论的函数
const generateMockComments = (postId: number): Comment[] => {
  const commentCount = Math.floor(Math.random() * 8) + 3; // 3-10条评论
  return Array.from({ length: commentCount }, (_, i) => {
    const comment: Comment = {
      id: `comment-${postId}-${i}`,
      userId: `user${(i % 3) + 1}`,
      userName: `关注用户${(i % 3) + 1}`,
      userAvatar: '/default-avatar.png',
      content:
        i % 4 === 0
          ? `很棒的分享！第 ${i + 1} 条评论：一直关注你的内容，每次都能学到新东西。`
          : i % 4 === 1
            ? `支持！第 ${i + 1} 条评论：写得很深入，希望能多发一些类似的内容。`
            : i % 4 === 2
              ? `有启发！第 ${i + 1} 条评论：这个角度很独特，给我带来了新的思考。`
              : `收藏了！第 ${i + 1} 条评论：内容质量很高，已经推荐给其他朋友了。`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 2).toISOString(),
      likes: Math.floor(Math.random() * 15),
      isLiked: Math.random() > 0.8,
      replies:
        Math.random() > 0.6
          ? [
              {
                id: `reply-${postId}-${i}-1`,
                userId: `user${((i + 1) % 3) + 1}`,
                userName: `博主回复${((i + 1) % 3) + 1}`,
                userAvatar: '/default-avatar.png',
                content: `谢谢支持！很高兴能帮到你。`,
                createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
                likes: Math.floor(Math.random() * 3),
                isLiked: false,
              },
            ]
          : undefined,
    };
    return comment;
  });
};

// 生成模拟标签的函数
const generateFollowTags = (postId: number): string[] => {
  const followTags = [
    '关注',
    '专业',
    '深度',
    '原创',
    '实用',
    '经验分享',
    '技术',
    '生活',
    '学习',
    '职场',
    '创意',
    '设计',
    '思考',
    '分析',
    '总结',
    '教程',
    '心得',
    '感悟',
    '干货',
    '推荐',
  ];

  // 关注的内容通常质量较高，标签数量适中
  let tagCount;
  if (postId % 3 === 0) {
    tagCount = Math.floor(Math.random() * 4) + 6; // 6-9个标签
  } else {
    tagCount = Math.floor(Math.random() * 3) + 3; // 3-5个标签
  }

  const shuffled = [...followTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
};

// 生成模拟关注帖子的函数
const generateMockPosts = (startId: number, count: number): PostItem[] => {
  const postTypes = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC];
  const authors = ['技术大牛老王', '设计师小李', '创业者张总', '产品经理小美', '摄影师老陈'];
  const categories = ['技术分享', '设计作品', '创业心得', '产品思考', '摄影教程'];
  
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const commentList = generateMockComments(id);
    const tags = generateFollowTags(id);
    const typeIndex = id % 4;
    const type = postTypes[typeIndex];
    const author = authors[id % authors.length];
    const category = categories[id % categories.length];

    const basePost = {
      id,
      type,
      author,
      authorAvatar: `https://avatars.githubusercontent.com/u/${id + 1000}?v=4`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `follow-post-${id}`,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      tags,
      isLike: Math.random() > 0.6,
      likes: Math.floor(Math.random() * 300) + 50,
      comments: commentList.length,
      commentList,
      views: Math.floor(Math.random() * 800) + 200,
      isFollowing: true, // 关注页面的内容都是已关注的
    };

    // 根据类型生成不同的内容
    switch (type) {
      case PostType.ARTICLE:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `${author}的专业分享：${id % 3 === 0 ? '前端架构设计心得' : id % 3 === 1 ? '团队管理实践' : '技术选型思考'} - 第 ${id + 1} 篇`,
          content: `作为一名经验丰富的${category}专家，我想和大家分享一些实际工作中的心得体会。这篇文章将深入探讨${id % 3 === 0 ? '如何设计可扩展的前端架构，从模块化到微前端的完整实践' : id % 3 === 1 ? '如何高效管理技术团队，从沟通协作到绩效考核的全方位思考' : '技术选型中的权衡与取舍，如何在众多方案中找到最适合的解决方案'}...`,
          wordCount: Math.floor(Math.random() * 6000) + 3000,
        };

      case PostType.IMAGE:
        const imageCount = Math.floor(Math.random() * 4) + 2;
        return {
          ...basePost,
          type: PostType.IMAGE,
          title: `${author}的作品集：${id % 2 === 0 ? 'UI设计案例分析' : '摄影作品欣赏'} - 第 ${id + 1} 组`,
          content: `很高兴能和大家分享我的最新作品。这组${id % 2 === 0 ? 'UI设计作品展示了从用户研究到视觉设计的完整流程，每个细节都经过精心打磨' : '摄影作品捕捉了生活中的美好瞬间，希望能通过镜头传递更多的情感和思考'}。`,
          images: Array.from({ length: imageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1550000000000 + id * 1000 + imgIndex}?w=800&auto=format`,
            alt: `作品 ${imgIndex + 1}`,
            width: 800,
            height: 600
          }))
        };

      case PostType.VIDEO:
        return {
          ...basePost,
          type: PostType.VIDEO,
          title: `${author}的视频教程：${id % 2 === 0 ? '代码重构实战' : '创业经验分享'} - 第 ${id + 1} 期`,
          content: `本期视频为大家带来${Math.floor(Math.random() * 15) + 10}分钟的深度讲解。我会详细分析${id % 2 === 0 ? '一个真实项目的重构过程，从代码审查到架构优化的每个环节' : '创业路上的关键决策点，分享成功和失败的经验教训'}。`,
          video: {
            url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${1200 + (id % 4)}x${800 + (id % 2) * 100}_2mb.mp4`,
            thumbnail: `https://images.unsplash.com/photo-${1650000000000 + id * 1000}?w=800&auto=format`,
            duration: Math.floor(Math.random() * 900) + 600, // 10-25分钟
            width: 1280,
            height: 720
          }
        };

      case PostType.DYNAMIC:
        const dynamicImageCount = Math.floor(Math.random() * 4) + 1;
        return {
          ...basePost,
          type: PostType.DYNAMIC,
          title: `${author}的日常分享：${id % 3 === 0 ? '工作日常记录' : id % 3 === 1 ? '学习心得总结' : '生活感悟'} 📝`,
          content: `${id % 3 === 0 ? '今天团队讨论了一个很有意思的技术问题' : id % 3 === 1 ? '最近在学习新技术，有一些心得想和大家分享' : '生活中的一些小感悟，希望能给正在奋斗的朋友们一些启发'}。分享几张工作和学习的照片，记录这段充实的时光 ✨ #专业成长 #学习记录`,
          images: dynamicImageCount > 0 ? Array.from({ length: dynamicImageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1450000000000 + id * 100 + imgIndex * 10}?w=400&auto=format`,
            alt: `日常记录 ${imgIndex + 1}`
          })) : undefined
        };

      default:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `${author}的分享 ${id + 1}`,
          content: '默认内容',
          wordCount: 3000,
        };
    }
  });
};

export default function MyFollowList({ isActive }: MyFollowListProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
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

  const handleBlockComment = useCallback((commentId: string) => {
    alert(`已屏蔽评论 ${commentId}`);
    // 这里可以添加实际的屏蔽逻辑
    console.log('屏蔽评论:', commentId);
  }, []);

  const handleReportComment = useCallback((commentId: string) => {
    alert(`已举报评论 ${commentId}，我们将尽快处理`);
    // 这里可以添加实际的举报逻辑
    console.log('举报评论:', commentId);
  }, []);

  const handleBlockUser = useCallback((userId: string) => {
    alert(`已屏蔽用户 ${userId}`);
    // 这里可以添加实际的屏蔽用户逻辑
    setPosts((prevPosts) => prevPosts.filter((post) => post.author !== userId));
    console.log('屏蔽用户:', userId);
  }, []);

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log(`加载关注帖子第 ${page + 1} 页，起始ID: ${page * 6}`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 每页生成6个帖子，确保四种类型都有展示
    const newPosts = generateMockPosts(page * 6, 6);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载5页（30个帖子）
    if (nextPage >= 5) {
      setHasMore(false);
      console.log('已加载完所有关注内容');
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
              <span className="ml-2 text-gray-600">加载更多关注内容...</span>
            </div>
          )}

          {/* 没有更多内容提示 */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="bg-gray-100 rounded-lg p-4">
                🎉 已加载全部关注内容！共 {posts.length} 个帖子
                <div className="text-sm mt-2 text-gray-400">
                  包含文章、图片、视频、动态四种类型
                </div>
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
