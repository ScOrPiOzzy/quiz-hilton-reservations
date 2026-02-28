/**
 * 用户角色枚举
 * 与 apps/api 保持一致
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
}

/**
 * 用户接口
 * 与 apps/api 保持一致
 */
export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 获取角色显示名称
 */
export function getRoleLabel(role: UserRole): string {
  switch (role) {
    case UserRole.ADMIN:
      return 'Admin';
    case UserRole.STAFF:
      return 'Staff';
    case UserRole.CUSTOMER:
      return 'Customer';
    default:
      return 'Unknown';
  }
}
