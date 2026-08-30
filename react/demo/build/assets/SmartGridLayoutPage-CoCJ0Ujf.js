import{j as e,bb as O,r as a,bE as i,a3 as j,y as I}from"./index-p9Bv1Pn1.js";import{P as M}from"./PageHeader-DCZtzAyX.js";import{E as d}from"./ExampleCard-BS13YSEO.js";import{P as H,a as r,C as N,T as u}from"./PlaygroundPanel-BDClNSzf.js";import{C as _}from"./ControlAccordion-CydkdljU.js";import{t as A,n as B}from"./options-Bqu3_N-h.js";const o=(t,s,c)=>function(){return e.jsx(O,{label:t,value:s,icon:c,variant:"elevated",className:"h-full"})},l=[{id:"capsules",title:"Active capsules",active:!0,single:!0,defaultSpan:3,render:o("Active capsules",128,"Rocket")},{id:"requests",title:"Requests",active:!0,single:!0,defaultSpan:3,render:o("Requests","1.2M/h","Database")},{id:"spend",title:"Spend",active:!0,single:!0,defaultSpan:3,render:o("Spend","$8.4k","Shop")},{id:"health",title:"Health",active:!0,single:!0,defaultSpan:3,render:o("Health","99.98%","HealthCheck")},{id:"errors",title:"Errors",active:!0,single:!0,defaultSpan:6,render:o("Errors",42,"Database")},{id:"latency",title:"Latency",active:!0,single:!0,defaultSpan:6,render:o("Latency","142ms","Database")},{id:"queue",title:"Queue depth",active:!0,single:!0,defaultSpan:6,render:o("Queue depth",17,"Database")}],P=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"],defaultHeightSpan:2},{itemIds:["spend","health"],defaultHeightSpan:2}]}],g=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests","spend","health"],defaultHeightSpan:2}]},{id:"detail",title:"Detail",rows:[{itemIds:["errors","latency"],defaultHeightSpan:2}]}],z=[4,6,8,12].map(t=>({label:String(t),value:String(t)})),G=()=>{const[t,s]=a.useState("plain"),[c,p]=a.useState("blue"),[f,E]=a.useState("neutral"),[v,k]=a.useState(""),[b,T]=a.useState("md"),[h,C]=a.useState("12"),[m,D]=a.useState(!1),[w,x]=a.useState(!1),[y,R]=a.useState(!1),[S,L]=a.useState(!1);return e.jsx(H,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(_,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:j.map(n=>({label:n,value:n})),value:t,onChange:n=>s(n)}),e.jsx(r,{label:"Edit accent",options:A,value:c,onChange:n=>p(n)}),e.jsx(r,{label:"Surface tone",options:A,value:f,onChange:n=>E(n)}),e.jsx(r,{label:"Control variant",options:[{label:"(follows surface)",value:""},...I.map(n=>({label:n,value:n}))],value:v,onChange:k}),e.jsx(r,{label:"Size",options:B,value:b,onChange:n=>T(n)}),e.jsx(r,{label:"Columns",options:z,value:h,onChange:C})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(N,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(u,{label:"Edit mode",checked:w,onChange:x}),e.jsx(u,{label:"Persist to localStorage",checked:m,onChange:D}),e.jsx(u,{label:"Read-only",checked:y,onChange:R}),e.jsx(u,{label:"Responsive columns",checked:S,onChange:L})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Turn on ",e.jsx("strong",{children:"Edit mode"}),", then: press ",e.jsx("strong",{children:"Add Item"})," ","and drag an entry out of the palette onto the grid — it lands where the preview shows, and the panel stays open so adding several is one flow; drag a tile to move it, or onto the red zone in the top-left to remove it; drag a section by its ",e.jsx("code",{children:"⠿"})," handle (only shown when there is more than one); click a section title to rename it; focus a resize handle and use the left and right arrows. It is fully operable from the keyboard — tab to a tile, ",e.jsx("kbd",{children:"Enter"})," to lift it, arrows to move,",e.jsx("kbd",{children:"Enter"})," to place, ",e.jsx("kbd",{children:"Esc"})," to cancel — and every action is announced to a screen reader. ",e.jsx("strong",{children:"Control variant"})," gives the editing chrome a surface of its own — a ",e.jsx("code",{children:"plain"}),"dashboard over a photograph wants ",e.jsx("code",{children:"glass"})," buttons while its body draws nothing. ",e.jsx("strong",{children:"Persist"})," adds a"," ",e.jsx("code",{children:"storageKey"}),", which is the entire opt-in: the layout is restored on mount and saved after every change, exactly as"," ",e.jsx("code",{children:"Table"})," does it. ",e.jsx("strong",{children:"Edit accent"})," is separate from ",e.jsx("strong",{children:"surface tone"})," so the accent has something to stand out against."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(i,{items:l,defaultLayout:P,variant:t,tone:c,surfaceTone:f,controlVariant:v||void 0,size:b,maxColumns:S?{base:4,md:8,lg:Number(h)}:Number(h),readOnly:y,isEditMode:w,onEditModeChange:x,storageKey:m?"playground-dashboard":void 0},`${m}`)})})};function V(){return e.jsx(i,{items:l,defaultLayout:g,storageKey:"demo-dashboard",maxColumns:12})}const U=`import { SmartGridLayout } from "@cjlapao/ui-kit";
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
`;function Y(){const[t,s]=a.useState(!0);return e.jsx(i,{items:l,defaultLayout:g,controlVariant:"glass",maxColumns:12,isEditMode:t,onEditModeChange:s})}const q=`import { useState } from "react";
import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * Everything the editor can do, in one place. Press **Edit layout**, then:
 *
 * - **Add a tile** from the palette: press **Add Item**, then drag an entry
 *   out of the panel and onto the grid. It lands where the preview shows,
 *   using the same drop targets as a move. The panel stays open, so adding
 *   several is one flow rather than one dialog per tile.
 * - **Move a tile** by dragging it. The source all but disappears so the ghost
 *   showing where it will land stays readable.
 * - **Remove a tile** by dragging it onto the zone that appears top-left. It is
 *   only there while something is in flight — an always-armed delete target is
 *   a hazard, and there is nothing for it to say otherwise.
 * - **Reorder sections** with the \`⠿\` handle, which appears only when there is
 *   more than one, or with the up and down arrows once it has focus.
 * - **Rename a section** by clicking its title.
 * - **Resize a column** by dragging the divider between two tiles, or focusing
 *   it and using the left and right arrows.
 * - **Undo and redo** from the toolbar or \`Ctrl\`/\`Cmd\`+\`Z\`.
 *
 * All of it works from the keyboard: tab to a tile, \`Enter\` lifts it, the
 * arrows move it a slot at a time, \`Enter\` places it and \`Esc\` puts it back.
 * Sections move with their handle and the up/down arrows, columns resize with
 * left/right on the divider. Every action is announced through a polite live
 * region, so the editor is usable without sight of it.
 *
 * \`controlVariant\` gives the editing chrome a surface of its own — here the
 * body is \`plain\` and the controls are \`glass\`, which reads on any background.
 */
export default function Editing() {
  const [editing, setEditing] = useState(true);
  return (
    <SmartGridLayout
      items={DASHBOARD_ITEMS}
      defaultLayout={DASHBOARD_LAYOUT}
      controlVariant="glass"
      maxColumns={12}
      isEditMode={editing}
      onEditModeChange={setEditing}
    />
  );
}
`;function K(){return e.jsx("div",{className:"w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-200 via-rose-100 to-amber-100 p-6 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950",children:e.jsx(i,{items:l,defaultLayout:g,maxColumns:12})})}const $=`import { SmartGridLayout } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS, DASHBOARD_LAYOUT } from "../shared";

/**
 * The default surface is \`plain\`: no background, border, shadow, ring, radius
 * or padding.
 *
 * A dashboard is nearly always dropped into a page that already has its own
 * container, and drawing a second panel around it produced a grey slab
 * floating over whatever was behind — obvious the moment the host had a
 * background image, as here. The host owns the surface and the spacing; the
 * grid just lays out tiles on it.
 *
 * \`variant\` takes a surface back whenever you want one.
 */
export default function Embedded() {
  return (
    <div className="w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-200 via-rose-100 to-amber-100 p-6 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950">
      <SmartGridLayout
        items={DASHBOARD_ITEMS}
        defaultLayout={DASHBOARD_LAYOUT}
        maxColumns={12}
      />
    </div>
  );
}
`,F=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"]}]}];function Q(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:j.slice(0,4).map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:t}),e.jsx(i,{items:l,defaultLayout:F,variant:t,maxColumns:12,size:"sm"})]},t))})}const W=`import { SmartGridLayout, SMART_GRID_VARIANTS } from "@cjlapao/ui-kit";
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
`,Z=()=>{throw new Error("This tile's data source is unavailable")},J=[...l,{id:"broken",title:"Billing summary",active:!0,single:!0,defaultSpan:6,render:Z}];function X(){return e.jsx(i,{items:J,defaultLayout:[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","broken"],defaultHeightSpan:2}]}],maxColumns:12,readOnly:!0,onTileError:(t,s)=>console.warn(`[dashboard] ${s} failed:`,t.message)})}const ee=`import { SmartGridLayout } from "@cjlapao/ui-kit";
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
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(M,{name:"Smart Grid Layout",description:"A dashboard builder: sections and tiles dragged into place, columns and row heights resized inline, a drop zone that removes a tile, undo/redo, and a layout that saves itself. It draws no surface of its own by default, so it sits inside whatever container the page already has; the same Panel surface family is there when you want one, alongside the kit's tone and size scales and Table's storageKey persistence model."}),e.jsx(G,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Editing",description:"Drag a tile to move it, or onto the top-left zone to remove it. Drag a section by its handle, click a title to rename, drag a divider to resize a column. Undo and redo are in the toolbar and on Ctrl+Z.",code:q,filename:"Editing.tsx",children:e.jsx(Y,{})}),e.jsx(d,{title:"Plain by default",description:"No background, border, shadow or padding, so the grid drops into a container that already has its own. Drawing a second panel here produced a grey slab over the host's background.",code:$,filename:"Embedded.tsx",children:e.jsx(K,{})}),e.jsx(d,{title:"Persistence",description:"storageKey is the whole opt-in. Edit the layout, reload the page, and it comes back. Reset layout clears the stored key and returns to the default.",code:U,filename:"Persistence.tsx",children:e.jsx(V,{})}),e.jsx(d,{title:"A failing tile is contained",description:"Each tile is wrapped in its own error boundary. One throwing tile shows a fallback naming itself; the rest of the dashboard keeps working, where before it would have taken the whole page down.",code:ee,filename:"Resilience.tsx",children:e.jsx(X,{})}),e.jsx(d,{title:"Variants and tones",description:"The Panel surface family, plus the split between the edit accent and the surface tone. The accent came from a hand-written map covering 10 tones out of 21; the other eleven silently rendered blue.",code:W,filename:"Variants.tsx",children:e.jsx(Q,{})})]})]});export{ie as SmartGridLayoutPage,ie as default};
