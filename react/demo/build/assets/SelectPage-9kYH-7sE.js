import{r as t,j as e,P,L as l,M as b,z as $,n as _,k as A}from"./index-BqiwG-pR.js";import{P as M,S as v,C as w,T as i,a as U,E as c}from"./PlaygroundPanel-DuiPtEP5.js";import{w as H,n as D,t as B,I as W}from"./options-CD99P1yv.js";const Z=({children:a})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:a}),F=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],q=()=>{const[a,n]=t.useState("flat"),[x,N]=t.useState("md"),[d,O]=t.useState("blue"),[m,C]=t.useState("none"),[p,I]=t.useState(""),[u,E]=t.useState([]),[g,R]=t.useState(!1),[S,k]=t.useState(!0),[j,z]=t.useState(!1),[r,T]=t.useState(!1),[f,y]=t.useState(!1),[h,G]=t.useState(!1),V=r?u.length?u.map(s=>`region[]=${s}`).join("&"):"— nothing selected —":p?`region=${p}`:"— no selection —";return e.jsx(M,{controls:e.jsxs(e.Fragment,{children:[e.jsx(v,{label:"Variant",options:H,value:a,onChange:s=>n(s)}),e.jsx(w,{label:"Size",children:e.jsx(b,{fullWidth:!0,size:"sm",options:D,value:x,onChange:s=>N(s)})}),e.jsx(v,{label:"Tone",options:B,value:d,onChange:s=>O(s)}),e.jsx(w,{label:"Validation",children:e.jsx(b,{fullWidth:!0,size:"sm",options:W,value:m,onChange:s=>C(s)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Leading icon",checked:g,onChange:R}),e.jsx(i,{label:"Placeholder",checked:S,onChange:k}),e.jsx(i,{label:"Hide caret",checked:j,onChange:z}),e.jsx(i,{label:"Multiple",checked:r,onChange:T}),e.jsx(i,{label:"Disabled",checked:f,onChange:y}),e.jsx(i,{label:"On a glass panel",checked:h,onChange:G})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<select>"})," — same structure as"," ",e.jsx("strong",{children:"Input"}),", so the caret and leading icon are flex siblings. The ",e.jsx("code",{children:"<option>"})," elements carry their own fill: the native dropdown is painted by the platform from the select's background, which is now transparent."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(P,{variant:h?"liquid-glass":"outlined",tone:h?d:"neutral",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(l,{variant:a,size:x,tone:d,validationStatus:m,disabled:f,multiple:r,leadingIcon:g?"Globe":void 0,hideCaret:j,placeholder:S?"Choose a region":void 0,value:r?u:p,onChange:s=>{r?E(Array.from(s.target.selectedOptions,L=>L.value)):I(s.target.value)},"aria-label":"Region",children:F.map(s=>e.jsx("option",{value:s,children:s},s))}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(Z,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:V})]})]})})})})},J=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],K=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:$.map(a=>e.jsx(l,{variant:a,size:"md",placeholder:a,"aria-label":a,children:J.map(n=>e.jsx("option",{value:n,children:n},n))},a))}),Q=`import { INPUT_VARIANTS, Select } from "@cjlapao/ui-kit";

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
`,X=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],Y=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:_.map(a=>e.jsx(l,{size:a,placeholder:`Size ${a}`,"aria-label":`Size ${a}`,children:X.map(n=>e.jsx("option",{value:n,children:n},n))},a))}),ee=`import { CONTROL_SIZES, Select } from "@cjlapao/ui-kit";

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
`,ae=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],se=()=>e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4",children:A.map(a=>e.jsx(l,{size:"sm",tone:a,placeholder:a,"aria-label":a,children:ae.map(n=>e.jsx("option",{value:n,children:n},n))},a))}),ne=`import { Select, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,te=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],o=te.map(a=>e.jsx("option",{value:a,children:a},a)),le=()=>e.jsxs("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:[e.jsx(l,{validationStatus:"error",placeholder:"Error","aria-label":"error",children:o}),e.jsx(l,{validationStatus:"success",placeholder:"Success","aria-label":"success",children:o}),e.jsx(l,{disabled:!0,placeholder:"Disabled","aria-label":"disabled",children:o}),e.jsx(l,{leadingIcon:"Globe",placeholder:"Leading icon","aria-label":"leading icon",children:o}),e.jsx(l,{hideCaret:!0,placeholder:"Hidden caret","aria-label":"hidden caret",children:o}),e.jsx(l,{multiple:!0,placeholder:"Multiple","aria-label":"multiple",children:o})]}),ie=`import { Select } from "@cjlapao/ui-kit";

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
`,de=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(U,{name:"Select",description:"The native dropdown, with the platform caret replaced by the kit's. Surface, size and tone come from the shared scales, so it lines up with the Input and SearchBar beside it."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Every variant",description:"All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it.",code:Q,filename:"Variants.tsx",children:e.jsx(K,{})}),e.jsx(c,{title:"Size ladder",description:"The shared control scale — xs to xl — the same steps Input and SearchBar run on.",code:ee,filename:"SizeLadder.tsx",children:e.jsx(Y,{})}),e.jsx(c,{title:"Every tone",description:"Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written.",code:ne,filename:"Tones.tsx",children:e.jsx(se,{})}),e.jsx(c,{title:"States",description:"Validation, disabled, a leading icon, a hidden caret and multiple selection.",code:ie,filename:"States.tsx",children:e.jsx(le,{})})]})]});export{de as SelectPage,de as default};
