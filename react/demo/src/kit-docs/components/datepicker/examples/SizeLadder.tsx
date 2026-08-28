import { CONTROL_SIZES, DatePicker } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <DatePicker key={each} size={each} placeholder={`Size ${each}`} />
      ))}
    </div>
  );
}
