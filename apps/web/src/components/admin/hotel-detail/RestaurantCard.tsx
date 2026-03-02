import { Show, For } from 'solid-js';
import type { Restaurant } from "~/lib/types";
import { RestaurantType, AreaType } from "~/lib/types";
import { StatusBadge } from "./StatusBadge";
import { HotelImagesGrid } from "./HotelImagesGrid";
import { Button } from "@repo/ui";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: () => void;
  onDelete: () => void;
}

const AREA_TYPE_LABELS: Record<AreaType, string> = {
  GENERAL: "普通区",
  VIP: "VIP区",
  OUTDOOR: "户外区",
};

const RESTAURANT_TYPE_LABELS: Record<RestaurantType, string> = {
  HALL: "大厅",
  PRIVATE_ROOM: "包厢",
};

export const RestaurantCard = (props: RestaurantCardProps) => {
  const isDeleted = () => props.restaurant.status === "DELETED";

  return (
    <div
      class={`border rounded-lg p-6 transition-all ${
        isDeleted()
          ? "opacity-50 grayscale"
          : "bg-white hover:shadow-md"
      }`}
    >
      <div class="flex items-start justify-between gap-4 mb-4">
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <h3 class="text-lg font-semibold">{props.restaurant.name}</h3>
            <span class="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {RESTAURANT_TYPE_LABELS[props.restaurant.type]}
            </span>
            <StatusBadge status={props.restaurant.status} />
          </div>
        </div>
        <Show when={!isDeleted()}>
          <div class="flex gap-2 flex-wrap sm:flex-nowrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={props.onEdit}
            >
              编辑
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={props.onDelete}
            >
              删除
            </Button>
          </div>
        </Show>
      </div>

      <Show when={props.restaurant.description}>
        <p class="text-gray-700 mb-4">{props.restaurant.description}</p>
      </Show>

      <Show when={props.restaurant.images.length > 0}>
        <div class="mb-4">
          <HotelImagesGrid
            images={props.restaurant.images}
            columns={3}
          />
        </div>
      </Show>

      <div class="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>👥 容量: {props.restaurant.capacity} 人</span>
        <Show when={props.restaurant.areas.length > 0}>
          <span>
            🏢 区域:
            <For each={props.restaurant.areas}>
              {(area, index) => (
                <>
                  {index() > 0 && ", "}
                  {area.name} ({AREA_TYPE_LABELS[area.type]})
                </>
              )}
            </For>
          </span>
        </Show>
      </div>
    </div>
  );
};
