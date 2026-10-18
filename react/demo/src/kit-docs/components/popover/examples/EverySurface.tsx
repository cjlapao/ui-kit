import { Button, Popover, SURFACE_VARIANTS } from "@cjlapao/ui-kit";

const EverySurface = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    {SURFACE_VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col items-center gap-1.5">
        <Popover
          trigger={<Button color="sky" size="xs">{variant}</Button>}
          variant={variant}
          tone="sky"
          padding="sm"
        >
          <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
            <span className="font-semibold">{variant}</span> — the same
            surface a Panel beside it would draw.
          </p>
        </Popover>
      </div>
    ))}
  </div>
);

export default EverySurface;
