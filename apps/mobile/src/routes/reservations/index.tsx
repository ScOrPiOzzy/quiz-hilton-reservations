import { createResource, Show, For, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { graphqlRequest, GET_RESERVATIONS, CANCEL_RESERVATION, authApi, getUserId } from "~/lib";
import { Building2, CalendarCheck, User, LogIn, CalendarX } from "lucide-solid";

interface Reservation {
  id: string;
  restaurantId: string;
  restaurant?: { id: string; name: string };
  hotelId: string;
  hotel?: { id: string; name: string };
  reservationDate: string;
  timeSlot: string;
  partySize?: number;
  tableType?: string;
  customer: { name: string; phone: string };
  specialRequests?: string;
  status: string;
  createdAt: string;
}

async function fetchReservations(): Promise<Reservation[]> {
  if (typeof window === "undefined") {
    return [];
  }

  const userId = getUserId();
  const data = await graphqlRequest<{ myReservations: Reservation[] }>(
    GET_RESERVATIONS,
    { userId }
  );
  return data.myReservations as Reservation[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  REQUESTED: { label: "待确认", color: "bg-yellow-100 text-yellow-800" },
  PENDING: { label: "待确认", color: "bg-yellow-100 text-yellow-800" },
  CONFIRMED: { label: "已确认", color: "bg-green-100 text-green-800" },
  APPROVED: { label: "已确认", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "已取消", color: "bg-red-100 text-red-800" },
  COMPLETED: { label: "已完成", color: "bg-blue-100 text-blue-800" },
};

export default function Reservations() {
  const [clientLoaded, setClientLoaded] = createSignal(false);

  onMount(() => {
    setClientLoaded(true);
  });

  const [reservations, { refetch }] = createResource(
    () => clientLoaded(),
    async (loaded) => {
      if (!loaded || !authApi.isAuthenticated()) return [];
      return fetchReservations();
    },
  );

  const isLoggedIn = () => clientLoaded() && authApi.isAuthenticated();

  const canCancelReservation = (reservation: Reservation) => {
    return reservation.status !== "COMPLETED" && reservation.status !== "CANCELLED";
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (confirm("确定要取消此预约吗？")) {
      try {
        await graphqlRequest<{ cancelReservation: boolean }>(
          CANCEL_RESERVATION,
          { id: reservationId }
        );
        refetch();
      } catch (error) {
        console.error("取消预约失败:", error);
        alert("取消预约失败，请重试");
      }
    }
  };

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 class="text-lg font-bold text-gray-900">我的预约</h1>
          <Show when={isLoggedIn}>
            <button onClick={() => refetch()} class="text-sm text-blue-600">
              刷新
            </button>
          </Show>
        </div>
      </div>

      {/* 未登录提示 */}
      <Show when={!isLoggedIn()}>
        <div class="max-w-md mx-auto px-4 py-8">
          <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <LogIn size={64} class="mx-auto mb-4 text-gray-400" />
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
                      <h3 class="font-semibold text-gray-900">
                        {reservation.restaurant?.name ||
                          reservation.restaurantId}
                      </h3>
                      <p class="text-sm text-gray-500">
                        {reservation.hotel?.name || reservation.hotelId}
                      </p>
                    </div>
                    <span
                      class={`px-2 py-1 text-xs rounded-full ${statusMap[reservation.status]?.color || "bg-gray-100 text-gray-800"}`}
                    >
                      {statusMap[reservation.status]?.label ||
                        reservation.status}
                    </span>
                  </div>

                  <div class="space-y-2 text-sm">
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">预约时间：</span>
                      <span>
                        {reservation.reservationDate} {reservation.timeSlot}
                      </span>
                    </div>
                    <Show when={reservation.partySize}>
                      <div class="flex items-center text-gray-700">
                        <span class="w-20 text-gray-500">人数：</span>
                        <span>{reservation.partySize}人</span>
                      </div>
                    </Show>
                    <Show when={reservation.tableType}>
                      <div class="flex items-center text-gray-700">
                        <span class="w-20 text-gray-500">桌型：</span>
                        <span>{reservation.tableType}</span>
                      </div>
                    </Show>
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">预约人：</span>
                      <span>{reservation.customer?.name}</span>
                    </div>
                    <div class="flex items-center text-gray-700">
                      <span class="w-20 text-gray-500">预留电话：</span>
                      <span>{reservation.customer?.phone}</span>
                    </div>
                    <Show when={reservation.specialRequests}>
                      <div class="flex items-start text-gray-700">
                        <span class="w-20 text-gray-500">备注：</span>
                        <span>{reservation.specialRequests}</span>
                      </div>
                    </Show>
                  </div>

                  <div class="mt-3 pt-3 border-t text-xs text-gray-400">
                    创建时间：{new Date(reservation.createdAt).toLocaleString()}
                  </div>

                  <Show when={canCancelReservation(reservation)}>
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      class="mt-3 w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 active:bg-red-200 transition-colors"
                    >
                      取消预约
                    </button>
                  </Show>
                </div>
              )}
            </For>

            <Show when={reservations()?.length === 0}>
              <div class="bg-white rounded-lg shadow-sm p-8 text-center">
                <CalendarX size={64} class="mx-auto mb-4 text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  暂无预约
                </h3>
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
          <A
            href="/"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <Building2 size={24} />
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A
            href="/reservations"
            class="flex-1 flex flex-col items-center py-2 text-blue-600"
          >
            <CalendarCheck size={24} />
            <span class="text-xs mt-1">预约</span>
          </A>
          <A
            href="/profile"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <User size={24} />
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
