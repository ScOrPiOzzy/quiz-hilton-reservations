import { For, Show, createMemo, createSignal, JSX } from "solid-js";
import { type TableColumn } from "~/lib/types";
import { Input } from "@repo/ui";
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
  const [searchKeyword, setSearchKeyword] = createSignal("");
  const [sortColumn, setSortColumn] = createSignal<keyof T | null>(null);
  const [sortDirection, setSortDirection] = createSignal<"asc" | "desc">("asc");

  const filteredData = createMemo(() => {
    let result = props.data;

    if (searchKeyword()) {
      const keyword = searchKeyword().toLowerCase();
      result = result.filter((row) =>
        props.columns.some((col) => {
          const value = row[col.key];
          return String(value).toLowerCase().includes(keyword);
        }),
      );
    }

    if (sortColumn()) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortColumn()!];
        const bValue = b[sortColumn()!];

        if (aValue < bValue) return sortDirection() === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection() === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
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
      <div class="mb-4">
        <Input
          placeholder="搜索..."
          value={searchKeyword()}
          onInput={(e: Event) =>
            setSearchKeyword((e.target as HTMLInputElement).value)
          }
        />
      </div>

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

            <Show when={!props.loading && filteredData().length === 0}>
              <tr>
                <td
                  colspan={props.columns.length + 1}
                  class="px-4 py-8 text-center text-gray-500"
                >
                  暂无数据
                </td>
              </tr>
            </Show>

            <For each={filteredData()}>
              {(row, index) => (
                <tr class="hover:bg-gray-50">
                  <td class="px-4 py-3 text-sm text-gray-900">{index() + 1}</td>
                  <For each={props.columns}>
                    {(col) => (
                      <td class="px-4 py-3 text-sm text-gray-900">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    )}
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
