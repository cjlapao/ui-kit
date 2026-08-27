import{j as e,a_ as t}from"./index-BBK6HA-D.js";import{P as m}from"./PageHeader-BcBcU29I.js";import{E as i}from"./ExampleCard-BVwGIEPO.js";import{C as u}from"./ChartPlayground-XBul2SRt.js";import{A as s,z as d,y as p}from"./data-BoeUGZYw.js";import"./ControlAccordion-DallGojj.js";import"./options-D-FMIizr.js";function c(){return e.jsxs(t.Svg,{height:440,ariaLabel:"Continent land area treemap",children:[e.jsx(t.Title,{title:"Continent land area",subtitle:"Squarified treemap of relative land mass — area is proportional to value, so Asia dwarfs Oceania."}),e.jsx(t.Treemap,{data:s,color:"#7dd3fc",gap:2}),e.jsx(t.Tooltip,{rows:n=>{const a=n.item,l=s.reduce((r,o)=>r+o.value,0);return[{label:"Continent",value:a.name},{label:"Share",value:`${(a.value/l*100).toFixed(1)}%`,color:"#38bdf8"}]}}),e.jsx(t.Hover,{})]})}function h(){return e.jsxs(t.Svg,{height:440,ariaLabel:"Continent treemap with palette",children:[e.jsx(t.Title,{title:"Continent land area, palette colors",subtitle:"Drop the uniform color and each tile takes its hue from the series palette, in data order."}),e.jsx(t.Treemap,{data:s,gap:2}),e.jsx(t.Tooltip,{rows:n=>{const a=n.item,l=s.reduce((r,o)=>r+o.value,0);return[{label:"Continent",value:a.name},{label:"Share",value:`${(a.value/l*100).toFixed(1)}%`}]}}),e.jsx(t.Hover,{})]})}function g(){return e.jsxs(t.Svg,{height:460,ariaLabel:"Big-cap market cap treemap",children:[e.jsx(t.Title,{title:"Big-cap market cap",subtitle:"Tile area is market cap; the corner value and day-move pill pack the rest of the story into each tile."}),e.jsx(t.Treemap,{data:d,categoryField:"symbol",valueField:"value",deltaField:"delta",deltaFormat:n=>`${Math.abs(n)}%`,valueLabels:!0,valueLabelFormat:n=>`$${n}T`,colors:["#33547a","#3b5ba8","#2c6e75","#2f6b6d","#356a58","#4a5578"],gap:3}),e.jsx(t.Tooltip,{rows:n=>{const a=n.item;return[{label:"Symbol",value:a.symbol},{label:"Market cap",value:`$${a.value}T`},{label:"Day change",value:`${a.delta>0?"+":""}${a.delta}%`,color:a.delta>=0?"#10b981":"#ef4444"}]}}),e.jsx(t.Hover,{})]})}function v(){return e.jsxs(t.Svg,{height:480,ariaLabel:"Team headcount by department",children:[e.jsx(t.Title,{title:"Headcount by department",subtitle:"One region per department with an uppercase header; Engineering sums to 123 people."}),e.jsx(t.Treemap,{data:p,groupField:"group",gap:3}),e.jsx(t.Tooltip,{rows:n=>{const a=n.item;if(!a)return[{label:"Department",value:String(n.name??"")},{label:"Headcount",value:String(n.value??""),color:"#38bdf8"}];const l=p.filter(r=>r.group===a.group).reduce((r,o)=>r+o.value,0);return[{label:"Team",value:a.name},{label:"Department",value:a.group??""},{label:"Headcount",value:`${a.value} of ${l}`,color:"#38bdf8"}]}}),e.jsx(t.Hover,{})]})}const b=`import { Chart } from "@cjlapao/ui-kit";
import { treemapContinents } from "../data";

/**
 * Basic treemap — one squarified tile per category on a uniform color,
 * centered labels. The largest values take the top-left; small remainders
 * shrink into thin slivers.
 */
export function TreemapContinents() {
  return (
    <Chart.Svg height={440} ariaLabel="Continent land area treemap">
      <Chart.Title
        title="Continent land area"
        subtitle="Squarified treemap of relative land mass — area is proportional to value, so Asia dwarfs Oceania."
      />
      <Chart.Treemap data={treemapContinents} color="#7dd3fc" gap={2} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as { name: string; value: number };
          const total = treemapContinents.reduce((a, b) => a + b.value, 0);
          return [
            { label: "Continent", value: t.name },
            {
              label: "Share",
              value: \`\${((t.value / total) * 100).toFixed(1)}%\`,
              color: "#38bdf8",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapContinents;
`,f=`import { Chart } from "@cjlapao/ui-kit";
import { treemapContinents } from "../data";

/**
 * Palette treemap — the same data with one hue per tile from the series
 * palette (no \`color\` prop), so each category stays visually distinct.
 */
export function TreemapRegions() {
  return (
    <Chart.Svg height={440} ariaLabel="Continent treemap with palette">
      <Chart.Title
        title="Continent land area, palette colors"
        subtitle="Drop the uniform color and each tile takes its hue from the series palette, in data order."
      />
      <Chart.Treemap data={treemapContinents} gap={2} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as { name: string; value: number };
          const total = treemapContinents.reduce((a, b) => a + b.value, 0);
          return [
            { label: "Continent", value: t.name },
            {
              label: "Share",
              value: \`\${((t.value / total) * 100).toFixed(1)}%\`,
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapRegions;
`,x=`import { Chart } from "@cjlapao/ui-kit";
import { treemapStocks } from "../data";

/**
 * Stock tiles — the corner-value layout: title top-left, a signed delta
 * pill (▲ green / ▼ red) under it, and the market cap in the bottom-left
 * corner. Muted blue/indigo/teal fills via an explicit \`colors\` array.
 */
export function TreemapStocks() {
  return (
    <Chart.Svg height={460} ariaLabel="Big-cap market cap treemap">
      <Chart.Title
        title="Big-cap market cap"
        subtitle="Tile area is market cap; the corner value and day-move pill pack the rest of the story into each tile."
      />
      <Chart.Treemap
        data={treemapStocks}
        categoryField="symbol"
        valueField="value"
        deltaField="delta"
        deltaFormat={(v) => \`\${Math.abs(v)}%\`}
        valueLabels
        valueLabelFormat={(v) => \`$\${v}T\`}
        colors={["#33547a", "#3b5ba8", "#2c6e75", "#2f6b6d", "#356a58", "#4a5578"]}
        gap={3}
      />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as {
            symbol: string;
            value: number;
            delta: number;
          };
          return [
            { label: "Symbol", value: t.symbol },
            { label: "Market cap", value: \`$\${t.value}T\` },
            {
              label: "Day change",
              value: \`\${t.delta > 0 ? "+" : ""}\${t.delta}%\`,
              color: t.delta >= 0 ? "#10b981" : "#ef4444",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapStocks;
`,T=`import { Chart } from "@cjlapao/ui-kit";
import { treemapTeams } from "../data";

/**
 * Grouped treemap — \`groupField\` clusters tiles into one squarified
 * region per group (by group total), each with an uppercase header band.
 * Hovering a header shows the group total; hovering a tile shows the
 * team.
 */
export function TreemapTeams() {
  return (
    <Chart.Svg height={480} ariaLabel="Team headcount by department">
      <Chart.Title
        title="Headcount by department"
        subtitle="One region per department with an uppercase header; Engineering sums to 123 people."
      />
      <Chart.Treemap data={treemapTeams} groupField="group" gap={3} />
      <Chart.Tooltip
        rows={(item) => {
          const t = item.item as {
            group?: string;
            name: string;
            value: number;
          };
          if (!t) {
            // group header hit: item is null, the value is the group total
            return [
              { label: "Department", value: String(item.name ?? "") },
              {
                label: "Headcount",
                value: String(item.value ?? ""),
                color: "#38bdf8",
              },
            ];
          }
          const total = treemapTeams
            .filter((r) => r.group === t.group)
            .reduce((a, b) => a + b.value, 0);
          return [
            { label: "Team", value: t.name },
            { label: "Department", value: t.group ?? "" },
            {
              label: "Headcount",
              value: \`\${t.value} of \${total}\`,
              color: "#38bdf8",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default TreemapTeams;
`,F=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(m,{name:"Treemap",description:"A self-contained grid of squarified tiles — area is proportional to value, no cartesian scales. Uniform or palette fills, stock-style corner tiles with delta pills, and grouped regions with uppercase headers."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(u,{fixedKind:"treemap"})]}),e.jsx(i,{title:"Continent land area",description:"The classic flat treemap: one squarified tile per category on a uniform color, largest value top-left.",code:b,filename:"TreemapContinents.tsx",children:e.jsx(c,{})}),e.jsx(i,{title:"Palette colors",description:"Same data, one hue per tile from the series palette — drop `color` and every category stays distinct.",code:f,filename:"TreemapRegions.tsx",children:e.jsx(h,{})}),e.jsx(i,{title:"Big-cap market cap",description:"Stock-tile layout: title top-left, ▲/▼ day-move pill, and the corner value — `deltaField` + `valueLabels`.",code:x,filename:"TreemapStocks.tsx",children:e.jsx(g,{})}),e.jsx(i,{title:"Headcount by department",description:"`groupField` clusters tiles into regions with uppercase headers; hovering a header shows the group total.",code:T,filename:"TreemapTeams.tsx",children:e.jsx(v,{})})]});export{F as TreemapChartPage,F as default};
