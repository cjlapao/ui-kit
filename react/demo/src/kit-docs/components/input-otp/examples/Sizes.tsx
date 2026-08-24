import { InputOtp } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <InputOtp length={4} size="sm" />
      <InputOtp length={4} size="md" />
      <InputOtp length={4} size="lg" />
    </div>
  );
}
