import { create } from 'zustand';

/**
 * 图片类型接口
 */
export interface Image {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

/**
 * 酒店类型接口
 */
export interface Hotel {
  id?: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  status?: string;
  images?: Image[];
  restaurants?: Restaurant[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 餐厅类型接口
 */
export interface Restaurant {
  id?: string;
  hotelId?: string;
  hotel?: Hotel;
  name: string;
  type?: string;
  description?: string;
  capacity?: number;
  status?: string;
  images?: Image[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 酒店状态 Store 接口
 */
export interface HotelStore {
  // 状态
  hotels: Hotel[];
  currentHotel: Hotel | null;
  currentRestaurant: Restaurant | null;
  loading: boolean;
  error: string | null;

  // Actions
  setHotels: (hotels: Hotel[]) => void;
  addHotels: (hotels: Hotel[]) => void;
  setCurrentHotel: (hotel: Hotel | null) => void;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrent: () => void;
  updateHotel: (id: string, updates: Partial<Hotel>) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  reset: () => void;
}

/**
 * 酒店状态 Store
 * 管理酒店和餐厅数据的状态
 */
export const useHotelStore = create<HotelStore>((set, get) => ({
  // 初始状态
  hotels: [],
  currentHotel: null,
  currentRestaurant: null,
  loading: false,
  error: null,

  // 设置酒店列表（替换）
  setHotels: (hotels) => set({ hotels }),

  // 添加酒店列表（合并）
  addHotels: (newHotels) =>
    set((state) => {
      // 处理 null/undefined 输入
      if (!newHotels || !Array.isArray(newHotels)) {
        return state;
      }

      // 过滤掉没有 id 的酒店并收集已有的 id
      const validHotels = newHotels.filter((h) => h && h.id);
      const existingIds = new Set(
        state.hotels.filter((h) => h && h.id).map((h) => h.id)
      );
      const uniqueHotels = validHotels.filter((h) => !existingIds.has(h.id));
      return { hotels: [...state.hotels, ...uniqueHotels] };
    }),

  // 设置当前选中的酒店
  setCurrentHotel: (hotel) => set({ currentHotel: hotel }),

  // 设置当前选中的餐厅
  setCurrentRestaurant: (restaurant) => set({ currentRestaurant: restaurant }),

  // 设置加载状态
  setLoading: (loading) => set({ loading }),

  // 设置错误信息
  setError: (error) => set({ error }),

  // 清除当前选中的酒店和餐厅
  clearCurrent: () => set({ currentHotel: null, currentRestaurant: null }),

  // 更新指定酒店
  updateHotel: (id, updates) =>
    set((state) => ({
      hotels: state.hotels.map((hotel) =>
        hotel.id === id ? { ...hotel, ...updates } : hotel
      ),
      currentHotel:
        state.currentHotel?.id === id
          ? { ...state.currentHotel, ...updates }
          : state.currentHotel,
    })),

  // 更新指定餐厅
  updateRestaurant: (id, updates) =>
    set((state) => ({
      currentRestaurant:
        state.currentRestaurant?.id === id
          ? { ...state.currentRestaurant, ...updates }
          : state.currentRestaurant,
      currentHotel: state.currentHotel
        ? {
            ...state.currentHotel,
            restaurants: state.currentHotel.restaurants?.map((r) =>
              r.id === id ? { ...r, ...updates } : r
            ),
          }
        : null,
    })),

  // 重置所有状态
  reset: () =>
    set({
      hotels: [],
      currentHotel: null,
      currentRestaurant: null,
      loading: false,
      error: null,
    }),
}));
