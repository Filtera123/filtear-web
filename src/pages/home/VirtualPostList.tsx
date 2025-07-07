import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Comment } from '../../components/comment/comment.type';
import { BasePostCard } from '../../components/post-card';
import { PostType, type PostItem, type PostTypeValue } from '../../components/post-card/post.types';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { usePostListStore, useScrollPositionManager } from '../../stores/postListStore';
import PostArea from './PostArea';

// 定义帖子列表类型
export type PostListType = 'recommended' | 'subscriptions' | 'following';

interface VirtualPostListProps {
  type: PostListType;
  isActive: boolean;
}

// 生成模拟评论的函数
const generateMockComments = (postId: number, type: PostListType): Comment[] => {
  const commentCount = Math.floor(Math.random() * 12) + 3;
  const userPrefix = type === 'subscriptions' ? '订阅用户' : type === 'following' ? '关注用户' : '推荐用户';
  
  return Array.from({ length: commentCount }, (_, i) => {
    const comment: Comment = {
      id: `comment-${postId}-${i}`,
      userId: `user${(i % 4) + 1}`,
      userName: `${userPrefix}${(i % 4) + 1}`,
      userAvatar: '/default-avatar.png',
      content: type === 'subscriptions' 
        ? `精彩内容！第 ${i + 1} 条评论：订阅你的频道真是太值得了。`
        : type === 'following'
        ? `很棒的分享！第 ${i + 1} 条评论：一直关注你的内容。`
        : `很有深度的内容！第 ${i + 1} 条评论：这个话题让我想到了很多。`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 3).toISOString(),
      likes: Math.floor(Math.random() * 25),
      isLiked: Math.random() > 0.8,
      replies: Math.random() > 0.6 ? [
        {
          id: `reply-${postId}-${i}-1`,
          userId: `user${((i + 1) % 4) + 1}`,
          userName: `回复用户${((i + 1) % 4) + 1}`,
          userAvatar: '/default-avatar.png',
          content: `回复评论 ${i + 1} 的内容...`,
          createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          likes: Math.floor(Math.random() * 5),
          isLiked: false,
        },
      ] : undefined,
    };
    return comment;
  });
};

// 生成模拟标签的函数
const generateMockTags = (postId: number, type: PostListType): string[] => {
  const tagSets = {
    recommended: ['推荐', '热门', '讨论', '分享', '技术', '生活', '学习', '工作', '娱乐', '游戏'],
    subscriptions: ['订阅', '优质内容', '专业', '原创', '深度解析', '实战经验', '行业动态', '技术前沿'],
    following: ['关注', '专业', '深度', '原创', '实用', '经验分享', '技术', '生活', '学习', '职场']
  };
  
  const allTags = [
    ...tagSets[type],
    '创新思维', '效率提升', '思考总结', '案例分析', '趋势观察', '方法论', '最佳实践', '干货分享'
  ];

  let tagCount = Math.floor(Math.random() * 5) + 3; // 3-7个标签
  if (postId % 4 === 0) {
    tagCount = Math.floor(Math.random() * 6) + 8; // 8-13个标签
  }

  const shuffled = [...allTags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, tagCount);
};

// 生成模拟帖子数据
const generateMockPosts = (startId: number, count: number, type: PostListType): PostItem[] => {
  const postTypes = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO, PostType.DYNAMIC];
  
  const authorSets = {
    recommended: ['技术博主小王', '摄影师李梅', 'UP主小明', '旅行达人小张', '美食爱好者小红'],
    subscriptions: ['知识博主王老师', '设计师李小姐', '技术UP主小明', '生活达人张姐', '创业导师陈总'],
    following: ['技术大牛老王', '设计师小李', '创业者张总', '产品经理小美', '摄影师老陈']
  };

  const categorySets = {
    recommended: ['前端技术', '摄影作品', '生活技能', '生活分享', '美食'],
    subscriptions: ['知识分享', '设计灵感', '技术教程', '生活美学', '创业心得'],
    following: ['技术分享', '设计作品', '创业心得', '产品思考', '摄影教程']
  };

  const authors = authorSets[type];
  const categories = categorySets[type];
  
  return Array.from({ length: count }).map((_, i): PostItem => {
    const id = startId + i;
    const commentList = generateMockComments(id, type);
    const tags = generateMockTags(id, type);
    const typeIndex = id % 4;
    const postType = postTypes[typeIndex];
    const author = authors[id % authors.length];
    const category = categories[id % categories.length];

    const basePost = {
      id,
      author,
      authorAvatar: `https://avatars.githubusercontent.com/u/${id + (type === 'subscriptions' ? 2000 : type === 'following' ? 1000 : 0)}?v=4`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 5).toISOString(),
      updatedAt: new Date().toISOString(),
      slug: `${type}-post-${id}`,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      tags,
      isLike: Math.random() > 0.6,
      likes: Math.floor(Math.random() * 500) + 50,
      comments: commentList.length,
      commentList,
      views: Math.floor(Math.random() * 1000) + 100,
      isFollowing: type === 'following' ? true : Math.random() > 0.5,
    };

    // 根据类型生成不同的内容
    switch (postType) {
      case PostType.ARTICLE:
        return {
          ...basePost,
          type: PostType.ARTICLE,
          title: `${author}的专业分享：${i % 3 === 0 ? '技术深度解析' : i % 3 === 1 ? '实战经验总结' : '行业趋势观察'} - 第 ${id + 1} 篇`,
          content: `这是一篇关于${category}的深度分析文章。作为第 ${id + 1} 篇${type === 'subscriptions' ? '订阅' : type === 'following' ? '关注' : '推荐'}内容，我们将探讨现代技术发展中的核心概念和实践方法...`,
          wordCount: Math.floor(Math.random() * 8000) + 3000,
        };

      case PostType.IMAGE:
        const imageCount = Math.floor(Math.random() * 5) + 2;
        return {
          ...basePost,
          type: PostType.IMAGE,
          title: `${author}的精选作品：${i % 2 === 0 ? '创意设计展示' : '摄影作品分享'} - 第 ${id + 1} 组`,
          content: `分享一组精心创作的作品，希望能够带给大家视觉上的享受和创作灵感。`,
          images: Array.from({ length: imageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1500000000000 + id * 1000 + imgIndex}?w=800&auto=format`,
            alt: `作品 ${imgIndex + 1}`,
            width: 800,
            height: 600
          }))
        };

      case PostType.VIDEO:
        return {
          ...basePost,
          type: PostType.VIDEO,
          title: `${author}的视频教程：${i % 2 === 0 ? '实用技巧分享' : '深度知识讲解'} - 第 ${id + 1} 期`,
          content: `本期视频为大家带来${Math.floor(Math.random() * 20) + 10}分钟的精彩内容，希望对大家的学习和工作有所帮助。`,
          video: {
            url: `https://sample-videos.com/zip/10/mp4/SampleVideo_${1200 + (id % 4)}x${800 + (id % 2) * 100}_2mb.mp4`,
            thumbnail: `https://images.unsplash.com/photo-${1600000000000 + id * 1000}?w=800&auto=format`,
            duration: Math.floor(Math.random() * 1200) + 600,
            width: 1280,
            height: 720
          }
        };

      case PostType.DYNAMIC:
        const dynamicImageCount = Math.floor(Math.random() * 4) + 1;
        return {
          ...basePost,
          type: PostType.DYNAMIC,
          title: `${author}的日常分享：${i % 3 === 0 ? '工作日常' : i % 3 === 1 ? '学习心得' : '生活感悟'} ✨`,
          content: `记录日常生活中的美好瞬间，分享一些工作和学习的心得体会。生活就是要在这些小小的瞬间中找到快乐 🌟`,
          images: dynamicImageCount > 0 ? Array.from({ length: dynamicImageCount }, (_, imgIndex) => ({
            url: `https://images.unsplash.com/photo-${1400000000000 + id * 100 + imgIndex * 10}?w=400&auto=format`,
            alt: `日常分享 ${imgIndex + 1}`
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

// 获取类型配置
const getTypeConfig = (type: PostListType) => {
  const configs = {
    recommended: {
      name: '推荐',
      loadingText: '加载更多精彩内容...',
      completedText: '已加载全部推荐内容！',
      emptyText: '暂无推荐内容',
      pageSize: 8,
      maxPages: 20 // 增加最大页数以测试虚拟滚动
    },
    subscriptions: {
      name: '订阅',
      loadingText: '加载更多订阅内容...',
      completedText: '已加载全部订阅内容！',
      emptyText: '暂无订阅内容',
      pageSize: 6,
      maxPages: 15
    },
    following: {
      name: '关注',
      loadingText: '加载更多关注内容...',
      completedText: '已加载全部关注内容！',
      emptyText: '暂无关注内容',
      pageSize: 6,
      maxPages: 15
    }
  };
  return configs[type];
};

export default function VirtualPostList({ type, isActive }: VirtualPostListProps) {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 使用 zustand store
  const {
    tabs,
    initializeTab,
    addPosts,
    setTabLoading,
    setTabPage,
    setTabHasMore,
    updatePost,
    removePost,
    removePostsByAuthor,
    resetTab,
    saveTotalSize,
    saveVisibleRange,
  } = usePostListStore();

  // 滚动位置管理
  const { restoreScrollPosition } = useScrollPositionManager();

  // 获取当前tab的状态
  const currentTab = tabs[type];
  const { posts, loading, hasMore, page, initialized } = currentTab;

  const config = getTypeConfig(type);

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    if (loading || !hasMore) return;

    setTabLoading(type, true);
    console.log(`[虚拟滚动] 加载${config.name}帖子第 ${page + 1} 页，起始ID: ${page * config.pageSize}`);

    // 模拟API延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 生成新帖子
    const newPosts = generateMockPosts(page * config.pageSize, config.pageSize, type);
    addPosts(type, newPosts);

    const nextPage = page + 1;
    setTabPage(type, nextPage);

    // 检查是否到达最大页数
    if (nextPage >= config.maxPages) {
      setTabHasMore(type, false);
      console.log(`[虚拟滚动] 已加载完所有${config.name}内容`);
    }

    setTabLoading(type, false);
  }, [page, hasMore, loading, type, config, addPosts, setTabLoading, setTabPage, setTabHasMore]);

  // 虚拟滚动配置
  const virtualConfig = {
    itemHeight: 450, // 帖子的平均高度
    overscan: 3, // 缓冲项目数
    threshold: 500, // 触发加载更多的阈值
    onLoadMore: loadMorePosts,
    hasMore,
    loading,
  };

  // 使用虚拟滚动Hook
  const {
    containerStyle,
    itemStyle,
    visibleItems,
    totalHeight,
    measureItem,
    scrollToTop,
    isScrolling,
    visibleRange,
    forceRemeasure,
    disableTransition,
  } = useVirtualScroll(posts.length, virtualConfig);

  // 处理各种事件的回调函数
  const handleFollow = useCallback((userId: string) => {
    const post = posts.find(p => p.author === userId);
    if (post) {
      updatePost(type, post.id, { isFollowing: !post.isFollowing });
    }
  }, [posts, type, updatePost]);

  const handleLike = useCallback((postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(type, postId, {
        isLike: !post.isLike,
        likes: post.isLike ? post.likes - 1 : post.likes + 1,
      });
    }
  }, [posts, type, updatePost]);

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

  const handleReport = useCallback((_postId: number, reportType: 'post' | 'user') => {
    alert(`您已举报该${reportType === 'post' ? '帖子' : '用户'}，我们将尽快处理`);
  }, []);

  const handleBlock = useCallback(
    (postId: number, blockType: 'post' | 'user') => {
      if (blockType === 'post') {
        removePost(type, postId);
        alert('已屏蔽该帖子');
      } else {
        const post = posts.find((p) => p.id === postId);
        if (post) {
          removePostsByAuthor(type, post.author);
          alert(`已屏蔽用户 ${post.author}`);
        }
      }
    },
    [posts, type, removePost, removePostsByAuthor]
  );

  const handleUnfollow = useCallback((userId: string) => {
    const post = posts.find(p => p.author === userId);
    if (post) {
      updatePost(type, post.id, { isFollowing: false });
    }
  }, [posts, type, updatePost]);

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

    const post = posts.find(p => p.id === postId);
    if (post) {
      updatePost(type, postId, {
        commentList: [newComment, ...(post.commentList || [])],
        comments: (post.commentList?.length || 0) + 1,
      });
    }
  }, [posts, type, updatePost]);

  const handleLikeComment = useCallback((commentId: string) => {
    const post = posts.find(p => p.commentList?.some(c => c.id === commentId));
    if (post) {
      const updatedCommentList = post.commentList?.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      );
      updatePost(type, post.id, { commentList: updatedCommentList });
    }
  }, [posts, type, updatePost]);

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

    const post = posts.find(p => p.commentList?.some(c => c.id === commentId));
    if (post) {
      const updatedCommentList = post.commentList?.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: [newReply, ...(comment.replies || [])],
            }
          : comment
      );
      updatePost(type, post.id, { commentList: updatedCommentList });
    }
  }, [posts, type, updatePost]);

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
    removePostsByAuthor(type, userId);
    console.log('屏蔽用户:', userId);
  }, [type, removePostsByAuthor]);

  // 处理帖子高度变化 - 使用ref避免依赖循环
  const handleHeightChangeRef = useRef<(index: number) => void>(null);
  
  useEffect(() => {
    handleHeightChangeRef.current = (index: number) => {
      console.log(`[高度变化] 帖子索引 ${index} 的高度发生变化，重新测量中...`);
      // 立即触发重新测量，让位置调整与动画同步
      forceRemeasure(index);
    };
  }, [forceRemeasure]);

  const handleHeightChange = useCallback((index: number) => {
    handleHeightChangeRef.current?.(index);
  }, []);

  // 只有当组件激活且未初始化时才加载第一页
  useEffect(() => {
    if (isActive && !initialized) {
      console.log(`[虚拟滚动] 初始化${config.name}帖子数据`);
      initializeTab(type);
      loadMorePosts();
    }
  }, [isActive, initialized, loadMorePosts, config.name, type, initializeTab]);

  // 当type变化时重置状态
  useEffect(() => {
    if (isActive) {
      resetTab(type);
    }
  }, [type, isActive, resetTab]);

  // 滚动位置恢复
  useEffect(() => {
    if (isActive && posts.length > 0) {
      // 延迟恢复滚动位置，确保虚拟滚动容器已准备好
      const timer = setTimeout(() => {
        restoreScrollPosition(type, containerRef);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isActive, posts.length, type, restoreScrollPosition]);

  // 保存滚动状态
  useEffect(() => {
    if (isActive) {
      saveTotalSize(type, totalHeight);
      saveVisibleRange(type, visibleRange);
    }
  }, [isActive, type, totalHeight, visibleRange, saveTotalSize, saveVisibleRange]);

  // 如果未激活则不渲染
  if (!isActive) {
    return null;
  }

  // 根据类型获取类型标签颜色
  const getTypeColor = (postType: PostTypeValue) => {
    switch (postType) {
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
  const getTypeName = (postType: PostTypeValue) => {
    switch (postType) {
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
        
        {/* 关注页面显示排序选项 */}
        {type === 'following' && (
          <div className="flex justify-end items-center mb-4 gap-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded">最新</button>
            <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded">最热</button>
          </div>
        )}
        
        {/* 虚拟滚动容器 */}
        <div ref={containerRef} style={containerStyle}>
          {visibleItems.map((index) => {
            const post = posts[index];
            if (!post) return null;

            return (
              <div
                key={post.id}
                style={itemStyle(index)}
                ref={(el) => {
                  if (el) {
                    measureItem(index, el);
                  }
                }}
                className={`w-full ${disableTransition ? 'virtual-item-no-transition' : 'virtual-item'}`}
              >
                <div className="relative mb-4">
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
                    onHeightChange={() => handleHeightChange(index)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* 加载指示器 */}
        {loading && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">{config.loadingText}</span>
          </div>
        )}

        {/* 没有更多内容提示 */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            <div className="bg-gray-100 rounded-lg p-4">
              🎉 {config.completedText}共 {posts.length} 个帖子
              <div className="text-sm mt-2 text-gray-400">
                包含文章、图片、视频、动态四种类型 | 虚拟滚动优化
              </div>
            </div>
          </div>
        )}

        {/* 空状态 */}
        {posts.length === 0 && !loading && initialized && (
          <div className="text-center py-8 text-gray-500">{config.emptyText}</div>
        )}

        {/* 回到顶部按钮 */}
        {posts.length > 5 && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center z-50"
            title="回到顶部"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}


      </div>
    </div>
  );
} 