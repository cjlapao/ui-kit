import{r as t,j as e,P as d,Y as le,bi as re}from"./index-CQwZVYnB.js";import{P as de}from"./PageHeader-BhZxEVHt.js";import{E as r}from"./ExampleCard-BZsKA5_g.js";import{A as ce,a as m,C as n,P as he}from"./A11ySections-BXfanEck.js";import{a as pe}from"./SurfaceToneControl-LH37fS9y.js";import{bm as ue,c as me,p as be,f as fe,bn as ge,bo as o,bp as we}from"./options-Byh1yOHz.js";import{P as ve,S as p,a as b,T as i}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as ye}from"./ControlAccordion-C7vC6faF.js";const xe="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",je=()=>{const[a,_]=t.useState("elevated"),[w,W]=t.useState("none"),[v,F]=t.useState("md"),[f,H]=t.useState("auto"),[y,K]=t.useState("rounded-md"),[x,q]=t.useState(!1),[j,M]=t.useState("skeleton"),[k,Y]=t.useState(!0),[I,G]=t.useState(!1),[S,Z]=t.useState(!1),[T,U]=t.useState(!1),[C,J]=t.useState(!1),[R,Q]=t.useState(!1),[P,X]=t.useState(!1),[N,$]=t.useState(!1),[u,ee]=t.useState(!1),[E,ne]=t.useState(!1),[B,te]=t.useState(!1),[g,oe]=t.useState(""),[A,ae]=t.useState(!1),[c,se]=t.useState(!1),[z,O]=t.useState(!1),[L,ie]=t.useState(!1),V=a==="simple"||a==="none",D=["Image digest","Region","Replicas"].map((s,l)=>{const h=l===0;return e.jsx(o,{label:s,value:u&&l===0?"":N&&l===0?xe:l===0?"sha256:9f86d0":l===1?"eu-west-1":3,variant:a,tone:w,size:v,padding:f==="auto"?void 0:f,corner:y,raisedSurface:x,copyable:k,mono:I,wrap:S,hoverable:T,noBorder:C,loading:R&&l===0,loaderType:j,error:P&&l===0?"Registry unreachable":void 0,hideIfEmpty:E,emptyText:h&&u&&B?null:void 0,icon:g===""?void 0:g,subItems:A&&h?[{text:"Policy:",value:"trigger_access.all-agents.sdsd.allow",mono:!0}]:void 0,collapsible:c&&h?!0:void 0,expanded:c&&h?z:void 0,onToggle:c&&h?O:void 0,body:c&&h?e.jsx("p",{children:"Deployed from the release pipeline at 14:32 UTC. This body folds open with the same grid-rows animation as the collapsible panel."}):void 0,bottomBorder:L},s)});return e.jsx(ve,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ye,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Variant",options:ue,value:a,onChange:s=>_(s)}),e.jsx(b,{label:"Tone",children:e.jsx(pe,{value:w,onSelect:W})}),e.jsx(p,{label:"Size",options:me,value:v,onChange:s=>F(s)}),e.jsx(p,{label:"Padding",options:[{label:"auto (from size)",value:"auto"},...be],value:f,onChange:s=>H(s)}),e.jsx(p,{label:"Corner",options:fe,value:y,onChange:s=>K(s)}),e.jsx(i,{label:"Raised surface",checked:x,onChange:q}),e.jsx(p,{label:"Loader",options:ge,value:j,onChange:s=>M(s)})]})},{id:"behaviour",title:"Behaviour",controls:e.jsx(b,{label:"Behaviour",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Copyable",checked:k,onChange:Y}),e.jsx(i,{label:"Mono",checked:I,onChange:G}),e.jsx(i,{label:"Wrap",checked:S,onChange:Z}),e.jsx(i,{label:"Hoverable",checked:T,onChange:U}),e.jsx(i,{label:"No border",checked:C,onChange:J})]})})},{id:"anatomy",title:"Anatomy",controls:e.jsxs(e.Fragment,{children:[e.jsx(p,{label:"Icon",options:[{label:"none",value:""},{label:"Check",value:"Check"},{label:"Info",value:"Info"},{label:"Link",value:"Link"},{label:"Key",value:"Key"}],value:g,onChange:s=>oe(s)}),e.jsx(b,{label:"Anatomy",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Sub-items",checked:A,onChange:ae}),e.jsx(i,{label:"Collapsible",checked:c,onChange:se}),c?e.jsx(i,{label:"Expanded",checked:z,onChange:O}):null,e.jsxs("label",{className:V?"flex cursor-pointer items-center justify-between gap-2 text-sm text-neutral-700 dark:text-neutral-300":"flex cursor-not-allowed items-center justify-between gap-2 text-sm text-neutral-400 dark:text-neutral-500",children:[e.jsx("span",{children:"Bottom border"}),e.jsx(le,{size:"sm",color:"blue",checked:L,disabled:!V,onChange:s=>ie(s.target.checked)})]})]})})]})},{id:"states",title:"States",controls:e.jsx(b,{label:"State",children:e.jsxs("div",{className:"space-y-1.5",children:[e.jsx(i,{label:"Loading",checked:R,onChange:Q}),e.jsx(i,{label:"Error",checked:P,onChange:X}),e.jsx(i,{label:"Long value",checked:N,onChange:$}),e.jsx(i,{label:"Empty value",checked:u,onChange:ee}),u&&e.jsx(i,{label:"No placeholder",checked:B,onChange:te}),e.jsx(i,{label:"Hide if empty",checked:E,onChange:ne})]})})}]}),e.jsxs("p",{className:"text-xs text-neutral-500 dark:text-neutral-400",children:[e.jsx("strong",{children:"Elevated"})," is the kit default — each row renders a"," ",e.jsx("code",{children:"Panel"})," of its own. Switch to ",e.jsx("code",{children:"plain"})," for the details-list texture: the row is then its own root element, so the hairline’s ",e.jsx("code",{children:"last:border-0"})," still matches among siblings. Turn on ",e.jsx("strong",{children:"Long value"})," and hover or tab to the value to see the truncation tooltip — it is portaled, so a scrolling panel cannot clip it. In ",e.jsx("strong",{children:"Anatomy"}),", the icon follows the row ",e.jsx("code",{children:"tone"}),"; ",e.jsx("strong",{children:"Collapsible"})," ","makes the whole first row the toggle (the open body and any links keep their own clicks);"," ",e.jsx("strong",{children:"Bottom border"})," is honoured by ",e.jsx("code",{children:"simple"})," ","and ",e.jsx("code",{children:"none"})," only, so the switch is disabled on the other variants."]})]}),preview:e.jsx("div",{className:"w-full max-w-xl",children:a==="plain"?e.jsx(d,{variant:"outlined",padding:"sm",scrollable:!1,children:D}):e.jsx("div",{className:"flex flex-col gap-4",children:D})})})};function ke(){return e.jsx("div",{className:"grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3",children:we.map(a=>e.jsx(o,{variant:a,tone:"violet",label:a,value:"eu-west-1"},a))})}const Ie=`import { INFO_ROW_VARIANTS, InfoRow } from "@cjlapao/ui-kit";

/**
 * \`plain\` draws no surface of its own — just the hairline — which is what a row
 * inside a card the app already owns wants. Every other member renders a
 * \`Panel\`, so the row can also stand on its own.
 */
export default function Variants() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {INFO_ROW_VARIANTS.map((variant) => (
        <InfoRow
          key={variant}
          variant={variant}
          tone="violet"
          label={variant}
          value="eu-west-1"
        />
      ))}
    </div>
  );
}
`;function Se(){return e.jsx("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:re.map(a=>e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Size",value:a,size:a}),e.jsx(o,{label:"Region",value:"eu-west-1",size:a}),e.jsx(o,{label:"Replicas",value:3,size:a})]},a))})}const Te=`import { CONTROL_SIZES, InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The component used to declare its own
 * \`xs | sm | md | lg\`, so it could not be set to \`xl\` beside an \`xl\` Button.
 */
export default function Sizes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {CONTROL_SIZES.map((size) => (
        <Panel key={size} variant="outlined" padding="sm">
          <InfoRow label="Size" value={size} size={size} />
          <InfoRow label="Region" value="eu-west-1" size={size} />
          <InfoRow label="Replicas" value={3} size={size} />
        </Panel>
      ))}
    </div>
  );
}
`;function Ce(){return e.jsxs("div",{className:"grid w-full gap-4 sm:grid-cols-2",children:[e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Digest",loading:!0,loaderType:"skeleton"}),e.jsx(o,{label:"Region",loading:!0,loaderType:"spinner"}),e.jsx(o,{label:"Replicas",value:3})]}),e.jsxs(d,{variant:"outlined",padding:"sm",children:[e.jsx(o,{label:"Digest",error:"Registry unreachable"}),e.jsx(o,{label:"Region",value:"",hideIfEmpty:!1}),e.jsx(o,{label:"Replicas",value:3})]})]})}const Re=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A row that is still loading, or that failed, has something to say even with
 * no value — so \`hideIfEmpty\` no longer wins over either. An error is
 * announced politely rather than left as an "—" indistinguishable from a value
 * that is genuinely empty.
 */
export default function States() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" loading loaderType="skeleton" />
        <InfoRow label="Region" loading loaderType="spinner" />
        <InfoRow label="Replicas" value={3} />
      </Panel>
      <Panel variant="outlined" padding="sm">
        <InfoRow label="Digest" error="Registry unreachable" />
        <InfoRow label="Region" value="" hideIfEmpty={false} />
        <InfoRow label="Replicas" value={3} />
      </Panel>
    </div>
  );
}
`;function Pe(){return e.jsxs(d,{variant:"outlined",padding:"sm",className:"w-full",children:[e.jsx(o,{label:"Digest",mono:!0,value:"sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",onCopy:a=>console.log("copied",a.slice(0,12))}),e.jsx(o,{label:"Endpoint",value:"https://api.example.com/v1/capsules",mono:!0}),e.jsx(o,{label:"Verified",value:!0}),e.jsx(o,{label:"Notes",value:e.jsx("em",{children:"rendered node — no copy button"})})]})}const Ne=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The copy button is a real \`IconButton\`, so it carries the kit's focus ring
 * and hit area. It is revealed on hover *and* on keyboard focus — an
 * \`opacity-0\` button is still in the tab order, so a keyboard user used to land
 * on something invisible.
 *
 * A missing clipboard (any non-secure context) and a rejected write (the
 * document is not focused — very ordinary) both report a failure now instead
 * of throwing or leaving an unhandled rejection.
 */
export default function Copy() {
  return (
    <Panel variant="outlined" padding="sm" className="w-full">
      <InfoRow
        label="Digest"
        mono
        value="sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
        onCopy={(text) => console.log("copied", text.slice(0, 12))}
      />
      <InfoRow
        label="Endpoint"
        value="https://api.example.com/v1/capsules"
        mono
      />
      <InfoRow label="Verified" value={true} />
      <InfoRow label="Notes" value={<em>rendered node — no copy button</em>} />
    </Panel>
  );
}
`,Ee=[{label:"Workspace access",policy:"trigger_access.all-agents.sdsd.allow"},{label:"Secrets read",policy:"vault.read.workspace-scope.allow"},{label:"Outbound webhook",policy:"network.egress.allowlist.allow"},{label:"Tool invocation",policy:"tools.shell.deny-list.deny"},{label:"Audit trail",policy:"audit.append-only.workspace.allow"}];function Be(){return e.jsx(d,{variant:"outlined",padding:"sm",scrollable:!1,children:Ee.map(a=>e.jsx(o,{variant:"plain",icon:"Check",tone:"emerald",label:a.label,emptyText:null,subItems:[{text:"Policy:",value:a.policy,mono:!0}]},a.label))})}const Ae=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * A verdict row: the check icon carries the tone's colour, the title says
 * what passed, and the policy that granted it hangs below as a sub-item —
 * muted lead-in, monospaced detail, indented to the title's edge. These
 * rows have no main value at all, and a row with sub-items is never hidden
 * by \`hideIfEmpty\`, so they survive on their content alone — \`emptyText={null}\`
 * renders no placeholder at all, keeping the right edge clean.
 */
const CHECKS = [
  { label: "Workspace access", policy: "trigger_access.all-agents.sdsd.allow" },
  { label: "Secrets read", policy: "vault.read.workspace-scope.allow" },
  { label: "Outbound webhook", policy: "network.egress.allowlist.allow" },
  { label: "Tool invocation", policy: "tools.shell.deny-list.deny" },
  { label: "Audit trail", policy: "audit.append-only.workspace.allow" },
];

export default function SubItems() {
  return (
    <Panel variant="outlined" padding="sm" scrollable={false}>
      {CHECKS.map((row) => (
        <InfoRow
          key={row.label}
          variant="plain"
          icon="Check"
          tone="emerald"
          label={row.label}
          emptyText={null}
          subItems={[{ text: "Policy:", value: row.policy, mono: true }]}
        />
      ))}
    </Panel>
  );
}
`;function ze(){return e.jsxs(d,{variant:"outlined",padding:"sm",scrollable:!1,children:[e.jsx(o,{variant:"plain",icon:"Info",label:"Blueprint, secret, workspace and scope are ready",defaultExpanded:!0,body:e.jsxs("ul",{className:"list-disc space-y-1 pl-5",children:[e.jsx("li",{children:"Blueprint pinned to revision 41"}),e.jsx("li",{children:"Secret resolved from the workspace vault"}),e.jsx("li",{children:"Scope limited to the triggering repository"})]})}),e.jsx(o,{variant:"plain",icon:"Link",label:"Trigger: webhook",value:"POST /hooks/deploy",mono:!0,subItems:[{text:"Delivers to",value:"Deploy queue"},{text:"Verified with",value:"signing secret",mono:!0}],body:e.jsx("p",{children:"The payload is verified with the signing secret before the run is queued. Clicking anywhere on this row — the title, the value or either sub-item line — opens it."})})]})}const Oe=`import { InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The row is a disclosure: the whole control — main line, sub-items and all —
 * is the trigger (click, Enter or Space), and the body unfolds with the same
 * grid-rows animation \`CollapsiblePanel\` uses. The body is whatever the app
 * puts in it; a collapsed one is \`inert\`, not \`hidden\`, so the transition can
 * play and the content never lands in the tab order. The copy button and the
 * open body keep their own clicks, and any link or input in the row activates
 * itself — none of them fold the row shut.
 */
export default function Collapsible() {
  return (
    <Panel variant="outlined" padding="sm" scrollable={false}>
      <InfoRow
        variant="plain"
        icon="Info"
        label="Blueprint, secret, workspace and scope are ready"
        defaultExpanded
        body={
          <ul className="list-disc space-y-1 pl-5">
            <li>Blueprint pinned to revision 41</li>
            <li>Secret resolved from the workspace vault</li>
            <li>Scope limited to the triggering repository</li>
          </ul>
        }
      />
      <InfoRow
        variant="plain"
        icon="Link"
        label="Trigger: webhook"
        value="POST /hooks/deploy"
        mono
        subItems={[
          { text: "Delivers to", value: "Deploy queue" },
          { text: "Verified with", value: "signing secret", mono: true },
        ]}
        body={
          <p>
            The payload is verified with the signing secret before the run is
            queued. Clicking anywhere on this row — the title, the value or
            either sub-item line — opens it.
          </p>
        }
      />
    </Panel>
  );
}
`;function Le(){return e.jsxs("div",{className:"flex w-full max-w-md flex-col",children:[e.jsx(o,{variant:"none",label:"Trigger",value:"webhook",icon:"Link",bottomBorder:!0,body:e.jsx("p",{children:"Verified against the signing secret; the run is queued only for pushes to the default branch."})}),e.jsx(o,{variant:"none",label:"Method",value:"POST",bottomBorder:!0}),e.jsx(o,{variant:"none",label:"Endpoint",value:"/api/hooks/deploy",mono:!0,bottomBorder:!0}),e.jsx(o,{variant:"none",label:"Token",value:"sk_live_9f2c81ab44de0c73a41d",mono:!0,icon:"Key",bottomBorder:!0})]})}const Ve=`import { InfoRow } from "@cjlapao/ui-kit";

/**
 * \`bottomBorder\` turns each row into a section edge — the rules of a simple
 * key/value table, honoured by the \`simple\` and \`none\` variants only (the
 * surfaced variants already draw a frame, and \`plain\` keeps its
 * sibling-matched hairline so the last row stays bare). Each rule is
 * full-width, including under the sub-items; the table ends where the
 * caller stops opting in.
 */
export default function BottomBorder() {
  return (
    <div className="flex w-full max-w-md flex-col">
      <InfoRow
        variant="none"
        label="Trigger"
        value="webhook"
        icon="Link"
        bottomBorder
        body={
          <p>
            Verified against the signing secret; the run is queued only for
            pushes to the default branch.
          </p>
        }
      />
      <InfoRow variant="none" label="Method" value="POST" bottomBorder />
      <InfoRow
        variant="none"
        label="Endpoint"
        value="/api/hooks/deploy"
        mono
        bottomBorder
      />
      <InfoRow
        variant="none"
        label="Token"
        value="sk_live_9f2c81ab44de0c73a41d"
        mono
        icon="Key"
        bottomBorder
      />
    </div>
  );
}
`,Ye=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(de,{name:"Info Row",description:"One label/value line in a details panel — with copy-to-clipboard, a tooltip when the value is truncated, and loading, empty and error states. A leading icon, stacked sub-items and an optional disclosure body cover the richer shapes a review or a trigger config asks for. Its copy colour and hairline come from the surface it sits on, so a row on glass reads as well as one on a white card."}),e.jsx(je,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"Variants",description:"`elevated` is the kit default — the row renders inside a `Panel` of its own. `plain` draws no surface and stays the root element, so the hairline's `last:border-0` still matches among sibling rows — pass it explicitly for the details-list texture.",code:Ie,filename:"Variants.tsx",children:e.jsx(ke,{})}),e.jsx(r,{title:"Sizes",description:"The full shared control scale. The component declared its own `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button — and `padding` had its own eight-member list where the kit has six.",code:Te,filename:"Sizes.tsx",children:e.jsx(Se,{})}),e.jsx(r,{title:"Loading, empty and error",description:"A row that is loading or has failed stays visible even with no value — `hideIfEmpty` used to win over both, so a panel visibly jumped as values arrived. The skeleton bar is sized from the row's own scale.",code:Re,filename:"States.tsx",children:e.jsx(Ce,{})}),e.jsx(r,{title:"Copy and truncation",description:"Copy is a real `IconButton`, revealed on hover and on keyboard focus. A missing clipboard or a rejected write reports a failure instead of throwing. The truncation tooltip is the shared portaled `TooltipWrapper`, so a scrolling panel cannot clip it — and it now answers to focus, not just to a pointer.",code:Ne,filename:"Copy.tsx",children:e.jsx(Pe,{})}),e.jsx(r,{title:"Sub items",description:"A verdict row can say more than one thing: a leading `icon` in the row's tone, and `subItems` — `text value` lines stacked under the main line, indented to the title's leading edge (a sub-item's `mono` is its own). Rows like these carry no main value, and a row with sub-items survives the `hideIfEmpty` default — it is the sub-items that make it worth showing, with `emptyText={null}` keeping the empty value from painting a dash on the right edge.",code:Ae,filename:"SubItems.tsx",children:e.jsx(Be,{})}),e.jsx(r,{title:"Collapsible",description:"`collapsible` (implied whenever a `body` is present) makes the whole row the toggle — main line, sub-items and all: `role='button'` on the row, Enter and Space, and the focus ring of a shared trigger, exactly where the hover wash lands. The body unfolds with the same `grid-template-rows: 0fr→1fr` animation the collapsible panel uses; collapsed, it is `inert` rather than `hidden`, so the transition plays and nothing inside the folded body takes a tab stop. The open body, the value cluster and any links or inputs inside the row keep their own clicks.",code:Oe,filename:"Collapsible.tsx",children:e.jsx(ze,{})}),e.jsx(r,{title:"Bottom border",description:"`bottomBorder` draws a section edge under each row — the rules of a simple key/value table. It is honoured by the `simple` and `none` variants only: the surfaced variants already frame themselves, and `plain` keeps its hairline so the last row still goes bare. The rule spans the full row width, including under any sub-items; where the caller stops opting in, the table ends.",code:Ve,filename:"BottomBorder.tsx",children:e.jsx(Le,{})})]}),e.jsxs(ce,{children:[e.jsxs(m,{title:"Screen reader",children:[e.jsxs("p",{children:["A loading row carries ",e.jsx(n,{children:"aria-busy"})," on the row element itself, so assistive tech knows the value is pending rather than missing. A"," ",e.jsx(n,{children:'loaderType="spinner"'})," is a ",e.jsx(n,{children:'role="status"'})," with a localised label; a skeleton is decorative and announces nothing. An ",e.jsx(n,{children:"error"})," ","renders its text visibly and duplicates it into a polite"," ",e.jsx(n,{children:'role="status"'})," — a row that silently shows ",e.jsx(n,{children:"—"})," for a failed lookup is indistinguishable from one that is genuinely empty, and that confusion is exactly what the error prop exists to prevent."]}),e.jsxs("p",{children:["Copying is confirmed, not silent: the button’s accessible name flips to ",e.jsx(n,{children:"kit.inforow.copiedLong"})," and a polite live region announces it — polite, so a confirmation never interrupts what is being read. If the clipboard is unavailable or the write is rejected (a document that lost focus mid-click is the common case), the name flips to ",e.jsx(n,{children:"kit.inforow.copyFailed"}),", the button turns rose, and the same live region says so; nothing throws."]})]}),e.jsxs(m,{title:"Keyboard Support",children:[e.jsxs("p",{children:["The row itself is plain text — no listbox semantics, no arrow keys; rows are read in document order, which is right for a details panel. The copy button is a real ",e.jsx(n,{children:"button"})," in the tab order, and it is revealed on ",e.jsx(n,{children:"focus-visible"}),", not just on hover — an invisible button that still accepts Enter used to be a keyboard trap of confusion. It claims no space while hidden, so the value owns the full column until the button slides in. The pointer and the keyboard are the only things summoning the button — never its own confirmation state, and never the DOM focus a mouse-click leaves behind: leaving the row mid-confirmation hides the check right with the pointer, and returning within its moment finds it waiting. When the confirmation ends, hover stops summoning too — the fold lands under even a parked cursor — until the pointer leaves the row and re-arms. The keyboard's branch of the rule is ",e.jsx(n,{children:":focus-visible"}),"— a focus that cannot come from a click — so a Tab-navigated user always keeps the button, and its focus ring, on screen. A truncated value is a focusable span (an inset ring, so the focus stays inside the row) and its tooltip answers to focus as well as hover; it is portaled, so a scrolling panel cannot clip it."]}),e.jsx("p",{children:"Boolean values render as localised Yes/No text, so they are read as words rather than as nothing — and copy still offers the same text."})]}),e.jsx(m,{title:"Disclosure rows",children:e.jsxs("p",{children:["A ",e.jsx(n,{children:"collapsible"})," row makes the whole control the toggle — main line, sub-items and all: a real ",e.jsx(n,{children:'role="button"'})," on the row with"," ",e.jsx(n,{children:"aria-expanded"})," and ",e.jsx(n,{children:"aria-controls"}),", answering to click, Enter and Space (with ",e.jsx(n,{children:"preventDefault"}),", so Space never scrolls the page). Its accessible name is the row’s own text; the chevron is ",e.jsx(n,{children:"aria-hidden"}),". The open body stops the activation from reaching the row, and so do the value-cluster controls — copying a digest must never fold the body shut — while a guard keeps any real link or input in the row out of the toggle too, so it activates itself instead. The collapsed body is ",e.jsx(n,{children:"inert"})," and"," ",e.jsx(n,{children:"aria-hidden"}),", not ",e.jsx(n,{children:"hidden"}),": nothing inside it lands in the tab order or the accessibility tree, yet the grid-rows transition can still play. The ",e.jsx(n,{children:"icon"})," is decorative — ",e.jsx(n,{children:"aria-hidden"})," — the way the copy affordance’s glyph is; a sub-item line is plain text, read in document order after the main line."]})}),e.jsx(m,{title:"Internationalization",children:e.jsxs("p",{children:["Every built-in string is catalog-resolved (",e.jsx(n,{children:"kit.inforow.*"}),", five locales): the loading label, the copy button’s idle name and tooltip, both confirmation phrasings, the failure message, and the Yes/No pair rendered for boolean values. The ",e.jsx(n,{children:"emptyText"})," ","placeholder defaults to a locale-neutral ",e.jsx(n,{children:"—"}),", and Labels, values and errors are the caller’s text and pass through untouched; want a whole new language? Layer ",e.jsx(n,{children:"kit.inforow.*"})," keys in your own catalogs — the i18n page shows the override live."]})})]}),e.jsx(he,{props:[{name:"label",type:"ReactNode",description:"Left column. Composed labels are welcome; keep interactive children out of the row."},{name:"value",type:"ReactNode",description:"string/number render as copyable text; boolean renders localised Yes/No, also copyable; a ReactNode renders as-is and suppresses the copy button; null/undefined/'' count as empty."},{name:"variant",type:"PlainSurfaceVariant",default:'"elevated"',description:"The kit surface family. `plain` draws no surface and keeps the row as the root element — pass it for details-list texture where the hairline's `last:border-0` must match siblings."},{name:"tone",type:"TrueColor",default:'"blue"',description:"Accent for the hover wash, focus rings and glass tint. Text colour is not tinted — it comes from the surface, so a row on glass stays readable."},{name:"size",type:"ControlSize",default:'"md"',description:"The shared control scale — type, gaps, label width, skeleton-bar height and icon size all derive from it."},{name:"labelSize / valueSize",type:"ControlSize",description:"Independent type overrides for either column when the row's own `size` is not enough."},{name:"padding",type:"SurfacePadding",description:"Vertical padding override. Omit it and padding derives from `size`."},{name:"corner",type:"SurfaceCorner",default:"rounded-md",description:"Only visible with a surface variant — a plain row draws none."},{name:"raisedSurface",type:"boolean",default:"false",description:"Forwards to the row's Panel — forces at least the first nested-panels depth step, the tinted-card-on-matching-background fix. Like the corner, invisible on a plain row."},{name:"labelWidth",type:"string",description:'Fixed label-column width class (`"w-32"`). Defaults per size (`w-16`…`w-32`); pass `""` to let the label size naturally.'},{name:"copyable",type:"boolean",default:"true",description:"Auto-off for ReactNode values (nothing meaningful to copy); explicit `true` forces the button for any stringifiable value."},{name:"onCopy",type:"(text: string) => void",description:"Fired after a confirmed write."},{name:"loading",type:"boolean",description:"Placeholder in the value's place, `aria-busy` on the row, copy suppressed. The row stays visible even with no value — `hideIfEmpty` does not win over a pending row."},{name:"loaderType",type:'"skeleton" | "spinner"',default:'"skeleton"',description:'Skeleton bar (decorative, sized from the row scale) or spin ring (`role="status"`, localised). Both stand down under `prefers-reduced-motion`.'},{name:"error",type:"string",description:"Replaces the value, visibly and in a polite live region. Also keeps the row visible under `hideIfEmpty`."},{name:"hideIfEmpty",type:"boolean",default:"true",description:"Removes the row entirely when the value is empty — excepted by `loading`, `error`, non-empty `subItems`, a `body`, and `collapsible`."},{name:"emptyText",type:"string | null",default:'"—"',description:"Placeholder when `hideIfEmpty` is off. Pass `null` to render no placeholder at all — the row shows its label, sub-items and body with no dash, while loading and error still paint in the value area."},{name:"wrap",type:"boolean",default:"false",description:"Wrap the value instead of truncating it."},{name:"tooltipOnTruncate",type:"boolean",default:"true",description:"Portaled full-value tooltip on hover and focus, measured live — only while truncation actually happens."},{name:"mono",type:"boolean",description:"Monospace for the value — digests, ids, IPs."},{name:"icon",type:"IconName | ReactElement",description:"Leading icon before the title, tinted by the row's `tone` (muted when `none`). Decorative — `aria-hidden`; the label still carries the row's name."},{name:"iconClassName",type:"string",description:"Extras for the icon slot; a `text-*` class here wins over the tone tint."},{name:"subItems",type:"InfoRowSubItem[]",description:"`{ text?, value?, mono?, className? }` lines stacked under the main line, indented to the title's leading edge whenever an icon is present. Booleans render localised Yes/No like the main value; a line with neither text nor value renders nothing."},{name:"collapsible",type:"boolean",description:'Implied whenever `body` is present. The whole control becomes the toggle — `role="button"` on the row, Enter/Space, `aria-expanded` — with the trigger\'s cursor and focus ring; the hover wash fills the whole row, sub-items and open body included. The open body, the value cluster and any links or inputs keep their own clicks.'},{name:"defaultExpanded",type:"boolean",description:"Initial open state for the uncontrolled body."},{name:"expanded",type:"boolean",description:"Controlled open state; pair it with `onToggle`."},{name:"onToggle",type:"(expanded: boolean) => void",description:"Fires on every activation of the row, controlled or not."},{name:"body",type:"ReactNode",description:"App content revealed by the disclosure, animated with the collapsible panel's grid-rows transition. `inert` while collapsed — never `hidden`, which would cut the animation off."},{name:"bottomBorder",type:"boolean",description:"Section rule under the row — honoured by `simple` and `none` only; the other variants ignore it (surfaced rows frame themselves, `plain` keeps its hairline)."},{name:"hoverable",type:"boolean",description:"Tone-coloured hover wash with rounded corners; drops the hairline while on."},{name:"noBorder / noPadding",type:"boolean",description:"Local escapes for lists whose borders or padding are managed externally."},{name:"glassOpacity / vibrancy",type:"GlassOpacity / GlassVibrancy",description:"Glass tuning for the glass variants."}]}),e.jsxs("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:[e.jsx("code",{children:"InfoRow"})," spreads div attributes. Rows are meant to be siblings in a plain flow — wrapping them in per-row containers breaks the hairline’s last-child rule."]})]});export{Ye as InfoRowPage,Ye as default};
