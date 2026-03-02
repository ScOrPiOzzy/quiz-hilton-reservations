import { createSignal } from "solid-js";
import { A } from "@solidjs/router";

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  price: number;
  image: string;
}

export default function Index() {
  const [hotels, setHotels] = createSignal<Hotel[]>([
    {
      id: "1",
      name: "希尔顿酒店 (上海)",
      location: "上海外滩",
      rating: 4.8,
      price: 1288,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099925?w=400",
    },
    {
      id: "2",
      name: "希尔顿酒店 (北京)",
      location: "北京王府井",
      rating: 4.7,
      price: 1199,
      image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400",
    },
    {
      id: "3",
      name: "希尔顿酒店 (广州)",
      location: "广州天河",
      rating: 4.6,
      price: 1088,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400",
    },
  ]);

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
            placeholder="搜索酒店..."
            class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 酒店列表 */}
      <div class="max-w-md mx-auto px-4 py-4 space-y-4">
        {hotels().map((hotel) => (
          <A
            href={`/hotel/${hotel.id}`}
            class="block bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="flex">
              <img
                src={hotel.image}
                alt={hotel.name}
                class="w-32 h-32 object-cover"
              />
              <div class="flex-1 p-4">
                <h2 class="font-semibold text-gray-900 mb-1">{hotel.name}</h2>
                <p class="text-sm text-gray-500 mb-2">{hotel.location}</p>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <span class="text-yellow-500">★</span>
                    <span class="ml-1 text-sm text-gray-700">{hotel.rating}</span>
                  </div>
                  <span class="text-lg font-bold text-blue-600">
                    ¥{hotel.price}
                    <span class="text-sm font-normal text-gray-500">/晚</span>
                  </span>
                </div>
              </div>
            </div>
          </A>
        ))}
      </div>

      {/* 底部导航栏 */}
      <div class="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div class="max-w-md mx-auto flex">
          <A
            href="/"
            class="flex-1 flex flex-col items-center py-2 text-blue-600"
          >
            <span class="text-xl">🏨</span>
            <span class="text-xs mt-1">酒店</span>
          </A>
          <A
            href="/profile"
            class="flex-1 flex flex-col items-center py-2 text-gray-600"
          >
            <span class="text-xl">👤</span>
            <span class="text-xs mt-1">我的</span>
          </A>
        </div>
      </div>
    </div>
  );
}
