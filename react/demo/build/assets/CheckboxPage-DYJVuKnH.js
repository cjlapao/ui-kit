import{r as n,j as e,P as U,n as l,M as C,I as k,o as F,l as G}from"./index-8i9ZNynb.js";import{P as Z}from"./PageHeader-CO5k_SQv.js";import{E as c}from"./ExampleCard-LdxcpmX_.js";import{P as Y,S as j,C as r,T as i}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as J}from"./ControlAccordion-Bqp-1oBj.js";import{t as K,n as Q,x as X,y as ee,z as te,A as ne}from"./options-yAU-f7tt.js";const se=()=>{const[s,h]=n.useState("md"),[a,o]=n.useState("blue"),[d,p]=n.useState("flat"),[x,b]=n.useState("left"),[v,I]=n.useState("bottom"),[u,R]=n.useState("none"),[S,P]=n.useState("This field is required"),[w,V]=n.useState("Accept the terms"),[N,W]=n.useState("You can withdraw consent at any time."),[y,H]=n.useState(!0),[E,q]=n.useState(!0),[O,T]=n.useState(!0),[A,f]=n.useState(!1),[D,B]=n.useState(!1),[L,_]=n.useState(!1),[z,$]=n.useState(!1),[g,M]=n.useState(!1);return e.jsx(Y,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(J,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Tone",options:K,value:a,onChange:t=>o(t)}),e.jsx(r,{label:"Size",children:e.jsx(C,{fullWidth:!0,size:"sm",options:Q,value:s,onChange:t=>h(t)})}),e.jsx(j,{label:"Variant",options:X,value:d,onChange:t=>p(t)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(r,{label:"Control side",children:e.jsx(C,{fullWidth:!0,size:"sm",options:ee,value:x,onChange:t=>b(t)})}),e.jsx(r,{label:"Description",children:e.jsx(C,{fullWidth:!0,size:"sm",options:te,value:v,onChange:t=>I(t)})})]})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Label",children:e.jsx(k,{size:"sm",value:w,onChange:t=>V(t.target.value)})}),e.jsx(r,{label:"Description text",children:e.jsx(k,{size:"sm",value:N,onChange:t=>W(t.target.value)})})]})},{id:"validation",title:"Validation",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(j,{label:"Validation",options:ne,value:u,onChange:t=>R(t)}),e.jsx(r,{label:"Validation message",children:e.jsx(k,{size:"sm",value:S,disabled:u==="none",onChange:t=>P(t.target.value)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Checked",checked:O,onChange:t=>{T(t),f(!1)}}),e.jsx(i,{label:"Indeterminate",checked:A,onChange:f}),e.jsx(i,{label:"Label",checked:y,onChange:H}),e.jsx(i,{label:"Description",checked:E,onChange:q}),e.jsx(i,{label:"Required",checked:D,onChange:B}),e.jsx(i,{label:"Disabled",checked:L,onChange:_}),e.jsx(i,{label:"Full width",checked:z,onChange:$}),e.jsx(i,{label:"On a glass panel",checked:g,onChange:M})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Indeterminate"})," wins over checked, as it does on the native control, and is announced as"," ",e.jsx("code",{children:'aria-checked="mixed"'}),". The checked fill steps to"," ",e.jsx("code",{children:"-700"})," in light and ",e.jsx("code",{children:"-400"})," in dark so the tick clears WCAG contrast on every tone."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(U,{variant:g?"liquid-glass":"outlined",tone:g?a:"neutral",padding:"md",children:e.jsx(l,{size:s,color:a,variant:d,controlAlign:x,descriptionPlacement:v,label:y?w:void 0,description:E?N:void 0,checked:O,indeterminate:A,required:D,fullWidth:z,disabled:L,validationStatus:u,validationMessage:u==="none"?void 0:S,onChange:t=>{T(t.target.checked),f(!1)}})})})})};function le(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"Accept the terms and conditions",defaultChecked:!0}),e.jsx(l,{color:"blue",label:"Subscribe to the newsletter"})]})}const ae=`import { Checkbox } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Accept the terms and conditions" defaultChecked />
      <Checkbox color="blue" label="Subscribe to the newsletter" />
    </div>
  );
}
`;function ie(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(l,{color:"blue",label:"Two-factor authentication",description:"Adds a second step when signing in from a new device."}),e.jsx(l,{color:"emerald",label:"Public profile",description:"Other members can find you by name.",descriptionPlacement:"inline",defaultChecked:!0})]})}const oe=`import { Checkbox } from "@cjlapao/ui-kit";

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
`,m=["Containers","Images","Volumes"];function ce(){const[s,h]=n.useState([!0,!1,!1]),a=s.filter(Boolean).length;return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"All resources",description:`${a} of ${m.length} selected`,checked:a===m.length,indeterminate:a>0&&a<m.length,onChange:o=>h(s.map(()=>o.target.checked))}),e.jsx("div",{className:"ml-6 flex flex-col gap-2",children:m.map((o,d)=>e.jsx(l,{color:"blue",label:o,checked:s[d],onChange:p=>h(s.map((x,b)=>b===d?p.target.checked:x))},o))})]})}const re=`import { useState } from "react";
import { Checkbox } from "@cjlapao/ui-kit";

const CHILDREN = ["Containers", "Images", "Volumes"];

export default function SelectAll() {
  const [items, setItems] = useState([true, false, false]);
  const checkedCount = items.filter(Boolean).length;

  return (
    <div className="flex flex-col gap-3">
      <Checkbox
        color="blue"
        label="All resources"
        description={\`\${checkedCount} of \${CHILDREN.length} selected\`}
        checked={checkedCount === CHILDREN.length}
        indeterminate={checkedCount > 0 && checkedCount < CHILDREN.length}
        onChange={(event) =>
          setItems(items.map(() => event.target.checked))
        }
      />
      <div className="ml-6 flex flex-col gap-2">
        {CHILDREN.map((label, index) => (
          <Checkbox
            key={label}
            color="blue"
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
`;function de(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"Checked and disabled",defaultChecked:!0,disabled:!0}),e.jsx(l,{color:"blue",label:"Unchecked and disabled",disabled:!0}),e.jsx(l,{color:"blue",label:"Some items selected",indeterminate:!0})]})}const he=`import { Checkbox } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Checked and disabled" defaultChecked disabled />
      <Checkbox color="blue" label="Unchecked and disabled" disabled />
      <Checkbox color="blue" label="Some items selected" indeterminate />
    </div>
  );
}
`;function xe(){return e.jsx("div",{className:"flex flex-col gap-3",children:F.map(s=>e.jsx(l,{color:"blue",size:s,defaultChecked:!0,label:`Size ${s}`,description:"The box sits on the label's cap height at every step."},s))})}const ue=`import { Checkbox, CONTROL_SIZES } from "@cjlapao/ui-kit";

export default function SizeLadder() {
  return (
    <div className="flex flex-col gap-3">
      {CONTROL_SIZES.map((each) => (
        <Checkbox
          key={each}
          color="blue"
          size={each}
          defaultChecked
          label={\`Size \${each}\`}
          description="The box sits on the label's cap height at every step."
        />
      ))}
    </div>
  );
}
`;function me(){return e.jsx("div",{className:"grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3",children:G.map(s=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(l,{color:s,defaultChecked:!0,label:s}),e.jsx(l,{color:s,indeterminate:!0})]},s))})}const pe=`import { Checkbox, TRUE_COLORS } from "@cjlapao/ui-kit";

export default function EveryTone() {
  return (
    <div className="grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3">
      {TRUE_COLORS.map((each) => (
        <div key={each} className="flex items-center gap-4">
          <Checkbox color={each} defaultChecked label={each} />
          <Checkbox color={each} indeterminate />
        </div>
      ))}
    </div>
  );
}
`,ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Z,{name:"Checkbox",description:"A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation."}),e.jsx(se,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Basic",description:"A row of options, each an independent checkbox.",code:ae,filename:"Basic.tsx",children:e.jsx(le,{})}),e.jsx(c,{title:"With description",description:"Explain the consequence of the choice right where the decision is made.",code:oe,filename:"WithDescription.tsx",children:e.jsx(ie,{})}),e.jsx(c,{title:"Select all",description:"A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked.",code:re,filename:"SelectAll.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"States",description:"Disabled rows keep their state visible; indeterminate marks a parent with mixed children.",code:he,filename:"States.tsx",children:e.jsx(de,{})}),e.jsx(c,{title:"Size ladder",description:"The shared xs–xl scale — the box sits on the label's cap height at every step.",code:ue,filename:"SizeLadder.tsx",children:e.jsx(xe,{})}),e.jsx(c,{title:"Every tone",description:"All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes.",code:pe,filename:"EveryTone.tsx",children:e.jsx(me,{})})]})]});export{ve as CheckboxPage,ve as default};
