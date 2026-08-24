import{r as s,j as e,P as G,t as n,M as c,u as D,k as M,d as $}from"./index-BqiwG-pR.js";import{P as U,S as q,C as r,T as o,a as Z,E as x}from"./PlaygroundPanel-DuiPtEP5.js";import{t as K,A as F,n as H,i as J,j as Q,k as X}from"./options-CD99P1yv.js";const Y=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),ee=()=>{const[a,d]=s.useState("blue"),[l,m]=s.useState("soft"),[i,u]=s.useState("md"),[p,A]=s.useState(!1),[g,L]=s.useState(!0),[h,R]=s.useState(!1),[f,O]=s.useState(!1),[j,E]=s.useState(!1),[b,V]=s.useState(!1),[N,W]=s.useState("frosted"),[S,B]=s.useState("medium"),[C,_]=s.useState(void 0),[k,y]=s.useState(null),v=l==="glass"||l==="liquid-glass",P={tone:a,variant:l,size:i,uppercase:p,disabled:j,icon:g?"Check":void 0,trailingIcon:h?"ArrowRight":void 0,maxWidth:b?140:void 0,glassOpacity:N,vibrancy:S,specularMode:C};return e.jsx(U,{controls:e.jsxs(e.Fragment,{children:[e.jsx(q,{label:"Tone",options:K,value:a,onChange:t=>d(t)}),e.jsx(r,{label:"Variant",children:e.jsx(c,{fullWidth:!0,size:"sm",options:F,value:l,onChange:t=>m(t)})}),e.jsx(r,{label:"Size",children:e.jsx(c,{fullWidth:!0,size:"sm",options:H,value:i,onChange:t=>u(t)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Uppercase",checked:p,onChange:A}),e.jsx(o,{label:"Leading icon",checked:g,onChange:L}),e.jsx(o,{label:"Trailing icon",checked:h,onChange:R}),e.jsx(o,{label:"Clickable",checked:f,onChange:O}),e.jsx(o,{label:"Disabled",checked:j,onChange:E}),e.jsx(o,{label:"Truncate label",checked:b,onChange:V})]}),v&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{label:"Specular",children:e.jsx(c,{fullWidth:!0,size:"sm",options:J,value:C??(l==="liquid-glass"?"classic":"none"),onChange:t=>_(t)})}),e.jsx(r,{label:"Vibrancy",children:e.jsx(c,{fullWidth:!0,size:"sm",options:Q,value:S,onChange:t=>B(t)})}),e.jsx(r,{label:"Glass opacity",children:e.jsx(c,{fullWidth:!0,size:"sm",options:X,value:N,onChange:t=>W(t)})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The ",e.jsx("strong",{children:"glass"})," variants drop the tone fill for a translucent one. ",e.jsx("strong",{children:"Clickable"})," renders a real"," ",e.jsx("code",{children:"<button>"}),k&&` Last clicked: ${k}.`]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(G,{variant:v?"liquid-glass":"outlined",tone:v?a:"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(Y,{children:"Current settings"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{...P,onClick:f?()=>y("Operational"):void 0,children:"Operational"}),e.jsx(n,{...P,onClick:f?()=>y("A long label that runs on"):void 0,children:"A long label that runs on"})]})]})})})})},ae=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{tone:"emerald",variant:"soft",children:"Operational"}),e.jsx(n,{tone:"amber",variant:"soft",icon:"Warning",children:"Degraded"}),e.jsx(n,{tone:"rose",variant:"soft",icon:"Warning",children:"Offline"}),e.jsx(n,{tone:"blue",variant:"outline",icon:"Cog",children:"Maintenance"}),e.jsx(n,{tone:"slate",variant:"solid",dot:!0,label:"Standby"}),e.jsx(n,{tone:"slate",variant:"soft",size:"sm",children:"Standby"})]}),e.jsx("p",{className:"text-xs opacity-70",children:"A row of service states: filled, icon-led, outlined and a bare status dot. Each carries its own tone, so colour does the status work."})]}),ne=`import { Pill } from "@cjlapao/ui-kit";

const StatusBoard = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-wrap items-center gap-2">
      <Pill tone="emerald" variant="soft">
        Operational
      </Pill>
      <Pill tone="amber" variant="soft" icon="Warning">
        Degraded
      </Pill>
      <Pill tone="rose" variant="soft" icon="Warning">
        Offline
      </Pill>
      <Pill tone="blue" variant="outline" icon="Cog">
        Maintenance
      </Pill>
      <Pill tone="slate" variant="solid" dot label="Standby" />
      <Pill tone="slate" variant="soft" size="sm">
        Standby
      </Pill>
    </div>
    <p className="text-xs opacity-70">
      A row of service states: filled, icon-led, outlined and a bare status
      dot. Each carries its own tone, so colour does the status work.
    </p>
  </div>
);

export default StatusBoard;
`,w=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),se=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(w,{children:"Every variant"}),e.jsx("div",{className:"flex flex-wrap items-center gap-3",children:D.map(a=>e.jsx(n,{tone:"blue",variant:a,children:a},a))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(w,{children:"Every tone"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:M.map(a=>e.jsx(n,{variant:"soft",size:"xs",tone:a,children:a},a))})]})]}),te=`import { type ReactNode } from "react";
import { PILL_VARIANTS, TRUE_COLORS, Pill } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const VariantsAndTones = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Every variant</Caption>
      <div className="flex flex-wrap items-center gap-3">
        {PILL_VARIANTS.map((each) => (
          <Pill key={each} tone="blue" variant={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>Every tone</Caption>
      <div className="flex flex-wrap gap-1.5">
        {TRUE_COLORS.map((each) => (
          <Pill key={each} variant="soft" size="xs" tone={each}>
            {each}
          </Pill>
        ))}
      </div>
    </div>
  </div>
);

export default VariantsAndTones;
`,T=["xs","sm","md","lg","xl"],z=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),le=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Size ladder — pill and dot"}),e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:T.map(a=>e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx(n,{tone:"blue",variant:"soft",size:a,children:a}),e.jsx(n,{tone:"blue",variant:"soft",size:a,dot:!0,label:`Status ${a}`})]},a))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"A dot lines up with a Badge dot at the same size"}),e.jsx("div",{className:"flex items-center gap-4",children:T.map(a=>e.jsxs("span",{className:"flex items-center gap-1",children:[e.jsx(n,{tone:"blue",variant:"solid",size:a,dot:!0}),e.jsx($,{tone:"blue",size:a,dot:!0}),e.jsx("span",{className:"text-[10px] opacity-60",children:a})]},a))})]})]}),ie=`import { type ReactNode } from "react";
import { Badge, Pill } from "@cjlapao/ui-kit";
import type { PillSize } from "@cjlapao/ui-kit";

const SIZES: PillSize[] = ["xs", "sm", "md", "lg", "xl"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const SizeLadder = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Caption>Size ladder — pill and dot</Caption>
      <div className="flex flex-wrap items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1.5">
            <Pill tone="blue" variant="soft" size={value}>
              {value}
            </Pill>
            <Pill
              tone="blue"
              variant="soft"
              size={value}
              dot
              label={\`Status \${value}\`}
            />
          </span>
        ))}
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <Caption>A dot lines up with a Badge dot at the same size</Caption>
      <div className="flex items-center gap-4">
        {SIZES.map((value) => (
          <span key={value} className="flex items-center gap-1">
            <Pill tone="blue" variant="solid" size={value} dot />
            <Badge tone="blue" size={value} dot />
            <span className="text-[10px] opacity-60">{value}</span>
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default SizeLadder;
`,I=["production","eu-west-1","orchestrator","v2.14.0"],oe=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),ce=()=>{const[a,d]=s.useState(I),[l,m]=s.useState(null);return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(oe,{children:"Removable tags"}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[a.map(i=>e.jsx(n,{tone:"blue",variant:"soft",icon:"Key",onRemove:()=>d(u=>u.filter(p=>p!==i)),children:i},i)),a.length===0&&e.jsx("button",{type:"button",className:"text-xs underline opacity-70",onClick:()=>d(I),children:"Reset tags"})]})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2",children:[e.jsx(n,{tone:"emerald",variant:"soft",onClick:()=>m("Live"),children:"Live"}),e.jsx(n,{tone:"slate",variant:"soft",disabled:!0,children:"Disabled"}),e.jsx(n,{tone:"amber",variant:"soft",maxWidth:120,children:"A very long label that gets truncated"}),e.jsx(n,{tone:"rose",variant:"solid",dot:!0,label:"Error"})]}),l&&e.jsxs("p",{className:"text-xs opacity-70",children:["Last clicked: ",l," — a real button."]})]})},re=`import { useState, type ReactNode } from "react";
import { Pill } from "@cjlapao/ui-kit";

const INITIAL_TAGS = ["production", "eu-west-1", "orchestrator", "v2.14.0"];

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const InteractiveTags = () => {
  const [tags, setTags] = useState(INITIAL_TAGS);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Caption>Removable tags</Caption>
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((tag) => (
            <Pill
              key={tag}
              tone="blue"
              variant="soft"
              icon="Key"
              onRemove={() =>
                setTags((previous) => previous.filter((t) => t !== tag))
              }
            >
              {tag}
            </Pill>
          ))}
          {tags.length === 0 && (
            <button
              type="button"
              className="text-xs underline opacity-70"
              onClick={() => setTags(INITIAL_TAGS)}
            >
              Reset tags
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Pill tone="emerald" variant="soft" onClick={() => setClicked("Live")}>
          Live
        </Pill>
        <Pill tone="slate" variant="soft" disabled>
          Disabled
        </Pill>
        <Pill tone="amber" variant="soft" maxWidth={120}>
          A very long label that gets truncated
        </Pill>
        <Pill tone="rose" variant="solid" dot label="Error" />
      </div>
      {clicked && (
        <p className="text-xs opacity-70">Last clicked: {clicked} — a real button.</p>
      )}
    </div>
  );
};

export default InteractiveTags;
`,me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Z,{name:"Pill",description:"Small labels for status and metadata. Three opaque variants plus two glass ones, the full tone set, optional icons, a remove button, and a bare status dot."}),e.jsx(ee,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"Status board",description:"A row of service states — filled, icon-led, outlined and a bare dot — each carrying its own tone.",code:ne,filename:"StatusBoard.tsx",children:e.jsx(ae,{})}),e.jsx(x,{title:"Variants and tones",description:"All five variants side by side, then the full tone palette at once.",code:te,filename:"VariantsAndTones.tsx",children:e.jsx(se,{})}),e.jsx(x,{title:"Size ladder",description:"Pill and dot across the whole size scale — and a pill dot lines up with a Badge dot at the same size.",code:ie,filename:"SizeLadder.tsx",children:e.jsx(le,{})}),e.jsx(x,{title:"Interactive tags",description:"Removable tags (removing never activates the pill), a clickable pill, a disabled one, a truncated label and a labelled dot.",code:re,filename:"InteractiveTags.tsx",children:e.jsx(ce,{})})]})]});export{me as PillPage,me as default};
