import { AiRobot } from "@cjlapao/ui-kit";

/** The shared control size scale — 32–128px, decorative without a label. */
export default function SizeScale() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <AiRobot size="xs" />
      <AiRobot size="sm" />
      <AiRobot size="md" />
      <AiRobot size="lg" />
      <AiRobot size="xl" />
    </div>
  );
}
