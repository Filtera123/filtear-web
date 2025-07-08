// 登录主组件

import React, { useState, useEffect } from 'react';
import './styles/login.css';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Tabs,
  Tab,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useLoginStore } from './store/loginStore';
import { LoginType } from './api/types';
import { Captcha } from './components/Captcha';
import { Agreement } from './components/Agreement';
import {
  validatePhone,
  validateCode,
  validatePassword,
  validateAgreement,
  formatPhoneNumber,
  cleanPhoneInput,
} from './utils/validate';

// 表单数据接口
interface FormData {
  phone: string;
  password: string;
  smsCode: string;
  captcha: string;
  agreed: boolean;
}

// 表单错误接口
interface FormErrors {
  phone?: string;
  password?: string;
  smsCode?: string;
  captcha?: string;
  agreed?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const {
    loginType,
    loading,
    countdown,
    setLoginType,
    sendSmsCode,
    smsLogin,
    passwordLogin,
    checkLoginStatus,
  } = useLoginStore();

  // 表单数据状态
  const [formData, setFormData] = useState<FormData>({
    phone: '',
    password: '',
    smsCode: '',
    captcha: '',
    agreed: false,
  });

  // 表单错误状态
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 通用错误消息
  const [alertMessage, setAlertMessage] = useState<string>('');

  // 显示图形验证码（在需要时）
  const [showCaptcha, setShowCaptcha] = useState(false);

  // 组件加载时检查登录状态
  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  // Tab切换处理
  const handleTabChange = (_: React.SyntheticEvent, newValue: LoginType) => {
    setLoginType(newValue);
    // 清空表单错误
    setErrors({});
    setAlertMessage('');
  };

  // 表单字段更新
  const updateFormData = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除对应字段的错误
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // 清除通用错误消息
    if (alertMessage) {
      setAlertMessage('');
    }
  };

  // 手机号输入处理
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleanedInput = cleanPhoneInput(input);
    
    // 限制只能输入11位数字
    if (cleanedInput.length <= 11) {
      const formattedPhone = formatPhoneNumber(cleanedInput);
      updateFormData('phone', formattedPhone);
    }
  };

  // 验证单个字段
  const validateField = (field: keyof FormData): boolean => {
    let validation;
    
    switch (field) {
      case 'phone':
        validation = validatePhone(formData.phone);
        break;
      case 'password':
        validation = validatePassword(formData.password);
        break;
      case 'smsCode':
        validation = validateCode(formData.smsCode);
        break;
      case 'agreed':
        validation = validateAgreement(formData.agreed);
        break;
      default:
        return true;
    }

    if (!validation.isValid) {
      setErrors(prev => ({ ...prev, [field]: validation.message }));
      return false;
    }

    return true;
  };

  // 验证整个表单
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // 验证手机号
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
      isValid = false;
    }

    // 根据登录类型验证相应字段
    if (loginType === LoginType.SMS) {
      const codeValidation = validateCode(formData.smsCode);
      if (!codeValidation.isValid) {
        newErrors.smsCode = codeValidation.message;
        isValid = false;
      }
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
        isValid = false;
      }
    }

    // 验证协议勾选
    const agreementValidation = validateAgreement(formData.agreed);
    if (!agreementValidation.isValid) {
      newErrors.agreed = agreementValidation.message;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 发送验证码
  const handleSendSmsCode = async () => {
    // 验证手机号
    if (!validateField('phone')) {
      return;
    }

    // 如果需要图形验证码但未输入，显示图形验证码
    if (showCaptcha && !formData.captcha) {
      setShowCaptcha(true);
      return;
    }

    const success = await sendSmsCode(formData.phone, formData.captcha);
    if (success) {
      setAlertMessage('验证码发送成功！');
      // 如果有图形验证码，发送成功后隐藏
      if (showCaptcha) {
        setShowCaptcha(false);
        updateFormData('captcha', '');
      }
    } else {
      setAlertMessage('验证码发送失败，请重试');
    }
  };

  // 登录处理
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    let success = false;
    
    try {
      if (loginType === LoginType.SMS) {
        success = await smsLogin(formData.phone, formData.smsCode);
      } else {
        success = await passwordLogin(formData.phone, formData.password);
      }

      if (success) {
        setAlertMessage('登录成功！正在跳转...');
        setTimeout(() => {
          navigate('/'); // 跳转到首页
        }, 1000);
      } else {
        setAlertMessage(loginType === LoginType.SMS ? '验证码错误' : '密码错误');
      }
    } catch (error) {
      setAlertMessage('网络请求失败，请稍后重试');
    }
  };

  // 是否可以提交表单
  const canSubmit = () => {
    const hasPhone = !!formData.phone;
    const hasCredential = loginType === LoginType.SMS 
      ? !!formData.smsCode 
      : !!formData.password;
    const hasAgreed = formData.agreed;
    
    return hasPhone && hasCredential && hasAgreed && !loading;
  };

  return (
    <Box className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-lg rounded-lg">
        <CardContent className="p-8">
          {/* 标题 */}
          <Typography variant="h4" className="text-center mb-8 font-bold text-gray-800">
            登录
          </Typography>

          {/* Tab切换 */}
          <Tabs
            value={loginType}
            onChange={handleTabChange}
            variant="fullWidth"
            className="mb-8"
            sx={{
              '& .MuiTab-root': {
                fontSize: '14px',
                fontWeight: 500,
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#8b5cf6',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#8b5cf6',
                height: '2px',
              },
            }}
          >
            <Tab label="验证码登录" value={LoginType.SMS} />
            <Tab label="密码登录" value={LoginType.PASSWORD} />
          </Tabs>

          {/* 错误/成功消息 */}
          {alertMessage && (
            <Alert 
              severity={alertMessage.includes('成功') ? 'success' : 'error'} 
              className="mb-6"
              onClose={() => setAlertMessage('')}
            >
              {alertMessage}
            </Alert>
          )}

          <form className="space-y-6">
            {/* 手机号输入 */}
            <TextField
              fullWidth
              label="手机号"
              placeholder="请输入手机号"
              value={formData.phone}
              onChange={handlePhoneChange}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#8b5cf6',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8b5cf6',
                },
              }}
            />

            {/* 验证码登录表单 */}
            {loginType === LoginType.SMS && (
              <>
                {/* 图形验证码（可选显示） */}
                {showCaptcha && (
                  <Captcha
                    value={formData.captcha}
                    onChange={(value) => updateFormData('captcha', value)}
                    required
                  />
                )}

                                 {/* 短信验证码 */}
                 <Box className="flex space-x-2">
                   <TextField
                     label="验证码"
                     placeholder="请输入6位验证码"
                     value={formData.smsCode}
                     onChange={(e) => updateFormData('smsCode', e.target.value)}
                     error={!!errors.smsCode}
                     helperText={errors.smsCode}
                     disabled={loading}
                     sx={{
                       flex: 1,
                       '& .MuiOutlinedInput-root': {
                         '&.Mui-focused fieldset': {
                           borderColor: '#8b5cf6',
                         },
                       },
                       '& .MuiInputLabel-root.Mui-focused': {
                         color: '#8b5cf6',
                       },
                     }}
                   />
                  <Button
                    variant="contained"
                    onClick={handleSendSmsCode}
                    disabled={loading || countdown.isRunning}
                    sx={{
                      minWidth: '120px',
                      backgroundColor: countdown.isRunning ? '#e6e6e6' : '#8b5cf6',
                      color: countdown.isRunning ? '#999' : 'white',
                      '&:hover': {
                        backgroundColor: countdown.isRunning ? '#e6e6e6' : '#7c3aed',
                      },
                      '&:disabled': {
                        backgroundColor: '#e6e6e6',
                        color: '#999',
                      },
                    }}
                  >
                    {countdown.isRunning 
                      ? `${countdown.remainingTime}s` 
                      : '获取验证码'
                    }
                  </Button>
                </Box>
              </>
            )}

            {/* 密码登录表单 */}
            {loginType === LoginType.PASSWORD && (
              <TextField
                fullWidth
                type="password"
                label="密码"
                placeholder="请输入密码"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#8b5cf6',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8b5cf6',
                  },
                }}
              />
            )}

            {/* 用户协议 */}
            <Agreement
              checked={formData.agreed}
              onChange={(checked) => updateFormData('agreed', checked)}
              error={errors.agreed}
            />

            {/* 登录按钮 */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleLogin}
              disabled={!canSubmit()}
              sx={{
                height: '44px',
                backgroundColor: canSubmit() ? '#8b5cf6' : '#e6e6e6',
                color: canSubmit() ? 'white' : '#999',
                '&:hover': {
                  backgroundColor: canSubmit() ? '#7c3aed' : '#e6e6e6',
                },
                '&:disabled': {
                  backgroundColor: '#e6e6e6',
                  color: '#999',
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                loginType === LoginType.SMS ? '登录/注册' : '登录'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login; 