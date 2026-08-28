import{r,j as e,G as a,P as g,I as x,T as k,e as N}from"./index-8i9ZNynb.js";import{P as C}from"./PageHeader-CO5k_SQv.js";import{E as i}from"./ExampleCard-LdxcpmX_.js";import{P as B,S as s,T as p}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as P}from"./ControlAccordion-Bqp-1oBj.js";import{t as m,g as T}from"./options-yAU-f7tt.js";const A=()=>{const[l,n]=r.useState("purple"),[t,v]=r.useState("blue"),[d,j]=r.useState("indigo"),[c,y]=r.useState("br"),[u,w]=r.useState(!1),[f,S]=r.useState(!0);return e.jsx(B,{hideBackgroundToggle:!0,controls:e.jsx(P,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Color",options:m,value:l,onChange:o=>n(o)}),e.jsx(s,{label:"Secondary color",options:m,value:t,onChange:o=>v(o)}),e.jsx(s,{label:"Deep color",options:m,value:d,onChange:o=>j(o)}),e.jsx(s,{label:"Direction",options:T,value:c,onChange:o=>y(o)})]})},{id:"effects",title:"Effects",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(p,{label:"Shimmer",checked:u,onChange:w}),e.jsx(p,{label:"Ambient glow",checked:f,onChange:S})]})}]}),preview:e.jsx("div",{className:"relative h-72 w-full max-w-lg overflow-hidden rounded-xl",children:e.jsx(a,{color:l,colorSecondary:t,colorDeep:d,direction:c,shimmer:u,ambient:f,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx(g,{variant:"liquid-glass",corner:"rounded-lg",padding:"sm",children:e.jsxs("p",{className:"text-sm font-semibold text-neutral-800 dark:text-neutral-200",children:[l," → ",t," → ",d," · ",c]})})})})})})};function G(){const[l,n]=r.useState(!0);return e.jsx("div",{className:"relative h-96 w-full max-w-md overflow-hidden rounded-xl",children:e.jsx(a,{color:"purple",colorSecondary:"blue",colorDeep:"indigo",direction:"br",ambient:!0,children:e.jsx("div",{className:"flex h-full items-center justify-center p-4",children:e.jsx("div",{className:"w-full max-w-sm",children:e.jsx(g,{title:"Sign in",variant:"liquid-glass",corner:"rounded-lg",glassOpacity:"frosted",vibrancy:"high",children:e.jsxs("div",{className:"space-y-3",children:[e.jsx(x,{placeholder:"Email",size:"md"}),e.jsx(x,{placeholder:"Password",size:"md",type:"password"}),e.jsxs("div",{className:"flex items-center justify-between py-1",children:[e.jsx("span",{className:"text-sm text-neutral-700 dark:text-neutral-300",children:"Remember me"}),e.jsx(k,{size:"sm",color:"blue",checked:l,onChange:t=>n(t.target.checked)})]}),e.jsx(N,{fullWidth:!0,variant:"solid",color:"blue",size:"md",children:"Continue"})]})})})})})})}const R=`import { useState } from "react";
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
`,z=[{code:"t",label:"Top"},{code:"tr",label:"Top right"},{code:"r",label:"Right"},{code:"br",label:"Bottom right"},{code:"b",label:"Bottom"},{code:"bl",label:"Bottom left"},{code:"l",label:"Left"},{code:"tl",label:"Top left"}];function D(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4",children:z.map(({code:l,label:n})=>e.jsxs("div",{className:"relative h-20 overflow-hidden rounded-lg",children:[e.jsx(a,{position:"absolute",direction:l,ambient:!1}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:n})]},l))})}const E=`import { GlassBackground, type GradientDirection } from "@cjlapao/ui-kit";

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
`,I=[{label:"Blue · Indigo",color:"blue",colorSecondary:"indigo"},{label:"Rose · Red",color:"rose",colorSecondary:"red"},{label:"Emerald · Teal",color:"emerald",colorSecondary:"teal"},{label:"Amber · Orange",color:"amber",colorSecondary:"orange"},{label:"Violet · Purple",color:"violet",colorSecondary:"purple"},{label:"Cyan · Sky",color:"cyan",colorSecondary:"sky"}];function O(){return e.jsx("div",{className:"grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3",children:I.map(({label:l,color:n,colorSecondary:t})=>e.jsxs("div",{className:"relative h-24 overflow-hidden rounded-lg",children:[e.jsx(a,{position:"absolute",color:n,colorSecondary:t,direction:"br",ambient:!0}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]},l))})}const F=`import { GlassBackground, type TrueColor } from "@cjlapao/ui-kit";

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
`,b=({label:l,shimmer:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(a,{position:"absolute",color:"purple",direction:"br",ambient:!0,shimmer:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function q(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(b,{label:"Shimmer off",shimmer:!1}),e.jsx(b,{label:"Shimmer on",shimmer:!0})]})}const L=`import React from "react";
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
`,h=({label:l,ambient:n})=>e.jsxs("div",{className:"relative h-40 min-w-40 flex-1 overflow-hidden rounded-lg",children:[e.jsx(a,{position:"absolute",color:"blue",colorSecondary:"indigo",direction:"br",ambient:n}),e.jsx("span",{className:"relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200",children:l})]});function V(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col gap-2 sm:flex-row",children:[e.jsx(h,{label:"Ambient on",ambient:!0}),e.jsx(h,{label:"Ambient off",ambient:!1})]})}const W=`import React from "react";
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
`,X=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(C,{name:"Glass Background",description:"A full-bleed gradient layer that sits behind glass surfaces. Pick a primary, secondary and deep color, steer the gradient in eight directions, and layer ambient glows or a slow shimmer on top. By default it fills the nearest positioned ancestor; switch it to fixed for a page-level backdrop."}),e.jsx(A,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(i,{title:"Sign-in form",description:"The classic case: a liquid-glass panel floating on the gradient, with the ambient glow breathing behind it.",code:R,filename:"SignInForm.tsx",children:e.jsx(G,{})}),e.jsx(i,{title:"Eight directions",description:"`direction` maps to a CSS gradient angle — `t`, `tr`, `r`, `br`, `b`, `bl`, `l`, `tl`. Bottom-right (`br`) is the default.",code:E,filename:"Directions.tsx",children:e.jsx(D,{})}),e.jsx(i,{title:"Palettes",description:"`colorSecondary` and `colorDeep` override the middle and final gradient stops. Omit either and a neighboring hue is derived from `color` automatically.",code:F,filename:"Palettes.tsx",children:e.jsx(O,{})}),e.jsx(i,{title:"Shimmer",description:"`shimmer` adds a slow-moving light band across the surface — subtle enough to sit under glass, off by default.",code:L,filename:"Shimmer.tsx",children:e.jsx(q,{})}),e.jsx(i,{title:"Ambient off",description:"`ambient` (default on) renders two large blurred glow circles in the primary color behind the content. Turn it off for a flatter, quieter gradient.",code:W,filename:"AmbientOff.tsx",children:e.jsx(V,{})})]})]});export{X as GlassBackgroundPage,X as default};
