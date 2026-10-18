import React, { useState } from "react";
import { Button, Panel, Popover } from "@cjlapao/ui-kit";

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
    {children}
  </span>
);

const Controlled = () => {
  const [visible, setVisible] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const note = (entry: string) =>
    setEvents((previous) => [entry, ...previous].slice(0, 5));

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Popover
          visible={visible}
          onOpenChange={setVisible}
          onShow={() => note("onShow")}
          onHide={() => note("onHide")}
          trigger={<Button color="blue" size="sm">Toggle (trigger)</Button>}
          variant="elevated"
          tone="blue"
        >
          <p className="text-xs leading-5">
            Fully controlled: <code className="font-mono">visible</code> is
            owned by the parent, and <code className="font-mono">onOpenChange</code>{" "}
            is how the trigger and dismissal ask to change it.
          </p>
        </Popover>
        <Button
          color="neutral"
          size="sm"
          variant="outline"
          onClick={() => setVisible(true)}
          disabled={visible}
        >
          Open
        </Button>
        <Button
          color="neutral"
          size="sm"
          variant="outline"
          onClick={() => setVisible(false)}
          disabled={!visible}
        >
          Close
        </Button>
      </div>
      <Panel variant="outlined" padding="sm">
        <div className="flex flex-col gap-1.5">
          <Caption>Events</Caption>
          {events.length === 0 ? (
            <p className="text-xs opacity-70">
              Interact above — the trigger, an outside click and Escape all
              ask through onOpenChange; onShow / onHide report the actual
              lifecycle.
            </p>
          ) : (
            <ul className="flex flex-wrap gap-1.5">
              {events.map((entry, index) => (
                <li
                  key={`${entry}-${index}`}
                  className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800"
                >
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </div>
  );
};

export default Controlled;
