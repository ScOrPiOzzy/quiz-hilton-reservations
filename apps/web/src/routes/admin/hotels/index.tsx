import { Show, createSignal } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { type Hotel, TableColumn, ActionConfig } from "~/lib/types";
import { AdminLayout } from "~/components/admin/Layout/AdminLayout";
import { DataTable } from "~/components/admin/Table/DataTable";
import { StatusToggle } from "~/components/admin/StatusToggle";
import { useHotelList } from "~/hooks/admin/useHotelList";
import { useDeleteHotel, useUpdateHotelStatus } from "~/lib/hotel-mutations";
import { HotelForm } from "~/components/admin/Modals/HotelForm";
import { FilterPanel, type FilterOption } from "~/components/admin/Filters";
import { Button } from "@repo/ui";
import { useCityOptions } from "~/hooks/admin/useCityOptions";

export default function HotelsPage() {
  const {
    hotels,
    loading,
    pagination,
    setPagination,
    refetch,
    filters,
    updateFilters,
  } = useHotelList();
  const [formOpen, setFormOpen] = createSignal(false);
  const [selectedHotel, setSelectedHotel] = createSignal<Hotel | null>(null);
  const deleteMutation = useDeleteHotel();
  const updateStatusMutation = useUpdateHotelStatus();
  const navigate = useNavigate();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatusMutation.execute({ input: { id, status: newStatus } });
    refetch();
  };

  // 获取动态城市选项
  const cityOptions = useCityOptions(hotels());

  const filterOptions: FilterOption[] = [
    {
      key: "city",
      label: "城市",
      type: "select",
      placeholder: "全部城市",
      options: cityOptions(),
    },
    {
      key: "status",
      label: "状态",
      type: "select",
      placeholder: "全部状态",
      options: [
        { value: "ACTIVE", label: "营业中" },
        { value: "INACTIVE", label: "已下架" },
        { value: "RENOVATION", label: "装修中" },
        { value: "COMING_SOON", label: "即将开放" },
      ],
    },
    {
      key: "search",
      label: "搜索",
      type: "text",
      placeholder: "酒店名称/地址...",
    },
  ];

  const columns: TableColumn<Hotel>[] = [
    {
      key: "name",
      label: "酒店名称",
    },
    {
      key: "city",
      label: "城市",
    },
    {
      key: "address",
      label: "地址",
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
          await deleteMutation.execute({ id: hotel.id });
          refetch();
        },
      },
    ];
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedHotel(null);
    refetch();
  };

  const handleResetFilters = () => {
    updateFilters({});
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

        <FilterPanel
          filters={filters()}
          onFiltersChange={updateFilters}
          options={filterOptions}
          onReset={handleResetFilters}
        />

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
