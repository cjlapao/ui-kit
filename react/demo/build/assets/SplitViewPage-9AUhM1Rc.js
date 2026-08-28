import{r as t,j as e,bB as r,bC as C,v as T,f as D}from"./index-Bw7SVFgV.js";import{P as H}from"./PageHeader-CQm-NnZo.js";import{E as c}from"./ExampleCard-BR4461qP.js";import{P as B,a as i,C as h,T as l}from"./PlaygroundPanel-efOYSasM.js";import{C as F}from"./ControlAccordion-BDKCdIsF.js";import{d as U,t as N,x as $,n as q}from"./options-CREM8uYu.js";const J=q.filter(a=>["sm","md","lg"].includes(a.value)),u=({names:a,tone:s})=>e.jsx("ul",{className:"space-y-1 py-2 pl-9 pr-4",children:a.map(o=>e.jsxs("li",{className:"flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{className:"truncate",children:o}),e.jsx(T,{size:"sm",tone:s,variant:"soft",children:"ready"})]},o))}),K=()=>{const[a,s]=t.useState("blue"),[o,E]=t.useState("subtle"),[m,I]=t.useState("neutral"),[g,V]=t.useState(""),[b,P]=t.useState("md"),[p,L]=t.useState("skeleton"),[w,A]=t.useState(!0),[f,W]=t.useState(!1),[v,R]=t.useState(!1),[j,z]=t.useState(!1),[y,_]=t.useState(!0),[d,M]=t.useState(!0),[k,O]=t.useState(!1),G=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Gateway detail"}),subContent:d?e.jsx(u,{names:["gateway-7f4c","gateway-9d21"],tone:a}):void 0},{id:"b",label:"worker-pool",subtitle:"us-east-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Worker detail"}),subContent:d?e.jsx(u,{names:["worker-01","worker-02","worker-03"],tone:a}):void 0},{id:"c",label:"batch-runner",subtitle:"ap-south-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Batch detail"}),highlight:!0,subContent:d?e.jsx(u,{names:["batch-nightly"],tone:a}):void 0}];return e.jsx(B,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(F,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:U,value:o,onChange:n=>E(n)}),e.jsx(i,{label:"Accent tone",options:N,value:a,onChange:n=>s(n)}),e.jsx(i,{label:"Surface tone",options:N,value:m,onChange:n=>I(n)}),e.jsx(i,{label:"Size",options:J,value:b,onChange:P})]})},{id:"search",title:"Search",controls:e.jsx(i,{label:"Search variant",options:[{label:"(follows surface)",value:""},...$],value:g,onChange:V})},{id:"loader",title:"Loader",controls:e.jsx(i,{label:"Loader",options:C.map(n=>({label:n,value:n})),value:p,onChange:n=>L(n)})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Layout",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Collapsible",checked:w,onChange:A}),e.jsx(l,{label:"Resizable",checked:f,onChange:W})]})}),e.jsx(h,{label:"Rows",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Sub-items",checked:d,onChange:M}),e.jsx(l,{label:"Expand on select",checked:k,onChange:O}),e.jsx(l,{label:"New-item indicator",checked:y,onChange:_})]})})]})},{id:"states",title:"States",controls:e.jsx(h,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Loading",checked:v,onChange:R}),e.jsx(l,{label:"Error",checked:j,onChange:z})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Accent tone"})," drives the active row, the resizer and the search field; ",e.jsx("strong",{children:"surface tone"})," tints the panes and stays neutral by default — an accent that matches its own background has nothing to stand out against. The surface comes from the same family as ",e.jsx("code",{children:"Panel"}),", and the search field follows it unless you override it — try"," ",e.jsx("strong",{children:"glass"}),". Turn ",e.jsx("strong",{children:"Expand on select"})," off and a caret appears on rows that have sub-items, so a row can open in place instead of only filling the pane."," ",e.jsx("strong",{children:"New-item indicator"})," drops the pulsing dot on"," ",e.jsx("code",{children:"highlight"})," rows while keeping their accent tint."]})]}),preview:e.jsx("div",{className:"h-96 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:e.jsx(r,{items:G,tone:a,surfaceTone:m,variant:o,searchVariant:g||void 0,size:b,listTitle:"Capsules",collapsible:w,resizable:f,autoExpand:k,showHighlightIndicator:y,loading:v,loaderType:p,loadingProgress:p==="progress"?62:void 0,error:j?"Could not reach the registry":void 0,onRetry:()=>{}})})})};function Q(){const a=[{id:"a",label:"Selected",subtitle:"the active row",panel:e.jsx("div",{className:"p-4 text-sm",children:"Detail"})},{id:"b",label:"Another",subtitle:"not selected",panel:e.jsx("div",{className:"p-4 text-sm",children:"Detail"})}];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["stone","neutral","violet","emerald"].map(s=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wide opacity-60",children:s}),e.jsx("div",{className:"h-44 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:e.jsx(r,{items:a,color:s})})]},s))})}const X=`import { SplitView } from "@cjlapao/ui-kit";

/**
 * The active row's fill, left border, label and subtitle all come from tokens
 * generated off \`TRUE_COLORS\`.
 *
 * The literal map this replaced pointed **both** \`neutral\` and \`stone\` at one
 * shared object, so \`stone\` silently rendered neutral — and because the
 * literals were also what Tailwind scanned, \`border-l-stone-600\` had never
 * been emitted at all.
 */
export default function Tones() {
  const items = [
    { id: "a", label: "Selected", subtitle: "the active row", panel: <div className="p-4 text-sm">Detail</div> },
    { id: "b", label: "Another", subtitle: "not selected", panel: <div className="p-4 text-sm">Detail</div> },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["stone", "neutral", "violet", "emerald"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">{color}</span>
          <div className="h-44 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <SplitView items={items} color={color} />
          </div>
        </div>
      ))}
    </div>
  );
}
`,Y=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway detail"})},{id:"b",label:"worker-pool",subtitle:"us-east-1",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker detail"})}];function Z(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:D.map(a=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:a}),e.jsx("div",{className:"h-56 overflow-hidden rounded-lg",children:e.jsx(r,{items:Y,variant:a,tone:"blue",listTitle:"Capsules"})})]},a))})}const ee=`import { SplitView, SPLIT_VIEW_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "eu-west-1", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div> },
  { id: "b", label: "worker-pool", subtitle: "us-east-1", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div> },
];

/**
 * The surface family, shared with \`Panel\`.
 *
 * The list pane is differentiated by a *translucent tint* rather than a fill,
 * so it composites over whatever the variant paints — a glass SplitView keeps
 * its backdrop on both halves. It used to be a hardcoded
 * \`bg-gray-50/80 dark:bg-gray-900/80\` list beside a \`bg-white\` detail pane, the
 * latter with no dark-mode partner at all.
 *
 * The built-in search follows the surface: glass on glass, ghost on subtle,
 * elevated on elevated. \`searchVariant\` overrides it.
 *
 * \`tone\` is the *accent* — the active row, the resizer, the search field.
 * \`surfaceTone\` tints the panes and stays \`neutral\` unless you ask, because an
 * accent that matches its own background has nothing to stand out against.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {SPLIT_VIEW_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <div className="h-56 overflow-hidden rounded-lg">
            <SplitView items={ITEMS} variant={variant} tone="blue" listTitle="Capsules" />
          </div>
        </div>
      ))}
    </div>
  );
}
`,x=a=>e.jsx("ul",{className:"space-y-1 py-2 pl-9 pr-4",children:a.map(s=>e.jsxs("li",{className:"flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{className:"truncate",children:s}),e.jsx(T,{size:"sm",tone:"emerald",variant:"soft",children:"ready"})]},s))}),S=[{id:"a",label:"api-gateway",subtitle:"2 replicas",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway detail"}),subContent:x(["gateway-7f4c","gateway-9d21"])},{id:"b",label:"worker-pool",subtitle:"3 replicas",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker detail"}),subContent:x(["worker-01","worker-02","worker-03"])},{id:"c",label:"batch-runner",subtitle:"1 replica",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Batch detail"}),highlight:!0,subContent:x(["batch-nightly"])}];function ae(){return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"autoExpand — selecting opens the sub-items"}),e.jsx("div",{className:"h-72 overflow-hidden rounded-lg",children:e.jsx(r,{items:S,listTitle:"Capsules",tone:"blue"})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"autoExpand=false — a caret drills in, no dot"}),e.jsx("div",{className:"h-72 overflow-hidden rounded-lg",children:e.jsx(r,{items:S,listTitle:"Capsules",tone:"violet",autoExpand:!1,showHighlightIndicator:!1})})]})]})}const te=`import { SplitView, Pill } from "@cjlapao/ui-kit";

const replicas = (names: string[]) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li key={name} className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300">
        <span className="truncate">{name}</span>
        <Pill size="sm" tone="emerald" variant="soft">ready</Pill>
      </li>
    ))}
  </ul>
);

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "2 replicas", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div>,
    subContent: replicas(["gateway-7f4c", "gateway-9d21"]) },
  { id: "b", label: "worker-pool", subtitle: "3 replicas", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div>,
    subContent: replicas(["worker-01", "worker-02", "worker-03"]) },
  { id: "c", label: "batch-runner", subtitle: "1 replica", icon: "Container" as const,
    panel: <div className="p-4 text-sm">Batch detail</div>,
    highlight: true,
    subContent: replicas(["batch-nightly"]) },
];

/**
 * \`subContent\` puts a nested list under a row, so the row can expand in place
 * rather than only filling the detail pane.
 *
 * With \`autoExpand\` (the default) the active row's sub-items open as part of
 * selecting it. With \`autoExpand={false}\` a caret appears on rows that have
 * sub-items and selection and expansion become separate gestures — click to
 * look at the pane, click the caret to drill in.
 *
 * The third row also carries \`highlight\`, which tints it and adds a pulsing
 * dot. \`showHighlightIndicator={false}\` keeps the tint and drops the dot.
 */
export default function SubItems() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          autoExpand — selecting opens the sub-items
        </span>
        <div className="h-72 overflow-hidden rounded-lg">
          <SplitView items={ITEMS} listTitle="Capsules" tone="blue" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          autoExpand=false — a caret drills in, no dot
        </span>
        <div className="h-72 overflow-hidden rounded-lg">
          <SplitView
            items={ITEMS}
            listTitle="Capsules"
            tone="violet"
            autoExpand={false}
            showHighlightIndicator={false}
          />
        </div>
      </div>
    </div>
  );
}
`,se=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway"})},{id:"b",label:"worker-pool",subtitle:"us-east-1",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker"})}];function ne(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-3",children:C.map(a=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:a}),e.jsx("div",{className:"h-64 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:e.jsx(r,{items:se,listTitle:"Capsules",loading:!0,loaderType:a,loadingProgress:62})})]},a))})}const le=`import { SplitView, SPLIT_VIEW_LOADERS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "eu-west-1", panel: <div className="p-4 text-sm">Gateway</div> },
  { id: "b", label: "worker-pool", subtitle: "us-east-1", panel: <div className="p-4 text-sm">Worker</div> },
];

/**
 * The kit's three loader treatments, \`skeleton\` by default.
 *
 * The skeleton is shaped like the two panes, so the list keeps its width and
 * the layout does not jump when the data lands. The spinner and progress types
 * cover the view instead, which is right when the previous content should stay
 * readable underneath.
 */
export default function Loaders() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3">
      {SPLIT_VIEW_LOADERS.map((loaderType) => (
        <div key={loaderType} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{loaderType}</span>
          <div className="h-64 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <SplitView
              items={ITEMS}
              listTitle="Capsules"
              loading
              loaderType={loaderType}
              loadingProgress={62}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
`,he=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(H,{name:"Split View",description:"A searchable list beside a detail pane, optionally collapsible and drag-resizable. It takes the same surface family as Panel, the built-in search follows that surface, and rows can carry sub-items that expand in place. With a single visible item it drops the list entirely and shows the detail alone."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Variants",description:"The Panel surface family. The list pane is tinted translucently rather than filled, so it composites over the variant instead of replacing it — the detail pane used to be a bare bg-white with no dark-mode partner.",code:ee,filename:"Variants.tsx",children:e.jsx(Z,{})}),e.jsx(c,{title:"Sub-items and the new-item dot",description:"subContent expands a row in place. With autoExpand=false a caret separates selecting from drilling in, and showHighlightIndicator={false} keeps a highlighted row's tint while dropping its pulsing dot.",code:te,filename:"SubItems.tsx",children:e.jsx(ae,{})}),e.jsx(c,{title:"Loaders",description:"The three treatments, skeleton by default — shaped like the two panes so the list keeps its width and the layout does not jump when the data lands.",code:le,filename:"Loaders.tsx",children:e.jsx(ne,{})}),e.jsx(c,{title:"Tones",description:"Generated from the palette. The literal map aliased both neutral and stone to one object, so stone silently rendered neutral and border-l-stone-600 was never emitted.",code:X,filename:"Tones.tsx",children:e.jsx(Q,{})})]})]});export{he as SplitViewPage,he as default};
