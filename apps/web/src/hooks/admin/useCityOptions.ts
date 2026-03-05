import { createMemo } from "solid-js";

interface CityOption {
  value: string;
  label: string;
}

// 常见中国城市列表（作为默认选项）
const DEFAULT_CITIES: CityOption[] = [
  { value: "北京", label: "北京" },
  { value: "上海", label: "上海" },
  { value: "广州", label: "广州" },
  { value: "深圳", label: "深圳" },
  { value: "杭州", label: "杭州" },
  { value: "成都", label: "成都" },
  { value: "重庆", label: "重庆" },
  { value: "南京", label: "南京" },
  { value: "武汉", label: "武汉" },
  { value: "西安", label: "西安" },
];

/**
 * 从酒店数据中提取唯一的城市列表
 * @param hotels 酒店数据列表
 * @returns 城市选项列表（合并默认城市和实际使用的城市）
 */
export const useCityOptions = (hotels: Array<{ city?: string }>) => {
  return createMemo(() => {
    // 从酒店数据中提取所有唯一的城市
    const hotelCities = new Set<string>();
    hotels.forEach((hotel) => {
      if (hotel.city) {
        hotelCities.add(hotel.city);
      }
    });

    // 合并默认城市和实际使用的城市
    const allCities = new Map<string, string>();
    DEFAULT_CITIES.forEach((city) => {
      allCities.set(city.value, city.label);
    });
    hotelCities.forEach((city) => {
      if (!allCities.has(city)) {
        allCities.set(city, city);
      }
    });

    // 转换为选项列表并按字母排序
    return Array.from(allCities.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "zh-CN"));
  });
};

export { DEFAULT_CITIES };
