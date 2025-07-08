import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { IconUser, IconBell, IconShieldCheck, IconCopyright } from '@tabler/icons-react';

export default function SettingsOverview() {
  const settingsSections = [
    {
      icon: <IconUser size={24} />,
      title: '账号与安全',
      description: '管理您的个人信息、密码和安全设置',
      items: ['账号信息', '账号安全']
    },
    {
      icon: <IconBell size={24} />,
      title: '消息设置',
      description: '设置各种通知和提醒的接收方式',
      items: ['互动提醒', '行为提醒', '系统通知']
    },
    {
      icon: <IconShieldCheck size={24} />,
      title: '隐私设置',
      description: '控制您的隐私和偏好设置',
      items: ['屏蔽设置', '偏好设置']
    },
    {
      icon: <IconCopyright size={24} />,
      title: '版权保护',
      description: '保护您的原创内容和设置转载权限',
      items: ['水印配置', '转载控制']
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">设置中心</h1>
        <p className="text-gray-600">管理您的账号、隐私、通知和其他偏好设置</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settingsSections.map((section, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <Box className="flex items-start space-x-4">
                <div className="text-purple-600 mt-1">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <Typography variant="h6" className="font-semibold mb-2">
                    {section.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-3">
                    {section.description}
                  </Typography>
                  <div className="space-y-1">
                    {section.items.map((item, itemIndex) => (
                      <Typography key={itemIndex} variant="caption" className="block text-gray-500">
                        • {item}
                      </Typography>
                    ))}
                  </div>
                </div>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-3">
            快速操作
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
              <Typography variant="subtitle2" className="font-medium">
                修改密码
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                保护账号安全
              </Typography>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
              <Typography variant="subtitle2" className="font-medium">
                通知设置
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                管理消息提醒
              </Typography>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors text-left">
              <Typography variant="subtitle2" className="font-medium">
                隐私保护
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                控制个人信息
              </Typography>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 