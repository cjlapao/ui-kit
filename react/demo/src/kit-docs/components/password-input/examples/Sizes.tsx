import { CONTROL_SIZES, FormField, PasswordInput } from "@cjlapao/ui-kit";

/**
 * The reveal glyph now comes from the icon registry, so it scales with the
 * field. It used to be a raw icon component with a hardcoded `w-4 h-4`, which
 * stayed 16px at every size.
 *
 * `Input` draws no label of its own — `FormField` is the shell that does, and
 * it wires the label to the control for you.
 */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((size) => (
        <FormField key={size} label={size}>
          <PasswordInput size={size} defaultValue="hunter2" />
        </FormField>
      ))}
    </div>
  );
}
