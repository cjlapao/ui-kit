import classNames from "classnames";
import { forwardRef } from "react";
import Panel from "../Panel";
import { TerminalViewport } from "./TerminalViewport";
import type { TerminalHandle, TerminalProps } from "./types";

export const Terminal = forwardRef<TerminalHandle, TerminalProps>(
  function Terminal(
    {
      initialData,
      readOnly,
      scheme,
      terminalTheme,
      options,
      onData,
      onResize,
      onReady,
      onError,
      onDispose,
      ariaLabel,
      height = 320,
      style,
      padding = "sm",
      variant = "outlined",
      tone = "neutral",
      ...surface
    },
    ref,
  ) {
    return (
      <Panel
        {...surface}
        data-color-scheme={scheme ?? "auto"}
        className={classNames(surface.className, scheme === "dark" && "dark")}
        variant={variant}
        tone={tone}
        padding={padding}
        flexBody
        scrollable={false}
        style={{
          height,
          colorScheme: scheme === "auto" ? undefined : scheme,
          ...style,
        }}
      >
        <TerminalViewport
          ref={ref}
          {...{
            initialData,
            readOnly,
            scheme,
            terminalTheme,
            options,
            onData,
            onResize,
            onReady,
            onError,
            onDispose,
            ariaLabel,
          }}
        />
      </Panel>
    );
  },
);
export default Terminal;
