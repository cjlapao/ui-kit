import{r as a,j as e,P as V,$ as o,I as t,Q as v,e as S,M as g,J as P,o as U}from"./index-8i9ZNynb.js";import{P as B}from"./PageHeader-CO5k_SQv.js";import{E as r}from"./ExampleCard-LdxcpmX_.js";import{P as O,S as j,C as f,T as c}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as E}from"./ControlAccordion-Bqp-1oBj.js";import{x as L,n as R,t as D,J as W}from"./options-yAU-f7tt.js";const y=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),_=()=>{const[n,I]=a.useState("elevated"),[i,b]=a.useState("md"),[l,w]=a.useState("blue"),[h,C]=a.useState("none"),[m,A]=a.useState("your-company"),[p,N]=a.useState(!0),[u,G]=a.useState(!0),[d,T]=a.useState(!1),[x,k]=a.useState(!1),z=[p?"https://":"",m,u?".com":""].join("");return e.jsx(O,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(E,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Variant",options:L,value:n,onChange:s=>I(s)}),e.jsx(f,{label:"Size",children:e.jsx(g,{fullWidth:!0,size:"sm",options:R,value:i,onChange:s=>b(s)})}),e.jsx(j,{label:"Tone",options:D,value:l,onChange:s=>w(s)}),e.jsx(f,{label:"Validation",children:e.jsx(g,{fullWidth:!0,size:"sm",options:W,value:h,onChange:s=>C(s)})})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Leading addon",checked:p,onChange:N}),e.jsx(c,{label:"Trailing addon",checked:u,onChange:G}),e.jsx(c,{label:"Disabled",checked:d,onChange:T}),e.jsx(c,{label:"On a glass panel",checked:x,onChange:k})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The group owns the box — its children render"," ",e.jsx("code",{children:"unstyled"})," — so ",e.jsx("strong",{children:"Disabled"})," reaches the fields inside; it used to stop at the group's opacity, leaving a dimmed input you could still type into. A child that sets its own ",e.jsx("code",{children:"disabled"})," stays locked even when the group is enabled."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(V,{variant:x?"liquid-glass":"outlined",tone:x?l:"neutral",padding:"md",children:e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(o,{variant:n,size:i,tone:l,validationStatus:h,disabled:d,leadingAddon:p?"https://":void 0,trailingAddon:u?".com":void 0,children:e.jsx(t,{placeholder:"your-company",value:m,onChange:s=>A(s.target.value)})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(y,{children:"What the field assembles"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:z||"—"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(y,{children:"What else can go inside"}),e.jsxs(o,{variant:n,size:i,tone:l,leadingAddon:"Amount",disabled:d,children:[e.jsx(t,{type:"number",placeholder:"0.00"}),e.jsxs(v,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(o,{variant:n,size:i,tone:l,leadingAddon:"Search",disabled:d,children:[e.jsx(t,{placeholder:"Find a resource"}),e.jsx(S,{size:i,variant:"solid",color:l,disabled:d,children:"Go"})]})]})]})})})})},F=()=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(o,{leadingAddon:"https://",trailingAddon:".com",children:e.jsx(t,{placeholder:"your-company",defaultValue:"your-company"})})}),M=`import { Input, InputGroup } from "@cjlapao/ui-kit";

const UrlBuilder = () => (
  <div className="w-full max-w-sm">
    <InputGroup leadingAddon="https://" trailingAddon=".com">
      <Input placeholder="your-company" defaultValue="your-company" />
    </InputGroup>
  </div>
);

export default UrlBuilder;
`,Z=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:P.map(n=>e.jsx(o,{variant:n,leadingAddon:n,children:e.jsx(t,{placeholder:"your-company"})},n))}),J=`import { INPUT_VARIANTS, Input, InputGroup } from "@cjlapao/ui-kit";

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
`,q=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:U.map(n=>e.jsx(o,{size:n,leadingAddon:"https://",trailingAddon:n,children:e.jsx(t,{placeholder:"your-company"})},n))}),H=`import { CONTROL_SIZES, Input, InputGroup } from "@cjlapao/ui-kit";

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
`,Q=()=>e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsxs(o,{leadingAddon:"Amount",children:[e.jsx(t,{type:"number",placeholder:"0.00"}),e.jsxs(v,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(o,{leadingAddon:"Search",children:[e.jsx(t,{placeholder:"Find a resource"}),e.jsx(S,{size:"md",variant:"solid",color:"blue",children:"Go"})]})]}),$=`import { Button, Input, InputGroup, Select } from "@cjlapao/ui-kit";

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
`,ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Input Group",description:"A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size and tone scales as the Input inside it."}),e.jsx(_,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"URL builder",description:"The canonical case: a protocol prefix and a domain suffix welded to a field, so the user only types the middle.",code:M,filename:"UrlBuilder.tsx",children:e.jsx(F,{})}),e.jsx(r,{title:"Every variant",description:"All six surfaces — the group owns the box, so the addon fill and focus edge follow the same tone tokens as a standalone Input.",code:J,filename:"Variants.tsx",children:e.jsx(Z,{})}),e.jsx(r,{title:"Size ladder",description:"The shared control scale — the addon's padding and type track the field at every step.",code:H,filename:"SizeLadder.tsx",children:e.jsx(q,{})}),e.jsx(r,{title:"Compound",description:"More than a field inside: an unstyled Select as a unit picker, and a solid Button as a submit.",code:$,filename:"Compound.tsx",children:e.jsx(Q,{})})]})]});export{ae as InputGroupPage,ae as default};
