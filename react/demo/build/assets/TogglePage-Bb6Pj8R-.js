import{r as n,j as e,P as K,T as l,M as d,C as U,s as X}from"./index-B9JeX19j.js";import{P as $}from"./PageHeader-D-LFwZLT.js";import{E as i}from"./ExampleCard-BwESxlwz.js";import{A as q,a as u,C as a,c as N,P as J}from"./A11ySections-C9rTCDac.js";import{P as Q,S as g,a as o,T as r}from"./PlaygroundPanel-CZvYEX_V.js";import{C as Y}from"./ControlAccordion-rp4gabXb.js";import{u as Z,E as ee}from"./EventLog-EYY1E4QF.js";import{w as te,d as le,m as ae,n as ne,l as se}from"./options-Blq0niUd.js";const ie=[{label:"Left",value:"left"},{label:"Right",value:"right"}],oe=[{label:"Stacked",value:"stacked"},{label:"Inline",value:"inline"}],re=[{label:"None",value:"none"},{label:"Xs",value:"xs"},{label:"Sm",value:"sm"},{label:"Md",value:"md"},{label:"Lg",value:"lg"},{label:"Xl",value:"xl"}],de=()=>{const[s,z]=n.useState("solid"),[f,L]=n.useState("md"),[p,E]=n.useState("left"),[m,P]=n.useState("stacked"),[x,A]=n.useState("blue"),[b,D]=n.useState("sm"),[c,G]=n.useState(!0),[j,M]=n.useState(!0),[h,R]=n.useState(!1),[v,V]=n.useState(!1),[w,I]=n.useState(!1),[B,k]=Z(),[y,F]=n.useState(!1),[C,W]=n.useState("medium"),[S,_]=n.useState("frosted"),[T,H]=n.useState("none"),O={variant:s,size:f,tone:x,padding:b,alignLabel:p,descriptionPlacement:m,fullWidth:v,vibrancy:C,glassOpacity:S,specularMode:T,iconOn:h?"Sun":void 0,iconOff:h?"Moon":void 0,disabled:w};return e.jsx(Q,{controls:e.jsxs(e.Fragment,{children:[e.jsx(Y,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Variant",options:te,value:s,onChange:t=>z(t)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(g,{label:"Size",options:le,value:f,onChange:t=>L(t)}),e.jsx(g,{label:"Padding",options:re,value:b,onChange:t=>D(t)})]}),e.jsx(o,{label:"Label alignment",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ie,value:p,onChange:t=>E(t)})}),e.jsx(o,{label:"Description",children:e.jsx(d,{fullWidth:!0,size:"sm",options:oe,value:m,onChange:t=>P(t)})}),e.jsx(o,{label:"Tone",children:e.jsx(U,{selectable:!0,size:"sm",value:x,onSelect:A,defaultExpanded:!0})})]})},...s==="glass"?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(o,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ae,value:C,onChange:t=>W(t)})}),e.jsx(o,{label:"Fill",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ne,value:S,onChange:t=>_(t)})}),e.jsx(o,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:T,onChange:t=>H(t)})})]})}]:[],{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(r,{label:"Label",checked:c,onChange:G}),e.jsx(r,{label:"Description",checked:j,onChange:M}),e.jsx(r,{label:"Icons",checked:h,onChange:R}),e.jsx(r,{label:"Full width",checked:v,onChange:V}),e.jsx(r,{label:"Disabled",checked:w,onChange:I}),e.jsx(r,{label:"Glass panel",checked:y,onChange:F})]})}]}),e.jsx(ee,{log:B,emptyText:"No events yet — flip a switch."}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Solid"})," in ",e.jsx("strong",{children:"blue"})," at ",e.jsx("code",{children:"md"})," ","with ",e.jsx("code",{children:"sm"})," row padding is the kit default — track, thumb and glyph all scale from the shared control scale, so a"," ",e.jsx("code",{children:"md"})," toggle lines up with an ",e.jsx("code",{children:"md"})," input and button. The switch itself is a native checkbox with"," ",e.jsx("code",{children:'role="switch"'}),": uncontrolled out of the box, Space and arrows for free, and the whole row is its click target."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(K,{variant:y?"glass":"elevated",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{...O,label:c?"Two-factor authentication":void 0,description:j?"Require a code from your phone to sign in.":void 0,defaultChecked:!0,onChange:t=>k(`Two-factor → ${t?"on":"off"}`)}),e.jsx(l,{...O,label:c?"Marketing emails":void 0,onChange:t=>k(`Marketing → ${t?"on":"off"}`)})]})})})})};function ce(){return e.jsx(l,{tone:"blue",label:"Enable notifications",defaultChecked:!0})}const he=`import { Toggle } from "@cjlapao/ui-kit";

export default function Basic() {
  return <Toggle tone="blue" label="Enable notifications" defaultChecked />;
}
`,ue={solid:"Solid",soft:"Soft",outline:"Outline",ghost:"Ghost",glass:"Glass"},ge="flex items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";function fe(){return e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2",children:X.map(s=>e.jsxs("div",{className:ge,children:[e.jsx("span",{className:"text-sm font-medium text-neutral-900 dark:text-neutral-100",children:ue[s]??s}),e.jsxs("span",{className:"flex items-center gap-4",children:[e.jsx(l,{variant:s}),e.jsx(l,{variant:s,defaultChecked:!0})]})]},s))})}const pe=`import { TOGGLE_VARIANTS, Toggle } from "@cjlapao/ui-kit";

const LABELS: Record<string, string> = {
  solid: "Solid",
  soft: "Soft",
  outline: "Outline",
  ghost: "Ghost",
  glass: "Glass",
};

// The gradient stands in for real page content, so the translucent
// treatments (ghost, glass) read the way they will in the wild.
const rowClass =
  "flex items-center justify-between gap-6 rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950";

export default function Variants() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
      {TOGGLE_VARIANTS.map((variant) => (
        <div key={variant} className={rowClass}>
          <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {LABELS[variant] ?? variant}
          </span>
          <span className="flex items-center gap-4">
            <Toggle variant={variant} />
            <Toggle variant={variant} defaultChecked />
          </span>
        </div>
      ))}
    </div>
  );
}
`;function me(){return e.jsxs("div",{className:"flex w-full max-w-xs flex-col items-start gap-3",children:[e.jsx(l,{iconOn:"Sun",iconOff:"Moon",defaultChecked:!0,label:"Light mode"}),e.jsx(l,{iconOn:"Sun",iconOff:"Moon",label:"Dark mode"})]})}const xe=`import { Toggle } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex w-full max-w-xs flex-col items-start gap-3">
      <Toggle iconOn="Sun" iconOff="Moon" defaultChecked label="Light mode" />
      <Toggle iconOn="Sun" iconOff="Moon" label="Dark mode" />
    </div>
  );
}
`;function be(){return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-4",children:[e.jsx(l,{tone:"blue",label:"Receive email digests",description:"A summary of activity, once a day.",defaultChecked:!0}),e.jsx(l,{tone:"emerald",label:"Compact view",description:"Fit more rows on screen.",descriptionPlacement:"inline"})]})}const je=`import { Toggle } from "@cjlapao/ui-kit";

export default function Labeled() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4">
      <Toggle
        tone="blue"
        label="Receive email digests"
        description="A summary of activity, once a day."
        defaultChecked
      />
      <Toggle
        tone="emerald"
        label="Compact view"
        description="Fit more rows on screen."
        descriptionPlacement="inline"
      />
    </div>
  );
}
`;function ve(){return e.jsxs("div",{className:"flex flex-col items-start gap-3",children:[e.jsx(l,{size:"xs",tone:"blue",label:"Extra small",defaultChecked:!0}),e.jsx(l,{size:"sm",tone:"blue",label:"Small",defaultChecked:!0}),e.jsx(l,{size:"md",tone:"blue",label:"Medium",defaultChecked:!0}),e.jsx(l,{size:"lg",tone:"blue",label:"Large",defaultChecked:!0}),e.jsx(l,{size:"xl",tone:"blue",label:"Extra large",defaultChecked:!0})]})}const we=`import { Toggle } from "@cjlapao/ui-kit";

export default function Sizes() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle size="xs" tone="blue" label="Extra small" defaultChecked />
      <Toggle size="sm" tone="blue" label="Small" defaultChecked />
      <Toggle size="md" tone="blue" label="Medium" defaultChecked />
      <Toggle size="lg" tone="blue" label="Large" defaultChecked />
      <Toggle size="xl" tone="blue" label="Extra large" defaultChecked />
    </div>
  );
}
`;function ke(){return e.jsxs("div",{className:"flex flex-col items-start gap-3",children:[e.jsx(l,{tone:"blue",label:"Enabled",defaultChecked:!0}),e.jsx(l,{tone:"blue",label:"Disabled on",defaultChecked:!0,disabled:!0}),e.jsx(l,{tone:"blue",label:"Disabled off",disabled:!0})]})}const ye=`import { Toggle } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex flex-col items-start gap-3">
      <Toggle tone="blue" label="Enabled" defaultChecked />
      <Toggle tone="blue" label="Disabled on" defaultChecked disabled />
      <Toggle tone="blue" label="Disabled off" disabled />
    </div>
  );
}
`,Pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Toggle",description:"A switch for a single on/off setting. Five treatments from Button's vocabulary — solid, soft, outline, ghost and glass — labels and descriptions live with the control, and the whole row is the click target. Works uncontrolled out of the box."}),e.jsx(de,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Basic",description:"Uncontrolled: defaultChecked seeds the state and the control toggles on its own.",code:he,filename:"Basic.tsx",children:e.jsx(ce,{})}),e.jsx(i,{title:"Variants",description:"The five `variant` treatments from `Button`'s vocabulary — each row shows the off and the on state. The off-state track is neutral in every variant; the on-state fill carries the treatment. `color` takes any of the 21 palette tones.",code:pe,filename:"Variants.tsx",children:e.jsx(fe,{})}),e.jsx(i,{title:"Icons",description:"`iconOn` and `iconOff` each live in the half of the track the thumb is not in — `iconOn` on the left (visible while checked), `iconOff` on the right (visible while unchecked) — centered in that half with breathing room to both the thumb and the wall, scaled to the toggle's size, and cross-fading with the thumb.",code:xe,filename:"Icons.tsx",children:e.jsx(me,{})}),e.jsx(i,{title:"Labeled",description:"A label plus a description, stacked under the label or inline beside it.",code:je,filename:"Labeled.tsx",children:e.jsx(be,{})}),e.jsx(i,{title:"Sizes",description:"Five sizes — the shared control scale every input, button and search bar offers — from dense settings lists to onboarding screens. The thumb always travels the full track, landing flush against the far wall.",code:we,filename:"Sizes.tsx",children:e.jsx(ve,{})}),e.jsx(i,{title:"Disabled",description:"Both disabled states stay legible — the position, not the fill, carries the meaning.",code:ye,filename:"Disabled.tsx",children:e.jsx(ke,{})})]}),e.jsxs(q,{children:[e.jsxs(u,{title:"Screen reader",children:[e.jsxs("p",{children:["Under the track is a native ",e.jsx("code",{children:"checkbox"})," with"," ",e.jsx(a,{children:'role="switch"'})," — so readers announce"," ",e.jsx("em",{children:"“on”/“off”"}),", not"," ",e.jsx("em",{children:"“checked”"}),", which is what a toggle means. The visible ",e.jsx(a,{children:"label"})," is a real ",e.jsx("code",{children:"label htmlFor"}),", the"," ",e.jsx(a,{children:"description"})," is attached via ",e.jsx(a,{children:"aria-describedby"}),", and the decorative track, thumb and icons are ",e.jsx(a,{children:"aria-hidden"})," — the state lives in the input, nowhere else. An unlabeled Toggle warns in development like every kit control (",e.jsx(a,{children:"warnIfMissingName"}),");"," ",e.jsx(a,{children:"aria-label"})," substitutes when there is genuinely no visible label."]}),e.jsxs("p",{children:["A ",e.jsx(a,{children:"tooltip"})," is portalled with ",e.jsx(a,{children:'role="tooltip"'})," and linked via ",e.jsx(a,{children:"aria-describedby"})," while visible, spoken alongside the switch state."]})]}),e.jsxs(u,{title:"Keyboard Support",children:[e.jsxs("p",{children:["All of it is native: ",e.jsx(N,{children:"Tab"})," reaches the checkbox,"," ",e.jsx(N,{children:"Space"})," toggles it — no hand-rolled key handlers to drift from browser behaviour. The row (track plus label plus padding) is the click target, and clicking it performs a ",e.jsx("em",{children:"real"})," programmatic click on the input, so uncontrolled state, the thumb and"," ",e.jsx(a,{children:"onChange"})," all move together; clicks the browser already handled — the input and its label — are ignored on the way up so nothing double-fires. ",e.jsx(a,{children:"readOnly"})," prevents the flip rather than ignoring the key, and ",e.jsx(a,{children:"disabled"})," leaves the tab order entirely."]}),e.jsxs("p",{children:["The focus indicator is ",e.jsx(a,{children:"peer-focus-visible"})," on the track — keyboard focus rings the switch itself, a mouse click does not, and the ring sits on the visible control rather than the invisible input behind it."]})]}),e.jsx(u,{title:"Internationalization",children:e.jsxs("p",{children:["Toggle is entirely language-free: no built-in strings exist to localize — the label, description and tooltip are all the caller’s text and pass through untouched, and ",e.jsx(a,{children:"iconOn"}),"/",e.jsx(a,{children:"iconOff"})," are registry glyphs, which carry no words. On/off itself is communicated by the platform (the switch role’s state), so there is nothing to translate and nothing to mistranslate. Localized labels come free from your i18n layer — the i18n page shows how kit-level strings are overridden when a component does have them."]})})]}),e.jsx(J,{props:[{name:"label",type:"ReactNode",description:"Rendered as a real <label htmlFor> — the accessible name, and part of the click target."},{name:"description",type:"ReactNode",description:"Helper line under (or beside) the label, attached with `aria-describedby`."},{name:"descriptionPlacement",type:'"stacked" | "inline"',default:'"stacked"',description:"Below the label, or flowing inline beside it."},{name:"alignLabel",type:'"left" | "right"',default:'"right"',description:"Label beside the track on either side — `left` is the settings-row layout (label first), `right` puts it after the switch."},{name:"variant",type:"ToggleVariant",default:'"solid"',description:"The Button family: solid · soft · outline · ghost · glass. The off-state track is neutral in every variant; the on-state fill carries the treatment."},{name:"tone",type:"TrueColor",default:'"blue"',description:"On-state fill and focus ring, from the 21 true colours. The glass variant tints with the full-chroma 500 step at a translucent alpha — the pastel big glass surfaces use washes out at pill size."},{name:"color",type:"TrueColor",description:"Deprecated spelling of `tone`; `tone` wins when both are given."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — track, thumb, glyph and label type all derive from it, and the thumb always travels the full track to land flush against the far wall."},{name:"padding",type:"SurfacePadding",default:'"sm"',description:"Around the row — the kit's shared padding scale."},{name:"iconOn / iconOff",type:"string | ReactElement",description:"Glyphs in the half of the track the thumb is not in, cross-fading with it, scaled to the toggle."},{name:"fullWidth",type:"boolean",description:"Stretch the row — label to the left edge, switch to the right."},{name:"disabled",type:"boolean",description:"Native attribute; the position, not the fill, still carries the state."},{name:"readOnly",type:"boolean",description:"Reads like a toggle, resists like a readout — clicks and Space are prevented, not ignored."},{name:"checked / defaultChecked / onChange",type:"native",description:"The input's own — uncontrolled out of the box, controlled whenever the app wants."},{name:"tooltip / tooltipPosition",type:"string / TooltipPosition",description:"Portalled tooltip on hover and focus, described while visible."},{name:"glass / vibrancy / glassOpacity / specularMode",type:"deprecated / GlassVibrancy / GlassOpacity / SpecularMode",description:'`glass` is the legacy spelling of `variant="glass"`; the tuning knobs apply to the variant.'}]}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Spreads native input attributes — ",e.jsx("code",{children:"name"}),", ",e.jsx("code",{children:"value"}),","," ",e.jsx("code",{children:"aria-*"})," pass straight through to the checkbox underneath."]})]});export{Pe as TogglePage,Pe as default};
