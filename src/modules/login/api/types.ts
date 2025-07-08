// 登录模块API类型定义

// 基础API响应类型
export interface BaseApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 用户信息类型
export interface UserInfo {
  userId: number;
  username: string;
  nickname: string;
  phone: string;
  avatar?: string;
}

// 图形验证码响应
export interface CaptchaResponse {
  img: string; // base64图片
  token: string; // 验证码令牌
}

// 登录响应
export interface LoginResponse {
  token: string;
  userInfo: UserInfo;
  expiresIn: number; // token过期时间（秒）
}

// 获取图形验证码请求
export interface GetCaptchaRequest {
  // 无参数
}

// 发送短信验证码请求
export interface SendSmsRequest {
  phone: string;
  captcha?: string; // 图形验证码
  token?: string; // 验证码令牌
}

// 验证码登录请求
export interface SmsLoginRequest {
  phone: string;
  code: string;
}

// 密码登录请求
export interface PasswordLoginRequest {
  phone: string;
  password: string;
}

// 登录方式枚举
export enum LoginType {
  SMS = 'sms',
  PASSWORD = 'password'
}

// 表单数据类型
export interface LoginFormData {
  phone: string;
  password?: string;
  smsCode?: string;
  captcha?: string;
  agreed: boolean;
  loginType: LoginType;
}

// 倒计时状态
export interface CountdownState {
  isRunning: boolean;
  remainingTime: number;
} 