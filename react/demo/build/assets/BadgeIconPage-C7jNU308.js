import{r as a,j as e,bd as n,M as m,I as p,C as B,v as I}from"./index-BBK6HA-D.js";import{P as w}from"./PageHeader-BcBcU29I.js";import{E as s}from"./ExampleCard-BVwGIEPO.js";import{P as L,C as k,a as i,S as x,T}from"./ControlAccordion-DallGojj.js";import{t as f}from"./options-D-FMIizr.js";const y=[{label:"Bell",value:"Notification"},{label:"Chat",value:"Chat"},{label:"Users",value:"Users"},{label:"Star",value:"Star"}],S=[{label:"Top start",value:"top-start"},{label:"Top end",value:"top-end"},{label:"Bottom start",value:"bottom-start"},{label:"Bottom end",value:"bottom-end"}],D=()=>{const[t,l]=a.useState("Notification"),[c,h]=a.useState("red"),[d,v]=a.useState("blue"),[u,C]=a.useState(5),[r,j]=a.useState(99),[b,N]=a.useState("top-end"),[g,P]=a.useState(!1);return e.jsx(L,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(k,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Icon",children:e.jsx(m,{fullWidth:!0,size:"sm",options:y,value:t,onChange:o=>l(o)})}),e.jsx(x,{label:"Badge tone",options:f,value:c,onChange:o=>h(o)})]})},{id:"icons",title:"Icons",controls:e.jsx(x,{label:"Icon color",options:f,value:d,onChange:o=>v(o)})},{id:"content",title:"Content",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Count",children:e.jsx(p,{size:"sm",type:"number",value:u,onChange:o=>C(Number(o.target.value))})}),e.jsx(i,{label:"Max count",children:e.jsx(p,{size:"sm",type:"number",value:r,onChange:o=>j(Number(o.target.value))})})]})},{id:"layout",title:"Layout",controls:e.jsx(i,{label:"Position",children:e.jsx(m,{fullWidth:!0,size:"sm",options:S,value:b,onChange:o=>N(o)})})},{id:"states",title:"States",controls:e.jsx(T,{label:"Dot only",checked:g,onChange:P})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["A count above max count renders as ",r,"+. A count of 0 hides the badge unless Dot only is on."]})]}),preview:e.jsx("div",{className:"flex h-40 w-40 items-center justify-center",children:e.jsx(n,{icon:t,srLabel:"Badge icon preview",color:d,badgeCount:u,badgeDot:g,badgePosition:b,badgeProps:{tone:c,maxCount:r}})})})};function O(){return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{icon:"Notification",srLabel:"Notifications",color:"blue",badgeCount:5,badgeProps:{tone:"rose"}}),e.jsx(n,{icon:"Chat",srLabel:"Messages",color:"blue",badgeCount:12,badgeProps:{tone:"blue"}}),e.jsx(n,{icon:"Users",srLabel:"Team",color:"emerald",badgeDot:!0,badgeProps:{tone:"emerald"}}),e.jsx(n,{icon:"Search",srLabel:"Search",color:"neutral"})]})}const z=`import { BadgeIcon } from "@cjlapao/ui-kit";

export default function Notifications() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="Notification"
        srLabel="Notifications"
        color="blue"
        badgeCount={5}
        badgeProps={{ tone: "rose" }}
      />
      <BadgeIcon
        icon="Chat"
        srLabel="Messages"
        color="blue"
        badgeCount={12}
        badgeProps={{ tone: "blue" }}
      />
      <BadgeIcon
        icon="Users"
        srLabel="Team"
        color="emerald"
        badgeDot
        badgeProps={{ tone: "emerald" }}
      />
      <BadgeIcon icon="Search" srLabel="Search" color="neutral" />
    </div>
  );
}
`,M=[{value:"top-start",label:"Top start"},{value:"top-end",label:"Top end"},{value:"bottom-start",label:"Bottom start"},{value:"bottom-end",label:"Bottom end"}];function R(){return e.jsx("div",{className:"flex items-center gap-10",children:M.map(({value:t,label:l})=>e.jsxs("div",{className:"flex flex-col items-center gap-3",children:[e.jsx(n,{icon:"Notification",srLabel:l,color:"blue",badgeCount:3,badgePosition:t}),e.jsx("span",{className:"text-[10px] font-medium text-neutral-500 dark:text-neutral-400",children:l})]},t))})}const U=`import { BadgeIcon } from "@cjlapao/ui-kit";

const positions = [
  { value: "top-start", label: "Top start" },
  { value: "top-end", label: "Top end" },
  { value: "bottom-start", label: "Bottom start" },
  { value: "bottom-end", label: "Bottom end" },
] as const;

export default function Positions() {
  return (
    <div className="flex items-center gap-10">
      {positions.map(({ value, label }) => (
        <div key={value} className="flex flex-col items-center gap-3">
          <BadgeIcon
            icon="Notification"
            srLabel={label}
            color="blue"
            badgeCount={3}
            badgePosition={value}
          />
          <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
`;function A(){return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{icon:"Notification",srLabel:"Unread (dot)",color:"blue",badgeDot:!0,badgeProps:{tone:"red"}}),e.jsx(n,{icon:"Notification",srLabel:"No unread",color:"blue",badgeCount:0}),e.jsx(n,{icon:"Notification",srLabel:"99+ unread",color:"blue",badgeCount:1240,badgeProps:{tone:"red",maxCount:99}})]})}const E=`import { BadgeIcon } from "@cjlapao/ui-kit";

export default function DotZeroOverflow() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="Notification"
        srLabel="Unread (dot)"
        color="blue"
        badgeDot
        badgeProps={{ tone: "red" }}
      />
      <BadgeIcon
        icon="Notification"
        srLabel="No unread"
        color="blue"
        badgeCount={0}
      />
      <BadgeIcon
        icon="Notification"
        srLabel="99+ unread"
        color="blue"
        badgeCount={1240}
        badgeProps={{ tone: "red", maxCount: 99 }}
      />
    </div>
  );
}
`;function Z(){return e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(n,{icon:"CheckCircle",srLabel:"Verified",color:"emerald",badgeContent:e.jsx(B,{icon:"Check",className:"h-2 w-2 text-white"}),badgeProps:{tone:"emerald"}}),e.jsx(n,{icon:"Rocket",srLabel:"Plan",color:"violet",badgeContent:e.jsx("span",{className:"rounded-full bg-violet-600 px-1.5 text-[9px] font-bold leading-4 text-white",children:"PRO"})}),e.jsx(n,{icon:"Settings",srLabel:"Settings",color:"blue",badgeContent:e.jsx(I,{tone:"amber",variant:"soft",size:"xs",children:"3"})})]})}const V=`import { BadgeIcon, CustomIcon, Pill } from "@cjlapao/ui-kit";

export default function CustomBadge() {
  return (
    <div className="flex items-center gap-4">
      <BadgeIcon
        icon="CheckCircle"
        srLabel="Verified"
        color="emerald"
        badgeContent={
          <CustomIcon icon="Check" className="h-2 w-2 text-white" />
        }
        badgeProps={{ tone: "emerald" }}
      />
      <BadgeIcon
        icon="Rocket"
        srLabel="Plan"
        color="violet"
        badgeContent={
          <span className="rounded-full bg-violet-600 px-1.5 text-[9px] font-bold leading-4 text-white">
            PRO
          </span>
        }
      />
      <BadgeIcon
        icon="Settings"
        srLabel="Settings"
        color="blue"
        badgeContent={<Pill tone="amber" variant="soft" size="xs">3</Pill>}
      />
    </div>
  );
}
`,W=["neutral","red","rose","orange","amber","emerald","teal","blue","indigo","violet","fuchsia"];function $(){return e.jsx("div",{className:"flex flex-wrap items-center gap-4",children:W.map(t=>e.jsx(n,{icon:"Notification",srLabel:`Badge tone ${t}`,color:"neutral",badgeCount:9,badgeProps:{tone:t}},t))})}const F=`import { BadgeIcon, type TrueColor } from "@cjlapao/ui-kit";

const tones: TrueColor[] = [
  "neutral",
  "red",
  "rose",
  "orange",
  "amber",
  "emerald",
  "teal",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
];

export default function Tones() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {tones.map((tone) => (
        <BadgeIcon
          key={tone}
          icon="Notification"
          srLabel={\`Badge tone \${tone}\`}
          color="neutral"
          badgeCount={9}
          badgeProps={{ tone }}
        />
      ))}
    </div>
  );
}
`,Q=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(w,{name:"Badge Icon",description:"An icon button with a badge indicator pinned to one of its four corners. Pass a count, a dot, or any custom badge node — the count, overflow cap and tone come from the Badge vocabulary via badgeProps, and the button itself is a full IconButton, so every of its props (variant, size, loading, onClick) works as usual."}),e.jsx(D,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(s,{title:"Notifications",description:"The usual suspects in a toolbar: count badges in different tones, a dot for a bare 'there is something' signal, and a plain button with nothing to show.",code:z,filename:"Notifications.tsx",children:e.jsx(O,{})}),e.jsx(s,{title:"Positions",description:"badgePosition pins the badge to a corner — top-start, top-end (default), bottom-start or bottom-end.",code:U,filename:"Positions.tsx",children:e.jsx(R,{})}),e.jsx(s,{title:"Dot, zero and overflow",description:"A dot for a non-numeric signal, count 0 hiding the badge entirely, and a count above maxCount collapsing to the {maxCount}+ form.",code:E,filename:"DotZeroOverflow.tsx",children:e.jsx(A,{})}),e.jsx(s,{title:"Custom badge",description:"badgeContent replaces count and dot with any node — a glyph, a short label, a full mini-panel.",code:V,filename:"CustomBadge.tsx",children:e.jsx(Z,{})}),e.jsx(s,{title:"Tones",description:"The badge takes the full 21-tone palette through badgeProps — a representative spread here.",code:F,filename:"Tones.tsx",children:e.jsx($,{})})]})]});export{Q as BadgeIconPage,Q as default};
