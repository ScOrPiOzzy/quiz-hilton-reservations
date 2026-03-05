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
  const [localTextValues, setLocalTextValues] = createSignal<Record<string, string>>({});
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

  // 辅助函数：处理空值，删除键而不是设置为空字符串
  const updateFiltersWithoutEmpty = (key: string, value: any) => {
    const newFilters = { ...props.filters };
    if (value === "" || value === null || value === undefined) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    return newFilters;
  };

  const handleFilterChange = (key: string, value: any, isText = false) => {
    if (isText) {
      // 更新本地显示值
      setLocalTextValues(prev => ({ ...prev, [key]: value }));

      // 清除之前的 timeout
      const prevTimeout = timeouts.get(key);
      if (prevTimeout) {
        clearTimeout(prevTimeout);
      }

      // 防抖后更新实际过滤器
      const timeoutId = setTimeout(() => {
        props.onFiltersChange(updateFiltersWithoutEmpty(key, value));
        timeouts.delete(key);
      }, 300);

      timeouts.set(key, timeoutId);
    } else {
      // 非（select, date）立即更新
      props.onFiltersChange(updateFiltersWithoutEmpty(key, value));
    }
  };

  const handleReset = () => {
    // 清理所有 timeout
    timeouts.forEach((timeout) => clearTimeout(timeout));
    timeouts.clear();
    setLocalTextValues({});

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
    <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm mb-5">
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <For each={props.options}>
          {(option) => (
            <div class={`${option.type === "dateRange" ? "col-span-1 sm:col-span-2" : ""}`}>
              <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-0 transition-all duration-200"
                />
              </Show>
              <Show when={option.type === "select"}>
                <select
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-0 transition-all duration-200"
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
                  class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-0 transition-all duration-200"
                  value={props.filters[option.key] || ""}
                  onChange={(e) =>
                    handleFilterChange(option.key, (e.target as HTMLInputElement).value)
                  }
                />
              </Show>
              <Show when={option.type === "dateRange"}>
                <div class="flex gap-2 items-center">
                  <div class="flex-1 relative">
                    <input
                      type="date"
                      class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-0 transition-all duration-200"
                      value={props.filters[`${option.key}From`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${option.key}From`, (e.target as HTMLInputElement).value)
                      }
                    />
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">至</span>
                  </div>
                  <div class="flex-1">
                    <input
                      type="date"
                      class="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-0 transition-all duration-200"
                      value={props.filters[`${option.key}To`] || ""}
                      onChange={(e) =>
                        handleFilterChange(`${option.key}To`, (e.target as HTMLInputElement).value)
                      }
                    />
                  </div>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
      <div class="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
        <button
          onClick={handleReset}
          class="px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          重置筛选
        </button>
      </div>
    </div>
  );
};
