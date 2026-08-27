import { FormField, Input, PasswordInput } from "@cjlapao/ui-kit";

/**
 * `PasswordInput` **is** an `Input` — same variants, sizes, tones, validation
 * treatment, icons and native attributes — with a masked type and a reveal
 * button in the trailing slot.
 *
 * Each row below pairs the two at identical settings. The field markup is
 * asserted to be byte-identical in the tests; the only differences you should
 * see are the mask and the eye.
 *
 * (In the Vue kit this was not true until recently: because
 * `PasswordInputProps extends InputProps`, Vue declared every Input prop on
 * PasswordInput and stripped it from `$attrs`, and the template forwarded only
 * `$attrs` — so `size`, `variant` and `tone` were silently dropped.)
 */
export default function AsInput() {
  const settings = [
    { variant: "flat", label: "flat" },
    { variant: "elevated", label: "elevated" },
    { variant: "underline", label: "underline" },
  ] as const;

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      {settings.map(({ variant, label }) => (
        <div key={variant} className="grid grid-cols-2 gap-3">
          <FormField label={`Input — ${label}`}>
            <Input variant={variant} tone="violet" placeholder="text" />
          </FormField>
          <FormField label={`Password — ${label}`}>
            <PasswordInput variant={variant} tone="violet" defaultValue="hunter2" />
          </FormField>
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Input — error">
          <Input validationStatus="error" placeholder="text" />
        </FormField>
        <FormField label="Password — error">
          <PasswordInput validationStatus="error" defaultValue="hunter2" />
        </FormField>
      </div>
    </div>
  );
}
