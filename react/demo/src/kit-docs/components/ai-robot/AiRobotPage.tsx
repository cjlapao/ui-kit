import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { AiRobotPlayground } from "./AiRobotPlayground";
import SizeScale from "./examples/SizeScale";
import sizeScaleCode from "./examples/SizeScale.tsx?raw";

export default function AiRobotPage() {
  return <div className="mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="AI Robot" description="Choose Bop, Bip, Bit, Hex, Io, Andy, or Spark, seven lightweight animated SVG assistants." />
    <AiRobotPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Examples</h2>
      <ExampleCard title="Size scale" description="One assistant at each step of the shared control scale — xs to xl, 32 to 128px. Omit the label for decorative use, as here." code={sizeScaleCode} filename="SizeScale.tsx"><SizeScale /></ExampleCard>
    </section>
    <A11ySection><A11yTopic title="Screen reader"><p>Supply a localized label to expose an image. Omit it for decorative use. Motion stops when reduced motion is requested.</p></A11yTopic></A11ySection>
    <PropsTable props={[
      { name: "identity", type: '"bop" | "bip" | "bit" | "hex" | "io" | "andy" | "spark"', default: '"bop"', description: "Robot character: Bop, Bip, Bit, Hex, Io, Andy, or Spark." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl" | number', default: '"md"', description: "Shared size scale (32–128px), or a custom pixel size." },
      { name: "tone", type: "TrueColor", default: '"neutral"', description: "Color from the shared palette, with light and dark variants." },
      { name: "variant", type: '"outline" | "solid"', default: '"outline"', description: "Outlined or filled robot body. Both variants animate and use the selected tone." },
      { name: "paused", type: "boolean", default: "false", description: "Stops all character animation." },
      { name: "label", type: "string", default: "undefined", description: "Accessible image name; omit for decorative content." },
      { name: "className", type: "string", default: "undefined", description: "Additional SVG class." },
      { name: "style", type: "CSSProperties", default: "undefined", description: "SVG style overrides." },
    ]} />
  </div>;
}
