import{r as a,j as e,P as N,C as l,M as O,o as P,p as Z}from"./index-BqiwG-pR.js";import{P as B,S as b,C as k,T as t,a as F,E as d}from"./PlaygroundPanel-DuiPtEP5.js";import{t as $,n as q}from"./options-CD99P1yv.js";const x=Object.keys(Z).sort(),C=({children:s})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s}),H=x.map(s=>({label:s,value:s})),K=()=>{const[s,c]=a.useState("Notification"),[i,y]=a.useState("md"),[r,S]=a.useState("blue"),[p,w]=a.useState(!0),[f,z]=a.useState(!1),[o,I]=a.useState(!1),[u,T]=a.useState(!1),[m,E]=a.useState(!1),[g,R]=a.useState(!1),[h,A]=a.useState(!1),[v,D]=a.useState(""),[G,L]=a.useState(0),j=a.useMemo(()=>{const n=v.trim().toLowerCase();return n?x.filter(M=>M.toLowerCase().includes(n)):x},[v]);return e.jsx(B,{controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Icon",options:H,value:s,onChange:n=>c(n)}),!o&&e.jsx(b,{label:"Tone",options:$,value:r,onChange:n=>S(n)}),e.jsx(k,{label:"Size",children:e.jsx(O,{fullWidth:!0,size:"sm",options:q,value:i,onChange:n=>y(n)})}),e.jsx(k,{label:"Filter the gallery",children:e.jsx(P,{size:"sm",color:r,debounceMs:0,placeholder:"Search icons...",onSearch:D})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(t,{label:"Use tone",checked:p,onChange:w}),e.jsx(t,{label:"Hover colour",checked:f,onChange:z}),e.jsx(t,{label:"Keep own colours",checked:o,onChange:I}),e.jsx(t,{label:"Spin",checked:u,onChange:T}),e.jsx(t,{label:"Clickable",checked:m,onChange:E}),e.jsx(t,{label:"Disabled",checked:g,onChange:R}),e.jsx(t,{label:"Accessible name",checked:h,onChange:A})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Without an ",e.jsx("strong",{children:"accessible name"})," the icon is decoration and hidden from assistive tech; with one it is announced as an image. ",e.jsx("strong",{children:"Clickable"})," renders a real"," ",e.jsx("code",{children:"<button>"}),", so it is reachable by keyboard.",m&&` Clicked ${G}×.`]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(N,{variant:"outlined",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(C,{children:"Current settings"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(l,{icon:s,size:i,tone:p&&!o?r:void 0,hoverColor:f?"#f43f5e":void 0,colored:o,spin:u,disabled:g,alt:h?`${s} icon`:void 0,onClick:m?()=>L(n=>n+1):void 0}),e.jsx("span",{className:"text-xs opacity-60",children:s})]})]})}),e.jsx(N,{variant:"outlined",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsxs(C,{children:["Registry — ",j.length," of ",x.length]}),e.jsx("div",{className:"grid max-h-72 grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-2 overflow-y-auto",children:j.map(n=>e.jsxs("button",{type:"button",onClick:()=>c(n),className:"flex flex-col items-center gap-1 rounded-lg p-2 text-center transition hover:bg-black/5 dark:hover:bg-white/10",children:[e.jsx(l,{icon:n,size:"md",tone:p&&!o?r:void 0,colored:o}),e.jsx("span",{className:"w-full truncate text-[10px] opacity-60",children:n})]},n))})]})})]})})},U=["xs","sm","md","lg","xl"];function W(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsx("div",{className:"flex items-end gap-4",children:U.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Rocket",size:s,tone:"indigo"}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))}),e.jsx("div",{className:"flex items-end gap-4",children:e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Rocket",customSize:48,tone:"indigo"}),e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:["customSize=","{48}"]})]})})]})}const _=`import { CustomIcon } from "@cjlapao/ui-kit";
import type { IconSize } from "@cjlapao/ui-kit";

const SIZES: IconSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function SizeLadder() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex items-end gap-4">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <CustomIcon icon="Rocket" size={size} tone="indigo" />
            <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              {size}
            </span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-4">
        <div className="flex flex-col items-center gap-2">
          <CustomIcon icon="Rocket" customSize={48} tone="indigo" />
          <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
            customSize={"{48}"}
          </span>
        </div>
      </div>
    </div>
  );
}
`,J=["blue","rose","amber"];function Q(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Theme tones"}),e.jsx("div",{className:"flex items-end gap-4",children:J.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Globe",size:"lg",tone:s}),e.jsx("span",{className:"text-[11px] opacity-60",children:s})]},s))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Raw colour — wins over tone"}),e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Globe",size:"lg",color:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:'color="#f43f5e"'})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Globe",size:"lg",color:"#0ea5e9",hoverColor:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"hover → rose"})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Keep own colours — no tinting at all"}),e.jsx(l,{icon:"Globe",size:"lg",colored:!0})]})]})}const V=`import { CustomIcon } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";

const TONES: TrueColor[] = ["blue", "rose", "amber"];

export default function Tinting() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Theme tones
        </p>
        <div className="flex items-end gap-4">
          {TONES.map((tone) => (
            <div key={tone} className="flex flex-col items-center gap-2">
              <CustomIcon icon="Globe" size="lg" tone={tone} />
              <span className="text-[11px] opacity-60">{tone}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Raw colour — wins over tone
        </p>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Globe" size="lg" color="#f43f5e" />
            <span className="text-[11px] opacity-60">color="#f43f5e"</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Globe" size="lg" color="#0ea5e9" hoverColor="#f43f5e" />
            <span className="text-[11px] opacity-60">hover → rose</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Keep own colours — no tinting at all
        </p>
        <CustomIcon icon="Globe" size="lg" colored />
      </div>
    </div>
  );
}
`;function X(){const[s,c]=a.useState(0);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Clickable — renders a real button"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(l,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",onClick:()=>c(i=>i+1)}),e.jsx("span",{className:"text-xs opacity-60",children:s===0?"Click me":`Clicked ${s}×`})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Disabled and spinning"}),e.jsxs("div",{className:"flex items-end gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",disabled:!0,onClick:()=>c(i=>i+1)}),e.jsx("span",{className:"text-[11px] opacity-60",children:"disabled"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"Refresh",size:"lg",tone:"blue",spin:!0,alt:"Syncing"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"spin"})]})]})]})]})}const Y=`import { useState } from "react";
import { CustomIcon } from "@cjlapao/ui-kit";

export default function ButtonMode() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Clickable — renders a real button
        </p>
        <div className="flex items-center gap-4">
          <CustomIcon
            icon="Trash"
            size="lg"
            tone="rose"
            alt="Delete"
            onClick={() => setClicks((n) => n + 1)}
          />
          <span className="text-xs opacity-60">
            {clicks === 0 ? "Click me" : \`Clicked \${clicks}×\`}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Disabled and spinning
        </p>
        <div className="flex items-end gap-6">
          <div className="flex flex-col items-center gap-2">
            <CustomIcon
              icon="Trash"
              size="lg"
              tone="rose"
              alt="Delete"
              disabled
              onClick={() => setClicks((n) => n + 1)}
            />
            <span className="text-[11px] opacity-60">disabled</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Refresh" size="lg" tone="blue" spin alt="Syncing" />
            <span className="text-[11px] opacity-60">spin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
`,ee=["xs","sm","md","lg","xl"];function se(){return e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("p",{className:"text-xs opacity-70",children:"A name that is not in the registry renders a monogram fallback that keeps the requested size — the layout around it does not collapse."}),e.jsx("div",{className:"flex items-end gap-4",children:ee.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(l,{icon:"NotAnIcon",size:s}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))})]})}const ne=`import { CustomIcon } from "@cjlapao/ui-kit";
import type { IconName, IconSize } from "@cjlapao/ui-kit";

const SIZES: IconSize[] = ["xs", "sm", "md", "lg", "xl"];

export default function Fallback() {
  return (
    <div className="flex w-full flex-col gap-2">
      <p className="text-xs opacity-70">
        A name that is not in the registry renders a monogram fallback that
        keeps the requested size — the layout around it does not collapse.
      </p>
      <div className="flex items-end gap-4">
        {SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <CustomIcon icon={"NotAnIcon" as IconName} size={size} />
            <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
              {size}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
`,ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(F,{name:"Custom Icon",description:"Renders any icon in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons, and a missing name falls back to a size-preserving monogram."}),e.jsx(K,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Size ladder",description:"The shared control scale from a 16px hairline icon to 32px, plus an explicit pixel override with customSize.",code:_,filename:"SizeLadder.tsx",children:e.jsx(W,{})}),e.jsx(d,{title:"Tinting",description:"Theme tones, a raw colour that wins over tone (with a hover colour), and colored, which keeps the icon's own colours.",code:V,filename:"Tinting.tsx",children:e.jsx(Q,{})}),e.jsx(d,{title:"Button mode",description:"onClick turns the icon into a real, keyboard-reachable button — with a disabled state, and spin for in-flight actions.",code:Y,filename:"ButtonMode.tsx",children:e.jsx(X,{})}),e.jsx(d,{title:"Unknown icon",description:"A name that is not in the registry falls back to a monogram that keeps the requested size.",code:ne,filename:"Fallback.tsx",children:e.jsx(se,{})})]})]});export{ie as CustomIconPage,ie as default};
