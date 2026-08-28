import{r as n,D as re,j as e,P as x,bw as i,M as o,I as g,e as L,bJ as ce}from"./index-Bw7SVFgV.js";import{P as de}from"./PageHeader-CQm-NnZo.js";import{E as c}from"./ExampleCard-BR4461qP.js";import{P as ue,S as r,C as s,T as l}from"./PlaygroundPanel-efOYSasM.js";import{C as he}from"./ControlAccordion-BDKCdIsF.js";import{b9 as pe,t as W,p as me,e as ge,n as V,r as xe,j as fe,k as ve,l as be}from"./options-CREM8uYu.js";const Se=[{label:"Add",value:"Add"},{label:"Search",value:"Search"},{label:"Container",value:"Container"},{label:"CloudOff",value:"CloudOff"},{label:"Info",value:"Info"}],je=["glass","liquid-glass","default"],Ce=()=>{const[a,G]=n.useState("outlined"),[d,R]=n.useState("blue"),[f,B]=n.useState(re),[v,M]=n.useState("lg"),[b,_]=n.useState("md"),[S,F]=n.useState("Add"),[j,q]=n.useState("All caught up"),[C,D]=n.useState("Connect your first workspace or import data to see activity here."),[y,U]=n.useState(!0),[A,Y]=n.useState(!0),[w,Z]=n.useState(!0),[z,$]=n.useState(!0),[u,H]=n.useState(!0),[N,J]=n.useState(!1),[h,K]=n.useState(!0),[p,Q]=n.useState(!1),[E,X]=n.useState("Create workspace"),[k,ee]=n.useState("soft"),[T,te]=n.useState("blue"),[m,ne]=n.useState("auto"),[P,ae]=n.useState("frosted"),[I,se]=n.useState("medium"),[O,le]=n.useState("classic"),oe=je.includes(a),ie=a==="plain";return e.jsx(ue,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(he,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Variant",options:pe,value:a,onChange:t=>G(t)}),e.jsx(r,{label:"Tone",options:W,value:d,onChange:t=>R(t)}),!ie&&e.jsxs(e.Fragment,{children:[e.jsx(r,{label:"Corner",options:me,value:f,onChange:t=>B(t)}),e.jsx(s,{label:"Padding",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ge,value:v,onChange:t=>M(t)})})]}),e.jsx(s,{label:"Size",children:e.jsx(o,{fullWidth:!0,size:"sm",options:V,value:b,onChange:t=>_(t)})}),e.jsx(s,{label:"Icon",children:e.jsx(o,{fullWidth:!0,size:"sm",options:Se,value:S,onChange:t=>F(t)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Dashed rule",checked:y,onChange:U}),e.jsx(l,{label:"Icon",checked:A,onChange:Y}),e.jsx(l,{label:"Icon disc",checked:w,onChange:Z}),e.jsx(l,{label:"Subtitle",checked:z,onChange:$}),e.jsx(l,{label:"Action",checked:u,onChange:H}),e.jsx(l,{label:"Action icon",checked:N,onChange:J}),e.jsx(l,{label:"Full width",checked:h,onChange:K}),e.jsx(l,{label:"On a glass panel",checked:p,onChange:Q})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Title",children:e.jsx(g,{size:"sm",value:j,onChange:t=>q(t.target.value)})}),e.jsx(s,{label:"Subtitle",children:e.jsx(g,{size:"sm",value:C,onChange:t=>D(t.target.value)})})]})},...u?[{id:"action",title:"Action",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Action label",children:e.jsx(g,{size:"sm",value:E,onChange:t=>X(t.target.value)})}),e.jsx(r,{label:"Action variant",options:xe,value:k,onChange:t=>ee(t)}),e.jsx(r,{label:"Action colour",options:W,value:T,onChange:t=>te(t)}),e.jsx(s,{label:"Action size",children:e.jsx(o,{fullWidth:!0,size:"sm",options:[{label:"Auto",value:"auto"},...V],value:m,onChange:t=>ne(t)})})]})}]:[],...oe?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Specular",children:e.jsx(o,{fullWidth:!0,size:"sm",options:fe,value:O,onChange:t=>le(t)})}),e.jsx(s,{label:"Vibrancy",children:e.jsx(o,{fullWidth:!0,size:"sm",options:ve,value:I,onChange:t=>se(t)})}),e.jsx(s,{label:"Glass opacity",children:e.jsx(o,{fullWidth:!0,size:"sm",options:be,value:P,onChange:t=>ae(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Plain"})," draws no card at all — for an empty state dropped inside a panel the app already owns. The"," ",e.jsx("strong",{children:"dashed rule"})," is an ",e.jsx("code",{children:"outline"}),", not a border, so it sits on top of any variant without fighting the card's own edge. The action button defaults to the empty state's tone and to a size derived from ",e.jsx("strong",{children:"size"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(x,{variant:p?"liquid-glass":"outlined",tone:p?d:"neutral",padding:"md",children:e.jsx(i,{variant:a,tone:d,corner:f,padding:v,size:b,dashed:y,icon:S,showIcon:A,iconBackground:w,title:j||void 0,subtitle:z&&C||void 0,fullWidth:h,className:h?void 0:"mx-auto max-w-md",actionLabel:u?E||"Create item":void 0,onAction:()=>{},actionVariant:k,actionColor:T,actionSize:m==="auto"?void 0:m,actionLeadingIcon:N?"Add":void 0,glassOpacity:P,vibrancy:I,specularMode:O})})})})},ye=()=>e.jsx("div",{className:"w-full max-w-lg",children:e.jsx(i,{icon:"Search",title:"No results for “orchestrator”",subtitle:"Try a broader term, or clear the filters you have applied.",fullWidth:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(L,{size:"sm",variant:"soft",color:"blue",children:"Clear filters"}),e.jsx(L,{size:"sm",variant:"ghost",color:"slate",children:"Browse all"})]})})}),Ae=`import { Button, EmptyState } from "@cjlapao/ui-kit";

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
`,we=["xs","sm","md","lg","xl"],ze=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:we.map(a=>e.jsx(i,{size:a,icon:"Add",title:`Size ${a.toUpperCase()}`,subtitle:"Icon, type and the action button move together.",actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),Ne=`import { EmptyState } from "@cjlapao/ui-kit";
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
`,Ee=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:ce.map(a=>e.jsx(i,{variant:a,tone:"blue",size:"xs",icon:"Add",title:a,actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),ke=`import { EMPTY_STATE_VARIANTS, EmptyState } from "@cjlapao/ui-kit";

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
`,Te=()=>e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-2",children:[e.jsx("div",{className:"rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(x,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(i,{variant:"glass",tone:"blue",size:"sm",icon:"CloudOff",title:"Connection lost",subtitle:"The cluster is unreachable. Check the network and try again.",actionLabel:"Reconnect",onAction:()=>{},vibrancy:"high",specularMode:"classic",fullWidth:!0})})}),e.jsx(x,{variant:"outlined",tone:"neutral",padding:"md",children:e.jsx(i,{variant:"plain",tone:"emerald",size:"sm",icon:"Container",title:"No containers yet",subtitle:"This panel owns the surface — the empty state draws no card of its own.",actionLabel:"Pull image",actionColor:"emerald",onAction:()=>{},fullWidth:!0})})]}),Pe=`import { EmptyState, Panel } from "@cjlapao/ui-kit";

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
`,Re=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(de,{name:"Empty State",description:"The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus a dashed rule for a slot waiting to be filled."}),e.jsx(Ce,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"No results",description:"The canonical search state, with a custom footer of two buttons in place of the generated action.",code:Ae,filename:"NoResults.tsx",children:e.jsx(ye,{})}),e.jsx(c,{title:"Size ladder",description:"One size prop drives the icon, the type scale, the gaps and the action button — everything moves together.",code:Ne,filename:"SizeLadder.tsx",children:e.jsx(ze,{})}),e.jsx(c,{title:"Variant gallery",description:"Every surface treatment at once, plus plain — no card at all, for a panel the app already owns.",code:ke,filename:"VariantGallery.tsx",children:e.jsx(Ee,{})}),e.jsx(c,{title:"Glass and plain",description:"The glass variant on a glass panel over a gradient, and plain sitting inside an outlined panel.",code:Pe,filename:"GlassAndPlain.tsx",children:e.jsx(Te,{})})]})]});export{Re as EmptyStatePage,Re as default};
