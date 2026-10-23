import{r as a,j as e,P as C,c1 as o,C as P,c2 as A,v as I,q as z}from"./index-B9JeX19j.js";import{P as L}from"./PageHeader-D-LFwZLT.js";import{E as l}from"./ExampleCard-BwESxlwz.js";import{c as n,A as R,a as d,C as r,P as U}from"./A11ySections-C9rTCDac.js";import{P as V,S as p,a as W,T as i}from"./PlaygroundPanel-CZvYEX_V.js";import{C as _}from"./ControlAccordion-rp4gabXb.js";import{u as M,E as F}from"./EventLog-EYY1E4QF.js";import{D as $,d as G,E as H}from"./options-Blq0niUd.js";const Z=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"},{label:"Advanced…",value:"advanced",description:"Pick a specific version or channel"}],K=()=>{const[t,w]=a.useState("solid"),[u,j]=a.useState("md"),[h,S]=a.useState("blue"),[c,T]=a.useState("trigger"),[m,D]=a.useState(!0),[g,O]=a.useState(!1),[x,N]=a.useState(!1),[b,k]=a.useState(!1),[y,E]=a.useState(!1),[B,f]=M();return e.jsx(V,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(_,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:$,value:t,onChange:s=>w(s)}),e.jsx(p,{label:"Size",options:G,value:u,onChange:s=>j(s)}),e.jsx(W,{label:"Tone",children:e.jsx(P,{selectable:!0,size:"sm",value:h,onSelect:S,defaultExpanded:!0})})]})},{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Menu width",options:H,value:c,onChange:s=>T(s)}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Split trigger",checked:m,onChange:D}),e.jsx(i,{label:"Full width",checked:g,onChange:O}),e.jsx(i,{label:"Disabled",checked:x,onChange:N}),e.jsx(i,{label:"Empty menu",checked:b,onChange:k}),e.jsx(i,{label:"Glass panel",checked:y,onChange:E})]})]})}]}),e.jsx(F,{log:B,emptyText:"No events yet — press the button or pick a menu option."}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Split trigger"})," gives the caret its own button width; without it the caret collapses into a compact trigger. An empty menu hides the caret entirely, so the control renders as a plain button. The primary button fires the action; the caret opens",e.jsx("code",{children:" role=menu"})," — ",e.jsx(n,{children:"ArrowUp"}),"/",e.jsx(n,{children:"ArrowDown"})," ","walk its items (skipping disabled ones), ",e.jsx(n,{children:"Home"}),"/",e.jsx(n,{children:"End"})," jump, ",e.jsx(n,{children:"Escape"})," closes and hands focus back to the caret. The caret itself is named through the kit catalogs; override it with ",e.jsx("code",{children:"caretLabel"})," when “Deploy options” beats “Toggle dropdown menu”."]})]}),preview:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(C,{variant:y?"glass":"elevated",padding:"md",children:e.jsx(o,{label:"Deploy",options:b?[]:Z,variant:t,color:h,size:u,disabled:x,fullWidth:g,split:m,menuWidth:c==="trigger"?"trigger":Number(c),onPrimaryClick:()=>f("primary action fired"),onOptionSelect:s=>f(`selected "${s.value}"`)})})})})},q=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"},{label:"Advanced…",value:"advanced",description:"Pick a specific version or channel"}],J=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:A.filter(t=>t!=="clear").map(t=>e.jsx(o,{label:t,options:q,variant:t},t))}),Y=`import { BUTTON_VARIANTS, DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
  {
    label: "Advanced…",
    value: "advanced",
    description: "Pick a specific version or channel",
  },
];

const EveryVariant = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2">
    {BUTTON_VARIANTS.filter((variant) => variant !== "clear").map((variant) => (
      <DropdownButton
        key={variant}
        label={variant}
        options={OPTIONS}
        variant={variant}
      />
    ))}
  </div>
);

export default EveryVariant;
`,Q=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],X=()=>e.jsx("div",{className:"flex w-full flex-wrap items-center gap-3",children:I.map(t=>e.jsx(o,{label:t,options:Q,variant:"solid",size:t},t))}),ee=`import { CONTROL_SIZES, DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const SizeLadder = () => (
  <div className="flex w-full flex-wrap items-center gap-3">
    {CONTROL_SIZES.map((size) => (
      <DropdownButton
        key={size}
        label={size}
        options={OPTIONS}
        variant="solid"
        size={size}
      />
    ))}
  </div>
);

export default SizeLadder;
`,te=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],ne=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:z.map(t=>e.jsx(o,{label:t,options:te,variant:"solid",color:t},t))}),ae=`import { DropdownButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const EveryTone = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {TRUE_COLORS.map((color) => (
      <DropdownButton
        key={color}
        label={color}
        options={OPTIONS}
        variant="solid"
        color={color}
      />
    ))}
  </div>
);

export default EveryTone;
`,v=[{label:"Deploy latest",value:"latest",description:"Use the newest stable build"},{label:"Deploy canary",value:"canary",description:"Test the canary build in staging"}],se=()=>e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Split (default)"}),e.jsx(o,{label:"Deploy",options:v})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Single trigger"}),e.jsx(o,{label:"Deploy",options:v,split:!1})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:"Empty menu"}),e.jsx(o,{label:"Deploy",options:[]})]})]}),oe=`import { DropdownButton } from "@cjlapao/ui-kit";
import type { DropdownButtonOption } from "@cjlapao/ui-kit";

const OPTIONS: DropdownButtonOption[] = [
  {
    label: "Deploy latest",
    value: "latest",
    description: "Use the newest stable build",
  },
  {
    label: "Deploy canary",
    value: "canary",
    description: "Test the canary build in staging",
  },
];

const SplitVersusSingle = () => (
  <div className="flex w-full max-w-xs flex-col gap-5">
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Split (default)
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Single trigger
      </span>
      <DropdownButton label="Deploy" options={OPTIONS} split={false} />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
        Empty menu
      </span>
      <DropdownButton label="Deploy" options={[]} />
    </div>
  </div>
);

export default SplitVersusSingle;
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Dropdown Button",description:"A Button with an optional caret trigger that opens a menu. The trigger keeps the full Button language — variant, size and tone — while the menu takes its positioning from DropdownMenu, and an empty menu hides the caret entirely."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Every variant",description:"All button variants at one tone and size, each with a working menu.",code:Y,filename:"EveryVariant.tsx",children:e.jsx(J,{})}),e.jsx(l,{title:"Size ladder",description:"The shared control scale, solid blue.",code:ee,filename:"SizeLadder.tsx",children:e.jsx(X,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:ae,filename:"EveryTone.tsx",children:e.jsx(ne,{})}),e.jsx(l,{title:"Split versus single",description:"The default split trigger, the collapsed single trigger, and an empty menu that hides the caret.",code:oe,filename:"SplitVersusSingle.tsx",children:e.jsx(se,{})})]}),e.jsxs(R,{children:[e.jsx(d,{title:"Screen reader",children:e.jsxs("p",{children:["The two halves announce differently on purpose: the primary button is just its label; the caret is a second button named ",e.jsx(r,{children:"caretLabel"})," ","(defaulting to the localized “Toggle dropdown menu”) carrying ",e.jsx(r,{children:'aria-haspopup="menu"'})," and a live"," ",e.jsx(r,{children:"aria-expanded"}),". The open menu is a proper"," ",e.jsx("code",{children:'role="menu"'})," of"," ",e.jsx("code",{children:'role="menuitem"'}),"s — descriptions become the item’s accessible description, disabled items are natively disabled, and only one item sits in the tab order at a time (roving tabindex). The caret’s name used to be hardcoded English; it now comes from the kit catalogs (en/de/es/fr/pt)."]})}),e.jsx(d,{title:"Keyboard Support",children:e.jsxs("p",{children:[e.jsx(n,{children:"Tab"})," reaches the primary button, then the caret. Opening the menu (click, ",e.jsx(n,{children:"Enter"})," or ",e.jsx(n,{children:"Space"})," on the caret) moves focus straight to the first enabled item — from there"," ",e.jsx(n,{children:"ArrowDown"}),"/",e.jsx(n,{children:"ArrowUp"})," walk the items skipping disabled ones, ",e.jsx(n,{children:"Home"}),"/",e.jsx(n,{children:"End"})," jump to the ends,"," ",e.jsx(n,{children:"Enter"})," activates. ",e.jsx(n,{children:"Escape"})," closes and returns focus to the caret; ",e.jsx(n,{children:"Tab"})," closes without trapping, matching the ARIA menu pattern. An outside click closes but does ",e.jsx("em",{children:"not"})," yank focus back — if the user clicked another control, focus stays where they put it."]})}),e.jsx(d,{title:"Internationalization",children:e.jsxs("p",{children:["The only string the control owns is the caret’s accessible name, and it is cataloged; everything else — labels, option text, descriptions — is caller data and localizes with the page. Give",e.jsx(r,{children:"caretLabel"})," the specific thing the menu does (“Deploy options”) when a list of buttons sits side by side — “Toggle dropdown menu” repeated five times reads as five identical, anonymous stops."]})})]}),e.jsx(U,{props:[{name:"label",type:"ReactNode",description:"The primary button's content. Its accessible name — keep it a verb (Deploy, Export)."},{name:"options",type:"DropdownButtonOption[]",description:"`{ value, label, description?, icon?, disabled?, danger? }`. Empty hides the caret (see below) — the control becomes a plain button."},{name:"onPrimaryClick",type:"(event) => void",description:"The default action on the wide button. Caret clicks never fire it, primary clicks never open the menu."},{name:"onOptionSelect",type:"(option) => void",description:"Fires on an enabled item, then closes the menu. Disabled items are inert."},{name:"split",type:"boolean",default:"true",description:"Split gives the caret its own full button width; single collapses it to an icon-only trigger joined to the main button."},{name:"hideDropdownTriggerWhenEmpty",type:"boolean",default:"true",description:"With `false`, an option-less button keeps a visible — disabled — caret."},{name:"menuWidth",type:'number | "trigger"',default:"220",description:"Menu width in px, or match the trigger. (The playground defaults to `trigger` to show the anchored sizing.)"},{name:"caretLabel",type:"string",default:'t("kit.dropdownbutton.toggle")',description:"Accessible name for the caret — override per control for lists of buttons."},{name:"variant / color / size",type:"ButtonVariant / TrueColor / ButtonSize",default:'"solid" / "blue" / "md"',description:"The Button language, Button's own vocabularies — `color`, not `tone`, same as Button. `clear` is deliberately absent: a borderless button has no surface for the caret seam, so the split would read as text beside a mystery box. JS callers passing it get `ghost`."},{name:"dropdownIcon",type:'ButtonProps["leadingIcon"]',default:'"ArrowDown"',description:"The caret glyph."},{name:"fullWidth / disabled",type:"boolean",default:"false",description:"Full width makes the main button flex; disabled takes out both halves."},{name:"menuClassName / className",type:"string",description:"`className` lands on the wrapper (both halves + menu host), `menuClassName` on the menu."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Remaining ",e.jsx("code",{children:"ButtonProps"})," (icons, loading, corner, onClick, html type…) spread onto the ",e.jsx("em",{children:"primary button only"}),". The menu itself is"," ",e.jsx("code",{children:"DropdownMenu"})," — a separate component with its own page — teleported to ",e.jsx("code",{children:"document.body"})," and anchored to the control."]})]});export{me as DropdownButtonPage,me as default};
