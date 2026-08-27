import{r as a,j as e,b4 as h,b6 as k,bn as R,bo as A,bp as b,b7 as p,bq as W,br as O}from"./index-BBK6HA-D.js";import{P as V}from"./PageHeader-BcBcU29I.js";import{E as w}from"./ExampleCard-BVwGIEPO.js";import{P as I,C as Q,b as d,a as u,T as r}from"./ControlAccordion-DallGojj.js";import{u as X}from"./StatBaseControls-dNhOHaEE.js";import{aX as K}from"./options-D-FMIizr.js";const Y=[{label:"Card",value:"card"},{label:"Tile",value:"tile"},{label:"Count",value:"count"},{label:"Goal",value:"goal"},{label:"Chart",value:"chart"},{label:"Graph",value:"graph"},{label:"Health",value:"health"}],J={card:"The base. Everything else on this page is this component with a body.",tile:"StatCard under the older prop names — `title`, `color`, `textColor`, a `progress` object. Nothing of its own.",count:"Adds `breakdown`: labelled rows under the count. Defaults `size` to `xl`.",goal:"Adds `goals` and `ringSize`. Rings scale with the card's `size`.",chart:"Adds `data` and `chartSize`: a navigable donut with a legend.",graph:"Adds `data`, `series` and `chartType`. `variant` is the Panel surface again — it used to be the chart kind.",health:"Adds `state`, `bpm` and `height`: a live ECG trace as the body."},Z=[{value:78,label:"Uptime target",icon:"HealthCheck"},{value:45,label:"Cost budget",icon:"Shop"},{value:92,label:"Coverage",icon:"Rocket"}],f=[{id:"regions",label:"By region",centerLabel:"capsules",items:[{label:"us-east",value:48},{label:"eu-west",value:31},{label:"ap-south",value:22},{label:"sa-east",value:9}]},{id:"tiers",label:"By tier",centerLabel:"capsules",items:[{label:"Standard",value:71},{label:"Premium",value:27},{label:"Trial",value:12}]}],$=[{name:"Mon",requests:42,errors:4},{name:"Tue",requests:58,errors:7},{name:"Wed",requests:51,errors:3},{name:"Thu",requests:73,errors:9},{name:"Fri",requests:66,errors:5}],ee=[{key:"requests",label:"Requests"},{key:"errors",label:"Errors"}],ae=[{label:"Running",value:96},{label:"Paused",value:24},{label:"Failed",value:8,color:"rose"}],te=()=>{const{groups:G,statProps:n}=X(),[s,P]=a.useState("card"),[m,q]=a.useState(!0),[c,E]=a.useState(""),[g,H]=a.useState(!0),[v,N]=a.useState("bar"),[x,z]=a.useState(!0),[S,F]=a.useState(!0),[C,L]=a.useState(!0),[T,B]=a.useState(!0),[y,D]=a.useState("healthy"),[j,U]=a.useState("60"),l="Active capsules",i=128,_=(()=>{switch(s){case"count":return e.jsx(u,{label:"Count extras",children:e.jsx(r,{label:"Breakdown rows",checked:m,onChange:q})});case"goal":return e.jsx(d,{label:"Ring size",options:[{label:"(from size)",value:""},{label:"40",value:"40"},{label:"64",value:"64"},{label:"88",value:"88"}],value:c,onChange:E});case"chart":return e.jsx(u,{label:"Chart extras",children:e.jsx(r,{label:"Two datasets",checked:g,onChange:H})});case"graph":return e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Chart type",options:O.map(t=>({label:t,value:t})),value:v,onChange:t=>N(t)}),e.jsx(u,{label:"Graph extras",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(r,{label:"Axes",checked:x,onChange:z}),e.jsx(r,{label:"Grid",checked:S,onChange:F}),e.jsx(r,{label:"Legend",checked:C,onChange:L}),e.jsx(r,{label:"Animate",checked:T,onChange:B})]})})]});case"health":return e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Health state",options:K,value:y,onChange:t=>D(t)}),e.jsx(d,{label:"BPM",options:[{label:"48",value:"48"},{label:"60",value:"60"},{label:"96",value:"96"},{label:"128",value:"128"}],value:j,onChange:U})]});default:return null}})(),M=(()=>{switch(s){case"tile":return e.jsx(W,{...n,title:l,value:i});case"count":return e.jsx(p,{...n,label:l,value:i,breakdown:m?ae:void 0});case"goal":return e.jsx(b,{...n,label:l,goals:Z,ringSize:c?Number(c):void 0});case"chart":return e.jsx(A,{...n,label:l,data:g?f:f.slice(0,1)});case"graph":return e.jsx(R,{...n,label:l,value:i,data:$,series:ee,chartType:v,showAxes:x,showGrid:S,showLegend:C,chartAnimation:T});case"health":return e.jsx(k,{...n,label:l,value:i,state:y,bpm:Number(j)});default:return e.jsx(h,{...n,label:l,value:i})}})();return e.jsx(I,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"variant",title:"Variant",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Stat variant",options:Y.map(t=>({...t})),value:s,onChange:t=>P(t)}),_]})},...G]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[J[s]," Every control below ",e.jsx("strong",{children:"Stat variant"})," ","is a ",e.jsx("code",{children:"StatCard"})," prop and applies to all seven — they are the same hook the Stat Card page uses, so the two lists cannot drift."]})]}),preview:e.jsx("div",{className:s==="chart"||s==="graph"?"w-full max-w-md":"w-full max-w-xs",children:M})})},o={variant:"elevated",size:"md",corner:"rounded-lg"};function ne(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(h,{...o,label:"Active capsules",value:128,icon:"Rocket",tone:"blue",trend:{value:"+12%",direction:"up"}}),e.jsx(p,{...o,label:"Total",value:412,tone:"violet",icon:"Database",breakdown:[{label:"Running",value:128,color:"emerald"},{label:"Stopped",value:284,color:"rose"}]}),e.jsx(b,{...o,label:"Goals",tone:"emerald",goals:[{value:72,label:"Uptime",icon:"HealthCheck"},{value:45,label:"Coverage",icon:"Check"}]}),e.jsx(A,{...o,label:"Distribution",tone:"amber",data:[{id:1,label:"By state",centerLabel:"capsules",items:[{label:"Running",value:12},{label:"Paused",value:5},{label:"Failed",value:3}]}]}),e.jsx(R,{...o,label:"Throughput",value:"66/s",tone:"cyan",chartType:"bar",series:[{key:"requests",label:"Requests"}],data:[{name:"Mon",requests:42},{name:"Tue",requests:58},{name:"Wed",requests:51},{name:"Thu",requests:73},{name:"Fri",requests:66}]}),e.jsx(k,{...o,label:"Service health",value:"99.98%",tone:"rose",icon:"HealthCheck",state:"healthy",bpm:72})]})}const le=`import {
  StatCard,
  StatChartTile,
  StatCountTile,
  StatGoalTile,
  StatGraphTile,
  StatHealthCard,
} from "@cjlapao/ui-kit";

/**
 * The whole family, driven by the same base props.
 *
 * Every one of these inherits \`StatCardProps\`, so \`variant\`, \`tone\`, \`size\`,
 * \`padding\`, \`corner\`, \`decoration\`, \`trend\`, \`loaderType\` and the rest mean
 * the same thing on all of them. Each adds one thing: a breakdown, rings, a
 * donut, a chart, an ECG trace.
 *
 * \`StatTile\` is not shown because it is \`StatCard\` under the older prop names
 * and renders identically.
 */
const shared = { variant: "elevated", size: "md", corner: "rounded-lg" } as const;

export default function Family() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <StatCard
        {...shared}
        label="Active capsules"
        value={128}
        icon="Rocket"
        tone="blue"
        trend={{ value: "+12%", direction: "up" }}
      />
      <StatCountTile
        {...shared}
        label="Total"
        value={412}
        tone="violet"
        icon="Database"
        breakdown={[
          { label: "Running", value: 128, color: "emerald" },
          { label: "Stopped", value: 284, color: "rose" },
        ]}
      />
      <StatGoalTile
        {...shared}
        label="Goals"
        tone="emerald"
        goals={[
          { value: 72, label: "Uptime", icon: "HealthCheck" },
          { value: 45, label: "Coverage", icon: "Check" },
        ]}
      />
      <StatChartTile
        {...shared}
        label="Distribution"
        tone="amber"
        data={[
          {
            id: 1,
            label: "By state",
            centerLabel: "capsules",
            items: [
              { label: "Running", value: 12 },
              { label: "Paused", value: 5 },
              { label: "Failed", value: 3 },
            ],
          },
        ]}
      />
      <StatGraphTile
        {...shared}
        label="Throughput"
        value="66/s"
        tone="cyan"
        chartType="bar"
        series={[{ key: "requests", label: "Requests" }]}
        data={[
          { name: "Mon", requests: 42 },
          { name: "Tue", requests: 58 },
          { name: "Wed", requests: 51 },
          { name: "Thu", requests: 73 },
          { name: "Fri", requests: 66 },
        ]}
      />
      <StatHealthCard
        {...shared}
        label="Service health"
        value="99.98%"
        tone="rose"
        icon="HealthCheck"
        state="healthy"
        bpm={72}
      />
    </div>
  );
}
`;function se(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(b,{label:"Loading",icon:"Rocket",loading:!0,goals:[{value:72,label:"Uptime",icon:"HealthCheck"}]}),e.jsx(p,{label:"Failed",size:"md",value:0,icon:"Rocket",error:{message:"Registry unreachable",onRetry:()=>{}}}),e.jsx(h,{label:"Quota",value:"64%",icon:"Database",progress:64,progressType:"bar",progressLabel:"Used"})]})}const re=`import { StatCountTile, StatGoalTile, StatCard } from "@cjlapao/ui-kit";

/**
 * Loading, error and progress are the base card's, so they look and behave the
 * same on every member of the family — including the ones whose body is a
 * chart. The loader shapes the card and keeps the grid's layout; the error's
 * retry is a real \`Button\`, where it used to be a bare \`<button
 * className="text-blue-600 …">\` with a hardcoded blue and no dark-mode
 * partner; the bar is a real \`Progress\` with an accessible name, where it used
 * to be two nested divs with no role.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatGoalTile
        label="Loading"
        icon="Rocket"
        loading
        goals={[{ value: 72, label: "Uptime", icon: "HealthCheck" }]}
      />
      <StatCountTile
        label="Failed"
        size="md"
        value={0}
        icon="Rocket"
        error={{ message: "Registry unreachable", onRetry: () => {} }}
      />
      <StatCard
        label="Quota"
        value="64%"
        icon="Database"
        progress={64}
        progressType="bar"
        progressLabel="Used"
      />
    </div>
  );
}
`,be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(V,{name:"Stat Tiles",description:"The metric-tile family, all built on StatCard. Every tile inherits StatCardProps in full — variant, tone, size, padding, corner, decoration, label and value tone and scale, progress, loader, trend, meta, footer — and adds one thing of its own: a breakdown, rings, a donut, a chart, an ECG trace. Pick the variant in the playground; the controls below it are the base card's, shared with that page."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(w,{title:"The family",description:"Six variants under one set of base props. They share StatCard's surface, header, trend and states, so a dashboard mixing them stays consistent.",code:le,filename:"Family.tsx",children:e.jsx(ne,{})}),e.jsx(w,{title:"Loading, error and progress",description:"All three come from the base card, so they behave identically on a tile whose body is a chart. The retry is a real Button and the bar a real Progress with an accessible name — previously a hardcoded-blue anchor-like button and two roleless divs.",code:re,filename:"States.tsx",children:e.jsx(se,{})})]})]});export{be as StatTilePage,be as default};
