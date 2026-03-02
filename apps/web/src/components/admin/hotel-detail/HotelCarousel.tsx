import { Show, For, createSignal, Index } from "solid-js";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import type { Image } from "~/lib/types";

interface HotelCarouselProps {
  images: Image[];
  onImageClick?: (image: Image) => void;
}

export const HotelCarousel = (props: HotelCarouselProps) => {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const images = () => props.images || [];
  const hasImages = () => images().length > 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images().length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images().length) % images().length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageClick = () => {
    if (props.onImageClick) {
      props.onImageClick(images()[currentIndex()]);
    }
  };

  return (
    <>
      <Show
        when={hasImages()}
        fallback={
          <div class="w-full aspect-[2/1] bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 max-h-[300px]">
            暂无图片
          </div>
        }
      >
        <div class="relative w-full">
          {/* Main image */}
          <div
            class="relative aspect-[2/1] overflow-hidden rounded-lg cursor-pointer max-h-[300px]"
            onClick={handleImageClick}
          >
            <img
              src={images()[currentIndex()].url}
              alt={images()[currentIndex()].alt || "酒店图片"}
              class="w-full h-full object-cover"
            />

            {/* Navigation arrows */}
            <Show when={images().length > 1}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-gray-800 rounded-full p-1.5 md:p-2 shadow-md transition-all"
              >
                <ChevronLeft size={20} class="md:w-6 md:h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-white/90 text-gray-800 rounded-full p-1.5 md:p-2 shadow-md transition-all"
              >
                <ChevronRight size={20} class="md:w-6 md:h-6" />
              </button>
            </Show>

            {/* Counter */}
            <Show when={images().length > 1}>
              <div class="absolute top-2 md:top-4 right-2 md:right-4 bg-black/60 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {currentIndex() + 1} / {images().length}
              </div>
            </Show>
          </div>

          {/* Thumbnails */}
          <Show when={images().length > 1}>
            <div class="flex gap-1.5 md:gap-2 mt-2 md:mt-3 overflow-x-auto pb-2 scrollbar-hide">
              <For each={images()}>
                {(image, index) => (
                  <button
                    onClick={() => goToSlide(index())}
                    class={`relative flex-shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all ${
                      index() === currentIndex()
                        ? "ring-2 ring-blue-500 ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt || "缩略图"}
                      class="w-full h-full object-cover"
                    />
                  </button>
                )}
              </For>
            </div>
          </Show>
        </div>
      </Show>
    </>
  );
};
