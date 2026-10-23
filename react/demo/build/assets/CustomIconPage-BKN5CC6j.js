import{r as a,j as e,P as G,c as t,C as D,w as L}from"./index-B9JeX19j.js";import{P as O}from"./PageHeader-D-LFwZLT.js";import{E as r}from"./ExampleCard-BwESxlwz.js";import{A as q,a as x,C as n,c as m,P as M}from"./A11ySections-C9rTCDac.js";import{P as Z,S as k,a as B,T as o}from"./PlaygroundPanel-CZvYEX_V.js";import{C as F}from"./ControlAccordion-rp4gabXb.js";import{d as K}from"./options-Blq0niUd.js";const $=Object.keys(L).sort(),H=({children:s})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s}),U=()=>{const[s,c]=a.useState("Notification"),[l,y]=a.useState("md"),[h,N]=a.useState("blue"),[u,w]=a.useState(!0),[f,C]=a.useState(!1),[d,S]=a.useState(!1),[g,z]=a.useState(!1),[p,I]=a.useState(!1),[b,T]=a.useState(!1),[j,E]=a.useState(!1),[v,R]=a.useState(!1),[A,P]=a.useState(0);return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(F,{groups:[{id:"icons",title:"Icons",controls:e.jsxs(e.Fragment,{children:[e.jsx(k,{label:"Icon",options:$.map(i=>({label:i,value:i})),value:s,onChange:i=>c(i)}),e.jsx(k,{label:"Size",options:K,value:l,onChange:i=>y(i)}),e.jsx(B,{label:"Tone",children:e.jsx(D,{selectable:!0,size:"sm",value:h,onSelect:N,defaultExpanded:!0})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Use tone",checked:u,onChange:w}),e.jsx(o,{label:"Tinted",checked:!d,onChange:i=>S(!i)}),e.jsx(o,{label:"Hover colour",checked:f,onChange:C}),e.jsx(o,{label:"Spin",checked:g,onChange:z}),e.jsx(o,{label:"Clickable",checked:p,onChange:I}),e.jsx(o,{label:"Disabled",checked:b,onChange:T}),e.jsx(o,{label:"Accessible name",checked:j,onChange:E}),e.jsx(o,{label:"Glass panel",checked:v,onChange:R})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Without an ",e.jsx("strong",{children:"accessible name"})," the icon is decoration and hidden from assistive tech; with one it is announced as an image. ",e.jsx("strong",{children:"Clickable"})," renders a real"," ",e.jsx("code",{children:"<button>"}),", so it is reachable by keyboard."," ",e.jsx("strong",{children:"Spin"})," respects ",e.jsx("code",{children:"prefers-reduced-motion"}),"."," ",e.jsx("strong",{children:"Tinted"})," off keeps each icon’s own colours — multicolour glyphs never take a tone. ",e.jsx("strong",{children:"Glass panel"})," ","swaps the host between the kit’s default ",e.jsx("code",{children:"elevated"})," ","surface and ",e.jsx("code",{children:"glass"}),"; pair it with the background-image toggle.",p&&` Clicked ${A}×.`]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(G,{variant:v?"glass":"elevated",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(H,{children:"Current settings"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t,{icon:s,size:l,tone:u&&!d?h:void 0,hoverColor:f?"#f43f5e":void 0,colored:d,spin:g,disabled:b,alt:j?`${s} icon`:void 0,onClick:p?()=>P(i=>i+1):void 0}),e.jsx("span",{className:"text-xs opacity-60",children:s})]})]})})})})},W=["xs","sm","md","lg","xl"];function V(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsx("div",{className:"flex items-end gap-4",children:W.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Rocket",size:s,tone:"indigo"}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))}),e.jsx("div",{className:"flex items-end gap-4",children:e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Rocket",customSize:48,tone:"indigo"}),e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:["customSize=","{48}"]})]})})]})}const _=`import { CustomIcon } from "@cjlapao/ui-kit";
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
`,J=["blue","rose","amber"];function Q(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Theme tones"}),e.jsx("div",{className:"flex items-end gap-4",children:J.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",tone:s}),e.jsx("span",{className:"text-[11px] opacity-60",children:s})]},s))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Raw colour — wins over tone"}),e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",color:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:'color="#f43f5e"'})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",color:"#0ea5e9",hoverColor:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"hover → rose"})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Keep own colours — no tinting at all"}),e.jsx(t,{icon:"Globe",size:"lg",colored:!0})]})]})}const X=`import { CustomIcon } from "@cjlapao/ui-kit";
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
            <CustomIcon
              icon="Globe"
              size="lg"
              color="#0ea5e9"
              hoverColor="#f43f5e"
            />
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
`;function Y(){const[s,c]=a.useState(0);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Clickable — renders a real button"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",onClick:()=>c(l=>l+1)}),e.jsx("span",{className:"text-xs opacity-60",children:s===0?"Click me":`Clicked ${s}×`})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Disabled and spinning"}),e.jsxs("div",{className:"flex items-end gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",disabled:!0,onClick:()=>c(l=>l+1)}),e.jsx("span",{className:"text-[11px] opacity-60",children:"disabled"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Refresh",size:"lg",tone:"blue",spin:!0,alt:"Syncing"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"spin"})]})]})]})]})}const ee=`import { useState } from "react";
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
            <CustomIcon
              icon="Refresh"
              size="lg"
              tone="blue"
              spin
              alt="Syncing"
            />
            <span className="text-[11px] opacity-60">spin</span>
          </div>
        </div>
      </div>
    </div>
  );
}
`,se=["xs","sm","md","lg","xl"];function ne(){return e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("p",{className:"text-xs opacity-70",children:"A name that is not in the registry renders a monogram fallback that keeps the requested size — the layout around it does not collapse."}),e.jsx("div",{className:"flex items-end gap-4",children:se.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"NotAnIcon",size:s}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))})]})}const ae=`import { CustomIcon } from "@cjlapao/ui-kit";
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
`,pe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(O,{name:"Custom Icon",description:"Renders any icon in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons, and a missing name falls back to a size-preserving monogram."}),e.jsx(U,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Size ladder",description:"The shared control scale from a 16px hairline icon to 32px, plus an explicit pixel override with customSize.",code:_,filename:"SizeLadder.tsx",children:e.jsx(V,{})}),e.jsx(r,{title:"Tinting",description:"Theme tones, a raw colour that wins over tone (with a hover colour), and colored, which keeps the icon's own colours.",code:X,filename:"Tinting.tsx",children:e.jsx(Q,{})}),e.jsx(r,{title:"Button mode",description:"onClick turns the icon into a real, keyboard-reachable button — with a disabled state, and spin for in-flight actions.",code:ee,filename:"ButtonMode.tsx",children:e.jsx(Y,{})}),e.jsx(r,{title:"Unknown icon",description:"A name that is not in the registry falls back to a monogram that keeps the requested size.",code:ae,filename:"Fallback.tsx",children:e.jsx(ne,{})})]}),e.jsxs(q,{children:[e.jsxs(x,{title:"Screen reader",children:[e.jsxs("p",{children:["The ",e.jsx(n,{children:"alt"})," prop decides the icon’s whole a11y contract: omit it and the icon is ",e.jsx("em",{children:"decoration"})," — ",e.jsx(n,{children:"aria-hidden"}),", invisible to readers, which is exactly right beside a visible label and wrong standing alone. Supply it and the wrapper is ",e.jsx(n,{children:'role="img"'})," with that ",e.jsx(n,{children:"aria-label"}),", announced as one image. Inside, every glyph is"," ",e.jsx(n,{children:"aria-hidden"})," and ",e.jsx(n,{children:'focusable="false"'})," — SVG can otherwise join the tab order on old Edge/IE and hand keyboard users a stop with no name. The registry fallback (a monogram square for an unknown name) is decoration, never a guess at a name: a missing icon should not start talking."]}),e.jsxs("p",{children:[e.jsx(n,{children:"onClick"})," changes the element itself: a real"," ",e.jsx("code",{children:'<button type="button">'}),", named by"," ",e.jsx(n,{children:"alt"}),". The earlier shape — a ",e.jsx("code",{children:"span"})," with a click handler — looked identical and was unreachable; a mouse-only icon control is an accessibility bug with good pixels."]})]}),e.jsx(x,{title:"Keyboard Support",children:e.jsxs("p",{children:["Button mode inherits all of it: ",e.jsx(m,{children:"Tab"})," arrives,"," ",e.jsx(m,{children:"Enter"}),"/",e.jsx(m,{children:"Space"})," fire, and the focus indicator is"," ",e.jsx(n,{children:"focus-visible:ring-current"})," — the ring takes the tint the icon already has, so it stays visible on any tone and any host, and a mouse click does not leave it behind. ",e.jsx(n,{children:"disabled"})," is the native attribute (out of the tab order) plus ",e.jsx(n,{children:"opacity-50"}),"; the spin animation honours ",e.jsx(n,{children:"prefers-reduced-motion"})," and stops dead when the user has asked for less motion."]})}),e.jsx(x,{title:"Internationalization",children:e.jsxs("p",{children:["Icons carry no strings to localize — ",e.jsx(n,{children:"alt"})," is the caller’s text and arrives in whatever language the page runs in; localize it like any label (the i18n page shows the override route). Two directional notes: the registry itself is the language-neutral vocabulary — prefer the neutral glyphs for concepts like settings or delete; and arrow-style icons are read as meaning “back”/“next”, which flips in RTL — name them in the user’s terms via ",e.jsx(n,{children:"alt"}),", or mirror them with"," ",e.jsx(n,{children:'className="rtl:-scale-x-100"'}),". The fallback monogram uses the registry key’s first letter, not localized text — it is a broken-placeholder shape, not content."]})})]}),e.jsx(M,{props:[{name:"icon",type:"IconName",description:"Registry key. An unknown name warns once and falls back to a monogram that keeps the requested size."},{name:"alt",type:"string",description:'Accessible name. Omit for decoration (`aria-hidden`); supply for an announced `role="img"` — required in practice when `onClick` is set, or the button is unlabelled.'},{name:"size",type:"IconSize",default:'"md"',description:"The shared control scale — `md` is 24px (`h-6 w-6`). Ignored when `customSize` or a size class is given."},{name:"customSize",type:"number | string",description:"Explicit pixels or any CSS length; numbers become px. Wins over `size`."},{name:"tone",type:"TrueColor",description:"Theme tint (`text-{tone}-500`, `-400` in dark). Icons paint with `currentColor`, so the tint is just CSS colour."},{name:"color",type:"string",description:"Raw CSS colour for values outside the palette — this is *not* the `tone` alias other controls carry; it wins over `tone` and dies to `colored`."},{name:"hoverColor",type:"string",description:"Raw CSS colour on hover, carried as a custom property a `.custom-icon` rule consumes (an inline style cannot express `:hover`)."},{name:"colored",type:"boolean",default:"false",description:"Keep the icon's own colours; makes `tone`, `color` and `hoverColor` inert. For multicolour glyphs."},{name:"spin",type:"boolean",default:"false",description:"`animate-spin`, stilled by `motion-reduce:animate-none` for reduced-motion users."},{name:"onClick",type:"(event) => void",description:'Renders a real `<button type="button">` instead of a span — keyboard-reachable, named by `alt`, focus ring in the icon\'s own colour.'},{name:"disabled",type:"boolean",default:"false",description:"Native `disabled` in button mode; pointer events off + `opacity-50` in span mode."},{name:"className",type:"string",description:"Merged onto the wrapper; an explicit size class overrides `size`."}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Other HTML attributes spread through to the wrapper (span or button), so"," ",e.jsx(n,{children:"title"}),", ",e.jsx(n,{children:"id"}),", and extra aria attributes land where they should."," ",e.jsx(n,{children:"forceSvg"})," is accepted but does nothing — the registry has been component-based only since the icons were rebuilt."]})]});export{pe as CustomIconPage,pe as default};
