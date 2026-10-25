import { useRef, useState } from "react";
import {
  TerminalTabs,
  type TerminalSession,
  type TerminalTabsHandle,
  type TerminalSurfaceProps,
  type TerminalScheme,
} from "@cjlapao/ui-kit";

const prompt = "\x1b[90m~/code/workspace\x1b[0m \x1b[33m(main)\x1b[0m $ ";
const welcome =
  "\x1b[36mTab · terminal\x1b[0m\r\nLocal echo demo. Try help, colors, pwd or clear.\r\n\r\n";

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
        const id = `shell-${++counter.current}`;
        setSessions((previous) => [
          ...previous,
          {
            id,
            label: `zsh ${counter.current}`,
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
          if (char === "\r") {
            output.write("\r\n");
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
                  "\x1b[31mred  \x1b[32mgreen  \x1b[33myellow  \x1b[34mblue  \x1b[35mmagenta  \x1b[36mcyan\x1b[0m",
                );
                break;
              case "":
                break;
              default:
                output.writeln(`Demo received: ${line}`);
            }
            output.write(prompt);
            line = "";
          } else if (char === "\x7f") {
            if (line.length) {
              line = line.slice(0, -1);
              output.write("\b \b");
            }
          } else if (char === "\x03") {
            output.write("^C\r\n" + prompt);
            line = "";
          } else if (char >= " " && char !== "\x7f") {
            line += char;
            output.write(char);
          }
          lines.current.set(id, line);
        }
      }}
    />
  );
}
