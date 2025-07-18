import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrowsingHistoryStore, type BrowsingRecord } from '@/stores/browsingHistoryStore';
import { Image } from '@/components/ui';
import { PostType } from '@/components/post-card/post.types';

// 时间格式化工具函数
const formatViewTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return '刚刚';
  if (diffMins < 60) return `${diffMins}分钟前`;
  if (diffHours < 24) return `${diffHours}小时前`;
  if (diffDays < 3) return `${diffDays}天前`;
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 获取内容预览
const getContentPreview = (content: string) => {
  return content?.substring(0, 150) || '无内容';
};

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

// 获取类型颜色
const getTypeColor = (type: string) => {
  switch (type) {
    case 'article':
      return 'bg-blue-100 text-blue-800';
    case 'image':
      return 'bg-green-100 text-green-800';
    case 'video':
      return 'bg-purple-100 text-purple-800';
    case 'dynamic':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RecentlyViewed() {
  const { records, removeRecord, cleanupDuplicates } = useBrowsingHistoryStore();
  
  // 页面加载时清理重复数据
  useEffect(() => {
    cleanupDuplicates();
  }, [cleanupDuplicates]);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  // 按时间排序的记录
  const sortedRecords = records
    .slice()
    .sort((a, b) => new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime());

  // 根据帖子类型生成正确的URL
  const getPostDetailUrl = useCallback((record: BrowsingRecord) => {
    return record.url;
  }, []);

  // 处理帖子点击
  const handlePostClick = useCallback((record: BrowsingRecord) => {
    navigate(record.url);
  }, [navigate]);

  // 处理用户点击
  const handleUserProfileClick = useCallback((e: React.MouseEvent, record: BrowsingRecord) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    navigate(`/user/${record.author}`);
  }, [navigate]);

  // 获取帖子当前的点赞状态
  const getPostLikeStatus = useCallback((record: BrowsingRecord) => {
    // 如果本地状态中有该帖子的点赞状态，则使用本地状态，否则默认为false
    return likedPosts[record.id] !== undefined ? likedPosts[record.id] : false;
  }, [likedPosts]);

  // 处理点赞点击
  const handleLikeClick = useCallback((e: React.MouseEvent, record: BrowsingRecord) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击事件
    
    // 更新本地点赞状态
    setLikedPosts(prev => {
      const currentLikeState = prev[record.id] !== undefined ? prev[record.id] : false;
      const newLikeState = !currentLikeState;
      
      console.log(`${newLikeState ? '点赞' : '取消点赞'}帖子:`, record.id);
      
      return {
        ...prev,
        [record.id]: newLikeState
      };
    });
  }, []);

  // 处理删除记录
  const handleRemoveRecord = useCallback((e: React.MouseEvent, recordId: string) => {
    e.stopPropagation(); // 阻止事件冒泡，防止触发卡片点击
    removeRecord(recordId);
  }, [removeRecord]);

  // 网格视图渲染卡片
  const renderGridCard = (record: BrowsingRecord) => {
    const isLiked = getPostLikeStatus(record);

    return (
      <div
        key={record.id}
        className="bg-white rounded-md shadow-sm border border-gray-200 h-full flex flex-col cursor-pointer hover:shadow-md transition-shadow relative group"
        onClick={() => handlePostClick(record)}
      >
        {/* 删除按钮 */}
        <button
          onClick={(e) => handleRemoveRecord(e, record.id)}
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-1.5 text-gray-500 hover:text-red-500 transition-all"
          title="删除此记录"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        

        {/* 卡片内容区域 */}
        <div className="flex-grow relative">
          {/* 图片 / 视频 / 纯文本预览 */}
          {record.type === 'image' && record.thumbnail ? (
            <Image
              src={record.thumbnail}
              alt={record.title}
              className="w-full h-full object-cover"
            />
          ) : record.type === 'video' && record.thumbnail ? (
            <div className="h-full w-full bg-gray-100 relative">
              <Image
                src={record.thumbnail}
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
          ) : record.thumbnail ? (
            <div className="h-full w-full bg-gray-100 relative">
              <Image
                src={record.thumbnail}
                alt={record.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="p-4 h-full overflow-hidden bg-gray-50">
              <p className="text-sm line-clamp-6 text-gray-700">
                {record.title}
              </p>
            </div>
          )}
        </div>

        {/* 卡片底部信息区域 */}
        <div className="p-4 border-t border-gray-100">
          <h3 className="text-base font-medium mb-2 line-clamp-2">{record.title}</h3>

                     <div className="flex justify-between items-center text-xs text-gray-500">
             {/* 作者头像 + 名字 */}
             <div
               className="flex items-center gap-2 cursor-pointer hover:text-blue-500"
               onClick={(e) => handleUserProfileClick(e, record)}
             >
               {record.authorAvatar ? (
                 <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                   <Image
                     src={record.authorAvatar}
                     alt={record.author}
                     className="w-full h-full object-cover"
                     fallbackSrc="https://via.placeholder.com/50x50?text=User"
                   />
                 </div>
               ) : (
                 <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                   {record.author[0]}
                 </div>
               )}
               <span className="truncate max-w-[100px]">{record.author}</span>
             </div>

             {/* 点赞按钮 */}
             <span
               className={`flex items-center cursor-pointer ${
                 isLiked ? 'text-red-500' : 'hover:text-red-500'
               }`}
               onClick={(e) => handleLikeClick(e, record)}
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
               {isLiked ? 1 : 0}
             </span>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* 头部 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">最近浏览</h1>
          <p className="text-gray-500 mt-1">
            共 {records.length} 条浏览记录
          </p>
        </div>



        {/* 浏览记录网格 */}
        {sortedRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRecords.map((record) => (
              <div key={`${record.id}-${record.viewTime}`} className="h-auto" style={{ minHeight: '280px' }}>
                {renderGridCard(record)}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📖</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无浏览记录</h3>
            <p className="text-gray-500 mb-4">
              开始浏览内容后，您的浏览历史将显示在这里
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              去首页浏览
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 