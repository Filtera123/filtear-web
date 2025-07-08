// 图形验证码组件

import React, { useEffect, useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { IconRefresh } from '@tabler/icons-react';
import { useLoginStore } from '../store/loginStore';
import { validateCaptcha } from '../utils/validate';

interface CaptchaProps {
  value: string;
  onChange: (value: string) => void;
  onValidate?: (isValid: boolean) => void;
  required?: boolean;
}

export const Captcha: React.FC<CaptchaProps> = ({
  value,
  onChange,
  onValidate,
  required = false,
}) => {
  const { captchaImg, getCaptcha, refreshCaptcha, loading } = useLoginStore();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // 组件加载时获取验证码
  useEffect(() => {
    if (!captchaImg) {
      getCaptcha();
    }
  }, [captchaImg, getCaptcha]);

  // 刷新验证码
  const handleRefresh = async () => {
    setIsLoading(true);
    await refreshCaptcha();
    setIsLoading(false);
    // 清空输入
    onChange('');
    setError('');
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // 验证输入
    const validation = validateCaptcha(newValue);
    if (!validation.isValid && newValue.length > 0) {
      setError(validation.message || '');
    } else {
      setError('');
    }

    // 通知父组件验证结果
    if (onValidate) {
      onValidate(validation.isValid);
    }
  };

  // 处理图片点击（刷新验证码）
  const handleImageClick = () => {
    if (!isLoading) {
      handleRefresh();
    }
  };

  return (
    <Box className="space-y-3">
      <Typography variant="body2" className="text-gray-600">
        请输入图形验证码{required && <span className="text-red-500">*</span>}
      </Typography>
      
      <Box className="flex items-center space-x-3">
        {/* 验证码图片 */}
        <Box 
          className="relative cursor-pointer border border-gray-300 rounded-md overflow-hidden bg-gray-100 min-w-[100px] h-[40px] flex items-center justify-center"
          onClick={handleImageClick}
        >
          {captchaImg ? (
            <img
              src={captchaImg}
              alt="验证码"
              className="w-full h-full object-cover"
            />
          ) : (
            <Typography variant="caption" className="text-gray-500">
              加载中...
            </Typography>
          )}
          
          {/* 加载中遮罩 */}
          {isLoading && (
            <Box className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <CircularProgress size={16} className="text-white" />
            </Box>
          )}
        </Box>

        {/* 刷新按钮 */}
        <Button
          variant="outlined"
          size="small"
          onClick={handleRefresh}
          disabled={isLoading}
          startIcon={<IconRefresh size={16} />}
          className="min-w-0 px-2"
        >
          刷新
        </Button>
      </Box>

      {/* 输入框 */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="请输入图形验证码"
        value={value}
        onChange={handleInputChange}
        error={!!error}
        helperText={error}
        disabled={loading}
        size="medium"
        inputProps={{
          maxLength: 10,
          style: { height: '16px' },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#00cc99',
            },
          },
        }}
      />

      {/* 提示文字 */}
      <Typography variant="caption" className="text-gray-500">
        点击图片可刷新验证码
      </Typography>
    </Box>
  );
}; 