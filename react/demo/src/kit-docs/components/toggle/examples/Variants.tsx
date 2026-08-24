import { TOGGLE_VARIANTS, Toggle } from "@cjlapao/ui-kit";

const LABELS: Record<string, string> = {
  solid: "Solid",
  soft: "Soft",
  outline: "Outline",
  ghost: "Ghost",
  glass: "Glass",
};

// The gradient stands in for real page content, so the translucent
// treatments (ghost, glass) read the way they will in the wild.
const rowClass =
  "flex items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Variants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {TOGGLE_VARIANTS.map((variant) => (
        <div key={variant} className={rowClass}>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {LABELS[variant] ?? variant}
          </span>
          <span className="flex items-center gap-4">
            <Toggle variant={variant} />
            <Toggle variant={variant} defaultChecked />
          </span>
        </div>
      ))}
    </div>
  );
}
