import { HelpButton, type SurfaceVariant } from "@cjlapao/ui-kit";

const CONTENT =
  "The panel runs on the shared container family, so it reads the same as a Panel beside it. Glass and liquid-glass are see-through.";

const SURFACES: SurfaceVariant[] = [
  "elevated",
  "outlined",
  "glass",
  "liquid-glass",
];

/**
 * The four surfaces that show a fill or blur. The panel is a fixed popover, so
 * it floats over the page — click each trigger to open it on that surface.
 */
const Surfaces = () => (
  <div className="flex flex-wrap items-center justify-center gap-5">
    {SURFACES.map((variant) => (
      <div key={variant} className="flex flex-col items-center gap-1">
        <HelpButton
          content={CONTENT}
          title={variant}
          color="indigo"
          size="md"
          variant={variant}
        />
        <span className="text-xs opacity-70">{variant}</span>
      </div>
    ))}
  </div>
);

export default Surfaces;
