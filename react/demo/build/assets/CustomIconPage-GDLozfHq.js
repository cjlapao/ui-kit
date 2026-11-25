import{r as o,j as e,P as V,H as t,C as D,bj as A,bk as M}from"./index-CQwZVYnB.js";import{P as q}from"./PageHeader-BhZxEVHt.js";import{E as c}from"./ExampleCard-BZsKA5_g.js";import{A as B,a as m,C as n,c as x,P as O}from"./A11ySections-BXfanEck.js";import{P as Z,S as k,a as W,T as i}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as F}from"./ControlAccordion-C7vC6faF.js";import{c as U}from"./options-Byh1yOHz.js";const H=Object.keys(A).sort(),K=({children:s})=>e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s}),$=()=>{const[s,r]=o.useState("Notification"),[l,N]=o.useState("md"),[h,w]=o.useState("blue"),[u,C]=o.useState(!0),[g,S]=o.useState(!1),[d,z]=o.useState(!1),[f,I]=o.useState(!1),[p,T]=o.useState(!1),[j,R]=o.useState(!1),[b,G]=o.useState(!1),[v,L]=o.useState(!1),[P,E]=o.useState(0);return e.jsx(Z,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(F,{groups:[{id:"icons",title:"Icons",controls:e.jsxs(e.Fragment,{children:[e.jsx(k,{label:"Icon",options:H.map(a=>({label:a,value:a})),value:s,onChange:a=>r(a)}),e.jsx(k,{label:"Size",options:U,value:l,onChange:a=>N(a)}),e.jsx(W,{label:"Tone",children:e.jsx(D,{selectable:!0,size:"sm",value:h,onSelect:w,defaultExpanded:!0})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(i,{label:"Use tone",checked:u,onChange:C}),e.jsx(i,{label:"Tinted",checked:!d,onChange:a=>z(!a)}),e.jsx(i,{label:"Hover colour",checked:g,onChange:S}),e.jsx(i,{label:"Spin",checked:f,onChange:I}),e.jsx(i,{label:"Clickable",checked:p,onChange:T}),e.jsx(i,{label:"Disabled",checked:j,onChange:R}),e.jsx(i,{label:"Accessible name",checked:b,onChange:G}),e.jsx(i,{label:"Glass panel",checked:v,onChange:L})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Without an ",e.jsx("strong",{children:"accessible name"})," the icon is decoration and hidden from assistive tech; with one it is announced as an image. ",e.jsx("strong",{children:"Clickable"})," renders a real"," ",e.jsx("code",{children:"<button>"}),", so it is reachable by keyboard."," ",e.jsx("strong",{children:"Spin"})," respects ",e.jsx("code",{children:"prefers-reduced-motion"}),"."," ",e.jsx("strong",{children:"Tinted"})," off keeps each icon’s own colours — multicolour glyphs never take a tone. ",e.jsx("strong",{children:"Glass panel"})," ","swaps the host between the kit’s default ",e.jsx("code",{children:"elevated"})," ","surface and ",e.jsx("code",{children:"glass"}),"; pair it with the background-image toggle.",p&&` Clicked ${P}×.`]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(V,{variant:v?"glass":"elevated",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx(K,{children:"Current settings"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t,{icon:s,size:l,tone:u&&!d?h:void 0,hoverColor:g?"#f43f5e":void 0,colored:d,spin:f,disabled:j,alt:b?`${s} icon`:void 0,onClick:p?()=>E(a=>a+1):void 0}),e.jsx("span",{className:"text-xs opacity-60",children:s})]})]})})})})},_=["xs","sm","md","lg","xl"];function J(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsx("div",{className:"flex items-end gap-4",children:_.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Rocket",size:s,tone:"indigo"}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))}),e.jsx("div",{className:"flex items-end gap-4",children:e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Rocket",customSize:48,tone:"indigo"}),e.jsxs("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:["customSize=","{48}"]})]})})]})}const Q=`import { CustomIcon } from "@cjlapao/ui-kit";
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
`,X=["blue","rose","amber"];function Y(){return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Theme tones"}),e.jsx("div",{className:"flex items-end gap-4",children:X.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",tone:s}),e.jsx("span",{className:"text-[11px] opacity-60",children:s})]},s))})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Raw colour — wins over tone"}),e.jsxs("div",{className:"flex items-end gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",color:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:'color="#f43f5e"'})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Globe",size:"lg",color:"#0ea5e9",hoverColor:"#f43f5e"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"hover → rose"})]})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Keep own colours — no tinting at all"}),e.jsx(t,{icon:"Globe",size:"lg",colored:!0})]})]})}const ee=`import { CustomIcon } from "@cjlapao/ui-kit";
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
`;function se(){const[s,r]=o.useState(0);return e.jsxs("div",{className:"flex w-full flex-col gap-5",children:[e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Clickable — renders a real button"}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(t,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",onClick:()=>r(l=>l+1)}),e.jsx("span",{className:"text-xs opacity-60",children:s===0?"Click me":`Clicked ${s}×`})]})]}),e.jsxs("div",{className:"flex flex-col gap-2",children:[e.jsx("p",{className:"text-xs font-semibold uppercase tracking-wide opacity-70",children:"Disabled and spinning"}),e.jsxs("div",{className:"flex items-end gap-6",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Trash",size:"lg",tone:"rose",alt:"Delete",disabled:!0,onClick:()=>r(l=>l+1)}),e.jsx("span",{className:"text-[11px] opacity-60",children:"disabled"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"Refresh",size:"lg",tone:"blue",spin:!0,alt:"Syncing"}),e.jsx("span",{className:"text-[11px] opacity-60",children:"spin"})]})]})]})]})}const ne=`import { useState } from "react";
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
`,te=["xs","sm","md","lg","xl"];function oe(){return e.jsxs("div",{className:"flex w-full flex-col gap-2",children:[e.jsx("p",{className:"text-xs opacity-70",children:"A name that is not in the registry renders a monogram fallback that keeps the requested size — the layout around it does not collapse."}),e.jsx("div",{className:"flex items-end gap-4",children:te.map(s=>e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(t,{icon:"NotAnIcon",size:s}),e.jsx("span",{className:"text-[11px] font-semibold uppercase tracking-wide opacity-60",children:s})]},s))})]})}const ae=`import { CustomIcon } from "@cjlapao/ui-kit";
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
`,y=s=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",...s,children:[e.jsx("path",{d:"m12 2 9 5v10l-9 5-9-5V7Z",stroke:"currentColor",strokeWidth:"2"}),e.jsx("path",{d:"m7 12 3 3 7-7",stroke:"currentColor",strokeWidth:"2"})]});M({"Demo.ProjectLogo":y},{override:!0});function ie(){return e.jsxs("div",{className:"flex flex-wrap items-center gap-6",children:[e.jsx(t,{icon:"Demo.ProjectLogo",size:"xl",tone:"blue",alt:"Registered project logo"}),e.jsx(t,{icon:y,size:"lg",tone:"emerald",alt:"Direct project logo"}),e.jsx(t,{icon:"Demo.ProjectLogo",customSize:40,color:"#8b5cf6",spin:!0,alt:"Spinning project logo"})]})}const le=`import type { SVGProps } from "react";
import { CustomIcon, registerIcons } from "@cjlapao/ui-kit";

// A file-based SVG import also works when your bundler transforms SVGs into
// React components, e.g. import MyLogo from "./my-logo.svg?react" with SVGR.
// A plain SVG URL is not a React component.
const MyLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="m12 2 9 5v10l-9 5-9-5V7Z" stroke="currentColor" strokeWidth="2" />
    <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Register once at app startup, outside render. Names are then usable by all
// kit components that accept icon names. The generated built-ins stay intact.
// Replacing an existing name requires registerIcons(icons, { override: true }).
// The returned function removes this registration when it is no longer needed.
const unregister = registerIcons({ "Demo.ProjectLogo": MyLogo }, { override: true });
if (import.meta.hot) import.meta.hot.dispose(unregister);

export default function ConsumerIcons() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <CustomIcon icon="Demo.ProjectLogo" size="xl" tone="blue" alt="Registered project logo" />
      <CustomIcon icon={MyLogo} size="lg" tone="emerald" alt="Direct project logo" />
      <CustomIcon icon="Demo.ProjectLogo" customSize={40} color="#8b5cf6" spin alt="Spinning project logo" />
    </div>
  );
}
`,ue=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(q,{name:"Custom Icon",description:"Renders any icon in the registry. Tinted with a theme tone or a raw colour; clickable icons render as real buttons, and a missing name falls back to a size-preserving monogram."}),e.jsx($,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Size ladder",description:"The shared control scale from a 16px hairline icon to 32px, plus an explicit pixel override with customSize.",code:Q,filename:"SizeLadder.tsx",children:e.jsx(J,{})}),e.jsx(c,{title:"Tinting",description:"Theme tones, a raw colour that wins over tone (with a hover colour), and colored, which keeps the icon's own colours.",code:ee,filename:"Tinting.tsx",children:e.jsx(Y,{})}),e.jsx(c,{title:"Button mode",description:"onClick turns the icon into a real, keyboard-reachable button — with a disabled state, and spin for in-flight actions.",code:ne,filename:"ButtonMode.tsx",children:e.jsx(se,{})}),e.jsx(c,{title:"Consumer SVG icons",description:"Register React SVG components once at app startup, or pass a component directly. Forward SVG props and use currentColor to inherit tone, color and hoverColor; use colored to preserve fixed SVG colors.",code:le,filename:"ConsumerIcons.tsx",children:e.jsx(ie,{})}),e.jsx(c,{title:"Unknown icon",description:"A name that is not in the registry falls back to a monogram that keeps the requested size.",code:ae,filename:"Fallback.tsx",children:e.jsx(oe,{})})]}),e.jsxs(B,{children:[e.jsxs(m,{title:"Screen reader",children:[e.jsxs("p",{children:["The ",e.jsx(n,{children:"alt"})," prop decides the icon’s whole a11y contract: omit it and the icon is ",e.jsx("em",{children:"decoration"})," — ",e.jsx(n,{children:"aria-hidden"}),", invisible to readers, which is exactly right beside a visible label and wrong standing alone. Supply it and the wrapper is ",e.jsx(n,{children:'role="img"'})," with that ",e.jsx(n,{children:"aria-label"}),", announced as one image. Inside, every glyph is"," ",e.jsx(n,{children:"aria-hidden"})," and ",e.jsx(n,{children:'focusable="false"'})," — SVG can otherwise join the tab order on old Edge/IE and hand keyboard users a stop with no name. The registry fallback (a monogram square for an unknown name) is decoration, never a guess at a name: a missing icon should not start talking."]}),e.jsxs("p",{children:[e.jsx(n,{children:"onClick"})," changes the element itself: a real"," ",e.jsx("code",{children:'<button type="button">'}),", named by"," ",e.jsx(n,{children:"alt"}),". The earlier shape — a ",e.jsx("code",{children:"span"})," with a click handler — looked identical and was unreachable; a mouse-only icon control is an accessibility bug with good pixels."]})]}),e.jsx(m,{title:"Keyboard Support",children:e.jsxs("p",{children:["Button mode inherits all of it: ",e.jsx(x,{children:"Tab"})," arrives,"," ",e.jsx(x,{children:"Enter"}),"/",e.jsx(x,{children:"Space"})," fire, and the focus indicator is"," ",e.jsx(n,{children:"focus-visible:ring-current"})," — the ring takes the tint the icon already has, so it stays visible on any tone and any host, and a mouse click does not leave it behind. ",e.jsx(n,{children:"disabled"})," is the native attribute (out of the tab order) plus ",e.jsx(n,{children:"opacity-50"}),"; the spin animation honours ",e.jsx(n,{children:"prefers-reduced-motion"})," and stops dead when the user has asked for less motion."]})}),e.jsx(m,{title:"Internationalization",children:e.jsxs("p",{children:["Icons carry no strings to localize — ",e.jsx(n,{children:"alt"})," is the caller’s text and arrives in whatever language the page runs in; localize it like any label (the i18n page shows the override route). Two directional notes: the registry itself is the language-neutral vocabulary — prefer the neutral glyphs for concepts like settings or delete; and arrow-style icons are read as meaning “back”/“next”, which flips in RTL — name them in the user’s terms via ",e.jsx(n,{children:"alt"}),", or mirror them with"," ",e.jsx(n,{children:'className="rtl:-scale-x-100"'}),". The fallback monogram uses the registry key’s first letter, not localized text — it is a broken-placeholder shape, not content."]})})]}),e.jsx(O,{props:[{name:"icon",type:"IconName | IconComponent",description:"Built-in or consumer-registered key, or a React SVG component. Unknown names warn once and fall back to a size-preserving monogram."},{name:"alt",type:"string",description:'Accessible name. Omit for decoration (`aria-hidden`); supply for an announced `role="img"` — required in practice when `onClick` is set, or the button is unlabelled.'},{name:"size",type:"IconSize",default:'"md"',description:"The shared control scale — `md` is 24px (`h-6 w-6`). Ignored when `customSize` or a size class is given."},{name:"customSize",type:"number | string",description:"Explicit pixels or any CSS length; numbers become px. Wins over `size`."},{name:"tone",type:"TrueColor",description:"Theme tint (`text-{tone}-500`, `-400` in dark). Icons paint with `currentColor`, so the tint is just CSS colour."},{name:"color",type:"string",description:"Raw CSS colour for values outside the palette — this is *not* the `tone` alias other controls carry; it wins over `tone` and dies to `colored`."},{name:"hoverColor",type:"string",description:"Raw CSS colour on hover, carried as a custom property a `.custom-icon` rule consumes (an inline style cannot express `:hover`)."},{name:"colored",type:"boolean",default:"false",description:"Keep the icon's own colours; makes `tone`, `color` and `hoverColor` inert. For multicolour glyphs."},{name:"spin",type:"boolean",default:"false",description:"`animate-spin`, stilled by `motion-reduce:animate-none` for reduced-motion users."},{name:"onClick",type:"(event) => void",description:'Renders a real `<button type="button">` instead of a span — keyboard-reachable, named by `alt`, focus ring in the icon\'s own colour.'},{name:"disabled",type:"boolean",default:"false",description:"Native `disabled` in button mode; pointer events off + `opacity-50` in span mode."},{name:"className",type:"string",description:"Merged onto the wrapper; an explicit size class overrides `size`."}]}),e.jsxs("p",{className:"text-xs leading-6 text-neutral-600 dark:text-neutral-400",children:[e.jsx(n,{children:"registerIcons(icons, options?)"})," accepts a record of names to SVG components and returns a cleanup function. Duplicate names throw unless"," ",e.jsx(n,{children:"{ override: true }"})," is supplied; validation is atomic. Register application-wide icons before rendering, including server startup for SSR. Registrations are shared within this kit instance, so use the direct component form for request-specific icons on a server. Imported SVG files require a bundler SVG-to-React transform; URL strings and raw SVG markup are not supported."]}),e.jsxs("p",{className:"text-xs leading-6 text-neutral-600 dark:text-neutral-400",children:["Other HTML attributes spread through to the wrapper (span or button), so"," ",e.jsx(n,{children:"title"}),", ",e.jsx(n,{children:"id"}),", and extra aria attributes land where they should."," ",e.jsx(n,{children:"forceSvg"})," is accepted but does nothing — the registry has been component-based only since the icons were rebuilt."]})]});export{ue as CustomIconPage,ue as default};
