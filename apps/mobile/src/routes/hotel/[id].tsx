import { createResource, Show, For, onMount, createSignal } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { graphqlRequest, GET_HOTEL_DETAIL, type ImageType } from "~/lib";

interface Restaurant {
  id: string;
  name: string;
  type: string;
  description: string;
  hotelId: string;
  hotel?: { id: string; name: string };
  images: ImageType[];
}

interface Hotel {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  images: ImageType[];
  restaurants?: Restaurant[];
}

async function fetchHotelDetail(id: string): Promise<Hotel | null> {
  const data = await graphqlRequest<{ hotel: Hotel }>(GET_HOTEL_DETAIL, { id });
  return data.hotel as Hotel;
}

export default function HotelDetail() {
  const params = useParams();
  const [clientLoaded, setClientLoaded] = createSignal(false);
  const [hotel] = createResource(() => clientLoaded() ? params.id : null, async (id) => {
    if (!id) return null;
    return fetchHotelDetail(id);
  });

  onMount(() => {
    setClientLoaded(true);
  });

  return (
    <div class="min-h-screen bg-gray-50 pb-32">
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center">
          <A href="/" class="text-blue-600 mr-4">返回</A>
          <h1 class="text-lg font-bold text-gray-900 truncate">
            {hotel()?.name || "酒店详情"}
          </h1>
        </div>
      </div>

      <Show when={hotel.loading}>
        <div class="text-center py-8 text-gray-500">加载中...</div>
      </Show>

      <Show when={hotel.error}>
        <div class="text-center py-8 text-red-500">加载失败</div>
      </Show>

      <Show when={hotel()}>
        <div class="relative">
          <img
            src={hotel()!.images?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099925?w=800"}
            alt={hotel()!.name}
            class="w-full h-64 object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p class="text-white font-semibold">{hotel()!.city} - {hotel()!.address}</p>
          </div>
        </div>

        <div class="max-w-md mx-auto px-4 py-4">
          <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div class="flex items-center justify-between mb-3">
              <div>
                <div class="flex items-center">
                  <span class="text-yellow-500 text-xl">*****</span>
                  <span class="ml-2 text-lg font-bold text-gray-900">4.8</span>
                </div>
                <p class="text-sm text-gray-500">1234 条评价</p>
              </div>
            </div>

            <p class="text-gray-700 leading-relaxed">{hotel()!.description}</p>

            <Show when={hotel()!.amenities && hotel()!.amenities.length > 0}>
              <div class="mt-4 pt-4 border-t">
                <h3 class="font-semibold text-gray-900 mb-3">酒店设施</h3>
                <div class="grid grid-cols-2 gap-2">
                  <For each={hotel()!.amenities}>
                    {(amenity) => (
                      <div class="flex items-center text-sm text-gray-700">
                        <span class="mr-2">+</span>
                        {amenity}
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>
          </div>

          <Show when={hotel()!.images && hotel()!.images.length > 1}>
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 class="font-semibold text-gray-900 mb-3">酒店图片</h3>
              <div class="flex gap-2 overflow-x-auto">
                <For each={hotel()!.images}>
                  {(image) => (
                    <img
                      src={image.url}
                      alt={hotel()!.name}
                      class="w-32 h-24 object-cover rounded flex-shrink-0"
                    />
                  )}
                </For>
              </div>
            </div>
          </Show>

          <Show when={hotel()!.restaurants && hotel()!.restaurants!.length > 0}>
            <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
              <h3 class="font-semibold text-gray-900 mb-3">酒店餐厅</h3>
              <div class="space-y-3">
                <For each={hotel()!.restaurants}>
                  {(restaurant) => (
                    <A
                      href={`/restaurant/${restaurant.id}`}
                      class="block border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div class="flex">
                        <div class="w-24 h-20 flex-shrink-0 overflow-hidden rounded-l-lg">
                          <Show when={restaurant.images && restaurant.images.length > 0} fallback={
                            <img
                              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200"
                              alt={restaurant.name}
                              class="w-full h-full object-cover"
                            />
                          }>
                            <img
                              src={restaurant.images[0].url}
                              alt={restaurant.name}
                              class="w-full h-full object-cover"
                            />
                          </Show>
                        </div>
                        <div class="flex-1 p-3">
                          <h4 class="font-medium text-gray-900">{restaurant.name}</h4>
                          <p class="text-sm text-gray-500">{restaurant.type}</p>
                          <p class="text-xs text-gray-400 truncate">{restaurant.description}</p>
                        </div>
                        <div class="flex items-center pr-3">
                          <span class="bg-blue-600 text-white text-sm px-3 py-1.5 rounded">预约</span>
                        </div>
                      </div>
                    </A>
                  )}
                </For>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  );
}
