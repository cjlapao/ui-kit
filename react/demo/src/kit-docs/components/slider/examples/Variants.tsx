import { Slider, SLIDER_VARIANTS } from "@cjlapao/ui-kit";

const headingClass =
  "mb-2 text-sm font-medium text-neutral-900 dark:text-neutral-100";

const LABELS: Record<string, string> = {
  solid: "Solid",
  soft: "Soft",
  outline: "Outline",
  ghost: "Ghost",
  glass: "Glass",
};

export default function Variants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
      {SLIDER_VARIANTS.map((variant) => (
        <div key={variant}>
          <h4 className={headingClass}>{LABELS[variant] ?? variant}</h4>
          <Slider variant={variant} defaultValue={50} />
        </div>
      ))}
    </div>
  );
}
