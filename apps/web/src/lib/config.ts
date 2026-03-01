/**
 * 环境配置模块
 */

/**
 * API 基础 URL 配置
 * 开发环境默认使用 localhost:3000
 * 生产环境应通过环境变量配置
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

/**
 * 环境类型
 */
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

/**
 * 应用配置
 */
export const APP_CONFIG = {
  apiBaseUrl: API_BASE_URL,
  requestTimeout: 30_000, // 30秒
  isDevelopment,
  isProduction,
} as const;
