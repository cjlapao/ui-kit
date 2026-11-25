import{r as n,a1 as X,j as e,hL as l,P as T,bf as d,c as x,t as s}from"./index-CQwZVYnB.js";import{P as Y}from"./PageHeader-BhZxEVHt.js";import{E as b}from"./ExampleCard-BZsKA5_g.js";import{S as Z}from"./SurfaceToneControl-LH37fS9y.js";import{P as ee,S as E,a as i,T as r}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as te}from"./ControlAccordion-C7vC6faF.js";import{b3 as ne,f as ae,p as ie,A as se,B as le,C as oe}from"./options-Byh1yOHz.js";const re=["glass","liquid-glass","default"],de=[{label:"Right",value:"right"},{label:"Bottom",value:"bottom"},{label:"Bottom end",value:"bottom-end"}],ce=[{title:"orchestrator-api",subtitle:"Deployed 12 minutes ago",description:"Handles capsule lifecycle and scheduling.",icon:"Container"},{title:"reverse-proxy",subtitle:"Deployed 2 hours ago",description:"Terminates TLS and routes to each service.",icon:"ReverseProxy"},{title:"postgres",subtitle:"Deployed 3 days ago",description:"Primary datastore with nightly snapshots.",icon:"Database"}],pe=()=>{const[a,o]=n.useState("orchestrator-api"),[v,z]=n.useState("Deployed 12 minutes ago"),[f,R]=n.useState("Handles capsule lifecycle and scheduling."),[c,L]=n.useState("right"),[p,O]=n.useState("outlined"),[u,B]=n.useState("none"),[j,W]=n.useState(X),[y,H]=n.useState("sm"),[C,G]=n.useState(!1),[h,F]=n.useState(!0),[S,M]=n.useState(!0),[g,V]=n.useState(!0),[m,_]=n.useState(!1),[w,U]=n.useState(!1),[k,$]=n.useState("frosted"),[D,q]=n.useState("medium"),[P,J]=n.useState("classic"),[N,I]=n.useState(null),K=re.includes(p),A=S?e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"})]}):void 0,Q={variant:p,tone:u,corner:j,padding:y,raisedSurface:C,badgesAlignment:c,disabled:w,glassOpacity:k,vibrancy:D,specularMode:P};return e.jsx(ee,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(te,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(E,{label:"Variant",options:ne,value:p,onChange:t=>O(t)}),e.jsx(Z,{label:"Tone",value:u,onChange:B}),e.jsx(E,{label:"Corner",options:ae,value:j,onChange:t=>W(t)}),e.jsx(i,{label:"Padding",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ie,value:y,onChange:t=>H(t)})}),e.jsx(r,{label:"Raised surface",checked:C,onChange:G})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(r,{label:"Icon",checked:h,onChange:F}),e.jsx(r,{label:"Badges",checked:S,onChange:M}),e.jsx(r,{label:"Expandable detail",checked:g,onChange:V}),e.jsx(r,{label:"Row is clickable",checked:m,onChange:_}),e.jsx(r,{label:"Disabled",checked:w,onChange:U})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Badges alignment",children:e.jsx(d,{fullWidth:!0,size:"sm",options:de,value:c,onChange:t=>L(t)})}),e.jsx(i,{label:"Title",children:e.jsx(x,{size:"sm",value:a,onChange:t=>o(t.target.value)})}),e.jsx(i,{label:"Subtitle",children:e.jsx(x,{size:"sm",value:v,onChange:t=>z(t.target.value)})}),e.jsx(i,{label:"Description",children:e.jsx(x,{size:"sm",value:f,onChange:t=>R(t.target.value)})})]})},...K?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:se,value:P,onChange:t=>J(t)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:le,value:D,onChange:t=>q(t)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:oe,value:k,onChange:t=>$(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("strong",{children:"Row is clickable"})," on, the whole row becomes a keyboard-reachable button — tab to it and press Enter. Expanding a row never triggers it.",N&&` Last selected: ${N}.`]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(l,{...Q,title:a,subtitle:v,description:f,icon:h?"Container":void 0,badges:A,onClick:m?()=>I(a):void 0,children:g?e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Everything in here is the expandable detail. It animates open to its natural height and is inert while collapsed."}),e.jsx("p",{className:"font-mono text-xs opacity-70",children:"image: ghcr.io/acme/orchestrator-api:2.14.0"})]}):void 0})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"As a list — plain rows inside one card"}),e.jsx(T,{variant:"outlined",tone:"neutral",padding:"sm",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:ce.map(t=>e.jsx("div",{className:"py-2 first:pt-0 last:pb-0",children:e.jsx(l,{variant:"plain",tone:u,title:t.title,subtitle:t.subtitle,description:t.description,icon:h?t.icon:void 0,badges:A,badgesAlignment:c,onClick:m?()=>I(t.title):void 0,children:g?e.jsxs("p",{className:"font-mono text-xs opacity-70",children:[t.title," — detail panel"]}):void 0})},t.title))})})]})]})})},ue=[{title:"orchestrator-api",subtitle:"Deployed 12 minutes ago",description:"Handles capsule lifecycle and scheduling.",icon:"Container"},{title:"reverse-proxy",subtitle:"Deployed 2 hours ago",description:"Terminates TLS and routes to each service.",icon:"ReverseProxy"},{title:"postgres",subtitle:"Deployed 3 days ago",description:"Primary datastore with nightly snapshots.",icon:"Database"}],he=e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"})]});function ge(){return e.jsx(T,{variant:"outlined",tone:"neutral",padding:"sm",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:ue.map((a,o)=>e.jsx("div",{className:"py-2 first:pt-0 last:pb-0",children:e.jsx(l,{variant:"plain",title:a.title,subtitle:a.subtitle,description:a.description,icon:a.icon,badges:he,defaultExpanded:o===0,children:e.jsxs("p",{className:"font-mono text-xs opacity-70",children:["image: ghcr.io/acme/",a.title,":2.14.0"]})})},a.title))})})}const me=`import { DetailItemCard, Panel, Pill } from "@cjlapao/ui-kit";

const ROWS = [
  {
    title: "orchestrator-api",
    subtitle: "Deployed 12 minutes ago",
    description: "Handles capsule lifecycle and scheduling.",
    icon: "Container",
  },
  {
    title: "reverse-proxy",
    subtitle: "Deployed 2 hours ago",
    description: "Terminates TLS and routes to each service.",
    icon: "ReverseProxy",
  },
  {
    title: "postgres",
    subtitle: "Deployed 3 days ago",
    description: "Primary datastore with nightly snapshots.",
    icon: "Database",
  },
];

const badges = (
  <>
    <Pill tone="emerald" size="xs">
      Healthy
    </Pill>
    <Pill tone="amber" size="xs">
      2 warnings
    </Pill>
  </>
);

export default function ServiceList() {
  return (
    <Panel variant="outlined" tone="neutral" padding="sm">
      <div className="divide-y divide-black/5 dark:divide-white/10">
        {ROWS.map((row, index) => (
          <div key={row.title} className="py-2 first:pt-0 last:pb-0">
            <DetailItemCard
              variant="plain"
              title={row.title}
              subtitle={row.subtitle}
              description={row.description}
              icon={row.icon}
              badges={badges}
              defaultExpanded={index === 0}
            >
              <p className="font-mono text-xs opacity-70">
                image: ghcr.io/acme/{row.title}:2.14.0
              </p>
            </DetailItemCard>
          </div>
        ))}
      </div>
    </Panel>
  );
}
`,xe=["right","bottom","bottom-end"];function be(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:xe.map(a=>e.jsx(l,{variant:"outlined",tone:"indigo",title:"billing-worker",subtitle:"Deployed 1 hour ago",icon:"Log",badgesAlignment:a,badges:e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"}),e.jsx(s,{tone:"rose",size:"xs",children:"Degraded"})]})},a))})}const ve=`import { DetailItemCard, Pill } from "@cjlapao/ui-kit";
import type { DetailItemCardBadgesAlignment } from "@cjlapao/ui-kit";

const ALIGNMENTS: DetailItemCardBadgesAlignment[] = [
  "right",
  "bottom",
  "bottom-end",
];

export default function BadgeAlignments() {
  return (
    <div className="flex w-full flex-col gap-4">
      {ALIGNMENTS.map((alignment) => (
        <DetailItemCard
          key={alignment}
          variant="outlined"
          tone="indigo"
          title="billing-worker"
          subtitle="Deployed 1 hour ago"
          icon="Log"
          badgesAlignment={alignment}
          badges={
            <>
              <Pill tone="emerald" size="xs">
                Healthy
              </Pill>
              <Pill tone="amber" size="xs">
                2 warnings
              </Pill>
              <Pill tone="rose" size="xs">
                Degraded
              </Pill>
            </>
          }
        />
      ))}
    </div>
  );
}
`;function fe(){const[a,o]=n.useState(null);return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(l,{variant:"outlined",tone:"emerald",title:"clickable-row",subtitle:"Selected when clicked",icon:"Rocket",defaultExpanded:!0,onClick:()=>o("clickable-row"),children:e.jsx("p",{children:"With onClick the whole row is a keyboard-reachable button — tab to it and press Enter. Expanding never triggers it."})}),a&&e.jsxs("p",{className:"text-xs opacity-70",children:["Last selected: ",a,"."]}),e.jsx(l,{variant:"outlined",tone:"slate",title:"disabled-row",subtitle:"Cannot be activated",icon:"Container",disabled:!0,onClick:()=>o("disabled-row")}),e.jsx(l,{variant:"outlined",tone:"blue",title:"no-detail",subtitle:"No children, so no toggle",icon:"Database",badges:e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"})})]})}const je=`import { useState } from "react";
import { DetailItemCard, Pill } from "@cjlapao/ui-kit";

export default function CardStates() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-4">
      <DetailItemCard
        variant="outlined"
        tone="emerald"
        title="clickable-row"
        subtitle="Selected when clicked"
        icon="Rocket"
        defaultExpanded
        onClick={() => setSelected("clickable-row")}
      >
        <p>
          With onClick the whole row is a keyboard-reachable button — tab to
          it and press Enter. Expanding never triggers it.
        </p>
      </DetailItemCard>
      {selected && (
        <p className="text-xs opacity-70">Last selected: {selected}.</p>
      )}
      <DetailItemCard
        variant="outlined"
        tone="slate"
        title="disabled-row"
        subtitle="Cannot be activated"
        icon="Container"
        disabled
        onClick={() => setSelected("disabled-row")}
      />
      <DetailItemCard
        variant="outlined"
        tone="blue"
        title="no-detail"
        subtitle="No children, so no toggle"
        icon="Database"
        badges={
          <Pill tone="emerald" size="xs">
            Healthy
          </Pill>
        }
      />
    </div>
  );
}
`,Ne=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Y,{name:"Detail Item Card",description:"A list row with an optional expandable detail. Plain by default; give it a variant and it becomes a real card — with `raisedSurface` forcing the first nested-panels depth step when card and background share a tint. Clickable rows are keyboard-reachable buttons."}),e.jsx(pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Service list",description:"The canonical case: plain rows with icon, badges and an expandable detail inside one card — the first row open by default.",code:me,filename:"ServiceList.tsx",children:e.jsx(ge,{})}),e.jsx(b,{title:"Badge alignments",description:"The badges can sit to the right of the row, or wrap below it — left-aligned or pushed to the end.",code:ve,filename:"BadgeAlignments.tsx",children:e.jsx(be,{})}),e.jsx(b,{title:"Card states",description:"A clickable card that records the selection, a disabled card, and a row with no detail — so no toggle is shown.",code:je,filename:"CardStates.tsx",children:e.jsx(fe,{})})]})]});export{Ne as DetailItemCardPage,Ne as default};
