import{r as t,gw as K,j as e,P as W,c as n,C as Q,gx as i,bi as Y,bg as Z,gy as T,gz as $,gA as J,B as X}from"./index-CQwZVYnB.js";import{P as ee,A as ne,a as g,c as te}from"./A11ySections-BXfanEck.js";import{P as ae}from"./PageHeader-BhZxEVHt.js";import{E as o}from"./ExampleCard-BZsKA5_g.js";import{P as se,S as m,C as h,a as N,T as d}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as oe}from"./ControlAccordion-C7vC6faF.js";import{H as le}from"./HueControl-B9PfQcfP.js";import{u as ie,E as re}from"./EventLog-B3ejPngN.js";import{I as de,c as ce,$ as he,a0 as ue,A as pe,B as fe,C as ge}from"./options-Byh1yOHz.js";const me=()=>{const[s,u]=t.useState("flat"),[c,p]=t.useState("md"),[l,E]=t.useState("blue"),[x,P]=t.useState(void 0),[b,O]=t.useState("none"),[w,V]=t.useState(K),[v,G]=t.useState("ada@example.com"),[L,j]=t.useState(""),[y,R]=t.useState(!1),[f,z]=t.useState(!1),[S,q]=t.useState(!1),[I,B]=t.useState(!1),[r,A]=t.useState(!1),[k,M]=t.useState("classic"),[F,U]=t.useState("medium"),[C,_]=t.useState("frosted"),[D,H]=ie();return e.jsx(se,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(oe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:de,value:s,onChange:a=>u(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(h,{label:"Size",options:ce,value:c,onChange:a=>p(a)}),e.jsx(m,{label:"Validation",options:he,value:b,onChange:a=>O(a)})]}),e.jsx(N,{label:"Tone",children:e.jsx(Q,{selectable:!0,size:"sm",value:l,onSelect:E,defaultExpanded:!0})}),e.jsx(le,{label:"Fill hue",value:x,onChange:P,autoLabel:"None — the variant’s own fill"}),e.jsx(N,{label:"Placeholder",children:e.jsx(n,{size:"sm",value:v,onChange:a=>G(a.target.value)})})]})},...s==="gradient"?[{id:"glow",title:"Glow",controls:e.jsx(m,{label:"Glow intensity",options:ue,value:w,onChange:a=>V(a)})}]:[],...r?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Specular",options:pe,value:k,onChange:a=>M(a)}),e.jsx(h,{label:"Vibrancy",options:fe,value:F,onChange:a=>U(a)}),e.jsx(h,{label:"Glass opacity",options:ge,value:C,onChange:a=>_(a)})]})}]:[],{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(d,{label:"Leading icon",checked:y,onChange:R}),e.jsx(d,{label:"Trailing icon",checked:f,onChange:z}),e.jsx(d,{label:"Trailing is a button",checked:S,onChange:q}),e.jsx(d,{label:"Disabled",checked:I,onChange:B}),e.jsx(d,{label:"On a glass panel",checked:r,onChange:A})]})}]}),e.jsx(re,{log:D,emptyText:"No events yet — click the action icon."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<input>"})," — same structure as"," ",e.jsx("strong",{children:"SearchBar"}),", so icons are flex siblings. The focus ring is ",e.jsx("code",{children:"ring-inset"}),": an outer ring is painted outside the border box and any scrolling ancestor clips it. Keys and semantics are the native ",e.jsx("code",{children:"<input>"}),"’s; the action button gets a translated name when you do not give it one."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(W,{variant:r?"liquid-glass":"outlined",tone:r?l:"neutral",specularMode:r?k:"none",vibrancy:F,glassOpacity:C,padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(n,{variant:s,size:c,tone:l,backgroundColor:x,validationStatus:b,glowIntensity:w,placeholder:v,value:L,onChange:a=>j(a.target.value),leadingIcon:y?"Search":void 0,trailingIcon:f?"Info":void 0,onTrailingIconClick:f&&S?()=>{j(""),H("action icon clicked — field cleared")}:void 0,trailingIconLabel:"Clear the field",disabled:I})})})})})};function xe(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(n,{variant:"flat",placeholder:"Flat"}),e.jsx(n,{variant:"elevated",placeholder:"Elevated"}),e.jsx(n,{variant:"ghost",placeholder:"Ghost"}),e.jsx(n,{variant:"underline",placeholder:"Underline"}),e.jsx(n,{variant:"glass",placeholder:"Glass"}),e.jsx(n,{variant:"glass",tone:"blue",placeholder:"Glass, tinted"}),e.jsx(n,{variant:"gradient",placeholder:"Gradient"})]})}const be=`import { Input } from "@cjlapao/ui-kit";

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
`;function we(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(i,{label:"Workspace name",description:"This is how the workspace appears to every member.",children:e.jsx(n,{placeholder:"acme-inc"})}),e.jsx(i,{label:"Search",hint:"Tip: use quotes for exact matches.",children:e.jsx(n,{placeholder:"Search projects…",leadingIcon:"Search"})})]})}const ve=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function je(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(i,{label:"Email",error:"That address does not look valid.",children:e.jsx(n,{type:"email",defaultValue:"jane@",validationStatus:"error"})}),e.jsx(i,{label:"Username",helpText:"You can change this later.",children:e.jsx(n,{defaultValue:"jane-doe",validationStatus:"success"})})]})}const ye=`import { FormField, Input } from "@cjlapao/ui-kit";

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
`;function Se(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(n,{placeholder:"Search",leadingIcon:"Search"}),e.jsx(n,{type:"password",placeholder:"Password",leadingIcon:"Key",trailingIcon:"EyeOpen"})]})}const Ie=`import { Input } from "@cjlapao/ui-kit";

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
`;function ke(){return e.jsx("div",{className:"flex flex-col gap-3",children:Y.map(s=>e.jsx(n,{color:"blue",size:s,placeholder:`Size ${s}`},s))})}const Fe=`import { CONTROL_SIZES, Input } from "@cjlapao/ui-kit";

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
`;function Ce(){return e.jsx("div",{className:"grid gap-2 md:grid-cols-3",children:Z.map(s=>e.jsx(n,{size:"sm",color:s,placeholder:s},s))})}const Te=`import { Input, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-2 md:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <Input key={each} size="sm" color={each} placeholder={each} />
      ))}
    </div>
  );
}
`;function Ne(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-3",children:[e.jsx(T,{color:"blue",placeholder:"Password",defaultValue:"correct-horse"}),e.jsx(T,{color:"blue",placeholder:"Disabled",disabled:!0})]})}const Ee=`import { PasswordInput } from "@cjlapao/ui-kit";

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
`,Pe=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"}];function Oe(){const[s,u]=t.useState("aeon/cmd/aeon/action.go"),[c,p]=t.useState("");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs($,{gap:"sm",children:[e.jsx(i,{label:"Symbol",className:"w-80 max-w-full",children:e.jsx(J,{items:Pe,selectedId:s,onSelect:l=>u(l.id),variant:"ghost",tone:"neutral"})}),e.jsx(i,{label:"Filter",className:"w-56 shrink-0",children:e.jsx(n,{placeholder:"name…",value:c,onChange:l=>p(l.target.value),variant:"ghost"})}),e.jsx(X,{color:"blue",children:"Explore"})]})})}const Ve=`import { useState } from "react";
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
`;function Ge(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(n,{variant:"flat",tone:"blue",backgroundColor:"rose",placeholder:"Flat — rose fill, blue focus"}),e.jsx(n,{variant:"glass",tone:"blue",backgroundColor:"rose",placeholder:"Glass — sheer rose, blue focus"}),e.jsx(n,{variant:"ghost",tone:"blue",backgroundColor:"rose",placeholder:"Ghost — rose wash, blue hover rim"}),e.jsx(n,{variant:"gradient",tone:"blue",backgroundColor:"rose",placeholder:"Gradient — rose fill, blue glow"})]})}const Le=`import { Input } from "@cjlapao/ui-kit";

export default function FillVsTone() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {/*
        The pairing the prop exists for: \`tone="blue"\` stays in charge of
        every state colour — focus border, ring, icon highlight, the glow, and
        \`ghost\`'s hover rim — while \`backgroundColor="rose"\` moves only the
        fill, so all four fields rest in rose and still focus blue. Shown in
        four variants because the fill follows each variant's own recipe in the
        new hue — the pale wash of \`flat\`, the sheer blur of \`glass\`, the
        wash-and-rim ladder of \`ghost\`, the translucent fill under the
        \`gradient\`'s glow — not one fixed tone step. Hover the ghost field:
        its wash deepens in rose and its edge comes up in blue, because the rim
        is an affordance and the affordances belong to \`tone\`. \`underline\`
        paints no box, so there the prop does nothing; \`neutral\` restores the
        variant's own resting fill.
      */}
      <Input
        variant="flat"
        tone="blue"
        backgroundColor="rose"
        placeholder="Flat — rose fill, blue focus"
      />
      <Input
        variant="glass"
        tone="blue"
        backgroundColor="rose"
        placeholder="Glass — sheer rose, blue focus"
      />
      <Input
        variant="ghost"
        tone="blue"
        backgroundColor="rose"
        placeholder="Ghost — rose wash, blue hover rim"
      />
      <Input
        variant="gradient"
        tone="blue"
        backgroundColor="rose"
        placeholder="Gradient — rose fill, blue glow"
      />
    </div>
  );
}
`,He=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ae,{name:"Input",description:"The text field. Surface, size and tone all come from the shared scales, so it lines up with the SearchBar, Select and Button beside it. Pair with FormField for labels, hints and errors."}),e.jsx(me,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Variants",description:"Six surfaces for the same control — from a flat field in a dense form to a glowing gradient on a landing page. Glass is shown twice: it keeps its white wash until a tone is asked for.",code:be,filename:"Variants.tsx",children:e.jsx(xe,{})}),e.jsx(o,{title:"Labeled",description:"FormField wires the label to the input, and carries the description and hint copy.",code:ve,filename:"Labeled.tsx",children:e.jsx(we,{})}),e.jsx(o,{title:"Validation",description:"The validation status paints the field; FormField explains why, in the right place.",code:ye,filename:"Validation.tsx",children:e.jsx(je,{})}),e.jsx(o,{title:"Icons",description:"Registry icons by name, leading or trailing — search fields and password inputs in particular.",code:Ie,filename:"Icons.tsx",children:e.jsx(Se,{})}),e.jsx(o,{title:"Size ladder",description:"The shared xs–xl scale — height, text and icon size step together.",code:Fe,filename:"SizeLadder.tsx",children:e.jsx(ke,{})}),e.jsx(o,{title:"Every tone",description:"All 21 true colours — focus one to see its border and ring.",code:Te,filename:"EveryTone.tsx",children:e.jsx(Ce,{})}),e.jsx(o,{title:"A fill of its own",description:"`backgroundColor` moves only the fill: focus border, ring, icons, the gradient glow and `ghost`’s hover rim keep following `tone`, so all four of these rest in rose and still focus blue. Each variant paints that fill with its own recipe — the pale wash of `flat`, the sheer blur of `glass`, the wash-and-rim ladder of `ghost`, the translucent fill under the gradient's glow — rather than one fixed tone step; hover the ghost field and its wash deepens in rose while its edge comes up in blue. `underline` paints no box, so there the prop does nothing, and `neutral` is the way back to the variant's own resting fill.",code:Le,filename:"FillVsTone.tsx",children:e.jsx(Ge,{})}),e.jsx(o,{title:"Password",description:"PasswordInput is the same field with a built-in reveal toggle.",code:Ee,filename:"Password.tsx",children:e.jsx(Ne,{})}),e.jsx(o,{title:"In a row",description:"In a FieldRow the box fills the shared control band set by a taller neighbour and the text keeps its vertical centre — outside a row, lines={2} floors it at the same height.",code:Ve,filename:"InRow.tsx",children:e.jsx(Oe,{})})]}),e.jsx(ee,{props:[{name:"size",type:"ControlSize",default:'"md"',description:"The shared xs&rarr;xl ladder — height, text and icon scale step together, so the field lines up with the Button or Select beside it."},{name:"tone / color",type:"TrueColor",default:'"blue"',description:"Focus border, ring and the leading icon&rsquo;s focus highlight. `color` is a `SearchBar`-compat alias; `tone` wins when both are passed."},{name:"variant",type:"InputVariant",default:'"flat"',description:"Surface style — flat, filled, outlined, elevated, underline, glass and the gradient glow, shared byte-for-byte with Textarea and SearchBar via the theme."},{name:"backgroundColor",type:"TrueColor",default:'"none"',description:"The hue the field&rsquo;s *fill* wears when it should disagree with `tone` — every state colour (focus border, ring, focused icons, the gradient glow) keeps following `tone`, so a rose-filled field still focuses blue. The fill keeps the variant&rsquo;s own recipe rather than one fixed tone step — `glass` stays sheer, `ghost` repaints its washes in the new hue while its hover rim stays in `tone`; `underline` paints no box, so it is a no-op there, and `neutral` restores the variant&rsquo;s own resting fill."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Paints the shared status surface on the box and sets aria-invalid on error — a caller&rsquo;s own aria-invalid cannot override the error state. Explain *why* with FormField&rsquo;s hint, not the colour."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / tone 600 / tone 400',description:"The gradient glow: a two-lobe shadow — start colour glowing from the left, end colour from the right, defaulting to the tone&rsquo;s 600/400 shades. Intensity sets the shadow&rsquo;s geometry and opacity; the reach is sized into the component&rsquo;s own box, so clipping ancestors cannot shear it off."},{name:"leadingIcon / trailingIcon",type:"IconName | ReactElement",description:"Flex siblings of the input — no padding hacks. Resting colour follows the variant; the tone&rsquo;s highlight follows on focus."},{name:"onTrailingIconClick / trailingIconLabel",type:"(event) => void / string",description:"Makes the trailing icon a real named button that follows `disabled`. Without a label it takes the translated kit default (`kit.input.trailingAction`)."},{name:"className / inputClassName",type:"string",description:"`className` targets the box (the wrapper carrying border, fill and radius — `wrapperClassName` is the deprecated alias); `inputClassName` targets the inner `<input>`."},{name:"unstyled / fullHeight",type:"boolean",default:"false",description:"`unstyled` drops the surface wholesale — the seam InputGroup stitches through; `fullHeight` lets a constrained parent stretch the field."}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["Everything else spreads onto the native ",e.jsx("code",{children:"<input>"})," — `value` / `defaultValue`, `type`, `placeholder`, `readOnly`, `maxLength`, the handlers — so the browser’s own semantics carry through untouched. `forwardRef` hands out the real input element, which is what FormField uses for label wiring and focus management."]}),e.jsxs(ne,{children:[e.jsx(g,{title:"Screen reader",children:e.jsxs("p",{children:["The field ",e.jsx("em",{children:"is"})," a native ",e.jsx("code",{children:"<input>"})," — the wrapper is presentational — so role, value and typing announcements come from the browser untouched. The label lives with",e.jsx("strong",{children:"FormField"})," (",e.jsx("code",{children:"labelFor"})," / automatic id-matching); a bare Input has no name of its own, which is exactly how native inputs fail their audits — pair them. Error status sets"," ",e.jsx("code",{children:"aria-invalid"})," and FormField carries the explanation as text, never colour alone; the status icon tints but never speaks. The action button always has a name — yours or the translated kit default."]})}),e.jsx(g,{title:"Keyboard Support",children:e.jsxs("p",{children:["Native by construction: ",e.jsx(te,{children:"Tab"})," reaches the field, editing is the browser’s, and a clickable trailing icon is a real"," ",e.jsx("code",{children:"<button>"})," in the tab order (before the input, as written — order your DOM accordingly) with a visible focus ring. The focus ring is deliberately ",e.jsx("code",{children:"ring-inset"}),": rings outside the border box get clipped by scrolling ancestors, which is the classic “where did the focus go” bug in form-heavy panels. Disabled fields drop out of the order natively and read at reduced opacity, not a repainted slab."]})}),e.jsx(g,{title:"Internationalization",children:e.jsxs("p",{children:["Content is 100% caller data — the field holds whatever the user types, in any script, with native IME composition. The only kit string is the unnamed action button’s name at"," ",e.jsx("code",{children:"kit.input.trailingAction"}),' (en, es, fr, de, pt). Layout is RTL-safe: icons are flex siblings, so a `dir="rtl"` ancestor mirrors the field and flips leading/trailing for free — no absolute offsets to invert.']})})]})]});export{He as InputPage,He as default};
