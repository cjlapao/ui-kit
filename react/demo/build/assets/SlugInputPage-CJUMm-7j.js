import{r as s,j as e,P as K,gB as t,C as G,c as V,gx as r}from"./index-CQwZVYnB.js";import{P as M,A as $,a as c}from"./A11ySections-BXfanEck.js";import{P as J}from"./PageHeader-BhZxEVHt.js";import{E as h}from"./ExampleCard-BZsKA5_g.js";import{P as Z,S as T,C as p,a as g,T as n}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as Q}from"./ControlAccordion-C7vC6faF.js";import{u as X,E as Y}from"./EventLog-B3ejPngN.js";import{I as ee,c as se,$ as ae}from"./options-Byh1yOHz.js";const te=[{label:"lower",value:"lower"},{label:"UPPER",value:"upper"},{label:"PreSeRve",value:"preserve"}],le=[{label:"underscore _",value:"_"},{label:"dash -",value:"-"}],ne=()=>{const[l,i]=s.useState("flat"),[o,d]=s.useState("md"),[x,k]=s.useState("blue"),[f,N]=s.useState("none"),[I,E]=s.useState("Hello, World! Foo_Bar 2024"),[m,R]=s.useState(!0),[u,P]=s.useState(!1),[v,O]=s.useState(""),[j,H]=s.useState("_"),[w,L]=s.useState("lower"),[y,_]=s.useState(""),[S,A]=s.useState(!1),[b,B]=s.useState(!1),[C,z]=s.useState(!1),[F,D]=s.useState(!1),[W,q]=X(5);return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Q,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(T,{label:"Variant",options:ee,value:l,onChange:a=>i(a)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(p,{label:"Size",options:se,value:o,onChange:a=>d(a)}),e.jsx(T,{label:"Validation",options:ae,value:f,onChange:a=>N(a)})]}),e.jsx(g,{label:"Tone",children:e.jsx(G,{selectable:!0,size:"sm",value:x,onSelect:k,defaultExpanded:!0})}),e.jsx(n,{label:"Disabled",checked:F,onChange:D})]})},{id:"slug",title:"Slug rules",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Separator",options:le,value:j,onChange:H}),e.jsx(p,{label:"Case",options:te,value:w,onChange:a=>L(a)}),e.jsx(g,{label:"Allowed extra chars",children:e.jsx(V,{size:"sm",value:y,placeholder:"(none)",onChange:a=>_(a.target.value)})}),e.jsx(g,{label:"Slug label text",children:e.jsx(V,{size:"sm",value:v,placeholder:"id: (kit default)",disabled:!u,onChange:a=>O(a.target.value)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(n,{label:"Show slug line",checked:m,onChange:R}),e.jsx(n,{label:"Show slug label",checked:u,onChange:P})]})]})},{id:"notes",title:"Notes",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(n,{label:"Error",checked:S,onChange:A}),e.jsx(n,{label:"Hint",checked:b,onChange:B}),e.jsx(n,{label:"Help text",checked:C,onChange:z})]})}]}),e.jsx(Y,{log:W,emptyText:"No events yet — type in the field."}),e.jsxs("p",{className:"text-xs opacity-70",children:["The slug is derived on every keystroke and lands in the secondary text colour under the box; ",e.jsx("code",{children:"onValueChange"})," hands you"," ",e.jsx("code",{children:"(value, slug)"})," — the event log shows the pair. Notes stack under the slug line: ",e.jsx("code",{children:"error"})," rose,"," ",e.jsx("code",{children:"hint"})," status-aware, ",e.jsx("code",{children:"helpText"})," always shown."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(K,{variant:"outlined",tone:"neutral",padding:"md",children:e.jsx("div",{className:"flex w-full flex-col gap-3",children:e.jsx(t,{variant:l,size:o,tone:x,validationStatus:f,placeholder:"My First Post!",value:I,onChange:a=>E(a.target.value),showSlug:m,slugLabel:u?v.trim()||!0:!1,slugifyOptions:{separator:j,case:w,allowed:y||void 0},error:S?"That slug is already taken.":void 0,hint:b?"This becomes the public URL.":void 0,helpText:C?"Edit the title and the slug follows.":void 0,onValueChange:(a,U)=>q(`"${a}" → ${U||"(empty)"}`),disabled:F})})})})})};function oe(){const[l,i]=s.useState({value:"",slug:""});return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-5",children:[e.jsx(t,{defaultValue:"Hello, World! Foo_Bar 2024",onValueChange:(o,d)=>i({value:o,slug:d})}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{children:"onValueChange"})," last saw value"," ",e.jsxs("code",{children:['"',l.value,'"']})," → slug"," ",e.jsxs("code",{children:['"',l.slug,'"']})]})]})}const re=`import { useState } from "react";
import { SlugInput } from "@cjlapao/ui-kit";

export default function Basic() {
  const [received, setReceived] = useState({ value: "", slug: "" });

  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <SlugInput
        defaultValue="Hello, World! Foo_Bar 2024"
        onValueChange={(value, slug) => setReceived({ value, slug })}
      />
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        <code>onValueChange</code> last saw value{" "}
        <code>&quot;{received.value}&quot;</code> → slug{" "}
        <code>&quot;{received.slug}&quot;</code>
      </p>
    </div>
  );
}
`;function ie(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(r,{label:"Dash case",children:e.jsx(t,{defaultValue:"Hello, World! Foo_Bar 2024",slugifyOptions:{separator:"-"}})}),e.jsx(r,{label:"SCREAMING_SNAKE",children:e.jsx(t,{defaultValue:"Hello, World!",slugifyOptions:{case:"upper"}})}),e.jsx(r,{label:"Dots allowed, case preserved",children:e.jsx(t,{defaultValue:"Release v1.2.3 Final",slugifyOptions:{allowed:".",case:"preserve"}})}),e.jsx(r,{label:"Full override — first 12 chars, dashed",children:e.jsx(t,{defaultValue:"Truncated under the override",slugify:l=>l.toLowerCase().slice(0,12).trim().replace(/\s+/g,"-")})})]})}const de=`import { FormField, SlugInput } from "@cjlapao/ui-kit";

export default function CustomRules() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <FormField label="Dash case">
        <SlugInput
          defaultValue="Hello, World! Foo_Bar 2024"
          slugifyOptions={{ separator: "-" }}
        />
      </FormField>
      <FormField label="SCREAMING_SNAKE">
        <SlugInput
          defaultValue="Hello, World!"
          slugifyOptions={{ case: "upper" }}
        />
      </FormField>
      <FormField label="Dots allowed, case preserved">
        <SlugInput
          defaultValue="Release v1.2.3 Final"
          slugifyOptions={{ allowed: ".", case: "preserve" }}
        />
      </FormField>
      <FormField label="Full override — first 12 chars, dashed">
        <SlugInput
          defaultValue="Truncated under the override"
          slugify={(value) => value.toLowerCase().slice(0, 12).trim().replace(/\\s+/g, "-")}
        />
      </FormField>
    </div>
  );
}
`;function ue(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(t,{defaultValue:"Jane@",error:"That handle is not available.",helpText:"Handles are free to change later."}),e.jsx(t,{defaultValue:"jane doe",hint:"Only letters, numbers and _.",validationStatus:"success"}),e.jsx(t,{defaultValue:"!!!",hint:"Symbols are ignored — something has to survive.",validationStatus:"error"})]})}const ce=`import { SlugInput } from "@cjlapao/ui-kit";

export default function Validation() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <SlugInput
        defaultValue="Jane@"
        error="That handle is not available."
        helpText="Handles are free to change later."
      />
      <SlugInput
        defaultValue="jane doe"
        hint="Only letters, numbers and _."
        validationStatus="success"
      />
      <SlugInput
        defaultValue="!!!"
        hint="Symbols are ignored — something has to survive."
        validationStatus="error"
      />
    </div>
  );
}
`,we=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(J,{name:"Slug Input",description:"The Input with a live slug underneath. Everything the field does — variants, sizes, tones, validation — stays; the derived slug renders under the box in the secondary text colour, validation notes stack below it, and onValueChange hands you both halves."}),e.jsx(ne,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Basic",description:"Type and watch the slug line update on every keystroke — symbols ignored, whitespace collapsed to _, lowercased. The readout shows exactly what onValueChange received.",code:re,filename:"Basic.tsx",children:e.jsx(oe,{})}),e.jsx(h,{title:"Custom rules",description:"SlugifyOptions moves the separator, raises or preserves case and whitelists extra characters; the slugify prop replaces the whole algorithm when the rules are truly yours.",code:de,filename:"CustomRules.tsx",children:e.jsx(ie,{})}),e.jsx(h,{title:"Validation",description:"The status paints the box as it always does; the explanation sits under the slug line — error rose, hint status-aware, helpText surviving the error.",code:ce,filename:"Validation.tsx",children:e.jsx(ue,{})})]}),e.jsx(M,{props:[{name:"showSlug",type:"boolean",default:"true",description:"Render the derived slug line under the field box. Hidden automatically while the value has nothing sluggable in it."},{name:"slugLabel",type:"string | boolean",default:"false",description:"Prefix for the slug line, off by default. `true` renders the kit&rsquo;s own `id:` (exported as `DEFAULT_SLUG_LABEL`); a string renders that text instead, e.g. `Slug:`. Part of the announced text, not decoration."},{name:"slugifyOptions",type:"SlugifyOptions",default:'{ separator: "_", case: "lower", allowed: "", transform: undefined }',description:"Separator that whitespace runs collapse to, casing applied last, extra characters kept beyond letters and digits, and a pre-transform on the raw value. Accents fold via NFKD (`café` → `cafe`); other symbols are dropped, never turned into separators."},{name:"slugify",type:"(value: string) => string",description:"Replaces the default algorithm entirely — wins over `slugifyOptions`."},{name:"onValueChange",type:"(value, slug) => void",description:"Fires on every change with the raw value and the freshly derived slug — derived from the keystroke, not from a re-read of state, so the pair can never desync from what was typed."},{name:"error / hint / helpText",type:"ReactNode",description:"Notes under the slug line on FormField&rsquo;s type scale: error rose (and implies the error status, setting `aria-invalid`), hint muted — rose on error, emerald on success — helpText always shown, even alongside an error."}]}),e.jsxs("p",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:["Everything else is ",e.jsx("strong",{children:"Input"}),"’s — the full"," ",e.jsx("code",{children:"InputProps"})," surface spreads through to the field, including"," ",e.jsx("code",{children:"forwardRef"})," to the real ",e.jsx("code",{children:"<input>"}),". The algorithm itself is exported as ",e.jsx("code",{children:"slugify(value, options)"})," from the kit, framework-agnostic in ",e.jsx("code",{children:"common/utils/slugify.ts"}),", for validation and preview panes that need the same slug the field shows."]}),e.jsxs($,{children:[e.jsx(c,{title:"Screen reader",children:e.jsxs("p",{children:["The slug line is an ",e.jsx("code",{children:'aria-live="polite"'})," ","paragraph wired into the field’s ",e.jsx("code",{children:"aria-describedby"})," ","alongside the notes, so the derived text is announced with the field rather than competing with every keystroke. Validation copy is text, never colour alone; ",e.jsx("code",{children:"error"})," implies"," ",e.jsx("code",{children:"aria-invalid"})," the way ",e.jsx("strong",{children:"FormField"})," ","enforces it."]})}),e.jsx(c,{title:"Keyboard Support",children:e.jsxs("p",{children:["Nothing new — the control is the native ",e.jsx("code",{children:"<input>"})," ","that ",e.jsx("strong",{children:"Input"})," already is. The slug line is display-only text: not focusable, not editable, tab order passes straight through."]})}),e.jsx(c,{title:"Internationalization",children:e.jsxs("p",{children:["The default rules are Unicode-aware, not ASCII-only: any script’s letters and digits survive, accented Latin folds to its base form, and case mapping follows the character, not just A–Z. Pass your own ",e.jsx("code",{children:"slugify"})," for transliterations the kit should not guess (transliterating Cyrillic, say)."]})})]})]});export{we as SlugInputPage,we as default};
