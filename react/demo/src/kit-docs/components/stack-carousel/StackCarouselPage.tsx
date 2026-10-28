import { useState } from "react";
import { ColorSwatches, StackCarousel, type PanelProps, type TrueColor } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { A11ySection, A11yTopic, PropsTable } from "../../shared/A11ySections";
import { ChoiceControl, Control, PlaygroundPanel, ToggleRow } from "../../shared/PlaygroundPanel";
import { panelCornerOptions, panelPaddingOptions, surfaceVariantOptions } from "../../shared/options";
import Tasks, { TASKS, TaskContent } from "./examples/Tasks";
import tasksCode from "./examples/Tasks.tsx?raw";

export default function StackCarouselPage() {
  const [count, setCount] = useState(5);
  const [visibleCount, setVisibleCount] = useState(3);
  const [index, setIndex] = useState(0);
  const [wheel, setWheel] = useState(true);
  const [navigators, setNavigators] = useState(true);
  const [showStatus, setShowStatus] = useState(true);
  const [variant, setVariant] = useState<PanelProps["variant"]>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [offset, setOffset] = useState(12);
  const [corner, setCorner] = useState<PanelProps["corner"]>("auto");
  const [padding, setPadding] = useState<PanelProps["padding"]>("sm");
  return <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader name="Stack Carousel" description="One active card over a circular deck. Wheel, swipe, use the arrow keys, or click a peeking card to bring it forward. Up to three layers are visible; the stack follows the active card’s height." />
    <PlaygroundPanel controls={<div className="space-y-4">
      <ChoiceControl label="Items" options={[0, 1, 2, 3, 5].map(value => ({ label: String(value), value: String(value) }))} value={String(count)} onChange={value => { setCount(Number(value)); setIndex(0); }} />
      <ChoiceControl label="Visible layers" options={[1, 2, 3].map(value => ({ label: String(value), value: String(value) }))} value={String(visibleCount)} onChange={value => setVisibleCount(Number(value))} />
      <ChoiceControl label="Variant" options={surfaceVariantOptions} value={variant!} onChange={value => setVariant(value as PanelProps["variant"])} />
      <Control label="Tone"><ColorSwatches selectable value={tone} onSelect={setTone} size="sm" /></Control>
      <ChoiceControl label="Stack offset" options={[8, 12, 16, 24].map(value => ({ label: `${value}px`, value: String(value) }))} value={String(offset)} onChange={value => setOffset(Number(value))} />
      <ChoiceControl label="Corner" options={panelCornerOptions} value={corner!} onChange={value => setCorner(value as PanelProps["corner"])} />
      <ChoiceControl label="Padding" options={panelPaddingOptions} value={padding!} onChange={value => setPadding(value as PanelProps["padding"])} />
      <ToggleRow label="Wheel navigation" checked={wheel} onChange={setWheel} />
      <ToggleRow label="Navigation buttons" checked={navigators} onChange={setNavigators} />
      <ToggleRow label="Title and position" checked={showStatus} onChange={setShowStatus} />
    </div>} preview={
      <div className="mx-auto w-full max-w-lg py-4">
        <StackCarousel items={TASKS.slice(0, count)} getItemKey={task => task.id} getItemLabel={task => task.title}
          activeIndex={index} onActiveIndexChange={setIndex} visibleCount={visibleCount} wheel={wheel} showNavigators={navigators} showStatus={showStatus}
          variant={variant} tone={tone} stackOffset={offset} corner={corner} padding={padding} renderItem={task => <TaskContent task={task} />} />
      </div>
    } />
    <ExampleCard title="Circular task deck" description="Five items, three visible layers, and cards with different heights. Click either exposed strip, or scroll over the deck. The action inside the front card remains a normal button."
      code={tasksCode} filename="Tasks.tsx"><Tasks /></ExampleCard>
    <A11ySection><A11yTopic title="Keyboard and focus"><p>Tab to the carousel and use arrow keys to rotate; Home and End jump to the first and last item. Previous/next buttons and peeking-card buttons are keyboard accessible. Only the active card’s contents can receive focus. The status announces the active item and position. Reduced motion removes transitions.</p></A11yTopic>
      <A11yTopic title="Scrolling and touch"><p>Wheel and vertical swipe gestures wrap in both directions. A continuous wheel gesture advances one card. Nested scroll areas scroll their content first, then pass navigation to the deck at their boundary. Inputs and other editable controls retain their own wheel behavior. Pinch-to-zoom is preserved.</p></A11yTopic>
      <A11yTopic title="Internationalization"><p>Provide ariaLabel, previousLabel, nextLabel, getItemLabel and emptyState in your app’s language. Item content is supplied by the consumer.</p></A11yTopic>
    </A11ySection>
    <PropsTable props={[
      { name: "showStatus", type: "boolean", default: "true", description: "Hide the title and position below the deck when false. Screen-reader navigation announcements remain available. Independent of showNavigators; hiding both removes the visible footer space." },
      { name: "items / renderItem / getItemKey", type: "readonly T[] / (item, index) => ReactNode / (item, index) => Key", description: "Supply nodes or render data. Stable keys preserve visible card state during rotations. Only the visible layers and outgoing card are mounted." },
      { name: "activeIndex / defaultActiveIndex", type: "number", default: "— / 0", description: "Controlled or initial active index. Navigation wraps continuously in both directions." },
      { name: "onActiveIndexChange", type: "(index: number) => void", description: "Called for wheel, swipe, keyboard, navigator and peeking-card navigation." },
      { name: "visibleCount / stackOffset", type: "number", default: "3 / 12", description: "Includes the active card; visible layers are capped at three. Each peeking layer adds stackOffset pixels to the measured active height." },
      { name: "variant / tone / corner / padding / transparency", type: "PanelProps", default: '"elevated" / "blue" / "auto" / "sm" / variant default', description: "Shared Panel surface properties apply to every card." },
      { name: "wheel / swipe / showNavigators", type: "boolean", default: "true", description: "Enable wheel navigation, vertical swipes and previous/next buttons independently." },
      { name: "ariaLabel / previousLabel / nextLabel / getItemLabel / emptyState", type: "string / function / ReactNode", description: "Consumer-owned labels and empty content. Other HTML attributes and className/style apply to the root." },
    ]} />
  </div>;
}
