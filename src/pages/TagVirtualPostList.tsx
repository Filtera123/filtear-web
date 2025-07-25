import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useNavigate } from 'react-router-dom';
import { BasePostCard } from '../components/post-card';
import { PostType, type PostTypeValue, type PostItem } from '../components/post-card/post.types';
import { Image } from '../components/ui';
import MasonryLayout from '../components/ui/MasonryLayout';
import TumblrCard from '../components/ui/TumblrCard';
import { useTagPageStore } from './TagPage.store';
import type { ContentFilter, HotSubTab, LatestSubTab, TagPageTab, ViewMode } from './TagPage.types';

// 定义返回类型
interface TagPostsResponse {
  list: any[];
  page: number;
  hasMore: boolean;
}

// 模拟获取标签下的帖子数据
const fetchTagPosts = async (
  tagName: string,
  tab: TagPageTab,
  subTab: LatestSubTab | HotSubTab | null,
  contentFilter: ContentFilter,
  pageParam: number = 0
): Promise<TagPostsResponse> => {
  // 这里应该调用真实的API，现在用模拟数据
  await new Promise((resolve) => setTimeout(resolve, 500));

  const pageSize = 10;
  const posts = Array.from({ length: pageSize }, (_, i) => {
    const postType = getPostTypeByFilter(contentFilter, i);
    const basePost = {
      id: `${tab}-${subTab}-${contentFilter}-${pageParam}-${i}`,
      title: `关于 #${tagName} 的帖子 ${pageParam * pageSize + i + 1}`,
      content: `这是关于 ${tagName} 标签的内容，当前筛选：${tab} - ${subTab} - ${contentFilter}`,
      author: `用户${i + 1}`,
      authorAvatar: `https://picsum.photos/40/40?random=${i}`,
      createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      slug: `post-${i}`,
      category: '技术',
      categorySlug: 'tech',
      type: postType,
      tags: [{ id: '1', name: tagName, isPopular: true }],
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      views: Math.floor(Math.random() * 5000),
      isFollowing: Math.random() > 0.8,
    };

    // 根据帖子类型添加特定属性
    switch (postType) {
      case PostType.ARTICLE:
        // 生成不同长度的文章摘要
        const abstractTemplates = [
          `关于 ${tagName} 的简短介绍。`,
          `这是一篇详细探讨 ${tagName} 的文章，包含了丰富的内容和深入的分析。`,
          `${tagName} 是一个非常有趣的话题，本文将从多个角度进行分析。我们会探讨它的历史背景、现状以及未来发展趋势。通过深入研究，我们可以更好地理解这个领域的复杂性。`,
          `关于 ${tagName} 的全面研究报告。本文详细分析了相关的理论基础、实践应用以及可能面临的挑战。我们通过大量的案例研究和数据分析，试图为读者提供一个全面而客观的视角。文章还包含了专家访谈和行业调研的结果，力求为读者呈现最新、最准确的信息。通过阅读本文，您将对 ${tagName} 有一个更加深入和全面的了解。`
        ];
        return {
          ...basePost,
          abstract: abstractTemplates[i % abstractTemplates.length],
          wordCount: Math.floor(Math.random() * 5000) + 500,
        };
      case PostType.IMAGE:
        // 生成不同尺寸比例的图片和不同长度的描述
        const imageDescriptions = [
          ``,
          `美丽的风景照片`,
          `这是一张非常棒的照片，展现了 ${tagName} 的精彩瞬间。`,
          `精美的 ${tagName} 主题图片，捕捉到了完美的光影效果。这张照片展示了摄影师的专业技巧和艺术眼光，值得细细品味。`
        ];
        const aspectRatios = [
          { width: 400, height: 300 }, // 4:3
          { width: 400, height: 500 }, // 4:5
          { width: 400, height: 600 }, // 2:3
          { width: 400, height: 400 }, // 1:1
          { width: 400, height: 250 }, // 16:10
        ];
        const ratio = aspectRatios[i % aspectRatios.length];
        return {
          ...basePost,
          content: basePost.title + (imageDescriptions[i % imageDescriptions.length] ? ` - ${imageDescriptions[i % imageDescriptions.length]}` : ''),
          images: [
            {
              url: `https://picsum.photos/${ratio.width}/${ratio.height}?random=${i}`,
              alt: `图片${i}`,
              width: ratio.width,
              height: ratio.height,
            },
          ],
        };
      case PostType.VIDEO:
        // 生成不同长度的视频描述
        const videoDescriptions = [
          ``,
          `精彩的视频内容`,
          `这是一个关于 ${tagName} 的有趣视频，内容丰富多彩。`,
          `深度解析 ${tagName} 的专业视频内容。本视频通过生动的演示和详细的讲解，帮助观众深入理解相关概念。制作精良，内容充实，是学习和了解这个领域的优质资源。`
        ];
        return {
          ...basePost,
          content: basePost.title + (videoDescriptions[i % videoDescriptions.length] ? ` - ${videoDescriptions[i % videoDescriptions.length]}` : ''),
          video: {
            url: `https://example.com/video${i}.mp4`,
            thumbnail: `https://picsum.photos/400/225?random=${i}`, // 16:9比例
            duration: Math.floor(Math.random() * 300) + 30,
            width: 720,
            height: 480,
          },
        };
      case PostType.DYNAMIC:
        // 生成不同长度的动态内容
        const dynamicContents = [
          `今天天气不错！`,
          `刚刚看到一个很有趣的关于 ${tagName} 的分享，觉得很有意思。`,
          `最近一直在研究 ${tagName} 相关的内容，发现了很多有价值的信息。分享一些个人心得：首先要理解基本概念，然后多实践，最后总结经验。`,
          `关于 ${tagName} 的深度思考和分析。经过一段时间的学习和实践，我对这个领域有了更深入的理解。想和大家分享一些我的收获和体会。\n\n首先，理论基础非常重要，需要花时间去理解核心概念。其次，实践是检验真理的唯一标准，只有通过实际操作才能真正掌握技能。最后，要保持持续学习的心态，因为这个领域在不断发展变化。\n\n希望我的分享对大家有所帮助，也欢迎交流讨论！`,
          `今天参加了一个关于 ${tagName} 的研讨会，收获满满！会上有很多行业专家分享了他们的经验和见解，让我对这个领域有了更全面的认识。\n\n特别印象深刻的是某位专家提到的几个要点：\n1. 基础理论的重要性不可忽视\n2. 实践经验是理论的有力补充\n3. 持续学习是保持竞争力的关键\n4. 团队协作能够事半功倍\n5. 创新思维是突破瓶颈的利器\n\n这些观点让我深受启发，也让我对未来的学习和工作有了更清晰的规划。感谢主办方提供这样的学习机会，也期待更多类似的活动！`
        ];
        
        // 为部分动态添加图片
        const hasImage = i % 3 === 0; // 每三个动态中有一个带图片
        const imageRatios = [
          { width: 400, height: 300 },
          { width: 400, height: 400 },
          { width: 400, height: 500 },
        ];
        const imageRatio = imageRatios[i % imageRatios.length];
        
        return {
          ...basePost,
          content: dynamicContents[i % dynamicContents.length],
          images: hasImage ? [
            {
              url: `https://picsum.photos/${imageRatio.width}/${imageRatio.height}?random=${i}`,
              alt: `动态图片${i}`,
              width: imageRatio.width,
              height: imageRatio.height,
            },
          ] : undefined,
        };
      default:
        return basePost;
    }
  });

  return {
    list: posts,
    page: pageParam,
    hasMore: pageParam < 10, // 模拟最多10页
  };
};

// 根据内容过滤器获取对应的帖子类型
const getPostTypeByFilter = (filter: ContentFilter, index: number): PostTypeValue => {
  switch (filter) {
    case 'image':
      return PostType.IMAGE;
    case 'text':
      return PostType.ARTICLE;
    case 'all':
      // 随机返回不同类型
      const types = [PostType.ARTICLE, PostType.IMAGE, PostType.VIDEO];
      return types[index % types.length];
    default:
      return PostType.ARTICLE;
  }
};

interface TagVirtualPostListProps {
  tagName: string;
}

export default function TagVirtualPostList({ tagName }: TagVirtualPostListProps) {
  const navigate = useNavigate();
  const { currentTab, currentLatestSubTab, currentHotSubTab, currentContentFilter, viewMode } =
    useTagPageStore();

  // 本地状态管理点赞状态
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [isGridReady, setIsGridReady] = useState(false);

  // 确定当前的子tab
  const currentSubTab = useMemo(() => {
    switch (currentTab) {
      case 'latest':
        return currentLatestSubTab;
      case 'hot':
        return currentHotSubTab;
      case 'dynamic':
        return null; // 动态tab没有子分类
      default:
        return null;
    }
  }, [currentTab, currentLatestSubTab, currentHotSubTab]);

  // 生成查询key
  const queryKey = useMemo(
    () => ['tag-posts', tagName, currentTab, currentSubTab, currentContentFilter],
    [tagName, currentTab, currentSubTab, currentContentFilter]
  );

  // 使用 React Query 获取数据
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useInfiniteQuery<TagPostsResponse>({
      queryKey,
      queryFn: ({ pageParam = 0 }) =>
        fetchTagPosts(
          tagName,
          currentTab,
          currentSubTab,
          currentContentFilter,
          pageParam as number
        ),
      getNextPageParam: (lastPage: TagPostsResponse) =>
        lastPage.hasMore ? lastPage.page + 1 : undefined,
      initialPageParam: 0,
      staleTime: 1000 * 60 * 5, // 5分钟内认为数据是新鲜的
    });

  // 展平所有页面的数据
  const allPosts = useMemo(() => {
    return data?.pages.flatMap((page: TagPostsResponse) => page.list) ?? [];
  }, [data]);

  // 过滤帖子类型（对于动态tab，只显示动态类型的帖子）
  const filteredPosts = useMemo(() => {
    if (currentTab === 'dynamic') {
      return allPosts.filter((post) => post.type === PostType.DYNAMIC);
    }
    return allPosts;
  }, [allPosts, currentTab]);

  // 虚拟化配置 - 仅在列表视图下使用
  const virtualizer = useWindowVirtualizer({
    count:
      viewMode === 'list' ? (hasNextPage ? filteredPosts.length + 1 : filteredPosts.length) : 0,
    estimateSize: () => 200,
    overscan: 5,
    getScrollElement: () => window,
    scrollMargin: 0,
  });

  const items = virtualizer.getVirtualItems();

  // 当切换到网格视图时，添加短暂延迟确保DOM稳定
  useEffect(() => {
    if (viewMode === 'grid' && filteredPosts.length > 0) {
      const timer = setTimeout(() => {
        setIsGridReady(true);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setIsGridReady(false);
    }
  }, [viewMode, filteredPosts.length]);

  // 无限滚动逻辑 - 列表视图
  useEffect(() => {
    if (viewMode !== 'list') return;

    const [lastItem] = [...items].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= filteredPosts.length - 1 &&
      hasNextPage &&
      !isFetching &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    items,
    filteredPosts.length,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    viewMode,
  ]);

  // 无限滚动逻辑 - 网格视图
  useEffect(() => {
    if (viewMode !== 'grid') return;

    const handleScroll = () => {
      if (!hasNextPage || isFetching || isFetchingNextPage) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 300) {
        fetchNextPage();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetching, isFetchingNextPage, fetchNextPage, viewMode]);



  // 根据帖子类型生成正确的URL
  const getPostDetailUrl = useCallback((post: any) => {
    switch (post.type) {
      case PostType.ARTICLE:
        return `/post/article/${post.id}`;
      case PostType.IMAGE:
        return `/post/image/${post.id}`;
      case PostType.VIDEO:
        return `/post/video/${post.id}`;
      case PostType.DYNAMIC:
        return `/post/dynamic/${post.id}`;
      default:
        return `/post/${post.id}`;
    }
  }, []);

  // 处理帖子点击
  const handlePostClick = useCallback(
    (post: any) => {
      navigate(getPostDetailUrl(post), { 
        state: {
          ...post,
          fromPage: window.location.pathname // 记录当前标签页的路径
        }
      });
    },
    [navigate, getPostDetailUrl]
  );

  // 处理用户点击
  const handleUserProfileClick = useCallback(
    (e: React.MouseEvent, post: any) => {
      e.stopPropagation();
      navigate(`/user/${post.author}`);
    },
    [navigate]
  );

  // 处理点赞点击
  const handleLikeClick = useCallback((e: React.MouseEvent, post: any) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击事件

    // 更新本地点赞状态
    setLikedPosts((prev) => {
      const currentLikeState = prev[post.id] !== undefined ? prev[post.id] : post.isLike;
      const newLikeState = !currentLikeState;

      // 在真实场景下，这里应该调用API更新点赞状态
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, post.id);

      return {
        ...prev,
        [post.id]: newLikeState,
      };
    });
  }, []);

  // 获取帖子当前的点赞状态
  const getPostLikeStatus = useCallback(
    (post: any) => {
      // 如果本地状态中有该帖子的点赞状态，则使用本地状态，否则使用帖子原始状态
      return likedPosts[post.id] !== undefined ? likedPosts[post.id] : post.isLike;
    },
    [likedPosts]
  );

  // Tumblr卡片的点赞处理
  const handleTumblrLikeClick = useCallback((post: PostItem, liked: boolean) => {
    setLikedPosts((prev) => ({
      ...prev,
      [post.id]: liked,
    }));
    console.log(`${liked ? '点赞' : '取消点赞'}帖子:`, post.id);
  }, []);

  // Tumblr卡片的用户点击处理
  const handleTumblrUserClick = useCallback((username: string) => {
    navigate(`/user/${username}`);
  }, [navigate]);

  // Tumblr卡片的评论点击处理
  const handleTumblrCommentClick = useCallback((post: PostItem) => {
    // 跳转到详情页并滚动到评论区
    navigate(getPostDetailUrl(post), { 
      state: { 
        ...post, 
        scrollToComments: true,
        fromPage: window.location.pathname // 记录当前标签页的路径
      } 
    });
  }, [navigate]);



  // 获取内容预览
  const getContentPreview = (content: string) => {
    return content?.substring(0, 150) || '无内容';
  };

  // 网格视图渲染卡片
  const renderGridCard = (post: any) => {
    const isLiked = getPostLikeStatus(post);

    return (
      <div
        key={post.id}
        className="bg-white rounded-md shadow-sm border border-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => handlePostClick(post)}
      >
        {/* 卡片内容区域 */}
        <div className="flex-grow relative">
          {/* 图片 / 视频 / 纯文本预览 */}
          {post.type === PostType.IMAGE && post.images && post.images.length > 0 ? (
            <Image
              src={post.images[0].url}
              alt={post.images[0].alt || '图片'}
              className="w-full h-full object-cover"
            />
          ) : post.type === PostType.VIDEO && post.video ? (
            <div className="h-full w-full bg-gray-100 relative">
              <Image
                src={post.video.thumbnail}
                alt="视频缩略图"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 h-full overflow-hidden">
              <p className="text-sm line-clamp-6 text-gray-700">
                {getContentPreview(post.content)}
              </p>
            </div>
          )}
        </div>

        {/* 卡片底部信息区域 */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-base font-medium mb-2 line-clamp-1">{post.title}</h3>

          <div className="flex justify-between items-center text-xs text-gray-500">
            {/* 作者头像 + 名字 */}
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
              onClick={(e) => handleUserProfileClick(e, post)}
            >
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                <Image
                  src={post.authorAvatar}
                  alt={post.author}
                  className="w-full h-full object-cover"
                  fallbackSrc="https://via.placeholder.com/50x50?text=User"
                />
              </div>
              <span className="truncate max-w-[80px]">{post.author}</span>
            </div>

            {/* 点赞按钮 */}
            <span
              className={`flex items-center cursor-pointer ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
              onClick={(e) => handleLikeClick(e, post)}
            >
              <svg
                className="w-4 h-4 mr-0.5"
                fill={isLiked ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {/* 动态显示点赞数量，如果点赞了就+1 */}
              {post.likes + (isLiked && !post.isLike ? 1 : 0) - (!isLiked && post.isLike ? 1 : 0)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">正在加载帖子...</span>
      </div>
    );
  }

  if (filteredPosts.length === 0 && !isFetching) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="bg-gray-100 rounded-lg p-8">
          <p className="text-lg mb-2">暂无相关帖子</p>
          <p className="text-sm">该标签下暂时没有符合条件的内容</p>
        </div>
      </div>
    );
  }

  // 列表视图渲染
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen">
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${items[0]?.start ?? 0}px)`,
            }}
          >
            {items.map((virtualItem) => {
              const post = filteredPosts[virtualItem.index];

              return (
                <div
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                  data-index={virtualItem.index}
                >
                  {post && (
                    <div className="relative">
                      <BasePostCard post={post} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 加载指示器 */}
        {isFetching && (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-gray-600">正在加载更多内容...</span>
          </div>
        )}

        {/* 没有更多内容提示 */}
        {!hasNextPage && filteredPosts.length > 0 && (
          <div className="text-center py-6 text-gray-500">
            <div className="bg-gray-100 rounded-lg p-4">🎉 已加载全部内容</div>
          </div>
        )}
      </div>
    );
  }

  // 网格视图渲染 - 使用瀑布流布局
  return (
    <div className="py-4 px-4">
      {/* 确保有内容且DOM稳定时才渲染瀑布流，避免初始布局跳动 */}
      {filteredPosts.length > 0 && isGridReady ? (
        <MasonryLayout 
          columns={{ default: 2, md: 3, lg: 4, xl: 5 }}
          gap="1rem"
          className="max-w-7xl mx-auto"
        >
          {filteredPosts.map((post) => (
                       <TumblrCard
               key={post.id}
               post={{
                 ...post,
                 fromPage: window.location.pathname // 记录当前标签页的路径
               }}
               onLikeClick={handleTumblrLikeClick}
               onUserClick={handleTumblrUserClick}
               onCommentClick={handleTumblrCommentClick}
               maxImageHeight={400}
             />
          ))}
        </MasonryLayout>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 animate-pulse">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 加载更多指示器 */}
      {isFetchingNextPage && (
        <div className="py-6 flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2">加载更多...</span>
        </div>
      )}

      {/* 没有更多内容提示 */}
      {!hasNextPage && filteredPosts.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          <div className="bg-gray-100 rounded-lg p-4 mx-4">🎉 已加载全部内容</div>
        </div>
      )}
    </div>
  );
}
