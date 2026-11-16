import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, A11yCode, KeyboardSupportTable, PropsTable } from "../../shared/A11ySections";
import { AiOrbPlayground } from "./AiOrbPlayground";
import Presets from "./examples/Presets";
import presetsCode from "./examples/Presets.tsx?raw";
import CompactOrb from "./examples/AudioSource";
import audioCode from "./examples/AudioSource.tsx?raw";
import CompactDefinition from "./examples/CompactDefinition";
import compactCode from "./examples/CompactDefinition.tsx?raw";

export default function AiOrbPage() {
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="AI Orb" description="A luminous presence for a talking AI. Audio shapes listening waves and solar flares. One Canvas renderer, three presets, no frame-driven React renders." />
    <AiOrbPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500">Examples</h2>
      <ExampleCard title="Three personalities, one renderer" code={presetsCode} filename="Presets.tsx"><Presets /></ExampleCard>
      <ExampleCard title="Definition at small sizes" description="48–128px listening and speaking orbs. Size-aware strokes, brighter flares, fewer details, and restrained glow keep motion readable. Set appearance.definition to 0 to disable the enhancement." code={compactCode} filename="CompactDefinition.tsx"><CompactDefinition /></ExampleCard>
      <ExampleCard title="Audio sources and compact presence" description="The application owns microphone permissions, tracks, playback, and conversation state. The orb borrows sources and never plays audio." code={audioCode} filename="AudioSource.tsx"><CompactOrb /></ExampleCard>
    </section>
    <A11ySection>
      <A11yTopic title="Screen reader"><p>Supply label to expose an image with an accessible name. Omit label for a decorative orb. Canvas frames and audio levels are never announced. Reduced motion renders a static state-specific visual.</p><A11yCode code={'<AiOrb state="listening" label="Assistant listening" />\n<AiOrb preset="ember" /> // Decorative; use adjacent status text.'} /></A11yTopic>
      <A11yTopic title="Keyboard Support"><p>The orb has no interactive controls or keyboard bindings. Playground controls use native keyboard behavior.</p><KeyboardSupportTable bindings={[]} /></A11yTopic>
      <A11yTopic title="Internationalization"><p>The application supplies localized labels and status text. The component has no built-in user-facing strings. Circular geometry is unchanged in RTL layouts.</p></A11yTopic>
    </A11ySection>
    <PropsTable props={[
      { name: "state", type: '"idle" | "listening" | "speaking"', default: '"idle"', description: "Conversation state controlled by the host." },
      { name: "preset", type: '"solar" | "ion" | "ember"', default: '"solar"', description: "Base palette and motion settings." },
      { name: "appearance", type: "AiOrbAppearance", default: "Preset values; definition: 1", description: "Optional coreColor, accentColor, glowColor (#RGB or #RRGGBB), glow, motionIntensity, and definition (0–1). Definition automatically improves detail below 240 CSS pixels; 0 restores proportional scaling. Invalid values fall back to preset defaults." },
      { name: "audioSource", type: "AnalyserNode | MediaStream | null", default: "undefined", description: "Borrowed source. No microphone request or playback. Stream-owned analysis contexts close on source changes/unmount; caller tracks and analysers remain untouched." },
      { name: "size", type: "number", default: "240", description: "Square CSS pixel size; shrinks to container width. Nonpositive/nonfinite values fall back to 240." },
      { name: "quality", type: '"low" | "balanced" | "high"', default: '"balanced"', description: "24/30/60 FPS and 1/1.5/2 maximum DPR. Backing store capped at 1024 pixels per side." },
      { name: "paused", type: "boolean", default: "false", description: "Stops animation and sampling; draws a static representation." },
      { name: "label", type: "string", default: "undefined", description: "Accessible image name; omit for decorative content." },
      { name: "onAudioError", type: "(error: Error) => void", default: "undefined", description: "Called once per failed audio setup or adapter sampling failure. Visual falls back to ambient motion. Suspended contexts are not errors." },
      { name: "className", type: "string", default: "undefined", description: "Wrapper class." },
      { name: "style", type: "CSSProperties", default: "undefined", description: "Wrapper style overrides; keep a square aspect ratio for an undistorted orb." },
    ]} />
  </div>;
}
