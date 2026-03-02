import { Show, createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { type Hotel, type CreateHotelInput } from "~/lib/types";
import { useCreateHotel, useUpdateHotel } from "~/lib/hotel-mutations";
import { Input } from "@repo/ui";

interface HotelFormProps {
  hotel: Hotel | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const HotelForm = (props: HotelFormProps) => {
  const [formData, setFormData] = createStore<CreateHotelInput>({
    name: "",
    city: "",
    country: "中国",
    address: "",
    description: "",
    phone: "",
    email: "",
  });

  const [errors, setErrors] = createStore<Record<string, string>>({});
  const [error, setError] = createSignal<string>("");
  const createMutation = useCreateHotel();
  const updateMutation = useUpdateHotel();

  createEffect(() => {
    if (props.hotel) {
      setFormData({
        name: props.hotel.name,
        city: props.hotel.city,
        country: "中国",
        address: props.hotel.address,
        description: props.hotel.description || "",
        phone: props.hotel.phone || "",
        email: props.hotel.email || "",
      });
    }
  }, [props.hotel]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "酒店名称不能为空";
    }
    if (!formData.country.trim()) {
      newErrors.country = "国家不能为空";
    }
    if (!formData.city.trim()) {
      newErrors.city = "城市不能为空";
    }
    if (!formData.address.trim()) {
      newErrors.address = "地址不能为空";
    }
    if (formData.phone && formData.phone.length > 20) {
      newErrors.phone = "联系电话格式不正确";
    }
    if (formData.email && !formData.email.includes("@")) {
      newErrors.email = "邮箱格式不正确";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validate()) return;

    const input = {
      name: formData.name,
      city: formData.city,
      country: formData.country,
      address: formData.address,
      description: formData.description,
      phone: formData.phone,
      email: formData.email,
    };

    setError("");

    try {
      if (props.hotel) {
        await updateMutation.execute({
          id: props.hotel.id,
          ...input,
        });
      } else {
        await createMutation.execute({ input });
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
            {props.hotel ? "编辑酒店" : "新建酒店"}
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
                  酒店名称 <span class="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入酒店名称"
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
                  国家 <span class="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入国家"
                  value={formData.country}
                  onInput={(e) => setFormData("country", e.currentTarget.value)}
                  error={!!errors.country}
                />
                <Show when={errors.country}>
                  <p class="mt-1 text-sm text-red-600">{errors.country}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">
                  所在城市 <span class="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入所在城市"
                  value={formData.city}
                  onInput={(e) => setFormData("city", e.currentTarget.value)}
                  error={!!errors.city}
                />
                <Show when={errors.city}>
                  <p class="mt-1 text-sm text-red-600">{errors.city}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">
                  详细地址 <span class="text-red-500">*</span>
                </label>
                <Input
                  placeholder="请输入详细地址"
                  value={formData.address}
                  onInput={(e) => setFormData("address", e.currentTarget.value)}
                  error={!!errors.address}
                />
                <Show when={errors.address}>
                  <p class="mt-1 text-sm text-red-600">{errors.address}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">联系电话</label>
                <Input
                  type="tel"
                  placeholder="请输入联系电话"
                  value={formData.phone}
                  onInput={(e) => setFormData("phone", e.currentTarget.value)}
                  error={!!errors.phone}
                />
                <Show when={errors.phone}>
                  <p class="mt-1 text-sm text-red-600">{errors.phone}</p>
                </Show>
              </div>

              <div class="form-group">
                <label class="block text-sm font-medium mb-2">邮箱</label>
                <Input
                  type="email"
                  placeholder="请输入邮箱"
                  value={formData.email}
                  onInput={(e) => setFormData("email", e.currentTarget.value)}
                  error={!!errors.email}
                />
                <Show when={errors.email}>
                  <p class="mt-1 text-sm text-red-600">{errors.email}</p>
                </Show>
              </div>

              <div class="form-group md:col-span-2">
                <label class="block text-sm font-medium mb-2">简介</label>
                <textarea
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#002f61] focus:border-transparent resize-y min-h-[100px]"
                  placeholder="请输入酒店简介，支持多行文本"
                  value={formData.description}
                  onInput={(e) =>
                    setFormData("description", e.currentTarget.value)
                  }
                  rows={4}
                />
              </div>
            </div>

            <Show when={error()}>
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
