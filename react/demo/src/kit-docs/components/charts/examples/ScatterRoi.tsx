import { Chart } from "@cjlapao/ui-kit";
import {
  filmsDisney,
  filmsParamount,
  filmsSony,
  filmsUniversal,
  filmsWarner,
} from "../data";

/**
 * Blockbuster ROI — production budget vs worldwide gross, 2011–2023.
 * Log-log axes collapse constant-ROI lines into straight parallels; the
 * 5× / 10× dashed rules are two-point reference lines.
 */
export default function ScatterRoi() {
  return (
    <Chart.Svg height={440} hoverDim={0.35}>
      <Chart.Title
        title="Blockbuster ROI — budget vs worldwide gross, 2011–2023"
        subtitle="Bubble = films in franchise · Log-log axes collapse constant-ROI lines into straight parallels · Source: Box Office Mojo · The-Numbers.com"
      />
      <Chart.Scatter
        data={filmsDisney}
        name="Disney / Marvel / Lucasfilm"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#f472b6"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsUniversal}
        name="Universal"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#60a5fa"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsWarner}
        name="Warner Bros"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#818cf8"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsParamount}
        name="Paramount"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#fb923c"
        fillOpacity={0.85}
      />
      <Chart.Scatter
        data={filmsSony}
        name="Sony / Columbia"
        xField="x"
        yField="y"
        sizeField="size"
        minSize={6}
        maxSize={26}
        color="#34d399"
        fillOpacity={0.85}
      />
      <Chart.ReferenceLine
        x={50}
        y={500}
        x2={550}
        y2={5_000}
        color="#94a3b8"
        dash={[6, 5]}
        label="10× ROI"
      />
      <Chart.ReferenceLine
        x={50}
        y={250}
        x2={550}
        y2={2_500}
        color="#94a3b8"
        dash={[6, 5]}
        label="5× ROI"
      />
      <Chart.Annotation
        x={150}
        y={1_074}
        tone="indigo"
        title="Joker · 7.2× ROI"
        placement="left"
      />
      <Chart.Annotation
        x={150}
        y={1_494}
        tone="orange"
        title="Top Gun: Mav · 8.8× ROI"
        placement="top"
      />
      <Chart.Annotation
        x={320}
        y={2_071}
        tone="pink"
        title="Endgame · 6.5× ROI"
        placement="top"
      />
      <Chart.XAxis
        label="Production budget"
        log
        tickCount={5}
        format={(t) => `$${Number(t) >= 1000 ? `${Number(t) / 1000}B` : `${t}M`}`}
      />
      <Chart.YAxis
        label="Worldwide box-office gross"
        log
        tickCount={5}
        format={(t) =>
          `$${Number(t) >= 1000 ? `${Number(t) / 1000}.00B` : `${t}M`}`
        }
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
