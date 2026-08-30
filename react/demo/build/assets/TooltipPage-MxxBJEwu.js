import{j as e,aa as T,a7 as k,r,e as a,b_ as v,b$ as j,k as m}from"./index-p9Bv1Pn1.js";import{P as B}from"./PageHeader-DCZtzAyX.js";import{E as h}from"./ExampleCard-BS13YSEO.js";import{P as N,S as g,C as b,T as C}from"./PlaygroundPanel-BDClNSzf.js";import{C as I}from"./ControlAccordion-CydkdljU.js";const o=({text:t,delay:p=500,position:s="top",variant:u="surface",offset:i,margin:d,boundary:n,wrapperClassName:f,children:l})=>t?e.jsx(T,{text:t,delay:p,position:s,variant:u,offset:i,margin:d,boundary:n,children:e.jsx("div",{tabIndex:0,className:k("relative inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",f),children:l})}):e.jsx(e.Fragment,{children:l}),P=v.map(t=>({label:t,value:t})),S=j.map(t=>({label:t,value:t})),O=()=>{const[t,p]=r.useState("top"),[s,u]=r.useState("surface"),[i,d]=r.useState(300),[n,f]=r.useState(8),[l,y]=r.useState(!0),[x,w]=r.useState(null);return e.jsx(N,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(I,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Preferred side",options:P,value:t,onChange:c=>p(c)}),e.jsx(g,{label:"Variant",options:S,value:s,onChange:c=>u(c)})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:`Delay — ${i}ms`,children:e.jsx("input",{type:"range",min:0,max:1200,step:100,value:i,className:"w-full",onChange:c=>d(Number(c.target.value))})}),e.jsx(b,{label:`Gap — ${n}px`,children:e.jsx("input",{type:"range",min:0,max:24,value:n,className:"w-full",onChange:c=>f(Number(c.target.value))})}),e.jsx(b,{label:"Boundary",children:e.jsx(C,{label:"Constrain to the box",checked:l,onChange:y})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The side is a ",e.jsx("strong",{children:"preference"}),": each trigger keeps the side it can and flips when it cannot. Collision is measured against the ",e.jsx("strong",{children:"viewport"})," by default — so with the boundary off, these triggers have room in every direction and nothing flips, however close to the box edge they look. Turn it on to collide against the dashed area instead."]})]}),preview:e.jsxs("div",{ref:w,className:"relative h-64 w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600",children:[e.jsx("span",{className:"absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs opacity-50",children:l?"boundary: this box":"boundary: the whole window"}),e.jsx("div",{className:"absolute left-1/2 top-1 -translate-x-1/2",children:e.jsx(o,{text:"top edge of the boundary",position:t,variant:s,delay:i,offset:n,boundary:l?x:void 0,children:e.jsx(a,{variant:"soft",size:"sm",children:"top edge"})})}),e.jsx("div",{className:"absolute left-1/2 bottom-1 -translate-x-1/2",children:e.jsx(o,{text:"bottom edge of the boundary",position:t,variant:s,delay:i,offset:n,boundary:l?x:void 0,children:e.jsx(a,{variant:"soft",size:"sm",children:"bottom edge"})})}),e.jsx("div",{className:"absolute left-1 top-1/2 -translate-y-1/2",children:e.jsx(o,{text:"left edge — the box clamps, the arrow slides",position:t,variant:s,delay:i,offset:n,boundary:l?x:void 0,children:e.jsx(a,{variant:"soft",size:"sm",children:"left edge"})})}),e.jsx("div",{className:"absolute right-1 top-1/2 -translate-y-1/2",children:e.jsx(o,{text:"right edge — same, mirrored",position:t,variant:s,delay:i,offset:n,boundary:l?x:void 0,children:e.jsx(a,{variant:"soft",size:"sm",children:"right edge"})})})]})})};function D(){return e.jsx(o,{text:"Tooltips show a helpful hint when the trigger is hovered.",children:e.jsx(a,{variant:"solid",color:"blue",children:"Hover me"})})}const R=`import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <Tooltip text="Tooltips show a helpful hint when the trigger is hovered.">
      <Button variant="solid" color="blue">
        Hover me
      </Button>
    </Tooltip>
  );
}
`;function L(){return e.jsx("div",{className:"flex flex-wrap gap-3",children:v.map(t=>e.jsx(o,{text:`Preferred side: ${t}`,position:t,delay:200,children:e.jsx(a,{variant:"soft",color:"blue",children:t})},t))})}const A=`import { Button, Tooltip, TOOLTIP_POSITIONS } from "@cjlapao/ui-kit";

/**
 * Four sides. \`left\` and \`right\` did not exist before — the type was
 * \`"top" | "bottom"\` only.
 *
 * Each is a *preference*: the tooltip flips to the opposite side when there is
 * no room, then to a perpendicular one if neither vertical side fits, and
 * clamps inside the viewport either way.
 */
export default function Position() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLTIP_POSITIONS.map((position) => (
        <Tooltip key={position} text={\`Preferred side: \${position}\`} position={position} delay={200}>
          <Button variant="soft" color="blue">
            {position}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
`;function V(){return e.jsx("div",{className:"flex flex-wrap gap-3",children:j.map(t=>e.jsx(o,{text:`This is the ${t} look`,variant:t,delay:200,children:e.jsx(a,{variant:"soft",color:"violet",children:t})},t))})}const $=`import { Button, Tooltip, TOOLTIP_VARIANTS } from "@cjlapao/ui-kit";

/**
 * \`surface\` follows the theme — a light card in light mode, a dark one in
 * dark mode. \`inverted\` contrasts against the page instead, which is the
 * classic tooltip convention.
 *
 * The component used to be \`bg-neutral-900 … dark:bg-neutral-700\`: dark in
 * *both* themes, with no light appearance at all. Toggle the page theme to
 * see the difference.
 */
export default function Variants() {
  return (
    <div className="flex flex-wrap gap-3">
      {TOOLTIP_VARIANTS.map((variant) => (
        <Tooltip key={variant} text={\`This is the \${variant} look\`} variant={variant} delay={200}>
          <Button variant="soft" color="violet">
            {variant}
          </Button>
        </Tooltip>
      ))}
    </div>
  );
}
`;function E(){const[t,p]=r.useState(null),[s,u]=r.useState(!0),i=[["left-2 top-2","top-left"],["right-2 top-2","top-right"],["bottom-2 left-2","bottom-left"],["bottom-2 right-2","bottom-right"]];return e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsxs("label",{className:"flex items-center gap-2 text-xs",children:[e.jsx("input",{type:"checkbox",checked:s,onChange:d=>u(d.target.checked)}),"Constrain to the dashed box",e.jsx("span",{className:"opacity-60",children:"— off, collision is measured against the whole window, so nothing flips"})]}),e.jsx("div",{ref:p,className:"relative h-56 w-full rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500",children:i.map(([d,n])=>e.jsx("div",{className:`absolute ${d}`,children:e.jsx(o,{text:`${n} — asked for top`,position:"top",delay:150,boundary:s?t:void 0,children:e.jsx(a,{variant:"soft",size:"sm",children:n})})},n))})]})}const z=`import { useState } from "react";
import { Button, Tooltip } from "@cjlapao/ui-kit";

/**
 * Every trigger asks for \`top\`. Only the ones with room above get it.
 *
 * The \`boundary\` prop is what makes this demonstrable on a page: collision is
 * measured against the viewport by default, so triggers sitting at the corners
 * of a box in the middle of a tall page have room in every direction and
 * nothing ever flips. Passing the box as the boundary makes the tooltip flip
 * and clamp against *that* edge instead — which is also what you want for a
 * tooltip inside a scroll container, a panel or a modal.
 *
 * The boundary is intersected with the viewport, so a bounded tooltip still
 * never leaves the screen.
 */
export default function Collision() {
  // A callback ref in state, not \`useRef\`: a ref's \`.current\` is null during
  // the first render, so passing it straight to \`boundary\` would silently do
  // nothing until an unrelated re-render happened to fill it in.
  const [box, setBox] = useState<HTMLDivElement | null>(null);
  const [bounded, setBounded] = useState(true);

  const corners = [
    ["left-2 top-2", "top-left"],
    ["right-2 top-2", "top-right"],
    ["bottom-2 left-2", "bottom-left"],
    ["bottom-2 right-2", "bottom-right"],
  ] as const;

  return (
    <div className="flex w-full flex-col gap-3">
      <label className="flex items-center gap-2 text-xs">
        <input
          type="checkbox"
          checked={bounded}
          onChange={(e) => setBounded(e.target.checked)}
        />
        Constrain to the dashed box
        <span className="opacity-60">
          — off, collision is measured against the whole window, so nothing flips
        </span>
      </label>

      <div
        ref={setBox}
        className="relative h-56 w-full rounded-lg border border-dashed border-neutral-400 dark:border-neutral-500"
      >
        {corners.map(([pos, label]) => (
          <div key={label} className={\`absolute \${pos}\`}>
            <Tooltip
              text={\`\${label} — asked for top\`}
              position="top"
              delay={150}
              boundary={bounded ? box : undefined}
            >
              <Button variant="soft" size="sm">
                {label}
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
`;function _(){return e.jsxs(e.Fragment,{children:[e.jsx(o,{text:"No delay — I show the instant you hover.",delay:0,children:e.jsx(a,{variant:"outline",color:"blue",children:"Delay: 0ms"})}),e.jsx(o,{text:"Half a second of patience.",delay:500,children:e.jsx(a,{variant:"outline",color:"blue",children:"Delay: 500ms"})}),e.jsx(o,{text:"Keep hovering a full second before I appear.",delay:1e3,children:e.jsx(a,{variant:"outline",color:"blue",children:"Delay: 1000ms"})})]})}const H=`import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Delay() {
  return (
    <>
      <Tooltip text="No delay — I show the instant you hover." delay={0}>
        <Button variant="outline" color="blue">
          Delay: 0ms
        </Button>
      </Tooltip>
      <Tooltip text="Half a second of patience." delay={500}>
        <Button variant="outline" color="blue">
          Delay: 500ms
        </Button>
      </Tooltip>
      <Tooltip text="Keep hovering a full second before I appear." delay={1000}>
        <Button variant="outline" color="blue">
          Delay: 1000ms
        </Button>
      </Tooltip>
    </>
  );
}
`;function F(){return e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(o,{text:"Refresh the list",children:e.jsx(m,{icon:"Refresh",variant:"soft",color:"blue",srLabel:"Refresh"})}),e.jsx(o,{text:"Download as CSV",children:e.jsx(m,{icon:"Download",variant:"soft",color:"blue",srLabel:"Download"})}),e.jsx(o,{text:"Remove the item",children:e.jsx(m,{icon:"Trash",variant:"soft",color:"rose",srLabel:"Remove"})})]})}const K=`import { IconButton, Tooltip } from "@cjlapao/ui-kit";

export default function IconButtons() {
  return (
    <div className="flex items-center gap-2">
      <Tooltip text="Refresh the list">
        <IconButton icon="Refresh" variant="soft" color="blue" srLabel="Refresh" />
      </Tooltip>
      <Tooltip text="Download as CSV">
        <IconButton icon="Download" variant="soft" color="blue" srLabel="Download" />
      </Tooltip>
      <Tooltip text="Remove the item">
        <IconButton icon="Trash" variant="soft" color="rose" srLabel="Remove" />
      </Tooltip>
    </div>
  );
}
`,Q=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Tooltip",description:"A hover-and-focus hint rendered in a portal — zero impact on layout. It takes a preferred side and flips when there is no room, clamps inside the viewport, and slides its caret to keep pointing at the trigger. The geometry is shared with the Vue kit and tested as pure math."}),e.jsx(O,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(h,{title:"Basic",description:"Wrap a trigger and pass the hint text. The tooltip shows after a 500ms hover delay.",code:R,filename:"Basic.tsx",children:e.jsx(D,{})}),e.jsx(h,{title:"Position",description:"Anchor the hint above or below the trigger with the position prop.",code:A,filename:"Position.tsx",children:e.jsx(L,{})}),e.jsx(h,{title:"Both looks",description:"`surface` follows the theme; `inverted` contrasts against the page. It used to be dark in both themes, with no light appearance at all — toggle the page theme to compare.",code:$,filename:"Variants.tsx",children:e.jsx(V,{})}),e.jsx(h,{title:"Collision handling",description:"All four ask for `top`; only the ones with room get it. Collision is measured against the viewport by default — tick the box to constrain it to the dashed area instead, which is what makes the flipping visible here and what you want inside a scroll container or modal.",code:z,filename:"Collision.tsx",children:e.jsx(E,{})}),e.jsx(h,{title:"Delay",description:"Tune how long the user must hover before the hint appears.",code:H,filename:"Delay.tsx",children:e.jsx(_,{})}),e.jsx(h,{title:"On icon buttons",description:"The classic use case: labelling icon-only controls that carry no text of their own.",code:K,filename:"IconButtons.tsx",children:e.jsx(F,{})})]})]});export{Q as TooltipPage,Q as default};
