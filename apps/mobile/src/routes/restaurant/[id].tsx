import { createSignal, createResource, Show, For } from "solid-js";
import { A, useParams, useNavigate } from "@solidjs/router";
import { graphqlRequest, GET_RESTAURANT_DETAIL, CREATE_RESERVATION, authApi } from "~/lib";

interface Restaurant {
  id: string;
  name: string;
  hotelId: string;
  hotelName: string;
  cuisine: string;
  openingHours: string;
  description: string;
  images: string[];
  timeSlots: string[];
}

interface CreateReservationInput {
  restaurantId: string;
  date: string;
  timeSlot: string;
  partySize?: number;
  tableType?: string;
  name: string;
  phone: string;
  specialRequests?: string;
}

async function fetchRestaurantDetail(id: string): Promise<Restaurant | null> {
  if (typeof window === 'undefined') {
    return null;
  }
  
  const data = await graphqlRequest<{ restaurant: Restaurant }>(GET_RESTAURANT_DETAIL, { id });
  return data.restaurant as Restaurant;
}

export default function RestaurantDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [restaurant] = createResource(() => params.id, fetchRestaurantDetail);
  
  const getHotelId = () => restaurant()?.hotelId || "";
  const getHotelName = () => restaurant()?.hotelName || "";
  
  const [selectedDate, setSelectedDate] = createSignal("");
  const [selectedTime, setSelectedTime] = createSignal("");
  const [partySize, setPartySize] = createSignal(2);
  const [tableType, setTableType] = createSignal("");
  const [name, setName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [specialRequests, setSpecialRequests] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");
  const [success, setSuccess] = createSignal(false);

  const tableTypes = [
    { value: "", label: "不限" },
    { value: "大厅", label: "大厅" },
    { value: "包厢", label: "包厢" },
    { value: "靠窗", label: "靠窗" },
    { value: "露台", label: "露台" },
  ];

  const handleReservation = async (e: Event) => {
    e.preventDefault();
    
    if (!selectedDate() || !selectedTime() || !name() || !phone()) {
      setError("请填写所有必填项");
      return;
    }

    if (!authApi.isAuthenticated()) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const input = {
        restaurantId: params.id,
        date: selectedDate(),
        timeSlot: selectedTime(),
        partySize: partySize(),
        tableType: tableType(),
        name: name(),
        phone: phone(),
        specialRequests: specialRequests(),
      };
      
      await graphqlRequest(CREATE_RESERVATION, { input });
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "预约失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center">
          <A href={`/hotel/${getHotelId()}`} class="text-blue-600 mr-4">
            ←
          </A>
          <h1 class="text-lg font-bold text-gray-900 truncate">
            {restaurant()?.name || "餐厅详情"}
          </h1>
        </div>
      </div>

      <Show when={restaurant.loading}>
        <div class="text-center py-8 text-gray-500">加载中...</div>
      </Show>

      <Show when={restaurant.error}>
        <div class="text-center py-8 text-red-500">加载失败</div>
      </Show>

      <Show when={restaurant()}>
        {/* 餐厅图片 */}
        <div class="relative">
          <img
            src={restaurant()!.images?.[0] || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"}
            alt={restaurant()!.name}
            class="w-full h-64 object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <A href={`/hotel/${getHotelId()}`} class="text-white font-semibold hover:underline">
              {getHotelName()}
            </A>
          </div>
        </div>

        {/* 餐厅信息 */}
        <div class="max-w-md mx-auto px-4 py-4">
          <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="mb-3">
              <div class="flex items-center">
                <span class="text-lg font-bold text-gray-900">{restaurant()!.name}</span>
              </div>
              <p class="text-sm text-gray-500">{restaurant()!.cuisine}</p>
              <p class="text-sm text-gray-400">🕐 {restaurant()!.openingHours}</p>
            </div>

            <p class="text-gray-700 leading-relaxed">{restaurant()!.description}</p>
          </div>

          {/* 预约表单 */}
          <Show when={!success()}>
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 class="font-semibold text-gray-900 mb-3">预约订座</h3>
              
              <Show when={!authApi.isAuthenticated()}>
                <div class="mb-4 p-3 bg-yellow-50 rounded-lg">
                  <p class="text-sm text-yellow-800">
                    请先 <A href="/login" class="text-blue-600 underline">登录</A> 进行预约
                  </p>
                </div>
              </Show>

              <form onSubmit={handleReservation} class="space-y-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    预约日期
                  </label>
                  <input
                    type="date"
                    value={selectedDate()}
                    onInput={(e) => setSelectedDate((e.target as HTMLInputElement).value)}
                    min={new Date().toISOString().split('T')[0]}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    预约时间
                  </label>
                  <div class="grid grid-cols-4 gap-2">
                    <For each={restaurant()!.timeSlots || ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30"]}>
                      {(time) => (
                        <button
                          type="button"
                          onClick={() => setSelectedTime(time)}
                          class={`py-2 px-1 text-sm rounded-lg border ${
                            selectedTime() === time
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {time}
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    用餐人数
                  </label>
                  <div class="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        type="button"
                        onClick={() => setPartySize(num)}
                        class={`py-2 text-sm rounded-lg border ${
                          partySize() === num
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    餐桌类型
                  </label>
                  <div class="grid grid-cols-3 gap-2">
                    <For each={tableTypes}>
                      {(type) => (
                        <button
                          type="button"
                          onClick={() => setTableType(type.value)}
                          class={`py-2 text-sm rounded-lg border ${
                            tableType() === type.value
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {type.label}
                        </button>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={name()}
                    onInput={(e) => setName((e.target as HTMLInputElement).value)}
                    placeholder="您的姓名"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    手机号
                  </label>
                  <input
                    type="tel"
                    value={phone()}
                    onInput={(e) => setPhone((e.target as HTMLInputElement).value)}
                    placeholder="138****8888"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    特殊要求（可选）
                  </label>
                  <textarea
                    value={specialRequests()}
                    onInput={(e) => setSpecialRequests((e.target as HTMLTextAreaElement).value)}
                    placeholder="请告知您的特殊要求，如过敏信息、座位偏好等"
                    rows={3}
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {error() && (
                  <div class="text-red-500 text-sm">{error()}</div>
                )}

                <button
                  type="submit"
                  disabled={loading()}
                  class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400"
                >
                  {loading() ? "提交中..." : "确认预约"}
                </button>
              </form>
            </div>
          </Show>

          <Show when={success()}>
            <div class="bg-white rounded-lg shadow-sm p-8 mb-4 text-center">
              <div class="text-5xl mb-4">✅</div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">预约成功！</h3>
              <p class="text-gray-600 mb-4">
                您的餐厅预约已成功提交，我们将尽快与您确认。
              </p>
              <div class="space-y-2">
                <A
                  href="/reservations"
                  class="block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
                >
                  查看我的预约
                </A>
                <A
                  href="/"
                  class="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200"
                >
                  返回首页
                </A>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
