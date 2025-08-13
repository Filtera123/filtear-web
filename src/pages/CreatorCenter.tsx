import React, { useState } from 'react';
import { 
  IconChevronDown,
  IconArrowLeft,
  IconPencil,
  IconClipboardList,
  IconMessageCircle,
  IconTag
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DraftsBox from './creator-center/DraftsBox';
import ReviewCenter from './creator-center/ReviewCenter';
import FeedbackForm from './creator-center/FeedbackForm';
import TagApplicationForm from './creator-center/TagApplicationForm';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  {
    id: 'back-home',
    label: '返回首页',
    icon: <IconArrowLeft size={18} />,
  },
  {
    id: 'drafts',
    label: '草稿箱',
    icon: <IconPencil size={18} />,
  },
  {
    id: 'review',
    label: '审核中心',
    icon: <IconClipboardList size={18} />,
  },
  {
    id: 'tag-application',
    label: '重名tag申请',
    icon: <IconTag size={18} />,
  },
  {
    id: 'feedback',
    label: '意见反馈',
    icon: <IconMessageCircle size={18} />,
  },
];

export default function CreatorCenter() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('drafts');

  const handleMenuClick = (itemId: string) => {
    if (itemId === 'back-home') {
      navigate('/');
      return;
    }
    
    setActiveItem(itemId);
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'drafts':
        return <DraftsBox />;
      case 'review':
        return <ReviewCenter />;
      case 'tag-application':
        return <TagApplicationForm />;
      case 'feedback':
        return <FeedbackForm />;
      default:
        return <DraftsBox />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* 左侧导航 */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <IconPencil size={24} className="text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">创作者中心</h1>
            </div>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
                    activeItem === item.id
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                </button>
              </div>
            ))}
          </nav>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 