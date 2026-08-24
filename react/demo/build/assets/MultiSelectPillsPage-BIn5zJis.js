import{r as s,j as e,P as D,R as r,M as o}from"./index-BqiwG-pR.js";import{P as ne,C as i,S as f,T as c,a as se,E as d}from"./PlaygroundPanel-DuiPtEP5.js";import{t as te,A as M,n as R,O as ae,i as oe,j as ie,k as ce}from"./options-CD99P1yv.js";const re=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),I=["glass","liquid-glass"],de=[{label:"Multiple",value:"multiple"},{label:"Single",value:"single"}],ue=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"},{value:"registry",label:"Registry",icon:"Cache",disabled:!0}],pe=()=>{const[n,a]=s.useState(["containers","images"]),[t,u]=s.useState("multiple"),[p,q]=s.useState("blue"),[h,A]=s.useState("solid"),[g,E]=s.useState("outline"),[S,z]=s.useState("sm"),[j,$]=s.useState("full"),[k,U]=s.useState("sm"),[C,F]=s.useState(!1),[w,L]=s.useState(!0),[m,H]=s.useState(!0),[x,K]=s.useState(!1),[N,_]=s.useState(!1),[v,B]=s.useState(!0),[b,J]=s.useState(!1),[y,Q]=s.useState("frosted"),[P,X]=s.useState("medium"),[O,Y]=s.useState("classic"),Z=s.useMemo(()=>ue.map(l=>({...l,icon:m?l.icon:void 0,description:x?l.description:void 0})),[m,x]),ee=I.includes(h)||I.includes(g),le={options:Z,selectionMode:t,color:p,variant:h,unselectedVariant:g,size:S,rounded:j,gap:k,disabled:C,allowDeselect:w,checkmark:N,glassOpacity:y,vibrancy:P,specularMode:O};return e.jsx(ne,{controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Selection mode",children:e.jsx(o,{fullWidth:!0,size:"sm",options:de,value:t,onChange:l=>u(l)})}),e.jsx(f,{label:"Tone",options:te,value:p,onChange:l=>q(l)}),e.jsx(f,{label:"Selected variant",options:M,value:h,onChange:l=>A(l)}),e.jsx(f,{label:"Unselected variant",options:M,value:g,onChange:l=>E(l)}),e.jsx(i,{label:"Size",children:e.jsx(o,{fullWidth:!0,size:"sm",options:R,value:S,onChange:l=>z(l)})}),e.jsx(i,{label:"Corner",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ae,value:j,onChange:l=>$(l)})}),e.jsx(i,{label:"Gap",children:e.jsx(o,{fullWidth:!0,size:"sm",options:R,value:k,onChange:l=>U(l)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Icons",checked:m,onChange:H}),e.jsx(c,{label:"Counts",checked:x,onChange:K}),e.jsx(c,{label:"Check mark",checked:N,onChange:_}),e.jsx(c,{label:"Legend",checked:v,onChange:B}),e.jsx(c,{label:"Allow deselect",checked:w,onChange:L}),e.jsx(c,{label:"Disabled",checked:C,onChange:F}),e.jsx(c,{label:"On a glass panel",checked:b,onChange:J})]}),ee&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Specular",children:e.jsx(o,{fullWidth:!0,size:"sm",options:oe,value:O,onChange:l=>Y(l)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ie,value:P,onChange:l=>X(l)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ce,value:y,onChange:l=>Q(l)})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Single"})," mode behaves like a radio group; turn"," ",e.jsx("strong",{children:"Allow deselect"})," off to make the choice required."," ",e.jsx("strong",{children:"Registry"})," is a per-option disabled pill. Each pill carries ",e.jsx("code",{children:"aria-pressed"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(D,{variant:b?"liquid-glass":"outlined",tone:b?p:"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-5",children:[e.jsx(r,{...le,name:"resources",value:n,onChange:a,legend:v?"Resources to include":void 0,description:v?"Pick what the backup job should snapshot.":void 0}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(re,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(l=>`resources[]=${l}`).join("&"):"— nothing selected —"})]})]})})})})},he=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),ge=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"}],me=()=>{const[n,a]=s.useState(["containers","images"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(r,{name:"resources",options:ge,value:n,onChange:a,legend:"Resources to include",description:"Pick what the backup job should snapshot.",color:"blue"}),e.jsx(he,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(t=>`resources[]=${t}`).join("&"):"— nothing selected —"})]})},xe=`import { useState, type ReactNode } from "react";
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
`,ve=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),be=[{value:"dev",label:"Development",icon:"Rocket"},{value:"staging",label:"Staging",icon:"Globe"},{value:"prod",label:"Production",icon:"Host"}],fe=()=>{const[n,a]=s.useState(["prod"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(r,{name:"environment",options:be,value:n,onChange:a,selectionMode:"single",checkmark:!0,color:"violet",legend:"Target environment",description:"Single choice — picking another swaps it."}),e.jsx(ve,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(t=>`environment[]=${t}`).join("&"):"— nothing selected —"})]})},Se=`import { useState, type ReactNode } from "react";
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
`,T=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),G=[{value:"daily",label:"Daily",icon:"Calendar"},{value:"weekly",label:"Weekly",icon:"Calendar"},{value:"monthly",label:"Monthly",icon:"Calendar"},{value:"custom",label:"Custom",icon:"Cog",disabled:!0}],je=()=>{const[n,a]=s.useState(["daily"]),[t,u]=s.useState(["weekly"]);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(T,{children:"Required choice — allowDeselect off, so it can't be emptied"}),e.jsx(r,{name:"schedule",options:G,value:n,onChange:a,selectionMode:"single",allowDeselect:!1,checkmark:!0,color:"emerald"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(T,{children:'Whole group disabled — "Custom" is also disabled per-option'}),e.jsx(r,{name:"schedule-disabled",options:G,value:t,onChange:u,disabled:!0,color:"slate"})]})]})},ke=`import { useState, type ReactNode } from "react";
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
`,V=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),W=[{value:"containers",label:"Containers",icon:"Container"},{value:"images",label:"Images",icon:"Docker"},{value:"volumes",label:"Volumes",icon:"Save"},{value:"networks",label:"Networks",icon:"Globe"}],Ce=()=>e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(V,{children:"Uncontrolled — it keeps its own state"}),e.jsx(r,{name:"uncontrolled",options:W,defaultValue:["volumes"],color:"blue"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(V,{children:"Glass variant on a glass panel"}),e.jsx(D,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(r,{name:"glass",options:W,defaultValue:["containers","networks"],variant:"liquid-glass",unselectedVariant:"glass",color:"blue"})})]})]}),we=`import { type ReactNode } from "react";
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
`,Oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(se,{name:"Multi Select Pills",description:"A row of pills used as a checkbox or radio group. It renders the kit's Pill, so it inherits every variant, tone, size and corner — including the glass pair."}),e.jsx(pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Resource filter",description:"The canonical case: a multi-select of what to include, with icons and counts, and a live readout of what a form submit would carry.",code:xe,filename:"ResourceFilter.tsx",children:e.jsx(me,{})}),e.jsx(d,{title:"Single choice",description:"Single mode behaves like a radio group — picking another swaps the selection, and a check mark keeps the state out of colour alone.",code:Se,filename:"SingleChoice.tsx",children:e.jsx(fe,{})}),e.jsx(d,{title:"States",description:"A required single choice that can't be emptied, and a whole group disabled with one option disabled per-option.",code:ke,filename:"States.tsx",children:e.jsx(je,{})}),e.jsx(d,{title:"Uncontrolled and glass",description:"An uncontrolled group that keeps its own state, and the glass variants sitting on a glass panel.",code:we,filename:"UncontrolledAndGlass.tsx",children:e.jsx(Ce,{})})]})]});export{Oe as MultiSelectPillsPage,Oe as default};
