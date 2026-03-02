import { HotelStatus, RestaurantStatus } from "~/lib/types";

interface StatusBadgeProps {
  status: HotelStatus | RestaurantStatus;
  type?: "hotel" | "restaurant";
}

const STATUS_CONFIG: Record<
  HotelStatus | RestaurantStatus,
  { label: string; color: string }
> = {
  [HotelStatus.ACTIVE]: { label: "营业中", color: "bg-green-100 text-green-800" },
  [HotelStatus.INACTIVE]: { label: "已关闭", color: "bg-gray-100 text-gray-800" },
  [HotelStatus.RENOVATION]: { label: "装修中", color: "bg-yellow-100 text-yellow-800" },
  [HotelStatus.COMING_SOON]: { label: "即将开放", color: "bg-blue-100 text-blue-800" },
  [RestaurantStatus.ACTIVE]: { label: "餐厅开放", color: "bg-green-100 text-green-800" },
  [RestaurantStatus.INACTIVE]: { label: "餐厅关闭", color: "bg-gray-100 text-gray-800" },
  [RestaurantStatus.RENOVATION]: { label: "装修中", color: "bg-yellow-100 text-yellow-800" },
  [RestaurantStatus.COMING_SOON]: { label: "即将开放", color: "bg-blue-100 text-blue-800" },
  [RestaurantStatus.DELETED]: { label: "已删除", color: "bg-red-100 text-red-800 opacity-50" },
};

export const StatusBadge = (props: StatusBadgeProps) => {
  const config = () => STATUS_CONFIG[props.status];

  return (
    <span
      class={`px-2 py-1 rounded text-sm font-medium ${config().color}`}
    >
      {config().label}
    </span>
  );
};
