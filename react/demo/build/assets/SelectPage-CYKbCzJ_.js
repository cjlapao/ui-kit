import{r as a,j as e,P as Q,C as X,y as o,g as Y,bn as ee,bl as te,g8 as ne,g6 as F,g9 as ae,B as se}from"./index-ChbzYKtA.js";import{P as oe,A as le,a as b,C as l}from"./A11ySections-Ci0MCORB.js";import{P as ie}from"./PageHeader-CORco2N-.js";import{E as p}from"./ExampleCard-Db5NXgWv.js";import{P as re,C as m,a as ce,S as de,T as i}from"./PlaygroundPanel-CZxrTOj5.js";import{C as pe}from"./ControlAccordion-DoyyLWlc.js";import{u as he,E as ue}from"./EventLog-AWfnu5cV.js";import{I as me,c as ge,f as xe,$ as Se,a0 as fe}from"./options-C-rzDbtC.js";const be=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),we=["eu-west-1","eu-west-2","eu-central-1","us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ap-south-1","ap-southeast-1","ap-northeast-1","sa-east-1"],je=()=>{const[t,s]=a.useState("flat"),[h,g]=a.useState("md"),[r,G]=a.useState("blue"),[w,A]=a.useState("auto"),[j,L]=a.useState("subtle"),[v,V]=a.useState("none"),[x,B]=a.useState(""),[S,$]=a.useState([]),[y,q]=a.useState(!1),[C,M]=a.useState(!0),[k,_]=a.useState(!1),[I,H]=a.useState(!1),[d,K]=a.useState(!1),[N,U]=a.useState(!1),[O,E]=a.useState(!1),[u,D]=a.useState(!1),[Z,T]=he(),R=d?S.length?S.map(n=>`region[]=${n}`).join("&"):"— nothing selected —":x?`region=${x}`:"— no selection —",W=n=>{if(d){const f=Array.from(n.target.selectedOptions,J=>J.value);$(f),T(f.length?f.join(", "):"cleared")}else B(n.target.value),T(n.target.value||"cleared")},z=e.jsx(o,{variant:t,size:h,tone:r,corner:w,glowIntensity:j,validationStatus:v,disabled:N,multiple:d,leadingIcon:y?"Globe":void 0,hideCaret:k,closeOnSelect:I,placeholder:C?"Choose a region":void 0,value:d?S:x,onChange:W,"aria-label":"Region",children:we.map(n=>e.jsx("option",{value:n,children:n},n))});return e.jsx(re,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(pe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Variant",options:me,value:t,onChange:n=>s(n)}),e.jsx(m,{label:"Size",options:ge,value:h,onChange:n=>g(n)}),e.jsx(ce,{label:"Tone",children:e.jsx(X,{selectable:!0,size:"sm",value:r,onSelect:G,defaultExpanded:!0})}),e.jsx(de,{label:"Corner",options:xe,value:w,onChange:n=>A(n)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Leading icon",checked:y,onChange:q}),e.jsx(i,{label:"Placeholder",checked:C,onChange:M}),e.jsx(i,{label:"Hide caret",checked:k,onChange:_}),e.jsx(i,{label:"Multiple",checked:d,onChange:K}),e.jsx(i,{label:"Close on select",checked:I,onChange:H}),e.jsx(i,{label:"Disabled",checked:N,onChange:U})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Validation",options:Se,value:v,onChange:n=>V(n)}),e.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"In a panel",checked:O,onChange:E}),e.jsx(i,{label:"On a glass panel",checked:u,onChange:n=>{D(n),n&&E(!0)}})]})]})},...t==="gradient"||u?[{id:"glow",title:"Glow",controls:e.jsx(m,{label:"Intensity",options:fe,value:j,onChange:n=>L(n)})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<select>"})," — same structure as"," ",e.jsx("strong",{children:"Input"}),", so the caret and leading icon are flex siblings. The ",e.jsx("code",{children:"<option>"})," elements carry their own fill: the native dropdown is painted by the platform from the select's background, which is now transparent."]}),e.jsx(ue,{log:Z,emptyText:"No events yet — pick an option."})]}),preview:e.jsx("div",{className:"w-full",children:O?e.jsx(Q,{corner:"none",variant:u?"liquid-glass":"outlined",tone:u?r:"neutral",padding:"md",scrollable:!1,children:e.jsx(P,{readout:R,children:z})}):e.jsx(P,{readout:R,children:z})})})},P=({readout:t,children:s})=>e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4 py-2",children:[s,e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(be,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:t})]})]}),ve=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],ye=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:Y.map(t=>e.jsx(o,{variant:t,size:"md",placeholder:t,"aria-label":t,children:ve.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),Ce=`import { INPUT_VARIANTS, Select } from "@cjlapao/ui-kit";

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
`,ke=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],Ie=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:ee.map(t=>e.jsx(o,{size:t,placeholder:`Size ${t}`,"aria-label":`Size ${t}`,children:ke.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),Ne=`import { CONTROL_SIZES, Select } from "@cjlapao/ui-kit";

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
`,Oe=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],Ee=()=>e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4",children:te.map(t=>e.jsx(o,{size:"sm",tone:t,placeholder:t,"aria-label":t,children:Oe.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),Te=`import { Select, TRUE_COLORS } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const Tones = () => (
  <div className="grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4">
    {TRUE_COLORS.map((tone) => (
      <Select
        key={tone}
        size="sm"
        tone={tone}
        placeholder={tone}
        aria-label={tone}
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

export default Tones;
`,Re=["eu-west-1","eu-west-2","eu-central-1","us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ap-south-1","ap-southeast-1","ap-northeast-1","sa-east-1"],c=Re.map(t=>e.jsx("option",{value:t,children:t},t)),ze=()=>e.jsxs("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:[e.jsx(o,{validationStatus:"error",placeholder:"Error","aria-label":"error",children:c}),e.jsx(o,{validationStatus:"success",placeholder:"Success","aria-label":"success",children:c}),e.jsx(o,{disabled:!0,placeholder:"Disabled","aria-label":"disabled",children:c}),e.jsx(o,{leadingIcon:"Globe",placeholder:"Leading icon","aria-label":"leading icon",children:c}),e.jsx(o,{hideCaret:!0,placeholder:"Hidden caret","aria-label":"hidden caret",children:c}),e.jsx(o,{multiple:!0,placeholder:"Multiple","aria-label":"multiple",children:c})]}),Fe=`import { Select } from "@cjlapao/ui-kit";

const REGIONS = [
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "ca-central-1",
  "ap-south-1",
  "ap-southeast-1",
  "ap-northeast-1",
  "sa-east-1",
];

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
    <Select
      validationStatus="success"
      placeholder="Success"
      aria-label="success"
    >
      {regionOptions}
    </Select>
    <Select disabled placeholder="Disabled" aria-label="disabled">
      {regionOptions}
    </Select>
    <Select
      leadingIcon="Globe"
      placeholder="Leading icon"
      aria-label="leading icon"
    >
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
`,Pe=[{id:"aeon/cmd/aeon/action.go",title:"aeon/cmd/aeon/action.go",subtitle:"file · aeon/cmd/aeon/action.go:1",icon:"File"}];function Ge(){const[t,s]=a.useState("aeon/cmd/aeon/action.go"),[h,g]=a.useState("");return e.jsx("div",{className:"w-full rounded-lg border border-dashed border-neutral-300 p-4 dark:border-neutral-700",children:e.jsxs(ne,{gap:"sm",children:[e.jsx(F,{label:"Symbol",className:"w-80 max-w-full",children:e.jsx(ae,{items:Pe,selectedId:t,onSelect:r=>s(r.id),variant:"ghost",tone:"neutral"})}),e.jsx(F,{label:"Kind",className:"w-40 shrink-0",children:e.jsxs(o,{value:h,onChange:r=>g(r.target.value),placeholder:"Any kind",variant:"ghost",tone:"neutral",children:[e.jsx("option",{value:"function",children:"function"}),e.jsx("option",{value:"method",children:"method"}),e.jsx("option",{value:"file",children:"file"})]})}),e.jsx(se,{color:"blue",children:"Explore"})]})})}const Ae=`import { useState } from "react";
import {
  Button,
  FieldRow,
  FormField,
  Picker,
  Select,
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
 * A native \`Select\` in the same row as a two-line \`Picker\`: the select
 * grows to the control band and its text and caret ride the vertical
 * centre. No \`lines\` prop needed inside a row — the band is the contract.
 */
export default function InRow() {
  const [symbol, setSymbol] = useState("aeon/cmd/aeon/action.go");
  const [kind, setKind] = useState("");

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
        <FormField label="Kind" className="w-40 shrink-0">
          <Select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            placeholder="Any kind"
            variant="ghost"
            tone="neutral"
          >
            <option value="function">function</option>
            <option value="method">method</option>
            <option value="file">file</option>
          </Select>
        </FormField>
        <Button color="blue">Explore</Button>
      </FieldRow>
    </div>
  );
}
`,Ke=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ie,{name:"Select",description:"The native dropdown, with the platform caret replaced by the kit’s. Surface, size, corner and tone come from the shared scales, so it lines up with the Input and SearchBar beside it — glass blurs, gradient glows, and the popup itself is the browser’s."}),e.jsx(je,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Every variant",description:"All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it.",code:Ce,filename:"Variants.tsx",children:e.jsx(ye,{})}),e.jsx(p,{title:"Size ladder",description:"The shared control scale — xs to xl — the same steps Input and SearchBar run on.",code:Ne,filename:"SizeLadder.tsx",children:e.jsx(Ie,{})}),e.jsx(p,{title:"Every tone",description:"Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written.",code:Te,filename:"Tones.tsx",children:e.jsx(Ee,{})}),e.jsx(p,{title:"States",description:"Validation, disabled, a leading icon, a hidden caret and multiple selection.",code:Fe,filename:"States.tsx",children:e.jsx(ze,{})}),e.jsx(p,{title:"In a row",description:"In a FieldRow beside a two-line Picker, the select grows to the shared control band — text and caret vertically centred, no lines prop needed.",code:Ae,filename:"InRow.tsx",children:e.jsx(Ge,{})})]}),e.jsx(oe,{props:[{name:"closeOnSelect",type:"boolean",default:"false",description:"Explicitly blurs the Select after a selection change to dismiss the native picker. Calls onChange first. Ignored for multiple. False retains browser behavior, which normally closes single-select pickers automatically."},{name:"(native attributes)",type:"SelectHTMLAttributes",description:"value/defaultValue, onChange, multiple, required, name, id… pass straight through to the <select>. The Select stays a select — the form value, the popup, the keyboard and the OS typeahead are the browser&rsquo;s."},{name:"variant",type:"InputVariant",default:'"flat"',description:"The shared field surfaces. `glass` really blurs; `gradient` carries one glow behind the field like `Input` and `SearchBar`."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — the option rows&rsquo; line heights follow it too, so the dropdown matches the box."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Focus border/ring, caret-on-focus, validation-neutral icon accent, and the styled picker&rsquo;s hover/selected colours (travelling as CSS variables, nothing to safelist). `color` works as a deprecated alias."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"Field radius from the shared control corner; an explicit token replaces it on every surface, `underline`&rsquo;s no-radius aside."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone&rsquo;s 600 → 400 shades',description:"The `gradient` variant&rsquo;s focus halo, identical to `Input`, `Textarea` and `SearchBar`."},{name:"validationStatus",type:'"none" | "success" | "error"',default:'"none"',description:"Swaps the tone focus pair for the status surface and tints the caret — while leaving the native `required`/pattern machinery alone."},{name:"placeholder",type:"ReactNode",description:"A `hidden disabled` option and — the part everyone gets wrong — the empty default the browser actually needs to show it; an uncontrolled select otherwise lands on the first *selectable* option."},{name:"leadingIcon",type:"string | ReactElement",description:"A registry icon name or element, flexed beside the box. Rests in the variant&rsquo;s muted colour, picks up the tone on focus."},{name:"hideCaret",type:"boolean",default:"false",description:"Drops the kit caret. Always dropped for `multiple` — a box of rows has no popup to point at."},{name:"className / selectClassName / unstyled",type:"string / string / boolean",description:"`className` lands on the surface wrapper (like `Input`), `selectClassName` on the control, `unstyled` drops the chrome for `InputGroup`."}]}),e.jsxs(le,{children:[e.jsx(b,{title:"Screen reader",children:e.jsxs("p",{children:["It is a real ",e.jsx(l,{children:"<select>"})," — the role, the option list, the “N items” announcement and the popup labelling are the browser’s, so nothing drifts."," ",e.jsx(l,{children:'validationStatus="error"'})," sets ",e.jsx(l,{children:"aria-invalid"})," ","itself (after the prop spread, so a caller cannot accidentally leave an errored select claiming to be valid). Name it with a"," ",e.jsx(l,{children:"<label htmlFor>"})," or an ",e.jsx(l,{children:"aria-label"})," — the kit never invents a name."]})}),e.jsx(b,{title:"Keyboard support",children:e.jsxs("p",{children:["All native, which is the point: focus reaches it with ",e.jsx(l,{children:"Tab"}),", arrows move the selection, typing jumps to an option (typeahead),",e.jsx(l,{children:"Enter"}),"/",e.jsx(l,{children:"Space"})," opens the platform popup. The only synthetic corner is the box itself — the caret and wrapper padding live outside the select, so a click there is routed to ",e.jsx(l,{children:"showPicker()"}),"; the keyboard path never needed help."]})}),e.jsx(b,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. The Select contributes no strings of its own: options, placeholder and label are the caller’s, and the popup chrome (scrollbars, tick marks, the native menu) is drawn by the browser in the user’s locale. Localise your"," ",e.jsx(l,{children:"<option>"})," text and the control is done. What stays put: nothing — there is no English to carry."]})})]})]});export{Ke as SelectPage,Ke as default};
