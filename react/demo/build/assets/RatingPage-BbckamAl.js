import{r as a,j as e,P as F,C as q,i as c,cq as n}from"./index-gt012o8E.js";import{P as D,A as G,a as p,C as i}from"./A11ySections-zw3_3X-2.js";import{P as $}from"./PageHeader-CzVhyXQL.js";import{E as r}from"./ExampleCard-V3REeYJ5.js";import{P as U,C as j,a as K,T as o}from"./PlaygroundPanel-Czrs7oXC.js";import{C as M}from"./ControlAccordion-DIXHht2n.js";import{u as W,E as Z}from"./EventLog-Dx0vbma4.js";import{d as J,Z as Q}from"./options-CtADNKbm.js";const X=[{label:"5",value:"5"},{label:"10",value:"10"}],V=t=>t%1===0?String(t):t.toFixed(1),Y=()=>{const[t,l]=a.useState(5),[d,u]=a.useState("md"),[f,I]=a.useState("amber"),[v,z]=a.useState("horizontal"),[g,H]=a.useState(!1),[y,O]=a.useState(!1),[b,T]=a.useState(!1),[C,E]=a.useState(!1),[k,w]=a.useState(!1),[x,P]=a.useState(!1),[m,h]=a.useState(3),[A,B]=W(),L=s=>{h(s),B(`${V(s)} of ${t}`)},N=e.jsx(n,{stars:t,size:d,tone:f,orientation:v,allowHalf:g,readOnly:y,disabled:b,invalid:C,value:m,onChange:L,ariaLabel:"Playground rating"});return e.jsx(U,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(M,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Stars",options:X,value:String(t),onChange:s=>l(Number(s))}),e.jsx(j,{label:"Size",options:J,value:d,onChange:s=>u(s)}),e.jsx(j,{label:"Orientation",options:Q,value:v,onChange:s=>z(s)}),e.jsx(K,{label:"Tone",children:e.jsx(q,{selectable:!0,size:"sm",value:f,onSelect:I,defaultExpanded:!0})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Half stars",checked:g,onChange:H}),e.jsx(o,{label:"Read only",checked:y,onChange:O}),e.jsx(o,{label:"Disabled",checked:b,onChange:T}),e.jsx(o,{label:"Invalid",checked:C,onChange:E}),e.jsx(o,{label:"In a panel",checked:k,onChange:w}),e.jsx(o,{label:"On a glass panel",checked:x,onChange:s=>{P(s),s&&w(!0)}})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Every star (or half star) is a real ",e.jsx("strong",{children:"radio"})," — Tab lands on the current value and the arrow keys move it natively, because it is a native radio group, not a simulation. Hover only previews; nothing is committed until a click or Space."]}),e.jsx(Z,{log:A,emptyText:"No events yet — pick a star."})]}),preview:e.jsx("div",{className:"w-full",children:k?e.jsx(F,{corner:"none",variant:x?"liquid-glass":"outlined",tone:x?f:"neutral",padding:"md",scrollable:!1,children:e.jsx(S,{value:m,starCount:t,onReset:()=>h(3),children:N})}):e.jsx(S,{value:m,starCount:t,onReset:()=>h(3),children:N})})})},S=({value:t,starCount:l,onReset:d,children:u})=>e.jsxs("div",{className:"flex w-full flex-col items-center gap-3 py-2",children:[u,e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsxs("strong",{className:"text-neutral-900 dark:text-neutral-100",children:[t?V(t):"—"," / ",l]})]}),e.jsx(c,{variant:"soft",size:"sm",onClick:d,children:"Reset"})]})]});function _(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3})})}const ee=`import { Rating } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3} />
    </div>
  );
}
`;function te(){return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Full stars"}),e.jsx(n,{defaultValue:3})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Half stars"}),e.jsx(n,{defaultValue:3.5,allowHalf:!0})]})]})}const ae=`import { Rating } from "@cjlapao/ui-kit";

export default function HalfStars() {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Full stars
        </span>
        <Rating defaultValue={3} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Half stars
        </span>
        <Rating defaultValue={3.5} allowHalf />
      </div>
    </div>
  );
}
`;function ne(){const[t,l]=a.useState(4);return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-6",children:[e.jsx(n,{value:t,allowHalf:!0,onChange:l}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(c,{variant:"outline",size:"sm",onClick:()=>l(2.5),children:"2.5"}),e.jsx(c,{variant:"outline",size:"sm",onClick:()=>l(3),children:"3"}),e.jsx(c,{variant:"outline",size:"sm",onClick:()=>l(3.5),children:"3.5"})]})]})}const se=`import { useState } from "react";
import { Button, Rating } from "@cjlapao/ui-kit";

export default function Controlled() {
  const [value, setValue] = useState(4);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <Rating value={value} allowHalf onChange={setValue} />
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => setValue(2.5)}>
          2.5
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(3)}>
          3
        </Button>
        <Button variant="outline" size="sm" onClick={() => setValue(3.5)}>
          3.5
        </Button>
      </div>
    </div>
  );
}
`;function le(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{stars:10,defaultValue:6})})}const ie=`import { Rating } from "@cjlapao/ui-kit";

export default function StarCount() {
  return (
    <div className="flex justify-center">
      <Rating stars={10} defaultValue={6} />
    </div>
  );
}
`;function re(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{orientation:"vertical",defaultValue:3})})}const oe=`import { Rating } from "@cjlapao/ui-kit";

export default function Vertical() {
  return (
    <div className="flex justify-center">
      <Rating orientation="vertical" defaultValue={3} />
    </div>
  );
}
`;function ce(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{onIcon:"Praise",offIcon:"Praise",defaultValue:3})})}const de=`import { Rating } from "@cjlapao/ui-kit";

export default function CustomIcons() {
  return (
    <div className="flex justify-center">
      <Rating onIcon="Praise" offIcon="Praise" defaultValue={3} />
    </div>
  );
}
`,R=["😡","😕","😐","🙂","😍"];function ue(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{size:"lg",defaultValue:3,onIcon:t=>e.jsx("span",{className:"flex items-center justify-center text-2xl",children:R[t-1]}),offIcon:t=>e.jsx("span",{className:"flex items-center justify-center text-2xl opacity-40 grayscale",children:R[t-1]})})})}const fe=`import { Rating } from "@cjlapao/ui-kit";

const FACES = ["😡", "😕", "😐", "🙂", "😍"];

export default function Emoji() {
  return (
    <div className="flex justify-center">
      <Rating
        size="lg"
        defaultValue={3}
        onIcon={(index) => (
          <span className="flex items-center justify-center text-2xl">
            {FACES[index - 1]}
          </span>
        )}
        offIcon={(index) => (
          <span className="flex items-center justify-center text-2xl opacity-40 grayscale">
            {FACES[index - 1]}
          </span>
        )}
      />
    </div>
  );
}
`;function xe(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3.5,allowHalf:!0,readOnly:!0})})}const me=`import { Rating } from "@cjlapao/ui-kit";

export default function ReadOnly() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3.5} allowHalf readOnly />
    </div>
  );
}
`;function he(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3,disabled:!0})})}const pe=`import { Rating } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3} disabled />
    </div>
  );
}
`;function je(){const[t,l]=a.useState(0);return e.jsxs("div",{className:"flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-xl font-bold text-neutral-900 dark:text-neutral-50",children:"Glad I could help!"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-500 dark:text-neutral-400",children:"How would you rate this conversation?"})]}),e.jsx(n,{size:"lg",value:t,onChange:l,ariaLabel:"Rate this conversation"}),e.jsxs("div",{className:"flex w-full items-center justify-between text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{children:t?`${t} / 5`:"No rating yet"}),e.jsx(c,{variant:"link",size:"sm",disabled:!t,children:"Submit"})]})]})}const ve=`import { useState } from "react";
import { Button, Rating } from "@cjlapao/ui-kit";

export default function Sample() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60">
      <div className="text-center">
        <div className="text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Glad I could help!
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          How would you rate this conversation?
        </p>
      </div>
      <Rating
        size="lg"
        value={value}
        onChange={setValue}
        ariaLabel="Rate this conversation"
      />
      <div className="flex w-full items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
        <span>{value ? \`\${value} / 5\` : "No rating yet"}</span>
        <Button variant="link" size="sm" disabled={!value}>
          Submit
        </Button>
      </div>
    </div>
  );
}
`,Re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx($,{name:"Rating",description:"Star-based selection — typed or clicked, with half stars, hover preview, tones, sizes, vertical layout and custom icons."}),e.jsx(Y,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"Uncontrolled, with the value set by `defaultValue`. Clicking a star updates the rating and the stars ahead of it light up.",code:ee,filename:"Basic.tsx",children:e.jsx(_,{})}),e.jsx(r,{title:"Half Stars",description:"`allowHalf` splits every star into two half values, so a rating can land on 2.5 or 3.5.",code:ae,filename:"HalfStars.tsx",children:e.jsx(te,{})}),e.jsx(r,{title:"Controlled",description:"Drive the rating from your own state — the buttons snap it to exact values and `onChange` follows along.",code:se,filename:"Controlled.tsx",children:e.jsx(ne,{})}),e.jsx(r,{title:"Star Count",description:"The number of stars to display is set with `stars`.",code:ie,filename:"StarCount.tsx",children:e.jsx(le,{})}),e.jsx(r,{title:"Vertical",description:'orientation="vertical" stacks the stars for tight side-by-side layouts.',code:oe,filename:"Vertical.tsx",children:e.jsx(re,{})}),e.jsx(r,{title:"Custom Icons",description:"`onIcon` and `offIcon` swap the star for any registry icon, element or per-position function.",code:de,filename:"CustomIcons.tsx",children:e.jsx(ce,{})}),e.jsx(r,{title:"Emoji",description:"A function icon computes each star's content from its index — lit faces in full colour, unlit ones dimmed and greyed.",code:fe,filename:"Emoji.tsx",children:e.jsx(ue,{})}),e.jsx(r,{title:"Read Only",description:"`readOnly` shows the value as a non-interactive display — the stars leave the tab order and cannot be changed.",code:me,filename:"ReadOnly.tsx",children:e.jsx(xe,{})}),e.jsx(r,{title:"Disabled",description:"`disabled` freezes the rating — the existing value stays visible but untouchable.",code:pe,filename:"Disabled.tsx",children:e.jsx(he,{})}),e.jsx(r,{title:"Sample",description:"A support sign-off: the value readout and submit action unlock only once a rating is given.",code:ve,filename:"Sample.tsx",children:e.jsx(je,{})})]}),e.jsx(D,{props:[{name:"value / defaultValue",type:"number | null",description:"The rating — controlled and uncontrolled as on a native field. `null` or `0` leaves every star unlit."},{name:"onChange",type:"(value: number) => void",description:"Fires when a star (or half star) is picked."},{name:"stars",type:"number",default:"5",description:"Star count, clamped to 1–15 so a typo cannot render a wall."},{name:"allowHalf",type:"boolean",default:"false",description:"Splits every star into two radios — the value can land on 2.5 or 3.5. Hover previews the nearer half."},{name:"name",type:"string",description:"Name shared by the radio inputs, which is what gives the group its native keyboard behaviour. Unique per rating; generated when omitted."},{name:"orientation",type:"Orientation",default:'"horizontal"',description:"The shared orientation family; vertical stacks the stars."},{name:"onIcon / offIcon",type:"RatingIcon",default:'"Star" / "Star"',description:"A registry name, a ready element, or a function computed per star — the emoji ladder is just that function."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale, driving the icon square and gap."},{name:"tone",type:"TrueColor",default:'"amber"',description:"Lit-star colour — every tone through the shared map, `amber` kept as the default by product convention (a blue star reads as &ldquo;favourited&rdquo;, not &ldquo;rated&rdquo;)."},{name:"invalid / disabled / readOnly",type:"boolean",default:"false",description:"`invalid` paints the lit stars with the error colour; `readOnly` keeps the value announced (`aria-readonly`) but out of the tab order."},{name:"ariaLabel",type:"string",default:'"Rating" (`kit.rating.label`)',description:"Names the radiogroup."},{name:"className / ref",type:"string / Ref<HTMLDivElement>",description:"Land on the group."}]}),e.jsxs(G,{children:[e.jsx(p,{title:"Screen reader",children:e.jsxs("p",{children:["A real ",e.jsx(i,{children:'role="radiogroup"'})," of real radios — each star (or half star) is an ",e.jsx(i,{children:'input[type="radio"]'})," named through the catalog (",e.jsx("em",{children:"“3 stars”"}),", ",e.jsx("em",{children:"“2.5 stars”"}),"), so state and value are the browser’s own, not a WAI-ARIA impression of them. The icon spans are decoration. ",e.jsx(i,{children:"readOnly"})," sets"," ",e.jsx(i,{children:"aria-readonly"})," on the group while keeping the value announced;"," ",e.jsx(i,{children:"disabled"})," takes the radios out of the tab order natively."]})}),e.jsx(p,{title:"Keyboard support",children:e.jsxs("p",{children:["It’s a native radio group, so the browser provides it: Tab (or Shift+Tab from behind) reaches the group at the current value, arrow keys move the selection — with ",e.jsx(i,{children:"allowHalf"})," each half is a stop — and Space picks. There is no custom keymap to drift out of sync. Hover is preview-only; nothing commits before an actual pick."]})}),e.jsx(p,{title:"Internationalization",children:e.jsxs("p",{children:["The group name (",e.jsx(i,{children:"kit.rating.label"}),") and each radio’s value string (",e.jsx(i,{children:"kit.rating.value"})," — a real ICU plural, so ",e.jsx(i,{children:"1 Stern"})," ","against ",e.jsx(i,{children:"2 Sterne"}),", and half steps ride the decimal through to the ",e.jsx("em",{children:"other"})," category) ride the catalog in five locales. The tone is themeable but the grammar is not hardcoded anywhere."]})})]})]});export{Re as RatingPage,Re as default};
