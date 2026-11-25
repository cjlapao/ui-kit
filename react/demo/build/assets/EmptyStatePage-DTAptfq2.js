import{r as n,a1 as ce,j as e,P as x,E as i,bf as l,c as g,B as W,it as de}from"./index-CQwZVYnB.js";import{P as ue}from"./PageHeader-BhZxEVHt.js";import{E as r}from"./ExampleCard-BZsKA5_g.js";import{S as he}from"./SurfaceToneControl-LH37fS9y.js";import{P as pe,S as c,a as s,T as o}from"./PlaygroundPanel-Dq0XbiQ9.js";import{C as me}from"./ControlAccordion-C7vC6faF.js";import{bs as ge,f as xe,p as fe,c as R,h as ve,t as Se,A as be,B as je,C as Ce}from"./options-Byh1yOHz.js";const ye=[{label:"Add",value:"Add"},{label:"Search",value:"Search"},{label:"Container",value:"Container"},{label:"CloudOff",value:"CloudOff"},{label:"Info",value:"Info"}],Ae=["glass","liquid-glass","default"],we=()=>{const[a,V]=n.useState("outlined"),[d,G]=n.useState("none"),[f,B]=n.useState(ce),[v,_]=n.useState("lg"),[S,F]=n.useState(!1),[b,M]=n.useState("md"),[j,q]=n.useState("Add"),[C,U]=n.useState("All caught up"),[y,D]=n.useState("Connect your first workspace or import data to see activity here."),[A,Y]=n.useState(!0),[w,Z]=n.useState(!0),[z,$]=n.useState(!0),[E,H]=n.useState(!0),[u,J]=n.useState(!0),[N,K]=n.useState(!1),[h,Q]=n.useState(!0),[p,X]=n.useState(!1),[k,ee]=n.useState("Create workspace"),[T,te]=n.useState("soft"),[P,ne]=n.useState("blue"),[m,ae]=n.useState("auto"),[I,se]=n.useState("frosted"),[O,oe]=n.useState("medium"),[L,le]=n.useState("classic"),ie=Ae.includes(a),re=a==="plain";return e.jsx(pe,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(me,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:ge,value:a,onChange:t=>V(t)}),e.jsx(he,{label:"Tone",value:d,onChange:G}),!re&&e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Corner",options:xe,value:f,onChange:t=>B(t)}),e.jsx(s,{label:"Padding",children:e.jsx(l,{fullWidth:!0,size:"sm",options:fe,value:v,onChange:t=>_(t)})}),e.jsx(o,{label:"Raised surface",checked:S,onChange:F})]}),e.jsx(s,{label:"Size",children:e.jsx(l,{fullWidth:!0,size:"sm",options:R,value:b,onChange:t=>M(t)})}),e.jsx(s,{label:"Icon",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ye,value:j,onChange:t=>q(t)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Dashed rule",checked:A,onChange:Y}),e.jsx(o,{label:"Icon",checked:w,onChange:Z}),e.jsx(o,{label:"Icon disc",checked:z,onChange:$}),e.jsx(o,{label:"Subtitle",checked:E,onChange:H}),e.jsx(o,{label:"Action",checked:u,onChange:J}),e.jsx(o,{label:"Action icon",checked:N,onChange:K}),e.jsx(o,{label:"Full width",checked:h,onChange:Q}),e.jsx(o,{label:"On a glass panel",checked:p,onChange:X})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Title",children:e.jsx(g,{size:"sm",value:C,onChange:t=>U(t.target.value)})}),e.jsx(s,{label:"Subtitle",children:e.jsx(g,{size:"sm",value:y,onChange:t=>D(t.target.value)})})]})},...u?[{id:"action",title:"Action",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Action label",children:e.jsx(g,{size:"sm",value:k,onChange:t=>ee(t.target.value)})}),e.jsx(c,{label:"Action variant",options:ve,value:T,onChange:t=>te(t)}),e.jsx(c,{label:"Action colour",options:Se,value:P,onChange:t=>ne(t)}),e.jsx(s,{label:"Action size",children:e.jsx(l,{fullWidth:!0,size:"sm",options:[{label:"Auto",value:"auto"},...R],value:m,onChange:t=>ae(t)})})]})}]:[],...ie?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Specular",children:e.jsx(l,{fullWidth:!0,size:"sm",options:be,value:L,onChange:t=>le(t)})}),e.jsx(s,{label:"Vibrancy",children:e.jsx(l,{fullWidth:!0,size:"sm",options:je,value:O,onChange:t=>oe(t)})}),e.jsx(s,{label:"Glass opacity",children:e.jsx(l,{fullWidth:!0,size:"sm",options:Ce,value:I,onChange:t=>se(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Plain"})," draws no card at all — for an empty state dropped inside a panel the app already owns. The"," ",e.jsx("strong",{children:"dashed rule"})," is an ",e.jsx("code",{children:"outline"}),", not a border, so it sits on top of any variant without fighting the card's own edge. The action button defaults to the empty state's tone and to a size derived from ",e.jsx("strong",{children:"size"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(x,{variant:p?"liquid-glass":"outlined",tone:p?d:"neutral",padding:"md",children:e.jsx(i,{variant:a,tone:d,corner:f,padding:v,raisedSurface:S,size:b,dashed:A,icon:j,showIcon:w,iconBackground:z,title:C||void 0,subtitle:E&&y||void 0,fullWidth:h,className:h?void 0:"mx-auto max-w-md",actionLabel:u?k||"Create item":void 0,onAction:()=>{},actionVariant:T,actionColor:P,actionSize:m==="auto"?void 0:m,actionLeadingIcon:N?"Add":void 0,glassOpacity:I,vibrancy:O,specularMode:L})})})})},ze=()=>e.jsx("div",{className:"w-full max-w-lg",children:e.jsx(i,{icon:"Search",title:"No results for “orchestrator”",subtitle:"Try a broader term, or clear the filters you have applied.",fullWidth:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(W,{size:"sm",variant:"soft",color:"blue",children:"Clear filters"}),e.jsx(W,{size:"sm",variant:"ghost",color:"slate",children:"Browse all"})]})})}),Ee=`import { Button, EmptyState } from "@cjlapao/ui-kit";

const NoResults = () => (
  <div className="w-full max-w-lg">
    <EmptyState
      icon="Search"
      title="No results for “orchestrator”"
      subtitle="Try a broader term, or clear the filters you have applied."
      fullWidth
      actions={
        <>
          <Button size="sm" variant="soft" color="blue">
            Clear filters
          </Button>
          <Button size="sm" variant="ghost" color="slate">
            Browse all
          </Button>
        </>
      }
    />
  </div>
);

export default NoResults;
`,Ne=["xs","sm","md","lg","xl"],ke=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:Ne.map(a=>e.jsx(i,{size:a,icon:"Add",title:`Size ${a.toUpperCase()}`,subtitle:"Icon, type and the action button move together.",actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),Te=`import { EmptyState } from "@cjlapao/ui-kit";
import type { EmptyStateSize } from "@cjlapao/ui-kit";

const SIZES: EmptyStateSize[] = ["xs", "sm", "md", "lg", "xl"];

const SizeLadder = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    {SIZES.map((size) => (
      <EmptyState
        key={size}
        size={size}
        icon="Add"
        title={\`Size \${size.toUpperCase()}\`}
        subtitle="Icon, type and the action button move together."
        actionLabel="Create"
        onAction={() => undefined}
        fullWidth
      />
    ))}
  </div>
);

export default SizeLadder;
`,Pe=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:de.map(a=>e.jsx(i,{variant:a,tone:"blue",size:"xs",icon:"Add",title:a,actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),Ie=`import { EMPTY_STATE_VARIANTS, EmptyState } from "@cjlapao/ui-kit";

const VariantGallery = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    {EMPTY_STATE_VARIANTS.map((variant) => (
      <EmptyState
        key={variant}
        variant={variant}
        tone="blue"
        size="xs"
        icon="Add"
        title={variant}
        actionLabel="Create"
        onAction={() => undefined}
        fullWidth
      />
    ))}
  </div>
);

export default VariantGallery;
`,Oe=()=>e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-2",children:[e.jsx("div",{className:"rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(x,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(i,{variant:"glass",tone:"blue",size:"sm",icon:"CloudOff",title:"Connection lost",subtitle:"The cluster is unreachable. Check the network and try again.",actionLabel:"Reconnect",onAction:()=>{},vibrancy:"high",specularMode:"classic",fullWidth:!0})})}),e.jsx(x,{variant:"outlined",tone:"neutral",padding:"md",children:e.jsx(i,{variant:"plain",tone:"emerald",size:"sm",icon:"Container",title:"No containers yet",subtitle:"This panel owns the surface — the empty state draws no card of its own.",actionLabel:"Pull image",actionColor:"emerald",onAction:()=>{},fullWidth:!0})})]}),Le=`import { EmptyState, Panel } from "@cjlapao/ui-kit";

const GlassAndPlain = () => (
  <div className="grid w-full gap-4 md:grid-cols-2">
    <div className="rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
      <Panel variant="liquid-glass" tone="blue" padding="md">
        <EmptyState
          variant="glass"
          tone="blue"
          size="sm"
          icon="CloudOff"
          title="Connection lost"
          subtitle="The cluster is unreachable. Check the network and try again."
          actionLabel="Reconnect"
          onAction={() => undefined}
          vibrancy="high"
          specularMode="classic"
          fullWidth
        />
      </Panel>
    </div>
    <Panel variant="outlined" tone="neutral" padding="md">
      <EmptyState
        variant="plain"
        tone="emerald"
        size="sm"
        icon="Container"
        title="No containers yet"
        subtitle="This panel owns the surface — the empty state draws no card of its own."
        actionLabel="Pull image"
        actionColor="emerald"
        onAction={() => undefined}
        fullWidth
      />
    </Panel>
  </div>
);

export default GlassAndPlain;
`,Me=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ue,{name:"Empty State",description:"The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus `raisedSurface` (forces the first nested-panels depth step — the tinted-card-on-matching-background fix) and a dashed rule for a slot waiting to be filled."}),e.jsx(we,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"No results",description:"The canonical search state, with a custom footer of two buttons in place of the generated action.",code:Ee,filename:"NoResults.tsx",children:e.jsx(ze,{})}),e.jsx(r,{title:"Size ladder",description:"One size prop drives the icon, the type scale, the gaps and the action button — everything moves together.",code:Te,filename:"SizeLadder.tsx",children:e.jsx(ke,{})}),e.jsx(r,{title:"Variant gallery",description:"Every surface treatment at once, plus plain — no card at all, for a panel the app already owns.",code:Ie,filename:"VariantGallery.tsx",children:e.jsx(Pe,{})}),e.jsx(r,{title:"Glass and plain",description:"The glass variant on a glass panel over a gradient, and plain sitting inside an outlined panel.",code:Le,filename:"GlassAndPlain.tsx",children:e.jsx(Oe,{})})]})]});export{Me as EmptyStatePage,Me as default};
