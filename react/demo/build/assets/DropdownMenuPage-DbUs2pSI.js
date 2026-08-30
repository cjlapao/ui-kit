import{r as n,j as e,e as c,c0 as u,M as h}from"./index-p9Bv1Pn1.js";import{P as E}from"./PageHeader-DCZtzAyX.js";import{E as j}from"./ExampleCard-BS13YSEO.js";import{P as I,C as g,T as x}from"./PlaygroundPanel-BDClNSzf.js";import{C as N}from"./ControlAccordion-CydkdljU.js";import{bs as P,bt as H,C as z,bu as A}from"./options-Bqu3_N-h.js";const U=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),L=[{label:"Profile settings",value:"profile",icon:"User",description:"Update your name and avatar"},{label:"Team members",value:"team",icon:"Users",description:"Invite and manage people"},{label:"Security",value:"security",icon:"Key"},{label:"Coming soon",value:"soon",icon:"Rocket",disabled:!0},{label:"Delete workspace",value:"delete",icon:"Trash",danger:!0}],W=()=>{const[t,s]=n.useState("end"),[l,a]=n.useState("auto"),[d,m]=n.useState("trigger"),[p,f]=n.useState("288"),[r,i]=n.useState(!0),[b,O]=n.useState(!0),[v,y]=n.useState(!0),[w,T]=n.useState(!0),[M,S]=n.useState(!1),[k,D]=n.useState(""),R=n.useRef(null),B=n.useMemo(()=>L.filter(o=>!(o.disabled&&!v||o.danger&&!w)).map(o=>({...o,icon:r?o.icon:void 0,description:b?o.description:void 0})),[r,b,v,w]);return e.jsx(I,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(N,{groups:[{id:"layout",title:"Layout",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(g,{label:"Align",children:e.jsx(h,{fullWidth:!0,size:"sm",options:P,value:t,onChange:o=>s(o)})}),e.jsx(g,{label:"Side",children:e.jsx(h,{fullWidth:!0,size:"sm",options:H,value:l,onChange:o=>a(o)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(g,{label:"Width",children:e.jsx(h,{fullWidth:!0,size:"sm",options:z,value:d,onChange:o=>m(o)})}),e.jsx(g,{label:"Max height",children:e.jsx(h,{fullWidth:!0,size:"sm",options:A,value:p,onChange:o=>f(o)})})]})]})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(x,{label:"Icons",checked:r,onChange:i}),e.jsx(x,{label:"Descriptions",checked:b,onChange:O}),e.jsx(x,{label:"Disabled item",checked:v,onChange:y}),e.jsx(x,{label:"Danger item",checked:w,onChange:T})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The ",e.jsx("strong",{children:"raw positioning layer"})," — it has no trigger of its own. Arrow keys move through the enabled items, Home/End jump, Tab or Escape close, and the menu flips sides when the viewport has no room on the requested side."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(c,{ref:R,variant:"outline",size:"sm",onClick:()=>S(o=>!o),children:M?"Hide menu":"Show menu"})}),e.jsx(u,{anchorRef:R,open:M,onClose:()=>S(!1),items:B,align:t,side:l,width:d==="trigger"?"trigger":Number(d),maxHeight:Number(p),onSelect:o=>D(typeof o.label=="string"?o.label:o.value)}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(U,{children:"Last selection"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:k||"— nothing yet —"})]})]})})},F=[{label:"Profile settings",value:"profile",icon:"User",description:"Update your name and avatar"},{label:"Team members",value:"team",icon:"Users",description:"Invite and manage people"},{label:"Security",value:"security",icon:"Key"},{label:"Coming soon",value:"soon",icon:"Rocket",disabled:!0},{label:"Delete workspace",value:"delete",icon:"Trash",danger:!0}],K=()=>{const[t,s]=n.useState(!1),l=n.useRef(null);return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-3",children:[e.jsx(c,{ref:l,variant:"outline",size:"sm",onClick:()=>s(a=>!a),children:t?"Hide menu":"Open menu"}),e.jsx(u,{anchorRef:l,open:t,onClose:()=>s(!1),items:F})]})},$=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  {
    label: "Profile settings",
    value: "profile",
    icon: "User",
    description: "Update your name and avatar",
  },
  {
    label: "Team members",
    value: "team",
    icon: "Users",
    description: "Invite and manage people",
  },
  { label: "Security", value: "security", icon: "Key" },
  { label: "Coming soon", value: "soon", icon: "Rocket", disabled: true },
  { label: "Delete workspace", value: "delete", icon: "Trash", danger: true },
];

const MenuAnatomy = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Button
        ref={anchorRef}
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide menu" : "Open menu"}
      </Button>
      <DropdownMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS}
      />
    </div>
  );
};

export default MenuAnatomy;
`,q=[{label:"Profile settings",value:"profile"},{label:"Team members",value:"team"},{label:"Billing",value:"billing"},{label:"Sign out",value:"logout",danger:!0}],_=()=>{const[t,s]=n.useState(!1),l=n.useRef(null);return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-3",children:[e.jsx(c,{ref:l,variant:"outline",size:"sm",onClick:()=>s(a=>!a),children:t?"Hide menu":"Open menu"}),e.jsx(u,{anchorRef:l,open:t,onClose:()=>s(!1),items:q})]})},G=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  { label: "Profile settings", value: "profile" },
  { label: "Team members", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "Sign out", value: "logout", danger: true },
];

const PlainItems = () => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      <Button
        ref={anchorRef}
        variant="outline"
        size="sm"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide menu" : "Open menu"}
      </Button>
      <DropdownMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
        items={ITEMS}
      />
    </div>
  );
};

export default PlainItems;
`,C=[{label:"Profile settings",value:"profile"},{label:"Team members",value:"team"},{label:"Billing",value:"billing"},{label:"Sign out",value:"logout",danger:!0}],J=()=>{const[t,s]=n.useState(!1),[l,a]=n.useState(!1),[d,m]=n.useState(!1),p=n.useRef(null),f=n.useRef(null),r=n.useRef(null);return e.jsxs("div",{className:"flex min-h-screen w-full flex-col justify-between rounded-lg border border-dashed border-slate-300/80 p-4 dark:border-slate-700",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-3 text-xs opacity-70",children:"The menu is placed against the viewport, not the page — open the bottom anchor and it flips upward, because there is no room below."}),e.jsx(c,{ref:p,variant:"outline",size:"sm",onClick:()=>s(i=>!i),children:"Top anchor"}),e.jsx(u,{anchorRef:p,open:t,onClose:()=>s(!1),items:C,align:"end",side:"auto"})]}),e.jsxs("div",{children:[e.jsx(c,{ref:f,variant:"outline",size:"sm",onClick:()=>a(i=>!i),children:"Middle anchor"}),e.jsx(u,{anchorRef:f,open:l,onClose:()=>a(!1),items:C,align:"end",side:"auto"})]}),e.jsxs("div",{children:[e.jsx(c,{ref:r,variant:"outline",size:"sm",onClick:()=>m(i=>!i),children:"Bottom anchor (flips up)"}),e.jsx(u,{anchorRef:r,open:d,onClose:()=>m(!1),items:C,align:"end",side:"auto"})]})]})},Q=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
import type { DropdownMenuOption } from "@cjlapao/ui-kit";
import { useRef, useState } from "react";

const ITEMS: DropdownMenuOption[] = [
  { label: "Profile settings", value: "profile" },
  { label: "Team members", value: "team" },
  { label: "Billing", value: "billing" },
  { label: "Sign out", value: "logout", danger: true },
];

const CollisionFlips = () => {
  const [topOpen, setTopOpen] = useState(false);
  const [midOpen, setMidOpen] = useState(false);
  const [bottomOpen, setBottomOpen] = useState(false);
  const topRef = useRef<HTMLButtonElement>(null);
  const midRef = useRef<HTMLButtonElement>(null);
  const bottomRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="flex min-h-screen w-full flex-col justify-between rounded-lg border border-dashed border-slate-300/80 p-4 dark:border-slate-700">
      <div>
        <p className="mb-3 text-xs opacity-70">
          The menu is placed against the viewport, not the page — open the
          bottom anchor and it flips upward, because there is no room below.
        </p>
        <Button
          ref={topRef}
          variant="outline"
          size="sm"
          onClick={() => setTopOpen((prev) => !prev)}
        >
          Top anchor
        </Button>
        <DropdownMenu
          anchorRef={topRef}
          open={topOpen}
          onClose={() => setTopOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
      <div>
        <Button
          ref={midRef}
          variant="outline"
          size="sm"
          onClick={() => setMidOpen((prev) => !prev)}
        >
          Middle anchor
        </Button>
        <DropdownMenu
          anchorRef={midRef}
          open={midOpen}
          onClose={() => setMidOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
      <div>
        <Button
          ref={bottomRef}
          variant="outline"
          size="sm"
          onClick={() => setBottomOpen((prev) => !prev)}
        >
          Bottom anchor (flips up)
        </Button>
        <DropdownMenu
          anchorRef={bottomRef}
          open={bottomOpen}
          onClose={() => setBottomOpen(false)}
          items={ITEMS}
          align="end"
          side="auto"
        />
      </div>
    </div>
  );
};

export default CollisionFlips;
`,oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"Dropdown Menu",description:"The raw, positioning-only menu — no trigger of its own. Align, side, width and max-height against the viewport; icons, descriptions, disabled and danger items, with full keyboard support."}),e.jsx(W,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(j,{title:"Menu anatomy",description:"Every item shape at once — icons, descriptions, a disabled row and a danger row.",code:$,filename:"MenuAnatomy.tsx",children:e.jsx(K,{})}),e.jsx(j,{title:"Plain items",description:"Label-only items for a simple action list.",code:G,filename:"PlainItems.tsx",children:e.jsx(_,{})}),e.jsx(j,{title:"Collision flips",description:"Three anchors top to bottom — the menu is placed against the viewport, so the bottom one flips upward.",code:Q,filename:"CollisionFlips.tsx",children:e.jsx(J,{})})]})]});export{oe as DropdownMenuPage,oe as default};
