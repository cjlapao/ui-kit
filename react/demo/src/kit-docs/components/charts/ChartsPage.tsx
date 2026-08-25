import React from "react";
import { Link } from "react-router-dom";
import { Panel } from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";

const TYPE_LINKS: { slug: string; label: string; blurb: string }[] = [
  {
    slug: "charts-line",
    label: "Line",
    blurb: "curves, styles, markers, area fills, dual y-axes",
  },
  {
    slug: "charts-bar",
    label: "Bar",
    blurb: "grouped, stacked and percent modes",
  },
  {
    slug: "charts-pie",
    label: "Pie & Donut",
    blurb: "gauge sweeps, gaps, in-slice percent labels",
  },
  {
    slug: "charts-candlestick",
    label: "Candlestick",
    blurb: "OHLC, hollow and bar variants, selected highlight",
  },
  {
    slug: "charts-range-area",
    label: "Range Area",
    blurb: "min–max corridors, gradient or flat band fills",
  },
  {
    slug: "charts-annotations",
    label: "Reference & Callouts",
    blurb: "bands, rules, annotation callouts",
  },
];

export const ChartsPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Charts"
      description="PrimeUI-style charting system — one set of children on matching SVG and Canvas renderers, with entrance and update animations, dual axes and shared hover chrome. Pick a type below or poke at the playground."
    />

    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        How it works
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel variant="outlined" padding="sm">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            One composition, two renderers
          </h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            Compose the same children — series, axes, legend, tooltip,
            reference marks — inside <code className="font-mono">&lt;Chart.Svg&gt;</code> or{" "}
            <code className="font-mono">&lt;Chart.Canvas&gt;</code>. Both renderers
            share the same scales, geometry and animation math.
          </p>
        </Panel>
        <Panel variant="outlined" padding="sm">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
            Real-time by design
          </h3>
          <p className="mt-1 text-sm leading-5 text-neutral-500 dark:text-neutral-400">
            Entrance animations grow every mark in; changing data plays an
            update animation that interpolates from the previous settled
            geometry. Stream new points (playground toggle below) to watch it
            live. Hover snaps to data and drives the tooltip, axis badges and
            crosshair.
          </p>
        </Panel>
      </div>
    </section>

    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Chart types
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TYPE_LINKS.map((t) => (
          <Link
            key={t.slug}
            to={`/docs/${t.slug}`}
            className="block rounded-lg border border-neutral-200 bg-white p-4 transition-colors hover:border-blue-400/60 dark:border-neutral-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
          >
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
              {t.label}
            </h3>
            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              {t.blurb}
            </p>
          </Link>
        ))}
      </div>
    </section>
  </div>
);

export default ChartsPage;
