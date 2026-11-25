import{r as n,a1 as ce,j as e,P as a,s as he,a2 as ue}from"./index-CQwZVYnB.js";import{P as pe}from"./PageHeader-BhZxEVHt.js";import{E as l}from"./ExampleCard-BZsKA5_g.js";import{a as ge}from"./SurfaceToneControl-LH37fS9y.js";import{H as j}from"./HueControl-B9PfQcfP.js";import{P as me,C as o,a as be,T as i}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ve}from"./ControlAccordion-C7vC6faF.js";import{u as fe,E as xe}from"./EventLog-B3ejPngN.js";import{s as ye,f as we,p as ke,w as je,x as Pe,e as Ce,y as Se,z as Te,A as Ne,B as Ae,C as Me}from"./options-Byh1yOHz.js";const Re=["glass","liquid-glass","default"],Oe=()=>{const[t,c]=n.useState("elevated"),[h,u]=n.useState("auto"),[p,b]=n.useState("none"),[r,v]=n.useState(ce),[d,F]=n.useState("sm"),[f,I]=n.useState("top"),[P,G]=n.useState("none"),[C,D]=n.useState("skeleton"),[S,W]=n.useState(!0),[T,z]=n.useState(!0),[N,_]=n.useState(!0),[A,Q]=n.useState(!1),[M,$]=n.useState(!1),[g,J]=n.useState("auto"),[x,K]=n.useState("auto"),[X,y]=fe(),[R,Y]=n.useState(!1),[O,Z]=n.useState(!0),[w,ee]=n.useState(!1),[L,te]=n.useState(void 0),[q,ne]=n.useState(void 0),[E,ae]=n.useState(void 0),[k,se]=n.useState(!1),[H,oe]=n.useState(!1),[V,ie]=n.useState("classic"),[B,le]=n.useState("medium"),[U,re]=n.useState("frosted"),de=Re.includes(t);return e.jsx(me,{controls:e.jsxs(e.Fragment,{children:[e.jsx(ve,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Variant",options:ye,value:t,onChange:s=>c(s)}),e.jsx(be,{label:"Tone",children:e.jsx(ge,{value:p,onSelect:b})}),e.jsx(o,{label:"Transparency",options:[{value:"auto",label:"Variant default"},{value:"none",label:"None / opaque"},{value:"low",label:"Low"},{value:"medium",label:"Medium"},{value:"high",label:"High / original"}],value:h,onChange:s=>u(s)}),e.jsx(o,{label:"Corner",options:we,value:r,onChange:s=>v(s)}),e.jsx(o,{label:"Padding",options:ke,value:d,onChange:s=>F(s)}),e.jsx(o,{label:"Media placement",options:je,value:f,onChange:s=>I(s)}),e.jsx(o,{label:"Decoration",options:Pe,value:P,onChange:s=>G(s)}),e.jsx(i,{label:"Raised surface",checked:H,onChange:oe})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Loader type",options:Ce,value:C,onChange:s=>D(s)}),e.jsxs("div",{className:"grid grid-cols-1 gap-2",children:[e.jsx(i,{label:"Media",checked:S,onChange:W}),e.jsx(i,{label:"Badge",checked:T,onChange:z}),e.jsx(i,{label:"Actions",checked:N,onChange:_}),e.jsx(i,{label:"Loading",checked:A,onChange:Q}),e.jsx(i,{label:"Hover shadow",checked:M,onChange:$}),e.jsx(o,{label:"Hoverable",options:Se,value:g,onChange:J}),e.jsx(o,{label:"Clickable",options:Te,value:x,onChange:K}),e.jsx(i,{label:"Disabled",checked:R,onChange:Y}),e.jsx(i,{label:"Disabled sheet",checked:O,onChange:Z}),e.jsx(i,{label:"Active",checked:w,onChange:ee}),e.jsx(i,{label:"Pulse",checked:k,onChange:se})]}),w?e.jsx(j,{label:"Selected hue",value:L,onChange:te,autoLabel:"Auto — borderColor, then tone"}):null,k?e.jsx(j,{label:"Pulse hue",value:q,onChange:ne,autoLabel:"Auto — the selected hue"}):null,g!=="off"?e.jsx(j,{label:"Hover hue",value:E,onChange:ae,autoLabel:"Auto — the selected hue, while selected; else the panel's own"}):null]})},...de?[{id:"glass",title:"Glass",controls:e.jsxs(e.Fragment,{children:[e.jsx(o,{label:"Specular",options:Ne,value:V,onChange:s=>ie(s)}),e.jsx(o,{label:"Vibrancy",options:Ae,value:B,onChange:s=>le(s)}),e.jsx(o,{label:"Glass opacity",options:Me,value:U,onChange:s=>re(s)})]})}]:[]]}),e.jsx(xe,{log:X,emptyText:"No events yet — click the card, or Open inside it."})]}),preview:e.jsx("div",{className:"w-full",children:e.jsxs(a,{variant:t,tone:p,corner:r,padding:d,decoration:P,media:S?e.jsx("div",{className:f==="overlay"?"h-full min-h-40 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400":"h-28 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}):void 0,mediaPlacement:f,badge:T?"New":void 0,title:"Panel title",subtitle:"A subtitle",description:"A description, which uses the surface's muted tone.",actions:N?[{label:"Open",variant:"solid",color:"blue",size:"sm",onClick:()=>y("Open pressed")},{label:"Close",variant:"outline",color:"rose",size:"sm",onClick:()=>y("Close pressed")}]:void 0,loading:A,loaderType:C,loaderProgress:30,loaderTitle:"Loading…",loaderMessage:"Getting things ready…",hoverShadow:M,hoverable:g==="auto"?void 0:g==="on",onClick:()=>y("Card activated"),clickable:x==="auto"?void 0:x==="on",disabled:R,disabledVeil:O,active:w,activeTone:L,hoverColor:E,pulseTone:q,pulse:k,vibrancy:B,glassOpacity:U,transparency:h==="auto"?void 0:h,specularMode:V,raisedSurface:H,children:["This panel uses the ",t," variant, ",r," corners and"," ",d," padding."]})})})};function Le(){return e.jsx(a,{variant:"elevated",corner:"rounded-lg",badge:"New",title:"Quarterly report",subtitle:"March – May",description:"Revenue is up 12% against the plan, led by the API tier.",media:e.jsx("div",{className:"h-32 w-full bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400"}),actions:[{label:"Open report",variant:"solid",color:"blue",size:"sm"},{label:"Export",variant:"outline",color:"neutral",size:"sm"}],children:"The numbers behind the chart: three months of steady growth, with the steepest climb in May."})}const qe=`import { Panel } from "@cjlapao/ui-kit";

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
`;function Ee(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:he.map(t=>e.jsxs(a,{variant:t,padding:"sm",corner:"rounded-md",title:t,children:["The same card on the ",t," surface."]},t))})})}function He(){return e.jsx("div",{className:"grid gap-4 rounded-xl p-5 sm:grid-cols-2",style:{backgroundImage:"repeating-linear-gradient(135deg, #c7d2fe 0px, #c7d2fe 24px, #fbcfe8 24px, #fbcfe8 48px)"},children:ue.map(t=>e.jsx(a,{variant:"tonal",tone:"blue",transparency:t,title:t,padding:"sm",children:t==="none"?"Opaque tint. The backdrop stays behind the panel.":t==="high"?"The original transparency, with no increase beyond it.":"A step between opaque and the original transparency."},t))})}const Ve=`import { Panel } from "@cjlapao/ui-kit";
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
`,Be=["top","start","end","overlay"],Ue=e.jsx("div",{className:"h-24 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"});function Fe(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:Be.map(t=>e.jsx(a,{variant:"elevated",padding:"sm",title:t,media:t==="overlay"?e.jsx("div",{className:"h-full min-h-32 w-full bg-gradient-to-br from-fuchsia-500 via-rose-400 to-amber-400"}):Ue,mediaPlacement:t,subtitle:t==="overlay"?"Text over the image":void 0,children:t==="overlay"?"The media fills the card and the copy sits on top.":"The media takes this slot around the content."},t))})}const Ie=`import { Panel } from "@cjlapao/ui-kit";
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
`;function Ge(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:[e.jsx(a,{variant:"elevated",padding:"sm",title:"spinner",loading:!0,loaderType:"spinner",loaderTitle:"Loading…",children:"Body content replaced by a centred spinner."}),e.jsx(a,{variant:"elevated",padding:"sm",title:"progress",loading:!0,loaderType:"progress",loaderProgress:30,loaderTitle:"Uploading…",children:"Body content replaced by a progress bar at 30%."}),e.jsx(a,{variant:"elevated",padding:"sm",title:"skeleton",loading:!0,loaderType:"skeleton",children:"Placeholder lines shaped like the real content."})]})}const De=`import { Panel } from "@cjlapao/ui-kit";

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
`,We=["classic","halo","none"];function ze(){return e.jsx("div",{className:"w-full rounded-lg bg-gradient-to-br from-indigo-500 via-sky-400 to-emerald-400 p-4",children:e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-3",children:We.map(t=>e.jsx(a,{variant:"liquid-glass",padding:"sm",tone:"slate",title:t,specularMode:t,children:"Liquid glass over a photo-like backdrop."},t))})})}const _e=`import { Panel } from "@cjlapao/ui-kit";
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
`,m=({fired:t})=>e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("span",{className:"font-medium text-neutral-700 dark:text-neutral-200",children:"Last"})," ",e.jsx("code",{className:"font-mono",children:t})]});function Qe(){const[t,c]=n.useState("nothing yet"),[h,u]=n.useState("nothing yet"),[p,b]=n.useState("nothing yet"),[r,v]=n.useState(0);return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsxs(a,{title:"Deploy queue",subtitle:"The card is one action",padding:"sm",onClick:()=>c("card activated"),actions:[{label:"Archive",size:"sm",variant:"outline",color:"rose",onClick:()=>c("Archive pressed — the card stayed quiet")}],children:[e.jsxs("p",{children:["Tab to this card and press Enter: it is a real button, so the keyboard activates it. Press ",e.jsx("code",{className:"font-mono",children:"Archive"})," instead and only the action fires — a click that lands on a control belongs to that control."]}),e.jsx(m,{fired:t})]}),e.jsxs(a,{title:"Release notes",subtitle:"The body owns the interaction",padding:"sm",onClick:()=>u("card activated"),children:[e.jsxs("p",{children:["A card holding a form. Clicking the field, or the button below it, must not activate the card — and this is the shape the dev console warns about, because a card announced as one button swallows the controls inside it. When the body owns the interaction, pass"," ",e.jsxs("code",{className:"font-mono",children:["clickable=","{false}"]})," as the next card does."]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{type:"text","aria-label":"Release tag",placeholder:"v2.4.0",className:"min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"}),e.jsx("button",{type:"button",className:"rounded-md bg-blue-600 px-3 py-1 text-sm text-white",onClick:()=>u("Save pressed — the card stayed quiet"),children:"Save"}),e.jsx("button",{type:"button","aria-pressed":r%2===1,"aria-label":"Star this release",className:"cursor-pointer select-none rounded text-lg leading-none",onClick:()=>v(d=>(u(`star toggled to ${d+1} — the card stayed quiet`),d+1)),children:r%2===0?"☆":"★"}),e.jsxs("label",{"data-panel-no-click":!0,className:"flex cursor-pointer items-center gap-1 text-xs text-neutral-500 select-none",children:[e.jsx("input",{type:"checkbox",className:"h-3.5 w-3.5"}),"Notify"]})]}),e.jsx(m,{fired:h})]}),e.jsxs(a,{title:"Audit log",subtitle:"clickable={false}",padding:"sm",clickable:!1,onClick:()=>b("card activated (no button semantics)"),children:[e.jsxs("p",{children:["Still clickable, still guarded — but not a button: no"," ",e.jsx("code",{className:"font-mono",children:"role"}),", and Tab walks straight past it. Use this when the card has no single action to name."]}),e.jsx(m,{fired:p})]}),e.jsxs(a,{title:"Retired service",subtitle:"disabled",padding:"sm",onClick:()=>c("this should never happen"),disabled:!0,children:[e.jsx("p",{children:"A disabled card keeps its shape but stops being a control: no tab stop, no activation, and the cursor says so."}),e.jsx(m,{fired:"not activatable"})]})]})}const $e=`import { useState } from "react";
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
`;function Je(){return e.jsxs("div",{className:"grid w-full gap-4 lg:grid-cols-2",children:[e.jsx(a,{variant:"tonal",tone:"blue",active:!0,title:"Selected in its own hue",subtitle:"activeTone unset — rim and wash follow tone",children:"The selection and the card agree, which is the default and usually the right answer."}),e.jsx(a,{variant:"tonal",tone:"blue",active:!0,activeTone:"amber",title:"Selected in amber",subtitle:"activeTone dresses rim and wash together",children:"One decision, one colour: the outline never disagrees with the fill beneath it."}),e.jsx(a,{variant:"tonal",tone:"blue",pulse:!0,pulseTone:"rose",title:"Pulsing in rose",subtitle:"pulseTone — urgency need not wear the brand",children:"The glow rides a custom property, so it brightens in the dark theme the way every other hue does."}),e.jsx(a,{variant:"tonal",tone:"cyan",active:!0,activeTone:"emerald",pulse:!0,title:"Both at once, in one hue",subtitle:"pulseTone unset — the glow follows the selection",children:"Selected and demanding attention, and still one colour — until a caller asks otherwise."}),e.jsx(a,{variant:"tonal",tone:"cyan",active:!0,activeTone:"violet",onClick:()=>{},title:"Put a pointer on this one",subtitle:"it is chosen, so its hover arrives violet — not cyan",children:"The card is selected, so its hover wears the hue its rim already wears and nothing under the pointer contradicts the state. Unchosen cards keep hovering in their own tone even with the same `activeTone` set. Pass `hoverColor` to pin a card's hover back to its brand hue while the selection stays elsewhere."})]})}const Ke=`import { Panel } from "@cjlapao/ui-kit";

/**
 * The same tonal card five times, with its hues pulled apart.
 *
 * By default a card speaks one hue: \`tone\` is the surface, the rim and wash
 * when it is selected, and the glow when it pulses. \`activeTone\` lets the
 * selected state dress itself, and \`pulseTone\` lets the attention call stay
 * urgent on a card whose brand is not. Both default into the card's own hue —
 * the glow's is the selection's — so an untuned card looks exactly as it always
 * did, and a card that is both selected and pulsing still says one thing.
 *
 * The fifth card is the one to put a pointer on. \`activeTone\` is not only the
 * colour of the rim and the wash once a card is chosen: while it *is* chosen the
 * hover wears that hue too, so the pointer never contradicts the state. The
 * follow is the state's, not the hue's — and that gate is the whole point in a
 * group, where every card is handed the same \`activeTone\` and a grid of unchosen
 * cards hovering in a state they do not have would be the same mistake wearing a
 * costume. \`hoverColor\` is the way back for a card that should keep hovering in
 * its brand hue.
 */
export default function Hues() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <Panel
        variant="tonal"
        tone="blue"
        active
        title="Selected in its own hue"
        subtitle="activeTone unset — rim and wash follow tone"
      >
        The selection and the card agree, which is the default and usually the
        right answer.
      </Panel>
      <Panel
        variant="tonal"
        tone="blue"
        active
        activeTone="amber"
        title="Selected in amber"
        subtitle="activeTone dresses rim and wash together"
      >
        One decision, one colour: the outline never disagrees with the fill
        beneath it.
      </Panel>
      <Panel
        variant="tonal"
        tone="blue"
        pulse
        pulseTone="rose"
        title="Pulsing in rose"
        subtitle="pulseTone — urgency need not wear the brand"
      >
        The glow rides a custom property, so it brightens in the dark theme the
        way every other hue does.
      </Panel>
      <Panel
        variant="tonal"
        tone="cyan"
        active
        activeTone="emerald"
        pulse
        title="Both at once, in one hue"
        subtitle="pulseTone unset — the glow follows the selection"
      >
        Selected and demanding attention, and still one colour — until a caller
        asks otherwise.
      </Panel>
      <Panel
        variant="tonal"
        tone="cyan"
        active
        activeTone="violet"
        onClick={() => {}}
        title="Put a pointer on this one"
        subtitle="it is chosen, so its hover arrives violet — not cyan"
      >
        The card is selected, so its hover wears the hue its rim already wears and
        nothing under the pointer contradicts the state. Unchosen cards keep
        hovering in their own tone even with the same \`activeTone\` set. Pass
        \`hoverColor\` to pin a card's hover back to its brand hue while the
        selection stays elsewhere.
      </Panel>
    </div>
  );
}
`;function Xe(){return e.jsxs("div",{className:"space-y-3",children:[e.jsxs(a,{variant:"simple",tone:"neutral",title:"Workspace activity",children:[e.jsx(a,{variant:"simple",tone:"neutral",children:"Ada rotated the signing keys"}),e.jsx(a,{variant:"simple",tone:"neutral",children:"Sales Bot closed as won"}),e.jsx(a,{variant:"simple",tone:"neutral",nestedSurface:!1,children:"Unchanged surface"})]}),e.jsx(a,{variant:"tonal",tone:"neutral",raisedSurface:!0,children:"Raised on the page"})]})}const Ye=`import { Panel } from "@cjlapao/ui-kit";

export default function NestedSurfaces() {
  return (
    <div className="space-y-3">
      <Panel variant="simple" tone="neutral" title="Workspace activity">
        <Panel variant="simple" tone="neutral">Ada rotated the signing keys</Panel>
        <Panel variant="simple" tone="neutral">Sales Bot closed as won</Panel>
        <Panel variant="simple" tone="neutral" nestedSurface={false}>Unchanged surface</Panel>
      </Panel>
      {/* Not nested — and it still rests one step off the page. raisedSurface
        forces the ladder's first wash, which is what keeps a neutral card
        visible when its fill agrees with the background beneath it. */}
      <Panel variant="tonal" tone="neutral" raisedSurface>Raised on the page</Panel>
    </div>
  );
}
`,rt=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(pe,{name:"Panel",description:"The shared container: nine surface treatments, media in four placements, badges, action buttons, decorations and loaders. Its standing look is the kit's container standard — the elevated variant, no tint by default, sm padding and the medium corner — and every other surface component takes its defaults from here. It also publishes a surface context, so nested content like FormField hints picks up copy that reads on the card it sits on — including glass."}),e.jsx(Oe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(l,{title:"Media header card",description:"The full anatomy: media on top, a badge, title, subtitle, description, body copy and a row of actions.",code:qe,filename:"MediaHeader.tsx",children:e.jsx(Le,{})}),e.jsx(l,{title:"All surfaces",description:"Nine shared variants. Glass, liquid-glass and subtle keep their translucent defaults; the other variants have opaque backgrounds.",code:Ve,filename:"Variants.tsx",children:e.jsx(Ee,{})}),e.jsx(l,{title:"Background transparency",description:"transparency accepts none, low, medium and high. High preserves each variant's original alpha; none is opaque while preserving its tint. Only the background changes. Glass, liquid-glass and subtle default to high; other variants default to none. Existing glassOpacity presets still determine the glass fill at high.",filename:"Transparency.tsx",code:`<Panel variant="tonal" transparency="none">Opaque by default</Panel>
<Panel variant="tonal" transparency="high">Original transparency</Panel>
<Panel variant="glass" transparency="low">Less transparent glass</Panel>`,children:e.jsx(He,{})}),e.jsx(l,{title:"Nested surfaces",description:"Matching simple, tonal, subtle, glass and liquid-glass panels automatically take a subtle background step. Set nestedSurface to false to keep the original fill. A card that sits on the neutral page itself — where fill and background agree and it disappears — takes the same first step with raisedSurface.",filename:"NestedSurfaces.tsx",code:Ye,children:e.jsx(Xe,{})}),e.jsx(l,{title:"Media placements",description:"`mediaPlacement` puts the media on top, on the start or end side, or as a full-bleed overlay that the copy sits on.",code:Ie,filename:"MediaPlacements.tsx",children:e.jsx(Fe,{})}),e.jsx(l,{title:"Loaders",description:"`loading` swaps the content for a spinner, a progress bar or a skeleton shaped like the card's real slots.",code:De,filename:"Loaders.tsx",children:e.jsx(Ge,{})}),e.jsx(l,{title:"A clickable card",description:'Pass an `onClick` and the card becomes a real control: `role="button"`, a tab stop, Enter and Space, and a tone-coloured inset focus ring. A click that lands on a control inside the card — the card\'s own `actions`, a button, a link, a field — belongs to that control and never activates the card; `data-panel-no-click` extends that to widgets with no semantics of their own. `clickable={false}` keeps the click and the guard but drops the button, which is what a card whose body owns the interaction wants.',code:$e,filename:"Clickable.tsx",children:e.jsx(Qe,{})}),e.jsx(l,{title:"Hues of its own",description:"`activeTone` dresses the whole selected state — the 2px inset rim and the wash under it — in a hue the card does not wear; `pulseTone` does the same for the attention glow. Left unset they agree with the card (`borderColor`, then `tone`, then the kit's blue), and the glow follows the selection, so a card that is both selected and pulsing still says one thing in one colour. The chosen card's hover asks the selection as well: put the pointer on the fifth card and the wash arrives in the hue its rim already wears, while the unchosen cards keep hovering in their own tone — the follow belongs to the state, not to the hue. `hoverColor` overrules that, which is also the way back for a card that should keep hovering in its brand hue. The resting surface stays on `tone`, and `borderColor` stays the border.",code:Ke,filename:"Hues.tsx",children:e.jsx(Je,{})}),e.jsx(l,{title:"Liquid glass",description:"The translucent variant over a photo-like backdrop; `specularMode` sets how light reflects off the top edge — a classic bevel, a full halo, or none.",code:_e,filename:"Glass.tsx",children:e.jsx(ze,{})})]})]});export{rt as PanelPage,rt as default};
