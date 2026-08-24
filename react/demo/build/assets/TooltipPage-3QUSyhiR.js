import{r as n,j as t,aL as B,aM as v,e as l,M as g,i as h}from"./index-B-ieYLXc.js";import{P as D,C as j,T as I,a as P,E as u}from"./PlaygroundPanel-CkWfNJii.js";const e=({text:r,delay:p=500,position:s="top",wrapperClassName:d,children:a})=>{const i=n.useRef(null),o=n.useRef(null),[T,f]=n.useState(!1),[x,m]=n.useState(null);if(!r)return t.jsx(t.Fragment,{children:a});const y=()=>{i.current=setTimeout(()=>{if(o.current){const c=o.current.getBoundingClientRect();m({x:c.left+c.width/2,y:s==="top"?c.top:c.bottom})}f(!0)},p)},w=()=>{i.current&&(clearTimeout(i.current),i.current=null),f(!1),m(null)},b=s==="top";return t.jsxs("div",{ref:o,className:v("relative inline-flex",d),onMouseEnter:y,onMouseLeave:w,children:[a,T&&x&&B.createPortal(t.jsxs("div",{role:"tooltip",className:"pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-lg dark:bg-neutral-700",style:{left:x.x,top:x.y,transform:b?"translate(-50%, calc(-100% - 6px))":"translate(-50%, 6px)"},children:[r,t.jsx("span",{className:v("absolute left-1/2 -translate-x-1/2 border-4 border-transparent",b?"top-full border-t-neutral-900 dark:border-t-neutral-700":"bottom-full border-b-neutral-900 dark:border-b-neutral-700")})]}),document.body)]})},R=[{label:"Top",value:"top"},{label:"Bottom",value:"bottom"}],C=[{label:"0ms",value:"0"},{label:"500ms",value:"500"},{label:"1000ms",value:"1000"}],N=()=>{const[r,p]=n.useState("top"),[s,d]=n.useState(500),[a,i]=n.useState(!0);return t.jsx(D,{controls:t.jsxs(t.Fragment,{children:[t.jsx(j,{label:"Position",children:t.jsx(g,{fullWidth:!0,size:"sm",options:R,value:r,onChange:o=>p(o)})}),t.jsx(j,{label:"Delay",children:t.jsx(g,{fullWidth:!0,size:"sm",options:C,value:String(s),onChange:o=>d(Number(o))})}),t.jsx(I,{label:"Solid trigger",checked:a,onChange:i})]}),preview:t.jsx(e,{text:`I appear ${r==="top"?"above":"below"} the trigger after ${s}ms.`,position:r,delay:s,children:t.jsx(l,{variant:a?"solid":"soft",color:"blue",children:"Hover me"})})})};function k(){return t.jsx(e,{text:"Tooltips show a helpful hint when the trigger is hovered.",children:t.jsx(l,{variant:"solid",color:"blue",children:"Hover me"})})}const S=`import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <Tooltip text="Tooltips show a helpful hint when the trigger is hovered.">
      <Button variant="solid" color="blue">
        Hover me
      </Button>
    </Tooltip>
  );
}
`;function L(){return t.jsxs(t.Fragment,{children:[t.jsx(e,{text:"I appear above the trigger.",position:"top",children:t.jsx(l,{variant:"soft",color:"blue",children:"Position: top"})}),t.jsx(e,{text:"I appear below the trigger.",position:"bottom",children:t.jsx(l,{variant:"soft",color:"blue",children:"Position: bottom"})})]})}const E=`import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Position() {
  return (
    <>
      <Tooltip text="I appear above the trigger." position="top">
        <Button variant="soft" color="blue">
          Position: top
        </Button>
      </Tooltip>
      <Tooltip text="I appear below the trigger." position="bottom">
        <Button variant="soft" color="blue">
          Position: bottom
        </Button>
      </Tooltip>
    </>
  );
}
`;function H(){return t.jsxs(t.Fragment,{children:[t.jsx(e,{text:"No delay — I show the instant you hover.",delay:0,children:t.jsx(l,{variant:"outline",color:"blue",children:"Delay: 0ms"})}),t.jsx(e,{text:"Half a second of patience.",delay:500,children:t.jsx(l,{variant:"outline",color:"blue",children:"Delay: 500ms"})}),t.jsx(e,{text:"Keep hovering a full second before I appear.",delay:1e3,children:t.jsx(l,{variant:"outline",color:"blue",children:"Delay: 1000ms"})})]})}const M=`import { Button, Tooltip } from "@cjlapao/ui-kit";

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
`;function z(){return t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(e,{text:"Refresh the list",children:t.jsx(h,{icon:"Refresh",variant:"soft",color:"blue",srLabel:"Refresh"})}),t.jsx(e,{text:"Download as CSV",children:t.jsx(h,{icon:"Download",variant:"soft",color:"blue",srLabel:"Download"})}),t.jsx(e,{text:"Remove the item",children:t.jsx(h,{icon:"Trash",variant:"soft",color:"rose",srLabel:"Remove"})})]})}const F=`import { IconButton, Tooltip } from "@cjlapao/ui-kit";

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
`,V=()=>t.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[t.jsx(P,{name:"Tooltip",description:"A lightweight hover hint rendered in a portal — zero impact on layout, with viewport edge detection so it never overflows the screen. Wrap any trigger: buttons, icon buttons, fields."}),t.jsx(N,{}),t.jsxs("section",{className:"flex flex-col gap-5",children:[t.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),t.jsx(u,{title:"Basic",description:"Wrap a trigger and pass the hint text. The tooltip shows after a 500ms hover delay.",code:S,filename:"Basic.tsx",children:t.jsx(k,{})}),t.jsx(u,{title:"Position",description:"Anchor the hint above or below the trigger with the position prop.",code:E,filename:"Position.tsx",children:t.jsx(L,{})}),t.jsx(u,{title:"Delay",description:"Tune how long the user must hover before the hint appears.",code:M,filename:"Delay.tsx",children:t.jsx(H,{})}),t.jsx(u,{title:"On icon buttons",description:"The classic use case: labelling icon-only controls that carry no text of their own.",code:F,filename:"IconButtons.tsx",children:t.jsx(z,{})})]})]});export{V as TooltipPage,V as default};
