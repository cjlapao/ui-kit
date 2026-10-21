import React, { useState } from "react";
import {
  CondensedStepper,
  TRUE_COLORS,
  type CondensedZone,
  type TrueColor,
} from "@cjlapao/ui-kit";
import type { StepperStep } from "@cjlapao/ui-kit";

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

const PRESETS: { key: "quiet" | CondensedZone; label: string; hint: string }[] = [
  { key: "quiet", label: "Default Quiet", hint: "hover to peek" },
  { key: "past", label: "Expand Left", hint: "done" },
  { key: "future", label: "Expand Right", hint: "pending" },
];

/**
 * The designer's playground: three reveal presets over the 12-step gate
 * flow, and a container-width slider — the card width and the panel width
 * are the same component behaving the same way; only the room changes.
 */
export const CondensedStepperPlayground: React.FC = () => {
  const [preset, setPreset] = useState<"quiet" | CondensedZone>("quiet");
  const [width, setWidth] = useState(860);
  const [lastHover, setLastHover] = useState<string | null>(null);
  const [stretch, setStretch] = useState(true);
  const [doneColor, setDoneColor] = useState<TrueColor>("emerald");
  const [nextColor, setNextColor] = useState<TrueColor>("gray");
  const say = (zone: string) => (hovered: boolean) =>
    setLastHover(`${zone}: ${hovered ? "hover in" : "hover out"}`);
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
            Interactive Playground:
          </span>{" "}
          hover a flank to peek, click to pin — or force a reveal below, and
          drag the width to watch the card and the panel behave the same.
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-neutral-200 p-1 dark:border-neutral-700">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPreset(p.key)}
              className={
                preset === p.key
                  ? "rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
                  : "rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
              }
            >
              {p.label}
              <span className="ml-1 opacity-60">({p.hint})</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setStretch((v) => !v)}
            aria-pressed={stretch}
            className={
              stretch
                ? "rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
                : "rounded-md px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-100"
            }
          >
            Stretch
            <span className="ml-1 opacity-60">
              ({stretch ? "full width" : "centred"})
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[11px] text-neutral-400">width</span>
        <input
          type="range"
          min={300}
          max={1080}
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className="w-40 accent-sky-500"
          aria-label="Container width"
        />
        <span className="font-mono text-[11px] text-neutral-400">{width}px</span>
        {(
          [
            { label: "done", value: doneColor, set: setDoneColor },
            { label: "next", value: nextColor, set: setNextColor },
          ] as const
        ).map((pick) => (
          <label
            key={pick.label}
            className="ml-3 flex items-center gap-1.5 font-mono text-[11px] text-neutral-400"
          >
            {pick.label}
            <select
              value={pick.value}
              onChange={(e) => pick.set(e.target.value as TrueColor)}
              className="rounded-md border border-neutral-200 bg-transparent px-1.5 py-0.5 text-xs dark:border-neutral-700"
            >
              {TRUE_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <div
        className="mx-auto overflow-x-auto rounded-lg border border-dashed border-neutral-300 px-4 py-6 transition-[width] duration-200 dark:border-neutral-700"
        style={{ width }}
      >
        <CondensedStepper
          steps={STEPS}
          currentIndex={9}
          actionLabel="Action Required"
          stretch={stretch}
          openZone={preset === "quiet" ? undefined : preset}
          doneColor={doneColor}
          nextColor={nextColor}
          onDoneHover={say("done")}
          onCurrentHover={say("current")}
          onNextHover={say("next")}
        />
      </div>
      <p className="text-center text-xs text-neutral-400 dark:text-neutral-500">
        Step 10 of 12 · <span className="text-rose-500">Gate Blocked</span> —
        awaiting a signature to unblock step 11 (Sign Key)
        <span className="ml-3 font-mono text-neutral-500 dark:text-neutral-400">
          {lastHover ?? "—"}
        </span>
      </p>
    </section>
  );
};
