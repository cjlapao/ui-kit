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
  const [loop, setLoop] = useState(true), [expandable, setExpandable] = useState(true);
  const [expanded, setExpanded] = useState(false), [showExpandButton, setShowExpandButton] = useState(true);
  const [expandOnHover, setExpandOnHover] = useState(false), [hoverExpandDelay, setHoverExpandDelay] = useState(2000);
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
      <ToggleRow label="Infinite navigation" checked={loop} onChange={setLoop} />
      <ToggleRow label="Allow expansion" checked={expandable} onChange={setExpandable} />
      <ToggleRow label="Expand button" checked={showExpandButton} onChange={setShowExpandButton} />
      <ToggleRow label="Expand after stationary hover" checked={expandOnHover} onChange={setExpandOnHover} />
      <ChoiceControl label="Hover delay" options={[1000, 2000, 3000].map(value => ({ label: `${value / 1000}s`, value: String(value) }))} value={String(hoverExpandDelay)} onChange={value => setHoverExpandDelay(Number(value))} />
      <button type="button" aria-expanded={expandable && expanded} disabled={!expandable} onClick={() => setExpanded(value => !value)} className="rounded-md border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">Consumer button: {expanded ? "collapse" : "expand"}</button>
    </div>} preview={
      <div className="mx-auto w-full max-w-lg py-4">
        <StackCarousel items={TASKS.slice(0, count)} getItemKey={task => task.id} getItemLabel={task => task.title}
          activeIndex={index} onActiveIndexChange={setIndex} visibleCount={visibleCount} wheel={wheel} showNavigators={navigators} showStatus={showStatus}
          loop={loop} expandable={expandable} expanded={expanded} onExpandedChange={setExpanded} showExpandButton={showExpandButton} expandOnHover={expandOnHover} hoverExpandDelay={hoverExpandDelay}
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
      { name: "loop", type: "boolean", default: "true", description: "Set false for finite wheel, swipe, keyboard and button navigation. Stops at the first/last item, disables end navigators, and never peeks wrapped items." },
      { name: "expandable / expanded / defaultExpanded / onExpandedChange", type: "boolean / boolean / boolean / (expanded) => void", default: "false / — / false / —", description: "Enable expansion into a vertical list with every card interactive. Control expanded from any consumer button, or use internal state. Expanded mode preserves the active index and uses normal page scrolling." },
      { name: "showExpandButton / expandOnHover / hoverExpandDelay", type: "boolean / boolean / number", default: "false / false / 2000", description: "Optional footer expand/collapse button, independent of navigators. Stationary mouse hover expands after the delay (ms); pointer movement and wheel activity restart the timer, including nested scrolling and when wheel navigation is disabled. Only hover-opened lists collapse on pointer leave. Touch does not trigger hover expansion." },
      { name: "expandLabel / collapseLabel", type: "string", default: '"Expand stack" / "Collapse stack"', description: "Consumer-localized toggle labels." },
      { name: "hoverCollapseDelay", type: "number", default: "500", description: "Delay in milliseconds before a hover-opened list collapses after pointer leave. Returning before the delay cancels collapse. Button-opened lists remain open." },
      { name: "showStatus", type: "boolean", default: "true", description: "Hide the title and position below the deck when false. Screen-reader navigation announcements remain available. Independent of showNavigators; hiding both removes the visible footer space." },
      { name: "items / renderItem / getItemKey", type: "readonly T[] / (item, index) => ReactNode / (item, index) => Key", description: "Supply nodes or render data. Stable keys preserve visible card state during rotations. Collapsed mode mounts only visible layers and the outgoing card; expanded mode mounts all items." },
      { name: "activeIndex / defaultActiveIndex", type: "number", default: "— / 0", description: "Controlled or initial active index. Navigation wraps continuously in both directions." },
      { name: "onActiveIndexChange", type: "(index: number) => void", description: "Called for wheel, swipe, keyboard, navigator and peeking-card navigation." },
      { name: "visibleCount / stackOffset", type: "number", default: "3 / 12", description: "Includes the active card; visible layers are capped at three. Each peeking layer adds stackOffset pixels to the measured active height." },
      { name: "variant / tone / corner / padding / transparency", type: "PanelProps", default: '"elevated" / "blue" / "auto" / "sm" / variant default', description: "Shared Panel surface properties apply to every card." },
      { name: "wheel / swipe / showNavigators", type: "boolean", default: "true", description: "Enable wheel navigation, vertical swipes and previous/next buttons independently." },
      { name: "ariaLabel / previousLabel / nextLabel / getItemLabel / emptyState", type: "string / function / ReactNode", description: "Consumer-owned labels and empty content. Other HTML attributes and className/style apply to the root." },
    ]} />
  </div>;
}
