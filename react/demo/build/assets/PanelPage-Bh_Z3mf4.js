import{r as n,a5 as Z,j as e,P as s,G as ee,a6 as ae}from"./index-ChbzYKtA.js";import{P as ne}from"./PageHeader-CORco2N-.js";import{E as o}from"./ExampleCard-Db5NXgWv.js";import{a as te}from"./SurfaceToneControl-BpIV0XpL.js";import{P as se,C as l,a as le,T as i}from"./PlaygroundPanel-CZxrTOj5.js";import{C as oe}from"./ControlAccordion-DoyyLWlc.js";import{u as ie,E as re}from"./EventLog-AWfnu5cV.js";import{s as de,f as ce,p as ue,r as pe,u as he,e as me,v as ge,w as be,x as fe,y as ve,z as xe}from"./options-C-rzDbtC.js";const ye=["glass","liquid-glass","default"],ke=()=>{const[a,c]=n.useState("elevated"),[u,p]=n.useState("auto"),[h,g]=n.useState("none"),[r,b]=n.useState(Z),[d,L]=n.useState("sm"),[f,E]=n.useState("top"),[k,H]=n.useState("none"),[j,V]=n.useState("skeleton"),[w,F]=n.useState(!0),[C,G]=n.useState(!0),[P,I]=n.useState(!0),[S,U]=n.useState(!1),[N,B]=n.useState(!1),[v,W]=n.useState("auto"),[x,z]=n.useState("auto"),[D,y]=ie(),[T,_]=n.useState(!1),[A,Q]=n.useState(!1),[M,$]=n.useState(!1),[O,J]=n.useState("classic"),[R,K]=n.useState("medium"),[q,X]=n.useState("frosted"),Y=ye.includes(a);return e.jsx(se,{controls:e.jsxs(e.Fragment,{children:[e.jsx(oe,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Variant",options:de,value:a,onChange:t=>c(t)}),e.jsx(le,{label:"Tone",children:e.jsx(te,{value:h,onSelect:g})}),e.jsx(l,{label:"Transparency",options:[{value:"auto",label:"Variant default"},{value:"none",label:"None / opaque"},{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High / original"}],value:u,onChange:t=>p(t)}),e.jsx(l,{label:"Corner",options:ce,value:r,onChange:t=>b(t)}),e.jsx(l,{label:"Padding",options:ue,value:d,onChange:t=>L(t)}),e.jsx(l,{label:"Media placement",options:pe,value:f,onChange:t=>E(t)}),e.jsx(l,{label:"Decoration",options:he,value:k,onChange:t=>H(t)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Loader type",options:me,value:j,onChange:t=>V(t)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(i,{label:"Media",checked:w,onChange:F}),e.jsx(i,{label:"Badge",checked:C,onChange:G}),e.jsx(i,{label:"Actions",checked:P,onChange:I}),e.jsx(i,{label:"Loading",checked:S,onChange:U}),e.jsx(i,{label:"Hover shadow",checked:N,onChange:B}),e.jsx(l,{label:"Hoverable",options:ge,value:v,onChange:W}),e.jsx(l,{label:"Clickable",options:be,value:x,onChange:z}),e.jsx(i,{label:"Disabled",checked:T,onChange:_}),e.jsx(i,{label:"Active",checked:A,onChange:Q}),e.jsx(i,{label:"Pulse",checked:M,onChange:$})]})]})},...Y?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(l,{label:"Specular",options:fe,value:O,onChange:t=>J(t)}),e.jsx(l,{label:"Vibrancy",options:ve,value:R,onChange:t=>K(t)}),e.jsx(l,{label:"Glass opacity",options:xe,value:q,onChange:t=>X(t)})]})}]:[]]}),e.jsx(re,{log:D,emptyText:"No events yet — click the card, or Open inside it."})]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs(s,{variant:a,tone:h,corner:r,padding:d,decoration:k,media:w?e.jsx("div",{className:f==="overlay"?"h-full min-h-40 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400":"h-28 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}):void 0,mediaPlacement:f,badge:C?"New":void 0,title:"Panel title",subtitle:"A subtitle",description:"A description, which uses the surface's muted tone.",actions:P?[{label:"Open",variant:"solid",color:"blue",size:"sm",onClick:()=>y("Open pressed")},{label:"Close",variant:"outline",color:"rose",size:"sm",onClick:()=>y("Close pressed")}]:void 0,loading:S,loaderType:j,loaderProgress:30,loaderTitle:"Loading…",loaderMessage:"Getting things ready…",hoverShadow:N,hoverable:v==="auto"?void 0:v==="on",onClick:()=>y("Card activated"),clickable:x==="auto"?void 0:x==="on",disabled:T,active:A,pulse:M,vibrancy:R,glassOpacity:q,transparency:u==="auto"?void 0:u,specularMode:O,children:["This panel uses the ",a," variant, ",r," corners and"," ",d," padding."]})})})};function je(){return e.jsx(s,{variant:"elevated",corner:"rounded-lg",badge:"New",title:"Quarterly report",subtitle:"March – May",description:"Revenue is up 12% against the plan, led by the API tier.",media:e.jsx("div",{className:"h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}),actions:[{label:"Open report",variant:"solid",color:"blue",size:"sm"},{label:"Export",variant:"outline",color:"neutral",size:"sm"}],children:"The numbers behind the chart: three months of steady growth, with the steepest climb in May."})}const we=`import { Panel } from "@cjlapao/ui-kit";

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
`;function Ce(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ee.map(a=>e.jsxs(s,{variant:a,padding:"sm",corner:"rounded-md",title:a,children:["The same card on the ",a," surface."]},a))})})}function Pe(){return e.jsx("div",{className:"grid gap-4 rounded-xl p-5 sm:grid-cols-2",style:{backgroundImage:"repeating-linear-gradient(135deg, #c7d2fe 0px, #c7d2fe 24px, #fbcfe8 24px, #fbcfe8 48px)"},children:ae.map(a=>e.jsx(s,{variant:"tonal",tone:"blue",transparency:a,title:a,padding:"sm",children:a==="none"?"Opaque tint. The backdrop stays behind the panel.":a==="high"?"The original transparency, with no increase beyond it.":"A step between opaque and the original transparency."},a))})}const Se=`import { Panel } from "@cjlapao/ui-kit";
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
`,Ne=["top","start","end","overlay"],Te=e.jsx("div",{className:"h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"});function Ae(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Ne.map(a=>e.jsx(s,{variant:"elevated",padding:"sm",title:a,media:a==="overlay"?e.jsx("div",{className:"h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"}):Te,mediaPlacement:a,subtitle:a==="overlay"?"Text over the image":void 0,children:a==="overlay"?"The media fills the card and the copy sits on top.":"The media takes this slot around the content."},a))})}const Me=`import { Panel } from "@cjlapao/ui-kit";
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
`;function Oe(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(s,{variant:"elevated",padding:"sm",title:"spinner",loading:!0,loaderType:"spinner",loaderTitle:"Loading…",children:"Body content replaced by a centred spinner."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"progress",loading:!0,loaderType:"progress",loaderProgress:30,loaderTitle:"Uploading…",children:"Body content replaced by a progress bar at 30%."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"skeleton",loading:!0,loaderType:"skeleton",children:"Placeholder lines shaped like the real content."})]})}const Re=`import { Panel } from "@cjlapao/ui-kit";

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
`,qe=["classic","halo","none"];function Le(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 p-4",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:qe.map(a=>e.jsx(s,{variant:"liquid-glass",padding:"sm",tone:"slate",title:a,specularMode:a,children:"Liquid glass over a photo-like backdrop."},a))})})}const Ee=`import { Panel } from "@cjlapao/ui-kit";
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
`,m=({fired:a})=>e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{className:"font-medium text-neutral-700 dark:text-neutral-200",children:"Last"})," ",e.jsx("code",{className:"font-mono",children:a})]});function He(){const[a,c]=n.useState("nothing yet"),[u,p]=n.useState("nothing yet"),[h,g]=n.useState("nothing yet"),[r,b]=n.useState(0);return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs(s,{title:"Deploy queue",subtitle:"The card is one action",padding:"sm",onClick:()=>c("card activated"),actions:[{label:"Archive",size:"sm",variant:"outline",color:"rose",onClick:()=>c("Archive pressed — the card stayed quiet")}],children:[e.jsxs("p",{children:["Tab to this card and press Enter: it is a real button, so the keyboard activates it. Press ",e.jsx("code",{className:"font-mono",children:"Archive"})," instead and only the action fires — a click that lands on a control belongs to that control."]}),e.jsx(m,{fired:a})]}),e.jsxs(s,{title:"Release notes",subtitle:"The body owns the interaction",padding:"sm",onClick:()=>p("card activated"),children:[e.jsxs("p",{children:["A card holding a form. Clicking the field, or the button below it, must not activate the card — and this is the shape the dev console warns about, because a card announced as one button swallows the controls inside it. When the body owns the interaction, pass"," ",e.jsxs("code",{className:"font-mono",children:["clickable=","{false}"]})," as the next card does."]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text","aria-label":"Release tag",placeholder:"v2.4.0",className:"min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"}),e.jsx("button",{type:"button",className:"rounded-md bg-blue-600 px-3 py-1 text-sm text-white",onClick:()=>p("Save pressed — the card stayed quiet"),children:"Save"}),e.jsx("button",{type:"button","aria-pressed":r%2===1,"aria-label":"Star this release",className:"cursor-pointer select-none rounded text-lg leading-none",onClick:()=>b(d=>(p(`star toggled to ${d+1} — the card stayed quiet`),d+1)),children:r%2===0?"☆":"★"}),e.jsxs("label",{"data-panel-no-click":!0,className:"flex cursor-pointer items-center gap-1 text-xs text-neutral-500 select-none",children:[e.jsx("input",{type:"checkbox",className:"h-3.5 w-3.5"}),"Notify"]})]}),e.jsx(m,{fired:u})]}),e.jsxs(s,{title:"Audit log",subtitle:"clickable={false}",padding:"sm",clickable:!1,onClick:()=>g("card activated (no button semantics)"),children:[e.jsxs("p",{children:["Still clickable, still guarded — but not a button: no"," ",e.jsx("code",{className:"font-mono",children:"role"}),", and Tab walks straight past it. Use this when the card has no single action to name."]}),e.jsx(m,{fired:h})]}),e.jsxs(s,{title:"Retired service",subtitle:"disabled",padding:"sm",onClick:()=>c("this should never happen"),disabled:!0,children:[e.jsx("p",{children:"A disabled card keeps its shape but stops being a control: no tab stop, no activation, and the cursor says so."}),e.jsx(m,{fired:"not activatable"})]})]})}const Ve=`import { useState } from "react";
import { Panel } from "@cjlapao/ui-kit";

/**
 * What each card is answering: does the card fire, do its own controls still
 * fire, and can the keyboard reach it. The readout is the point — clicking a
 * control must log the control, never the card.
 */
const Readout = ({ fired }: { fired: string }) => (
  <p className="text-xs text-neutral-500 dark:text-neutral-400">
    <span className="font-medium text-neutral-700 dark:text-neutral-200">
      Last
    </span>{" "}
    <code className="font-mono">{fired}</code>
  </p>
);

export default function Clickable() {
  const [card, setCard] = useState("nothing yet");
  const [withControls, setWithControls] = useState("nothing yet");
  const [surfaceOnly, setSurfaceOnly] = useState("nothing yet");
  const [starred, setStarred] = useState(0);

  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <Panel
        title="Deploy queue"
        subtitle="The card is one action"
        padding="sm"
        onClick={() => setCard("card activated")}
        actions={[
          {
            label: "Archive",
            size: "sm",
            variant: "outline",
            color: "rose",
            onClick: () => setCard("Archive pressed — the card stayed quiet"),
          },
        ]}
      >
        <p>
          Tab to this card and press Enter: it is a real button, so the keyboard
          activates it. Press <code className="font-mono">Archive</code> instead
          and only the action fires — a click that lands on a control belongs to
          that control.
        </p>
        <Readout fired={card} />
      </Panel>

      <Panel
        title="Release notes"
        subtitle="The body owns the interaction"
        padding="sm"
        onClick={() => setWithControls("card activated")}
      >
        <p>
          A card holding a form. Clicking the field, or the button below it,
          must not activate the card — and this is the shape the dev console
          warns about, because a card announced as one button swallows the
          controls inside it. When the body owns the interaction, pass{" "}
          <code className="font-mono">clickable={"{false}"}</code> as the next
          card does.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            aria-label="Release tag"
            placeholder="v2.4.0"
            className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
            onClick={() =>
              setWithControls("Save pressed — the card stayed quiet")
            }
          >
            Save
          </button>
          {/* A real control, so the guard's selector finds it and the card
              stays quiet. It started life as a bare \`span\` with an onClick —
              which is the shape that needs the escape hatch below, and the
              shape that fails a keyboard. */}
          <button
            type="button"
            aria-pressed={starred % 2 === 1}
            aria-label="Star this release"
            className="cursor-pointer select-none rounded text-lg leading-none"
            onClick={() =>
              setStarred((n) => {
                setWithControls(
                  \`star toggled to \${n + 1} — the card stayed quiet\`,
                );
                return n + 1;
              })
            }
          >
            {starred % 2 === 0 ? "☆" : "★"}
          </button>
          {/* The case the selector genuinely cannot see: a \`label\` is not a
              control, so clicking its *text* — the part most people hit —
              would bubble into the card. It marks itself instead. Remove the
              attribute and clicking the word starts firing the card too. */}
          <label
            data-panel-no-click
            className="flex cursor-pointer items-center gap-1 text-xs text-neutral-500 select-none"
          >
            <input type="checkbox" className="h-3.5 w-3.5" />
            Notify
          </label>
        </div>
        <Readout fired={withControls} />
      </Panel>

      <Panel
        title="Audit log"
        subtitle="clickable={false}"
        padding="sm"
        clickable={false}
        onClick={() => setSurfaceOnly("card activated (no button semantics)")}
      >
        <p>
          Still clickable, still guarded — but not a button: no{" "}
          <code className="font-mono">role</code>, and Tab walks straight past
          it. Use this when the card has no single action to name.
        </p>
        <Readout fired={surfaceOnly} />
      </Panel>

      <Panel
        title="Retired service"
        subtitle="disabled"
        padding="sm"
        onClick={() => setCard("this should never happen")}
        disabled
      >
        <p>
          A disabled card keeps its shape but stops being a control: no tab
          stop, no activation, and the cursor says so.
        </p>
        <Readout fired="not activatable" />
      </Panel>
    </div>
  );
}
`;function Fe(){return e.jsxs(s,{variant:"simple",tone:"neutral",title:"Workspace activity",children:[e.jsx(s,{variant:"simple",tone:"neutral",children:"Ada rotated the signing keys"}),e.jsx(s,{variant:"simple",tone:"neutral",children:"Sales Bot closed as won"}),e.jsx(s,{variant:"simple",tone:"neutral",nestedSurface:!1,children:"Unchanged surface"})]})}const Ge=`import React from "react";
import { Panel } from "@cjlapao/ui-kit";

export default function NestedSurfaces() {
  return (
    <Panel variant="simple" tone="neutral" title="Workspace activity">
      <Panel variant="simple" tone="neutral">Ada rotated the signing keys</Panel>
      <Panel variant="simple" tone="neutral">Sales Bot closed as won</Panel>
      <Panel variant="simple" tone="neutral" nestedSurface={false}>Unchanged surface</Panel>
    </Panel>
  );
}
`,$e=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ne,{name:"Panel",description:"The shared container: nine surface treatments, media in four placements, badges, action buttons, decorations and loaders. Its standing look is the kit's container standard — the elevated variant, no tint by default, sm padding and the medium corner — and every other surface component takes its defaults from here. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."}),e.jsx(ke,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(o,{title:"Media header card",description:"The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions.",code:we,filename:"MediaHeader.tsx",children:e.jsx(je,{})}),e.jsx(o,{title:"All surfaces",description:"Nine shared variants. Glass, liquid-glass and subtle keep their translucent defaults; the other variants have opaque backgrounds.",code:Se,filename:"Variants.tsx",children:e.jsx(Ce,{})}),e.jsx(o,{title:"Background transparency",description:"transparency accepts none, low, medium and high. High preserves each variant's original alpha; none is opaque while preserving its tint. Only the background changes. Glass, liquid-glass and subtle default to high; other variants default to none. Existing glassOpacity presets still determine the glass fill at high.",filename:"Transparency.tsx",code:`<Panel variant="tonal" transparency="none">Opaque by default</Panel>
<Panel variant="tonal" transparency="high">Original transparency</Panel>
<Panel variant="glass" transparency="low">Less transparent glass</Panel>`,children:e.jsx(Pe,{})}),e.jsx(o,{title:"Nested surfaces",description:"Matching simple, tonal, subtle, glass and liquid-glass panels automatically take a subtle background step. Set nestedSurface to false to keep the original fill.",filename:"NestedSurfaces.tsx",code:Ge,children:e.jsx(Fe,{})}),e.jsx(o,{title:"Media placements",description:"`mediaPlacement` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.",code:Me,filename:"MediaPlacements.tsx",children:e.jsx(Ae,{})}),e.jsx(o,{title:"Loaders",description:"`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots.",code:Re,filename:"Loaders.tsx",children:e.jsx(Oe,{})}),e.jsx(o,{title:"A clickable card",description:'Pass an `onClick` and the card becomes a real control: `role="button"`, a tab stop, Enter and Space, and a tone-coloured inset focus ring. A click that lands on a control inside the card — the card\'s own `actions`, a button, a link, a field — belongs to that control and never activates the card; `data-panel-no-click` extends that to widgets with no semantics of their own. `clickable={false}` keeps the click and the guard but drops the button, which is what a card whose body owns the interaction wants.',code:Ve,filename:"Clickable.tsx",children:e.jsx(He,{})}),e.jsx(o,{title:"Liquid glass",description:"The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none.",code:Ee,filename:"Glass.tsx",children:e.jsx(Le,{})})]})]});export{$e as PanelPage,$e as default};
