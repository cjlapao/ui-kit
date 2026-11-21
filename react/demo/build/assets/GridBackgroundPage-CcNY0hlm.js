import{r as l,j as e,P as g,b as u,C as G,A as v}from"./index-ChbzYKtA.js";import{P as T}from"./PageHeader-CORco2N-.js";import{E as x}from"./ExampleCard-Db5NXgWv.js";import{A,a as f,C as n,b as R,K as F,P as L}from"./A11ySections-Ci0MCORB.js";import{G as o,g as D,q as E}from"./options-C-rzDbtC.js";import{P as $,C as j,a as s}from"./PlaygroundPanel-CZxrTOj5.js";import{C as O}from"./ControlAccordion-DoyyLWlc.js";const M=()=>{const[a,r]=l.useState("grid"),[d,k]=l.useState(32),[c,C]=l.useState(20),[b,S]=l.useState("cyan"),[p,z]=l.useState(1.5),[i,N]=l.useState("radial"),[h,B]=l.useState(25),P=[a==="dots"?`dots ${p}px`:"grid",`${d}px`,`${c}%`,i==="none"?"no fade":`${i} fade`].join(" · ");return e.jsx($,{hideBackgroundToggle:!0,controls:e.jsx(O,{groups:[{id:"lattice",title:"Lattice",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Pattern",options:D,value:a,onChange:t=>r(t)}),e.jsx(s,{label:`Spacing: ${d}px`,children:e.jsx(u,{ariaLabel:"Lattice spacing",min:8,max:96,value:d,onChange:t=>k(t)})}),e.jsx(s,{label:`Opacity: ${c}%`,children:e.jsx(u,{ariaLabel:"Lattice opacity",max:100,value:c,onChange:t=>C(t)})}),e.jsx(s,{label:"Tone",children:e.jsx(G,{selectable:!0,size:"sm",value:b,onSelect:S,defaultExpanded:!0})})]})},...a==="dots"?[{id:"dots",title:"Dots",defaultOpen:!0,controls:e.jsx(s,{label:`Dot radius: ${p}px`,children:e.jsx(u,{ariaLabel:"Dot radius",min:.5,max:8,step:.25,value:p,onChange:t=>z(t)})})}]:[],{id:"fade",title:"Edge fade",defaultOpen:!0,controls:e.jsxs(e.Fragment,{children:[e.jsx(j,{label:"Fade",options:E,value:i,onChange:t=>N(t)}),i!=="none"&&e.jsx(s,{label:`Fade start: ${h}%`,children:e.jsx(u,{ariaLabel:"Fade start",max:85,value:h,onChange:t=>B(t)})})]})}]}),preview:e.jsxs("div",{className:"relative h-72 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:[e.jsx(o,{pattern:a,size:d,dotSize:p,lineColor:`var(--color-${b}-500)`,opacity:c/100,fade:i,fadeStart:h}),e.jsx("div",{className:"relative flex h-full items-center justify-center p-4",children:e.jsx(g,{variant:"elevated",corner:"rounded-lg",padding:"sm",children:e.jsx("p",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-200",children:P})})})]})})},y=({label:a,pattern:r})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:[e.jsx(o,{pattern:r,size:24,lineColor:"var(--color-cyan-500)",opacity:.35,dotSize:1.5}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:a})]});function q(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(y,{label:'pattern="grid"',pattern:"grid"}),e.jsx(y,{label:'pattern="dots"',pattern:"dots"})]})}const I=`import React from "react";
import { GridBackground, type GridBackgroundPattern } from "@cjlapao/ui-kit";

const Cell: React.FC<{ label: string; pattern: GridBackgroundPattern }> = ({
  label,
  pattern,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      pattern={pattern}
      size={24}
      lineColor="var(--color-cyan-500)"
      opacity={0.35}
      dotSize={1.5}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function GridVsDots() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Cell label={'pattern="grid"'} pattern="grid" />
      <Cell label={'pattern="dots"'} pattern="dots" />
    </div>
  );
}
`,m=({label:a,fade:r})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:[e.jsx(o,{size:20,lineColor:"var(--color-violet-500)",opacity:.4,fade:r,fadeStart:10}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:a})]});function W(){return e.jsxs("div",{className:"flex w-full max-w-2xl flex-col gap-2 sm:flex-row",children:[e.jsx(m,{label:'fade="none"',fade:"none"}),e.jsx(m,{label:'fade="radial"',fade:"radial"}),e.jsx(m,{label:'fade="vertical"',fade:"vertical"})]})}const V=`import React from "react";
import { GridBackground } from "@cjlapao/ui-kit";

const Cell: React.FC<{
  label: string;
  fade: "none" | "radial" | "vertical";
}> = ({ label, fade }) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      size={20}
      lineColor="var(--color-violet-500)"
      opacity={0.4}
      fade={fade}
      fadeStart={10}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Fades() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-2 sm:flex-row">
      <Cell label={'fade="none"'} fade="none" />
      <Cell label={'fade="radial"'} fade="radial" />
      <Cell label={'fade="vertical"'} fade="vertical" />
    </div>
  );
}
`,w=({label:a,size:r})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:[e.jsx(o,{pattern:"dots",size:r,dotSize:1.5,lineColor:"var(--color-amber-500)",opacity:.5}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:a})]});function H(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(w,{label:"size 12 · dotSize 1.5",size:12}),e.jsx(w,{label:"size 64 · dotSize 1.5",size:64})]})}const K=`import React from "react";
import { GridBackground } from "@cjlapao/ui-kit";

const Cell: React.FC<{ label: string; size: number }> = ({ label, size }) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
    <GridBackground
      pattern="dots"
      size={size}
      dotSize={1.5}
      lineColor="var(--color-amber-500)"
      opacity={0.5}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Scale() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Cell label="size 12 · dotSize 1.5" size={12} />
      <Cell label="size 64 · dotSize 1.5" size={64} />
    </div>
  );
}
`;function _(){return e.jsxs("div",{className:"relative h-56 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950",children:[e.jsx(o,{pattern:"dots",size:20,dotSize:1.25,lineColor:"var(--color-cyan-500)",opacity:.5,fade:"radial",fadeStart:20}),e.jsxs("div",{className:"relative flex h-full items-center justify-center gap-3 p-4",children:[e.jsx(g,{variant:"elevated",corner:"rounded-lg",padding:"sm",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(v,{size:28,tone:"cyan"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:"Builder"}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Implementing checkout"})]})]})}),e.jsx(g,{variant:"elevated",corner:"rounded-lg",padding:"sm",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(v,{size:28,tone:"amber",paused:!0}),e.jsxs("div",{children:[e.jsx("p",{className:"text-sm font-semibold text-neutral-900 dark:text-neutral-100",children:"Reviewer"}),e.jsx("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Waiting for approval"})]})]})})]})]})}const J=`import { AiRobot, GridBackground, Panel } from "@cjlapao/ui-kit";

/**
 * What \`AgentMap\` draws with \`grid={{ pattern: "dots" }}\`: the lattice is
 * atmosphere, not content — dots on the crossings read as a coordinate field
 * under the hubs, and stay out of the way of whatever floats above them.
 */
export default function BehindSurface() {
  return (
    <div className="relative h-56 w-full max-w-lg overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
      <GridBackground
        pattern="dots"
        size={20}
        dotSize={1.25}
        lineColor="var(--color-cyan-500)"
        opacity={0.5}
        fade="radial"
        fadeStart={20}
      />
      <div className="relative flex h-full items-center justify-center gap-3 p-4">
        <Panel variant="elevated" corner="rounded-lg" padding="sm">
          <div className="flex items-center gap-3">
            <AiRobot size={28} tone="cyan" />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Builder
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Implementing checkout
              </p>
            </div>
          </div>
        </Panel>
        <Panel variant="elevated" corner="rounded-lg" padding="sm">
          <div className="flex items-center gap-3">
            <AiRobot size={28} tone="amber" paused />
            <div>
              <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Reviewer
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Waiting for approval
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
`,Q=`// The layer is decoration: aria-hidden and pointer-events: none are set
// by the component — never label it, and never put a control inside it.
<div className="relative">            {/* positioned parent to fill */}
  <GridBackground pattern="dots" size={20} fade="radial" />
  <Panel variant="elevated">Real content, above the lattice.</Panel>
</div>`,ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(T,{name:"Grid Background",description:`The decorative lattice behind the Agent Map's hubs, on its own: a square grid of lines, or — with pattern="dots" — a dot on each of the squares' cardinal points. One spacing scale drives both, so switching pattern in place keeps every crossing exactly where it was. Colour, opacity and an edge fade are shared; it fills the nearest positioned parent, or wraps its children instead.`}),e.jsx(M,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(x,{title:"Grid vs dots",description:"Same spacing, colour and opacity, both patterns. The dots are not centred in the squares — each tile paints the quarter of a dot at its origin and the three abutting tiles complete it, so a dot lands on the point where the lines used to cross.",code:I,filename:"GridVsDots.tsx",children:e.jsx(q,{})}),e.jsx(x,{title:"Edge fades",description:"`fade` dissolves the lattice before it reaches the edges: `radial` from the centre out, `vertical` from top and bottom in, `none` for a hard fill. `fadeStart` is the percentage that stays solid before the fade begins.",code:V,filename:"Fades.tsx",children:e.jsx(W,{})}),e.jsx(x,{title:"Scale",description:"`size` is the lattice pitch; `dotSize` is an absolute radius in pixels. Widening the grid spreads the dots but never grows them — the dots stay 1.5px, so a loose lattice reads as sparse rather than blotchy.",code:K,filename:"Scale.tsx",children:e.jsx(H,{})}),e.jsx(x,{title:"Behind a surface",description:'What `AgentMap` renders with `grid={{ pattern: "dots" }}` — dots as atmosphere under floating panels. The layer is `pointer-events: none` and `aria-hidden`, so panels above it keep every click and stay the only thing a screen reader finds.',code:J,filename:"BehindSurface.tsx",children:e.jsx(_,{})})]}),e.jsxs(A,{children:[e.jsxs(f,{title:"Screen reader",children:[e.jsxs("p",{children:["The lattice paints one"," ",e.jsx(n,{children:'<div aria-hidden="true">'})," ","with ",e.jsx(n,{children:"pointer-events: none"}),": no role, no name, nothing focusable. It is decoration, and the component sets both itself — a host that labelled it would be announcing a gradient to someone who cannot see it."]}),e.jsxs("p",{children:["Because the layer sits under the content, whatever you render as"," ",e.jsx(n,{children:"children"})," (or as a sibling above it) is the only thing in the accessibility tree. Absolutely positioned fills need a positioned parent — the component defaults to ",e.jsx(n,{children:'position="absolute"'})," with"," ",e.jsx(n,{children:"inset: 0"}),"; ",e.jsx(n,{children:'position="relative"'})," makes it a normal wrapper instead."]}),e.jsx(R,{filename:"Naming.tsx",code:Q})]}),e.jsxs(f,{title:"Keyboard Support",children:[e.jsxs("p",{children:["The layer is not interactive and never receives focus, so there is nothing to bind: ",e.jsx(n,{children:"children"})," are ordinary document content and follow whatever they are."]}),e.jsx(F,{bindings:[{keys:["tab"],action:e.jsx(e.Fragment,{children:"Skips the layer entirely — no focusable element inside it. Children move through the tab order on their own rules."})}]})]}),e.jsx(f,{title:"Internationalization",children:e.jsxs("p",{children:["The component speaks no strings, so there is nothing to translate and nothing in the kit catalog to override. Text it happens to sit behind is host-owned and follows the host's own locale. All geometry is physical CSS pixels, so the lattice is direction-neutral: RTL, LTR and"," ",e.jsx(n,{children:'fade="vertical"'})," render identically."]})})]}),e.jsx(L,{props:[{name:"pattern",type:'"grid" | "dots"',default:'"grid"',description:"The lattice to draw. Dots sit on the crossings of the same grid, so switching patterns in place keeps the lattice aligned."},{name:"size",type:"number",default:"32",description:"Lattice pitch in CSS pixels, shared by both patterns. Non-finite or non-positive values fall back to 32."},{name:"lineColor",type:"string",default:'"currentColor"',description:"CSS colour of the lines — or of the dots. Any value works, including a theme variable such as var(--color-cyan-500)."},{name:"dotSize",type:"number",default:"1",description:"Dot radius in CSS pixels; inert for the grid pattern. Clamped to 0.25px–half the spacing, so a dot always reads as a point."},{name:"opacity",type:"number",default:"0.12",description:"Layer opacity, clamped to 0–1."},{name:"fade",type:'"none" | "radial" | "vertical"',default:'"none"',description:"Mask the lattice towards the edges — from the centre out, or from top and bottom in."},{name:"fadeStart",type:"number",default:"15",description:"Percentage of the background that stays solid before the fade begins. Clamped to 0–85."},{name:"position",type:'"absolute" | "relative"',default:'"absolute"',description:"Fill the nearest positioned parent (inset 0, pointer-events none), or stay in flow and wrap children."},{name:"children",type:"ReactNode",default:"undefined",description:"Optional content to render above the lattice, in the same wrapper."},{name:"…HTMLAttributes<HTMLDivElement>",type:"div attributes",description:"Everything else — className, style, data-* — lands on the outer wrapper, not on the aria-hidden layer."}]})]});export{ne as GridBackgroundPage,ne as default};
