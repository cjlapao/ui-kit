import { useState } from "react";
import { Panel } from "@cjlapao/ui-kit";

/**
 * What each card is answering: does the card fire, do its own controls still
 * fire, and can the keyboard reach it. The readout is the point — clicking a
 * control must log the control, never the card.
 */
const Readout = ({ fired }: { fired: string }) => (
  <p className="text-xs text-neutral-500 dark:text-neutral-400">
    <span className="font-medium text-neutral-700 dark:text-neutral-200">
      Last
    </span>{" "}
    <code className="font-mono">{fired}</code>
  </p>
);

export default function Clickable() {
  const [card, setCard] = useState("nothing yet");
  const [withControls, setWithControls] = useState("nothing yet");
  const [surfaceOnly, setSurfaceOnly] = useState("nothing yet");
  const [starred, setStarred] = useState(0);

  return (
    <div className="grid w-full gap-4 lg:grid-cols-2">
      <Panel
        title="Deploy queue"
        subtitle="The card is one action"
        padding="sm"
        onClick={() => setCard("card activated")}
        actions={[
          {
            label: "Archive",
            size: "sm",
            variant: "outline",
            color: "rose",
            onClick: () => setCard("Archive pressed — the card stayed quiet"),
          },
        ]}
      >
        <p>
          Tab to this card and press Enter: it is a real button, so the keyboard
          activates it. Press <code className="font-mono">Archive</code> instead
          and only the action fires — a click that lands on a control belongs to
          that control.
        </p>
        <Readout fired={card} />
      </Panel>

      <Panel
        title="Release notes"
        subtitle="The body owns the interaction"
        padding="sm"
        onClick={() => setWithControls("card activated")}
      >
        <p>
          A card holding a form. Clicking the field, or the button below it,
          must not activate the card — and this is the shape the dev console
          warns about, because a card announced as one button swallows the
          controls inside it. When the body owns the interaction, pass{" "}
          <code className="font-mono">clickable={"{false}"}</code> as the next
          card does.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            aria-label="Release tag"
            placeholder="v2.4.0"
            className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
          <button
            type="button"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white"
            onClick={() =>
              setWithControls("Save pressed — the card stayed quiet")
            }
          >
            Save
          </button>
          {/* A real control, so the guard's selector finds it and the card
              stays quiet. It started life as a bare `span` with an onClick —
              which is the shape that needs the escape hatch below, and the
              shape that fails a keyboard. */}
          <button
            type="button"
            aria-pressed={starred % 2 === 1}
            aria-label="Star this release"
            className="cursor-pointer select-none rounded text-lg leading-none"
            onClick={() =>
              setStarred((n) => {
                setWithControls(
                  `star toggled to ${n + 1} — the card stayed quiet`,
                );
                return n + 1;
              })
            }
          >
            {starred % 2 === 0 ? "☆" : "★"}
          </button>
          {/* The case the selector genuinely cannot see: a `label` is not a
              control, so clicking its *text* — the part most people hit —
              would bubble into the card. It marks itself instead. Remove the
              attribute and clicking the word starts firing the card too. */}
          <label
            data-panel-no-click
            className="flex cursor-pointer items-center gap-1 text-xs text-neutral-500 select-none"
          >
            <input type="checkbox" className="h-3.5 w-3.5" />
            Notify
          </label>
        </div>
        <Readout fired={withControls} />
      </Panel>

      <Panel
        title="Audit log"
        subtitle="clickable={false}"
        padding="sm"
        clickable={false}
        onClick={() => setSurfaceOnly("card activated (no button semantics)")}
      >
        <p>
          Still clickable, still guarded — but not a button: no{" "}
          <code className="font-mono">role</code>, and Tab walks straight past
          it. Use this when the card has no single action to name.
        </p>
        <Readout fired={surfaceOnly} />
      </Panel>

      <Panel
        title="Retired service"
        subtitle="disabled"
        padding="sm"
        onClick={() => setCard("this should never happen")}
        disabled
      >
        <p>
          A disabled card keeps its shape but stops being a control: no tab
          stop, no activation, and the cursor says so.
        </p>
        <Readout fired="not activatable" />
      </Panel>
    </div>
  );
}
