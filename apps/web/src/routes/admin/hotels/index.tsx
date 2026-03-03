import { Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { type Hotel, TableColumn, ActionConfig } from "~/lib/types";
import { AdminLayout } from "~/components/admin/Layout/AdminLayout";
import { DataTable } from "~/components/admin/Table/DataTable";
import { StatusToggle } from "~/components/admin/StatusToggle";
import { useHotelList } from "~/hooks/admin/useHotelList";
import { useDeleteHotel, useUpdateHotelStatus } from "~/lib/hotel-mutations";
import { HotelForm } from "~/components/admin/Modals/HotelForm";
import { Button } from "@repo/ui";

export default function HotelsPage() {
  const { hotels, loading, pagination, setPagination, refetch } =
    useHotelList();
  const [formOpen, setFormOpen] = createSignal(false);
  const [selectedHotel, setSelectedHotel] = createSignal<Hotel | null>(null);
  const deleteMutation = useDeleteHotel();
  const updateStatusMutation = useUpdateHotelStatus();
  const navigate = useNavigate();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatusMutation.execute({ id, status: newStatus });
    refetch();
  };

  const columns: TableColumn<Hotel>[] = [
    {
      key: "name",
      label: "酒店名称",
      searchable: true,
    },
    {
      key: "city",
      label: "城市",
      searchable: true,
    },
    {
      key: "address",
      label: "地址",
      searchable: true,
    },
    {
      key: "status",
      label: "状态",
      render: (value, row) => (
        <StatusToggle
          type="hotel"
          currentStatus={value}
          id={row.id}
          onStatusChange={handleStatusChange}
        />
      ),
    },
    {
      key: "images",
      label: "图片",
      render: (_, row) => (
        <div class="relative w-16 h-16">
          <Show when={row.images && row.images.length > 0}>
            <img
              src={row.images[0].url}
              alt={row.name}
              class="w-full h-full object-cover rounded"
            />
            <span class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              +{row.images.length}
            </span>
          </Show>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "创建时间",
      render: (value) => {
        const date = new Date(value);
        return (
          <span class="text-gray-600">{date.toLocaleString("zh-CN")}</span>
        );
      },
    },
  ];

  const getRowActions = (hotel: Hotel): ActionConfig[] => {
    console.log(`🚀 ~ getRowActions ~ hotel:`, hotel);
    return [
      {
        label: "详情",
        type: "primary",
        onClick: () => {
          navigate(`/admin/hotels/${hotel.id}`);
        },
      },
      {
        label: "编辑",
        type: "primary",
        onClick: () => {
          setSelectedHotel(hotel);
          setFormOpen(true);
        },
      },
      {
        label: "删除",
        type: "danger",
        dropdown: true,
        onClick: async () => {
          if (confirm(`确定要删除酒店 "${hotel.name}" 吗？`)) {
            await deleteMutation.execute({ id: hotel.id });
            refetch();
          }
        },
      },
    ];
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedHotel(null);
    refetch();
  };

  return (
    <AdminLayout>
      <div class="w-full">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">酒店管理</h1>
          <Button
            onClick={() => {
              setSelectedHotel(null);
              setFormOpen(true);
            }}
          >
            新建酒店
          </Button>
        </div>

        <Show when={loading()}>
          <div class="text-center py-8 text-gray-500">加载中...</div>
        </Show>

        <Show when={!loading() && hotels().length === 0}>
          <div class="text-center py-8">
            <p class="text-gray-500 mb-4">暂无酒店数据</p>
            <Button
              onClick={() => {
                setSelectedHotel(null);
                setFormOpen(true);
              }}
            >
              创建第一个酒店
            </Button>
          </div>
        </Show>

        <Show when={!loading() && hotels().length > 0}>
          <DataTable
            data={hotels()}
            columns={columns}
            loading={loading()}
            rowActions={getRowActions}
          />
        </Show>

        <Show when={formOpen()}>
          <HotelForm
            hotel={selectedHotel()}
            onClose={() => setFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        </Show>
      </div>
    </AdminLayout>
  );
}
