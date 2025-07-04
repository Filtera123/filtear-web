import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { BasePostCard, PostType, type PostItem } from '../../components/post-card';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import PostArea from './PostArea';

// 接口定义已移到 post.types.ts 中

interface RecommendedPostProps {
  isActive: boolean;
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

// 生成四种不同类型的模拟帖子
const generateMockPosts = (startId: number, count: number): PostItem[] => {
  const postTypes = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC];
  const authors = ['技术博主小王', '摄影师李梅', 'UP主小明', '旅行达人小张', '美食爱好者小红'];
  const categories = ['前端技术', '摄影作品', '生活技能', '生活分享', '美食'];
  
  return Array.from({ length: count }).map((_, i) => {
    const id = startId + i;
    const commentList = generateMockComments(id);
    const tags = generateMockTags(id);
    const typeIndex = id % 4;
    const type = postTypes[typeIndex];
    const author = authors[id % authors.length];
    const category = categories[id % categories.length];

    const basePost = {
      id,
      type,
      author,
      authorAvatar: `https://avatars.githubusercontent.com/u/${id}?v=4`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `recommended-post-${id}`,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      tags,
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 500),
      comments: commentList.length,
      commentList,
      views: Math.floor(Math.random() * 1000) + 100,
      isFollowing: Math.random() > 0.6,
    };

    // 根据类型生成不同的内容
    switch (type) {
      case PostType.ARTICLE:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `技术分享：${id % 2 === 0 ? 'React 进阶技巧' : 'Vue 3.0 最佳实践'} - 第 ${id + 1} 篇`,
          content: `这是一篇关于前端技术的深度分析文章。作为第 ${id + 1} 篇推荐内容，我们将探讨现代前端开发中的核心概念和实践方法。从组件设计到状态管理，从性能优化到用户体验，每一个细节都值得深入讨论...`,
          wordCount: Math.floor(Math.random() * 8000) + 2000, // 2000-10000字
        };

      case PostType.IMAGE:
        const imageCount = Math.floor(Math.random() * 5) + 1;
        return {
          ...basePost,
          type: PostType.IMAGE,
          title: `摄影作品：${id % 2 === 0 ? '城市夜景' : '自然风光'} - 第 ${id + 1} 组`,
          content: `今天分享一组精心拍摄的照片，希望能够带给大家视觉上的享受。这组作品拍摄于${id % 2 === 0 ? '繁华的都市夜晚，光影交错间展现着城市的生命力' : '宁静的自然环境中，每一帧都记录着大自然的美好瞬间'}。`,
          images: Array.from({ length: imageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1500000000000 + id * 1000 + imgIndex}?w=800&auto=format`,
            alt: `图片 ${imgIndex + 1}`,
            width: 800,
            height: 600
          }))
        };

      case PostType.VIDEO:
        return {
          ...basePost,
          type: PostType.VIDEO,
          title: `视频教程：${id % 2 === 0 ? '烹饪技巧分享' : '手工制作教程'} - 第 ${id + 1} 期`,
          content: `欢迎观看本期视频！在这个${Math.floor(Math.random() * 10) + 5}分钟的教程中，我将为大家详细演示${id % 2 === 0 ? '如何制作美味的家常菜，从选材到调味的每个步骤' : '手工制作的完整过程，包括材料准备和制作技巧'}。`,
          video: {
            url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${800 + (id % 3)}x${600 + (id % 2) * 120}_1mb.mp4`,
            thumbnail: `https://images.unsplash.com/photo-${1600000000000 + id * 1000}?w=800&auto=format`,
            duration: Math.floor(Math.random() * 600) + 300, // 5-15分钟
            width: 1280,
            height: 720
          }
        };

      case PostType.DYNAMIC:
        const dynamicImageCount = Math.floor(Math.random() * 6) + 1;
        return {
          ...basePost,
          type: PostType.DYNAMIC,
          title: `生活分享：${id % 3 === 0 ? '今日美好时光' : id % 3 === 1 ? '周末小确幸' : '日常记录'} ✨`,
          content: `${id % 3 === 0 ? '阳光正好，微风不燥' : id % 3 === 1 ? '周末的慢时光总是让人感到幸福' : '记录平凡日子里的美好瞬间'}！和朋友们一起度过了愉快的时光，分享一些随手拍的照片。生活就是要在这些小小的瞬间中找到快乐 🌟 #生活记录 #美好时光`,
          images: dynamicImageCount > 0 ? Array.from({ length: dynamicImageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1400000000000 + id * 100 + imgIndex * 10}?w=400&auto=format`,
            alt: `生活照片 ${imgIndex + 1}`
          })) : undefined
        };

      default:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `默认帖子 ${id + 1}`,
          content: '默认内容',
          wordCount: 3000,
        };
    }
  });
};

export default function RecommendedPost({ isActive }: RecommendedPostProps) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [initialized, setInitialized] = useState(false);

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
    if (loading || !hasMore) return;

    setLoading(true);
    console.log(`加载推荐帖子第 ${page + 1} 页，起始ID: ${page * 8}`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 每页生成8个帖子，确保四种类型都有展示
    const newPosts = generateMockPosts(page * 8, 8);
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);

    const nextPage = page + 1;
    setPage(nextPage);

    // 限制总共加载6页（48个帖子）
    if (nextPage >= 6) {
      setHasMore(false);
      console.log('已加载完所有推荐内容');
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
      console.log('初始化推荐帖子数据');
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
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="relative">
              {/* 类型标签 */}
              <div className="absolute -top-2 -left-2 z-10">
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm ${getTypeColor(post.type)}`}>
                  {getTypeName(post.type)}
                </div>
              </div>
              
              {/* 使用新的BasePostCard组件 */}
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
              />
            </div>
          ))}

          {/* 加载指示器 */}
          {loading && (
            <div className="flex justify-center items-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">加载更多精彩内容...</span>
            </div>
          )}

          {/* 没有更多内容提示 */}
          {!hasMore && posts.length > 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="bg-gray-100 rounded-lg p-4">
                🎉 已加载全部推荐内容！共 {posts.length} 个帖子
                <div className="text-sm mt-2 text-gray-400">
                  包含文章、图片、视频、动态四种类型
                </div>
              </div>
            </div>
          )}

          {/* 空状态 */}
          {posts.length === 0 && !loading && initialized && (
            <div className="text-center py-8 text-gray-500">暂无推荐内容</div>
          )}
        </div>
      </div>
    </div>
  );
}
