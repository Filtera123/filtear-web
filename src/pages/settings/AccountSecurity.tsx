import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Switch, 
  FormControlLabel, 
  Link, 
  Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSecurity() {
  const [youthMode, setYouthMode] = useState(false);
  const [loginRecordsOpen, setLoginRecordsOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log('修改密码:', data);
    // 这里处理密码修改逻辑
  };

  const handleForgotPassword = () => {
    console.log('跳转到忘记密码页面');
    // 这里处理跳转逻辑
  };

  const handlePhoneChange = () => {
    console.log('触发手机号换绑流程');
    // 这里处理手机号换绑逻辑
  };

  const loginRecords = [
    { time: '2024-01-15 14:30', ip: '192.168.1.100', device: 'Chrome on Windows' },
    { time: '2024-01-14 09:15', ip: '192.168.1.100', device: 'Safari on iOS' },
    { time: '2024-01-13 20:45', ip: '192.168.1.101', device: 'Firefox on macOS' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">账号安全</h1>
        <p className="text-gray-600">管理您的密码、安全验证和登录设置</p>
      </div>

      {/* 密码修改 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            密码修改
          </Typography>
          
          <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Controller
                name="currentPassword"
                control={control}
                rules={{ required: '请输入当前密码' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="原密码"
                    type="password"
                    size="small"
                    style={{ flex: 1 }}
                    error={!!errors.currentPassword}
                    helperText={errors.currentPassword?.message}
                  />
                )}
              />
              <Link
                component="button"
                type="button"
                onClick={handleForgotPassword}
                className="text-purple-600 hover:text-purple-800 text-sm"
              >
                忘记密码?
              </Link>
            </div>
            
            <Controller
              name="newPassword"
              control={control}
              rules={{ 
                required: '请输入新密码',
                minLength: { value: 6, message: '密码长度至少6位' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="新密码"
                  type="password"
                  fullWidth
                  size="small"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message}
                />
              )}
            />
            
            <Controller
              name="confirmPassword"
              control={control}
              rules={{ 
                required: '请确认新密码',
                validate: value => value === newPassword || '两次输入的密码不一致'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="确认密码"
                  type="password"
                  fullWidth
                  size="small"
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
            
            <Button 
              type="submit" 
              variant="contained"
              sx={{ backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' } }}
            >
              确认修改
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 安全校验 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            安全校验
          </Typography>
          
          <div className="space-y-4">
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  双重登录验证
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  增强账号安全性，支持短信和邮箱验证
                </Typography>
              </div>
              <Button 
                variant="outlined" 
                onClick={() => setTwoFactorOpen(true)}
                size="small"
              >
                查看
              </Button>
            </Box>
            
            <Box className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-medium">
                  最近登录记录
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  查看您的账号登录历史记录
                </Typography>
              </div>
              <Button 
                variant="outlined" 
                onClick={() => setLoginRecordsOpen(true)}
                size="small"
              >
                查看
              </Button>
            </Box>
          </div>
        </CardContent>
      </Card>

      {/* 账号绑定 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            账号绑定
          </Typography>
          
          <Box className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">
                手机号换绑
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                当前绑定：138****1234
              </Typography>
            </div>
            <Button 
              variant="outlined" 
              onClick={handlePhoneChange}
              size="small"
            >
              更改
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* 青少年模式 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            青少年模式
          </Typography>
          
          <Box className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">
                青少年模式
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                开启后将隐藏敏感内容，提供更适合青少年的浏览体验
              </Typography>
            </div>
            <FormControlLabel
              control={
                <Switch
                  checked={youthMode}
                  onChange={(e) => setYouthMode(e.target.checked)}
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
        </CardContent>
      </Card>

      {/* 登录记录弹窗 */}
      <Dialog open={loginRecordsOpen} onClose={() => setLoginRecordsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>最近登录记录</DialogTitle>
        <DialogContent>
          <List>
            {loginRecords.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`${record.time} | ${record.device}`}
                  secondary={`IP地址: ${record.ip}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginRecordsOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 双重验证弹窗 */}
      <Dialog open={twoFactorOpen} onClose={() => setTwoFactorOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>双重登录验证</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-2">
            <Box className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Typography variant="body1" className="font-medium">短信验证</Typography>
                <Typography variant="body2" className="text-gray-600">138****1234</Typography>
              </div>
              <Typography variant="body2" className="text-green-600">已启用</Typography>
            </Box>
            <Box className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <Typography variant="body1" className="font-medium">邮箱验证</Typography>
                <Typography variant="body2" className="text-gray-600">user@example.com</Typography>
              </div>
              <Button variant="outlined" size="small">启用</Button>
            </Box>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTwoFactorOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 