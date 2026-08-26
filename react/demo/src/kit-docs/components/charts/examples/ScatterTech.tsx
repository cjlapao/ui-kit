import { Chart } from "@cjlapao/ui-kit";
import {
  techHardware,
  techSemis,
  techServices,
  techSoftware,
} from "../data";

/**
 * US tech profitability — revenue vs net margin by sub-industry. Bubble
 * area = headcount; the teal band is the high-margin zone and the dashed
 * rule is the industry average.
 */
export default function ScatterTech() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="US tech profitability — Fortune 100 by sub-industry, FY2023"
        subtitle="Revenue ($B) vs net margin (%) · bubble = employees · Source: Fortune 500 · 10-K filings"
      />
      <Chart.Scatter
        data={techSoftware}
        name="Software"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#38bdf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techHardware}
        name="Hardware"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#fb923c"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techServices}
        name="Internet & Services"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#818cf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={techSemis}
        name="Semiconductors"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={5}
        maxSize={20}
        color="#34d399"
        fillOpacity={0.85}
      />
      <Chart.ReferenceBand y1={30} y2={60} color="teal" opacity={0.08} label="High-margin zone (30%+)" />
      <Chart.ReferenceLine
        y={19.4}
        label="Industry avg · 19.4%"
        color="#94a3b8"
      />
      <Chart.Annotation
        x={96}
        y={48.9}
        tone="green"
        title="Nvidia · 48.9%"
        placement="left"
      />
      <Chart.XAxis label="Revenue ($B)" tickCount={8} format={(t) => `$${t}B`} />
      <Chart.YAxis label="Net margin (%)" tickCount={7} format={(t) => `${t}%`} />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
