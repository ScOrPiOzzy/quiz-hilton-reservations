/**
 * 验证工具函数模块
 */

/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效的邮箱格式
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否为有效的中国大陆手机号格式
 */
export const isValidPhone = (phone: string): boolean => {
  return /^1[3-9]\d{9}$/.test(phone);
};

/**
 * 验证密码强度
 * 要求：8-32位，包含大小写字母和至少一个数字或特殊字符
 * @param password 密码
 * @returns 是否符合密码强度要求
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=(.*\d|.*[@$!%*?&]))[a-zA-Z\d@$!%*?&]{8,32}$/;
  return passwordRegex.test(password);
};
