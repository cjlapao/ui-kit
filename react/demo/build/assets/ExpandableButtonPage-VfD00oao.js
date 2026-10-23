import{r as a,j as e,P as oe,c3 as s,C as ie,I as re,c2 as ce,q as de}from"./index-B9JeX19j.js";import{P as pe}from"./PageHeader-D-LFwZLT.js";import{E as d}from"./ExampleCard-BwESxlwz.js";import{A as he,a as v,C as l,b as xe,K as ue,P as be}from"./A11ySections-C9rTCDac.js";import{P as ge,S as p,a as y,C as j,T as i}from"./PlaygroundPanel-CZvYEX_V.js";import{C as me}from"./ControlAccordion-rp4gabXb.js";import{u as fe,E as ve}from"./EventLog-EYY1E4QF.js";import{t as ye,d as je,F as we,G as Se,H as Ne,I as ke,J as Ce,K as Ee,l as Te}from"./options-Blq0niUd.js";const M={bouncy:600,snappy:380,gentle:900,precise:320},Le=()=>{const[n,o]=a.useState("icon"),[c,G]=a.useState("md"),[w,V]=a.useState("blue"),[S,D]=a.useState("full"),[N,H]=a.useState("hover"),[u,$]=a.useState("bouncy"),[k,q]=a.useState("pop-tilt"),[g,F]=a.useState(600),[h,U]=a.useState(!1),[C,_]=a.useState(!0),[E,W]=a.useState(!0),[b,K]=a.useState(!1),[T,J]=a.useState("none"),[m,X]=a.useState(!1),[L,Q]=a.useState("segments"),[O,Y]=a.useState(!1),[z,Z]=a.useState(!1),[B,ee]=a.useState(!1),[P,ne]=a.useState(!1),[f,te]=a.useState("Save changes"),[R,ae]=a.useState("after"),[se,A]=fe(),le=B;return e.jsx(ge,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(me,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:ye,value:n,onChange:t=>o(t)}),e.jsx(p,{label:"Size",options:je,value:c,onChange:t=>G(t)}),e.jsx(y,{label:"Tone",children:e.jsx(ie,{selectable:!0,size:"sm",value:w,onSelect:V,defaultExpanded:!0})}),e.jsx(p,{label:"Corner",options:we,value:S,onChange:t=>D(t)})]})},{id:"physics",title:"Physics",defaultOpen:!0,controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(p,{label:"Expand on",options:Se,value:N,onChange:t=>H(t)}),e.jsx(j,{label:"Spring",options:Ne,value:u,onChange:t=>$(t)}),e.jsx(p,{label:"Icon motion",options:ke,value:k,onChange:t=>q(t)}),e.jsx(y,{label:h?`Duration — ${g} ms`:`Duration — ${M[u]} ms (preset)`,children:e.jsx("input",{type:"range",min:150,max:1200,step:20,value:h?g:M[u],disabled:!h,onChange:t=>F(Number(t.target.value)),className:"w-full accent-blue-500 disabled:opacity-50","aria-label":"Spring duration in milliseconds"})}),e.jsx(i,{label:"Override duration",checked:h,onChange:U}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Elevate",checked:C,onChange:_}),e.jsx(i,{label:"Squish",checked:E,onChange:W}),e.jsx(i,{label:"Glass",checked:b,onChange:K}),e.jsx(i,{label:"Loading",checked:m,onChange:X}),e.jsx(i,{label:"Disabled",checked:O,onChange:Y}),e.jsx(i,{label:"Tooltip",checked:z,onChange:Z}),e.jsx(i,{label:"Force open",checked:B,onChange:ee}),e.jsx(i,{label:"Glass panel",checked:P,onChange:ne})]}),m&&e.jsx(j,{label:"Spinner type",options:Ce,value:L,onChange:t=>Q(t)})]})},{id:"label",title:"Label",controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Label text",children:e.jsx(re,{size:"sm",value:f,placeholder:"Save changes","aria-label":"Button label",onChange:t=>te(t.target.value)})}),e.jsx(j,{label:"Placement",options:Ee,value:R,onChange:t=>ae(t)})]})},...b?[{id:"glass",title:"Glass",controls:e.jsx(p,{label:"Specular",options:Te,value:T,onChange:t=>J(t)})}]:[]]}),e.jsx(ve,{log:se,emptyText:"No events yet — hover or press the button."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The resting control is a circle; the label rides out on a spring whose overshoot is the whole illusion. ",e.jsx("strong",{children:"Expand on"})," ","decides who owns that open state: ",e.jsx("code",{children:"hover"}),","," ",e.jsx("code",{children:"focus"})," and ",e.jsx("code",{children:"hover+focus"})," are pure CSS (no re-render), ",e.jsx("code",{children:"click"})," moves it into React state, and"," ",e.jsx("code",{children:"always"})," writes it outright — the pointer has nothing to do with it."," ",e.jsx("strong",{children:"Force open"})," pins any trigger through"," ",e.jsx("code",{children:"expanded"}),", and a control that owns its open state stops answering hover and focus altogether."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(oe,{variant:P?"glass":"elevated",padding:"md",children:e.jsx(s,{icon:"Send",label:f,variant:n,color:w,size:c,rounded:S,expandOn:N,expanded:le?!0:void 0,spring:u,springDuration:h?g:void 0,iconMotion:k,elevate:C,squish:E,glass:b,specularMode:b?T:"none",loading:m,spinnerVariant:L,disabled:O,tooltip:z?"Send message":void 0,tooltipPosition:"top",labelPlacement:R,srLabel:f,onExpandedChange:t=>A(`onExpandedChange → ${t}`),onClick:()=>A("clicked")})}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["Hover the circle (or ",e.jsx("code",{children:"Tab"})," to it) to spring the label out."]})]})})},x=({label:n,hint:o,children:c})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[c,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n}),e.jsx("span",{className:"text-[11px] opacity-50",children:o})]}),Oe=()=>e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:["Hover each one to expand it — on a touchscreen a tap focuses the control, which opens it just the same. Press ",e.jsx("code",{children:"Tab"})," to reach the focus modes."]}),e.jsxs("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:[e.jsx(x,{label:"hover",hint:"the default",children:e.jsx(s,{icon:"Send",label:"Send",size:"md",srLabel:"Send"})}),e.jsx(x,{label:"focus",hint:"tab to it",children:e.jsx(s,{icon:"Search",label:"Search",expandOn:"focus",size:"md",srLabel:"Search"})}),e.jsx(x,{label:"hover + focus",hint:"either works",children:e.jsx(s,{icon:"Star",label:"Bookmark",expandOn:"hover+focus",size:"md",srLabel:"Bookmark"})}),e.jsx(x,{label:"click",hint:"press to toggle",children:e.jsx(s,{icon:"Add",label:"Add item",expandOn:"click",size:"md",srLabel:"Add item"})}),e.jsx(x,{label:"always",hint:"starts open",children:e.jsx(s,{icon:"Settings",label:"Settings",expandOn:"always",size:"md",srLabel:"Settings"})})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"hover"})," opens on ",e.jsx("code",{children:":focus-visible"})," too, so a keyboard user is never handed a name they cannot see. ",e.jsx("code",{children:"always"})," writes the open attribute itself — the same one the pointer triggers feed — so nothing has to happen for the label to be out."]})]}),ze=`import { ExpandableButton } from "@cjlapao/ui-kit";
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
`,Be=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover to expand — one tone, one size, so only the surface changes."}),e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:ce.map(n=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(s,{icon:"Send",label:n,variant:n,color:"blue",size:"md",srLabel:n}),e.jsx("span",{className:"text-sm opacity-70",children:n})]},n))}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["The revealed text is the variant name, so the expansion says what it is."," ",e.jsx("code",{children:"glass"})," reads best over a backdrop — see the Glass example."]})]}),Pe=`import { BUTTON_VARIANTS, ExpandableButton } from "@cjlapao/ui-kit";

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
`,Re=({label:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Ae=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover any circle to spring its label out."}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-3",children:de.map(n=>e.jsx(Re,{label:n,children:e.jsx(s,{icon:"Send",label:n,variant:"solid",color:n,size:"md",srLabel:n})},n))}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:["All 21 true colours, solid at one size — fill, text and focus ring all follow ",e.jsx("code",{children:"color"}),"."]})]}),Me=`import { ExpandableButton, TRUE_COLORS } from "@cjlapao/ui-kit";
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
`,Ie=[{spring:"bouncy",caption:"600 ms, clear overshoot"},{spring:"snappy",caption:"380 ms, still overshoots"},{spring:"gentle",caption:"900 ms, soft overshoot"},{spring:"precise",caption:"320 ms, no overshoot"}],Ge=[{iconMotion:"pop-tilt",caption:"scale + lean (the default)"},{iconMotion:"pop",caption:"scale only"},{iconMotion:"tilt",caption:"8° lean only"},{iconMotion:"lift",caption:"rises 2 px"},{iconMotion:"none",caption:"glyph stays put"}],I=({caption:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Ve=()=>e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover each button and watch where the label stops: an elastic curve runs past its final width and settles back."}),e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("span",{className:"text-center text-[10px] uppercase tracking-widest opacity-50",children:"spring"}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:Ie.map(({spring:n,caption:o})=>e.jsx(I,{caption:`${n} · ${o}`,children:e.jsx(s,{icon:"Rocket",label:n,variant:"solid",color:"blue",size:"lg",spring:n,srLabel:n})},n))})]}),e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("span",{className:"text-center text-[10px] uppercase tracking-widest opacity-50",children:"iconMotion"}),e.jsx("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:Ge.map(({iconMotion:n,caption:o})=>e.jsx(I,{caption:`${n} · ${o}`,children:e.jsx(s,{icon:"Send",label:n,variant:"soft",color:"blue",size:"lg",iconMotion:n,srLabel:n})},n))})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"springDuration"})," overrides a preset’s duration without changing its curve. Under ",e.jsx("code",{children:"prefers-reduced-motion"})," the label still opens — it simply arrives, and the press squish is dropped."]})]}),De=`import { ExpandableButton } from "@cjlapao/ui-kit";
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
`,r=({label:n,hint:o,children:c})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[c,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n}),o&&e.jsx("span",{className:"text-[11px] opacity-50",children:o})]}),He=()=>e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("p",{className:"text-center text-xs text-neutral-500 dark:text-neutral-400",children:"Hover, focus and press these."}),e.jsxs("div",{className:"flex w-full flex-wrap items-end justify-center gap-4",children:[e.jsx(r,{label:"default",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",srLabel:"Send"})}),e.jsx(r,{label:"loading",hint:"never expands",children:e.jsx(s,{icon:"Send",label:"Sending",variant:"solid",color:"blue",size:"lg",loading:!0,spinnerVariant:"segments",srLabel:"Sending"})}),e.jsx(r,{label:"disabled",hint:"never expands",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",disabled:!0,srLabel:"Send"})}),e.jsx(r,{label:"accent",hint:"the parent owns the fill",children:e.jsx(s,{icon:"Send",label:"Send",variant:"soft",color:"blue",size:"lg",accent:!0,accentColor:"indigo",srLabel:"Send"})}),e.jsx(r,{label:"icon tint",children:e.jsx(s,{icon:"Star",label:"Star",variant:"soft",color:"neutral",size:"lg",iconColor:"red",srLabel:"Star"})}),e.jsx(r,{label:"tooltip",hint:"replaces the native title",children:e.jsx(s,{icon:"Send",label:"Send",variant:"solid",color:"blue",size:"lg",tooltip:"Send the message",tooltipPosition:"top",srLabel:"Send"})}),e.jsx(r,{label:"label before",hint:"the glyph leads",children:e.jsx(s,{icon:"ArrowRight",label:"Continue",variant:"solid",color:"blue",size:"lg",labelPlacement:"before",srLabel:"Continue"})})]}),e.jsxs("p",{className:"text-center text-[11px] opacity-60",children:[e.jsx("code",{children:"loading"})," and ",e.jsx("code",{children:"disabled"})," set the real"," ",e.jsx("code",{children:"disabled"})," attribute, so the hover and focus triggers cannot open them — the spinner replaces the glyph and the button skips the usual dim so that spinner stays visible."]})]}),$e=`import { ExpandableButton } from "@cjlapao/ui-kit";
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
`,qe=["none","classic","halo"],Fe=({label:n,children:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[o,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Ue=()=>e.jsxs("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:[e.jsx("p",{className:"pb-3 text-center text-xs text-neutral-600 dark:text-neutral-300",children:"Hover each one — the label springs out through the frost."}),e.jsx("div",{className:"flex flex-wrap items-end justify-center gap-4",children:qe.map(n=>e.jsx(Fe,{label:n,children:e.jsx(s,{icon:"Search",label:n,variant:"glass",color:"blue",size:"lg",specularMode:n,srLabel:n})},n))}),e.jsxs("p",{className:"pt-3 text-center text-[11px] text-neutral-600 dark:text-neutral-300",children:[e.jsx("code",{children:'variant="glass"'})," auto-enables the glass path;"," ",e.jsx("code",{children:"vibrancy"})," and ",e.jsx("code",{children:"glassOpacity"})," tune the frost from here."]})]}),_e=`import { ExpandableButton } from "@cjlapao/ui-kit";
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
`,nn=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(pe,{name:"Expandable Button",description:"A circle at rest that springs its label out on hover, focus or click — the whole IconButton palette (variant, size, tone, corner, loading, accent, icon tint, glass, tooltip) plus the elastic reveal itself: five triggers, four spring curves, glyph motion and press squish."}),e.jsx(Le,{}),e.jsxs("section",{className:"relative flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Triggers",description:"The five expandOn modes side by side — hover, focus, both, click and always. Hover, Tab and press each one.",code:ze,filename:"Triggers.tsx",children:e.jsx(Oe,{})}),e.jsx(d,{title:"Every variant",description:"All eight button variants at one tone and size, each labelled with its own name.",code:Pe,filename:"EveryVariant.tsx",children:e.jsx(Be,{})}),e.jsx(d,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:Me,filename:"EveryTone.tsx",children:e.jsx(Ae,{})}),e.jsx(d,{title:"Physics",description:"The four spring presets and the five glyph motions, each caption with what it actually does — hover to feel the difference.",code:De,filename:"Physics.tsx",children:e.jsx(Ve,{})}),e.jsx(d,{title:"States",description:"Default, loading, disabled, accent, a tinted icon, a tooltip and the label on the left — hover and press these.",code:$e,filename:"States.tsx",children:e.jsx(He,{})}),e.jsx(d,{title:"Glass",description:"The glass variant with the three specular highlight modes on a coloured backdrop.",code:_e,filename:"Glass.tsx",children:e.jsx(Ue,{})})]}),e.jsxs(he,{children:[e.jsxs(v,{title:"Screen reader",children:[e.jsxs("p",{children:["The label you see is not the label that is announced. It lives in a"," ",e.jsx("code",{children:"0fr"})," grid column that collapses to nothing while closed, and a zero-width ",e.jsx("code",{children:"overflow: hidden"})," box is unreliable across screen readers — so the whole track is ",e.jsx(l,{children:"aria-hidden"})," and the name comes from elsewhere, in this order: ",e.jsx(l,{children:"aria-label"}),", then"," ",e.jsx(l,{children:"srLabel"}),", then a ",e.jsx(l,{children:"label"})," that happens to be a string. An"," ",e.jsx("code",{children:"sr-only"})," span carries the result, so the control can never render nameless. The glyph sits in an ",e.jsx("code",{children:"aria-hidden"})," slot too, and so does the loading spinner — the announcement stays the action’s, never “loading”."]}),e.jsxs("p",{children:[e.jsx(l,{children:"aria-expanded"})," is only set where the component genuinely owns the open state — ",e.jsx(l,{children:'expandOn="click"'}),","," ",e.jsx(l,{children:'expandOn="always"'})," or a controlled ",e.jsx(l,{children:"expanded"}),". The CSS triggers do not advertise a state they do not hold. A styled ",e.jsx(l,{children:"tooltip"})," replaces the native ",e.jsx("code",{children:"title"})," ","rather than doubling it; with no tooltip the native one falls back to the accessible name. Passing ",e.jsx(l,{children:"aria-hidden"})," on the button itself trips the kit’s dev warning, because a focusable control that is hidden from assistive tech is a defect, not a style."]}),e.jsx(xe,{filename:"labelling.tsx",code:`// The visible text is aria-hidden — the name is declared separately:
<ExpandableButton icon="Send" label="Send" srLabel="Send message" />

// aria-label wins over srLabel when both are present:
<ExpandableButton icon="Send" label="Send" aria-label="Send the draft" />

// A string label names the control on its own, but say it explicitly:
<ExpandableButton
  icon="Add"
  label="Add item"
  srLabel="Add an item to the list"
  expandOn="click"   // this is the mode that carries aria-expanded
/>`})]}),e.jsxs(v,{title:"Keyboard Support",children:[e.jsxs("p",{children:["A real ",e.jsx("code",{children:"button"})," element, so nothing exotic is required — and ",e.jsx(l,{children:"type"})," defaults to ",e.jsx("code",{children:'"button"'}),", which keeps a thoughtless drop into a form from submitting it."," ",e.jsx("code",{children:"disabled"})," and ",e.jsx("code",{children:"loading"})," both set the real"," ",e.jsx("code",{children:"disabled"})," attribute, so they leave the tab order and the hover/focus rules cannot open them."]}),e.jsx(ue,{bindings:[{keys:["Tab"],action:e.jsxs(e.Fragment,{children:["Reaches the control and paints the tone-coloured ring. The label opens on ",e.jsx("code",{children:":focus-visible"})," in"," ",e.jsx("code",{children:"hover"})," and ",e.jsx("code",{children:"hover+focus"}),", and on plain"," ",e.jsx("code",{children:":focus"})," in ",e.jsx("code",{children:"focus"})," and"," ",e.jsx("code",{children:"hover+focus"})," — a keyboard user is never handed a circle they cannot name."]})},{keys:["Enter","Space"],action:e.jsxs(e.Fragment,{children:["Activate the button. Under ",e.jsx(l,{children:'expandOn="click"'})," ","they also toggle the label, because that mode keeps the open state in React rather than in a ",e.jsx("code",{children:":hover"})," rule — so it answers to the keyboard and survives a tap."]})}]})]}),e.jsxs(v,{title:"Internationalization",children:[e.jsxs("p",{children:["Two strings, both the caller’s: the visible ",e.jsx(l,{children:"label"})," and the announced ",e.jsx(l,{children:"srLabel"}),". Translating only the visible one is the classic gap — the screen reader keeps speaking the source language. Pass a localized ",e.jsx(l,{children:"srLabel"})," (or rely on the string-",e.jsx(l,{children:"label"})," ","fallback and translate that once). Nothing else here speaks: the spinner’s kit-cataloged status text (en/de/es/fr/pt) sits inside the ",e.jsx("code",{children:"aria-hidden"})," glyph slot, so it never announces."]}),e.jsxs("p",{children:["The reveal is ",e.jsx("code",{children:"grid-template-columns: 0fr to 1fr"}),", so a longer translation runs out to its natural width instead of being cut off by a guessed ",e.jsx("code",{children:"max-width"})," — but the label is"," ",e.jsx("code",{children:"white-space: nowrap"}),", so keep translations short. For RTL the gap is logical (",e.jsx("code",{children:"padding-inline-start/end"}),", switched with ",e.jsx(l,{children:"labelPlacement"}),") and ",e.jsx("code",{children:"before"})," is"," ",e.jsx("code",{children:"flex-direction: row-reverse"}),", so the layout follows the writing direction; the run-up itself is a physical"," ",e.jsx("code",{children:"translateX"}),", so the label still slides in from the left."]})]})]}),e.jsx(be,{props:[{name:"icon",type:"string | ReactElement",description:"A registry icon name (see the Icon Registry page) or your own element. It renders inside an aria-hidden slot and paints with currentColor, so it decorates and never names."},{name:"label",type:"ReactNode",description:"The text that slides out. Real text, but aria-hidden while collapsed — srLabel (or a string label) is what gets announced."},{name:"variant",type:"ButtonVariant",default:'"icon"',description:'The whole Button vocabulary; the icon default is the soft tinted circle. variant="glass" auto-enables the glass path.'},{name:"color",type:"TrueColor",default:'"blue"',description:"Tone — fill, text, ring, glass chrome and the spinner all follow it."},{name:"size",type:"ButtonSize",default:'"md"',description:"The shared control scale. It sets the resting circle's symmetric padding, the glyph size and the spinner size, so an md button aligns with an md input."},{name:"rounded",type:'"md" | "lg" | "xl" | "full"',default:'"full"',description:"Corner radius — the circle is the identity, and the same corner rounds the pill the control becomes when it opens."},{name:"customSizeClass",type:"string",description:"Escape hatch replacing the computed padding class that makes the resting box. Prefer size."},{name:"iconClassName",type:"string",description:"Added to the rendered glyph's class list."},{name:"labelClassName",type:"string",description:"For the label's inner span — the one that fades and slides."},{name:"loading",type:"boolean",default:"false",description:"Swaps the glyph for a spinner, sets the real disabled attribute (so hover and focus cannot open it) and skips the usual dim, so the one signal that work is happening stays visible. Also forces iconMotion to none."},{name:"spinnerVariant",type:'"solid" | "segments"',default:'"segments"',description:"The spinner drawn in place of the glyph."},{name:"spinnerColor",type:"SpinnerColor",default:"the color tone",description:"Overrides the spinner's tone only."},{name:"srLabel",type:"string",description:"The accessible name. aria-label wins over it and a string label is the fallback, with an sr-only span guaranteeing the button is never nameless. This is the prop that makes the control usable — never rely on the fallback."},{name:"accent",type:"boolean",default:"false",description:"The parent owns the fill (a toolbar button on a coloured bar): the background goes transparent, the glyph inherits, and a tone ring plus a hover wash keep it focusable-looking."},{name:"accentColor",type:"TrueColor",default:"the color tone",description:"Picks the accent ring and hover tone. Without accent it still tints the hover text of a non-solid variant, and nothing else."},{name:"iconColor",type:"string",description:"Raw CSS colour for the glyph only. Omit it and the icon inherits the button's text colour, so hover states repaint the glyph too."},{name:"tooltip",type:"string",description:"Styled tooltip on hover. Setting it drops the native title, which otherwise falls back to the accessible name."},{name:"tooltipPosition",type:"TooltipPosition",default:'"top"',description:"Where the styled tooltip sits relative to the button."},{name:"glass",type:"boolean",default:"false",description:`Translucent chrome. variant="glass" turns the same path on by itself; the variant's own opaque colour classes are dropped and the chrome comes from the glass tokens instead.`},{name:"vibrancy",type:"GlassVibrancy",default:'"medium"',description:"Backdrop blur strength under the fill."},{name:"glassOpacity",type:"GlassOpacity",default:'"clear"',description:"Fill transparency — clear here, where the control is an icon surface, rather than the Button's frosted."},{name:"specularMode",type:"SpecularMode",default:'"none"',description:"The glass highlight overlay (none/classic/halo). Ignored unless the control is glass."},{name:"expandOn",type:"ExpandTrigger",default:'"hover"',description:"What reveals the label. hover / focus / hover+focus are pure CSS (the button never re-renders to animate); click and always move the open state into React. hover also opens on :focus-visible, focus uses plain :focus, and on a touchscreen (hover: none) a tap's focus opens the hover modes too."},{name:"expanded",type:"boolean",description:"Controlled open state. When set it owns the open state outright — hover and focus stop opening it (and stop animating the glyph, which hangs off the same open switch). One of the three modes that carry aria-expanded, with click and always."},{name:"defaultExpanded",type:"boolean",default:"false",description:'Initial open state, read once at mount. It seeds the click toggle; `expandOn="always"` is open by definition and does not need it.'},{name:"onExpandedChange",type:"(expanded: boolean) => void",description:"Fires when the effective open state changes — in the CSS modes, once the pointer and focus have both let go (so a hover+focus control does not report true twice on arrival, nor false while focus still holds the label open); in click mode, on every toggle. Never from always, and never from a value you set yourself."},{name:"spring",type:"ExpandableButtonSpring",default:'"bouncy"',description:"The easing, tuned by overshoot: bouncy is cubic-bezier(0.34,1.56,0.64,1) at 600ms; snappy 380ms; gentle 900ms; precise 320ms with the overshoot dialled off."},{name:"springDuration",type:"number",default:"the preset's duration",description:"Milliseconds. Overrides the preset's duration only — the curve still comes from spring. Both land in the --eb-spring-* custom properties set inline; your own style prop is merged over them (it no longer replaces them), so an explicit --eb-spring-duration in style still wins."},{name:"fadeDuration",type:"number",default:"300",description:"Milliseconds for the label's opacity ramp, which rides a plain ease rather than the spring — an opacity that overshoots 1 only clips. Settable independently for exactly that reason."},{name:"labelGap",type:"string",default:'"0.6em"',description:"The gap the label opens between itself and the glyph. A CSS length: relative units are the point, so it stays in proportion across the size scale. It is padding inside the clipped label, which is why the closed control stays a circle."},{name:"labelSlide",type:"string",default:'"0.8em"',description:"How far back the label starts, so it slides out from behind the glyph instead of fading in on the spot."},{name:"elevate",type:"boolean",default:"true",description:"A resting shadow that deepens as the label springs out — the raise rides the same curve."},{name:"iconMotion",type:"ExpandableButtonIconMotion",default:'"pop-tilt"',description:"What the glyph does while the label slides out: pop scales it past 1, tilt leans it 8°, lift raises it 2px, pop-tilt does the first two, none keeps it still."},{name:"squish",type:"boolean",default:"true",description:"Press feedback — :active scales the whole button to 94%. Dropped under prefers-reduced-motion."},{name:"labelPlacement",type:'"after" | "before"',default:'"after"',description:"Label to the right of the glyph (default) or to its left, which reverses the row and moves the gap and run-up to that side."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Remaining native button attributes (onClick, onMouseEnter, data-*, form overrides…) pass straight through to the ",e.jsx("code",{children:"button"})," — except"," ",e.jsx("code",{children:"type"}),", which defaults to ",e.jsx("code",{children:"button"})," and can still be overridden when you genuinely want a submit button. The handlers you pass are called after the component’s own bookkeeping, so wiring"," ",e.jsx("code",{children:"onMouseEnter"})," or ",e.jsx("code",{children:"onFocus"})," alongside a CSS trigger does not swallow the reveal."]})]});export{nn as ExpandableButtonPage,nn as default};
