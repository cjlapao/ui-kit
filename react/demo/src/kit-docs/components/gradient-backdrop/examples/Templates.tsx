import { GRADIENT_BACKDROP_TEMPLATES, GRADIENT_BACKDROP_TEMPLATE_IDS, GradientBackdrop } from "@cjlapao/ui-kit";

/**
 * The six built-in templates, each pinned to light and to dark so both read
 * side by side. Muted on purpose: they stand in for an app's own background.
 */
export default function Templates() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {GRADIENT_BACKDROP_TEMPLATE_IDS.map((id) => (
        <div key={id} className="flex flex-col gap-1">
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-black/10 dark:border-white/10">
            <GradientBackdrop theme={id} scheme="light" className="h-20" />
            <GradientBackdrop theme={id} scheme="dark" className="h-20" />
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-300">
            {GRADIENT_BACKDROP_TEMPLATES[id].label} <code className="text-neutral-400">"{id}"</code>
          </span>
        </div>
      ))}
    </div>
  );
}
