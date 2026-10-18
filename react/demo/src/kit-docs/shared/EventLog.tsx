import { useCallback, useRef, useState } from "react";
import { Control } from "./PlaygroundPanel";

/*
  The playground event log, shared. Introduced because interaction feedback
  was five different improvisations — a "Last clicked" sentence here, a
  `— nothing yet —` readout there, SplitView's log only in SplitView. Same
  shape everywhere now: newest first, capped, monospace rows, the same copy
  rhythm. Log what the component CALLED BACK, not control changes — the
  controls already visibly changed; the log answers "what fired?".
*/

export interface LogEntry {
  id: number;
  label: string;
}

export const useEventLog = (
  limit = 6,
): [LogEntry[], (label: string) => void] => {
  const [log, setLog] = useState<LogEntry[]>([]);
  const seq = useRef(0);
  const push = useCallback(
    (label: string) => {
      seq.current += 1;
      const entry = { id: seq.current, label };
      setLog((prev) => [entry, ...prev].slice(0, limit));
    },
    [limit],
  );
  return [log, push];
};

export const EventLogControl: React.FC<{
  log: LogEntry[];
  emptyText?: string;
}> = ({ log, emptyText = "No events yet — interact with the preview." }) => (
  <Control label="Event log">
    <ul className="space-y-1">
      {log.length === 0 && (
        <li className="text-[11px] text-neutral-400 dark:text-neutral-500">
          {emptyText}
        </li>
      )}
      {log.map((entry) => (
        <li
          key={entry.id}
          className="rounded-md bg-neutral-50 px-2 py-1 font-mono text-[11px] text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"
        >
          {entry.label}
        </li>
      ))}
    </ul>
  </Control>
);
