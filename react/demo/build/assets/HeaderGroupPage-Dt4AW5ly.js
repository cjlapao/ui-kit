import{r,j as e,P as i,H as s,M as v,k as t,C as o,d as m,e as L}from"./index-p9Bv1Pn1.js";import{P as T}from"./PageHeader-DCZtzAyX.js";import{E as l}from"./ExampleCard-BS13YSEO.js";import{P as I,C as u,S as w,T as N}from"./PlaygroundPanel-BDClNSzf.js";import{C as P}from"./ControlAccordion-CydkdljU.js";import{n as G,t as S,d as F}from"./options-Bqu3_N-h.js";const A=[{label:"Navigation",content:e.jsxs(e.Fragment,{children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]})},{label:"View",content:e.jsxs(e.Fragment,{children:[e.jsx(o,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})},{label:"Alerts",content:e.jsxs(e.Fragment,{children:[e.jsx(o,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(m,{count:4,tone:"rose",size:"xs"})]})},{label:"Actions",content:e.jsx(L,{size:"xs",variant:"soft",color:"blue",children:"Deploy"})}],V=()=>{const[n,p]=r.useState("sm"),[h,k]=r.useState("xs"),[g,B]=r.useState(!0),[f,C]=r.useState(!1),[j,H]=r.useState("blue"),[b,y]=r.useState("outlined"),[x,R]=r.useState(3);return e.jsx(I,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(P,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Gap between groups",children:e.jsx(v,{fullWidth:!0,size:"sm",options:G,value:n,onChange:a=>p(a)})}),e.jsx(u,{label:"Gap between items",children:e.jsx(v,{fullWidth:!0,size:"sm",options:G,value:h,onChange:a=>k(a)})}),e.jsx(w,{label:"Tone",options:S,value:j,onChange:a=>H(a)}),e.jsx(w,{label:"Header surface",options:F,value:b,onChange:a=>y(a)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(N,{label:"Separator",checked:g,onChange:B}),e.jsx(N,{label:"Tone the separator",checked:f,onChange:C})]})},{id:"content",title:"Content",controls:e.jsx(u,{label:`Groups — ${x}`,children:e.jsx("input",{type:"range",min:1,max:4,value:x,onChange:a=>R(Number(a.target.value)),className:"w-full accent-blue-500"})})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drop to ",e.jsx("strong",{children:"one group"})," — no leading rule appears, because the separator is drawn by the ",e.jsx("em",{children:"following"})," group. Untoned it is a fraction of the header's own text colour, so it follows the surface."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(i,{variant:b,tone:"neutral",padding:"none",children:e.jsx("div",{className:"flex h-14 items-center px-4",children:A.slice(0,x).map(a=>e.jsx(s,{gap:n,itemGap:h,divider:g,tone:f?j:void 0,label:a.label,children:a.content},a.label))})})})})},U=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(i,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-14 items-center px-4",children:[e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{label:"View",children:[e.jsx(o,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]}),e.jsxs(s,{label:"Alerts",children:[e.jsx(o,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(m,{count:4,tone:"rose",size:"xs"})]}),e.jsx(s,{label:"Actions",children:e.jsx(L,{size:"xs",variant:"soft",color:"blue",children:"Deploy"})})]})}),e.jsx("p",{className:"text-xs opacity-70",children:"Four clusters — navigation, view, alerts and actions — with a separator drawn between each adjacent pair. The first group never gets a leading rule."})]}),E=`import React from "react";
import {
  Badge,
  Button,
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";

const ToolbarHero: React.FC = () => (
  <div className="flex flex-col gap-4">
    <Panel variant="outlined" tone="neutral" padding="none">
      <div className="flex h-14 items-center px-4">
        <HeaderGroup label="Navigation">
          <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
          <IconButton
            icon="ArrowRight"
            variant="ghost"
            size="xs"
            srLabel="Forward"
          />
        </HeaderGroup>
        <HeaderGroup label="View">
          <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
          <span className="text-sm font-medium">Grid</span>
        </HeaderGroup>
        <HeaderGroup label="Alerts">
          <CustomIcon icon="Notification" size="sm" tone="blue" />
          <Badge count={4} tone="rose" size="xs" />
        </HeaderGroup>
        <HeaderGroup label="Actions">
          <Button size="xs" variant="soft" color="blue">
            Deploy
          </Button>
        </HeaderGroup>
      </div>
    </Panel>
    <p className="text-xs opacity-70">
      Four clusters — navigation, view, alerts and actions — with a separator
      drawn between each adjacent pair. The first group never gets a leading
      rule.
    </p>
  </div>
);

export default ToolbarHero;
`,O=["xs","sm","md","lg","xl"],D=({gap:n})=>e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsx("span",{className:"w-8 text-xs opacity-60",children:n}),e.jsxs(s,{gap:n,label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{gap:n,label:"View",children:[e.jsx(o,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]}),e.jsxs(s,{gap:n,label:"Alerts",children:[e.jsx(o,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(m,{count:4,tone:"rose",size:"xs"})]})]}),Z=()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:O.map(n=>e.jsx(D,{gap:n},n))})}),e.jsx("p",{className:"text-xs opacity-70",children:"The separator reads the same custom property as the gap, so the rule stays centred between the groups at every step of the scale."})]}),q=`import React from "react";
import {
  Badge,
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";
import type { ControlSize } from "@cjlapao/ui-kit";

const SIZES: ControlSize[] = ["xs", "sm", "md", "lg", "xl"];

const Row: React.FC<{ gap: ControlSize }> = ({ gap }) => (
  <div className="flex h-12 items-center px-4">
    <span className="w-8 text-xs opacity-60">{gap}</span>
    <HeaderGroup gap={gap} label="Navigation">
      <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
      <IconButton
        icon="ArrowRight"
        variant="ghost"
        size="xs"
        srLabel="Forward"
      />
    </HeaderGroup>
    <HeaderGroup gap={gap} label="View">
      <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
      <span className="text-sm font-medium">Grid</span>
    </HeaderGroup>
    <HeaderGroup gap={gap} label="Alerts">
      <CustomIcon icon="Notification" size="sm" tone="blue" />
      <Badge count={4} tone="rose" size="xs" />
    </HeaderGroup>
  </div>
);

const GapLadder: React.FC = () => (
  <div className="flex flex-col gap-3">
    <Panel variant="outlined" tone="neutral" padding="none">
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {SIZES.map((size) => (
          <Row key={size} gap={size} />
        ))}
      </div>
    </Panel>
    <p className="text-xs opacity-70">
      The separator reads the same custom property as the gap, so the rule
      stays centred between the groups at every step of the scale.
    </p>
  </div>
);

export default GapLadder;
`,z=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),M=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"One group — no leading rule"}),e.jsx(i,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsx("div",{className:"flex h-12 items-center px-4",children:e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]})})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(z,{children:"Two groups — a rule between them"}),e.jsx(i,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{label:"View",children:[e.jsx(o,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})]})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The separator is a pseudo-element on the ",e.jsx("em",{children:"following"})," group, so a lone group draws nothing and no wrapper is needed between groups."]})]}),W=`import React from "react";
import {
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const LoneGroup: React.FC = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-2">
      <Label>One group — no leading rule</Label>
      <Panel variant="outlined" tone="neutral" padding="none">
        <div className="flex h-12 items-center px-4">
          <HeaderGroup label="Navigation">
            <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
            <IconButton
              icon="ArrowRight"
              variant="ghost"
              size="xs"
              srLabel="Forward"
            />
          </HeaderGroup>
        </div>
      </Panel>
    </div>
    <div className="flex flex-col gap-2">
      <Label>Two groups — a rule between them</Label>
      <Panel variant="outlined" tone="neutral" padding="none">
        <div className="flex h-12 items-center px-4">
          <HeaderGroup label="Navigation">
            <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
            <IconButton
              icon="ArrowRight"
              variant="ghost"
              size="xs"
              srLabel="Forward"
            />
          </HeaderGroup>
          <HeaderGroup label="View">
            <CustomIcon icon="ViewGrid" size="sm" tone="blue" />
            <span className="text-sm font-medium">Grid</span>
          </HeaderGroup>
        </div>
      </Panel>
    </div>
    <p className="text-xs opacity-70">
      The separator is a pseudo-element on the <em>following</em> group, so a
      lone group draws nothing and no wrapper is needed between groups.
    </p>
  </div>
);

export default LoneGroup;
`,c=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),d=({tone:n,surface:p})=>e.jsx(i,{variant:p,tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsxs(s,{tone:n,label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{tone:n,label:"View",children:[e.jsx(o,{icon:"ViewGrid",size:"sm",tone:n??"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})]})}),$=()=>e.jsxs("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Untoned — follows the surface"}),e.jsx(d,{surface:"outlined"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Toned: rose"}),e.jsx(d,{tone:"rose",surface:"outlined"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Untoned on glass"}),e.jsx(d,{surface:"glass"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(c,{children:"Toned: blue on glass"}),e.jsx(d,{tone:"blue",surface:"glass"})]}),e.jsx("p",{className:"text-xs opacity-70 sm:col-span-2",children:"Untoned the rule is a quarter of the surrounding text colour, so it adapts to light, dark and glass alike. A tone sets it to that colour at 400."})]}),J=`import React from "react";
import {
  CustomIcon,
  HeaderGroup,
  IconButton,
  Panel,
} from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const Pair: React.FC<{ tone?: TrueColor; surface: "outlined" | "glass" }> = ({
  tone,
  surface,
}) => (
  <Panel variant={surface} tone="neutral" padding="none">
    <div className="flex h-12 items-center px-4">
      <HeaderGroup tone={tone} label="Navigation">
        <IconButton icon="Back" variant="ghost" size="xs" srLabel="Back" />
        <IconButton
          icon="ArrowRight"
          variant="ghost"
          size="xs"
          srLabel="Forward"
        />
      </HeaderGroup>
      <HeaderGroup tone={tone} label="View">
        <CustomIcon icon="ViewGrid" size="sm" tone={tone ?? "blue"} />
        <span className="text-sm font-medium">Grid</span>
      </HeaderGroup>
    </div>
  </Panel>
);

const TonedSeparators: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <div className="flex flex-col gap-2">
      <Label>Untoned — follows the surface</Label>
      <Pair surface="outlined" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Toned: rose</Label>
      <Pair tone="rose" surface="outlined" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Untoned on glass</Label>
      <Pair surface="glass" />
    </div>
    <div className="flex flex-col gap-2">
      <Label>Toned: blue on glass</Label>
      <Pair tone="blue" surface="glass" />
    </div>
    <p className="text-xs opacity-70 sm:col-span-2">
      Untoned the rule is a quarter of the surrounding text colour, so it
      adapts to light, dark and glass alike. A tone sets it to that colour at
      400.
    </p>
  </div>
);

export default TonedSeparators;
`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(T,{name:"Header Group",description:"Clusters related header controls. Adjacent groups get a separator automatically — a lone group never draws one."}),e.jsx(V,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Toolbar",description:"Four clusters — navigation, view, alerts and actions — in a single header bar, separated between adjacent groups.",code:E,filename:"ToolbarHero.tsx",children:e.jsx(U,{})}),e.jsx(l,{title:"Gap ladder",description:"Every gap size on the same three groups. The separator shares the gap's custom property, so it stays centred at each step.",code:q,filename:"GapLadder.tsx",children:e.jsx(Z,{})}),e.jsx(l,{title:"Lone group",description:"A single group draws no leading rule; add a second and the rule appears between them.",code:W,filename:"LoneGroup.tsx",children:e.jsx(M,{})}),e.jsx(l,{title:"Toned separators",description:"Untoned the rule follows the surface — light, dark and glass. A tone sets it to that colour.",code:J,filename:"TonedSeparators.tsx",children:e.jsx($,{})})]})]});export{ne as HeaderGroupPage,ne as default};
