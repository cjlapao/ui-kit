import { Input } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input variant="flat" placeholder="Flat" />
      <Input variant="elevated" placeholder="Elevated" />
      <Input variant="ghost" placeholder="Ghost" />
      <Input variant="underline" placeholder="Underline" />
      {/*
        Glass twice, once without a tone and once with: a `glass` field keeps
        its original white wash until a caller asks for a colour, which is the
        one difference from `ghost` — ghost is tinted by the tone every field
        resolves by default. Shown side by side because the example rendered
        untinted for as long as the variant existed, and nobody noticed the
        tint was missing.
      */}
      <Input variant="glass" placeholder="Glass" />
      <Input variant="glass" tone="blue" placeholder="Glass, tinted" />
      <Input variant="gradient" placeholder="Gradient" />
    </div>
  );
}
