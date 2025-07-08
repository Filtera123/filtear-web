import React, { useState } from 'react';
import { 
  IconChevronDown, 
  IconChevronUp,
  IconSettings,
  IconUser,
  IconShieldCheck,
  IconBell,
  IconCopyright,
  IconEyeOff,
  IconArrowLeft
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AccountInfo from './settings/AccountInfo';
import AccountSecurity from './settings/AccountSecurity';
import MessageSettings from './settings/MessageSettings';
import CopyrightProtection from './settings/CopyrightProtection';
import PrivacySettings from './settings/PrivacySettings';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  hasSubmenu?: boolean;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  id: string;
  label: string;
  parent: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'back-home',
    label: '返回首页',
    icon: <IconArrowLeft size={18} />,
  },
  {
    id: 'account',
    label: '账号与安全',
    icon: <IconUser size={18} />,
    hasSubmenu: true,
    submenu: [
      { id: 'account-info', label: '账号信息', parent: 'account' },
      { id: 'account-security', label: '账号安全', parent: 'account' },
    ],
  },
  {
    id: 'privacy',
    label: '隐私设置',
    icon: <IconEyeOff size={18} />,
    hasSubmenu: true,
    submenu: [
      { id: 'privacy-block', label: '屏蔽设置', parent: 'privacy' },
    ],
  },
  {
    id: 'messages',
    label: '消息设置',
    icon: <IconBell size={18} />,
  },
  {
    id: 'copyright',
    label: '版权保护',
    icon: <IconCopyright size={18} />,
  },
];

export default function Settings() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('account-info');
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['account']);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuId)
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (itemId: string, hasSubmenu?: boolean) => {
    if (itemId === 'back-home') {
      navigate('/');
      return;
    }
    
    if (hasSubmenu) {
      toggleMenu(itemId);
    } else {
      setActiveItem(itemId);
    }
  };

  const renderContent = () => {
    switch (activeItem) {
      case 'account-info':
        return <AccountInfo />;
      case 'account-security':
        return <AccountSecurity />;
      case 'messages':
        return <MessageSettings />;
      case 'copyright':
        return <CopyrightProtection />;
      case 'privacy-block':
        return <PrivacySettings type={activeItem} />;
      default:
        return <AccountInfo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto flex">
        {/* 左侧导航 */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <IconSettings size={24} className="text-purple-600" />
              <h1 className="text-xl font-semibold text-gray-900">设置</h1>
            </div>
          </div>
          
          <nav className="p-4">
            {menuItems.map((item) => (
              <div key={item.id} className="mb-1">
                <button
                  onClick={() => handleMenuClick(item.id, item.hasSubmenu)}
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
                  {item.hasSubmenu && (
                    <motion.div
                      animate={{ rotate: expandedMenus.includes(item.id) ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <IconChevronDown size={16} />
                    </motion.div>
                  )}
                </button>
                
                <AnimatePresence>
                  {item.hasSubmenu && expandedMenus.includes(item.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-4 mt-1 space-y-1"
                    >
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => setActiveItem(subItem.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeItem === subItem.id
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
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