import{r as l,j as e,M as d,b0 as a}from"./index-8i9ZNynb.js";import{P as i}from"./PageHeader-CO5k_SQv.js";import{E as c}from"./ExampleCard-LdxcpmX_.js";import{C as p}from"./ChartPlayground-CZyT5TXm.js";import{C as n,D as u,E as o,F as m}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";function g(){const[t,s]=l.useState("stack");return e.jsxs("div",{className:"flex w-full max-w-5xl flex-col items-center gap-4",children:[e.jsx(d,{size:"sm",options:[{label:"Stacked",value:"stack"},{label:"Grouped",value:"group"},{label:"Percent",value:"percent"}],value:t,onChange:r=>s(r)}),e.jsxs(a.Svg,{height:380,children:[e.jsx(a.Title,{title:"Daily support load",subtitle:"Stacked by work type, with self-serve deflection visible beside critical and migration pressure"}),e.jsx(a.Legend,{}),e.jsx(a.Bar,{data:n,categoryXField:"day",valueYField:"critical",name:"Critical",mode:t,stackId:"load",color:"#f87171",cornerRadius:16,segmentGap:3}),e.jsx(a.Bar,{data:n,categoryXField:"day",valueYField:"migration",name:"Migration",mode:t,stackId:"load",color:"#8b5cf6",cornerRadius:16,segmentGap:3}),e.jsx(a.Bar,{data:n,categoryXField:"day",valueYField:"product",name:"Product",mode:t,stackId:"load",color:"#38bdf8",cornerRadius:16,segmentGap:3}),e.jsx(a.Bar,{data:n,categoryXField:"day",valueYField:"onboarding",name:"Onboarding",mode:t,stackId:"load",color:"#fbbf24",cornerRadius:16,segmentGap:3}),e.jsx(a.Bar,{data:n,categoryXField:"day",valueYField:"deflected",name:"Deflected",mode:t,stackId:"load",color:"#34d399",cornerRadius:16,segmentGap:3}),e.jsx(a.XAxis,{tickCount:24}),e.jsx(a.YAxis,{labels:!1,axisLine:!1}),e.jsx(a.ReferenceLine,{y:u,label:"Escalation desk",labelPosition:"start"}),e.jsx(a.Annotation,{x:m,y:o,tone:"#34d399",title:"Peak 24",value:`${o} cases`,placement:"top"}),e.jsx(a.Tooltip,{mode:"shared"}),e.jsx(a.Hover,{})]})]})}const x=`import { useState } from "react";
import { Chart, MultiToggle } from "@cjlapao/ui-kit";
import {
  escalationDeskLevel,
  supportDays,
  supportPeakDay,
  supportPeakTotal,
} from "../data";

type Mode = "stack" | "group" | "percent";

/**
 * Daily support load stacked by work type (the PrimeUI stacked-bar
 * reference): rounded segment corners (the surface scale, no pills), the dashed escalation-desk level and
 * the "Peak 24" callout.
 */
export default function BarModes() {
  const [mode, setMode] = useState<Mode>("stack");
  return (
    <div className="flex w-full max-w-5xl flex-col items-center gap-4">
      <MultiToggle
        size="sm"
        options={[
          { label: "Stacked", value: "stack" },
          { label: "Grouped", value: "group" },
          { label: "Percent", value: "percent" },
        ]}
        value={mode}
        onChange={(v) => setMode(v as Mode)}
      />
      <Chart.Svg height={380}>
        <Chart.Title
          title="Daily support load"
          subtitle="Stacked by work type, with self-serve deflection visible beside critical and migration pressure"
        />
        <Chart.Legend />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="critical"
          name="Critical"
          mode={mode}
          stackId="load"
          color="#f87171"
          cornerRadius={16}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="migration"
          name="Migration"
          mode={mode}
          stackId="load"
          color="#8b5cf6"
          cornerRadius={16}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="product"
          name="Product"
          mode={mode}
          stackId="load"
          color="#38bdf8"
          cornerRadius={16}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="onboarding"
          name="Onboarding"
          mode={mode}
          stackId="load"
          color="#fbbf24"
          cornerRadius={16}
          segmentGap={3}
        />
        <Chart.Bar
          data={supportDays}
          categoryXField="day"
          valueYField="deflected"
          name="Deflected"
          mode={mode}
          stackId="load"
          color="#34d399"
          cornerRadius={16}
          segmentGap={3}
        />
        <Chart.XAxis tickCount={24} />
        <Chart.YAxis labels={false} axisLine={false} />
        <Chart.ReferenceLine
          y={escalationDeskLevel}
          label="Escalation desk"
          labelPosition="start"
        />
        <Chart.Annotation
          x={supportPeakDay}
          y={supportPeakTotal}
          tone="#34d399"
          title="Peak 24"
          value={\`\${supportPeakTotal} cases\`}
          placement="top"
        />
        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`,P=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(i,{name:"Bar",description:"Bar/column series in grouped, stacked and percent modes over one data set — the mode is a single prop. Corner radii follow the shared surface scale, and segment gaps separate stacked pieces."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(p,{fixedKind:"bar"})]}),e.jsx(c,{title:"Bar modes",description:"Grouped, stacked and percent bars over one quarterly P&L — the mode is a single prop.",code:x,filename:"BarModes.tsx",children:e.jsx(g,{})})]});export{P as BarChartPage,P as default};
