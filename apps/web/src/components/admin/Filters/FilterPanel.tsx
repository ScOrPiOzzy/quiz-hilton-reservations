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

export const FilterPanel: Component<FilterPanelProps> = (props) => {
  // 本地状态用于文本输入的即时显示
  const localTextValues = createSignal<Record<string, string>>({});
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  const handleFilterChange = (key: string, value: any, isText = false) => {
    if (isText) {
      // 更新本地显示值
      localTextValues.update(prev => ({ ...prev, [key]: value }));

      // 清除之前的 timeout
      const prevTimeout = timeouts.get(key);
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }

      // 防抖后更新实际过滤器
      const timeoutId = setTimeout(() => {
        const newFilters = { ...props.filters, [key]: value };
        props.onFiltersChange(newFilters);
        timeouts.delete(key);
      }, 300);

      timeouts.set(key, timeoutId);
    } else {
      // 非（select, date）立即更新
      const newFilters = { ...props.filters, [key]: value };
      props.onFiltersChange(newFilters);
    }
  };

  const handleReset = () => {
    // 清理所有 timeout
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts.clear();
    localTextValues.set({});

    const emptyFilters = props.options.reduce(
      (acc, opt) => ({ ...acc, [opt.key]: "" }),
      {}
    );
    props.onFiltersChange(emptyFilters);
    props.onReset?.();
  };

  // 组件卸载时清理
  onCleanup(() => {
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts.clear();
  });

  // 获取输入框的显示值
  const getInputValue = (key: string) => {
    return localTextValues()[key] !== undefined ? localTextValues()[key] : (props.filters[key] || "");
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
                  value={getInputValue(option.key)}
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
