import { For, Show, createMemo, createSignal, JSX } from "solid-js";
import { type TableColumn } from "~/lib/types";
import { ActionMenu } from "../ActionMenu/ActionMenu";
import type { ActionConfig } from "~/lib/types";

interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading: boolean;
  rowActions?: (row: T) => any[];
}

export const DataTable = <T extends Record<string, any>>(
  props: DataTableProps<T>,
) => {
  const [sortColumn, setSortColumn] = createSignal<keyof T | null>(null);
  const [sortDirection, setSortDirection] = createSignal<"asc" | "desc">("asc");

  const sortedData = createMemo(() => {
    if (!sortColumn()) return props.data;

    return [...props.data].sort((a, b) => {
      const aValue = a[sortColumn()!];
      const bValue = b[sortColumn()!];

      if (aValue < bValue) return sortDirection() === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection() === "asc" ? 1 : -1;
      return 0;
    });
  });

  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable) return;

    if (sortColumn() === column.key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column.key);
      setSortDirection("asc");
    }
  };

  return (
    <div class="w-full">
      <div class="overflow-x-auto border rounded-lg">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">
                序号
              </th>
              <For each={props.columns}>
                {(col) => (
                  <th
                    class={`px-4 py-3 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 ${
                      col.sortable ? "cursor-pointer" : ""
                    }`}
                    onClick={() => handleSort(col)}
                  >
                    <div class="flex items-center gap-1">
                      {col.label}
                      <Show when={sortColumn() === col.key}>
                        <span class="text-[#002f61]">
                          {sortDirection() === "asc" ? "↑" : "↓"}
                        </span>
                      </Show>
                    </div>
                  </th>
                )}
              </For>
              <Show when={props.rowActions}>
                <th class="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  操作
                </th>
              </Show>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <Show when={props.loading}>
              <tr>
                <td
                  colspan={props.columns.length + 1}
                  class="px-4 py-8 text-center text-gray-500"
                >
                  加载中...
                </td>
              </tr>
            </Show>

            <Show when={!props.loading && sortedData().length === 0}>
              <tr>
                <td
                  colspan={props.columns.length + 1}
                  class="px-4 py-8 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            </Show>

            <For each={sortedData()}>
              {(row, index) => (
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{index() + 1}</td>
                  <For each={props.columns}>
                    {(col) => {
                      const getNestedValue = (obj: any, path: string) => {
                        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
                      };
                      const value = getNestedValue(row, col.key);
                      return (
                        <td class="px-4 py-3 text-sm text-gray-900">
                          {col.render
                            ? col.render(value, row)
                            : String(value ?? '')}
                        </td>
                      );
                    }}
                  </For>
                  <Show when={props.rowActions}>
                    <td class="px-4 py-3">
                      <ActionMenu actions={props.rowActions!(row)} />
                    </td>
                  </Show>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
};
