import{r as s,j as e,k as a,M as d,y as O,o as B,l as A}from"./index-8i9ZNynb.js";import{P as D}from"./PageHeader-CO5k_SQv.js";import{E as i}from"./ExampleCard-LdxcpmX_.js";import{P,S as v,C as p,T as c}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as U}from"./ControlAccordion-Bqp-1oBj.js";import{r as _,n as V,t as M,D as G,j as H}from"./options-yAU-f7tt.js";const W=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),Z=()=>{const[n,t]=s.useState("icon"),[x,w]=s.useState("md"),[u,N]=s.useState("blue"),[m,k]=s.useState("full"),[h,C]=s.useState(!1),[g,y]=s.useState(!1),[f,L]=s.useState(!1),[r,z]=s.useState(!1),[b,T]=s.useState(!1),[S,R]=s.useState("none"),[E,I]=s.useState(0);return e.jsx(P,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(U,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(v,{label:"Variant",options:_,value:n,onChange:l=>t(l)}),e.jsx(p,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:V,value:x,onChange:l=>w(l)})}),e.jsx(v,{label:"Tone",options:M,value:u,onChange:l=>N(l)}),e.jsx(p,{label:"Rounded",children:e.jsx(d,{fullWidth:!0,size:"sm",options:G,value:m,onChange:l=>k(l)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Loading",checked:h,onChange:C}),e.jsx(c,{label:"Disabled",checked:g,onChange:y}),e.jsx(c,{label:"Accent",checked:f,onChange:L}),e.jsx(c,{label:"Glass",checked:r,onChange:z}),e.jsx(c,{label:"Tooltip",checked:b,onChange:T})]})},...r?[{id:"glass",title:"Glass",controls:e.jsx(p,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:H,value:S,onChange:l=>R(l)})})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Icon buttons carry no text — the ",e.jsx("strong",{children:"srLabel"})," is what gets announced and doubles as the native title. Loading swaps the glyph for a spinner and blocks clicks."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900",children:e.jsx(a,{icon:"Send",variant:n,color:u,size:x,rounded:m,loading:h,disabled:g,accent:f,glass:r,specularMode:r?S:"none",tooltip:b?"Send message":void 0,tooltipPosition:"top",srLabel:"Send",onClick:()=>I(l=>l+1)})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(W,{children:"Clicks"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:E})]})]})})},$=()=>e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:O.map(n=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(a,{icon:"Send",variant:n,color:"blue",size:"md",srLabel:n}),e.jsx("span",{className:"text-sm opacity-70",children:n})]},n))}),q=`import { BUTTON_VARIANTS, IconButton } from "@cjlapao/ui-kit";

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
`,F=["md","lg","xl","full"],j=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),J=()=>e.jsxs("div",{className:"flex w-full flex-col gap-6",children:[e.jsx("div",{className:"flex flex-wrap items-end gap-3",children:B.map(n=>e.jsx(j,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:n,srLabel:n})},n))}),e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:F.map(n=>e.jsx(j,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",rounded:n,srLabel:n})},n))})]}),K=`import { CONTROL_SIZES, IconButton } from "@cjlapao/ui-kit";
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
`,Q=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),X=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-3",children:A.map(n=>e.jsx(Q,{label:n,children:e.jsx(a,{icon:"Send",variant:"solid",color:n,size:"md",srLabel:n})},n))}),Y=`import { IconButton, TRUE_COLORS } from "@cjlapao/ui-kit";
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
`,o=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),ee=()=>e.jsxs("div",{className:"flex w-full flex-wrap items-end gap-4",children:[e.jsx(o,{label:"Default",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",srLabel:"Default"})}),e.jsx(o,{label:"Loading",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",loading:!0,srLabel:"Loading"})}),e.jsx(o,{label:"Disabled",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",disabled:!0,srLabel:"Disabled"})}),e.jsx(o,{label:"Accent",children:e.jsx(a,{icon:"Send",variant:"soft",color:"blue",size:"lg",accent:!0,srLabel:"Accent"})}),e.jsx(o,{label:"Icon tint",children:e.jsx(a,{icon:"Star",variant:"soft",color:"neutral",size:"lg",iconColor:"red",srLabel:"Tinted icon"})}),e.jsx(o,{label:"Tooltip",children:e.jsx(a,{icon:"Send",variant:"solid",color:"blue",size:"lg",tooltip:"Hover me",tooltipPosition:"top",srLabel:"Tooltip"})})]}),ne=`import { IconButton } from "@cjlapao/ui-kit";
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
`,ae=["none","classic","halo"],le=({label:n,children:t})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[t,e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:n})]}),se=()=>e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"flex flex-wrap items-end gap-4",children:ae.map(n=>e.jsx(le,{label:n,children:e.jsx(a,{icon:"Search",variant:"glass",color:"blue",size:"lg",specularMode:n,srLabel:n})},n))})}),te=`import { IconButton } from "@cjlapao/ui-kit";
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
`,xe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(D,{name:"Icon Button",description:"A square icon-only control. The full Button palette — variant, size, tone — plus corner radius, loading, accent and icon tint, glass fill with specular highlights, and a styled tooltip."}),e.jsx(Z,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Every variant",description:"All button variants at one tone and size.",code:q,filename:"EveryVariant.tsx",children:e.jsx($,{})}),e.jsx(i,{title:"Size and corner",description:"The shared control scale, then the four corner radii at lg.",code:K,filename:"SizeAndCorner.tsx",children:e.jsx(J,{})}),e.jsx(i,{title:"Every tone",description:"All 21 true colours, solid at one size.",code:Y,filename:"EveryTone.tsx",children:e.jsx(X,{})}),e.jsx(i,{title:"States",description:"Default, loading, disabled, accent, a tinted icon and a tooltip — hover and press these.",code:ne,filename:"States.tsx",children:e.jsx(ee,{})}),e.jsx(i,{title:"Glass",description:"The glass variant with the three specular highlight modes on a coloured backdrop.",code:te,filename:"Glass.tsx",children:e.jsx(se,{})})]})]});export{xe as IconButtonPage,xe as default};
