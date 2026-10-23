import{r as a,D as Q,j as e,P as s,C as $,k as J}from"./index-B9JeX19j.js";import{P as K}from"./PageHeader-D-LFwZLT.js";import{E as d}from"./ExampleCard-BwESxlwz.js";import{P as X,C as o,a as Y,T as l}from"./PlaygroundPanel-CZvYEX_V.js";import{C as Z}from"./ControlAccordion-rp4gabXb.js";import{u as ee,E as te}from"./EventLog-EYY1E4QF.js";import{e as ae,p as ne,f as se,h as oe,i as le,j as ie,k as re,l as de,m as ce,n as he}from"./options-Blq0niUd.js";const ue=["glass","liquid-glass","default"],pe=()=>{const[t,c]=a.useState("elevated"),[p,h]=a.useState("blue"),[u,g]=a.useState(Q),[i,b]=a.useState("sm"),[r,R]=a.useState("top"),[x,O]=a.useState("none"),[k,L]=a.useState("skeleton"),[y,E]=a.useState(!0),[j,q]=a.useState(!0),[w,V]=a.useState(!0),[C,H]=a.useState(!1),[P,F]=a.useState(!1),[S,I]=a.useState(!1),[f,z]=a.useState("auto"),[D,v]=ee(),[N,G]=a.useState(!1),[T,U]=a.useState("classic"),[A,W]=a.useState("medium"),[M,B]=a.useState("frosted"),_=ue.includes(t);return e.jsx(X,{controls:e.jsxs(e.Fragment,{children:[e.jsx(Z,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:ae,value:t,onChange:n=>c(n)}),e.jsx(Y,{label:"Tone",children:e.jsx($,{selectable:!0,size:"sm",value:p,onSelect:h,defaultExpanded:!0})}),e.jsx(o,{label:"Corner",options:ne,value:u,onChange:n=>g(n)}),e.jsx(o,{label:"Padding",options:se,value:i,onChange:n=>b(n)}),e.jsx(o,{label:"Media placement",options:oe,value:r,onChange:n=>R(n)}),e.jsx(o,{label:"Decoration",options:le,value:x,onChange:n=>O(n)})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Loader type",options:ie,value:k,onChange:n=>L(n)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(l,{label:"Media",checked:y,onChange:E}),e.jsx(l,{label:"Badge",checked:j,onChange:q}),e.jsx(l,{label:"Actions",checked:w,onChange:V}),e.jsx(l,{label:"Loading",checked:C,onChange:H}),e.jsx(l,{label:"Hover shadow",checked:P,onChange:F}),e.jsx(l,{label:"Hoverable",checked:S,onChange:I}),e.jsx(o,{label:"Clickable",options:re,value:f,onChange:z}),e.jsx(l,{label:"Disabled",checked:N,onChange:G})]})]})},..._?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Specular",options:de,value:T,onChange:n=>U(n)}),e.jsx(o,{label:"Vibrancy",options:ce,value:A,onChange:n=>W(n)}),e.jsx(o,{label:"Glass opacity",options:he,value:M,onChange:n=>B(n)})]})}]:[]]}),e.jsx(te,{log:D,emptyText:"No events yet — click the card, or Open inside it."})]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs(s,{variant:t,tone:p,corner:u,padding:i,decoration:x,media:y?e.jsx("div",{className:r==="overlay"?"h-full min-h-40 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400":"h-28 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}):void 0,mediaPlacement:r,badge:j?"New":void 0,title:"Panel title",subtitle:"A subtitle",description:"A description, which uses the surface's muted tone.",actions:w?[{label:"Open",variant:"solid",color:"blue",size:"sm",onClick:()=>v("Open pressed")},{label:"Close",variant:"outline",color:"rose",size:"sm",onClick:()=>v("Close pressed")}]:void 0,loading:C,loaderType:k,loaderProgress:30,loaderTitle:"Loading…",loaderMessage:"Getting things ready…",hoverShadow:P,hoverable:S,onClick:()=>v("Card activated"),clickable:f==="auto"?void 0:f==="on",disabled:N,vibrancy:A,glassOpacity:M,specularMode:T,children:["This panel uses the ",t," variant, ",u," corners and"," ",i," padding."]})})})};function me(){return e.jsx(s,{variant:"elevated",corner:"rounded-lg",badge:"New",title:"Quarterly report",subtitle:"March – May",description:"Revenue is up 12% against the plan, led by the API tier.",media:e.jsx("div",{className:"h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}),actions:[{label:"Open report",variant:"solid",color:"blue",size:"sm"},{label:"Export",variant:"outline",color:"neutral",size:"sm"}],children:"The numbers behind the chart: three months of steady growth, with the steepest climb in May."})}const ge=`import { Panel } from "@cjlapao/ui-kit";

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
`;function be(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:J.map(t=>e.jsxs(s,{variant:t,padding:"sm",corner:"rounded-md",title:t,children:["The same card on the ",t," surface."]},t))})})}const fe=`import { Panel } from "@cjlapao/ui-kit";
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
`,ve=["top","start","end","overlay"],xe=e.jsx("div",{className:"h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"});function ke(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:ve.map(t=>e.jsx(s,{variant:"elevated",padding:"sm",title:t,media:t==="overlay"?e.jsx("div",{className:"h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"}):xe,mediaPlacement:t,subtitle:t==="overlay"?"Text over the image":void 0,children:t==="overlay"?"The media fills the card and the copy sits on top.":"The media takes this slot around the content."},t))})}const ye=`import { Panel } from "@cjlapao/ui-kit";
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
`;function je(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(s,{variant:"elevated",padding:"sm",title:"spinner",loading:!0,loaderType:"spinner",loaderTitle:"Loading…",children:"Body content replaced by a centred spinner."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"progress",loading:!0,loaderType:"progress",loaderProgress:30,loaderTitle:"Uploading…",children:"Body content replaced by a progress bar at 30%."}),e.jsx(s,{variant:"elevated",padding:"sm",title:"skeleton",loading:!0,loaderType:"skeleton",children:"Placeholder lines shaped like the real content."})]})}const we=`import { Panel } from "@cjlapao/ui-kit";

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
`,Ce=["classic","halo","none"];function Pe(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 p-4",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:Ce.map(t=>e.jsx(s,{variant:"liquid-glass",padding:"sm",tone:"slate",title:t,specularMode:t,children:"Liquid glass over a photo-like backdrop."},t))})})}const Se=`import { Panel } from "@cjlapao/ui-kit";
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
`,m=({fired:t})=>e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{className:"font-medium text-neutral-700 dark:text-neutral-200",children:"Last"})," ",e.jsx("code",{className:"font-mono",children:t})]});function Ne(){const[t,c]=a.useState("nothing yet"),[p,h]=a.useState("nothing yet"),[u,g]=a.useState("nothing yet"),[i,b]=a.useState(0);return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs(s,{title:"Deploy queue",subtitle:"The card is one action",padding:"sm",onClick:()=>c("card activated"),actions:[{label:"Archive",size:"sm",variant:"outline",color:"rose",onClick:()=>c("Archive pressed — the card stayed quiet")}],children:[e.jsxs("p",{children:["Tab to this card and press Enter: it is a real button, so the keyboard activates it. Press ",e.jsx("code",{className:"font-mono",children:"Archive"})," instead and only the action fires — a click that lands on a control belongs to that control."]}),e.jsx(m,{fired:t})]}),e.jsxs(s,{title:"Release notes",subtitle:"The body owns the interaction",padding:"sm",onClick:()=>h("card activated"),children:[e.jsxs("p",{children:["A card holding a form. Clicking the field, or the button below it, must not activate the card — and this is the shape the dev console warns about, because a card announced as one button swallows the controls inside it. When the body owns the interaction, pass"," ",e.jsxs("code",{className:"font-mono",children:["clickable=","{false}"]})," as the next card does."]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text","aria-label":"Release tag",placeholder:"v2.4.0",className:"min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"}),e.jsx("button",{type:"button",className:"rounded-md bg-blue-600 px-3 py-1 text-sm text-white",onClick:()=>h("Save pressed — the card stayed quiet"),children:"Save"}),e.jsx("button",{type:"button","aria-pressed":i%2===1,"aria-label":"Star this release",className:"cursor-pointer select-none rounded text-lg leading-none",onClick:()=>b(r=>(h(`star toggled to ${r+1} — the card stayed quiet`),r+1)),children:i%2===0?"☆":"★"}),e.jsxs("label",{"data-panel-no-click":!0,className:"flex cursor-pointer items-center gap-1 text-xs text-neutral-500 select-none",children:[e.jsx("input",{type:"checkbox",className:"h-3.5 w-3.5"}),"Notify"]})]}),e.jsx(m,{fired:p})]}),e.jsxs(s,{title:"Audit log",subtitle:"clickable={false}",padding:"sm",clickable:!1,onClick:()=>g("card activated (no button semantics)"),children:[e.jsxs("p",{children:["Still clickable, still guarded — but not a button: no"," ",e.jsx("code",{className:"font-mono",children:"role"}),", and Tab walks straight past it. Use this when the card has no single action to name."]}),e.jsx(m,{fired:u})]}),e.jsxs(s,{title:"Retired service",subtitle:"disabled",padding:"sm",onClick:()=>c("this should never happen"),disabled:!0,children:[e.jsx("p",{children:"A disabled card keeps its shape but stops being a control: no tab stop, no activation, and the cursor says so."}),e.jsx(m,{fired:"not activatable"})]})]})}const Te=`import { useState } from "react";
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
`,Ve=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(K,{name:"Panel",description:"The shared container: eight surface treatments, media in four placements, badges, action buttons, decorations and loaders. Its standing look is the kit's container standard — the elevated variant, tone blue, sm padding and the medium corner — and every other surface component takes its defaults from here. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."}),e.jsx(pe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(d,{title:"Media header card",description:"The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions.",code:ge,filename:"MediaHeader.tsx",children:e.jsx(me,{})}),e.jsx(d,{title:"All surfaces",description:"The eight variants over a gradient backdrop, so the see-through ones (default, glass, liquid-glass) show what they actually composite against.",code:fe,filename:"Variants.tsx",children:e.jsx(be,{})}),e.jsx(d,{title:"Media placements",description:"`mediaPlacement` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.",code:ye,filename:"MediaPlacements.tsx",children:e.jsx(ke,{})}),e.jsx(d,{title:"Loaders",description:"`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots.",code:we,filename:"Loaders.tsx",children:e.jsx(je,{})}),e.jsx(d,{title:"A clickable card",description:'Pass an `onClick` and the card becomes a real control: `role="button"`, a tab stop, Enter and Space, and a tone-coloured inset focus ring. A click that lands on a control inside the card — the card\'s own `actions`, a button, a link, a field — belongs to that control and never activates the card; `data-panel-no-click` extends that to widgets with no semantics of their own. `clickable={false}` keeps the click and the guard but drops the button, which is what a card whose body owns the interaction wants.',code:Te,filename:"Clickable.tsx",children:e.jsx(Ne,{})}),e.jsx(d,{title:"Liquid glass",description:"The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none.",code:Se,filename:"Glass.tsx",children:e.jsx(Pe,{})})]})]});export{Ve as PanelPage,Ve as default};
