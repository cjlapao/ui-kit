import{r as s,j as e,P as D,X as r,M as o}from"./index-p9Bv1Pn1.js";import{P as ne}from"./PageHeader-DCZtzAyX.js";import{E as d}from"./ExampleCard-BS13YSEO.js";import{P as se,C as i,S as f,T as c}from"./PlaygroundPanel-BDClNSzf.js";import{C as te}from"./ControlAccordion-CydkdljU.js";import{t as ae,B as M,n as R,U as oe,j as ie,k as ce,l as re}from"./options-Bqu3_N-h.js";const de=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),I=["glass","liquid-glass"],ue=[{label:"Multiple",value:"multiple"},{label:"Single",value:"single"}],pe=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"},{value:"registry",label:"Registry",icon:"Cache",disabled:!0}],me=()=>{const[n,a]=s.useState(["containers","images"]),[t,u]=s.useState("multiple"),[p,q]=s.useState("blue"),[m,A]=s.useState("solid"),[g,E]=s.useState("outline"),[S,z]=s.useState("sm"),[j,$]=s.useState("full"),[k,U]=s.useState("sm"),[C,F]=s.useState(!1),[w,L]=s.useState(!0),[h,H]=s.useState(!0),[x,K]=s.useState(!1),[N,B]=s.useState(!1),[v,_]=s.useState(!0),[b,X]=s.useState(!1),[y,J]=s.useState("frosted"),[P,Q]=s.useState("medium"),[O,Y]=s.useState("classic"),Z=s.useMemo(()=>pe.map(l=>({...l,icon:h?l.icon:void 0,description:x?l.description:void 0})),[h,x]),ee=I.includes(m)||I.includes(g),le={options:Z,selectionMode:t,color:p,variant:m,unselectedVariant:g,size:S,rounded:j,gap:k,disabled:C,allowDeselect:w,checkmark:N,glassOpacity:y,vibrancy:P,specularMode:O};return e.jsx(se,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Selection mode",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ue,value:t,onChange:l=>u(l)})}),e.jsx(f,{label:"Tone",options:ae,value:p,onChange:l=>q(l)}),e.jsx(f,{label:"Selected variant",options:M,value:m,onChange:l=>A(l)}),e.jsx(f,{label:"Unselected variant",options:M,value:g,onChange:l=>E(l)}),e.jsx(i,{label:"Size",children:e.jsx(o,{fullWidth:!0,size:"sm",options:R,value:S,onChange:l=>z(l)})}),e.jsx(i,{label:"Corner",children:e.jsx(o,{fullWidth:!0,size:"sm",options:oe,value:j,onChange:l=>$(l)})}),e.jsx(i,{label:"Gap",children:e.jsx(o,{fullWidth:!0,size:"sm",options:R,value:k,onChange:l=>U(l)})})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Icons",checked:h,onChange:H}),e.jsx(c,{label:"Counts",checked:x,onChange:K}),e.jsx(c,{label:"Check mark",checked:N,onChange:B}),e.jsx(c,{label:"Legend",checked:v,onChange:_}),e.jsx(c,{label:"Allow deselect",checked:w,onChange:L}),e.jsx(c,{label:"Disabled",checked:C,onChange:F}),e.jsx(c,{label:"On a glass panel",checked:b,onChange:X})]})},...ee?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Specular",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ie,value:O,onChange:l=>Y(l)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ce,value:P,onChange:l=>Q(l)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(o,{fullWidth:!0,size:"sm",options:re,value:y,onChange:l=>J(l)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Single"})," mode behaves like a radio group; turn"," ",e.jsx("strong",{children:"Allow deselect"})," off to make the choice required."," ",e.jsx("strong",{children:"Registry"})," is a per-option disabled pill. Each pill carries ",e.jsx("code",{children:"aria-pressed"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(D,{variant:b?"liquid-glass":"outlined",tone:b?p:"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-5",children:[e.jsx(r,{...le,name:"resources",value:n,onChange:a,legend:v?"Resources to include":void 0,description:v?"Pick what the backup job should snapshot.":void 0}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(de,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(l=>`resources[]=${l}`).join("&"):"— nothing selected —"})]})]})})})})},ge=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),he=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"}],xe=()=>{const[n,a]=s.useState(["containers","images"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(r,{name:"resources",options:he,value:n,onChange:a,legend:"Resources to include",description:"Pick what the backup job should snapshot.",color:"blue"}),e.jsx(ge,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(t=>`resources[]=${t}`).join("&"):"— nothing selected —"})]})},ve=`import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "containers", label: "Containers", icon: "Container", description: "42" },
  { value: "images", label: "Images", icon: "Docker", description: "17" },
  { value: "volumes", label: "Volumes", icon: "Save", description: "8" },
  { value: "networks", label: "Networks", icon: "Globe", description: "3" },
  { value: "secrets", label: "Secrets", icon: "Key", description: "0" },
];

const ResourceFilter = () => {
  const [selected, setSelected] = useState<string[]>(["containers", "images"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <MultiSelectPills
        name="resources"
        options={OPTIONS}
        value={selected}
        onChange={setSelected}
        legend="Resources to include"
        description="Pick what the backup job should snapshot."
        color="blue"
      />
      <Caption>Selected</Caption>
      <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
        {selected.length
          ? selected.map((value) => \`resources[]=\${value}\`).join("&")
          : "— nothing selected —"}
      </code>
    </div>
  );
};

export default ResourceFilter;
`,be=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),fe=[{value:"dev",label:"Development",icon:"Rocket"},{value:"staging",label:"Staging",icon:"Globe"},{value:"prod",label:"Production",icon:"Host"}],Se=()=>{const[n,a]=s.useState(["prod"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(r,{name:"environment",options:fe,value:n,onChange:a,selectionMode:"single",checkmark:!0,color:"violet",legend:"Target environment",description:"Single choice — picking another swaps it."}),e.jsx(be,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(t=>`environment[]=${t}`).join("&"):"— nothing selected —"})]})},je=`import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const ENVIRONMENTS: MultiSelectPillOption[] = [
  { value: "dev", label: "Development", icon: "Rocket" },
  { value: "staging", label: "Staging", icon: "Globe" },
  { value: "prod", label: "Production", icon: "Host" },
];

const SingleChoice = () => {
  const [selected, setSelected] = useState<string[]>(["prod"]);

  return (
    <div className="flex w-full flex-col gap-3">
      <MultiSelectPills
        name="environment"
        options={ENVIRONMENTS}
        value={selected}
        onChange={setSelected}
        selectionMode="single"
        checkmark
        color="violet"
        legend="Target environment"
        description="Single choice — picking another swaps it."
      />
      <Caption>Selected</Caption>
      <code className="rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10">
        {selected.length
          ? selected.map((value) => \`environment[]=\${value}\`).join("&")
          : "— nothing selected —"}
      </code>
    </div>
  );
};

export default SingleChoice;
`,G=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),T=[{value:"daily",label:"Daily",icon:"Calendar"},{value:"weekly",label:"Weekly",icon:"Calendar"},{value:"monthly",label:"Monthly",icon:"Calendar"},{value:"custom",label:"Custom",icon:"Cog",disabled:!0}],ke=()=>{const[n,a]=s.useState(["daily"]),[t,u]=s.useState(["weekly"]);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(G,{children:"Required choice — allowDeselect off, so it can't be emptied"}),e.jsx(r,{name:"schedule",options:T,value:n,onChange:a,selectionMode:"single",allowDeselect:!1,checkmark:!0,color:"emerald"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(G,{children:'Whole group disabled — "Custom" is also disabled per-option'}),e.jsx(r,{name:"schedule-disabled",options:T,value:t,onChange:u,disabled:!0,color:"slate"})]})]})},Ce=`import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "daily", label: "Daily", icon: "Calendar" },
  { value: "weekly", label: "Weekly", icon: "Calendar" },
  { value: "monthly", label: "Monthly", icon: "Calendar" },
  { value: "custom", label: "Custom", icon: "Cog", disabled: true },
];

const States = () => {
  const [required, setRequired] = useState<string[]>(["daily"]);
  const [whole, setWhole] = useState<string[]>(["weekly"]);

  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Caption>Required choice — allowDeselect off, so it can't be emptied</Caption>
        <MultiSelectPills
          name="schedule"
          options={OPTIONS}
          value={required}
          onChange={setRequired}
          selectionMode="single"
          allowDeselect={false}
          checkmark
          color="emerald"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Caption>Whole group disabled — "Custom" is also disabled per-option</Caption>
        <MultiSelectPills
          name="schedule-disabled"
          options={OPTIONS}
          value={whole}
          onChange={setWhole}
          disabled
          color="slate"
        />
      </div>
    </div>
  );
};

export default States;
`,V=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),W=[{value:"containers",label:"Containers",icon:"Container"},{value:"images",label:"Images",icon:"Docker"},{value:"volumes",label:"Volumes",icon:"Save"},{value:"networks",label:"Networks",icon:"Globe"}],we=()=>e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(V,{children:"Uncontrolled — it keeps its own state"}),e.jsx(r,{name:"uncontrolled",options:W,defaultValue:["volumes"],color:"blue"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(V,{children:"Glass variant on a glass panel"}),e.jsx(D,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(r,{name:"glass",options:W,defaultValue:["containers","networks"],variant:"liquid-glass",unselectedVariant:"glass",color:"blue"})})]})]}),Ne=`import { type ReactNode } from "react";
import { MultiSelectPills, Panel } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  { value: "containers", label: "Containers", icon: "Container" },
  { value: "images", label: "Images", icon: "Docker" },
  { value: "volumes", label: "Volumes", icon: "Save" },
  { value: "networks", label: "Networks", icon: "Globe" },
];

const UncontrolledAndGlass = () => (
  <div className="flex w-full flex-col gap-5">
    <div className="flex flex-col gap-2">
      <Caption>Uncontrolled — it keeps its own state</Caption>
      <MultiSelectPills
        name="uncontrolled"
        options={OPTIONS}
        defaultValue={["volumes"]}
        color="blue"
      />
    </div>
    <div className="flex flex-col gap-2">
      <Caption>Glass variant on a glass panel</Caption>
      <Panel variant="liquid-glass" tone="blue" padding="md">
        <MultiSelectPills
          name="glass"
          options={OPTIONS}
          defaultValue={["containers", "networks"]}
          variant="liquid-glass"
          unselectedVariant="glass"
          color="blue"
        />
      </Panel>
    </div>
  </div>
);

export default UncontrolledAndGlass;
`,Ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ne,{name:"Multi Select Pills",description:"A row of pills used as a checkbox or radio group. It renders the kit's Pill, so it inherits every variant, tone, size and corner — including the glass pair."}),e.jsx(me,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Resource filter",description:"The canonical case: a multi-select of what to include, with icons and counts, and a live readout of what a form submit would carry.",code:ve,filename:"ResourceFilter.tsx",children:e.jsx(xe,{})}),e.jsx(d,{title:"Single choice",description:"Single mode behaves like a radio group — picking another swaps the selection, and a check mark keeps the state out of colour alone.",code:je,filename:"SingleChoice.tsx",children:e.jsx(Se,{})}),e.jsx(d,{title:"States",description:"A required single choice that can't be emptied, and a whole group disabled with one option disabled per-option.",code:Ce,filename:"States.tsx",children:e.jsx(ke,{})}),e.jsx(d,{title:"Uncontrolled and glass",description:"An uncontrolled group that keeps its own state, and the glass variants sitting on a glass panel.",code:Ne,filename:"UncontrolledAndGlass.tsx",children:e.jsx(we,{})})]})]});export{Ge as MultiSelectPillsPage,Ge as default};
