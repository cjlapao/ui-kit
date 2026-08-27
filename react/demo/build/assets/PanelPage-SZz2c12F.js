import{r as t,D as U,j as e,P as s,M as o,f as W}from"./index-BBK6HA-D.js";import{P as _}from"./PageHeader-BcBcU29I.js";import{E as r}from"./ExampleCard-BVwGIEPO.js";import{P as Q,C as J,S as d,a as i,T as l}from"./ControlAccordion-DallGojj.js";import{d as K,t as X,p as Y,e as Z,f as $,h as ee,i as ae,j as ne,k as te,l as se}from"./options-D-FMIizr.js";const le=["glass","liquid-glass","default"],oe=()=>{const[a,C]=t.useState("elevated"),[m,S]=t.useState("neutral"),[c,N]=t.useState(U),[p,M]=t.useState("md"),[u,A]=t.useState("top"),[g,L]=t.useState("none"),[h,O]=t.useState("spinner"),[v,R]=t.useState(!0),[f,E]=t.useState(!0),[b,V]=t.useState(!0),[x,z]=t.useState(!1),[j,H]=t.useState(!1),[y,F]=t.useState(!1),[P,G]=t.useState(!1),[k,q]=t.useState("classic"),[w,B]=t.useState("medium"),[T,D]=t.useState("frosted"),I=le.includes(a);return e.jsx(Q,{controls:e.jsx(J,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(d,{label:"Variant",options:K,value:a,onChange:n=>C(n)}),e.jsx(d,{label:"Tone",options:X,value:m,onChange:n=>S(n)}),e.jsx(d,{label:"Corner",options:Y,value:c,onChange:n=>N(n)}),e.jsx(d,{label:"Padding",options:Z,value:p,onChange:n=>M(n)}),e.jsx(i,{label:"Media placement",children:e.jsx(o,{fullWidth:!0,size:"sm",options:$,value:u,onChange:n=>A(n)})}),e.jsx(i,{label:"Decoration",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ee,value:g,onChange:n=>L(n)})})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Loader type",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ae,value:h,onChange:n=>O(n)})}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(l,{label:"Media",checked:v,onChange:R}),e.jsx(l,{label:"Badge",checked:f,onChange:E}),e.jsx(l,{label:"Actions",checked:b,onChange:V}),e.jsx(l,{label:"Loading",checked:x,onChange:z}),e.jsx(l,{label:"Hover shadow",checked:j,onChange:H}),e.jsx(l,{label:"Hoverable",checked:y,onChange:F}),e.jsx(l,{label:"Disabled",checked:P,onChange:G})]})]})},...I?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Specular",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ne,value:k,onChange:n=>q(n)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(o,{fullWidth:!0,size:"sm",options:te,value:w,onChange:n=>B(n)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(o,{fullWidth:!0,size:"sm",options:se,value:T,onChange:n=>D(n)})})]})}]:[]]}),preview:e.jsx("div",{className:"w-full",children:e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsxs(s,{variant:a,tone:m,corner:c,padding:p,decoration:g,media:v?e.jsx("div",{className:u==="overlay"?"h-full min-h-40 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400":"h-28 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}):void 0,mediaPlacement:u,badge:f?"New":void 0,title:"Panel title",subtitle:"A subtitle",description:"A description, which uses the surface's muted tone.",actions:b?[{label:"Open",variant:"solid",color:"blue",size:"sm"},{label:"Close",variant:"outline",color:"rose",size:"sm"}]:void 0,loading:x,loaderType:h,loaderProgress:30,loaderTitle:"Loading…",loaderMessage:"Getting things ready…",hoverShadow:j,hoverable:y,disabled:P,vibrancy:w,glassOpacity:T,specularMode:k,children:["This panel uses the ",a," variant, ",c," corners and"," ",p," padding."]})})})})};function ie(){return e.jsx(s,{variant:"elevated",corner:"rounded-lg",badge:"New",title:"Quarterly report",subtitle:"March – May",description:"Revenue is up 12% against the plan, led by the API tier.",media:e.jsx("div",{className:"h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}),actions:[{label:"Open report",variant:"solid",color:"blue",size:"sm"},{label:"Export",variant:"outline",color:"neutral",size:"sm"}],children:"The numbers behind the chart: three months of steady growth, with the steepest climb in May."})}const re=`import { Panel } from "@cjlapao/ui-kit";

export default function MediaHeader() {
  return (
    <Panel
      variant="elevated"
      corner="rounded-lg"
      badge="New"
      title="Quarterly report"
      subtitle="March – May"
      description="Revenue is up 12% against the plan, led by the API tier."
      media={
        <div className="h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400" />
      }
      actions={[
        { label: "Open report", variant: "solid", color: "blue", size: "sm" },
        { label: "Export", variant: "outline", color: "neutral", size: "sm" },
      ]}
    >
      The numbers behind the chart: three months of steady growth, with the
      steepest climb in May.
    </Panel>
  );
}
`;function de(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:W.map(a=>e.jsxs(s,{variant:a,padding:"sm",corner:"rounded-md",title:a,children:["The same card on the ",a," surface."]},a))})})}const ce=`import { Panel } from "@cjlapao/ui-kit";
import { SURFACE_VARIANTS } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <div className="grid w-full gap-4 sm:grid-cols-2">
        {SURFACE_VARIANTS.map((variant) => (
          <Panel
            key={variant}
            variant={variant}
            padding="sm"
            corner="rounded-md"
            title={variant}
          >
            The same card on the {variant} surface.
          </Panel>
        ))}
      </div>
    </div>
  );
}
`,pe=["top","start","end","overlay"],ue=e.jsx("div",{className:"h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"});function me(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:pe.map(a=>e.jsx(s,{variant:"elevated",padding:"sm",title:a,media:a==="overlay"?e.jsx("div",{className:"h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"}):ue,mediaPlacement:a,subtitle:a==="overlay"?"Text over the image":void 0,children:a==="overlay"?"The media fills the card and the copy sits on top.":"The media takes this slot around the content."},a))})}const ge=`import { Panel } from "@cjlapao/ui-kit";
import type { PanelMediaPlacement } from "@cjlapao/ui-kit";

const placements: PanelMediaPlacement[] = ["top", "start", "end", "overlay"];

const media = (
  <div className="h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400" />
);

export default function MediaPlacements() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {placements.map((placement) => (
        <Panel
          key={placement}
          variant="elevated"
          padding="sm"
          title={placement}
          media={
            placement === "overlay" ? (
              <div className="h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400" />
            ) : (
              media
            )
          }
          mediaPlacement={placement}
          subtitle={
            placement === "overlay" ? "Text over the image" : undefined
          }
        >
          {placement === "overlay"
            ? "The media fills the card and the copy sits on top."
            : "The media takes this slot around the content."}
        </Panel>
      ))}
    </div>
  );
}
`;function he(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(s,{variant:"elevated",padding:"sm",title:"spinner",loading:!0,loaderType:"spinner",loaderTitle:"Loading…",children:"Body content replaced by a centred spinner."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"progress",loading:!0,loaderType:"progress",loaderProgress:30,loaderTitle:"Uploading…",children:"Body content replaced by a progress bar at 30%."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"skeleton",loading:!0,loaderType:"skeleton",children:"Placeholder lines shaped like the real content."})]})}const ve=`import { Panel } from "@cjlapao/ui-kit";

export default function Loaders() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-3">
      <Panel
        variant="elevated"
        padding="sm"
        title="spinner"
        loading
        loaderType="spinner"
        loaderTitle="Loading…"
      >
        Body content replaced by a centred spinner.
      </Panel>
      <Panel
        variant="elevated"
        padding="sm"
        title="progress"
        loading
        loaderType="progress"
        loaderProgress={30}
        loaderTitle="Uploading…"
      >
        Body content replaced by a progress bar at 30%.
      </Panel>
      <Panel
        variant="elevated"
        padding="sm"
        title="skeleton"
        loading
        loaderType="skeleton"
      >
        Placeholder lines shaped like the real content.
      </Panel>
    </div>
  );
}
`,fe=["classic","halo","none"];function be(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 p-4",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:fe.map(a=>e.jsx(s,{variant:"liquid-glass",padding:"sm",tone:"slate",title:a,specularMode:a,children:"Liquid glass over a photo-like backdrop."},a))})})}const xe=`import { Panel } from "@cjlapao/ui-kit";
import type { PanelSpecularMode } from "@cjlapao/ui-kit";

const modes: PanelSpecularMode[] = ["classic", "halo", "none"];

export default function Glass() {
  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 p-4">
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {modes.map((mode) => (
          <Panel
            key={mode}
            variant="liquid-glass"
            padding="sm"
            tone="slate"
            title={mode}
            specularMode={mode}
          >
            Liquid glass over a photo-like backdrop.
          </Panel>
        ))}
      </div>
    </div>
  );
}
`,Te=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(_,{name:"Panel",description:"The shared container: eight surface treatments, media in four placements, badges, action buttons, decorations and loaders. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."}),e.jsx(oe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Media header card",description:"The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions.",code:re,filename:"MediaHeader.tsx",children:e.jsx(ie,{})}),e.jsx(r,{title:"All surfaces",description:"The eight variants over a gradient backdrop, so the see-through ones (default, glass, liquid-glass) show what they actually composite against.",code:ce,filename:"Variants.tsx",children:e.jsx(de,{})}),e.jsx(r,{title:"Media placements",description:"`mediaPlacement` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.",code:ge,filename:"MediaPlacements.tsx",children:e.jsx(me,{})}),e.jsx(r,{title:"Loaders",description:"`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots.",code:ve,filename:"Loaders.tsx",children:e.jsx(he,{})}),e.jsx(r,{title:"Liquid glass",description:"The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none.",code:xe,filename:"Glass.tsx",children:e.jsx(be,{})})]})]});export{Te as PanelPage,Te as default};
