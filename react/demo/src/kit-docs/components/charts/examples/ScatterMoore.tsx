import { Chart } from "@cjlapao/ui-kit";
import { mooreData } from "../data";

/**
 * Moore's Law — transistor count per microprocessor, 1971–2024. A log y
 * axis flattens the 2×-per-2-years trend into a straight line; the dashed
 * two-point reference is the classic 2×/2yr line and the callouts mark the
 * barrier chips.
 */
export default function ScatterMoore() {
  return (
    <Chart.Svg height={420}>
      <Chart.Title
        title="Moore's Law — transistor count per microprocessor, 1971–2024"
        subtitle="Log-y axis flattens 2×/2yr into a straight line · Source: Intel/AMD/NVIDIA/Apple/IBM spec sheets"
      />
      <Chart.Scatter
        data={mooreData}
        name="Transistors"
        xField="year"
        yField="count"
        minSize={5}
        maxSize={11}
        color="#60a5fa"
        borderWidth={1}
      />
      <Chart.ReferenceLine
        x={1971}
        y={2_300}
        x2={2024}
        y2={110_000_000_000}
        color="#f87171"
        dash={[6, 5]}
      />
      <Chart.Annotation
        x={1971}
        y={2_300}
        tone="blue"
        title="Intel 4004 — the origin"
        placement="right"
      />
      <Chart.Annotation
        x={1989}
        y={1_200_000}
        tone="amber"
        title="1M barrier · Intel 80486"
        placement="right"
      />
      <Chart.Annotation
        x={2008}
        y={731_000_000}
        tone="amber"
        title="1B barrier · Nehalem-EX"
        placement="top"
      />
      <Chart.Annotation
        x={2021}
        y={114_000_000_000}
        tone="red"
        title="Moore's Law · 2× / 2 yr"
        value="Apple M1 Ultra · 114B"
        placement="left"
      />
      <Chart.Annotation
        x={2024}
        y={208_000_000_000}
        tone="blue"
        title="NVIDIA B200 · 208B"
        placement="left"
      />
      <Chart.XAxis label="Year" tickCount={9} />
      <Chart.YAxis label="Transistor count" log tickCount={5} domain={[1_000, 500_000_000_000]} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
