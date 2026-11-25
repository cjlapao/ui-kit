import{r as a,j as e,h3 as k,T as C}from"./index-CQwZVYnB.js";import{S as j}from"./SurfaceToneControl-LH37fS9y.js";import{P as B}from"./PageHeader-BhZxEVHt.js";import{E as T}from"./ExampleCard-BZsKA5_g.js";import{P as D,S as l}from"./PlaygroundPanel-Dq0XbiQ9.js";import{s as P,f as R,p as V,C as O,B as A,A as L}from"./options-Byh1yOHz.js";const d="\x1B[90m~/code/workspace\x1B[0m \x1B[33m(main)\x1B[0m $ ",w=`\x1B[36mTab · terminal\x1B[0m\r
Local echo demo. Try help, colors, pwd or clear.\r
\r
`;function S(h){const x=a.useRef(null),c=a.useRef(2),u=a.useRef(new Map),[b,m]=a.useState("shell-1"),[p,f]=a.useState([{id:"shell-1",label:"zsh · workspace",metadata:"Local echo",initialData:w+d},{id:"shell-2",label:"zsh 2",metadata:"Local echo",initialData:w+d}]);return e.jsx(k,{...h,ref:x,height:340,sessions:p,value:b,onValueChange:m,onAdd:()=>{const s=`shell-${++c.current}`;f(i=>[...i,{id:s,label:`zsh ${c.current}`,metadata:"Local echo",initialData:w+d}]),m(s)},onClose:s=>{const i=p.filter(n=>n.id!==s);f(i),m(i[0]?.id??""),u.current.delete(s)},onData:(s,i)=>{const n=x.current?.getSession(s);if(n)for(const o of i){let r=u.current.get(s)??"";if(o==="\r"){switch(n.write(`\r
`),r.trim()){case"help":n.writeln("help    colors    pwd    clear");break;case"pwd":n.writeln("/home/demo/code/workspace");break;case"clear":n.reset();break;case"colors":n.writeln("\x1B[31mred  \x1B[32mgreen  \x1B[33myellow  \x1B[34mblue  \x1B[35mmagenta  \x1B[36mcyan\x1B[0m");break;case"":break;default:n.writeln(`Demo received: ${r}`)}n.write(d),r=""}else o===""?r.length&&(r=r.slice(0,-1),n.write("\b \b")):o===""?(n.write(`^C\r
`+d),r=""):o>=" "&&o!==""&&(r+=o,n.write(o));u.current.set(s,r)}}})}const $=`import { useRef, useState } from "react";
import {
  TerminalTabs,
  type TerminalSession,
  type TerminalTabsHandle,
  type TerminalSurfaceProps,
  type TerminalScheme,
} from "@cjlapao/ui-kit";

const prompt = "\\x1b[90m~/code/workspace\\x1b[0m \\x1b[33m(main)\\x1b[0m $ ";
const welcome =
  "\\x1b[36mTab · terminal\\x1b[0m\\r\\nLocal echo demo. Try help, colors, pwd or clear.\\r\\n\\r\\n";

/** Replace onData with your transport's send(), and stream received bytes via getSession(id).write(). */
export default function TabbedTerminal(
  props: TerminalSurfaceProps & { scheme?: TerminalScheme },
) {
  const terminal = useRef<TerminalTabsHandle>(null);
  const counter = useRef(2);
  const lines = useRef(new Map<string, string>());
  const [value, setValue] = useState("shell-1");
  const [sessions, setSessions] = useState<TerminalSession[]>([
    {
      id: "shell-1",
      label: "zsh · workspace",
      metadata: "Local echo",
      initialData: welcome + prompt,
    },
    {
      id: "shell-2",
      label: "zsh 2",
      metadata: "Local echo",
      initialData: welcome + prompt,
    },
  ]);
  return (
    <TerminalTabs
      {...props}
      ref={terminal}
      height={340}
      sessions={sessions}
      value={value}
      onValueChange={setValue}
      onAdd={() => {
        const id = \`shell-\${++counter.current}\`;
        setSessions((previous) => [
          ...previous,
          {
            id,
            label: \`zsh \${counter.current}\`,
            metadata: "Local echo",
            initialData: welcome + prompt,
          },
        ]);
        setValue(id);
      }}
      onClose={(id) => {
        const remaining = sessions.filter((session) => session.id !== id);
        setSessions(remaining);
        setValue(remaining[0]?.id ?? "");
        lines.current.delete(id);
      }}
      onData={(id, data) => {
        const output = terminal.current?.getSession(id);
        if (!output) return;
        for (const char of data) {
          let line = lines.current.get(id) ?? "";
          if (char === "\\r") {
            output.write("\\r\\n");
            switch (line.trim()) {
              case "help":
                output.writeln("help    colors    pwd    clear");
                break;
              case "pwd":
                output.writeln("/home/demo/code/workspace");
                break;
              case "clear":
                output.reset();
                break;
              case "colors":
                output.writeln(
                  "\\x1b[31mred  \\x1b[32mgreen  \\x1b[33myellow  \\x1b[34mblue  \\x1b[35mmagenta  \\x1b[36mcyan\\x1b[0m",
                );
                break;
              case "":
                break;
              default:
                output.writeln(\`Demo received: \${line}\`);
            }
            output.write(prompt);
            line = "";
          } else if (char === "\\x7f") {
            if (line.length) {
              line = line.slice(0, -1);
              output.write("\\b \\b");
            }
          } else if (char === "\\x03") {
            output.write("^C\\r\\n" + prompt);
            line = "";
          } else if (char >= " " && char !== "\\x7f") {
            line += char;
            output.write(char);
          }
          lines.current.set(id, line);
        }
      }}
    />
  );
}
`;function G(){const[h,x]=a.useState("auto"),[c,u]=a.useState("outlined"),[b,m]=a.useState("none"),[p,f]=a.useState("rounded-md"),[s,i]=a.useState("sm"),[n,o]=a.useState("light"),[r,y]=a.useState("medium"),[g,v]=a.useState("classic");return e.jsxs("div",{className:"mx-auto flex w-full max-w-(--docs-page-max) flex-col gap-8 px-4 py-8 sm:px-8",children:[e.jsx(B,{name:"Terminal",description:"An xterm.js terminal with ANSI colors, streaming output and keyboard input. Use Terminal on its own or TerminalTabs for persistent sessions. Both use the kit's Panel variants, tones, corners and glass surfaces — `raisedSurface` included, forcing the first nested-panels depth step, the tinted-card-on-matching-background fix. Connect onData, onResize and the imperative handle to your own shell transport."}),e.jsx(D,{controls:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(l,{label:"Scheme",value:h,options:[{label:"Auto (follow page)",value:"auto"},{label:"Light",value:"light"},{label:"Dark",value:"dark"}],onChange:t=>x(t)}),e.jsx(l,{label:"Variant",options:P,value:c,onChange:t=>u(t)}),e.jsx(j,{label:"Tone",value:b,onChange:m}),e.jsx(l,{label:"Corner",options:R,value:p,onChange:t=>f(t)}),e.jsx(l,{label:"Padding",options:V,value:s,onChange:t=>i(t)}),e.jsx(l,{label:"Glass opacity",options:O,value:n,onChange:t=>o(t)}),e.jsx(l,{label:"Vibrancy",options:A,value:r,onChange:t=>y(t)}),e.jsx(l,{label:"Specular",options:L,value:g,onChange:t=>v(t)})]}),preview:e.jsx(S,{scheme:h,variant:c,tone:b,corner:p,padding:s,glassOpacity:n,vibrancy:r,specularMode:g})}),e.jsx(T,{title:"Tabbed sessions",description:"Local echo demonstrates input/output, add/close, ANSI colors and session persistence. A real application forwards input to a PTY and writes its output through the ref. This demo does not execute shell commands.",code:$,filename:"TabbedTerminal.tsx",children:e.jsx(S,{})}),e.jsx(T,{title:"Read-only output",description:"Terminal also works without tabs. initialData is written once; use ref.write() for subsequent streamed output. Configure fonts and cursor through options, and override ANSI colors with terminalTheme.",code:'<Terminal readOnly initialData={"\\x1b[32m✓ Build complete\\x1b[0m\\r\\n"} />',filename:"ReadOnly.tsx",children:e.jsx(C,{height:180,readOnly:!0,initialData:`\x1B[36m$ npm run build\x1B[0m\r
\r
\x1B[32m✓ TypeScript checked\r
✓ Assets bundled\x1B[0m\r
\x1B[33mBuild completed in 1.24s\x1B[0m\r
`})}),e.jsx("p",{className:"text-sm text-neutral-500 dark:text-neutral-400",children:"Terminal ref: write, writeln, clear, reset, focus, fit. TerminalTabs ref: getSession(id). Each session keeps its output and connection until removed. onReady supplies the handle to wire incoming transport data; use onDispose to close your transport when its session unmounts. Include the kit stylesheet for xterm rendering."})]})}export{G as default};
