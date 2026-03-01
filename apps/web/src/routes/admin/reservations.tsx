import { For, Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import type { Reservation, TableColumn, ActionConfig } from "~/lib/types";
import { AdminLayout } from "../../components/admin/Layout/AdminLayout";
import { DataTable } from "../../components/admin/Table/DataTable";
import { ActionMenu } from "../../components/admin/ActionMenu/ActionMenu";
import { useReservationList } from "../../hooks/admin/useReservationList";
import { Button } from "@repo/ui";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const { reservations, loading, pagination, setPagination, refetch } =
    useReservationList();
  const [detailOpen, setDetailOpen] = createSignal(false);
  const [selectedReservation, setSelectedReservation] =
    createSignal<Reservation | null>(null);

  const columns: TableColumn<Reservation>[] = [
    {
      key: "customer.name",
      label: "客户姓名",
      searchable: true,
    },
    {
      key: "customer.phone",
      label: "联系电话",
      searchable: true,
    },
    {
      key: "reservationDate",
      label: "预约时间",
      render: (value) => {
        const date = new Date(value);
        return <span>{date.toLocaleString("zh-CN")}</span>;
      },
    },
    {
      key: "status",
      label: "状态",
      render: (value) => {
        const statusMap: Record<string, string> = {
          REQUESTED: "待确认",
          APPROVED: "已确认",
          CANCELLED: "已取消",
          COMPLETED: "已完成",
        };
        const statusStyles: Record<string, string> = {
          REQUESTED: "bg-yellow-100 text-yellow-800",
          APPROVED: "bg-green-100 text-green-800",
          CANCELLED: "bg-red-100 text-red-800",
          COMPLETED: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            class={`px-2 py-1 rounded text-sm ${statusStyles[value] || "bg-gray-100 text-gray-800"}`}
          >
            {statusMap[value] || value}
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
        alert(`取消预约: ${reservation.customer.name}`);
      },
    },
  ];

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  return (
    <AdminLayout>
      <div class="w-full">
        <h1 class="text-2xl font-bold mb-6">预约管理</h1>

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

        <Show when={detailOpen()}>
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
                <Show when={selectedReservation()}>
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
                </Show>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </AdminLayout>
  );
}
