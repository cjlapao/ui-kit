import{r as a,j as e,i as c,e1 as u,b as H,C as S,cK as W}from"./index-B9JeX19j.js";import{P as K}from"./PageHeader-D-LFwZLT.js";import{E as C}from"./ExampleCard-BwESxlwz.js";import{A as _,a as h,C as n,b as N,P as B}from"./A11ySections-C9rTCDac.js";import{P as V,C as r,a as p,T as l}from"./PlaygroundPanel-CZvYEX_V.js";import{C as L}from"./ControlAccordion-rp4gabXb.js";import{d as U}from"./options-Blq0niUd.js";const q=()=>{const[s,o]=a.useState(!0),[m,P]=a.useState("sidebar"),[i,T]=a.useState("blue"),[x,z]=a.useState("neutral"),[f,E]=a.useState("md"),[g,O]=a.useState("right"),[b,A]=a.useState(!0),[v,F]=a.useState(!1),[y,R]=a.useState(!1),[j,D]=a.useState(!0),[d,I]=a.useState("auto"),[w,M]=a.useState("rounded-md");return e.jsx(V,{controls:e.jsxs(e.Fragment,{children:[e.jsx(L,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:H.map(t=>({label:t,value:t})),value:m,onChange:t=>P(t)}),e.jsx(p,{label:"Accent tone",children:e.jsx(S,{selectable:!0,size:"sm",value:i,onSelect:T,defaultExpanded:!0})}),e.jsx(p,{label:"Surface tone",children:e.jsx(S,{selectable:!0,size:"sm",value:x,onSelect:z,defaultExpanded:!0})}),e.jsx(r,{label:"Size",options:U,value:f,onChange:t=>E(t)}),e.jsx(r,{label:"Corner",options:W.map(t=>({label:t,value:t})),value:w,onChange:t=>M(t)}),e.jsx(r,{label:"Inset",options:[{label:"auto (from variant)",value:"auto"},{label:"on",value:"on"},{label:"off",value:"off"}],value:d,onChange:t=>I(t)}),e.jsx(r,{label:"Side",options:[{label:"right",value:"right"},{label:"left",value:"left"}],value:g,onChange:t=>O(t)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(p,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(l,{label:"Open",checked:s,onChange:o}),e.jsx(l,{label:"Resizable",checked:b,onChange:A}),e.jsx(l,{label:"Overlay",checked:y,onChange:R}),e.jsx(l,{label:"Footer",checked:j,onChange:D}),e.jsx(l,{label:"Noise texture",checked:v,onChange:F})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["It is ",e.jsx("code",{children:"position: absolute"}),", so it fills its container rather than the viewport and needs a positioned ancestor — the bordered box in the preview. Overlaying rather than occupying a column means opening it never reflows the content beside it."]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The variants are ",e.jsx("code",{children:"SideMenu"}),"’s, not"," ",e.jsx("code",{children:"Panel"}),"’s — a docked panel and a docked menu are the same object. ",e.jsx("strong",{children:"Inset"})," floats it off the top and bottom while it stays flush to its own edge — the corners that meet the container have nothing to round against, so only the two facing the content are rounded, on the same ",e.jsx("code",{children:"SurfaceCorner"})," ","scale ",e.jsx("code",{children:"Panel"})," takes. ",e.jsx("code",{children:"floating"})," and"," ",e.jsx("code",{children:"floating-glass"})," inset themselves, and the toggle overrides them either way."]})]}),preview:e.jsxs("div",{className:"relative h-80 w-full overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:[e.jsxs("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:[e.jsx("p",{className:"font-medium",children:"Page content"}),e.jsx("p",{className:"mt-1",children:"The panel overlays this rather than pushing it aside, so nothing below reflows when it opens."}),e.jsx(c,{className:"mt-3",size:"xs",variant:"outline",color:i,onClick:()=>o(t=>!t),children:s?"Close panel":"Open panel"})]}),e.jsx(u,{isOpen:s,onClose:()=>o(!1),title:"Details",subtitle:"Everything about this record",variant:m,tone:i,surfaceTone:x,size:f,side:g,overlay:y,resizable:b,noise:v,inset:d==="auto"?void 0:d==="on",corner:w,width:280,footer:j?e.jsxs("div",{className:"flex justify-end gap-2",children:[e.jsx(c,{size:"xs",variant:"ghost",color:i,children:"Cancel"}),e.jsx(c,{size:"xs",variant:"solid",color:i,children:"Save"})]}):void 0,children:e.jsxs("div",{className:"space-y-3 p-4 text-sm",children:[e.jsx("p",{children:"Panel body. Scrolls independently of the page behind it."}),Array.from({length:6}).map((t,k)=>e.jsxs("p",{className:"text-neutral-500 dark:text-neutral-400",children:["Row ",k+1]},k))]})})]})})};function G(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:["right","left"].map(s=>e.jsxs("div",{className:"relative h-56 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700",children:[e.jsxs("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:["Docked ",s]}),e.jsx(u,{isOpen:!0,side:s,title:s,width:180,children:e.jsx("div",{className:"p-4 text-sm",children:"Panel body"})})]},s))})}const J=`import { SidePanel } from "@cjlapao/ui-kit";

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
`;function Q(){const s=["sidebar","floating","floating-glass"];return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:s.map(o=>e.jsxs("div",{className:"relative h-56 overflow-hidden rounded-lg border border-neutral-200 bg-gradient-to-br from-sky-100 to-violet-100 dark:border-neutral-700 dark:from-sky-950 dark:to-violet-950",children:[e.jsx("div",{className:"p-4 text-sm text-neutral-600 dark:text-neutral-300",children:o}),e.jsx(u,{isOpen:!0,variant:o,title:o,width:150,children:e.jsx("div",{className:"p-4 text-sm",children:"Panel body"})})]},o))})}const X=`import { SidePanel } from "@cjlapao/ui-kit";

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
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Side Panel",description:"A panel docked to either edge of its container. It overlays rather than occupying a column, so opening it never reflows the content beside it, and it can be drag-resized. `overlay` dims the rest of the container behind a click-to-close scrim. Takes SideMenu's surface family — a docked panel and a docked menu are the same object — plus the kit's tone and size scales."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(C,{title:"Either edge",description:"side='right' or 'left'. It is absolutely positioned, so it fills the container it is placed in and needs a positioned ancestor.",code:J,filename:"Sides.tsx",children:e.jsx(G,{})}),e.jsx(C,{title:"Floating and inset",description:"floating and floating-glass lift the panel off the top and bottom while it stays flush to its edge, rounding only the two corners that face the content. The inset prop sets that on any variant; radius sizes the corners.",code:X,filename:"Floating.tsx",children:e.jsx(Q,{})})]}),e.jsxs(_,{children:[e.jsxs(h,{title:"Screen reader",children:[e.jsxs("p",{children:["The title is an ",e.jsx(n,{children:"h3"}),", the close button is named (“Close panel”, from the catalog), and a resizable panel carries a real ARIA 1.2 separator — ",e.jsx(n,{children:'role="separator"'})," with",e.jsx(n,{children:"aria-valuenow"}),"/",e.jsx(n,{children:"aria-valuemin"}),"/",e.jsx(n,{children:"aria-valuemax"}),"reporting the width in px. The overlay is ",e.jsx(n,{children:"aria-hidden"}),": it is a pointer convenience, not a control. Honest limits: the panel itself claims no landmark or dialog role — it is in-page chrome, and a closed panel unmounts to nothing, so nothing is announced at all."]}),e.jsx(N,{filename:"Semantics.tsx",code:Y})]}),e.jsxs(h,{title:"Keyboard Support",children:[e.jsxs("p",{children:["The resize grip is focusable and works without a mouse: arrows resize by 20px steps (mirrored for the docked side — a right panel grows on ArrowLeft, exactly like dragging), Home and End jump to",e.jsx(n,{children:"minWidth"})," and ",e.jsx(n,{children:"maxWidth"}),". While closed there is nothing to tab to. Two deliberate absences: there is no focus trap and no focus restore — this is a docked panel, not a dialog — and Escape is not wired. That is what ",e.jsx(n,{children:"onKeyDown"})," is for; it lands on the panel body, so a consumer’s Escape-to-close also catches keys pressed while the close button has focus. The scrim closes on click; the keyboard path is the close button."]}),e.jsx(N,{filename:"EscapeToClose.tsx",code:Z})]}),e.jsx(h,{title:"Internationalization",children:e.jsxs("p",{children:["The two strings the panel speaks — the close button’s name and the separator’s — are catalog keys (",e.jsx(n,{children:"kit.sidepanel.closeAria"}),", ",e.jsx(n,{children:"kit.sidepanel.resize"}),") shipped in all five locales; everything else, title and body included, is the caller’s content and passes through untouched. Docking is physical, not logical: ",e.jsx("code",{children:"side"})," names an edge, so mirrored layouts pick their side themselves."]})})]}),e.jsx(B,{props:[{name:"isOpen",type:"boolean",description:e.jsx(e.Fragment,{children:"Open or closed. Closed, the panel unmounts entirely once the width transition ends — no hidden tab stops."})},{name:"onClose",type:"() => void",description:"Fired by the close button — and by the overlay scrim when overlay is on."},{name:"title / subtitle / icon",type:"ReactNode",description:"Header line, a secondary line under it, an icon left of both. The title renders as h3."},{name:"headerActions",type:"ReactNode",description:"Extra nodes beside the close button — save/cancel, menus, whatever the panel is for."},{name:"footer",type:"ReactNode",description:"Sticky footer at the bottom of the panel."},{name:"width",type:"number",default:"420",description:"Panel width in px — the value the open/close transition animates."},{name:"resizable",type:"boolean",default:"false",description:e.jsxs(e.Fragment,{children:["Drag (or keyboard-resize) the outer edge. Adds the"," ",e.jsx(n,{children:'role="separator"'})," grip to the tab order."]})},{name:"minWidth / maxWidth",type:"number",default:"280 / 900",description:"Resize clamps — also what Home/End and the separator's aria values report."},{name:"variant",type:"SideMenu variant",default:"sidebar",description:"The SideMenu surface family — a docked panel and a docked menu are the same object."},{name:"surfaceTone",type:"TrueColor",default:"neutral",description:e.jsxs(e.Fragment,{children:["Tone of the ",e.jsx("em",{children:"surface"}),", separate from the accent ",e.jsx(n,{children:"tone"}),"."]})},{name:"tone",type:"TrueColor",description:e.jsxs(e.Fragment,{children:["Accent for the resize grip and close button. ",e.jsx(n,{children:"color"})," is its deprecated alias."]})},{name:"inset",type:"boolean",description:"Float off the top/bottom edges. Defaults from the variant — floating and floating-glass carry their own offset."},{name:"corner",type:"SurfaceCorner",description:"The shared corner scale Panel takes, applied to the two corners facing the content."},{name:"size",type:"ControlSize",default:"md",description:"Header padding and type scale."},{name:"side",type:'"left" | "right"',default:'"right"',description:"Which physical edge to dock to; keyboard resize directions mirror it."},{name:"noise",type:"boolean",default:"false",description:"The same dither-grain texture SideMenu paints, over the background layer."},{name:"overlay",type:"boolean",default:"false",description:"Scrim over the rest of the container — fades with the panel, click-to-close, aria-hidden. The viewport-owning modal story stays Modal's."},{name:"onKeyDown",type:"KeyboardEventHandler",description:e.jsx(e.Fragment,{children:"Fires on the panel body (close button included) — built for Escape-to-close, which the panel deliberately does not hardwire."})}]})]}),Y=`// Closed: nothing exists, nothing is announced.
<SidePanel isOpen={false} />
// Open, resizable: h3 title + named close + a valuenow-bearing separator.
<SidePanel isOpen title="Details" onClose={close} resizable width={420} />`,Z=`<SidePanel
  isOpen={open}
  onClose={() => setOpen(false)}
  overlay
  onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
  title="Details"
>
  <Editor />
</SidePanel>`;export{ie as SidePanelPage,ie as default};
