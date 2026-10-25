import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Panel from "../Panel";
import Tabs from "../Tabs";
import IconButton from "../IconButton";
import { Add } from "../../icons/components/Add";
import { Close } from "../../icons/components/Close";
import { TerminalViewport } from "./TerminalViewport";
import type {
  TerminalHandle,
  TerminalTabsHandle,
  TerminalTabsProps,
} from "./types";

export const TerminalTabs = forwardRef<TerminalTabsHandle, TerminalTabsProps>(
  function TerminalTabs(
    {
      sessions,
      value,
      defaultValue,
      onValueChange,
      onAdd,
      onClose,
      onData,
      onResize,
      onReady,
      onError,
      onDispose,
      height = 360,
      style,
      variant = "outlined",
      tone = "neutral",
      padding = "sm",
      readOnly,
      scheme,
      terminalTheme,
      options,
      ariaLabel = "Terminal sessions",
      addLabel = "New terminal",
      closeLabel = "Close terminal",
      emptyState = "No terminal sessions",
      ...surface
    },
    ref,
  ) {
    const prefix = useId();
    const [selected, setSelected] = useState(defaultValue ?? sessions[0]?.id);
    const requested = value ?? selected;
    const active =
      sessions.find((session) => session.id === requested) ?? sessions[0];
    const activeId = active?.id;
    const handles = useRef(new Map<string, TerminalHandle>());
    useImperativeHandle(
      ref,
      () => ({ getSession: (id) => handles.current.get(id) }),
      [],
    );
    useEffect(() => {
      if (value === undefined && selected !== activeId) setSelected(activeId);
    }, [value, selected, activeId]);

    return (
      <Panel
        {...surface}
        {...{ variant, tone, padding }}
        flexBody
        scrollable={false}
        style={{
          height,
          ...({
            "--terminal-tab-color": `var(--color-${tone}-600)`,
            "--terminal-tab-text": `var(--color-${tone}-800)`,
            "--terminal-tab-text-dark": `var(--color-${tone}-200)`,
          } as CSSProperties),
          ...style,
        }}
      >
        <div className="flex h-full min-h-0 flex-1 flex-col">
          <div className="flex shrink-0 items-start gap-2 border-b border-neutral-200 dark:border-neutral-700">
            <div className="min-w-0 flex-1" role="group" aria-label={ariaLabel}>
              <Tabs
                size="sm"
                className="kit-terminal-tabs font-mono"
                variant="minimal"
                color={tone}
                value={active ? `${prefix}-${active.id}` : undefined}
                items={sessions.map((session) => ({
                  id: `${prefix}-${session.id}`,
                  label: session.label,
                  icon: session.icon,
                  trailingAction:
                    onClose && session.closable !== false ? (
                      <IconButton
                        icon={<Close style={{ width: 12, height: 12 }} />}
                        size="xs"
                        customSizeClass="h-5 w-5"
                        rounded="md"
                        className="kit-terminal-tab-close"
                        data-selected={session.id === activeId}
                        variant="ghost"
                        color={tone}
                        srLabel={`${closeLabel}: ${session.label}`}
                        tooltip={closeLabel}
                        onClick={() => onClose(session.id)}
                      />
                    ) : undefined,
                }))}
                onChange={(id) => {
                  const session = sessions.find(
                    (item) => `${prefix}-${item.id}` === id,
                  );
                  if (!session) return;
                  if (value === undefined) setSelected(session.id);
                  onValueChange?.(session.id);
                }}
              />
            </div>
            {onAdd && (
              <IconButton
                icon={<Add />}
                size="xs"
                variant="ghost"
                color={tone}
                srLabel={addLabel}
                tooltip={addLabel}
                className="mt-0.5"
                onClick={onAdd}
              />
            )}
            {active?.metadata != null && (
              <span className="mt-2 shrink-0 text-xs text-neutral-500 dark:text-neutral-400">
                {active.metadata}
              </span>
            )}
          </div>
          <div className="min-h-0 flex-1 pt-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                role="tabpanel"
                aria-labelledby={`tab-${prefix}-${session.id}`}
                hidden={session.id !== activeId}
                className={
                  session.id === activeId ? "h-full min-h-0" : "hidden"
                }
              >
                <TerminalViewport
                  ref={(handle) => {
                    if (handle) handles.current.set(session.id, handle);
                    else handles.current.delete(session.id);
                  }}
                  active={session.id === activeId}
                  initialData={session.initialData}
                  readOnly={session.readOnly ?? readOnly}
                  {...{ scheme, terminalTheme, options }}
                  ariaLabel={session.label}
                  onData={(data) => onData?.(session.id, data)}
                  onResize={(size) => onResize?.(session.id, size)}
                  onReady={(handle) => onReady?.(session.id, handle)}
                  onError={(error) => onError?.(session.id, error)}
                  onDispose={() => onDispose?.(session.id)}
                />
              </div>
            ))}
            {sessions.length === 0 && (
              <div className="flex h-full items-center justify-center text-sm text-neutral-500 dark:text-neutral-400">
                {emptyState}
              </div>
            )}
          </div>
        </div>
      </Panel>
    );
  },
);
export default TerminalTabs;
