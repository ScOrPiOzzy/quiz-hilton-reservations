import { Show, For, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { type Restaurant, type Hotel } from "~/lib/types";
import { Input } from "@repo/ui";
import { useGetHotels } from "~/hooks/admin/useRestaurantList";
import { useCreateRestaurant, useUpdateRestaurant } from "~/lib/restaurant-mutations";

interface RestaurantFormProps {
  restaurant: Restaurant | null;
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

  const [errors, setErrors] = createStore<Record<string, string>>({});
  const [error, setError] = createSignal("");
  const createMutation = useCreateRestaurant();
  const updateMutation = useUpdateRestaurant();
  const { hotels, hotelsLoading: hotelLoading } = useGetHotels();

  createEffect(() => {
    if (props.restaurant) {
      setFormData({
        name: props.restaurant.name,
        type: props.restaurant.type,
        hotelId: props.restaurant.hotelId || "",
        description: props.restaurant.description || "",
        capacity: props.restaurant.capacity || 0,
      });
    }
  }, [props.restaurant]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "餐厅名称不能为空";
    }
    if (!formData.type) {
      newErrors.type = "请选择餐厅类型";
    }
    if (formData.capacity <= 0) {
      newErrors.capacity = "容量必须大于0";
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

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={props.onClose}>
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                <Show when={errors.hotelId}>
                  <p class="mt-1 text-sm text-red-600">{errors.hotelId}</p>
                </Show>
              </div>

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
                <Show when={errors.type}>
                  <p class="mt-1 text-sm text-red-600">{errors.type}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">容量</label>
                <Input
                  type="number"
                  placeholder="请输入容量"
                  value={formData.capacity}
                  onInput={(e) =>
                    setFormData("capacity", parseInt(e.currentTarget.value) || 0)
                  }
                  error={!!errors.capacity}
                />
                <Show when={errors.capacity}>
                  <p class="mt-1 text-sm text-red-600">{errors.capacity}</p>
                </Show>
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
      </div>
    </div>
  );
};
