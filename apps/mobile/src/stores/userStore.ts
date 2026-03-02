import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Taro from '@tarojs/taro';

/**
 * 用户信息接口
 */
export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
}

/**
 * 用户状态 Store 接口
 */
export interface UserStore {
  // 状态
  user: User | null;
  token: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;

  // 业务方法
  login: (phone: string, code: string) => Promise<void>;
  loginWithPassword: (phone: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

/**
 * 用户状态 Store
 * 使用 persist 中间件将 user 和 token 持久化到本地存储
 */
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      token: null,

      // 设置用户信息
      setUser: (user) => set({ user }),

      // 设置 token
      setToken: (token) => set({ token }),

      // 同时设置用户和 token
      setAuth: (user, token) => set({ user, token }),

      // 清除认证信息
      clearAuth: () => set({ user: null, token: null }),

      // 检查是否已认证
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      },

      // 登录（验证码方式）
      login: async (phone, code) => {
        // Mock 登录 - 实际应该调用 API
        const mockUser: User = {
          id: 'user-123',
          firstName: '张',
          lastName: '三',
          email: 'zhangsan@example.com',
          phone,
        };
        const mockToken = `mock-token-${Date.now()}`;
        get().setAuth(mockUser, mockToken);
      },

      // 登录（密码方式）
      loginWithPassword: async (phone, password) => {
        // Mock 登录 - 实际应该调用 API
        const mockUser: User = {
          id: 'user-123',
          firstName: '张',
          lastName: '三',
          email: 'zhangsan@example.com',
          phone,
        };
        const mockToken = `mock-token-${Date.now()}`;
        get().setAuth(mockUser, mockToken);
      },

      // 登出
      logout: () => {
        get().clearAuth();
        Taro.switchTab({ url: '/pages/index/index' });
      },

      // 更新个人信息
      updateProfile: async (updates) => {
        const { user } = get();
        if (!user) {
          throw new Error('用户未登录');
        }
        // Mock 更新 - 实际应该调用 API
        const updatedUser = { ...user, ...updates };
        get().setUser(updatedUser);
      },
    }),
    {
      // 配置 persist 中间件
      name: 'user-storage', // localStorage 中的 key
      // 只持久化指定的字段
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
