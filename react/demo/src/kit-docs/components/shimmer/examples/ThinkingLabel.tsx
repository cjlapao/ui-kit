import { useEffect, useRef, useState } from "react";
import { Shimmer } from "@cjlapao/ui-kit";

/**
 * The canonical use case: a chat row that shimmers "Thinking…" while the
 * answer is pending, then swaps to the static copy. Replay to run it again.
 * The shimmer carries role="status" so screen readers announce the wait.
 */
const ThinkingLabel = () => {
  const [thinking, setThinking] = useState(true);
  const [run, setRun] = useState(0);
  const timer = useRef<number>(undefined);

  useEffect(() => {
    if (!thinking) return;
    timer.current = window.setTimeout(() => setThinking(false), 2600);
    return () => window.clearTimeout(timer.current);
  }, [thinking, run]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-2.5 text-sm text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
        What does the shimmer component do?
      </div>
      <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-neutral-900 px-4 py-2.5 text-sm text-white dark:bg-neutral-200 dark:text-neutral-900">
        {thinking ? (
          <Shimmer role="status" aria-live="polite">
            Thinking…
          </Shimmer>
        ) : (
          "It sweeps a band of light across the text while a response is on its way."
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setThinking(true);
          setRun((r) => r + 1);
        }}
        className="self-end text-xs text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
      >
        Replay
      </button>
    </div>
  );
};

export default ThinkingLabel;
