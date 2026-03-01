import { For, Show, createSignal, JSX } from "solid-js";
import { type Image } from "~/lib/types";

interface ImageGalleryProps {
  images: Image[];
  onDelete?: (imageId: string) => void;
  onImageClick?: (image: Image) => void;
}

export const ImageGallery = (props: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = createSignal<Image | null>(null);
  const [carouselOpen, setCarouselOpen] = createSignal(false);

  const openCarousel = (image: Image) => {
    setSelectedImage(image);
    setCarouselOpen(true);
  };

  const closeCarousel = () => {
    setCarouselOpen(false);
    setSelectedImage(null);
  };

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
    props.onImageClick?.(image);
  };

  return (
    <>
      <div class="image-gallery">
        <Show when={props.images.length === 0}>
          <div class="empty-state">
            <p>暂无图片</p>
          </div>
        </Show>

        <Show when={props.images.length > 0}>
          <div class="thumbnails-grid">
            <For each={props.images}>
              {(image) => (
                <div
                  class={`thumbnail-wrapper ${selectedImage()?.id === image.id ? "selected" : ""}`}
                  onClick={() => handleImageClick(image)}
                >
                  <img src={image.url} alt={image.alt} />
                  <Show when={props.onDelete}>
                    <button
                      class="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDelete?.(image.id);
                      }}
                    >
                      删除
                    </button>
                  </Show>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>

      <Show when={carouselOpen() && selectedImage()}>
        <div class="image-carousel-overlay" onClick={closeCarousel}>
          <div class="carousel-container" onClick={(e) => e.stopPropagation()}>
            <button class="close-btn" onClick={closeCarousel}>
              关闭
            </button>
            <img
              src={selectedImage()?.url}
              alt={selectedImage()?.alt}
              class="main-image"
            />
            <div class="image-info">
              <Show when={selectedImage()?.alt}>
                <p>{selectedImage()?.alt}</p>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </>
  );
};
