import{j as e,b5 as a}from"./index-p9Bv1Pn1.js";import{P as s}from"./PageHeader-DCZtzAyX.js";import{E as o}from"./ExampleCard-BS13YSEO.js";import{Z as t,_ as i}from"./data-CdstPXM1.js";const l=`import { Chart } from "@cjlapao/ui-kit";
import { syncedMonthly, syncedSolar } from "../data";

/**
 * Climate overview — the reference synced grid: temperature lines (°C),
 * rainfall bars (mm), a UV radar, and a solar heatmap, all sharing the
 * month categories. Hovering any card drives crosshair + tooltip on the
 * others at the same month. The heatmap keeps local hover (v1).
 */
export function SyncedClimate() {
  return (
    <Chart.Group>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 16,
        }}
      >
        <Chart.Svg sync height={230}>
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMax"
            name="Max"
            color="#ffad5a"
            curve="smooth"
            showMarkers
            lineStrokeWidth={2}
          />
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMin"
            name="Min"
            color="#5daeea"
            curve="smooth"
            showMarkers
            lineStrokeWidth={2}
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => \`\${v}°\`} />
          <Chart.Tooltip mode="crosshair" />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={230}>
          <Chart.Bar
            data={syncedMonthly}
            categoryXField="month"
            valueYField="rainfall"
            name="Rainfall"
            color="#36b7d6"
            cornerRadius={3}
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => \`\${v}mm\`} />
          <Chart.Tooltip mode="crosshair" />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={270}>
          <Chart.Radar
            data={syncedMonthly}
            axisField="month"
            valueYField="uv"
            name="UV index"
            color="#c084fc"
            fillOpacity={0.2}
            showMarkers
          />
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={270}>
          <Chart.Heatmap
            data={syncedSolar}
            categoryYField="month"
            categoryXField="hour"
            valueField="value"
            name="Solar W/m²"
            colorStops={["#fff7ed", "#fed7aa", "#ffad5a", "#ff7a66", "#b23b4b"]}
            legendTicks={3}
            valueLabels={false}
          />
          <Chart.Tooltip
            rows={(item) => {
              const t = item.item as {
                month?: string;
                hour?: string;
                value?: number;
              };
              if (!t) return [];
              return [
                { label: "Month", value: t.month ?? "" },
                { label: "Hour", value: t.hour ?? "" },
                {
                  label: "Solar",
                  value: \`\${t.value} W/m²\`,
                  color: "#ffad5a",
                },
              ];
            }}
          />
          <Chart.Hover />
        </Chart.Svg>
      </div>
    </Chart.Group>
  );
}

export default SyncedClimate;
`,d=`import { Chart } from "@cjlapao/ui-kit";
import { syncedMonthly } from "../data";

/**
 * Two scales, one axis — a °C line and a 0–10 UV bar sync by month
 * category while keeping fully independent y scales.
 */
export function SyncedScales() {
  return (
    <Chart.Group>
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
          gap: 16,
        }}
      >
        <Chart.Svg sync height={250}>
          <Chart.Line
            data={syncedMonthly}
            categoryXField="month"
            valueYField="tempMax"
            name="Temp max (°C)"
            color="#f59e0b"
            curve="smooth"
          />
          <Chart.XAxis />
          <Chart.YAxis format={(v) => \`\${v}°\`} />
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
        <Chart.Svg sync height={250}>
          <Chart.Bar
            data={syncedMonthly}
            categoryXField="month"
            valueYField="uv"
            name="UV index (0–10)"
            color="#8b5cf6"
          />
          <Chart.XAxis />
          
          <Chart.Tooltip />
          <Chart.Hover />
          <Chart.Legend position="top" />
        </Chart.Svg>
      </div>
    </Chart.Group>
  );
}

export default SyncedScales;
`;function h(){return e.jsx(a.Group,{children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 340px), 1fr))",gap:16},children:[e.jsxs(a.Svg,{sync:!0,height:230,children:[e.jsx(a.Line,{data:t,categoryXField:"month",valueYField:"tempMax",name:"Max",color:"#ffad5a",curve:"smooth",showMarkers:!0,lineStrokeWidth:2}),e.jsx(a.Line,{data:t,categoryXField:"month",valueYField:"tempMin",name:"Min",color:"#5daeea",curve:"smooth",showMarkers:!0,lineStrokeWidth:2}),e.jsx(a.XAxis,{}),e.jsx(a.YAxis,{format:n=>`${n}°`}),e.jsx(a.Tooltip,{mode:"crosshair"}),e.jsx(a.Hover,{}),e.jsx(a.Legend,{position:"top"})]}),e.jsxs(a.Svg,{sync:!0,height:230,children:[e.jsx(a.Bar,{data:t,categoryXField:"month",valueYField:"rainfall",name:"Rainfall",color:"#36b7d6",cornerRadius:3}),e.jsx(a.XAxis,{}),e.jsx(a.YAxis,{format:n=>`${n}mm`}),e.jsx(a.Tooltip,{mode:"crosshair"}),e.jsx(a.Hover,{}),e.jsx(a.Legend,{position:"top"})]}),e.jsxs(a.Svg,{sync:!0,height:270,children:[e.jsx(a.Radar,{data:t,axisField:"month",valueYField:"uv",name:"UV index",color:"#c084fc",fillOpacity:.2,showMarkers:!0}),e.jsx(a.Tooltip,{}),e.jsx(a.Hover,{}),e.jsx(a.Legend,{position:"top"})]}),e.jsxs(a.Svg,{sync:!0,height:270,children:[e.jsx(a.Heatmap,{data:i,categoryYField:"month",categoryXField:"hour",valueField:"value",name:"Solar W/m²",colorStops:["#fff7ed","#fed7aa","#ffad5a","#ff7a66","#b23b4b"],legendTicks:3,valueLabels:!1}),e.jsx(a.Tooltip,{rows:n=>{const r=n.item;return r?[{label:"Month",value:r.month??""},{label:"Hour",value:r.hour??""},{label:"Solar",value:`${r.value} W/m²`,color:"#ffad5a"}]:[]}}),e.jsx(a.Hover,{})]})]})})}function c(){return e.jsx(a.Group,{children:e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 340px), 1fr))",gap:16},children:[e.jsxs(a.Svg,{sync:!0,height:250,children:[e.jsx(a.Line,{data:t,categoryXField:"month",valueYField:"tempMax",name:"Temp max (°C)",color:"#f59e0b",curve:"smooth"}),e.jsx(a.XAxis,{}),e.jsx(a.YAxis,{format:n=>`${n}°`}),e.jsx(a.Tooltip,{}),e.jsx(a.Hover,{}),e.jsx(a.Legend,{position:"top"})]}),e.jsxs(a.Svg,{sync:!0,height:250,children:[e.jsx(a.Bar,{data:t,categoryXField:"month",valueYField:"uv",name:"UV index (0–10)",color:"#8b5cf6"}),e.jsx(a.XAxis,{}),e.jsx(a.Tooltip,{}),e.jsx(a.Hover,{}),e.jsx(a.Legend,{position:"top"})]})]})})}const g=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(s,{name:"Synced charts",description:"Join several charts into one hover: wrap them in Chart.Group and mark each with the sync prop. Hovering any card drives crosshair + tooltip on the others at the same category — no shared pixels or scales required."}),e.jsxs("section",{className:"flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900",children:[e.jsx("h2",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:"How it works"}),e.jsxs("ul",{className:"flex list-disc flex-col gap-2 pl-5 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsxs("li",{children:[e.jsx("code",{className:"rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800",children:"<Chart.Group>"})," ","wraps the cards (it renders them verbatim — layout classes live in your markup, e.g. a CSS grid) and provides the sync context."]}),e.jsxs("li",{children:["Each participating chart is a"," ",e.jsx("code",{className:"rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800",children:"<Chart.Svg sync />"}),"(or ",e.jsx("code",{className:"rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800",children:"Chart.Canvas"}),"). Charts without ",e.jsx("code",{className:"rounded bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800",children:"sync"}),"keep purely local hover."]}),e.jsxs("li",{children:["Sync is keyed on the shared ",e.jsx("strong",{children:"category value"})," (the categorical x, e.g. the month), not on pixel position — members can differ in size, y scale, and series type as long as they share the categories."]}),e.jsx("li",{children:"Leaving a card (or its plot area) broadcasts a clear, so every member drops its crosshair and tooltip together."}),e.jsx("li",{children:"Scope (v1): cartesian members (line, bar, range, scatter, radar, waterfall). Non-cartesian series like the solar heatmap below keep local hover and don't join the broadcast."})]})]}),e.jsx(o,{title:"Climate overview",description:"One grid, four charts: smooth temperature lines (°C), rainfall bars (mm), a UV radar, and a solar heatmap — all sharing the month categories. Hover any card and the others follow at the same month. (Heatmap hover stays local in v1.)",code:l,filename:"SyncedClimate.tsx",children:e.jsx(h,{})}),e.jsx(o,{title:"Two scales, one axis",description:"A °C line and a 0–10 UV bar sync perfectly because the shared key is the month category — the y scales stay independent.",code:d,filename:"SyncedScales.tsx",children:e.jsx(c,{})})]});export{g as SyncedChartPage,g as default};
