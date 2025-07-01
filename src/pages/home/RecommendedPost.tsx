import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  isFavorite: boolean;
  comments: number;
}

// 生成模拟帖子的函数
const generateMockPosts = (startId: number, count: number): Post[] => {
  return Array.from({length: count}).map((_, i) => {
    const id = startId + i;
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
      tags: ['推荐', '热门', `话题${(id % 3) + 1}`],
      isLike: Math.random() > 0.7,
      likes: Math.floor(Math.random() * 500),
      isFavorite: Math.random() > 0.8,
      comments: Math.floor(Math.random() * 100)
    };
  });
};

export default function RecommendedPost() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const loadingRef = useRef(false); // 防止重复加载的引用

  // 加载更多帖子的函数
  const loadMorePosts = useCallback(async () => {
    // 防止重复加载
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    setLoading(true);
    
    console.log(`加载第 ${page + 1} 页，起始ID: ${page * 10}`);
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPosts = generateMockPosts(page * 10, 10);
    setPosts(prevPosts => [...prevPosts, ...newPosts]);
    
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
    <div className="grid grid-cols-1 gap-4">
      <PostArea />
      <div className="space-y-4">
        {posts.map((post) => (
          <FullPostCard key={post.id} post={post} />
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
          <div className="text-center py-8 text-gray-500">
            暂无推荐内容
          </div>
        )}
      </div>
    </div>
  );
}
