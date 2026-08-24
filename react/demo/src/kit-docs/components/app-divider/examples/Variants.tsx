import { AppDivider } from "@cjlapao/ui-kit";
import type { AppDividerVariant } from "@cjlapao/ui-kit";

const VARIANTS: AppDividerVariant[] = [
  "solid",
  "dashed",
  "dotted",
  "gradient",
];

const LABELS: Record<AppDividerVariant, string> = {
  solid: "Solid",
  dashed: "Dashed",
  dotted: "Dotted",
  gradient: "Gradient — fades out at both ends",
};

export default function Variants() {
  return (
    <div className="flex w-full flex-col gap-4">
      {VARIANTS.map((variant) => (
        <div key={variant}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-70">
            {LABELS[variant]}
          </p>
          <AppDivider orientation="horizontal" variant={variant} />
        </div>
      ))}
    </div>
  );
}
