import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrowsingHistoryStore, type BrowsingRecord } from '@/stores/browsingHistoryStore';
import { Image } from '@/components/ui';

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
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
};

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

export default function RecentlyViewed() {
  const { getRecentRecords } = useBrowsingHistoryStore();
  const [recentRecords, setRecentRecords] = useState<BrowsingRecord[]>([]);

  // 获取最近浏览记录
  useEffect(() => {
    const records = getRecentRecords(10); // 最多显示10条
    setRecentRecords(records);
  }, [getRecentRecords]);

  // 定期刷新数据（当用户在其他页面浏览后回到当前页面）
  useEffect(() => {
    const interval = setInterval(() => {
      const records = getRecentRecords(10);
      setRecentRecords(records);
    }, 5000); // 每5秒检查一次

    return () => clearInterval(interval);
  }, [getRecentRecords]);

  return (
    <div className="bg-white rounded-sm border border-gray-200 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">最近浏览</h1>
        {recentRecords.length > 0 && (
          <Link to="/recently-viewed" className="text-sm text-blue-500 hover:underline">
            查看更多
          </Link>
        )}
      </div>
      
      {recentRecords.length > 0 ? (
        <div className="max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
          <div className="space-y-3 pb-2">
            {recentRecords.map((record) => (
              <Link
                key={`${record.id}-${record.viewTime}`}
                to={record.url}
                className="block p-3 border border-gray-100 rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {/* 缩略图 */}
                  {record.thumbnail && (
                    <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={record.thumbnail}
                        alt={record.title}
                        className="w-full h-full object-cover"
                        fallbackText={typeDisplayMap[record.type]}
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-medium line-clamp-2 mb-1">{record.title}</h3>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                      <span className="truncate">{record.author}</span>
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded-full flex-shrink-0">
                        {typeDisplayMap[record.type]}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-400">
                      {formatViewTime(record.viewTime)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-sm text-gray-500">
          暂无浏览记录
        </div>
      )}
    </div>
  );
}
