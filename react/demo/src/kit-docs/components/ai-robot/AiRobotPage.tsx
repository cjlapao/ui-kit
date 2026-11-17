import { AiRobot } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { AiRobotPlayground } from "./AiRobotPlayground";

export default function AiRobotPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="AI Robot" description="A lightweight SVG assistant with an animated wave, blinking eyes, and moving mouth." />
    <AiRobotPlayground />
    <section className="flex flex-wrap items-center gap-6"><AiRobot size="xs" /><AiRobot size="sm" /><AiRobot size="md" /><AiRobot size="lg" /><AiRobot size="xl" /></section>
    <A11ySection><A11yTopic title="Screen reader"><p>Supply a localized label to expose an image. Omit it for decorative use. Motion stops when reduced motion is requested.</p></A11yTopic></A11ySection>
    <PropsTable props={[
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl" | number', default: '"md"', description: "Shared size scale (32–128px), or a custom pixel size." },
      { name: "tone", type: "TrueColor", default: '"neutral"', description: "Color from the shared palette, with light and dark variants." },
      { name: "paused", type: "boolean", default: "false", description: "Stops the wave, eyes, and mouth." },
      { name: "label", type: "string", default: "undefined", description: "Accessible image name; omit for decorative content." },
      { name: "className", type: "string", default: "undefined", description: "Additional SVG class." },
      { name: "style", type: "CSSProperties", default: "undefined", description: "SVG style overrides." },
    ]} />
  </div>;
}
