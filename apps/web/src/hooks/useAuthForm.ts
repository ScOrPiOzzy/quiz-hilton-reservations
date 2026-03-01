/**
 * 认证表单 Hook
 */

import { createSignal } from "solid-js";
import { createDebouncedApi } from "../utils/api";
import { hasErrors } from "../utils/form";
import type { FormErrors } from "../utils/form";
import { APP_CONFIG } from "../lib/config";

/**
 * 登录请求接口
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * 注册请求接口
 */
export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: string;
}

/**
 * 注册响应接口
 */
export interface RegisterResponse {
  token: string;
  user: LoginResponse["user"];
}

/**
 * 认证表单 Hook 参数
 */
export interface UseAuthFormParams {
  onSuccess?: (data: LoginResponse | RegisterResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * 认证表单 Hook
 * @param apiEndpoint API 端点
 * @param params 参数
 */
export const useAuthForm = <TRequest = any, TResponse = any>(
  apiEndpoint: string,
  params?: UseAuthFormParams,
) => {
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [errors, setErrors] = createSignal<FormErrors>({});

  /**
   * 执行 API 请求
   * @param data 请求数据
   */
  const performRequest = async (data: TRequest): Promise<void> => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${APP_CONFIG.apiBaseUrl}${apiEndpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData: TResponse = await response.json();

      if (!response.ok) {
        const errorData = responseData as any;
        throw new Error(errorData.message || "操作失败，请稍后重试");
      }

      params?.onSuccess?.(responseData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "操作失败，请稍后重试";
      setError(errorMessage);
      params?.onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setLoading(false);
    }
  };

  /**
   * 创建防抖请求函数
   */
  const debouncedRequest = createDebouncedApi(performRequest, 300);

  /**
   * 表单提交处理
   * @param data 请求数据
   * @param validationFn 验证函数
   */
  const handleSubmit = (data: TRequest, validationFn: () => boolean): void => {
    setError("");

    if (!validationFn()) {
      return;
    }

    debouncedRequest(data);
  };

  /**
   * 设置单个字段错误
   */
  const setFieldError = (fieldName: string, errorMessage?: string): void => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: errorMessage,
    }));
  };

  /**
   * 清除单个字段错误
   */
  const clearFieldError = (fieldName: string): void => {
    setErrors((prev) => {
      if (prev[fieldName]) {
        return { ...prev, [fieldName]: undefined };
      }
      return prev;
    });
  };

  /**
   * 检查是否有错误
   */
  const hasFormErrors = (): boolean => {
    return hasErrors(errors());
  };

  return {
    loading,
    error,
    errors,
    setErrors,
    setError,
    setFieldError,
    clearFieldError,
    hasFormErrors,
    handleSubmit,
  };
};
