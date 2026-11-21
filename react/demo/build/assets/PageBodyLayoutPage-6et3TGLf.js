import{r as a,j as e,H as F,J as k,K as D,M as $,N as H}from"./index-ChbzYKtA.js";import{P as G}from"./PageHeader-CORco2N-.js";import{E as M}from"./ExampleCard-Db5NXgWv.js";import{W as Y}from"./WorkflowTrackerRail-BSqCWp2A.js";import{b as U,c as q,S as n,T as c}from"./PlaygroundPanel-CZxrTOj5.js";import{p as h,s as K,f as J,t as Q}from"./options-C-rzDbtC.js";import{P as X}from"./A11ySections-Ci0MCORB.js";const y=["default","glass","liquid-glass"],S=["cmd/","internal/","main.go","SURVEY.md","Makefile","go.mod","README.md"],Z=[{id:"start",label:"Start",status:"done"},{id:"survey",label:"Survey",status:"running"},{id:"approve",label:"Approve",status:"blocked"},{id:"summarise",label:"Summarise",status:"not_started"}],ee=`\x1B[90m~/workspace\x1B[0m $ go test ./...\r
\x1B[32mok\x1B[0m   workspace/cmd       0.412s\r
\x1B[32mok\x1B[0m   workspace/internal  0.207s\r
\r
\x1B[90m~/workspace\x1B[0m $ agent survey\r
\x1B[36m›\x1B[0m Inspecting repository…\r
`;function te(){const[l,w]=a.useState("outlined"),[o,P]=a.useState("outlined"),[r,C]=a.useState("rounded-md"),[s,j]=a.useState("neutral"),[g,T]=a.useState("xs"),[m,N]=a.useState("none"),[u,B]=a.useState("none"),[x,A]=a.useState(!0),[v,R]=a.useState(!0),[b,L]=a.useState(!0),[O,V]=a.useState(!1),[i,z]=a.useState("survey"),[d,_]=a.useState("layout"),p=O||y.includes(o)||y.includes(l),I={variant:o,corner:r,tone:s},W=e.jsxs("div",{className:"grid gap-4 sm:grid-cols-5",children:[e.jsx(n,{label:"Body padding",options:h,value:g,onChange:t=>T(t)}),e.jsx(n,{label:"Center padding",options:h,value:m,onChange:t=>N(t)}),e.jsx(n,{label:"Layout surface",options:H.map(t=>({label:t,value:t})),value:l,onChange:t=>w(t)}),e.jsx(n,{label:"Controls surface",options:K,value:o,onChange:t=>P(t)}),e.jsx(n,{label:"Corner",options:J,value:r,onChange:t=>C(t)}),e.jsx(n,{label:"Tone",options:Q,value:s,onChange:t=>j(t)}),e.jsx(n,{label:"Panel inset",options:h,value:u,onChange:t=>B(t)}),e.jsx(n,{label:"Collapse motion",options:[{label:"layout — centre eases",value:"layout"},{label:"slide — centre snaps, content sweeps",value:"slide"}],value:d,onChange:t=>_(t)}),e.jsxs("div",{className:"grid gap-x-6 gap-y-2 sm:col-span-5 sm:grid-cols-4",children:[e.jsx(c,{label:"Workflow rail",checked:x,onChange:A}),e.jsx(c,{label:"Files panel",checked:v,onChange:R}),e.jsx(c,{label:"Terminal",checked:b,onChange:L}),e.jsx(c,{label:"Backdrop",checked:p,onChange:V})]})]}),E=e.jsxs("div",{className:"relative h-[680px] w-full overflow-hidden rounded-2xl",children:[p&&e.jsxs(e.Fragment,{children:[e.jsx("div",{"aria-hidden":"true",className:"absolute inset-0 bg-cover bg-center dark:hidden",style:{backgroundImage:`url(${U})`}}),e.jsx("div",{"aria-hidden":"true",className:"absolute inset-0 hidden bg-cover bg-center dark:block",style:{backgroundImage:`url(${q})`}})]}),e.jsx("div",{className:p?"relative h-full p-4":"relative h-full",children:e.jsx(F,{variant:l,corner:r,tone:s,minCenterWidth:220,padding:g,centerPadding:m,header:e.jsx($,{variant:l,tone:s,corner:"none",start:e.jsx("strong",{children:"Loop workspace"}),end:e.jsxs("span",{className:"text-xs text-emerald-600 dark:text-emerald-400",children:["Running · ",i]})}),left:x&&e.jsx(Y,{...I,side:"left",flush:!1,fillHeight:!0,collapsible:!0,motion:d,style:{width:240},data:{title:"Execution path",activeStepId:i,steps:Z},onStepSelect:z}),right:v&&e.jsx(k,{docked:!0,isOpen:!0,collapsible:!0,resizable:!0,motion:d,inset:u,width:260,minWidth:180,maxWidth:440,title:"Files in scope",subtitle:`${S.length} items`,variant:o,surfaceTone:s,corner:r,children:e.jsxs("div",{className:"space-y-1 px-3 pb-4 text-sm text-neutral-700 dark:text-neutral-300",children:[S.map(t=>e.jsx("div",{className:"truncate rounded-lg px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-white/5",children:t},t)),e.jsxs("label",{className:"block px-2 pt-3 text-xs text-neutral-500 dark:text-neutral-400",children:["Draft note",e.jsx("input",{"aria-label":"File draft note",placeholder:"State survives collapsing…",className:"mt-1.5 w-full rounded-lg border border-neutral-300 bg-transparent p-2 text-sm dark:border-neutral-700"})]})]})}),bottom:b&&e.jsx(k,{docked:!0,side:"bottom",isOpen:!0,collapsible:!0,resizable:!0,motion:d,inset:u,height:220,minHeight:120,maxHeight:400,title:"Terminal",variant:o,surfaceTone:s,corner:r,children:e.jsx("div",{className:"h-full px-3 pb-3",children:e.jsx(D,{height:"100%",variant:"simple",corner:"rounded-sm",readOnly:!0,initialData:ee})})}),children:e.jsxs("div",{className:"space-y-4 p-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300",children:[e.jsx("h3",{className:"text-lg font-semibold text-neutral-900 dark:text-neutral-50",children:i==="survey"?"Surveying the workspace":`Step: ${i}`}),e.jsx("p",{children:"Collapse the rail, Files or Terminal from their own headers, or drag the grips in the gutters: this centre takes whatever space is left."}),Array.from({length:8},(t,f)=>e.jsxs("div",{className:"rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40",children:[e.jsxs("span",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:["Activity ",f+1]}),e.jsx("p",{children:"Reading source files and collecting findings for the review."})]},f))]})})})]});return e.jsxs("div",{className:"w-full space-y-4",children:[W,E]})}const ae=`import { useState } from "react";
import {
  PageBodyLayout,
  PageHeader,
  SidePanel,
  Terminal,
  WorkflowTrackerRail,
  PAGE_BODY_LAYOUT_VARIANTS,
  type PageBodyLayoutVariant,
  type SurfaceCorner,
  type SurfacePadding,
  type SurfaceVariant,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { SelectControl, ToggleRow } from "../../shared/PlaygroundPanel";
import { panelCornerOptions, panelPaddingOptions, surfaceVariantOptions, trueColorOptions } from "../../shared/options";
import backdropLight from "@assets/images/backdrop_demo_light.png";
import backdropDark from "@assets/images/backdrop_demo_dark.png";

const GLASS_VARIANTS: PageBodyLayoutVariant[] = ["default", "glass", "liquid-glass"];

const files = ["cmd/", "internal/", "main.go", "SURVEY.md", "Makefile", "go.mod", "README.md"];
const steps = [
  { id: "start", label: "Start", status: "done" as const },
  { id: "survey", label: "Survey", status: "running" as const },
  { id: "approve", label: "Approve", status: "blocked" as const },
  { id: "summarise", label: "Summarise", status: "not_started" as const },
];
const terminalOutput =
  "\\x1b[90m~/workspace\\x1b[0m $ go test ./...\\r\\n" +
  "\\x1b[32mok\\x1b[0m   workspace/cmd       0.412s\\r\\n" +
  "\\x1b[32mok\\x1b[0m   workspace/internal  0.207s\\r\\n\\r\\n" +
  "\\x1b[90m~/workspace\\x1b[0m $ agent survey\\r\\n" +
  "\\x1b[36m›\\x1b[0m Inspecting repository…\\r\\n";

/**
 * The layout is only zones. The rail and the two docked SidePanels collapse,
 * animate and resize themselves; their zones follow, and the centre takes
 * whatever space is left.
 */
export default function WorkspaceLayout() {
  // The layout's own surface — \`none\` leaves only the zone wireframe — and
  // the surface the controls in the zones draw for themselves.
  const [layoutVariant, setLayoutVariant] = useState<PageBodyLayoutVariant>("outlined");
  const [variant, setVariant] = useState<SurfaceVariant>("outlined");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-md");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [bodyPadding, setBodyPadding] = useState<SurfacePadding>("xs");
  const [centerPadding, setCenterPadding] = useState<SurfacePadding>("none");
  // The panels' float off the zone edges beside their docked one.
  const [inset, setInset] = useState<SurfacePadding>("none");
  const [showRail, setShowRail] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [backdrop, setBackdrop] = useState(false);
  const [active, setActive] = useState("survey");
  // How the docked zones hand over space: the layout sweep eases the centre
  // (and re-runs every observer of the animating subtree per frame); the
  // slide sweep snaps the centre and moves the content on the compositor.
  const [motion, setMotion] = useState<"layout" | "slide">("layout");
  // See-through surfaces need something behind them to be judged against.
  const showBackdrop = backdrop || (GLASS_VARIANTS as string[]).includes(variant) || GLASS_VARIANTS.includes(layoutVariant);
  const surface = { variant, corner, tone };

  const controls = (
    <div className="grid gap-4 sm:grid-cols-5">
      <SelectControl label="Body padding" options={panelPaddingOptions} value={bodyPadding} onChange={value => setBodyPadding(value as SurfacePadding)} />
      <SelectControl label="Center padding" options={panelPaddingOptions} value={centerPadding} onChange={value => setCenterPadding(value as SurfacePadding)} />
      <SelectControl label="Layout surface" options={PAGE_BODY_LAYOUT_VARIANTS.map((v) => ({ label: v, value: v }))} value={layoutVariant} onChange={(v) => setLayoutVariant(v as PageBodyLayoutVariant)} />
      <SelectControl label="Controls surface" options={surfaceVariantOptions} value={variant} onChange={(v) => setVariant(v as SurfaceVariant)} />
      <SelectControl label="Corner" options={panelCornerOptions} value={corner} onChange={(v) => setCorner(v as SurfaceCorner)} />
      <SelectControl label="Tone" options={trueColorOptions} value={tone} onChange={(v) => setTone(v as TrueColor)} />
      <SelectControl label="Panel inset" options={panelPaddingOptions} value={inset} onChange={(v) => setInset(v as SurfacePadding)} />
      <SelectControl label="Collapse motion" options={[{ label: "layout — centre eases", value: "layout" }, { label: "slide — centre snaps, content sweeps", value: "slide" }]} value={motion} onChange={(v) => setMotion(v as "layout" | "slide")} />
      <div className="grid gap-x-6 gap-y-2 sm:col-span-5 sm:grid-cols-4">
        <ToggleRow label="Workflow rail" checked={showRail} onChange={setShowRail} />
        <ToggleRow label="Files panel" checked={showFiles} onChange={setShowFiles} />
        <ToggleRow label="Terminal" checked={showTerminal} onChange={setShowTerminal} />
        <ToggleRow label="Backdrop" checked={showBackdrop} onChange={setBackdrop} />
      </div>
    </div>
  );

  const preview = (
    <div className="relative h-[680px] w-full overflow-hidden rounded-2xl">
      {showBackdrop && <>
        <div aria-hidden="true" className="absolute inset-0 bg-cover bg-center dark:hidden" style={{ backgroundImage: \`url(\${backdropLight})\` }} />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-cover bg-center dark:block" style={{ backgroundImage: \`url(\${backdropDark})\` }} />
      </>}
      <div className={showBackdrop ? "relative h-full p-4" : "relative h-full"}>
      <PageBodyLayout variant={layoutVariant} corner={corner} tone={tone} minCenterWidth={220} padding={bodyPadding} centerPadding={centerPadding}
        header={<PageHeader variant={layoutVariant} tone={tone} corner="none"
          start={<strong>Loop workspace</strong>}
          end={<span className="text-xs text-emerald-600 dark:text-emerald-400">Running · {active}</span>} />}
        left={showRail && (
          <WorkflowTrackerRail {...surface} side="left" flush={false} fillHeight collapsible motion={motion} style={{ width: 240 }}
            data={{ title: "Execution path", activeStepId: active, steps }} onStepSelect={setActive} />
        )}
        right={showFiles && (
          <SidePanel docked isOpen collapsible resizable motion={motion} inset={inset} width={260} minWidth={180} maxWidth={440}
            title="Files in scope" subtitle={\`\${files.length} items\`} variant={variant} surfaceTone={tone} corner={corner}>
            <div className="space-y-1 px-3 pb-4 text-sm text-neutral-700 dark:text-neutral-300">
              {files.map(file => <div key={file} className="truncate rounded-lg px-2 py-1.5 hover:bg-neutral-100 dark:hover:bg-white/5">{file}</div>)}
              <label className="block px-2 pt-3 text-xs text-neutral-500 dark:text-neutral-400">Draft note
                <input aria-label="File draft note" placeholder="State survives collapsing…" className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-transparent p-2 text-sm dark:border-neutral-700" />
              </label>
            </div>
          </SidePanel>
        )}
        bottom={showTerminal && (
          <SidePanel docked side="bottom" isOpen collapsible resizable motion={motion} inset={inset} height={220} minHeight={120} maxHeight={400}
            title="Terminal" variant={variant} surfaceTone={tone} corner={corner}>
            <div className="h-full px-3 pb-3">
              <Terminal height="100%" variant="simple" corner="rounded-sm" readOnly initialData={terminalOutput} />
            </div>
          </SidePanel>
        )}>
        <div className="space-y-4 p-3 text-sm leading-6 text-neutral-700 dark:text-neutral-300">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{active === "survey" ? "Surveying the workspace" : \`Step: \${active}\`}</h3>
          <p>Collapse the rail, Files or Terminal from their own headers, or drag the grips in the gutters: this centre takes whatever space is left.</p>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white/60 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">Activity {i + 1}</span>
              <p>Reading source files and collecting findings for the review.</p>
            </div>
          ))}
        </div>
      </PageBodyLayout>
      </div>
    </div>
  );

  return <div className="w-full space-y-4">{controls}{preview}</div>;
}
`;function ce(){return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8",children:[e.jsx(G,{name:"Page Body Layout",description:"A header above a centre with left, right and bottom zones. The layout holds no state: each zone is as big as what you put in it, and the centre takes the rest. The bottom zone spans only the centre."}),e.jsx(M,{title:"Resizable workspace",description:"The workflow rail and the two docked SidePanels collapse, animate and resize themselves; the zones follow and the centre adjusts. The Terminal is a SidePanel docked to the bottom: it folds to its header and expands upward, and its grip sits on its top edge.",code:ae,filename:"WorkspaceLayout.tsx",children:e.jsx(te,{})}),e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:`Give the layout a bounded height. Left and right zones stretch their content to the body's height; the bottom zone stretches it to the centre's width. A docked SidePanel takes width (or height for side="bottom"), resizable and collapsible itself.`}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:["The body row floors itself at ",e.jsx("code",{children:"calc(--page-zone-min-left + --page-zone-min-right + centre minimum + gaps + padding)"})," — a docked ",e.jsx("code",{children:"SidePanel"})," and a collapsible ",e.jsx("code",{children:"WorkflowTrackerRail"})," publish their own widths into those variables, so a tight container scrolls instead of the centre sliding under a zone, with no ",e.jsx("code",{children:"fit-content"})," intrinsic-size pass being re-run inside every frame of a collapse. Every ",e.jsx("code",{children:"data-page-region"})," carries ",e.jsx("code",{children:"contain: layout style"})," (never ",e.jsx("code",{children:"paint"})," — popovers and menus render outside a region's box). On WebKitGTK, the layout’s own ",e.jsx("code",{children:"glass"}),"/",e.jsx("code",{children:"liquid-glass"})," variants read the backdrop back on the main thread whenever anything under the page scrolls — ",e.jsx("code",{children:"simple"})," or ",e.jsx("code",{children:"elevated"})," is the low-cost desktop default; a zone’s ",e.jsx("code",{children:'motion="slide"'})," removes the sweep’s per-frame layout entirely (the centre snaps; the panel still sweeps)."]}),e.jsx(X,{props:[{name:"padding",type:"SurfacePadding",default:'"xs"',description:"Outer body inset on the shared responsive Panel scale: none, xs, sm, md, lg, xl. Independent of gap. None/plain variants have no outer inset."},{name:"centerPadding",type:"SurfacePadding",default:'"none"',description:"Padding inside the center on the shared responsive scale. Does not change the side or bottom panels."},{name:"gap",type:"number",default:"8",description:"Spacing between zones in pixels, independent of padding."}]})]})}export{ce as default};
