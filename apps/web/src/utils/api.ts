/**
 * API 请求封装模块
 */

import { debounce, isEmpty } from "lodash-es";
import { APP_CONFIG } from "../lib/config";

/**
 * API 请求基础配置
 */
const BASE_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: APP_CONFIG.requestTimeout,
};

/**
 * 通用 API 响应接口
 */
export interface ApiResponse<T = any> {
  message?: string;
  [key: string]: any;
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 创建带超时的 fetch 请求
 * @param url 请求地址
 * @param options fetch 配置
 * @param timeout 超时时间（毫秒）
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("请求超时，请稍后重试");
    }
    throw error;
  }
};

/**
 * 解析响应数据
 * @param response fetch 响应对象
 */
const parseResponse = async <T = any>(
  response: Response,
): Promise<ApiResponse<T>> => {
  try {
    const data = await response.json();
    return data as ApiResponse<T>;
  } catch {
    return {} as ApiResponse<T>;
  }
};

/**
 * 处理 API 错误
 * @param response fetch 响应对象
 * @param data 响应数据
 */
const handleError = async (
  response: Response,
  data: ApiResponse,
): Promise<never> => {
  const errorMessage = data.message || `请求失败 (${response.status})`;
  throw new ApiError(errorMessage, response.status, data);
};

/**
 * 基础请求函数
 * @param endpoint API 端点
 * @param options fetch 配置
 */
export const request = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${APP_CONFIG.apiBaseUrl}${endpoint}`;

  const response = await fetchWithTimeout(
    url,
    { ...BASE_CONFIG, ...options },
    BASE_CONFIG.timeout,
  );

  const data = await parseResponse<T>(response);

  if (!response.ok) {
    await handleError(response, data);
  }

  return data as T;
};

/**
 * GET 请求
 * @param endpoint API 端点
 */
export const get = <T = any>(endpoint: string): Promise<T> => {
  return request<T>(endpoint, { method: "GET" });
};

/**
 * POST 请求
 * @param endpoint API 端点
 * @param data 请求数据
 */
export const post = <T = any>(
  endpoint: string,
  data?: unknown,
): Promise<T> => {
  return request<T>(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT 请求
 * @param endpoint API 端点
 * @param data 请求数据
 */
export const put = <T = any>(
  endpoint: string,
  data?: unknown,
): Promise<T> => {
  return request<T>(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE 请求
 * @param endpoint API 端点
 */
export const del = <T = any>(endpoint: string): Promise<T> => {
  return request<T>(endpoint, { method: "DELETE" });
};

/**
 * 创建防抖 API 请求函数
 * @param apiFn API 函数
 * @param delay 延迟时间（毫秒）
 */
export const createDebouncedApi = <T extends (...args: any[]) => Promise<any>>(
  apiFn: T,
  delay: number,
): T => {
  return debounce(apiFn, delay) as T;
};
