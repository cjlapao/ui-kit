import{r as n,j as e,eO as r,C as V,eP as A,b$ as P,k as Q}from"./index-B9JeX19j.js";import{P as X}from"./PageHeader-D-LFwZLT.js";import{E as p}from"./ExampleCard-BwESxlwz.js";import{A as Y,a as b,C as s,b as Z,P as ee}from"./A11ySections-C9rTCDac.js";import{P as te,C as u,a as c,T as i}from"./PlaygroundPanel-CZvYEX_V.js";import{C as ae}from"./ControlAccordion-rp4gabXb.js";import{u as ne,E as se}from"./EventLog-EYY1E4QF.js";import{e as le,d as ie,x as re}from"./options-Blq0niUd.js";const oe=ie,g=({names:t,tone:l})=>e.jsx("ul",{className:"space-y-1 py-2 pl-9 pr-4",children:t.map(o=>e.jsxs("li",{className:"flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{className:"truncate",children:o}),e.jsx(P,{size:"sm",tone:l,variant:"soft",children:"ready"})]},o))}),de=()=>{const[t,l]=n.useState("blue"),[o,L]=n.useState("elevated"),[f,z]=n.useState("neutral"),[v,W]=n.useState(!1),[y,D]=n.useState(""),[j,M]=n.useState("md"),[m,O]=n.useState("skeleton"),[k,_]=n.useState(!0),[S,H]=n.useState(!1),[N,F]=n.useState(!1),[C,G]=n.useState(!1),[T,$]=n.useState(!1),[B,h]=ne(),[E,U]=n.useState(!0),[d,q]=n.useState(!0),[I,K]=n.useState(!1),J=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Gateway detail"}),menu:[{label:"Rename",value:"rename"},{label:"Duplicate",value:"duplicate"},{label:"Delete",value:"delete",danger:!0}],subContent:d?e.jsx(g,{names:["gateway-7f4c","gateway-9d21"],tone:t}):void 0},{id:"b",label:"worker-pool",subtitle:"us-east-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Worker detail"}),menu:[{label:"Rename",value:"rename"},{label:"Duplicate",value:"duplicate"},{label:"Delete",value:"delete",danger:!0}],subContent:d?e.jsx(g,{names:["worker-01","worker-02","worker-03"],tone:t}):void 0},{id:"c",label:"batch-runner",subtitle:"ap-south-1",icon:"Container",panel:e.jsx("div",{className:"p-6 text-sm",children:"Batch detail"}),menu:[{label:"Rename",value:"rename"},{label:"Duplicate",value:"duplicate"},{label:"Delete",value:"delete",danger:!0}],highlight:!0,subContent:d?e.jsx(g,{names:["batch-nightly"],tone:t}):void 0,subItems:d?[{id:"c-1",label:"batch-nightly-2f",menu:[{label:"Restart",value:"restart"}],onClick:a=>h(`Sub-item ${String(a.label)}`)},{id:"c-2",label:"batch-nightly-8a",menu:[{label:"Restart",value:"restart"}],onClick:a=>h(`Sub-item ${String(a.label)}`)}]:void 0}];return e.jsx(te,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ae,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Variant",options:le,value:o,onChange:a=>L(a)}),e.jsx(c,{label:"Accent tone",children:e.jsx(V,{selectable:!0,size:"sm",value:t,onSelect:l,defaultExpanded:!0})}),e.jsx(c,{label:"Surface tone",children:e.jsx(V,{selectable:!0,size:"sm",value:f,onSelect:z,defaultExpanded:!0})}),e.jsx(i,{label:"Surface tone follows accent",checked:v,onChange:W}),e.jsx(u,{label:"Size",options:oe,value:j,onChange:a=>M(a)})]})},{id:"search",title:"Search",controls:e.jsx(u,{label:"Search variant",options:[{label:"(follows surface)",value:""},...re],value:y,onChange:D})},{id:"loader",title:"Loader",controls:e.jsx(u,{label:"Loader",options:A.map(a=>({label:a,value:a})),value:m,onChange:a=>O(a)})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Layout",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Collapsible",checked:k,onChange:_}),e.jsx(i,{label:"Resizable",checked:S,onChange:H})]})}),e.jsx(c,{label:"Rows",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Sub-items",checked:d,onChange:q}),e.jsx(i,{label:"Dots always visible",checked:T,onChange:$}),e.jsx(i,{label:"Expand on select",checked:I,onChange:K}),e.jsx(i,{label:"New-item indicator",checked:E,onChange:U})]})})]})},{id:"states",title:"States",controls:e.jsx(c,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Loading",checked:N,onChange:F}),e.jsx(i,{label:"Error",checked:C,onChange:G})]})})}]}),e.jsx(se,{log:B,emptyText:"No events yet — click rows, sub-items or menu options."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Accent tone"})," drives the active row, the resizer and the search field; ",e.jsx("strong",{children:"surface tone"})," always paints the divider between the panes and colours the surface the way the variant handles a tone — fill, wash or rule. The surface comes from the same family as ",e.jsx("code",{children:"Panel"}),", and the search field follows it unless you override it — try ",e.jsx("strong",{children:"glass"}),". Turn"," ",e.jsx("strong",{children:"Expand on select"})," off and a caret appears on rows that have sub-items, so a row can open in place instead of only filling the pane. ",e.jsx("strong",{children:"New-item indicator"})," drops the pulsing dot on ",e.jsx("code",{children:"highlight"})," rows while keeping their accent tint. Row menus sit just before the caret — turn"," ",e.jsx("strong",{children:"Dots always visible"})," to keep them in place instead of on hover — and the ",e.jsx("strong",{children:"Event log"})," below records what you clicked."]})]}),preview:e.jsx("div",{className:"h-96 w-full overflow-hidden rounded-lg",children:e.jsx(r,{items:J,tone:t,surfaceTone:v?"auto":f,variant:o,searchVariant:y||void 0,size:j,listTitle:"Capsules",collapsible:k,resizable:S,autoExpand:I,showHighlightIndicator:E,loading:N,loaderType:m,loadingProgress:m==="progress"?62:void 0,error:C?"Could not reach the registry":void 0,onRetry:()=>{},onChange:(a,x)=>h(`Selected ${String(x.label)}`),onMenuSelect:(a,x)=>h(`Menu "${String(x.label)}" → ${String(a.label)}`),menuVisibility:T?"always":"hover"})})})};function ce(){const t=[{id:"a",label:"Selected",subtitle:"the active row",panel:e.jsx("div",{className:"p-4 text-sm",children:"Detail"})},{id:"b",label:"Another",subtitle:"not selected",panel:e.jsx("div",{className:"p-4 text-sm",children:"Detail"})}];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["stone","neutral","violet","emerald"].map(l=>e.jsxs("div",{className:"flex flex-col gap-1",children:[e.jsx("span",{className:"text-[11px] uppercase tracking-wide opacity-60",children:l}),e.jsx("div",{className:"h-44 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:e.jsx(r,{items:t,color:l})})]},l))})}const he=`import { SplitView } from "@cjlapao/ui-kit";

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
    {
      id: "a",
      label: "Selected",
      subtitle: "the active row",
      panel: <div className="p-4 text-sm">Detail</div>,
    },
    {
      id: "b",
      label: "Another",
      subtitle: "not selected",
      panel: <div className="p-4 text-sm">Detail</div>,
    },
  ];
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["stone", "neutral", "violet", "emerald"] as const).map((color) => (
        <div key={color} className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide opacity-60">
            {color}
          </span>
          <div className="h-44 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <SplitView items={items} color={color} />
          </div>
        </div>
      ))}
    </div>
  );
}
`,pe=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway detail"})},{id:"b",label:"worker-pool",subtitle:"us-east-1",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker detail"})}];function ue(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:Q.map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:t}),e.jsx("div",{className:"h-56 overflow-hidden rounded-lg",children:e.jsx(r,{items:pe,variant:t,tone:"blue",listTitle:"Capsules"})})]},t))})}const me=`import { SplitView, SPLIT_VIEW_VARIANTS } from "@cjlapao/ui-kit";

const ITEMS = [
  {
    id: "a",
    label: "api-gateway",
    subtitle: "eu-west-1",
    icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div>,
  },
  {
    id: "b",
    label: "worker-pool",
    subtitle: "us-east-1",
    icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div>,
  },
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
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            {variant}
          </span>
          <div className="h-56 overflow-hidden rounded-lg">
            <SplitView
              items={ITEMS}
              variant={variant}
              tone="blue"
              listTitle="Capsules"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
`,w=t=>e.jsx("ul",{className:"space-y-1 py-2 pl-9 pr-4",children:t.map(l=>e.jsxs("li",{className:"flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300",children:[e.jsx("span",{className:"truncate",children:l}),e.jsx(P,{size:"sm",tone:"emerald",variant:"soft",children:"ready"})]},l))}),R=[{id:"a",label:"api-gateway",subtitle:"2 replicas",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway detail"}),subContent:w(["gateway-7f4c","gateway-9d21"])},{id:"b",label:"worker-pool",subtitle:"3 replicas",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker detail"}),subContent:w(["worker-01","worker-02","worker-03"])},{id:"c",label:"batch-runner",subtitle:"1 replica",icon:"Container",panel:e.jsx("div",{className:"p-4 text-sm",children:"Batch detail"}),highlight:!0,subContent:w(["batch-nightly"])}];function xe(){return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"autoExpand — selecting opens the sub-items"}),e.jsx("div",{className:"h-72 overflow-hidden rounded-lg",children:e.jsx(r,{items:R,listTitle:"Capsules",tone:"blue"})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:"autoExpand=false — a caret drills in, no dot"}),e.jsx("div",{className:"h-72 overflow-hidden rounded-lg",children:e.jsx(r,{items:R,listTitle:"Capsules",tone:"violet",autoExpand:!1,showHighlightIndicator:!1})})]})]})}const be=`import { SplitView, Pill } from "@cjlapao/ui-kit";

const replicas = (names: string[]) => (
  <ul className="space-y-1 py-2 pl-9 pr-4">
    {names.map((name) => (
      <li
        key={name}
        className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-neutral-300"
      >
        <span className="truncate">{name}</span>
        <Pill size="sm" tone="emerald" variant="soft">
          ready
        </Pill>
      </li>
    ))}
  </ul>
);

const ITEMS = [
  {
    id: "a",
    label: "api-gateway",
    subtitle: "2 replicas",
    icon: "Container" as const,
    panel: <div className="p-4 text-sm">Gateway detail</div>,
    subContent: replicas(["gateway-7f4c", "gateway-9d21"]),
  },
  {
    id: "b",
    label: "worker-pool",
    subtitle: "3 replicas",
    icon: "Container" as const,
    panel: <div className="p-4 text-sm">Worker detail</div>,
    subContent: replicas(["worker-01", "worker-02", "worker-03"]),
  },
  {
    id: "c",
    label: "batch-runner",
    subtitle: "1 replica",
    icon: "Container" as const,
    panel: <div className="p-4 text-sm">Batch detail</div>,
    highlight: true,
    subContent: replicas(["batch-nightly"]),
  },
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
`,ge=[{id:"a",label:"api-gateway",subtitle:"eu-west-1",panel:e.jsx("div",{className:"p-4 text-sm",children:"Gateway"})},{id:"b",label:"worker-pool",subtitle:"us-east-1",panel:e.jsx("div",{className:"p-4 text-sm",children:"Worker"})}];function we(){return e.jsx("div",{className:"grid w-full gap-4 lg:grid-cols-3",children:A.map(t=>e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-xs uppercase tracking-wide text-neutral-400",children:t}),e.jsx("div",{className:"h-64 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:e.jsx(r,{items:ge,listTitle:"Capsules",loading:!0,loaderType:t,loadingProgress:62})})]},t))})}const fe=`import { SplitView, SPLIT_VIEW_LOADERS } from "@cjlapao/ui-kit";

const ITEMS = [
  {
    id: "a",
    label: "api-gateway",
    subtitle: "eu-west-1",
    panel: <div className="p-4 text-sm">Gateway</div>,
  },
  {
    id: "b",
    label: "worker-pool",
    subtitle: "us-east-1",
    panel: <div className="p-4 text-sm">Worker</div>,
  },
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
          <span className="text-xs uppercase tracking-wide text-neutral-400">
            {loaderType}
          </span>
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
`,Ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(X,{name:"Split View",description:"A searchable list beside a detail pane, optionally collapsible and drag-resizable. It takes the same surface family as Panel, the built-in search follows that surface, and rows can carry sub-items that expand in place. With a single visible item it drops the list entirely and shows the detail alone."}),e.jsx(de,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Variants",description:"The Panel surface family. The list pane is tinted translucently rather than filled, so it composites over the variant instead of replacing it — the detail pane used to be a bare bg-white with no dark-mode partner.",code:me,filename:"Variants.tsx",children:e.jsx(ue,{})}),e.jsx(p,{title:"Sub-items and the new-item dot",description:"subContent expands a row in place; subItems renders structured child rows that carry the same hover-revealed overflow menu. With autoExpand=false a caret separates selecting from drilling in, and showHighlightIndicator={false} keeps a highlighted row's tint while dropping its pulsing dot.",code:be,filename:"SubItems.tsx",children:e.jsx(xe,{})}),e.jsx(p,{title:"Loaders",description:"The three treatments, skeleton by default — shaped like the two panes so the list keeps its width and the layout does not jump when the data lands.",code:fe,filename:"Loaders.tsx",children:e.jsx(we,{})}),e.jsx(p,{title:"Tones",description:"Generated from the palette. The literal map aliased both neutral and stone to one object, so stone silently rendered neutral and border-l-stone-600 was never emitted.",code:he,filename:"Tones.tsx",children:e.jsx(ce,{})})]}),e.jsxs(Y,{children:[e.jsxs(b,{title:"Screen reader",children:[e.jsxs("p",{children:["A row is a real control — ",e.jsx(s,{children:'role="button"'}),", Enter/Space, focus ring and all — and the active one carries ",e.jsx(s,{children:'aria-current="true"'}),", so selection is announced, not just painted in the accent border. Disabled rows say ",e.jsx(s,{children:"aria-disabled"}),". Sub-content carets report",e.jsx(s,{children:"aria-expanded"}),", the collapse chevron names itself, and the loading/error/empty messages are catalog strings. Honest limits: the list is a stack of buttons, not a ",e.jsx(s,{children:"listbox"})," — the number of rows is not announced — and there are no arrow keys, so the list is walked with Tab."]}),e.jsx(Z,{filename:"Semantics.tsx",code:ve})]}),e.jsx(b,{title:"Keyboard Support",children:e.jsxs("p",{children:["Tab reaches every row, the search field, the expand carets, the collapse chevron and (when resizable) the divider — which is an ARIA separator with a keyboard story of its own. Enter or Space selects a row; when ",e.jsx("code",{children:"autoExpand={false}"})," that separates",e.jsx("em",{children:"selecting"})," from ",e.jsx("em",{children:"drilling in"}),", and the caret is a second control with its own stop. The empty detail pane renders no tab stops beyond the list."]})}),e.jsx(b,{title:"Internationalization",children:e.jsxs("p",{children:["Everything built-in — the search placeholder, the loading label, the error pair with its Retry button, both empties, the collapse and expand labels — is catalog-resolved (",e.jsx(s,{children:"kit.splitview.*"}),", five locales), and a ",e.jsx("code",{children:"searchPlaceholder"})," set by the caller still wins over the default. Rows, headers and detail content are the caller’s and pass through untouched; want a whole new language? Layer ",e.jsx(s,{children:"kit.splitview.*"})," keys in your own catalogs — the i18n page shows the override live."]})})]}),e.jsx(ee,{props:[{name:"items",type:"SplitViewItem[]",description:"The rows: id, title, subtitle, optional subContent (in-place expand), highlight (accent tint + dot), disabled. Each row — and each sub-item — may carry a menu."},{name:"items[].menu",type:"DropdownMenuOption[]",description:"Overflow entries for the row, opened from the three-dots button revealed on hover. Rendered through the kit DropdownMenu — viewport collision detection included."},{name:"items[].subItems",type:"SplitViewItem[]",description:"Structured child rows under an expanded row — with a lighter hover tint than the parent and the same menu affordance as any row."},{name:"items[].onClick",type:"(item) => void",description:"Makes a sub-item row its own button and fires on click. Top-level rows select through onChange instead."},{name:"menuVisibility",type:'"hover" | "always"',default:'"hover"',description:"Whether the rows' three-dots buttons sit in the rail permanently or appear on hover (they always stay visible while their menu is open)."},{name:"onMenuSelect",type:"(item, option) => void",description:"Fired for any option picked in a row's or sub-row's menu."},{name:"value / defaultValue / onChange",type:"string / string / (id, item) => void",description:"Controlled or self-owned selection; onChange reports the item, not just the id."},{name:"listTitle / listActions",type:"ReactNode",description:"Label above the rows (a count in the title is conventional — LIBRARIES (3)) and buttons beside the search field."},{name:"searchPlaceholder / searchVariant",type:"string / InputVariant",description:e.jsxs(e.Fragment,{children:["The placeholder defaults to ",e.jsx(s,{children:"kit.splitview.search"}),"; the field’s surface defaults from ",e.jsx(s,{children:"variant"})," so it belongs to its pane."]})},{name:"listWidth",type:"string",description:"A Tailwind width class, or the initial px value when resizable."},{name:"variant",type:"SurfaceVariant",default:"elevated",description:"The Panel surface family, elevated as everywhere else. The list pane tints translucently over the variant rather than filling it."},{name:"surfaceTone",type:'TrueColor | "auto"',default:"neutral",description:e.jsxs(e.Fragment,{children:["Tone of the ",e.jsx("em",{children:"surface"}),"; ",e.jsx("code",{children:'"auto"'})," follows the accent. It always paints the divider between the panes, and colours the surface with whatever treatment the variant has for a tone — tinted fill, glass wash, coloured rule — except"," ",e.jsx("code",{children:"elevated"})," (white by design) and ",e.jsx("code",{children:"default"}),", whose rim is deliberately tone-free."]})},{name:"tone",type:"TrueColor",default:"blue",description:"Accent for the active row, resizer and search focus. `color` is its deprecated alias."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale (xs → xl): row padding and type. The built-in empty/error states follow the shared pane map, so they stay quieter than the panes' own chrome."},{name:"collapsible / collapsed / defaultCollapsed / onCollapsedChange",type:"boolean flags + (b) => void",description:"Shrink the list to a chevron rail; controlled or self-owned, reported either way."},{name:"resizable / minListWidth / maxListWidth",type:"boolean / number / number",default:"false / 180 / 75%",description:"Drag the divider; the separator announces the width and takes arrow keys."},{name:"panelHeader / panelHeaderProps",type:"ReactNode | fn",description:"Above the detail pane — static or derived per active item; panelHeaderProps (dynamic PageHeader-like slots) takes precedence."},{name:"emptyState / panelEmptyState",type:"ReactNode",description:e.jsxs(e.Fragment,{children:["No rows match the filter / nothing is selected — both default to tone-aware EmptyStates; ",e.jsx(s,{children:"null"})," renders nothing at all."]})},{name:"loading / loaderType / loadingProgress / loadingState",type:"boolean / skeleton|spinner|progress / 0–100 / ReactNode",default:"— / skeleton",description:"The skeleton is shaped like the two panes, so the layout does not jump when data lands."},{name:"error / errorState / onRetry",type:"ReactNode / ReactNode / () => void",description:"A string error becomes the EmptyState subtitle; onRetry adds the translated Retry action."},{name:"autoExpand",type:"boolean",default:"true",description:e.jsxs(e.Fragment,{children:["false splits select from drill: rows only highlight, and the row’s caret — the ",e.jsx(s,{children:"aria-expanded"})," control — opens the detail."]})},{name:"showHighlightIndicator",type:"boolean",default:"true",description:"The pulsing dot on highlighted rows. Off keeps the accent tint and drops the notification cue."},{name:"expandedValue / onExpand",type:"string / (id, item) => void",description:"Controlled expansion — only meaningful with autoExpand={false}, where the caret owns it."},{name:"panelScrollable",type:"boolean",default:"true",description:"false hands overflow to panels that manage their own scroll (sticky-header tables), avoiding double scrollbars."},{name:"borderLeft / className / listClassName / panelClassName",type:"string",description:"A hairline from adjacent chrome (a side menu, say) and per-part class passthroughs."}]})]}),ve=`// Rows are buttons with current-state; carets are separate controls.
<div role="button" tabIndex={0} aria-current="true">…</div>   // active row
<button aria-expanded={open} aria-label="Collapse details" /> // caret`;export{Ie as SplitViewPage,Ie as default};
