import { Show } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import { AdminLayout } from "~/components/admin/Layout/AdminLayout";
import { HotelInfoCard } from "~/components/admin/hotel-detail/HotelInfoCard";
import { HotelCarousel } from "~/components/admin/hotel-detail/HotelCarousel";
import { RestaurantList } from "~/components/admin/hotel-detail/RestaurantList";
import { useHotelDetail } from "~/hooks/admin/useHotelDetail";
import { Button } from "@repo/ui";

export default function HotelDetailPage() {
  const params = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useHotelDetail(params.id);

  const handleRestaurantUpdate = () => {
    refetch();
  };

  return (
    <AdminLayout>
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/admin/hotels")}>
            ← 返回
          </Button>
          <h1 class="text-xl font-bold">酒店详情</h1>
        </div>

        <Show when={loading()}>
          <div class="text-center py-12 text-gray-500">
            加载中...
          </div>
        </Show>

        <Show when={error()}>
          <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 class="text-lg font-semibold text-red-800 mb-2">
              加载失败
            </h2>
            <p class="text-red-600 mb-4">
              {error()?.message || "无法加载酒店信息"}
            </p>
            <Button onClick={() => navigate("/admin/hotels")}>
              返回酒店列表
            </Button>
          </div>
        </Show>

        <Show when={data()?.hotel}>
          <div class="space-y-6">
            <div class="flex flex-col lg:flex-row gap-6">
              <div class="flex-1 min-w-0">
                <HotelCarousel images={data()!.hotel.images || []} />
              </div>
              <div class="lg:w-72 shrink-0">
                <HotelInfoCard hotel={data()!.hotel} />
              </div>
            </div>

            <RestaurantList
              restaurants={data()!.hotel.restaurants || []}
              hotelId={params.id}
              onUpdate={handleRestaurantUpdate}
            />
          </div>
        </Show>
      </div>
    </AdminLayout>
  );
}
