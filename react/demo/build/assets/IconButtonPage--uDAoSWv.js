import{r as a,j as e,P,p as t,C as D,c2 as V,v as G,q as U}from"./index-B9JeX19j.js";import{P as _}from"./PageHeader-D-LFwZLT.js";import{E as c}from"./ExampleCard-BwESxlwz.js";import{A as M,a as u,C as r,c as p,P as q}from"./A11ySections-C9rTCDac.js";import{P as F,S as h,a as H,T as o}from"./PlaygroundPanel-CZvYEX_V.js";import{C as Z}from"./ControlAccordion-rp4gabXb.js";import{u as $,E as K}from"./EventLog-EYY1E4QF.js";import{t as W,d as J,F as Q,l as X}from"./options-Blq0niUd.js";const Y=()=>{const[n,s]=a.useState("icon"),[x,N]=a.useState("md"),[m,k]=a.useState("blue"),[g,T]=a.useState("full"),[b,C]=a.useState(!1),[f,L]=a.useState(!1),[v,z]=a.useState(!1),[d,E]=a.useState(!1),[j,R]=a.useState(!1),[S,I]=a.useState("none"),[w,A]=a.useState(!1),[B,O]=$();return e.jsx(F,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:W,value:n,onChange:l=>s(l)}),e.jsx(h,{label:"Size",options:J,value:x,onChange:l=>N(l)}),e.jsx(H,{label:"Tone",children:e.jsx(D,{selectable:!0,size:"sm",value:m,onSelect:k,defaultExpanded:!0})}),e.jsx(h,{label:"Corner",options:Q,value:g,onChange:l=>T(l)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Loading",checked:b,onChange:C}),e.jsx(o,{label:"Disabled",checked:f,onChange:L}),e.jsx(o,{label:"Accent",checked:v,onChange:z}),e.jsx(o,{label:"Glass",checked:d,onChange:E}),e.jsx(o,{label:"Tooltip",checked:j,onChange:R}),e.jsx(o,{label:"Glass panel",checked:w,onChange:A})]})},...d?[{id:"glass",title:"Glass",controls:e.jsx(h,{label:"Specular",options:X,value:S,onChange:l=>I(l)})}]:[]]}),e.jsx(K,{log:B,emptyText:"No events yet — press the icon button."}),e.jsxs("p",{className:"text-xs opacity-70",children:["Icon buttons carry no text — the ",e.jsx("strong",{children:"srLabel"})," is what gets announced and doubles as the native title (a styled"," ",e.jsx("strong",{children:"tooltip"})," replaces the native one, never doubling). Loading swaps the glyph for a spinner and blocks clicks — without dimming, or the spinner would fade with the button. The default"," ",e.jsx("code",{children:"rounded"})," is ",e.jsx("code",{children:"full"}),": a circle, the icon button’s identity."]})]}),preview:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(P,{variant:w?"glass":"elevated",padding:"md",children:e.jsx(t,{icon:"Send",variant:n,color:m,size:x,rounded:g,loading:b,disabled:f,accent:v,glass:d,specularMode:d?S:"none",tooltip:j?"Send message":void 0,tooltipPosition:"top",srLabel:"Send",onClick:()=>O("clicked")})})})})},ee=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:V.map(n=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(t,{icon:"Send",variant:n,color:"blue",size:"md",srLabel:n}),e.jsx("span",{className:"text-sm opacity-70",children:n})]},n))}),ne=`import { BUTTON_VARIANTS, IconButton } from "@cjlapao/ui-kit";

const EveryVariant = () => (
  <div className="grid w-full gap-3 sm:grid-cols-2">
    {BUTTON_VARIANTS.map((variant) => (
      <div key={variant} className="flex items-center gap-3">
        <IconButton
          icon="Send"
          variant={variant}
          color="blue"
          size="md"
          srLabel={variant}
        />
        <span className="text-sm opacity-70">{variant}</span>
      </div>
    ))}
  </div>
);

export default EveryVariant;
`,te=["md","lg","xl","full"],y=({label:n,children:s})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[s,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),ae=()=>e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"flex flex-wrap items-end gap-3",children:G.map(n=>e.jsx(y,{label:n,children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:n,srLabel:n})},n))}),e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:te.map(n=>e.jsx(y,{label:n,children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:"lg",rounded:n,srLabel:n})},n))})]}),se=`import { CONTROL_SIZES, IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const ROUNDED = ["md", "lg", "xl", "full"] as const;

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const SizeAndCorner = () => (
  <div className="flex w-full flex-col gap-6">
    <div className="flex flex-wrap items-end gap-3">
      {CONTROL_SIZES.map((size) => (
        <Swatch key={size} label={size}>
          <IconButton
            icon="Send"
            variant="solid"
            color="blue"
            size={size}
            srLabel={size}
          />
        </Swatch>
      ))}
    </div>
    <div className="flex flex-wrap items-end gap-4">
      {ROUNDED.map((rounded) => (
        <Swatch key={rounded} label={rounded}>
          <IconButton
            icon="Send"
            variant="solid"
            color="blue"
            size="lg"
            rounded={rounded}
            srLabel={rounded}
          />
        </Swatch>
      ))}
    </div>
  </div>
);

export default SizeAndCorner;
`,le=({label:n,children:s})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[s,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),oe=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-3",children:U.map(n=>e.jsx(le,{label:n,children:e.jsx(t,{icon:"Send",variant:"solid",color:n,size:"md",srLabel:n})},n))}),ie=`import { IconButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const EveryTone = () => (
  <div className="flex w-full flex-wrap items-end gap-3">
    {TRUE_COLORS.map((color) => (
      <Swatch key={color} label={color}>
        <IconButton
          icon="Send"
          variant="solid"
          color={color}
          size="md"
          srLabel={color}
        />
      </Swatch>
    ))}
  </div>
);

export default EveryTone;
`,i=({label:n,children:s})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[s,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),ce=()=>e.jsxs("div",{className:"flex w-full flex-wrap items-end gap-4",children:[e.jsx(i,{label:"Default",children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:"lg",srLabel:"Default"})}),e.jsx(i,{label:"Loading",children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:"lg",loading:!0,srLabel:"Loading"})}),e.jsx(i,{label:"Disabled",children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:"lg",disabled:!0,srLabel:"Disabled"})}),e.jsx(i,{label:"Accent",children:e.jsx(t,{icon:"Send",variant:"soft",color:"blue",size:"lg",accent:!0,srLabel:"Accent"})}),e.jsx(i,{label:"Icon tint",children:e.jsx(t,{icon:"Star",variant:"soft",color:"neutral",size:"lg",iconColor:"red",srLabel:"Tinted icon"})}),e.jsx(i,{label:"Tooltip",children:e.jsx(t,{icon:"Send",variant:"solid",color:"blue",size:"lg",tooltip:"Hover me",tooltipPosition:"top",srLabel:"Tooltip"})})]}),re=`import { IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const States = () => (
  <div className="flex w-full flex-wrap items-end gap-4">
    <Swatch label="Default">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        srLabel="Default"
      />
    </Swatch>
    <Swatch label="Loading">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        loading
        srLabel="Loading"
      />
    </Swatch>
    <Swatch label="Disabled">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        disabled
        srLabel="Disabled"
      />
    </Swatch>
    <Swatch label="Accent">
      <IconButton
        icon="Send"
        variant="soft"
        color="blue"
        size="lg"
        accent
        srLabel="Accent"
      />
    </Swatch>
    <Swatch label="Icon tint">
      <IconButton
        icon="Star"
        variant="soft"
        color="neutral"
        size="lg"
        iconColor="red"
        srLabel="Tinted icon"
      />
    </Swatch>
    <Swatch label="Tooltip">
      <IconButton
        icon="Send"
        variant="solid"
        color="blue"
        size="lg"
        tooltip="Hover me"
        tooltipPosition="top"
        srLabel="Tooltip"
      />
    </Swatch>
  </div>
);

export default States;
`,de=["none","classic","halo"],pe=({label:n,children:s})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[s,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),he=()=>e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:de.map(n=>e.jsx(pe,{label:n,children:e.jsx(t,{icon:"Search",variant:"glass",color:"blue",size:"lg",specularMode:n,srLabel:n})},n))})}),ue=`import { IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const SPECULAR_MODES = ["none", "classic", "halo"] as const;

const Swatch = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
  </div>
);

const Glass = () => (
  <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
    <div className="flex flex-wrap items-end gap-4">
      {SPECULAR_MODES.map((mode) => (
        <Swatch key={mode} label={mode}>
          <IconButton
            icon="Search"
            variant="glass"
            color="blue"
            size="lg"
            specularMode={mode}
            srLabel={mode}
          />
        </Swatch>
      ))}
    </div>
  </div>
);

export default Glass;
`,we=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Icon Button",description:"A square icon-only control. The full Button palette — variant, size, tone — plus corner radius, loading, accent and icon tint, glass fill with specular highlights, and a styled tooltip."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Every variant",description:"All button variants at one tone and size.",code:ne,filename:"EveryVariant.tsx",children:e.jsx(ee,{})}),e.jsx(c,{title:"Size and corner",description:"The shared control scale, then the four corner radii at lg.",code:se,filename:"SizeAndCorner.tsx",children:e.jsx(ae,{})}),e.jsx(c,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:ie,filename:"EveryTone.tsx",children:e.jsx(oe,{})}),e.jsx(c,{title:"States",description:"Default, loading, disabled, accent, a tinted icon and a tooltip — hover and press these.",code:re,filename:"States.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"Glass",description:"The glass variant with the three specular highlight modes on a coloured backdrop.",code:ue,filename:"Glass.tsx",children:e.jsx(he,{})})]}),e.jsxs(M,{children:[e.jsx(u,{title:"Screen reader",children:e.jsxs("p",{children:["A square of icon with a name attached: ",e.jsx(r,{children:"srLabel"})," (or"," ",e.jsx(r,{children:"aria-label"}),", which wins) becomes both the accessible name and the native tooltip, and an ",e.jsx("code",{children:"sr-only"})," span guarantees the button can never render nameless. The glyph itself stays decorative — rendered ",e.jsx("code",{children:"aria-hidden"})," — so the icon’s own SVG title never double-speaks. When a styled ",e.jsx(r,{children:"tooltip"})," is set the native"," ",e.jsx("code",{children:"title"})," is dropped rather than doubling up. A"," ",e.jsx("code",{children:"loading"})," button swaps the glyph for a spinner that is itself ",e.jsx("code",{children:"aria-hidden"}),": the name stays the action’s, not “loading”, so the announcement never goes stale mid-click."]})}),e.jsx(u,{title:"Keyboard Support",children:e.jsxs("p",{children:["A real ",e.jsx("code",{children:"button"})," element, so ",e.jsx(p,{children:"Enter"})," and"," ",e.jsx(p,{children:"Space"})," activate it and ",e.jsx(p,{children:"Tab"})," reaches it — nothing exotic. It defaults to ",e.jsx(r,{children:'type="button"'}),", which matters more here than it sounds: the native default is ",e.jsx("code",{children:"submit"}),", and an icon button dropped into a form without thinking used to submit it. ",e.jsx(p,{children:"Tab"})," focus shows the tone-coloured ring;"," ",e.jsx("code",{children:"disabled"})," and ",e.jsx("code",{children:"loading"})," both take it out of the tab order — because they set the real ",e.jsx("code",{children:"disabled"})," attribute, not a fake ",e.jsx("code",{children:"aria-disabled"})," lookalike."]})}),e.jsx(u,{title:"Internationalization",children:e.jsxs("p",{children:["The label is the whole of the control’s text, so it must be translated like any other string — a translated page full of untranslated icon buttons is the classic gap. Pass a localized",e.jsx(r,{children:"srLabel"}),"; it serves the screen reader, the native tooltip and the fallback name at once. The spinner’s own status text is kit-cataloged (en/de/es/fr/pt)."]})})]}),e.jsx(q,{props:[{name:"icon",type:"string | ReactElement",description:"A registry icon name (see the Icon Registry page) or your own element. Elements you pass should be decorative — aria-hidden — and let the label do the naming."},{name:"srLabel",type:"string",default:'"Icon button"',description:"The accessible name, and the native title when no styled tooltip is set. This is the prop that makes an icon button usable — never rely on the fallback."},{name:"variant",type:"ButtonVariant",default:'"icon"',description:"The Button vocabulary. The icon default is the soft tinted square; solid/soft/outline/glass behave as everywhere else."},{name:"color",type:"TrueColor",default:'"blue"',description:"Tone — fill, text, ring and spinner all follow it."},{name:"size",type:"ButtonSize",default:'"md"',description:"The shared control scale: the box and glyph step together, so an md icon button aligns with an md input."},{name:"rounded",type:'"md" | "lg" | "xl" | "full"',default:'"full"',description:"Corner radius. The circle is the identity; pick a Button-matching corner for squares."},{name:"loading",type:"boolean",default:"false",description:"Spinner replaces the glyph, clicks are blocked, and the button is disabled without dimming — so the spinner, the one signal that work is happening, stays visible."},{name:"accent",type:"boolean",default:"false",description:"The parent owns the fill (a toolbar button on a coloured bar): the glyph inherits, a tone ring and hover wash keep it focusable-looking. accentColor picks the ring tone."},{name:"iconColor",type:"string",description:"Raw CSS colour for the glyph only. Omit it and the icon inherits the button's text colour, so hover states repaint the glyph too."},{name:"tooltip / tooltipPosition",type:"string / TooltipPosition",default:'"top"',description:"Styled tooltip; setting it drops the native title."},{name:"glass / vibrancy / glassOpacity / specularMode",type:"boolean / GlassVibrancy / GlassOpacity / SpecularMode",default:"false / medium / clear — frosted for a Button, clear here / none",description:'Translucent chrome; `variant="glass"` auto-enables the same path.'},{name:"customSizeClass",type:"string",description:"Escape hatch replacing the computed box size class. Prefer `size`."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Remaining native button attributes (onClick, onFocus, data-*, form overrides…) pass straight through to the ",e.jsx("code",{children:"button"})," — except"," ",e.jsx("code",{children:"type"}),", which defaults to ",e.jsx("code",{children:"button"})," and can still be overridden when you genuinely want a submit button."]})]});export{we as IconButtonPage,we as default};
