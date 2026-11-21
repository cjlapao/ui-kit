import{r as n,a5 as ie,j as e,P as x,E as i,bk as l,c as g,B as L,hS as re}from"./index-ChbzYKtA.js";import{P as ce}from"./PageHeader-CORco2N-.js";import{E as r}from"./ExampleCard-Db5NXgWv.js";import{S as de}from"./SurfaceToneControl-BpIV0XpL.js";import{P as ue,S as c,a as s,T as o}from"./PlaygroundPanel-CZxrTOj5.js";import{C as he}from"./ControlAccordion-DoyyLWlc.js";import{br as pe,f as me,p as ge,c as W,D as xe,t as fe,x as ve,y as Se,z as be}from"./options-C-rzDbtC.js";const je=[{label:"Add",value:"Add"},{label:"Search",value:"Search"},{label:"Container",value:"Container"},{label:"CloudOff",value:"CloudOff"},{label:"Info",value:"Info"}],Ce=["glass","liquid-glass","default"],ye=()=>{const[a,V]=n.useState("outlined"),[d,G]=n.useState("none"),[f,R]=n.useState(ie),[v,B]=n.useState("lg"),[S,_]=n.useState("md"),[b,F]=n.useState("Add"),[j,M]=n.useState("All caught up"),[C,q]=n.useState("Connect your first workspace or import data to see activity here."),[y,D]=n.useState(!0),[A,U]=n.useState(!0),[w,Y]=n.useState(!0),[z,Z]=n.useState(!0),[u,$]=n.useState(!0),[E,H]=n.useState(!1),[h,J]=n.useState(!0),[p,K]=n.useState(!1),[N,Q]=n.useState("Create workspace"),[T,X]=n.useState("soft"),[k,ee]=n.useState("blue"),[m,te]=n.useState("auto"),[P,ne]=n.useState("frosted"),[I,ae]=n.useState("medium"),[O,se]=n.useState("classic"),oe=Ce.includes(a),le=a==="plain";return e.jsx(ue,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(he,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Variant",options:pe,value:a,onChange:t=>V(t)}),e.jsx(de,{label:"Tone",value:d,onChange:G}),!le&&e.jsxs(e.Fragment,{children:[e.jsx(c,{label:"Corner",options:me,value:f,onChange:t=>R(t)}),e.jsx(s,{label:"Padding",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ge,value:v,onChange:t=>B(t)})})]}),e.jsx(s,{label:"Size",children:e.jsx(l,{fullWidth:!0,size:"sm",options:W,value:S,onChange:t=>_(t)})}),e.jsx(s,{label:"Icon",children:e.jsx(l,{fullWidth:!0,size:"sm",options:je,value:b,onChange:t=>F(t)})})]})},{id:"states",title:"States",controls:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(o,{label:"Dashed rule",checked:y,onChange:D}),e.jsx(o,{label:"Icon",checked:A,onChange:U}),e.jsx(o,{label:"Icon disc",checked:w,onChange:Y}),e.jsx(o,{label:"Subtitle",checked:z,onChange:Z}),e.jsx(o,{label:"Action",checked:u,onChange:$}),e.jsx(o,{label:"Action icon",checked:E,onChange:H}),e.jsx(o,{label:"Full width",checked:h,onChange:J}),e.jsx(o,{label:"On a glass panel",checked:p,onChange:K})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(s,{label:"Title",children:e.jsx(g,{size:"sm",value:j,onChange:t=>M(t.target.value)})}),e.jsx(s,{label:"Subtitle",children:e.jsx(g,{size:"sm",value:C,onChange:t=>q(t.target.value)})})]})},...u?[{id:"action",title:"Action",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Action label",children:e.jsx(g,{size:"sm",value:N,onChange:t=>Q(t.target.value)})}),e.jsx(c,{label:"Action variant",options:xe,value:T,onChange:t=>X(t)}),e.jsx(c,{label:"Action colour",options:fe,value:k,onChange:t=>ee(t)}),e.jsx(s,{label:"Action size",children:e.jsx(l,{fullWidth:!0,size:"sm",options:[{label:"Auto",value:"auto"},...W],value:m,onChange:t=>te(t)})})]})}]:[],...oe?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(s,{label:"Specular",children:e.jsx(l,{fullWidth:!0,size:"sm",options:ve,value:O,onChange:t=>se(t)})}),e.jsx(s,{label:"Vibrancy",children:e.jsx(l,{fullWidth:!0,size:"sm",options:Se,value:I,onChange:t=>ae(t)})}),e.jsx(s,{label:"Glass opacity",children:e.jsx(l,{fullWidth:!0,size:"sm",options:be,value:P,onChange:t=>ne(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Plain"})," draws no card at all — for an empty state dropped inside a panel the app already owns. The"," ",e.jsx("strong",{children:"dashed rule"})," is an ",e.jsx("code",{children:"outline"}),", not a border, so it sits on top of any variant without fighting the card's own edge. The action button defaults to the empty state's tone and to a size derived from ",e.jsx("strong",{children:"size"}),"."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(x,{variant:p?"liquid-glass":"outlined",tone:p?d:"neutral",padding:"md",children:e.jsx(i,{variant:a,tone:d,corner:f,padding:v,size:S,dashed:y,icon:b,showIcon:A,iconBackground:w,title:j||void 0,subtitle:z&&C||void 0,fullWidth:h,className:h?void 0:"mx-auto max-w-md",actionLabel:u?N||"Create item":void 0,onAction:()=>{},actionVariant:T,actionColor:k,actionSize:m==="auto"?void 0:m,actionLeadingIcon:E?"Add":void 0,glassOpacity:P,vibrancy:I,specularMode:O})})})})},Ae=()=>e.jsx("div",{className:"w-full max-w-lg",children:e.jsx(i,{icon:"Search",title:"No results for “orchestrator”",subtitle:"Try a broader term, or clear the filters you have applied.",fullWidth:!0,actions:e.jsxs(e.Fragment,{children:[e.jsx(L,{size:"sm",variant:"soft",color:"blue",children:"Clear filters"}),e.jsx(L,{size:"sm",variant:"ghost",color:"slate",children:"Browse all"})]})})}),we=`import { Button, EmptyState } from "@cjlapao/ui-kit";

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
`,ze=["xs","sm","md","lg","xl"],Ee=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:ze.map(a=>e.jsx(i,{size:a,icon:"Add",title:`Size ${a.toUpperCase()}`,subtitle:"Icon, type and the action button move together.",actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),Ne=`import { EmptyState } from "@cjlapao/ui-kit";
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
`,Te=()=>e.jsx("div",{className:"grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3",children:re.map(a=>e.jsx(i,{variant:a,tone:"blue",size:"xs",icon:"Add",title:a,actionLabel:"Create",onAction:()=>{},fullWidth:!0},a))}),ke=`import { EMPTY_STATE_VARIANTS, EmptyState } from "@cjlapao/ui-kit";

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
`,Pe=()=>e.jsxs("div",{className:"grid w-full gap-4 md:grid-cols-2",children:[e.jsx("div",{className:"rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950",children:e.jsx(x,{variant:"liquid-glass",tone:"blue",padding:"md",children:e.jsx(i,{variant:"glass",tone:"blue",size:"sm",icon:"CloudOff",title:"Connection lost",subtitle:"The cluster is unreachable. Check the network and try again.",actionLabel:"Reconnect",onAction:()=>{},vibrancy:"high",specularMode:"classic",fullWidth:!0})})}),e.jsx(x,{variant:"outlined",tone:"neutral",padding:"md",children:e.jsx(i,{variant:"plain",tone:"emerald",size:"sm",icon:"Container",title:"No containers yet",subtitle:"This panel owns the surface — the empty state draws no card of its own.",actionLabel:"Pull image",actionColor:"emerald",onAction:()=>{},fullWidth:!0})})]}),Ie=`import { EmptyState, Panel } from "@cjlapao/ui-kit";

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
`,_e=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ce,{name:"Empty State",description:"The placeholder shown when there is nothing to display. It renders a Panel, so it inherits every surface variant, tone, corner and padding — plus a dashed rule for a slot waiting to be filled."}),e.jsx(ye,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(r,{title:"No results",description:"The canonical search state, with a custom footer of two buttons in place of the generated action.",code:we,filename:"NoResults.tsx",children:e.jsx(Ae,{})}),e.jsx(r,{title:"Size ladder",description:"One size prop drives the icon, the type scale, the gaps and the action button — everything moves together.",code:Ne,filename:"SizeLadder.tsx",children:e.jsx(Ee,{})}),e.jsx(r,{title:"Variant gallery",description:"Every surface treatment at once, plus plain — no card at all, for a panel the app already owns.",code:ke,filename:"VariantGallery.tsx",children:e.jsx(Te,{})}),e.jsx(r,{title:"Glass and plain",description:"The glass variant on a glass panel over a gradient, and plain sitting inside an outlined panel.",code:Ie,filename:"GlassAndPlain.tsx",children:e.jsx(Pe,{})})]})]});export{_e as EmptyStatePage,_e as default};
