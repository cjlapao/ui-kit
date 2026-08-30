import{j as e,bb as a,bc as r,bd as s,be as o}from"./index-p9Bv1Pn1.js";import{P as i}from"./PageHeader-DCZtzAyX.js";import{E as n}from"./ExampleCard-BS13YSEO.js";import{P as d}from"./PlaygroundPanel-BDClNSzf.js";import{C as c}from"./ControlAccordion-CydkdljU.js";import{u}from"./StatBaseControls-BU0O4FLV.js";import"./options-Bqu3_N-h.js";function p(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsx(a,{label:"Inherited",value:"1.42M",size:"md"}),e.jsx(a,{label:"Bigger value",value:"1.42M",valueSize:"xl",labelSize:"xs"}),e.jsx(a,{label:"Toned value",value:"1.42M",valueTone:"emerald"}),e.jsx(a,{label:"Both toned",value:"1.42M",labelTone:"sky",valueTone:"violet"})]})}const h=`import { StatCard } from "@cjlapao/ui-kit";

/**
 * The label and the value carry their own tone and their own type scale, both
 * falling back to the card's \`size\` when not set.
 *
 * They used to share one \`valueTone\`, so a card could not have a muted label
 * over a coloured figure — which is the common case.
 */
export default function Typography() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Inherited" value="1.42M" size="md" />
      <StatCard label="Bigger value" value="1.42M" valueSize="xl" labelSize="xs" />
      <StatCard label="Toned value" value="1.42M" valueTone="emerald" />
      <StatCard
        label="Both toned"
        value="1.42M"
        labelTone="sky"
        valueTone="violet"
      />
    </div>
  );
}
`;function g(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsx(a,{label:"Spinner",value:"72%",icon:"HealthCheck",progress:72}),e.jsx(a,{label:"Bar",value:"72%",icon:"Database",progress:72,progressType:"bar"}),e.jsx(a,{label:"Synced to value",value:72,icon:"Database",progressType:"bar",syncValueToProgress:!0,progressLabel:"of quota"}),e.jsx(a,{label:"Indeterminate",value:"—",icon:"HealthCheck",progress:!0})]})}const m=`import { StatCard } from "@cjlapao/ui-kit";

/**
 * One \`progress\` feature, two renderings.
 *
 * \`spinner\` pins a \`ProgressSpinner\` to the bottom-right corner; \`bar\` puts a
 * labelled \`Progress\` across the full width at the bottom. Both accept a
 * number or \`true\` for indeterminate.
 *
 * \`syncValueToProgress\` drives the bar from the card's own \`value\`, so a
 * percentage metric is written once instead of twice — and a non-numeric value
 * is ignored, falling back to whatever \`progress\` was given.
 */
export default function Progress() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Spinner" value="72%" icon="HealthCheck" progress={72} />
      <StatCard label="Bar" value="72%" icon="Database" progress={72} progressType="bar" />
      <StatCard
        label="Synced to value"
        value={72}
        icon="Database"
        progressType="bar"
        syncValueToProgress
        progressLabel="of quota"
      />
      <StatCard label="Indeterminate" value="—" icon="HealthCheck" progress />
    </div>
  );
}
`;function v(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[r.map(t=>e.jsx(a,{label:t,value:"1.42M",icon:"Database",subtitle:"loading",loading:!0,loaderType:t,progress:40},t)),e.jsx(a,{label:"Failed",value:"—",icon:"Database",error:{message:"Registry unreachable",onRetry:()=>{}}})]})}const b=`import { StatCard, STAT_CARD_LOADERS } from "@cjlapao/ui-kit";

/**
 * The three loader treatments, \`skeleton\` by default. The skeleton is shaped
 * like the card's own header and figure, so the grid keeps its layout instead
 * of reflowing when the data lands — the spinner and progress types still
 * cover the card, which is right when you want the previous value to stay
 * readable underneath.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CARD_LOADERS.map((loaderType) => (
        <StatCard
          key={loaderType}
          label={loaderType}
          value="1.42M"
          icon="Database"
          subtitle="loading"
          loading
          loaderType={loaderType}
          progress={40}
        />
      ))}
      <StatCard
        label="Failed"
        value="—"
        icon="Database"
        error={{ message: "Registry unreachable", onRetry: () => {} }}
      />
    </div>
  );
}
`,x=()=>{const{groups:t,statProps:l}=u();return e.jsx(d,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(c,{groups:t}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Sync to value"})," drives the bar from the card's own figure, so a percentage metric is written once. The decoration comes from ",e.jsx("code",{children:"Panel"})," now — the old hand-rolled quarter-circle cut a hard arc across the corner and was silently implied by the icon."]})]}),preview:e.jsx("div",{className:"w-full max-w-xs",children:e.jsx(a,{...l,label:"Quota used",value:72})})})},f=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(a,{label:"Total balance",value:"$1.42M",trend:{value:"+12.4%",direction:"up"}}),e.jsx(a,{label:"Open issues",value:"38",trend:{value:"-6.1%",direction:"down"}}),e.jsx(a,{label:"Uptime",value:"99.98%",trend:{value:"steady",direction:"neutral"}})]}),w=`import { StatCard } from "@cjlapao/ui-kit";

export const Basic = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard label="Total balance" value="$1.42M" trend={{ value: "+12.4%", direction: "up" }} />
    <StatCard label="Open issues" value="38" trend={{ value: "-6.1%", direction: "down" }} />
    <StatCard label="Uptime" value="99.98%" trend={{ value: "steady", direction: "neutral" }} />
  </div>
);

export default Basic;
`,S=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(a,{label:"Revenue",value:"$48.2K",icon:"Shop",tone:"emerald"}),e.jsx(a,{label:"Customers",value:"1,204",icon:"Users",tone:"violet"}),e.jsx(a,{label:"Deploys",value:"86",icon:"Cog",tone:"blue",iconTone:"amber"})]}),y=`import { StatCard } from "@cjlapao/ui-kit";

export const WithIcon = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard label="Revenue" value="$48.2K" icon="Shop" tone="emerald" />
    {/* No \`iconTone\` — the chip falls back to the card's own \`tone\`. */}
    <StatCard label="Customers" value="1,204" icon="Users" tone="violet" />
    {/* An explicit \`iconTone\` overrides the card tone. */}
    <StatCard
      label="Deploys"
      value="86"
      icon="Cog"
      tone="blue"
      iconTone="amber"
    />
  </div>
);

export default WithIcon;
`,j=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(a,{gradient:!0,tone:"violet",label:"Revenue",value:"$48.2K",icon:"Shop",trend:{value:"+12.4%",direction:"up"}}),e.jsx(a,{gradient:!0,tone:"emerald",label:"Customers",value:"1,204",icon:"Users"}),e.jsx(a,{gradient:!0,tone:"blue",variant:"liquid-glass",label:"Deploys",value:"86",icon:"Cog"})]}),C=`import { StatCard } from "@cjlapao/ui-kit";

export const Gradient = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      gradient
      tone="violet"
      label="Revenue"
      value="$48.2K"
      icon="Shop"
      trend={{ value: "+12.4%", direction: "up" }}
    />
    <StatCard
      gradient
      tone="emerald"
      label="Customers"
      value="1,204"
      icon="Users"
    />
    {/* The same gradient on a translucent variant — the stops step down to
        60% alpha so the backdrop blur stays visible. */}
    <StatCard
      gradient
      tone="blue"
      variant="liquid-glass"
      label="Deploys"
      value="86"
      icon="Cog"
    />
  </div>
);

export default Gradient;
`,T=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(a,{gradient:!0,tone:"emerald",progress:!0,label:"Game completed",value:"100%"}),e.jsx(a,{gradient:!0,tone:"violet",progress:72,label:"Build pipeline",value:"3/4"}),e.jsx(a,{tone:"blue",progress:!0,label:"Syncing",value:"2,481"})]}),k=`import { StatCard } from "@cjlapao/ui-kit";

export const WithProgress = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard
      gradient
      tone="emerald"
      progress
      label="Game completed"
      value="100%"
    />
    <StatCard
      gradient
      tone="violet"
      progress={72}
      label="Build pipeline"
      value="3/4"
    />
    <StatCard
      tone="blue"
      progress
      label="Syncing"
      value="2,481"
    />
  </div>
);

export default WithProgress;
`,P=["xs","sm","md","lg","xl"],N=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-4",children:P.map(t=>e.jsx(a,{size:t,className:"min-w-44 flex-1",label:`Size ${t}`,value:"1,204",icon:"Shop"},t))}),z=`import { StatCard } from "@cjlapao/ui-kit";

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

export const Sizes = () => (
  <div className="flex w-full flex-wrap items-end gap-4">
    {SIZES.map((size) => (
      <StatCard
        key={size}
        size={size}
        className="min-w-44 flex-1"
        label={\`Size \${size}\`}
        // Short on purpose: the card stays one row at every size, so the
        // value must fit at text-5xl without the Panel scrolling.
        value="1,204"
        icon="Shop"
      />
    ))}
  </div>
);

export default Sizes;
`,A=["elevated","outlined","glass","liquid-glass"],R=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-2",children:A.map(t=>e.jsx(a,{variant:t,label:`variant="${t}"`,value:"$1.42M",icon:"Shop",tone:"violet"},t))}),E=`import { StatCard } from "@cjlapao/ui-kit";

const VARIANTS = ["elevated", "outlined", "glass", "liquid-glass"] as const;

export const Variants = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
    {VARIANTS.map((variant) => (
      <StatCard
        key={variant}
        variant={variant}
        label={\`variant="\${variant}"\`}
        value="$1.42M"
        icon="Shop"
        tone="violet"
      />
    ))}
  </div>
);

export default Variants;
`,I=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(s,{label:"Service health",state:"healthy",bpm:72,trend:{value:"all systems",direction:"neutral"}}),e.jsx(s,{label:"Latency",state:"warning",bpm:96}),e.jsx(s,{label:"Error budget",state:"unhealthy",bpm:128})]}),D=`import { StatHealthCard } from "@cjlapao/ui-kit";

/**
 * The ECG strip is no longer a prop on \`StatCard\`. \`StatHealthCard\` is that
 * same card with the monitor mounted as its body, so every StatCard prop —
 * variant, tone, size, corner, trend, icon — still applies.
 */
export const Health = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatHealthCard
      label="Service health"
      state="healthy"
      bpm={72}
      trend={{ value: "all systems", direction: "neutral" }}
    />
    <StatHealthCard label="Latency" state="warning" bpm={96} />
    <StatHealthCard label="Error budget" state="unhealthy" bpm={128} />
  </div>
);

export default Health;
`,H=[{id:"us",title:"us-east",value:128,subtitle:"3 zones",trend:{value:"+12%",direction:"up"}},{id:"eu",title:"eu-west",value:86,subtitle:"2 zones",trend:{value:"-4%",direction:"down"}},{id:"ap",title:"ap-south",value:41,subtitle:"1 zone",trend:{value:"0%",direction:"neutral"}}],M=[{id:"jan",title:"January",value:412,meta:[{text:"billed",icon:"Shop"}]},{id:"feb",title:"February",value:380}];function B(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(a,{label:"Active capsules",icon:"Rocket",tone:"blue",pages:H}),e.jsx(o,{label:"Invoices",size:"lg",icon:"Database",tone:"violet",pagerPlacement:"bottom",loopPages:!0,pages:M,breakdown:[{label:"Paid",value:361,color:"emerald"},{label:"Overdue",value:19,color:"rose"}]})]})}const O=`import { StatCard, StatCountTile } from "@cjlapao/ui-kit";

/**
 * Paging is a base-card prop, so any Stat variant can use it.
 *
 * Give \`pages\` a list and the card grows prev / next arrows with the current
 * page's \`title\` between them. Each page overrides the card for as long as it
 * shows, and anything it leaves out falls back to the card — which is what
 * lets a list of datasets avoid restating the surface, the icon or the trend
 * on every entry.
 *
 * \`page\` + \`onPageChange\` make it controlled; leave both off and the card
 * keeps the index itself. \`loopPages\` wraps past the ends, and
 * \`pagerPlacement="bottom"\` pins the strip under the content instead.
 */
const REGIONS = [
  { id: "us", title: "us-east", value: 128, subtitle: "3 zones",
    trend: { value: "+12%", direction: "up" as const } },
  { id: "eu", title: "eu-west", value: 86, subtitle: "2 zones",
    trend: { value: "-4%", direction: "down" as const } },
  { id: "ap", title: "ap-south", value: 41, subtitle: "1 zone",
    trend: { value: "0%", direction: "neutral" as const } },
];

const MONTHS = [
  { id: "jan", title: "January", value: 412,
    meta: [{ text: "billed", icon: "Shop" as const }] },
  { id: "feb", title: "February", value: 380 },
];

export default function Paged() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <StatCard
        label="Active capsules"
        icon="Rocket"
        tone="blue"
        pages={REGIONS}
      />
      {/* The pager works the same on a tile whose body is its own thing. */}
      <StatCountTile
        label="Invoices"
        size="lg"
        icon="Database"
        tone="violet"
        pagerPlacement="bottom"
        loopPages
        pages={MONTHS}
        breakdown={[
          { label: "Paid", value: 361, color: "emerald" },
          { label: "Overdue", value: 19, color: "rose" },
        ]}
      />
    </div>
  );
}
`,_=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(i,{name:"Stat Card",description:"A metric in a card — label, big value, optional trend pill, icon chip, optional progress, and a full-size surface underneath. Every Panel variant, tone and corner works; `gradient` paints the surface itself."}),e.jsx(x,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(n,{title:"Loading and error",description:"The three loader treatments, skeleton by default and shaped like the card so the grid keeps its layout — the spinner and progress types cover the card instead, keeping the previous value readable underneath.",code:b,filename:"States.tsx",children:e.jsx(v,{})}),e.jsx(n,{title:"Progress: spinner or bar",description:"One feature, two renderings. The bar spans the full width at the bottom; `syncValueToProgress` drives it from the card's own figure so a percentage is written once.",code:m,filename:"Progress.tsx",children:e.jsx(g,{})}),e.jsx(n,{title:"Label and value typography",description:"Each carries its own tone and type scale, falling back to the card's `size`. They used to share one `valueTone`, so a muted label over a coloured figure — the common case — was impossible.",code:h,filename:"Typography.tsx",children:e.jsx(p,{})}),e.jsx(n,{title:"Basic",description:"A label, a value, and a trend pill. The trend's direction picks its tone — up is emerald, down is rose, neutral is slate.",code:w,filename:"Basic.tsx",children:e.jsx(f,{})}),e.jsx(n,{title:"With Icon",description:"An `icon` renders in a toned chip. Without `iconTone` the chip falls back to the card's own `tone`; with one, it overrides it.",code:y,filename:"WithIcon.tsx",children:e.jsx(S,{})}),e.jsx(n,{title:"Gradient",description:"`gradient` paints the surface with a dark diagonal `tone` wash (950 → 800 → 700, the PrimeVue showcase look) and switches the copy to white. On translucent variants the stops step down to 60% alpha so the backdrop blur stays visible — the third card is a `liquid-glass` Panel wearing the same wash.",code:C,filename:"Gradient.tsx",children:e.jsx(j,{})}),e.jsx(n,{title:"With Progress",description:"`progress` pins a `ProgressSpinner` to the bottom-right corner, tinted by the card's `tone` and sized to it. Bare `progress` is indeterminate; a number is a clamped determinate value. Works on plain cards too — the third card has no `gradient`.",code:k,filename:"WithProgress.tsx",children:e.jsx(T,{})}),e.jsx(n,{title:"Sizes",description:"The full control scale — `xs` through `xl` — steps the value font, chip, icon and trend pill together. `sm`/`md`/`lg` keep the metrics they always had.",code:z,filename:"Sizes.tsx",children:e.jsx(N,{})}),e.jsx(n,{title:"Variants",description:"Every Panel surface works as the card's base — `elevated`, `outlined`, `glass`, `liquid-glass` — with its tone applied on top. `gradient` and `variant` compose: the variant keeps its shadow, ring and blur while the wash replaces the fill.",code:E,filename:"Variants.tsx",children:e.jsx(R,{})}),e.jsx(n,{title:"Paging",description:'`pages` turns any Stat card into a paged one — prev / next arrows with the page title between them. Each page overrides the card while it shows and falls back to it for anything left out. Add `page` + `onPageChange` to control it, `loopPages` to wrap, `pagerPlacement="bottom"` to pin the strip under the content.',code:O,filename:"Paged.tsx",children:e.jsx(B,{})}),e.jsx(n,{title:"Health strip",description:"The ECG strip is its own component now: `StatHealthCard` is a `StatCard` with the monitor as its body, so every card prop still applies. `state` follows `healthy`, `warning`, `unhealthy`; `bpm` sets the tempo.",code:D,filename:"Health.tsx",children:e.jsx(I,{})})]})]});export{_ as StatCardPage,_ as default};
