import{r as l,j as e,c2 as s,e as n,P,M as L,C as D,f as H,l as M}from"./index-p9Bv1Pn1.js";import{P as _}from"./PageHeader-DCZtzAyX.js";import{E as r}from"./ExampleCard-BS13YSEO.js";import{P as U,S as i,T as y,C as W}from"./PlaygroundPanel-BDClNSzf.js";import{C as $}from"./ControlAccordion-CydkdljU.js";import{d as q,t as G,p as X,e as J,bx as K,i as Q,k as Y,l as Z,j as ee}from"./options-Bqu3_N-h.js";const te=({children:t})=>e.jsx("span",{className:"block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:t}),ne=["default","glass","liquid-glass"],ae=[{label:"240px",value:"240"},{label:"320px",value:"320"},{label:"400px",value:"400"},{label:"480px",value:"480"}],se=[{label:"Arrow (speech-bubble)",value:"arrow"},{label:"Bubble (detached dot)",value:"bubble"},{label:"None",value:"none"}],le=()=>{const[t,o]=l.useState("elevated"),[c,u]=l.useState("blue"),[x,m]=l.useState("rounded-md"),[d,C]=l.useState("sm"),[g,S]=l.useState("auto"),[h,B]=l.useState("320"),[p,T]=l.useState(!0),[v,E]=l.useState(!0),[b,z]=l.useState(!0),[f,A]=l.useState(!1),[j,R]=l.useState("spinner"),[N,O]=l.useState("medium"),[w,I]=l.useState("frosted"),[k,F]=l.useState("classic"),V=ne.includes(t);return e.jsx(U,{previewClassName:"w-full flex-col items-center",controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx($,{groups:[{id:"surface",title:"Surface",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:q,value:t,onChange:a=>o(a)}),e.jsx(i,{label:"Tone",options:G,value:c,onChange:a=>u(a)}),e.jsx(i,{label:"Corner",options:X,value:x,onChange:a=>m(a)}),e.jsx(i,{label:"Padding",options:J,value:d,onChange:a=>C(a)})]})},{id:"placement",title:"Placement",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Placement",options:K,value:g,onChange:a=>S(a)}),e.jsx(i,{label:"Max width",options:ae,value:h,onChange:B}),e.jsx(i,{label:"Indicator",options:se,value:p==="bubble"?"bubble":p?"arrow":"none",onChange:a=>T(a==="none"?!1:a==="bubble"?"bubble":!0)})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Dismissable (outside click)",checked:v,onChange:E}),e.jsx(y,{label:"Close on Escape",checked:b,onChange:z})]})},{id:"loading",title:"Loading",controls:e.jsxs(e.Fragment,{children:[e.jsx(y,{label:"Loading",checked:f,onChange:A}),e.jsx(W,{label:"Loader type",children:e.jsx(L,{fullWidth:!0,size:"sm",options:Q,value:j,onChange:a=>R(a)})})]})},...V?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Vibrancy",options:Y,value:N,onChange:a=>O(a)}),e.jsx(i,{label:"Glass opacity",options:Z,value:w,onChange:a=>I(a)}),e.jsx(i,{label:"Specular mode",options:ee,value:k,onChange:a=>F(a)})]})}]:[]]}),e.jsx("p",{className:"text-xs opacity-70",children:"Click the trigger to open the popover — it is a fixed overlay that floats over the page. Turn on the background image to judge the glass surfaces over a real backdrop."})]}),preview:e.jsxs("div",{className:"flex w-full flex-col items-center gap-4",children:[e.jsx("div",{className:"rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-10 dark:from-neutral-800 dark:to-neutral-900",children:e.jsx(s,{trigger:e.jsx(n,{color:c,size:"sm",children:"Toggle"}),variant:t,tone:c,corner:x,padding:d,placement:g,maxWidth:Number(h),arrow:p,dismissable:v,closeOnEscape:b,loading:f,loaderType:j,vibrancy:N,glassOpacity:w,specularMode:k,children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Popover content"}),e.jsxs("p",{className:"text-xs text-neutral-600 dark:text-neutral-300",children:["This panel is a real Panel — ",t," / ",c," — with its",p==="bubble"?" bubble dot floating in the gap":p?" arrow pointing at the trigger":" edge unadorned","."]})]})})}),e.jsx(P,{variant:"outlined",padding:"sm",children:e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(te,{children:"Current settings"}),e.jsxs("p",{className:"text-xs text-neutral-600 dark:text-neutral-300",children:[t," · ",c," · ",x," · ",d," · ",g," ·"," ",h,"px",p==="bubble"?" · bubble":p?" · arrow":" · no indicator",v?"":" · non-dismissable",b?"":" · Escape ignored",f?` · loading (${j})`:""]})]})})]})})},oe=()=>e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"sm",children:"Toggle"}),variant:"elevated",tone:"blue",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Popover"}),e.jsx("p",{className:"text-xs text-neutral-600 dark:text-neutral-300",children:"A small panel anchored to the trigger, with an arrow pointing at it. Click outside or press Escape to close."})]})}),ie=`import { Button, Popover } from "@cjlapao/ui-kit";

const Basic = () => (
  <Popover
    trigger={<Button color="blue" size="sm">Toggle</Button>}
    variant="elevated"
    tone="blue"
  >
    <div className="space-y-1.5">
      <p className="text-sm font-semibold">Popover</p>
      <p className="text-xs text-neutral-600 dark:text-neutral-300">
        A small panel anchored to the trigger, with an arrow pointing at it.
        Click outside or press Escape to close.
      </p>
    </div>
  </Popover>
);

export default Basic;
`,re=()=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{trigger:e.jsx(n,{color:"violet",size:"sm",variant:"soft",children:"Details"}),variant:"elevated",tone:"violet",maxWidth:340,children:e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20",children:e.jsx(D,{icon:"Info",className:"h-4 w-4 text-violet-600 dark:text-violet-300"})}),e.jsx("p",{className:"text-sm font-semibold",children:"Scheduled maintenance"})]}),e.jsx("p",{className:"text-xs leading-5 text-neutral-600 dark:text-neutral-300",children:"The API gateway will be briefly unavailable on Sunday 02:00–02:15 UTC while we roll the new load balancer. No action is needed."}),e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(n,{size:"xs",variant:"ghost",color:"neutral",children:"Dismiss"}),e.jsx(n,{size:"xs",variant:"solid",color:"violet",children:"Notify me"})]})]})}),e.jsx("span",{className:"text-xs opacity-70",children:"icon, heading, copy and actions — all inside the panel"})]}),ce=`import { Button, CustomIcon, Popover } from "@cjlapao/ui-kit";

const RichContent = () => (
  <div className="flex flex-col items-center gap-2">
    <Popover
      trigger={
        <Button color="violet" size="sm" variant="soft">
          Details
        </Button>
      }
      variant="elevated"
      tone="violet"
      maxWidth={340}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-500/20">
            <CustomIcon
              icon="Info"
              className="h-4 w-4 text-violet-600 dark:text-violet-300"
            />
          </span>
          <p className="text-sm font-semibold">Scheduled maintenance</p>
        </div>
        <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
          The API gateway will be briefly unavailable on Sunday 02:00–02:15
          UTC while we roll the new load balancer. No action is needed.
        </p>
        <div className="flex justify-end gap-2">
          <Button size="xs" variant="ghost" color="neutral">
            Dismiss
          </Button>
          <Button size="xs" variant="solid" color="violet">
            Notify me
          </Button>
        </div>
      </div>
    </Popover>
    <span className="text-xs opacity-70">
      icon, heading, copy and actions — all inside the panel
    </span>
  </div>
);

export default RichContent;
`,de=()=>e.jsx("div",{className:"flex flex-wrap items-center justify-center gap-3",children:H.map(t=>e.jsx("div",{className:"flex flex-col items-center gap-1.5",children:e.jsx(s,{trigger:e.jsx(n,{color:"sky",size:"xs",children:t}),variant:t,tone:"sky",padding:"sm",children:e.jsxs("p",{className:"text-xs leading-5 text-neutral-700 dark:text-neutral-200",children:[e.jsx("span",{className:"font-semibold",children:t})," — the same surface a Panel beside it would draw."]})})},t))}),pe=`import { Button, Popover, SURFACE_VARIANTS } from "@cjlapao/ui-kit";

const EverySurface = () => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    {SURFACE_VARIANTS.map((variant) => (
      <div key={variant} className="flex flex-col items-center gap-1.5">
        <Popover
          trigger={<Button color="sky" size="xs">{variant}</Button>}
          variant={variant}
          tone="sky"
          padding="sm"
        >
          <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
            <span className="font-semibold">{variant}</span> — the same
            surface a Panel beside it would draw.
          </p>
        </Popover>
      </div>
    ))}
  </div>
);

export default EverySurface;
`,xe=[{variant:"elevated",tone:"neutral"},{variant:"tonal",tone:"cyan"},{variant:"glass",tone:"cyan"},{variant:"liquid-glass",tone:"cyan"}],me=()=>e.jsx("div",{className:"flex flex-wrap items-start justify-center gap-x-8 gap-y-4",children:xe.map(({variant:t,tone:o})=>e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(s,{trigger:e.jsx(n,{color:o,size:"xs",children:"arrow"}),variant:t,tone:o,padding:"sm",children:e.jsx("p",{className:"text-xs leading-5 text-neutral-700 dark:text-neutral-200",children:"The speech-bubble arrow joins the panel to its trigger."})}),e.jsx(s,{trigger:e.jsx(n,{color:o,size:"xs",children:"bubble"}),variant:t,tone:o,padding:"sm",arrow:"bubble",children:e.jsx("p",{className:"text-xs leading-5 text-neutral-700 dark:text-neutral-200",children:"The detached dot floats in the gap — the edge stays unbroken."})})]}),e.jsx("span",{className:"text-xs text-neutral-400 dark:text-neutral-500",children:t})]},t))}),ue=`import { Button, Popover } from "@cjlapao/ui-kit";

/** The variants that best show the two indicator styles side by side. */
const VARIANTS = [
  { variant: "elevated", tone: "neutral" },
  { variant: "tonal", tone: "cyan" },
  { variant: "glass", tone: "cyan" },
  { variant: "liquid-glass", tone: "cyan" },
] as const;

const BubbleIndicator = () => (
  <div className="flex flex-wrap items-start justify-center gap-x-8 gap-y-4">
    {VARIANTS.map(({ variant, tone }) => (
      <div key={variant} className="flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2">
          <Popover
            trigger={<Button color={tone} size="xs">arrow</Button>}
            variant={variant}
            tone={tone}
            padding="sm"
          >
            <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
              The speech-bubble arrow joins the panel to its trigger.
            </p>
          </Popover>
          <Popover
            trigger={<Button color={tone} size="xs">bubble</Button>}
            variant={variant}
            tone={tone}
            padding="sm"
            arrow="bubble"
          >
            <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
              The detached dot floats in the gap — the edge stays unbroken.
            </p>
          </Popover>
        </div>
        <span className="text-xs text-neutral-400 dark:text-neutral-500">
          {variant}
        </span>
      </div>
    ))}
  </div>
);

export default BubbleIndicator;
`,ge=()=>e.jsx("div",{className:"grid w-full max-w-2xl grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-5",children:M.map(t=>e.jsx("div",{className:"flex flex-col items-center gap-1.5",children:e.jsx(s,{trigger:e.jsx(n,{color:t,size:"xs",children:t}),variant:"elevated",tone:t,padding:"sm",children:e.jsxs("p",{className:"text-xs leading-5 text-neutral-700 dark:text-neutral-200",children:[e.jsx("span",{className:"font-semibold",children:t})," tone — carried by the surface and the arrow."]})})},t))}),he=`import { Button, Popover, TRUE_COLORS } from "@cjlapao/ui-kit";

const EveryTone = () => (
  <div className="grid w-full max-w-2xl grid-cols-3 gap-x-6 gap-y-3 sm:grid-cols-5">
    {TRUE_COLORS.map((tone) => (
      <div key={tone} className="flex flex-col items-center gap-1.5">
        <Popover
          trigger={<Button color={tone} size="xs">{tone}</Button>}
          variant="elevated"
          tone={tone}
          padding="sm"
        >
          <p className="text-xs leading-5 text-neutral-700 dark:text-neutral-200">
            <span className="font-semibold">{tone}</span> tone — carried by
            the surface and the arrow.
          </p>
        </Popover>
      </div>
    ))}
  </div>
);

export default EveryTone;
`,ve=()=>e.jsxs("div",{className:"flex h-[85vh] w-full max-w-md flex-col",children:[e.jsxs("div",{className:"flex flex-wrap justify-center gap-3",children:[e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"xs",children:"top"}),placement:"top",variant:"outlined",tone:"blue",padding:"sm",children:e.jsx("p",{className:"text-xs",children:"Explicit top."})}),e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"xs",children:"bottom"}),placement:"bottom",variant:"outlined",tone:"blue",padding:"sm",children:e.jsx("p",{className:"text-xs",children:"Explicit bottom."})}),e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"xs",children:"left"}),placement:"left",variant:"outlined",tone:"blue",padding:"sm",children:e.jsx("p",{className:"text-xs",children:"Explicit left."})}),e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"xs",children:"right"}),placement:"right",variant:"outlined",tone:"blue",padding:"sm",children:e.jsx("p",{className:"text-xs",children:"Explicit right."})}),e.jsx(s,{trigger:e.jsx(n,{color:"emerald",size:"xs",children:"auto (top of card)"}),placement:"auto",variant:"outlined",tone:"emerald",padding:"sm",children:e.jsx("p",{className:"text-xs",children:"Auto: plenty of room below, so it opens downward."})})]}),e.jsx("div",{className:"mt-auto flex justify-center pb-2",children:e.jsx(s,{trigger:e.jsx(n,{color:"emerald",size:"xs",children:"auto (bottom of card)"}),placement:"auto",variant:"outlined",tone:"emerald",padding:"sm",children:e.jsx("p",{className:"text-xs leading-5",children:"Auto: there is almost no room below the card, so it flips up. The arrow keeps pointing at the trigger through the flip and the clamping — that is the placement geometry doing its job."})})})]}),be=`import { Button, Popover } from "@cjlapao/ui-kit";

/**
 * The explicit sides always land on that side (clamped to the viewport).
 * The two \`auto\` triggers show the flip: the bottom one sits at the foot of
 * this 85 vh card, so when the section is in view there is never enough
 * room below it — it opens upward, and the arrow tracks it either way.
 */
const PlacementFlip = () => (
  <div className="flex h-[85vh] w-full max-w-md flex-col">
    <div className="flex flex-wrap justify-center gap-3">
      <Popover
        trigger={<Button color="blue" size="xs">top</Button>}
        placement="top"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit top.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">bottom</Button>}
        placement="bottom"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit bottom.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">left</Button>}
        placement="left"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit left.</p>
      </Popover>
      <Popover
        trigger={<Button color="blue" size="xs">right</Button>}
        placement="right"
        variant="outlined"
        tone="blue"
        padding="sm"
      >
        <p className="text-xs">Explicit right.</p>
      </Popover>
      <Popover
        trigger={<Button color="emerald" size="xs">auto (top of card)</Button>}
        placement="auto"
        variant="outlined"
        tone="emerald"
        padding="sm"
      >
        <p className="text-xs">
          Auto: plenty of room below, so it opens downward.
        </p>
      </Popover>
    </div>
    <div className="mt-auto flex justify-center pb-2">
      <Popover
        trigger={<Button color="emerald" size="xs">auto (bottom of card)</Button>}
        placement="auto"
        variant="outlined"
        tone="emerald"
        padding="sm"
      >
        <p className="text-xs leading-5">
          Auto: there is almost no room below the card, so it flips up. The
          arrow keeps pointing at the trigger through the flip and the
          clamping — that is the placement geometry doing its job.
        </p>
      </Popover>
    </div>
  </div>
);

export default PlacementFlip;
`,fe=()=>e.jsxs("div",{className:"flex flex-wrap items-start justify-center gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"sm",children:"Spinner"}),variant:"elevated",tone:"blue",loading:!0,loaderType:"spinner",loaderTitle:"Fetching",loaderMessage:"Hang tight…",children:e.jsx("p",{className:"text-xs",children:"Replaced by the spinner overlay."})}),e.jsx("span",{className:"text-xs opacity-70",children:"spinner overlay"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"sm",children:"Progress"}),variant:"elevated",tone:"blue",loading:!0,loaderType:"progress",loaderProgress:64,loaderTitle:"Fetching",loaderMessage:"64% done",children:e.jsx("p",{className:"text-xs",children:"Replaced by the progress overlay."})}),e.jsx("span",{className:"text-xs opacity-70",children:"progress overlay"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-1.5",children:[e.jsx(s,{trigger:e.jsx(n,{color:"blue",size:"sm",children:"Skeleton"}),variant:"elevated",tone:"blue",loading:!0,loaderType:"skeleton",skeletonLines:3,children:e.jsx("p",{className:"text-xs",children:"Replaced by the skeleton."})}),e.jsx("span",{className:"text-xs opacity-70",children:"skeleton body"})]})]}),je=`import { Button, Popover } from "@cjlapao/ui-kit";

/**
 * The shared loader language, three ways: a spinner overlay, a progress
 * overlay with a known extent, and a skeleton that replaces the copy — so a
 * slow fetch never flashes empty text.
 */
const LoadingStates = () => (
  <div className="flex flex-wrap items-start justify-center gap-6">
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Spinner</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="spinner"
        loaderTitle="Fetching"
        loaderMessage="Hang tight…"
      >
        <p className="text-xs">Replaced by the spinner overlay.</p>
      </Popover>
      <span className="text-xs opacity-70">spinner overlay</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Progress</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="progress"
        loaderProgress={64}
        loaderTitle="Fetching"
        loaderMessage="64% done"
      >
        <p className="text-xs">Replaced by the progress overlay.</p>
      </Popover>
      <span className="text-xs opacity-70">progress overlay</span>
    </div>
    <div className="flex flex-col items-center gap-1.5">
      <Popover
        trigger={<Button color="blue" size="sm">Skeleton</Button>}
        variant="elevated"
        tone="blue"
        loading
        loaderType="skeleton"
        skeletonLines={3}
      >
        <p className="text-xs">Replaced by the skeleton.</p>
      </Popover>
      <span className="text-xs opacity-70">skeleton body</span>
    </div>
  </div>
);

export default LoadingStates;
`,ye=({children:t})=>e.jsx("span",{className:"block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:t}),Ne=()=>{const[t,o]=l.useState(!1),[c,u]=l.useState([]),x=m=>u(d=>[m,...d].slice(0,5));return e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-center gap-2",children:[e.jsx(s,{visible:t,onOpenChange:o,onShow:()=>x("onShow"),onHide:()=>x("onHide"),trigger:e.jsx(n,{color:"blue",size:"sm",children:"Toggle (trigger)"}),variant:"elevated",tone:"blue",children:e.jsxs("p",{className:"text-xs leading-5",children:["Fully controlled: ",e.jsx("code",{className:"font-mono",children:"visible"})," is owned by the parent, and ",e.jsx("code",{className:"font-mono",children:"onOpenChange"})," ","is how the trigger and dismissal ask to change it."]})}),e.jsx(n,{color:"neutral",size:"sm",variant:"outline",onClick:()=>o(!0),disabled:t,children:"Open"}),e.jsx(n,{color:"neutral",size:"sm",variant:"outline",onClick:()=>o(!1),disabled:!t,children:"Close"})]}),e.jsx(P,{variant:"outlined",padding:"sm",children:e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(ye,{children:"Events"}),c.length===0?e.jsx("p",{className:"text-xs opacity-70",children:"Interact above — the trigger, an outside click and Escape all ask through onOpenChange; onShow / onHide report the actual lifecycle."}):e.jsx("ul",{className:"flex flex-wrap gap-1.5",children:c.map((m,d)=>e.jsx("li",{className:"rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800",children:m},`${m}-${d}`))})]})})]})},we=`import React, { useState } from "react";
import { Button, Panel, Popover } from "@cjlapao/ui-kit";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
    {children}
  </span>
);

const Controlled = () => {
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const note = (entry: string) =>
    setEvents((previous) => [entry, ...previous].slice(0, 5));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Popover
          visible={visible}
          onOpenChange={setVisible}
          onShow={() => note("onShow")}
          onHide={() => note("onHide")}
          trigger={<Button color="blue" size="sm">Toggle (trigger)</Button>}
          variant="elevated"
          tone="blue"
        >
          <p className="text-xs leading-5">
            Fully controlled: <code className="font-mono">visible</code> is
            owned by the parent, and <code className="font-mono">onOpenChange</code>{" "}
            is how the trigger and dismissal ask to change it.
          </p>
        </Popover>
        <Button
          color="neutral"
          size="sm"
          variant="outline"
          onClick={() => setVisible(true)}
          disabled={visible}
        >
          Open
        </Button>
        <Button
          color="neutral"
          size="sm"
          variant="outline"
          onClick={() => setVisible(false)}
          disabled={!visible}
        >
          Close
        </Button>
      </div>
      <Panel variant="outlined" padding="sm">
        <div className="flex flex-col gap-1.5">
          <Caption>Events</Caption>
          {events.length === 0 ? (
            <p className="text-xs opacity-70">
              Interact above — the trigger, an outside click and Escape all
              ask through onOpenChange; onShow / onHide report the actual
              lifecycle.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {events.map((entry, index) => (
                <li
                  key={\`\${entry}-\${index}\`}
                  className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800"
                >
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default Controlled;
`,ke=()=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{trigger:e.jsx(n,{color:"amber",size:"sm",children:"Open"}),variant:"elevated",tone:"amber",dismissable:!1,children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("p",{className:"text-sm font-semibold",children:"Non-dismissable"}),e.jsxs("p",{className:"text-xs leading-5 text-neutral-600 dark:text-neutral-300",children:["Clicking outside leaves this panel open — only the trigger (or Escape) closes it. That is"," ",e.jsxs("code",{className:"font-mono",children:["dismissable=","{false}"]}),", PrimeVue 's non-dismissable popover."]})]})}),e.jsx("span",{className:"text-xs opacity-70",children:"outside clicks are ignored"})]}),Pe=`import { Button, Popover } from "@cjlapao/ui-kit";

const NonDismissable = () => (
  <div className="flex flex-col items-center gap-2">
    <Popover
      trigger={<Button color="amber" size="sm">Open</Button>}
      variant="elevated"
      tone="amber"
      dismissable={false}
    >
      <div className="space-y-1.5">
        <p className="text-sm font-semibold">Non-dismissable</p>
        <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
          Clicking outside leaves this panel open — only the trigger (or
          Escape) closes it. That is{" "}
          <code className="font-mono">dismissable={"{false}"}</code>, PrimeVue
          's non-dismissable popover.
        </p>
      </div>
    </Popover>
    <span className="text-xs opacity-70">outside clicks are ignored</span>
  </div>
);

export default NonDismissable;
`,Ae=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Popover",description:"A floating panel anchored to any trigger — an arrow (or a detached bubble dot) that tracks the trigger through every clamp, all eight container surfaces with glass and liquid-glass, flip-aware placement, dismissable/Escape control, and the shared loader set."}),e.jsx(le,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Basic",description:"A toggle button opens a small elevated panel. It closes on outside click or Escape, and the trigger carries aria-haspopup / aria-expanded / aria-controls.",code:ie,filename:"Basic.tsx",children:e.jsx(oe,{})}),e.jsx(r,{title:"Rich content",description:"The panel is a real Panel, so it takes any content: an icon chip, a heading, copy and a row of actions — styled by the tone, capped by maxWidth.",code:ce,filename:"RichContent.tsx",children:e.jsx(re,{})}),e.jsx(r,{title:"Every surface",description:"All eight SURFACE_VARIANTS, including glass and liquid-glass over the backdrop — the arrow wears the same edge chrome as the panel it points from.",code:pe,filename:"EverySurface.tsx",previewClassName:"bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",children:e.jsx(de,{})}),e.jsx(r,{title:"Bubble indicator",description:`arrow="bubble" replaces the speech-bubble arrow with a detached dot floating in the trigger↔panel gap — a bead of the panel's own surface, edge left unbroken. Each pair shows the two indicators on the same surface.`,code:ue,filename:"BubbleIndicator.tsx",previewClassName:"bg-gradient-to-br from-sky-100 via-indigo-100 to-fuchsia-100 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900",children:e.jsx(me,{})}),e.jsx(r,{title:"Every tone",description:"The full 21-colour tone set. Each trigger opens a popover whose surface and arrow carry its own tone.",code:he,filename:"EveryTone.tsx",children:e.jsx(ge,{})}),e.jsx(r,{title:"Placement & flip",description:"The explicit sides always land on that side. The auto trigger at the foot of the 85 vh card never has room below it, so it flips up — the arrow keeps pointing at the trigger through the flip.",code:be,filename:"PlacementFlip.tsx",children:e.jsx(ve,{})}),e.jsx(r,{title:"Loading & skeleton",description:"The shared loader language: a spinner overlay, a progress overlay with a known extent, and a skeleton that replaces the copy — a slow fetch never flashes empty text.",code:je,filename:"LoadingStates.tsx",children:e.jsx(fe,{})}),e.jsx(r,{title:"Controlled",description:"visible is owned by the parent; the trigger, outside clicks and Escape all ask through onOpenChange, while onShow / onHide report the actual lifecycle.",code:we,filename:"Controlled.tsx",children:e.jsx(Ne,{})}),e.jsx(r,{title:"Non-dismissable",description:"dismissable={false}: clicking outside leaves the panel open. Only the trigger or Escape closes it — PrimeVue's non-dismissable popover.",code:Pe,filename:"NonDismissable.tsx",children:e.jsx(ke,{})})]})]});export{Ae as PopoverPage,Ae as default};
