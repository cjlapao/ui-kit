import{r as s,j as e,bf as o,l as I,aD as E,o as z,K as H}from"./index-BBK6HA-D.js";import{P}from"./PageHeader-BcBcU29I.js";import{E as a}from"./ExampleCard-BVwGIEPO.js";import{P as _,C as A,S as i,a as V,T as f}from"./ControlAccordion-DallGojj.js";import{aY as L,t as G,n as w,e as W,p as F,h as D,K as Z,aZ as $}from"./options-D-FMIizr.js";const U=()=>{const[t,v]=s.useState("gradient"),[r,b]=s.useState("blue"),[l,j]=s.useState("sm"),[d,S]=s.useState("xs"),[c,y]=s.useState("sm"),[h,T]=s.useState("rounded-xl"),[p,k]=s.useState("both"),[u,C]=s.useState("soft"),[g,N]=s.useState("p"),[m,R]=s.useState(!0),[x,O]=s.useState(!0);return e.jsx(_,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(A,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Variant",options:L,value:t,onChange:n=>v(n)}),e.jsx(i,{label:"Tone",options:G,value:r,onChange:n=>b(n)}),e.jsx(i,{label:"Title size",options:w,value:l,onChange:n=>j(n)}),e.jsx(i,{label:"Subtitle size",options:w,value:d,onChange:n=>S(n)}),e.jsx(i,{label:"Padding",options:W,value:c,onChange:n=>y(n)}),e.jsx(i,{label:"Corner",options:F,value:h,onChange:n=>T(n)}),e.jsx(i,{label:"Decoration",options:D,value:p,onChange:n=>k(n)}),e.jsx(i,{label:"Glow",options:Z,value:u,onChange:n=>C(n)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Title element",options:$,value:g,onChange:n=>N(n)}),e.jsx(V,{label:"Content",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(f,{label:"Icon",checked:m,onChange:R}),e.jsx(f,{label:"Subtitle",checked:x,onChange:O})]})})]})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["The gradient runs between the tone's own ",e.jsx("strong",{children:"700"})," and"," ",e.jsx("strong",{children:"800"})," shades — white copy measures 4.93:1 at worst there, against 2.94:1 on the ",e.jsx("code",{children:"-400"})," stop the old hand-written table used. Every other variant is a"," ",e.jsx("code",{children:"Panel"}),", and takes its copy colour from the surface instead of being forced to white."]})]}),preview:e.jsx("div",{className:"w-full max-w-2xl",children:e.jsx(o,{variant:t,tone:r,titleSize:l,subtitleSize:d,padding:c,corner:h,decoration:p,glowIntensity:u,titleAs:g,icon:m?"Rocket":void 0,title:"Release Canary version",subtitle:x?"on: workflow_dispatch":void 0})})})};function K(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:I.map(t=>e.jsx(o,{tone:t,title:t,subtitle:"White on -700",icon:"Rocket"},t))})}const Y=`import { TRUE_COLORS, Hero } from "@cjlapao/ui-kit";

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
        <Hero key={tone} tone={tone} title={tone} subtitle="White on -700" icon="Rocket" />
      ))}
    </div>
  );
}
`;function q(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2",children:E.map(t=>e.jsx(o,{variant:t,tone:"violet",title:t,subtitle:"Icon, heading, supporting line",icon:"Rocket",padding:"md"},t))})}const B=`import { HERO_VARIANTS, Hero } from "@cjlapao/ui-kit";

/**
 * \`gradient\` is the saturated band the component exists for; every other
 * variant is a \`Panel\`, so it brings its own fill, ring and glass props — and
 * its copy comes from the surface rather than being forced to white, which is
 * what used to make the title vanish on a light card.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {HERO_VARIANTS.map((variant) => (
        <Hero
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
`;function J(){return e.jsx("div",{className:"flex w-full flex-col gap-3",children:z.map(t=>e.jsx(o,{tone:"emerald",titleSize:t,subtitleSize:t,padding:t,title:`titleSize="${t}"`,subtitle:"The chip scales with the type.",icon:"Rocket"},t))})}const M=`import { CONTROL_SIZES, Hero } from "@cjlapao/ui-kit";

/**
 * Title, subtitle and the icon chip all move together on the shared control
 * scale. The subtitle's own scale used to stop at \`md\`, and the chip was
 * pinned at 48px whatever the type did.
 */
export default function Sizes() {
  return (
    <div className="flex w-full flex-col gap-3">
      {CONTROL_SIZES.map((size) => (
        <Hero
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
`;function Q(){return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(o,{title:"Custom stops",subtitle:"gradientFrom / gradientTo",icon:"Rocket",padding:"md",gradientFrom:"var(--color-fuchsia-700)",gradientTo:"var(--color-sky-800)"}),e.jsx("div",{className:"grid gap-3 sm:grid-cols-2",children:H.map(t=>e.jsx(o,{tone:"indigo",title:`glow: ${t}`,icon:"Rocket",padding:"md",glowIntensity:t},t))})]})}const X=`import { GLOW_INTENSITIES, Hero } from "@cjlapao/ui-kit";

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
      <Hero
        title="Custom stops"
        subtitle="gradientFrom / gradientTo"
        icon="Rocket"
        padding="md"
        gradientFrom="var(--color-fuchsia-700)"
        gradientTo="var(--color-sky-800)"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {GLOW_INTENSITIES.map((glowIntensity) => (
          <Hero
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
`,oe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(P,{name:"Hero",description:"A banner: an icon, a heading and a supporting line, on a saturated gradient or on any of the kit's container surfaces. The gradient runs between the tone's own 700 and 800 shades, read from Tailwind's palette variables — which is what keeps its white copy above the kit's measured contrast floor."}),e.jsx(U,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(a,{title:"Every tone",description:"Each stays in its own tone. The table this replaces mapped every tone to a *different* one's gradient — `sky` painted sky→indigo, `red` painted red→rose — and its light stop was `-400`, where white measures 2.94:1 on yellow.",code:Y,filename:"Tones.tsx",children:e.jsx(K,{})}),e.jsx(a,{title:"Variants",description:"`gradient` is the saturated band; every other variant is a `Panel`, so it brings its own fill, ring and glass props, and its copy comes from the surface rather than being forced to white.",code:B,filename:"Variants.tsx",children:e.jsx(q,{})}),e.jsx(a,{title:"Sizes",description:"Title, subtitle and the icon chip move together on the shared control scale. The subtitle's own scale used to stop at `md`, and the chip was pinned at 48px whatever the type did.",code:M,filename:"Sizes.tsx",children:e.jsx(J,{})}),e.jsx(a,{title:"Stops and glow",description:"The stops are overridable, and a halo sits behind the band at the chosen intensity — inset within reserved padding so an ancestor with `overflow: auto` cannot clip it.",code:X,filename:"Gradient.tsx",children:e.jsx(Q,{})})]})]});export{oe as HeroPage,oe as default};
