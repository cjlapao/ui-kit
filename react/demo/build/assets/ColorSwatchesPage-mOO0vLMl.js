import{r as t,j as e,C as s}from"./index-B9JeX19j.js";import{P as S}from"./PageHeader-D-LFwZLT.js";import{E as a}from"./ExampleCard-BwESxlwz.js";import{P as N,S as m,C as f,T as c}from"./PlaygroundPanel-CZvYEX_V.js";import{C as y}from"./ControlAccordion-rp4gabXb.js";import{d as O,f as E}from"./options-Blq0niUd.js";const T=[{value:"click",label:"Click"},{value:"hover",label:"Hover"}],z=[{value:"3",label:"3"},{value:"4",label:"4"},{value:"5",label:"5"},{value:"8",label:"8"}],P=()=>{const[o,l]=t.useState("lg"),[h,w]=t.useState("none"),[r,g]=t.useState("click"),[x,b]=t.useState(5),[u,j]=t.useState(!1),[i,v]=t.useState(!1),[d,k]=t.useState(!1),[p,C]=t.useState("blue");return e.jsx(N,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(y,{groups:[{id:"surface",title:"Surface",controls:e.jsxs(e.Fragment,{children:[e.jsx(m,{label:"Size",options:O,value:o,onChange:n=>l(n)}),e.jsx(m,{label:"Padding",options:E,value:h,onChange:n=>w(n)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsxs(e.Fragment,{children:[e.jsx(f,{label:"Expand on",options:T,value:r,onChange:n=>g(n)}),e.jsx(f,{label:"Max visible",options:z,value:String(x),onChange:n=>b(Number(n))}),e.jsx(c,{label:"showNames",checked:u,onChange:j}),e.jsx(c,{label:"defaultExpanded",checked:i,onChange:v}),e.jsx(c,{label:"selectable",checked:d,onChange:k}),d&&e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Chosen: ",e.jsx("code",{children:p})]})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Twenty-one tones in one row would shout; condensed, they overlap behind a ",e.jsx("code",{children:"+N"})," and expand on demand. Resize the window — a strip too narrow for its dots condenses on its own."]})]}),preview:e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"TrueColors"}),e.jsx(s,{size:o,padding:h,expandOn:r,maxVisible:x,showNames:u,defaultExpanded:i,selectable:d,value:p,onSelect:C},`${r}-${i}`)]})})};function V(){return e.jsx(s,{size:"lg",showNames:!0})}const H=`import { ColorSwatches } from "@cjlapao/ui-kit";

/**
 * All twenty-one tones of the theme, at a size worth seeing, with names
 * under the dots — the palette as the page it deserves to have.
 */
export default function TrueColors() {
  return <ColorSwatches size="lg" showNames />;
}
`;function A(){return e.jsx("div",{className:"w-full max-w-52 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800",children:e.jsx(s,{size:"lg",maxVisible:4})})}const I=`import { ColorSwatches } from "@cjlapao/ui-kit";

/**
 * Twenty-one tones in four dots' worth of room: condensed into an
 * overlapping stack with the rest behind a \`+17\`. Click it — the strip
 * keeps its width and grows downward, dots popping in left to right.
 */
export default function Condensed() {
  return (
    <div className="w-full max-w-52 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <ColorSwatches size="lg" maxVisible={4} />
    </div>
  );
}
`;function M(){return e.jsxs("div",{className:"mx-auto w-full max-w-xs rounded-lg border border-neutral-200 p-4 dark:border-neutral-800",children:[e.jsx("div",{className:"mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400",children:"Theme palette — hover me"}),e.jsx(s,{size:"lg",maxVisible:6,expandOn:"hover",showNames:!0})]})}const R=`import { ColorSwatches } from "@cjlapao/ui-kit";

/**
 * \`expandOn="hover"\` for places with room to grow — the strip opens as the
 * pointer enters it and folds back when it leaves, so it stays a glanceable
 * colour ribbon until someone reaches for it. The chip still works, for
 * keyboards and touch.
 */
export default function ExpandOnHover() {
  return (
    <div className="mx-auto w-full max-w-xs rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
      <div className="mb-2 font-mono text-xs font-medium uppercase tracking-tight text-neutral-500 dark:text-neutral-400">
        Theme palette — hover me
      </div>
      <ColorSwatches size="lg" maxVisible={6} expandOn="hover" showNames />
    </div>
  );
}
`;function _(){const[o,l]=t.useState("blue");return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx(s,{selectable:!0,value:o,onSelect:l}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["Selected: ",e.jsx("code",{className:"font-mono",children:o})]})]})}const D=`import { useState } from "react";
import { ColorSwatches, type TrueColor } from "@cjlapao/ui-kit";

/**
 * The strip as a tone picker: \`selectable\` turns the dots into buttons, the
 * chosen one carries a ring, and \`onSelect\` reports the tone — a picker that
 * shows the palette instead of hiding it behind a dropdown.
 */
export default function Selectable() {
  const [tone, setTone] = useState<TrueColor>("blue");
  return (
    <div className="flex w-full flex-col gap-3">
      <ColorSwatches selectable value={tone} onSelect={setTone} />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Selected: <code className="font-mono">{tone}</code>
      </p>
    </div>
  );
}
`,q=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(S,{name:"Color Swatches",description:"Colours on display: a strip of dots for the theme's tones, condensed into an overlapping stack behind a +N chip when the count (or the container width) outgrows the row, and expanded — height first, dots popping in left to right — into the full palette. Made selectable, the same strip is a tone picker: buttons with a ring on the chosen dot, which is how the playgrounds ask for a tone."}),e.jsx(P,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"True Colors",description:"Every tone, sized to be seen, names revealed with the expansion.",code:H,filename:"TrueColors.tsx",children:e.jsx(V,{})}),e.jsx(a,{title:"Condensed",description:"Four dots and a +17: the whole palette keeping one line until the chip is clicked.",code:I,filename:"Condensed.tsx",children:e.jsx(A,{})}),e.jsx(a,{title:"Expand On Hover",description:'expandOn="hover" for strips with room around them — opened by the pointer, folded by its leaving, chip still there for keyboard and touch.',code:R,filename:"ExpandOnHover.tsx",children:e.jsx(M,{})}),e.jsx(a,{title:"Selectable",description:"selectable turns the strip into a tone picker: the dots become buttons, the chosen one carries a ring, and onSelect reports the tone — the same swatch language the playgrounds use for tone.",code:D,filename:"Selectable.tsx",children:e.jsx(_,{})})]}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"API"}),e.jsx("div",{className:"max-w-3xl text-sm leading-6 text-neutral-500 dark:text-neutral-400",children:e.jsxs("p",{children:["Props are ",e.jsx("code",{children:"colors"})," (defaults to the kit's"," ",e.jsx("code",{children:"TRUE_COLORS"})," — zero props shows the whole palette),"," ",e.jsx("code",{children:"size"})," on the shared control scale, ",e.jsx("code",{children:"padding"})," ","on the container one, ",e.jsx("code",{children:"maxVisible"}),", ",e.jsx("code",{children:"expandOn"})," ","(",e.jsx("code",{children:"click"})," / ",e.jsx("code",{children:"hover"}),"), ",e.jsx("code",{children:"defaultExpanded"}),","," ",e.jsx("code",{children:"shape"})," and ",e.jsx("code",{children:"showNames"}),"; plus"," ",e.jsx("code",{children:"selectable"})," with ",e.jsx("code",{children:"value"})," / ",e.jsx("code",{children:"onSelect"})," ","to pick a tone. Everything else lands on the root. Condensing has two triggers — too many dots for"," ",e.jsx("code",{children:"maxVisible"}),", or a measured row too narrow for them. Expansion is one layout unfolding: the same container clipped to a single line opens to its measured height while the stacked dots spread apart, the rest pop in one by one, and the labels fade up — nothing replaces anything, and the whole set stays in the DOM either way: screen readers read every colour whether or not"," ",e.jsx("em",{children:"you"})," have clicked yet."]})})]})]});export{q as ColorSwatchesPage,q as default};
