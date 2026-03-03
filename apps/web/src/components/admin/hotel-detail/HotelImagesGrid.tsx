import { Show, For, createSignal } from 'solid-js';
import type { Image } from "~/lib/types";

interface HotelImagesGridProps {
  images: Image[];
  columns?: 2 | 3 | 4;
  onImageClick?: (image: Image) => void;
}

export const HotelImagesGrid = (props: HotelImagesGridProps) => {
  const [expandedImage, setExpandedImage] = createSignal<Image | null>(null);

  const handleImageClick = (image: Image) => {
    if (props.onImageClick) {
      props.onImageClick(image);
    }
    setExpandedImage(image);
  };

  const colsClass = () => {
    switch (props.columns) {
      case 2:
        return "grid-cols-2 md:grid-cols-2 lg:grid-cols-2";
      case 3:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-3";
      case 4:
      default:
        return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
    }
  };

  return (
    <>
      <div class={`grid gap-2 ${colsClass()}`}>
        <Show
          when={props.images && props.images.length > 0}
          fallback={
            <div class="col-span-full bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">
              暂无图片
            </div>
          }
        >
          <For each={props.images}>
            {(image) => (
              <div
                class="relative aspect-square cursor-pointer overflow-hidden rounded-lg group"
                onClick={() => handleImageClick(image)}
              >
                <img
                  src={image.url}
                  alt={image.alt || "酒店图片"}
                  class="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all" />
              </div>
            )}
          </For>
        </Show>
      </div>

      <Show when={expandedImage()}>
        <div
          class="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setExpandedImage(null)}
        >
          <img
            src={expandedImage()!.url}
            alt={expandedImage()!.alt || "酒店图片"}
            class="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setExpandedImage(null)}
            class="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ✕
          </button>
        </div>
      </Show>
    </>
  );
};
