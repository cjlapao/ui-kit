import{bZ as Y,b_ as G,r as l,j as e,b$ as Z,c0 as ee,P as te,f as x,M as J,I as ne,v as se,c1 as m,ad as oe,aa as Q,ae}from"./index-CASQDqc_.js";import{P as ie}from"./PageHeader-DxnWpf-v.js";import{E as T}from"./ExampleCard-D_CxWJdb.js";import{P as re,C as M,S as I,T as V}from"./PlaygroundPanel-B62eNAMn.js";import{C as le}from"./ControlAccordion-BafxVZvc.js";import{aX as ce,aY as de,n as ue,bq as pe,br as he,t as fe}from"./options-D2wLByKW.js";const xe=350,me=(n={})=>{const a=n.now??Date.now,s=n.schedule??((t,o)=>setTimeout(t,o)),u=n.unschedule??clearTimeout,p=n.exitMs??xe,C=n.warn??(t=>console.warn(t));let _=1,d=[],z={messages:[]},g=0,$=1,N=!1;const B=new Set,A=new Set,P=new Set,k=new Map,y=()=>{z={messages:[...d]};for(const t of B)t()},j=t=>d.find(o=>o.id===t),O=(t,o)=>t.group===o,b=t=>{const o=k.get(t);o!==void 0&&(u(o),k.delete(t))},E=t=>{if(t.removing||t.sticky||t.life<=0)return;b(t.id);const o=t.remaining??t.life;t.remaining=null,t.deadline=a()+o;const i=s(()=>{const r=j(t.id);r&&!r.removing&&r.deadline===t.deadline&&S(t.id,"life-end")},o);k.set(t.id,i)},L=t=>{if(t.removing||t.sticky||t.life<=0||t.deadline===null)return;const o=Math.max(0,t.deadline-a());b(t.id),t.deadline=null,t.remaining=o},F=t=>{if(!(t.removing||t.sticky||t.life<=0||t.remaining===null)){if(t.remaining<=0){S(t.id,"life-end");return}E(t)}},R=t=>{const o=t.intent??"neutral",i=G[o]??G.neutral,r=t.sticky?0:t.life??Y,h={id:_++,intent:o,title:t.title,detail:t.detail,variant:t.variant??"glass",color:t.color??i.tone,size:t.size??"md",icon:t.icon??i.icon,vibrancy:t.vibrancy??"medium",glassOpacity:t.glassOpacity??"frosted",specularMode:t.specularMode??"classic",life:r,sticky:!!t.sticky||r<=0,closable:t.closable??!0,progress:t.progress,loading:t.loading??!1,group:t.group,onClick:t.onClick,actions:t.actions,meta:t.meta,deadline:null,remaining:null};return d=[...d,h],E(h),g===0&&!N&&(N=!0,C("@cjlapao/ui-kit: a toast was raised but no <ToastViewport> is mounted. Add <ToastViewport /> inside <ToastProvider> or the message will not be visible.")),y(),h.id},S=(t,o="close")=>{const i=j(t);if(!i||i.removing)return;b(t),i.removing=!0,i.deadline=null,i.remaining=null,y();const r={...i,removing:!0};if(o==="life-end")for(const h of P)h(r);else for(const h of A)h(r);s(()=>{j(t)&&(d=d.filter(f=>f.id!==t),y())},p)};return{subscribe(t){return B.add(t),()=>B.delete(t)},getSnapshot:()=>z,show:R,update:(t,o)=>{const i=j(t);if(!i||i.removing)return;const r={...i};for(const f of Object.keys(o)){const c=o[f];c!==void 0&&(r[f]=c)}const h=(o.life!==void 0||o.sticky!==void 0)&&o.life!==i.life&&(o.sticky??!1)!==i.sticky;if(o.life!==void 0){const f=o.sticky?0:o.life;r.life=f,r.sticky=!!o.sticky||f<=0}o.sticky!==void 0&&o.life===void 0&&(r.sticky=!!o.sticky),(h||r.sticky!==i.sticky||r.life!==i.life)&&(b(t),r.deadline=null,r.remaining=null),d=d.map(f=>f.id===t?r:f),E(r),y()},close:S,closeGroup:t=>{for(const o of[...d])o.group===t&&S(o.id,"close")},clear:()=>{for(const t of[...d])S(t.id,"close")},onClose(t){return A.add(t),()=>A.delete(t)},onLifeEnd(t){return P.add(t),()=>P.delete(t)},pauseGroup:t=>{let o=!1;d=d.map(i=>{if(!O(i,t)||!i.deadline)return i;const r={...i};return L(r),o=!0,r}),o&&y()},resumeGroup:t=>{let o=!1;d=d.map(i=>{if(!O(i,t)||i.remaining===null)return i;const r={...i};return F(r),o=!0,r}),o&&y()},registerViewport(){return g+=1,$++},unregisterViewport(){g=Math.max(0,g-1)}}},w=({children:n,store:a})=>{const s=l.useMemo(()=>me(),[]),u=a??s;return e.jsx(Z.Provider,{value:u,children:n})},ge=n=>{const a=s=>(u,p,C)=>n.show({intent:s,title:u,detail:p,...C});return{show:s=>n.show(s),info:a("info"),success:a("success"),warning:a("warning"),danger:a("danger"),neutral:a("neutral"),update:(s,u)=>n.update(s,u),close:s=>n.close(s,"close"),closeGroup:s=>n.closeGroup(s),clear:()=>n.clear(),onClose:s=>n.onClose(s),onLifeEnd:s=>n.onLifeEnd(s)}},v=()=>{const n=ee();return{toast:l.useMemo(()=>ge(n),[n])}},we=[{label:"5 s (default)",value:"5000"},{label:"2 s",value:"2000"},{label:"10 s",value:"10000"},{label:"Sticky",value:"0"}],K="toast-playground",ve=()=>e.jsx(w,{children:e.jsx(ke,{})}),ke=()=>{const{toast:n}=v(),[a,s]=l.useState("success"),[u,p]=l.useState("glass"),[C,_]=l.useState("md"),[d,z]=l.useState("bottom-right"),[g,$]=l.useState("stacked"),[N,B]=l.useState(!1),[A,P]=l.useState("emerald"),[k,y]=l.useState("5000"),[j,O]=l.useState(!0),[b,E]=l.useState(!1),[L,F]=l.useState(!1),[R,S]=l.useState(!1),[D,W]=l.useState("Build 482 shipped"),[q,H]=l.useState("All 12 services are healthy."),U=()=>{const c=n.show({group:K,intent:a,variant:u,size:C,color:N?A:void 0,title:D||void 0,detail:q||void 0,closable:j,loading:L,progress:b?62:void 0,actions:R?[{label:"Acknowledge",onClick:()=>n.close(c)}]:void 0,life:k==="0"?void 0:Number(k),sticky:k==="0"});(d!==i||g!==h)&&(r(d),f(g),o(X=>X+1))},[t,o]=l.useState(0),[i,r]=l.useState(d),[h,f]=l.useState(g);return e.jsxs(e.Fragment,{children:[e.jsx(re,{controls:e.jsxs("div",{className:"space-y-3",children:[e.jsx(le,{groups:[{id:"core",title:"Core",controls:e.jsxs(e.Fragment,{children:[e.jsx(M,{label:"Intent",children:e.jsx(J,{fullWidth:!0,size:"sm",options:ce,value:a,onChange:c=>s(c)})}),e.jsx(I,{label:"Variant",options:de,value:u,onChange:c=>p(c)}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsx(M,{label:"Size",children:e.jsx(J,{fullWidth:!0,size:"sm",options:ue,value:C,onChange:c=>_(c)})}),e.jsx(I,{label:"Mode",options:pe,value:g,onChange:c=>$(c)})]}),e.jsx(I,{label:"Position",options:he,value:d,onChange:c=>z(c)})]})},{id:"tone",title:"Tone",controls:e.jsxs(e.Fragment,{children:[e.jsx(V,{label:"Override the intent's tone",checked:N,onChange:B}),N&&e.jsx(I,{label:"Colour",options:fe,value:A,onChange:c=>P(c)})]})},{id:"behavior",title:"Behavior",controls:e.jsxs(e.Fragment,{children:[e.jsx(I,{label:"Auto-dismiss",options:we,value:k,onChange:y}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(V,{label:"Closable",checked:j,onChange:O}),e.jsx(V,{label:"Progress",checked:b,onChange:E}),e.jsx(V,{label:"Loading",checked:L,onChange:F}),e.jsx(V,{label:"Actions",checked:R,onChange:S})]})]})},{id:"content",title:"Content",controls:e.jsxs(e.Fragment,{children:[e.jsx(M,{label:"Title",children:e.jsx(ne,{size:"sm",value:D,onChange:c=>W(c.target.value)})}),e.jsx(M,{label:"Detail",children:e.jsx(se,{size:"sm",rows:3,value:q,onChange:c=>H(c.target.value)})})]})}]}),e.jsxs("p",{className:"text-xs opacity-70",children:["The toast lands in ",e.jsx("strong",{children:i})," as"," ",e.jsx("strong",{children:h})," — pick a new corner, then raise again. Fire a few to watch the deck stack; hover it to fan out."]})]}),preview:e.jsx("div",{className:"flex h-full w-full items-start justify-center p-4",children:e.jsx(te,{variant:"outlined",tone:"neutral",padding:"md",children:e.jsxs("div",{className:"flex flex-col items-start gap-3",children:[e.jsx(x,{variant:"solid",color:"blue",onClick:U,children:"Show toast"}),e.jsx("span",{className:"text-xs opacity-60",children:"It appears in the corner of the page, not here — toasts are fixed-position and escape the page content on purpose."})]})})})}),e.jsx(m,{group:K,position:i,mode:h},`vp-${t}-${i}`)]})};function ye(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-basic",position:"bottom-right"}),e.jsx(Te,{})]})}function Te(){const{toast:n}=v();return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[e.jsx(x,{variant:"solid",color:"blue",onClick:()=>n.success("Deployment complete","All 12 services are healthy."),children:"Show a toast"}),e.jsx("p",{className:"text-xs opacity-60",children:"It appears in the corner, stays there for five seconds and slides itself away — nothing to track on your side."})]})}const je=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

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
`;function be(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-severities",position:"bottom-right"}),e.jsx(Se,{})]})}function Se(){const{toast:n}=v();return e.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[e.jsx("div",{className:"flex flex-wrap gap-2",children:oe.map(a=>e.jsx(x,{size:"sm",variant:"soft",color:G[a].tone,onClick:()=>n.show({intent:a,title:a.charAt(0).toUpperCase()+a.slice(1),detail:`announced ${G[a].live}`}),children:a},a))}),e.jsxs("p",{className:"text-xs opacity-60",children:["danger and warning are ",e.jsx("code",{children:"assertive"})," (role alert — they interrupt the reader); info, success and neutral are ",e.jsx("code",{children:"polite"})," ","(role status)."]})]})}const Ce=`import {
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
`;function Ne(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-stacked",position:"bottom-left",mode:"stacked"}),e.jsx(m,{group:"ex-toast-expanded",position:"bottom-right",mode:"expanded"}),e.jsx(Ae,{})]})}function Ae(){const{toast:n}=v(),a=s=>{n.show({group:s,intent:"info",title:"Job queued"}),n.show({group:s,intent:"success",title:"Queue accepted"}),n.show({group:s,intent:"warning",title:"Slow worker detected"}),n.show({group:s,intent:"danger",title:"Worker timeout"})};return e.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(x,{size:"sm",variant:"soft",color:"blue",onClick:()=>a("ex-toast-stacked"),children:"Stack toasts (bottom left)"}),e.jsx(x,{size:"sm",variant:"soft",color:"violet",onClick:()=>a("ex-toast-expanded"),children:"Expand toasts (bottom right)"})]}),e.jsx("p",{className:"text-xs opacity-60",children:'Left: the deck folds back down when the pointer leaves. Right: the same deck, but `mode="expanded"` keeps every card at full height. The deck only shows the three newest — older ones stay hidden until the cards in front of them leave.'})]})}const Be=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

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
`;function Pe(){return e.jsxs(w,{children:[Q.map(n=>e.jsx(m,{group:`ex-toast-pos-${n}`,position:n},n)),e.jsx(Ee,{})]})}function Ee(){const{toast:n}=v(),a=s=>{n.show({group:`ex-toast-pos-${s}`,intent:"neutral",title:s,detail:"this toast owns its corner",life:6e3})};return e.jsxs("div",{className:"flex w-full max-w-xl flex-col items-start gap-2",children:[e.jsx("div",{className:"flex flex-wrap gap-2",children:Q.map(s=>e.jsx(x,{size:"sm",variant:"outline",color:"blue",onClick:()=>a(s),children:s},s))}),e.jsx("p",{className:"text-xs opacity-60",children:"Two rem from every edge, exactly like the PrimeVue reference — the cards always slide in from the edge they sit on."})]})}const Ie=`import {
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
`;function Ve(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-progress",position:"bottom-right"}),e.jsx(ze,{})]})}function ze(){const{toast:n}=v(),a=l.useRef(null),s=()=>{const u=n.show({intent:"info",title:"Downloading build",detail:"0%",loading:!0,progress:0,sticky:!0});let p=0;a.current=window.setInterval(()=>{if(p=Math.min(100,p+Math.ceil(Math.random()*18)),p<100){n.update(u,{progress:p,detail:`${p}%`});return}a.current!==null&&window.clearInterval(a.current),n.update(u,{intent:"success",title:"Download complete",detail:"build-482.tar.zst",loading:!1,progress:100,life:4e3})},500)};return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[e.jsx(x,{variant:"solid",color:"blue",onClick:s,children:"Start a download"}),e.jsx("p",{className:"text-xs opacity-60",children:"The card shows a spinner and a progress bar while it works, then the same card turns green when the work finishes."})]})}const Oe=`import { useRef } from "react";
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
`;function Le(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-groups",position:"bottom-right"}),e.jsx(m,{position:"top-right"}),e.jsx(Re,{})]})}function Re(){const{toast:n}=v(),a=()=>{n.show({group:"downloads",intent:"info",title:"design-specs.fig",detail:"18 MB",life:8e3}),n.show({group:"downloads",intent:"info",title:"build-482.tar.zst",detail:"412 MB",life:8e3}),n.show({group:"downloads",intent:"warning",title:"assets.zip — slow",detail:"11%",life:8e3})};return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[e.jsxs("div",{className:"flex flex-wrap gap-2",children:[e.jsx(x,{size:"sm",variant:"soft",color:"blue",onClick:()=>n.neutral("Session note","Sticky — it stays until dismissed.",{sticky:!0}),children:"Sticky toast"}),e.jsx(x,{size:"sm",variant:"soft",color:"violet",onClick:a,children:"Three grouped downloads"}),e.jsx(x,{size:"sm",variant:"outline",color:"slate",onClick:()=>n.closeGroup("downloads"),children:"Clear the group"})]}),e.jsx("p",{className:"text-xs opacity-60",children:'The sticky toast has no timer; the grouped batch disappears together when `closeGroup("downloads")` fires.'})]})}const Me=`import { Button, ToastProvider, ToastViewport, useToast } from "@cjlapao/ui-kit";

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
`;function Ge(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-surfaces",position:"bottom-right"}),e.jsx(_e,{})]})}function _e(){const{toast:n}=v(),a=s=>{n.show({group:"ex-toast-surfaces",intent:"success",variant:s,title:"Payment captured",detail:"$42.00 — order #10492",life:8e3})};return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[e.jsx("div",{className:"flex flex-wrap gap-2",children:ae.map(s=>e.jsx(x,{size:"sm",variant:"soft",color:"emerald",onClick:()=>a(s),children:s},s))}),e.jsx("p",{className:"text-xs opacity-60",children:"Each button raises the same message on a different surface. Fire two quickly to see them stack — the deck geometry is identical across variants."})]})}const $e=`import {
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
`;function Fe(){return e.jsxs(w,{children:[e.jsx(m,{group:"ex-toast-actions",position:"bottom-right"}),e.jsx(De,{})]})}function De(){const{toast:n}=v(),[a,s]=l.useState(0),u=()=>{n.show({group:"ex-toast-actions",intent:"warning",title:"Sync stalled",detail:`Last retry ${a===0?"never":`#${a}`}`,icon:"Chat",life:1e4,onClick:()=>s(p=>p+1),actions:[{label:"Retry",onClick:()=>s(p=>p+1)},{label:"Dismiss",onClick:()=>n.closeGroup("ex-toast-actions")}]})};return e.jsxs("div",{className:"flex w-full max-w-md flex-col items-start gap-2",children:[e.jsx(x,{variant:"solid",color:"amber",onClick:u,children:"Raise a warning with actions"}),e.jsx("p",{className:"text-xs opacity-60",children:"The card body is clickable (it counts as a manual retry), the buttons are its own clicks, and the custom icon replaces the default warning glyph."})]})}const qe=`import { useState } from "react";
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
`,Xe=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(ie,{name:"Toast",description:"Transient notifications with the kit's alert-family surface. A stack of glass cards pins to a page corner: the newest sits in front, the older ones peek out behind it as a deck — and on hover (or focus) the deck fans out to full height. Auto-dismiss timers pause while the deck is engaged, and every card can be swiped away."}),e.jsx(ve,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(T,{title:"Basic",description:"One provider, one viewport, one hook call — the toast takes care of its own lifetime.",code:je,filename:"Basic.tsx",children:e.jsx(ye,{})}),e.jsx(T,{title:"Severities",description:"The shared alert-intent scale: the intent picks tone, icon and whether the announcement is polite or assertive.",code:Ce,filename:"Severities.tsx",children:e.jsx(be,{})}),e.jsx(T,{title:"Stacked and expanded",description:"The signature behaviour: a clipped deck that fans out on hover, and an expanded mode that keeps the fan-out permanent.",code:Be,filename:"StackedAndExpanded.tsx",children:e.jsx(Ne,{})}),e.jsx(T,{title:"Every position",description:"All seven anchor points, two rem from every edge — cards slide in from the edge they sit on.",code:Ie,filename:"EveryPosition.tsx",children:e.jsx(Pe,{})}),e.jsx(T,{title:"Progress and loading",description:"A live toast: a spinner and a progress bar while work runs, updated in place by toast.update, then the same card turns green.",code:Oe,filename:"ProgressAndLoading.tsx",children:e.jsx(Ve,{})}),e.jsx(T,{title:"Sticky and groups",description:"Sticky toasts opt out of the timer; a group tag lets one call clear a whole batch at once.",code:Me,filename:"StickyAndGroups.tsx",children:e.jsx(Le,{})}),e.jsx(T,{title:"Surfaces",description:"The same five Alert surfaces — subtle, solid, outline, glass and liquid-glass — driven by the same token table.",code:$e,filename:"Surfaces.tsx",children:e.jsx(Ge,{})}),e.jsx(T,{title:"Actions and custom",description:"A clickable card body, an action row, and a custom icon — action clicks stop propagation.",code:qe,filename:"ActionsAndCustom.tsx",children:e.jsx(Fe,{})})]})]});export{Xe as ToastPage,Xe as default};
