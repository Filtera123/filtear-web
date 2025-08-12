import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Link, 
  Box, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Alert
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PhoneChangeForm {
  oldPhoneNumber: string;
  oldCode: string;
  newPhoneNumber: string;
  newCode: string;
}

interface PasswordResetForm {
  phoneNumber: string;
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSecurity() {
  const [loginRecordsOpen, setLoginRecordsOpen] = useState(false);
  const [phoneChangeOpen, setPhoneChangeOpen] = useState(false);
  const [passwordResetOpen, setPasswordResetOpen] = useState(false);
  const [oldCodeSent, setOldCodeSent] = useState(false);
  const [newCodeSent, setNewCodeSent] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [oldCodeCountdown, setOldCodeCountdown] = useState(0);
  const [newCodeCountdown, setNewCodeCountdown] = useState(0);
  const [resetCodeCountdown, setResetCodeCountdown] = useState(0);

  const { control, handleSubmit, watch, formState: { errors }, reset } = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const { control: phoneControl, handleSubmit: handlePhoneSubmit, formState: { errors: phoneErrors }, reset: resetPhone } = useForm<PhoneChangeForm>({
    defaultValues: {
      oldPhoneNumber: '',
      oldCode: '',
      newPhoneNumber: '',
      newCode: ''
    }
  });

  const { control: resetControl, handleSubmit: handleResetSubmit, watch: watchReset, formState: { errors: resetErrors }, reset: resetPasswordForm } = useForm<PasswordResetForm>({
    defaultValues: {
      phoneNumber: '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const newPassword = watch('newPassword');
  const resetNewPassword = watchReset('newPassword');

  // 倒计时函数
  const startCountdown = (type: 'old' | 'new' | 'reset') => {
    let countdown = 60;
    
    if (type === 'old') {
      setOldCodeCountdown(countdown);
      const timer = setInterval(() => {
        countdown--;
        setOldCodeCountdown(countdown);
        if (countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else if (type === 'new') {
      setNewCodeCountdown(countdown);
      const timer = setInterval(() => {
        countdown--;
        setNewCodeCountdown(countdown);
        if (countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    } else if (type === 'reset') {
      setResetCodeCountdown(countdown);
      const timer = setInterval(() => {
        countdown--;
        setResetCodeCountdown(countdown);
        if (countdown <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
  };

  const onPasswordSubmit = (data: PasswordForm) => {
    console.log('修改密码:', data);
    // 调用 POST /api/auth/password 接口
    alert('密码修改成功');
    reset();
  };

  const onPhoneChangeSubmit = (data: PhoneChangeForm) => {
    console.log('换绑手机号:', data);
    // 调用 POST /api/auth/change-phone 接口
    alert('手机号换绑成功');
    setPhoneChangeOpen(false);
    resetPhone();
    setOldCodeSent(false);
    setNewCodeSent(false);
  };

  const onPasswordResetSubmit = (data: PasswordResetForm) => {
    console.log('重置密码:', data);
    // 调用 POST /api/auth/reset-password 接口
    alert('密码重置成功，请重新登录');
    setPasswordResetOpen(false);
    resetPasswordForm();
    setResetCodeSent(false);
  };

  const handleSendOldCode = () => {
    console.log('发送旧手机号验证码');
    // 调用 POST /api/auth/sms-code 接口
    setOldCodeSent(true);
    startCountdown('old');
  };

  const handleSendNewCode = () => {
    console.log('发送新手机号验证码');
    // 调用 POST /api/auth/sms-code 接口
    setNewCodeSent(true);
    startCountdown('new');
  };

  const handleSendResetCode = () => {
    console.log('发送密码重置验证码');
    // 调用 POST /api/auth/sms-code 接口
    setResetCodeSent(true);
    startCountdown('reset');
  };

  const handleForgotPassword = () => {
    setPasswordResetOpen(true);
  };

  const handlePhoneChange = () => {
    setPhoneChangeOpen(true);
  };

  // 密码验证规则
  const validatePassword = (value: string) => {
    if (value.length < 6 || value.length > 20) {
      return '密码长度必须为6-20位';
    }
    if (!/[a-z]/.test(value)) {
      return '密码必须包含至少1个小写字母';
    }
    if (!/\d/.test(value)) {
      return '密码必须包含至少1个数字';
    }
    // 检查弱密码
    if (/123456|aaaaaa|abcdef/.test(value)) {
      return '密码过于简单，请设置更复杂的密码';
    }
    return true;
  };

  const loginRecords = [
    { time: '2024-01-15 14:30', ip: '192.168.1.100', device: 'Chrome on Windows', status: '成功' },
    { time: '2024-01-14 09:15', ip: '192.168.1.100', device: 'Safari on iOS', status: '成功' },
    { time: '2024-01-13 20:45', ip: '192.168.1.101', device: 'Firefox on macOS', status: '成功' },
    { time: '2024-01-12 22:10', ip: '120.123.45.67', device: 'Chrome on Android', status: '失败 - 密码错误' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">账号安全</h1>
        <p className="text-gray-600">管理您的密码和登录设置</p>
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
                    placeholder="请输入当前密码"
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
                validate: validatePassword
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请输入新密码"
                  type="password"
                  fullWidth
                  size="small"
                  error={!!errors.newPassword}
                  helperText={errors.newPassword?.message || '密码需6-20位，包含至少1个小写字母和1个数字'}
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
                  placeholder="请再次输入新密码"
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
              sx={{ backgroundColor: '#7E44C6', '&:hover': { backgroundColor: '#6D38B1' } }}
            >
              确认修改
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 安全监控 */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            安全监控
          </Typography>
          
          <Box className="flex items-center justify-between">
            <div>
              <Typography variant="body1" className="font-medium">
                最近登录记录
              </Typography>
              <Typography variant="body2" className="text-gray-600">
                查看您的账号登录历史记录，监控账号安全
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

      {/* 登录记录弹窗 */}
      <Dialog open={loginRecordsOpen} onClose={() => setLoginRecordsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>最近登录记录</DialogTitle>
        <DialogContent>
          <List>
            {loginRecords.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={
                    <div className="flex justify-between items-center">
                      <span>{`${record.time} | ${record.device}`}</span>
                      <span className={`text-sm ${record.status.includes('失败') ? 'text-red-600' : 'text-green-600'}`}>
                        {record.status}
                      </span>
                    </div>
                  }
                  secondary={`IP地址: ${record.ip}`}
                />
              </ListItem>
            ))}
          </List>
          <Alert severity="info" className="mt-4">
            如发现异常登录记录，请立即修改密码并联系客服
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginRecordsOpen(false)}>关闭</Button>
        </DialogActions>
      </Dialog>

      {/* 换绑手机号弹窗 */}
      <Dialog open={phoneChangeOpen} onClose={() => setPhoneChangeOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>更换绑定手机号</DialogTitle>
        <DialogContent>
          <form onSubmit={handlePhoneSubmit(onPhoneChangeSubmit)} className="space-y-4 pt-2">
            <Alert severity="warning">
              为保障账号安全，需要验证旧手机号和新手机号
            </Alert>
            
            <div className="flex items-end space-x-2">
              <Controller
                name="oldPhoneNumber"
                control={phoneControl}
                rules={{ 
                  required: '请输入旧手机号',
                  pattern: { value: /^1\d{10}$/, message: '请输入有效的手机号' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="请输入旧手机号"
                    fullWidth
                    size="small"
                    error={!!phoneErrors.oldPhoneNumber}
                    helperText={phoneErrors.oldPhoneNumber?.message}
                  />
                )}
              />
              <Button 
                onClick={handleSendOldCode}
                disabled={oldCodeCountdown > 0}
                variant="outlined"
                size="small"
              >
                {oldCodeCountdown > 0 ? `${oldCodeCountdown}s` : '发送验证码'}
              </Button>
            </div>
            
            <Controller
              name="oldCode"
              control={phoneControl}
              rules={{ 
                required: '请输入旧手机号验证码',
                pattern: { value: /^\d{6}$/, message: '验证码为6位数字' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请输入6位验证码"
                  fullWidth
                  size="small"
                  error={!!phoneErrors.oldCode}
                  helperText={phoneErrors.oldCode?.message}
                />
              )}
            />
            
            <div className="flex items-end space-x-2">
              <Controller
                name="newPhoneNumber"
                control={phoneControl}
                rules={{ 
                  required: '请输入新手机号',
                  pattern: { value: /^1\d{10}$/, message: '请输入有效的手机号' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="请输入新手机号"
                    fullWidth
                    size="small"
                    error={!!phoneErrors.newPhoneNumber}
                    helperText={phoneErrors.newPhoneNumber?.message}
                  />
                )}
              />
              <Button 
                onClick={handleSendNewCode}
                disabled={newCodeCountdown > 0}
                variant="outlined"
                size="small"
              >
                {newCodeCountdown > 0 ? `${newCodeCountdown}s` : '发送验证码'}
              </Button>
            </div>
            
            <Controller
              name="newCode"
              control={phoneControl}
              rules={{ 
                required: '请输入新手机号验证码',
                pattern: { value: /^\d{6}$/, message: '验证码为6位数字' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请输入6位验证码"
                  fullWidth
                  size="small"
                  error={!!phoneErrors.newCode}
                  helperText={phoneErrors.newCode?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPhoneChangeOpen(false)}>取消</Button>
          <Button 
            onClick={handlePhoneSubmit(onPhoneChangeSubmit)}
            variant="contained"
            sx={{ backgroundColor: '#7E44C6', '&:hover': { backgroundColor: '#6D38B1' } }}
          >
            确认更换
          </Button>
        </DialogActions>
      </Dialog>

      {/* 密码重置弹窗 */}
      <Dialog open={passwordResetOpen} onClose={() => setPasswordResetOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>重置密码</DialogTitle>
        <DialogContent>
          <form onSubmit={handleResetSubmit(onPasswordResetSubmit)} className="space-y-4 pt-2">
            <Alert severity="info">
              通过手机号验证码重置密码，重置后需要重新登录
            </Alert>
            
            <div className="flex items-end space-x-2">
              <Controller
                name="phoneNumber"
                control={resetControl}
                rules={{ 
                  required: '请输入手机号',
                  pattern: { value: /^1\d{10}$/, message: '请输入有效的手机号' }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="请输入手机号"
                    fullWidth
                    size="small"
                    error={!!resetErrors.phoneNumber}
                    helperText={resetErrors.phoneNumber?.message}
                  />
                )}
              />
              <Button 
                onClick={handleSendResetCode}
                disabled={resetCodeCountdown > 0}
                variant="outlined"
                size="small"
              >
                {resetCodeCountdown > 0 ? `${resetCodeCountdown}s` : '发送验证码'}
              </Button>
            </div>
            
            <Controller
              name="code"
              control={resetControl}
              rules={{ 
                required: '请输入验证码',
                pattern: { value: /^\d{6}$/, message: '验证码为6位数字' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请输入6位验证码"
                  fullWidth
                  size="small"
                  error={!!resetErrors.code}
                  helperText={resetErrors.code?.message}
                />
              )}
            />
            
            <Controller
              name="newPassword"
              control={resetControl}
              rules={{ 
                required: '请输入新密码',
                validate: validatePassword
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请输入新密码"
                  type="password"
                  fullWidth
                  size="small"
                  error={!!resetErrors.newPassword}
                  helperText={resetErrors.newPassword?.message || '密码需6-20位，包含至少1个小写字母和1个数字'}
                />
              )}
            />
            
            <Controller
              name="confirmPassword"
              control={resetControl}
              rules={{ 
                required: '请确认新密码',
                validate: value => value === resetNewPassword || '两次输入的密码不一致'
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  placeholder="请再次输入新密码"
                  type="password"
                  fullWidth
                  size="small"
                  error={!!resetErrors.confirmPassword}
                  helperText={resetErrors.confirmPassword?.message}
                />
              )}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordResetOpen(false)}>取消</Button>
          <Button 
            onClick={handleResetSubmit(onPasswordResetSubmit)}
            variant="contained"
            sx={{ backgroundColor: '#7E44C6', '&:hover': { backgroundColor: '#6D38B1' } }}
          >
            重置密码
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 