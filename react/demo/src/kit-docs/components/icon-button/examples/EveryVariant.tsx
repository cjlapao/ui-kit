import { BUTTON_VARIANTS, IconButton } from "@cjlapao/ui-kit";

const EveryVariant = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2">
    {BUTTON_VARIANTS.map((variant) => (
      <div key={variant} className="flex items-center gap-3">
        <IconButton
          icon="Send"
          variant={variant}
          color="blue"
          size="md"
          srLabel={variant}
        />
        <span className="text-sm opacity-70">{variant}</span>
      </div>
    ))}
  </div>
);

export default EveryVariant;
