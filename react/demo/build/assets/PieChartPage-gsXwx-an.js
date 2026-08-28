import{j as e,b0 as t}from"./index-8i9ZNynb.js";import{P as l}from"./PageHeader-CO5k_SQv.js";import{E as i}from"./ExampleCard-LdxcpmX_.js";import{C as o}from"./ChartPlayground-CZyT5TXm.js";import{G as s,H as n,I as r}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";function d(){return e.jsx("div",{className:"flex w-full max-w-3xl flex-col items-center gap-4",children:e.jsxs(t.Svg,{height:440,children:[e.jsx(t.Title,{title:"Plan mix by ARR",subtitle:"Annual recurring revenue is split by plan, with slice hover updating the center readout and legend toggles for isolation"}),e.jsx(t.Pie,{data:n,name:"Plan mix",valueField:"value",categoryField:"name",colors:s,innerRadius:.62,padAngle:.02,cornerRadius:6}),e.jsx(t.PieCenter,{title:"ARR MIX",value:r,subtitle:`${n.length} plans tracked`,valueFormatter:a=>`$${(a/1e3).toFixed(2)}M`,hoverSubtitle:a=>`$${(a.value/1e3).toFixed(2)}M · ${Math.round(a.percent)}%`}),e.jsx(t.DataLabels,{position:"all",formatter:a=>`${Math.round(a/r*100)}%`}),e.jsx(t.Legend,{position:"bottom"}),e.jsx(t.Tooltip,{mode:"shared"}),e.jsx(t.Hover,{})]})})}const u=`import { Chart } from "@cjlapao/ui-kit";
import { arrPlans, arrPlanColors, arrTotal } from "../data";

/**
 * Plan mix by ARR (the PrimeUI donut reference): six plan slices with
 * percent labels, a center readout that tracks slice hover, and a bottom
 * legend whose toggles isolate slices.
 */
export default function PieDonut() {
  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-4">
      <Chart.Svg height={440}>
        <Chart.Title
          title="Plan mix by ARR"
          subtitle="Annual recurring revenue is split by plan, with slice hover updating the center readout and legend toggles for isolation"
        />
        <Chart.Pie
          data={arrPlans}
          name="Plan mix"
          valueField="value"
          categoryField="name"
          colors={arrPlanColors}
          innerRadius={0.62}
          padAngle={0.02}
          cornerRadius={6}
        />
        <Chart.PieCenter
          title="ARR MIX"
          value={arrTotal}
          subtitle={\`\${arrPlans.length} plans tracked\`}
          valueFormatter={(v) => \`$\${(v / 1000).toFixed(2)}M\`}
          hoverSubtitle={(s) =>
            \`$\${(s.value / 1000).toFixed(2)}M · \${Math.round(s.percent)}%\`
          }
        />
        <Chart.DataLabels
          position="all"
          formatter={(v) => \`\${Math.round((v / arrTotal) * 100)}%\`}
        />
        <Chart.Legend position="bottom" />
        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`,P=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(l,{name:"Pie & Donut",description:"Pie, donut and gauge sweeps with slice gaps, rounded segments, in-slice percent labels, hover pop-out and a center display for the donut."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(o,{fixedKind:"pie"})]}),e.jsx(i,{title:"Pie & donut",description:"A donut with percent data labels beside a flat pie with a vertical legend.",code:u,filename:"PieDonut.tsx",children:e.jsx(d,{})})]});export{P as PieChartPage,P as default};
