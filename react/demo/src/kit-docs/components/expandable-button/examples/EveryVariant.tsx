import { BUTTON_VARIANTS, ExpandableButton } from "@cjlapao/ui-kit";

const EveryVariant = () => (
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover to expand — one tone, one size, so only the surface changes.
    </p>
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <ExpandableButton
            icon="Send"
            label={variant}
            variant={variant}
            color="blue"
            size="md"
            srLabel={variant}
          />
          <span className="text-sm opacity-70">{variant}</span>
        </div>
      ))}
    </div>
    <p className="text-center text-[11px] opacity-60">
      The revealed text is the variant name, so the expansion says what it is.{" "}
      <code>glass</code> reads best over a backdrop — see the Glass example.
    </p>
  </div>
);

export default EveryVariant;
