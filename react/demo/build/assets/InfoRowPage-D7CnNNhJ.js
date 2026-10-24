import{r as n,j as e,P as d,C as Y,v as Z}from"./index-gt012o8E.js";import{P as K}from"./PageHeader-CzVhyXQL.js";import{E as c}from"./ExampleCard-V3REeYJ5.js";import{A as q,a as h,C as t,P as J}from"./A11ySections-zw3_3X-2.js";import{bb as Q,d as U,f as X,p as $,bc as ee,bd as o,be as ne}from"./options-CtADNKbm.js";import{P as ae,S as r,a as u,T as i}from"./PlaygroundPanel-Czrs7oXC.js";import{C as te}from"./ControlAccordion-DIXHht2n.js";const oe="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",se=()=>{const[a,N]=n.useState("elevated"),[f,P]=n.useState("blue"),[m,z]=n.useState("md"),[p,E]=n.useState("auto"),[g,O]=n.useState("rounded-md"),[b,A]=n.useState("skeleton"),[v,V]=n.useState(!0),[x,L]=n.useState(!1),[w,B]=n.useState(!1),[y,W]=n.useState(!1),[j,_]=n.useState(!1),[R,D]=n.useState(!1),[k,F]=n.useState(!1),[S,H]=n.useState(!1),[I,G]=n.useState(!1),[C,M]=n.useState(!1),T=["Image digest","Region","Replicas"].map((s,l)=>e.jsx(o,{label:s,value:I&&l===0?"":S&&l===0?oe:l===0?"sha256:9f86d0":l===1?"eu-west-1":3,variant:a,tone:f,size:m,padding:p==="auto"?void 0:p,corner:g,copyable:v,mono:x,wrap:w,hoverable:y,noBorder:j,loading:R&&l===0,loaderType:b,error:k&&l===0?"Registry unreachable":void 0,hideIfEmpty:C},s));return e.jsx(ae,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:Q,value:a,onChange:s=>N(s)}),e.jsx(u,{label:"Tone",children:e.jsx(Y,{selectable:!0,size:"sm",value:f,onSelect:P,defaultExpanded:!0})}),e.jsx(r,{label:"Size",options:U,value:m,onChange:s=>z(s)}),e.jsx(r,{label:"Padding",options:[{label:"auto (from size)",value:"auto"},...X],value:p,onChange:s=>E(s)}),e.jsx(r,{label:"Corner",options:$,value:g,onChange:s=>O(s)}),e.jsx(r,{label:"Loader",options:ee,value:b,onChange:s=>A(s)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(u,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Copyable",checked:v,onChange:V}),e.jsx(i,{label:"Mono",checked:x,onChange:L}),e.jsx(i,{label:"Wrap",checked:w,onChange:B}),e.jsx(i,{label:"Hoverable",checked:y,onChange:W}),e.jsx(i,{label:"No border",checked:j,onChange:_})]})})},{id:"states",title:"States",controls:e.jsx(u,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Loading",checked:R,onChange:D}),e.jsx(i,{label:"Error",checked:k,onChange:F}),e.jsx(i,{label:"Long value",checked:S,onChange:H}),e.jsx(i,{label:"Empty value",checked:I,onChange:G}),e.jsx(i,{label:"Hide if empty",checked:C,onChange:M})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Elevated"})," is the kit default — each row renders a"," ",e.jsx("code",{children:"Panel"})," of its own. Switch to ",e.jsx("code",{children:"plain"})," for the details-list texture: the row is then its own root element, so the hairline's ",e.jsx("code",{children:"last:border-0"})," still matches among siblings. Turn on ",e.jsx("strong",{children:"Long value"})," and hover or tab to the value to see the truncation tooltip — it is portaled, so a scrolling panel cannot clip it."]})]}),preview:e.jsx("div",{className:"w-full max-w-xl",children:a==="plain"?e.jsx(d,{variant:"outlined",padding:"sm",scrollable:!1,children:T}):e.jsx("div",{className:"flex flex-col gap-4",children:T})})})};function ie(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:ne.map(a=>e.jsx(o,{variant:a,tone:"violet",label:a,value:"eu-west-1"},a))})}const le=`import { INFO_ROW_VARIANTS, InfoRow } from "@cjlapao/ui-kit";

/**
 * \`plain\` draws no surface of its own — just the hairline — which is what a row
 * inside a card the app already owns wants. Every other member renders a
 * \`Panel\`, so the row can also stand on its own.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INFO_ROW_VARIANTS.map((variant) => (
        <InfoRow
          key={variant}
          variant={variant}
          tone="violet"
          label={variant}
          value="eu-west-1"
        />
      ))}
    </div>
  );
}
`;function re(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Z.map(a=>e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Size",value:a,size:a}),e.jsx(o,{label:"Region",value:"eu-west-1",size:a}),e.jsx(o,{label:"Replicas",value:3,size:a})]},a))})}const de=`import { CONTROL_SIZES, InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The component used to declare its own
 * \`xs | sm | md | lg\`, so it could not be set to \`xl\` beside an \`xl\` Button.
 */
export default function Sizes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {CONTROL_SIZES.map((size) => (
        <Panel key={size} variant="outlined" padding="sm">
          <InfoRow label="Size" value={size} size={size} />
          <InfoRow label="Region" value="eu-west-1" size={size} />
          <InfoRow label="Replicas" value={3} size={size} />
        </Panel>
      ))}
    </div>
  );
}
`;function ce(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Digest",loading:!0,loaderType:"skeleton"}),e.jsx(o,{label:"Region",loading:!0,loaderType:"spinner"}),e.jsx(o,{label:"Replicas",value:3})]}),e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Digest",error:"Registry unreachable"}),e.jsx(o,{label:"Region",value:"",hideIfEmpty:!1}),e.jsx(o,{label:"Replicas",value:3})]})]})}const pe=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A row that is still loading, or that failed, has something to say even with
 * no value — so \`hideIfEmpty\` no longer wins over either. An error is
 * announced politely rather than left as an "—" indistinguishable from a value
 * that is genuinely empty.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" loading loaderType="skeleton" />
        <InfoRow label="Region" loading loaderType="spinner" />
        <InfoRow label="Replicas" value={3} />
      </Panel>
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" error="Registry unreachable" />
        <InfoRow label="Region" value="" hideIfEmpty={false} />
        <InfoRow label="Replicas" value={3} />
      </Panel>
    </div>
  );
}
`;function he(){return e.jsxs(d,{variant:"outlined",padding:"sm",className:"w-full",children:[e.jsx(o,{label:"Digest",mono:!0,value:"sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",onCopy:a=>console.log("copied",a.slice(0,12))}),e.jsx(o,{label:"Endpoint",value:"https://api.example.com/v1/capsules",mono:!0}),e.jsx(o,{label:"Verified",value:!0}),e.jsx(o,{label:"Notes",value:e.jsx("em",{children:"rendered node — no copy button"})})]})}const ue=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The copy button is a real \`IconButton\`, so it carries the kit's focus ring
 * and hit area. It is revealed on hover *and* on keyboard focus — an
 * \`opacity-0\` button is still in the tab order, so a keyboard user used to land
 * on something invisible.
 *
 * A missing clipboard (any non-secure context) and a rejected write (the
 * document is not focused — very ordinary) both report a failure now instead
 * of throwing or leaving an unhandled rejection.
 */
export default function Copy() {
  return (
    <Panel variant="outlined" padding="sm" className="w-full">
      <InfoRow
        label="Digest"
        mono
        value="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        onCopy={(text) => console.log("copied", text.slice(0, 12))}
      />
      <InfoRow
        label="Endpoint"
        value="https://api.example.com/v1/capsules"
        mono
      />
      <InfoRow label="Verified" value={true} />
      <InfoRow label="Notes" value={<em>rendered node — no copy button</em>} />
    </Panel>
  );
}
`,ye=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Info Row",description:"One label/value line in a details panel — with copy-to-clipboard, a tooltip when the value is truncated, and loading, empty and error states. Its copy colour and hairline come from the surface it sits on, so a row on glass reads as well as one on a white card."}),e.jsx(se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Variants",description:"`elevated` is the kit default — the row renders inside a `Panel` of its own. `plain` draws no surface and stays the root element, so the hairline's `last:border-0` still matches among sibling rows — pass it explicitly for the details-list texture.",code:le,filename:"Variants.tsx",children:e.jsx(ie,{})}),e.jsx(c,{title:"Sizes",description:"The full shared control scale. The component declared its own `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button — and `padding` had its own eight-member list where the kit has six.",code:de,filename:"Sizes.tsx",children:e.jsx(re,{})}),e.jsx(c,{title:"Loading, empty and error",description:"A row that is loading or has failed stays visible even with no value — `hideIfEmpty` used to win over both, so a panel visibly jumped as values arrived. The skeleton bar is sized from the row's own scale.",code:pe,filename:"States.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"Copy and truncation",description:"Copy is a real `IconButton`, revealed on hover and on keyboard focus. A missing clipboard or a rejected write reports a failure instead of throwing. The truncation tooltip is the shared portaled `TooltipWrapper`, so a scrolling panel cannot clip it — and it now answers to focus, not just to a pointer.",code:ue,filename:"Copy.tsx",children:e.jsx(he,{})})]}),e.jsxs(q,{children:[e.jsxs(h,{title:"Screen reader",children:[e.jsxs("p",{children:["A loading row carries ",e.jsx(t,{children:"aria-busy"})," on the row element itself, so assistive tech knows the value is pending rather than missing. A"," ",e.jsx(t,{children:'loaderType="spinner"'})," is a ",e.jsx(t,{children:'role="status"'})," with a localised label; a skeleton is decorative and announces nothing. An ",e.jsx(t,{children:"error"})," ","renders its text visibly and duplicates it into a polite"," ",e.jsx(t,{children:'role="status"'})," — a row that silently shows ",e.jsx(t,{children:"—"})," for a failed lookup is indistinguishable from one that is genuinely empty, and that confusion is exactly what the error prop exists to prevent."]}),e.jsxs("p",{children:["Copying is confirmed, not silent: the button’s accessible name flips to ",e.jsx(t,{children:"kit.inforow.copiedLong"})," and a polite live region announces it — polite, so a confirmation never interrupts what is being read. If the clipboard is unavailable or the write is rejected (a document that lost focus mid-click is the common case), the name flips to ",e.jsx(t,{children:"kit.inforow.copyFailed"}),", the button turns rose, and the same live region says so; nothing throws."]})]}),e.jsxs(h,{title:"Keyboard Support",children:[e.jsxs("p",{children:["The row itself is plain text — no listbox semantics, no arrow keys; rows are read in document order, which is right for a details panel. The copy button is a real ",e.jsx(t,{children:"button"})," in the tab order, and it is revealed on ",e.jsx(t,{children:"focus-visible"}),", not just on hover — an invisible button that still accepts Enter used to be a keyboard trap of confusion. It claims no space while hidden, so the value owns the full column until the button slides in. The pointer and the keyboard are the only things summoning the button — never its own confirmation state, and never the DOM focus a mouse-click leaves behind: leaving the row mid-confirmation hides the check right with the pointer, and returning within its moment finds it waiting. When the confirmation ends, hover stops summoning too — the fold lands under even a parked cursor — until the pointer leaves the row and re-arms. The keyboard's branch of the rule is ",e.jsx(t,{children:":focus-visible"}),"— a focus that cannot come from a click — so a Tab-navigated user always keeps the button, and its focus ring, on screen. A truncated value is a focusable span (an inset ring, so the focus stays inside the row) and its tooltip answers to focus as well as hover; it is portaled, so a scrolling panel cannot clip it."]}),e.jsx("p",{children:"Boolean values render as localised Yes/No text, so they are read as words rather than as nothing — and copy still offers the same text."})]}),e.jsx(h,{title:"Internationalization",children:e.jsxs("p",{children:["Every built-in string is catalog-resolved (",e.jsx(t,{children:"kit.inforow.*"}),", five locales): the loading label, the copy button’s idle name and tooltip, both confirmation phrasings, the failure message, and the Yes/No pair rendered for boolean values. The ",e.jsx(t,{children:"emptyText"})," ","placeholder defaults to a locale-neutral ",e.jsx(t,{children:"—"}),", and Labels, values and errors are the caller’s text and pass through untouched; want a whole new language? Layer ",e.jsx(t,{children:"kit.inforow.*"})," keys in your own catalogs — the i18n page shows the override live."]})})]}),e.jsx(J,{props:[{name:"label",type:"ReactNode",description:"Left column. Composed labels are welcome; keep interactive children out of the row."},{name:"value",type:"ReactNode",description:"string/number render as copyable text; boolean renders localised Yes/No, also copyable; a ReactNode renders as-is and suppresses the copy button; null/undefined/'' count as empty."},{name:"variant",type:"PlainSurfaceVariant",default:'"elevated"',description:"The kit surface family. `plain` draws no surface and keeps the row as the root element — pass it for details-list texture where the hairline's `last:border-0` must match siblings."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent for the hover wash, focus rings and glass tint. Text colour is not tinted — it comes from the surface, so a row on glass stays readable."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — type, gaps, label width, skeleton-bar height and icon size all derive from it."},{name:"labelSize / valueSize",type:"ControlSize",description:"Independent type overrides for either column when the row's own `size` is not enough."},{name:"padding",type:"SurfacePadding",description:"Vertical padding override. Omit it and padding derives from `size`."},{name:"corner",type:"SurfaceCorner",default:"rounded-md",description:"Only visible with a surface variant — a plain row draws none."},{name:"labelWidth",type:"string",description:'Fixed label-column width class (`"w-32"`). Defaults per size (`w-16`…`w-32`); pass `""` to let the label size naturally.'},{name:"copyable",type:"boolean",default:"true",description:"Auto-off for ReactNode values (nothing meaningful to copy); explicit `true` forces the button for any stringifiable value."},{name:"onCopy",type:"(text: string) => void",description:"Fired after a confirmed write."},{name:"loading",type:"boolean",description:"Placeholder in the value's place, `aria-busy` on the row, copy suppressed. The row stays visible even with no value — `hideIfEmpty` does not win over a pending row."},{name:"loaderType",type:'"skeleton" | "spinner"',default:'"skeleton"',description:'Skeleton bar (decorative, sized from the row scale) or spin ring (`role="status"`, localised). Both stand down under `prefers-reduced-motion`.'},{name:"error",type:"string",description:"Replaces the value, visibly and in a polite live region. Also keeps the row visible under `hideIfEmpty`."},{name:"hideIfEmpty",type:"boolean",default:"true",description:"Removes the row entirely when the value is empty — loading and error rows excepted."},{name:"emptyText",type:"string",default:'"—"',description:"Placeholder when `hideIfEmpty` is off."},{name:"wrap",type:"boolean",default:"false",description:"Wrap the value instead of truncating it."},{name:"tooltipOnTruncate",type:"boolean",default:"true",description:"Portaled full-value tooltip on hover and focus, measured live — only while truncation actually happens."},{name:"mono",type:"boolean",description:"Monospace for the value — digests, ids, IPs."},{name:"hoverable",type:"boolean",description:"Tone-coloured hover wash with rounded corners; drops the hairline while on."},{name:"noBorder / noPadding",type:"boolean",description:"Local escapes for lists whose borders or padding are managed externally."},{name:"glassOpacity / vibrancy",type:"GlassOpacity / GlassVibrancy",description:"Glass tuning for the glass variants."}]}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{children:"InfoRow"})," spreads div attributes. Rows are meant to be siblings in a plain flow — wrapping them in per-row containers breaks the hairline’s last-child rule."]})]});export{ye as InfoRowPage,ye as default};
