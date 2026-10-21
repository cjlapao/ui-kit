import React, { useState } from "react";
import {
  ColorSwatches,
  CondensedStepper,
  type CondensedZone,
  type ControlSize,
  type ExpandableButtonSpring,
  type StepperStep,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import { EventLogControl, useEventLog } from "../../shared/EventLog";
import {
  controlSizeOptions,
  surfaceVariantOptions,
} from "../../shared/options";

/** The twelve-step gate flow from the designer's mock. */
const STEPS: StepperStep[] = [
  ...[
    "Setup",
    "Fetch issues",
    "Plan",
    "Create PR",
    "Create code",
    "Unit tests",
    "Lint",
    "Secure code",
    "Scan deps",
  ].map((title, i) => ({ id: `s${i}`, title, status: "completed" as const })),
  { id: "gate", title: "Approve Gate", status: "error" },
  { id: "sign", title: "Sign Key" },
  { id: "deploy", title: "Deploy" },
];

const revealOptions = [
  { label: "Quiet", value: "quiet" },
  { label: "Past", value: "past" },
  { label: "Future", value: "future" },
];

const modeOptions = [
  { label: "Panel", value: "panel" },
  { label: "Card", value: "card" },
];

const springOptions = [
  { label: "Bouncy", value: "bouncy" },
  { label: "Snappy", value: "snappy" },
  { label: "Gentle", value: "gentle" },
  { label: "Precise", value: "precise" },
];

const expandOnOptions = [
  { label: "Hover", value: "hover" },
  { label: "Click", value: "click" },
];

const maxStepsOptions = ["3", "4", "5", "6", "8", "10"].map((n) => ({
  label: n,
  value: n,
}));

/**
 * The playground on the kit's shared scaffolding: option groups on the
 * left, the live ruler on the right. Width is the playground's own
 * control — the strip never sizes itself; drag it and the five-track
 * template squeezes in place. Colour is a palette, not a dropdown of
 * colour names.
 */
export const CondensedStepperPlayground: React.FC = () => {
  const [log, pushLog] = useEventLog();

  const [size, setSize] = useState<ControlSize>("md");
  const [mode, setMode] = useState<"panel" | "card">("panel");
  const [surface, setSurface] = useState<SurfaceVariant>("outlined");
  const [spring, setSpring] = useState<ExpandableButtonSpring>("bouncy");

  const [preset, setPreset] = useState<"quiet" | CondensedZone>("quiet");
  const [expandOn, setExpandOn] = useState<"hover" | "click">("hover");
  const [stretch, setStretch] = useState(true);
  const [maxSteps, setMaxSteps] = useState(6);
  const [interactive, setInteractive] = useState(true);
  const [animated, setAnimated] = useState(true);

  const [tone, setTone] = useState<TrueColor>("blue");
  const [doneColor, setDoneColor] = useState<TrueColor>("emerald");
  const [nextColor, setNextColor] = useState<TrueColor>("gray");

  // The run moves: the strip's flanks are honest, so advancing the
  // anchor is how you watch the quiet six walk and the newcomer fido.
  const [current, setCurrent] = useState(9);
  const [width, setWidth] = useState(860);

  const say = (zone: string) => (hovered: boolean) =>
    pushLog(`${zone}: ${hovered ? "hover in" : "hover out"}`);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                defaultOpen: true,
                controls: (
                  <>
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(v) => setSize(v as ControlSize)}
                    />
                    <ChoiceControl
                      label="Mode"
                      options={modeOptions}
                      value={mode}
                      onChange={(v) => setMode(v as "panel" | "card")}
                    />
                    <SelectControl
                      label="Surface variant"
                      options={surfaceVariantOptions}
                      value={surface}
                      onChange={(v) => setSurface(v as SurfaceVariant)}
                    />
                    <ChoiceControl
                      label="Spring"
                      options={springOptions}
                      value={spring}
                      onChange={(v) => setSpring(v as ExpandableButtonSpring)}
                    />
                  </>
                ),
              },
              {
                id: "reveal",
                title: "Reveal",
                defaultOpen: true,
                controls: (
                  <>
                    <ChoiceControl
                      label="Force reveal"
                      options={revealOptions}
                      value={preset}
                      onChange={(v) => setPreset(v as "quiet" | CondensedZone)}
                    />
                    <ChoiceControl
                      label="Expand on"
                      options={expandOnOptions}
                      value={expandOn}
                      onChange={(v) => setExpandOn(v as "hover" | "click")}
                    />
                    <SelectControl
                      label="Max steps per flank"
                      options={maxStepsOptions}
                      value={String(maxSteps)}
                      onChange={(v) => setMaxSteps(Number(v))}
                    />
                    <ToggleRow
                      label="Stretch (ruler)"
                      checked={stretch}
                      onChange={setStretch}
                    />
                    <ToggleRow
                      label="Interactive"
                      checked={interactive}
                      onChange={setInteractive}
                    />
                    <ToggleRow
                      label="Animated"
                      checked={animated}
                      onChange={setAnimated}
                    />
                  </>
                ),
              },
              {
                id: "colours",
                title: "Colours",
                controls: (
                  <>
                    {/* Colour is a palette, not a dropdown of colour names. */}
                    <Control label="Tone">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={tone}
                        onSelect={setTone}
                        defaultExpanded
                      />
                    </Control>
                    <Control label="Done">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={doneColor}
                        onSelect={setDoneColor}
                        defaultExpanded
                      />
                    </Control>
                    <Control label="Next">
                      <ColorSwatches
                        selectable
                        size="sm"
                        value={nextColor}
                        onSelect={setNextColor}
                        defaultExpanded
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "run",
                title: "The run",
                defaultOpen: true,
                controls: (
                  <Control label="Current step">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Undo one step"
                        onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                        className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        ◀
                      </button>
                      <span className="flex-1 text-center font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                        {current + 1} / {STEPS.length}
                      </span>
                      <button
                        type="button"
                        aria-label="Complete one step"
                        onClick={() =>
                          setCurrent((c) => Math.min(STEPS.length - 1, c + 1))
                        }
                        className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-neutral-800"
                      >
                        ▶
                      </button>
                    </div>
                    <p className="text-[11px] leading-snug text-neutral-400 dark:text-neutral-500">
                      Pin a flank, then complete steps — the revealed six walk
                      with the newcomer springing in.
                    </p>
                  </Control>
                ),
              },
            ]}
          />
          <Control label="Container width">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={300}
                max={1080}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full accent-sky-500"
                aria-label="Container width"
              />
              <span className="w-12 shrink-0 text-right font-mono text-[11px] text-neutral-400">
                {width}px
              </span>
            </div>
          </Control>
        </div>
      }
      preview={
        <div className="flex w-full flex-col gap-4">
          <div
            className="mx-auto overflow-x-auto rounded-lg border border-dashed border-neutral-300/70 px-4 py-6 transition-[width] duration-200 dark:border-neutral-600/70"
            style={{ width: Math.min(width, 1080) }}
          >
            <CondensedStepper
              steps={STEPS}
              currentIndex={current}
              actionLabel="Action Required"
              size={size}
              mode={mode}
              variant={surface}
              spring={spring}
              stretch={stretch}
              maxSteps={maxSteps}
              interactive={interactive}
              animated={animated}
              expandOn={expandOn}
              openZone={preset === "quiet" ? undefined : preset}
              tone={tone}
              doneColor={doneColor}
              nextColor={nextColor}
              onStepSelect={
                interactive
                  ? (step, index) =>
                      pushLog(`select: step ${index + 1} — ${step.title}`)
                  : undefined
              }
              onOpenChange={(zone) =>
                pushLog(zone ? `reveal: ${zone}` : "reveal: closed")
              }
              onDoneHover={say("done")}
              onCurrentHover={say("current")}
              onNextHover={say("next")}
            />
          </div>
          <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
            The strip is a ruler: drag the width and the dashes run to their
            floors before the anchor yields. The backdrop toggle puts glass
            over a real background.
          </p>
          <EventLogControl
            log={log}
            emptyText="No events yet — hover a flank, pin it, or click a revealed step."
          />
        </div>
      }
    />
  );
};
