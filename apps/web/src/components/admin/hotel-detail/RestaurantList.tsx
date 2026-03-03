import { Show, createSignal } from 'solid-js';
import { RestaurantCard } from "./RestaurantCard";
import { Button } from "@repo/ui";
import type { Restaurant } from "~/lib/types";
import { RestaurantForm } from "../Modals/RestaurantForm";
import { useDeleteRestaurant, useUpdateRestaurantStatus } from "~/lib/restaurant-mutations";

interface RestaurantListProps {
  restaurants: Restaurant[];
  hotelId: string;
  onUpdate: () => void;
}

export const RestaurantList = (props: RestaurantListProps) => {
  const [formOpen, setFormOpen] = createSignal(false);
  const [selectedRestaurant, setSelectedRestaurant] = createSignal<Restaurant | null>(null);
  const deleteMutation = useDeleteRestaurant();
  const updateStatusMutation = useUpdateRestaurantStatus();

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateStatusMutation.execute({ id, status: newStatus });
    props.onUpdate();
  };

  const handleAdd = () => {
    setSelectedRestaurant(null);
    setFormOpen(true);
  };

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setFormOpen(true);
  };

  const handleDelete = async (restaurant: Restaurant) => {
    if (confirm(`确定要删除餐厅 "${restaurant.name}" 吗？`)) {
      await deleteMutation.execute({ id: restaurant.id });
      props.onUpdate();
    }
  };

  const handleFormSuccess = () => {
    setFormOpen(false);
    setSelectedRestaurant(null);
    props.onUpdate();
  };

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">餐厅管理</h2>
        <Button onClick={handleAdd}>
          + 添加餐厅
        </Button>
      </div>

      <Show
        when={props.restaurants.length > 0}
        fallback={
          <div class="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
            <p class="mb-4">暂无餐厅</p>
            <Button variant="ghost" onClick={handleAdd}>
              添加第一个餐厅
            </Button>
          </div>
        }
      >
        <div class="grid grid-cols-1 gap-4">
          <For each={props.restaurants}>
            {(restaurant) => (
              <RestaurantCard
                restaurant={restaurant}
                onEdit={() => handleEdit(restaurant)}
                onDelete={() => handleDelete(restaurant)}
                onStatusChange={handleStatusChange}
              />
            )}
          </For>
        </div>
      </Show>

      <Show when={formOpen()}>
        <RestaurantForm
          restaurant={selectedRestaurant()}
          hotelId={props.hotelId}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </Show>
    </div>
  );
};
