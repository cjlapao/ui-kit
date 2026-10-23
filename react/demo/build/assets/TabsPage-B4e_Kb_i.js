import{r as n,j as e,P as Z,c4 as i,C as k,v as Q,q as X}from"./index-B9JeX19j.js";import{P as Y}from"./PageHeader-D-LFwZLT.js";import{E as o}from"./ExampleCard-BwESxlwz.js";import{c as s,A as ee,a as p,C as ae,P as te}from"./A11ySections-C9rTCDac.js";import{P as ne,S as l,a as N,T as r}from"./PlaygroundPanel-CZvYEX_V.js";import{C as se}from"./ControlAccordion-rp4gabXb.js";import{u as ie,E as le}from"./EventLog-EYY1E4QF.js";import{L as oe,M as re,N as ce,O as de,m as pe,n as he,l as ue,P as me}from"./options-Blq0niUd.js";const be=()=>{const[t,R]=n.useState("underline"),[h,O]=n.useState("md"),[u,E]=n.useState("blue"),[m,z]=n.useState("horizontal"),[b,M]=n.useState("start"),[x,G]=n.useState(!1),[g,_]=n.useState(!1),[c,V]=n.useState(!0),[d,L]=n.useState(!0),[f,P]=n.useState("blue"),[v,B]=n.useState("medium"),[j,D]=n.useState("frosted"),[y,q]=n.useState("none"),[w,K]=n.useState("md"),[U,F]=n.useState("deployments"),[T,W]=n.useState(!1),[$,H]=ie(),S=t==="glass"||t==="liquid-glass",J=[{id:"deployments",label:"Deployments",icon:"Run",description:"Active release rings",badge:"Live",actions:c?[{id:"create",icon:"Add",label:"Create release"},{id:"sync",icon:"Reset",label:"Sync status"}]:void 0,panel:e.jsxs("div",{className:"grid gap-3 md:grid-cols-2",children:[e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Production"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.18.4"}),e.jsx("p",{className:"text-xs text-neutral-500",children:"Healthy · deployed 3m ago"})]}),e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Staging"}),e.jsx("p",{className:"text-xl font-bold text-neutral-900 dark:text-white",children:"v2.19.0-rc1"}),e.jsx("p",{className:"text-xs text-amber-600 dark:text-amber-400",children:"2 checks queued"})]})]})},{id:"analytics",label:"Analytics",icon:"ViewGrid",description:"Usage and adoption",panel:e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("p",{className:"text-xs font-semibold text-neutral-500 dark:text-neutral-400",children:"Active seats"}),e.jsx("p",{className:"text-2xl font-bold text-neutral-900 dark:text-white",children:"247"}),e.jsx("p",{className:"text-xs text-emerald-600 dark:text-emerald-400",children:"+12 new this week"})]})},{id:"alerts",label:"Alerts",icon:"Notification",badge:"2",description:"Incidents & reviews",panel:e.jsx("div",{className:"space-y-2",children:["Database latency spike","API rate limit warning"].map(a=>e.jsxs("div",{className:"flex items-center justify-between rounded-lg border border-neutral-200 bg-white/80 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/80",children:[e.jsx("span",{className:"font-medium text-neutral-900 dark:text-white",children:a}),e.jsx("span",{className:"text-xs text-neutral-500",children:"just now"})]},a))})}];return e.jsx(ne,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(se,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Variant",options:oe,value:t,onChange:a=>R(a)}),e.jsx(l,{label:"Size",options:re,value:h,onChange:a=>O(a)}),e.jsx(N,{label:"Tone",children:e.jsx(k,{selectable:!0,size:"sm",value:u,onSelect:E,defaultExpanded:!0})}),c&&e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Actions follow tone",checked:d,onChange:L}),!d&&e.jsx(N,{label:"Actions tone",children:e.jsx(k,{selectable:!0,size:"sm",value:f,onSelect:P,defaultExpanded:!0})})]}),e.jsx(l,{label:"Orientation",options:ce,value:m,onChange:a=>z(a)}),e.jsx(l,{label:"Justify",options:de,value:b,onChange:a=>M(a)})]})},...S?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{label:"Vibrancy",options:pe,value:v,onChange:a=>B(a)}),e.jsx(l,{label:"Fill opacity",options:he,value:j,onChange:a=>D(a)}),e.jsx(l,{label:"Specular",options:ue,value:y,onChange:a=>q(a)}),e.jsx(l,{label:"Radius",options:me,value:w,onChange:a=>K(a)})]})}]:[],{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Full width",checked:x,onChange:G}),e.jsx(r,{label:"Dividers",checked:g,onChange:_}),e.jsx(r,{label:"Actions",checked:c,onChange:V}),e.jsx(r,{label:"Glass panel",checked:T,onChange:W})]})}]}),e.jsx(le,{log:$,emptyText:"No events yet — pick a tab, by keyboard if you like."}),e.jsxs("p",{className:"text-xs opacity-70",children:["Contextual ",e.jsx("strong",{children:"actions"})," pin to whichever tab is active.",e.jsx("strong",{children:" Dividers"})," only apply to underline and minimal. Tall panel content scrolls on the kit’s own"," ",e.jsx("strong",{children:"ScrollArea"})," — the same overlay bars everywhere else, no browser-specific scrollbar styling."," ",e.jsx("strong",{children:"Actions follow the tone"})," by default so they stay readable on glass and image hosts; untick to pin another tone. Focus lands on the selected tab and ",e.jsx(s,{children:"ArrowRight"}),"/",e.jsx(s,{children:"ArrowLeft"})," (or ",e.jsx(s,{children:"ArrowUp"}),"/",e.jsx(s,{children:"ArrowDown"})," ","when vertical) walk the list, skipping disabled tabs and wrapping;"," ",e.jsx(s,{children:"Home"}),"/",e.jsx(s,{children:"End"})," jump to the ends."]})]}),preview:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(Z,{variant:T?"glass":"elevated",padding:"md",scrollable:!1,children:e.jsx("div",{className:"h-72",children:e.jsx(i,{items:J,value:U,onChange:a=>{F(a),H(`selected "${a}"`)},variant:t,size:h,color:u,orientation:m,justify:b,fullWidth:x,actionsColor:d?"auto":f,showDividers:g,vibrancy:v,glassOpacity:j,specularMode:S?y:"none",radius:w})})})})})},xe=["underline","soft","pill","segmented","minimal","glass","liquid-glass"],ge=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}],fe="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function ve(){return e.jsx("div",{className:fe,children:e.jsx("div",{className:"grid gap-4 md:grid-cols-2",children:xe.map(t=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-xs opacity-60",children:t}),e.jsx(i,{items:ge,variant:t,color:"blue",size:"sm"})]},t))})})}const je=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem, TabsVariant } from "@cjlapao/ui-kit";

const VARIANTS: TabsVariant[] = [
  "underline",
  "soft",
  "pill",
  "segmented",
  "minimal",
  "glass",
  "liquid-glass",
];

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function EveryVariant() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="grid gap-4 md:grid-cols-2">
        {VARIANTS.map((each) => (
          <div key={each} className="flex flex-col gap-1.5">
            <span className="text-xs opacity-60">{each}</span>
            <Tabs items={MINI_ITEMS} variant={each} color="blue" size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
}
`,ye=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}];function we(){return e.jsx("div",{className:"flex flex-wrap items-end gap-6",children:Q.map(t=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(i,{items:ye,variant:"underline",color:"blue",size:t}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:t})]},t))})}const Te=`import { CONTROL_SIZES, Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

export default function SizeLadder() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {CONTROL_SIZES.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs
            items={TRIO_ITEMS}
            variant="underline"
            color="blue"
            size={each}
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
`,Se=[{id:"a",label:"Alpha"},{id:"b",label:"Beta"}];function ke(){return e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:X.map(t=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(i,{items:Se,variant:"underline",color:t,size:"sm"}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:t})]},t))})}const Ne=`import { Tabs, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const MINI_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha" },
  { id: "b", label: "Beta" },
];

export default function EveryTone() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Tabs items={MINI_ITEMS} variant="underline" color={each} size="sm" />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
`,A=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],C=({children:t})=>e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:t});function Ae(){return e.jsxs("div",{className:"flex flex-wrap items-start gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(i,{items:A,variant:"soft",color:"blue",size:"sm",orientation:"horizontal"}),e.jsx(C,{children:"horizontal"})]}),e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(i,{items:A,variant:"soft",color:"blue",size:"sm",orientation:"vertical"}),e.jsx(C,{children:"vertical"})]})]})}const Ce=`import type { ReactNode } from "react";
import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[10px] uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export default function Orientation() {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="horizontal"
        />
        <Caption>horizontal</Caption>
      </div>
      <div className="flex flex-col gap-1.5">
        <Tabs
          items={TRIO_ITEMS}
          variant="soft"
          color="blue"
          size="sm"
          orientation="vertical"
        />
        <Caption>vertical</Caption>
      </div>
    </div>
  );
}
`,Ie=[{id:"a",label:"Deploy",icon:"Run",description:"Active rings",badge:"Live",actions:[{id:"create",icon:"Add",label:"Create release",active:!0},{id:"sync",icon:"Reset",label:"Sync status"}]},{id:"b",label:"Analytics",icon:"ViewGrid",description:"Usage"},{id:"c",label:"Locked",icon:"Key",disabled:!0,badge:"3"}];function Re(){return e.jsx(i,{items:Ie,variant:"soft",color:"blue",size:"md"})}const Oe=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const STATE_ITEMS: TabItem[] = [
  {
    id: "a",
    label: "Deploy",
    icon: "Run",
    description: "Active rings",
    badge: "Live",
    actions: [
      { id: "create", icon: "Add", label: "Create release", active: true },
      { id: "sync", icon: "Reset", label: "Sync status" },
    ],
  },
  { id: "b", label: "Analytics", icon: "ViewGrid", description: "Usage" },
  { id: "c", label: "Locked", icon: "Key", disabled: true, badge: "3" },
];

export default function States() {
  return <Tabs items={STATE_ITEMS} variant="soft" color="blue" size="md" />;
}
`,I=[{id:"a",label:"Alpha",icon:"Run"},{id:"b",label:"Beta",icon:"ViewGrid"},{id:"c",label:"Gamma",icon:"Notification"}],Ee="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function ze(){return e.jsx("div",{className:Ee,children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(i,{items:I,variant:"glass",color:"blue",size:"md",specularMode:"classic"}),e.jsx(i,{items:I,variant:"liquid-glass",color:"indigo",size:"md",specularMode:"halo"})]})})}const Me=`import { Tabs } from "@cjlapao/ui-kit";
import type { TabItem } from "@cjlapao/ui-kit";

const TRIO_ITEMS: TabItem[] = [
  { id: "a", label: "Alpha", icon: "Run" },
  { id: "b", label: "Beta", icon: "ViewGrid" },
  { id: "c", label: "Gamma", icon: "Notification" },
];

const GLASS_BACKDROP =
  "rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Glass() {
  return (
    <div className={GLASS_BACKDROP}>
      <div className="flex flex-col gap-4">
        <Tabs
          items={TRIO_ITEMS}
          variant="glass"
          color="blue"
          size="md"
          specularMode="classic"
        />
        <Tabs
          items={TRIO_ITEMS}
          variant="liquid-glass"
          color="indigo"
          size="md"
          specularMode="halo"
        />
      </div>
    </div>
  );
}
`,Ke=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Tabs",description:"Switch between panes with icons, descriptions, badges and contextual actions pinned to the active tab. Seven variants — including glass and liquid glass — plus size, tone, orientation and justify; tall panels scroll on the kit's own ScrollArea."}),e.jsx(be,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Every variant",description:"All seven variants at one tone and size, on a backdrop so the glass fills have something to blur.",code:je,filename:"EveryVariant.tsx",children:e.jsx(ve,{})}),e.jsx(o,{title:"Size ladder",description:"The shared sm / md / lg scale with icons, underline variant.",code:Te,filename:"SizeLadder.tsx",children:e.jsx(we,{})}),e.jsx(o,{title:"Every tone",description:"All 21 true colours, underline at sm.",code:Ne,filename:"EveryTone.tsx",children:e.jsx(ke,{})}),e.jsx(o,{title:"Orientation",description:"The same soft bar running horizontally and vertically.",code:Ce,filename:"Orientation.tsx",children:e.jsx(Ae,{})}),e.jsx(o,{title:"States",description:"Icon, description, badge, a disabled tab and contextual actions on the active tab.",code:Oe,filename:"States.tsx",children:e.jsx(Re,{})}),e.jsx(o,{title:"Glass",description:"Glass with a classic highlight and liquid glass with a halo — the active tab carries a tone ring.",code:Me,filename:"Glass.tsx",children:e.jsx(ze,{})})]}),e.jsxs(ee,{children:[e.jsx(p,{title:"Screen reader",children:e.jsxs("p",{children:["The bar is a real ",e.jsx("code",{children:'role="tablist"'})," of"," ",e.jsx("code",{children:'role="tab"'}),"s carrying ",e.jsx("code",{children:"aria-selected"})," ","and the ",e.jsx("code",{children:"aria-orientation"})," you chose; each tab with a panel wires ",e.jsx(ae,{children:"aria-controls"})," to a ",e.jsx("code",{children:'role="tabpanel"'})," ","labelled back by ",e.jsx("code",{children:"aria-labelledby"}),". Only the active panel is rendered visible (native ",e.jsx("code",{children:"hidden"}),", not a fake), and icons stay decorative inside the label. Badges and descriptions are read as part of the tab’s name — a badge of “2” announces “Alerts 2”, which is the point."]})}),e.jsx(p,{title:"Keyboard Support",children:e.jsxs("p",{children:["One tab stop, the APG way: ",e.jsx(s,{children:"Tab"})," lands on the selected tab — the others carry ",e.jsx("code",{children:'tabIndex="-1"'}),", so the bar never floods the page tab order — and from there ",e.jsx(s,{children:"ArrowRight"}),"/",e.jsx(s,{children:"ArrowLeft"})," walk the list (",e.jsx(s,{children:"ArrowUp"}),"/",e.jsx(s,{children:"ArrowDown"})," when vertical), skipping disabled tabs and wrapping at the ends, ",e.jsx(s,{children:"Home"}),"/",e.jsx(s,{children:"End"})," jump to the ends, and selection follows focus (automatic activation). This keyboard model is new — the roving tabindex existed but the arrow keys did not, which made the bar a dead end. In controlled mode focus follows the owner’s decision: if the change is refused, focus stays put rather than stranding on a tab nobody selected. A bar too wide for its container scrolls through kit ",e.jsx("em",{children:"ScrollArea"})," lanes (the"," ",e.jsx("code",{children:"hover"})," variant — the same virtual bars the rest of the kit shows), and arrow navigation scrolls the reached tab into view; the scroll viewports stay out of the tab order because the tabs already own the keyboard."]})}),e.jsx(p,{title:"Internationalization",children:e.jsxs("p",{children:["Tabs own no strings — every label, description, badge and action name is caller data and localizes with the page. Two layout notes for translation: tab labels grow, so test a German pass before shipping"," ",e.jsx("code",{children:'justify="between"'})," or ",e.jsx("code",{children:"fullWidth"}),", and vertical bars trade horizontal stretching for vertical stacking, which long translations survive better."]})})]}),e.jsx(te,{props:[{name:"items",type:"TabItem[]",description:"`{ id, label, icon?, description?, badge?, badgeColor?, disabled?, panel?, actions? }`. `panel` is the pane content; without it the tab switches nothing but `onChange`."},{name:"value / defaultValue",type:"string",description:"Controlled / uncontrolled active id. Uncontrolled defaults to the first item — and if the active item vanishes from `items`, selection falls back to the first."},{name:"onChange",type:"(id, item) => void",description:"Fires on selection changes — not on reselecting the active tab unless `allowReselect`. Keyboard activation fires it identically."},{name:"allowReselect",type:"boolean",default:"false",description:"Clicking the active tab is silent by default; set true to make it a refresh gesture."},{name:"variant",type:"TabsVariant",default:'"underline"',description:"underline · soft · pill · segmented · minimal · glass · liquid-glass. The glass pair takes the full glass sub-vocabulary."},{name:"size / color",type:"TabsSize / TrueColor",default:'"md" / "blue"',description:"The whole shared control scale (xs→xl, the same five steps as Button) and the 21-tone palette — the md row aligns with md buttons and inputs."},{name:"orientation",type:'"horizontal" | "vertical"',default:'"horizontal"',description:"Also switches the arrow axis and announces itself via aria-orientation. For the column to scroll on its own (rather than the page scrolling the whole component), Tabs needs a definite height — put it on the Tabs itself or a wrapper, not just an outer Panel."},{name:"justify / fullWidth",type:"TabsJustify / boolean",default:'"start" / false',description:"start · center · end · between (horizontal only); fullWidth stretches every tab to share the row."},{name:"showDividers",type:"boolean",default:"false",description:"Rules between tabs — underline and minimal variants only, where nothing else separates them."},{name:"actionsColor",type:'"auto" | TrueColor',default:'"auto"',description:"Colour of the active tab&rsquo;s action icons, rendered as ghost IconButtons (the SplitView collapse shape, label as tooltip). auto follows the tabs&rsquo; color — neutral glyphs wash out on glass and image hosts — with a per-action color still winning over it."},{name:"vibrancy / glassOpacity / specularMode / radius",type:"GlassVibrancy / GlassOpacity / SpecularMode / TabsRadius",default:"medium / frosted / none / md",description:"The glass-variant chrome — fill, rim, specular paint and pill corner."},{name:"containerClassName / listClassName / panelClassName / className",type:"string",description:"Class overrides at each layer; containerClassName also overrides hideUnderlineContainer."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Disabled tabs are natively ",e.jsx("code",{children:"disabled"})," — skipped by arrows, inert to clicks. Actions render only for the ",e.jsx("em",{children:"active"})," tab’s",e.jsx("code",{children:"actions"})," array; icon actions get an IconButton whose accessible name is the action’s string label. Crowded bars scroll: without actions the whole bar is one ",e.jsx("code",{children:"ScrollArea"})," lane; with them the tabs take the free space and the actions a 20%-capped lane, each its own ",e.jsx("code",{children:"ScrollArea"}),", so neither clips the other."]})]});export{Ke as TabsPage,Ke as default};
