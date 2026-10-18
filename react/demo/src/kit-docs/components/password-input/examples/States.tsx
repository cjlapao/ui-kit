import { FormField, PasswordInput } from "@cjlapao/ui-kit";

/**
 * The toggle is offered only where revealing makes sense. On a `disabled` or
 * `readOnly` field it used to stay live, so a password the user could not edit
 * could still be read back; `revealable={false}` opts out entirely.
 */
export default function States() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <FormField label="Normal">
        <PasswordInput defaultValue="hunter2" />
      </FormField>
      <FormField label="Not revealable">
        <PasswordInput revealable={false} defaultValue="hunter2" />
      </FormField>
      <FormField label="Disabled">
        <PasswordInput disabled defaultValue="hunter2" />
      </FormField>
      <FormField label="Read-only">
        <PasswordInput readOnly defaultValue="hunter2" />
      </FormField>
    </div>
  );
}
