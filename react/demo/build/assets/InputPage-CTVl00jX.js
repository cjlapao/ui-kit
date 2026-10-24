import{r as n,c5 as M,j as e,P as K,I as t,C as W,c6 as d,v as H,q as Y,c7 as T}from"./index-gt012o8E.js";import{P as Z,A as $,a as u,c as Q}from"./A11ySections-zw3_3X-2.js";import{P as J}from"./PageHeader-CzVhyXQL.js";import{E as l}from"./ExampleCard-V3REeYJ5.js";import{P as X,S as p,C as r,a as C,T as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as ee}from"./ControlAccordion-DIXHht2n.js";import{u as ae,E as te}from"./EventLog-Dx0vbma4.js";import{x as ne,d as se,Q as le,R as ie,l as oe,m as re,n as de}from"./options-CtADNKbm.js";const ce=()=>{const[s,F]=n.useState("flat"),[x,k]=n.useState("md"),[c,N]=n.useState("blue"),[m,E]=n.useState("none"),[f,O]=n.useState(M),[g,P]=n.useState("ada@example.com"),[L,v]=n.useState(""),[w,V]=n.useState(!1),[h,z]=n.useState(!1),[b,G]=n.useState(!1),[j,R]=n.useState(!1),[i,q]=n.useState(!1),[y,A]=n.useState("classic"),[S,U]=n.useState("medium"),[I,_]=n.useState("frosted"),[D,B]=ae();return e.jsx(X,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ee,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:ne,value:s,onChange:a=>F(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(r,{label:"Size",options:se,value:x,onChange:a=>k(a)}),e.jsx(p,{label:"Validation",options:le,value:m,onChange:a=>E(a)})]}),e.jsx(C,{label:"Tone",children:e.jsx(W,{selectable:!0,size:"sm",value:c,onSelect:N,defaultExpanded:!0})}),e.jsx(C,{label:"Placeholder",children:e.jsx(t,{size:"sm",value:g,onChange:a=>P(a.target.value)})})]})},...s==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(p,{label:"Glow intensity",options:ie,value:f,onChange:a=>O(a)})}]:[],...i?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Specular",options:oe,value:y,onChange:a=>A(a)}),e.jsx(r,{label:"Vibrancy",options:re,value:S,onChange:a=>U(a)}),e.jsx(r,{label:"Glass opacity",options:de,value:I,onChange:a=>_(a)})]})}]:[],{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Leading icon",checked:w,onChange:V}),e.jsx(o,{label:"Trailing icon",checked:h,onChange:z}),e.jsx(o,{label:"Trailing is a button",checked:b,onChange:G}),e.jsx(o,{label:"Disabled",checked:j,onChange:R}),e.jsx(o,{label:"On a glass panel",checked:i,onChange:q})]})}]}),e.jsx(te,{log:D,emptyText:"No events yet — click the action icon."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<input>"})," — same structure as"," ",e.jsx("strong",{children:"SearchBar"}),", so icons are flex siblings. The focus ring is ",e.jsx("code",{children:"ring-inset"}),": an outer ring is painted outside the border box and any scrolling ancestor clips it. Keys and semantics are the native ",e.jsx("code",{children:"<input>"}),"’s; the action button gets a translated name when you do not give it one."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(K,{variant:i?"liquid-glass":"outlined",tone:i?c:"neutral",specularMode:i?y:"none",vibrancy:S,glassOpacity:I,padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(t,{variant:s,size:x,tone:c,validationStatus:m,glowIntensity:f,placeholder:g,value:L,onChange:a=>v(a.target.value),leadingIcon:w?"Search":void 0,trailingIcon:h?"Info":void 0,onTrailingIconClick:h&&b?()=>{v(""),B("action icon clicked — field cleared")}:void 0,trailingIconLabel:"Clear the field",disabled:j})})})})})};function he(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(t,{variant:"flat",placeholder:"Flat"}),e.jsx(t,{variant:"elevated",placeholder:"Elevated"}),e.jsx(t,{variant:"ghost",placeholder:"Ghost"}),e.jsx(t,{variant:"underline",placeholder:"Underline"}),e.jsx(t,{variant:"glass",placeholder:"Glass"}),e.jsx(t,{variant:"glass",tone:"blue",placeholder:"Glass, tinted"}),e.jsx(t,{variant:"gradient",placeholder:"Gradient"})]})}const ue=`import { Input } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input variant="flat" placeholder="Flat" />
      <Input variant="elevated" placeholder="Elevated" />
      <Input variant="ghost" placeholder="Ghost" />
      <Input variant="underline" placeholder="Underline" />
      {/*
        Glass twice, once without a tone and once with: a \`glass\` field keeps
        its original white wash until a caller asks for a colour, which is the
        one difference from \`ghost\` — ghost is tinted by the tone every field
        resolves by default. Shown side by side because the example rendered
        untinted for as long as the variant existed, and nobody noticed the
        tint was missing.
      */}
      <Input variant="glass" placeholder="Glass" />
      <Input variant="glass" tone="blue" placeholder="Glass, tinted" />
      <Input variant="gradient" placeholder="Gradient" />
    </div>
  );
}
`;function pe(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(d,{label:"Workspace name",description:"This is how the workspace appears to every member.",children:e.jsx(t,{placeholder:"acme-inc"})}),e.jsx(d,{label:"Search",hint:"Tip: use quotes for exact matches.",children:e.jsx(t,{placeholder:"Search projects…",leadingIcon:"Search"})})]})}const xe=`import { FormField, Input } from "@cjlapao/ui-kit";

export default function Labeled() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField
        label="Workspace name"
        description="This is how the workspace appears to every member."
      >
        <Input placeholder="acme-inc" />
      </FormField>
      <FormField label="Search" hint="Tip: use quotes for exact matches.">
        <Input placeholder="Search projects…" leadingIcon="Search" />
      </FormField>
    </div>
  );
}
`;function me(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(d,{label:"Email",error:"That address does not look valid.",children:e.jsx(t,{type:"email",defaultValue:"jane@",validationStatus:"error"})}),e.jsx(d,{label:"Username",helpText:"You can change this later.",children:e.jsx(t,{defaultValue:"jane-doe",validationStatus:"success"})})]})}const fe=`import { FormField, Input } from "@cjlapao/ui-kit";

export default function Validation() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Email" error="That address does not look valid.">
        <Input type="email" defaultValue="jane@" validationStatus="error" />
      </FormField>
      <FormField label="Username" helpText="You can change this later.">
        <Input defaultValue="jane-doe" validationStatus="success" />
      </FormField>
    </div>
  );
}
`;function ge(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(t,{placeholder:"Search",leadingIcon:"Search"}),e.jsx(t,{type:"password",placeholder:"Password",leadingIcon:"Key",trailingIcon:"EyeOpen"})]})}const ve=`import { Input } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Input placeholder="Search" leadingIcon="Search" />
      <Input
        type="password"
        placeholder="Password"
        leadingIcon="Key"
        trailingIcon="EyeOpen"
      />
    </div>
  );
}
`;function we(){return e.jsx("div",{className:"flex flex-col gap-3",children:H.map(s=>e.jsx(t,{color:"blue",size:s,placeholder:`Size ${s}`},s))})}const be=`import { CONTROL_SIZES, Input } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <Input
          key={each}
          color="blue"
          size={each}
          placeholder={\`Size \${each}\`}
        />
      ))}
    </div>
  );
}
`;function je(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:Y.map(s=>e.jsx(t,{size:"sm",color:s,placeholder:s},s))})}const ye=`import { Input, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Input key={each} size="sm" color={each} placeholder={each} />
      ))}
    </div>
  );
}
`;function Se(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(T,{color:"blue",placeholder:"Password",defaultValue:"correct-horse"}),e.jsx(T,{color:"blue",placeholder:"Disabled",disabled:!0})]})}const Ie=`import { PasswordInput } from "@cjlapao/ui-kit";

export default function Password() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <PasswordInput
        color="blue"
        placeholder="Password"
        defaultValue="correct-horse"
      />
      <PasswordInput color="blue" placeholder="Disabled" disabled />
    </div>
  );
}
`,Le=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Input",description:"The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page. Glass is shown twice: it keeps its white wash until a tone is asked for.",code:ue,filename:"Variants.tsx",children:e.jsx(he,{})}),e.jsx(l,{title:"Labeled",description:"FormField wires the label to the input, and carries the description and hint copy.",code:xe,filename:"Labeled.tsx",children:e.jsx(pe,{})}),e.jsx(l,{title:"Validation",description:"The validation status paints the field; FormField explains why, in the right place.",code:fe,filename:"Validation.tsx",children:e.jsx(me,{})}),e.jsx(l,{title:"Icons",description:"Registry icons by name, leading or trailing — search fields and password inputs in particular.",code:ve,filename:"Icons.tsx",children:e.jsx(ge,{})}),e.jsx(l,{title:"Size ladder",description:"The shared xs–xl scale — height, text and icon size step together.",code:be,filename:"SizeLadder.tsx",children:e.jsx(we,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours — focus one to see its border and ring.",code:ye,filename:"EveryTone.tsx",children:e.jsx(je,{})}),e.jsx(l,{title:"Password",description:"PasswordInput is the same field with a built-in reveal toggle.",code:Ie,filename:"Password.tsx",children:e.jsx(Se,{})})]}),e.jsx(Z,{props:[{name:"size",type:"ControlSize",default:'"md"',description:"The shared xs&rarr;xl ladder — height, text and icon scale step together, so the field lines up with the Button or Select beside it."},{name:"tone / color",type:"TrueColor",default:'"blue"',description:"Focus border, ring and the leading icon&rsquo;s focus highlight. `color` is a `SearchBar`-compat alias; `tone` wins when both are passed."},{name:"variant",type:"InputVariant",default:'"flat"',description:"Surface style — flat, filled, outlined, elevated, underline, glass and the gradient glow, shared byte-for-byte with Textarea and SearchBar via the theme."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Paints the shared status surface on the box and sets aria-invalid on error — a caller&rsquo;s own aria-invalid cannot override the error state. Explain *why* with FormField&rsquo;s hint, not the colour."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / tone 600 / tone 400',description:"The gradient glow: a two-lobe shadow — start colour glowing from the left, end colour from the right, defaulting to the tone&rsquo;s 600/400 shades. Intensity sets the shadow&rsquo;s geometry and opacity; the reach is sized into the component&rsquo;s own box, so clipping ancestors cannot shear it off."},{name:"leadingIcon / trailingIcon",type:"IconName | ReactElement",description:"Flex siblings of the input — no padding hacks. Resting colour follows the variant; the tone&rsquo;s highlight follows on focus."},{name:"onTrailingIconClick / trailingIconLabel",type:"(event) => void / string",description:"Makes the trailing icon a real named button that follows `disabled`. Without a label it takes the translated kit default (`kit.input.trailingAction`)."},{name:"className / inputClassName",type:"string",description:"`className` targets the box (the wrapper carrying border, fill and radius — `wrapperClassName` is the deprecated alias); `inputClassName` targets the inner `<input>`."},{name:"unstyled / fullHeight",type:"boolean",default:"false",description:"`unstyled` drops the surface wholesale — the seam InputGroup stitches through; `fullHeight` lets a constrained parent stretch the field."}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["Everything else spreads onto the native ",e.jsx("code",{children:"<input>"})," — `value` / `defaultValue`, `type`, `placeholder`, `readOnly`, `maxLength`, the handlers — so the browser’s own semantics carry through untouched. `forwardRef` hands out the real input element, which is what FormField uses for label wiring and focus management."]}),e.jsxs($,{children:[e.jsx(u,{title:"Screen reader",children:e.jsxs("p",{children:["The field ",e.jsx("em",{children:"is"})," a native ",e.jsx("code",{children:"<input>"})," — the wrapper is presentational — so role, value and typing announcements come from the browser untouched. The label lives with",e.jsx("strong",{children:"FormField"})," (",e.jsx("code",{children:"labelFor"})," / automatic id-matching); a bare Input has no name of its own, which is exactly how native inputs fail their audits — pair them. Error status sets"," ",e.jsx("code",{children:"aria-invalid"})," and FormField carries the explanation as text, never colour alone; the status icon tints but never speaks. The action button always has a name — yours or the translated kit default."]})}),e.jsx(u,{title:"Keyboard Support",children:e.jsxs("p",{children:["Native by construction: ",e.jsx(Q,{children:"Tab"})," reaches the field, editing is the browser’s, and a clickable trailing icon is a real"," ",e.jsx("code",{children:"<button>"})," in the tab order (before the input, as written — order your DOM accordingly) with a visible focus ring. The focus ring is deliberately ",e.jsx("code",{children:"ring-inset"}),": rings outside the border box get clipped by scrolling ancestors, which is the classic “where did the focus go” bug in form-heavy panels. Disabled fields drop out of the order natively and read at reduced opacity, not a repainted slab."]})}),e.jsx(u,{title:"Internationalization",children:e.jsxs("p",{children:["Content is 100% caller data — the field holds whatever the user types, in any script, with native IME composition. The only kit string is the unnamed action button’s name at"," ",e.jsx("code",{children:"kit.input.trailingAction"}),' (en, es, fr, de, pt). Layout is RTL-safe: icons are flex siblings, so a `dir="rtl"` ancestor mirrors the field and flips leading/trailing for free — no absolute offsets to invert.']})})]})]});export{Le as InputPage,Le as default};
