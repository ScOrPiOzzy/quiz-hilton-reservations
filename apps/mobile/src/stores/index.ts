/**
 * 状态管理 Store 导出
 * 统一导出所有 Zustand stores
 */

export { useUserStore } from './userStore';
export { useHotelStore } from './hotelStore';
export { useReservationStore } from './reservationStore';

// 导出类型
export type { UserStore } from './userStore';
export type { HotelStore } from './hotelStore';
export type { ReservationStore } from './reservationStore';
