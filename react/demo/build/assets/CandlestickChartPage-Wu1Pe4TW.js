import{r as s,j as e,M as r,b0 as a}from"./index-8i9ZNynb.js";import{P as o}from"./PageHeader-CO5k_SQv.js";import{E as d}from"./ExampleCard-LdxcpmX_.js";import{C as c}from"./ChartPlayground-CZyT5TXm.js";import{g as n}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";function x(){const[l,i]=s.useState("candle");return e.jsxs("div",{className:"flex w-full max-w-4xl flex-col items-center gap-4",children:[e.jsx(r,{size:"sm",options:[{label:"Candles",value:"candle"},{label:"Hollow",value:"hollow"},{label:"OHLC bars",value:"ohlc"}],value:l,onChange:t=>i(t)}),e.jsxs(a.Svg,{height:340,children:[e.jsx(a.Title,{title:"Trading days",subtitle:"Mar → Jun 2025 · synthesized OHLC"}),e.jsx(a.Candlestick,{data:n,name:"Index",variant:l}),e.jsx(a.ReferenceLine,{y:150,label:"Target 150",color:"sky"}),e.jsx(a.Annotation,{x:n[10].date,y:n[10].high,tone:"emerald",title:"Earnings pop",value:"+4.2%"}),e.jsx(a.XAxis,{}),e.jsx(a.YAxis,{tickCount:5}),e.jsx(a.Tooltip,{mode:"shared",itemFormat:t=>t.toFixed(2)}),e.jsx(a.Hover,{})]})]})}const h=`import { useState } from "react";
import { Chart, MultiToggle } from "@cjlapao/ui-kit";
import type { CandlestickVariant } from "@cjlapao/ui-kit";
import { candleDays } from "../data";

type Variant = CandlestickVariant;

/** Three months of OHLC with a variant toggle and a target reference line. */
export default function CandlestickDemo() {
  const [variant, setVariant] = useState<Variant>("candle");
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4">
      <MultiToggle
        size="sm"
        options={[
          { label: "Candles", value: "candle" },
          { label: "Hollow", value: "hollow" },
          { label: "OHLC bars", value: "ohlc" },
        ]}
        value={variant}
        onChange={(v) => setVariant(v as Variant)}
      />
      <Chart.Svg height={340}>
        <Chart.Title title="Trading days" subtitle="Mar → Jun 2025 · synthesized OHLC" />
        <Chart.Candlestick data={candleDays} name="Index" variant={variant} />
        <Chart.ReferenceLine y={150} label="Target 150" color="sky" />
        <Chart.Annotation
          x={candleDays[10].date}
          y={candleDays[10].high}
          tone="emerald"
          title="Earnings pop"
          value="+4.2%"
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
        <Chart.Tooltip mode="shared" itemFormat={(v) => v.toFixed(2)} />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`,k=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(o,{name:"Candlestick",description:"OHLC candles, hollow candles and OHLC bars. The hovered candle is highlighted (lighter color, wider body) with its close price called out above the wick."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(c,{fixedKind:"candlestick"})]}),e.jsx(d,{title:"Candlestick",description:"Three months of OHLC with a candle / hollow / OHLC-bar toggle, a target rule and a callout.",code:h,filename:"CandlestickDemo.tsx",children:e.jsx(x,{})})]});export{k as CandlestickChartPage,k as default};
