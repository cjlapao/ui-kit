import{r as n,j as e,P,Q as l,M as b,J as $,o as A,l as _}from"./index-BBK6HA-D.js";import{P as M}from"./PageHeader-BcBcU29I.js";import{E as c}from"./ExampleCard-BVwGIEPO.js";import{P as U,C as H,S as v,a as N,T as i}from"./ControlAccordion-DallGojj.js";import{x as D,n as B,t as W,J as Z}from"./options-D-FMIizr.js";const F=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),J=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],q=()=>{const[a,t]=n.useState("flat"),[x,O]=n.useState("md"),[d,w]=n.useState("blue"),[m,C]=n.useState("none"),[p,I]=n.useState(""),[u,E]=n.useState([]),[g,R]=n.useState(!1),[S,k]=n.useState(!0),[j,z]=n.useState(!1),[r,T]=n.useState(!1),[f,y]=n.useState(!1),[h,G]=n.useState(!1),V=r?u.length?u.map(s=>`region[]=${s}`).join("&"):"— nothing selected —":p?`region=${p}`:"— no selection —";return e.jsx(U,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(H,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(v,{label:"Variant",options:D,value:a,onChange:s=>t(s)}),e.jsx(N,{label:"Size",children:e.jsx(b,{fullWidth:!0,size:"sm",options:B,value:x,onChange:s=>O(s)})}),e.jsx(v,{label:"Tone",options:W,value:d,onChange:s=>w(s)}),e.jsx(N,{label:"Validation",children:e.jsx(b,{fullWidth:!0,size:"sm",options:Z,value:m,onChange:s=>C(s)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Leading icon",checked:g,onChange:R}),e.jsx(i,{label:"Placeholder",checked:S,onChange:k}),e.jsx(i,{label:"Hide caret",checked:j,onChange:z}),e.jsx(i,{label:"Multiple",checked:r,onChange:T}),e.jsx(i,{label:"Disabled",checked:f,onChange:y}),e.jsx(i,{label:"On a glass panel",checked:h,onChange:G})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<select>"})," — same structure as"," ",e.jsx("strong",{children:"Input"}),", so the caret and leading icon are flex siblings. The ",e.jsx("code",{children:"<option>"})," elements carry their own fill: the native dropdown is painted by the platform from the select's background, which is now transparent."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(P,{variant:h?"liquid-glass":"outlined",tone:h?d:"neutral",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(l,{variant:a,size:x,tone:d,validationStatus:m,disabled:f,multiple:r,leadingIcon:g?"Globe":void 0,hideCaret:j,placeholder:S?"Choose a region":void 0,value:r?u:p,onChange:s=>{r?E(Array.from(s.target.selectedOptions,L=>L.value)):I(s.target.value)},"aria-label":"Region",children:J.map(s=>e.jsx("option",{value:s,children:s},s))}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(F,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:V})]})]})})})})},Q=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],K=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:$.map(a=>e.jsx(l,{variant:a,size:"md",placeholder:a,"aria-label":a,children:Q.map(t=>e.jsx("option",{value:t,children:t},t))},a))}),X=`import { INPUT_VARIANTS, Select } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const Variants = () => (
  <div className="grid w-full gap-3 md:grid-cols-2">
    {INPUT_VARIANTS.map((variant) => (
      <Select
        key={variant}
        variant={variant}
        size="md"
        placeholder={variant}
        aria-label={variant}
      >
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    ))}
  </div>
);

export default Variants;
`,Y=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],ee=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:A.map(a=>e.jsx(l,{size:a,placeholder:`Size ${a}`,"aria-label":`Size ${a}`,children:Y.map(t=>e.jsx("option",{value:t,children:t},t))},a))}),ae=`import { CONTROL_SIZES, Select } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const SizeLadder = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    {CONTROL_SIZES.map((size) => (
      <Select
        key={size}
        size={size}
        placeholder={\`Size \${size}\`}
        aria-label={\`Size \${size}\`}
      >
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    ))}
  </div>
);

export default SizeLadder;
`,se=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],te=()=>e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4",children:_.map(a=>e.jsx(l,{size:"sm",tone:a,placeholder:a,"aria-label":a,children:se.map(t=>e.jsx("option",{value:t,children:t},t))},a))}),ne=`import { Select, TRUE_COLORS } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const Tones = () => (
  <div className="grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4">
    {TRUE_COLORS.map((tone) => (
      <Select key={tone} size="sm" tone={tone} placeholder={tone} aria-label={tone}>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    ))}
  </div>
);

export default Tones;
`,le=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],o=le.map(a=>e.jsx("option",{value:a,children:a},a)),ie=()=>e.jsxs("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:[e.jsx(l,{validationStatus:"error",placeholder:"Error","aria-label":"error",children:o}),e.jsx(l,{validationStatus:"success",placeholder:"Success","aria-label":"success",children:o}),e.jsx(l,{disabled:!0,placeholder:"Disabled","aria-label":"disabled",children:o}),e.jsx(l,{leadingIcon:"Globe",placeholder:"Leading icon","aria-label":"leading icon",children:o}),e.jsx(l,{hideCaret:!0,placeholder:"Hidden caret","aria-label":"hidden caret",children:o}),e.jsx(l,{multiple:!0,placeholder:"Multiple","aria-label":"multiple",children:o})]}),oe=`import { Select } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const regionOptions = REGIONS.map((region) => (
  <option key={region} value={region}>
    {region}
  </option>
));

const States = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    <Select validationStatus="error" placeholder="Error" aria-label="error">
      {regionOptions}
    </Select>
    <Select validationStatus="success" placeholder="Success" aria-label="success">
      {regionOptions}
    </Select>
    <Select disabled placeholder="Disabled" aria-label="disabled">
      {regionOptions}
    </Select>
    <Select leadingIcon="Globe" placeholder="Leading icon" aria-label="leading icon">
      {regionOptions}
    </Select>
    <Select hideCaret placeholder="Hidden caret" aria-label="hidden caret">
      {regionOptions}
    </Select>
    <Select multiple placeholder="Multiple" aria-label="multiple">
      {regionOptions}
    </Select>
  </div>
);

export default States;
`,he=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(M,{name:"Select",description:"The native dropdown, with the platform caret replaced by the kit's. Surface, size and tone come from the shared scales, so it lines up with the Input and SearchBar beside it."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Every variant",description:"All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it.",code:X,filename:"Variants.tsx",children:e.jsx(K,{})}),e.jsx(c,{title:"Size ladder",description:"The shared control scale — xs to xl — the same steps Input and SearchBar run on.",code:ae,filename:"SizeLadder.tsx",children:e.jsx(ee,{})}),e.jsx(c,{title:"Every tone",description:"Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written.",code:ne,filename:"Tones.tsx",children:e.jsx(te,{})}),e.jsx(c,{title:"States",description:"Validation, disabled, a leading icon, a hidden caret and multiple selection.",code:oe,filename:"States.tsx",children:e.jsx(ie,{})})]})]});export{he as SelectPage,he as default};
