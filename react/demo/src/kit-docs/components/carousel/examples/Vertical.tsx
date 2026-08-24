import { Carousel } from "@cjlapao/ui-kit";

const ITEMS = Array.from({ length: 8 }, (_, i) => `Item ${i + 1}`);

export const Vertical = () => (
  <Carousel
    orientation="vertical"
    viewportHeight="320px"
    items={ITEMS.map((label, index) => (
      <div
        key={index}
        className="flex items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
        style={{ height: "80px" }}
      >
        {label}
      </div>
    ))}
  />
);

export default Vertical;
