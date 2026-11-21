import{j as e,v as p,r as i,bi as o}from"./index-ChbzYKtA.js";import{P as w}from"./PageHeader-CORco2N-.js";import{E as g}from"./ExampleCard-Db5NXgWv.js";import{P as f}from"./A11ySections-Ci0MCORB.js";import{P as v,a as b,S as h,T as j}from"./PlaygroundPanel-CZxrTOj5.js";import{c as N}from"./options-C-rzDbtC.js";const x={xs:"gap-1",sm:"gap-2",md:"gap-3",lg:"gap-4",xl:"gap-6"},y={start:"items-start",center:"items-center",end:"items-end"};function u({children:t,actions:n,gap:a="md",align:c="start",contentClassName:l,actionsClassName:d,className:r,...m}){const s=n!=null&&typeof n!="boolean";return e.jsxs("div",{...m,"data-slot":"content-actions",className:p("flex min-w-0 flex-nowrap",y[c],x[a],r),children:[e.jsx("div",{"data-slot":"content-actions-content",className:p("min-w-0 flex-1",l),children:t}),s&&e.jsx("div",{"data-slot":"content-actions-actions",className:p("flex min-w-0 flex-initial flex-nowrap items-center overflow-x-auto [&>*]:shrink-0",x[a],d),children:n})]})}function C(){const[t,n]=i.useState(560),[a,c]=i.useState("md"),[l,d]=i.useState("start"),[r,m]=i.useState(!0);return e.jsx(v,{controls:e.jsxs("div",{className:"space-y-4",children:[e.jsx(b,{label:`Available width — ${t}px`,children:e.jsx("input",{"aria-label":"Preview width",type:"range",min:160,max:900,step:10,value:t,onChange:s=>n(Number(s.target.value)),className:"w-full accent-blue-500"})}),e.jsx(h,{label:"Gap",options:N,value:a,onChange:s=>c(s)}),e.jsx(h,{label:"Vertical alignment",options:[{value:"start",label:"Start"},{value:"center",label:"Center"},{value:"end",label:"End"}],value:l,onChange:s=>d(s)}),e.jsx(j,{label:"Show actions",checked:r,onChange:m}),e.jsx("p",{className:"text-xs opacity-70",children:"Hover the buttons to expand their labels. Content yields width while actions stay on one row."})]}),preview:e.jsx("div",{className:"w-full min-w-0",children:e.jsx("div",{"data-slot":"content-actions-playground",className:"max-w-full min-w-0 resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700",style:{width:t,minWidth:160},children:e.jsxs(u,{gap:a,align:l,contentClassName:"overflow-hidden",actions:r?e.jsxs(e.Fragment,{children:[e.jsx(o,{icon:"Edit",label:"Edit agent",variant:"soft"}),e.jsx(o,{icon:"Copy",label:"Duplicate agent",variant:"soft"}),e.jsx(o,{icon:"Trash",label:"Delete agent",variant:"soft",color:"rose"})]}):void 0,children:[e.jsx("h3",{className:"truncate text-lg font-semibold",children:"Brainstormer"}),e.jsx("p",{className:"line-clamp-3 text-sm opacity-70",children:"Turns an idea into a reviewable plan. Expand the actions and watch this content adapt to the remaining space."})]})})})})}function A(){const[t,n]=i.useState(720);return e.jsxs("div",{className:"w-full min-w-0 space-y-4",children:[e.jsxs("label",{className:"flex items-center gap-3 text-sm",children:["Available width",e.jsx("input",{type:"range",min:120,max:900,value:t,onChange:a=>n(Number(a.target.value))}),e.jsxs("span",{children:[t,"px"]})]}),e.jsx("div",{"data-slot":"content-actions-demo",className:"max-w-full resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700",style:{width:t,minWidth:120},children:e.jsxs(u,{contentClassName:"overflow-hidden",actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{icon:"Edit",label:"Edit agent",variant:"soft"}),e.jsx(o,{icon:"Copy",label:"Duplicate agent",variant:"soft"}),e.jsx(o,{icon:"Trash",label:"Delete agent",variant:"soft",color:"rose"})]}),children:[e.jsx("h3",{className:"truncate text-lg font-semibold",children:"Brainstormer"}),e.jsx("p",{className:"line-clamp-3 text-sm opacity-70",children:"Turns an idea into a reviewable plan. Hover the actions: this text yields width while the buttons stay together on the same row."})]})})]})}const E=`import { useState } from "react";
import { ContentActions, ExpandableButton } from "@cjlapao/ui-kit";

export default function AgentHeader() {
  const [width, setWidth] = useState(720);
  return (
    <div className="w-full min-w-0 space-y-4">
      <label className="flex items-center gap-3 text-sm">
        Available width
        <input type="range" min={120} max={900} value={width} onChange={(event) => setWidth(Number(event.target.value))} />
        <span>{width}px</span>
      </label>
      <div
        data-slot="content-actions-demo"
        className="max-w-full resize-x overflow-hidden rounded-xl border border-neutral-300 p-4 dark:border-neutral-700"
        style={{ width, minWidth: 120 }}
      >
        <ContentActions
          contentClassName="overflow-hidden"
          actions={
            <>
              <ExpandableButton icon="Edit" label="Edit agent" variant="soft" />
              <ExpandableButton icon="Copy" label="Duplicate agent" variant="soft" />
              <ExpandableButton icon="Trash" label="Delete agent" variant="soft" color="rose" />
            </>
          }
        >
          <h3 className="truncate text-lg font-semibold">Brainstormer</h3>
          <p className="line-clamp-3 text-sm opacity-70">
            Turns an idea into a reviewable plan. Hover the actions: this text
            yields width while the buttons stay together on the same row.
          </p>
        </ContentActions>
      </div>
    </div>
  );
}
`;function W(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(w,{name:"Content Actions",description:"A neutral two-section layout. Content yields width as actions grow; actions stay on one row and scroll horizontally when space runs out."}),e.jsx(C,{}),e.jsx(g,{title:"Growing actions",description:"Adjust the width or drag the preview corner, then hover each action. The surrounding border belongs to this example; ContentActions adds no surface or padding.",code:E,filename:"AgentHeader.tsx",children:e.jsx(A,{})}),e.jsx("p",{className:"text-sm opacity-70",children:"React uses children and an actions prop. Vue uses the default slot and an actions slot. Use truncation on titles and normal wrapping on descriptions. In flex/grid parents, allow the parent to shrink with min-width: 0. At very narrow widths, Tab reaches clipped action buttons and scrolls them into view. Actions never move to another row."}),e.jsx(f,{props:[{name:"children / default slot",type:"ReactNode / slot",description:"Arbitrary content that fills the remaining width. Nested content owns truncation or wrapping."},{name:"actions / actions slot",type:"ReactNode / slot",description:"A single row of actions. Omitted when absent; direct children retain their intrinsic widths."},{name:"gap",type:"ControlSize",default:"md",description:"Spacing between regions and actions: xs, sm, md, lg or xl."},{name:"align",type:'"start" | "center" | "end"',default:"start",description:"Vertical alignment of content and actions."},{name:"contentClassName / actionsClassName",type:"string",description:"Class overrides for the content and action regions. Root className (Vue class), style and ordinary div attributes pass through."}]})]})}export{W as default};
