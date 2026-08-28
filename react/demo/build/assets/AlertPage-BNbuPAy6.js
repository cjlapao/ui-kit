import{r as n,j as e,P as X,bd as r,e as d,M as a,I as Z,t as J,af as K,ag as Q}from"./index-8i9ZNynb.js";import{P as ee}from"./PageHeader-CO5k_SQv.js";import{E as c}from"./ExampleCard-LdxcpmX_.js";import{P as te,C as i,S as h,T as l}from"./PlaygroundPanel-Dv9BQ1Hr.js";import{C as ne}from"./ControlAccordion-Bqp-1oBj.js";import{aX as se,aY as ie,n as oe,p as ae,aZ as le,a_ as re,t as ce,j as de,k as ue,l as pe}from"./options-yAU-f7tt.js";const he="rounded-md",xe="Rollout is held at 12% of traffic. The error budget for this window is spent, so the next attempt needs either a fix or an explicit override from someone on the release rota. Nothing is being served from the new build.",me=["glass","liquid-glass"],fe=()=>{const[s,u]=n.useState("danger"),[x,R]=n.useState("subtle"),[b,B]=n.useState("md"),[A,E]=n.useState(he),[w,D]=n.useState(!0),[m,V]=n.useState("auto"),[S,L]=n.useState("top"),[p,_]=n.useState(!1),[f,W]=n.useState("violet"),[N,G]=n.useState("Deployment paused"),[g,P]=n.useState("We paused the rollout while we investigate a spike in error rates."),[y,F]=n.useState(!1),[o,M]=n.useState(!1),[C,Y]=n.useState(!1),[j,$]=n.useState(!1),[O,v]=n.useState(!0),[T,q]=n.useState("classic"),[z,U]=n.useState("medium"),[I,H]=n.useState("frosted"),k=me.includes(x);return e.jsx(te,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(ne,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Intent",children:e.jsx(a,{fullWidth:!0,size:"sm",options:se,value:s,onChange:t=>u(t)})}),e.jsx(h,{label:"Variant",options:ie,value:x,onChange:t=>R(t)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Size",children:e.jsx(a,{fullWidth:!0,size:"sm",options:oe,value:b,onChange:t=>B(t)})}),e.jsx(h,{label:"Corner",options:ae,value:A,onChange:t=>E(t)})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(h,{label:"Icon size",options:le,value:m,onChange:t=>V(t)}),e.jsx(i,{label:"Icon alignment",children:e.jsx(a,{fullWidth:!0,size:"sm",options:re,value:S,onChange:t=>L(t)})})]})]})},{id:"tone",title:"Tone",controls:e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"grid grid-cols-1 gap-2",children:e.jsx(l,{label:"Override the intent's tone",checked:p,onChange:_})}),p&&e.jsx(h,{label:"Colour",options:ce,value:f,onChange:t=>W(t)})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Title",children:e.jsx(Z,{size:"sm",value:N,onChange:t=>G(t.target.value)})}),e.jsx(i,{label:"Description",children:e.jsx(J,{size:"sm",rows:3,value:g,onChange:t=>P(t.target.value)})})]})},{id:"states",title:"States",controls:e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Icon",checked:w,onChange:D}),e.jsx(l,{label:"Dismissible",checked:o,onChange:t=>{M(t),v(!0)}}),e.jsx(l,{label:"Long body",checked:y,onChange:F}),e.jsx(l,{label:"Actions",checked:C,onChange:Y}),e.jsx(l,{label:"On a glass panel",checked:j,onChange:$})]}),o&&!O&&e.jsx(d,{size:"xs",variant:"outline",color:"blue",onClick:()=>v(!0),children:"Reset the alert"})]})},...k?[{id:"glass",title:"Glass",controls:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Specular",children:e.jsx(a,{fullWidth:!0,size:"sm",options:de,value:T,onChange:t=>q(t)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ue,value:z,onChange:t=>U(t)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(a,{fullWidth:!0,size:"sm",options:pe,value:I,onChange:t=>H(t)})})]})}]:[]]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Intent"})," is the semantic axis — it chooses the tone, the default icon and whether the callout is announced"," ",e.jsx("code",{children:"assertive"})," (interrupting the reader, for a failure) or"," ",e.jsx("code",{children:"polite"}),". Turn on the override to reach the full 21-colour scale instead."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(X,{variant:j?"liquid-glass":"outlined",tone:j?p?f:"blue":"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{intent:s,variant:x,size:b,corner:A,iconAlign:S,iconSize:m==="auto"?void 0:m,color:p?f:void 0,glassOpacity:I,vibrancy:z,specularMode:k?T:"none",title:N||void 0,description:y?`${g} ${xe}`:g||void 0,icon:w?void 0:!1,dismissible:o,open:o?O:void 0,onDismiss:o?()=>v(!1):void 0,actions:C?e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(d,{size:"xs",variant:"soft",color:"blue",children:"Resume rollout"}),e.jsx(d,{size:"xs",variant:"ghost",color:"slate",children:"Snooze"})]}):void 0}),o&&e.jsx("span",{className:"text-xs opacity-60",children:"Dismiss it — it hides itself with no state on your side."})]})})})})};function ge(){return e.jsx("div",{className:"flex w-full flex-col gap-2",children:K.map(s=>e.jsx(r,{intent:s,size:"sm",title:s.charAt(0).toUpperCase()+s.slice(1),description:"Each intent picks its own tone, icon and announcement politeness."},s))})}const je=`import { ALERT_INTENTS, Alert } from "@cjlapao/ui-kit";

export default function Intents() {
  return (
    <div className="flex w-full flex-col gap-2">
      {ALERT_INTENTS.map((intent) => (
        <Alert
          key={intent}
          intent={intent}
          size="sm"
          title={intent.charAt(0).toUpperCase() + intent.slice(1)}
          description="Each intent picks its own tone, icon and announcement politeness."
        />
      ))}
    </div>
  );
}
`;function ve(){return e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-2",children:Q.map(s=>e.jsx(r,{variant:s,intent:"info",size:"sm",title:s,description:"Same message, five surfaces."},s))})}const be=`import { ALERT_VARIANTS, Alert } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="grid w-full gap-2 md:grid-cols-2">
      {ALERT_VARIANTS.map((variant) => (
        <Alert
          key={variant}
          variant={variant}
          intent="info"
          size="sm"
          title={variant}
          description="Same message, five surfaces."
        />
      ))}
    </div>
  );
}
`,Ae="Rollout is held at 12% of traffic. The error budget for this window is spent, so the next attempt needs either a fix or an explicit override from someone on the release rota. Nothing is being served from the new build.";function we(){return e.jsx("div",{className:"flex flex-col gap-3",children:["top","center","bottom"].map(s=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(r,{intent:"warning",size:"lg",iconAlign:s,title:`Icon aligned to the ${s}`,description:Ae}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:s})]},s))})}const Se=`import { Alert } from "@cjlapao/ui-kit";

const LONG_BODY =
  "Rollout is held at 12% of traffic. The error budget for this window is " +
  "spent, so the next attempt needs either a fix or an explicit override from " +
  "someone on the release rota. Nothing is being served from the new build.";

export default function IconAlignment() {
  return (
    <div className="flex flex-col gap-3">
      {(["top", "center", "bottom"] as const).map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Alert
            intent="warning"
            size="lg"
            iconAlign={each}
            title={\`Icon aligned to the \${each}\`}
            description={LONG_BODY}
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
`;function Ne(){return e.jsxs(r,{intent:"info",children:["A callout with no title at all. This copy comes through"," ",e.jsx("code",{children:"children"}),", which the component used to accept and drop on the floor."]})}const ye=`import { Alert } from "@cjlapao/ui-kit";

export default function BodyOnly() {
  return (
    <Alert intent="info">
      A callout with no title at all. This copy comes through{" "}
      <code>children</code>, which the component used to accept and drop on
      the floor.
    </Alert>
  );
}
`;function Ce(){const[s,u]=n.useState(!0);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-3",children:[e.jsx(r,{intent:"danger",variant:"subtle",title:"Deployment failed",description:"Build 482 exited with a non-zero status.",dismissible:!0,open:s,onDismiss:()=>u(!1),actions:e.jsx(d,{size:"xs",variant:"solid",color:"blue",children:"View logs"})}),!s&&e.jsx(d,{size:"xs",variant:"outline",color:"blue",onClick:()=>u(!0),children:"Show alert again"})]})}const Oe=`import { useState } from "react";
import { Alert, Button } from "@cjlapao/ui-kit";

export default function WithActions() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <Alert
        intent="danger"
        variant="subtle"
        title="Deployment failed"
        description="Build 482 exited with a non-zero status."
        dismissible
        open={open}
        onDismiss={() => setOpen(false)}
        actions={
          <Button size="xs" variant="solid" color="blue">
            View logs
          </Button>
        }
      />
      {!open && (
        <Button
          size="xs"
          variant="outline"
          color="blue"
          onClick={() => setOpen(true)}
        >
          Show alert again
        </Button>
      )}
    </div>
  );
}
`,Ee=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ee,{name:"Alert",description:"Semantic callouts for things that need attention. The intent decides tone, icon and screen-reader politeness; the variant decides surface; the icon can sit at the top, the middle or the bottom; actions put the fix next to the problem."}),e.jsx(fe,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Intents",description:"info, success, warning, danger and neutral — each with its own tone and default icon.",code:je,filename:"Intents.tsx",children:e.jsx(ge,{})}),e.jsx(c,{title:"Variants",description:"subtle, solid, outline, glass and liquid-glass, from a quiet note to a floating overlay.",code:be,filename:"Variants.tsx",children:e.jsx(ve,{})}),e.jsx(c,{title:"Icon alignment",description:"The glyph sits at the top of the copy, dead-centre, or on the baseline — it only reads on a long body.",code:Se,filename:"IconAlignment.tsx",children:e.jsx(we,{})}),e.jsx(c,{title:"Body only",description:"No title — the content comes through children.",code:ye,filename:"BodyOnly.tsx",children:e.jsx(Ne,{})}),e.jsx(c,{title:"With actions",description:"A dismissible alert that also offers the next step. Dismiss it, then bring it back.",code:Oe,filename:"WithActions.tsx",children:e.jsx(Ce,{})})]})]});export{Ee as AlertPage,Ee as default};
