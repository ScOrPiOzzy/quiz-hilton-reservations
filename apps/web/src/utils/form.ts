/**
 * 表单工具函数模块
 */

import { isEmpty } from "lodash-es";

/**
 * 表单错误类型
 */
export type FormErrors = Record<string, string | undefined>;

/**
 * 清除特定字段的错误
 * @param errors 错误对象
 * @param fieldName 字段名
 */
export const clearFieldError = (
  errors: FormErrors,
  fieldName: string,
): FormErrors => {
  if (errors[fieldName]) {
    return { ...errors, [fieldName]: undefined };
  }
  return errors;
};

/**
 * 检查表单是否有错误
 * @param errors 错误对象
 */
export const hasErrors = (errors: FormErrors): boolean => {
  return !isEmpty(
    Object.values(errors).filter((error) => error !== undefined),
  );
};

/**
 * 设置字段错误
 * @param errors 错误对象
 * @param fieldName 字段名
 * @param errorMessage 错误消息
 */
export const setFieldError = (
  errors: FormErrors,
  fieldName: string,
  errorMessage: string,
): FormErrors => {
  return { ...errors, [fieldName]: errorMessage };
};

/**
 * 合并错误对象
 * @param errors1 错误对象1
 * @param errors2 错误对象2
 */
export const mergeErrors = (
  errors1: FormErrors,
  errors2: FormErrors,
): FormErrors => {
  return { ...errors1, ...errors2 };
};

/**
 * 清除所有错误
 */
export const clearAllErrors = (): FormErrors => {
  return {};
};
