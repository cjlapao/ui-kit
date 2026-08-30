import{r as a,j as e,bT as s,M as h,I as w,ax as y,bU as b}from"./index-p9Bv1Pn1.js";import{P as S}from"./PageHeader-DCZtzAyX.js";import{E as o}from"./ExampleCard-BS13YSEO.js";import{P as j,C as c,S as v}from"./PlaygroundPanel-BDClNSzf.js";import{C as k}from"./ControlAccordion-CydkdljU.js";import{bi as T,bj as N}from"./options-Bqu3_N-h.js";const u=[{label:"Xs",value:"xs",className:"text-xs"},{label:"Sm",value:"sm",className:"text-sm"},{label:"Md",value:"md",className:"text-base"},{label:"Lg",value:"lg",className:"text-lg"},{label:"Xl",value:"xl",className:"text-2xl"}],E=()=>{const[t,l]=a.useState("normal"),[i,m]=a.useState("inherit"),[r,d]=a.useState("md"),[x,p]=a.useState("Thinking…"),g=u.find(n=>n.value===r)?.className??"text-base";return e.jsx(j,{previewClassName:"w-full flex-col items-center gap-3",controls:e.jsx("div",{className:"space-y-3",children:e.jsx(k,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Speed",children:e.jsx(h,{fullWidth:!0,size:"sm",options:T,value:t,onChange:n=>l(n)})}),e.jsx(v,{label:"Tone",options:N,value:i,onChange:n=>m(n)}),e.jsx(c,{label:"Type size",children:e.jsx(h,{fullWidth:!0,size:"sm",options:u.map(({label:n,value:f})=>({label:n,value:f})),value:r,onChange:n=>d(n)})})]})},{id:"content",title:"Content",controls:e.jsx(c,{label:"Copy",children:e.jsx(w,{size:"sm",value:x,onChange:n=>p(n.target.value)})})}]})}),preview:e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx("div",{className:"rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 px-10 py-10 dark:from-neutral-800 dark:to-neutral-900",children:e.jsx(s,{speed:t,tone:i==="inherit"?void 0:i,className:`${g} font-medium`,children:x||"Thinking…"})}),e.jsxs("span",{className:"text-xs opacity-70",children:[t," · ",i," · ",r]})]})})},C=()=>{const[t,l]=a.useState(!0),[i,m]=a.useState(0),r=a.useRef(void 0);return a.useEffect(()=>{if(t)return r.current=window.setTimeout(()=>l(!1),2600),()=>window.clearTimeout(r.current)},[t,i]),e.jsxs("div",{className:"mx-auto flex w-full max-w-md flex-col gap-3",children:[e.jsx("div",{className:"max-w-[85%] self-start rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",children:"What does the shimmer component do?"}),e.jsx("div",{className:"max-w-[85%] self-end rounded-2xl rounded-br-md bg-neutral-900 px-4 py-2.5 text-sm text-white dark:bg-neutral-200 dark:text-neutral-900",children:t?e.jsx(s,{role:"status","aria-live":"polite",children:"Thinking…"}):"It sweeps a band of light across the text while a response is on its way."}),e.jsx("button",{type:"button",onClick:()=>{l(!0),m(d=>d+1)},className:"self-end text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-400",children:"Replay"})]})},R=`import { useEffect, useRef, useState } from "react";
import { Shimmer } from "@cjlapao/ui-kit";

/**
 * The canonical use case: a chat row that shimmers "Thinking…" while the
 * answer is pending, then swaps to the static copy. Replay to run it again.
 * The shimmer carries role="status" so screen readers announce the wait.
 */
const ThinkingLabel = () => {
  const [thinking, setThinking] = useState(true);
  const [run, setRun] = useState(0);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    if (!thinking) return;
    timer.current = window.setTimeout(() => setThinking(false), 2600);
    return () => window.clearTimeout(timer.current);
  }, [thinking, run]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        What does the shimmer component do?
      </div>
      <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-neutral-900 px-4 py-2.5 text-sm text-white dark:bg-neutral-200 dark:text-neutral-900">
        {thinking ? (
          <Shimmer role="status" aria-live="polite">
            Thinking…
          </Shimmer>
        ) : (
          "It sweeps a band of light across the text while a response is on its way."
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setThinking(true);
          setRun((r) => r + 1);
        }}
        className="self-end text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      >
        Replay
      </button>
    </div>
  );
};

export default ThinkingLabel;
`,M=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-x-8 gap-y-3",children:y.map(t=>e.jsx(s,{speed:t,className:"text-lg font-medium",children:t},t))}),I=`import { SHIMMER_SPEEDS, Shimmer } from "@cjlapao/ui-kit";

/**
 * The three sweep periods side by side — slow 3.2s, normal 2s, fast 1.2s —
 * so the pace difference reads at a glance.
 */
const Speeds = () => (
  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
    {SHIMMER_SPEEDS.map((speed) => (
      <Shimmer key={speed} speed={speed} className="text-lg font-medium">
        {speed}
      </Shimmer>
    ))}
  </div>
);

export default Speeds;
`,P=()=>e.jsxs("div",{className:"flex flex-col items-center gap-4",children:[e.jsx(s,{className:"text-sm italic",children:"inherit (surrounding text color)"}),e.jsx("div",{className:"flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm",children:b.map(t=>e.jsx(s,{tone:t,children:t},t))})]}),z=`import { SHIMMER_TONES, Shimmer } from "@cjlapao/ui-kit";

/**
 * The full 21-tone scale. Each label sweeps in its own tone — the highlight
 * is derived from the same color, so a violet shimmer highlights violet.
 * The first row inherits the surrounding text color instead.
 */
const EveryTone = () => (
  <div className="flex flex-col items-center gap-4">
    <Shimmer className="text-sm italic">
      inherit (surrounding text color)
    </Shimmer>
    <div className="flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
      {SHIMMER_TONES.map((tone) => (
        <Shimmer key={tone} tone={tone}>
          {tone}
        </Shimmer>
      ))}
    </div>
  </div>
);

export default EveryTone;
`,H=()=>e.jsxs("div",{className:"flex flex-col items-center gap-4 text-center",children:[e.jsx(s,{className:"text-xs uppercase tracking-widest",children:"Eyebrow label"}),e.jsx(s,{className:"text-base",children:"Body text waiting on an answer"}),e.jsx(s,{className:"text-2xl font-semibold",children:"Heading scale"}),e.jsxs("p",{className:"max-w-md text-sm text-neutral-600 dark:text-neutral-400",children:["Shimmered text sits inline in a paragraph —"," ",e.jsx(s,{tone:"blue",className:"font-medium",children:"the surrounding sentence"})," ","keeps flowing around it."]})]}),_=`import { Shimmer } from "@cjlapao/ui-kit";

/**
 * The sweep at every type size, and mid-paragraph: the span stays inline,
 * so it drops into running copy without breaking the flow.
 */
const Typography = () => (
  <div className="flex flex-col items-center gap-4 text-center">
    <Shimmer className="text-xs uppercase tracking-widest">
      Eyebrow label
    </Shimmer>
    <Shimmer className="text-base">Body text waiting on an answer</Shimmer>
    <Shimmer className="text-2xl font-semibold">
      Heading scale
    </Shimmer>
    <p className="max-w-md text-sm text-neutral-600 dark:text-neutral-400">
      Shimmered text sits inline in a paragraph —{" "}
      <Shimmer tone="blue" className="font-medium">
        the surrounding sentence
      </Shimmer>{" "}
      keeps flowing around it.
    </p>
  </div>
);

export default Typography;
`,X=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(S,{name:"Shimmer",description:"A light sweep across waiting text — the chat 'thinking…' effect. It inherits the surrounding text color or runs in any of the 21 kit tones, at three preset speeds, and stays solid readable text under reduced motion."}),e.jsx(E,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Thinking label",description:"The canonical chat use case: a row shimmers 'Thinking…' while the answer is pending (role='status'), then swaps to the static copy. Replay to run it again.",code:R,filename:"ThinkingLabel.tsx",children:e.jsx(C,{})}),e.jsx(o,{title:"Speeds",description:"The three sweep periods side by side — slow 3.2s, normal 2s and fast 1.2s per pass.",code:I,filename:"Speeds.tsx",children:e.jsx(M,{})}),e.jsx(o,{title:"Every tone",description:"The full 21-tone scale — each highlight is derived from its own color, plus an inherit row that follows the surrounding text.",code:z,filename:"EveryTone.tsx",children:e.jsx(P,{})}),e.jsx(o,{title:"Typography",description:"The sweep at eyebrow, body and heading sizes — and mid-paragraph, where the inline span keeps the sentence flowing around it.",code:_,filename:"Typography.tsx",children:e.jsx(H,{})})]})]});export{X as ShimmerPage,X as default};
