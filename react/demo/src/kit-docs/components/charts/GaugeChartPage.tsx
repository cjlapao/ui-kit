import React from "react";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { ChartPlayground } from "./ChartPlayground";
import GaugeSloBurn from "./examples/GaugeSloBurn";
import GaugeCo2 from "./examples/GaugeCo2";
import GaugeTemperature from "./examples/GaugeTemperature";
import gaugeSloBurnCode from "./examples/GaugeSloBurn.tsx?raw";
import gaugeCo2Code from "./examples/GaugeCo2.tsx?raw";
import gaugeTempCode from "./examples/GaugeTemperature.tsx?raw";

export const GaugeChartPage: React.FC = () => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8">
    <PageHeader
      name="Gauge"
      description="A single reading on an arc track: value-space color zones (discrete bands or smooth ramps), optional outside ticks, a target marker, and a 270°/180°/full sweep. Updates morph the arc in place — pair with a live feed for burn-style guardrails."
    />
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Playground
      </h2>
      <ChartPlayground fixedKind="gauge" />
    </section>
    <ExampleCard
      title="Edge SLO burn guardrail"
      description="A 270° gauge with a green→amber→red ramp, 40 threshold ticks and a target dot at the 90% freeze line. The value ticks up every 1.5 s and the arc morphs smoothly between readings."
      code={gaugeSloBurnCode}
      filename="GaugeSloBurn.tsx"
    >
      <GaugeSloBurn />
    </ExampleCard>
    <ExampleCard
      title="Atmospheric CO₂ — Mauna Loa"
      description="A ~300° donut on the 280–450 ppm scale: the gray track is the headroom above the current reading, and the center stacks value, unit, year-over-year delta and the pre-industrial baseline."
      code={gaugeCo2Code}
      filename="GaugeCo2.tsx"
    >
      <GaugeCo2 />
    </ExampleCard>
    <ExampleCard
      title="Global temperature anomaly"
      description="A 180° semicircle with four discrete zones — safe, warming, critical, and beyond-Paris — plus a target marker labeled at the 1.5°C Paris Agreement line."
      code={gaugeTempCode}
      filename="GaugeTemperature.tsx"
    >
      <GaugeTemperature />
    </ExampleCard>
  </div>
);

export default GaugeChartPage;
