import{j as e,a_ as a}from"./index-BBK6HA-D.js";import{P as s}from"./PageHeader-BcBcU29I.js";import{E as t}from"./ExampleCard-BVwGIEPO.js";import{C as l}from"./ChartPlayground-XBul2SRt.js";import{w as r,m as o}from"./data-BoeUGZYw.js";import"./ControlAccordion-DallGojj.js";import"./options-D-FMIizr.js";function i(){return e.jsxs(a.Svg,{height:520,hoverDim:.45,children:[e.jsx(a.Title,{title:"AI workflow adoption",subtitle:"Weekly runs per sector, stacked by how much a person did"}),e.jsx(a.Polar,{data:r,name:"Autonomous",categoryField:"sector",valueYField:"autonomous",color:"cyan",mode:"stack",innerRadius:.45}),e.jsx(a.Polar,{data:r,name:"Assisted",categoryField:"sector",valueYField:"assisted",color:"purple",mode:"stack",innerRadius:.45}),e.jsx(a.Polar,{data:r,name:"Manual",categoryField:"sector",valueYField:"manual",color:"amber",mode:"stack",innerRadius:.45}),e.jsx(a.PolarAxis,{gridShape:"circle",gridLines:5,showTickLabels:!0}),e.jsx(a.PolarCenter,{title:"Autonomous share",value:"59%",subtitle:"of all weekly runs"}),e.jsx(a.Legend,{}),e.jsx(a.Tooltip,{}),e.jsx(a.Hover,{})]})}function d(){return e.jsxs(a.Svg,{height:520,hoverDim:.45,children:[e.jsx(a.Title,{title:"Monaco Grand Prix",subtitle:"Sector performance by team (s)"}),e.jsx(a.Polar,{data:o,name:"Red Bull",categoryField:"sector",valueYField:"redBull",color:"blue",mode:"group",innerRadius:.35,segmentRadius:4,borderWidth:1}),e.jsx(a.Polar,{data:o,name:"Ferrari",categoryField:"sector",valueYField:"ferrari",color:"red",mode:"group",innerRadius:.35,segmentRadius:4,borderWidth:1}),e.jsx(a.Polar,{data:o,name:"Mercedes",categoryField:"sector",valueYField:"mercedes",color:"emerald",mode:"group",innerRadius:.35,segmentRadius:4,borderWidth:1}),e.jsx(a.PolarAxis,{gridShape:"polygon",gridStyle:"dashed",gridOpacity:.6,domainMax:95,tickFormat:n=>`${n}s`}),e.jsx(a.PolarCenter,{title:"Monaco",value:"GP sectors"}),e.jsx(a.Legend,{}),e.jsx(a.Tooltip,{}),e.jsx(a.Hover,{})]})}const c=`import { Chart } from "@cjlapao/ui-kit";
import { workflowData } from "../data";

export default function PolarStacked() {
  return (
    <Chart.Svg height={520} hoverDim={0.45}>
      <Chart.Title
        title="AI workflow adoption"
        subtitle="Weekly runs per sector, stacked by how much a person did"
      />
      <Chart.Polar
        data={workflowData}
        name="Autonomous"
        categoryField="sector"
        valueYField="autonomous"
        color="cyan"
        mode="stack"
        innerRadius={0.45}
      />
      <Chart.Polar
        data={workflowData}
        name="Assisted"
        categoryField="sector"
        valueYField="assisted"
        color="purple"
        mode="stack"
        innerRadius={0.45}
      />
      <Chart.Polar
        data={workflowData}
        name="Manual"
        categoryField="sector"
        valueYField="manual"
        color="amber"
        mode="stack"
        innerRadius={0.45}
      />
      <Chart.PolarAxis gridShape="circle" gridLines={5} showTickLabels />
      <Chart.PolarCenter
        title="Autonomous share"
        value="59%"
        subtitle="of all weekly runs"
      />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,u=`import { Chart } from "@cjlapao/ui-kit";
import { monacoData } from "../data";

export default function PolarGrouped() {
  return (
    <Chart.Svg height={520} hoverDim={0.45}>
      <Chart.Title
        title="Monaco Grand Prix"
        subtitle="Sector performance by team (s)"
      />
      <Chart.Polar
        data={monacoData}
        name="Red Bull"
        categoryField="sector"
        valueYField="redBull"
        color="blue"
        mode="group"
        innerRadius={0.35}
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.Polar
        data={monacoData}
        name="Ferrari"
        categoryField="sector"
        valueYField="ferrari"
        color="red"
        mode="group"
        innerRadius={0.35}
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.Polar
        data={monacoData}
        name="Mercedes"
        categoryField="sector"
        valueYField="mercedes"
        color="emerald"
        mode="group"
        innerRadius={0.35}
        segmentRadius={4}
        borderWidth={1}
      />
      <Chart.PolarAxis
        gridShape="polygon"
        gridStyle="dashed"
        gridOpacity={0.6}
        domainMax={95}
        tickFormat={(t) => \`\${t}s\`}
      />
      <Chart.PolarCenter title="Monaco" value="GP sectors" />
      <Chart.Legend />
      <Chart.Tooltip />
      <Chart.Hover />
    </Chart.Svg>
  );
}
`,P=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(s,{name:"Polar",description:"A rose / nightingale chart: one annular segment per category per series, fanned out from the center. Segments can sit side-by-side (grouped) or stack radially (stacked) on a shared total scale, with circular or polygonal grid rings, rounded segment corners, and a center readout."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(l,{fixedKind:"polar"})]}),e.jsx(t,{title:"AI workflow adoption map",description:"Twelve product-workflow sectors stacked radially by how much of the work a person did — the center callout surfaces the 59 % autonomous share while the perimeter labels name every sector.",code:c,filename:"PolarStacked.tsx",children:e.jsx(i,{})}),e.jsx(t,{title:"Monaco Grand Prix — sector performance by team",description:"Eight sectors with three teams side-by-side: rounded segment corners, a dashed polygon grid, second-formatted ticks, and a GP-branded center.",code:u,filename:"PolarGrouped.tsx",children:e.jsx(d,{})})]});export{P as PolarChartPage,P as default};
