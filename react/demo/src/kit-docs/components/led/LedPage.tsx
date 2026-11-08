import { useState } from "react";
import { ColorSwatches, Led, LED_ANIMATIONS, CONTROL_SIZES, TRUE_COLORS, type LedAnimation, type LedVariant, type ControlSize, type TrueColor } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { ChoiceControl, Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import Signals from "./examples/Signals";
import signalsCode from "./examples/Signals.tsx?raw";

export default function LedPage() {
  const [tone, setTone] = useState<TrueColor>("emerald"), [size, setSize] = useState<ControlSize>("md");
  const [animation, setAnimation] = useState<LedAnimation>("pulse");
  const [variant, setVariant] = useState<LedVariant>("lit");
  const [lit, setLit] = useState(true), [glowIntensity, setGlowIntensity] = useState(1), [duration, setDuration] = useState(1600);
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="LED" description="A compact signal light with a colored core and soft halo. Shared real-color tones adapt to light and dark themes. Motion stays within a fixed footprint." />
    <PlaygroundPanel controls={<div className="space-y-4">
      <Control label="Tone"><ColorSwatches selectable value={tone} onSelect={setTone} size="sm" /></Control>
      <ChoiceControl label="Variant" options={[{ label: "Lit", value: "lit" }, { label: "Flat", value: "flat" }]} value={variant} onChange={value => setVariant(value as LedVariant)} />
      <ChoiceControl label="Size" options={CONTROL_SIZES.map(value => ({ label: value, value }))} value={size} onChange={value => setSize(value as ControlSize)} />
      <ChoiceControl label="Animation" options={LED_ANIMATIONS.map(value => ({ label: value, value }))} value={animation} onChange={value => setAnimation(value as LedAnimation)} />
      <ToggleRow label="Lit" checked={lit} onChange={setLit} />
      <Control label={`Glow intensity · ${glowIntensity}`}><input aria-label="Glow intensity" className="w-full" type="range" min="0" max="3" step="0.1" value={glowIntensity} onChange={event => setGlowIntensity(Number(event.target.value))} /></Control>
      <ChoiceControl label="Cycle duration" options={[600, 1000, 1600, 2400, 4000].map(value => ({ label: `${value}ms`, value: String(value) }))} value={String(duration)} onChange={value => setDuration(Number(value))} />
    </div>} preview={<div className="flex min-h-48 w-full flex-col items-center justify-center gap-8">
      <Led tone={tone} size={size} variant={variant} animation={animation} lit={lit} glowIntensity={glowIntensity} duration={duration} label={lit ? "Signal on" : "Signal off"} />
      <span className="text-xs text-neutral-500 dark:text-neutral-400">{size} · {tone} · {lit ? animation : "off"}</span>
    </div>} />
    <ExampleCard title="Status signals" description="Pair signals with visible text so status does not depend on color or motion alone." code={signalsCode} filename="Signals.tsx"><Signals /></ExampleCard>
    <section className="space-y-5 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800">
      <h2 className="font-semibold text-neutral-800 dark:text-neutral-100">Sizes and motion</h2>
      <div className="flex flex-wrap items-center gap-8 py-4">{CONTROL_SIZES.map(value => <span key={value} className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400"><Led size={value} tone={tone} />{value}</span>)}</div>
      <div className="flex flex-wrap items-center gap-8 py-4">{LED_ANIMATIONS.map(value => <span key={value} className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400"><Led size="lg" tone={tone} animation={value} />{value}</span>)}</div>
      <h2 className="font-semibold text-neutral-800 dark:text-neutral-100">Every real color</h2>
      <div className="flex flex-wrap gap-7 py-4">{TRUE_COLORS.map(value => <span key={value} className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400"><Led tone={value} />{value}</span>)}</div>
    </section>
    <A11ySection><A11yTopic title="Accessible signals"><p>Supply label or aria-label to expose a named image. Omit both for a decorative LED beside visible status text. Motion does not trigger live announcements. Reduced motion stops all effects; off LEDs retain a dim core without glow. Pair important states with text.</p></A11yTopic></A11ySection>
    <PropsTable props={[
      { name: "variant", type: '"lit" | "flat"', default: '"lit"', description: "Lit adds a core highlight and rim. Flat uses a solid tone-colored circle. Both retain glow, animations and on/off behavior." },
      { name: "tone", type: "TrueColor", default: '"emerald"', description: "Shared real-color ink: 500 in light mode, 400 in dark mode. Core highlights and halo derive from currentColor, including custom theme palettes." },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "Dot diameters: 6, 8, 10, 14 and 18px. Halo scales with the dot and does not change layout size." },
      { name: "animation", type: '"none" | "pulse" | "breathe" | "blink" | "vibrate"', default: '"none"', description: "Steady light, expanding halo, breathing brightness, intermittent signal or small vibration. Disabled by reduced motion or lit=false." },
      { name: "lit / glowIntensity / duration", type: "boolean / number / number", default: "true / 1 / 1600", description: "On/off state, halo strength (0–3), cycle duration in milliseconds (minimum 600). Non-finite numeric settings fall back to defaults." },
      { name: "label / aria-label", type: "string", description: "Optional accessible name. Unnamed LEDs are decorative. Native span attributes, className, style and ref are forwarded." },
    ]} />
  </div>;
}
