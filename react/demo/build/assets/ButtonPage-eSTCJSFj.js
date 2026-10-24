import{r as t,j as e,P as te,i as n,C as ne,M as x,q as se}from"./index-gt012o8E.js";import{P as ae}from"./PageHeader-CzVhyXQL.js";import{E as l}from"./ExampleCard-V3REeYJ5.js";import{A as oe,a as m,C as s,c as g,P as ie}from"./A11ySections-zw3_3X-2.js";import{P as le,S as b,a as r,T as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as re}from"./ControlAccordion-DIXHht2n.js";import{u as ce,E as de}from"./EventLog-Dx0vbma4.js";import{t as he,u as ue,v as pe,m as xe,n as me,l as ge}from"./options-CtADNKbm.js";const be=()=>{const[i,O]=t.useState("solid"),[f,E]=t.useState("md"),[j,L]=t.useState("normal"),[v,P]=t.useState("blue"),[y,R]=t.useState(!1),[S,V]=t.useState(!1),[k,W]=t.useState(!1),[c,G]=t.useState(!1),[C,M]=t.useState(!1),[d,F]=t.useState(!1),[w,D]=t.useState(!1),[q,H]=ce(),[h,U]=t.useState(!1),[B,_]=t.useState(!1),[u,K]=t.useState(!1),[p,J]=t.useState("#ef4444"),[I,Q]=t.useState(!1),[T,X]=t.useState(!1),[N,Y]=t.useState("medium"),[z,Z]=t.useState("frosted"),[A,$]=t.useState("none"),ee=d?h?"Search":"Star":h?"Search":void 0;return e.jsx(le,{controls:e.jsxs(e.Fragment,{children:[e.jsx(re,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Variant",options:he,value:i,onChange:a=>O(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(b,{label:"Size",options:ue,value:f,onChange:a=>E(a)}),e.jsx(b,{label:"Weight",options:pe,value:j,onChange:a=>L(a)})]}),e.jsx(r,{label:"Color",children:e.jsx(ne,{selectable:!0,size:"sm",value:v,onSelect:P,defaultExpanded:!0})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Loading",checked:y,onChange:R}),e.jsx(o,{label:"Disabled",checked:S,onChange:V}),e.jsx(o,{label:"Active",checked:k,onChange:W}),e.jsx(o,{label:"Glass",checked:c,onChange:G}),e.jsx(o,{label:"Accent",checked:C,onChange:M}),e.jsx(o,{label:"Tooltip",checked:I,onChange:Q})]})},{id:"icons",title:"Icons",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Icon only",checked:d,onChange:F}),e.jsx(o,{label:"Leading icon",checked:h,onChange:U}),e.jsx(o,{label:"Trailing icon",checked:B,onChange:_}),e.jsx(o,{label:"Icon color",checked:u,onChange:K})]}),u&&e.jsx(r,{label:"Icon color (override)",children:e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"color",value:p,onChange:a=>J(a.target.value),className:"h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600","aria-label":"Icon color"}),e.jsx("span",{className:"font-mono text-sm opacity-70",children:p})]})})]})},{id:"layout",title:"Layout",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Full width",checked:w,onChange:D}),e.jsx(o,{label:"On a glass panel",checked:T,onChange:X})]})},...c?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{label:"Vibrancy",children:e.jsx(x,{fullWidth:!0,size:"sm",options:xe,value:N,onChange:a=>Y(a)})}),e.jsx(r,{label:"Fill",children:e.jsx(x,{fullWidth:!0,size:"sm",options:me,value:z,onChange:a=>Z(a)})}),e.jsx(r,{label:"Specular",children:e.jsx(x,{fullWidth:!0,size:"sm",options:ge,value:A,onChange:a=>$(a)})})]})}]:[]]}),e.jsx(de,{log:q,emptyText:"No events yet — press the button."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Solid"})," in ",e.jsx("strong",{children:"blue"})," at ",e.jsx("code",{children:"md"})," ","is the kit default — the shared control scale sets the padding, the gap and the icon size, and the corner is the same"," ",e.jsx("code",{children:"rounded-lg"})," as an ",e.jsx("code",{children:"Input"}),", so a button beside a field reads as one box. Glass, specular and accent knobs only matter for the styles that paint those layers."]})]}),preview:e.jsx(te,{variant:T?"glass":"elevated",padding:"md",children:e.jsx(n,{variant:i,size:f,weight:j,color:v,loading:y,disabled:S,active:k,glass:c,accent:C,iconOnly:d,fullWidth:w,vibrancy:N,glassOpacity:z,specularMode:A,leadingIcon:ee,trailingIcon:B?"ArrowRight":void 0,iconColor:u?p:void 0,tooltip:I?"A button with a tooltip":void 0,onClick:()=>H("clicked"),children:"Button Label"})})})};function fe(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{variant:"solid",color:"blue",children:"Solid"}),e.jsx(n,{variant:"soft",color:"blue",children:"Soft"}),e.jsx(n,{variant:"outline",color:"blue",children:"Outline"}),e.jsx(n,{variant:"ghost",color:"blue",children:"Ghost"}),e.jsx(n,{variant:"link",color:"blue",children:"Link"}),e.jsx(n,{variant:"clear",color:"blue",children:"Clear"})]})}const je=`import { Button } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="blue">
        Solid
      </Button>
      <Button variant="soft" color="blue">
        Soft
      </Button>
      <Button variant="outline" color="blue">
        Outline
      </Button>
      <Button variant="ghost" color="blue">
        Ghost
      </Button>
      <Button variant="link" color="blue">
        Link
      </Button>
      <Button variant="clear" color="blue">
        Clear
      </Button>
    </div>
  );
}
`;function ve(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{size:"xs",children:"Extra small"}),e.jsx(n,{size:"sm",children:"Small"}),e.jsx(n,{size:"md",children:"Medium"}),e.jsx(n,{size:"lg",children:"Large"}),e.jsx(n,{size:"xl",children:"Extra large"})]})}const ye=`import { Button } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra large</Button>
    </div>
  );
}
`;function Se(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{loading:!0,children:"Saving…"}),e.jsx(n,{disabled:!0,children:"Disabled"}),e.jsx(n,{variant:"soft",color:"rose",disabled:!0,children:"Disabled soft"})]})}const ke=`import { Button } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button loading>Saving…</Button>
      <Button disabled>Disabled</Button>
      <Button variant="soft" color="rose" disabled>
        Disabled soft
      </Button>
    </div>
  );
}
`;function Ce(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsx(n,{leadingIcon:"Search",children:"Search"}),e.jsx(n,{trailingIcon:"ArrowRight",variant:"soft",children:"Continue"}),e.jsx(n,{variant:"icon",leadingIcon:"Close","aria-label":"Close"})]})}const we=`import { Button } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon="Search">Search</Button>
      <Button trailingIcon="ArrowRight" variant="soft">
        Continue
      </Button>
      <Button variant="icon" leadingIcon="Close" aria-label="Close" />
    </div>
  );
}
`;function Be(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:se.map(i=>e.jsx(n,{variant:"solid",color:i,children:i},i))})}const Ie=`import { Button, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function AllTones() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Button key={each} variant="solid" color={each}>
          {each}
        </Button>
      ))}
    </div>
  );
}
`,Te=["solid","soft","outline","ghost"];function Ne(){return e.jsx("div",{className:"grid gap-3 md:grid-cols-2",children:Te.map(i=>e.jsx(n,{variant:i,active:!0,children:i},i))})}const ze=`import { Button } from "@cjlapao/ui-kit";

const VARIANTS = ["solid", "soft", "outline", "ghost"] as const;

export default function Active() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {VARIANTS.map((each) => (
        <Button key={each} variant={each} active>
          {each}
        </Button>
      ))}
    </div>
  );
}
`,Ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ae,{name:"Button",description:"The primary action control. Eight variants, five sizes, four label weights and every true color — plus loading, disabled and icon states, all on one component."}),e.jsx(be,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"From the loudest solid primary to a nearly invisible clear button.",code:je,filename:"Variants.tsx",children:e.jsx(fe,{})}),e.jsx(l,{title:"Sizes",description:"The shared control scale, from xs for dense toolbars up to xl for empty states.",code:ye,filename:"Sizes.tsx",children:e.jsx(ve,{})}),e.jsx(l,{title:"States",description:"Loading keeps the spinner bright while blocking input; disabled dims the label and the control.",code:ke,filename:"States.tsx",children:e.jsx(Se,{})}),e.jsx(l,{title:"Icons",description:"Leading and trailing icons from the registry by name, and the icon-only variant for compact toolbars.",code:we,filename:"Icons.tsx",children:e.jsx(Ce,{})}),e.jsx(l,{title:"All tones",description:"Every one of the 21 true colours as a solid button, fixed size.",code:Ie,filename:"AllTones.tsx",children:e.jsx(Be,{})}),e.jsx(l,{title:"Pressed",description:"The active prop is the persistent “on” state — a toggle that stays lit, distinct from the hover and focus styles.",code:ze,filename:"Active.tsx",children:e.jsx(Ne,{})})]}),e.jsxs(oe,{children:[e.jsxs(m,{title:"Screen reader",children:[e.jsxs("p",{children:["A ",e.jsx("code",{children:"<button>"})," is the whole semantic story — no listbox theatre, no fake roles. What the button is ",e.jsx("em",{children:"for"})," is what matters, so an unnamed one is treated as a bug: in development the kit warns (",e.jsx(s,{children:"warnIfMissingName"}),") when a Button has neither children nor an ",e.jsx(s,{children:"aria-label"}),", and an icon-only button renders an sr-only label — the visible children, else the ",e.jsx(s,{children:"aria-label"}),", else a localised fallback (",e.jsx(s,{children:"kit.button.name"}),") so it is at least announced as ",e.jsx("em",{children:"something"})," in the user’s language. An"," ",e.jsx(s,{children:"aria-hidden"})," on an enabled Button also warns — it would hide a control that is still in the tab order."]}),e.jsxs("p",{children:[e.jsx(s,{children:"loading"})," sets ",e.jsx(s,{children:"aria-busy"})," on the button and hides the spinner from readers (",e.jsx(s,{children:"aria-hidden"}),") — the busy state is the announcement, not a spinning glyph. ",e.jsx(s,{children:"disabled"})," is the native attribute, which removes the button from the tab order and the accessibility tree exactly as intended; a real ",e.jsx("code",{children:"disabled"})," ","always beats a click-blocker. A ",e.jsx(s,{children:"tooltip"})," is portalled with"," ",e.jsx(s,{children:'role="tooltip"'})," and, while visible, linked to the button via"," ",e.jsx(s,{children:"aria-describedby"}),", so it is spoken with the name."]})]}),e.jsxs(m,{title:"Keyboard Support",children:[e.jsxs("p",{children:["Native behaviour is kept whole: ",e.jsx(g,{children:"Tab"})," reaches it,"," ",e.jsx(g,{children:"Enter"})," and ",e.jsx(g,{children:"Space"})," activate it, disabled skips it. Every variant and every accent/glass layer carries a"," ",e.jsx(s,{children:"focus-visible"})," ring — no mouse-click can produce one, but keyboard focus always can. ",e.jsx(s,{children:"type"})," defaults to"," ",e.jsx("code",{children:'"button"'}),", not the HTML default ",e.jsx("code",{children:'"submit"'}),": a Button inside a ",e.jsx("code",{children:"<form>"})," used to fire the form on a stray Enter; an explicit ",e.jsx(s,{children:'type="submit"'})," still opts in.",e.jsx(s,{children:"loading"})," also blocks the click (the attribute is set, the spinner kept bright — ",e.jsx("code",{children:"disabled:opacity-50"})," is skipped while loading so the one element that must stay visible does)."]}),e.jsxs("p",{children:["A ",e.jsx(s,{children:"tooltip"})," answers to focus as well as hover — pointer-only hints are invisible to keyboard drivers — and appears instantly on focus rather than after the hover delay."]})]}),e.jsx(m,{title:"Internationalization",children:e.jsxs("p",{children:["Button is mostly language-free: the label, tooltip text and accessible name are the caller’s and pass through untouched. The one built-in string is the icon-only fallback name —"," ",e.jsx(s,{children:"kit.button.name"}),", five locales — used only when nothing else names the control. Icons come from the registry by name, so they carry no words at all. Want a new language? Layer ",e.jsx(s,{children:"kit.button.*"})," keys in your own catalogs — the i18n page shows the override live."]})})]}),e.jsx(ie,{props:[{name:"variant",type:"ButtonVariant",default:'"solid"',description:"solid · soft · outline · ghost · link · clear · icon · glass — solid is the primary action, ghost/link the quiet ones, icon the compact toolbar square."},{name:"color",type:"TrueColor",default:'"blue"',description:"The kit's 21 true colours; every fill, hover, ring and glass tint derives from it."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — padding, label type, icon size and spinner size all derive from it. xs for dense toolbars up to xl for empty states."},{name:"weight",type:"ButtonWeight",default:'"normal"',description:"Label font weight: normal through bold."},{name:"leadingIcon / trailingIcon",type:"string | ReactElement",description:"Registry name or a rendered element. Icons paint with `currentColor` and match the label; `iconColor` tints the glyph alone."},{name:"iconOnly",type:"boolean",description:'Square icon button; the accessible name comes from children, `aria-label`, or the localised fallback — never silence. (`variant="icon"` implies it.)'},{name:"loading",type:"boolean",description:"Spinner replaces the icon, `aria-busy` appears, clicks are blocked without dimming the spinner, and the trailing icon steps aside for it."},{name:"disabled",type:"boolean",description:"Native attribute; dims the whole control and leaves the tab order."},{name:"active",type:"boolean",description:'Persistent lit "on" state with hover suppressed — a toggle that stays visibly pressed. `accentColor` overrides which colour lights it.'},{name:"accent / accentColor",type:"boolean / TrueColor",description:'"The parent owns the fill": the variant\'s fill drops out and only the accent ring and hover wash remain. `accentColor` alone swaps just the hover colour.'},{name:"glass / vibrancy / glassOpacity / specularMode",type:"boolean / GlassVibrancy / GlassOpacity / SpecularMode",description:'Translucent chrome with backdrop vibrancy and an optional specular overlay. `variant="glass"` implies `glass`; the tuning knobs apply to either.'},{name:"tooltip / tooltipPosition",type:"string / TooltipPosition",description:"Portalled styled tooltip on hover and focus, described to screen readers while visible."},{name:"fullWidth",type:"boolean",description:"Stretch to the container — form actions, mobile sheets."},{name:"type",type:'"button" | "submit" | "reset"',default:'"button"',description:"Overrides HTML's submit-by-default so a button in a form does not submit it by accident."}]}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Spreads native button attributes — ",e.jsx("code",{children:"onClick"}),","," ",e.jsx("code",{children:"aria-*"}),", ",e.jsx("code",{children:"data-*"})," pass straight through, and the dev-mode name warning listens to the ones you set there too."]})]});export{Ge as ButtonPage,Ge as default};
