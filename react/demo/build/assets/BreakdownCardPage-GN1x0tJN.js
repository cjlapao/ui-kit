import{r as a,j as e,h1 as o}from"./index-ChbzYKtA.js";import{P as C}from"./PageHeader-CORco2N-.js";import{E as x}from"./ExampleCard-Db5NXgWv.js";import{S as V}from"./SurfaceToneControl-BpIV0XpL.js";import{P,C as B,S as s,T as n}from"./PlaygroundPanel-CZxrTOj5.js";import{C as N}from"./ControlAccordion-DoyyLWlc.js";import{s as T,p as $}from"./options-C-rzDbtC.js";const L={spend:{caption:"Q3 — all regions",items:[{id:"compute",label:"Compute",value:42800,displayValue:"$42.8k",tone:"blue"},{id:"storage",label:"Storage",value:18400,displayValue:"$18.4k",tone:"sky"},{id:"network",label:"Network",value:9100,displayValue:"$9.1k",tone:"teal"},{id:"support",label:"Support",value:4600,displayValue:"$4.6k",tone:"cyan"}]},leads:{caption:"rolling 30 days",items:[{id:"organic",label:"Organic search",value:1240,tone:"emerald"},{id:"referral",label:"Referrals",value:731,tone:"lime"},{id:"social",label:"Social",value:402,tone:"violet"},{id:"paid",label:"Paid",value:265,tone:"amber"}]},empty:{caption:"nothing booked yet",items:[{id:"free",label:"Free tier",value:0,tone:"neutral"}]}},O=[{value:"",label:"Auto"},{value:"solid",label:"Solid"},{value:"soft",label:"Soft"},{value:"outline",label:"Outline"},{value:"ghost",label:"Ghost"},{value:"link",label:"Link"}],A=[{value:"spend",label:"Spend"},{value:"leads",label:"Leads"},{value:"empty",label:"Empty"}],E=()=>{const[t,v]=a.useState("spend"),[r,b]=a.useState("none"),[i,g]=a.useState("outlined"),[d,f]=a.useState("md"),[c,w]=a.useState(!0),[u,k]=a.useState(!0),[p,j]=a.useState(!1),[h,y]=a.useState(""),{caption:S,items:m}=L[t];return e.jsx(P,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(N,{groups:[{id:"data",title:"Data",controls:e.jsx(B,{label:"Preset",options:A,value:t,onChange:v})},{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(V,{value:r,onChange:b}),e.jsx(s,{label:"Variant",options:T,value:i,onChange:l=>g(l)}),e.jsx(s,{label:"Padding",options:$,value:d,onChange:l=>f(l)})]})},{id:"parts",title:"Parts",controls:e.jsxs(e.Fragment,{children:[e.jsx(n,{label:"stats strip",checked:c,onChange:w}),e.jsx(n,{label:"cta",checked:u,onChange:k}),e.jsx(n,{label:"loading",checked:p,onChange:j}),e.jsx(s,{label:"CTA variant",options:O,value:h,onChange:y})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Shares are computed from the values, never passed in — an"," ",e.jsx("code",{children:"0"}),"-total preset shows why: the rows fall back to dashes."]})]}),preview:e.jsx("div",{className:"mx-auto w-full max-w-xl",children:e.jsx(o,{tone:r,title:t==="leads"?"Leads by source":"Cloud spend by service",caption:S,items:m,variant:i,padding:d,stats:c?[{label:"Total",value:"Σ"},{label:"Parts",value:String(m.length)}]:[],loading:p,ctaLabel:u?"See the whole story":"",ctaVariant:h||void 0})})})},R=[{id:"compute",label:"Compute",value:42800,displayValue:"$42.8k",tone:"blue"},{id:"storage",label:"Storage",value:18400,displayValue:"$18.4k",tone:"sky"},{id:"network",label:"Network",value:9100,displayValue:"$9.1k",tone:"teal"},{id:"support",label:"Support",value:4600,displayValue:"$4.6k",tone:"cyan"},{id:"other",label:"Other",value:2100,displayValue:"$2.1k",tone:"slate"}];function _(){return e.jsx("div",{className:"mx-auto w-full max-w-2xl",children:e.jsx(o,{title:"Cloud spend by service",caption:"Q3 — all regions",items:R,stats:[{label:"Total",value:"$77.0k"},{label:"Budget",value:"$80.0k"},{label:"Trend",value:"+6.2%"}],ctaLabel:"Open cost explorer"})})}const I=`import { BreakdownCard, type BreakdownItem } from "@cjlapao/ui-kit";

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
`;function Q(){return e.jsx("div",{className:"mx-auto w-full max-w-md",children:e.jsx(o,{title:"Leads by source",caption:"rolling 30 days",items:[{id:"organic",label:"Organic search",value:1240,tone:"emerald"},{id:"referral",label:"Referrals",value:731,tone:"lime"},{id:"social",label:"Social",value:402,displayValue:"402 ✨",tone:"violet"},{id:"paid",label:"Paid",value:265,tone:"amber"}],stats:[{label:"Best week",value:"Aug 12"}]})})}const F=`import { BreakdownCard } from "@cjlapao/ui-kit";

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
`,J=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(C,{name:"Breakdown Card",description:"A whole split into parts: a donut for how much, labelled rows for of what, and a summary strip for so what — one card for the question where did it all go. Shares are computed from the values, so the numbers can never disagree with the picture."}),e.jsx(E,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"Budget Split",description:"Quarterly cloud spend — donut for the shape, rows for the detail, strip for the totals.",code:I,filename:"BudgetSplit.tsx",children:e.jsx(_,{})}),e.jsx(x,{title:"Leads By Source",description:"Where displayValue earns its keep: values feed the donut, formatted strings feed the rows.",code:F,filename:"LeadsBySource.tsx",children:e.jsx(Q,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"title"}),", ",e.jsx("code",{children:"caption"}),", ",e.jsx("code",{children:"items"})," ","(",e.jsx("code",{children:"{ id, label, value, displayValue?, tone? }"}),"),"," ",e.jsx("code",{children:"stats"})," (",e.jsx("code",{children:"{ label, value }[]"}),"),"," ",e.jsx("code",{children:"ctaLabel"})," with ",e.jsx("code",{children:"onCta"})," (React; the"," ",e.jsx("code",{children:"cta"})," event in Vue) plus ",e.jsx("code",{children:"ctaVariant"})," (follows the card's own variant unless pinned) and ",e.jsx("code",{children:"loading"})," (the card's own shape in placeholder ink while the numbers are in flight), and the usual card surface —"," ",e.jsx("code",{children:"variant"}),", ",e.jsx("code",{children:"tone"}),", ",e.jsx("code",{children:"padding"}),","," ",e.jsx("code",{children:"corner"}),"; everything else lands on the card. Each item's"," ",e.jsx("code",{children:"tone"})," paints its slice and its legend dot — the kit's TrueColors, no raw hex anywhere. The donut renders through the kit's own ",e.jsx("code",{children:"Chart.Pie"})," (a native SVG donut in the Vue kit), so slice hover — the pop-out the engine's ",e.jsx("code",{children:"Chart.Hover"})," ","drives — theming and animation are the chart's; the Vue kit's native donut mirrors the same 150ms radial pop. A total of ",e.jsx("code",{children:"0"})," is a first-class state: an empty ring and dashes instead of shares."]})})]})]});export{J as BreakdownCardPage,J as default};
