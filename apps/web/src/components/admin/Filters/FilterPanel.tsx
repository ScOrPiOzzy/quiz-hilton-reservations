import { For, Show, Component, createSignal } from "solid-js";

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

export const FilterPanel: Component<FilterPanelProps> = (props) => {
  // 为每个文本输入的 timeout 创建独立的信号
  const timeoutSignals = new Map<string, ReturnType<typeof setTimeout>>();

  const handleFilterChange = (key: string, value: any, isText = false) => {
    // 立即更新显示值
    const newFilters = { ...props.filters, [key]: value };
    props.onFiltersChange(newFilters);

    if (isText) {
      // 清除之前的 timeout
      const prevTimeout = timeoutSignals.get(key);
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }

      // 创建新的 timeout 进行防抖
      const timeoutId = setTimeout(() => {
        // 防抖后再次调用 onFiltersChange
        props.onFiltersChange(newFilters);
        timeoutSignals.delete(key);
      }, 300);

      timeoutSignals.set(key, timeoutId);
    }
  };

  const handleReset = () => {
    // 清理所有 timeout
    timeoutSignals.forEach((timeout) => clearTimeout(timeout));
    timeoutSignals.clear();

    const emptyFilters = props.options.reduce(
      (acc, opt) => ({ ...acc, [opt.key]: "" }),
      {}
    );
    props.onFiltersChange(emptyFilters);
    props.onReset?.();
  };

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
                  value={props.filters[option.key] || ""}
                  onInput={(e) =>
                    handleFilterChange(option.key, (e.target as HTMLInputElement).value, true)
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Show>
              <Show when={option.type === "select"}>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={props.filters[option.key] || ""}
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
                  value={props.filters[option.key] || ""}
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
                    value={props.filters[`${option.key}From`] || ""}
                    onChange={(e) =>
                      handleFilterChange(`${option.key}From`, (e.target as HTMLInputElement).value)
                    }
                  />
                  <input
                    type="date"
                    class="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={props.filters[`${option.key}To`] || ""}
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
