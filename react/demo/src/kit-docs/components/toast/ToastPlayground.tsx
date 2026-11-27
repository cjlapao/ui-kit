import React, { createContext, useContext, useState } from "react";
import {
  Button,
  Panel,
  ToastProvider,
  ToastViewport,
  useToast,
  type AlertIntent,
  type AlertVariant,
  type ControlSize,
  type ToastMode,
  type ToastPosition,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import {
  PLAYGROUND_PROGRESS,
  TOAST_PLAYGROUND_GROUP,
  toastCode,
  toastConfig,
} from "./toastPlayground";

/**
 * Toast's playground.
 *
 * The options are a config (see `toastPlayground.ts`); what lives here is the
 * two pieces of state a toast cannot be declarative about:
 *
 *   - **Raising.** A toast is imperative — `toast.show` is a call, not an
 *     element — so the raiser sits in the stage and fires through this
 *     context. It is a component rendered by `<Playground>`, which cannot
 *     take page props, hence the context rather than a closure.
 *   - **The corner.** A viewport is immutable about its corner once mounted, so
 *     changing Position or Mode re-targets it by remounting the corner
 *     viewport (same group, fresh element). That viewport is a *sibling* of the
 *     playground, not part of the stage: switching to the Code view unmounts
 *     the stage, and a deck you already raised should not vanish while you
 *     read the source that made it.
 */

interface ToastDemoApi {
  /** Raises one card with the options currently on the controls. */
  fire: () => void;
  /** Where the deck actually is, which is where the last raise said. */
  livePosition: ToastPosition;
  liveMode: ToastMode;
}

const ToastDemoContext = createContext<ToastDemoApi | null>(null);

const useToastDemo = (): ToastDemoApi => {
  const api = useContext(ToastDemoContext);
  if (!api) {
    throw new Error(
      "ToastPlayground: the raiser must render inside the demo provider.",
    );
  }
  return api;
};

export const ToastPlayground: React.FC = () => (
  <ToastProvider>
    <Controls />
  </ToastProvider>
);

const Controls: React.FC = () => {
  const playground = usePlayground(toastConfig);
  const { state } = playground;
  const { toast } = useToast();

  const [livePosition, setLivePosition] = useState<ToastPosition>("bottom-right");
  const [liveMode, setLiveMode] = useState<ToastMode>("stacked");
  const [liveGroup, setLiveGroup] = useState(true);
  const [retargetKey, setRetargetKey] = useState(0);

  const position = state.position as ToastPosition;
  const mode = state.mode as ToastMode;
  const sticky = state.life === "0";
  const grouped = state.withGroup === true;

  const fire = () => {
    const id = toast.show({
      // Both sides of the routing key move together: a grouped message never
      // reaches an ungrouped viewport.
      group: grouped ? TOAST_PLAYGROUND_GROUP : undefined,
      intent: state.intent as AlertIntent,
      variant: state.variant as AlertVariant,
      size: state.size as ControlSize,
      color: state.overrideTone ? (state.color as TrueColor) : undefined,
      title: (state.title as string) || undefined,
      detail: (state.detail as string) || undefined,
      icon: state.icon ? undefined : false,
      closable: Boolean(state.closable),
      loading: Boolean(state.loading),
      progress: state.withProgress ? PLAYGROUND_PROGRESS : undefined,
      actions: state.withActions
        ? [{ label: "Acknowledge", onClick: () => toast.close(id) }]
        : undefined,
      life: sticky ? undefined : Number(state.life),
      sticky,
    });
    // Re-target only when the corner actually moved, so a stacked deck is not
    // remounted (and does not replay its entries) on every raise. `group` is
    // part of that: a viewport cannot change its routing key live either.
    if (
      position !== livePosition ||
      mode !== liveMode ||
      grouped !== liveGroup
    ) {
      setLivePosition(position);
      setLiveMode(mode);
      setLiveGroup(grouped);
      setRetargetKey((key) => key + 1);
    }
  };

  return (
    <>
      <ToastDemoContext.Provider value={{ fire, livePosition, liveMode }}>
        <Playground
          playground={playground}
          preview={Raiser}
          code={toastCode}
          filename="Toast.tsx"
          hint={
            <p className="text-xs opacity-70">
              The toast lands in <strong>{livePosition}</strong> as{" "}
              <strong>{liveMode}</strong> at <strong>{state.width as string}</strong>{" "}
              — pick a new corner, then raise again. Fire a few to watch the deck
              stack; hover it to fan out. Width is the deck&apos;s column only: it
              changes no type and no height, which is what <strong>Size</strong>{" "}
              is for. Switch the stage to Code to read the{" "}
              <code>toast.show</code> call these settings make.
            </p>
          }
        />
      </ToastDemoContext.Provider>
      {/*
        Outside the panel on purpose: the deck survives the switch to the Code
        view, because it was never part of the stage.
      */}
      <ToastViewport
        key={`vp-${retargetKey}-${livePosition}`}
        group={liveGroup ? TOAST_PLAYGROUND_GROUP : undefined}
        position={livePosition}
        mode={liveMode}
        width={state.width as string}
      />
    </>
  );
};

/** The stage: the button that raises, and the note about where it lands. */
const Raiser: React.FC = () => {
  const { fire, livePosition, liveMode } = useToastDemo();
  return (
    <div className="flex h-full w-full items-start justify-center p-4">
      <Panel variant="outlined" tone="neutral" padding="md">
        <div className="flex flex-col items-start gap-3">
          <Button variant="solid" color="blue" onClick={fire}>
            Show toast
          </Button>
          <span className="text-xs opacity-60">
            It appears in the corner of the page, not here — toasts are
            fixed-position and escape the page content on purpose. Right now{" "}
            <strong>{livePosition}</strong> holds the deck in{" "}
            <strong>{liveMode}</strong> mode.
          </span>
        </div>
      </Panel>
    </div>
  );
};
