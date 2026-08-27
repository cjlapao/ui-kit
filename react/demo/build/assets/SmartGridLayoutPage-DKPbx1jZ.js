import{j as e,b4 as R,r as s,bx as d,f as w}from"./index-BBK6HA-D.js";import{P as L}from"./PageHeader-BcBcU29I.js";import{E as m}from"./ExampleCard-BVwGIEPO.js";import{P as O,C as D,b as o,a as I,T as l}from"./ControlAccordion-DallGojj.js";import{t as b,n as M}from"./options-D-FMIizr.js";const n=(t,r,i)=>function(){return e.jsx(R,{label:t,value:r,icon:i,variant:"elevated",className:"h-full"})},c=[{id:"capsules",title:"Active capsules",active:!0,single:!0,defaultSpan:3,render:n("Active capsules",128,"Rocket")},{id:"requests",title:"Requests",active:!0,single:!0,defaultSpan:3,render:n("Requests","1.2M/h","Database")},{id:"spend",title:"Spend",active:!0,single:!0,defaultSpan:3,render:n("Spend","$8.4k","Shop")},{id:"health",title:"Health",active:!0,single:!0,defaultSpan:3,render:n("Health","99.98%","HealthCheck")},{id:"errors",title:"Errors",active:!0,single:!0,defaultSpan:6,render:n("Errors",42,"Database")},{id:"latency",title:"Latency",active:!0,single:!0,defaultSpan:6,render:n("Latency","142ms","Database")}],H=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"],defaultHeightSpan:2},{itemIds:["spend","health"],defaultHeightSpan:2}]}],N=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests","spend","health"],defaultHeightSpan:2}]},{id:"detail",title:"Detail",rows:[{itemIds:["errors","latency"],defaultHeightSpan:2}]}],P=[4,6,8,12].map(t=>({label:String(t),value:String(t)})),_=()=>{const[t,r]=s.useState("subtle"),[i,p]=s.useState("blue"),[f,j]=s.useState("neutral"),[g,A]=s.useState("md"),[u,T]=s.useState("12"),[h,k]=s.useState(!1),[x,v]=s.useState(!1),[S,C]=s.useState(!1),[y,E]=s.useState(!1);return e.jsx(O,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:w.map(a=>({label:a,value:a})),value:t,onChange:a=>r(a)}),e.jsx(o,{label:"Edit accent",options:b,value:i,onChange:a=>p(a)}),e.jsx(o,{label:"Surface tone",options:b,value:f,onChange:a=>j(a)}),e.jsx(o,{label:"Size",options:M,value:g,onChange:a=>A(a)}),e.jsx(o,{label:"Columns",options:P,value:u,onChange:T})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(I,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Edit mode",checked:x,onChange:v}),e.jsx(l,{label:"Persist to localStorage",checked:h,onChange:k}),e.jsx(l,{label:"Read-only",checked:S,onChange:C}),e.jsx(l,{label:"Responsive columns",checked:y,onChange:E})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Turn on ",e.jsx("strong",{children:"Edit mode"})," and drag a tile, or focus a resize handle and use the left and right arrows — the handles were mouse-only before. ",e.jsx("strong",{children:"Persist"})," adds a"," ",e.jsx("code",{children:"storageKey"}),", which is the entire opt-in: the layout is restored on mount and saved after every change, exactly as"," ",e.jsx("code",{children:"Table"})," does it. ",e.jsx("strong",{children:"Edit accent"})," is separate from ",e.jsx("strong",{children:"surface tone"})," so the accent has something to stand out against."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(d,{items:c,defaultLayout:H,variant:t,tone:i,surfaceTone:f,size:g,maxColumns:y?{base:4,md:8,lg:Number(u)}:Number(u),readOnly:S,isEditMode:x,onEditModeChange:v,storageKey:h?"playground-dashboard":void 0},`${h}`)})})};function B(){return e.jsx(d,{items:c,defaultLayout:N,storageKey:"demo-dashboard",maxColumns:12})}const G=`import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * \`storageKey\` is the whole opt-in, exactly as on \`Table\`: the grid restores
 * its layout on mount and saves after every change, under
 * \`{storagePrefix}:{storageKey}\` — \`ui-kit:grid:demo-dashboard\` here.
 *
 * Writes are debounced, because column and row resizing update the layout on
 * every mousemove; an unthrottled save would serialise the whole dashboard
 * dozens of times a second. A pending write is flushed on unmount, so closing
 * the page does not lose the last change.
 *
 * Edit this layout, reload the page, and it comes back. **Reset layout**
 * clears the stored key and returns to the default the app shipped with.
 *
 * Pass \`persistedLayout\` as well and it wins: a caller holding the state is
 * the source of truth, and storage is the fallback beneath it.
 */
export default function Persistence() {
  return (
    <SmartGridLayout
      items={DASHBOARD_ITEMS}
      defaultLayout={DASHBOARD_LAYOUT}
      storageKey="demo-dashboard"
      maxColumns={12}
    />
  );
}
`,z=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"]}]}];function V(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:w.slice(0,4).map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:t}),e.jsx(d,{items:c,defaultLayout:z,variant:t,maxColumns:12,size:"sm"})]},t))})}const K=`import { SmartGridLayout, SMART_GRID_VARIANTS } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS } from "../shared";

const SMALL = [
  { id: "overview", title: "Overview", rows: [{ itemIds: ["capsules", "requests"] }] },
];

/**
 * The \`Panel\` surface family, plus the accent/surface split.
 *
 * \`tone\` is the *edit accent* — tile outlines, drop indicators, resize
 * handles. \`surfaceTone\` tints the dashboard itself and stays \`neutral\`
 * unless you ask, because an accent that matches its own background has
 * nothing to stand out against.
 *
 * The accent used to come from a hand-written map covering 10 tones out of
 * 21; the other eleven silently rendered blue.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      {SMART_GRID_VARIANTS.slice(0, 4).map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{variant}</span>
          <SmartGridLayout
            items={DASHBOARD_ITEMS}
            defaultLayout={SMALL}
            variant={variant}
            maxColumns={12}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
`,q=()=>{throw new Error("This tile's data source is unavailable")},U=[...c,{id:"broken",title:"Billing summary",active:!0,single:!0,defaultSpan:6,render:q}];function Y(){return e.jsx(d,{items:U,defaultLayout:[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","broken"],defaultHeightSpan:2}]}],maxColumns:12,readOnly:!0,onTileError:(t,r)=>console.warn(`[dashboard] ${r} failed:`,t.message)})}const $=`import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS } from "../shared";

const boom = () => {
  throw new Error("This tile's data source is unavailable");
};

const ITEMS = [
  ...DASHBOARD_ITEMS,
  {
    id: "broken",
    title: "Billing summary",
    active: true,
    single: true,
    defaultSpan: 6,
    render: boom,
  },
];

/**
 * Tiles are arbitrary consumer components. Without a boundary around each one,
 * a single throwing tile unmounts the whole dashboard — the user loses every
 * other tile, and the layout editor with them, because of one failed fetch.
 *
 * The fallback names the tile so the broken one is identifiable, and
 * \`onTileError\` reports it so the host can log it.
 */
export default function Resilience() {
  return (
    <SmartGridLayout
      items={ITEMS}
      defaultLayout={[
        {
          id: "overview",
          title: "Overview",
          rows: [{ itemIds: ["capsules", "broken"], defaultHeightSpan: 2 }],
        },
      ]}
      maxColumns={12}
      readOnly
      onTileError={(error, title) =>
        // eslint-disable-next-line no-console
        console.warn(\`[dashboard] \${title} failed:\`, error.message)
      }
    />
  );
}
`,Z=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Smart Grid Layout",description:"A dashboard builder: sections of rows, tiles dragged between them, columns and row heights resized in place, and a layout that saves itself. It takes the same surface family as Panel, the same tone and size scales as everything else, and the same storageKey persistence model as Table."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(m,{title:"Persistence",description:"storageKey is the whole opt-in. Edit the layout, reload the page, and it comes back. Reset layout clears the stored key and returns to the default.",code:G,filename:"Persistence.tsx",children:e.jsx(B,{})}),e.jsx(m,{title:"A failing tile is contained",description:"Each tile is wrapped in its own error boundary. One throwing tile shows a fallback naming itself; the rest of the dashboard keeps working, where before it would have taken the whole page down.",code:$,filename:"Resilience.tsx",children:e.jsx(Y,{})}),e.jsx(m,{title:"Variants and tones",description:"The Panel surface family, plus the split between the edit accent and the surface tone. The accent came from a hand-written map covering 10 tones out of 21; the other eleven silently rendered blue.",code:K,filename:"Variants.tsx",children:e.jsx(V,{})})]})]});export{Z as SmartGridLayoutPage,Z as default};
