import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Box, 
  Divider 
} from '@mui/material';

interface MessageSettingsState {
  mentionNotify: string;
  commentNotify: string;
  likeNotify: boolean;
  retweetNotify: boolean;
  followNotify: boolean;
  favoriteNotify: boolean;
  subscribeNotify: boolean;
  privateMessageNotify: boolean;
  activityNotify: boolean;
  contentRecommendation: boolean;
  commercialNotify: boolean;
}

export default function MessageSettings() {
  const [settings, setSettings] = useState<MessageSettingsState>({
    mentionNotify: 'all',
    commentNotify: 'all',
    likeNotify: true,
    retweetNotify: true,
    followNotify: true,
    favoriteNotify: true,
    subscribeNotify: true,
    privateMessageNotify: true,
    activityNotify: true,
    contentRecommendation: false,
    commercialNotify: false,
  });

  const handleSelectChange = (field: keyof MessageSettingsState) => (event: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSwitchChange = (field: keyof MessageSettingsState) => (event: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">消息设置</h1>
        <p className="text-gray-600">管理您的通知偏好和消息接收设置</p>
      </div>

      {/* 互动提醒 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            互动提醒
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  @我的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人@您时发送通知
                </Typography>
              </div>
              <FormControl size="small" style={{ minWidth: 120 }}>
                <Select
                  value={settings.mentionNotify}
                  onChange={handleSelectChange('mentionNotify')}
                  displayEmpty
                >
                  <MenuItem value="all">所有人</MenuItem>
                  <MenuItem value="following">我关注的人</MenuItem>
                  <MenuItem value="none">关闭</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  评论提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人评论您的内容时发送通知
                </Typography>
              </div>
              <FormControl size="small" style={{ minWidth: 120 }}>
                <Select
                  value={settings.commentNotify}
                  onChange={handleSelectChange('commentNotify')}
                  displayEmpty
                >
                  <MenuItem value="all">所有人</MenuItem>
                  <MenuItem value="following">我关注的人</MenuItem>
                  <MenuItem value="none">关闭</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* 行为提醒 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            行为提醒
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  赞的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人点赞您的内容时通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.likeNotify}
                    onChange={handleSwitchChange('likeNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  被转载的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人转载您的内容时通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.retweetNotify}
                    onChange={handleSwitchChange('retweetNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  被关注的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有新用户关注您时通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.followNotify}
                    onChange={handleSwitchChange('followNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  被收藏的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人收藏您的内容时通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.favoriteNotify}
                    onChange={handleSwitchChange('favoriteNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  被订阅的提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  当有人订阅您的创作时通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.subscribeNotify}
                    onChange={handleSwitchChange('subscribeNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* 系统通知 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            系统通知
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  私信通知
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  接收私人消息通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.privateMessageNotify}
                    onChange={handleSwitchChange('privateMessageNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Divider />

            <Typography variant="subtitle1" className="font-medium">
              社区消息通知
            </Typography>

            <Box className="flex items-center justify-between pl-4">
              <div>
                <Typography variant="body1" className="font-medium">
                  官方发起的活动提醒
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  接收平台官方活动和公告
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.activityNotify}
                    onChange={handleSwitchChange('activityNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Box className="flex items-center justify-between pl-4">
              <div>
                <Typography variant="body1" className="font-medium">
                  内容推荐
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  接收个性化内容推荐通知
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.contentRecommendation}
                    onChange={handleSwitchChange('contentRecommendation')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <Divider />

            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  商圈通知
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  接收商业推广和优惠信息
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.commercialNotify}
                    onChange={handleSwitchChange('commercialNotify')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#7E44C6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#7E44C6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 