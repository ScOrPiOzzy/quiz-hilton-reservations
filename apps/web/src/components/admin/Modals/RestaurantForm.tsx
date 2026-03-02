import { Show, For, createSignal, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { type Restaurant, type Hotel, type Area } from "~/lib/types";
import { Input, Button } from "@repo/ui";
import { useGetHotels } from "~/hooks/admin/useRestaurantList";
import { 
  useCreateRestaurant, 
  useUpdateRestaurant,
  useGetAreasByRestaurant,
  useCreateArea,
  useUpdateArea,
  useDeleteArea 
} from "~/lib/restaurant-mutations";

interface RestaurantFormProps {
  restaurant: Restaurant | null;
  hotelId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const RestaurantForm = (props: RestaurantFormProps) => {
  const [formData, setFormData] = createStore({
    name: "",
    type: "HALL" as "HALL" | "PRIVATE_ROOM",
    hotelId: "",
    description: "",
    capacity: 0,
  });

  const [areas, setAreas] = createSignal<Area[]>([]);
  const [showAreaModal, setShowAreaModal] = createSignal(false);
  const [editingArea, setEditingArea] = createSignal<Area | null>(null);
  const [areaForm, setAreaForm] = createStore({
    name: "",
    type: "PRIVATE_ROOM",
    capacity: 0,
    minimumCapacity: 0,
  });

  const [errors, setErrors] = createStore<Record<string, string>>({});
  const [error, setError] = createSignal("");
  const [loadingAreas, setLoadingAreas] = createSignal(false);
  
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const { hotels } = useGetHotels();
  
  const areasQuery = useGetAreasByRestaurant();
  const createAreaMutation = useCreateArea();
  const updateAreaMutation = useUpdateArea();
  const deleteAreaMutation = useDeleteArea();

  const loadAreas = async () => {
    if (props.restaurant?.id) {
      setLoadingAreas(true);
      try {
        const result = await areasQuery.execute({ restaurantId: props.restaurant.id });
        if (result.data?.areasByRestaurant) {
          setAreas(result.data.areasByRestaurant);
        }
      } catch (e) {
        console.error("Failed to load areas:", e);
      } finally {
        setLoadingAreas(false);
      }
    }
  };

  createEffect(() => {
    if (props.restaurant) {
      setFormData({
        name: props.restaurant.name,
        type: props.restaurant.type,
        hotelId: props.restaurant.hotelId || "",
        description: props.restaurant.description || "",
        capacity: props.restaurant.capacity || 0,
      });
      loadAreas();
    } else if (props.hotelId) {
      setFormData("hotelId", props.hotelId);
    }
  }, [props.restaurant, props.hotelId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "餐厅名称不能为空";
    }
    if (!formData.type) {
      newErrors.type = "请选择餐厅类型";
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = "大厅容量必须大于0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validate()) return;

    setError("");

    try {
      const input = {
        name: formData.name,
        type: formData.type,
        hotelId: formData.hotelId,
        description: formData.description,
        capacity: formData.capacity,
      };

      if (props.restaurant) {
        await updateMutation.execute({
          id: props.restaurant.id,
          ...input,
        });
      } else {
        await createMutation.execute(input);
      }

      props.onSuccess();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const openAreaModal = (area?: Area) => {
    if (area) {
      setEditingArea(area);
      setAreaForm({
        name: area.name,
        type: area.type || "PRIVATE_ROOM",
        capacity: area.capacity || 0,
        minimumCapacity: area.minimumCapacity || 0,
      });
    } else {
      setEditingArea(null);
      setAreaForm({
        name: "",
        type: "PRIVATE_ROOM",
        capacity: 0,
        minimumCapacity: 0,
      });
    }
    setShowAreaModal(true);
  };

  const handleAreaSubmit = async (e: Event) => {
    e.preventDefault();
    
    if (!areaForm.name.trim()) {
      alert("请输入包厢名称");
      return;
    }
    if (areaForm.capacity <= 0) {
      alert("请输入有效的容纳人数");
      return;
    }

    try {
      if (editingArea()) {
        await updateAreaMutation.execute({
          id: editingArea()!.id,
          name: areaForm.name,
          type: areaForm.type,
          capacity: areaForm.capacity,
          minimumCapacity: areaForm.minimumCapacity,
        });
      } else {
        await createAreaMutation.execute({
          restaurantId: props.restaurant!.id,
          name: areaForm.name,
          type: areaForm.type,
          capacity: areaForm.capacity,
          minimumCapacity: areaForm.minimumCapacity,
        });
      }
      
      setShowAreaModal(false);
      loadAreas();
    } catch (e) {
      alert(e instanceof Error ? e.message : "操作失败");
    }
  };

  const handleDeleteArea = async (area: Area) => {
    if (confirm(`确定要删除包厢 "${area.name}" 吗？`)) {
      try {
        await deleteAreaMutation.execute({ id: area.id });
        loadAreas();
      } catch (e) {
        alert(e instanceof Error ? e.message : "删除失败");
      }
    }
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={props.onClose}>
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div class="flex justify-between items-center p-6 border-b">
          <h2 class="text-xl font-bold">
            {props.restaurant ? "编辑餐厅" : "新建餐厅"}
          </h2>
          <button
            onClick={props.onClose}
            class="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Show when={!props.hotelId}>
                <div class="form-group">
                  <label class="block text-sm font-medium mb-2">
                    所属酒店 <span class="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hotelId}
                    onInput={(e) => setFormData("hotelId", e.currentTarget.value)}
                    class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#002f61]"
                  >
                    <option value="">请选择酒店</option>
                    <For each={hotels()}>
                      {(hotel) => (
                        <option value={hotel.id}>
                          {hotel.name}
                        </option>
                      )}
                    </For>
                  </select>
                </div>
              </Show>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">
                  餐厅名称 <span class="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入餐厅名称"
                  value={formData.name}
                  onInput={(e) => setFormData("name", e.currentTarget.value)}
                  error={!!errors.name}
                />
                <Show when={errors.name}>
                  <p class="mt-1 text-sm text-red-600">{errors.name}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">
                  餐厅类型 <span class="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onInput={(e) =>
                    setFormData("type", e.currentTarget.value as "HALL" | "PRIVATE_ROOM")
                  }
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#002f61]"
                >
                  <option value="HALL">大厅</option>
                  <option value="PRIVATE_ROOM">包厢</option>
                </select>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">
                  大厅可容纳人数 <span class="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="大厅可容纳人数"
                  value={formData.capacity}
                  onInput={(e) =>
                    setFormData("capacity", parseInt(e.currentTarget.value) || 0)
                  }
                  error={!!errors.capacity}
                />
                <Show when={errors.capacity}>
                  <p class="mt-1 text-sm text-red-600">{errors.capacity}</p>
                </Show>
                <p class="mt-1 text-xs text-gray-500">设置大厅可容纳的用餐人数</p>
              </div>

              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium mb-2">简介</label>
                <textarea
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#002f61] focus:border-transparent resize-y min-h-[100px]"
                  placeholder="请输入餐厅简介，支持多行文本"
                  value={formData.description}
                  onInput={(e) =>
                    setFormData("description", e.currentTarget.value)
                  }
                  rows={4}
                />
              </div>
            </div>

            {/* 包厢管理 */}
            <Show when={props.restaurant?.id}>
              <div class="border-t pt-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">包厢管理</h3>
                  <Button
                    type="button"
                    onClick={() => openAreaModal()}
                    size="sm"
                  >
                    + 添加包厢
                  </Button>
                </div>

                <Show when={loadingAreas()}>
                  <div class="text-center py-4 text-gray-500">加载中...</div>
                </Show>

                <Show when={!loadingAreas() && areas().length === 0}>
                  <div class="text-center py-4 text-gray-500 bg-gray-50 rounded">
                    暂无包厢，点击"添加包厢"创建
                  </div>
                </Show>

                <Show when={!loadingAreas() && areas().length > 0}>
                  <div class="space-y-2">
                    <For each={areas()}>
                      {(area) => (
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span class="font-medium">{area.name}</span>
                            <span class="ml-2 text-sm text-gray-500">
                              容纳 {area.capacity} 人
                              {area.minimumCapacity ? ` (最少${area.minimumCapacity}人)` : ""}
                            </span>
                          </div>
                          <div class="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openAreaModal(area)}
                              class="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteArea(area)}
                              class="text-red-600 hover:text-red-800 text-sm"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </div>
            </Show>

            <Show when={Object.keys(errors).length > 0 || error()}>
              <div class="p-4 mb-4 bg-red-50 text-red-700 rounded">
                {createMutation.loading()
                  ? "创建中..."
                  : updateMutation.loading()
                  ? "更新中..."
                  : error()}
              </div>
            </Show>

            <div class="flex justify-end gap-2 p-6 border-t bg-gray-50">
              <button
                type="button"
                onClick={props.onClose}
                class="px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={createMutation.loading() || updateMutation.loading()}
                class="px-4 py-2 bg-[#002f61] text-white rounded hover:bg-[#002450] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.loading() || updateMutation.loading()
                  ? "提交中..."
                  : "保存"}
              </button>
            </div>
          </div>
        </form>

        {/* 包厢 Modal */}
        <Show when={showAreaModal()}>
          <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]" onClick={() => setShowAreaModal(false)}>
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div class="flex justify-between items-center p-4 border-b">
                <h3 class="text-lg font-bold">
                  {editingArea() ? "编辑包厢" : "添加包厢"}
                </h3>
                <button
                  onClick={() => setShowAreaModal(false)}
                  class="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleAreaSubmit}>
                <div class="p-4 space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-2">
                      包厢名称 <span class="text-red-500">*</span>
                    </label>
                    <Input
                      placeholder="例如：VIP包厢、豪华包厢"
                      value={areaForm.name}
                      onInput={(e) => setAreaForm("name", e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">
                      可容纳人数 <span class="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      placeholder="可容纳人数"
                      value={areaForm.capacity}
                      onInput={(e) => setAreaForm("capacity", parseInt(e.currentTarget.value) || 0)}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-2">
                      最少人数（可选）
                    </label>
                    <Input
                      type="number"
                      placeholder="最少需要的人数"
                      value={areaForm.minimumCapacity}
                      onInput={(e) => setAreaForm("minimumCapacity", parseInt(e.currentTarget.value) || 0)}
                    />
                    <p class="mt-1 text-xs text-gray-500">设置包厢最少需要预订的人数</p>
                  </div>
                </div>
                <div class="flex justify-end gap-2 p-4 border-t bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowAreaModal(false)}
                    class="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    disabled={createAreaMutation.loading() || updateAreaMutation.loading()}
                    class="px-4 py-2 bg-[#002f61] text-white rounded hover:bg-[#002450] disabled:opacity-50"
                  >
                    {createAreaMutation.loading() || updateAreaMutation.loading()
                      ? "保存中..."
                      : "保存"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};
