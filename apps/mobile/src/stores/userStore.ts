import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginResponse } from '@repo/schemas';

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
  setAuth: (data: LoginResponse) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
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
      setAuth: (data) => set({ user: data.user, token: data.token }),

      // 清除认证信息
      clearAuth: () => set({ user: null, token: null }),

      // 检查是否已认证
      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
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
