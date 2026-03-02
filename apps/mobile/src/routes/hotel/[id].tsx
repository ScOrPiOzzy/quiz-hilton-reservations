import { createSignal } from "solid-js";
import { A, useParams, useNavigate } from "@solidjs/router";

export default function HotelDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = createSignal("");

  const hotel = {
    id: params.id,
    name: "希尔顿酒店 (上海)",
    location: "上海外滩",
    rating: 4.8,
    reviews: 1234,
    price: 1288,
    description: "位于上海外滩核心地带，尽享黄浦江美景。酒店拥有豪华客房、多个餐厅和顶级水疗中心。",
    amenities: ["免费WiFi", "游泳池", "健身房", "水疗中心", "24小时前台", "停车场"],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099925?w=800",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800",
    ],
  };

  const handleBooking = () => {
    // 跳转到登录或预约页面
    navigate("/login");
  };

  return (
    <div class="min-h-screen bg-gray-50 pb-32">
      {/* 顶部导航 */}
      <div class="bg-white shadow-sm sticky top-0 z-10">
        <div class="max-w-md mx-auto px-4 py-3 flex items-center">
          <A href="/" class="text-blue-600 mr-4">
            ←
          </A>
          <h1 class="text-lg font-bold text-gray-900 truncate">
            {hotel.name}
          </h1>
        </div>
      </div>

      {/* 酒店图片 */}
      <div class="relative">
        <img
          src={hotel.images[0]}
          alt={hotel.name}
          class="w-full h-64 object-cover"
        />
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p class="text-white font-semibold">{hotel.location}</p>
        </div>
      </div>

      {/* 酒店信息 */}
      <div class="max-w-md mx-auto px-4 py-4">
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div class="flex items-center justify-between mb-3">
            <div>
              <div class="flex items-center">
                <span class="text-yellow-500 text-xl">★★★★★</span>
                <span class="ml-2 text-lg font-bold text-gray-900">
                  {hotel.rating}
                </span>
              </div>
              <p class="text-sm text-gray-500">{hotel.reviews} 条评价</p>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-600">¥{hotel.price}</p>
              <p class="text-sm text-gray-500">/晚</p>
            </div>
          </div>

          <p class="text-gray-700 leading-relaxed">{hotel.description}</p>

          {/* 设施 */}
          <div class="mt-4 pt-4 border-t">
            <h3 class="font-semibold text-gray-900 mb-3">酒店设施</h3>
            <div class="grid grid-cols-2 gap-2">
              {hotel.amenities.map((amenity) => (
                <div class="flex items-center text-sm text-gray-700">
                  <span class="mr-2">✓</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 图片轮播 */}
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 class="font-semibold text-gray-900 mb-3">酒店图片</h3>
          <div class="flex gap-2 overflow-x-auto">
            {hotel.images.map((image, index) => (
              <img
                src={image}
                alt={`${hotel.name} ${index + 1}`}
                class="w-32 h-24 object-cover rounded flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* 预约表单 */}
        <div class="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 class="font-semibold text-gray-900 mb-3">预约信息</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                入住日期
              </label>
              <input
                type="date"
                value={selectedDate()}
                onInput={(e) => setSelectedDate((e.target as HTMLInputElement).value)}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                退房日期
              </label>
              <input
                type="date"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                客房数量
              </label>
              <select class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="1">1 间</option>
                <option value="2">2 间</option>
                <option value="3">3 间</option>
              </select>
            </div>
            <button
              onClick={handleBooking}
              class="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              立即预约
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
