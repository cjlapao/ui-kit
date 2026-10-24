import{r,j as e,P as l,H as s,C as I,p as t,c as i,e as b,i as C}from"./index-gt012o8E.js";import{P}from"./PageHeader-CzVhyXQL.js";import{E as c}from"./ExampleCard-V3REeYJ5.js";import{A as F,a as g,C as o,b as V,P as E}from"./A11ySections-zw3_3X-2.js";import{P as U,C as d,T as y,a as z}from"./PlaygroundPanel-Czrs7oXC.js";import{C as D}from"./ControlAccordion-DIXHht2n.js";import{d as f,e as O}from"./options-CtADNKbm.js";const M=[{label:"Navigation",content:e.jsxs(e.Fragment,{children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]})},{label:"View",content:e.jsxs(e.Fragment,{children:[e.jsx(i,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})},{label:"Alerts",content:e.jsxs(e.Fragment,{children:[e.jsx(i,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(b,{count:4,tone:"rose",size:"xs"})]})},{label:"Actions",content:e.jsx(C,{size:"xs",variant:"soft",color:"blue",children:"Deploy"})}],Z=()=>{const[n,x]=r.useState("sm"),[j,L]=r.useState("xs"),[v,B]=r.useState(!0),[w,S]=r.useState("xs"),[h,H]=r.useState(!1),[N,T]=r.useState("blue"),[G,R]=r.useState("outlined"),[m,A]=r.useState(3);return e.jsx(U,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(D,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Gap between groups",options:f,value:n,onChange:a=>x(a)}),e.jsx(d,{label:"Gap between items",options:f,value:j,onChange:a=>L(a)}),e.jsx(d,{label:"Header surface",options:O,value:G,onChange:a=>R(a)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(y,{label:"Separator",checked:v,onChange:B}),e.jsx(d,{label:"Separator thickness",options:f,value:w,onChange:a=>S(a)}),e.jsx(y,{label:"Tone the separator",checked:h,onChange:H}),h&&e.jsx(z,{label:"Separator tone",children:e.jsx(I,{selectable:!0,size:"sm",value:N,onSelect:T,defaultExpanded:!0})})]})},{id:"content",title:"Content",controls:e.jsx(z,{label:`Groups — ${m}`,children:e.jsx("input",{type:"range",min:1,max:4,value:m,onChange:a=>A(Number(a.target.value)),className:"w-full accent-blue-500"})})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drop to ",e.jsx("strong",{children:"one group"})," — no leading rule appears, because the separator is drawn by the ",e.jsx("em",{children:"following"})," group. Untoned it is a fraction of the header's own text colour, so it follows the surface."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(l,{variant:G,tone:"neutral",padding:"none",children:e.jsx("div",{className:"flex h-14 items-center px-4",children:M.slice(0,m).map(a=>e.jsx(s,{gap:n,itemGap:j,divider:v,separatorSize:w,tone:h?N:void 0,label:a.label,children:a.content},a.label))})})})})},q=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-14 items-center px-4",children:[e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{label:"View",children:[e.jsx(i,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]}),e.jsxs(s,{label:"Alerts",children:[e.jsx(i,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(b,{count:4,tone:"rose",size:"xs"})]}),e.jsx(s,{label:"Actions",children:e.jsx(C,{size:"xs",variant:"soft",color:"blue",children:"Deploy"})})]})}),e.jsx("p",{className:"text-xs opacity-70",children:"Four clusters — navigation, view, alerts and actions — with a separator drawn between each adjacent pair. The first group never gets a leading rule."})]}),$=`import React from "react";
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
`,K=["xs","sm","md","lg","xl"],_=({gap:n})=>e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsx("span",{className:"w-8 text-xs opacity-60",children:n}),e.jsxs(s,{gap:n,label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{gap:n,label:"View",children:[e.jsx(i,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]}),e.jsxs(s,{gap:n,label:"Alerts",children:[e.jsx(i,{icon:"Notification",size:"sm",tone:"blue"}),e.jsx(b,{count:4,tone:"rose",size:"xs"})]})]}),J=()=>e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:K.map(n=>e.jsx(_,{gap:n},n))})}),e.jsx("p",{className:"text-xs opacity-70",children:"The separator reads the same custom property as the gap, so the rule stays centred between the groups at every step of the scale."})]}),Q=`import React from "react";
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
`,k=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),W=()=>e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(k,{children:"One group — no leading rule"}),e.jsx(l,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsx("div",{className:"flex h-12 items-center px-4",children:e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]})})})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(k,{children:"Two groups — a rule between them"}),e.jsx(l,{variant:"outlined",tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsxs(s,{label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{label:"View",children:[e.jsx(i,{icon:"ViewGrid",size:"sm",tone:"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})]})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The separator is a pseudo-element on the ",e.jsx("em",{children:"following"})," group, so a lone group draws nothing and no wrapper is needed between groups."]})]}),X=`import React from "react";
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
`,p=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),u=({tone:n,surface:x})=>e.jsx(l,{variant:x,tone:"neutral",padding:"none",children:e.jsxs("div",{className:"flex h-12 items-center px-4",children:[e.jsxs(s,{tone:n,label:"Navigation",children:[e.jsx(t,{icon:"Back",variant:"ghost",size:"xs",srLabel:"Back"}),e.jsx(t,{icon:"ArrowRight",variant:"ghost",size:"xs",srLabel:"Forward"})]}),e.jsxs(s,{tone:n,label:"View",children:[e.jsx(i,{icon:"ViewGrid",size:"sm",tone:n??"blue"}),e.jsx("span",{className:"text-sm font-medium",children:"Grid"})]})]})}),Y=()=>e.jsxs("div",{className:"grid grid-cols-1 gap-4 sm:grid-cols-2",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(p,{children:"Untoned — follows the surface"}),e.jsx(u,{surface:"outlined"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(p,{children:"Toned: rose"}),e.jsx(u,{tone:"rose",surface:"outlined"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(p,{children:"Untoned on glass"}),e.jsx(u,{surface:"glass"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(p,{children:"Toned: blue on glass"}),e.jsx(u,{tone:"blue",surface:"glass"})]}),e.jsx("p",{className:"text-xs opacity-70 sm:col-span-2",children:"Untoned the rule is a quarter of the surrounding text colour, so it adapts to light, dark and glass alike. A tone sets it to that colour at 400."})]}),ee=`import React from "react";
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
`,ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"Header Group",description:"Clusters related header controls. Adjacent groups get a separator automatically — a lone group never draws one."}),e.jsx(Z,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Toolbar",description:"Four clusters — navigation, view, alerts and actions — in a single header bar, separated between adjacent groups.",code:$,filename:"ToolbarHero.tsx",children:e.jsx(q,{})}),e.jsx(c,{title:"Gap ladder",description:"Every gap size on the same three groups. The separator shares the gap's custom property, so it stays centred at each step.",code:Q,filename:"GapLadder.tsx",children:e.jsx(J,{})}),e.jsx(c,{title:"Lone group",description:"A single group draws no leading rule; add a second and the rule appears between them.",code:X,filename:"LoneGroup.tsx",children:e.jsx(W,{})}),e.jsx(c,{title:"Toned separators",description:"Untoned the rule follows the surface — light, dark and glass. A tone sets it to that colour.",code:ee,filename:"TonedSeparators.tsx",children:e.jsx(Y,{})})]}),e.jsxs(F,{children:[e.jsxs(g,{title:"Screen reader",children:[e.jsxs("p",{children:["Every cluster is a ",e.jsx(o,{children:'role="group"'})," with its ",e.jsx(o,{children:"label"})," as the accessible name, so screen readers can announce what a set of controls is for — name it, because an unnamed group is usually skipped. The visual separator is a CSS ",e.jsx(o,{children:"::before"})," with empty content: purely decoration, invisible to the accessibility tree. The grouping semantics come from the role, never from the rule — turning"," ",e.jsx(o,{children:"divider"})," off changes nothing for assistive technology."]}),e.jsx(V,{filename:"Naming.tsx",code:ne})]}),e.jsx(g,{title:"Keyboard Support",children:e.jsx("p",{children:"The container itself is not focusable and adds no key bindings — that would only steal tab stops from what matters. The controls inside (buttons, toggles, links) keep their own native behaviour and order."})}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["The component emits no strings of its own; the only text is the caller’s ",e.jsx(o,{children:"label"}),". Layout is flex with flow-relative spacing and DOM adjacency, so groups, gaps and the between-rules mirror correctly under ",e.jsx(o,{children:'dir="rtl"'})," with no configuration."]})})]}),e.jsx(E,{props:[{name:"children",type:"ReactNode",description:"The related controls in this cluster."},{name:"gap",type:"ControlSize",default:"sm",description:e.jsx(e.Fragment,{children:"Space before this group when another precedes it; the separator’s offset reads the same value."})},{name:"itemGap",type:"ControlSize",default:"xs",description:"Space between the items inside the group."},{name:"divider",type:"boolean",default:"true",description:"Draw the rule when a group is present (a lone group never draws one)."},{name:"separatorSize",type:"ControlSize | number",default:"xs",description:e.jsxs(e.Fragment,{children:["Separator thickness — the shared scale (1/2/3/4/6 px) or raw pixels, like ",e.jsx(o,{children:"AppDivider"}),"’s ",e.jsx(o,{children:"size"}),". The rule is drawn transform-free so it always pixel-snaps — one crisp thickness everywhere."]})},{name:"tone",type:"TrueColor",description:e.jsx(e.Fragment,{children:"Separator colour. Omit it and the rule is a fraction of the surface’s own text colour, which adapts on glass."})},{name:"label",type:"string",description:e.jsx(e.Fragment,{children:"Accessible name for the group — without it, the group is anonymous and often skipped."})},{name:"className/style",type:"string / CSSProperties",description:e.jsxs(e.Fragment,{children:["Merged onto the group wrapper; the component’s own custom properties (",e.jsx(o,{children:"--header-group-gap"}),","," ",e.jsx(o,{children:"--header-group-divider"}),") can be overridden through"," ",e.jsx(o,{children:"style"}),"."]})},{name:"…div props",type:"HTMLAttributes",description:"The rest land on the wrapper div."}]})]}),ne=`// Name the clusters — the separator is decoration,
// the label is the semantics.
<HeaderGroup label="Navigation">
  <IconButton icon="Back" srLabel="Back" />
  <IconButton icon="ArrowRight" srLabel="Forward" />
</HeaderGroup>`;export{ce as HeaderGroupPage,ce as default};
