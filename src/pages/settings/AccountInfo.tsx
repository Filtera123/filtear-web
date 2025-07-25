import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Box, 
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/zh-cn';
import { useForm, Controller } from 'react-hook-form';
import { IconUpload, IconTrash, IconCheck, IconX } from '@tabler/icons-react';

interface AccountInfoForm {
  nickname: string;
  bio: string;
  gender: string;
  birthDate: Dayjs | null;
}

interface UploadState {
  avatar: string | null;
  background: string | null;
}

export default function AccountInfo() {
  // 表单状态
  const { control, handleSubmit, watch, reset, formState: { errors, isDirty } } = useForm<AccountInfoForm>({
    defaultValues: {
      nickname: '',
      bio: '',
      gender: '',
      birthDate: null
    }
  });

  // 组件状态
  const [uploadState, setUploadState] = useState<UploadState>({
    avatar: null,
    background: null
  });
  const [loading, setLoading] = useState({
    save: false,
    avatar: false,
    background: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // 文件上传引用
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // 监听表单变化
  const watchedValues = watch();
  const bioLength = watchedValues.bio?.length || 0;
  const maxBioLength = 200;

  // 模拟初始数据加载
  useEffect(() => {
    // 模拟从后端加载用户数据
    const loadUserData = async () => {
      try {
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const userData = {
          nickname: '用户昵称',
          bio: '这是我的个人简介',
          gender: 'female',
          birthDate: dayjs('1995-06-15'),
          avatar: 'https://picsum.photos/id/64/100/100',
          background: 'https://picsum.photos/id/29/800/300'
        };

        reset({
          nickname: userData.nickname,
          bio: userData.bio,
          gender: userData.gender,
          birthDate: userData.birthDate
        });

        setUploadState({
          avatar: userData.avatar,
          background: userData.background
        });
      } catch (error) {
        showSnackbar('加载用户数据失败', 'error');
      }
    };

    loadUserData();
  }, [reset]);

  // 监听表单变化状态
  useEffect(() => {
    setUnsavedChanges(isDirty);
  }, [isDirty]);

  // 显示消息提示
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  // 文件上传处理
  const handleFileUpload = async (file: File, type: 'avatar' | 'background') => {
    // 文件格式验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showSnackbar('请上传 JPG、PNG 或 WebP 格式的图片', 'error');
      return;
    }

    // 文件大小验证
    const maxSize = type === 'avatar' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB / 10MB
    if (file.size > maxSize) {
      const sizeMB = type === 'avatar' ? '5MB' : '10MB';
      showSnackbar(`图片大小不能超过 ${sizeMB}`, 'error');
      return;
    }

    // 图片尺寸验证（仅背景图）
    if (type === 'background') {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        if (img.width < 800 || img.height < 300) {
          showSnackbar('背景图建议尺寸至少 800×300 像素', 'warning');
        }
      };
      img.src = objectUrl;
    }

    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      // 模拟上传API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 创建预览URL
      const previewUrl = URL.createObjectURL(file);
      setUploadState(prev => ({ ...prev, [type]: previewUrl }));
      
      showSnackbar(type === 'avatar' ? '头像上传成功' : '背景图上传成功', 'success');
      setUnsavedChanges(true);
    } catch (error) {
      showSnackbar('上传失败，请重试', 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // 头像上传
  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'avatar');
    }
    // 重置input值，允许重复选择同一文件
    event.target.value = '';
  };

  // 背景图上传
  const handleBackgroundUpload = () => {
    backgroundInputRef.current?.click();
  };

  const onBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file, 'background');
    }
    event.target.value = '';
  };

  // 移除背景图
  const handleRemoveBackground = () => {
    setConfirmDialog({
      open: true,
      title: '确认移除',
      message: '确定要移除背景图吗？',
      onConfirm: () => {
        setUploadState(prev => ({ ...prev, background: null }));
        setUnsavedChanges(true);
        showSnackbar('背景图已移除', 'success');
        setConfirmDialog(prev => ({ ...prev, open: false }));
      }
    });
  };

  // 表单提交
  const onSubmit = async (data: AccountInfoForm) => {
    // 昵称验证
    if (!data.nickname.trim()) {
      showSnackbar('昵称不能为空', 'error');
      return;
    }
    if (data.nickname.length > 20) {
      showSnackbar('昵称不能超过20个字符', 'error');
      return;
    }

    // 简介验证
    if (data.bio && data.bio.length > maxBioLength) {
      showSnackbar(`简介不能超过${maxBioLength}个字符`, 'error');
      return;
    }

    setLoading(prev => ({ ...prev, save: true }));

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('保存数据:', {
        ...data,
        avatar: uploadState.avatar,
        background: uploadState.background
      });

      showSnackbar('资料保存成功', 'success');
      setUnsavedChanges(false);
    } catch (error) {
      showSnackbar('保存失败，请重试', 'error');
    } finally {
      setLoading(prev => ({ ...prev, save: false }));
    }
  };

  // 取消操作
  const handleCancel = () => {
    if (unsavedChanges) {
      setConfirmDialog({
        open: true,
        title: '确认取消',
        message: '您有未保存的更改，确定要取消吗？',
        onConfirm: () => {
          reset();
          setUploadState({
            avatar: 'https://picsum.photos/id/64/100/100',
            background: 'https://picsum.photos/id/29/800/300'
          });
          setUnsavedChanges(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
          showSnackbar('已取消更改', 'info');
        }
      });
    }
  };

  // 昵称验证函数
  const validateNickname = (value: string) => {
    if (!value.trim()) return '昵称不能为空';
    if (value.length > 20) return '昵称不能超过20个字符';
    if (/[<>\"'&]/.test(value)) return '昵称包含非法字符';
    return true;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">编辑资料</h1>
          <p className="text-gray-600">管理您的个人信息、头像和封面图</p>
          {unsavedChanges && (
            <Alert severity="warning" className="mt-2">
              您有未保存的更改
            </Alert>
          )}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 个人形象 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                个人形象
              </Typography>
              
              <div className="space-y-6">
                {/* 头像上传 */}
                <div>
                  <Typography variant="body2" className="mb-2 font-medium">
                    头像
                  </Typography>
                  <div className="flex items-center space-x-4">
                    <div className="relative w-20 h-20 rounded-full border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                      {uploadState.avatar ? (
                        <img 
                          src={uploadState.avatar} 
                          alt={`${watchedValues.nickname || '用户'}的头像`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-xs text-center">
                          无头像
                        </div>
                      )}
                      {loading.avatar && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<IconUpload size={16} />}
                        onClick={handleAvatarUpload}
                        disabled={loading.avatar}
                      >
                        {loading.avatar ? '上传中...' : '上传头像'}
                      </Button>
                      <Typography variant="caption" className="block text-gray-500">
                        支持 JPG、PNG、WebP 格式，最大 5MB
                      </Typography>
                    </div>
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onAvatarChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* 背景图片上传 */}
                <div>
                  <Typography variant="body2" className="mb-2 font-medium">
                    个人主页背景
                  </Typography>
                  <div className="flex flex-col space-y-3">
                    <div className="relative w-full h-32 rounded-md border-2 border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
                      {uploadState.background ? (
                        <img 
                          src={uploadState.background} 
                          alt={`${watchedValues.nickname || '用户'}的主页背景`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <div>无背景图</div>
                          <div className="text-xs mt-1">推荐尺寸 1500×500</div>
                        </div>
                      )}
                      {loading.background && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <CircularProgress size={32} sx={{ color: 'white' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outlined" 
                        size="small"
                        startIcon={<IconUpload size={16} />}
                        onClick={handleBackgroundUpload}
                        disabled={loading.background}
                      >
                        {loading.background ? '上传中...' : '上传背景图'}
                      </Button>
                      {uploadState.background && (
                        <Button 
                          variant="text" 
                          size="small" 
                          color="error"
                          startIcon={<IconTrash size={16} />}
                          onClick={handleRemoveBackground}
                        >
                          移除背景图
                        </Button>
                      )}
                    </div>
                    <Typography variant="caption" className="text-gray-500">
                      推荐尺寸 1500×500 像素，支持 JPG、PNG、WebP 格式，最大 10MB
                    </Typography>
                  </div>
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onBackgroundChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* 基础信息 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                基础信息
              </Typography>
              
              <div className="space-y-4">
                <Controller
                  name="nickname"
                  control={control}
                  rules={{ 
                    required: '昵称不能为空',
                    validate: validateNickname
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="请输入昵称"
                      fullWidth
                      variant="outlined"
                      size="small"
                      error={!!errors.nickname}
                      helperText={errors.nickname?.message || "您的显示名称，其他用户将看到此名称"}
                      inputProps={{ maxLength: 20 }}
                    />
                  )}
                />
                
                <Controller
                  name="bio"
                  control={control}
                  rules={{
                    maxLength: { value: maxBioLength, message: `简介不能超过${maxBioLength}个字符` }
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      placeholder="介绍一下自己吧..."
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      error={!!errors.bio}
                      helperText={
                        errors.bio?.message || 
                        `简要介绍自己，让其他用户更好地了解您 (${bioLength}/${maxBioLength})`
                      }
                      inputProps={{ maxLength: maxBioLength }}
                      sx={{
                        '& .MuiInputBase-root': {
                          '& textarea': {
                            color: bioLength > maxBioLength ? 'error.main' : 'inherit'
                          }
                        }
                      }}
                    />
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* 个人资料 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                个人资料
              </Typography>
              
              <div className="space-y-4">
                {/* 性别选择 */}
                <div>
                  <Typography variant="body2" className="mb-2 font-medium">
                    性别 <Typography variant="caption" className="text-gray-500">(可选)</Typography>
                  </Typography>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel 
                          value="female" 
                          control={<Radio size="small" />} 
                          label="女" 
                        />
                        <FormControlLabel 
                          value="male" 
                          control={<Radio size="small" />} 
                          label="男" 
                        />
                        <FormControlLabel 
                          value="other" 
                          control={<Radio size="small" />} 
                          label="其他" 
                        />
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* 生日日历选择 */}
                <div>
                  <Typography variant="body2" className="mb-2 font-medium">
                    生日 <Typography variant="caption" className="text-gray-500">(可选)</Typography>
                  </Typography>
                  <Controller
                    name="birthDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        {...field}
                        format="YYYY年MM月DD日"
                        maxDate={dayjs().subtract(1, 'day')}
                        minDate={dayjs('1900-01-01')}
                        slotProps={{
                          textField: {
                            placeholder: '请选择生日',
                            size: 'small',
                            fullWidth: false,
                            style: { width: '200px' },
                            helperText: '点击选择您的生日'
                          },
                          actionBar: {
                            actions: ['clear', 'today', 'cancel', 'accept']
                          }
                        }}
                        views={['year', 'month', 'day']}
                      />
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 提交按钮 - 固定在页面底部 */}
          <Card className="sticky bottom-4 shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {unsavedChanges && (
                    <span className="flex items-center">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      有未保存的更改
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outlined" 
                    color="inherit"
                    onClick={handleCancel}
                    disabled={loading.save}
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    sx={{ backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' } }}
                    disabled={loading.save}
                    startIcon={loading.save ? <CircularProgress size={16} color="inherit" /> : <IconCheck size={16} />}
                  >
                    {loading.save ? '保存中...' : '保存更改'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        {/* 消息提示 */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            severity={snackbar.severity} 
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* 确认对话框 */}
        <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
              取消
            </Button>
            <Button onClick={confirmDialog.onConfirm} color="primary" variant="contained">
              确认
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </LocalizationProvider>
  );
} 