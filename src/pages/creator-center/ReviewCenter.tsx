import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Tabs,
  Tab
} from '@mui/material';

// 模拟审核数据
interface ReviewItem {
  id: string;
  title: string;
  content: string;
  submitDate: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const mockReviews: ReviewItem[] = [
  {
    id: '1',
    title: '我的旅行记录',
    content: '最近去了西藏，分享一些照片和感受...',
    submitDate: '2023-08-15',
    status: 'pending'
  },
  {
    id: '2',
    title: '摄影技巧分享',
    content: '关于如何拍摄星空的一些技巧...',
    submitDate: '2023-08-10',
    status: 'approved'
  },
  {
    id: '3',
    title: '美食分享',
    content: '自制蛋糕的做法...',
    submitDate: '2023-08-08',
    status: 'rejected',
    reason: '内容包含过多广告信息'
  }
];

export default function ReviewCenter() {
  const [activeTab, setActiveTab] = useState('pending');

  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const filteredReviews = mockReviews.filter(item => {
    switch(activeTab) {
      case 'pending':
        return item.status === 'pending';
      case 'approved':
        return item.status === 'approved';
      case 'rejected':
        return item.status === 'rejected';
      default:
        return true;
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">审核中心</h1>
        <p className="text-gray-600">查看您提交内容的审核状态</p>
      </div>

      {/* 审核中心主界面 */}
      <Card>
        <CardContent className="p-6">
          {/* 审核状态标签页 */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="审核状态"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="审核中" value="pending" />
            <Tab label="已通过" value="approved" />
            <Tab label="未通过" value="rejected" />
          </Tabs>

          {/* 审核内容列表 */}
          <div className="mt-6">
            {filteredReviews.length === 0 ? (
              <div className="text-center py-8">
                <Typography variant="body1" color="textSecondary">
                  暂无内容
                </Typography>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((item) => (
                  <div 
                    key={item.id} 
                    className="border border-gray-200 rounded-md p-4 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.content}</p>
                        <div className="text-xs text-gray-500">
                          提交时间：{item.submitDate}
                        </div>
                        {item.status === 'rejected' && item.reason && (
                          <div className="text-xs text-red-600 mt-1">
                            未通过原因：{item.reason}
                          </div>
                        )}
                      </div>
                      <div>
                        {item.status === 'pending' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            审核中
                          </span>
                        )}
                        {item.status === 'approved' && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                            已通过
                          </span>
                        )}
                        {item.status === 'rejected' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                            未通过
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 