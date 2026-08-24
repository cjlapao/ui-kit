import { INPUT_VARIANTS, Textarea } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <Textarea
          key={variant}
          size="sm"
          variant={variant}
          resize="none"
          label={variant}
          placeholder={`${variant} variant`}
        />
      ))}
    </div>
  );
}
