import{j as e,b0 as n}from"./index-8i9ZNynb.js";import{P as i}from"./PageHeader-CO5k_SQv.js";import{E as l}from"./ExampleCard-LdxcpmX_.js";import{l as t}from"./data-CdstPXM1.js";function r(){const a=t[55];return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsxs(n.Svg,{height:340,children:[e.jsx(n.Title,{title:"Annotations",subtitle:"Bands, rules and callouts"}),e.jsx(n.Line,{data:t,name:"Expansion ARR",color:"violet",valueYField:"arr",curve:"smooth",fillOpacity:.2}),e.jsx(n.ReferenceBand,{x1:t[20].date,x2:t[40].date,color:"teal",opacity:.12,label:"Slow quarter"}),e.jsx(n.ReferenceLine,{y:120,label:"Milestone 120",color:"emerald"}),e.jsx(n.ReferenceLine,{x:t[43].date,color:"violet"}),e.jsx(n.Annotation,{x:t[45].date,y:t[45].arr,tone:"violet",title:"Pricing lift",value:"+105 pts",leaderLine:!0}),e.jsx(n.Annotation,{x:a.date,y:a.arr,tone:"sky",title:"Enterprise ramp",value:"200+ index",placement:"bottom"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{tickCount:5})]})})}const o=`import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/** Reference lines, bands and callout cards on a single smooth series. */
export default function Annotations() {
  const target = lineMetrics[55];
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Annotations" subtitle="Bands, rules and callouts" />
        <Chart.Line
          data={lineMetrics}
          name="Expansion ARR"
          color="violet"
          valueYField="arr"
          curve="smooth"
          fillOpacity={0.2}
        />
        <Chart.ReferenceBand
          x1={lineMetrics[20].date}
          x2={lineMetrics[40].date}
          color="teal"
          opacity={0.12}
          label="Slow quarter"
        />
        <Chart.ReferenceLine y={120} label="Milestone 120" color="emerald" />
        <Chart.ReferenceLine x={lineMetrics[43].date} color="violet" />
        <Chart.Annotation
          x={lineMetrics[45].date}
          y={lineMetrics[45].arr}
          tone="violet"
          title="Pricing lift"
          value="+105 pts"
          leaderLine
        />
        <Chart.Annotation
          x={target.date}
          y={target.arr}
          tone="sky"
          title="Enterprise ramp"
          value="200+ index"
          placement="bottom"
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
      </Chart.Svg>
    </div>
  );
}
`,m=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(i,{name:"Reference & Callouts",description:"Cross-cutting chart chrome that works on any cartesian type: reference bands for phase windows, dashed reference lines with labels, milestone labels and annotation callouts with leader lines."}),e.jsx(l,{title:"Annotations",description:"Reference bands, dashed rules and annotation callouts with leader lines.",code:o,filename:"Annotations.tsx",children:e.jsx(r,{})})]});export{m as AnnotationsChartPage,m as default};
