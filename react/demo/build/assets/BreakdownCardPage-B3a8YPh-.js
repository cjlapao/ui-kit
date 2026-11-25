import{r as a,j as e,hC as o}from"./index-CQwZVYnB.js";import{P}from"./PageHeader-BhZxEVHt.js";import{E as v}from"./ExampleCard-BZsKA5_g.js";import{S as B}from"./SurfaceToneControl-LH37fS9y.js";import{P as N,C as T,S as n,T as t}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as $}from"./ControlAccordion-C7vC6faF.js";import{s as L,p as O}from"./options-Byh1yOHz.js";const A={spend:{caption:"Q3 — all regions",items:[{id:"compute",label:"Compute",value:42800,displayValue:"$42.8k",tone:"blue"},{id:"storage",label:"Storage",value:18400,displayValue:"$18.4k",tone:"sky"},{id:"network",label:"Network",value:9100,displayValue:"$9.1k",tone:"teal"},{id:"support",label:"Support",value:4600,displayValue:"$4.6k",tone:"cyan"}]},leads:{caption:"rolling 30 days",items:[{id:"organic",label:"Organic search",value:1240,tone:"emerald"},{id:"referral",label:"Referrals",value:731,tone:"lime"},{id:"social",label:"Social",value:402,tone:"violet"},{id:"paid",label:"Paid",value:265,tone:"amber"}]},empty:{caption:"nothing booked yet",items:[{id:"free",label:"Free tier",value:0,tone:"neutral"}]}},E=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],R=[{value:"spend",label:"Spend"},{value:"leads",label:"Leads"},{value:"empty",label:"Empty"}],_=()=>{const[l,b]=a.useState("spend"),[r,f]=a.useState("none"),[i,g]=a.useState("outlined"),[d,k]=a.useState("md"),[c,w]=a.useState(!1),[u,j]=a.useState(!0),[p,y]=a.useState(!0),[h,S]=a.useState(!1),[m,C]=a.useState(""),{caption:V,items:x}=A[l];return e.jsx(N,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx($,{groups:[{id:"data",title:"Data",controls:e.jsx(T,{label:"Preset",options:R,value:l,onChange:b})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(B,{value:r,onChange:f}),e.jsx(n,{label:"Variant",options:L,value:i,onChange:s=>g(s)}),e.jsx(n,{label:"Padding",options:O,value:d,onChange:s=>k(s)}),e.jsx(t,{label:"Raised surface",checked:c,onChange:w})]})},{id:"parts",title:"Parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(t,{label:"stats strip",checked:u,onChange:j}),e.jsx(t,{label:"cta",checked:p,onChange:y}),e.jsx(t,{label:"loading",checked:h,onChange:S}),e.jsx(n,{label:"CTA variant",options:E,value:m,onChange:C})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Shares are computed from the values, never passed in — an"," ",e.jsx("code",{children:"0"}),"-total preset shows why: the rows fall back to dashes."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(o,{tone:r,title:l==="leads"?"Leads by source":"Cloud spend by service",caption:V,items:x,variant:i,padding:d,raisedSurface:c,stats:u?[{label:"Total",value:"Σ"},{label:"Parts",value:String(x.length)}]:[],loading:h,ctaLabel:p?"See the whole story":"",ctaVariant:m||void 0})})})},I=[{id:"compute",label:"Compute",value:42800,displayValue:"$42.8k",tone:"blue"},{id:"storage",label:"Storage",value:18400,displayValue:"$18.4k",tone:"sky"},{id:"network",label:"Network",value:9100,displayValue:"$9.1k",tone:"teal"},{id:"support",label:"Support",value:4600,displayValue:"$4.6k",tone:"cyan"},{id:"other",label:"Other",value:2100,displayValue:"$2.1k",tone:"slate"}];function Q(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(o,{title:"Cloud spend by service",caption:"Q3 — all regions",items:I,stats:[{label:"Total",value:"$77.0k"},{label:"Budget",value:"$80.0k"},{label:"Trend",value:"+6.2%"}],ctaLabel:"Open cost explorer"})})}const F=`import { BreakdownCard, type BreakdownItem } from "@cjlapao/ui-kit";

const items: BreakdownItem[] = [
  { id: "compute", label: "Compute", value: 42_800, displayValue: "$42.8k", tone: "blue" },
  { id: "storage", label: "Storage", value: 18_400, displayValue: "$18.4k", tone: "sky" },
  { id: "network", label: "Network", value: 9_100, displayValue: "$9.1k", tone: "teal" },
  { id: "support", label: "Support", value: 4_600, displayValue: "$4.6k", tone: "cyan" },
  { id: "other", label: "Other", value: 2_100, displayValue: "$2.1k", tone: "slate" },
];

/**
 * A quarter of cloud spend, sliced by what it bought: the donut for the
 * shape of it, the rows for the detail, the strip for the totals that
 * outlive the filter.
 */
export default function BudgetSplit() {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <BreakdownCard
        title="Cloud spend by service"
        caption="Q3 — all regions"
        items={items}
        stats={[
          { label: "Total", value: "$77.0k" },
          { label: "Budget", value: "$80.0k" },
          { label: "Trend", value: "+6.2%" },
        ]}
        ctaLabel="Open cost explorer"
      />
    </div>
  );
}
`;function q(){return e.jsx("div",{className:"mx-auto w-full max-w-md",children:e.jsx(o,{title:"Leads by source",caption:"rolling 30 days",items:[{id:"organic",label:"Organic search",value:1240,tone:"emerald"},{id:"referral",label:"Referrals",value:731,tone:"lime"},{id:"social",label:"Social",value:402,displayValue:"402 ✨",tone:"violet"},{id:"paid",label:"Paid",value:265,tone:"amber"}],stats:[{label:"Best week",value:"Aug 12"}]})})}const G=`import { BreakdownCard } from "@cjlapao/ui-kit";

/**
 * Marketing leads by source — where \`displayValue\` earns its keep: the
 * values feed the donut, the formatted strings feed the rows.
 */
export default function LeadsBySource() {
  return (
    <div className="mx-auto w-full max-w-md">
      <BreakdownCard
        title="Leads by source"
        caption="rolling 30 days"
        items={[
          { id: "organic", label: "Organic search", value: 1240, tone: "emerald" },
          { id: "referral", label: "Referrals", value: 731, tone: "lime" },
          { id: "social", label: "Social", value: 402, displayValue: "402 ✨", tone: "violet" },
          { id: "paid", label: "Paid", value: 265, tone: "amber" },
        ]}
        stats={[{ label: "Best week", value: "Aug 12" }]}
      />
    </div>
  );
}
`,U=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"Breakdown Card",description:"A whole split into parts: a donut for how much, labelled rows for of what, and a summary strip for so what — one card for the question where did it all go. Shares are computed from the values, so the numbers can never disagree with the picture."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(v,{title:"Budget Split",description:"Quarterly cloud spend — donut for the shape, rows for the detail, strip for the totals.",code:F,filename:"BudgetSplit.tsx",children:e.jsx(Q,{})}),e.jsx(v,{title:"Leads By Source",description:"Where displayValue earns its keep: values feed the donut, formatted strings feed the rows.",code:G,filename:"LeadsBySource.tsx",children:e.jsx(q,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"caption"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, label, value, displayValue?, tone? }"}),"),"," ",e.jsx("code",{children:"stats"})," (",e.jsx("code",{children:"{ label, value }[]"}),"),"," ",e.jsx("code",{children:"ctaLabel"})," with ",e.jsx("code",{children:"onCta"})," (React; the"," ",e.jsx("code",{children:"cta"})," event in Vue) plus ",e.jsx("code",{children:"ctaVariant"})," (follows the card's own variant unless pinned) and ",e.jsx("code",{children:"loading"})," (the card's own shape in placeholder ink while the numbers are in flight), and the usual card surface —"," ",e.jsx("code",{children:"variant"}),", ",e.jsx("code",{children:"tone"}),", ",e.jsx("code",{children:"padding"}),","," ",e.jsx("code",{children:"corner"}),", plus ",e.jsx("code",{children:"raisedSurface"})," (forces the first nested-panels depth step — the tinted-card-on-matching- background fix); everything else lands on the card. Each item's"," ",e.jsx("code",{children:"tone"})," paints its slice and its legend dot — the kit's TrueColors, no raw hex anywhere. The donut renders through the kit's own ",e.jsx("code",{children:"Chart.Pie"})," (a native SVG donut in the Vue kit), so slice hover — the pop-out the engine's ",e.jsx("code",{children:"Chart.Hover"})," ","drives — theming and animation are the chart's; the Vue kit's native donut mirrors the same 150ms radial pop. A total of ",e.jsx("code",{children:"0"})," is a first-class state: an empty ring and dashes instead of shares."]})})]})]});export{U as BreakdownCardPage,U as default};
