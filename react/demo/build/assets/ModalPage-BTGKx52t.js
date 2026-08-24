import{r as t,j as e,e as o,aK as i,I as x,M as d}from"./index-B-ieYLXc.js";import{P as J,S as u,C as r,T as l,a as Q,E as c}from"./PlaygroundPanel-CkWfNJii.js";import{c as X,n as Y,t as Z,p as $,i as ee,j as ne,k as te}from"./options-C8y5quvx.js";const se=["glass","liquid-glass","default"],ae=[{label:"Center",value:"center"},{label:"Top",value:"top"},{label:"Bottom",value:"bottom"},{label:"Left",value:"left"},{label:"Right",value:"right"},{label:"Top left",value:"top-left"},{label:"Top right",value:"top-right"},{label:"Bottom left",value:"bottom-left"},{label:"Bottom right",value:"bottom-right"}],oe="rounded-md",le=()=>{const[a,n]=t.useState(!1),[g,z]=t.useState("Rename environment"),[m,N]=t.useState("Pick a new name for the staging environment."),[f,A]=t.useState("md"),[b,D]=t.useState("center"),[p,F]=t.useState("elevated"),[v,W]=t.useState("blue"),[j,E]=t.useState(oe),[O,H]=t.useState(!0),[C,R]=t.useState(!0),[k,L]=t.useState(!1),[h,q]=t.useState(!1),[w,P]=t.useState(!0),[S,G]=t.useState(!1),[y,V]=t.useState(!0),[M,U]=t.useState("classic"),[I,_]=t.useState("medium"),[B,K]=t.useState("frosted"),T=se.includes(p);return e.jsx(J,{controls:e.jsxs(e.Fragment,{children:[e.jsx(u,{label:"Surface",options:X,value:p,onChange:s=>F(s)}),e.jsx(r,{label:"Size",children:e.jsx(d,{fullWidth:!0,size:"sm",options:Y,value:f,onChange:s=>A(s)})}),e.jsx(u,{label:"Position",options:ae,value:b,onChange:s=>D(s)}),e.jsx(u,{label:"Tone",options:Z,value:v,onChange:s=>W(s)}),e.jsx(u,{label:"Corner",options:$,value:j,onChange:s=>E(s)}),e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx(l,{label:"Draggable",checked:O,onChange:H}),e.jsx(l,{label:"Maximize button",checked:C,onChange:R}),e.jsx(l,{label:"Open maximized",checked:k,onChange:L}),e.jsx(l,{label:"Headless",checked:h,onChange:q}),e.jsx(l,{label:"Responsive",checked:w,onChange:P}),e.jsx(l,{label:"Dark overlay",checked:S,onChange:G}),e.jsx(l,{label:"Footer",checked:y,onChange:V})]}),T&&e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(r,{label:"Specular",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ee,value:M,onChange:s=>U(s)})}),e.jsx(r,{label:"Vibrancy",children:e.jsx(d,{fullWidth:!0,size:"sm",options:ne,value:I,onChange:s=>_(s)})}),e.jsx(r,{label:"Glass opacity",children:e.jsx(d,{fullWidth:!0,size:"sm",options:te,value:B,onChange:s=>K(s)})})]}),e.jsxs("div",{className:"grid grid-cols-1 gap-3",children:[e.jsx(r,{label:"Title",children:e.jsx(x,{size:"sm",value:g,onChange:s=>z(s.target.value)})}),e.jsx(r,{label:"Description",children:e.jsx(x,{size:"sm",value:m,onChange:s=>N(s.target.value)})})]}),e.jsxs("p",{className:"text-xs opacity-70",children:["Drag the dialog by its header. ",e.jsx("strong",{children:"Responsive"})," makes it fill the screen below 640px and disables dragging — a window dragged half off a phone cannot be recovered. Tab is trapped inside, and Escape closes only the innermost dialog."]})]}),preview:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),title:g,description:m,icon:"Edit",variant:p,size:f,tone:v,position:b,corner:j,draggable:O,showMaximizeButton:C,showMaximized:k,headless:h,responsive:w,darkOverlay:S,glassOpacity:B,vibrancy:I,specularMode:T?M:"none",actions:y?e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>n(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!1),children:"Save"})]}):void 0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx(x,{placeholder:"environment-name",leadingIcon:"Edit"}),e.jsx("p",{className:"text-xs leading-5 text-neutral-500 dark:text-neutral-400",children:"Lowercase letters, numbers and dashes. This name appears in URLs and in the CLI."}),h&&e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>n(!1),children:"Close (headless has no header)"})]})})]})})};function ie(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!0),children:"Open modal"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),title:"Welcome aboard",description:"One quick thing before you start.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"Modal traps focus inside the dialog, closes on Escape and on the backdrop, and returns focus to the trigger when it closes."})})]})}const re=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Basic() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Welcome aboard"
        description="One quick thing before you start."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          Modal traps focus inside the dialog, closes on Escape and on the
          backdrop, and returns focus to the trigger when it closes.
        </p>
      </Modal>
    </>
  );
}
`;function ce(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"soft",color:"rose",onClick:()=>n(!0),children:"Delete project"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),role:"alertdialog",icon:"Warning",tone:"rose",title:"Delete acme-inc?",description:"This cannot be undone. All environments and members are removed.",actions:e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"ghost",color:"blue",onClick:()=>n(!1),children:"Cancel"}),e.jsx(o,{variant:"solid",color:"rose",leadingIcon:"Trash",onClick:()=>n(!1),children:"Delete"})]}),children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The footer actions stay in view no matter how tall the body grows."})})]})}const de=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function WithActions() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="soft" color="rose" onClick={() => setIsOpen(true)}>
        Delete project
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        role="alertdialog"
        icon="Warning"
        tone="rose"
        title="Delete acme-inc?"
        description="This cannot be undone. All environments and members are removed."
        actions={
          <>
            <Button
              variant="ghost"
              color="blue"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="rose"
              leadingIcon="Trash"
              onClick={() => setIsOpen(false)}
            >
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The footer actions stay in view no matter how tall the body grows.
        </p>
      </Modal>
    </>
  );
}
`;function ue(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!0),children:"Open headless dialog"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),title:"Headless",headless:!0,ariaLabel:"Headless example",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The header is dropped entirely — no title, no close button, no drag handle. The dialog has to provide its own way out."}),e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!1),children:"Close"})]})})]})}const pe=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Headless() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open headless dialog
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Headless"
        headless
        ariaLabel="Headless example"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The header is dropped entirely — no title, no close button, no drag
            handle. The dialog has to provide its own way out.
          </p>
          <Button
            variant="solid"
            color="blue"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
`;function he(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!0),children:"Open maximized"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),title:"Full-screen review",description:"Opens filling the viewport.",showMaximized:!0,showMaximizeButton:!0,children:e.jsxs("div",{className:"flex flex-col gap-3",children:[e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The dialog fills the screen. The restore button in the header puts it back to its normal size without closing it."}),e.jsxs("div",{className:"rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400",children:["image: ghcr.io/acme/orchestrator-api:2.14.0",e.jsx("br",{}),"sha256:9f2c…e41d"]})]})})]})}const xe=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Maximized() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open maximized
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Full-screen review"
        description="Opens filling the viewport."
        showMaximized
        showMaximizeButton
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            The dialog fills the screen. The restore button in the header puts
            it back to its normal size without closing it.
          </p>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-xs leading-5 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400">
            image: ghcr.io/acme/orchestrator-api:2.14.0
            <br />
            sha256:9f2c…e41d
          </div>
        </div>
      </Modal>
    </>
  );
}
`;function ge(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"blue",onClick:()=>n(!0),children:"Open in the bottom right"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),title:"Docked to a corner",description:"Where it sits before any drag.",size:"sm",position:"bottom-right",draggable:!1,children:e.jsxs("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:[e.jsx("code",{className:"font-mono text-xs",children:"position"})," places the dialog in any of nine spots. Here dragging is off, so it stays put."]})})]})}const me=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function InACorner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
        Open in the bottom right
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Docked to a corner"
        description="Where it sits before any drag."
        size="sm"
        position="bottom-right"
        draggable={false}
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          <code className="font-mono text-xs">position</code> places the dialog
          in any of nine spots. Here dragging is off, so it stays put.
        </p>
      </Modal>
    </>
  );
}
`;function fe(){const[a,n]=t.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(o,{variant:"solid",color:"violet",onClick:()=>n(!0),children:"Open glass modal"}),e.jsx(i,{isOpen:a,onClose:()=>n(!1),variant:"liquid-glass",tone:"violet",title:"Liquid glass",description:"The dialog sits over whatever the page is showing.",children:e.jsx("p",{className:"text-sm leading-6 text-neutral-600 dark:text-neutral-300",children:"The see-through surface variants let the app behind stay visible — great for quick confirmations on top of rich screens."})})]})}const be=`import { useState } from "react";
import { Button, Modal } from "@cjlapao/ui-kit";

export default function Glass() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="solid" color="violet" onClick={() => setIsOpen(true)}>
        Open glass modal
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="liquid-glass"
        tone="violet"
        title="Liquid glass"
        description="The dialog sits over whatever the page is showing."
      >
        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
          The see-through surface variants let the app behind stay visible —
          great for quick confirmations on top of rich screens.
        </p>
      </Modal>
    </>
  );
}
`,Ce=()=>e.jsxs("div",{className:"mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(Q,{name:"Modal",description:"A dialog that behaves like a window — draggable by its header, placeable in any corner, able to fill the screen — and that owns attention: focus is trapped, Escape and the backdrop close it, and focus returns to the trigger."}),e.jsx(le,{}),e.jsxs("section",{className:"flex flex-col gap-5",children:[e.jsx("h2",{className:"text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500",children:"Examples"}),e.jsx(c,{title:"Basic",description:"A simple information dialog with a title, a description and a body.",code:re,filename:"Basic.tsx",children:e.jsx(ie,{})}),e.jsx(c,{title:"With actions",description:"A destructive confirmation: alertdialog semantics, a warning icon and the decision in the footer.",code:de,filename:"WithActions.tsx",children:e.jsx(ce,{})}),e.jsx(c,{title:"Headless",description:"The header is dropped entirely — the dialog has to provide its own way out.",code:pe,filename:"Headless.tsx",children:e.jsx(ue,{})}),e.jsx(c,{title:"Maximized",description:"Opens filling the viewport; the restore button shrinks it back without closing.",code:xe,filename:"Maximized.tsx",children:e.jsx(he,{})}),e.jsx(c,{title:"In a corner",description:"position places the dialog in any of nine spots before any drag.",code:me,filename:"InACorner.tsx",children:e.jsx(ge,{})}),e.jsx(c,{title:"Glass",description:"The see-through surface variants let the app behind the dialog stay visible.",code:be,filename:"Glass.tsx",children:e.jsx(fe,{})})]})]});export{Ce as ModalPage,Ce as default};
