import{j as e,eg as z,r as n,eN as i,cs as T,C as A,c2 as P}from"./index-B9JeX19j.js";import{P as N}from"./PageHeader-D-LFwZLT.js";import{E as l}from"./ExampleCard-BwESxlwz.js";import{A as H,a as g,C as s,b as _,P as B}from"./A11ySections-C9rTCDac.js";import{P as G,C as h,a as f,T as u}from"./PlaygroundPanel-CZvYEX_V.js";import{C as V}from"./ControlAccordion-rp4gabXb.js";import{d as U}from"./options-Blq0niUd.js";const r=(t,o,c)=>function(){return e.jsx(z,{label:t,value:o,icon:c,variant:"elevated",className:"h-full"})},d=[{id:"capsules",title:"Active capsules",active:!0,single:!0,defaultSpan:3,render:r("Active capsules",128,"Rocket")},{id:"requests",title:"Requests",active:!0,single:!0,defaultSpan:3,render:r("Requests","1.2M/h","Database")},{id:"spend",title:"Spend",active:!0,single:!0,defaultSpan:3,render:r("Spend","$8.4k","Shop")},{id:"health",title:"Health",active:!0,single:!0,defaultSpan:3,render:r("Health","99.98%","HealthCheck")},{id:"errors",title:"Errors",active:!0,single:!0,defaultSpan:6,render:r("Errors",42,"Database")},{id:"latency",title:"Latency",active:!0,single:!0,defaultSpan:6,render:r("Latency","142ms","Database")},{id:"queue",title:"Queue depth",active:!0,single:!0,defaultSpan:6,render:r("Queue depth",17,"Database")}],K=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"],defaultHeightSpan:2},{itemIds:["spend","health"],defaultHeightSpan:2}]}],y=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests","spend","health"],defaultHeightSpan:2}]},{id:"detail",title:"Detail",rows:[{itemIds:["errors","latency"],defaultHeightSpan:2}]}],q=[4,6,8,12].map(t=>({label:String(t),value:String(t)})),Y=()=>{const[t,o]=n.useState("plain"),[c,b]=n.useState("blue"),[v,C]=n.useState("neutral"),[w,D]=n.useState(""),[x,L]=n.useState("md"),[m,R]=n.useState("12"),[p,O]=n.useState(!1),[S,j]=n.useState(!1),[k,I]=n.useState(!1),[E,M]=n.useState(!1);return e.jsx(G,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(V,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:T.map(a=>({label:a,value:a})),value:t,onChange:a=>o(a)}),e.jsx(f,{label:"Edit accent",children:e.jsx(A,{selectable:!0,size:"sm",value:c,onSelect:b,defaultExpanded:!0})}),e.jsx(f,{label:"Surface tone",children:e.jsx(A,{selectable:!0,size:"sm",value:v,onSelect:C,defaultExpanded:!0})}),e.jsx(h,{label:"Control variant",options:[{label:"(follows surface)",value:""},...P.map(a=>({label:a,value:a}))],value:w,onChange:D}),e.jsx(h,{label:"Size",options:U,value:x,onChange:a=>L(a)}),e.jsx(h,{label:"Columns",options:q,value:m,onChange:R})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(f,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(u,{label:"Edit mode",checked:S,onChange:j}),e.jsx(u,{label:"Persist to localStorage",checked:p,onChange:O}),e.jsx(u,{label:"Read-only",checked:k,onChange:I}),e.jsx(u,{label:"Responsive columns",checked:E,onChange:M})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Turn on ",e.jsx("strong",{children:"Edit mode"}),", then: press"," ",e.jsx("strong",{children:"Add Item"})," and drag an entry out of the palette onto the grid — it lands where the preview shows, and the panel stays open so adding several is one flow; drag a tile to move it, or onto the red zone in the top-left to remove it; drag a section by its"," ",e.jsx("code",{children:"⠿"})," handle (only shown when there is more than one); click a section title to rename it; focus a resize handle and use the left and right arrows. It is fully operable from the keyboard — tab to a tile, ",e.jsx("kbd",{children:"Enter"})," to lift it, arrows to move,",e.jsx("kbd",{children:"Enter"})," to place, ",e.jsx("kbd",{children:"Esc"})," to cancel — and every action is announced to a screen reader."," ",e.jsx("strong",{children:"Control variant"})," gives the editing chrome a surface of its own — a ",e.jsx("code",{children:"plain"}),"dashboard over a photograph wants ",e.jsx("code",{children:"glass"})," buttons while its body draws nothing. ",e.jsx("strong",{children:"Persist"})," adds a"," ",e.jsx("code",{children:"storageKey"}),", which is the entire opt-in: the layout is restored on mount and saved after every change, exactly as"," ",e.jsx("code",{children:"Table"})," does it. ",e.jsx("strong",{children:"Edit accent"})," is separate from ",e.jsx("strong",{children:"surface tone"})," so the accent has something to stand out against."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(i,{items:d,defaultLayout:K,variant:t,tone:c,surfaceTone:v,controlVariant:w||void 0,size:x,maxColumns:E?{base:4,md:8,lg:Number(m)}:Number(m),readOnly:k,isEditMode:S,onEditModeChange:j,storageKey:p?"playground-dashboard":void 0},`${p}`)})})};function F(){return e.jsx(i,{items:d,defaultLayout:y,storageKey:"demo-dashboard",maxColumns:12})}const Z=`import { SmartGridLayout } from "@cjlapao/ui-kit";
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
`;function $(){const[t,o]=n.useState(!0);return e.jsx(i,{items:d,defaultLayout:y,controlVariant:"glass",maxColumns:12,isEditMode:t,onEditModeChange:o})}const Q=`import { useState } from "react";
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
`;function W(){return e.jsx("div",{className:"w-full overflow-hidden rounded-xl bg-gradient-to-br from-indigo-200 via-rose-100 to-amber-100 p-6 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950",children:e.jsx(i,{items:d,defaultLayout:y,maxColumns:12})})}const J=`import { SmartGridLayout } from "@cjlapao/ui-kit";
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
`,X=[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","requests"]}]}];function ee(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:T.slice(0,4).map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:t}),e.jsx(i,{items:d,defaultLayout:X,variant:t,maxColumns:12,size:"sm"})]},t))})}const te=`import { SmartGridLayout, SMART_GRID_VARIANTS } from "@cjlapao/ui-kit";
import { DASHBOARD_ITEMS } from "../shared";

const SMALL = [
  {
    id: "overview",
    title: "Overview",
    rows: [{ itemIds: ["capsules", "requests"] }],
  },
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
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            {variant}
          </span>
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
`,ne=()=>{throw new Error("This tile's data source is unavailable")},ae=[...d,{id:"broken",title:"Billing summary",active:!0,single:!0,defaultSpan:6,render:ne}];function oe(){return e.jsx(i,{items:ae,defaultLayout:[{id:"overview",title:"Overview",rows:[{itemIds:["capsules","broken"],defaultHeightSpan:2}]}],maxColumns:12,readOnly:!0,onTileError:(t,o)=>console.warn(`[dashboard] ${o} failed:`,t.message)})}const se=`import { SmartGridLayout } from "@cjlapao/ui-kit";
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
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(N,{name:"Smart Grid Layout",description:"A dashboard builder: sections and tiles dragged into place, columns and row heights resized inline, a drop zone that removes a tile, undo/redo, and a layout that saves itself. It draws no surface of its own by default, so it sits inside whatever container the page already has; the same Panel surface family is there when you want one, alongside the kit's tone and size scales and Table's storageKey persistence model."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Editing",description:"Drag a tile to move it, or onto the top-left zone to remove it. Drag a section by its handle, click a title to rename, drag a divider to resize a column. Undo and redo are in the toolbar and on Ctrl+Z.",code:Q,filename:"Editing.tsx",children:e.jsx($,{})}),e.jsx(l,{title:"Plain by default",description:"No background, border, shadow or padding, so the grid drops into a container that already has its own. Drawing a second panel here produced a grey slab over the host's background.",code:J,filename:"Embedded.tsx",children:e.jsx(W,{})}),e.jsx(l,{title:"Persistence",description:"storageKey is the whole opt-in. Edit the layout, reload the page, and it comes back. Reset layout clears the stored key and returns to the default.",code:Z,filename:"Persistence.tsx",children:e.jsx(F,{})}),e.jsx(l,{title:"A failing tile is contained",description:"Each tile is wrapped in its own error boundary. One throwing tile shows a fallback naming itself; the rest of the dashboard keeps working, where before it would have taken the whole page down.",code:se,filename:"Resilience.tsx",children:e.jsx(oe,{})}),e.jsx(l,{title:"Variants and tones",description:"The Panel surface family, plus the split between the edit accent and the surface tone. The accent came from a hand-written map covering 10 tones out of 21; the other eleven silently rendered blue.",code:te,filename:"Variants.tsx",children:e.jsx(ee,{})})]}),e.jsxs(H,{children:[e.jsxs(g,{title:"Screen reader",children:[e.jsxs("p",{children:["In edit mode a tile ",e.jsx("em",{children:"is"})," a button — ",e.jsx(s,{children:'role="button"'}),", in the tab order, with a teaching hint (“Press Enter to lift, then the arrow keys to move it”) as its description. Everything that happens narrates through a polite live region: lifted, moved, placed, undone, removed, reset. Read-only mode strips the roles and tab stops, so a viewer hears a plain list of tiles, not a field of buttons."]}),e.jsx(_,{filename:"Semantics.tsx",code:re})]}),e.jsx(g,{title:"Keyboard Support",children:e.jsxs("p",{children:["Dragging is not the only path — every gesture has a keyboard equivalent: Space or Enter lifts a tile, arrows walk it across rows and columns, Enter places it and Escape cancels back to the pre-lift layout. Section handles reorder with arrows, column and row spacers are ",e.jsx(s,{children:'role="separator"'})," resized with arrows, and undo/redo ride Ctrl+Z / Ctrl+Shift+Z. In read-only mode nothing is focusable that does anything."]})}),e.jsxs(g,{title:"Internationalization",children:[e.jsxs("p",{children:["Everything the grid says comes from the catalog — toolbar, drop zone, resize hints, the lift-and-place narration, all 56 keys, shipped for en, de, fr, es and pt. Tile ",e.jsx("em",{children:"content"})," is the caller’s and passes through untouched; the layout itself is a spatial model — coordinates, not language."]}),e.jsxs("p",{children:["To translate it into more, layer ",e.jsx(s,{children:"kit.smartgrid.*"})," keys into your"," ",e.jsx(s,{children:"I18nProvider"})," catalogs: resolution runs user → kit → en → key, so"," ",e.jsx("code",{children:'"kit.smartgrid.done": "Fertig"'})," replaces that one word and everything you leave unnamed keeps the kit’s translation. The i18n page under ",e.jsx("em",{children:"Internationalization"})," in the menu shows it live, including scoping an override to a subtree."]})]})]}),e.jsx(B,{props:[{name:"items",type:"SmartGridItemDefinition[]",description:"The catalogue of tiles the layout can place — title, content, span, and the error boundary's name."},{name:"defaultLayout",type:"SmartGridSectionDefinition[]",description:"Sections, rows and entries rendered when nothing is restored from storage."},{name:"persistedLayout / onLayoutChange",type:"State / (state) => void",description:e.jsxs(e.Fragment,{children:["The manual persistence pair — restore a state object, react to edits. Or set ",e.jsx(s,{children:"storageKey"})," and let the component own both."]})},{name:"maxColumns",type:"number | {base, sm, md, lg, xl}",default:"12",description:"Per-breakpoint counts, measured against the container (a grid in a split pane is narrower than the viewport). One number was the only option once — every tile a sliver on a phone."},{name:"variant",type:'PanelVariant | "plain"',default:"plain",description:"Plain by design: the host container owns the frame. The Panel surface family is there when the grid stands alone."},{name:"surfaceTone",type:"TrueColor",default:"neutral",description:e.jsxs(e.Fragment,{children:["Tone of the ",e.jsx("em",{children:"surface"}),", separate from the edit ",e.jsx(s,{children:"tone"})," — a dashboard tinted in the accent is a lot of colour."]})},{name:"tone",type:"TrueColor",default:"blue",description:"Edit accent: tile outlines, drop indicators, resize handles. `editThemeColor` is its deprecated alias."},{name:"size",type:"ControlSize",default:"md",description:"Grid gap, tile padding and the row-height unit."},{name:"controlVariant",type:"ButtonVariant",description:e.jsxs(e.Fragment,{children:["Surface of the editor’s own controls; follows ",e.jsx(s,{children:"variant"})," ","unless set — a plain dashboard over a photograph wants glass controls."]})},{name:"readOnly",type:"boolean",default:"false",description:"No toolbar, no handles, no edit mode at all — distinct from isEditMode={false}, which keeps the machinery mounted."},{name:"isEditMode / defaultEditMode / onEditModeChange",type:"boolean / boolean / (b) => void",description:"Controlled or self-owned edit mode; the change callback fires either way, so a host can ask the grid to leave."},{name:"historyLimit",type:"number",default:"50",description:"Undo steps per edit session; 0 removes undo/redo from the toolbar entirely."},{name:"onTileError",type:"(error, title) => void",description:"A throwing tile is replaced by a named fallback and reported here; the dashboard survives."},{name:"storageKey / storagePrefix / storage",type:"string / string / GridStorageAdapter",description:e.jsxs(e.Fragment,{children:["Table’s persistence model: opt in with a key, restored on mount under ",e.jsx("code",{children:"ui-kit:grid"}),":key by default, over any adapter."]})},{name:"autoSave / autoSaveDebounceMs",type:"boolean / number",default:"true / 400",description:"Debounced writes — resize drags update the layout on every mousemove; unthrottled serialising would run dozens of times a second."}]})]}),re=`// Edit mode is where the buttons are; a viewer sees content.
<SmartGridLayout items={items} defaultLayout={layout} readOnly />
<SmartGridLayout items={items} defaultLayout={layout}
  isEditMode onEditModeChange={setEditing} />`;export{pe as SmartGridLayoutPage,pe as default};
