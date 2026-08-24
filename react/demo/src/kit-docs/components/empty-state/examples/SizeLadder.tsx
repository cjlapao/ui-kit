import { EmptyState } from "@cjlapao/ui-kit";
import type { EmptyStateSize } from "@cjlapao/ui-kit";

const SIZES: EmptyStateSize[] = ["xs", "sm", "md", "lg", "xl"];

const SizeLadder = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    {SIZES.map((size) => (
      <EmptyState
        key={size}
        size={size}
        icon="Add"
        title={`Size ${size.toUpperCase()}`}
        subtitle="Icon, type and the action button move together."
        actionLabel="Create"
        onAction={() => undefined}
        fullWidth
      />
    ))}
  </div>
);

export default SizeLadder;
