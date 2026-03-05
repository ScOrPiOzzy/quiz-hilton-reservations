import { Show, For, createSignal, onMount, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import type { HotelStatus, RestaurantStatus } from "~/lib/types";

interface StatusOption {
  value: string;
  label: string;
  colorClass: string;
}

const HOTEL_STATUS_OPTIONS: Record<HotelStatus, StatusOption> = {
  ACTIVE: { value: "ACTIVE", label: "营业中", colorClass: "bg-green-100 text-green-800" },
  INACTIVE: { value: "INACTIVE", label: "已关闭", colorClass: "bg-gray-100 text-gray-800" },
  RENOVATION: { value: "RENOVATION", label: "装修中", colorClass: "bg-yellow-100 text-yellow-800" },
  COMING_SOON: { value: "COMING_SOON", label: "即将开放", colorClass: "bg-blue-100 text-blue-800" },
};

const RESTAURANT_STATUS_OPTIONS: Record<RestaurantStatus, StatusOption> = {
  ACTIVE: { value: "ACTIVE", label: "营业中", colorClass: "bg-green-100 text-green-800" },
  INACTIVE: { value: "INACTIVE", label: "已关闭", colorClass: "bg-gray-100 text-gray-800" },
  RENOVATION: { value: "RENOVATION", label: "装修中", colorClass: "bg-yellow-100 text-yellow-800" },
  COMING_SOON: { value: "COMING_SOON", label: "即将开放", colorClass: "bg-blue-100 text-blue-800" },
  DELETED: { value: "DELETED", label: "已删除", colorClass: "bg-red-100 text-red-800" },
};

const RESERVATION_STATUS_OPTIONS: Record<string, StatusOption> = {
  REQUESTED: { value: "REQUESTED", label: "待处理", colorClass: "bg-orange-100 text-orange-800" },
  APPROVED: { value: "APPROVED", label: "已批准", colorClass: "bg-green-100 text-green-800" },
  CANCELLED: { value: "CANCELLED", label: "已取消", colorClass: "bg-red-100 text-red-800" },
  COMPLETED: { value: "COMPLETED", label: "已完成", colorClass: "bg-gray-100 text-gray-800" },
};

interface StatusToggleProps {
  type: "hotel" | "restaurant" | "reservation";
  currentStatus: string;
  id: string;
  onStatusChange: (id: string, newStatus: string) => Promise<void>;
  disabled?: boolean;
}

export function StatusToggle(props: StatusToggleProps) {
  const [showDropdown, setShowDropdown] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  let buttonRef: HTMLButtonElement | undefined;
  const [dropdownPosition, setDropdownPosition] = createSignal({ top: 0, left: 0 });

  const statusOptions =
    props.type === "hotel"
      ? (HOTEL_STATUS_OPTIONS as Record<string, StatusOption>)
      : props.type === "restaurant"
      ? (RESTAURANT_STATUS_OPTIONS as Record<string, StatusOption>)
      : (RESERVATION_STATUS_OPTIONS as Record<string, StatusOption>);

  const currentOption = () => {
    // 对于酒店和餐厅类型，使用 ACTIVE 作为 fallback
    // 对于预约类型，使用 PENDING 作为 fallback
    const fallback = props.type === "reservation"
      ? RESERVATION_STATUS_OPTIONS.PENDING
      : statusOptions.ACTIVE;
    return statusOptions[props.currentStatus] || fallback;
  };
  const availableOptions = () =>
    Object.values(statusOptions).filter((opt) => opt.value !== "DELETED");

  const handleStatusChange = async (newStatus: string) => {
    setShowDropdown(false);
    if (newStatus === props.currentStatus) return;

    setLoading(true);
    try {
      await props.onStatusChange(props.id, newStatus);
    } catch (e) {
      console.error("Failed to update status:", e);
      alert("更新状态失败");
    } finally {
      setLoading(false);
    }
  };

  const updateDropdownPosition = () => {
    if (buttonRef && showDropdown()) {
      const rect = buttonRef.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      });
    }
  };

  // 当下拉菜单打开时计算位置
  const toggleDropdown = () => {
    if (!loading() && !props.disabled) {
      const newValue = !showDropdown();
      setShowDropdown(newValue);
      if (newValue && buttonRef) {
        // 延迟一帧确保 DOM 已更新
        requestAnimationFrame(() => {
          const rect = buttonRef.getBoundingClientRect();
          setDropdownPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
          });
        });
      }
    }
  };

  return (
    <div class="relative inline-block">
      <button
        ref={buttonRef}
        class={`px-3 py-1 rounded text-sm font-medium transition-colors ${
          loading() ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        } ${currentOption().colorClass}`}
        onClick={toggleDropdown}
        disabled={loading() || props.disabled}
      >
        {loading() ? "更新中..." : currentOption().label}
        <Show when={!loading() && !props.disabled}>
          <span class="ml-1">▼</span>
        </Show>
      </button>

      <Show when={showDropdown()}>
        <Portal mount={document.body}>
          <div
            class="fixed z-[9999] w-32 bg-white rounded-md shadow-lg border border-gray-200"
            style={{
              top: `${dropdownPosition().top}px`,
              left: `${dropdownPosition().left}px`,
            }}
          >
            <For each={availableOptions()}>
              {(option) => (
                <button
                  class={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                    props.currentStatus === option.value
                      ? "bg-gray-100 font-medium"
                      : ""
                  }`}
                  onClick={() => handleStatusChange(option.value)}
                >
                  <span
                    class={`inline-block w-2 h-2 rounded-full mr-2 ${option.colorClass}`}
                  />
                  {option.label}
                </button>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </div>
  );
}
