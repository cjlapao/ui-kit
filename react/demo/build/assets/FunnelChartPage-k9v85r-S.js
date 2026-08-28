import{j as e,b0 as t}from"./index-Bw7SVFgV.js";import{P as o}from"./PageHeader-CQm-NnZo.js";import{E as r}from"./ExampleCard-BR4461qP.js";import{C as i}from"./ChartPlayground-CJjSTqSp.js";import{B as a}from"./data-CdstPXM1.js";import"./PlaygroundPanel-efOYSasM.js";import"./ControlAccordion-BDKCdIsF.js";import"./options-CREM8uYu.js";const l=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:n>=1e3?`${(n/1e3).toFixed(1)}K`:String(n);function s(){return e.jsxs(t.Svg,{height:420,ariaLabel:"Single-color funnel",children:[e.jsx(t.Title,{title:"Support pipeline",subtitle:"One series color — darker connectors and arrow are derived automatically."}),e.jsx(t.Funnel,{data:a.slice(0,5),name:"Support pipeline",color:"#2f6fd0",valueFormat:l}),e.jsx(t.Tooltip,{mode:"shared"}),e.jsx(t.Hover,{})]})}const c=n=>n>=1e6?`${(n/1e6).toFixed(1)}M`:n>=1e3?`${(n/1e3).toFixed(1)}K`:String(n);function d(){return e.jsxs(t.Svg,{height:420,ariaLabel:"Multi-color funnel",children:[e.jsx(t.Title,{title:"Performance funnel",subtitle:"Per-stage colors, conversion rates between stages, min-width clamp on the tail."}),e.jsx(t.Funnel,{data:a,name:"Performance funnel",colors:["#7c5cf0","#2f6fd0","#12a5b8","#0e9f6e","#e0a520","#e05252"],valueFormat:c}),e.jsx(t.Tooltip,{mode:"shared"}),e.jsx(t.Hover,{})]})}const u=`import { Chart } from "@cjlapao/ui-kit";
import { funnelMarketing } from "../data";

const si = (v: number) =>
  v >= 1e6 ? \`\${(v / 1e6).toFixed(1)}M\` : v >= 1e3 ? \`\${(v / 1e3).toFixed(1)}K\` : String(v);

/**
 * Single-color funnel — one \`color\` paints every stage; the connectors and
 * the bottom arrow are auto-derived darker versions of it.
 */
export function FunnelBasic() {
  return (
    <Chart.Svg height={420} ariaLabel="Single-color funnel">
      <Chart.Title
        title="Support pipeline"
        subtitle="One series color — darker connectors and arrow are derived automatically."
      />
      <Chart.Funnel
        data={funnelMarketing.slice(0, 5)}
        name="Support pipeline"
        color="#2f6fd0"
        valueFormat={si}
      />
      <Chart.Tooltip mode="shared" />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default FunnelBasic;
`,m=`import { Chart } from "@cjlapao/ui-kit";
import { funnelMarketing } from "../data";

const si = (v: number) =>
  v >= 1e6 ? \`\${(v / 1e6).toFixed(1)}M\` : v >= 1e3 ? \`\${(v / 1e3).toFixed(1)}K\` : String(v);

/**
 * Multi-color funnel — a per-stage \`colors\` array (Impressions → Renewals),
 * conversion % between stages, stage names on dotted leaders. The small
 * tail stages hit the min-width clamp so their labels stay legible.
 */
export function FunnelMulti() {
  return (
    <Chart.Svg height={420} ariaLabel="Multi-color funnel">
      <Chart.Title
        title="Performance funnel"
        subtitle="Per-stage colors, conversion rates between stages, min-width clamp on the tail."
      />
      <Chart.Funnel
        data={funnelMarketing}
        name="Performance funnel"
        colors={["#7c5cf0", "#2f6fd0", "#12a5b8", "#0e9f6e", "#e0a520", "#e05252"]}
        valueFormat={si}
      />
      <Chart.Tooltip mode="shared" />
      <Chart.Hover />
    </Chart.Svg>
  );
}

export default FunnelMulti;
`,j=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(o,{name:"Funnel",description:"A self-contained conversion funnel — up to 6 stages, width proportional to value. Bright trapezoids with darker auto-derived connectors and a bottom arrow, values inside, conversion % between stages, stage names on dotted leaders."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(i,{fixedKind:"funnel"})]}),e.jsx(r,{title:"Performance funnel",description:"Per-stage colors with conversion rates between stages; the small tail stages hit the min-width clamp so labels stay legible.",code:m,filename:"FunnelMulti.tsx",children:e.jsx(d,{})}),e.jsx(r,{title:"Single color",description:"One `color` prop paints every stage — the connectors and arrow are derived darker versions of it.",code:u,filename:"FunnelBasic.tsx",children:e.jsx(s,{})})]});export{j as FunnelChartPage,j as default};
