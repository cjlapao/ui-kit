import{r as a,j as e,P as re,bi as s,C as ce,c as de,eQ as pe,bl as he}from"./index-ChbzYKtA.js";import{P as xe}from"./PageHeader-CORco2N-.js";import{E as r}from"./ExampleCard-Db5NXgWv.js";import{A as ue,a as w,C as l,b as be,K as me,P as ge}from"./A11ySections-Ci0MCORB.js";import{P as fe,S as p,a as m,C as j,T as i}from"./PlaygroundPanel-CZxrTOj5.js";import{C as ve}from"./ControlAccordion-DoyyLWlc.js";import{u as ye,E as we}from"./EventLog-AWfnu5cV.js";import{D as je,c as Se,Q as Ne,R as ke,S as Ce,T as Ee,U as Te,V as Le,x as Oe}from"./options-C-rzDbtC.js";const I={bouncy:600,snappy:380,gentle:900,precise:320},ze=()=>{const[n,o]=a.useState("icon"),[d,H]=a.useState("md"),[S,V]=a.useState("blue"),[N,F]=a.useState("full"),[k,G]=a.useState("hover"),[u,$]=a.useState("bouncy"),[C,U]=a.useState("pop-tilt"),[g,q]=a.useState(600),[f,_]=a.useState(500),[h,W]=a.useState(!1),[E,K]=a.useState(!1),[T,Q]=a.useState(!0),[b,X]=a.useState(!1),[L,J]=a.useState("none"),[v,Y]=a.useState(!1),[O,Z]=a.useState("segments"),[z,ee]=a.useState(!1),[B,ne]=a.useState(!1),[R,te]=a.useState(!1),[P,ae]=a.useState(!1),[y,se]=a.useState("Save changes"),[A,le]=a.useState("after"),[oe,M]=ye(),ie=R;return e.jsx(fe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ve,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:je,value:n,onChange:t=>o(t)}),e.jsx(p,{label:"Size",options:Se,value:d,onChange:t=>H(t)}),e.jsx(m,{label:"Tone",children:e.jsx(ce,{selectable:!0,size:"sm",value:S,onSelect:V,defaultExpanded:!0})}),e.jsx(p,{label:"Corner",options:Ne,value:N,onChange:t=>F(t)})]})},{id:"physics",title:"Physics",defaultOpen:!0,controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(p,{label:"Expand on",options:ke,value:k,onChange:t=>G(t)}),e.jsx(m,{label:`Collapse delay — ${f} ms`,children:e.jsx("input",{type:"range",min:0,max:1500,step:50,value:f,onChange:t=>_(Number(t.target.value)),"aria-label":"Hover collapse delay in milliseconds",className:"w-full accent-blue-500"})}),e.jsx(j,{label:"Spring",options:Ce,value:u,onChange:t=>$(t)}),e.jsx(p,{label:"Icon motion",options:Ee,value:C,onChange:t=>U(t)}),e.jsx(m,{label:h?`Duration — ${g} ms`:`Duration — ${I[u]} ms (preset)`,children:e.jsx("input",{type:"range",min:150,max:1200,step:20,value:h?g:I[u],disabled:!h,onChange:t=>q(Number(t.target.value)),className:"w-full accent-blue-500 disabled:opacity-50","aria-label":"Spring duration in milliseconds"})}),e.jsx(i,{label:"Override duration",checked:h,onChange:W}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Elevate",checked:E,onChange:K}),e.jsx(i,{label:"Squish",checked:T,onChange:Q}),e.jsx(i,{label:"Glass",checked:b,onChange:X}),e.jsx(i,{label:"Loading",checked:v,onChange:Y}),e.jsx(i,{label:"Disabled",checked:z,onChange:ee}),e.jsx(i,{label:"Tooltip",checked:B,onChange:ne}),e.jsx(i,{label:"Force open",checked:R,onChange:te}),e.jsx(i,{label:"Glass panel",checked:P,onChange:ae})]}),v&&e.jsx(j,{label:"Spinner type",options:Te,value:O,onChange:t=>Z(t)})]})},{id:"label",title:"Label",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Label text",children:e.jsx(de,{size:"sm",value:y,placeholder:"Save changes","aria-label":"Button label",onChange:t=>se(t.target.value)})}),e.jsx(j,{label:"Placement",options:Le,value:A,onChange:t=>le(t)})]})},...b?[{id:"glass",title:"Glass",controls:e.jsx(p,{label:"Specular",options:Oe,value:L,onChange:t=>J(t)})}]:[]]}),e.jsx(we,{log:oe,emptyText:"No events yet — hover or press the button."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The resting control is a circle; the label rides out on a spring whose overshoot is the whole illusion. ",e.jsx("strong",{children:"Expand on"})," ","decides who owns that open state: ",e.jsx("code",{children:"hover"}),","," ",e.jsx("code",{children:"hover+focus"})," use a rectangular hover area and delayed collapse; ",e.jsx("code",{children:"focus"})," stays CSS-driven. ",e.jsx("code",{children:"click"})," ","toggles React state, and"," ",e.jsx("code",{children:"always"})," writes it outright — the pointer has nothing to do with it."," ",e.jsx("strong",{children:"Force open"})," pins any trigger through"," ",e.jsx("code",{children:"expanded"}),", and a control that owns its open state stops answering hover and focus altogether."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(re,{variant:P?"glass":"elevated",padding:"md",children:e.jsx(s,{icon:"Send",label:y,variant:n,color:S,size:d,rounded:N,expandOn:k,collapseDelay:f,expanded:ie?!0:void 0,spring:u,springDuration:h?g:void 0,iconMotion:C,elevate:E,squish:T,glass:b,specularMode:b?L:"none",loading:v,spinnerVariant:O,disabled:z,tooltip:B?"Send message":void 0,tooltipPosition:"top",labelPlacement:A,srLabel:y,onExpandedChange:t=>M(`onExpandedChange → ${t}`),onClick:()=>M("clicked")})}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["Hover the circle (or ",e.jsx("code",{children:"Tab"})," to it) to spring the label out."]})]})})},x=({label:n,hint:o,children:d})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[d,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n}),e.jsx("span",{className:"text-[11px] opacity-50",children:o})]}),Be=()=>e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:["Hover each one to expand it — on a touchscreen a tap focuses the control, which opens it just the same. Press ",e.jsx("code",{children:"Tab"})," to reach the focus modes."]}),e.jsxs("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:[e.jsx(x,{label:"hover",hint:"the default",children:e.jsx(s,{icon:"Send",label:"Send",size:"md",srLabel:"Send"})}),e.jsx(x,{label:"focus",hint:"tab to it",children:e.jsx(s,{icon:"Search",label:"Search",expandOn:"focus",size:"md",srLabel:"Search"})}),e.jsx(x,{label:"hover + focus",hint:"either works",children:e.jsx(s,{icon:"Star",label:"Bookmark",expandOn:"hover+focus",size:"md",srLabel:"Bookmark"})}),e.jsx(x,{label:"click",hint:"press to toggle",children:e.jsx(s,{icon:"Add",label:"Add item",expandOn:"click",size:"md",srLabel:"Add item"})}),e.jsx(x,{label:"always",hint:"starts open",children:e.jsx(s,{icon:"Settings",label:"Settings",expandOn:"always",size:"md",srLabel:"Settings"})})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"hover"})," opens on ",e.jsx("code",{children:":focus-visible"})," too, so a keyboard user is never handed a name they cannot see. ",e.jsx("code",{children:"always"})," writes the open attribute itself — the same one the pointer triggers feed — so nothing has to happen for the label to be out."]})]}),Re=`import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
    <span className="text-[11px] opacity-50">{hint}</span>
  </div>
);

const Triggers = () => (
  <div className="flex w-full flex-col gap-5">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover each one to expand it — on a touchscreen a tap focuses the control,
      which opens it just the same. Press <code>Tab</code> to reach the focus
      modes.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-4">
      <Swatch label="hover" hint="the default">
        <ExpandableButton icon="Send" label="Send" size="md" srLabel="Send" />
      </Swatch>
      <Swatch label="focus" hint="tab to it">
        <ExpandableButton
          icon="Search"
          label="Search"
          expandOn="focus"
          size="md"
          srLabel="Search"
        />
      </Swatch>
      <Swatch label="hover + focus" hint="either works">
        <ExpandableButton
          icon="Star"
          label="Bookmark"
          expandOn="hover+focus"
          size="md"
          srLabel="Bookmark"
        />
      </Swatch>
      <Swatch label="click" hint="press to toggle">
        <ExpandableButton
          icon="Add"
          label="Add item"
          expandOn="click"
          size="md"
          srLabel="Add item"
        />
      </Swatch>
      <Swatch label="always" hint="starts open">
        <ExpandableButton
          icon="Settings"
          label="Settings"
          expandOn="always"
          size="md"
          srLabel="Settings"
        />
      </Swatch>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>hover</code> opens on <code>:focus-visible</code> too, so a keyboard
      user is never handed a name they cannot see. <code>always</code> writes the
      open attribute itself — the same one the pointer triggers feed — so
      nothing has to happen for the label to be out.
    </p>
  </div>
);

export default Triggers;
`,Pe=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover to expand — one tone, one size, so only the surface changes."}),e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:pe.map(n=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(s,{icon:"Send",label:n,variant:n,color:"blue",size:"md",srLabel:n}),e.jsx("span",{className:"text-sm opacity-70",children:n})]},n))}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["The revealed text is the variant name, so the expansion says what it is."," ",e.jsx("code",{children:"glass"})," reads best over a backdrop — see the Glass example."]})]}),Ae=`import { BUTTON_VARIANTS, ExpandableButton } from "@cjlapao/ui-kit";

const EveryVariant = () => (
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover to expand — one tone, one size, so only the surface changes.
    </p>
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {BUTTON_VARIANTS.map((variant) => (
        <div key={variant} className="flex items-center gap-3">
          <ExpandableButton
            icon="Send"
            label={variant}
            variant={variant}
            color="blue"
            size="md"
            srLabel={variant}
          />
          <span className="text-sm opacity-70">{variant}</span>
        </div>
      ))}
    </div>
    <p className="text-center text-[11px] opacity-60">
      The revealed text is the variant name, so the expansion says what it is.{" "}
      <code>glass</code> reads best over a backdrop — see the Glass example.
    </p>
  </div>
);

export default EveryVariant;
`,Me=({label:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Ie=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover any circle to spring its label out."}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-3",children:he.map(n=>e.jsx(Me,{label:n,children:e.jsx(s,{icon:"Send",label:n,variant:"solid",color:n,size:"md",srLabel:n})},n))}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["All 21 true colours, solid at one size — fill, text and focus ring all follow ",e.jsx("code",{children:"color"}),"."]})]}),De=`import { ExpandableButton, TRUE_COLORS } from "@cjlapao/ui-kit";
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
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover any circle to spring its label out.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-3">
      {TRUE_COLORS.map((color) => (
        <Swatch key={color} label={color}>
          <ExpandableButton
            icon="Send"
            label={color}
            variant="solid"
            color={color}
            size="md"
            srLabel={color}
          />
        </Swatch>
      ))}
    </div>
    <p className="text-center text-[11px] opacity-60">
      All 21 true colours, solid at one size — fill, text and focus ring all
      follow <code>color</code>.
    </p>
  </div>
);

export default EveryTone;
`,He=[{spring:"bouncy",caption:"600 ms, clear overshoot"},{spring:"snappy",caption:"380 ms, still overshoots"},{spring:"gentle",caption:"900 ms, soft overshoot"},{spring:"precise",caption:"320 ms, no overshoot"}],Ve=[{iconMotion:"pop-tilt",caption:"scale + lean (the default)"},{iconMotion:"pop",caption:"scale only"},{iconMotion:"tilt",caption:"8° lean only"},{iconMotion:"lift",caption:"rises 2 px"},{iconMotion:"none",caption:"glyph stays put"}],D=({caption:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Fe=()=>e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover each button and watch where the label stops: an elastic curve runs past its final width and settles back."}),e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("span",{className:"text-center text-[10px] uppercase tracking-widest opacity-50",children:"spring"}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:He.map(({spring:n,caption:o})=>e.jsx(D,{caption:`${n} · ${o}`,children:e.jsx(s,{icon:"Rocket",label:n,variant:"solid",color:"blue",size:"lg",spring:n,srLabel:n})},n))})]}),e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("span",{className:"text-center text-[10px] uppercase tracking-widest opacity-50",children:"iconMotion"}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:Ve.map(({iconMotion:n,caption:o})=>e.jsx(D,{caption:`${n} · ${o}`,children:e.jsx(s,{icon:"Send",label:n,variant:"soft",color:"blue",size:"lg",iconMotion:n,srLabel:n})},n))})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"springDuration"})," overrides a preset’s duration without changing its curve. Under ",e.jsx("code",{children:"prefers-reduced-motion"})," the label still opens — it simply arrives, and the press squish is dropped."]})]}),Ge=`import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const SPRINGS = [
  { spring: "bouncy", caption: "600 ms, clear overshoot" },
  { spring: "snappy", caption: "380 ms, still overshoots" },
  { spring: "gentle", caption: "900 ms, soft overshoot" },
  { spring: "precise", caption: "320 ms, no overshoot" },
] as const;

const MOTIONS = [
  { iconMotion: "pop-tilt", caption: "scale + lean (the default)" },
  { iconMotion: "pop", caption: "scale only" },
  { iconMotion: "tilt", caption: "8° lean only" },
  { iconMotion: "lift", caption: "rises 2 px" },
  { iconMotion: "none", caption: "glyph stays put" },
] as const;

const Swatch = ({
  caption,
  children,
}: {
  caption: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {caption}
    </span>
  </div>
);

const Physics = () => (
  <div className="flex w-full flex-col gap-6">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover each button and watch where the label stops: an elastic curve runs
      past its final width and settles back.
    </p>
    <div className="flex w-full flex-col gap-2">
      <span className="text-center text-[10px] uppercase tracking-widest opacity-50">
        spring
      </span>
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        {SPRINGS.map(({ spring, caption }) => (
          <Swatch key={spring} caption={\`\${spring} · \${caption}\`}>
            <ExpandableButton
              icon="Rocket"
              label={spring}
              variant="solid"
              color="blue"
              size="lg"
              spring={spring}
              srLabel={spring}
            />
          </Swatch>
        ))}
      </div>
    </div>
    <div className="flex w-full flex-col gap-2">
      <span className="text-center text-[10px] uppercase tracking-widest opacity-50">
        iconMotion
      </span>
      <div className="flex w-full flex-wrap items-end justify-center gap-4">
        {MOTIONS.map(({ iconMotion, caption }) => (
          <Swatch key={iconMotion} caption={\`\${iconMotion} · \${caption}\`}>
            <ExpandableButton
              icon="Send"
              label={iconMotion}
              variant="soft"
              color="blue"
              size="lg"
              iconMotion={iconMotion}
              srLabel={iconMotion}
            />
          </Swatch>
        ))}
      </div>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>springDuration</code> overrides a preset&rsquo;s duration without
      changing its curve. Under <code>prefers-reduced-motion</code> the label
      still opens — it simply arrives, and the press squish is dropped.
    </p>
  </div>
);

export default Physics;
`,c=({label:n,hint:o,children:d})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[d,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n}),o&&e.jsx("span",{className:"text-[11px] opacity-50",children:o})]}),$e=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover, focus and press these."}),e.jsxs("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:[e.jsx(c,{label:"default",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",srLabel:"Send"})}),e.jsx(c,{label:"loading",hint:"never expands",children:e.jsx(s,{icon:"Send",label:"Sending",variant:"solid",color:"blue",size:"lg",loading:!0,spinnerVariant:"segments",srLabel:"Sending"})}),e.jsx(c,{label:"disabled",hint:"never expands",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",disabled:!0,srLabel:"Send"})}),e.jsx(c,{label:"accent",hint:"the parent owns the fill",children:e.jsx(s,{icon:"Send",label:"Send",variant:"soft",color:"blue",size:"lg",accent:!0,accentColor:"indigo",srLabel:"Send"})}),e.jsx(c,{label:"icon tint",children:e.jsx(s,{icon:"Star",label:"Star",variant:"soft",color:"neutral",size:"lg",iconColor:"red",srLabel:"Star"})}),e.jsx(c,{label:"tooltip",hint:"replaces the native title",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",tooltip:"Send the message",tooltipPosition:"top",srLabel:"Send"})}),e.jsx(c,{label:"label before",hint:"the glyph leads",children:e.jsx(s,{icon:"ArrowRight",label:"Continue",variant:"solid",color:"blue",size:"lg",labelPlacement:"before",srLabel:"Continue"})})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"loading"})," and ",e.jsx("code",{children:"disabled"})," set the real"," ",e.jsx("code",{children:"disabled"})," attribute, so the hover and focus triggers cannot open them — the spinner replaces the glyph and the button skips the usual dim so that spinner stays visible."]})]}),Ue=`import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
    {hint && <span className="text-[11px] opacity-50">{hint}</span>}
  </div>
);

const States = () => (
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover, focus and press these.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-4">
      <Swatch label="default">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="loading" hint="never expands">
        <ExpandableButton
          icon="Send"
          label="Sending"
          variant="solid"
          color="blue"
          size="lg"
          loading
          spinnerVariant="segments"
          srLabel="Sending"
        />
      </Swatch>
      <Swatch label="disabled" hint="never expands">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          disabled
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="accent" hint="the parent owns the fill">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="soft"
          color="blue"
          size="lg"
          accent
          accentColor="indigo"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="icon tint">
        <ExpandableButton
          icon="Star"
          label="Star"
          variant="soft"
          color="neutral"
          size="lg"
          iconColor="red"
          srLabel="Star"
        />
      </Swatch>
      <Swatch label="tooltip" hint="replaces the native title">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          tooltip="Send the message"
          tooltipPosition="top"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="label before" hint="the glyph leads">
        <ExpandableButton
          icon="ArrowRight"
          label="Continue"
          variant="solid"
          color="blue"
          size="lg"
          labelPlacement="before"
          srLabel="Continue"
        />
      </Swatch>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>loading</code> and <code>disabled</code> set the real{" "}
      <code>disabled</code> attribute, so the hover and focus triggers cannot
      open them — the spinner replaces the glyph and the button skips the usual
      dim so that spinner stays visible.
    </p>
  </div>
);

export default States;
`;function qe(){return e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-sm opacity-70",children:"Hover over Follow me, then move down with the button when it wraps. It stays open for 500 ms after the pointer leaves. The invisible rectangular hover area includes the rounded corners."}),e.jsxs("div",{className:"flex w-64 flex-wrap items-center justify-end gap-3 rounded-xl border border-neutral-300 p-3 dark:border-neutral-700",children:[e.jsx("span",{className:"w-40 text-sm",children:"Limited toolbar space"}),e.jsx(s,{icon:"ArrowRight",label:"Follow me",srLabel:"Follow me",variant:"soft",collapseDelay:500})]})]})}const _e=`import { ExpandableButton } from "@cjlapao/ui-kit";

/** Expansion wraps the button, giving the pointer a 500ms window to follow it. */
export default function HoverStability() {
  return (
    <div className="space-y-3">
      <p className="text-sm opacity-70">
        Hover over Follow me, then move down with the button when it wraps.
        It stays open for 500 ms after the pointer leaves. The invisible
        rectangular hover area includes the rounded corners.
      </p>
      <div className="flex w-64 flex-wrap items-center justify-end gap-3 rounded-xl border border-neutral-300 p-3 dark:border-neutral-700">
        <span className="w-40 text-sm">Limited toolbar space</span>
        <ExpandableButton
          icon="ArrowRight"
          label="Follow me"
          srLabel="Follow me"
          variant="soft"
          collapseDelay={500}
        />
      </div>
    </div>
  );
}
`,We=["none","classic","halo"],Ke=({label:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Qe=()=>e.jsxs("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx("p",{className:"pb-3 text-center text-xs text-neutral-600 dark:text-neutral-300",children:"Hover each one — the label springs out through the frost."}),e.jsx("div",{className:"flex flex-wrap items-end justify-center gap-4",children:We.map(n=>e.jsx(Ke,{label:n,children:e.jsx(s,{icon:"Search",label:n,variant:"glass",color:"blue",size:"lg",specularMode:n,srLabel:n})},n))}),e.jsxs("p",{className:"pt-3 text-center text-[11px] text-neutral-600 dark:text-neutral-300",children:[e.jsx("code",{children:'variant="glass"'})," auto-enables the glass path;"," ",e.jsx("code",{children:"vibrancy"})," and ",e.jsx("code",{children:"glassOpacity"})," tune the frost from here."]})]}),Xe=`import { ExpandableButton } from "@cjlapao/ui-kit";
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
    <p className="pb-3 text-center text-xs text-neutral-600 dark:text-neutral-300">
      Hover each one — the label springs out through the frost.
    </p>
    <div className="flex flex-wrap items-end justify-center gap-4">
      {SPECULAR_MODES.map((mode) => (
        <Swatch key={mode} label={mode}>
          <ExpandableButton
            icon="Search"
            label={mode}
            variant="glass"
            color="blue"
            size="lg"
            specularMode={mode}
            srLabel={mode}
          />
        </Swatch>
      ))}
    </div>
    <p className="pt-3 text-center text-[11px] text-neutral-600 dark:text-neutral-300">
      <code>variant=&quot;glass&quot;</code> auto-enables the glass path;{" "}
      <code>vibrancy</code> and <code>glassOpacity</code> tune the frost from
      here.
    </p>
  </div>
);

export default Glass;
`,ln=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(xe,{name:"Expandable Button",description:"A circle at rest that springs its label out on hover, focus or click — the whole IconButton palette (variant, size, tone, corner, loading, accent, icon tint, glass, tooltip) plus the elastic reveal itself: five triggers, four spring curves, glyph motion and press squish."}),e.jsx(ze,{}),e.jsxs("section",{className:"relative flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Hover stability",description:"A constrained toolbar makes expansion wrap the button. The rectangular hit area and collapse delay give the pointer time to follow.",code:_e,filename:"HoverStability.tsx",children:e.jsx(qe,{})}),e.jsx(r,{title:"Triggers",description:"The five expandOn modes side by side — hover, focus, both, click and always. Hover, Tab and press each one.",code:Re,filename:"Triggers.tsx",children:e.jsx(Be,{})}),e.jsx(r,{title:"Every variant",description:"All eight button variants at one tone and size, each labelled with its own name.",code:Ae,filename:"EveryVariant.tsx",children:e.jsx(Pe,{})}),e.jsx(r,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:De,filename:"EveryTone.tsx",children:e.jsx(Ie,{})}),e.jsx(r,{title:"Physics",description:"The four spring presets and the five glyph motions, each caption with what it actually does — hover to feel the difference.",code:Ge,filename:"Physics.tsx",children:e.jsx(Fe,{})}),e.jsx(r,{title:"States",description:"Default, loading, disabled, accent, a tinted icon, a tooltip and the label on the left — hover and press these.",code:Ue,filename:"States.tsx",children:e.jsx($e,{})}),e.jsx(r,{title:"Glass",description:"The glass variant with the three specular highlight modes on a coloured backdrop.",code:Xe,filename:"Glass.tsx",children:e.jsx(Qe,{})})]}),e.jsxs(ue,{children:[e.jsxs(w,{title:"Screen reader",children:[e.jsxs("p",{children:["The label you see is not the label that is announced. It lives in a"," ",e.jsx("code",{children:"0fr"})," grid column that collapses to nothing while closed, and a zero-width ",e.jsx("code",{children:"overflow: hidden"})," box is unreliable across screen readers — so the whole track is ",e.jsx(l,{children:"aria-hidden"})," and the name comes from elsewhere, in this order: ",e.jsx(l,{children:"aria-label"}),", then"," ",e.jsx(l,{children:"srLabel"}),", then a ",e.jsx(l,{children:"label"})," that happens to be a string. An"," ",e.jsx("code",{children:"sr-only"})," span carries the result, so the control can never render nameless. The glyph sits in an ",e.jsx("code",{children:"aria-hidden"})," slot too, and so does the loading spinner — the announcement stays the action’s, never “loading”."]}),e.jsxs("p",{children:[e.jsx(l,{children:"aria-expanded"})," is only set where the component genuinely owns the open state — ",e.jsx(l,{children:'expandOn="click"'}),","," ",e.jsx(l,{children:'expandOn="always"'})," or a controlled ",e.jsx(l,{children:"expanded"}),". The hover/focus triggers do not advertise a state they do not hold. A styled ",e.jsx(l,{children:"tooltip"})," replaces the native ",e.jsx("code",{children:"title"})," ","rather than doubling it; with no tooltip the native one falls back to the accessible name. Passing ",e.jsx(l,{children:"aria-hidden"})," on the button itself trips the kit’s dev warning, because a focusable control that is hidden from assistive tech is a defect, not a style."]}),e.jsx(be,{filename:"labelling.tsx",code:`// The visible text is aria-hidden — the name is declared separately:
<ExpandableButton icon="Send" label="Send" srLabel="Send message" />

// aria-label wins over srLabel when both are present:
<ExpandableButton icon="Send" label="Send" aria-label="Send the draft" />

// A string label names the control on its own, but say it explicitly:
<ExpandableButton
  icon="Add"
  label="Add item"
  srLabel="Add an item to the list"
  expandOn="click"   // this is the mode that carries aria-expanded
/>`})]}),e.jsxs(w,{title:"Keyboard Support",children:[e.jsxs("p",{children:["A real ",e.jsx("code",{children:"button"})," element, so nothing exotic is required — and ",e.jsx(l,{children:"type"})," defaults to ",e.jsx("code",{children:'"button"'}),", which keeps a thoughtless drop into a form from submitting it."," ",e.jsx("code",{children:"disabled"})," and ",e.jsx("code",{children:"loading"})," both set the real"," ",e.jsx("code",{children:"disabled"})," attribute, so they leave the tab order and the hover/focus rules cannot open them."]}),e.jsx(me,{bindings:[{keys:["Tab"],action:e.jsxs(e.Fragment,{children:["Reaches the control and paints the tone-coloured ring. The label opens on ",e.jsx("code",{children:":focus-visible"})," in"," ",e.jsx("code",{children:"hover"})," and ",e.jsx("code",{children:"hover+focus"}),", and on plain"," ",e.jsx("code",{children:":focus"})," in ",e.jsx("code",{children:"focus"})," and"," ",e.jsx("code",{children:"hover+focus"})," — a keyboard user is never handed a circle they cannot name."]})},{keys:["Enter","Space"],action:e.jsxs(e.Fragment,{children:["Activate the button. Under ",e.jsx(l,{children:'expandOn="click"'})," ","they also toggle the label, because that mode keeps the open state in React rather than in a ",e.jsx("code",{children:":hover"})," rule — so it answers to the keyboard and survives a tap."]})}]})]}),e.jsxs(w,{title:"Internationalization",children:[e.jsxs("p",{children:["Two strings, both the caller’s: the visible ",e.jsx(l,{children:"label"})," and the announced ",e.jsx(l,{children:"srLabel"}),". Translating only the visible one is the classic gap — the screen reader keeps speaking the source language. Pass a localized ",e.jsx(l,{children:"srLabel"})," (or rely on the string-",e.jsx(l,{children:"label"})," ","fallback and translate that once). Nothing else here speaks: the spinner’s kit-cataloged status text (en/de/es/fr/pt) sits inside the ",e.jsx("code",{children:"aria-hidden"})," glyph slot, so it never announces."]}),e.jsxs("p",{children:["The reveal is ",e.jsx("code",{children:"grid-template-columns: 0fr to 1fr"}),", so a longer translation runs out to its natural width instead of being cut off by a guessed ",e.jsx("code",{children:"max-width"})," — but the label is"," ",e.jsx("code",{children:"white-space: nowrap"}),", so keep translations short. For RTL the gap is logical (",e.jsx("code",{children:"padding-inline-start/end"}),", switched with ",e.jsx(l,{children:"labelPlacement"}),") and ",e.jsx("code",{children:"before"})," is"," ",e.jsx("code",{children:"flex-direction: row-reverse"}),", so the layout follows the writing direction; the run-up itself is a physical"," ",e.jsx("code",{children:"translateX"}),", so the label still slides in from the left."]})]})]}),e.jsx(ge,{props:[{name:"icon",type:"string | ReactElement",description:"A registry icon name (see the Icon Registry page) or your own element. It renders inside an aria-hidden slot and paints with currentColor, so it decorates and never names."},{name:"label",type:"ReactNode",description:"The text that slides out. Real text, but aria-hidden while collapsed — srLabel (or a string label) is what gets announced."},{name:"variant",type:"ButtonVariant",default:'"icon"',description:'The whole Button vocabulary; the icon default is the soft tinted circle. variant="glass" auto-enables the glass path.'},{name:"color",type:"TrueColor",default:'"blue"',description:"Tone — fill, text, ring, glass chrome and the spinner all follow it."},{name:"size",type:"ButtonSize",default:'"md"',description:"The shared control scale. It sets the resting circle's symmetric padding, the glyph size and the spinner size, so an md button aligns with an md input."},{name:"rounded",type:'"md" | "lg" | "xl" | "full"',default:'"full"',description:"Corner radius — the circle is the identity, and the same corner rounds the pill the control becomes when it opens."},{name:"customSizeClass",type:"string",description:"Escape hatch replacing the computed padding class that makes the resting box. Prefer size."},{name:"iconClassName",type:"string",description:"Added to the rendered glyph's class list."},{name:"labelClassName",type:"string",description:"For the label's inner span — the one that fades and slides."},{name:"loading",type:"boolean",default:"false",description:"Swaps the glyph for a spinner, sets the real disabled attribute (so hover and focus cannot open it) and skips the usual dim, so the one signal that work is happening stays visible. Also forces iconMotion to none."},{name:"spinnerVariant",type:'"solid" | "segments"',default:'"segments"',description:"The spinner drawn in place of the glyph."},{name:"spinnerColor",type:"SpinnerColor",default:"the color tone",description:"Overrides the spinner's tone only."},{name:"srLabel",type:"string",description:"The accessible name. aria-label wins over it and a string label is the fallback, with an sr-only span guaranteeing the button is never nameless. This is the prop that makes the control usable — never rely on the fallback."},{name:"accent",type:"boolean",default:"false",description:"The parent owns the fill (a toolbar button on a coloured bar): the background goes transparent, the glyph inherits, and a tone ring plus a hover wash keep it focusable-looking."},{name:"accentColor",type:"TrueColor",default:"the color tone",description:"Picks the accent ring and hover tone. Without accent it still tints the hover text of a non-solid variant, and nothing else."},{name:"iconColor",type:"string",description:"Raw CSS colour for the glyph only. Omit it and the icon inherits the button's text colour, so hover states repaint the glyph too."},{name:"tooltip",type:"string",description:"Styled tooltip on hover. Setting it drops the native title, which otherwise falls back to the accessible name."},{name:"tooltipPosition",type:"TooltipPosition",default:'"top"',description:"Where the styled tooltip sits relative to the button."},{name:"glass",type:"boolean",default:"false",description:`Translucent chrome. variant="glass" turns the same path on by itself; the variant's own opaque colour classes are dropped and the chrome comes from the glass tokens instead.`},{name:"vibrancy",type:"GlassVibrancy",default:'"medium"',description:"Backdrop blur strength under the fill."},{name:"glassOpacity",type:"GlassOpacity",default:'"clear"',description:"Fill transparency — clear here, where the control is an icon surface, rather than the Button's frosted."},{name:"specularMode",type:"SpecularMode",default:'"none"',description:"The glass highlight overlay (none/classic/halo). Ignored unless the control is glass."},{name:"expandOn",type:"ExpandTrigger",default:'"hover"',description:"What reveals the label. Hover uses explicit state with a delayed collapse; focus uses CSS. Click toggles the open state, and always holds it open. hover also opens on :focus-visible, focus uses plain :focus, and on a touchscreen (hover: none) a tap's focus opens the hover modes too."},{name:"collapseDelay",type:"number",default:"500",description:"Milliseconds outside the rectangular hover area before collapse. Re-entry cancels the timer. Rounded corners remain part of the hit area. Set 0 for immediate collapse. Focus keeps hover+focus controls open after the delay. Controlled, click, always and focus-only modes do not use this delay."},{name:"expanded",type:"boolean",description:"Controlled open state. When set it owns the open state outright — hover and focus stop opening it (and stop animating the glyph, which hangs off the same open switch). One of the three modes that carry aria-expanded, with click and always."},{name:"defaultExpanded",type:"boolean",default:"false",description:'Initial open state, read once at mount. It seeds the click toggle; `expandOn="always"` is open by definition and does not need it.'},{name:"onExpandedChange",type:"(expanded: boolean) => void",description:"Fires when the effective open state changes — in hover/focus modes, once the hover grace period and focus have both let go (so a hover+focus control does not report true twice on arrival, nor false while focus still holds the label open); in click mode, on every toggle. Never from always, and never from a value you set yourself."},{name:"spring",type:"ExpandableButtonSpring",default:'"bouncy"',description:"The easing, tuned by overshoot: bouncy is cubic-bezier(0.34,1.56,0.64,1) at 600ms; snappy 380ms; gentle 900ms; precise 320ms with the overshoot dialled off."},{name:"springDuration",type:"number",default:"the preset's duration",description:"Milliseconds. Overrides the preset's duration only — the curve still comes from spring. Both land in the --eb-spring-* custom properties set inline; your own style prop is merged over them (it no longer replaces them), so an explicit --eb-spring-duration in style still wins."},{name:"fadeDuration",type:"number",default:"300",description:"Milliseconds for the label's opacity ramp, which rides a plain ease rather than the spring — an opacity that overshoots 1 only clips. Settable independently for exactly that reason."},{name:"labelGap",type:"string",default:'"0.6em"',description:"The gap the label opens between itself and the glyph. A CSS length: relative units are the point, so it stays in proportion across the size scale. It is padding inside the clipped label, which is why the closed control stays a circle."},{name:"labelSlide",type:"string",default:'"0.8em"',description:"How far back the label starts, so it slides out from behind the glyph instead of fading in on the spot."},{name:"elevate",type:"boolean",default:"false",description:"Opt-in resting shadow that deepens as the label springs out. Off by default so scrolling containers cannot clip the normal button's shadow."},{name:"iconMotion",type:"ExpandableButtonIconMotion",default:'"pop-tilt"',description:"What the glyph does while the label slides out: pop scales it past 1, tilt leans it 8°, lift raises it 2px, pop-tilt does the first two, none keeps it still."},{name:"squish",type:"boolean",default:"true",description:"Press feedback — :active scales the whole button to 94%. Dropped under prefers-reduced-motion."},{name:"labelPlacement",type:'"after" | "before"',default:'"after"',description:"Label to the right of the glyph (default) or to its left, which reverses the row and moves the gap and run-up to that side."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Remaining native button attributes (onClick, onMouseEnter, data-*, form overrides…) pass straight through to the ",e.jsx("code",{children:"button"})," — except"," ",e.jsx("code",{children:"type"}),", which defaults to ",e.jsx("code",{children:"button"})," and can still be overridden when you genuinely want a submit button. The handlers you pass are called after the component’s own bookkeeping, so wiring"," ",e.jsx("code",{children:"onMouseEnter"})," or ",e.jsx("code",{children:"onFocus"})," alongside a CSS trigger does not swallow the reveal."]})]});export{ln as ExpandableButtonPage,ln as default};
