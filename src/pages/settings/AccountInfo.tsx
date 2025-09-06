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
import { IconUpload, IconTrash, IconCheck } from '@tabler/icons-react';
import { ImageCropModal } from '../../components/ImageCropModal';
import { API_CONFIG, apiRequest } from '../../config/api';

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
  const [cropModal, setCropModal] = useState({
    open: false,
    file: null as File | null,
    type: 'avatar' as 'avatar' | 'background'
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

  // 文件选择处理 - 打开裁剪弹窗
  const handleFileSelect = (file: File, type: 'avatar' | 'background') => {
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

    // 打开裁剪弹窗
    setCropModal({
      open: true,
      file: file,
      type: type
    });
  };

  // 裁剪完成后上传
  const handleCropComplete = async (croppedFile: File) => {
    setCropModal({ open: false, file: null, type: 'avatar' });
    const type = cropModal.type;
    
    setLoading(prev => ({ ...prev, [type]: true }));

    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('file', croppedFile);

      // 使用配置文件中的API地址
      const response = await apiRequest(API_CONFIG.ENDPOINTS.FILE_UPLOAD, {
        method: 'POST',
        body: formData,
        // 注意：上传文件时不要设置Content-Type，让浏览器自动设置
        headers: {}, 
      });

      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        // 使用OSS key生成预览URL
        const previewUrl = `https://your-oss-domain.com${result.data}`;
        setUploadState(prev => ({ ...prev, [type]: previewUrl }));
        showSnackbar(type === 'avatar' ? '头像上传成功' : '背景图上传成功', 'success');
        setUnsavedChanges(true);
        
        console.log('✅ 上传成功:', {
          type,
          ossKey: result.data,
          fileSize: croppedFile.size
        });
      } else {
        throw new Error(result.message || '上传失败');
      }
    } catch (error) {
      console.error('💥 上传失败:', error);
      const errorMsg = error instanceof Error ? error.message : '上传失败，请重试';
      showSnackbar(errorMsg, 'error');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  // 取消裁剪
  const handleCropCancel = () => {
    setCropModal({ open: false, file: null, type: 'avatar' });
  };

  // 头像上传
  const handleAvatarUpload = () => {
    avatarInputRef.current?.click();
  };

  const onAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file, 'avatar');
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
      handleFileSelect(file, 'background');
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
          {/* 个人信息 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 mb-6">
                个人信息
              </Typography>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* 头像上传区域 - 居中 */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-100 overflow-hidden bg-gray-50 flex items-center justify-center">
                      {uploadState.avatar ? (
                        <img 
                          src={uploadState.avatar} 
                          alt={`${watchedValues.nickname || '用户'}的头像`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-400 text-center">
                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <div className="text-sm">无头像</div>
                        </div>
                      )}
                    </div>
                    {loading.avatar && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <CircularProgress size={32} sx={{ color: 'white' }} />
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="contained"
                    startIcon={<IconUpload size={16} />}
                    onClick={handleAvatarUpload}
                    disabled={loading.avatar}
                    sx={{
                      backgroundColor: '#7E44C6',
                      '&:hover': { backgroundColor: '#6D38B1' },
                      mb: 2
                    }}
                  >
                    {loading.avatar ? '上传中...' : '上传头像'}
                  </Button>
                  <Typography variant="caption" className="text-gray-500 text-center">
                    支持 JPG、PNG、WebP<br/>最大 5MB
                  </Typography>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={onAvatarChange}
                    style={{ display: 'none' }}
                  />
                </div>

                {/* 昵称和个人简介 */}
                <div className="flex-1 space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">用户昵称</label>
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
                        placeholder="用户昵称"
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors.nickname}
                        helperText={errors.nickname?.message || "您的显示名称，其他用户将看到此名称"}
                        inputProps={{ maxLength: 20 }}
                        />
                      )}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">个人简介</label>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 背景图片 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 mb-6">
                个人主页背景
              </Typography>
              
              <div className="flex items-center space-x-6">
                <div className="relative w-48 h-24 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                  {uploadState.background ? (
                    <img 
                      src={uploadState.background} 
                      alt={`${watchedValues.nickname || '用户'}的主页背景`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500 text-center">
                      <svg className="w-8 h-8 mx-auto mb-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-xs">无背景图</div>
                    </div>
                  )}
                  {loading.background && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex space-x-3">
                    <Button 
                      variant="contained"
                      startIcon={<IconUpload size={16} />}
                      onClick={handleBackgroundUpload}
                      disabled={loading.background}
                      sx={{
                        backgroundColor: '#7E44C6',
                        '&:hover': { backgroundColor: '#6D38B1' }
                      }}
                    >
                      {loading.background ? '上传中...' : '上传背景图'}
                    </Button>
                    {uploadState.background && (
                      <Button 
                        variant="outlined"
                        color="error"
                        startIcon={<IconTrash size={16} />}
                        onClick={handleRemoveBackground}
                      >
                        删除背景图
                      </Button>
                    )}
                  </div>
                  <Typography variant="body2" className="text-gray-600">
                    推荐尺寸 1500×500 像素，支持 JPG、PNG、WebP 格式，最大 10MB
                  </Typography>
                </div>
              </div>
              
              <input
                ref={backgroundInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={onBackgroundChange}
                style={{ display: 'none' }}
              />
            </CardContent>
          </Card>

          {/* 其他资料 */}
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-bold text-gray-900 mb-6">
                其他资料
              </Typography>
              
              <div className="space-y-6">
                {/* 性别选择 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    性别 <span className="text-gray-500 font-normal">(可选)</span>
                  </label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row sx={{ gap: 2 }}>
                        <FormControlLabel 
                          value="female" 
                          control={<Radio sx={{ color: '#7E44C6', '&.Mui-checked': { color: '#7E44C6' } }} />} 
                          label="女"
                          sx={{
                            backgroundColor: field.value === 'female' ? '#F3E8FF' : 'transparent',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            margin: 0,
                            transition: 'all 0.2s'
                          }}
                        />
                        <FormControlLabel 
                          value="male" 
                          control={<Radio sx={{ color: '#7E44C6', '&.Mui-checked': { color: '#7E44C6' } }} />} 
                          label="男"
                          sx={{
                            backgroundColor: field.value === 'male' ? '#F3E8FF' : 'transparent',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            margin: 0,
                            transition: 'all 0.2s'
                          }}
                        />
                        <FormControlLabel 
                          value="other" 
                          control={<Radio sx={{ color: '#7E44C6', '&.Mui-checked': { color: '#7E44C6' } }} />} 
                          label="其他"
                          sx={{
                            backgroundColor: field.value === 'other' ? '#F3E8FF' : 'transparent',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            margin: 0,
                            transition: 'all 0.2s'
                          }}
                        />
                      </RadioGroup>
                    )}
                  />
                </div>

                {/* 生日日历选择 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    生日 <span className="text-gray-500 font-normal">(可选)</span>
                  </label>
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
                            fullWidth: false,
                            style: { width: '250px' },
                            helperText: '点击选择您的生日',
                            sx: {}
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

          {/* 提交按钮 */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {unsavedChanges && (
                    <span className="text-orange-600">
                      有未保存的更改
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <Button 
                    variant="outlined" 
                    onClick={handleCancel}
                    disabled={loading.save}
                  >
                    取消
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    disabled={loading.save}
                    startIcon={loading.save ? <CircularProgress size={16} color="inherit" /> : <IconCheck size={16} />}
                    sx={{
                      backgroundColor: '#7E44C6',
                      '&:hover': { backgroundColor: '#6D38B1' }
                    }}
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
        <Dialog 
          open={confirmDialog.open} 
          onClose={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
        >
          <DialogTitle>{confirmDialog.title}</DialogTitle>
          <DialogContent>
            <Typography>{confirmDialog.message}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialog(prev => ({ ...prev, open: false }))}>
              取消
            </Button>
            <Button 
              onClick={confirmDialog.onConfirm} 
              variant="contained"
              sx={{
                backgroundColor: '#7E44C6',
                '&:hover': { backgroundColor: '#6D38B1' }
              }}
            >
              确认
            </Button>
          </DialogActions>
        </Dialog>

        {/* 裁剪弹窗 */}
        <ImageCropModal
          open={cropModal.open}
          imageFile={cropModal.file}
          cropType={cropModal.type}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
    </div>
    </LocalizationProvider>
  );
} 