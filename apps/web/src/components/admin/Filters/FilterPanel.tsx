import { For, Show, Component, createSignal, onCleanup } from "solid-js";

export interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "dateRange";
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

interface FilterPanelProps {
  filters: Record<string, any>;
  onFiltersChange: (filters: Record<string, any>) => void;
  options: FilterOption[];
  onReset?: () => void;
}

// 防抖工具函数
function createDebouncedValue<T>(delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  const [value, setValue] = createSignal<T | null>(null);

  const debouncedSetValue = (newValue: T) => {
    setValue(newValue);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      setValue(null);
    }, delay);
  };

  onCleanup(() => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  });

  return { value, debouncedSetValue };
}

export const FilterPanel: Component<FilterPanelProps> = (props) => {
  // 为文本输入创建防抖，延迟 300ms
  const { value: debouncedFilter, debouncedSetValue } = createDebouncedValue<{ key: string; value: string }>(300);

  // 监听防抖后的值变化
  const [localFilters, setLocalFilters] = createSignal<Record<string, any>>({ ...props.filters });

  // 当防抖值变化时，触发过滤器更新
  const updateFilter = (key: string, value: any, debounce = false) => {
    if (debounce) {
      // 更新本地状态用于显示
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
      // 使用防抖更新实际过滤器
      debouncedSetValue({ key, value });
    } else {
      setLocalFilters((prev) => ({ ...prev, [key]: value }));
      const newFilters = { ...props.filters, [key]: value };
      props.onFiltersChange(newFilters);
    }
  };

  // 监听外部过滤器变化，同步到本地状态
  const handleDebouncedChange = () => {
    const current = debouncedFilter();
    if (current) {
      const newFilters = { ...props.filters, [current.key]: current.value };
      props.onFiltersChange(newFilters);
    }
  };

  // 使用 effect 监听防抖值
  let prevDebouncedValue: typeof debouncedFilter | null = null;
  const checkDebouncedChange = () => {
    const current = debouncedFilter();
    if (current && (!prevDebouncedValue || prevDebouncedValue() !== current)) {
      handleDebouncedChange();
    }
    prevDebouncedValue = debouncedFilter;
  };

  // 简化版本：直接使用 setTimeout 处理防抖
  const handleFilterChange = (key: string, value: any, isText = false) => {
    // 更新显示值
    setLocalFilters((prev) => ({ ...prev, [key]: value }));

    if (isText) {
      // 文本输入使用防抖
      const timeoutId = setTimeout(() => {
        const newFilters = { ...props.filters, [key]: value };
        props.onFiltersChange(newFilters);
      }, 300);

      // 清除之前的定时器（存储在元素上）
      const inputElement = document.activeElement as HTMLInputElement;
      if (inputElement && (inputElement as any)._debounceTimeout) {
        clearTimeout((inputElement as any)._debounceTimeout);
      }
      if (inputElement) {
        (inputElement as any)._debounceTimeout = timeoutId;
      }
    } else {
      // 非文本输入立即更新
      const newFilters = { ...props.filters, [key]: value };
      props.onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    const emptyFilters = props.options.reduce(
      (acc, opt) => ({ ...acc, [opt.key]: "" }),
      {}
    );
    setLocalFilters(emptyFilters);
    props.onFiltersChange(emptyFilters);
    props.onReset?.();
  };

  // 同步外部过滤器变化到本地
  const currentFilters = () => Object.keys(props.filters).length > 0 ? props.filters : localFilters();

  return (
    <div class="bg-white p-4 rounded-lg border mb-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <For each={props.options}>
          {(option) => (
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {option.label}
              </label>
              <Show when={option.type === "text"}>
                <input
                  type="text"
                  placeholder={option.placeholder}
                  value={currentFilters()[option.key] || ""}
                  onInput={(e) =>
                    handleFilterChange(option.key, (e.target as HTMLInputElement).value, true)
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Show>
              <Show when={option.type === "select"}>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentFilters()[option.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(option.key, (e.target as HTMLSelectElement).value)
                  }
                >
                  <option value="">{option.placeholder || "全部"}</option>
                  <For each={option.options}>
                    {(opt) => (
                      <option value={opt.value}>{opt.label}</option>
                    )}
                  </For>
                </select>
              </Show>
              <Show when={option.type === "date"}>
                <input
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={currentFilters()[option.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(option.key, (e.target as HTMLInputElement).value)
                  }
                />
              </Show>
              <Show when={option.type === "dateRange"}>
                <div class="flex gap-2">
                  <input
                    type="date"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentFilters()[`${option.key}From`] || ""}
                    onChange={(e) =>
                      handleFilterChange(`${option.key}From`, (e.target as HTMLInputElement).value)
                    }
                  />
                  <input
                    type="date"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentFilters()[`${option.key}To`] || ""}
                    onChange={(e) =>
                      handleFilterChange(`${option.key}To`, (e.target as HTMLInputElement).value)
                    }
                  />
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <button
          onClick={handleReset}
          class="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          重置
        </button>
      </div>
    </div>
  );
};
