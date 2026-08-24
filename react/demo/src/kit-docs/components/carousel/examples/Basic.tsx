import { Carousel } from "@cjlapao/ui-kit";

const SLIDES = [
  "First slide",
  "Second slide",
  "Third slide",
  "Fourth slide",
  "Fifth slide",
];

export const Basic = () => (
  <Carousel
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

export default Basic;
