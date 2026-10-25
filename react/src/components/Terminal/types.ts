import type React from "react";
import type { ITerminalOptions, ITheme } from "@xterm/xterm";
import type { PanelProps } from "../Panel";

export type TerminalOptions = Omit<
  ITerminalOptions,
  "theme" | "allowTransparency" | "disableStdin" | "cols" | "rows"
>;
export type TerminalTheme = ITheme;
export type TerminalScheme = "auto" | "light" | "dark";
export type TerminalSurfaceProps = Pick<
  PanelProps,
  | "variant"
  | "tone"
  | "corner"
  | "padding"
  | "glassOpacity"
  | "vibrancy"
  | "specularMode"
  | "borderColor"
  | "backgroundColor"
  | "maxWidth"
  | "className"
  | "style"
>;

export interface TerminalHandle {
  write(data: string | Uint8Array): void;
  writeln(data: string | Uint8Array): void;
  clear(): void;
  reset(): void;
  focus(): void;
  fit(): void;
}

export interface TerminalConnectionProps {
  /** Written once per mounted session. Stream subsequent output through the ref. */
  initialData?: string | Uint8Array;
  readOnly?: boolean;
  /** Terminal palette follows the page by default. */
  scheme?: TerminalScheme;
  /** Overrides individual ANSI colors, foreground, cursor and selection colors. */
  terminalTheme?: TerminalTheme;
  options?: TerminalOptions;
  /** Input bytes to forward to your shell/PTY transport. No local echo is added. */
  onData?: (data: string) => void;
  onResize?: (size: { cols: number; rows: number }) => void;
  onReady?: (terminal: TerminalHandle) => void;
  onError?: (error: Error) => void;
  /** Close consumer-owned transport resources when the initialized session unmounts. */
  onDispose?: () => void;
  ariaLabel?: string;
}

export interface TerminalProps
  extends TerminalSurfaceProps, TerminalConnectionProps {
  /** @default 320. Use "100%" inside a parent with a defined height. */
  height?: React.CSSProperties["height"];
}

export interface TerminalSession {
  id: string;
  label: string;
  icon?: string | React.ReactElement;
  metadata?: React.ReactNode;
  initialData?: string | Uint8Array;
  readOnly?: boolean;
  closable?: boolean;
}

export interface TerminalTabsHandle {
  getSession(id: string): TerminalHandle | undefined;
}

export interface TerminalTabsProps
  extends
    TerminalSurfaceProps,
    Omit<
      TerminalConnectionProps,
      | "initialData"
      | "onData"
      | "onResize"
      | "onReady"
      | "onError"
      | "onDispose"
    > {
  sessions: TerminalSession[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  onAdd?: () => void;
  onClose?: (id: string) => void;
  onData?: (sessionId: string, data: string) => void;
  onResize?: (sessionId: string, size: { cols: number; rows: number }) => void;
  onReady?: (sessionId: string, terminal: TerminalHandle) => void;
  onError?: (sessionId: string, error: Error) => void;
  onDispose?: (sessionId: string) => void;
  height?: React.CSSProperties["height"];
  addLabel?: string;
  closeLabel?: string;
  emptyState?: React.ReactNode;
}
