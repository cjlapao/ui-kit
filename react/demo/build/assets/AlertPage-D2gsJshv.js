import{r as n,j as e,P as J,aA as r,e as d,M as a,I as K,s as Q,a4 as X,a5 as Z}from"./index-BqiwG-pR.js";import{P as ee,C as i,S as p,T as l,a as te,E as c}from"./PlaygroundPanel-DuiPtEP5.js";import{a2 as ne,a3 as se,n as ie,p as oe,a4 as ae,a5 as le,t as re,i as ce,j as de,k as ue}from"./options-CD99P1yv.js";const he="rounded-md",pe="Rollout is held at 12% of traffic. The error budget for this window is spent, so the next attempt needs either a fix or an explicit override from someone on the release rota. Nothing is being served from the new build.",xe=["glass","liquid-glass"],me=()=>{const[s,u]=n.useState("danger"),[x,R]=n.useState("subtle"),[b,B]=n.useState("md"),[A,E]=n.useState(he),[w,D]=n.useState(!0),[m,V]=n.useState("auto"),[S,L]=n.useState("top"),[h,W]=n.useState(!1),[f,_]=n.useState("violet"),[N,G]=n.useState("Deployment paused"),[g,P]=n.useState("We paused the rollout while we investigate a spike in error rates."),[y,M]=n.useState(!1),[o,$]=n.useState(!1),[C,q]=n.useState(!1),[j,Y]=n.useState(!1),[O,v]=n.useState(!0),[z,U]=n.useState("classic"),[T,F]=n.useState("medium"),[I,H]=n.useState("frosted"),k=xe.includes(x);return e.jsx(ee,{controls:e.jsxs(e.Fragment,{children:[e.jsx(i,{label:"Intent",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ne,value:s,onChange:t=>u(t)})}),e.jsx(p,{label:"Variant",options:se,value:x,onChange:t=>R(t)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(i,{label:"Size",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ie,value:b,onChange:t=>B(t)})}),e.jsx(p,{label:"Corner",options:oe,value:A,onChange:t=>E(t)})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(p,{label:"Icon size",options:ae,value:m,onChange:t=>V(t)}),e.jsx(i,{label:"Icon alignment",children:e.jsx(a,{fullWidth:!0,size:"sm",options:le,value:S,onChange:t=>L(t)})})]}),e.jsx("div",{className:"grid grid-cols-1 gap-2",children:e.jsx(l,{label:"Override the intent's tone",checked:h,onChange:W})}),h&&e.jsx(p,{label:"Colour",options:re,value:f,onChange:t=>_(t)}),e.jsx(i,{label:"Title",children:e.jsx(K,{size:"sm",value:N,onChange:t=>G(t.target.value)})}),e.jsx(i,{label:"Description",children:e.jsx(Q,{size:"sm",rows:3,value:g,onChange:t=>P(t.target.value)})}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Icon",checked:w,onChange:D}),e.jsx(l,{label:"Dismissible",checked:o,onChange:t=>{$(t),v(!0)}}),e.jsx(l,{label:"Long body",checked:y,onChange:M}),e.jsx(l,{label:"Actions",checked:C,onChange:q}),e.jsx(l,{label:"On a glass panel",checked:j,onChange:Y})]}),o&&!O&&e.jsx(d,{size:"xs",variant:"outline",color:"blue",onClick:()=>v(!0),children:"Reset the alert"}),k&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(i,{label:"Specular",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ce,value:z,onChange:t=>U(t)})}),e.jsx(i,{label:"Vibrancy",children:e.jsx(a,{fullWidth:!0,size:"sm",options:de,value:T,onChange:t=>F(t)})}),e.jsx(i,{label:"Glass opacity",children:e.jsx(a,{fullWidth:!0,size:"sm",options:ue,value:I,onChange:t=>H(t)})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:[e.jsx("strong",{children:"Intent"})," is the semantic axis — it chooses the tone, the default icon and whether the callout is announced"," ",e.jsx("code",{children:"assertive"})," (interrupting the reader, for a failure) or"," ",e.jsx("code",{children:"polite"}),". Turn on the override to reach the full 21-colour scale instead."]})]}),preview:e.jsx("div",{className:"w-full",children:e.jsx(J,{variant:j?"liquid-glass":"outlined",tone:j?h?f:"blue":"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{intent:s,variant:x,size:b,corner:A,iconAlign:S,iconSize:m==="auto"?void 0:m,color:h?f:void 0,glassOpacity:I,vibrancy:T,specularMode:k?z:"none",title:N||void 0,description:y?`${g} ${pe}`:g||void 0,icon:w?void 0:!1,dismissible:o,open:o?O:void 0,onDismiss:o?()=>v(!1):void 0,actions:C?e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(d,{size:"xs",variant:"soft",color:"blue",children:"Resume rollout"}),e.jsx(d,{size:"xs",variant:"ghost",color:"slate",children:"Snooze"})]}):void 0}),o&&e.jsx("span",{className:"text-xs opacity-60",children:"Dismiss it — it hides itself with no state on your side."})]})})})})};function fe(){return e.jsx("div",{className:"flex w-full flex-col gap-2",children:X.map(s=>e.jsx(r,{intent:s,size:"sm",title:s.charAt(0).toUpperCase()+s.slice(1),description:"Each intent picks its own tone, icon and announcement politeness."},s))})}const ge=`import { ALERT_INTENTS, Alert } from "@cjlapao/ui-kit";

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
`;function je(){return e.jsx("div",{className:"grid w-full gap-2 md:grid-cols-2",children:Z.map(s=>e.jsx(r,{variant:s,intent:"info",size:"sm",title:s,description:"Same message, five surfaces."},s))})}const ve=`import { ALERT_VARIANTS, Alert } from "@cjlapao/ui-kit";

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
`,be="Rollout is held at 12% of traffic. The error budget for this window is spent, so the next attempt needs either a fix or an explicit override from someone on the release rota. Nothing is being served from the new build.";function Ae(){return e.jsx("div",{className:"flex flex-col gap-3",children:["top","center","bottom"].map(s=>e.jsxs("div",{className:"flex flex-col gap-1.5",children:[e.jsx(r,{intent:"warning",size:"lg",iconAlign:s,title:`Icon aligned to the ${s}`,description:be}),e.jsx("span",{className:"text-[10px] uppercase tracking-wide opacity-60",children:s})]},s))})}const we=`import { Alert } from "@cjlapao/ui-kit";

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
`;function Se(){return e.jsxs(r,{intent:"info",children:["A callout with no title at all. This copy comes through"," ",e.jsx("code",{children:"children"}),", which the component used to accept and drop on the floor."]})}const Ne=`import { Alert } from "@cjlapao/ui-kit";

export default function BodyOnly() {
  return (
    <Alert intent="info">
      A callout with no title at all. This copy comes through{" "}
      <code>children</code>, which the component used to accept and drop on
      the floor.
    </Alert>
  );
}
`;function ye(){const[s,u]=n.useState(!0);return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-3",children:[e.jsx(r,{intent:"danger",variant:"subtle",title:"Deployment failed",description:"Build 482 exited with a non-zero status.",dismissible:!0,open:s,onDismiss:()=>u(!1),actions:e.jsx(d,{size:"xs",variant:"solid",color:"blue",children:"View logs"})}),!s&&e.jsx(d,{size:"xs",variant:"outline",color:"blue",onClick:()=>u(!0),children:"Show alert again"})]})}const Ce=`import { useState } from "react";
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
`,Ie=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(te,{name:"Alert",description:"Semantic callouts for things that need attention. The intent decides tone, icon and screen-reader politeness; the variant decides surface; the icon can sit at the top, the middle or the bottom; actions put the fix next to the problem."}),e.jsx(me,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Intents",description:"info, success, warning, danger and neutral — each with its own tone and default icon.",code:ge,filename:"Intents.tsx",children:e.jsx(fe,{})}),e.jsx(c,{title:"Variants",description:"subtle, solid, outline, glass and liquid-glass, from a quiet note to a floating overlay.",code:ve,filename:"Variants.tsx",children:e.jsx(je,{})}),e.jsx(c,{title:"Icon alignment",description:"The glyph sits at the top of the copy, dead-centre, or on the baseline — it only reads on a long body.",code:we,filename:"IconAlignment.tsx",children:e.jsx(Ae,{})}),e.jsx(c,{title:"Body only",description:"No title — the content comes through children.",code:Ne,filename:"BodyOnly.tsx",children:e.jsx(Se,{})}),e.jsx(c,{title:"With actions",description:"A dismissible alert that also offers the next step. Dismiss it, then bring it back.",code:Ce,filename:"WithActions.tsx",children:e.jsx(ye,{})})]})]});export{Ie as AlertPage,Ie as default};
