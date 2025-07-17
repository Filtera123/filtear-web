import React, { useState, useEffect } from 'react';
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
  return date.toLocaleDateString('zh-CN', { 
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 类型显示文本映射
const typeDisplayMap = {
  article: '文章',
  image: '图片',
  dynamic: '动态',
  video: '视频',
};

export default function RecentlyViewed() {
  const { records, clearHistory, removeRecord } = useBrowsingHistoryStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    clearHistory();
    setShowClearConfirm(false);
  };

  const handleRemoveRecord = (id: string, event: React.MouseEvent) => {
    event.preventDefault(); // 阻止Link的导航
    removeRecord(id);
  };

  // 按时间排序的记录
  const sortedRecords = records
    .slice()
    .sort((a, b) => new Date(b.viewTime).getTime() - new Date(a.viewTime).getTime());

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* 头部 */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">最近浏览</h1>
            <p className="text-gray-500 text-sm mt-1">
              共 {records.length} 条浏览记录
            </p>
          </div>
          
          {records.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                清空历史
              </button>
            </div>
          )}
        </div>

        {/* 确认清空对话框 */}
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium mb-4">确认清空历史记录？</h3>
              <p className="text-gray-600 mb-6">此操作不可恢复，确定要清空所有浏览历史吗？</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleClearHistory}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  确认清空
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 浏览记录列表 */}
        <div className="p-6">
          {sortedRecords.length > 0 ? (
            <div className="space-y-4">
              {sortedRecords.map((record) => (
                <div
                  key={`${record.id}-${record.viewTime}`}
                  className="relative group"
                >
                  <Link
                    to={record.url}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      {/* 缩略图 */}
                      {record.thumbnail && (
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={record.thumbnail}
                            alt={record.title}
                            className="w-full h-full object-cover"
                            fallbackText={typeDisplayMap[record.type]}
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-medium text-gray-900 line-clamp-2 pr-4">
                            {record.title}
                          </h3>
                          
                          {/* 删除按钮 */}
                          <button
                            onClick={(e) => handleRemoveRecord(record.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                            title="删除此记录"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
                          </button>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>{record.author}</span>
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {typeDisplayMap[record.type]}
            </span>
          </div>
                        
                        <div className="text-sm text-gray-400">
                          浏览时间：{formatViewTime(record.viewTime)}
        </div>
      </div>
        </div>
                  </Link>
              </div>
            ))}
          </div>
        ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无浏览记录</h3>
              <p className="text-gray-500">
                开始浏览内容后，您的浏览历史将显示在这里
              </p>
              <Link
                to="/"
                className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                去首页浏览
              </Link>
          </div>
        )}
        </div>
      </div>
    </div>
  );
} 