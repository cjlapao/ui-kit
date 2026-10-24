import{r as i,j as e,er as o,C as z,q as H,d9 as _,v as V,c9 as W,i as b}from"./index-gt012o8E.js";import{P as L}from"./PageHeader-CzVhyXQL.js";import{E as r}from"./ExampleCard-V3REeYJ5.js";import{A as G,a as l,C as a,b as F,P as B}from"./A11ySections-zw3_3X-2.js";import{P as D,C as s,a as v,T as y}from"./PlaygroundPanel-Czrs7oXC.js";import{C as M}from"./ControlAccordion-DIXHht2n.js";import{b7 as $,d as j,f as U,p as Z,i as q,R as K,b8 as J}from"./options-CtADNKbm.js";const Q=()=>{const[t,S]=i.useState("gradient"),[d,T]=i.useState("blue"),[c,C]=i.useState("sm"),[h,k]=i.useState("xs"),[p,P]=i.useState("sm"),[u,N]=i.useState("rounded-md"),[g,R]=i.useState("both"),[m,I]=i.useState("soft"),[f,A]=i.useState("p"),[x,E]=i.useState(!0),[w,O]=i.useState(!0);return e.jsx(D,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(M,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Variant",options:$,value:t,onChange:n=>S(n)}),e.jsx(v,{label:"Tone",children:e.jsx(z,{selectable:!0,size:"sm",value:d,onSelect:T,defaultExpanded:!0})}),e.jsx(s,{label:"Title size",options:j,value:c,onChange:n=>C(n)}),e.jsx(s,{label:"Subtitle size",options:j,value:h,onChange:n=>k(n)}),e.jsx(s,{label:"Padding",options:U,value:p,onChange:n=>P(n)}),e.jsx(s,{label:"Corner",options:Z,value:u,onChange:n=>N(n)}),e.jsx(s,{label:"Decoration",options:q,value:g,onChange:n=>R(n)}),e.jsx(s,{label:"Glow",options:K,value:m,onChange:n=>I(n)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Title element",options:J,value:f,onChange:n=>A(n)}),e.jsx(v,{label:"Content",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(y,{label:"Icon",checked:x,onChange:E}),e.jsx(y,{label:"Subtitle",checked:w,onChange:O})]})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The gradient runs between the tone's own ",e.jsx("strong",{children:"700"})," and"," ",e.jsx("strong",{children:"800"})," shades — white copy measures 4.93:1 at worst there, against 2.94:1 on the ",e.jsx("code",{children:"-400"})," stop the old hand-written table used. Every other variant is a ",e.jsx("code",{children:"Panel"}),", and takes its copy colour from the surface instead of being forced to white."]})]}),preview:e.jsx("div",{className:"w-full max-w-2xl",children:e.jsx(o,{variant:t,tone:d,titleSize:c,subtitleSize:h,padding:p,corner:u,decoration:g,glowIntensity:m,titleAs:f,icon:x?"Rocket":void 0,title:"Release Canary version",subtitle:w?"on: workflow_dispatch":void 0})})})};function X(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:H.map(t=>e.jsx(o,{tone:t,title:t,subtitle:"White on -700",icon:"Rocket"},t))})}const Y=`import { TRUE_COLORS, PanelHero } from "@cjlapao/ui-kit";

/**
 * The gradient stops are the tone's own **700 and 800** shades, read from
 * Tailwind's palette variables. They used to be a hand-written table of 21
 * pairs in which every tone bled into its neighbour — \`sky\` painted
 * sky→indigo, \`red\` painted red→rose — and the light end sat at \`-400\`, where
 * the white copy this component insists on measures 2.94:1 on yellow.
 */
export default function Tones() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {TRUE_COLORS.map((tone) => (
        <PanelHero
          key={tone}
          tone={tone}
          title={tone}
          subtitle="White on -700"
          icon="Rocket"
        />
      ))}
    </div>
  );
}
`;function ee(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:_.map(t=>e.jsx(o,{variant:t,tone:"violet",title:t,subtitle:"Icon, heading, supporting line",icon:"Rocket",padding:"md"},t))})}const te=`import { PANEL_HERO_VARIANTS, PanelHero } from "@cjlapao/ui-kit";

/**
 * \`gradient\` is the saturated band the component exists for; every other
 * variant is a \`Panel\`, so it brings its own fill, ring and glass props — and
 * its copy comes from the surface rather than being forced to white, which is
 * what used to make the title vanish on a light card.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {PANEL_HERO_VARIANTS.map((variant) => (
        <PanelHero
          key={variant}
          variant={variant}
          tone="violet"
          title={variant}
          subtitle="Icon, heading, supporting line"
          icon="Rocket"
          padding="md"
        />
      ))}
    </div>
  );
}
`;function ne(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:V.map(t=>e.jsx(o,{tone:"emerald",titleSize:t,subtitleSize:t,padding:t,title:`titleSize="${t}"`,subtitle:"The chip scales with the type.",icon:"Rocket"},t))})}const ie=`import { CONTROL_SIZES, PanelHero } from "@cjlapao/ui-kit";

/**
 * Title, subtitle and the icon chip all move together on the shared control
 * scale. The subtitle's own scale used to stop at \`md\`, and the chip was
 * pinned at 48px whatever the type did.
 */
export default function Sizes() {
  return (
    <div className="flex w-full flex-col gap-3">
      {CONTROL_SIZES.map((size) => (
        <PanelHero
          key={size}
          tone="emerald"
          titleSize={size}
          subtitleSize={size}
          padding={size}
          title={\`titleSize="\${size}"\`}
          subtitle="The chip scales with the type."
          icon="Rocket"
        />
      ))}
    </div>
  );
}
`;function ae(){return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(o,{title:"Custom stops",subtitle:"gradientFrom / gradientTo",icon:"Rocket",padding:"md",gradientFrom:"var(--color-fuchsia-700)",gradientTo:"var(--color-sky-800)"}),e.jsx("div",{className:"grid gap-3 sm:grid-cols-2",children:W.map(t=>e.jsx(o,{tone:"indigo",title:`glow: ${t}`,icon:"Rocket",padding:"md",glowIntensity:t},t))})]})}const se=`import { GLOW_INTENSITIES, PanelHero } from "@cjlapao/ui-kit";

/**
 * The stops are overridable, and a halo sits behind the band at the chosen
 * intensity — inset within reserved padding so an ancestor with
 * \`overflow: auto\` cannot clip it, the same rule the gradient inputs follow.
 *
 * Overriding the stops opts out of the contrast floor, so keep white copy in
 * mind if you reach for a light pair.
 */
export default function Gradient() {
  return (
    <div className="flex w-full flex-col gap-4">
      <PanelHero
        title="Custom stops"
        subtitle="gradientFrom / gradientTo"
        icon="Rocket"
        padding="md"
        gradientFrom="var(--color-fuchsia-700)"
        gradientTo="var(--color-sky-800)"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {GLOW_INTENSITIES.map((glowIntensity) => (
          <PanelHero
            key={glowIntensity}
            tone="indigo"
            title={\`glow: \${glowIntensity}\`}
            icon="Rocket"
            padding="md"
            glowIntensity={glowIntensity}
          />
        ))}
      </div>
    </div>
  );
}
`,oe=()=>e.jsx(o,{title:"Index 7 of 42 failed",subtitle:"runner-3 exited with code 1 after 8m 12s",icon:"Warning",tone:"rose",titleAs:"h2",children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx(b,{variant:"outline",size:"sm",children:"View logs"}),e.jsx(b,{variant:"soft",size:"sm",children:"Re-run job"})]})}),re=`import React from "react";
import { Button, PanelHero } from "@cjlapao/ui-kit";

const WithActions: React.FC = () => (
  <PanelHero
    title="Index 7 of 42 failed"
    subtitle="runner-3 exited with code 1 after 8m 12s"
    icon="Warning"
    tone="rose"
    titleAs="h2"
  >
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        View logs
      </Button>
      <Button variant="soft" size="sm">
        Re-run job
      </Button>
    </div>
  </PanelHero>
);

export default WithActions;
`,fe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(L,{name:"Panel Hero",description:"A banner: an icon, a heading and a supporting line, on a saturated gradient or on any of the kit's container surfaces. The gradient runs between the tone's own 700 and 800 shades, read from Tailwind's palette variables — which is what keeps its white copy above the kit's measured contrast floor."}),e.jsx(Q,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Every tone",description:"Each stays in its own tone. The table this replaces mapped every tone to a *different* one's gradient — `sky` painted sky→indigo, `red` painted red→rose — and its light stop was `-400`, where white measures 2.94:1 on yellow.",code:Y,filename:"Tones.tsx",children:e.jsx(X,{})}),e.jsx(r,{title:"Variants",description:"`gradient` is the saturated band; every other variant is a `Panel`, so it brings its own fill, ring and glass props, and its copy comes from the surface rather than being forced to white.",code:te,filename:"Variants.tsx",children:e.jsx(ee,{})}),e.jsx(r,{title:"Sizes",description:"Title, subtitle and the icon chip move together on the shared control scale. The subtitle's own scale used to stop at `md`, and the chip was pinned at 48px whatever the type did.",code:ie,filename:"Sizes.tsx",children:e.jsx(ne,{})}),e.jsx(r,{title:"Stops and glow",description:"The stops are overridable, and a halo sits behind the band at the chosen intensity — inset within reserved padding so an ancestor with `overflow: auto` cannot clip it.",code:se,filename:"Gradient.tsx",children:e.jsx(ae,{})}),e.jsx(r,{title:"With actions",description:"Children render full-width under the title row — the natural home for a banner’s buttons. They used to be silently dropped.",code:re,filename:"WithActions.tsx",children:e.jsx(oe,{})})]}),e.jsxs(G,{children:[e.jsxs(l,{title:"Screen reader",children:[e.jsxs("p",{children:["The headline is a real heading when you ask for one: ",e.jsx(a,{children:"titleAs"})," ","picks the element, and it defaults to ",e.jsx(a,{children:"p"})," — a page-top banner should pass ",e.jsx(a,{children:"h1"})," or ",e.jsx(a,{children:"h2"})," so it appears in the heading list. The icon chip, the floating shapes and the wash are ",e.jsx(a,{children:"aria-hidden"})," ","decoration; the copy colour is forced to white only on the gradient band (measured 4.93:1 minimum against the tone’s 700 stop), while every surface variant takes it from the surrounding surface."]}),e.jsx(F,{filename:"Semantics.tsx",code:le})]}),e.jsx(l,{title:"Keyboard Support",children:e.jsxs("p",{children:["The banner itself is static — no bindings, no tab stop. Buttons and links passed as ",e.jsx(a,{children:"children"})," keep their own native keyboard behaviour, in reading order after the heading text."]})}),e.jsx(l,{title:"Internationalization",children:e.jsxs("p",{children:["The component ships no strings; title, subtitle and children are the caller’s. Layout is flow-based, so long translations wrap inside the title column while the icon chip keeps its size, and everything mirrors with ",e.jsx(a,{children:'dir="rtl"'})," including the gradient’s diagonal."]})})]}),e.jsx(B,{props:[{name:"title",type:"ReactNode",description:e.jsxs(e.Fragment,{children:["Main heading — rendered by ",e.jsx(a,{children:"titleAs"}),"."]})},{name:"subtitle",type:"ReactNode",description:"Supporting line under the title."},{name:"titleAs",type:'"h1"…"h6" | "p"',default:"p",description:"The heading element; pass h1/h2 for a page-top banner so it enters the heading outline."},{name:"children",type:"ReactNode",description:"Actions or extra copy, full-width under the title row. Was silently dropped before 0.2."},{name:"icon",type:"IconName | ReactElement",description:"Icon chip; decorative (aria-hidden). Omit it and the slot is not drawn."},{name:"tone",type:"TrueColor",default:"blue",description:"Drives the gradient stops and every variant's accent."},{name:"variant",type:'"gradient" | PanelVariant',default:"gradient",description:"The saturated band, or any Panel surface — which brings its own fill, ring and glass props."},{name:"titleSize / subtitleSize",type:"ControlSize",default:"sm / xs",description:"Shared control scale; the icon chip scales with the title."},{name:"padding",type:"SurfacePadding",default:"sm",description:"Standard container padding."},{name:"corner",type:"SurfaceCorner",default:"rounded-md",description:"Standard container corner."},{name:"rounded",type:"boolean",description:"Deprecated — false means corner none."},{name:"decoration",type:'"shapes" | "gradient" | "both" | "none"',default:"both",description:"Floating circles and diagonal wash inside the band; also forwarded to Panel surfaces."},{name:"gradientFrom / gradientTo",type:"string",description:e.jsx(e.Fragment,{children:"Overrides for the band’s stops. Defaults: the tone’s 700 and 800 — the kit’s measured floor for white copy."})},{name:"glowIntensity",type:"GlowIntensity",default:"soft",description:"Halo behind the band, inset within reserved padding so scrollable ancestors cannot clip it."},{name:"glassOpacity / vibrancy / specularMode",type:"GlassOpacity / GlassVibrancy / SpecularMode",description:"Glass fill knobs for the see-through variants."},{name:"color",type:"TrueColor",description:"Deprecated alias of tone."}]})]}),le=`// A page-top banner must enter the heading outline.
<PanelHero titleAs="h1" title="Deploy pipeline" subtitle="main · 3 running" />

// Actions belong in children — under the title row, in reading order.
<PanelHero titleAs="h2" title="Index failed">
  <Button variant="outline">View logs</Button>
</PanelHero>`;export{fe as PanelHeroPage,fe as default};
