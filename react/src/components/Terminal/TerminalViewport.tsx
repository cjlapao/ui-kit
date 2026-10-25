import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import ScrollArea from "../ScrollArea";
import type { Terminal as XTerminal } from "@xterm/xterm";
import type { FitAddon } from "@xterm/addon-fit";
import { loadTerminalEngine } from "./engine";
import type { TerminalConnectionProps, TerminalHandle } from "./types";
import { TERMINAL_DARK_THEME, TERMINAL_LIGHT_THEME } from "./themes";

export interface TerminalViewportProps extends TerminalConnectionProps {
  active?: boolean;
}

/** Internal engine host. Surface and session ownership belong to the public wrappers. */
export const TerminalViewport = forwardRef<
  TerminalHandle,
  TerminalViewportProps
>(function TerminalViewport(props, ref) {
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<XTerminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);
  const [scroll, setScroll] = useState({
    contentSize: 0,
    viewportSize: 0,
    offset: 0,
  });
  const scrollTo = useCallback(
    (offset: number) => engine.current?.scrollToLine(Math.round(offset)),
    [],
  );
  const virtualScroll = useMemo(
    () => ({ ...scroll, onScroll: scrollTo }),
    [scroll, scrollTo],
  );
  const latest = useRef(props);
  latest.current = props;
  const initialData = useRef(props.initialData);
  const pending = useRef<
    Array<{ data: string | Uint8Array; newline: boolean }>
  >([]);
  const handle = useMemo<TerminalHandle>(
    () => ({
      write(data) {
        if (engine.current) engine.current.write(data);
        else pending.current.push({ data, newline: false });
      },
      writeln(data) {
        if (engine.current) engine.current.writeln(data);
        else pending.current.push({ data, newline: true });
      },
      clear() {
        pending.current = [];
        engine.current?.clear();
      },
      reset() {
        pending.current = [];
        engine.current?.reset();
      },
      focus() {
        engine.current?.focus();
      },
      fit() {
        if (host.current?.clientWidth && host.current?.clientHeight)
          fitAddon.current?.fit();
      },
    }),
    [],
  );
  useImperativeHandle(ref, () => handle, [handle]);

  const applyOptions = () => {
    const term = engine.current;
    if (!term) return;
    const p = latest.current;
    const dark =
      p.scheme === "dark" ||
      ((p.scheme ?? "auto") === "auto" &&
        Boolean(host.current?.closest(".dark")));
    term.options = {
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      fontSize: 14,
      cursorBlink: true,
      screenReaderMode: true,
      scrollback: 5000,
      ...p.options,
      disableStdin: p.readOnly ?? false,
      theme: {
        ...(dark ? TERMINAL_DARK_THEME : TERMINAL_LIGHT_THEME),
        ...p.terminalTheme,
      },
    };
  };
  const updateOptions = useRef(applyOptions);
  updateOptions.current = applyOptions;

  useEffect(() => {
    let cancelled = false;
    let initialized = false;
    let instance: XTerminal | undefined;
    let observer: ResizeObserver | undefined;
    let themeObserver: MutationObserver | undefined;
    let frame = 0;
    const disposables: Array<{ dispose(): void }> = [];
    const scheduleFit = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => handle.fit());
    };
    void loadTerminalEngine()
      .then(({ Terminal, FitAddon }) => {
        if (cancelled || !host.current) return;
        instance = new Terminal({ allowTransparency: true });
        engine.current = instance;
        updateOptions.current();
        const fit = new FitAddon();
        fitAddon.current = fit;
        instance.loadAddon(fit);
        instance.open(host.current);
        const syncScroll = () => {
          if (!instance || cancelled) return;
          const buffer = instance.buffer.active;
          const next = {
            contentSize: buffer.baseY + instance.rows,
            viewportSize: instance.rows,
            offset: buffer.viewportY,
          };
          setScroll((previous) =>
            previous.contentSize === next.contentSize &&
            previous.viewportSize === next.viewportSize &&
            previous.offset === next.offset
              ? previous
              : next,
          );
        };
        disposables.push(
          instance.onScroll(syncScroll),
          instance.onWriteParsed(syncScroll),
        );
        disposables.push(
          instance.onData((data) => latest.current.onData?.(data)),
        );
        disposables.push(
          instance.onResize((size) => {
            latest.current.onResize?.(size);
            syncScroll();
          }),
        );
        if (initialData.current !== undefined)
          instance.write(initialData.current);
        for (const entry of pending.current) {
          if (entry.newline) instance.writeln(entry.data);
          else instance.write(entry.data);
        }
        pending.current = [];
        if (typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(scheduleFit);
          observer.observe(host.current);
        }
        window.addEventListener("resize", scheduleFit);
        themeObserver = new MutationObserver(() => {
          updateOptions.current();
          scheduleFit();
        });
        // Observe ancestor theme classes only, not xterm's own DOM mutations.
        for (
          let node: HTMLElement | null = host.current;
          node;
          node = node.parentElement
        ) {
          themeObserver.observe(node, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
        handle.fit();
        syncScroll();
        initialized = true;
        latest.current.onReady?.(handle);
      })
      .catch((error) => {
        if (!cancelled)
          latest.current.onError?.(
            error instanceof Error ? error : new Error(String(error)),
          );
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      observer?.disconnect();
      themeObserver?.disconnect();
      window.removeEventListener("resize", scheduleFit);
      disposables.forEach((d) => d.dispose());
      instance?.dispose();
      if (initialized) latest.current.onDispose?.();
      engine.current = null;
      fitAddon.current = null;
    };
  }, [handle]);

  useEffect(() => {
    updateOptions.current();
    if (props.active !== false) handle.fit();
  }, [
    props.options,
    props.terminalTheme,
    props.scheme,
    props.readOnly,
    props.active,
    handle,
  ]);

  return (
    <ScrollArea
      variant="hover"
      horizontal={false}
      tabIndex={-1}
      virtualScroll={virtualScroll}
      className="h-full min-h-0 w-full"
      contentClassName="h-full"
    >
      <div
        ref={host}
        className="kit-terminal-viewport h-full min-h-0 min-w-0 w-full"
        style={{ backgroundColor: props.terminalTheme?.background }}
        role="group"
        aria-label={props.ariaLabel ?? "Terminal"}
      />
    </ScrollArea>
  );
});
