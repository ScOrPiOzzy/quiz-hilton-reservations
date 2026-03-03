import { createSignal, createResource, Show, For, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { graphqlRequest, GET_HOTELS } from "~/lib";

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  images: string[];
  amenities: string[];
}

async function fetchHotels(): Promise<Hotel[]> {
  const data = await graphqlRequest<{ hotels: { items: Hotel[] } }>(GET_HOTELS, { limit: 20 });
  return data.hotels.items as Hotel[];
}

export default function Index() {
  const [clientLoaded, setClientLoaded] = createSignal(false);
  const [hotels] = createResource(clientLoaded, async (loaded) => {
    if (!loaded) return [];
    return fetchHotels();
  });
  const [searchCity, setSearchCity] = createSignal("");

  onMount(() => {
    setClientLoaded(true);
  });

  return (
    <div class="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3">
          <h1 class="text-xl font-bold text-gray-900">Hilton Reservations</h1>
        </div>
      </div>

      {/* 搜索栏 */}
      <div class="bg-white border-b">
        <div class="max-w-md mx-auto px-4 py-3">
          <input
            type="text"
            placeholder="搜索城市..."
            value={searchCity()}
            onInput={(e) => setSearchCity((e.target as HTMLInputElement).value)}
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 酒店列表 */}
      <div class="max-w-md mx-auto px-4 py-4 space-y-4">
        <Show when={hotels.loading}>
          <div class="text-center py-8 text-gray-500">加载中...</div>
        </Show>
        
        <Show when={hotels.error}>
          <div class="text-center py-8 text-red-500">加载失败，请重试</div>
        </Show>
        
        <Show when={!hotels.loading && hotels()}>
          <For each={hotels()}>
            {(hotel) => (
              <A
                href={`/hotel/${hotel.id}`}
                class="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div class="flex">
                  <img
                    src={hotel.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099925?w=400"}
                    alt={hotel.name}
                    class="w-32 h-32 object-cover"
                  />
                  <div class="flex-1 p-4">
                    <h2 class="font-semibold text-gray-900 mb-1">{hotel.name}</h2>
                    <p class="text-sm text-gray-500 mb-2">{hotel.city} - {hotel.address}</p>
                    <div class="flex items-center justify-between">
                      <div class="flex items-center">
                        <span class="text-yellow-500">★</span>
                        <span class="ml-1 text-sm text-gray-700">4.8</span>
                      </div>
                      <span class="text-lg font-bold text-blue-600">
                        查看详情
                      </span>
                    </div>
                  </div>
                </div>
              </A>
            )}
          </For>
          
          <Show when={hotels()?.length === 0}>
            <div class="text-center py-8 text-gray-500">暂无酒店数据</div>
          </Show>
        </Show>
      </div>

      {/* 底部导航栏 */}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div class="max-w-md mx-auto flex">
          <A
            href="/"
            class="flex-1 flex flex-col items-center py-2 text-blue-600"
          >
            <span class="text-xl">H</span>
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A
            href="/reservations"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <span class="text-xl">R</span>
            <span class="text-xs mt-1">预约</span>
          </A>
          <A
            href="/profile"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <span class="text-xl">P</span>
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
