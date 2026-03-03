import { createResource, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { graphqlRequest, GET_RESERVATIONS, authApi } from "~/lib";

interface Reservation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  hotelId: string;
  hotelName: string;
  date: string;
  timeSlot: string;
  name: string;
  phone: string;
  specialRequests?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

async function fetchReservations(): Promise<Reservation[]> {
  if (typeof window === 'undefined') {
    return [];
  }
  
  const data = await graphqlRequest<{ reservations: Reservation[] }>(GET_RESERVATIONS);
  return data.reservations as Reservation[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "待确认", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "已确认", color: "bg-green-100 text-green-800" },
  cancelled: { label: "已取消", color: "bg-red-100 text-red-800" },
};

export default function Reservations() {
  const isLoggedIn = authApi.isAuthenticated();
  const [reservations, { refetch }] = createResource(
    async () => {
      if (!isLoggedIn) return [];
      return fetchReservations();
    }
  );

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 class="text-lg font-bold text-gray-900">我的预约</h1>
          <Show when={isLoggedIn}>
            <button 
              onClick={() => refetch()}
              class="text-sm text-blue-600"
            >
              刷新
            </button>
          </Show>
        </div>
      </div>

      {/* 未登录提示 */}
      <Show when={!isLoggedIn}>
        <div class="max-w-md mx-auto px-4 py-8">
          <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="text-5xl mb-4">L</div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">请先登录</h2>
            <p class="text-gray-600 mb-4">登录后查看您的餐厅预约</p>
            <A
              href="/login"
              class="inline-block w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              立即登录
            </A>
          </div>
        </div>
      </Show>

      {/* 预约列表 */}
      <Show when={isLoggedIn}>
        <div class="max-w-md mx-auto px-4 py-4 space-y-4">
          <Show when={reservations.loading}>
            <div class="text-center py-8 text-gray-500">加载中...</div>
          </Show>
          
          <Show when={reservations.error}>
            <div class="text-center py-8 text-red-500">加载失败，请重试</div>
          </Show>
          
          <Show when={!reservations.loading && reservations()}>
            <For each={reservations()}>
              {(reservation) => (
                <div class="bg-white rounded-lg shadow-sm p-4">
                  <div class="flex justify-between items-start mb-3">
                    <div>
                      <h3 class="font-semibold text-gray-900">{reservation.restaurantName}</h3>
                      <p class="text-sm text-gray-500">{reservation.hotelName}</p>
                    </div>
                    <span class={`px-2 py-1 text-xs rounded-full ${statusMap[reservation.status]?.color || "bg-gray-100 text-gray-800"}`}>
                      {statusMap[reservation.status]?.label || reservation.status}
                    </span>
                  </div>
                  
                  <div class="space-y-2 text-sm">
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">日期：</span>
                      <span>{reservation.date}</span>
                    </div>
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">时间：</span>
                      <span>{reservation.timeSlot}</span>
                    </div>
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">姓名：</span>
                      <span>{reservation.name}</span>
                    </div>
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">电话：</span>
                      <span>{reservation.phone}</span>
                    </div>
                    <Show when={reservation.specialRequests}>
                      <div class="flex items-start text-gray-700">
                        <span class="w-20 text-gray-500">备注：</span>
                        <span>{reservation.specialRequests}</span>
                      </div>
                    </Show>
                  </div>
                  
                  <div class="mt-3 pt-3 border-t text-xs text-gray-400">
                    预约时间：{new Date(reservation.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </For>
            
            <Show when={reservations()?.length === 0}>
              <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <div class="text-5xl mb-4">N</div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无预约</h3>
                <p class="text-gray-500 mb-4">快去选择一家餐厅预约吧</p>
                <A
                  href="/"
                  class="inline-block bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
                >
                  浏览酒店
                </A>
              </div>
            </Show>
          </Show>
        </div>
      </Show>

      {/* 底部导航栏 */}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div class="max-w-md mx-auto flex">
          <A href="/" class="flex-1 flex flex-col items-center py-2 text-gray-600">
            <span class="text-xl">H</span>
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A href="/reservations" class="flex-1 flex flex-col items-center py-2 text-blue-600">
            <span class="text-xl">R</span>
            <span class="text-xs mt-1">预约</span>
          </A>
          <A href="/profile" class="flex-1 flex flex-col items-center py-2 text-gray-600">
            <span class="text-xl">P</span>
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
