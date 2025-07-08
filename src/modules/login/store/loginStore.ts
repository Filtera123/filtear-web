// 登录状态管理 Store

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserInfo, CountdownState } from '../api/types';
import { LoginType } from '../api/types';
import * as loginApi from '../api';

// Store 状态接口
interface LoginState {
  // 用户信息
  userInfo: UserInfo | null;
  token: string | null;
  isLogin: boolean;
  
  // 登录表单状态
  loading: boolean;
  loginType: LoginType;
  
  // 图形验证码状态
  captchaImg: string | null;
  captchaToken: string | null;
  
  // 短信验证码倒计时状态
  countdown: CountdownState;
  
  // Actions
  setLoginType: (type: LoginType) => void;
  setLoading: (loading: boolean) => void;
  
  // 图形验证码相关
  getCaptcha: () => Promise<void>;
  refreshCaptcha: () => Promise<void>;
  
  // 短信验证码相关
  sendSmsCode: (phone: string, captcha?: string) => Promise<boolean>;
  startCountdown: () => void;
  stopCountdown: () => void;
  
  // 登录相关
  smsLogin: (phone: string, code: string) => Promise<boolean>;
  passwordLogin: (phone: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // 初始化检查登录状态
  checkLoginStatus: () => Promise<void>;
  
  // 重置状态
  reset: () => void;
}

// 初始状态
const initialState = {
  userInfo: null,
  token: null,
  isLogin: false,
  loading: false,
  loginType: LoginType.SMS,
  captchaImg: null,
  captchaToken: null,
  countdown: {
    isRunning: false,
    remainingTime: 0,
  },
};

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setLoginType: (type: LoginType) => {
        set({ loginType: type });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      // 获取图形验证码
      getCaptcha: async () => {
        try {
          const response = await loginApi.getCaptcha();
          if (response.code === 0 && response.data) {
            set({
              captchaImg: response.data.img,
              captchaToken: response.data.token,
            });
          }
        } catch (error) {
          console.error('获取图形验证码失败:', error);
        }
      },

      // 刷新图形验证码
      refreshCaptcha: async () => {
        await get().getCaptcha();
      },

      // 发送短信验证码
      sendSmsCode: async (phone: string, captcha?: string) => {
        try {
          set({ loading: true });
          
          const response = await loginApi.sendSms({
            phone,
            captcha,
            token: get().captchaToken || undefined,
          });

          if (response.code === 0) {
            get().startCountdown();
            return true;
          } else {
            console.error('发送短信验证码失败:', response.message);
            return false;
          }
        } catch (error) {
          console.error('发送短信验证码失败:', error);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 开始倒计时
      startCountdown: () => {
        const duration = 60; // 60秒倒计时
        set({
          countdown: {
            isRunning: true,
            remainingTime: duration,
          },
        });

        const timer = setInterval(() => {
          const currentState = get();
          const newTime = currentState.countdown.remainingTime - 1;

          if (newTime <= 0) {
            clearInterval(timer);
            set({
              countdown: {
                isRunning: false,
                remainingTime: 0,
              },
            });
          } else {
            set({
              countdown: {
                ...currentState.countdown,
                remainingTime: newTime,
              },
            });
          }
        }, 1000);
      },

      // 停止倒计时
      stopCountdown: () => {
        set({
          countdown: {
            isRunning: false,
            remainingTime: 0,
          },
        });
      },

      // 验证码登录
      smsLogin: async (phone: string, code: string) => {
        try {
          set({ loading: true });

          const response = await loginApi.smsLogin({ phone, code });

          if (response.code === 0 && response.data) {
            const { token, userInfo } = response.data;
            
            // 保存到localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_info', JSON.stringify(userInfo));

            // 更新状态
            set({
              token,
              userInfo,
              isLogin: true,
            });

            return true;
          } else {
            console.error('登录失败:', response.message);
            return false;
          }
        } catch (error) {
          console.error('登录失败:', error);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 密码登录
      passwordLogin: async (phone: string, password: string) => {
        try {
          set({ loading: true });

          const response = await loginApi.passwordLogin({ phone, password });

          if (response.code === 0 && response.data) {
            const { token, userInfo } = response.data;
            
            // 保存到localStorage
            localStorage.setItem('auth_token', token);
            localStorage.setItem('user_info', JSON.stringify(userInfo));

            // 更新状态
            set({
              token,
              userInfo,
              isLogin: true,
            });

            return true;
          } else {
            console.error('登录失败:', response.message);
            return false;
          }
        } catch (error) {
          console.error('登录失败:', error);
          return false;
        } finally {
          set({ loading: false });
        }
      },

      // 退出登录
      logout: async () => {
        try {
          await loginApi.logout();
        } catch (error) {
          console.error('退出登录失败:', error);
        }

        // 清除状态
        set({
          userInfo: null,
          token: null,
          isLogin: false,
        });
      },

      // 检查登录状态
      checkLoginStatus: async () => {
        try {
          const token = localStorage.getItem('auth_token');
          const userInfoStr = localStorage.getItem('user_info');

          if (token && userInfoStr) {
            try {
              const userInfo = JSON.parse(userInfoStr);
              set({
                token,
                userInfo,
                isLogin: true,
              });
            } catch (error) {
              console.error('解析用户信息失败:', error);
              // 清除无效的本地存储
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_info');
            }
          }
        } catch (error) {
          console.error('检查登录状态失败:', error);
        }
      },

      // 重置状态
      reset: () => {
        set({
          ...initialState,
          countdown: {
            isRunning: false,
            remainingTime: 0,
          },
        });
      },
    }),
    {
      name: 'login-storage',
      // 只持久化必要的状态
      partialize: (state) => ({
        userInfo: state.userInfo,
        token: state.token,
        isLogin: state.isLogin,
        loginType: state.loginType,
      }),
    }
  )
); 