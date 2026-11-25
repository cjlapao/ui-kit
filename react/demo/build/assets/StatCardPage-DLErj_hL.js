import{j as e,hO as t,hP as p,r as g,hQ as r,hR as v}from"./index-CQwZVYnB.js";import{P as m}from"./PageHeader-BhZxEVHt.js";import{E as n}from"./ExampleCard-BZsKA5_g.js";import{T as b,P as w}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as f}from"./ControlAccordion-C7vC6faF.js";import{u as x}from"./StatBaseControls-CT-z9LkG.js";import"./SurfaceToneControl-LH37fS9y.js";import"./HueControl-B9PfQcfP.js";import"./options-Byh1yOHz.js";function S(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsx(t,{label:"Inherited",value:"1.42M",size:"md"}),e.jsx(t,{label:"Bigger value",value:"1.42M",valueSize:"xl",labelSize:"xs"}),e.jsx(t,{label:"Toned value",value:"1.42M",valueTone:"emerald"}),e.jsx(t,{label:"Both toned",value:"1.42M",labelTone:"sky",valueTone:"violet"})]})}const y=`import { StatCard } from "@cjlapao/ui-kit";

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
`;function j(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[e.jsx(t,{label:"Spinner",value:"72%",icon:"HealthCheck",progress:72}),e.jsx(t,{label:"Bar",value:"72%",icon:"Database",progress:72,progressType:"bar"}),e.jsx(t,{label:"Synced to value",value:72,icon:"Database",progressType:"bar",syncValueToProgress:!0,progressLabel:"of quota"}),e.jsx(t,{label:"Indeterminate",value:"—",icon:"HealthCheck",progress:!0})]})}const C=`import { StatCard } from "@cjlapao/ui-kit";

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
`;function k(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4",children:[p.map(a=>e.jsx(t,{label:a,value:"1.42M",icon:"Database",subtitle:"loading",loading:!0,loaderType:a,progress:40},a)),e.jsx(t,{label:"Failed",value:"—",icon:"Database",error:{message:"Registry unreachable",onRetry:()=>{}}})]})}const T=`import { StatCard, STAT_CARD_LOADERS } from "@cjlapao/ui-kit";

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
`,P=()=>{const{groups:a,statProps:l,previewClassName:i,previewItemClassName:d,previewStageRef:c}=x(),[o,h]=g.useState(!1),u=a.map(s=>s.id==="core"?{...s,controls:e.jsxs(e.Fragment,{children:[s.controls,e.jsx(b,{label:"Raised surface",checked:o,onChange:h})]})}:s);return e.jsx(w,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(f,{groups:u}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Sync to value"})," drives the bar from the card's own figure, so a percentage metric is written once. The decoration comes from ",e.jsx("code",{children:"Panel"})," now — the old hand-rolled quarter-circle cut a hard arc across the corner and was silently implied by the icon.",e.jsx("strong",{children:" Selected"})," and ",e.jsx("strong",{children:"Pulse"})," are the surface's state half — ",e.jsx("code",{children:"Panel"}),"'s own ",e.jsx("code",{children:"active"})," ","and ",e.jsx("code",{children:"pulse"}),", forwarded whole — and the two swatch rows are the licence to let those states wear hues the card does not. Turn on"," ",e.jsx("strong",{children:"Hoverable"})," to put a pointer on a card that is not clickable — and ",e.jsx("strong",{children:"Selected"})," with it: leave"," ",e.jsx("strong",{children:"Hover hue"})," on Auto and the wash arrives in the hue the selection wears, while an unselected card keeps hovering in its own tone. On a ",e.jsx("strong",{children:"Gradient wash"})," card the selection arrives as rim and glow only, because the card's own background outranks the wash."]})]}),preview:e.jsx("div",{ref:c,className:i??"w-full max-w-xs",children:e.jsx("div",{className:d,children:e.jsx(t,{...l,raisedSurface:o,label:"Quota used",value:72})})})})},N=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(t,{label:"Total balance",value:"$1.42M",trend:{value:"+12.4%",direction:"up"}}),e.jsx(t,{label:"Open issues",value:"38",trend:{value:"-6.1%",direction:"down"}}),e.jsx(t,{label:"Uptime",value:"99.98%",trend:{value:"steady",direction:"neutral"}})]}),z=`import { StatCard } from "@cjlapao/ui-kit";

export const Basic = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    <StatCard label="Total balance" value="$1.42M" trend={{ value: "+12.4%", direction: "up" }} />
    <StatCard label="Open issues" value="38" trend={{ value: "-6.1%", direction: "down" }} />
    <StatCard label="Uptime" value="99.98%" trend={{ value: "steady", direction: "neutral" }} />
  </div>
);

export default Basic;
`,A=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(t,{label:"Revenue",value:"$48.2K",icon:"Shop",tone:"emerald"}),e.jsx(t,{label:"Customers",value:"1,204",icon:"Users",tone:"violet",iconBackground:!0}),e.jsx(t,{label:"Deploys",value:"86",icon:"Cog",tone:"blue",iconTone:"amber",iconBackground:!0,iconPlacement:"right"})]}),R=`import { StatCard } from "@cjlapao/ui-kit";

export const WithIcon = () => (
  <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
    {/* Default: a bare icon before the title, tone-tinting the glyph. */}
    <StatCard label="Revenue" value="$48.2K" icon="Shop" tone="emerald" />
    {/* \`iconBackground\` paints the toned chip back behind the icon. */}
    <StatCard
      label="Customers"
      value="1,204"
      icon="Users"
      tone="violet"
      iconBackground
    />
    {/* \`iconPlacement="right"\` pins the chip to the card's top-right. */}
    <StatCard
      label="Deploys"
      value="86"
      icon="Cog"
      tone="blue"
      iconTone="amber"
      iconBackground
      iconPlacement="right"
    />
  </div>
);

export default WithIcon;
`,D=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(t,{gradient:!0,tone:"violet",label:"Revenue",value:"$48.2K",icon:"Shop",trend:{value:"+12.4%",direction:"up"}}),e.jsx(t,{gradient:!0,tone:"emerald",label:"Customers",value:"1,204",icon:"Users"}),e.jsx(t,{gradient:!0,tone:"blue",variant:"liquid-glass",label:"Deploys",value:"86",icon:"Cog"})]}),E=`import { StatCard } from "@cjlapao/ui-kit";

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
`,B=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(t,{gradient:!0,tone:"emerald",progress:!0,label:"Game completed",value:"100%"}),e.jsx(t,{gradient:!0,tone:"violet",progress:72,label:"Build pipeline",value:"3/4"}),e.jsx(t,{tone:"blue",progress:!0,label:"Syncing",value:"2,481"})]}),H=`import { StatCard } from "@cjlapao/ui-kit";

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
`,I=["xs","sm","md","lg","xl"],O=()=>e.jsx("div",{className:"flex w-full flex-wrap items-end gap-4",children:I.map(a=>e.jsx(t,{size:a,className:"min-w-44 flex-1",label:`Size ${a}`,value:"1,204",icon:"Shop"},a))}),G=`import { StatCard } from "@cjlapao/ui-kit";

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
`,M=["elevated","outlined","glass","liquid-glass"],V=()=>e.jsx("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-2",children:M.map(a=>e.jsx(t,{variant:a,label:`variant="${a}"`,value:"$1.42M",icon:"Shop",tone:"violet"},a))}),$=`import { StatCard } from "@cjlapao/ui-kit";

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
`,W=()=>e.jsxs("div",{className:"grid w-full grid-cols-1 gap-4 sm:grid-cols-3",children:[e.jsx(r,{label:"Service health",state:"healthy",bpm:72,trend:{value:"all systems",direction:"neutral"}}),e.jsx(r,{label:"Latency",state:"warning",bpm:96}),e.jsx(r,{label:"Error budget",state:"unhealthy",bpm:128})]}),q=`import { StatHealthCard } from "@cjlapao/ui-kit";

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
`,L=[{id:"us",title:"us-east",value:128,subtitle:"3 zones",trend:{value:"+12%",direction:"up"}},{id:"eu",title:"eu-west",value:86,subtitle:"2 zones",trend:{value:"-4%",direction:"down"}},{id:"ap",title:"ap-south",value:41,subtitle:"1 zone",trend:{value:"0%",direction:"neutral"}}],F=[{id:"jan",title:"January",value:412,meta:[{text:"billed",icon:"Shop"}]},{id:"feb",title:"February",value:380}];function U(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(t,{label:"Active capsules",icon:"Rocket",tone:"blue",pages:L}),e.jsx(v,{label:"Invoices",size:"lg",icon:"Database",tone:"violet",pagerPlacement:"bottom",loopPages:!0,pages:F,breakdown:[{label:"Paid",value:361,color:"emerald"},{label:"Overdue",value:19,color:"rose"}]})]})}const _=`import { StatCard, StatCountTile } from "@cjlapao/ui-kit";

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
`;function K(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3",children:[e.jsx(t,{label:"Quota used",value:"62%",icon:"Database",tone:"cyan",subtitle:"across 3 regions"}),e.jsx(t,{label:"Selected",value:"us-east-1",icon:"Globe",tone:"cyan",active:!0,subtitle:"the filter in play"}),e.jsx(t,{label:"Selected in its own hue",value:"amber",icon:"Filter",tone:"cyan",active:!0,activeTone:"amber",subtitle:"rim and wash move together"}),e.jsx(t,{label:"Demanding attention",value:"7",icon:"AlertTriangle",tone:"cyan",pulse:!0,pulseTone:"rose",subtitle:"urgent without repainting"}),e.jsx(t,{label:"Put a pointer on this one",value:"violet",icon:"Clock",tone:"cyan",hoverable:!0,active:!0,activeTone:"violet",subtitle:"the hover wears the chosen hue"}),e.jsx(t,{label:"On the gradient wash",value:"99.98%",icon:"Activity",tone:"cyan",gradient:!0,active:!0,pulse:!0,subtitle:"rim and glow only"})]})}const Q=`import { StatCard } from "@cjlapao/ui-kit";

/**
 * The card's state, drawn by the surface underneath it.
 *
 * \`active\` ignites the selection rim and wash; \`pulse\` breathes a glow inward
 * from the rim — the same props \`Panel\` answers, forwarded untouched, so every
 * Stat tile in the family takes them the same way. \`activeTone\` and \`pulseTone\`
 * let those two states wear hues the card itself does not: an urgent rose on a
 * blue card is a different message from a blue card.
 *
 * The pointer card is the one to try. \`activeTone\` is not only the colour of the
 * rim and wash once the card is chosen — while it *is* chosen the hover wears
 * that hue too, so the pointer never contradicts the state. The follow belongs to
 * the state, not to the hue: an unchosen card keeps hovering in its own tone.
 * \`hoverable\` is what lets a card answer the pointer without being clickable, and
 * \`hoverColor\` pins a card's hover back to its brand hue when the selection has
 * gone somewhere else.
 *
 * The last card is the honest caveat. A \`gradient\` card paints its own
 * background, which outranks the active wash the way \`backgroundColor\` does —
 * so on the wash the selection arrives as rim and glow only. That is the right
 * hierarchy: the gradient is the card's identity, the rim is its state.
 */
export default function Selection() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Quota used"
        value="62%"
        icon="Database"
        tone="cyan"
        subtitle="across 3 regions"
      />
      <StatCard
        label="Selected"
        value="us-east-1"
        icon="Globe"
        tone="cyan"
        active
        subtitle="the filter in play"
      />
      <StatCard
        label="Selected in its own hue"
        value="amber"
        icon="Filter"
        tone="cyan"
        active
        activeTone="amber"
        subtitle="rim and wash move together"
      />
      <StatCard
        label="Demanding attention"
        value="7"
        icon="AlertTriangle"
        tone="cyan"
        pulse
        pulseTone="rose"
        subtitle="urgent without repainting"
      />
      <StatCard
        label="Put a pointer on this one"
        value="violet"
        icon="Clock"
        tone="cyan"
        hoverable
        active
        activeTone="violet"
        subtitle="the hover wears the chosen hue"
      />
      <StatCard
        label="On the gradient wash"
        value="99.98%"
        icon="Activity"
        tone="cyan"
        gradient
        active
        pulse
        subtitle="rim and glow only"
      />
    </div>
  );
}
`,re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(m,{name:"Stat Card",description:"A metric in a card — label, big value, optional trend pill, icon, optional progress, and a full-size surface underneath. Every Panel variant, tone and corner works; `gradient` paints the surface itself, and `raisedSurface` forces the first nested-panels depth step — the tinted-card-on-matching-background fix."}),e.jsx(P,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(n,{title:"Loading and error",description:"The three loader treatments, skeleton by default and shaped like the card so the grid keeps its layout — the spinner and progress types cover the card instead, keeping the previous value readable underneath.",code:T,filename:"States.tsx",children:e.jsx(k,{})}),e.jsx(n,{title:"Progress: spinner or bar",description:"One feature, two renderings. The bar spans the full width at the bottom; `syncValueToProgress` drives it from the card's own figure so a percentage is written once.",code:C,filename:"Progress.tsx",children:e.jsx(j,{})}),e.jsx(n,{title:"Label and value typography",description:"Each carries its own tone and type scale, falling back to the card's `size`. They used to share one `valueTone`, so a muted label over a coloured figure — the common case — was impossible.",code:y,filename:"Typography.tsx",children:e.jsx(S,{})}),e.jsx(n,{title:"Selected, pulsing & hovering",description:"The state half of the Panel surface, forwarded whole: `active` for the selection rim and wash, `pulse` for the glow that swells inward from the rim, and `activeTone` / `pulseTone` for the hues they wear when those should disagree with the card. The hover wears the hue the card is chosen in, but only while it is — the pointer never contradicts the state, and unchosen cards keep hovering in their own tone. `hoverColor` overrules that, while `hoverable` lets a card nobody clicks answer the pointer anyway. Every Stat tile takes them the same way. A `gradient` card is the exception worth knowing — its own background outranks the wash, so there the selection reads as rim and glow.",code:Q,filename:"Selection.tsx",children:e.jsx(K,{})}),e.jsx(n,{title:"Basic",description:"A label, a value, and a trend pill. The trend's direction picks its tone — up is emerald, down is rose, neutral is slate.",code:z,filename:"Basic.tsx",children:e.jsx(N,{})}),e.jsx(n,{title:"With Icon",description:'By default the `icon` renders bare before the title — the tone (or an overriding `iconTone`) tints the glyph itself. `iconBackground` paints the toned chip back behind it, and `iconPlacement="right"` pins the icon to the card\'s top-right instead of centring the title on it.',code:R,filename:"WithIcon.tsx",children:e.jsx(A,{})}),e.jsx(n,{title:"Gradient",description:"`gradient` paints the surface with a dark diagonal `tone` wash (950 → 800 → 700, the PrimeVue showcase look) and switches the copy to white. On translucent variants the stops step down to 60% alpha so the backdrop blur stays visible — the third card is a `liquid-glass` Panel wearing the same wash.",code:E,filename:"Gradient.tsx",children:e.jsx(D,{})}),e.jsx(n,{title:"With Progress",description:"`progress` pins a `ProgressSpinner` to the bottom-right corner, tinted by the card's `tone` and sized to it. Bare `progress` is indeterminate; a number is a clamped determinate value. Works on plain cards too — the third card has no `gradient`.",code:H,filename:"WithProgress.tsx",children:e.jsx(B,{})}),e.jsx(n,{title:"Sizes",description:"The full control scale — `xs` through `xl` — steps the value font, chip, icon and trend pill together. `sm`/`md`/`lg` keep the metrics they always had.",code:G,filename:"Sizes.tsx",children:e.jsx(O,{})}),e.jsx(n,{title:"Variants",description:"Every Panel surface works as the card's base — `elevated`, `outlined`, `glass`, `liquid-glass` — with its tone applied on top. `gradient` and `variant` compose: the variant keeps its shadow, ring and blur while the wash replaces the fill.",code:$,filename:"Variants.tsx",children:e.jsx(V,{})}),e.jsx(n,{title:"Paging",description:'`pages` turns any Stat card into a paged one — prev / next arrows with the page title between them. Each page overrides the card while it shows and falls back to it for anything left out. Add `page` + `onPageChange` to control it, `loopPages` to wrap, `pagerPlacement="bottom"` to pin the strip under the content.',code:_,filename:"Paged.tsx",children:e.jsx(U,{})}),e.jsx(n,{title:"Health strip",description:"The ECG strip is its own component now: `StatHealthCard` is a `StatCard` with the monitor as its body, so every card prop still applies. `state` follows `healthy`, `warning`, `unhealthy`; `bpm` sets the tempo.",code:q,filename:"Health.tsx",children:e.jsx(W,{})})]})]});export{re as StatCardPage,re as default};
