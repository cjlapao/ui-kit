import { Textarea } from "@cjlapao/ui-kit";

export default function GradientGlow() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Textarea
        variant="gradient"
        size="sm"
        resize="none"
        tone="indigo"
        glowIntensity="soft"
        label="soft"
        placeholder="A gentle glow"
      />
      <Textarea
        variant="gradient"
        size="sm"
        resize="none"
        tone="indigo"
        glowIntensity="strong"
        label="strong"
        placeholder="A bold glow"
      />
    </div>
  );
}
