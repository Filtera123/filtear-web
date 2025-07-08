// 登录模块API接口

import type {
  BaseApiResponse,
  CaptchaResponse,
  LoginResponse,
  GetCaptchaRequest,
  SendSmsRequest,
  SmsLoginRequest,
  PasswordLoginRequest,
} from './types';

// 模拟网络延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API基础路径
const API_BASE = '/api';

// 获取图形验证码
export const getCaptcha = async (
  params?: GetCaptchaRequest
): Promise<BaseApiResponse<CaptchaResponse>> => {
  await delay(500);
  
  // 模拟图形验证码（简单的base64图片）
  const mockCaptchaImg = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzMzMzMzMyI+MTIzNDU8L3RleHQ+PC9zdmc+';
  
  return {
    code: 0,
    message: '获取成功',
    data: {
      img: mockCaptchaImg,
      token: 'mock_captcha_token_' + Date.now(),
    },
  };
};

// 发送短信验证码
export const sendSms = async (
  params: SendSmsRequest
): Promise<BaseApiResponse> => {
  await delay(1000);
  
  // 模拟手机号验证
  const phoneRegex = /^\+86\d{11}$/;
  if (!phoneRegex.test(params.phone)) {
    return {
      code: 1001,
      message: '手机号格式不正确',
    };
  }
  
  // 开发阶段直接返回成功
  return {
    code: 0,
    message: '验证码发送成功',
  };
};

// 验证码登录
export const smsLogin = async (
  params: SmsLoginRequest
): Promise<BaseApiResponse<LoginResponse>> => {
  await delay(800);
  
  // 开发阶段固定验证码为 123456
  if (params.code !== '123456') {
    return {
      code: 1002,
      message: '验证码错误',
    };
  }
  
  // 生成模拟用户信息
  const userId = Math.floor(Math.random() * 10000) + 1;
  const phone = params.phone.replace('+86', '');
  
  return {
    code: 0,
    message: '登录成功',
    data: {
      token: `mock_token_${userId}_${Date.now()}`,
      userInfo: {
        userId,
        username: `user_${phone.slice(-4)}`,
        nickname: `用户${phone.slice(-4)}`,
        phone: params.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      },
      expiresIn: 7200, // 2小时
    },
  };
};

// 密码登录
export const passwordLogin = async (
  params: PasswordLoginRequest
): Promise<BaseApiResponse<LoginResponse>> => {
  await delay(800);
  
  // 开发阶段固定密码为 123456
  if (params.password !== '123456') {
    return {
      code: 1003,
      message: '密码错误',
    };
  }
  
  // 生成模拟用户信息
  const userId = Math.floor(Math.random() * 10000) + 1;
  const phone = params.phone.replace('+86', '');
  
  return {
    code: 0,
    message: '登录成功',
    data: {
      token: `mock_token_${userId}_${Date.now()}`,
      userInfo: {
        userId,
        username: `user_${phone.slice(-4)}`,
        nickname: `用户${phone.slice(-4)}`,
        phone: params.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      },
      expiresIn: 7200, // 2小时
    },
  };
};

// 检查登录状态
export const checkLoginStatus = async (): Promise<BaseApiResponse<{ isLogin: boolean }>> => {
  await delay(300);
  
  const token = localStorage.getItem('auth_token');
  
  return {
    code: 0,
    message: '检查成功',
    data: {
      isLogin: !!token,
    },
  };
};

// 退出登录
export const logout = async (): Promise<BaseApiResponse> => {
  await delay(300);
  
  // 清除本地存储
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_info');
  
  return {
    code: 0,
    message: '退出成功',
  };
}; 