import{j as e,a_ as a}from"./index-BBK6HA-D.js";import{P as u}from"./PageHeader-BcBcU29I.js";import{E as o}from"./ExampleCard-BVwGIEPO.js";import{C as h}from"./ChartPlayground-XBul2SRt.js";import{_ as i,$ as d,a0 as p,a1 as f,a2 as v,a3 as b,a4 as C,a5 as s,u as g,v as w,x}from"./data-BoeUGZYw.js";import"./ControlAccordion-DallGojj.js";import"./options-D-FMIizr.js";function y(t){return t>=.75?"STRONG":t>=.6?"MOD":t>=.45?"WEAK":"INDEP"}function S(){return e.jsxs(a.Svg,{height:560,ariaLabel:"Sector correlation matrix",children:[e.jsx(a.Title,{title:"S&P 500 sector correlation",subtitle:"Pairwise trailing-12-month return correlation across the nine GICS sectors. Diverging scale: pale = weak, deep blue/purple = strong."}),e.jsx(a.Heatmap,{data:d,rows:i,cols:i,colorStops:["#ffffff","#67e8f9","#3b82f6","#7c3aed"],domain:[0,1],valueLabels:!0,valueLabelFormat:t=>t.toFixed(2),tierLabel:t=>t===1?"SELF":y(t),cellGap:2,cornerRadius:2,legendTicks:3,rowLabelWidth:110}),e.jsx(a.Tooltip,{rows:t=>{const n=t.item;return[{label:"Sector pair",value:`${n.row} × ${n.col}`},{label:"Correlation",value:n.value.toFixed(2),color:n.value>=.6?"#10b981":"#f59e0b"}]}}),e.jsx(a.Hover,{})]})}function j(){return e.jsxs(a.Svg,{height:560,ariaLabel:"Olympic medal table",children:[e.jsx(a.Title,{title:"Olympic medal table",subtitle:"Medals per sport and nation across the Games. Empty slots are combinations with no medals."}),e.jsx(a.Heatmap,{data:v,rows:f,cols:p,colorStops:["#fef9c3","#fde047","#f97316"],domain:[0,18],nullColor:"rgba(100, 116, 139, 0.14)",valueLabels:!0,valueLabelFormat:t=>String(t),cellGap:3,cornerRadius:3,legendTicks:3,rowLabelWidth:90}),e.jsx(a.Tooltip,{rows:t=>{const n=t.item;return[{label:"Sport",value:n.row},{label:"Medals",value:String(n.value),color:"#f97316"}]}}),e.jsx(a.Hover,{})]})}function L(){return e.jsxs(a.Svg,{height:560,ariaLabel:"Cohort retention",children:[e.jsx(a.Title,{title:"Cohort retention",subtitle:"Monthly sign-up cohorts tracked through M11. Retention drops hardest in the first month after activation."}),e.jsx(a.Heatmap,{data:s,rows:C,cols:b,colorStops:["#fca5a5","#fde047","#2dd4bf"],domain:[0,100],valueLabels:!0,valueLabelFormat:t=>`${t}%`,cellGap:2,cornerRadius:2,legendTicks:3,rowLabelWidth:92,annotations:[{row:"Nov 2024",col:"M1",label:"Activation cliff: M0 → M1",tone:"red"}]}),e.jsx(a.Tooltip,{rows:t=>{const n=t.item,c=n.col==="M1"?100:(()=>{const m=parseInt(n.col.slice(1),10);return s.find(r=>r.row===n.row&&r.col===`M${m-1}`)?.value??100})(),l=n.value-c;return[{label:"Cohort",value:n.row},{label:`Retention ${n.col}`,value:`${n.value}%`},{label:"MoM",value:`${l>=0?"+":""}${l}pp`,color:l>=0?"#10b981":"#ef4444"}]}}),e.jsx(a.Hover,{})]})}function H(){return e.jsxs(a.Svg,{height:440,ariaLabel:"Commute intensity",children:[e.jsx(a.Title,{title:"Commute intensity by day and hour",subtitle:"Share of daily trips per hour band. Weekday peaks stack up on the 08–10 and 16–18 bands; the weekend flips to midday."}),e.jsx(a.Heatmap,{data:x,rows:w,cols:g,colorStops:["#fff7ed","#fb923c","#dc2626"],domain:[0,46],valueLabels:!0,valueLabelFormat:t=>String(t),cellGap:4,cornerRadius:6,showLegend:!1,rowLabelWidth:60}),e.jsx(a.Tooltip,{rows:t=>{const n=t.item;return[{label:"Day",value:n.row},{label:"Hour band",value:n.col},{label:"Share of trips",value:`${n.value}%`,color:"#dc2626"}]}}),e.jsx(a.Hover,{})]})}const M=`import { Chart } from "@cjlapao/ui-kit";
import { heatCorrelation, heatCorrelationRows } from "../data";

/**
 * S&P 500 sector correlation matrix — a 9×9 diverging matrix with a
 * value + strength-tier label in every cell (INDEP / WEAK / MOD /
 * STRONG) and a 0 / 0.5 / 1 legend.
 */
function tier(v: number): string | null {
  if (v >= 0.75) return "STRONG";
  if (v >= 0.6) return "MOD";
  if (v >= 0.45) return "WEAK";
  return "INDEP";
}

export function HeatmapCorrelation() {
  return (
    <Chart.Svg height={560} ariaLabel="Sector correlation matrix">
      <Chart.Title
        title="S&P 500 sector correlation"
        subtitle="Pairwise trailing-12-month return correlation across the nine GICS sectors. Diverging scale: pale = weak, deep blue/purple = strong."
      />
      <Chart.Heatmap
        data={heatCorrelation}
        rows={heatCorrelationRows}
        cols={heatCorrelationRows}
        colorStops={["#ffffff", "#67e8f9", "#3b82f6", "#7c3aed"]}
        domain={[0, 1]}
        valueLabels
        valueLabelFormat={(v) => v.toFixed(2)}
        tierLabel={(v) => (v === 1 ? "SELF" : tier(v))}
        cellGap={2}
        cornerRadius={2}
        legendTicks={3}
        rowLabelWidth={110}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Sector pair", value: \`\${cell.row} × \${cell.col}\` },
            {
              label: "Correlation",
              value: cell.value.toFixed(2),
              color: cell.value >= 0.6 ? "#10b981" : "#f59e0b",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCorrelation;
`,R=`import { Chart } from "@cjlapao/ui-kit";
import {
  heatOlympics,
  heatOlympicsRows,
  heatOlympicsCols,
} from "../data";

/**
 * Olympic medal table — 10 sports × 10 nations, sequential
 * pale-yellow → orange scale. Sports/nation combos with no medals are
 * null cells (left dark) and skipped by the tooltip.
 */
export function HeatmapOlympics() {
  return (
    <Chart.Svg height={560} ariaLabel="Olympic medal table">
      <Chart.Title
        title="Olympic medal table"
        subtitle="Medals per sport and nation across the Games. Empty slots are combinations with no medals."
      />
      <Chart.Heatmap
        data={heatOlympics}
        rows={heatOlympicsRows}
        cols={heatOlympicsCols}
        colorStops={["#fef9c3", "#fde047", "#f97316"]}
        domain={[0, 18]}
        nullColor="rgba(100, 116, 139, 0.14)"
        valueLabels
        valueLabelFormat={(v) => String(v)}
        cellGap={3}
        cornerRadius={3}
        legendTicks={3}
        rowLabelWidth={90}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Sport", value: cell.row },
            {
              label: "Medals",
              value: String(cell.value),
              color: "#f97316",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapOlympics;
`,k=`import { Chart } from "@cjlapao/ui-kit";
import { heatCohort, heatCohortRows, heatCohortCols } from "../data";

/**
 * SaaS cohort retention — 11 monthly cohorts × M0–M11, triangular
 * (newer cohorts have shorter histories, so the lower-left is null).
 * Three-stop red → yellow → teal scale, and a red annotation pill
 * calling out the M0 → M1 activation cliff on the newest cohort.
 */
export function HeatmapCohort() {
  return (
    <Chart.Svg height={560} ariaLabel="Cohort retention">
      <Chart.Title
        title="Cohort retention"
        subtitle="Monthly sign-up cohorts tracked through M11. Retention drops hardest in the first month after activation."
      />
      <Chart.Heatmap
        data={heatCohort}
        rows={heatCohortRows}
        cols={heatCohortCols}
        colorStops={["#fca5a5", "#fde047", "#2dd4bf"]}
        domain={[0, 100]}
        valueLabels
        valueLabelFormat={(v) => \`\${v}%\`}
        cellGap={2}
        cornerRadius={2}
        legendTicks={3}
        rowLabelWidth={92}
        annotations={[
          {
            row: "Nov 2024",
            col: "M1",
            label: "Activation cliff: M0 → M1",
            tone: "red",
          },
        ]}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          const prev =
            cell.col === "M1"
              ? 100
              : (() => {
                  const j = parseInt(cell.col.slice(1), 10);
                  const v = heatCohort.find(
                    (c) => c.row === cell.row && c.col === \`M\${j - 1}\`,
                  )?.value;
                  return v ?? 100;
                })();
          const delta = cell.value - prev;
          return [
            { label: "Cohort", value: cell.row },
            { label: \`Retention \${cell.col}\`, value: \`\${cell.value}%\` },
            {
              label: "MoM",
              value: \`\${delta >= 0 ? "+" : ""}\${delta}pp\`,
              color: delta >= 0 ? "#10b981" : "#ef4444",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCohort;
`,O=`import { Chart } from "@cjlapao/ui-kit";
import { heatCommute, heatCommuteRows, heatCommuteCols } from "../data";

/**
 * Commute intensity — 7 days × 6 hour bands, warm sequential scale with
 * no legend (the grid + labels carry the story on their own).
 */
export function HeatmapCommute() {
  return (
    <Chart.Svg height={440} ariaLabel="Commute intensity">
      <Chart.Title
        title="Commute intensity by day and hour"
        subtitle="Share of daily trips per hour band. Weekday peaks stack up on the 08–10 and 16–18 bands; the weekend flips to midday."
      />
      <Chart.Heatmap
        data={heatCommute}
        rows={heatCommuteRows}
        cols={heatCommuteCols}
        colorStops={["#fff7ed", "#fb923c", "#dc2626"]}
        domain={[0, 46]}
        valueLabels
        valueLabelFormat={(v) => String(v)}
        cellGap={4}
        cornerRadius={6}
        showLegend={false}
        rowLabelWidth={60}
      />
      <Chart.Tooltip
        rows={(item) => {
          const cell = item.item as { row: string; col: string; value: number };
          return [
            { label: "Day", value: cell.row },
            { label: "Hour band", value: cell.col },
            {
              label: "Share of trips",
              value: \`\${cell.value}%\`,
              color: "#dc2626",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default HeatmapCommute;
`,D=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(u,{name:"Heatmap",description:"A self-contained grid of value-colored cells — no cartesian scales. Multi-stop color scales, null cells, value and tier labels, a gradient legend, and cell-anchored annotation pills."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(h,{fixedKind:"heatmap"})]}),e.jsx(o,{title:"Sector correlation matrix",description:"9×9 diverging matrix with per-cell value + strength tier (INDEP / WEAK / MOD / STRONG) and a 0–1 legend.",code:M,filename:"HeatmapCorrelation.tsx",children:e.jsx(S,{})}),e.jsx(o,{title:"Olympic medal table",description:"10 sports × 10 nations on a sequential pale-yellow → orange scale; combinations without medals are null cells.",code:R,filename:"HeatmapOlympics.tsx",children:e.jsx(j,{})}),e.jsx(o,{title:"Cohort retention",description:"11 cohorts × M0–M11 on a triangular null grid, red → yellow → teal, with a red annotation pill on the M0 → M1 activation cliff.",code:k,filename:"HeatmapCohort.tsx",children:e.jsx(L,{})}),e.jsx(o,{title:"Commute intensity",description:"Weekday vs weekend hour-band intensity on a warm sequential scale — legend off, the grid tells the story.",code:O,filename:"HeatmapCommute.tsx",children:e.jsx(H,{})})]});export{D as HeatmapChartPage,D as default};
