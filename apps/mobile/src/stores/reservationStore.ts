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
  reservationDate: string;
  status: ReservationStatus;
  customer: Customer;
  timeSlot?: string;
  timeSlotName?: string;
  tableConfigId?: string;
  tableConfigName?: string;
  specialRequests?: string;
  estimatedArrivalTime?: string;
  hotelId?: string;
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
    const newReservation: Reservation = {
      id: `reservation-${Date.now()}`,
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
}));
