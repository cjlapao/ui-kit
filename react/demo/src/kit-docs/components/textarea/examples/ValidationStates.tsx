import { Textarea } from "@cjlapao/ui-kit";
import type { TextareaValidationStatus } from "@cjlapao/ui-kit";

const states: { status: TextareaValidationStatus; help: string }[] = [
  { status: "none", help: "Markdown is supported." },
  { status: "error", help: "This field is required." },
  { status: "success", help: "Looks good." },
];

export default function ValidationStates() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {states.map(({ status, help }) => (
        <Textarea
          key={status}
          size="sm"
          resize="none"
          validationStatus={status}
          helpText={help}
          defaultValue={status === "none" ? "" : "Some entered text"}
        />
      ))}
    </div>
  );
}
