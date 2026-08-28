import{r as t,j as e,bj as l,o as T}from"./index-8i9ZNynb.js";import{P as B}from"./PageHeader-CO5k_SQv.js";import{E as r}from"./ExampleCard-LdxcpmX_.js";import{P as O,S as i,C as F,T as s}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as A}from"./ControlAccordion-Bqp-1oBj.js";import{n as H}from"./options-yAU-f7tt.js";const k=["horizontal","vertical"].map(n=>({label:n,value:n})),G=["end","start"].map(n=>({label:n,value:n})),o=[{key:"running",label:"Running",value:12},{key:"paused",label:"Paused",value:4},{key:"stopped",label:"Stopped",value:3},{key:"failed",label:"Failed",value:1}],D=()=>{const[n,y]=t.useState("md"),[u,j]=t.useState(!1),[h,S]=t.useState(!0),[m,P]=t.useState(!0),[b,C]=t.useState(!1),[g,E]=t.useState("horizontal"),[x,M]=t.useState("end"),[p,z]=t.useState("horizontal"),[v,I]=t.useState(!1),[f,N]=t.useState(!1),[c,R]=t.useState("normal");return e.jsx(O,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(A,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Size",options:H,value:n,onChange:a=>y(a)}),e.jsx(i,{label:"Orientation",options:k,value:g,onChange:a=>E(a)}),e.jsx(i,{label:"Legend position",options:G,value:x,onChange:a=>M(a)}),e.jsx(i,{label:"Legend layout",options:k,value:p,onChange:a=>z(a)}),e.jsx(i,{label:"State",options:["normal","loading","error","empty"].map(a=>({label:a,value:a})),value:c,onChange:a=>R(a)})]})},{id:"content",title:"Content",controls:e.jsx(F,{label:"Content",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(s,{label:"Legend",checked:!u,onChange:a=>j(!a)}),e.jsx(s,{label:"Total label",checked:h,onChange:S}),e.jsx(s,{label:"Secondary label",checked:m,onChange:P}),e.jsx(s,{label:"Explicit tones",checked:b,onChange:C}),e.jsx(s,{label:"Percentages",checked:v,onChange:I}),e.jsx(s,{label:"Legend icons",checked:f,onChange:N})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Hover a segment for its value. The bar itself is"," ",e.jsx("code",{children:'role="img"'})," with a text alternative naming every slice — it used to have no role and no label, so the whole chart was invisible to a screen reader and its numbers lived only in that hover tooltip."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["This component absorbed ",e.jsx("code",{children:"MeterGroup"}),": the orientation, legend placement, icons, percentages and the loading / error / empty states all came from it. ",e.jsx("code",{children:"MeterGroup"})," is deprecated and no longer in the demo."]})]}),preview:e.jsx("div",{className:"w-full max-w-lg",children:e.jsx(l,{label:"Capsules",secondaryLabel:m?"across 3 regions":void 0,totalLabel:h?"20 total":void 0,max:20,size:n,orientation:g,height:200,labelPosition:x,labelOrientation:p,showPercent:v,showLabels:!u,loading:c==="loading",error:c==="error"?"Could not reach the registry":void 0,series:c==="empty"?[]:f?o.map((a,L)=>({...a,icon:["Rocket","Clock","Database","Error"][L]})):b?[{...o[0],tone:"emerald"},{...o[1],tone:"amber"},{...o[2],tone:"slate"},{...o[3],tone:"rose"}]:o})})})};function V(){return e.jsxs("div",{className:"flex w-full max-w-lg flex-col gap-8",children:[e.jsx(l,{label:"Auto-assigned from the palette",total:20,series:[{key:"a",label:"Running",value:12},{key:"b",label:"Paused",value:5},{key:"c",label:"Failed",value:3}]}),e.jsx(l,{label:"Explicit tones",total:20,series:[{key:"a",label:"Running",value:12,tone:"emerald"},{key:"b",label:"Paused",value:5,tone:"amber"},{key:"c",label:"Failed",value:3,tone:"rose"}]})]})}const W=`import { MultiProgressBar } from "@cjlapao/ui-kit";

/**
 * A series takes a \`tone\` from the shared palette. It used to take a raw
 * Tailwind class (\`color: "bg-rose-500"\`), which could not be dimmed or
 * safelisted with the rest; that prop still works but is deprecated.
 */
export default function Tones() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <MultiProgressBar
        label="Auto-assigned from the palette"
        total={20}
        series={[
          { key: "a", label: "Running", value: 12 },
          { key: "b", label: "Paused", value: 5 },
          { key: "c", label: "Failed", value: 3 },
        ]}
      />
      <MultiProgressBar
        label="Explicit tones"
        total={20}
        series={[
          { key: "a", label: "Running", value: 12, tone: "emerald" },
          { key: "b", label: "Paused", value: 5, tone: "amber" },
          { key: "c", label: "Failed", value: 3, tone: "rose" },
        ]}
      />
    </div>
  );
}
`;function Z(){return e.jsx("div",{className:"flex w-full max-w-lg flex-col gap-6",children:T.map(n=>e.jsx(l,{label:n,total:10,size:n,hideLegend:!0,series:[{key:"a",label:"A",value:5},{key:"b",label:"B",value:3},{key:"c",label:"C",value:2}]},n))})}const _=`import { CONTROL_SIZES, MultiProgressBar } from "@cjlapao/ui-kit";

/** The full shared control scale — the bar had no size prop at all before. */
export default function Sizes() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      {CONTROL_SIZES.map((size) => (
        <MultiProgressBar
          key={size}
          label={size}
          total={10}
          size={size}
          hideLegend
          series={[
            { key: "a", label: "A", value: 5 },
            { key: "b", label: "B", value: 3 },
            { key: "c", label: "C", value: 2 },
          ]}
        />
      ))}
    </div>
  );
}
`,d=[{key:"a",label:"Running",value:12},{key:"b",label:"Paused",value:5},{key:"c",label:"Failed",value:3}];function $(){return e.jsxs("div",{className:"flex w-full flex-wrap items-start gap-10",children:[e.jsx("div",{className:"w-64",children:e.jsx(l,{label:"Horizontal",max:20,series:d,showPercent:!0})}),e.jsx("div",{className:"w-64",children:e.jsx(l,{label:"Legend first",max:20,series:d,labelPosition:"start"})}),e.jsx(l,{label:"Vertical",max:20,series:d,orientation:"vertical",height:160,barSize:14,labelOrientation:"vertical",showPercent:!0})]})}const q=`import { MultiProgressBar } from "@cjlapao/ui-kit";

const SERIES = [
  { key: "a", label: "Running", value: 12 },
  { key: "b", label: "Paused", value: 5 },
  { key: "c", label: "Failed", value: 3 },
];

/**
 * Horizontal or vertical, with the legend before or after the bar. A vertical
 * bar puts its legend to the side; \`height\` sets the track length and
 * \`barSize\` its thickness.
 *
 * These came from \`MeterGroup\`, which this component absorbed.
 */
export default function Orientation() {
  return (
    <div className="flex w-full flex-wrap items-start gap-10">
      <div className="w-64">
        <MultiProgressBar label="Horizontal" max={20} series={SERIES} showPercent />
      </div>
      <div className="w-64">
        <MultiProgressBar
          label="Legend first"
          max={20}
          series={SERIES}
          labelPosition="start"
        />
      </div>
      <MultiProgressBar
        label="Vertical"
        max={20}
        series={SERIES}
        orientation="vertical"
        height={160}
        barSize={14}
        labelOrientation="vertical"
        showPercent
      />
    </div>
  );
}
`;function J(){return e.jsx("div",{className:"w-full max-w-lg",children:e.jsx(l,{label:"Storage",max:100,showPercent:!0,series:[{key:"img",label:"Images",value:42,tone:"violet",icon:"Image"},{key:"vol",label:"Volumes",value:28,tone:"sky",icon:"Database"},{key:"log",label:"Logs",value:12,tone:"amber",icon:"Details"}]})})}const K=`import { MultiProgressBar } from "@cjlapao/ui-kit";

/**
 * A series can carry an icon, shown in the legend instead of the colour dot —
 * useful when the tone alone does not say what the segment means. From
 * \`MeterGroup\`.
 */
export default function Icons() {
  return (
    <div className="w-full max-w-lg">
      <MultiProgressBar
        label="Storage"
        max={100}
        showPercent
        series={[
          { key: "img", label: "Images", value: 42, tone: "violet", icon: "Image" },
          { key: "vol", label: "Volumes", value: 28, tone: "sky", icon: "Database" },
          { key: "log", label: "Logs", value: 12, tone: "amber", icon: "Details" },
        ]}
      />
    </div>
  );
}
`,w=[{key:"a",label:"Running",value:12},{key:"b",label:"Failed",value:3}];function Q(){return e.jsxs("div",{className:"grid w-full gap-6 sm:grid-cols-3",children:[e.jsx(l,{label:"Loading",max:20,series:w,loading:!0}),e.jsx(l,{label:"Failed",max:20,series:w,error:"Could not reach the registry"}),e.jsx(l,{label:"Empty",max:20,series:[]})]})}const U=`import { MultiProgressBar } from "@cjlapao/ui-kit";

const SERIES = [
  { key: "a", label: "Running", value: 12 },
  { key: "b", label: "Failed", value: 3 },
];

/**
 * Loading, error and empty — all three came from \`MeterGroup\`. The skeleton is
 * shaped like the bar and its legend, so the block does not change height when
 * the data lands.
 */
export default function States() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      <MultiProgressBar label="Loading" max={20} series={SERIES} loading />
      <MultiProgressBar
        label="Failed"
        max={20}
        series={SERIES}
        error="Could not reach the registry"
      />
      <MultiProgressBar label="Empty" max={20} series={[]} />
    </div>
  );
}
`,le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Multi Progress Bar",description:"A stacked breakdown bar: one quantity split into labelled shares. Hovering a segment dims the others and follows the cursor with its value, and the meter publishes its range and names every slice, so the numbers are reachable without a pointer. This absorbed MeterGroup, which drew the same picture without the hover behaviour."}),e.jsx(D,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Tones",description:"A series takes a `tone` from the shared palette, or is auto-assigned from it. It used to take a raw Tailwind class, which could not be dimmed or safelisted with the rest.",code:W,filename:"Tones.tsx",children:e.jsx(V,{})}),e.jsx(r,{title:"Sizes",description:"The full shared control scale. The bar had no size prop at all — its track was pinned at `h-2.5`.",code:_,filename:"Sizes.tsx",children:e.jsx(Z,{})}),e.jsx(r,{title:"Orientation and legend placement",description:"Horizontal or vertical, legend before or after the bar and laid out as a row or a column. `height` sets a vertical track's length, `barSize` its thickness. All from MeterGroup.",code:q,filename:"Orientation.tsx",children:e.jsx($,{})}),e.jsx(r,{title:"Icons in the legend",description:"A series can carry an icon shown instead of the colour dot, for when the tone alone does not say what the segment means.",code:K,filename:"Icons.tsx",children:e.jsx(J,{})}),e.jsx(r,{title:"Loading, error and empty",description:"The skeleton is shaped like the bar and its legend, so the block does not change height when the data lands.",code:U,filename:"States.tsx",children:e.jsx(Q,{})})]})]});export{le as MultiProgressBarPage,le as default};
