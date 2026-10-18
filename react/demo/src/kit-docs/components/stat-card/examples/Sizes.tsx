import { StatCard } from "@cjlapao/ui-kit";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const Sizes = () => (
  <div className="flex w-full flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <StatCard
        key={size}
        size={size}
        className="min-w-44 flex-1"
        label={`Size ${size}`}
        // Short on purpose: the card stays one row at every size, so the
        // value must fit at text-5xl without the Panel scrolling.
        value="1,204"
        icon="Shop"
      />
    ))}
  </div>
);

export default Sizes;
