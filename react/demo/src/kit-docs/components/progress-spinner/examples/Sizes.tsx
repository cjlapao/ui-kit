import { ProgressSpinner } from "@cjlapao/ui-kit";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const Sizes = () => (
  <div className="flex flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <div key={size} className="flex flex-col items-center gap-2">
        <ProgressSpinner value={62} size={size} ariaLabel={`Size ${size}`} />
        <span className="text-xs text-neutral-500 dark:text-neutral-400">{size}</span>
      </div>
    ))}
  </div>
);

export default Sizes;
