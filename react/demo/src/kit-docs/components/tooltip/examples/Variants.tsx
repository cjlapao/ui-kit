import { Button, Tooltip, TOOLTIP_VARIANTS } from "@cjlapao/ui-kit";

/**
 * `surface` follows the theme — a light card in light mode, a dark one in
 * dark mode. `inverted` contrasts against the page instead, which is the
 * classic tooltip convention.
 *
 * The component used to be `bg-neutral-900 … dark:bg-neutral-700`: dark in
 * *both* themes, with no light appearance at all. Toggle the page theme to
 * see the difference.
 */
export default function Variants() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLTIP_VARIANTS.map((variant) => (
        <Tooltip key={variant} text={`This is the ${variant} look`} variant={variant} delay={200}>
          <Button variant="soft" color="violet">
            {variant}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
