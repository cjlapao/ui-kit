import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import climateCode from "./examples/SyncedClimate.tsx?raw";
import scalesCode from "./examples/SyncedScales.tsx?raw";
import SyncedClimate from "./examples/SyncedClimate";
import SyncedScales from "./examples/SyncedScales";

/**
 * Synced charts — `Chart.Group` + the `sync` prop.
 *
 * Hovering any member card broadcasts the hovered **category** (the
 * shared x value, e.g. a month) to every other `sync` member, which
 * renders its own crosshair + tooltip at its own pixel position for
 * that category. Members can have different sizes, y scales, and
 * series types; the shared key is the category, not the pixel.
 */

export const SyncedChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Synced charts"
      description="Join several charts into one hover: wrap them in Chart.Group and mark each with the sync prop. Hovering any card drives crosshair + tooltip on the others at the same category — no shared pixels or scales required."
    />
    <section className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900">
      <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
        How it works
      </h2>
      <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-600 dark:text-neutral-300">
        <li>
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
            &lt;Chart.Group&gt;
          </code>{" "}
          wraps the cards (it renders them verbatim — layout classes live in
          your markup, e.g. a CSS grid) and provides the sync context.
        </li>
        <li>
          Each participating chart is a{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
            &lt;Chart.Svg sync /&gt;
          </code>
          (or <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">Chart.Canvas</code>
          ). Charts without <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">sync</code>
          keep purely local hover.
        </li>
        <li>
          Sync is keyed on the shared <strong>category value</strong> (the
          categorical x, e.g. the month), not on pixel position — members can
          differ in size, y scale, and series type as long as they share the
          categories.
        </li>
        <li>
          Leaving a card (or its plot area) broadcasts a clear, so every
          member drops its crosshair and tooltip together.
        </li>
        <li>
          Scope (v1): cartesian members (line, bar, range, scatter, radar,
          waterfall). Non-cartesian series like the solar heatmap below keep
          local hover and don't join the broadcast.
        </li>
      </ul>
    </section>
    <ExampleCard
      title="Climate overview"
      description="One grid, four charts: smooth temperature lines (°C), rainfall bars (mm), a UV radar, and a solar heatmap — all sharing the month categories. Hover any card and the others follow at the same month. (Heatmap hover stays local in v1.)"
      code={climateCode}
      filename="SyncedClimate.tsx"
    >
      <SyncedClimate />
    </ExampleCard>
    <ExampleCard
      title="Two scales, one axis"
      description="A °C line and a 0–10 UV bar sync perfectly because the shared key is the month category — the y scales stay independent."
      code={scalesCode}
      filename="SyncedScales.tsx"
    >
      <SyncedScales />
    </ExampleCard>
  </div>
);

export default SyncedChartPage;
