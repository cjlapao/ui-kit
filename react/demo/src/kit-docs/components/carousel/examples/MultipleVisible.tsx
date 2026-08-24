import { Carousel } from "@cjlapao/ui-kit";

const IMAGES = [
  "https://picsum.photos/seed/carousel-1/800/500",
  "https://picsum.photos/seed/carousel-2/800/500",
  "https://picsum.photos/seed/carousel-3/800/500",
  "https://picsum.photos/seed/carousel-4/800/500",
  "https://picsum.photos/seed/carousel-5/800/500",
];

export const MultipleVisible = () => (
  <Carousel
    numVisible={3}
    numScroll={1}
    gap={16}
    items={IMAGES.map((src, index) => (
      <img
        key={index}
        src={src}
        alt={`Slide ${index + 1}`}
        className="h-56 w-full rounded-xl object-cover"
      />
    ))}
  />
);

export default MultipleVisible;
