import{r as t,j as e,P as W,C as re,co as c}from"./index-gt012o8E.js";import{P as de,A as pe,a as C,C as s}from"./A11ySections-zw3_3X-2.js";import{P as ue}from"./PageHeader-CzVhyXQL.js";import{E as p}from"./ExampleCard-V3REeYJ5.js";import{P as he,C as d,a as me,S as u,T as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as ge}from"./ControlAccordion-DIXHht2n.js";import{u as xe,E as be}from"./EventLog-Dx0vbma4.js";import{B as G,d as A,C as ve,l as fe,m as Se,n as je}from"./options-CtADNKbm.js";const q=["glass","liquid-glass"],ke=[{label:"Multiple",value:"multiple"},{label:"Single",value:"single"}],ye=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"},{value:"registry",label:"Registry",icon:"Cache",disabled:!0}],we=()=>{const[n,i]=t.useState(["containers","images"]),[a,h]=t.useState("multiple"),[m,U]=t.useState("blue"),[g,F]=t.useState("solid"),[x,L]=t.useState("outline"),[N,H]=t.useState("md"),[P,K]=t.useState("full"),[O,B]=t.useState("sm"),[M,_]=t.useState(!1),[T,J]=t.useState(!0),[b,Q]=t.useState(!0),[v,X]=t.useState(!1),[R,Y]=t.useState(!1),[f,Z]=t.useState(!0),[S,I]=t.useState(!1),[r,ee]=t.useState(!1),[j,le]=t.useState("frosted"),[k,te]=t.useState("medium"),[y,ne]=t.useState("classic"),[se,ae]=xe(),oe=t.useMemo(()=>ye.map(l=>({...l,icon:b?l.icon:void 0,description:v?l.description:void 0})),[b,v]),w=a==="single",ie=q.includes(g)||q.includes(x)||S&&r,ce=l=>{i(l),ae(l.length?`selected ${l.join(", ")}${w?"":` (${l.length})`}`:"cleared")},V=e.jsx(c,{name:"resources",options:oe,value:n,onChange:ce,selectionMode:a,tone:m,variant:g,unselectedVariant:x,size:N,corner:P,gap:O,disabled:M,allowDeselect:T,checkmark:R,glassOpacity:j,vibrancy:k,specularMode:y,legend:f?"Resources to include":void 0,description:f?"Pick what the backup job should snapshot.":void 0});return e.jsx(he,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ge,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Selection mode",options:ke,value:a,onChange:l=>h(l)}),e.jsx(me,{label:"Tone",children:e.jsx(re,{selectable:!0,size:"sm",value:m,onSelect:U,defaultExpanded:!0})}),e.jsx(u,{label:"Selected variant",options:G,value:g,onChange:l=>F(l)}),e.jsx(u,{label:"Unselected variant",options:G,value:x,onChange:l=>L(l)}),e.jsx(d,{label:"Size",options:A,value:N,onChange:l=>H(l)}),e.jsx(u,{label:"Corner",options:ve,value:P,onChange:l=>K(l)}),e.jsx(u,{label:"Gap",options:A,value:O,onChange:l=>B(l)})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Icons",checked:b,onChange:Q}),e.jsx(o,{label:"Counts",checked:v,onChange:X}),e.jsx(o,{label:"Check mark",checked:R,onChange:Y}),e.jsx(o,{label:"Legend",checked:f,onChange:Z}),w&&e.jsx(o,{label:"Allow deselect",checked:T,onChange:J}),e.jsx(o,{label:"Disabled",checked:M,onChange:_})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"In a panel",checked:S,onChange:I}),e.jsx(o,{label:"On a glass panel",checked:r,onChange:l=>{ee(l),l&&I(!0)}})]})},...ie?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(d,{label:"Specular",options:fe,value:y,onChange:l=>ne(l)}),e.jsx(d,{label:"Vibrancy",options:Se,value:k,onChange:l=>te(l)}),e.jsx(d,{label:"Glass opacity",options:je,value:j,onChange:l=>le(l)})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Single"})," mode is a real radio group: one tab stop, arrows (and ",e.jsx("em",{children:"Home"}),"/",e.jsx("em",{children:"End"}),") walk and pick the options, and a form submits ",e.jsx("code",{children:"resources=…"}),", not"," ",e.jsx("code",{children:"resources[]="}),"… Turn"," ",e.jsx("strong",{children:"Allow deselect"})," off to make the choice required."," ",e.jsx("strong",{children:"Multiple"})," mode is a checkbox group — every pill is its own tab stop and toggles with",e.jsx("em",{children:" Space"}),". ",e.jsx("strong",{children:"Registry"})," is a per-option disabled pill either way."]}),e.jsx(be,{log:se,emptyText:"No events yet — toggle a pill, or arrow through single mode."})]}),preview:e.jsxs("div",{className:"w-full space-y-4",children:[S?e.jsx(W,{corner:"none",variant:r?"liquid-glass":"outlined",tone:r?m:"neutral",specularMode:r?y:"none",vibrancy:k,glassOpacity:j,padding:"md",scrollable:!1,children:e.jsx("div",{className:"w-full py-2",children:V})}):e.jsx("div",{className:"w-full py-2",children:V}),e.jsx("div",{className:"rounded-lg border border-black/10 px-3 py-2 font-mono text-xs break-all dark:border-white/10",children:n.length?w?`resources=${n[0]}`:n.map(l=>`resources[]=${l}`).join("&"):"— nothing selected —"})]})})},Ce=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),Ne=[{value:"containers",label:"Containers",icon:"Container",description:"42"},{value:"images",label:"Images",icon:"Docker",description:"17"},{value:"volumes",label:"Volumes",icon:"Save",description:"8"},{value:"networks",label:"Networks",icon:"Globe",description:"3"},{value:"secrets",label:"Secrets",icon:"Key",description:"0"}],Pe=()=>{const[n,i]=t.useState(["containers","images"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(c,{name:"resources",options:Ne,value:n,onChange:i,legend:"Resources to include",description:"Pick what the backup job should snapshot.",tone:"blue"}),e.jsx(Ce,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(a=>`resources[]=${a}`).join("&"):"— nothing selected —"})]})},Oe=`import { useState, type ReactNode } from "react";
import { MultiSelectPills } from "@cjlapao/ui-kit";
import type { MultiSelectPillOption } from "@cjlapao/ui-kit";

const Caption = ({ children }: { children: ReactNode }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

const OPTIONS: MultiSelectPillOption[] = [
  {
    value: "containers",
    label: "Containers",
    icon: "Container",
    description: "42",
  },
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
        tone="blue"
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
`,Me=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),Te=[{value:"dev",label:"Development",icon:"Rocket"},{value:"staging",label:"Staging",icon:"Globe"},{value:"prod",label:"Production",icon:"Host"}],Re=()=>{const[n,i]=t.useState(["prod"]);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(c,{name:"environment",options:Te,value:n,onChange:i,selectionMode:"single",checkmark:!0,tone:"violet",legend:"Target environment",description:"Single choice — picking another swaps it."}),e.jsx(Me,{children:"Selected"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:n.length?n.map(a=>`environment[]=${a}`).join("&"):"— nothing selected —"})]})},Ie=`import { useState, type ReactNode } from "react";
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
        tone="violet"
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
`,D=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),E=[{value:"daily",label:"Daily",icon:"Calendar"},{value:"weekly",label:"Weekly",icon:"Calendar"},{value:"monthly",label:"Monthly",icon:"Calendar"},{value:"custom",label:"Custom",icon:"Cog",disabled:!0}],Ve=()=>{const[n,i]=t.useState(["daily"]),[a,h]=t.useState(["weekly"]);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(D,{children:"Required choice — allowDeselect off, so it can't be emptied"}),e.jsx(c,{name:"schedule",options:E,value:n,onChange:i,selectionMode:"single",allowDeselect:!1,checkmark:!0,tone:"emerald"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(D,{children:'Whole group disabled — "Custom" is also disabled per-option'}),e.jsx(c,{name:"schedule-disabled",options:E,value:a,onChange:h,disabled:!0,tone:"slate"})]})]})},Ge=`import { useState, type ReactNode } from "react";
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
        <Caption>
          Required choice — allowDeselect off, so it can't be emptied
        </Caption>
        <MultiSelectPills
          name="schedule"
          options={OPTIONS}
          value={required}
          onChange={setRequired}
          selectionMode="single"
          allowDeselect={false}
          checkmark
          tone="emerald"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Caption>
          Whole group disabled — "Custom" is also disabled per-option
        </Caption>
        <MultiSelectPills
          name="schedule-disabled"
          options={OPTIONS}
          value={whole}
          onChange={setWhole}
          disabled
          tone="slate"
        />
      </div>
    </div>
  );
};

export default States;
`,$=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),z=[{value:"containers",label:"Containers",icon:"Container"},{value:"images",label:"Images",icon:"Docker"},{value:"volumes",label:"Volumes",icon:"Save"},{value:"networks",label:"Networks",icon:"Globe"}],Ae=()=>e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx($,{children:"Uncontrolled — it keeps its own state"}),e.jsx(c,{name:"uncontrolled",options:z,defaultValue:["volumes"],tone:"blue"})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx($,{children:"Glass variant on a glass panel"}),e.jsx(W,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(c,{name:"glass",options:z,defaultValue:["containers","networks"],variant:"liquid-glass",unselectedVariant:"glass",tone:"blue"})})]})]}),qe=`import { type ReactNode } from "react";
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
        tone="blue"
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
          tone="blue"
        />
      </Panel>
    </div>
  </div>
);

export default UncontrolledAndGlass;
`,He=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ue,{name:"Multi Select Pills",description:"A row of pills used as a checkbox or radio group — real form semantics, not toggle buttons that merely look the part. It renders the kit's Pill, so it inherits every variant, tone, size and corner, including the glass pair."}),e.jsx(we,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Resource filter",description:"The canonical case: a multi-select of what to include, with icons and counts, and a live readout of what a form submit would carry.",code:Oe,filename:"ResourceFilter.tsx",children:e.jsx(Pe,{})}),e.jsx(p,{title:"Single choice",description:"Single mode is a radiogroup — arrows walk and pick, picking another swaps the selection, and a check mark keeps the state out of colour alone.",code:Ie,filename:"SingleChoice.tsx",children:e.jsx(Re,{})}),e.jsx(p,{title:"States",description:"A required single choice that can't be emptied, and a whole group disabled with one option disabled per-option.",code:Ge,filename:"States.tsx",children:e.jsx(Ve,{})}),e.jsx(p,{title:"Uncontrolled and glass",description:"An uncontrolled group that keeps its own state, and the glass variants sitting on a glass panel.",code:qe,filename:"UncontrolledAndGlass.tsx",children:e.jsx(Ae,{})})]}),e.jsx(de,{props:[{name:"name",type:"string",description:"Form field name. Multiple mode submits `name[]=…` checkboxes; single mode submits a plain radio field, `name=…` — the semantics carry into the request."},{name:"options",type:"MultiSelectPillOption[]",description:"`{ value, label, description?, disabled?, icon? }`. `icon` is a registry name or any node; `disabled` opts out a single pill."},{name:"value / defaultValue",type:"string[]",description:"Controlled and uncontrolled selections, exactly as on an `<input>` — `defaultValue` is the initial value, nothing more."},{name:"onChange",type:"(selectedValues: string[]) => void",description:"Fires with the full next selection, in click order for multiple mode and as a one-item array (or empty one) for single."},{name:"legend / description",type:"ReactNode",description:"Rendered as a real `<legend>` (which names the group for assistive tech) and helper text below it."},{name:"selectionMode",type:'"multiple" | "single"',default:'"multiple"',description:'Multiple is a checkbox group (`role="checkbox"`, every pill its own tab stop); single is a radiogroup (`role="radio"`, roving tab stop, arrows pick).'},{name:"allowDeselect",type:"boolean",default:"true",description:"In single mode, whether clicking the selected pill clears it. Off makes the choice required — and the group can then never be emptied by pointer. Arrows never deselect either way."},{name:"variant / unselectedVariant",type:"PillVariant",default:'"solid" / "outline"',description:"The Pill surface for each state — `glass` and `liquid-glass` really blur, on either side of the selection."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent of a selected pill, straight through to Pill&rsquo;s tone map — `red` paints red. `color` is its deprecated alias."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale, matching the Pill&rsquo;s own default so a group lines up with its sibling inputs."},{name:"corner",type:"PillCorner",default:'"full"',description:"The pill corner scale — deliberately not the container one, whose `rounded-md` is 16px, a capsule on a 24px-tall pill anyway. `rounded` is its deprecated alias."},{name:"gap",type:"ControlSize",default:'"sm"',description:"Space between pills, on the same scale."},{name:"checkmark",type:"boolean",default:"false",description:"Swap a selected option&rsquo;s icon for a check mark, so selection is not signalled by fill alone — the `neutral` tone barely changes between states."},{name:"disabled",type:"boolean",default:"false",description:"Disables the whole group via the `<fieldset>`, which makes every pill inert natively."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / SpecularMode",description:"Glass chrome, forwarded to the glass pill variants."},{name:"className",type:"string",description:"Lands on the `<fieldset>`."}]}),e.jsxs(pe,{children:[e.jsx(C,{title:"Screen reader",children:e.jsxs("p",{children:["The group is a real ",e.jsx(s,{children:"fieldset"}),", so a ",e.jsx(s,{children:"legend"})," names it natively. Multiple mode’s pills carry ",e.jsx(s,{children:'role="checkbox"'})," ","with live ",e.jsx(s,{children:"aria-checked"}),"; single mode promotes the fieldset itself to ",e.jsx(s,{children:'role="radiogroup"'})," and the pills to"," ",e.jsx(s,{children:'role="radio"'})," — one group, one role, named by its own legend. The pills used to be ",e.jsx(s,{children:"aria-pressed"})," toggle buttons describing a state that the hidden form inputs already owned; now the announced role and the submitted value agree. Those inputs (",e.jsx(s,{children:"checkbox"})," in multiple mode, ",e.jsx(s,{children:"radio"})," in single) are ",e.jsx(s,{children:"aria-hidden"})," and out of the tab order — carriers for the value at submit time, not a second set of controls to announce. Disabled pills are natively disabled buttons."]})}),e.jsx(C,{title:"Keyboard support",children:e.jsxs("p",{children:["Multiple mode is a checkbox group, so it behaves like the native stack it mirrors: every pill is its own tab stop, Space toggles it (Enter activates too, being a real button), and no arrow keys are hijacked. Single mode is the radiogroup pattern, identical to ",e.jsx(s,{children:"MultiToggle"}),": one tab stop — the selected pill, or the first usable one while nothing is selected — and arrows walk the options,",e.jsx("em",{children:" picking as they go"}),", wrapping at both ends and skipping disabled ones; ",e.jsx(s,{children:"Home"}),"/",e.jsx(s,{children:"End"})," jump to the ends. Deselecting by clicking the selected pill is a pointer affordance by itself — arrows never clear the group."]})}),e.jsx(C,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate inside: every visible string — legend, helper, each option label and description — is caller-supplied, and the selection state travels as ARIA attributes, not prose. The one icon the component draws itself, the check mark, comes from the shared"," ",e.jsx(s,{children:"Icon"})," registry, so host-level icon localisation reaches it like everything else."]})})]})]});export{He as MultiSelectPillsPage,He as default};
