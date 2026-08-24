import { Checkbox, CONTROL_SIZES } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <Checkbox
          key={each}
          color="blue"
          size={each}
          defaultChecked
          label={`Size ${each}`}
          description="The box sits on the label's cap height at every step."
        />
      ))}
    </div>
  );
}
