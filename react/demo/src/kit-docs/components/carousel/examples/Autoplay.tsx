import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "Autoplay slide 1",
  "Autoplay slide 2",
  "Autoplay slide 3",
  "Autoplay slide 4",
  "Autoplay slide 5",
];

export const Autoplay = () => (
  <Carousel
    autoplayInterval={2000}
    items={SLIDES.map((label, index) => (
      <div
        key={index}
        className="flex h-48 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
      >
        {label}
      </div>
    ))}
  />
);

export default Autoplay;
