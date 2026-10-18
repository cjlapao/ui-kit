import { InputOtp } from "@cjlapao/ui-kit";

export default function Filled() {
  // `ghost` — the soft, tone-tinted surface the old `filled` variant is now
  // an alias for.
  return <InputOtp length={6} variant="ghost" defaultValue="4829" />;
}
