import{j as e,e as y,r,P as C,I as w,T as A,f as G}from"./index-CASQDqc_.js";import{P as R}from"./PageHeader-DxnWpf-v.js";import{E as c}from"./ExampleCard-D_CxWJdb.js";import{P as D,S as f,T as S}from"./PlaygroundPanel-B62eNAMn.js";import{C as E}from"./ControlAccordion-BafxVZvc.js";import{t as h,g as I}from"./options-D2wLByKW.js";const i=({position:l="absolute",color:n="purple",colorSecondary:o,colorDeep:b,direction:a="br",shimmer:x=!1,ambient:d=!0,className:p,style:m,children:g,...u})=>{const s=n,t=o??O(n),v=b??F(n),j={t:"to top",tr:"to top right",r:"to right",br:"to bottom right",b:"to bottom",bl:"to bottom left",l:"to left",tl:"to top left"},B=[{size:"w-2/3 h-2/3",style:{top:"-25%",left:"-25%"}},{size:"w-2/3 h-2/3",style:{bottom:"-25%",right:"-25%"}}];return e.jsxs("div",{className:y(l==="fixed"?"fixed inset-0 z-0":"absolute inset-0 z-0",p),style:m,...u,children:[e.jsx("div",{className:"absolute inset-0 transition-colors duration-300 dark:hidden glass-gradient",style:{"--glass-from":`var(--color-${s}-300)`,"--glass-via":`var(--color-${t}-200)`,"--glass-to":`var(--color-${v}-50)`,"--glass-angle":j[a]}}),e.jsx("div",{className:"absolute inset-0 hidden transition-colors duration-300 dark:block glass-gradient",style:{"--glass-from":`var(--color-${s}-700)`,"--glass-via":`var(--color-${t}-600)`,"--glass-to":`var(--color-${v}-800)`,"--glass-angle":j[a]}}),d&&e.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden",children:B.map(({size:z,style:P},T)=>e.jsx("div",{className:y("absolute rounded-full blur-3xl ambient-pulse ambient-glow",z),style:{...P,"--glow-color":`var(--color-${s}-400)`,"--glow-color-dark":`var(--color-${s}-500)`}},T))}),x&&e.jsx("div",{className:"pointer-events-none absolute inset-0 overflow-hidden","aria-hidden":"true",children:e.jsx("div",{className:"shimmer-band"})}),e.jsx("div",{className:"relative z-10",children:g})]})};function O(l){return{purple:"blue",blue:"indigo",indigo:"violet",violet:"purple",rose:"red",emerald:"teal",teal:"emerald",amber:"orange",orange:"amber",red:"rose",cyan:"sky",sky:"cyan",lime:"green",green:"lime",neutral:"zinc",zinc:"stone",stone:"neutral",gray:"zinc"}[l]??l}function F(l){return{purple:"indigo",blue:"violet",indigo:"purple",violet:"blue",rose:"red",emerald:"green",teal:"cyan",amber:"red",orange:"amber",red:"rose",cyan:"blue",sky:"indigo",lime:"emerald",green:"emerald",neutral:"stone",zinc:"neutral",stone:"gray",gray:"neutral"}[l]??l}const $=()=>{const[l,n]=r.useState("purple"),[o,b]=r.useState("blue"),[a,x]=r.useState("indigo"),[d,p]=r.useState("br"),[m,g]=r.useState(!1),[u,s]=r.useState(!0);return e.jsx(D,{hideBackgroundToggle:!0,controls:e.jsx(E,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(f,{label:"Color",options:h,value:l,onChange:t=>n(t)}),e.jsx(f,{label:"Secondary color",options:h,value:o,onChange:t=>b(t)}),e.jsx(f,{label:"Deep color",options:h,value:a,onChange:t=>x(t)}),e.jsx(f,{label:"Direction",options:I,value:d,onChange:t=>p(t)})]})},{id:"effects",title:"Effects",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(S,{label:"Shimmer",checked:m,onChange:g}),e.jsx(S,{label:"Ambient glow",checked:u,onChange:s})]})}]}),preview:e.jsx("div",{className:"relative h-72 w-full max-w-lg overflow-hidden rounded-xl",children:e.jsx(i,{color:l,colorSecondary:o,colorDeep:a,direction:d,shimmer:m,ambient:u,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx(C,{variant:"liquid-glass",corner:"rounded-lg",padding:"sm",children:e.jsxs("p",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-200",children:[l," → ",o," → ",a," · ",d]})})})})})})};function q(){const[l,n]=r.useState(!0);return e.jsx("div",{className:"relative h-96 w-full max-w-md overflow-hidden rounded-xl",children:e.jsx(i,{color:"purple",colorSecondary:"blue",colorDeep:"indigo",direction:"br",ambient:!0,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(C,{title:"Sign in",variant:"liquid-glass",corner:"rounded-lg",glassOpacity:"frosted",vibrancy:"high",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(w,{placeholder:"Email",size:"md"}),e.jsx(w,{placeholder:"Password",size:"md",type:"password"}),e.jsxs("div",{className:"flex items-center justify-between py-1",children:[e.jsx("span",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"Remember me"}),e.jsx(A,{size:"sm",color:"blue",checked:l,onChange:o=>n(o.target.checked)})]}),e.jsx(G,{fullWidth:!0,variant:"solid",color:"blue",size:"md",children:"Continue"})]})})})})})})}const L=`import { useState } from "react";
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
`,M=[{code:"t",label:"Top"},{code:"tr",label:"Top right"},{code:"r",label:"Right"},{code:"br",label:"Bottom right"},{code:"b",label:"Bottom"},{code:"bl",label:"Bottom left"},{code:"l",label:"Left"},{code:"tl",label:"Top left"}];function V(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4",children:M.map(({code:l,label:n})=>e.jsxs("div",{className:"relative h-20 overflow-hidden rounded-lg",children:[e.jsx(i,{position:"absolute",direction:l,ambient:!1}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:n})]},l))})}const W=`import { GlassBackground, type GradientDirection } from "@cjlapao/ui-kit";

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
`,H=[{label:"Blue · Indigo",color:"blue",colorSecondary:"indigo"},{label:"Rose · Red",color:"rose",colorSecondary:"red"},{label:"Emerald · Teal",color:"emerald",colorSecondary:"teal"},{label:"Amber · Orange",color:"amber",colorSecondary:"orange"},{label:"Violet · Purple",color:"violet",colorSecondary:"purple"},{label:"Cyan · Sky",color:"cyan",colorSecondary:"sky"}];function J(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3",children:H.map(({label:l,color:n,colorSecondary:o})=>e.jsxs("div",{className:"relative h-24 overflow-hidden rounded-lg",children:[e.jsx(i,{position:"absolute",color:n,colorSecondary:o,direction:"br",ambient:!0}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]},l))})}const K=`import { GlassBackground, type TrueColor } from "@cjlapao/ui-kit";

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
`,k=({label:l,shimmer:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(i,{position:"absolute",color:"purple",direction:"br",ambient:!0,shimmer:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function Q(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(k,{label:"Shimmer off",shimmer:!1}),e.jsx(k,{label:"Shimmer on",shimmer:!0})]})}const U=`import React from "react";
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
`,N=({label:l,ambient:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(i,{position:"absolute",color:"blue",colorSecondary:"indigo",direction:"br",ambient:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function X(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(N,{label:"Ambient on",ambient:!0}),e.jsx(N,{label:"Ambient off",ambient:!1})]})}const Y=`import React from "react";
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
`,oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(R,{name:"Glass Background",description:"A full-bleed gradient layer that sits behind glass surfaces. Pick a primary, secondary and deep color, steer the gradient in eight directions, and layer ambient glows or a slow shimmer on top. By default it fills the nearest positioned ancestor; switch it to fixed for a page-level backdrop."}),e.jsx($,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Sign-in form",description:"The classic case: a liquid-glass panel floating on the gradient, with the ambient glow breathing behind it.",code:L,filename:"SignInForm.tsx",children:e.jsx(q,{})}),e.jsx(c,{title:"Eight directions",description:"`direction` maps to a CSS gradient angle — `t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`. Bottom-right (`br`) is the default.",code:W,filename:"Directions.tsx",children:e.jsx(V,{})}),e.jsx(c,{title:"Palettes",description:"`colorSecondary` and `colorDeep` override the middle and final gradient stops. Omit either and a neighboring hue is derived from `color` automatically.",code:K,filename:"Palettes.tsx",children:e.jsx(J,{})}),e.jsx(c,{title:"Shimmer",description:"`shimmer` adds a slow-moving light band across the surface — subtle enough to sit under glass, off by default.",code:U,filename:"Shimmer.tsx",children:e.jsx(Q,{})}),e.jsx(c,{title:"Ambient off",description:"`ambient` (default on) renders two large blurred glow circles in the primary color behind the content. Turn it off for a flatter, quieter gradient.",code:Y,filename:"AmbientOff.tsx",children:e.jsx(X,{})})]})]});export{oe as GlassBackgroundPage,oe as default};
