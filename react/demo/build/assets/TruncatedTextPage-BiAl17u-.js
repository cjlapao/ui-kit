import{r as o,j as e,br as n}from"./index-p9Bv1Pn1.js";import{P as u}from"./PageHeader-DCZtzAyX.js";import{E as p}from"./ExampleCard-BS13YSEO.js";import{P as x,S as l,C as h}from"./PlaygroundPanel-BDClNSzf.js";import{C as b}from"./ControlAccordion-CydkdljU.js";const f="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 — a digest long enough to need truncating",m=["div","span","p"].map(t=>({label:t,value:t})),g=["top","bottom"].map(t=>({label:t,value:t})),j=()=>{const[t,i]=o.useState("div"),[s,d]=o.useState("top"),[r,c]=o.useState(280);return e.jsx(x,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(b,{groups:[{id:"options",title:"Options",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Element",options:m,value:t,onChange:a=>i(a)}),e.jsx(l,{label:"Tooltip side",options:g,value:s,onChange:a=>d(a)}),e.jsx(h,{label:"Container width",children:e.jsx("input",{type:"range",min:120,max:600,value:r,className:"w-full",onChange:a=>c(Number(a.target.value))})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Widen the container until the ellipsis disappears — the tooltip and the tab stop go with it. The element is focusable"," ",e.jsx("strong",{children:"only while actually truncated"}),", so a page of short labels gains no dead tab stops. Try tabbing to it."]})]}),preview:e.jsx("div",{style:{width:r},className:"rounded-lg border border-neutral-200 p-3 dark:border-neutral-700",children:e.jsx(n,{text:f,as:t,tooltipPosition:s,delay:300})})})};function T(){return e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("div",{className:"w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700",children:e.jsx(n,{text:"This label is far too long to fit inside its container",delay:300})}),e.jsx("div",{className:"w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700",children:e.jsx(n,{text:"Short enough",delay:300})})]})}const w=`import { TruncatedText } from "@cjlapao/ui-kit";

/**
 * The tooltip appears only when the text is actually cut off — and so does the
 * tab stop. \`TooltipWrapper\` answers to focus as well as hover, but the
 * element was never focusable, so a keyboard user could not read a cut-off
 * label at all.
 */
export default function Truncation() {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
        <TruncatedText text="This label is far too long to fit inside its container" delay={300} />
      </div>
      <div className="w-64 rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
        <TruncatedText text="Short enough" delay={300} />
      </div>
    </div>
  );
}
`,P=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(u,{name:"Truncated Text",description:"Text that ellipsises when it overflows and reveals the full string in a tooltip when it does. It measures with a ResizeObserver, so it reacts to the container changing rather than only to the text."}),e.jsx(j,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(p,{title:"Only when cut off",description:"The tooltip and the tab stop both appear only while the text is actually truncated — so a page of short labels gains no dead tab stops, and a cut-off one is reachable from the keyboard.",code:w,filename:"Truncation.tsx",children:e.jsx(T,{})})]})]});export{P as TruncatedTextPage,P as default};
