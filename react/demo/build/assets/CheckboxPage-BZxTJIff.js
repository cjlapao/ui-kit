import{r as t,j as e,P as U,m as l,M as C,I as k,n as F,k as G}from"./index-B-ieYLXc.js";import{P as Z,S as j,C as c,T as i,a as Y,E as r}from"./PlaygroundPanel-CkWfNJii.js";import{t as J,n as K,w as Q,x as X,y as ee,z as ne}from"./options-C8y5quvx.js";const te=()=>{const[s,h]=t.useState("md"),[a,o]=t.useState("blue"),[d,p]=t.useState("flat"),[x,b]=t.useState("left"),[v,A]=t.useState("bottom"),[u,R]=t.useState("none"),[S,P]=t.useState("This field is required"),[w,V]=t.useState("Accept the terms"),[N,W]=t.useState("You can withdraw consent at any time."),[y,H]=t.useState(!0),[E,q]=t.useState(!0),[O,T]=t.useState(!0),[D,f]=t.useState(!1),[L,B]=t.useState(!1),[z,_]=t.useState(!1),[I,$]=t.useState(!1),[g,M]=t.useState(!1);return e.jsx(Z,{controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Tone",options:J,value:a,onChange:n=>o(n)}),e.jsx(c,{label:"Size",children:e.jsx(C,{fullWidth:!0,size:"sm",options:K,value:s,onChange:n=>h(n)})}),e.jsx(j,{label:"Variant",options:Q,value:d,onChange:n=>p(n)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(c,{label:"Control side",children:e.jsx(C,{fullWidth:!0,size:"sm",options:X,value:x,onChange:n=>b(n)})}),e.jsx(c,{label:"Description",children:e.jsx(C,{fullWidth:!0,size:"sm",options:ee,value:v,onChange:n=>A(n)})})]}),e.jsx(c,{label:"Label",children:e.jsx(k,{size:"sm",value:w,onChange:n=>V(n.target.value)})}),e.jsx(c,{label:"Description text",children:e.jsx(k,{size:"sm",value:N,onChange:n=>W(n.target.value)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(j,{label:"Validation",options:ne,value:u,onChange:n=>R(n)}),e.jsx(c,{label:"Validation message",children:e.jsx(k,{size:"sm",value:S,disabled:u==="none",onChange:n=>P(n.target.value)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Checked",checked:O,onChange:n=>{T(n),f(!1)}}),e.jsx(i,{label:"Indeterminate",checked:D,onChange:f}),e.jsx(i,{label:"Label",checked:y,onChange:H}),e.jsx(i,{label:"Description",checked:E,onChange:q}),e.jsx(i,{label:"Required",checked:L,onChange:B}),e.jsx(i,{label:"Disabled",checked:z,onChange:_}),e.jsx(i,{label:"Full width",checked:I,onChange:$}),e.jsx(i,{label:"On a glass panel",checked:g,onChange:M})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Indeterminate"})," wins over checked, as it does on the native control, and is announced as"," ",e.jsx("code",{children:'aria-checked="mixed"'}),". The checked fill steps to"," ",e.jsx("code",{children:"-700"})," in light and ",e.jsx("code",{children:"-400"})," in dark so the tick clears WCAG contrast on every tone."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(U,{variant:g?"liquid-glass":"outlined",tone:g?a:"neutral",padding:"md",children:e.jsx(l,{size:s,color:a,variant:d,controlAlign:x,descriptionPlacement:v,label:y?w:void 0,description:E?N:void 0,checked:O,indeterminate:D,required:L,fullWidth:I,disabled:z,validationStatus:u,validationMessage:u==="none"?void 0:S,onChange:n=>{T(n.target.checked),f(!1)}})})})})};function se(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"Accept the terms and conditions",defaultChecked:!0}),e.jsx(l,{color:"blue",label:"Subscribe to the newsletter"})]})}const le=`import { Checkbox } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Accept the terms and conditions" defaultChecked />
      <Checkbox color="blue" label="Subscribe to the newsletter" />
    </div>
  );
}
`;function ae(){return e.jsxs("div",{className:"flex w-full max-w-sm flex-col gap-4",children:[e.jsx(l,{color:"blue",label:"Two-factor authentication",description:"Adds a second step when signing in from a new device."}),e.jsx(l,{color:"emerald",label:"Public profile",description:"Other members can find you by name.",descriptionPlacement:"inline",defaultChecked:!0})]})}const ie=`import { Checkbox } from "@cjlapao/ui-kit";

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
`,m=["Containers","Images","Volumes"];function oe(){const[s,h]=t.useState([!0,!1,!1]),a=s.filter(Boolean).length;return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"All resources",description:`${a} of ${m.length} selected`,checked:a===m.length,indeterminate:a>0&&a<m.length,onChange:o=>h(s.map(()=>o.target.checked))}),e.jsx("div",{className:"ml-6 flex flex-col gap-2",children:m.map((o,d)=>e.jsx(l,{color:"blue",label:o,checked:s[d],onChange:p=>h(s.map((x,b)=>b===d?p.target.checked:x))},o))})]})}const ce=`import { useState } from "react";
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
`;function re(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(l,{color:"blue",label:"Checked and disabled",defaultChecked:!0,disabled:!0}),e.jsx(l,{color:"blue",label:"Unchecked and disabled",disabled:!0}),e.jsx(l,{color:"blue",label:"Some items selected",indeterminate:!0})]})}const de=`import { Checkbox } from "@cjlapao/ui-kit";

export default function States() {
  return (
    <div className="flex flex-col gap-3">
      <Checkbox color="blue" label="Checked and disabled" defaultChecked disabled />
      <Checkbox color="blue" label="Unchecked and disabled" disabled />
      <Checkbox color="blue" label="Some items selected" indeterminate />
    </div>
  );
}
`;function he(){return e.jsx("div",{className:"flex flex-col gap-3",children:F.map(s=>e.jsx(l,{color:"blue",size:s,defaultChecked:!0,label:`Size ${s}`,description:"The box sits on the label's cap height at every step."},s))})}const xe=`import { Checkbox, CONTROL_SIZES } from "@cjlapao/ui-kit";

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
`;function ue(){return e.jsx("div",{className:"grid gap-x-6 gap-y-2 md:grid-cols-2 xl:grid-cols-3",children:G.map(s=>e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(l,{color:s,defaultChecked:!0,label:s}),e.jsx(l,{color:s,indeterminate:!0})]},s))})}const me=`import { Checkbox, TRUE_COLORS } from "@cjlapao/ui-kit";

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
`,ge=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Checkbox",description:"A drawn checkbox — the box, tick and dash are the kit's own, so they follow the tone in both themes. The native input is still underneath, keeping focus, keyboard behaviour and form participation."}),e.jsx(te,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"A row of options, each an independent checkbox.",code:le,filename:"Basic.tsx",children:e.jsx(se,{})}),e.jsx(r,{title:"With description",description:"Explain the consequence of the choice right where the decision is made.",code:ie,filename:"WithDescription.tsx",children:e.jsx(ae,{})}),e.jsx(r,{title:"Select all",description:"A tri-state parent driving its children — the indeterminate dash appears while some, but not all, are checked.",code:ce,filename:"SelectAll.tsx",children:e.jsx(oe,{})}),e.jsx(r,{title:"States",description:"Disabled rows keep their state visible; indeterminate marks a parent with mixed children.",code:de,filename:"States.tsx",children:e.jsx(re,{})}),e.jsx(r,{title:"Size ladder",description:"The shared xs–xl scale — the box sits on the label's cap height at every step.",code:xe,filename:"SizeLadder.tsx",children:e.jsx(he,{})}),e.jsx(r,{title:"Every tone",description:"All 21 true colours, checked and indeterminate — the tick must stay legible on the fill in both themes.",code:me,filename:"EveryTone.tsx",children:e.jsx(ue,{})})]})]});export{ge as CheckboxPage,ge as default};
