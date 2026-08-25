import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import LineReference from "./examples/LineReference";
import lineReferenceCode from "./examples/LineReference.tsx?raw";
import LineCurves from "./examples/LineCurves";
import lineCurvesCode from "./examples/LineCurves.tsx?raw";
import DualAxis from "./examples/DualAxis";
import dualAxisCode from "./examples/DualAxis.tsx?raw";
import BarModes from "./examples/BarModes";
import barModesCode from "./examples/BarModes.tsx?raw";
import PieDonut from "./examples/PieDonut";
import pieDonutCode from "./examples/PieDonut.tsx?raw";
import CandlestickDemo from "./examples/CandlestickDemo";
import candlestickCode from "./examples/CandlestickDemo.tsx?raw";
import Annotations from "./examples/Annotations";
import annotationsCode from "./examples/Annotations.tsx?raw";

export const ChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Chart"
      description="PrimeUI-style compound charts — line, bar/column, pie/donut and candlestick — with entrance and update animations, dual axes, reference bands and callouts, and matching SVG and Canvas renderers. Compose the same children for either renderer."
    />
    <ChartPlayground />
    <section className="flex flex-col gap-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Examples
      </h2>
      <ExampleCard
        title="Growth metrics (line)"
        description="The reference chart: four indexed series, three phase windows, an indexed baseline, the pricing-lift crosshair, two callouts and end-of-series badges."
        code={lineReferenceCode}
        filename="LineReference.tsx"
      >
        <LineReference />
      </ExampleCard>
      <ExampleCard
        title="Curves, dashes & markers"
        description="Linear, smooth and step interpolation plus dashed/dotted styles and square markers."
        code={lineCurvesCode}
        filename="LineCurves.tsx"
      >
        <LineCurves />
      </ExampleCard>
      <ExampleCard
        title="Dual y-axes"
        description="The same data set on an index scale (left) and a dollar scale (right) — series opt in with yFieldAxis."
        code={dualAxisCode}
        filename="DualAxis.tsx"
      >
        <DualAxis />
      </ExampleCard>
      <ExampleCard
        title="Bar modes"
        description="Grouped, stacked and percent bars over one quarterly P&L — the mode is a single prop."
        code={barModesCode}
        filename="BarModes.tsx"
      >
        <BarModes />
      </ExampleCard>
      <ExampleCard
        title="Pie & donut"
        description="A donut with percent data labels beside a flat pie with a vertical legend."
        code={pieDonutCode}
        filename="PieDonut.tsx"
      >
        <PieDonut />
      </ExampleCard>
      <ExampleCard
        title="Candlestick"
        description="Three months of OHLC with a candle / hollow / OHLC-bar toggle, a target rule and a callout."
        code={candlestickCode}
        filename="CandlestickDemo.tsx"
      >
        <CandlestickDemo />
      </ExampleCard>
      <ExampleCard
        title="Annotations"
        description="Reference bands, dashed rules and annotation callouts with leader lines."
        code={annotationsCode}
        filename="Annotations.tsx"
      >
        <Annotations />
      </ExampleCard>
    </section>
  </div>
);

export default ChartPage;
