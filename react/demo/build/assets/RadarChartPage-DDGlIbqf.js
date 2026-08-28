import{j as a,b0 as e}from"./index-8i9ZNynb.js";import{P as s}from"./PageHeader-CO5k_SQv.js";import{E as l}from"./ExampleCard-LdxcpmX_.js";import{C as i}from"./ChartPlayground-CZyT5TXm.js";import{i as r,Q as t}from"./data-CdstPXM1.js";import"./PlaygroundPanel-Dv9BQ1Hr.js";import"./ControlAccordion-Bqp-1oBj.js";import"./options-yAU-f7tt.js";function d(){return a.jsxs(e.Svg,{height:480,children:[a.jsx(e.Title,{title:"Enterprise readiness gaps",subtitle:"Launch build, target bar, and buyer benchmark expose the gates that still block enterprise rollout."}),a.jsx(e.Radar,{data:r,name:"Launch build",valueYField:"launch",color:"#8b5cf6",fillOpacity:.22}),a.jsx(e.Radar,{data:r,name:"Target bar",valueYField:"target",color:"#2dd4bf",lineDash:[6,4],fillOpacity:.1,goal:t,goalLabel:`Launch-ready ≥ ${t} pts`}),a.jsx(e.Radar,{data:r,name:"Buyer benchmark",valueYField:"benchmark",color:"#fbbf24",fillOpacity:.14}),a.jsx(e.RadarAxis,{rings:4,domainMax:100,tickFormat:n=>`${n} pts`}),a.jsx(e.Legend,{}),a.jsx(e.Tooltip,{}),a.jsx(e.Hover,{})]})}const o=`import { Chart } from "@cjlapao/ui-kit";
import { readinessData, readinessGoal } from "../data";

export default function Radar() {
  return (
    <Chart.Svg height={480}>
      <Chart.Title
        title="Enterprise readiness gaps"
        subtitle="Launch build, target bar, and buyer benchmark expose the gates that still block enterprise rollout."
      />
      <Chart.Radar
        data={readinessData}
        name="Launch build"
        valueYField="launch"
        color="#8b5cf6"
        fillOpacity={0.22}
      />
      <Chart.Radar
        data={readinessData}
        name="Target bar"
        valueYField="target"
        color="#2dd4bf"
        lineDash={[6, 4]}
        fillOpacity={0.1}
        goal={readinessGoal}
        goalLabel={\`Launch-ready ≥ \${readinessGoal} pts\`}
      />
      <Chart.Radar
        data={readinessData}
        name="Buyer benchmark"
        valueYField="benchmark"
        color="#fbbf24"
        fillOpacity={0.14}
      />
      <Chart.RadarAxis
        rings={4}
        domainMax={100}
        tickFormat={(t) => \`\${t} pts\`}
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,f=()=>a.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[a.jsx(s,{name:"Radar",description:"A spider chart: one polygon per series on a shared set of axes, with polygon grid rings, vertex markers, dashed outlines, and a per-axis goal marker. Fills reuse the shared fill system — flat, or a radial gradient fading to the center."}),a.jsxs("section",{className:"flex flex-col gap-3",children:[a.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),a.jsx(i,{fixedKind:"radar"})]}),a.jsx(l,{title:"Enterprise readiness gaps",description:"Launch build, target bar, and buyer benchmark expose the gates that still block enterprise rollout — three polygons, a dashed target, unit-labeled rings, and a launch-ready goal marker.",code:o,filename:"Radar.tsx",children:a.jsx(d,{})})]});export{f as RadarChartPage,f as default};
