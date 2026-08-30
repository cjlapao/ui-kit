import{j as t,bW as c,bX as d,r as o,P as X,e as i,M as P,I as Z,t as tt,bY as l,ai as et,bZ as E,af as R,aj as nt}from"./index-p9Bv1Pn1.js";import{P as st}from"./PageHeader-DCZtzAyX.js";import{E as u}from"./ExampleCard-BS13YSEO.js";import{P as ot,C as v,S as h,T as x}from"./PlaygroundPanel-BDClNSzf.js";import{C as at}from"./ControlAccordion-CydkdljU.js";import{aX as it,aY as rt,n as lt,bq as ct,br as dt,t as ut}from"./options-Bqu3_N-h.js";const pt=[{label:"5 s (default)",value:"5000"},{label:"2 s",value:"2000"},{label:"10 s",value:"10000"},{label:"Sticky",value:"0"}],I="toast-playground",ht=()=>t.jsx(c,{children:t.jsx(xt,{})}),xt=()=>{const{toast:e}=d(),[n,s]=o.useState("success"),[p,r]=o.useState("glass"),[T,z]=o.useState("md"),[m,O]=o.useState("bottom-right"),[f,V]=o.useState("stacked"),[k,L]=o.useState(!1),[j,$]=o.useState("emerald"),[g,_]=o.useState("5000"),[b,G]=o.useState(!0),[C,M]=o.useState(!1),[N,F]=o.useState(!1),[S,D]=o.useState(!1),[A,q]=o.useState("Build 482 shipped"),[B,W]=o.useState("All 12 services are healthy."),U=()=>{const a=e.show({group:I,intent:n,variant:p,size:T,color:k?j:void 0,title:A||void 0,detail:B||void 0,closable:b,loading:N,progress:C?62:void 0,actions:S?[{label:"Acknowledge",onClick:()=>e.close(a)}]:void 0,life:g==="0"?void 0:Number(g),sticky:g==="0"});(m!==w||f!==y)&&(J(m),K(f),H(Q=>Q+1))},[Y,H]=o.useState(0),[w,J]=o.useState(m),[y,K]=o.useState(f);return t.jsxs(t.Fragment,{children:[t.jsx(ot,{controls:t.jsxs("div",{className:"space-y-3",children:[t.jsx(at,{groups:[{id:"core",title:"Core",controls:t.jsxs(t.Fragment,{children:[t.jsx(v,{label:"Intent",children:t.jsx(P,{fullWidth:!0,size:"sm",options:it,value:n,onChange:a=>s(a)})}),t.jsx(h,{label:"Variant",options:rt,value:p,onChange:a=>r(a)}),t.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[t.jsx(v,{label:"Size",children:t.jsx(P,{fullWidth:!0,size:"sm",options:lt,value:T,onChange:a=>z(a)})}),t.jsx(h,{label:"Mode",options:ct,value:f,onChange:a=>V(a)})]}),t.jsx(h,{label:"Position",options:dt,value:m,onChange:a=>O(a)})]})},{id:"tone",title:"Tone",controls:t.jsxs(t.Fragment,{children:[t.jsx(x,{label:"Override the intent's tone",checked:k,onChange:L}),k&&t.jsx(h,{label:"Colour",options:ut,value:j,onChange:a=>$(a)})]})},{id:"behavior",title:"Behavior",controls:t.jsxs(t.Fragment,{children:[t.jsx(h,{label:"Auto-dismiss",options:pt,value:g,onChange:_}),t.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[t.jsx(x,{label:"Closable",checked:b,onChange:G}),t.jsx(x,{label:"Progress",checked:C,onChange:M}),t.jsx(x,{label:"Loading",checked:N,onChange:F}),t.jsx(x,{label:"Actions",checked:S,onChange:D})]})]})},{id:"content",title:"Content",controls:t.jsxs(t.Fragment,{children:[t.jsx(v,{label:"Title",children:t.jsx(Z,{size:"sm",value:A,onChange:a=>q(a.target.value)})}),t.jsx(v,{label:"Detail",children:t.jsx(tt,{size:"sm",rows:3,value:B,onChange:a=>W(a.target.value)})})]})}]}),t.jsxs("p",{className:"text-xs opacity-70",children:["The toast lands in ",t.jsx("strong",{children:w})," as"," ",t.jsx("strong",{children:y})," — pick a new corner, then raise again. Fire a few to watch the deck stack; hover it to fan out."]})]}),preview:t.jsx("div",{className:"flex h-full w-full items-start justify-center p-4",children:t.jsx(X,{variant:"outlined",tone:"neutral",padding:"md",children:t.jsxs("div",{className:"flex flex-col items-start gap-3",children:[t.jsx(i,{variant:"solid",color:"blue",onClick:U,children:"Show toast"}),t.jsx("span",{className:"text-xs opacity-60",children:"It appears in the corner of the page, not here — toasts are fixed-position and escape the page content on purpose."})]})})})}),t.jsx(l,{group:I,position:w,mode:y},`vp-${Y}-${w}`)]})};function mt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-basic",position:"bottom-right"}),t.jsx(ft,{})]})}function ft(){const{toast:e}=d();return t.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[t.jsx(i,{variant:"solid",color:"blue",onClick:()=>e.success("Deployment complete","All 12 services are healthy."),children:"Show a toast"}),t.jsx("p",{className:"text-xs opacity-60",children:"It appears in the corner, stays there for five seconds and slides itself away — nothing to track on your side."})]})}const gt=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * The minimal form: one provider, one viewport, one hook call. The toast
 * lands in the page corner and takes care of its own lifetime.
 */
export default function Basic() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-basic" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button
        variant="solid"
        color="blue"
        onClick={() =>
          toast.success("Deployment complete", "All 12 services are healthy.")
        }
      >
        Show a toast
      </Button>
      <p className="text-xs opacity-60">
        It appears in the corner, stays there for five seconds and slides
        itself away — nothing to track on your side.
      </p>
    </div>
  );
}
`;function wt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-severities",position:"bottom-right"}),t.jsx(vt,{})]})}function vt(){const{toast:e}=d();return t.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[t.jsx("div",{className:"flex flex-wrap gap-2",children:et.map(n=>t.jsx(i,{size:"sm",variant:"soft",color:E[n].tone,onClick:()=>e.show({intent:n,title:n.charAt(0).toUpperCase()+n.slice(1),detail:`announced ${E[n].live}`}),children:n},n))}),t.jsxs("p",{className:"text-xs opacity-60",children:["danger and warning are ",t.jsx("code",{children:"assertive"})," (role alert — they interrupt the reader); info, success and neutral are ",t.jsx("code",{children:"polite"})," ","(role status)."]})]})}const kt=`import {
  ALERT_INTENT_CONFIG,
  ALERT_INTENTS,
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
} from "@cjlapao/ui-kit";

/**
 * The same intent scale as Alert: the intent picks the tone, the icon and
 * whether the screen reader interrupts or politely queues the message.
 */
export default function Severities() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-severities" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {ALERT_INTENTS.map((intent) => (
          <Button
            key={intent}
            size="sm"
            variant="soft"
            color={ALERT_INTENT_CONFIG[intent].tone}
            onClick={() =>
              toast.show({
                intent,
                title: intent.charAt(0).toUpperCase() + intent.slice(1),
                detail: \`announced \${ALERT_INTENT_CONFIG[intent].live}\`,
              })
            }
          >
            {intent}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        danger and warning are <code>assertive</code> (role alert — they
        interrupt the reader); info, success and neutral are <code>polite</code>{" "}
        (role status).
      </p>
    </div>
  );
}
`;function yt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-stacked",position:"bottom-left",mode:"stacked"}),t.jsx(l,{group:"ex-toast-expanded",position:"bottom-right",mode:"expanded"}),t.jsx(Tt,{})]})}function Tt(){const{toast:e}=d(),n=s=>{e.show({group:s,intent:"info",title:"Job queued"}),e.show({group:s,intent:"success",title:"Queue accepted"}),e.show({group:s,intent:"warning",title:"Slow worker detected"}),e.show({group:s,intent:"danger",title:"Worker timeout"})};return t.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[t.jsxs("div",{className:"flex flex-wrap gap-2",children:[t.jsx(i,{size:"sm",variant:"soft",color:"blue",onClick:()=>n("ex-toast-stacked"),children:"Stack toasts (bottom left)"}),t.jsx(i,{size:"sm",variant:"soft",color:"violet",onClick:()=>n("ex-toast-expanded"),children:"Expand toasts (bottom right)"})]}),t.jsx("p",{className:"text-xs opacity-60",children:'Left: the deck folds back down when the pointer leaves. Right: the same deck, but `mode="expanded"` keeps every card at full height. The deck only shows the three newest — older ones stay hidden until the cards in front of them leave.'})]})}const jt=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * The signature behaviour: in \`stacked\` mode newer toasts pile up as a deck —
 * each card clipped to the front card's height, offset and scaled back. Hover
 * (or focus, or press) the deck and it fans out to full height. \`expanded\`
 * mode keeps the fan-out permanent.
 */
export default function StackedAndExpanded() {
  return (
    <ToastProvider>
      <ToastViewport
        group="ex-toast-stacked"
        position="bottom-left"
        mode="stacked"
      />
      <ToastViewport
        group="ex-toast-expanded"
        position="bottom-right"
        mode="expanded"
      />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const raise = (group: string) => {
    toast.show({ group, intent: "info", title: "Job queued" });
    toast.show({ group, intent: "success", title: "Queue accepted" });
    toast.show({ group, intent: "warning", title: "Slow worker detected" });
    toast.show({ group, intent: "danger", title: "Worker timeout" });
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="soft"
          color="blue"
          onClick={() => raise("ex-toast-stacked")}
        >
          Stack toasts (bottom left)
        </Button>
        <Button
          size="sm"
          variant="soft"
          color="violet"
          onClick={() => raise("ex-toast-expanded")}
        >
          Expand toasts (bottom right)
        </Button>
      </div>
      <p className="text-xs opacity-60">
        Left: the deck folds back down when the pointer leaves. Right: the
        same deck, but \`mode="expanded"\` keeps every card at full height. The
        deck only shows the three newest — older ones stay hidden until the
        cards in front of them leave.
      </p>
    </div>
  );
}
`;function bt(){return t.jsxs(c,{children:[R.map(e=>t.jsx(l,{group:`ex-toast-pos-${e}`,position:e},e)),t.jsx(Ct,{})]})}function Ct(){const{toast:e}=d(),n=s=>{e.show({group:`ex-toast-pos-${s}`,intent:"neutral",title:s,detail:"this toast owns its corner",life:6e3})};return t.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[t.jsx("div",{className:"flex flex-wrap gap-2",children:R.map(s=>t.jsx(i,{size:"sm",variant:"outline",color:"blue",onClick:()=>n(s),children:s},s))}),t.jsx("p",{className:"text-xs opacity-60",children:"Two rem from every edge, exactly like the PrimeVue reference — the cards always slide in from the edge they sit on."})]})}const Nt=`import {
  Button,
  ToastProvider,
  ToastViewport,
  TOAST_POSITIONS,
  useToast,
  type ToastPosition,
} from "@cjlapao/ui-kit";

/**
 * All seven anchor points. Each position owns its own viewport here so the
 * corners stay independent — one viewport per position is the normal shape.
 */
export default function EveryPosition() {
  return (
    <ToastProvider>
      {TOAST_POSITIONS.map((position) => (
        <ToastViewport
          key={position}
          group={\`ex-toast-pos-\${position}\`}
          position={position}
        />
      ))}
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const showAt = (position: ToastPosition) => {
    toast.show({
      group: \`ex-toast-pos-\${position}\`,
      intent: "neutral",
      title: position,
      detail: "this toast owns its corner",
      life: 6000,
    });
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {TOAST_POSITIONS.map((position) => (
          <Button
            key={position}
            size="sm"
            variant="outline"
            color="blue"
            onClick={() => showAt(position)}
          >
            {position}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        Two rem from every edge, exactly like the PrimeVue reference — the
        cards always slide in from the edge they sit on.
      </p>
    </div>
  );
}
`;function St(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-progress",position:"bottom-right"}),t.jsx(At,{})]})}function At(){const{toast:e}=d(),n=o.useRef(null),s=()=>{const p=e.show({intent:"info",title:"Downloading build",detail:"0%",loading:!0,progress:0,sticky:!0});let r=0;n.current=window.setInterval(()=>{if(r=Math.min(100,r+Math.ceil(Math.random()*18)),r<100){e.update(p,{progress:r,detail:`${r}%`});return}n.current!==null&&window.clearInterval(n.current),e.update(p,{intent:"success",title:"Download complete",detail:"build-482.tar.zst",loading:!1,progress:100,life:4e3})},500)};return t.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[t.jsx(i,{variant:"solid",color:"blue",onClick:s,children:"Start a download"}),t.jsx("p",{className:"text-xs opacity-60",children:"The card shows a spinner and a progress bar while it works, then the same card turns green when the work finishes."})]})}const Bt=`import { useRef } from "react";
import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * A live toast: \`loading\` swaps the icon for a spinner, \`progress\` renders a
 * labelled progress bar under the copy, and \`toast.update\` moves both — no
 * remount, the card (and its position in the deck) is preserved.
 */
export default function ProgressAndLoading() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-progress" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();
  const timer = useRef<number | null>(null);

  const start = () => {
    const id = toast.show({
      intent: "info",
      title: "Downloading build",
      detail: "0%",
      loading: true,
      progress: 0,
      sticky: true,
    });

    let value = 0;
    timer.current = window.setInterval(() => {
      value = Math.min(100, value + Math.ceil(Math.random() * 18));
      if (value < 100) {
        toast.update(id, { progress: value, detail: \`\${value}%\` });
        return;
      }
      if (timer.current !== null) window.clearInterval(timer.current);
      toast.update(id, {
        intent: "success",
        title: "Download complete",
        detail: "build-482.tar.zst",
        loading: false,
        progress: 100,
        life: 4000,
      });
    }, 500);
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button variant="solid" color="blue" onClick={start}>
        Start a download
      </Button>
      <p className="text-xs opacity-60">
        The card shows a spinner and a progress bar while it works, then the
        same card turns green when the work finishes.
      </p>
    </div>
  );
}
`;function Pt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-groups",position:"bottom-right"}),t.jsx(l,{position:"top-right"}),t.jsx(Et,{})]})}function Et(){const{toast:e}=d(),n=()=>{e.show({group:"downloads",intent:"info",title:"design-specs.fig",detail:"18 MB",life:8e3}),e.show({group:"downloads",intent:"info",title:"build-482.tar.zst",detail:"412 MB",life:8e3}),e.show({group:"downloads",intent:"warning",title:"assets.zip — slow",detail:"11%",life:8e3})};return t.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[t.jsxs("div",{className:"flex flex-wrap gap-2",children:[t.jsx(i,{size:"sm",variant:"soft",color:"blue",onClick:()=>e.neutral("Session note","Sticky — it stays until dismissed.",{sticky:!0}),children:"Sticky toast"}),t.jsx(i,{size:"sm",variant:"soft",color:"violet",onClick:n,children:"Three grouped downloads"}),t.jsx(i,{size:"sm",variant:"outline",color:"slate",onClick:()=>e.closeGroup("downloads"),children:"Clear the group"})]}),t.jsx("p",{className:"text-xs opacity-60",children:'The sticky toast has no timer; the grouped batch disappears together when `closeGroup("downloads")` fires.'})]})}const It=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

/**
 * \`sticky\` (or \`life: 0\`) opts a toast out of the auto-dismiss timer, and
 * \`group\` lets one action clear a whole batch — the classic "all downloads"
 * pattern.
 */
export default function StickyAndGroups() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-groups" position="bottom-right" />
      <ToastViewport position="top-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const raiseGroup = () => {
    toast.show({
      group: "downloads",
      intent: "info",
      title: "design-specs.fig",
      detail: "18 MB",
      life: 8000,
    });
    toast.show({
      group: "downloads",
      intent: "info",
      title: "build-482.tar.zst",
      detail: "412 MB",
      life: 8000,
    });
    toast.show({
      group: "downloads",
      intent: "warning",
      title: "assets.zip — slow",
      detail: "11%",
      life: 8000,
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="soft"
          color="blue"
          onClick={() =>
            toast.neutral("Session note", "Sticky — it stays until dismissed.", {
              sticky: true,
            })
          }
        >
          Sticky toast
        </Button>
        <Button size="sm" variant="soft" color="violet" onClick={raiseGroup}>
          Three grouped downloads
        </Button>
        <Button
          size="sm"
          variant="outline"
          color="slate"
          onClick={() => toast.closeGroup("downloads")}
        >
          Clear the group
        </Button>
      </div>
      <p className="text-xs opacity-60">
        The sticky toast has no timer; the grouped batch disappears together
        when \`closeGroup("downloads")\` fires.
      </p>
    </div>
  );
}
`;function Rt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-surfaces",position:"bottom-right"}),t.jsx(zt,{})]})}function zt(){const{toast:e}=d(),n=s=>{e.show({group:"ex-toast-surfaces",intent:"success",variant:s,title:"Payment captured",detail:"$42.00 — order #10492",life:8e3})};return t.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[t.jsx("div",{className:"flex flex-wrap gap-2",children:nt.map(s=>t.jsx(i,{size:"sm",variant:"soft",color:"emerald",onClick:()=>n(s),children:s},s))}),t.jsx("p",{className:"text-xs opacity-60",children:"Each button raises the same message on a different surface. Fire two quickly to see them stack — the deck geometry is identical across variants."})]})}const Ot=`import {
  ALERT_VARIANTS,
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
  type AlertVariant,
} from "@cjlapao/ui-kit";

/**
 * The same five surfaces as Alert — the same token table drives both, so a
 * toast never drifts from the callout language. The glass pair reads best
 * over a busy page.
 */
export default function Surfaces() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-surfaces" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();

  const show = (variant: AlertVariant) => {
    toast.show({
      group: "ex-toast-surfaces",
      intent: "success",
      variant,
      title: "Payment captured",
      detail: \`$42.00 — order #10492\`,
      life: 8000,
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {ALERT_VARIANTS.map((variant) => (
          <Button
            key={variant}
            size="sm"
            variant="soft"
            color="emerald"
            onClick={() => show(variant)}
          >
            {variant}
          </Button>
        ))}
      </div>
      <p className="text-xs opacity-60">
        Each button raises the same message on a different surface. Fire two
        quickly to see them stack — the deck geometry is identical across
        variants.
      </p>
    </div>
  );
}
`;function Vt(){return t.jsxs(c,{children:[t.jsx(l,{group:"ex-toast-actions",position:"bottom-right"}),t.jsx(Lt,{})]})}function Lt(){const{toast:e}=d(),[n,s]=o.useState(0),p=()=>{e.show({group:"ex-toast-actions",intent:"warning",title:"Sync stalled",detail:`Last retry ${n===0?"never":`#${n}`}`,icon:"Chat",life:1e4,onClick:()=>s(r=>r+1),actions:[{label:"Retry",onClick:()=>s(r=>r+1)},{label:"Dismiss",onClick:()=>e.closeGroup("ex-toast-actions")}]})};return t.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[t.jsx(i,{variant:"solid",color:"amber",onClick:p,children:"Raise a warning with actions"}),t.jsx("p",{className:"text-xs opacity-60",children:"The card body is clickable (it counts as a manual retry), the buttons are its own clicks, and the custom icon replaces the default warning glyph."})]})}const $t=`import { useState } from "react";
import {
  Button,
  ToastProvider,
  ToastViewport,
  useToast,
} from "@cjlapao/ui-kit";

/**
 * Toasts take the message as a first-class citizen: an \`onClick\` on the card
 * body, a row of action buttons, and a custom icon in place of the intent
 * glyph. Action clicks stop propagation, so a Retry does not also fire the
 * card's onClick.
 */
export default function ActionsAndCustom() {
  return (
    <ToastProvider>
      <ToastViewport group="ex-toast-actions" position="bottom-right" />
      <Body />
    </ToastProvider>
  );
}

function Body() {
  const { toast } = useToast();
  const [retries, setRetries] = useState(0);

  const show = () => {
    toast.show({
      group: "ex-toast-actions",
      intent: "warning",
      title: "Sync stalled",
      detail: \`Last retry \${retries === 0 ? "never" : \`#\${retries}\`}\`,
      icon: "Chat",
      life: 10000,
      onClick: () => setRetries((n) => n + 1),
      actions: [
        {
          label: "Retry",
          onClick: () => setRetries((n) => n + 1),
        },
        {
          label: "Dismiss",
          onClick: () => toast.closeGroup("ex-toast-actions"),
        },
      ],
    });
  };

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-2">
      <Button variant="solid" color="amber" onClick={show}>
        Raise a warning with actions
      </Button>
      <p className="text-xs opacity-60">
        The card body is clickable (it counts as a manual retry), the buttons
        are its own clicks, and the custom icon replaces the default warning
        glyph.
      </p>
    </div>
  );
}
`,Wt=()=>t.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[t.jsx(st,{name:"Toast",description:"Transient notifications with the kit's alert-family surface. A stack of glass cards pins to a page corner: the newest sits in front, the older ones peek out behind it as a deck — and on hover (or focus) the deck fans out to full height. Auto-dismiss timers pause while the deck is engaged, and every card can be swiped away."}),t.jsx(ht,{}),t.jsxs("section",{className:"flex flex-col gap-5",children:[t.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),t.jsx(u,{title:"Basic",description:"One provider, one viewport, one hook call — the toast takes care of its own lifetime.",code:gt,filename:"Basic.tsx",children:t.jsx(mt,{})}),t.jsx(u,{title:"Severities",description:"The shared alert-intent scale: the intent picks tone, icon and whether the announcement is polite or assertive.",code:kt,filename:"Severities.tsx",children:t.jsx(wt,{})}),t.jsx(u,{title:"Stacked and expanded",description:"The signature behaviour: a clipped deck that fans out on hover, and an expanded mode that keeps the fan-out permanent.",code:jt,filename:"StackedAndExpanded.tsx",children:t.jsx(yt,{})}),t.jsx(u,{title:"Every position",description:"All seven anchor points, two rem from every edge — cards slide in from the edge they sit on.",code:Nt,filename:"EveryPosition.tsx",children:t.jsx(bt,{})}),t.jsx(u,{title:"Progress and loading",description:"A live toast: a spinner and a progress bar while work runs, updated in place by toast.update, then the same card turns green.",code:Bt,filename:"ProgressAndLoading.tsx",children:t.jsx(St,{})}),t.jsx(u,{title:"Sticky and groups",description:"Sticky toasts opt out of the timer; a group tag lets one call clear a whole batch at once.",code:It,filename:"StickyAndGroups.tsx",children:t.jsx(Pt,{})}),t.jsx(u,{title:"Surfaces",description:"The same five Alert surfaces — subtle, solid, outline, glass and liquid-glass — driven by the same token table.",code:Ot,filename:"Surfaces.tsx",children:t.jsx(Rt,{})}),t.jsx(u,{title:"Actions and custom",description:"A clickable card body, an action row, and a custom icon — action clicks stop propagation.",code:$t,filename:"ActionsAndCustom.tsx",children:t.jsx(Vt,{})})]})]});export{Wt as ToastPage,Wt as default};
