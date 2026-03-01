import { Show, createSignal } from "solid-js";
import { type Restaurant, type TableColumn, type ActionConfig } from "~/lib/types";
import { AdminLayout } from "../../components/admin/Layout/AdminLayout";
import { DataTable } from "../../components/admin/Table/DataTable";
import { RestaurantForm } from "../../components/admin/Modals/RestaurantForm";
import { useRestaurantList, useGetHotels } from "../../hooks/admin/useRestaurantList";
import { useDeleteRestaurant } from "~/lib/restaurant-mutations";
import { Button } from "@repo/ui";

export default function RestaurantsPage() {
  const { restaurants, loading, pagination, setPagination, refetch } =
    useRestaurantList();
  const [formOpen, setFormOpen] = createSignal(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    createSignal<Restaurant | null>(null);
  const [detailOpen, setDetailOpen] = createSignal(false);
  const deleteMutation = useDeleteRestaurant();

  const columns: TableColumn<Restaurant>[] = [
    {
      key: "name",
      label: "餐厅名称",
      searchable: true,
    },
    {
      key: "type",
      label: "类型",
      render: (value) => {
        const typeMap: Record<string, string> = {
          HALL: "大厅",
          PRIVATE_ROOM: "包厢",
        };
        return (
          <span class="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">
            {typeMap[value] || value}
          </span>
        );
      },
    },
    {
      key: "capacity",
      label: "容量",
    },
    {
      key: "status",
      label: "状态",
      render: (value) => (
        <span
          class={`px-2 py-1 rounded text-sm ${
            value === "ACTIVE"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {value === "ACTIVE" ? "营业中" : "已下架"}
        </span>
      ),
    },
  ];

  const getRowActions = (restaurant: Restaurant): ActionConfig[] => [
    {
      label: "详情",
      type: "primary",
      onClick: () => {
        setSelectedRestaurant(restaurant);
        setDetailOpen(true);
      },
    },
    {
      label: "编辑",
      type: "primary",
      onClick: () => {
        setSelectedRestaurant(restaurant);
        setFormOpen(true);
      },
    },
    {
      label: "删除",
      type: "danger",
      dropdown: true,
      onClick: async () => {
        if (confirm(`确定要删除餐厅 "${restaurant.name}" 吗？`)) {
          await deleteMutation.execute({ id: restaurant.id });
          refetch();
        }
      },
    },
  ];

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedRestaurant(null);
    refetch();
  };

  return (
    <AdminLayout>
      <div class="w-full">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">餐厅管理</h1>
          <Button
            onClick={() => {
              setSelectedRestaurant(null);
              setFormOpen(true);
            }}
          >
            新建餐厅
          </Button>
        </div>

        <Show when={loading()}>
          <div class="text-center py-8 text-gray-500">加载中...</div>
        </Show>

        <Show when={!loading() && restaurants().length === 0}>
          <div class="text-center py-8">
            <p class="text-gray-500 mb-4">暂无餐厅数据</p>
            <Button
              onClick={() => {
                setSelectedRestaurant(null);
                setFormOpen(true);
              }}
            >
              创建第一个餐厅
            </Button>
          </div>
        </Show>

        <Show when={!loading() && restaurants().length > 0}>
          <DataTable
            data={restaurants()}
            columns={columns}
            loading={loading()}
            rowActions={getRowActions}
          />
        </Show>

        <Show when={formOpen()}>
          <RestaurantForm
            restaurant={selectedRestaurant()}
            onClose={() => setFormOpen(false)}
            onSuccess={handleFormSuccess}
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
                <h2 class="text-xl font-bold">餐厅详情</h2>
                <button
                  onClick={() => setDetailOpen(false)}
                  class="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div class="p-4">
                <Show when={selectedRestaurant()}>
                  <div class="space-y-3">
                    <p>
                      <strong>名称:</strong> {selectedRestaurant()?.name}
                    </p>
                    <p>
                      <strong>类型:</strong>{" "}
                      {selectedRestaurant()?.type === "HALL"
                        ? "大厅"
                        : "包厢"}
                    </p>
                    <p>
                      <strong>容量:</strong> {selectedRestaurant()?.capacity}
                    </p>
                    <p>
                      <strong>状态:</strong>{" "}
                      {selectedRestaurant()?.status === "ACTIVE"
                        ? "营业中"
                        : "已下架"}
                    </p>
                    <Show when={selectedRestaurant()?.description}>
                      <p>
                        <strong>简介:</strong> {selectedRestaurant()?.description}
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
