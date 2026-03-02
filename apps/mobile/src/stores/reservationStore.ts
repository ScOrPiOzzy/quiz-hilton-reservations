import { create } from 'zustand';
import type { Restaurant } from './hotelStore';

/**
 * 预约状态枚举
 */
export enum ReservationStatus {
  REQUESTED = 'REQUESTED',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  APPROVED = 'APPROVED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * 客户信息接口
 */
export interface Customer {
  name: string;
  phone: string;
  email?: string;
}

/**
 * 预约信息接口
 */
export interface Reservation {
  id?: string;
  userId?: string;
  storeId?: string;
  storeName?: string;
  restaurantName?: string; // 餐厅名称
  reservationDate: string;
  date?: string; // 日期别名
  status: ReservationStatus;
  customer: Customer;
  name?: string; // 客户姓名别名
  phone?: string; // 客户电话别名
  timeSlot?: string;
  timeSlotName?: string;
  tableConfigId?: string;
  tableConfigName?: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  hotelId?: string;
  hotelName?: string; // 酒店名称
  hotel?: {
    id?: string;
    name?: string;
  };
  restaurantId?: string;
  restaurant?: Restaurant;
  areaId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 创建预约输入接口
 */
export interface CreateReservationInput {
  hotelId?: string;
  restaurantId?: string;
  areaId?: string;
  reservationDate: string;
  timeSlot?: string;
  tableConfigId?: string;
  customer: Customer;
  specialRequests?: string;
  estimatedArrivalTime?: string;
}

/**
 * 预约状态 Store 接口
 */
export interface ReservationStore {
  // 状态
  reservations: Reservation[];
  loading: boolean;
  error: string | null;

  // Actions
  setReservations: (reservations: Reservation[]) => void;
  addReservation: (reservation: Reservation) => void;
  createReservation: (input: CreateReservationInput) => Reservation;
  updateReservation: (id: string, updates: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
  getReservationsByStatus: (status: ReservationStatus) => Reservation[];
  getReservationsByHotel: (hotelId: string) => Reservation[];
  getReservationsByRestaurant: (restaurantId: string) => Reservation[];
}

/**
 * 预约状态 Store
 * 管理预约数据和创建预约的方法
 */
export const useReservationStore = create<ReservationStore>((set, get) => ({
  // 初始状态
  reservations: [],
  loading: false,
  error: null,

  // 设置预约列表（替换）
  setReservations: (reservations) => set({ reservations }),

  // 添加单个预约
  addReservation: (reservation) =>
    set((state) => ({
      reservations: [...state.reservations, reservation],
    })),

  // 创建预约
  createReservation: (input) => {
    // 使用更安全的 ID 生成策略：组合时间戳和随机字符串
    const generateId = () => {
      const timestamp = Date.now();
      const randomPart = Math.random().toString(36).substring(2, 11);
      return `reservation-${timestamp}-${randomPart}`;
    };

    const newReservation: Reservation = {
      id: generateId(),
      ...input,
      status: ReservationStatus.REQUESTED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 添加到状态中
    set((state) => ({
      reservations: [...state.reservations, newReservation],
    }));

    return newReservation;
  },

  // 更新预约
  updateReservation: (id, updates) =>
    set((state) => ({
      reservations: state.reservations.map((res) =>
        res.id === id
          ? { ...res, ...updates, updatedAt: new Date().toISOString() }
          : res
      ),
    })),

  // 删除预约
  deleteReservation: (id) =>
    set((state) => ({
      reservations: state.reservations.filter((res) => res.id !== id),
    })),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 设置错误信息
  setError: (error) => set({ error }),

  // 清除错误信息
  clearError: () => set({ error: null }),

  // 根据状态筛选预约
  getReservationsByStatus: (status) => {
    const { reservations } = get();
    return reservations.filter((res) => res.status === status);
  },

  // 根据酒店筛选预约
  getReservationsByHotel: (hotelId) => {
    const { reservations } = get();
    return reservations.filter((res) => res.hotelId === hotelId);
  },

  // 根据餐厅筛选预约
  getReservationsByRestaurant: (restaurantId) => {
    const { reservations } = get();
    return reservations.filter((res) => res.restaurantId === restaurantId);
  },

  // 重置所有状态
  reset: () =>
    set({
      reservations: [],
      loading: false,
      error: null,
    }),
}));
