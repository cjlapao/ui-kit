import{r as t,g5 as D,j as e,P as K,c as a,C as W,g6 as i,bn as H,bl as Q,g7 as k,g8 as Y,g9 as Z,B as $}from"./index-ChbzYKtA.js";import{P as J,A as X,a as x,c as ee}from"./A11ySections-Ci0MCORB.js";import{P as ae}from"./PageHeader-CORco2N-.js";import{E as l}from"./ExampleCard-Db5NXgWv.js";import{P as ne,S as g,C as h,a as C,T as d}from"./PlaygroundPanel-CZxrTOj5.js";import{C as te}from"./ControlAccordion-DoyyLWlc.js";import{u as se,E as le}from"./EventLog-AWfnu5cV.js";import{I as oe,c as ie,$ as re,a0 as de,x as ce,y as he,z as ue}from"./options-C-rzDbtC.js";const pe=()=>{const[s,u]=t.useState("flat"),[c,p]=t.useState("md"),[o,N]=t.useState("blue"),[f,E]=t.useState("none"),[b,P]=t.useState(D),[w,O]=t.useState("ada@example.com"),[L,v]=t.useState(""),[j,R]=t.useState(!1),[m,V]=t.useState(!1),[y,z]=t.useState(!1),[S,G]=t.useState(!1),[r,q]=t.useState(!1),[I,B]=t.useState("classic"),[F,M]=t.useState("medium"),[T,A]=t.useState("frosted"),[U,_]=se();return e.jsx(ne,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:oe,value:s,onChange:n=>u(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(h,{label:"Size",options:ie,value:c,onChange:n=>p(n)}),e.jsx(g,{label:"Validation",options:re,value:f,onChange:n=>E(n)})]}),e.jsx(C,{label:"Tone",children:e.jsx(W,{selectable:!0,size:"sm",value:o,onSelect:N,defaultExpanded:!0})}),e.jsx(C,{label:"Placeholder",children:e.jsx(a,{size:"sm",value:w,onChange:n=>O(n.target.value)})})]})},...s==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(g,{label:"Glow intensity",options:de,value:b,onChange:n=>P(n)})}]:[],...r?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Specular",options:ce,value:I,onChange:n=>B(n)}),e.jsx(h,{label:"Vibrancy",options:he,value:F,onChange:n=>M(n)}),e.jsx(h,{label:"Glass opacity",options:ue,value:T,onChange:n=>A(n)})]})}]:[],{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(d,{label:"Leading icon",checked:j,onChange:R}),e.jsx(d,{label:"Trailing icon",checked:m,onChange:V}),e.jsx(d,{label:"Trailing is a button",checked:y,onChange:z}),e.jsx(d,{label:"Disabled",checked:S,onChange:G}),e.jsx(d,{label:"On a glass panel",checked:r,onChange:q})]})}]}),e.jsx(le,{log:U,emptyText:"No events yet — click the action icon."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<input>"})," — same structure as"," ",e.jsx("strong",{children:"SearchBar"}),", so icons are flex siblings. The focus ring is ",e.jsx("code",{children:"ring-inset"}),": an outer ring is painted outside the border box and any scrolling ancestor clips it. Keys and semantics are the native ",e.jsx("code",{children:"<input>"}),"’s; the action button gets a translated name when you do not give it one."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(K,{variant:r?"liquid-glass":"outlined",tone:r?o:"neutral",specularMode:r?I:"none",vibrancy:F,glassOpacity:T,padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(a,{variant:s,size:c,tone:o,validationStatus:f,glowIntensity:b,placeholder:w,value:L,onChange:n=>v(n.target.value),leadingIcon:j?"Search":void 0,trailingIcon:m?"Info":void 0,onTrailingIconClick:m&&y?()=>{v(""),_("action icon clicked — field cleared")}:void 0,trailingIconLabel:"Clear the field",disabled:S})})})})})};function me(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(a,{variant:"flat",placeholder:"Flat"}),e.jsx(a,{variant:"elevated",placeholder:"Elevated"}),e.jsx(a,{variant:"ghost",placeholder:"Ghost"}),e.jsx(a,{variant:"underline",placeholder:"Underline"}),e.jsx(a,{variant:"glass",placeholder:"Glass"}),e.jsx(a,{variant:"glass",tone:"blue",placeholder:"Glass, tinted"}),e.jsx(a,{variant:"gradient",placeholder:"Gradient"})]})}const xe=`import { Input } from "@cjlapao/ui-kit";

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
`;function ge(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(i,{label:"Workspace name",description:"This is how the workspace appears to every member.",children:e.jsx(a,{placeholder:"acme-inc"})}),e.jsx(i,{label:"Search",hint:"Tip: use quotes for exact matches.",children:e.jsx(a,{placeholder:"Search projects…",leadingIcon:"Search"})})]})}const fe=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function be(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(i,{label:"Email",error:"That address does not look valid.",children:e.jsx(a,{type:"email",defaultValue:"jane@",validationStatus:"error"})}),e.jsx(i,{label:"Username",helpText:"You can change this later.",children:e.jsx(a,{defaultValue:"jane-doe",validationStatus:"success"})})]})}const we=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function ve(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(a,{placeholder:"Search",leadingIcon:"Search"}),e.jsx(a,{type:"password",placeholder:"Password",leadingIcon:"Key",trailingIcon:"EyeOpen"})]})}const je=`import { Input } from "@cjlapao/ui-kit";

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
`;function ye(){return e.jsx("div",{className:"flex flex-col gap-3",children:H.map(s=>e.jsx(a,{color:"blue",size:s,placeholder:`Size ${s}`},s))})}const Se=`import { CONTROL_SIZES, Input } from "@cjlapao/ui-kit";

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
`;function Ie(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:Q.map(s=>e.jsx(a,{size:"sm",color:s,placeholder:s},s))})}const Fe=`import { Input, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Input key={each} size="sm" color={each} placeholder={each} />
      ))}
    </div>
  );
}
`;function Te(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(k,{color:"blue",placeholder:"Password",defaultValue:"correct-horse"}),e.jsx(k,{color:"blue",placeholder:"Disabled",disabled:!0})]})}const ke=`import { PasswordInput } from "@cjlapao/ui-kit";

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
`,Ce=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"}];function Ne(){const[s,u]=t.useState("aeon/cmd/aeon/action.go"),[c,p]=t.useState("");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(Y,{gap:"sm",children:[e.jsx(i,{label:"Symbol",className:"w-80 max-w-full",children:e.jsx(Z,{items:Ce,selectedId:s,onSelect:o=>u(o.id),variant:"ghost",tone:"neutral"})}),e.jsx(i,{label:"Filter",className:"w-56 shrink-0",children:e.jsx(a,{placeholder:"name…",value:c,onChange:o=>p(o.target.value),variant:"ghost"})}),e.jsx($,{color:"blue",children:"Explore"})]})})}const Ee=`import { useState } from "react";
import {
  Button,
  FieldRow,
  FormField,
  Input,
  Picker,
  type PickerItem,
} from "@cjlapao/ui-kit";

const ITEMS: PickerItem[] = [
  {
    id: "aeon/cmd/aeon/action.go",
    title: "aeon/cmd/aeon/action.go",
    subtitle: "file · aeon/cmd/aeon/action.go:1",
    icon: "File",
  },
];

/**
 * The input beside taller controls: inside a \`FieldRow\` the box fills the
 * shared control band and the text keeps its vertical centre — the row,
 * not the field, decides the height. (Outside a row, \`lines={2}\` floors
 * the box at the same height.)
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [query, setQuery] = useState("");

  return (
    <div className="w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700">
      <FieldRow gap="sm">
        <FormField label="Symbol" className="w-80 max-w-full">
          <Picker
            items={ITEMS}
            selectedId={symbol}
            onSelect={(item) => setSymbol(item.id)}
            variant="ghost"
            tone="neutral"
          />
        </FormField>
        <FormField label="Filter" className="w-56 shrink-0">
          <Input
            placeholder="name…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            variant="ghost"
          />
        </FormField>
        <Button color="blue">Explore</Button>
      </FieldRow>
    </div>
  );
}
`,Be=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ae,{name:"Input",description:"The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."}),e.jsx(pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Variants",description:"Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page. Glass is shown twice: it keeps its white wash until a tone is asked for.",code:xe,filename:"Variants.tsx",children:e.jsx(me,{})}),e.jsx(l,{title:"Labeled",description:"FormField wires the label to the input, and carries the description and hint copy.",code:fe,filename:"Labeled.tsx",children:e.jsx(ge,{})}),e.jsx(l,{title:"Validation",description:"The validation status paints the field; FormField explains why, in the right place.",code:we,filename:"Validation.tsx",children:e.jsx(be,{})}),e.jsx(l,{title:"Icons",description:"Registry icons by name, leading or trailing — search fields and password inputs in particular.",code:je,filename:"Icons.tsx",children:e.jsx(ve,{})}),e.jsx(l,{title:"Size ladder",description:"The shared xs–xl scale — height, text and icon size step together.",code:Se,filename:"SizeLadder.tsx",children:e.jsx(ye,{})}),e.jsx(l,{title:"Every tone",description:"All 21 true colours — focus one to see its border and ring.",code:Fe,filename:"EveryTone.tsx",children:e.jsx(Ie,{})}),e.jsx(l,{title:"Password",description:"PasswordInput is the same field with a built-in reveal toggle.",code:ke,filename:"Password.tsx",children:e.jsx(Te,{})}),e.jsx(l,{title:"In a row",description:"In a FieldRow the box fills the shared control band set by a taller neighbour and the text keeps its vertical centre — outside a row, lines={2} floors it at the same height.",code:Ee,filename:"InRow.tsx",children:e.jsx(Ne,{})})]}),e.jsx(J,{props:[{name:"size",type:"ControlSize",default:'"md"',description:"The shared xs&rarr;xl ladder — height, text and icon scale step together, so the field lines up with the Button or Select beside it."},{name:"tone / color",type:"TrueColor",default:'"blue"',description:"Focus border, ring and the leading icon&rsquo;s focus highlight. `color` is a `SearchBar`-compat alias; `tone` wins when both are passed."},{name:"variant",type:"InputVariant",default:'"flat"',description:"Surface style — flat, filled, outlined, elevated, underline, glass and the gradient glow, shared byte-for-byte with Textarea and SearchBar via the theme."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Paints the shared status surface on the box and sets aria-invalid on error — a caller&rsquo;s own aria-invalid cannot override the error state. Explain *why* with FormField&rsquo;s hint, not the colour."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / tone 600 / tone 400',description:"The gradient glow: a two-lobe shadow — start colour glowing from the left, end colour from the right, defaulting to the tone&rsquo;s 600/400 shades. Intensity sets the shadow&rsquo;s geometry and opacity; the reach is sized into the component&rsquo;s own box, so clipping ancestors cannot shear it off."},{name:"leadingIcon / trailingIcon",type:"IconName | ReactElement",description:"Flex siblings of the input — no padding hacks. Resting colour follows the variant; the tone&rsquo;s highlight follows on focus."},{name:"onTrailingIconClick / trailingIconLabel",type:"(event) => void / string",description:"Makes the trailing icon a real named button that follows `disabled`. Without a label it takes the translated kit default (`kit.input.trailingAction`)."},{name:"className / inputClassName",type:"string",description:"`className` targets the box (the wrapper carrying border, fill and radius — `wrapperClassName` is the deprecated alias); `inputClassName` targets the inner `<input>`."},{name:"unstyled / fullHeight",type:"boolean",default:"false",description:"`unstyled` drops the surface wholesale — the seam InputGroup stitches through; `fullHeight` lets a constrained parent stretch the field."}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["Everything else spreads onto the native ",e.jsx("code",{children:"<input>"})," — `value` / `defaultValue`, `type`, `placeholder`, `readOnly`, `maxLength`, the handlers — so the browser’s own semantics carry through untouched. `forwardRef` hands out the real input element, which is what FormField uses for label wiring and focus management."]}),e.jsxs(X,{children:[e.jsx(x,{title:"Screen reader",children:e.jsxs("p",{children:["The field ",e.jsx("em",{children:"is"})," a native ",e.jsx("code",{children:"<input>"})," — the wrapper is presentational — so role, value and typing announcements come from the browser untouched. The label lives with",e.jsx("strong",{children:"FormField"})," (",e.jsx("code",{children:"labelFor"})," / automatic id-matching); a bare Input has no name of its own, which is exactly how native inputs fail their audits — pair them. Error status sets"," ",e.jsx("code",{children:"aria-invalid"})," and FormField carries the explanation as text, never colour alone; the status icon tints but never speaks. The action button always has a name — yours or the translated kit default."]})}),e.jsx(x,{title:"Keyboard Support",children:e.jsxs("p",{children:["Native by construction: ",e.jsx(ee,{children:"Tab"})," reaches the field, editing is the browser’s, and a clickable trailing icon is a real"," ",e.jsx("code",{children:"<button>"})," in the tab order (before the input, as written — order your DOM accordingly) with a visible focus ring. The focus ring is deliberately ",e.jsx("code",{children:"ring-inset"}),": rings outside the border box get clipped by scrolling ancestors, which is the classic “where did the focus go” bug in form-heavy panels. Disabled fields drop out of the order natively and read at reduced opacity, not a repainted slab."]})}),e.jsx(x,{title:"Internationalization",children:e.jsxs("p",{children:["Content is 100% caller data — the field holds whatever the user types, in any script, with native IME composition. The only kit string is the unnamed action button’s name at"," ",e.jsx("code",{children:"kit.input.trailingAction"}),' (en, es, fr, de, pt). Layout is RTL-safe: icons are flex siblings, so a `dir="rtl"` ancestor mirrors the field and flips leading/trailing for free — no absolute offsets to invert.']})})]})]});export{Be as InputPage,Be as default};
