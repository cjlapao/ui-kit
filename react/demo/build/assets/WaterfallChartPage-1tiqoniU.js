import{j as e,b0 as n}from"./index-Bw7SVFgV.js";import{P as u}from"./PageHeader-CQm-NnZo.js";import{E as o}from"./ExampleCard-BR4461qP.js";import{C as f}from"./ChartPlayground-CJjSTqSp.js";import{a7 as i,a8 as s,a9 as c,q as d}from"./data-CdstPXM1.js";import"./PlaygroundPanel-efOYSasM.js";import"./ControlAccordion-BDKCdIsF.js";import"./options-CREM8uYu.js";const b={revenue:"#10b981",spending:"#f43f5e",total:"#818cf8"};function h(){const r=a=>`${a>0?"+":""}${a.toFixed(1)}%`;return e.jsxs(n.Svg,{height:460,ariaLabel:"EU-27 government revenue and spending 2022",children:[e.jsx(n.Title,{title:"EU-27 Government Revenue and Spending, 2022",subtitle:"Percentage of GDP · Source: Eurostat General Government Finance Statistics"}),e.jsx(n.Waterfall,{data:i,categoryXField:"name",valueYField:"value",totalField:"isTotal",color:a=>b[a.kind??""]??"#818cf8",valueLabelFormat:r}),e.jsx(n.Annotation,{x:"Net deficit",y:-3.4,title:"Above Maastricht 3% reference",value:"Deficit: 3.4% of GDP",tone:"red"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{}),e.jsx(n.Tooltip,{rows:a=>{const t=i[a.index??0];return[{label:"Contribution",value:r(t.value)}]}}),e.jsx(n.Hover,{})]})}function m(){const r=a=>`${a>0?"+":""}${a.toFixed(1)}`;return e.jsxs(n.Svg,{height:460,margin:{left:110},ariaLabel:"Global carbon budget 2022",children:[e.jsx(n.Title,{title:"Global Carbon Budget 2022 — sources, sinks, net accumulation",subtitle:"Values in gigatonnes of CO₂ per year · Source: Global Carbon Project, Global Carbon Budget 2023"}),e.jsx(n.Waterfall,{data:s,orientation:"horizontal",categoryXField:"name",valueYField:"value",totalField:"isTotal",color:a=>a.color??"#fb7185",valueLabelFormat:r}),e.jsx(n.ReferenceLine,{x:5.7,color:"#60a5fa",label:"1.5°C annual budget (5.7)",labelPosition:"start"}),e.jsx(n.Annotation,{x:"Gross emissions",y:41.2,title:"Gross emissions 41.2 GtCO₂/yr",value:"7× over 1.5°C budget",tone:"red"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{}),e.jsx(n.Tooltip,{rows:a=>{const t=s[a.index??0],l=(Math.abs(t.value)/41.2*100).toFixed(0);return[{label:"Contribution",value:`${t.value>0?"+":""}${t.value.toFixed(1)} GtCO₂/yr`},{label:"Share of gross",value:`${l}%`}]}}),e.jsx(n.Hover,{})]})}function v(){const r=a=>a>=0?`+$${Math.round(a)}M`:`-$${Math.round(-a)}M`;return e.jsxs(n.Svg,{height:460,ariaLabel:"FY 2023 EBITDA bridge",children:[e.jsx(n.Title,{title:"FY 2023 EBITDA Bridge — Core & Incremental Drivers",subtitle:"P&L bridge in $M · bars split into core (darker) and incremental (lighter) drivers"}),e.jsx(n.Waterfall,{data:c,categoryXField:"name",totalField:"isTotal",cornerRadius:4,valueLabelFormat:r,layersField:a=>{const t=a;return[{name:"Core",value:t.core,color:t.isTotal?"#818cf8":t.core>=0?"#059669":"#dc2626"},{name:"Incremental",value:t.incr,color:t.isTotal?"#a5b4fc":t.core>=0?"#34d399":"#f87171"}]},valueYField:"core"}),e.jsx(n.ReferenceLine,{y:0,label:"Break-even",color:"#94a3b8"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{}),e.jsx(n.Tooltip,{rows:a=>{const t=c[a.index??0],l=t.core+t.incr;return[{label:"Core",value:`$${t.core}M`},{label:"Incremental",value:`$${t.incr}M`},{label:"Total",value:`${l>0?"+":""}$${l}M`}]}}),e.jsx(n.Hover,{})]})}function g(){const r=a=>`${a>0?"+":""}$${a}M`;return e.jsxs(n.Svg,{height:460,ariaLabel:"ARR bridge by driver",children:[e.jsx(n.Title,{title:"ARR bridge by driver",subtitle:"Quarterly ARR moves through expansion, pricing, usage, churn, credits, and reserve pressure before the forecast closes."}),e.jsx(n.Waterfall,{data:d,categoryXField:"name",valueYField:"value",totalField:"isTotal",connectors:!0,cornerRadius:4,valueLabelFormat:r}),e.jsx(n.ReferenceLine,{y:420,color:"#64748b",label:"Open",labelPosition:"start"}),e.jsx(n.ReferenceLine,{y:448,color:"#60a5fa",label:"Close",labelPosition:"end"}),e.jsx(n.Annotation,{x:"Closing ARR",y:448,title:"NET CHANGE",value:"+$28M to $448M"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{}),e.jsx(n.Tooltip,{rows:a=>{const t=d[a.index??0];return[{label:"Step",value:`${t.value>0?"+":""}$${t.value}M`,color:t.value>=0?"#10b981":"#f43f5e"}]}}),e.jsx(n.Hover,{})]})}const x=`import { Chart } from "@cjlapao/ui-kit";
import { waterfallEu } from "../data";

const KIND_COLORS: Record<string, string> = {
  revenue: "#10b981",
  spending: "#f43f5e",
  total: "#818cf8",
};

/**
 * EU-27 government revenue and spending, 2022 — a classic bridge: the
 * total-revenue marker anchors the spending steps, and the closing
 * deficit total sits below the baseline. Colors route by the \`kind\`
 * field via the per-datum color accessor.
 */
export function WaterfallEu() {
  const fmt = (v: number) => \`\${v > 0 ? "+" : ""}\${v.toFixed(1)}%\`;
  return (
    <Chart.Svg height={460} ariaLabel="EU-27 government revenue and spending 2022">
      <Chart.Title
        title="EU-27 Government Revenue and Spending, 2022"
        subtitle="Percentage of GDP · Source: Eurostat General Government Finance Statistics"
      />
      <Chart.Waterfall
        data={waterfallEu}
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        color={(r) => KIND_COLORS[(r as { kind?: string }).kind ?? ""] ?? "#818cf8"}
        valueLabelFormat={fmt}
      />
      <Chart.Annotation
        x="Net deficit"
        y={-3.4}
        title="Above Maastricht 3% reference"
        value="Deficit: 3.4% of GDP"
        tone="red"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallEu[item.index ?? 0];
          return [
            { label: "Contribution", value: fmt(row.value) },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallEu;
`,C=`import { Chart } from "@cjlapao/ui-kit";
import { waterfallCarbon } from "../data";

/**
 * Global Carbon Budget 2022 — a horizontal waterfall: fossil sources
 * accumulate to the gross-emissions total, the sinks float down from it,
 * and the atmospheric growth closes the bridge. A dashed reference line
 * marks the 1.5°C annual budget.
 */
export function WaterfallCarbon() {
  const fmt = (v: number) => \`\${v > 0 ? "+" : ""}\${v.toFixed(1)}\`;
  return (
    <Chart.Svg
      height={460}
      margin={{ left: 110 }}
      ariaLabel="Global carbon budget 2022"
    >
      <Chart.Title
        title="Global Carbon Budget 2022 — sources, sinks, net accumulation"
        subtitle="Values in gigatonnes of CO₂ per year · Source: Global Carbon Project, Global Carbon Budget 2023"
      />
      <Chart.Waterfall
        data={waterfallCarbon}
        orientation="horizontal"
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        color={(r) => (r as { color?: string }).color ?? "#fb7185"}
        valueLabelFormat={fmt}
      />
      <Chart.ReferenceLine
        x={5.7}
        color="#60a5fa"
        label="1.5°C annual budget (5.7)"
        labelPosition="start"
      />
      <Chart.Annotation
        x="Gross emissions"
        y={41.2}
        title="Gross emissions 41.2 GtCO₂/yr"
        value="7× over 1.5°C budget"
        tone="red"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallCarbon[item.index ?? 0];
          const share = ((Math.abs(row.value) / 41.2) * 100).toFixed(0);
          return [
            { label: "Contribution", value: \`\${row.value > 0 ? "+" : ""}\${row.value.toFixed(1)} GtCO₂/yr\` },
            { label: "Share of gross", value: \`\${share}%\` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallCarbon;
`,p=`import { Chart } from "@cjlapao/ui-kit";
import { waterfallEbitda } from "../data";

/**
 * FY 2023 EBITDA bridge — a stacked waterfall: each step carries a core
 * (darker) and an incremental (lighter) layer; the running total
 * accumulates the combined values and the break-even reference line
 * sits at zero.
 */
export function WaterfallEbitda() {
  const fmt = (v: number) => (v >= 0 ? \`+$\${Math.round(v)}M\` : \`-$\${Math.round(-v)}M\`);
  return (
    <Chart.Svg height={460} ariaLabel="FY 2023 EBITDA bridge">
      <Chart.Title
        title="FY 2023 EBITDA Bridge — Core & Incremental Drivers"
        subtitle="P&L bridge in $M · bars split into core (darker) and incremental (lighter) drivers"
      />
      <Chart.Waterfall
        data={waterfallEbitda}
        categoryXField="name"
        totalField="isTotal"
        cornerRadius={4}
        valueLabelFormat={fmt}
        layersField={(r) => {
          const row = r as { core: number; incr: number; isTotal?: boolean };
          return [
          { name: "Core", value: row.core, color: row.isTotal ? "#818cf8" : row.core >= 0 ? "#059669" : "#dc2626" },
          { name: "Incremental", value: row.incr, color: row.isTotal ? "#a5b4fc" : row.core >= 0 ? "#34d399" : "#f87171" },
          ];
        }}
        valueYField="core"
      />
      <Chart.ReferenceLine y={0} label="Break-even" color="#94a3b8" />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallEbitda[item.index ?? 0];
          const total = row.core + row.incr;
          return [
            { label: "Core", value: \`$\${row.core}M\` },
            { label: "Incremental", value: \`$\${row.incr}M\` },
            { label: "Total", value: \`\${total > 0 ? "+" : ""}$\${total}M\` },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallEbitda;
`,w=`import { Chart } from "@cjlapao/ui-kit";
import { waterfallArr } from "../data";

/**
 * ARR bridge by driver — a floating waterfall with dashed running-total
 * connectors: the Open ARR total starts the bridge, the drivers float,
 * and the Closing ARR total closes it. Dashed reference lines mark the
 * Open and Close levels.
 */
export function WaterfallArr() {
  const fmt = (v: number) => \`\${v > 0 ? "+" : ""}$\${v}M\`;
  return (
    <Chart.Svg height={460} ariaLabel="ARR bridge by driver">
      <Chart.Title
        title="ARR bridge by driver"
        subtitle="Quarterly ARR moves through expansion, pricing, usage, churn, credits, and reserve pressure before the forecast closes."
      />
      <Chart.Waterfall
        data={waterfallArr}
        categoryXField="name"
        valueYField="value"
        totalField="isTotal"
        connectors
        cornerRadius={4}
        valueLabelFormat={fmt}
      />
      <Chart.ReferenceLine y={420} color="#64748b" label="Open" labelPosition="start" />
      <Chart.ReferenceLine y={448} color="#60a5fa" label="Close" labelPosition="end" />
      <Chart.Annotation
        x="Closing ARR"
        y={448}
        title="NET CHANGE"
        value="+$28M to $448M"
      />
      <Chart.XAxis />
      <Chart.YAxis />
      <Chart.Tooltip
        rows={(item) => {
          const row = waterfallArr[item.index ?? 0];
          return [
            {
              label: "Step",
              value: \`\${row.value > 0 ? "+" : ""}$\${row.value}M\`,
              color: row.value >= 0 ? "#10b981" : "#f43f5e",
            },
          ];
        }}
      />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default WaterfallArr;
`,k=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(u,{name:"Waterfall",description:"Bridge analysis on the bar engine: delta steps that accumulate a running total, with total markers anchored at the baseline. Vertical or horizontal, signed data labels, dashed running-total connectors, stacked layers per step, and reference lines."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(f,{fixedKind:"waterfall"})]}),e.jsx(o,{title:"EU-27 government revenue and spending",description:"A classic bridge: the total-revenue marker anchors the spending steps and the closing deficit total sits below the baseline. Colors route by the kind field.",code:x,filename:"WaterfallEu.tsx",children:e.jsx(h,{})}),e.jsx(o,{title:"Global carbon budget 2022",description:"Horizontal orientation: fossil sources accumulate to the gross total, the sinks float down from it, and a dashed reference line marks the 1.5°C budget.",code:C,filename:"WaterfallCarbon.tsx",children:e.jsx(m,{})}),e.jsx(o,{title:"FY 2023 EBITDA bridge",description:"Stacked waterfall: each step carries a core and an incremental layer; the running total accumulates the combined values. Break-even reference line at zero.",code:p,filename:"WaterfallEbitda.tsx",children:e.jsx(v,{})}),e.jsx(o,{title:"ARR bridge by driver",description:"Floating steps with dashed running-total connectors, Open/Closing ARR totals, and dashed reference lines at the Open and Close levels.",code:w,filename:"WaterfallArr.tsx",children:e.jsx(g,{})})]});export{k as WaterfallChartPage,k as default};
