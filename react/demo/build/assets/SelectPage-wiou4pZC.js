import{r as n,j as e,P as W,C as K,cc as o,c8 as Q,v as J,q as X}from"./index-B9JeX19j.js";import{P as Y,A as ee,a as S,C as l}from"./A11ySections-C9rTCDac.js";import{P as te}from"./PageHeader-D-LFwZLT.js";import{E as p}from"./ExampleCard-BwESxlwz.js";import{P as ae,C as h,a as se,S as ne,T as i}from"./PlaygroundPanel-CZvYEX_V.js";import{C as le}from"./ControlAccordion-rp4gabXb.js";import{u as oe,E as ie}from"./EventLog-EYY1E4QF.js";import{x as re,d as ce,p as de,Q as pe,R as he}from"./options-Blq0niUd.js";const ue=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),me=["eu-west-1","eu-west-2","eu-central-1","us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ap-south-1","ap-southeast-1","ap-northeast-1","sa-east-1"],xe=()=>{const[t,s]=n.useState("flat"),[f,z]=n.useState("md"),[u,G]=n.useState("blue"),[b,L]=n.useState("auto"),[j,P]=n.useState("subtle"),[v,V]=n.useState("none"),[m,A]=n.useState(""),[x,q]=n.useState([]),[w,$]=n.useState(!1),[y,_]=n.useState(!0),[C,F]=n.useState(!1),[c,B]=n.useState(!1),[N,H]=n.useState(!1),[I,O]=n.useState(!1),[d,M]=n.useState(!1),[U,k]=oe(),T=c?x.length?x.map(a=>`region[]=${a}`).join("&"):"— nothing selected —":m?`region=${m}`:"— no selection —",D=a=>{if(c){const g=Array.from(a.target.selectedOptions,Z=>Z.value);q(g),k(g.length?g.join(", "):"cleared")}else A(a.target.value),k(a.target.value||"cleared")},E=e.jsx(o,{variant:t,size:f,tone:u,corner:b,glowIntensity:j,validationStatus:v,disabled:N,multiple:c,leadingIcon:w?"Globe":void 0,hideCaret:C,placeholder:y?"Choose a region":void 0,value:c?x:m,onChange:D,"aria-label":"Region",children:me.map(a=>e.jsx("option",{value:a,children:a},a))});return e.jsx(ae,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(le,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:re,value:t,onChange:a=>s(a)}),e.jsx(h,{label:"Size",options:ce,value:f,onChange:a=>z(a)}),e.jsx(se,{label:"Tone",children:e.jsx(K,{selectable:!0,size:"sm",value:u,onSelect:G,defaultExpanded:!0})}),e.jsx(ne,{label:"Corner",options:de,value:b,onChange:a=>L(a)})]})},{id:"options",title:"Options",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Leading icon",checked:w,onChange:$}),e.jsx(i,{label:"Placeholder",checked:y,onChange:_}),e.jsx(i,{label:"Hide caret",checked:C,onChange:F}),e.jsx(i,{label:"Multiple",checked:c,onChange:B}),e.jsx(i,{label:"Disabled",checked:N,onChange:H})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Validation",options:pe,value:v,onChange:a=>V(a)}),e.jsxs("div",{className:"mt-2 grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"In a panel",checked:I,onChange:O}),e.jsx(i,{label:"On a glass panel",checked:d,onChange:a=>{M(a),a&&O(!0)}})]})]})},...t==="gradient"||d?[{id:"glow",title:"Glow",controls:e.jsx(h,{label:"Intensity",options:he,value:j,onChange:a=>P(a)})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The surface sits on the field's wrapper, not the"," ",e.jsx("code",{children:"<select>"})," — same structure as"," ",e.jsx("strong",{children:"Input"}),", so the caret and leading icon are flex siblings. The ",e.jsx("code",{children:"<option>"})," elements carry their own fill: the native dropdown is painted by the platform from the select's background, which is now transparent."]}),e.jsx(ie,{log:U,emptyText:"No events yet — pick an option."})]}),preview:e.jsx("div",{className:"w-full",children:I?e.jsx(W,{corner:"none",variant:d?"liquid-glass":"outlined",tone:d?u:"neutral",padding:"md",scrollable:!1,children:e.jsx(R,{readout:T,children:E})}):e.jsx(R,{readout:T,children:E})})})},R=({readout:t,children:s})=>e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4 py-2",children:[s,e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(ue,{children:"What a form submit would carry"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:t})]})]}),ge=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],Se=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2",children:Q.map(t=>e.jsx(o,{variant:t,size:"md",placeholder:t,"aria-label":t,children:ge.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),fe=`import { INPUT_VARIANTS, Select } from "@cjlapao/ui-kit";

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
`,be=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],je=()=>e.jsx("div",{className:"flex w-full max-w-sm flex-col gap-3",children:J.map(t=>e.jsx(o,{size:t,placeholder:`Size ${t}`,"aria-label":`Size ${t}`,children:be.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),ve=`import { CONTROL_SIZES, Select } from "@cjlapao/ui-kit";

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
`,we=["eu-west-1","us-east-1","ap-south-1","sa-east-1"],ye=()=>e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4",children:X.map(t=>e.jsx(o,{size:"sm",tone:t,placeholder:t,"aria-label":t,children:we.map(s=>e.jsx("option",{value:s,children:s},s))},t))}),Ce=`import { Select, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,Ne=["eu-west-1","eu-west-2","eu-central-1","us-east-1","us-east-2","us-west-1","us-west-2","ca-central-1","ap-south-1","ap-southeast-1","ap-northeast-1","sa-east-1"],r=Ne.map(t=>e.jsx("option",{value:t,children:t},t)),Ie=()=>e.jsxs("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:[e.jsx(o,{validationStatus:"error",placeholder:"Error","aria-label":"error",children:r}),e.jsx(o,{validationStatus:"success",placeholder:"Success","aria-label":"success",children:r}),e.jsx(o,{disabled:!0,placeholder:"Disabled","aria-label":"disabled",children:r}),e.jsx(o,{leadingIcon:"Globe",placeholder:"Leading icon","aria-label":"leading icon",children:r}),e.jsx(o,{hideCaret:!0,placeholder:"Hidden caret","aria-label":"hidden caret",children:r}),e.jsx(o,{multiple:!0,placeholder:"Multiple","aria-label":"multiple",children:r})]}),Oe=`import { Select } from "@cjlapao/ui-kit";

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
`,Ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(te,{name:"Select",description:"The native dropdown, with the platform caret replaced by the kit’s. Surface, size, corner and tone come from the shared scales, so it lines up with the Input and SearchBar beside it — glass blurs, gradient glows, and the popup itself is the browser’s."}),e.jsx(xe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Every variant",description:"All six surfaces at the same size, so a Select lines up with the Input and SearchBar beside it.",code:fe,filename:"Variants.tsx",children:e.jsx(Se,{})}),e.jsx(p,{title:"Size ladder",description:"The shared control scale — xs to xl — the same steps Input and SearchBar run on.",code:ve,filename:"SizeLadder.tsx",children:e.jsx(je,{})}),e.jsx(p,{title:"Every tone",description:"Focus one to see its border and ring; the tone tokens are generated from the palette, not hand-written.",code:Ce,filename:"Tones.tsx",children:e.jsx(ye,{})}),e.jsx(p,{title:"States",description:"Validation, disabled, a leading icon, a hidden caret and multiple selection.",code:Oe,filename:"States.tsx",children:e.jsx(Ie,{})})]}),e.jsx(Y,{props:[{name:"(native attributes)",type:"SelectHTMLAttributes",description:"value/defaultValue, onChange, multiple, required, name, id… pass straight through to the <select>. The Select stays a select — the form value, the popup, the keyboard and the OS typeahead are the browser&rsquo;s."},{name:"variant",type:"InputVariant",default:'"flat"',description:"The shared field surfaces. `glass` really blurs; `gradient` carries one glow behind the field like `Input` and `SearchBar`."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — the option rows&rsquo; line heights follow it too, so the dropdown matches the box."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Focus border/ring, caret-on-focus, validation-neutral icon accent, and the styled picker&rsquo;s hover/selected colours (travelling as CSS variables, nothing to safelist). `color` works as a deprecated alias."},{name:"corner",type:"SurfaceCorner",default:'"auto"',description:"Field radius from the shared control corner; an explicit token replaces it on every surface, `underline`&rsquo;s no-radius aside."},{name:"glowIntensity / gradientFrom / gradientTo",type:"GlowIntensity / string",default:'"subtle" / the tone&rsquo;s 600 → 400 shades',description:"The `gradient` variant&rsquo;s focus halo, identical to `Input`, `Textarea` and `SearchBar`."},{name:"validationStatus",type:'"none" | "success" | "error"',default:'"none"',description:"Swaps the tone focus pair for the status surface and tints the caret — while leaving the native `required`/pattern machinery alone."},{name:"placeholder",type:"ReactNode",description:"A `hidden disabled` option and — the part everyone gets wrong — the empty default the browser actually needs to show it; an uncontrolled select otherwise lands on the first *selectable* option."},{name:"leadingIcon",type:"string | ReactElement",description:"A registry icon name or element, flexed beside the box. Rests in the variant&rsquo;s muted colour, picks up the tone on focus."},{name:"hideCaret",type:"boolean",default:"false",description:"Drops the kit caret. Always dropped for `multiple` — a box of rows has no popup to point at."},{name:"className / selectClassName / unstyled",type:"string / string / boolean",description:"`className` lands on the surface wrapper (like `Input`), `selectClassName` on the control, `unstyled` drops the chrome for `InputGroup`."}]}),e.jsxs(ee,{children:[e.jsx(S,{title:"Screen reader",children:e.jsxs("p",{children:["It is a real ",e.jsx(l,{children:"<select>"})," — the role, the option list, the “N items” announcement and the popup labelling are the browser’s, so nothing drifts."," ",e.jsx(l,{children:'validationStatus="error"'})," sets ",e.jsx(l,{children:"aria-invalid"})," ","itself (after the prop spread, so a caller cannot accidentally leave an errored select claiming to be valid). Name it with a"," ",e.jsx(l,{children:"<label htmlFor>"})," or an ",e.jsx(l,{children:"aria-label"})," — the kit never invents a name."]})}),e.jsx(S,{title:"Keyboard support",children:e.jsxs("p",{children:["All native, which is the point: focus reaches it with ",e.jsx(l,{children:"Tab"}),", arrows move the selection, typing jumps to an option (typeahead),",e.jsx(l,{children:"Enter"}),"/",e.jsx(l,{children:"Space"})," opens the platform popup. The only synthetic corner is the box itself — the caret and wrapper padding live outside the select, so a click there is routed to ",e.jsx(l,{children:"showPicker()"}),"; the keyboard path never needed help."]})}),e.jsx(S,{title:"Internationalization",children:e.jsxs("p",{children:["Nothing to translate — deliberately. The Select contributes no strings of its own: options, placeholder and label are the caller’s, and the popup chrome (scrollbars, tick marks, the native menu) is drawn by the browser in the user’s locale. Localise your"," ",e.jsx(l,{children:"<option>"})," text and the control is done. What stays put: nothing — there is no English to carry."]})})]})]});export{Ve as SelectPage,Ve as default};
