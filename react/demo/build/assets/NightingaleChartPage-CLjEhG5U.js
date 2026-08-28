import{j as e,b0 as n}from"./index-8i9ZNynb.js";import{P as g}from"./PageHeader-CO5k_SQv.js";import{E as c}from"./ExampleCard-LdxcpmX_.js";import{C as h}from"./ChartPlayground-CZyT5TXm.js";import{o as f,T as r}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";const m=["#60a5fa","#60a5fa","#f59e0b","#f43f5e","#f43f5e","#f43f5e","#f59e0b","#f59e0b","#f59e0b","#60a5fa","#60a5fa","#60a5fa"];function p(){return e.jsxs(n.Svg,{height:420,ariaLabel:"US tornado climatology by month",children:[e.jsx(n.Title,{title:"US tornado climatology — average by month",subtitle:"Source: NOAA Storm Prediction Center · 1991–2020 climatological average · Red: peak season (Apr–Jun) · Amber: active shoulder (Mar, Jul–Aug)"}),e.jsx(n.Pie,{data:f,name:"Tornadoes",categoryField:"name",valueField:"value",nightingale:!0,innerRadius:.18,outerRadius:.8,startAngle:-Math.PI/12,padAngle:.02,colors:m})]})}const b=["#3b82f6","#38bdf8","#2dd4bf","#2dd4bf","#14b8a6","#0ea5e9","#0ea5e9","#f59e0b","#fb923c","#f87171","#f87171","#3b82f6"],u=[{from:10,to:1,color:"#5daeea",label:"Winter"},{from:2,to:4,color:"#4ecdc4",label:"Spring"},{from:5,to:7,color:"#ffad5a",label:"Summer"},{from:8,to:9,color:"#ff7a66",label:"Fall"}],d=r.reduce((t,i)=>t+i.value,0)/r.length;function A(){return e.jsxs(n.Svg,{height:460,ariaLabel:"US monthly precipitation 2024",children:[e.jsx(n.Title,{title:"US average monthly precipitation 2024",subtitle:"Source: NOAA Climate Data Online · 48 contiguous states average · 2024 data"}),e.jsx(n.Pie,{data:r,name:"Precipitation",categoryField:"name",valueField:"value",nightingale:!0,innerRadius:.32,outerRadius:.78,cornerRadius:5,startAngle:-Math.PI/12,padAngle:.026,colors:b,nightingaleTicks:!0,nightingaleBands:u,peakLabel:"PEAK"}),e.jsx(n.PieCenter,{title:"Annual avg",value:`${d.toFixed(2)}″`}),e.jsx(n.Tooltip,{rows:t=>{const i=r[t.index??0],s=i.value-d,l=s>=0;return[{label:"Precipitation",value:`${i.value.toFixed(2)}″`},{label:"vs Annual avg",value:`${l?"▲":"▼"} ${l?"+":""}${s.toFixed(2)}″`,color:l?"#10a981":"#e5484d"},{label:"Season",value:u.find(a=>{const o=t.index??0;return a.to>=a.from?o>=a.from&&o<=a.to:o>=a.from||o<=a.to})?.label??"—"}]}}),e.jsx(n.Hover,{})]})}const v=`import { Chart } from "@cjlapao/ui-kit";
import { nightingaleTornado } from "../data";

const SEASON_COLORS = [
  "#60a5fa", // Jan quiet
  "#60a5fa", // Feb quiet
  "#f59e0b", // Mar shoulder
  "#f43f5e", // Apr peak
  "#f43f5e", // May peak
  "#f43f5e", // Jun peak
  "#f59e0b", // Jul shoulder
  "#f59e0b", // Aug shoulder
  "#f59e0b", // Mar/Aug shoulder
  "#60a5fa", // Oct quiet
  "#60a5fa", // Nov quiet
  "#60a5fa", // Dec quiet
];

/**
 * US tornado climatology (1991–2020 average by month). Nightingale mode:
 * every month gets an equal 30° wedge whose radius encodes the count — the
 * Apr–Jun peak bulges, quiet months hug the hub. Outside labels carry the
 * month name + average count.
 */
export function NightingaleTornado() {
  return (
    <Chart.Svg height={420} ariaLabel="US tornado climatology by month">
      <Chart.Title
        title="US tornado climatology — average by month"
        subtitle="Source: NOAA Storm Prediction Center · 1991–2020 climatological average · Red: peak season (Apr–Jun) · Amber: active shoulder (Mar, Jul–Aug)"
      />
      <Chart.Pie
        data={nightingaleTornado}
        name="Tornadoes"
        categoryField="name"
        valueField="value"
        nightingale
        innerRadius={0.18}
        outerRadius={0.8}
        startAngle={-Math.PI / 12}
        padAngle={0.02}
        colors={SEASON_COLORS}
      />
    </Chart.Svg>
  );
}

export default NightingaleTornado;
`,S=`import { Chart } from "@cjlapao/ui-kit";
import { nightingalePrecip } from "../data";

const SEASONAL_HUES = [
  "#3b82f6", // Jan winter
  "#38bdf8", // Feb winter
  "#2dd4bf", // Mar spring
  "#2dd4bf", // Apr spring
  "#14b8a6", // May spring
  "#0ea5e9", // Jun summer
  "#0ea5e9", // Jul summer
  "#f59e0b", // Aug summer
  "#fb923c", // Sep fall
  "#f87171", // Oct fall
  "#f87171", // Nov fall
  "#3b82f6", // Dec winter
];

/** Season group arcs (inclusive slice indices, Jan-first ordering). */
const SEASON_BANDS = [
  { from: 10, to: 1, color: "#5daeea", label: "Winter" },
  { from: 2, to: 4, color: "#4ecdc4", label: "Spring" },
  { from: 5, to: 7, color: "#ffad5a", label: "Summer" },
  { from: 8, to: 9, color: "#ff7a66", label: "Fall" },
];

const ANNUAL_AVG =
  nightingalePrecip.reduce((a, m) => a + m.value, 0) /
  nightingalePrecip.length;

/**
 * US average monthly precipitation 2024. January anchors 12 o'clock,
 * per-slice ticks + four season group arcs outside the ring, the wettest
 * month marked PEAK inline, and a tooltip that shows the delta vs the
 * annual average.
 */
export function NightingalePrecipitation() {
  return (
    <Chart.Svg height={460} ariaLabel="US monthly precipitation 2024">
      <Chart.Title
        title="US average monthly precipitation 2024"
        subtitle="Source: NOAA Climate Data Online · 48 contiguous states average · 2024 data"
      />
      <Chart.Pie
        data={nightingalePrecip}
        name="Precipitation"
        categoryField="name"
        valueField="value"
        nightingale
        innerRadius={0.32}
        outerRadius={0.78}
        cornerRadius={5}
        startAngle={-Math.PI / 12}
        padAngle={0.026}
        colors={SEASONAL_HUES}
        nightingaleTicks
        nightingaleBands={SEASON_BANDS}
        peakLabel="PEAK"
      />
      <Chart.PieCenter
        title="Annual avg"
        value={\`\${ANNUAL_AVG.toFixed(2)}″\`}
      />
      <Chart.Tooltip
        rows={(item) => {
          const row = nightingalePrecip[item.index ?? 0];
          const diff = row.value - ANNUAL_AVG;
          const up = diff >= 0;
          return [
            { label: "Precipitation", value: \`\${row.value.toFixed(2)}″\` },
            {
              label: "vs Annual avg",
              value: \`\${up ? "▲" : "▼"} \${up ? "+" : ""}\${diff.toFixed(2)}″\`,
              color: up ? "#10a981" : "#e5484d",
            },
            { label: "Season", value: SEASON_BANDS.find((b) => {
              const idx = item.index ?? 0;
              return b.to >= b.from
                ? idx >= b.from && idx <= b.to
                : idx >= b.from || idx <= b.to;
            })?.label ?? "—" },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default NightingalePrecipitation;
`,E=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(g,{name:"Nightingale",description:"A rose where the angles are equal and the radii carry the value: the smallest slice ends at the hub, the largest reaches the outer ring. A mode of the pie — set nightingale on Chart.Pie and every pie feature (colors, gaps, corner, center, tooltip) carries over."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(h,{fixedKind:"nightingale"})]}),e.jsx(c,{title:"US tornado climatology by month",description:"Twelve equal 30° wedges whose depths map the 1991–2020 monthly averages — the Apr–Jun peak bulges to the outer ring while quiet months hug the hub. Outside labels name each month with its average count.",code:v,filename:"NightingaleTornado.tsx",children:e.jsx(p,{})}),e.jsx(c,{title:"US average monthly precipitation",description:"January anchored at 12 o'clock (startAngle −π/12), seasonal hues across the year, and the annual average in the center. Each petal's depth is the month's inches.",code:S,filename:"NightingalePrecipitation.tsx",children:e.jsx(A,{})})]});export{E as NightingaleChartPage,E as default};
