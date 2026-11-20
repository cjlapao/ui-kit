import{r as n,a2 as K,j as e,gS as l,P as A,M as r,I as x,a1 as s}from"./index-dkEsqyUy.js";import{P as Q}from"./PageHeader-Cqxw9jAs.js";import{E as b}from"./ExampleCard-SmeeyhOh.js";import{S as X}from"./SurfaceToneControl-CptLUoZR.js";import{P as Y,S as E,C as i,T as d}from"./PlaygroundPanel-CD4VThIT.js";import{C as Z}from"./ControlAccordion-BM7PEMt8.js";import{b2 as ee,f as te,p as ne,x as ae,y as ie,z as se}from"./options-DH3jBuHJ.js";const le=["glass","liquid-glass","default"],oe=[{label:"Right",value:"right"},{label:"Bottom",value:"bottom"},{label:"Bottom end",value:"bottom-end"}],re=[{title:"orchestrator-api",subtitle:"Deployed 12 minutes ago",description:"Handles capsule lifecycle and scheduling.",icon:"Container"},{title:"reverse-proxy",subtitle:"Deployed 2 hours ago",description:"Terminates TLS and routes to each service.",icon:"ReverseProxy"},{title:"postgres",subtitle:"Deployed 3 days ago",description:"Primary datastore with nightly snapshots.",icon:"Database"}],de=()=>{const[a,o]=n.useState("orchestrator-api"),[v,z]=n.useState("Deployed 12 minutes ago"),[j,T]=n.useState("Handles capsule lifecycle and scheduling."),[c,L]=n.useState("right"),[p,R]=n.useState("outlined"),[u,O]=n.useState("none"),[f,W]=n.useState(K),[y,B]=n.useState("sm"),[g,H]=n.useState(!0),[C,G]=n.useState(!0),[h,F]=n.useState(!0),[m,M]=n.useState(!1),[S,V]=n.useState(!1),[w,_]=n.useState("frosted"),[k,U]=n.useState("medium"),[D,$]=n.useState("classic"),[P,N]=n.useState(null),q=le.includes(p),I=C?e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"})]}):void 0,J={variant:p,tone:u,corner:f,padding:y,badgesAlignment:c,disabled:S,glassOpacity:w,vibrancy:k,specularMode:D};return e.jsx(Y,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(Z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(E,{label:"Variant",options:ee,value:p,onChange:t=>R(t)}),e.jsx(X,{label:"Tone",value:u,onChange:O}),e.jsx(E,{label:"Corner",options:te,value:f,onChange:t=>W(t)}),e.jsx(i,{label:"Padding",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ne,value:y,onChange:t=>B(t)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(d,{label:"Icon",checked:g,onChange:H}),e.jsx(d,{label:"Badges",checked:C,onChange:G}),e.jsx(d,{label:"Expandable detail",checked:h,onChange:F}),e.jsx(d,{label:"Row is clickable",checked:m,onChange:M}),e.jsx(d,{label:"Disabled",checked:S,onChange:V})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Badges alignment",children:e.jsx(r,{fullWidth:!0,size:"sm",options:oe,value:c,onChange:t=>L(t)})}),e.jsx(i,{label:"Title",children:e.jsx(x,{size:"sm",value:a,onChange:t=>o(t.target.value)})}),e.jsx(i,{label:"Subtitle",children:e.jsx(x,{size:"sm",value:v,onChange:t=>z(t.target.value)})}),e.jsx(i,{label:"Description",children:e.jsx(x,{size:"sm",value:j,onChange:t=>T(t.target.value)})})]})},...q?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ae,value:D,onChange:t=>$(t)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(r,{fullWidth:!0,size:"sm",options:ie,value:k,onChange:t=>U(t)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(r,{fullWidth:!0,size:"sm",options:se,value:w,onChange:t=>_(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:["With ",e.jsx("strong",{children:"Row is clickable"})," on, the whole row becomes a keyboard-reachable button — tab to it and press Enter. Expanding a row never triggers it.",P&&` Last selected: ${P}.`]})]}),preview:e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(l,{...J,title:a,subtitle:v,description:j,icon:g?"Container":void 0,badges:I,onClick:m?()=>N(a):void 0,children:h?e.jsxs(e.Fragment,{children:[e.jsx("p",{children:"Everything in here is the expandable detail. It animates open to its natural height and is inert while collapsed."}),e.jsx("p",{className:"font-mono text-xs opacity-70",children:"image: ghcr.io/acme/orchestrator-api:2.14.0"})]}):void 0})}),e.jsxs("div",{children:[e.jsx("p",{className:"mb-2 text-xs font-semibold uppercase tracking-wide opacity-70",children:"As a list — plain rows inside one card"}),e.jsx(A,{variant:"outlined",tone:"neutral",padding:"sm",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:re.map(t=>e.jsx("div",{className:"py-2 first:pt-0 last:pb-0",children:e.jsx(l,{variant:"plain",tone:u,title:t.title,subtitle:t.subtitle,description:t.description,icon:g?t.icon:void 0,badges:I,badgesAlignment:c,onClick:m?()=>N(t.title):void 0,children:h?e.jsxs("p",{className:"font-mono text-xs opacity-70",children:[t.title," — detail panel"]}):void 0})},t.title))})})]})]})})},ce=[{title:"orchestrator-api",subtitle:"Deployed 12 minutes ago",description:"Handles capsule lifecycle and scheduling.",icon:"Container"},{title:"reverse-proxy",subtitle:"Deployed 2 hours ago",description:"Terminates TLS and routes to each service.",icon:"ReverseProxy"},{title:"postgres",subtitle:"Deployed 3 days ago",description:"Primary datastore with nightly snapshots.",icon:"Database"}],pe=e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"})]});function ue(){return e.jsx(A,{variant:"outlined",tone:"neutral",padding:"sm",children:e.jsx("div",{className:"divide-y divide-black/5 dark:divide-white/10",children:ce.map((a,o)=>e.jsx("div",{className:"py-2 first:pt-0 last:pb-0",children:e.jsx(l,{variant:"plain",title:a.title,subtitle:a.subtitle,description:a.description,icon:a.icon,badges:pe,defaultExpanded:o===0,children:e.jsxs("p",{className:"font-mono text-xs opacity-70",children:["image: ghcr.io/acme/",a.title,":2.14.0"]})})},a.title))})})}const ge=`import { DetailItemCard, Panel, Pill } from "@cjlapao/ui-kit";

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
`,he=["right","bottom","bottom-end"];function me(){return e.jsx("div",{className:"flex w-full flex-col gap-4",children:he.map(a=>e.jsx(l,{variant:"outlined",tone:"indigo",title:"billing-worker",subtitle:"Deployed 1 hour ago",icon:"Log",badgesAlignment:a,badges:e.jsxs(e.Fragment,{children:[e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"}),e.jsx(s,{tone:"amber",size:"xs",children:"2 warnings"}),e.jsx(s,{tone:"rose",size:"xs",children:"Degraded"})]})},a))})}const xe=`import { DetailItemCard, Pill } from "@cjlapao/ui-kit";
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
`;function be(){const[a,o]=n.useState(null);return e.jsxs("div",{className:"flex w-full flex-col gap-4",children:[e.jsx(l,{variant:"outlined",tone:"emerald",title:"clickable-row",subtitle:"Selected when clicked",icon:"Rocket",defaultExpanded:!0,onClick:()=>o("clickable-row"),children:e.jsx("p",{children:"With onClick the whole row is a keyboard-reachable button — tab to it and press Enter. Expanding never triggers it."})}),a&&e.jsxs("p",{className:"text-xs opacity-70",children:["Last selected: ",a,"."]}),e.jsx(l,{variant:"outlined",tone:"slate",title:"disabled-row",subtitle:"Cannot be activated",icon:"Container",disabled:!0,onClick:()=>o("disabled-row")}),e.jsx(l,{variant:"outlined",tone:"blue",title:"no-detail",subtitle:"No children, so no toggle",icon:"Database",badges:e.jsx(s,{tone:"emerald",size:"xs",children:"Healthy"})})]})}const ve=`import { useState } from "react";
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
`,De=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Detail Item Card",description:"A list row with an optional expandable detail. Plain by default; give it a variant and it becomes a real card. Clickable rows are keyboard-reachable buttons."}),e.jsx(de,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(b,{title:"Service list",description:"The canonical case: plain rows with icon, badges and an expandable detail inside one card — the first row open by default.",code:ge,filename:"ServiceList.tsx",children:e.jsx(ue,{})}),e.jsx(b,{title:"Badge alignments",description:"The badges can sit to the right of the row, or wrap below it — left-aligned or pushed to the end.",code:xe,filename:"BadgeAlignments.tsx",children:e.jsx(me,{})}),e.jsx(b,{title:"Card states",description:"A clickable card that records the selection, a disabled card, and a row with no detail — so no toggle is shown.",code:ve,filename:"CardStates.tsx",children:e.jsx(be,{})})]})]});export{De as DetailItemCardPage,De as default};
