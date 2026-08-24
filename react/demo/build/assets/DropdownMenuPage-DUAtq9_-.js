import{r as n,j as e,e as c,aN as u,M as h}from"./index-BqiwG-pR.js";import{P as E,C as g,T as x,a as I,E as j}from"./PlaygroundPanel-DuiPtEP5.js";import{ag as N,ah as P,B as H,ai as z}from"./options-CD99P1yv.js";const A=({children:t})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:t}),U=[{label:"Profile settings",value:"profile",icon:"User",description:"Update your name and avatar"},{label:"Team members",value:"team",icon:"Users",description:"Invite and manage people"},{label:"Security",value:"security",icon:"Key"},{label:"Coming soon",value:"soon",icon:"Rocket",disabled:!0},{label:"Delete workspace",value:"delete",icon:"Trash",danger:!0}],L=()=>{const[t,s]=n.useState("end"),[l,a]=n.useState("auto"),[d,m]=n.useState("trigger"),[p,f]=n.useState("288"),[r,i]=n.useState(!0),[b,O]=n.useState(!0),[v,T]=n.useState(!0),[w,y]=n.useState(!0),[S,C]=n.useState(!1),[k,B]=n.useState(""),R=n.useRef(null),D=n.useMemo(()=>U.filter(o=>!(o.disabled&&!v||o.danger&&!w)).map(o=>({...o,icon:r?o.icon:void 0,description:b?o.description:void 0})),[r,b,v,w]);return e.jsx(E,{controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(g,{label:"Align",children:e.jsx(h,{fullWidth:!0,size:"sm",options:N,value:t,onChange:o=>s(o)})}),e.jsx(g,{label:"Side",children:e.jsx(h,{fullWidth:!0,size:"sm",options:P,value:l,onChange:o=>a(o)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(g,{label:"Width",children:e.jsx(h,{fullWidth:!0,size:"sm",options:H,value:d,onChange:o=>m(o)})}),e.jsx(g,{label:"Max height",children:e.jsx(h,{fullWidth:!0,size:"sm",options:z,value:p,onChange:o=>f(o)})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(x,{label:"Icons",checked:r,onChange:i}),e.jsx(x,{label:"Descriptions",checked:b,onChange:O}),e.jsx(x,{label:"Disabled item",checked:v,onChange:T}),e.jsx(x,{label:"Danger item",checked:w,onChange:y})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The ",e.jsx("strong",{children:"raw positioning layer"})," — it has no trigger of its own. Arrow keys move through the enabled items, Home/End jump, Tab or Escape close, and the menu flips sides when the viewport has no room on the requested side."]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-3",children:[e.jsx("div",{className:"flex items-center gap-3",children:e.jsx(c,{ref:R,variant:"outline",size:"sm",onClick:()=>C(o=>!o),children:S?"Hide menu":"Show menu"})}),e.jsx(u,{anchorRef:R,open:S,onClose:()=>C(!1),items:D,align:t,side:l,width:d==="trigger"?"trigger":Number(d),maxHeight:Number(p),onSelect:o=>B(typeof o.label=="string"?o.label:o.value)}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(A,{children:"Last selection"}),e.jsx("code",{className:"rounded-lg bg-black/5 px-3 py-2 text-xs dark:bg-white/10",children:k||"— nothing yet —"})]})]})})},W=[{label:"Profile settings",value:"profile",icon:"User",description:"Update your name and avatar"},{label:"Team members",value:"team",icon:"Users",description:"Invite and manage people"},{label:"Security",value:"security",icon:"Key"},{label:"Coming soon",value:"soon",icon:"Rocket",disabled:!0},{label:"Delete workspace",value:"delete",icon:"Trash",danger:!0}],F=()=>{const[t,s]=n.useState(!1),l=n.useRef(null);return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-3",children:[e.jsx(c,{ref:l,variant:"outline",size:"sm",onClick:()=>s(a=>!a),children:t?"Hide menu":"Open menu"}),e.jsx(u,{anchorRef:l,open:t,onClose:()=>s(!1),items:W})]})},K=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
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
`,$=[{label:"Profile settings",value:"profile"},{label:"Team members",value:"team"},{label:"Billing",value:"billing"},{label:"Sign out",value:"logout",danger:!0}],q=()=>{const[t,s]=n.useState(!1),l=n.useRef(null);return e.jsxs("div",{className:"flex w-full max-w-xs flex-col gap-3",children:[e.jsx(c,{ref:l,variant:"outline",size:"sm",onClick:()=>s(a=>!a),children:t?"Hide menu":"Open menu"}),e.jsx(u,{anchorRef:l,open:t,onClose:()=>s(!1),items:$})]})},_=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
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
`,M=[{label:"Profile settings",value:"profile"},{label:"Team members",value:"team"},{label:"Billing",value:"billing"},{label:"Sign out",value:"logout",danger:!0}],G=()=>{const[t,s]=n.useState(!1),[l,a]=n.useState(!1),[d,m]=n.useState(!1),p=n.useRef(null),f=n.useRef(null),r=n.useRef(null);return e.jsxs("div",{className:"flex min-h-screen w-full flex-col justify-between rounded-lg border border-dashed border-slate-300/80 p-4 dark:border-slate-700",children:[e.jsxs("div",{children:[e.jsx("p",{className:"mb-3 text-xs opacity-70",children:"The menu is placed against the viewport, not the page — open the bottom anchor and it flips upward, because there is no room below."}),e.jsx(c,{ref:p,variant:"outline",size:"sm",onClick:()=>s(i=>!i),children:"Top anchor"}),e.jsx(u,{anchorRef:p,open:t,onClose:()=>s(!1),items:M,align:"end",side:"auto"})]}),e.jsxs("div",{children:[e.jsx(c,{ref:f,variant:"outline",size:"sm",onClick:()=>a(i=>!i),children:"Middle anchor"}),e.jsx(u,{anchorRef:f,open:l,onClose:()=>a(!1),items:M,align:"end",side:"auto"})]}),e.jsxs("div",{children:[e.jsx(c,{ref:r,variant:"outline",size:"sm",onClick:()=>m(i=>!i),children:"Bottom anchor (flips up)"}),e.jsx(u,{anchorRef:r,open:d,onClose:()=>m(!1),items:M,align:"end",side:"auto"})]})]})},J=`import { Button, DropdownMenu } from "@cjlapao/ui-kit";
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
`,Y=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(I,{name:"Dropdown Menu",description:"The raw, positioning-only menu — no trigger of its own. Align, side, width and max-height against the viewport; icons, descriptions, disabled and danger items, with full keyboard support."}),e.jsx(L,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(j,{title:"Menu anatomy",description:"Every item shape at once — icons, descriptions, a disabled row and a danger row.",code:K,filename:"MenuAnatomy.tsx",children:e.jsx(F,{})}),e.jsx(j,{title:"Plain items",description:"Label-only items for a simple action list.",code:_,filename:"PlainItems.tsx",children:e.jsx(q,{})}),e.jsx(j,{title:"Collision flips",description:"Three anchors top to bottom — the menu is placed against the viewport, so the bottom one flips upward.",code:J,filename:"CollisionFlips.tsx",children:e.jsx(G,{})})]})]});export{Y as DropdownMenuPage,Y as default};
