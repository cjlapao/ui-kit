import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "Slide 1",
  "Slide 2",
  "Slide 3",
  "Slide 4",
  "Slide 5",
  "Slide 6",
];

export const Circular = () => (
  <Carousel
    circular
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

export default Circular;
