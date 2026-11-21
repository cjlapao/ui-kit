import{r as s,j as e,h$ as C,b as Q,C as f}from"./index-ChbzYKtA.js";import{P as Z,A as J,a as g,C as a}from"./A11ySections-Ci0MCORB.js";import{P as X}from"./PageHeader-CORco2N-.js";import{E as $}from"./ExampleCard-Db5NXgWv.js";import{P as Y,S,C as c,T as y,a as i}from"./PlaygroundPanel-CZxrTOj5.js";import{C as ee}from"./ControlAccordion-DoyyLWlc.js";import{u as te,E as ne}from"./EventLog-AWfnu5cV.js";import{c as ae,s as se}from"./options-C-rzDbtC.js";const k=[...["Setup","Fetch issues","Plan","Create PR","Create code","Unit tests","Lint","Secure code","Scan deps"].map((n,r)=>({id:`s${r}`,title:n,status:"completed"})),{id:"gate",title:"Approve Gate",status:"error"},{id:"sign",title:"Sign Key"},{id:"deploy",title:"Deploy"}],re=[{label:"Quiet",value:"quiet"},{label:"Past",value:"past"},{label:"Future",value:"future"}],oe=[{label:"Panel",value:"panel"},{label:"Card",value:"card"}],le=[{label:"Bouncy",value:"bouncy"},{label:"Snappy",value:"snappy"},{label:"Gentle",value:"gentle"},{label:"Precise",value:"precise"}],ie=[{label:"Hover",value:"hover"},{label:"Click",value:"click"}],de=["3","4","5","6","8","10"].map(n=>({label:n,value:n})),ce=()=>{const[n,r]=te(),[o,p]=s.useState("md"),[d,l]=s.useState("panel"),[N,M]=s.useState("outlined"),[T,F]=s.useState("bouncy"),[u,H]=s.useState("quiet"),[P,D]=s.useState("hover"),[E,I]=s.useState(!0),[R,W]=s.useState(6),[h,B]=s.useState(!0),[A,G]=s.useState(!0),[m,U]=s.useState("blue"),[L,_]=s.useState("emerald"),[q,K]=s.useState("gray"),[z,O]=s.useState(9),[x,V]=s.useState(860),b=t=>v=>r(`${t}: ${v?"hover in":"hover out"}`);return e.jsx(Y,{controls:e.jsx("div",{className:"space-y-3",children:e.jsx(ee,{groups:[{id:"core",title:"Core",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(S,{label:"Size",options:ae,value:o,onChange:t=>p(t)}),e.jsx(c,{label:"Mode",options:oe,value:d,onChange:t=>l(t)}),e.jsx(S,{label:"Surface variant",options:se,value:N,onChange:t=>M(t)}),e.jsx(c,{label:"Spring",options:le,value:T,onChange:t=>F(t)})]})},{id:"reveal",title:"Reveal",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Force reveal",options:re,value:u,onChange:t=>H(t)}),e.jsx(c,{label:"Expand on",options:ie,value:P,onChange:t=>D(t)}),e.jsx(S,{label:"Max steps per flank",options:de,value:String(R),onChange:t=>W(Number(t))}),e.jsx(y,{label:"Stretch (ruler)",checked:E,onChange:I}),e.jsx(i,{label:"Container width",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(Q,{min:300,max:1080,step:10,value:x,onChange:t=>V(t),color:m,className:"min-w-0 flex-1"}),e.jsxs("span",{className:"w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400",children:[x,"px"]})]})}),e.jsx(y,{label:"Interactive",checked:h,onChange:B}),e.jsx(y,{label:"Animated",checked:A,onChange:G})]})},{id:"colours",title:"Colours",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Tone",children:e.jsx(f,{selectable:!0,size:"sm",value:m,onSelect:U,defaultExpanded:!0})}),e.jsx(i,{label:"Done",children:e.jsx(f,{selectable:!0,size:"sm",value:L,onSelect:_,defaultExpanded:!0})}),e.jsx(i,{label:"Next",children:e.jsx(f,{selectable:!0,size:"sm",value:q,onSelect:K,defaultExpanded:!0})})]})},{id:"run",title:"The run",defaultOpen:!0,controls:e.jsxs(i,{label:"Current step",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("button",{type:"button","aria-label":"Undo one step",onClick:()=>O(t=>Math.max(0,t-1)),className:"cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",children:"◀"}),e.jsxs("span",{className:"flex-1 text-center font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:[z+1," / ",k.length]}),e.jsx("button",{type:"button","aria-label":"Complete one step",onClick:()=>O(t=>Math.min(k.length-1,t+1)),className:"cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 text-xs hover:bg-neutral-100 dark:border-neutral-800",children:"▶"})]}),e.jsx("p",{className:"text-[11px] leading-snug text-neutral-400 dark:text-neutral-500",children:"Pin a flank, then complete steps — the revealed six walk with the newcomer springing in."})]})}]})}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("div",{className:"mx-auto overflow-x-auto rounded-lg border border-dashed border-neutral-300/70 px-4 py-6 transition-[width] duration-200 dark:border-neutral-600/70",style:{width:Math.min(x,1080)},children:e.jsx(C,{steps:k,currentIndex:z,actionLabel:"Action Required",size:o,mode:d,variant:N,spring:T,stretch:E,maxSteps:R,interactive:h,animated:A,expandOn:P,openZone:u==="quiet"?void 0:u,tone:m,doneColor:L,nextColor:q,onStepSelect:h?(t,v)=>r(`select: step ${v+1} — ${t.title}`):void 0,onOpenChange:t=>r(t?`reveal: ${t}`:"reveal: closed"),onDoneHover:b("done"),onCurrentHover:b("current"),onNextHover:b("next")})}),e.jsx("p",{className:"text-center text-xs text-neutral-400 dark:text-neutral-500",children:"The strip is a ruler: drag the width and the dashes run to their floors before the anchor yields. The backdrop toggle puts glass over a real background."}),e.jsx(ne,{log:n,emptyText:"No events yet — hover a flank, pin it, or click a revealed step."})]})})},j=(n,r,o,p={})=>[...Array.from({length:n},(d,l)=>({id:`d${l}`,title:`Step ${l+1}`,status:"completed"})),{id:"act",title:o,status:p.error?"error":void 0},...Array.from({length:Math.max(0,r-n-1)},(d,l)=>({id:`p${l}`,title:`Next ${l+1}`}))],pe=()=>e.jsx("div",{className:"grid gap-4 sm:grid-cols-3",children:[{name:"Test QA",meta:"saved project",steps:j(1,4,"Verify Tests"),actionLabel:void 0,pastSummary:void 0,foot:"idle · ready"},{name:"aeon-qa-workspace",meta:"recorded workspace",steps:j(8,11,"Approve Gate",{error:!0}),actionLabel:"Action Required",pastSummary:"8 passed · 1m",foot:"1 loop · 1 blocked"},{name:"new_agents",meta:"recorded workspace",steps:j(3,9,"Process Batch"),actionLabel:void 0,pastSummary:void 0,foot:"2 loops · daemon linked"}].map(n=>e.jsxs("div",{className:"flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900",children:[e.jsxs("div",{children:[e.jsx("p",{className:"text-[10px] font-semibold uppercase tracking-widest text-neutral-400",children:n.meta}),e.jsx("p",{className:"truncate text-sm font-bold",children:n.name})]}),e.jsx(C,{steps:n.steps,size:"sm",mode:"card",actionLabel:n.actionLabel,pastSummary:n.pastSummary,maxSteps:3}),e.jsx("p",{className:"font-mono text-[11px] text-neutral-400 dark:text-neutral-500",children:n.foot})]},n.name))}),ue=`import React from "react";
import { CondensedStepper, type StepperStep } from "@cjlapao/ui-kit";

const strip = (
  done: number,
  total: number,
  active: string,
  opts: { error?: boolean; futureLabel?: string } = {},
): StepperStep[] => [
  ...Array.from({ length: done }, (_, i) => ({
    id: \`d\${i}\`,
    title: \`Step \${i + 1}\`,
    status: "completed" as const,
  })),
  { id: "act", title: active, status: opts.error ? ("error" as const) : undefined },
  ...Array.from({ length: Math.max(0, total - done - 1) }, (_, i) => ({
    id: \`p\${i}\`,
    title: \`Next \${i + 1}\`,
  })),
];

/**
 * The card row from the mocks: the same strip at card size, three states of
 * the same component — idle-ready, gate-halted (the rose ring is the error
 * status, not a bespoke border), and a longer queue folded into \`+N\`.
 */
const RunCards: React.FC = () => (
  <div className="grid gap-4 sm:grid-cols-3">
    {(
      [
        {
          name: "Test QA",
          meta: "saved project",
          steps: strip(1, 4, "Verify Tests"),
          actionLabel: undefined,
          pastSummary: undefined,
          foot: "idle · ready",
        },
        {
          name: "aeon-qa-workspace",
          meta: "recorded workspace",
          steps: strip(8, 11, "Approve Gate", { error: true }),
          actionLabel: "Action Required",
          pastSummary: "8 passed · 1m",
          foot: "1 loop · 1 blocked",
        },
        {
          name: "new_agents",
          meta: "recorded workspace",
          steps: strip(3, 9, "Process Batch"),
          actionLabel: undefined,
          pastSummary: undefined,
          foot: "2 loops · daemon linked",
        },
      ] as const
    ).map((card) => (
      <div
        key={card.name}
        className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
            {card.meta}
          </p>
          <p className="truncate text-sm font-bold">{card.name}</p>
        </div>
        <CondensedStepper
          steps={card.steps}
          size="sm"
          mode="card"
          actionLabel={card.actionLabel}
          pastSummary={card.pastSummary}
          maxSteps={3}
        />
        <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
          {card.foot}
        </p>
      </div>
    ))}
  </div>
);

export default RunCards;
`,w=[{id:"setup",title:"Setup",status:"completed"},{id:"fetch",title:"Fetch issues",status:"completed"},{id:"plan",title:"Plan",status:"completed"},{id:"pr",title:"Create PR",status:"completed"},{id:"code",title:"Create code",status:"completed"},{id:"tests",title:"Unit tests",status:"completed"},{id:"lint",title:"Lint",status:"completed"},{id:"sec",title:"Secure code",status:"completed"},{id:"deps",title:"Scan deps",status:"completed"},{id:"gate",title:"Approve Gate",status:"error"},{id:"sign",title:"Sign Key"},{id:"deploy",title:"Deploy"}],he=()=>{const[n,r]=s.useState(9);return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsxs("div",{className:"flex items-center gap-2 font-mono text-[11px] text-neutral-400",children:[e.jsx("button",{type:"button","aria-label":"Undo one step",onClick:()=>r(o=>Math.max(0,o-1)),className:"cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",children:"◀"}),e.jsxs("span",{className:"w-16 text-center tabular-nums",children:["step ",n+1," / ",w.length]}),e.jsx("button",{type:"button","aria-label":"Complete one step",onClick:()=>r(o=>Math.min(w.length-1,o+1)),className:"cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800",children:"▶"}),e.jsx("span",{className:"ml-auto hidden sm:inline",children:"pin the left flank, then press ▶ — the six walk"})]}),e.jsx("div",{className:"overflow-x-auto rounded-lg border border-dashed border-neutral-300 px-4 py-5 dark:border-neutral-700",children:e.jsx(C,{steps:w,currentIndex:n,actionLabel:"Action Required"})})]})},me=`import React, { useState } from "react";
import { CondensedStepper, type StepperStep } from "@cjlapao/ui-kit";

/**
 * The honest flanks and the conveyor, in motion: pin the left flank and
 * press ▶ — the quiet motif (three ticks, two dots) never moves, the
 * summary counts the truth, and the revealed six nearest the anchor
 * slide one notch: the newcomer springs in, the oldest drifts out.
 */
const STEPS: StepperStep[] = [
  { id: "setup", title: "Setup", status: "completed" },
  { id: "fetch", title: "Fetch issues", status: "completed" },
  { id: "plan", title: "Plan", status: "completed" },
  { id: "pr", title: "Create PR", status: "completed" },
  { id: "code", title: "Create code", status: "completed" },
  { id: "tests", title: "Unit tests", status: "completed" },
  { id: "lint", title: "Lint", status: "completed" },
  { id: "sec", title: "Secure code", status: "completed" },
  { id: "deps", title: "Scan deps", status: "completed" },
  { id: "gate", title: "Approve Gate", status: "error" },
  { id: "sign", title: "Sign Key" },
  { id: "deploy", title: "Deploy" },
];

const WatchRun: React.FC = () => {
  const [current, setCurrent] = useState(9);
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
        <button
          type="button"
          aria-label="Undo one step"
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          ◀
        </button>
        <span className="w-16 text-center tabular-nums">
          step {current + 1} / {STEPS.length}
        </span>
        <button
          type="button"
          aria-label="Complete one step"
          onClick={() => setCurrent((c) => Math.min(STEPS.length - 1, c + 1))}
          className="cursor-pointer rounded-md border border-neutral-200 px-2 py-0.5 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          ▶
        </button>
        <span className="ml-auto hidden sm:inline">
          pin the left flank, then press ▶ — the six walk
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-dashed border-neutral-300 px-4 py-5 dark:border-neutral-700">
        <CondensedStepper
          steps={STEPS}
          currentIndex={current}
          actionLabel="Action Required"
        />
      </div>
    </div>
  );
};

export default WatchRun;
`,je=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(X,{name:"CondensedStepper",description:"The stepper that fits on one line: the current step anchored in the middle, the walked steps compressed left, the queue compressed right — and each flank an accordion on ExpandableButton's spring table. Hover to peek, click to pin, Esc to close; the flanks are exclusive and the centre pill squishes to make room. The card and the panel are the same component — the container decides how much condenses, never the behaviour."}),e.jsx(ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx($,{title:"Watch the run",description:"The strip tells the truth at every scale: the quiet motif (three ticks, two dots) only indicates, the summaries count, and the revealed six nearest the anchor walk — complete a step and the newcomer springs in while the oldest drifts out. Hover an item to expand its title on the same spring.",code:me,filename:"WatchRun.tsx",children:e.jsx(he,{})}),e.jsx($,{title:"Run cards",description:"Card size (size='sm'): three runs of the same component — idle-ready, gate-halted (the rose ring is the error status speaking, not a bespoke border), and a longer queue folded into +N.",code:ue,filename:"RunCards.tsx",children:e.jsx(pe,{})})]}),e.jsx(Z,{props:[{name:"steps",type:"StepperStep[]",description:"The same StepperStep the Stepper wears — id, title, optional status. Position, not status, draws the flanks: everything left of the anchor is walked, everything right is queued; statuses only colour what is there."},{name:"currentIndex / currentStepId",type:"number / string",description:"Where the anchor sits. The id wins when both are given; the index clamps into range; with neither, the first step not yet completed — and when every step is done, the last one, so the strip ends on its final ✓ rather than on nothing."},{name:"openZone / onOpenChange / expandOn",type:'"past" | "future" | null / (zone) => void / "hover" | "click"',description:"The flanks are exclusive by construction — one value owns the reveal either way. Hover peeks, click pins, Esc closes the pin. Controlled (openZone set), interactions only report the ask. A flank of three or fewer shows everything it has: no button, no tooltip, no reveal — not even a controlled ask forces open nothing to reveal."},{name:"pastSummary / futureSummary / actionLabel",type:"ReactNode",default:"auto counts / —",description:"The true counts (✓ 9 done, +2 pending) unless overridden. actionLabel dresses the centre chip when the anchor needs attention — its rose is the status speaking, never a bespoke border."},{name:"tone / doneColor / nextColor",type:"TrueColor",default:'"blue" / "emerald" / "gray"',description:"tone dresses the centre pill (and the surface borders); doneColor fills the walked ticks, nextColor the queue dots — solid swatches with their own diffusion, the ColorSwatches language. The signals stay semantic: error is rose, completed is emerald, whatever the dress."},{name:"size / mode / variant",type:"ControlSize / 'panel' | 'card' / SurfaceVariant",default:'"md" / "panel" / "outlined"',description:"mode is the condensation: the panel reveals titled items, the card is the chip (one disc per flank, expansion folds the anchor to its index). variant is the shared surface vocabulary the Panel wears — the centre pill and every revealed badge dress from it; the glass pair takes the Pill's own recipe (a control's blur and frosted fill, not a card's)."},{name:"stretch / maxSteps",type:"boolean / number",default:"panel: true / 6",description:"The panel is a ruler: five tracks — flank, dash, anchor, dash, flank — and the squeeze is one spring transition on the template: the open side's dash runs to its 15px floor first, the anchor yields next, the far dash last. maxSteps caps what a flank may reveal (the nearest six; +N carries the rest)."},{name:"interactive / onStepSelect",type:"boolean / (step, index) => void",description:"interactive={false} is a readout: no buttons, nothing opens, spans only. Revealed items are buttons only when onStepSelect is wired — otherwise they stay selectable text."},{name:"onDoneHover / onCurrentHover / onNextHover",type:"(boolean) => void",description:"Pure observation on the two flanks and the anchor — they report what the user is doing and command nothing; they keep firing even on flanks too small to expand."},{name:"spring / springDuration / animated",type:"ExpandableButtonSpring / number / boolean",default:'"bouncy" / table / true',description:"The one shared spring table ExpandableButton reads from, delivered as inline custom properties the stylesheet defaults — reveal, template squeeze and the conveyor's fido all ride it. animated={false} drops the variables and the stylesheet drops the transitions; reduced motion settles at 200ms."}]}),e.jsxs(J,{children:[e.jsx(g,{title:"Screen reader",children:e.jsxs("p",{children:["The strip is a ",e.jsx(a,{children:"group"})," whose label names the anchor and its place: ",e.jsx(a,{children:"step 10 of 12"}),". The centre wears ",e.jsx(a,{children:"aria-current"}),"; a flank that can reveal is a real ",e.jsx(a,{children:"button"})," with"," ",e.jsx(a,{children:"aria-expanded"})," and ",e.jsx(a,{children:"aria-controls"})," — the closed accordion is ",e.jsx(a,{children:"aria-hidden"})," and ",e.jsx(a,{children:"inert"}),", so a screen reader never walks content the eye cannot see. A flank of three or fewer is a plain read span: no button promising a reveal with nothing to reveal. Revealed items are ",e.jsx(a,{children:"button"}),"s only when"," ",e.jsx(a,{children:"onStepSelect"})," is wired; otherwise selectable spans."]})}),e.jsx(g,{title:"Keyboard support",children:e.jsxs("p",{children:[e.jsx(a,{children:"Tab"})," reaches the flank buttons; ",e.jsx(a,{children:"←"}),"/",e.jsx(a,{children:"→"})," jump between them; ",e.jsx(a,{children:"Enter"}),"/",e.jsx(a,{children:"Space"})," pin (hover still peeks,"," ",e.jsx(a,{children:"Esc"})," releases the pin). Focusing a badge expands its title the same way hovering does — ",e.jsx(a,{children:":focus-visible"})," rides the same grid track, so the keyboard reads what the mouse reveals. The strip delegates ",e.jsx(a,{children:"Esc"})," and the arrows without trapping keys it does not own."]})}),e.jsx(g,{title:"Motion",children:e.jsxs("p",{children:["Every fold — accordion, template squeeze, conveyor — rides one spring table delivered as inline custom properties."," ",e.jsx(a,{children:"prefers-reduced-motion"})," retunes the curve to a 200ms Material settle rather than deleting it (the conveyor skips its ghost entirely); ",e.jsxs(a,{children:["animated=","{","false","}"]})," removes the variables and the stylesheet removes the transitions. Nothing animates a number: widths spring, content arrives complete."]})})]})]});export{je as CondensedStepperPage,je as default};
