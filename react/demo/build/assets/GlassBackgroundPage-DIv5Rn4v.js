import{j as e,f as y,g as A,h as G,r as o,P as C,C as h,I as w,T as R,i as D}from"./index-gt012o8E.js";import{P as E}from"./PageHeader-CzVhyXQL.js";import{E as d}from"./ExampleCard-V3REeYJ5.js";import{P as I,a as g,C as O,T as S}from"./PlaygroundPanel-Czrs7oXC.js";import{C as $}from"./ControlAccordion-DIXHht2n.js";import{g as F}from"./options-CtADNKbm.js";const s=({position:l="absolute",color:n="blue",colorSecondary:t,colorDeep:f,direction:r="br",shimmer:x=!1,ambient:i=!0,className:b,style:c,children:p,...m})=>{const a=n,u=t??G(n),v=f??A(n),j={t:"to top",tr:"to top right",r:"to right",br:"to bottom right",b:"to bottom",bl:"to bottom left",l:"to left",tl:"to top left"},B=[{size:"w-2/3 h-2/3",style:{top:"-25%",left:"-25%"}},{size:"w-2/3 h-2/3",style:{bottom:"-25%",right:"-25%"}}];return e.jsxs("div",{className:y(l==="fixed"?"fixed inset-0 z-0":"absolute inset-0 z-0",b),style:c,...m,children:[e.jsx("div",{className:"absolute inset-0 transition-colors duration-300 dark:hidden glass-gradient",style:{"--glass-from":`var(--color-${a}-300)`,"--glass-via":`var(--color-${u}-200)`,"--glass-to":`var(--color-${v}-50)`,"--glass-angle":j[r]}}),e.jsx("div",{className:"absolute inset-0 hidden transition-colors duration-300 dark:block glass-gradient",style:{"--glass-from":`var(--color-${a}-700)`,"--glass-via":`var(--color-${u}-600)`,"--glass-to":`var(--color-${v}-800)`,"--glass-angle":j[r]}}),i&&e.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden",children:B.map(({size:z,style:T},P)=>e.jsx("div",{className:y("absolute rounded-full blur-3xl ambient-pulse ambient-glow",z),style:{...T,"--glow-color":`var(--color-${a}-400)`,"--glow-color-dark":`var(--color-${a}-500)`}},P))}),x&&e.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden","aria-hidden":"true",children:e.jsx("div",{className:"shimmer-band"})}),e.jsx("div",{className:"relative z-10",children:p})]})},q=()=>{const[l,n]=o.useState("blue"),[t,f]=o.useState("indigo"),[r,x]=o.useState("violet"),[i,b]=o.useState("br"),[c,p]=o.useState(!1),[m,a]=o.useState(!0);return e.jsx(I,{hideBackgroundToggle:!0,controls:e.jsx($,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(g,{label:"Tone",children:e.jsx(h,{selectable:!0,size:"sm",value:l,onSelect:n,defaultExpanded:!0})}),e.jsx(g,{label:"Secondary tone",children:e.jsx(h,{selectable:!0,size:"sm",value:t,onSelect:f,defaultExpanded:!0})}),e.jsx(g,{label:"Deep tone",children:e.jsx(h,{selectable:!0,size:"sm",value:r,onSelect:x,defaultExpanded:!0})}),e.jsx(O,{label:"Direction",options:F,value:i,onChange:u=>b(u)})]})},{id:"effects",title:"Effects",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(S,{label:"Shimmer",checked:c,onChange:p}),e.jsx(S,{label:"Ambient glow",checked:m,onChange:a})]})}]}),preview:e.jsx("div",{className:"relative h-72 w-full max-w-lg overflow-hidden rounded-xl",children:e.jsx(s,{color:l,colorSecondary:t,colorDeep:r,direction:i,shimmer:c,ambient:m,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx(C,{variant:"liquid-glass",corner:"rounded-lg",padding:"sm",children:e.jsxs("p",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-200",children:[l," → ",t," → ",r," · ",i]})})})})})})};function L(){const[l,n]=o.useState(!0);return e.jsx("div",{className:"relative h-96 w-full max-w-md overflow-hidden rounded-xl",children:e.jsx(s,{color:"purple",colorSecondary:"blue",colorDeep:"indigo",direction:"br",ambient:!0,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(C,{title:"Sign in",variant:"liquid-glass",corner:"rounded-lg",glassOpacity:"frosted",vibrancy:"high",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(w,{placeholder:"Email",size:"md"}),e.jsx(w,{placeholder:"Password",size:"md",type:"password"}),e.jsxs("div",{className:"flex items-center justify-between py-1",children:[e.jsx("span",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"Remember me"}),e.jsx(R,{size:"sm",color:"blue",checked:l,onChange:t=>n(t.target.checked)})]}),e.jsx(D,{fullWidth:!0,variant:"solid",color:"blue",size:"md",children:"Continue"})]})})})})})})}const V=`import { useState } from "react";
import {
  Button,
  GlassBackground,
  Input,
  Panel,
  Toggle,
} from "@cjlapao/ui-kit";

export default function SignInForm() {
  const [remembered, setRemembered] = useState(true);

  return (
    <div className="relative h-96 w-full max-w-md overflow-hidden rounded-xl">
      <GlassBackground
        color="purple"
        colorSecondary="blue"
        colorDeep="indigo"
        direction="br"
        ambient
      >
        <div className="flex h-full items-center justify-center p-4">
          <div className="w-full max-w-sm">
            <Panel
              title="Sign in"
              variant="liquid-glass"
              corner="rounded-lg"
              glassOpacity="frosted"
              vibrancy="high"
            >
              <div className="space-y-3">
                <Input placeholder="Email" size="md" />
                <Input placeholder="Password" size="md" type="password" />
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Remember me
                  </span>
                  <Toggle
                    size="sm"
                    color="blue"
                    checked={remembered}
                    onChange={(event) => setRemembered(event.target.checked)}
                  />
                </div>
                <Button fullWidth variant="solid" color="blue" size="md">
                  Continue
                </Button>
              </div>
            </Panel>
          </div>
        </div>
      </GlassBackground>
    </div>
  );
}
`,W=[{code:"t",label:"Top"},{code:"tr",label:"Top right"},{code:"r",label:"Right"},{code:"br",label:"Bottom right"},{code:"b",label:"Bottom"},{code:"bl",label:"Bottom left"},{code:"l",label:"Left"},{code:"tl",label:"Top left"}];function H(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4",children:W.map(({code:l,label:n})=>e.jsxs("div",{className:"relative h-20 overflow-hidden rounded-lg",children:[e.jsx(s,{position:"absolute",direction:l,ambient:!1}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:n})]},l))})}const J=`import { GlassBackground, type GradientDirection } from "@cjlapao/ui-kit";

const directions: { code: GradientDirection; label: string }[] = [
  { code: "t", label: "Top" },
  { code: "tr", label: "Top right" },
  { code: "r", label: "Right" },
  { code: "br", label: "Bottom right" },
  { code: "b", label: "Bottom" },
  { code: "bl", label: "Bottom left" },
  { code: "l", label: "Left" },
  { code: "tl", label: "Top left" },
];

export default function Directions() {
  return (
  <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
    {directions.map(({ code, label }) => (
      <div key={code} className="relative h-20 overflow-hidden rounded-lg">
        <GlassBackground position="absolute" direction={code} ambient={false} />
        <span className="relative z-10 flex h-full items-center justify-center px-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
      </div>
    ))}
  </div>
  );
}
`,K=[{label:"Blue · Indigo",color:"blue",colorSecondary:"indigo"},{label:"Rose · Red",color:"rose",colorSecondary:"red"},{label:"Emerald · Teal",color:"emerald",colorSecondary:"teal"},{label:"Amber · Orange",color:"amber",colorSecondary:"orange"},{label:"Violet · Purple",color:"violet",colorSecondary:"purple"},{label:"Cyan · Sky",color:"cyan",colorSecondary:"sky"}];function M(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3",children:K.map(({label:l,color:n,colorSecondary:t})=>e.jsxs("div",{className:"relative h-24 overflow-hidden rounded-lg",children:[e.jsx(s,{position:"absolute",color:n,colorSecondary:t,direction:"br",ambient:!0}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]},l))})}const Q=`import { GlassBackground, type TrueColor } from "@cjlapao/ui-kit";

const palettes: { label: string; color: TrueColor; colorSecondary: TrueColor }[] = [
  { label: "Blue · Indigo", color: "blue", colorSecondary: "indigo" },
  { label: "Rose · Red", color: "rose", colorSecondary: "red" },
  { label: "Emerald · Teal", color: "emerald", colorSecondary: "teal" },
  { label: "Amber · Orange", color: "amber", colorSecondary: "orange" },
  { label: "Violet · Purple", color: "violet", colorSecondary: "purple" },
  { label: "Cyan · Sky", color: "cyan", colorSecondary: "sky" },
];

export default function Palettes() {
  return (
  <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
    {palettes.map(({ label, color, colorSecondary }) => (
      <div key={label} className="relative h-24 overflow-hidden rounded-lg">
        <GlassBackground
          position="absolute"
          color={color}
          colorSecondary={colorSecondary}
          direction="br"
          ambient
        />
        <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
      </div>
    ))}
  </div>
  );
}
`,k=({label:l,shimmer:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(s,{position:"absolute",color:"purple",direction:"br",ambient:!0,shimmer:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function U(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(k,{label:"Shimmer off",shimmer:!1}),e.jsx(k,{label:"Shimmer on",shimmer:!0})]})}const X=`import React from "react";
import { GlassBackground } from "@cjlapao/ui-kit";

const ShimmerCell: React.FC<{ label: string; shimmer: boolean }> = ({
  label,
  shimmer,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg">
    <GlassBackground position="absolute" color="purple" direction="br" ambient shimmer={shimmer} />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function Shimmer() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <ShimmerCell label="Shimmer off" shimmer={false} />
      <ShimmerCell label="Shimmer on" shimmer />
    </div>
  );
}
`,N=({label:l,ambient:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(s,{position:"absolute",color:"blue",colorSecondary:"indigo",direction:"br",ambient:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function Y(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(N,{label:"Ambient on",ambient:!0}),e.jsx(N,{label:"Ambient off",ambient:!1})]})}const Z=`import React from "react";
import { GlassBackground } from "@cjlapao/ui-kit";

const AmbientCell: React.FC<{ label: string; ambient: boolean }> = ({
  label,
  ambient,
}) => (
  <div className="relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg">
    <GlassBackground
      position="absolute"
      color="blue"
      colorSecondary="indigo"
      direction="br"
      ambient={ambient}
    />
    <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
      {label}
    </span>
  </div>
);

export default function AmbientOff() {
  return (
    <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <AmbientCell label="Ambient on" ambient />
      <AmbientCell label="Ambient off" ambient={false} />
    </div>
  );
}
`,re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(E,{name:"Glass Background",description:"A full-bleed gradient layer that sits behind glass surfaces. Pick a primary tone (default blue), steer the gradient in eight directions, and layer ambient glows or a slow shimmer on top; the secondary and deep stops are derived neighbouring hues unless you override them. By default it fills the nearest positioned ancestor; switch it to fixed for a page-level backdrop."}),e.jsx(q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Sign-in form",description:"The classic case: a liquid-glass panel floating on the gradient, with the ambient glow breathing behind it.",code:V,filename:"SignInForm.tsx",children:e.jsx(L,{})}),e.jsx(d,{title:"Eight directions",description:"`direction` maps to a CSS gradient angle — `t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`. Bottom-right (`br`) is the default.",code:J,filename:"Directions.tsx",children:e.jsx(H,{})}),e.jsx(d,{title:"Palettes",description:"`colorSecondary` and `colorDeep` override the middle and final gradient stops. Omit either and a neighboring hue is derived from `color` automatically.",code:Q,filename:"Palettes.tsx",children:e.jsx(M,{})}),e.jsx(d,{title:"Shimmer",description:"`shimmer` adds a slow-moving light band across the surface — subtle enough to sit under glass, off by default.",code:X,filename:"Shimmer.tsx",children:e.jsx(U,{})}),e.jsx(d,{title:"Ambient off",description:"`ambient` (default on) renders two large blurred glow circles in the primary color behind the content. Turn it off for a flatter, quieter gradient.",code:Z,filename:"AmbientOff.tsx",children:e.jsx(Y,{})})]})]});export{re as GlassBackgroundPage,re as default};
