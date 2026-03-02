import { Show } from 'solid-js';
import type { Hotel } from "~/lib/types";
import { StatusBadge } from "./StatusBadge";

interface HotelInfoCardProps {
  hotel: Hotel;
}

export const HotelInfoCard = (props: HotelInfoCardProps) => {
  return (
    <div class="bg-white rounded-lg border p-6 space-y-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{props.hotel.name}</h1>
          <p class="text-sm text-gray-500 mt-1">{props.hotel.city}, {props.hotel.country || ""}</p>
        </div>
        <StatusBadge status={props.hotel.status} />
      </div>

      <Show when={props.hotel.description}>
        <p class="text-gray-700">{props.hotel.description}</p>
      </Show>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Show when={props.hotel.address}>
          <div class="flex items-start gap-2">
            <span class="text-gray-500">📍</span>
            <span class="text-gray-900">{props.hotel.address}</span>
          </div>
        </Show>
        <Show when={props.hotel.phone}>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">📞</span>
            <span class="text-gray-900">{props.hotel.phone}</span>
          </div>
        </Show>
        <Show when={props.hotel.email}>
          <div class="flex items-center gap-2">
            <span class="text-gray-500">✉️</span>
            <span class="text-gray-900">{props.hotel.email}</span>
          </div>
        </Show>
      </div>
    </div>
  );
};
