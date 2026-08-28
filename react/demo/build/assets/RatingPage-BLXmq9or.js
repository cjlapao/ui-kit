import{r as s,j as e,Z as n,e as r,M as c}from"./index-Bw7SVFgV.js";import{P as w}from"./PageHeader-CQm-NnZo.js";import{E as a}from"./ExampleCard-BR4461qP.js";import{P as R,C as u,S as V,T as d}from"./PlaygroundPanel-efOYSasM.js";import{C as z}from"./ControlAccordion-BDKCdIsF.js";import{W as H,t as I}from"./options-CREM8uYu.js";const O=[{label:"5",value:"5"},{label:"10",value:"10"}],B=[{label:"Small",value:"sm"},{label:"Medium",value:"md"},{label:"Large",value:"lg"}],E=t=>t%1===0?String(t):t.toFixed(1),P=()=>{const[t,l]=s.useState(5),[x,y]=s.useState("md"),[f,b]=s.useState("amber"),[m,C]=s.useState("horizontal"),[p,N]=s.useState(!1),[j,k]=s.useState(!1),[h,S]=s.useState(!1),[o,v]=s.useState(3);return e.jsx(R,{controls:e.jsx(z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Stars",children:e.jsx(c,{fullWidth:!0,size:"sm",options:O,value:String(t),onChange:i=>l(Number(i))})}),e.jsx(u,{label:"Size",children:e.jsx(c,{fullWidth:!0,size:"sm",options:B,value:x,onChange:i=>y(i)})}),e.jsx(u,{label:"Orientation",children:e.jsx(c,{fullWidth:!0,size:"sm",options:H,value:m,onChange:i=>C(i)})}),e.jsx(V,{label:"Tone",options:I,value:f,onChange:i=>b(i)})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Half stars",checked:p,onChange:N}),e.jsx(d,{label:"Read only",checked:j,onChange:k}),e.jsx(d,{label:"Disabled",checked:h,onChange:S})]})}]}),preview:e.jsxs("div",{className:"flex w-full max-w-md flex-col items-center gap-3",children:[e.jsx(n,{stars:t,size:x,tone:f,orientation:m,allowHalf:p,readOnly:j,disabled:h,value:o,onChange:v,ariaLabel:"Playground rating"}),e.jsxs("div",{className:"flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsxs("span",{children:["Value:"," ",e.jsxs("strong",{className:"text-neutral-900 dark:text-neutral-100",children:[o?E(o):"—"," / ",t]})]}),e.jsx(r,{variant:"soft",size:"sm",onClick:()=>v(3),children:"Reset"})]})]})})};function A(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3})})}const F=`import { Rating } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3} />
    </div>
  );
}
`;function D(){return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Full stars"}),e.jsx(n,{defaultValue:3})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx("span",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Half stars"}),e.jsx(n,{defaultValue:3.5,allowHalf:!0})]})]})}const T=`import { Rating } from "@cjlapao/ui-kit";

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
`;function L(){const[t,l]=s.useState(4);return e.jsxs("div",{className:"flex flex-col items-center justify-center gap-6",children:[e.jsx(n,{value:t,allowHalf:!0,onChange:l}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(r,{variant:"outline",size:"sm",onClick:()=>l(2.5),children:"2.5"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>l(3),children:"3"}),e.jsx(r,{variant:"outline",size:"sm",onClick:()=>l(3.5),children:"3.5"})]})]})}const W=`import { useState } from "react";
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
`;function M(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{stars:10,defaultValue:6})})}const G=`import { Rating } from "@cjlapao/ui-kit";

export default function StarCount() {
  return (
    <div className="flex justify-center">
      <Rating stars={10} defaultValue={6} />
    </div>
  );
}
`;function $(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{orientation:"vertical",defaultValue:3})})}const U=`import { Rating } from "@cjlapao/ui-kit";

export default function Vertical() {
  return (
    <div className="flex justify-center">
      <Rating orientation="vertical" defaultValue={3} />
    </div>
  );
}
`;function Z(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{onIcon:"Praise",offIcon:"Praise",defaultValue:3})})}const q=`import { Rating } from "@cjlapao/ui-kit";

export default function CustomIcons() {
  return (
    <div className="flex justify-center">
      <Rating onIcon="Praise" offIcon="Praise" defaultValue={3} />
    </div>
  );
}
`,g=["😡","😕","😐","🙂","😍"];function J(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{size:"lg",defaultValue:3,onIcon:t=>e.jsx("span",{className:"flex items-center justify-center text-2xl",children:g[t-1]}),offIcon:t=>e.jsx("span",{className:"flex items-center justify-center text-2xl opacity-40 grayscale",children:g[t-1]})})})}const K=`import { Rating } from "@cjlapao/ui-kit";

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
`;function Q(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3.5,allowHalf:!0,readOnly:!0})})}const X=`import { Rating } from "@cjlapao/ui-kit";

export default function ReadOnly() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3.5} allowHalf readOnly />
    </div>
  );
}
`;function Y(){return e.jsx("div",{className:"flex justify-center",children:e.jsx(n,{defaultValue:3,disabled:!0})})}const _=`import { Rating } from "@cjlapao/ui-kit";

export default function Disabled() {
  return (
    <div className="flex justify-center">
      <Rating defaultValue={3} disabled />
    </div>
  );
}
`;function ee(){const[t,l]=s.useState(0);return e.jsxs("div",{className:"flex w-full max-w-sm flex-col items-center gap-5 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800/60",children:[e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"text-xl font-bold text-neutral-900 dark:text-neutral-50",children:"Glad I could help!"}),e.jsx("p",{className:"mt-1 text-sm text-neutral-500 dark:text-neutral-400",children:"How would you rate this conversation?"})]}),e.jsx(n,{size:"lg",value:t,onChange:l,ariaLabel:"Rate this conversation"}),e.jsxs("div",{className:"flex w-full items-center justify-between text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{children:t?`${t} / 5`:"No rating yet"}),e.jsx(r,{variant:"link",size:"sm",disabled:!t,children:"Submit"})]})]})}const te=`import { useState } from "react";
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
`,oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(w,{name:"Rating",description:"Star-based selection — typed or clicked, with half stars, hover preview, tones, sizes, vertical layout and custom icons."}),e.jsx(P,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Basic",description:"Uncontrolled, with the value set by `defaultValue`. Clicking a star updates the rating and the stars ahead of it light up.",code:F,filename:"Basic.tsx",children:e.jsx(A,{})}),e.jsx(a,{title:"Half Stars",description:"`allowHalf` splits every star into two half values, so a rating can land on 2.5 or 3.5.",code:T,filename:"HalfStars.tsx",children:e.jsx(D,{})}),e.jsx(a,{title:"Controlled",description:"Drive the rating from your own state — the buttons snap it to exact values and `onChange` follows along.",code:W,filename:"Controlled.tsx",children:e.jsx(L,{})}),e.jsx(a,{title:"Star Count",description:"The number of stars to display is set with `stars`.",code:G,filename:"StarCount.tsx",children:e.jsx(M,{})}),e.jsx(a,{title:"Vertical",description:'orientation="vertical" stacks the stars for tight side-by-side layouts.',code:U,filename:"Vertical.tsx",children:e.jsx($,{})}),e.jsx(a,{title:"Custom Icons",description:"`onIcon` and `offIcon` swap the star for any registry icon, element or per-position function.",code:q,filename:"CustomIcons.tsx",children:e.jsx(Z,{})}),e.jsx(a,{title:"Emoji",description:"A function icon computes each star's content from its index — lit faces in full colour, unlit ones dimmed and greyed.",code:K,filename:"Emoji.tsx",children:e.jsx(J,{})}),e.jsx(a,{title:"Read Only",description:"`readOnly` shows the value as a non-interactive display — the stars leave the tab order and cannot be changed.",code:X,filename:"ReadOnly.tsx",children:e.jsx(Q,{})}),e.jsx(a,{title:"Disabled",description:"`disabled` freezes the rating — the existing value stays visible but untouchable.",code:_,filename:"Disabled.tsx",children:e.jsx(Y,{})}),e.jsx(a,{title:"Sample",description:"A support sign-off: the value readout and submit action unlock only once a rating is given.",code:te,filename:"Sample.tsx",children:e.jsx(ee,{})})]})]});export{oe as RatingPage,oe as default};
