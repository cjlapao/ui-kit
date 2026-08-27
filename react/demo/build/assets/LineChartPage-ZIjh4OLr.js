import{j as e,a_ as n}from"./index-BBK6HA-D.js";import{P as s}from"./PageHeader-BcBcU29I.js";import{E as i}from"./ExampleCard-BVwGIEPO.js";import{C as d}from"./ChartPlayground-XBul2SRt.js";import{l as t,b as c,a as x,p as h,c as m,r as u,d as v,e as l}from"./data-BoeUGZYw.js";import"./ControlAccordion-DallGojj.js";import"./options-D-FMIizr.js";function p(){return e.jsx("div",{className:"w-full max-w-5xl",children:e.jsxs(n.Svg,{height:460,ariaLabel:"Growth metrics, indexed Jan 2024 to Jun 2025",children:[e.jsx(n.Title,{title:"Growth metrics",subtitle:"Indexed to 100 at launch · Jan 2024 → Jun 2025"}),e.jsx(n.Legend,{orientation:"horizontal"}),e.jsx(n.Line,{id:"arr",data:t,name:"Expansion ARR",valueYField:"arr",color:"violet",curve:"smooth",fillOpacity:.35,lineStrokeWidth:2.5}),e.jsx(n.Line,{id:"activation",data:t,name:"Activation rate",valueYField:"activation",color:"sky",curve:"smooth",showMarkers:!0,markerShape:"circle",markerSize:2.5,maxDataPoints:18}),e.jsx(n.Line,{id:"retention",data:t,name:"Week 8 retention",valueYField:"retention",color:"emerald",curve:"smooth",lineStyle:"dashed"}),e.jsx(n.Line,{id:"risk",data:t,name:"Support risk",valueYField:"risk",color:"red",curve:"smooth",lineStyle:"dotted"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{domain:[50,350],tickCount:7}),e.jsx(n.ReferenceBand,{x1:x,x2:c,color:"teal",label:"Public beta"}),e.jsx(n.ReferenceBand,{x1:m,x2:h,color:"violet",label:"Usage pricing"}),e.jsx(n.ReferenceBand,{x1:v,x2:u,color:"blue",label:"Enterprise rollout"}),e.jsx(n.ReferenceLine,{y:100,label:"Indexed baseline"}),e.jsx(n.ReferenceLine,{x:l,label:"Friday, Nov 1, 2024"}),e.jsx(n.Annotation,{x:l,y:205,tone:"violet",title:"Pricing lift",value:"+105 pts"}),e.jsx(n.Annotation,{x:new Date(Date.UTC(2025,0,31)),y:99,tone:"red",title:"Risk burn cooling",value:"99 index",placement:"right"}),e.jsx(n.DataLabels,{position:"last",anchor:"margin-left",render:({color:r,value:a})=>e.jsx("span",{className:"rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums dark:bg-neutral-400/15",style:{color:r},children:Math.round(a)})}),e.jsx(n.Tooltip,{mode:"shared"}),e.jsx(n.Hover,{})]})})}const f=`import { Chart } from "@cjlapao/ui-kit";
import {
  betaEnd,
  betaStart,
  crosshairDate,
  lineMetrics,
  pricingEnd,
  pricingStart,
  rolloutEnd,
  rolloutStart,
} from "../data";

/**
 * The flagship demo — a close reading of the PrimeUI LINE reference:
 * four indexed series over 17 months, three phase windows, an indexed
 * baseline, a pricing-lift crosshair, two callout annotations and the
 * four end-of-series value badges in the left margin.
 */
export default function LineReference() {
  return (
    <div className="w-full max-w-5xl">
      <Chart.Svg height={460} ariaLabel="Growth metrics, indexed Jan 2024 to Jun 2025">
        <Chart.Title
          title="Growth metrics"
          subtitle="Indexed to 100 at launch · Jan 2024 → Jun 2025"
        />
        <Chart.Legend orientation="horizontal" />

        <Chart.Line
          id="arr"
          data={lineMetrics}
          name="Expansion ARR"
          valueYField="arr"
          color="violet"
          curve="smooth"
          fillOpacity={0.35}
          lineStrokeWidth={2.5}
        />
        <Chart.Line
          id="activation"
          data={lineMetrics}
          name="Activation rate"
          valueYField="activation"
          color="sky"
          curve="smooth"
          showMarkers
          markerShape="circle"
          markerSize={2.5}
          maxDataPoints={18}
        />
        <Chart.Line
          id="retention"
          data={lineMetrics}
          name="Week 8 retention"
          valueYField="retention"
          color="emerald"
          curve="smooth"
          lineStyle="dashed"
        />
        <Chart.Line
          id="risk"
          data={lineMetrics}
          name="Support risk"
          valueYField="risk"
          color="red"
          curve="smooth"
          lineStyle="dotted"
        />

        <Chart.XAxis />
        <Chart.YAxis domain={[50, 350]} tickCount={7} />

        <Chart.ReferenceBand
          x1={betaStart}
          x2={betaEnd}
          color="teal"
          label="Public beta"
        />
        <Chart.ReferenceBand
          x1={pricingStart}
          x2={pricingEnd}
          color="violet"
          label="Usage pricing"
        />
        <Chart.ReferenceBand
          x1={rolloutStart}
          x2={rolloutEnd}
          color="blue"
          label="Enterprise rollout"
        />

        <Chart.ReferenceLine y={100} label="Indexed baseline" />
        <Chart.ReferenceLine x={crosshairDate} label="Friday, Nov 1, 2024" />

        <Chart.Annotation
          x={crosshairDate}
          y={205}
          tone="violet"
          title="Pricing lift"
          value="+105 pts"
        />
        <Chart.Annotation
          x={new Date(Date.UTC(2025, 0, 31))}
          y={99}
          tone="red"
          title="Risk burn cooling"
          value="99 index"
          placement="right"
        />

        <Chart.DataLabels
          position="last"
          anchor="margin-left"
          render={({ color, value }) => (
            <span
              className="rounded-full bg-neutral-500/10 px-2 py-0.5 text-[11px] font-semibold tabular-nums dark:bg-neutral-400/15"
              style={{ color }}
            >
              {Math.round(value)}
            </span>
          )}
        />

        <Chart.Tooltip mode="shared" />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`;function C(){return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsxs(n.Svg,{height:340,children:[e.jsx(n.Title,{title:"Curve, dash & markers"}),e.jsx(n.Line,{data:t,name:"Linear",color:"violet",valueYField:"arr",curve:"linear",maxDataPoints:16}),e.jsx(n.Line,{data:t,name:"Smooth",color:"sky",valueYField:"arr",curve:"smooth",lineStyle:"dashed",maxDataPoints:16}),e.jsx(n.Line,{data:t,name:"Step",color:"emerald",valueYField:"arr",curve:"step",lineStyle:"dotted",showMarkers:!0,markerShape:"square",maxDataPoints:16}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{tickCount:5}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{}),e.jsx(n.Hover,{})]})})}const g=`import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/** Curve interpolation, line styles and markers on one shared dataset. */
export default function LineCurves() {
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Curve, dash & markers" />
        <Chart.Line
          data={lineMetrics}
          name="Linear"
          color="violet"
          valueYField="arr"
          curve="linear"
          maxDataPoints={16}
        />
        <Chart.Line
          data={lineMetrics}
          name="Smooth"
          color="sky"
          valueYField="arr"
          curve="smooth"
          lineStyle="dashed"
          maxDataPoints={16}
        />
        <Chart.Line
          data={lineMetrics}
          name="Step"
          color="emerald"
          valueYField="arr"
          curve="step"
          lineStyle="dotted"
          showMarkers
          markerShape="square"
          maxDataPoints={16}
        />
        <Chart.XAxis />
        <Chart.YAxis tickCount={5} />
        <Chart.Legend />
        <Chart.Tooltip />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`;function j(){const r=t.map(a=>({date:a.date,value:Math.round(a.arr*4800)}));return e.jsx("div",{className:"w-full max-w-4xl",children:e.jsxs(n.Svg,{height:340,children:[e.jsx(n.Title,{title:"Dual y-axes",subtitle:"Indexed metrics · dollar scale"}),e.jsx(n.Line,{data:r,name:"ARR ($)",color:"violet",curve:"smooth",yFieldAxis:"right",fillOpacity:.25}),e.jsx(n.Line,{data:t,name:"Activation (index)",color:"emerald",valueYField:"activation",curve:"smooth",lineStyle:"dashed"}),e.jsx(n.XAxis,{}),e.jsx(n.YAxis,{label:"Index",domain:[50,350]}),e.jsx(n.YAxis,{axis:"right",label:"ARR ($k)",format:a=>`$${(a/1e3).toFixed(0)}k`}),e.jsx(n.Legend,{}),e.jsx(n.Tooltip,{mode:"shared",itemFormat:(a,o)=>o==="ARR ($)"?`$${(a/1e3).toFixed(0)}k`:String(a)}),e.jsx(n.Hover,{})]})})}const b=`import { Chart } from "@cjlapao/ui-kit";
import { lineMetrics } from "../data";

/**
 * Two value axes from one series list — the left axis carries the indexed
 * metrics, the right axis an absolute dollar scale for the ARR line.
 */
export default function DualAxis() {
  const dollars = lineMetrics.map((p) => ({
    date: p.date,
    value: Math.round(p.arr * 4800),
  }));
  return (
    <div className="w-full max-w-4xl">
      <Chart.Svg height={340}>
        <Chart.Title title="Dual y-axes" subtitle="Indexed metrics · dollar scale" />
        <Chart.Line
          data={dollars}
          name="ARR ($)"
          color="violet"
          curve="smooth"
          yFieldAxis="right"
          fillOpacity={0.25}
        />
        <Chart.Line
          data={lineMetrics}
          name="Activation (index)"
          color="emerald"
          valueYField="activation"
          curve="smooth"
          lineStyle="dashed"
        />
        <Chart.XAxis />
        <Chart.YAxis label="Index" domain={[50, 350]} />
        <Chart.YAxis axis="right" label="ARR ($k)" format={(t) => \`$\${(t / 1000).toFixed(0)}k\`} />
        <Chart.Legend />
        <Chart.Tooltip mode="shared" itemFormat={(v, name) => (name === "ARR ($)" ? \`$\${(v / 1000).toFixed(0)}k\` : String(v))} />
        <Chart.Hover />
      </Chart.Svg>
    </div>
  );
}
`,F=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(s,{name:"Line",description:"Line series: linear, smooth and step interpolation, dashed/dotted styles, square markers, area fills with gradient and dual y-axes — all with entrance and update animations."}),e.jsxs("section",{className:"flex flex-col gap-3",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Playground"}),e.jsx(d,{fixedKind:"line"})]}),e.jsx(i,{title:"Growth metrics",description:"The reference chart: four indexed series, three phase windows, an indexed baseline, the pricing-lift crosshair, two callouts and end-of-series badges.",code:f,filename:"LineReference.tsx",children:e.jsx(p,{})}),e.jsx(i,{title:"Curves, dashes & markers",description:"Linear, smooth and step interpolation plus dashed/dotted styles and square markers.",code:g,filename:"LineCurves.tsx",children:e.jsx(C,{})}),e.jsx(i,{title:"Dual y-axes",description:"The same data set on an index scale (left) and a dollar scale (right) — series opt in with yFieldAxis.",code:b,filename:"DualAxis.tsx",children:e.jsx(j,{})})]});export{F as LineChartPage,F as default};
