import{r as s,j as e,P as V,X as t,I as l,L as v,e as I,M as g,z as P,n as U}from"./index-BqiwG-pR.js";import{P as B,S as j,C as f,T as r,a as L,E as c}from"./PlaygroundPanel-DuiPtEP5.js";import{w as E,n as O,t as R,I as D}from"./options-CD99P1yv.js";const y=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),W=()=>{const[n,S]=s.useState("elevated"),[i,w]=s.useState("md"),[o,b]=s.useState("blue"),[h,A]=s.useState("none"),[m,C]=s.useState("your-company"),[p,N]=s.useState(!0),[u,G]=s.useState(!0),[d,T]=s.useState(!1),[x,k]=s.useState(!1),z=[p?"https://":"",m,u?".com":""].join("");return e.jsx(B,{controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:E,value:n,onChange:a=>S(a)}),e.jsx(f,{label:"Size",children:e.jsx(g,{fullWidth:!0,size:"sm",options:O,value:i,onChange:a=>w(a)})}),e.jsx(j,{label:"Tone",options:R,value:o,onChange:a=>b(a)}),e.jsx(f,{label:"Validation",children:e.jsx(g,{fullWidth:!0,size:"sm",options:D,value:h,onChange:a=>A(a)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Leading addon",checked:p,onChange:N}),e.jsx(r,{label:"Trailing addon",checked:u,onChange:G}),e.jsx(r,{label:"Disabled",checked:d,onChange:T}),e.jsx(r,{label:"On a glass panel",checked:x,onChange:k})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The group owns the box — its children render"," ",e.jsx("code",{children:"unstyled"})," — so ",e.jsx("strong",{children:"Disabled"})," reaches the fields inside; it used to stop at the group's opacity, leaving a dimmed input you could still type into. A child that sets its own ",e.jsx("code",{children:"disabled"})," stays locked even when the group is enabled."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(V,{variant:x?"liquid-glass":"outlined",tone:x?o:"neutral",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(t,{variant:n,size:i,tone:o,validationStatus:h,disabled:d,leadingAddon:p?"https://":void 0,trailingAddon:u?".com":void 0,children:e.jsx(l,{placeholder:"your-company",value:m,onChange:a=>C(a.target.value)})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(y,{children:"What the field assembles"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:z||"—"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(y,{children:"What else can go inside"}),e.jsxs(t,{variant:n,size:i,tone:o,leadingAddon:"Amount",disabled:d,children:[e.jsx(l,{type:"number",placeholder:"0.00"}),e.jsxs(v,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(t,{variant:n,size:i,tone:o,leadingAddon:"Search",disabled:d,children:[e.jsx(l,{placeholder:"Find a resource"}),e.jsx(I,{size:i,variant:"solid",color:o,disabled:d,children:"Go"})]})]})]})})})})},_=()=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(t,{leadingAddon:"https://",trailingAddon:".com",children:e.jsx(l,{placeholder:"your-company",defaultValue:"your-company"})})}),F=`import { Input, InputGroup } from "@cjlapao/ui-kit";

const UrlBuilder = () => (
  <div className="w-full max-w-sm">
    <InputGroup leadingAddon="https://" trailingAddon=".com">
      <Input placeholder="your-company" defaultValue="your-company" />
    </InputGroup>
  </div>
);

export default UrlBuilder;
`,M=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:P.map(n=>e.jsx(t,{variant:n,leadingAddon:n,children:e.jsx(l,{placeholder:"your-company"})},n))}),Z=`import { INPUT_VARIANTS, Input, InputGroup } from "@cjlapao/ui-kit";

const Variants = () => (
  <div className="grid w-full gap-3 md:grid-cols-2">
    {INPUT_VARIANTS.map((variant) => (
      <InputGroup key={variant} variant={variant} leadingAddon={variant}>
        <Input placeholder="your-company" />
      </InputGroup>
    ))}
  </div>
);

export default Variants;
`,q=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:U.map(n=>e.jsx(t,{size:n,leadingAddon:"https://",trailingAddon:n,children:e.jsx(l,{placeholder:"your-company"})},n))}),H=`import { CONTROL_SIZES, Input, InputGroup } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    {CONTROL_SIZES.map((size) => (
      <InputGroup
        key={size}
        size={size}
        leadingAddon="https://"
        trailingAddon={size}
      >
        <Input placeholder="your-company" />
      </InputGroup>
    ))}
  </div>
);

export default SizeLadder;
`,X=()=>e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsxs(t,{leadingAddon:"Amount",children:[e.jsx(l,{type:"number",placeholder:"0.00"}),e.jsxs(v,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(t,{leadingAddon:"Search",children:[e.jsx(l,{placeholder:"Find a resource"}),e.jsx(I,{size:"md",variant:"solid",color:"blue",children:"Go"})]})]}),J=`import { Button, Input, InputGroup, Select } from "@cjlapao/ui-kit";

const Compound = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    <InputGroup leadingAddon="Amount">
      <Input type="number" placeholder="0.00" />
      <Select aria-label="Currency" unstyled>
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
      </Select>
    </InputGroup>
    <InputGroup leadingAddon="Search">
      <Input placeholder="Find a resource" />
      <Button size="md" variant="solid" color="blue">
        Go
      </Button>
    </InputGroup>
  </div>
);

export default Compound;
`,$=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Input Group",description:"A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size and tone scales as the Input inside it."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"URL builder",description:"The canonical case: a protocol prefix and a domain suffix welded to a field, so the user only types the middle.",code:F,filename:"UrlBuilder.tsx",children:e.jsx(_,{})}),e.jsx(c,{title:"Every variant",description:"All six surfaces — the group owns the box, so the addon fill and focus edge follow the same tone tokens as a standalone Input.",code:Z,filename:"Variants.tsx",children:e.jsx(M,{})}),e.jsx(c,{title:"Size ladder",description:"The shared control scale — the addon's padding and type track the field at every step.",code:H,filename:"SizeLadder.tsx",children:e.jsx(q,{})}),e.jsx(c,{title:"Compound",description:"More than a field inside: an unstyled Select as a unit picker, and a solid Button as a submit.",code:J,filename:"Compound.tsx",children:e.jsx(X,{})})]})]});export{$ as InputGroupPage,$ as default};
