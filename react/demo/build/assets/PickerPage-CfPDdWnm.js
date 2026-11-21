import{r as t,j as e,g9 as o,P as re,c as y,C as de,g as ce,q as m,g8 as he,g6 as O,gb as pe,B as ue}from"./index-ChbzYKtA.js";import{P as me,A as ge,a as v,C as a}from"./A11ySections-Ci0MCORB.js";import{P as xe}from"./PageHeader-CORco2N-.js";import{E as h}from"./ExampleCard-Db5NXgWv.js";import{P as be,C as p,a as fe,T as r}from"./PlaygroundPanel-CZxrTOj5.js";import{P as we}from"./PanelSurfaceControls-DjYOkJgf.js";import{C as ke}from"./ControlAccordion-DoyyLWlc.js";import{u as je,E as ve}from"./EventLog-AWfnu5cV.js";import{I as Se,c as ye,bk as Ie,f as L,a0 as Ce}from"./options-C-rzDbtC.js";import"./SurfaceToneControl-BpIV0XpL.js";const q=[{id:"a",title:"api-gateway",subtitle:"eu-west-1",tags:[{label:"running"}]},{id:"b",title:"worker-pool",subtitle:"us-east-1",tags:[{label:"paused"}]},{id:"c",title:"batch-runner",subtitle:"ap-south-1",tags:[{label:"stopped"}]}],Ne=()=>{const[s,l]=t.useState("a"),[i,c]=t.useState([]),[d,G]=t.useState("blue"),[g,K]=t.useState("md"),[I,D]=t.useState("auto"),[C,H]=t.useState("auto"),[N,U]=t.useState("auto"),[P,$]=t.useState("auto"),[u,_]=t.useState("flat"),[x,Y]=t.useState("none"),[b,J]=t.useState("subtle"),[T,X]=t.useState(!1),[E,Q]=t.useState(!1),[f,Z]=t.useState(!1),[F,ee]=t.useState(!1),[A,te]=t.useState(!1),[R,ne]=t.useState(!1),[k,ae]=t.useState(!1),[j,se]=t.useState(!0),[z,M]=t.useState(!1),[w,ie]=t.useState(!1),[oe,V]=je(),B=e.jsx(o,{items:k?q.map((n,le)=>({...n,group:le===0?"Compute":"Batch"})):q,groupSelectable:k,tone:d,size:g,corner:I,panelVariant:N,panelTone:P,panelCorner:C,variant:u,validationStatus:x,glowIntensity:b,loading:E,disabled:f,leadingIcon:F?"Folder":void 0,hideCaret:A,multi:T,selectedId:s,onSelect:n=>{l(n.id),V(`select → ${n.title}`)},selectedIds:i,onMultiChange:n=>{c(n),V(`multi → ${n.length} selected`)},defaultFilter:R?{label:"Running",predicate:n=>n.tags?.[0]?.label==="running"}:void 0});return e.jsx(be,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ke,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:Se,value:u,onChange:n=>_(n)}),e.jsx(fe,{label:"Tone",children:e.jsx(de,{selectable:!0,size:"sm",value:d,onSelect:G,defaultExpanded:!0})}),e.jsx(p,{label:"Size",options:ye,value:g,onChange:n=>K(n)}),e.jsx(p,{label:"Validation",options:Ie,value:x,onChange:n=>Y(n)}),e.jsx(p,{label:"Corner",options:L,value:I,onChange:n=>D(n)}),e.jsx(p,{label:"Dropdown corner",options:L,value:C,onChange:n=>H(n)}),e.jsx(we,{panelVariant:N,onPanelVariant:U,panelTone:P,onPanelTone:$})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Multi-select",checked:T,onChange:X}),e.jsx(r,{label:"Groups (selectable, needs multi)",checked:k,onChange:ae}),e.jsx(r,{label:"Leading icon",checked:F,onChange:ee}),e.jsx(r,{label:"Hide caret",checked:A,onChange:te}),e.jsx(r,{label:"Default filter",checked:R,onChange:ne}),e.jsx(r,{label:"Loading",checked:E,onChange:Q}),e.jsx(r,{label:"Disabled",checked:f,onChange:Z}),e.jsx(r,{label:"Compare with Input",checked:j,onChange:se})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"In a panel",checked:z,onChange:M}),e.jsx(r,{label:"On a glass panel",checked:w,onChange:n=>{ie(n),n&&M(!0)}})]})},...u==="gradient"||w?[{id:"glow",title:"Glow",controls:e.jsx(p,{label:"Glow",options:Ce,value:b,onChange:n=>J(n)})}]:[]]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The surface, padding, type scale and focus treatment all come from the shared field system in the theme — the same one"," ",e.jsx("code",{children:"Input"}),", ",e.jsx("code",{children:"Select"})," and ",e.jsx("code",{children:"SearchBar"})," ","use. Turn on ",e.jsx("strong",{children:"Compare with Input"})," and change the size: the two stay aligned, which they could not before, when this control had a two-entry size scale and a hardcoded white box. The dropdown itself is portaled, so a panel host never clips it."]}),e.jsx(ve,{log:oe,emptyText:"No events yet — selections report through here."})]}),preview:e.jsx("div",{className:"w-full",children:z?e.jsx(re,{corner:"none",variant:w?"liquid-glass":"outlined",tone:w?d:"neutral",padding:"md",scrollable:!1,children:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[B,j&&e.jsx(y,{placeholder:"An Input, same size and variant",tone:d,size:g,variant:u,validationStatus:x,glowIntensity:b,disabled:f})]})}):e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[B,j&&e.jsx(y,{placeholder:"An Input, same size and variant",tone:d,size:g,variant:u,validationStatus:x,glowIntensity:b,disabled:f})]})})})};function Pe(){const[s,l]=t.useState("a"),i=[{id:"a",title:"api-gateway"},{id:"b",title:"worker-pool"}];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["red","green","blue","violet"].map(c=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wide opacity-60",children:c}),e.jsx(o,{items:i,color:c,selectedId:s,onSelect:d=>l(d.id)})]},c))})}const Te=`import { useState } from "react";
import { Picker } from "@cjlapao/ui-kit";

/**
 * Open each one: the trigger ring, the selected row and the filter chip all
 * come from tokens generated off \`TRUE_COLORS\`.
 *
 * The literal map this replaced spelled \`red\` with **rose** and \`green\` with
 * **emerald**. Because those literals were also what Tailwind scanned,
 * \`ring-red-500/20\` had never been emitted — so fixing the map alone would
 * have rendered those tones with no colour at all until the safelist gained
 * the shape too.
 */
export default function Tones() {
  const [id, setId] = useState("a");
  const items = [
    { id: "a", title: "api-gateway" },
    { id: "b", title: "worker-pool" },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["red", "green", "blue", "violet"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">
            {color}
          </span>
          <Picker
            items={items}
            color={color}
            selectedId={id}
            onSelect={(i) => setId(i.id)}
          />
        </div>
      ))}
    </div>
  );
}
`,Ee=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"}];function Fe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ce.map(s=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:s}),e.jsx(o,{items:Ee,selectedId:"a",variant:s})]},s))})}const Ae=`import { Picker } from "@cjlapao/ui-kit";
import { INPUT_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [{ id: "a", title: "api-gateway", subtitle: "eu-west-1" }];

/**
 * Every \`InputVariant\` the other fields offer. The trigger used to paint a
 * hardcoded \`bg-white dark:bg-neutral-900\` with a \`border-neutral-300\`, so
 * none of these were reachable — a Picker could not be glass, ghost,
 * underlined, elevated or gradient while every sibling field could.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {INPUT_VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            {variant}
          </span>
          <Picker items={ITEMS} selectedId="a" variant={variant} />
        </div>
      ))}
    </div>
  );
}
`,S=[{id:"a",title:"api-gateway",subtitle:"eu-west-1"},{id:"b",title:"worker-pool",subtitle:"us-east-1"}];function Re(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Loading (trigger disabled)"}),e.jsx(o,{items:[],loading:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Disabled"}),e.jsx(o,{items:S,selectedId:"a",disabled:!0})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Error"}),e.jsx(o,{items:S,validationStatus:"error"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"Beside an Input"}),e.jsx(o,{items:S,selectedId:"a"}),e.jsx(y,{placeholder:"Same size, same variant"})]})]})}const ze=`import { Input, Picker } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", title: "api-gateway", subtitle: "eu-west-1" },
  { id: "b", title: "worker-pool", subtitle: "us-east-1" },
];

/**
 * Every state comes from the shared field system, so a Picker and an Input
 * side by side agree on all of them — the surface, the padding, the error
 * border, the disabled treatment.
 *
 * The loading row is the one that used to be wrong: the spinner and copy had
 * no \`flex-1\` between them, so the chevron sat against the word "Loading…"
 * instead of at the trailing edge where every other state puts it.
 *
 * \`loading\` also disables the trigger — there is nothing to pick yet, and
 * opening onto an empty list reads as "no results" rather than "not ready". It
 * takes a wait cursor rather than the disabled dim, because the spinner
 * already says why the control is inert.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Loading (trigger disabled)
        </span>
        <Picker items={[]} loading />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Disabled
        </span>
        <Picker items={ITEMS} selectedId="a" disabled />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Error
        </span>
        <Picker items={ITEMS} validationStatus="error" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase tracking-wide text-neutral-400">
          Beside an Input
        </span>
        <Picker items={ITEMS} selectedId="a" />
        <Input placeholder="Same size, same variant" />
      </div>
    </div>
  );
}
`,W=[{id:"qa",title:"@aeon-qa-workspace",subtitle:"~/work/aeon-qa-workspace",icon:e.jsx(m,{icon:"Folder",size:"sm"}),tags:[{label:"main",tone:"blue"},{label:"3 uncommitted",tone:"neutral"}]},{id:"auth",title:"@auth-service",subtitle:"~/work/services/auth-api",icon:e.jsx(m,{icon:"Folder",size:"sm"}),tags:[{label:"feat/jwt-v2",tone:"amber"}]},{id:"core",title:"@aeon-core-engine",subtitle:"~/work/aeon-core-engine",icon:e.jsx(m,{icon:"Folder",size:"sm"}),tags:[{label:"main · idle",tone:"neutral"}]}];function Me(){const[s,l]=t.useState("core");return e.jsxs("div",{className:"flex w-full max-w-xl flex-col gap-5",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:"Workspace picker with a fixed leading icon"}),e.jsx(o,{items:W,selectedId:s,onSelect:i=>l(i.id),leadingIcon:"Folder",size:"sm",searchPlaceholder:"Filter workspaces or branches…"})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-400",children:"Same picker without the caret — click or use Enter / Space to open"}),e.jsx(o,{items:W,selectedId:s,onSelect:i=>l(i.id),leadingIcon:e.jsx(m,{icon:"Blueprint",size:"sm"}),hideCaret:!0,size:"sm",searchPlaceholder:"Filter workspaces or branches…"})]})]})}const Ve=`import { useState } from "react";
import { CustomIcon, Picker, type PickerItem } from "@cjlapao/ui-kit";

const WORKSPACES: PickerItem[] = [
  { id: "qa", title: "@aeon-qa-workspace", subtitle: "~/work/aeon-qa-workspace", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "main", tone: "blue" }, { label: "3 uncommitted", tone: "neutral" }] },
  { id: "auth", title: "@auth-service", subtitle: "~/work/services/auth-api", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "feat/jwt-v2", tone: "amber" }] },
  { id: "core", title: "@aeon-core-engine", subtitle: "~/work/aeon-core-engine", icon: <CustomIcon icon="Folder" size="sm" />,
    tags: [{ label: "main · idle", tone: "neutral" }] },
];

export default function Workspace() {
  const [selectedId, setSelectedId] = useState("core");
  return (
    <div className="flex w-full max-w-xl flex-col gap-5">
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Workspace picker with a fixed leading icon</p>
        <Picker items={WORKSPACES} selectedId={selectedId} onSelect={item => setSelectedId(item.id)}
          leadingIcon="Folder" size="sm" searchPlaceholder="Filter workspaces or branches…" />
      </div>
      <div className="space-y-2">
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Same picker without the caret — click or use Enter / Space to open</p>
        <Picker items={WORKSPACES} selectedId={selectedId} onSelect={item => setSelectedId(item.id)}
          leadingIcon={<CustomIcon icon="Blueprint" size="sm" />} hideCaret size="sm"
          searchPlaceholder="Filter workspaces or branches…" />
      </div>
    </div>
  );
}
`,Be=[{id:"workspace",textValue:"Aeon workspace main connected",icon:e.jsx(m,{icon:"Folder",size:"sm"}),body:e.jsxs("span",{className:"flex min-w-0 flex-col gap-1",children:[e.jsxs("span",{className:"flex items-center gap-2",children:[e.jsx("strong",{children:"Aeon workspace"}),e.jsx("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500","aria-hidden":"true"})]}),e.jsx("code",{className:"truncate text-xs opacity-70",children:"~/work/aeon-workspace"})]}),tags:[{label:"main",tone:"blue"},{label:"connected",tone:"emerald"}]},{id:"service",textValue:"Auth service feature jwt",body:e.jsxs("span",{className:"flex flex-col gap-1",children:[e.jsx("strong",{children:"Auth service"}),e.jsxs("span",{className:"text-xs opacity-70",children:["Custom ",e.jsx("em",{children:"React content"})," with its own layout"]})]}),tags:[{label:"feat/jwt",tone:"amber"}]},{id:"standard",title:"Standard item",subtitle:"Existing text fields still work",tags:[{label:"text"}]}];function Oe(){const[s,l]=t.useState("workspace");return e.jsx("div",{className:"w-full max-w-xl",children:e.jsx(o,{items:Be,selectedId:s,onSelect:i=>l(i.id)})})}const Le=`import { useState } from "react";
import { CustomIcon, Picker, type PickerItem } from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  {
    id: "workspace",
    textValue: "Aeon workspace main connected",
    icon: <CustomIcon icon="Folder" size="sm" />,
    // body replaces title/subtitle/description. Keep its content presentational:
    // the row and trigger already own their button/listbox interactions.
    body: <span className="flex min-w-0 flex-col gap-1">
      <span className="flex items-center gap-2"><strong>Aeon workspace</strong><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /></span>
      <code className="truncate text-xs opacity-70">~/work/aeon-workspace</code>
    </span>,
    tags: [{ label: "main", tone: "blue" }, { label: "connected", tone: "emerald" }],
  },
  {
    id: "service",
    textValue: "Auth service feature jwt",
    body: <span className="flex flex-col gap-1"><strong>Auth service</strong><span className="text-xs opacity-70">Custom <em>React content</em> with its own layout</span></span>,
    tags: [{ label: "feat/jwt", tone: "amber" }],
  },
  { id: "standard", title: "Standard item", subtitle: "Existing text fields still work", tags: [{ label: "text" }] },
];

export default function CustomBody() {
  const [selectedId, setSelectedId] = useState("workspace");
  return <div className="w-full max-w-xl"><Picker items={ITEMS} selectedId={selectedId} onSelect={item => setSelectedId(item.id)} /></div>;
}
`,qe=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"},{id:"Explore",title:"Explore",subtitle:"func · GraphExplorer.tsx:88",icon:"Search"}];function We(){const[s,l]=t.useState("aeon/cmd/aeon/action.go"),[i,c]=t.useState("");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(he,{gap:"sm",children:[e.jsx(O,{label:"Symbol",className:"w-80 max-w-full",children:e.jsx(o,{items:qe,selectedId:s,onSelect:d=>l(d.id),placeholder:"Search a symbol…",variant:"ghost",tone:"neutral"})}),e.jsx(O,{label:"Kind",className:"w-40 shrink-0",children:e.jsx(pe,{options:["function","method","type","file"],value:i,onChange:c,placeholder:"Any kind",variant:"ghost",tone:"neutral"})}),e.jsx(ue,{color:"blue",disabled:s.trim()==="",children:"Explore"})]})})}const Ge=`import { useState } from "react";
import {
  Button,
  Combobox,
  FieldRow,
  FormField,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const SYMBOLS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
  {
    id: "Explore",
    title: "Explore",
    subtitle: "func · GraphExplorer.tsx:88",
    icon: "Search",
  },
];

/**
 * Where a Picker actually lives: a toolbar, beside fields of its own
 * height. Its two-line trigger (title + subtitle) sets the control band of
 * the \`FieldRow\`, and the combobox and the button fill it — no \`lines\`,
 * no \`h-full\`, no manual alignment.
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="sm">
        <FormField label="Symbol" className="w-80 max-w-full">
          <Picker
            items={SYMBOLS}
            selectedId={symbol}
            onSelect={(item) => setSymbol(item.id)}
            placeholder="Search a symbol…"
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Kind" className="w-40 shrink-0">
          <Combobox
            options={["function", "method", "type", "file"]}
            value={kind}
            onChange={setKind}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <Button color="blue" disabled={symbol.trim() === ""}>
          Explore
        </Button>
      </FieldRow>
    </div>
  );
}
`,Ze=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(xe,{name:"Picker",description:"A searchable single- or multi-select over rich rows — icon, title, subtitle, description and pills. The list is portaled and flips above the trigger when there is no room below."}),e.jsx(Ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Variants",description:"Every InputVariant the other fields offer. The trigger painted a hardcoded white box before, so none of these were reachable.",code:Ae,filename:"Variants.tsx",children:e.jsx(Fe,{})}),e.jsx(h,{title:"Workspace picker and trigger icons",description:"A fixed leadingIcon is shown before and after selection. Item icons, paths and branch/status tags populate the searchable rows. hideCaret removes only the arrow, keeping the full button and keyboard behavior.",code:Ve,filename:"Workspace.tsx",children:e.jsx(Me,{})}),e.jsx(h,{title:"Custom item body",description:"Supply body to replace the standard title, subtitle and description with JSX in both the dropdown and selected trigger. Icons and tags remain separate. Provide textValue for search, accessible naming and multi-select pill labels.",code:Le,filename:"CustomBody.tsx",children:e.jsx(Oe,{})}),e.jsx(h,{title:"Loading, disabled and error",description:"All three come from the shared field system, so a Picker and an Input agree on them. The loading row's chevron now sits at the trailing edge — it used to sit against the word Loading.",code:ze,filename:"States.tsx",children:e.jsx(Re,{})}),e.jsx(h,{title:"Tones",description:"Generated from the palette. The literal map this replaced spelled red as rose and green as emerald — and since those literals were also what Tailwind scanned, the correct classes had never been emitted.",code:Te,filename:"Tones.tsx",children:e.jsx(Pe,{})}),e.jsx(h,{title:"In a row",description:"Where a Picker actually lives: a toolbar beside fields of its own height. The two-line trigger sets the FieldRow's control band and the combobox and the button fill it — no alignment props anywhere.",code:Ge,filename:"InRow.tsx",children:e.jsx(We,{})})]}),e.jsx(me,{props:[{name:"item.body / item.textValue",type:"ReactNode / string",description:"Body replaces the standard text block, preserving icon and tags. Use non-interactive JSX rather than nested buttons/links. textValue provides searchable/accessibility text and multi-select labels; falls back to title, then id. Raw HTML strings are not parsed."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"Trigger radius on the shared scale, matching Select. Auto uses the theme field corner; underline stays square."},{name:"panelCorner",type:"SurfaceCorner",default:'"auto"',description:"Independent dropdown radius on the shared Panel corner scale. The last row clips to these corners without outer padding."},{name:"leadingIcon",type:"string | ReactElement",description:"Fixed trigger icon, by registry name or custom element. Overrides the selected item's trigger icon and also appears on placeholders and in multi-select mode. Dropdown item icons remain independent."},{name:"hideCaret",type:"boolean",default:"false",description:"Removes the decorative caret and its space. The trigger remains a keyboard-accessible button with aria-expanded and aria-haspopup."},{name:"items",type:"PickerItem[]",description:"Rich rows: `title`, `subtitle`, `description`, `icon`, `tags`. This is why the widget is an ARIA listbox rather than a native <select> — native options cannot carry this content."},{name:"selectedId",type:"string",description:"Single-select selection. Omit for uncontrolled none; the trigger shows `placeholder` until something is picked."},{name:"onSelect",type:"(item: PickerItem) => void",description:"Fires with the whole item — the row, not just its id, so callers rarely need a lookup."},{name:"multi / selectedIds / onMultiChange",type:"boolean / string[] / (ids) => void",description:"Multi-select mode: `aria-multiselectable` on the listbox, pills on the trigger, and a `3 selected / Clear` summary when they overflow `maxPillsShown`."},{name:"defaultFilter",type:"{ label, predicate }",description:"A pre-applied slice of the list with a toggle in the search row — the search placeholder names the active slice (&ldquo;Search running items…&rdquo;) so users never wonder what they are searching."},{name:"placeholder / emptyMessage / loadingMessage",type:"string",description:"All optional — and their defaults now live in the kit catalogue, so leaving them out gets the user&rsquo;s language, not English."},{name:"loading",type:"boolean",default:"false",description:"Disables the trigger (a loading picker must not be re-opened) with a wait cursor rather than the disabled dim, and shows a spinner row while keeping the list browsable."},{name:"tone / color",type:"TrueColor",default:'"blue"',description:"The shared field tone. `color` is the deprecated alias and `tone` wins when both are set — the family rule."},{name:"variant / size / validationStatus / glow trio",type:"InputVariant / ControlSize / ValidationStatus / …",description:"Straight from the field system shared with Input, Select and SearchBar — same surfaces, same scale, same focus treatment, so a Picker stacked beside an Input lines up."},{name:"escapeBoundary",type:"boolean",default:"—",description:"@deprecated — accepted and ignored. The dropdown is portaled to the document root, so it always positions against the viewport: inside a scrollable Panel or a Modal the popup lands below the field either way, the way the DatePicker&rsquo;s overlay has since been fixed. And Escape was never this flag&rsquo;s business: while the dropdown is open its Escape handler consumes the key, so only the dropdown closes and the Modal behind it survives — no flag needed."},{name:"fullWidth / fullHeight / maxPillsShown",type:"boolean / boolean / number",description:"Layout knobs: fill the container, let the list grow past the capped dropdown height, and how many pills before the count summary."}]}),e.jsxs(ge,{children:[e.jsx(v,{title:"Screen reader",children:e.jsxs("p",{children:["A deliberate ARIA implementation: the search field is a"," ",e.jsx(a,{children:'role="combobox"'})," driving a"," ",e.jsx(a,{children:'role="listbox"'})," of ",e.jsx(a,{children:'role="option"'})," ","rows, with the keyboard highlight announced through"," ",e.jsx(a,{children:"aria-activedescendant"})," — focus never leaves the field, so the typed query survives. A native ",e.jsx(a,{children:"<select>"})," cannot host icon-subtitle-tag rows, so the pattern is not laziness; the localized names (“Search options”, “Options”) come from the kit catalogue, not from hardcoded English."]})}),e.jsx(v,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(a,{children:"Enter"})," or ",e.jsx(a,{children:"Space"})," opens; opening highlights and announces the first option (or the selected one); ",e.jsx(a,{children:"↑"})," ",e.jsx(a,{children:"↓"})," move the highlight, ",e.jsx(a,{children:"Home"}),"/",e.jsx(a,{children:"End"})," jump, ",e.jsx(a,{children:"Enter"})," confirms,"," ",e.jsx(a,{children:"Escape"})," closes ",e.jsx("em",{children:"only"})," the dropdown — the key is consumed while it is open, so the Modal behind it survives. Clicking the filter pill toggles the slice without moving focus out of the search field, so keyboard state survives."]})}),e.jsx(v,{title:"Internationalization",children:e.jsxs("p",{children:["Everything visible by default is a kit string —"," ",e.jsx(a,{children:"kit.picker.placeholder"}),", ",e.jsx(a,{children:"empty"}),", ",e.jsx(a,{children:"loading"}),", the three search placeholders (including the interpolated ",e.jsx(a,{children:"searchIn"}),", “Search ","{group}"," items…”), ",e.jsx(a,{children:"selectedCount"})," and the accessible names — so an untouched ",e.jsx(a,{children:"<Picker items />"})," ","renders in the user’s language. The items themselves are caller content, translated upstream. The German tests assert “Wird geladen…” and the German listbox names, because these defaults used to be English baked into the component — the kind of bug no one sees until they are wrong in front of a user."]})})]})]});export{Ze as PickerPage,Ze as default};
