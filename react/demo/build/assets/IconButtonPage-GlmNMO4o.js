import{r as s,j as e,i as a,M as d,w as O,n as B,k as A}from"./index-B-ieYLXc.js";import{P as D,S as v,C as p,T as i,a as P,E as c}from"./PlaygroundPanel-CkWfNJii.js";import{q as U,n as _,t as V,C as M,i as G}from"./options-C8y5quvx.js";const H=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),W=()=>{const[n,t]=s.useState("icon"),[x,w]=s.useState("md"),[u,N]=s.useState("blue"),[m,k]=s.useState("full"),[h,C]=s.useState(!1),[g,y]=s.useState(!1),[b,L]=s.useState(!1),[r,z]=s.useState(!1),[f,T]=s.useState(!1),[S,R]=s.useState("none"),[E,I]=s.useState(0);return e.jsx(D,{controls:e.jsxs(e.Fragment,{children:[e.jsx(v,{label:"Variant",options:U,value:n,onChange:l=>t(l)}),e.jsx(p,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:_,value:x,onChange:l=>w(l)})}),e.jsx(v,{label:"Tone",options:V,value:u,onChange:l=>N(l)}),e.jsx(p,{label:"Rounded",children:e.jsx(d,{fullWidth:!0,size:"sm",options:M,value:m,onChange:l=>k(l)})}),r&&e.jsx(p,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:G,value:S,onChange:l=>R(l)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Loading",checked:h,onChange:C}),e.jsx(i,{label:"Disabled",checked:g,onChange:y}),e.jsx(i,{label:"Accent",checked:b,onChange:L}),e.jsx(i,{label:"Glass",checked:r,onChange:z}),e.jsx(i,{label:"Tooltip",checked:f,onChange:T})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Icon buttons carry no text — the ",e.jsx("strong",{children:"srLabel"})," is what gets announced and doubles as the native title. Loading swaps the glyph for a spinner and blocks clicks."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900",children:e.jsx(a,{icon:"Send",variant:n,color:u,size:x,rounded:m,loading:h,disabled:g,accent:b,glass:r,specularMode:r?S:"none",tooltip:f?"Send message":void 0,tooltipPosition:"top",srLabel:"Send",onClick:()=>I(l=>l+1)})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(H,{children:"Clicks"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:E})]})]})})},Z=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:O.map(n=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{icon:"Send",variant:n,color:"blue",size:"md",srLabel:n}),e.jsx("span",{className:"text-sm opacity-70",children:n})]},n))}),$=`import { BUTTON_VARIANTS, IconButton } from "@cjlapao/ui-kit";

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
`,q=["md","lg","xl","full"],j=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),F=()=>e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"flex flex-wrap items-end gap-3",children:B.map(n=>e.jsx(j,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:n,srLabel:n})},n))}),e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:q.map(n=>e.jsx(j,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",rounded:n,srLabel:n})},n))})]}),J=`import { CONTROL_SIZES, IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const ROUNDED = ["md", "lg", "xl", "full"] as const;

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
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
`,K=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Q=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-3",children:A.map(n=>e.jsx(K,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:n,size:"md",srLabel:n})},n))}),X=`import { IconButton, TRUE_COLORS } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
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
`,o=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),Y=()=>e.jsxs("div",{className:"flex w-full flex-wrap items-end gap-4",children:[e.jsx(o,{label:"Default",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",srLabel:"Default"})}),e.jsx(o,{label:"Loading",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",loading:!0,srLabel:"Loading"})}),e.jsx(o,{label:"Disabled",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",disabled:!0,srLabel:"Disabled"})}),e.jsx(o,{label:"Accent",children:e.jsx(a,{icon:"Send",variant:"soft",color:"blue",size:"lg",accent:!0,srLabel:"Accent"})}),e.jsx(o,{label:"Icon tint",children:e.jsx(a,{icon:"Star",variant:"soft",color:"neutral",size:"lg",iconColor:"red",srLabel:"Tinted icon"})}),e.jsx(o,{label:"Tooltip",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",tooltip:"Hover me",tooltipPosition:"top",srLabel:"Tooltip"})})]}),ee=`import { IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
  </div>
);

const States = () => (
  <div className="flex w-full flex-wrap items-end gap-4">
    <Swatch label="Default">
      <IconButton icon="Send" variant="solid" color="blue" size="lg" srLabel="Default" />
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
`,ne=["none","classic","halo"],ae=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),le=()=>e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:ne.map(n=>e.jsx(ae,{label:n,children:e.jsx(a,{icon:"Search",variant:"glass",color:"blue",size:"lg",specularMode:n,srLabel:n})},n))})}),se=`import { IconButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const SPECULAR_MODES = ["none", "classic", "halo"] as const;

const Swatch = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">{label}</span>
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
`,ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"Icon Button",description:"A square icon-only control. The full Button palette — variant, size, tone — plus corner radius, loading, accent and icon tint, glass fill with specular highlights, and a styled tooltip."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Every variant",description:"All button variants at one tone and size.",code:$,filename:"EveryVariant.tsx",children:e.jsx(Z,{})}),e.jsx(c,{title:"Size and corner",description:"The shared control scale, then the four corner radii at lg.",code:J,filename:"SizeAndCorner.tsx",children:e.jsx(F,{})}),e.jsx(c,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:X,filename:"EveryTone.tsx",children:e.jsx(Q,{})}),e.jsx(c,{title:"States",description:"Default, loading, disabled, accent, a tinted icon and a tooltip — hover and press these.",code:ee,filename:"States.tsx",children:e.jsx(Y,{})}),e.jsx(c,{title:"Glass",description:"The glass variant with the three specular highlight modes on a coloured backdrop.",code:se,filename:"Glass.tsx",children:e.jsx(le,{})})]})]});export{ce as IconButtonPage,ce as default};
