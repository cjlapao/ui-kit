import { SlugInput } from "@cjlapao/ui-kit";

export default function Validation() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SlugInput
        defaultValue="Jane@"
        error="That handle is not available."
        helpText="Handles are free to change later."
      />
      <SlugInput
        defaultValue="jane doe"
        hint="Only letters, numbers and _."
        validationStatus="success"
      />
      <SlugInput
        defaultValue="!!!"
        hint="Symbols are ignored — something has to survive."
        validationStatus="error"
      />
    </div>
  );
}
