import{r as a,j as e,P as q,C as W,dq as o,I as l,cc as C,i as A,c8 as D,v as _}from"./index-gt012o8E.js";import{P as Z,A as H,a as j,C as s}from"./A11ySections-zw3_3X-2.js";import{P as K}from"./PageHeader-CzVhyXQL.js";import{E as x}from"./ExampleCard-V3REeYJ5.js";import{P as M,C as g,a as Q,S as J,T as c}from"./PlaygroundPanel-Czrs7oXC.js";import{C as X}from"./ControlAccordion-DIXHht2n.js";import{u as Y,E as $}from"./EventLog-Dx0vbma4.js";import{x as ee,d as ne,p as te,Q as ae,R as se}from"./options-CtADNKbm.js";const I=({children:n})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:n}),oe=()=>{const[n,T]=a.useState("elevated"),[r,N]=a.useState("md"),[i,G]=a.useState("blue"),[p,k]=a.useState("auto"),[u,z]=a.useState("subtle"),[y,P]=a.useState("none"),[b,L]=a.useState("your-company"),[m,R]=a.useState(!0),[f,V]=a.useState(!0),[d,E]=a.useState(!1),[w,v]=a.useState(!1),[h,B]=a.useState(!1),[U,O]=Y(),F=[m?"https://":"",b,f?".com":""].join(""),S=e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:n,size:r,tone:i,corner:p,glowIntensity:u,validationStatus:y,disabled:d,leadingAddon:m?"https://":void 0,trailingAddon:f?".com":void 0,children:e.jsx(l,{placeholder:"your-company",value:b,onChange:t=>{L(t.target.value),O(t.target.value||"cleared")}})}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(I,{children:"What the field assembles"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:F||"—"})]}),e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(I,{children:"What else can go inside"}),e.jsxs(o,{variant:n,size:r,tone:i,corner:p,glowIntensity:u,leadingAddon:"Amount",disabled:d,children:[e.jsx(l,{type:"number",placeholder:"0.00"}),e.jsxs(C,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(o,{variant:n,size:r,tone:i,corner:p,glowIntensity:u,leadingAddon:"Search",disabled:d,children:[e.jsx(l,{placeholder:"Find a resource"}),e.jsx(A,{size:r,variant:"solid",color:i,disabled:d,children:"Go"})]})]})]});return e.jsx(M,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(X,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:ee,value:n,onChange:t=>T(t)}),e.jsx(g,{label:"Size",options:ne,value:r,onChange:t=>N(t)}),e.jsx(Q,{label:"Tone",children:e.jsx(W,{selectable:!0,size:"sm",value:i,onSelect:G,defaultExpanded:!0})}),e.jsx(J,{label:"Corner",options:te,value:p,onChange:t=>k(t)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"Leading addon",checked:m,onChange:R}),e.jsx(c,{label:"Trailing addon",checked:f,onChange:V}),e.jsx(c,{label:"Disabled",checked:d,onChange:E})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Validation",options:ae,value:y,onChange:t=>P(t)}),e.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[e.jsx(c,{label:"In a panel",checked:w,onChange:v}),e.jsx(c,{label:"On a glass panel",checked:h,onChange:t=>{B(t),t&&v(!0)}})]})]})},...n==="gradient"||h?[{id:"glow",title:"Glow",controls:e.jsx(g,{label:"Intensity",options:se,value:u,onChange:t=>z(t)})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The group owns the box — its children render ",e.jsx("code",{children:"unstyled"})," — so ",e.jsx("strong",{children:"Disabled"})," reaches the fields inside; it used to stop at the group's opacity, leaving a dimmed input you could still type into. A child that sets its own ",e.jsx("code",{children:"disabled"})," ","stays locked even when the group is enabled."]}),e.jsx($,{log:U,emptyText:"No events yet — the field inside reports through here."})]}),preview:e.jsx("div",{className:"w-full",children:w?e.jsx(q,{corner:"none",variant:h?"liquid-glass":"outlined",tone:h?i:"neutral",padding:"md",scrollable:!1,children:e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-4 py-2",children:S})}):e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-4 py-2",children:S})})})},le=()=>e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(o,{leadingAddon:"https://",trailingAddon:".com",children:e.jsx(l,{placeholder:"your-company",defaultValue:"your-company"})})}),ie=`import { Input, InputGroup } from "@cjlapao/ui-kit";

const UrlBuilder = () => (
  <div className="w-full max-w-sm">
    <InputGroup leadingAddon="https://" trailingAddon=".com">
      <Input placeholder="your-company" defaultValue="your-company" />
    </InputGroup>
  </div>
);

export default UrlBuilder;
`,re=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:D.map(n=>e.jsx(o,{variant:n,leadingAddon:n,children:e.jsx(l,{placeholder:"your-company"})},n))}),de=`import { INPUT_VARIANTS, Input, InputGroup } from "@cjlapao/ui-kit";

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
`,ce=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:_.map(n=>e.jsx(o,{size:n,leadingAddon:"https://",trailingAddon:n,children:e.jsx(l,{placeholder:"your-company"})},n))}),pe=`import { CONTROL_SIZES, Input, InputGroup } from "@cjlapao/ui-kit";

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
`,ue=()=>e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsxs(o,{leadingAddon:"Amount",children:[e.jsx(l,{type:"number",placeholder:"0.00"}),e.jsxs(C,{"aria-label":"Currency",unstyled:!0,children:[e.jsx("option",{children:"USD"}),e.jsx("option",{children:"EUR"}),e.jsx("option",{children:"GBP"})]})]}),e.jsxs(o,{leadingAddon:"Search",children:[e.jsx(l,{placeholder:"Find a resource"}),e.jsx(A,{size:"md",variant:"solid",color:"blue",children:"Go"})]})]}),he=`import { Button, Input, InputGroup, Select } from "@cjlapao/ui-kit";

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
`,ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Input Group",description:"A field with addons welded to its edges. The group owns the box — its children render unstyled — so it takes the same surface, size, corner and tone scales as the Input inside it, glass and gradient glow included."}),e.jsx(oe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"URL builder",description:"The canonical case: a protocol prefix and a domain suffix welded to a field, so the user only types the middle.",code:ie,filename:"UrlBuilder.tsx",children:e.jsx(le,{})}),e.jsx(x,{title:"Every variant",description:"All six surfaces — the group owns the box, so the addon fill and focus edge follow the same tone tokens as a standalone Input.",code:de,filename:"Variants.tsx",children:e.jsx(re,{})}),e.jsx(x,{title:"Size ladder",description:"The shared control scale — the addon's padding and type track the field at every step.",code:pe,filename:"SizeLadder.tsx",children:e.jsx(ce,{})}),e.jsx(x,{title:"Compound",description:"More than a field inside: an unstyled Select as a unit picker, and a solid Button as a submit.",code:he,filename:"Compound.tsx",children:e.jsx(ue,{})})]}),e.jsx(Z,{props:[{name:"children",type:"ReactNode",description:"Fields to weld together. Children that are known fields get cloned with `tone`, `size`, `unstyled` and the group&rsquo;s `disabled` (a child&rsquo;s own `disabled` still wins); anything else — a plain `Button`, a `span` — is left exactly as written."},{name:"leadingAddon / trailingAddon",type:"ReactNode",description:"The `https://` and the `.com`. Filled, bordered and type-scaled from the tone and size — the same tables the field between them reads."},{name:"variant",type:"InputGroupVariant",default:'"elevated"',description:"The shared surfaces. The group is the surface — a `ghost` group reads its tone; a `gradient` one carries a glow."},{name:"size",type:"InputGroupSize",default:'"md"',description:"The shared control scale, pushed into the children too, so half a group can never be a different size than its other half."},{name:"tone",type:"TrueColor",default:'"blue"',description:"The resting edge, the focus outline, the addon fill and the glow&rsquo;s lobes. `color` works as a deprecated alias."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"Group radius from the shared control corner; an explicit token replaces it on every surface."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone&rsquo;s 600 → 400 shades',description:"The `gradient` variant&rsquo;s focus halo, identical to `Input`, `Textarea` and `SearchBar`. Lit while anything inside the group has focus — moving focus between two children never blinks it."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Replaces the tone edge rather than stacking on it — `underline` gets a bottom-rule version, since a rectangle around an underline would contradict the variant."},{name:"disabled",type:"boolean",default:"false",description:"Reaches the fields inside, not just the group&rsquo;s opacity — a dimmed input you could still type into is worse than a grey one."},{name:"className",type:"string",description:"Lands on the group box."}]}),e.jsxs(H,{children:[e.jsx(j,{title:"Screen reader",children:e.jsxs("p",{children:["The box is a presentational ",e.jsx(s,{children:"<div>"})," — deliberately. The role of a field belongs to the field inside, so ",e.jsx(s,{children:"<label>"}),"s,",e.jsx(s,{children:"aria-label"}),"s and validation states keep working on the child exactly where they would outside the group. What needs care are the addons: ",e.jsx(s,{children:"https://"})," before a field called “Website” carries information a screen reader never hears if the field is named only at the child. Say it in the name —"," ",e.jsx(s,{children:'aria-label="Website URL (without https://)"'})," or a visible ",e.jsx(s,{children:"<label>"})," that includes it — or mark a purely decorative addon ",e.jsx(s,{children:"aria-hidden"})," so it cannot read as stray prose."]})}),e.jsx(j,{title:"Keyboard support",children:e.jsxs("p",{children:["Tab goes to the children; the group itself is not focusable, which is correct for a box of controls. What the group adds is an edge that says “you are inside the same control”: a tone outline drawn — not a ring, an ",e.jsx(s,{children:"outline"}),", because rings are painted under the opaque addons and were only ever visible between them. Focus moving between two children keeps the edge lit and never lets the gradient halo blink."]})}),e.jsx(j,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. The group contributes no strings: addons, children and their labels are the caller’s. What is not locale-neutral is content order — an ",e.jsx(s,{children:"https://"})," prefix reads left-to-right, but a currency addon may belong on the right in the reader’s language. The group has no opinion: put the addon on the side the language wants; ",e.jsx(s,{children:"leadingAddon"})," and"," ",e.jsx(s,{children:"trailingAddon"})," are the only opinions it has."]})})]})]});export{ve as InputGroupPage,ve as default};
