import { For, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { Reservation, TableColumn, ActionConfig } from "~/lib/types";
import { AdminLayout } from "~/components/admin/Layout/AdminLayout";
import { DataTable } from "~/components/admin/Table/DataTable";
import { ActionMenu } from "~/components/admin/ActionMenu/ActionMenu";
import { StatusToggle } from "~/components/admin/StatusToggle";
import { useReservationList } from "~/hooks/admin/useReservationList";
import {
  useUpdateReservationStatus,
  useCancelReservation,
} from "~/lib/reservation-mutations";
import { FilterPanel, type FilterOption } from "~/components/admin/Filters";
import { useHotelList } from "~/hooks/admin/useHotelList";
import { Button } from "@repo/ui";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const {
    reservations,
    loading,
    pagination,
    setPagination,
    refetch,
    filters,
    updateFilters,
  } = useReservationList();
  const { hotels } = useHotelList();
  const [detailOpen, setDetailOpen] = createSignal(false);
  const [selectedReservation, setSelectedReservation] =
    createSignal<Reservation | null>(null);
  const updateStatusMutation = useUpdateReservationStatus();
  const cancelReservationMutation = useCancelReservation();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatusMutation.execute({ input: { id, status: newStatus } });
    refetch();
  };

  const handleCancelReservation = async (id: string) => {
    if (confirm("确定要取消此预约吗？")) {
      await cancelReservationMutation.execute({ id });
      refetch();
    }
  };

  // 动态生成酒店选项
  const hotelOptions = () => [
    ...hotels().map((h) => ({ value: h.id, label: h.name })),
  ];

  const filterOptions: FilterOption[] = [
    {
      key: "name",
      label: "客户姓名",
      type: "text",
      placeholder: "输入姓名...",
    },
    {
      key: "phone",
      label: "联系电话",
      type: "text",
      placeholder: "输入电话...",
    },
    {
      key: "status",
      label: "状态",
      type: "select",
      placeholder: "全部状态",
      options: [
        { value: "REQUESTED", label: "待处理" },
        { value: "APPROVED", label: "已批准" },
        { value: "CANCELLED", label: "已取消" },
        { value: "COMPLETED", label: "已完成" },
      ],
    },
    {
      key: "storeId",
      label: "酒店",
      type: "select",
      placeholder: "全部酒店",
      options: hotelOptions(),
    },
    {
      key: "reservationDate",
      label: "预约日期",
      type: "dateRange",
    },
  ];

  const columns: TableColumn<Reservation>[] = [
    {
      key: "customer",
      label: "客户信息",
      render: (value) => (
        <div class="whitespace-nowrap">
          <div class="font-medium">{value.name}</div>
          <div class="text-sm text-gray-500">{value.phone}</div>
        </div>
      ),
    },
    {
      key: "restaurant",
      label: "餐厅/酒店",
      render: (value, row) => (
        <div class="whitespace-nowrap">
          <div class="font-medium">{value?.name || "-"}</div>
          <div class="text-sm text-gray-500">{row.hotel?.name || "-"}</div>
        </div>
      ),
    },
    {
      key: "reservation",
      label: "预约时间",
      render: (_, row) => (
        <div class="whitespace-nowrap">
          <div class="font-medium">
            {new Date(row.reservationDate).toLocaleDateString("zh-CN")}
          </div>
          <div class="text-sm text-gray-500">{row.timeSlot || "-"}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "状态",
      render: (value, row) => {
        const statusMap: Record<string, string> = {
          REQUESTED: "待处理",
          APPROVED: "已批准",
          CANCELLED: "已取消",
          COMPLETED: "已完成",
        };
        const statusStyles: Record<string, string> = {
          REQUESTED: "bg-orange-100 text-orange-800",
          APPROVED: "bg-green-100 text-green-800",
          CANCELLED: "bg-red-100 text-red-800",
          COMPLETED: "bg-gray-100 text-gray-800",
        };

        // 只有"待处理"状态的预约才显示状态切换按钮
        const canChangeStatus = value === "REQUESTED";

        if (canChangeStatus) {
          return (
            <StatusToggle
              type="reservation"
              currentStatus={value}
              id={row.id}
              onStatusChange={handleStatusChange}
            />
          );
        }

        return (
          <span
            class={`px-2 py-1 rounded text-sm whitespace-nowrap ${statusStyles[value] || "bg-gray-100 text-gray-800"}`}
          >
            {statusMap[value] || value}
          </span>
        );
      },
    },
    {
      key: "specialRequests",
      label: "备注",
      render: (value) => <span>{value || "-"}</span>,
    },
    {
      key: "createdAt",
      label: "创建时间",
      render: (value) => {
        const date = new Date(value);
        return (
          <span class="text-gray-600 whitespace-nowrap">
            {date.toLocaleString("zh-CN")}
          </span>
        );
      },
    },
  ];

  const getRowActions = (reservation: Reservation): ActionConfig[] => [
    {
      label: "详情",
      type: "primary",
      onClick: () => {
        setSelectedReservation(reservation);
        setDetailOpen(true);
      },
    },
    {
      label: "取消预约",
      type: "danger",
      dropdown: true,
      onClick: () => {
        handleCancelReservation(reservation.id);
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleResetFilters = () => {
    updateFilters({});
  };

  return (
    <AdminLayout>
      <div class="w-full">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 class="text-2xl font-bold">预约管理</h1>
          {/* 移动端取消预约区域 */}
          <div class="sm:hidden">
            <select
              class="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm"
              onChange={(e: Event) => {
                const target = e.target as HTMLSelectElement;
                const id = target.value;
                if (id) {
                  handleCancelReservation(id);
                  target.value = "";
                }
              }}
            >
              <option value="">选择预约取消...</option>
              <For each={reservations()}>
                {(r) => (
                  <Show when={r.status === "REQUESTED"}>
                    <option value={r.id}>
                      {r.customer.name} -{" "}
                      {new Date(r.reservationDate).toLocaleDateString("zh-CN")}
                    </option>
                  </Show>
                )}
              </For>
            </select>
          </div>
        </div>

        <FilterPanel
          filters={filters()}
          onFiltersChange={updateFilters}
          options={filterOptions}
          onReset={handleResetFilters}
        />

        <Show when={loading()}>
          <div class="text-center py-8 text-gray-500">加载中...</div>
        </Show>

        <Show when={!loading() && reservations().length === 0}>
          <div class="text-center py-8">
            <p class="text-gray-500">暂无预约数据</p>
          </div>
        </Show>

        <Show when={!loading() && reservations().length > 0}>
          <DataTable
            data={reservations()}
            columns={columns}
            loading={loading()}
            rowActions={getRowActions}
          />
        </Show>

        <Show when={detailOpen() && selectedReservation()}>
          <div
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setDetailOpen(false)}
          >
            <div
              class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div class="flex justify-between items-center p-4 border-b">
                <h2 class="text-xl font-bold">预约详情</h2>
                <Button variant="ghost" onClick={() => setDetailOpen(false)}>
                  ✕
                </Button>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <p>
                    <strong>客户姓名:</strong>{" "}
                    {selectedReservation()?.customer.name}
                  </p>
                  <p>
                    <strong>联系电话:</strong>{" "}
                    {selectedReservation()?.customer.phone}
                  </p>
                  <Show when={selectedReservation()?.customer.email}>
                    <p>
                      <strong>邮箱:</strong>{" "}
                      {selectedReservation()?.customer.email}
                    </p>
                  </Show>
                  <p>
                    <strong>预约时间:</strong>{" "}
                    {selectedReservation()
                      ? new Date(
                          selectedReservation()!.reservationDate,
                        ).toLocaleString("zh-CN")
                      : ""}
                  </p>
                  <p>
                    <strong>状态:</strong> {selectedReservation()?.status}
                  </p>
                  <Show when={selectedReservation()?.specialRequests}>
                    <p>
                      <strong>特殊要求:</strong>{" "}
                      {selectedReservation()?.specialRequests}
                    </p>
                  </Show>
                </div>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </AdminLayout>
  );
}
