import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Switch, 
  FormControlLabel, 
  RadioGroup, 
  Radio, 
  Box 
} from '@mui/material';

interface CopyrightSettings {
  saveWithWatermark: boolean;
  signatureWatermark: boolean;
  watermarkPosition: string;
  allowCopyText: boolean;
  allowRepost: boolean;
}

export default function CopyrightProtection() {
  const [settings, setSettings] = useState<CopyrightSettings>({
    saveWithWatermark: true,
    signatureWatermark: true,
    watermarkPosition: 'bottom-right',
    allowCopyText: true,
    allowRepost: true,
  });

  const handleSwitchChange = (field: keyof CopyrightSettings) => (event: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: event.target.checked
    }));
  };

  const handlePositionChange = (event: any) => {
    setSettings(prev => ({
      ...prev,
      watermarkPosition: event.target.value
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">版权保护</h1>
        <p className="text-gray-600">保护您的原创内容，设置水印和转载权限</p>
      </div>

      {/* 水印配置 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            水印配置
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  是否保存图片
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  开启后，本地保存图片时自动添加水印
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.saveWithWatermark}
                    onChange={handleSwitchChange('saveWithWatermark')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8b5cf6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8b5cf6',
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
                  保存的图片是否带版权签名
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  在图片上叠加您的版权签名水印
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.signatureWatermark}
                    onChange={handleSwitchChange('signatureWatermark')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8b5cf6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8b5cf6',
                      },
                    }}
                  />
                }
                label=""
              />
            </Box>

            <div>
              <Typography variant="body1" className="font-medium mb-2">
                水印位置
              </Typography>
              <Typography variant="body2" className="text-gray-600 mb-3">
                选择水印在图片上的显示位置
              </Typography>
              <RadioGroup 
                value={settings.watermarkPosition} 
                onChange={handlePositionChange}
                row
              >
                <FormControlLabel 
                  value="bottom-right" 
                  control={<Radio size="small" sx={{
                    color: '#8b5cf6',
                    '&.Mui-checked': {
                      color: '#8b5cf6',
                    },
                  }} />} 
                  label="底部靠右" 
                />
                <FormControlLabel 
                  value="bottom-center" 
                  control={<Radio size="small" sx={{
                    color: '#8b5cf6',
                    '&.Mui-checked': {
                      color: '#8b5cf6',
                    },
                  }} />} 
                  label="底部居中" 
                />
                <FormControlLabel 
                  value="center" 
                  control={<Radio size="small" sx={{
                    color: '#8b5cf6',
                    '&.Mui-checked': {
                      color: '#8b5cf6',
                    },
                  }} />} 
                  label="图片中心" 
                />
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 转载控制 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            转载控制
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  是否允许复制文字
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  开启后，其他用户可以复制您的内容文本
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowCopyText}
                    onChange={handleSwitchChange('allowCopyText')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8b5cf6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8b5cf6',
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
                  是否允许转载
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  开启后，其他用户可以转发分享您的内容
                </Typography>
              </div>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.allowRepost}
                    onChange={handleSwitchChange('allowRepost')}
                    color="default"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#8b5cf6',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#8b5cf6',
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

      {/* 预览说明 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            版权保护说明
          </Typography>
          
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>水印功能会在您的图片内容上添加版权标识，有效防止他人盗用</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>关闭文字复制功能后，其他用户将无法直接复制您的文本内容</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>关闭转载功能后，您的内容将无法被他人转发或分享</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-purple-600 font-bold">•</span>
              <span>这些设置仅影响新发布的内容，已发布的内容不会受到影响</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 