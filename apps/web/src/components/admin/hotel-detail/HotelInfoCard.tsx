import { Show } from 'solid-js';
import type { Hotel } from "~/lib/types";
import { StatusBadge } from "./StatusBadge";

interface HotelInfoCardProps {
  hotel: Hotel;
}

export const HotelInfoCard = (props: HotelInfoCardProps) => {
  return (
    <div class="bg-white rounded-lg border p-4 md:p-6 space-y-3 md:space-y-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h1 class="text-xl md:text-2xl font-bold text-gray-900 truncate">{props.hotel.name}</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1">{props.hotel.city}, {props.hotel.country || ""}</p>
        </div>
        <StatusBadge status={props.hotel.status} />
      </div>

      <Show when={props.hotel.description}>
        <p class="text-sm md:text-base text-gray-700 line-clamp-3">{props.hotel.description}</p>
      </Show>

      <div class="space-y-2 md:space-y-0 grid grid-cols-1 md:grid-cols-2 md:gap-4">
        <Show when={props.hotel.address}>
          <div class="flex items-start gap-2">
            <span class="text-gray-500 flex-shrink-0">📍</span>
            <span class="text-gray-900 text-sm md:text-base break-words">{props.hotel.address}</span>
          </div>
        </Show>
        <Show when={props.hotel.phone}>
          <div class="flex items-center gap-2">
            <span class="text-gray-500 flex-shrink-0">📞</span>
            <span class="text-gray-900 text-sm md:text-base">{props.hotel.phone}</span>
          </div>
        </Show>
        <Show when={props.hotel.email}>
          <div class="flex items-center gap-2 md:col-span-2">
            <span class="text-gray-500 flex-shrink-0">✉️</span>
            <span class="text-gray-900 text-sm md:text-base break-all">{props.hotel.email}</span>
          </div>
        </Show>
      </div>
    </div>
  );
};
