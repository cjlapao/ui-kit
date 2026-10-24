import{r as s,j as e,P as K,t as a,C as Y,I as k,v as J,q as Q}from"./index-gt012o8E.js";import{P as X}from"./PageHeader-CzVhyXQL.js";import{E as c}from"./ExampleCard-V3REeYJ5.js";import{A as ee,a as b,C as t,c as C,P as te}from"./A11ySections-zw3_3X-2.js";import{P as ne,S as h,a as m,T as l}from"./PlaygroundPanel-Czrs7oXC.js";import{C as se}from"./ControlAccordion-DIXHht2n.js";import{u as ie,E as ae}from"./EventLog-Dx0vbma4.js";import{x as le,d as oe,y as re,z as ce,A as de}from"./options-CtADNKbm.js";const he=()=>{const[i,x]=s.useState("md"),[o,r]=s.useState("blue"),[d,g]=s.useState("flat"),[u,j]=s.useState("left"),[w,O]=s.useState("bottom"),[p,q]=s.useState("none"),[y,V]=s.useState("This field is required"),[S,W]=s.useState("Accept the terms"),[T,F]=s.useState("You can withdraw consent at any time."),[N,B]=s.useState(!0),[A,H]=s.useState(!0),[E,L]=s.useState(!0),[U,$]=ie(),[I,v]=s.useState(!1),[R,M]=s.useState(!1),[z,_]=s.useState(!1),[P,G]=s.useState(!1),[D,Z]=s.useState(!1);return e.jsx(ne,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(se,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Variant",options:le,value:d,onChange:n=>g(n)}),e.jsx(h,{label:"Size",options:oe,value:i,onChange:n=>x(n)}),e.jsx(m,{label:"Tone",children:e.jsx(Y,{selectable:!0,size:"sm",value:o,onSelect:r,defaultExpanded:!0})}),e.jsx(h,{label:"Control side",options:re,value:u,onChange:n=>j(n)}),e.jsx(h,{label:"Description",options:ce,value:w,onChange:n=>O(n)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Label",children:e.jsx(k,{size:"sm",value:S,onChange:n=>W(n.target.value)})}),e.jsx(m,{label:"Description text",children:e.jsx(k,{size:"sm",value:T,onChange:n=>F(n.target.value)})})]})},{id:"validation",title:"Validation",controls:e.jsxs(e.Fragment,{children:[e.jsx(h,{label:"Validation",options:de,value:p,onChange:n=>q(n)}),e.jsx(m,{label:"Validation message",children:e.jsx(k,{size:"sm",value:y,disabled:p==="none",onChange:n=>V(n.target.value)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Checked",checked:E,onChange:n=>{L(n),v(!1)}}),e.jsx(l,{label:"Indeterminate",checked:I,onChange:v}),e.jsx(l,{label:"Label",checked:N,onChange:B}),e.jsx(l,{label:"Description",checked:A,onChange:H}),e.jsx(l,{label:"Required",checked:R,onChange:M}),e.jsx(l,{label:"Disabled",checked:z,onChange:_}),e.jsx(l,{label:"Full width",checked:P,onChange:G}),e.jsx(l,{label:"Glass panel",checked:D,onChange:Z})]})}]}),e.jsx(ae,{log:U,emptyText:"No events yet — tick the box."}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Variant"})," styles the rest surface — the box when it is ",e.jsx("em",{children:"unchecked"}),": ghost sits flush, elevated lifts a shadow, glass and gradient blur what is behind. The checked fill is the tone’s in every variant but ",e.jsx("code",{children:"glass"}),", which tints like Toggle’s glass track (",e.jsx("code",{children:"500/40"}),", frost edge kept) — an opaque fill would hide its own blur. Flip"," ",e.jsx("strong",{children:"Checked"})," off in the States group to see the rest surfaces apart. ",e.jsx("strong",{children:"Indeterminate"})," wins over checked, as it does on the native control, and is announced as"," ",e.jsx("code",{children:'aria-checked="mixed"'}),". The checked fill steps to ",e.jsx("code",{children:"-700"})," in light and ",e.jsx("code",{children:"-400"})," in dark so the tick clears WCAG contrast on every tone."," ",e.jsx("strong",{children:"Glass panel"})," swaps the preview host between the kit’s default ",e.jsx("code",{children:"elevated"})," surface and"," ",e.jsx("code",{children:"glass"})," — pair it with the playground’s background-image toggle to give the blur something to blur."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(K,{variant:D?"glass":"elevated",padding:"md",children:e.jsx(a,{size:i,tone:o,variant:d,controlAlign:u,descriptionPlacement:w,label:N?S:void 0,description:A?T:void 0,checked:E,indeterminate:I,required:R,fullWidth:P,disabled:z,validationStatus:p,validationMessage:p==="none"?void 0:y,onChange:n=>{L(n.target.checked),v(!1),$(`checked → ${n.target.checked}`)}})})})})};function xe(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(a,{color:"blue",label:"Accept the terms and conditions",defaultChecked:!0}),e.jsx(a,{color:"blue",label:"Subscribe to the newsletter"})]})}const ue=`import { Checkbox } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        color="blue"
        label="Accept the terms and conditions"
        defaultChecked
      />
      <Checkbox color="blue" label="Subscribe to the newsletter" />
    </div>
  );
}
`;function pe(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(a,{color:"blue",label:"Two-factor authentication",description:"Adds a second step when signing in from a new device."}),e.jsx(a,{color:"emerald",label:"Public profile",description:"Other members can find you by name.",descriptionPlacement:"inline",defaultChecked:!0})]})}const be=`import { Checkbox } from "@cjlapao/ui-kit";

export default function WithDescription() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Checkbox
        color="blue"
        label="Two-factor authentication"
        description="Adds a second step when signing in from a new device."
      />
      <Checkbox
        color="emerald"
        label="Public profile"
        description="Other members can find you by name."
        descriptionPlacement="inline"
        defaultChecked
      />
    </div>
  );
}
`,f=["Containers","Images","Volumes"];function me(){const[i,x]=s.useState([!0,!1,!1]),o=i.filter(Boolean).length;return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(a,{tone:"blue",label:"All resources",description:`${o} of ${f.length} selected`,checked:o===f.length,indeterminate:o>0&&o<f.length,onChange:r=>x(i.map(()=>r.target.checked))}),e.jsx("div",{className:"ml-6 flex flex-col gap-2",children:f.map((r,d)=>e.jsx(a,{tone:"blue",label:r,checked:i[d],onChange:g=>x(i.map((u,j)=>j===d?g.target.checked:u))},r))})]})}const fe=`import { useState } from "react";
import { Checkbox } from "@cjlapao/ui-kit";

const CHILDREN = ["Containers", "Images", "Volumes"];

export default function SelectAll() {
  const [items, setItems] = useState([true, false, false]);
  const checkedCount = items.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        tone="blue"
        label="All resources"
        description={\`\${checkedCount} of \${CHILDREN.length} selected\`}
        checked={checkedCount === CHILDREN.length}
        indeterminate={checkedCount > 0 && checkedCount < CHILDREN.length}
        onChange={(event) => setItems(items.map(() => event.target.checked))}
      />
      <div className="ml-6 flex flex-col gap-2">
        {CHILDREN.map((label, index) => (
          <Checkbox
            key={label}
            tone="blue"
            label={label}
            checked={items[index]}
            onChange={(event) =>
              setItems(
                items.map((value, i) =>
                  i === index ? event.target.checked : value,
                ),
              )
            }
          />
        ))}
      </div>
    </div>
  );
}
`;function ge(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(a,{tone:"blue",label:"Checked and disabled",defaultChecked:!0,disabled:!0}),e.jsx(a,{tone:"blue",label:"Unchecked and disabled",disabled:!0}),e.jsx(a,{tone:"blue",label:"Some items selected",indeterminate:!0})]})}const je=`import { Checkbox } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        tone="blue"
        label="Checked and disabled"
        defaultChecked
        disabled
      />
      <Checkbox tone="blue" label="Unchecked and disabled" disabled />
      <Checkbox tone="blue" label="Some items selected" indeterminate />
    </div>
  );
}
`;function ve(){return e.jsx("div",{className:"flex flex-col gap-3",children:J.map(i=>e.jsx(a,{tone:"blue",size:i,defaultChecked:!0,label:`Size ${i}`,description:"The box sits on the label's cap height at every step."},i))})}const ke=`import { Checkbox, CONTROL_SIZES } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <Checkbox
          key={each}
          tone="blue"
          size={each}
          defaultChecked
          label={\`Size \${each}\`}
          description="The box sits on the label's cap height at every step."
        />
      ))}
    </div>
  );
}
`;function Ce(){return e.jsx("div",{className:"grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3",children:Q.map(i=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(a,{tone:i,defaultChecked:!0,label:i}),e.jsx(a,{tone:i,indeterminate:!0})]},i))})}const we=`import { Checkbox, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex items-center gap-4">
          <Checkbox tone={each} defaultChecked label={each} />
          <Checkbox tone={each} indeterminate />
        </div>
      ))}
    </div>
  );
}
`,Re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(X,{name:"Checkbox",description:"A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation. The variant changes the rest surface (the box you see when it is *off*); the checked fill is the tone everywhere."}),e.jsx(he,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Basic",description:"A row of options, each an independent checkbox.",code:ue,filename:"Basic.tsx",children:e.jsx(xe,{})}),e.jsx(c,{title:"With description",description:"Explain the consequence of the choice right where the decision is made.",code:be,filename:"WithDescription.tsx",children:e.jsx(pe,{})}),e.jsx(c,{title:"Select all",description:"A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked.",code:fe,filename:"SelectAll.tsx",children:e.jsx(me,{})}),e.jsx(c,{title:"States",description:"Disabled rows keep their state visible; indeterminate marks a parent with mixed children.",code:je,filename:"States.tsx",children:e.jsx(ge,{})}),e.jsx(c,{title:"Size ladder",description:"The shared xs–xl scale — the box sits on the label's cap height at every step.",code:ke,filename:"SizeLadder.tsx",children:e.jsx(ve,{})}),e.jsx(c,{title:"Every tone",description:"All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes.",code:we,filename:"EveryTone.tsx",children:e.jsx(Ce,{})})]}),e.jsxs(ee,{children:[e.jsx(b,{title:"Screen reader",children:e.jsxs("p",{children:["The box, tick and dash are drawings; the ",e.jsx("em",{children:"control"})," is a native"," ",e.jsx("code",{children:"checkbox"})," laid invisibly over the box — readers announce"," ",e.jsx("em",{children:"“checkbox, checked”"})," and the tri-state"," ",e.jsx(t,{children:"indeterminate"})," is announced as ",e.jsx("code",{children:'aria-checked="mixed"'}),", which is exactly what a partially-selected parent means. The"," ",e.jsx(t,{children:"label"})," is a real ",e.jsx("code",{children:"label htmlFor"}),", ",e.jsx(t,{children:"description"})," ","and ",e.jsx(t,{children:"validationMessage"})," are attached via ",e.jsx(t,{children:"aria-describedby"}),", and ",e.jsx(t,{children:'validationStatus="error"'})," also sets"," ",e.jsx(t,{children:"aria-invalid"}),". All decoration is ",e.jsx(t,{children:"aria-hidden"})," — the state lives in the input, nowhere else. An unnamed checkbox warns in development (",e.jsx(t,{children:"warnIfMissingName"}),"); a ",e.jsx(t,{children:"description"})," alone silences it, because ",e.jsx(t,{children:"aria-describedby"})," text does reach the accessible-name computation — but a visible ",e.jsx(t,{children:"label"})," is still the better answer."]})}),e.jsxs(b,{title:"Keyboard Support",children:[e.jsxs("p",{children:["All of it is native: ",e.jsx(C,{children:"Tab"})," reaches the checkbox and"," ",e.jsx(C,{children:"Space"})," toggles it — there are no key handlers to drift from browser behaviour, and the control keeps real form participation (",e.jsx(t,{children:"required"})," blocks form submission natively). The whole row — box, label, description and their padding — is one ",e.jsx("code",{children:"label"})," ","element, so it is all click target. The focus ring is drawn by"," ",e.jsx(t,{children:"peer-focus-visible"})," on the visible box: keyboard focus rings the control, a mouse click does not, and the ring never lands on the invisible input."]}),e.jsxs("p",{children:[e.jsx(t,{children:"indeterminate"})," is a ",e.jsx("em",{children:"property"}),", not an attribute — the component sets ",e.jsx(t,{children:"input.indeterminate"})," imperatively (on mount and whenever the prop changes), the same way a hand-written ref would; keyboard users then move it out of mixed by pressing ",e.jsx(C,{children:"Space"}),", which is the platform’s own rule."]})]}),e.jsxs(b,{title:"Variants and the hover trap",children:[e.jsxs("p",{children:["A variant styles the ",e.jsx("em",{children:"rest"})," surface — the box when it is unchecked. The checked state deliberately replaces it: the tone owns the on-state fill and border (that is what"," ",e.jsx(t,{children:"peer-checked:bg-{tone}-700"})," is for), so switching variants while the box is checked shows only the decorative differences — the ",e.jsx("code",{children:"elevated"})," shadow, the blur of"," ",e.jsx("code",{children:"glass"})," and ",e.jsx("code",{children:"gradient"}),". The exception is"," ",e.jsx("code",{children:"glass"})," itself: an opaque fill would hide its own frost, so — like Toggle’s glass track — it tints with the tone at a translucent alpha (",e.jsx(t,{children:"peer-checked:bg-{tone}-500/40"}),") and keeps its frost edge. Uncheck the box in the playground to see the rest surfaces apart."]}),e.jsxs("p",{children:["The variants’ hover borders are"," ",e.jsx(t,{children:"peer-hover:border-…"})," rules, which read the"," ",e.jsx("em",{children:"input’s"})," ",e.jsx(t,{children:":hover"})," from a sibling. The invisible input therefore stays pointer-enabled — an ",e.jsx(t,{children:"absolute inset-0"})," ","overlay that declared ",e.jsx(t,{children:"pointer-events-none"})," would have silently deadened every variant’s hover feedback while everything else kept working. The box underneath still hovers too, since"," ",e.jsx(t,{children:"pointer-events-none"})," is not inherited by siblings."]})]}),e.jsx(b,{title:"Internationalization",children:e.jsxs("p",{children:["Checkbox carries no built-in strings to localize — label, description and validation message are all caller text and pass through untouched. The ",e.jsx(t,{children:"required"})," asterisk is ",e.jsx(t,{children:"aria-hidden"}),": screen readers get “required” in the user’s language from the native"," ",e.jsx(t,{children:"required"})," attribute, so the mark never needs translating. Flexbox lays the row out in reading order, so in an RTL document the box lands on the logical end automatically — note that"," ",e.jsx(t,{children:"controlAlign"})," names physical sides, so a deliberate “right” stays right in both directions."]})})]}),e.jsx(te,{props:[{name:"label",type:"ReactNode",description:"Text beside the box, wired as a real `label htmlFor`. Part of the click target."},{name:"description",type:"ReactNode",description:"Secondary copy under or beside the label, attached via `aria-describedby`."},{name:"descriptionPlacement",type:'"bottom" | "inline"',default:'"bottom"',description:"Under the label, or trailing it on the same line."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared xs–xl scale; `md` is a 20px box with `rounded-md` corners, aligned with an `md` input."},{name:"variant",type:"InputVariant",default:'"flat"',description:"Box surface on the shared input scale (`flat`, `elevated`, …), so checkboxes match the fields around them."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Checked fill, dash and focus ring. The fill is `-700` (light) / `-400` (dark) so the white tick clears contrast on every tone."},{name:"color",type:"TrueColor",description:"Alias for `tone`; `tone` wins when both are given."},{name:"indeterminate",type:"boolean",default:"false",description:'Sets the native `indeterminate` property and `aria-checked="mixed"`. Wins over `checked` visually, as on the native control.'},{name:"fullWidth",type:"boolean",default:"false",description:'Stretches the row; with `controlAlign="right"` the box pins to the far end.'},{name:"controlAlign",type:'"left" | "right"',default:'"left"',description:"Which side the box sits on."},{name:"validationStatus",type:'"none" | "error" | "success"',default:'"none"',description:"Tints the border and message like `Input`'s; `error` also sets `aria-invalid`."},{name:"validationMessage",type:"ReactNode",description:"Shown under the row, linked via `aria-describedby`."},{name:"required",type:"boolean",description:'Sets `required` on the input (native form validation, announced as "required") and adds an aria-hidden asterisk.'},{name:"className",type:"string",description:"Applied to the row wrapper."},{name:"inputClassName",type:"string",description:"Applied to the visible box, not to the (invisible) input."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Everything else — ",e.jsx(t,{children:"checked"}),", ",e.jsx(t,{children:"defaultChecked"}),", ",e.jsx(t,{children:"onChange"}),","," ",e.jsx(t,{children:"disabled"}),", ",e.jsx(t,{children:"name"}),", ",e.jsx(t,{children:"value"}),", ",e.jsx(t,{children:"id"}),", aria attributes — spreads straight through to the native input, so the uncontrolled/ controlled split, form participation and every reader hint work exactly as they do on a plain checkbox."]})]});export{Re as CheckboxPage,Re as default};
