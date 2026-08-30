import{r as n,j as e,e as d,bF as c,b as F,au as R}from"./index-p9Bv1Pn1.js";import{P as I}from"./PageHeader-DCZtzAyX.js";import{E as j}from"./ExampleCard-BS13YSEO.js";import{P as A,a as o,C as D,T as r}from"./PlaygroundPanel-BDClNSzf.js";import{t as k,n as M}from"./options-Bqu3_N-h.js";const B=()=>{const[a,s]=n.useState(!0),[h,w]=n.useState("sidebar"),[i,y]=n.useState("blue"),[u,S]=n.useState("neutral"),[x,N]=n.useState("md"),[m,C]=n.useState("right"),[p,P]=n.useState(!0),[g,z]=n.useState(!1),[f,O]=n.useState(!0),[l,T]=n.useState("auto"),[v,E]=n.useState("rounded-md");return e.jsx(A,{controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:F.map(t=>({label:t,value:t})),value:h,onChange:t=>w(t)}),e.jsx(o,{label:"Accent tone",options:k,value:i,onChange:t=>y(t)}),e.jsx(o,{label:"Surface tone",options:k,value:u,onChange:t=>S(t)}),e.jsx(o,{label:"Size",options:M,value:x,onChange:t=>N(t)}),e.jsx(o,{label:"Corner",options:R.map(t=>({label:t,value:t})),value:v,onChange:t=>E(t)}),e.jsx(o,{label:"Inset",options:[{label:"auto (from variant)",value:"auto"},{label:"on",value:"on"},{label:"off",value:"off"}],value:l,onChange:t=>T(t)}),e.jsx(o,{label:"Side",options:[{label:"right",value:"right"},{label:"left",value:"left"}],value:m,onChange:t=>C(t)}),e.jsx(D,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(r,{label:"Open",checked:a,onChange:s}),e.jsx(r,{label:"Resizable",checked:p,onChange:P}),e.jsx(r,{label:"Footer",checked:f,onChange:O}),e.jsx(r,{label:"Noise texture",checked:g,onChange:z})]})}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["It is ",e.jsx("code",{children:"position: absolute"}),", so it fills its container rather than the viewport and needs a positioned ancestor — the bordered box in the preview. Overlaying rather than occupying a column means opening it never reflows the content beside it."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The variants are ",e.jsx("code",{children:"SideMenu"}),"’s, not"," ",e.jsx("code",{children:"Panel"}),"’s — a docked panel and a docked menu are the same object. ",e.jsx("strong",{children:"Inset"})," floats it off the top and bottom while it stays flush to its own edge — the corners that meet the container have nothing to round against, so only the two facing the content are rounded, on the same ",e.jsx("code",{children:"SurfaceCorner"})," scale"," ",e.jsx("code",{children:"Panel"})," takes."," ",e.jsx("code",{children:"floating"})," and ",e.jsx("code",{children:"floating-glass"})," inset themselves, and the toggle overrides them either way."]})]}),preview:e.jsxs("div",{className:"relative h-80 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:[e.jsxs("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsx("p",{className:"font-medium",children:"Page content"}),e.jsx("p",{className:"mt-1",children:"The panel overlays this rather than pushing it aside, so nothing below reflows when it opens."}),e.jsx(d,{className:"mt-3",size:"xs",variant:"outline",color:i,onClick:()=>s(t=>!t),children:a?"Close panel":"Open panel"})]}),e.jsx(c,{isOpen:a,onClose:()=>s(!1),title:"Details",subtitle:"Everything about this record",variant:h,tone:i,surfaceTone:u,size:x,side:m,resizable:p,noise:g,inset:l==="auto"?void 0:l==="on",corner:v,width:280,footer:f?e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(d,{size:"xs",variant:"ghost",color:i,children:"Cancel"}),e.jsx(d,{size:"xs",variant:"solid",color:i,children:"Save"})]}):void 0,children:e.jsxs("div",{className:"space-y-3 p-4 text-sm",children:[e.jsx("p",{children:"Panel body. Scrolls independently of the page behind it."}),Array.from({length:6}).map((t,b)=>e.jsxs("p",{className:"text-neutral-500 dark:text-neutral-400",children:["Row ",b+1]},b))]})})]})})};function V(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["right","left"].map(a=>e.jsxs("div",{className:"relative h-56 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:[e.jsxs("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:["Docked ",a]}),e.jsx(c,{isOpen:!0,side:a,title:a,width:180,children:e.jsx("div",{className:"p-4 text-sm",children:"Panel body"})})]},a))})}const _=`import { SidePanel } from "@cjlapao/ui-kit";

/**
 * The panel docks to either edge. It is \`position: absolute\`, so it fills the
 * container it is placed in — the bordered boxes here — rather than the
 * viewport, and needs a positioned ancestor.
 *
 * Overlaying rather than occupying a column is the point: opening it never
 * reflows the content beside it, so nothing jumps.
 */
export default function Sides() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {(["right", "left"] as const).map((side) => (
        <div
          key={side}
          className="relative h-56 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700"
        >
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            Docked {side}
          </div>
          <SidePanel isOpen side={side} title={side} width={180}>
            <div className="p-4 text-sm">Panel body</div>
          </SidePanel>
        </div>
      ))}
    </div>
  );
}
`;function H(){const a=["sidebar","floating","floating-glass"];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:a.map(s=>e.jsxs("div",{className:"relative h-56 overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-br from-sky-100 to-violet-100 dark:border-neutral-700 dark:from-sky-950 dark:to-violet-950",children:[e.jsx("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:s}),e.jsx(c,{isOpen:!0,variant:s,title:s,width:150,children:e.jsx("div",{className:"p-4 text-sm",children:"Panel body"})})]},s))})}const U=`import { SidePanel } from "@cjlapao/ui-kit";

/**
 * The surface family is \`SideMenu\`'s, not \`Panel\`'s — a docked panel and a
 * docked menu are the same object with different content, and dressing them
 * from two vocabularies made them look like unrelated components.
 *
 * \`floating\` and \`floating-glass\` bring the detached-card geometry: the panel
 * lifts off the top and bottom while staying flush to its own edge, and rounds
 * the two corners facing the content — the other two meet the container and
 * have nothing to round against. That comes from the variant's own tokens, so
 * they are inset by default exactly as they are on \`SideMenu\`; \`inset\` sets it
 * explicitly on any variant, in either direction, and \`radius\` sizes the
 * corners.
 */
export default function Floating() {
  const variants = ["sidebar", "floating", "floating-glass"] as const;

  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      {variants.map((variant) => (
        <div
          key={variant}
          className="relative h-56 overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-br from-sky-100 to-violet-100 dark:border-neutral-700 dark:from-sky-950 dark:to-violet-950"
        >
          <div className="p-4 text-sm text-neutral-600 dark:text-neutral-300">
            {variant}
          </div>
          <SidePanel isOpen variant={variant} title={variant} width={150}>
            <div className="p-4 text-sm">Panel body</div>
          </SidePanel>
        </div>
      ))}
    </div>
  );
}
`,L=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Side Panel",description:"A panel docked to either edge of its container. It overlays rather than occupying a column, so opening it never reflows the content beside it, and it can be drag-resized. Takes SideMenu's surface family — a docked panel and a docked menu are the same object — plus the kit's tone and size scales."}),e.jsx(B,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(j,{title:"Either edge",description:"side='right' or 'left'. It is absolutely positioned, so it fills the container it is placed in and needs a positioned ancestor.",code:_,filename:"Sides.tsx",children:e.jsx(V,{})}),e.jsx(j,{title:"Floating and inset",description:"floating and floating-glass lift the panel off the top and bottom while it stays flush to its edge, rounding only the two corners that face the content. The inset prop sets that on any variant; radius sizes the corners.",code:U,filename:"Floating.tsx",children:e.jsx(H,{})})]})]});export{L as SidePanelPage,L as default};
