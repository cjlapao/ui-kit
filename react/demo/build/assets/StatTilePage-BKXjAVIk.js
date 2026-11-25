import{r as l,j as e,hO as x,hQ as q,ia as G,ib as F,ic as w,hR as y,id as Y,ie as J,B as L,H as Z,t as ee}from"./index-CQwZVYnB.js";import{P as te}from"./PageHeader-BhZxEVHt.js";import{E as v}from"./ExampleCard-BZsKA5_g.js";import{P as ae,C as b,T as h,a as S}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ne}from"./ControlAccordion-C7vC6faF.js";import{u as le}from"./StatBaseControls-CT-z9LkG.js";import{bh as se}from"./options-Byh1yOHz.js";import"./SurfaceToneControl-LH37fS9y.js";import"./HueControl-B9PfQcfP.js";const re=[{label:"Card",value:"card"},{label:"Tile",value:"tile"},{label:"Count",value:"count"},{label:"Goal",value:"goal"},{label:"Chart",value:"chart"},{label:"Graph",value:"graph"},{label:"Health",value:"health"}],oe={card:"The base. Everything else on this page is this component with a body.",tile:"StatCard under the older prop names — `title`, `color`, `textColor`, a `progress` object. Nothing of its own.",count:"Adds `breakdown`: labelled rows under the count. Defaults `size` to `xl`.",goal:"Adds `goals` and `ringSize`. Rings scale with the card's `size`.",chart:"Adds `data` and `chartSize`: a navigable donut with a legend.",graph:"Adds `data`, `series` and `chartType`. `variant` is the Panel surface again — it used to be the chart kind.",health:"Adds `state`, `bpm` and `height`: a live ECG trace as the body."},ie=[{value:78,label:"Uptime target",icon:"HealthCheck"},{value:45,label:"Cost budget",icon:"Shop"},{value:92,label:"Coverage",icon:"Rocket"}],P=[{id:"regions",label:"By region",centerLabel:"capsules",items:[{label:"us-east",value:48},{label:"eu-west",value:31},{label:"ap-south",value:22},{label:"sa-east",value:9}]},{id:"tiers",label:"By tier",centerLabel:"capsules",items:[{label:"Standard",value:71},{label:"Premium",value:27},{label:"Trial",value:12}]}],de=[{name:"Mon",requests:42,errors:4},{name:"Tue",requests:58,errors:7},{name:"Wed",requests:51,errors:3},{name:"Thu",requests:73,errors:9},{name:"Fri",requests:66,errors:5}],ce=[{key:"requests",label:"Requests"},{key:"errors",label:"Errors"}],ue=[{label:"Running",value:96},{label:"Paused",value:24},{label:"Failed",value:8,color:"rose"}],he=()=>{const{groups:s,statProps:t,previewClassName:i,previewItemClassName:d,previewStageRef:c}=le(),[o,a]=l.useState("card"),[r,g]=l.useState(!1),[k,B]=l.useState(!0),[f,_]=l.useState(""),[C,H]=l.useState(!0),[T,$]=l.useState("bar"),[j,D]=l.useState(!0),[R,M]=l.useState(!0),[N,W]=l.useState(!0),[A,U]=l.useState(!0),[E,V]=l.useState("healthy"),[I,Q]=l.useState("60"),u="Active capsules",p=128,K=(()=>{switch(o){case"count":return e.jsx(S,{label:"Count extras",children:e.jsx(h,{label:"Breakdown rows",checked:k,onChange:B})});case"goal":return e.jsx(b,{label:"Ring size",options:[{label:"(from size)",value:""},{label:"40",value:"40"},{label:"64",value:"64"},{label:"88",value:"88"}],value:f,onChange:_});case"chart":return e.jsx(S,{label:"Chart extras",children:e.jsx(h,{label:"Two datasets",checked:C,onChange:H})});case"graph":return e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Chart type",options:J.map(n=>({label:n,value:n})),value:T,onChange:n=>$(n)}),e.jsx(S,{label:"Graph extras",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(h,{label:"Axes",checked:j,onChange:D}),e.jsx(h,{label:"Grid",checked:R,onChange:M}),e.jsx(h,{label:"Legend",checked:N,onChange:W}),e.jsx(h,{label:"Animate",checked:A,onChange:U})]})})]});case"health":return e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Health state",options:se,value:E,onChange:n=>V(n)}),e.jsx(b,{label:"BPM",options:[{label:"48",value:"48"},{label:"60",value:"60"},{label:"96",value:"96"},{label:"128",value:"128"}],value:I,onChange:Q})]});default:return null}})(),X=(()=>{switch(o){case"tile":return e.jsx(Y,{...t,raisedSurface:r,title:u,value:p});case"count":return e.jsx(y,{...t,raisedSurface:r,label:u,value:p,breakdown:k?ue:void 0});case"goal":return e.jsx(w,{...t,raisedSurface:r,label:u,goals:ie,ringSize:f?Number(f):void 0});case"chart":return e.jsx(F,{...t,raisedSurface:r,label:u,data:C?P:P.slice(0,1)});case"graph":return e.jsx(G,{...t,raisedSurface:r,label:u,value:p,data:de,series:ce,chartType:T,showAxes:j,showGrid:R,showLegend:N,chartAnimation:A});case"health":return e.jsx(q,{...t,raisedSurface:r,label:u,value:p,state:E,bpm:Number(I)});default:return e.jsx(x,{...t,raisedSurface:r,label:u,value:p})}})();return e.jsx(ae,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ne,{groups:[{id:"variant",title:"Variant",controls:e.jsxs(e.Fragment,{children:[e.jsx(b,{label:"Stat variant",options:re.map(n=>({...n})),value:o,onChange:n=>a(n)}),K]})},...s.map(n=>n.id==="core"?{...n,controls:e.jsxs(e.Fragment,{children:[n.controls,e.jsx(h,{label:"Raised surface",checked:r,onChange:g})]})}:n)]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[oe[o]," Every control below ",e.jsx("strong",{children:"Stat variant"})," ","is a ",e.jsx("code",{children:"StatCard"})," prop and applies to all seven — they are the same hook the Stat Card page uses, so the two lists cannot drift."]})]}),preview:e.jsx("div",{ref:c,className:i??(o==="chart"||o==="graph"?"w-full max-w-md":"w-full max-w-xs"),children:e.jsx("div",{className:d,children:X})})})},m={variant:"elevated",size:"md",corner:"rounded-lg"};function me(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(x,{...m,label:"Active capsules",value:128,icon:"Rocket",tone:"blue",trend:{value:"+12%",direction:"up"}}),e.jsx(y,{...m,label:"Total",value:412,tone:"violet",icon:"Database",breakdown:[{label:"Running",value:128,color:"emerald"},{label:"Stopped",value:284,color:"rose"}]}),e.jsx(w,{...m,label:"Goals",tone:"emerald",goals:[{value:72,label:"Uptime",icon:"HealthCheck"},{value:45,label:"Coverage",icon:"Check"}]}),e.jsx(F,{...m,label:"Distribution",tone:"amber",data:[{id:1,label:"By state",centerLabel:"capsules",items:[{label:"Running",value:12},{label:"Paused",value:5},{label:"Failed",value:3}]}]}),e.jsx(G,{...m,label:"Throughput",value:"66/s",tone:"cyan",chartType:"bar",series:[{key:"requests",label:"Requests"}],data:[{name:"Mon",requests:42},{name:"Tue",requests:58},{name:"Wed",requests:51},{name:"Thu",requests:73},{name:"Fri",requests:66}]}),e.jsx(q,{...m,label:"Service health",value:"99.98%",tone:"rose",icon:"HealthCheck",state:"healthy",bpm:72})]})}const ge=`import {
  StatCard,
  StatChartTile,
  StatCountTile,
  StatGoalTile,
  StatGraphTile,
  StatHealthCard,
} from "@cjlapao/ui-kit";

/**
 * The whole family, driven by the same base props.
 *
 * Every one of these inherits \`StatCardProps\`, so \`variant\`, \`tone\`, \`size\`,
 * \`padding\`, \`corner\`, \`decoration\`, \`trend\`, \`loaderType\` and the rest mean
 * the same thing on all of them. Each adds one thing: a breakdown, rings, a
 * donut, a chart, an ECG trace.
 *
 * \`StatTile\` is not shown because it is \`StatCard\` under the older prop names
 * and renders identically.
 */
const shared = { variant: "elevated", size: "md", corner: "rounded-lg" } as const;

export default function Family() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <StatCard
        {...shared}
        label="Active capsules"
        value={128}
        icon="Rocket"
        tone="blue"
        trend={{ value: "+12%", direction: "up" }}
      />
      <StatCountTile
        {...shared}
        label="Total"
        value={412}
        tone="violet"
        icon="Database"
        breakdown={[
          { label: "Running", value: 128, color: "emerald" },
          { label: "Stopped", value: 284, color: "rose" },
        ]}
      />
      <StatGoalTile
        {...shared}
        label="Goals"
        tone="emerald"
        goals={[
          { value: 72, label: "Uptime", icon: "HealthCheck" },
          { value: 45, label: "Coverage", icon: "Check" },
        ]}
      />
      <StatChartTile
        {...shared}
        label="Distribution"
        tone="amber"
        data={[
          {
            id: 1,
            label: "By state",
            centerLabel: "capsules",
            items: [
              { label: "Running", value: 12 },
              { label: "Paused", value: 5 },
              { label: "Failed", value: 3 },
            ],
          },
        ]}
      />
      <StatGraphTile
        {...shared}
        label="Throughput"
        value="66/s"
        tone="cyan"
        chartType="bar"
        series={[{ key: "requests", label: "Requests" }]}
        data={[
          { name: "Mon", requests: 42 },
          { name: "Tue", requests: 58 },
          { name: "Wed", requests: 51 },
          { name: "Thu", requests: 73 },
          { name: "Fri", requests: 66 },
        ]}
      />
      <StatHealthCard
        {...shared}
        label="Service health"
        value="99.98%"
        tone="rose"
        icon="HealthCheck"
        state="healthy"
        bpm={72}
      />
    </div>
  );
}
`;function pe(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(w,{label:"Loading",icon:"Rocket",loading:!0,goals:[{value:72,label:"Uptime",icon:"HealthCheck"}]}),e.jsx(y,{label:"Failed",size:"md",value:0,icon:"Rocket",error:{message:"Registry unreachable",onRetry:()=>{}}}),e.jsx(x,{label:"Quota",value:"64%",icon:"Database",progress:64,progressType:"bar",progressLabel:"Used"})]})}const be=`import { StatCountTile, StatGoalTile, StatCard } from "@cjlapao/ui-kit";

/**
 * Loading, error and progress are the base card's, so they look and behave the
 * same on every member of the family — including the ones whose body is a
 * chart. The loader shapes the card and keeps the grid's layout; the error's
 * retry is a real \`Button\`, where it used to be a bare \`<button
 * className="text-blue-600 …">\` with a hardcoded blue and no dark-mode
 * partner; the bar is a real \`Progress\` with an accessible name, where it used
 * to be two nested divs with no role.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <StatGoalTile
        label="Loading"
        icon="Rocket"
        loading
        goals={[{ value: 72, label: "Uptime", icon: "HealthCheck" }]}
      />
      <StatCountTile
        label="Failed"
        size="md"
        value={0}
        icon="Rocket"
        error={{ message: "Registry unreachable", onRetry: () => {} }}
      />
      <StatCard
        label="Quota"
        value="64%"
        icon="Database"
        progress={64}
        progressType="bar"
        progressLabel="Used"
      />
    </div>
  );
}
`,O=["Loop stuck in retry","Escalated deploy gate","Flaky assertion on nightly","Quota alarm on inference","Token budget exceeded","Webhook backlog growing","Stale cache after deploy","Rate-limited upstream","Retry storm in dispatcher","Memory watermark breached"],xe=Array.from({length:41},(s,t)=>({id:`alr-${t}`,title:O[t%O.length],subtitle:`capsule-${t%9+1} · queue ${String.fromCharCode(65+t%4)}`,icon:["Bug","Warning","Shield","CloudOff"][t%4],tone:["rose","amber","violet","blue"][t%4],count:t*7%23+1,age:`${t*13%58+2}m ago`})),fe=Array.from({length:128},(s,t)=>({id:`lp-${t}`,title:`loop-${String(t).padStart(4,"0")}`,subtitle:["nightly","hourly","on-change","canary"][t%4],duration:`${t%17+1}m ${String(t*7%60).padStart(2,"0")}s`,count:t*3%40+1})),ve=s=>new Promise(t=>setTimeout(t,s)),z=async(s,{page:t,pageSize:i},d,c,o)=>{if(await ve(250+Math.random()*350),c?.aborted)throw new Error("aborted");if(d.current)throw d.current=!1,o(),new Error("simulated outage");const a=t*i;return{items:s.slice(a,a+i),hasMore:a+i<s.length,total:s.length}};function Se(){const[s,t]=l.useState(null),[i,d]=l.useState(!1),c=l.useRef(!1),o=()=>{c.current=!0,d(!0)};return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsx(x,{label:"Needs you",value:41,icon:"Warning",tone:"amber",variant:"elevated",corner:"rounded-lg",hoverEffect:!0,drilldown:{title:"Needs you — oldest first",pageSize:8,fetchItems:({page:a,pageSize:r,signal:g})=>z(xe,{page:a,pageSize:r},c,g,()=>d(!1)),onItemClick:a=>t(`${String(a.title)} · ${a.subtitle??""}`),footer:e.jsxs("div",{className:"flex items-center justify-between gap-2",children:[e.jsx("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:"Escalations auto-close after 24h"}),e.jsx(L,{size:"sm",variant:"ghost",color:"amber",trailingIcon:"ChevronRight",onClick:()=>t("View all alerts"),children:"View all"})]})}}),e.jsx(x,{label:"Loops at work",value:128,icon:"Activity",tone:"blue",variant:"elevated",corner:"rounded-lg",hoverEffect:!0,drilldown:{title:"Running loops",pageSize:10,emptyMessage:"No loops are running right now",fetchItems:({page:a,pageSize:r,signal:g})=>z(fe,{page:a,pageSize:r},c,g,()=>d(!1)),renderItem:a=>e.jsxs("div",{className:"flex w-full items-center gap-3 rounded-md px-3 py-2.5",children:[e.jsx(Z,{icon:"Rocket",size:"sm",className:"flex-none text-blue-500 dark:text-blue-400"}),e.jsxs("span",{className:"min-w-0 flex-1",children:[e.jsx("span",{className:"block truncate font-mono text-[13px] text-neutral-900 dark:text-white",children:a.title}),e.jsxs("span",{className:"block truncate text-xs text-neutral-500 dark:text-neutral-400",children:["trigger · ",String(a.subtitle??"—")]})]}),e.jsx("span",{className:"flex-none font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400",children:a.duration}),e.jsxs(ee,{tone:"blue",size:"xs",variant:"soft",children:["×",String(a.count??1)]})]})}})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx(L,{size:"sm",variant:i?"solid":"outline",color:"rose",leadingIcon:"CloudOff",onClick:o,children:i?"Next request will fail":"Simulate an outage"}),e.jsx("span",{children:s?e.jsxs(e.Fragment,{children:["Opened ",e.jsx("strong",{className:"text-neutral-700 dark:text-neutral-200",children:s})]}):"Click a tile to open its list; keep scrolling to page in more. The outage button fails the next page once — the list shows its retry."})]})]})}const we=`import { useRef, useState } from "react";
import {
  Button,
  CustomIcon,
  Pill,
  StatCard,
  type StatCardDrilldownItem,
} from "@cjlapao/ui-kit";

/**
 * The drilldown: a tile whose number hides a whole paginated list. The tile
 * IS the trigger — click it (or Enter on the keyboard) and a solid-surface
 * dropdown opens, rows streaming in a page at a time as the scrollbar
 * reaches the bottom. Nothing is fetched until the first open, and the
 * chevron-free affordance stays the tile itself.
 *
 * \`fetchItems\` below is the contract an app implements: page in, items out,
 * plus \`hasMore\` and (optionally) a \`total\` for the header chip. It is given
 * an \`AbortSignal\` — honour it and stale responses never land.
 */

/* ------------------------------------------------------------------ */
/*  A fake paginated API: 41 alerts and 128 loops, 250–600 ms per page  */
/* ------------------------------------------------------------------ */

interface AlertItem extends StatCardDrilldownItem {
  age: string;
}

const ALERT_TITLES = [
  "Loop stuck in retry",
  "Escalated deploy gate",
  "Flaky assertion on nightly",
  "Quota alarm on inference",
  "Token budget exceeded",
  "Webhook backlog growing",
  "Stale cache after deploy",
  "Rate-limited upstream",
  "Retry storm in dispatcher",
  "Memory watermark breached",
];

const ALERT_POOL: AlertItem[] = Array.from({ length: 41 }, (_, i) => ({
  id: \`alr-\${i}\`,
  title: ALERT_TITLES[i % ALERT_TITLES.length],
  subtitle: \`capsule-\${(i % 9) + 1} · queue \${String.fromCharCode(65 + (i % 4))}\`,
  icon: (["Bug", "Warning", "Shield", "CloudOff"] as const)[i % 4],
  tone: (["rose", "amber", "violet", "blue"] as const)[i % 4],
  count: ((i * 7) % 23) + 1,
  age: \`\${((i * 13) % 58) + 2}m ago\`,
}));

interface LoopItem extends StatCardDrilldownItem {
  duration: string;
}

const LOOP_POOL: LoopItem[] = Array.from({ length: 128 }, (_, i) => ({
  id: \`lp-\${i}\`,
  title: \`loop-\${String(i).padStart(4, "0")}\`,
  subtitle: (["nightly", "hourly", "on-change", "canary"] as const)[i % 4],
  duration: \`\${(i % 17) + 1}m \${String((i * 7) % 60).padStart(2, "0")}s\`,
  count: ((i * 3) % 40) + 1,
}));

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const paged = async <T extends StatCardDrilldownItem>(
  pool: T[],
  { page, pageSize }: { page: number; pageSize: number },
  flakyRef: { current: boolean },
  signal: AbortSignal | undefined,
  onOutageConsumed: () => void,
) => {
  await wait(250 + Math.random() * 350);
  // Stale requests (the tile closed or reloaded mid-flight) are abandoned —
  // and the armed outage stays armed for the request that actually counts.
  if (signal?.aborted) throw new Error("aborted");
  if (flakyRef.current) {
    flakyRef.current = false;
    onOutageConsumed();
    throw new Error("simulated outage");
  }
  const start = page * pageSize;
  return {
    items: pool.slice(start, start + pageSize),
    hasMore: start + pageSize < pool.length,
    total: pool.length,
  };
};

/* ------------------------------------------------------------------ */
/*  The demo                                                            */
/* ------------------------------------------------------------------ */

export default function Drilldown() {
  const [opened, setOpened] = useState<string | null>(null);
  const [flaky, setFlaky] = useState(false);
  const flakyRef = useRef(false);

  const armOutage = () => {
    flakyRef.current = true;
    setFlaky(true);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {/* The alert tile: rows are real buttons via \`onItemClick\`, the
            footer carries navigation, and each page reports its \`total\`. */}
        <StatCard
          label="Needs you"
          value={41}
          icon="Warning"
          tone="amber"
          variant="elevated"
          corner="rounded-lg"
          hoverEffect
          drilldown={{
            title: "Needs you — oldest first",
            pageSize: 8,
            fetchItems: ({ page, pageSize, signal }) =>
              paged(ALERT_POOL, { page, pageSize }, flakyRef, signal, () => setFlaky(false)),
            onItemClick: (item) =>
              setOpened(\`\${String(item.title)} · \${item.subtitle ?? ""}\`),
            footer: (
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  Escalations auto-close after 24h
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  color="amber"
                  trailingIcon="ChevronRight"
                  onClick={() => setOpened("View all alerts")}
                >
                  View all
                </Button>
              </div>
            ),
          }}
        />

        {/* The loops tile: \`renderItem\` replaces the built-in row entirely —
            same pagination chrome, completely different row anatomy. */}
        <StatCard
          label="Loops at work"
          value={128}
          icon="Activity"
          tone="blue"
          variant="elevated"
          corner="rounded-lg"
          hoverEffect
          drilldown={{
            title: "Running loops",
            pageSize: 10,
            emptyMessage: "No loops are running right now",
            fetchItems: ({ page, pageSize, signal }) =>
              paged(LOOP_POOL, { page, pageSize }, flakyRef, signal, () => setFlaky(false)),
            renderItem: (item) => (
              <div className="flex w-full items-center gap-3 rounded-md px-3 py-2.5">
                <CustomIcon
                  icon="Rocket"
                  size="sm"
                  className="flex-none text-blue-500 dark:text-blue-400"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-mono text-[13px] text-neutral-900 dark:text-white">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-neutral-500 dark:text-neutral-400">
                    trigger · {String(item.subtitle ?? "—")}
                  </span>
                </span>
                <span className="flex-none font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {item.duration}
                </span>
                <Pill tone="blue" size="xs" variant="soft">
                  ×{String(item.count ?? 1)}
                </Pill>
              </div>
            ),
          }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        <Button
          size="sm"
          variant={flaky ? "solid" : "outline"}
          color="rose"
          leadingIcon="CloudOff"
          onClick={armOutage}
        >
          {flaky ? "Next request will fail" : "Simulate an outage"}
        </Button>
        <span>
          {opened ? (
            <>
              Opened <strong className="text-neutral-700 dark:text-neutral-200">{opened}</strong>
            </>
          ) : (
            "Click a tile to open its list; keep scrolling to page in more. The outage button fails the next page once — the list shows its retry."
          )}
        </span>
      </div>
    </div>
  );
}
`,Ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(te,{name:"Stat Tiles",description:"The metric-tile family, all built on StatCard. Every tile inherits StatCardProps in full — variant, tone, size, padding, corner, decoration, `active`, `pulse` and the hover with the hues those three wear, label and value tone and scale, progress, loader, trend, meta, footer, plus `raisedSurface` (forces the first nested-panels depth step — the tinted-card-on-matching-background fix) — and adds one thing of its own: a breakdown, rings, a donut, a chart, an ECG trace. Pick the variant in the playground; the controls below it are the base card's, shared with that page."}),e.jsx(he,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(v,{title:"The family",description:"Six variants under one set of base props. They share StatCard's surface, header, trend and states, so a dashboard mixing them stays consistent.",code:ge,filename:"Family.tsx",children:e.jsx(me,{})}),e.jsx(v,{title:"Loading, error and progress",description:"All three come from the base card, so they behave identically on a tile whose body is a chart. The retry is a real Button and the bar a real Progress with an accessible name — previously a hardcoded-blue anchor-like button and two roleless divs.",code:be,filename:"States.tsx",children:e.jsx(pe,{})}),e.jsx(v,{title:"Drilldown — the number opens a list",description:"Give a tile a `drilldown` and it becomes the trigger for an anchored dropdown over the app's own paged API: `fetchItems({page, pageSize, signal})` in, infinite scroll, skeletons, staggered rows and retries out. Nothing loads until first open. The alert tile uses the built-in row with `onItemClick` and a `footer`; the loops tile replaces the row entirely with `renderItem`. Try the outage button to see the retry path.",code:we,filename:"Drilldown.tsx",children:e.jsx(Se,{})})]})]});export{Ie as StatTilePage,Ie as default};
