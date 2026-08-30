import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Button,
  Input,
  MultiToggle,
  Panel,
  Select,
  Textarea,
  Toggle,
  ToastProvider,
  ToastViewport,
  useToast,
  ALERT_INTENTS,
  ALERT_INTENT_CONFIG,
  type AlertIntent,
  type AlertVariant,
  type ControlSize,
  type ToastMode,
  type ToastPosition,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  toastModeOptions,
  toastPositionOptions,
  trueColorOptions,
} from "../constants";

const DEMO_GROUP = "ux-demo-toast";

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const Caption: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
    {children}
  </span>
);

export const ToastDemo: React.FC = () => (
  <ToastProvider>
    <Body />
  </ToastProvider>
);

const Body: React.FC = () => {
  const { toast } = useToast();
  const [intent, setIntent] = useState<AlertIntent>("success");
  const [variant, setVariant] = useState<AlertVariant>("glass");
  const [size, setSize] = useState<ControlSize>("md");
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const [mode, setMode] = useState<ToastMode>("stacked");
  const [overrideTone, setOverrideTone] = useState(false);
  const [color, setColor] = useState<TrueColor>("emerald");
  const [sticky, setSticky] = useState(false);
  const [withProgress, setWithProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withActions, setWithActions] = useState(false);
  const [title, setTitle] = useState("Build 482 shipped");
  const [description, setDescription] = useState(
    "All 12 services are healthy.",
  );

  // A viewport is immutable about its corner once mounted, so the raise
  // re-targets it by remounting (same group, fresh element).
  const [livePosition, setLivePosition] = useState<ToastPosition>("bottom-right");
  const [liveMode, setLiveMode] = useState<ToastMode>("stacked");
  const [retargetKey, setRetargetKey] = useState(0);

  const raise = (extra?: Partial<Parameters<typeof toast.show>[0]>) => {
    toast.show({
      group: DEMO_GROUP,
      intent,
      variant,
      size,
      color: overrideTone ? color : undefined,
      title: title || undefined,
      detail: description || undefined,
      sticky,
      loading,
      progress: withProgress ? 62 : undefined,
      actions: withActions
        ? [
            {
              label: "Acknowledge",
              onClick: () => {},
            },
          ]
        : undefined,
      ...extra,
    });
    // Re-target the corner viewport only when the corner actually changed —
    // otherwise the deck's cards would replay their entry on every raise.
    if (position !== livePosition || mode !== liveMode) {
      setLivePosition(position);
      setLiveMode(mode);
      setRetargetKey((key) => key + 1);
    }
  };

  const raiseDeck = () => {
    raise({ intent: "info", title: "Job queued", detail: "worker-3" });
    raise({ intent: "success", title: "Queue accepted" });
    raise({ intent: "warning", title: "Slow worker detected", detail: "p95 > 4s" });
    raise({ intent: "danger", title: "Worker timeout", detail: "job 88121" });
  };

  return (
    <PlaygroundSection
      title="Toasts"
      label="[Toast]"
      description="Corner-pinned notifications on the alert-family surface. The newest toast sits in front, older ones peek out behind it as a clipped deck — hover the deck and it fans out. Life timers pause while the deck is engaged, and any card can be swiped away."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Intent">
              <MultiToggle
                fullWidth
                size="sm"
                options={alertIntentOptions}
                value={intent}
                onChange={(value) => setIntent(value as AlertIntent)}
              />
            </Field>
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as AlertVariant)
                }
              >
                {alertVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={controlSizeOptions}
                value={size}
                onChange={(value) => setSize(value as ControlSize)}
              />
            </Field>
            <Field label="Position">
              <Select
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value as ToastPosition)
                }
              >
                {toastPositionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Mode">
              <Select
                value={mode}
                onChange={(event) => setMode(event.target.value as ToastMode)}
              >
                {toastModeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Override the intent's tone">
              <Toggle
                size="sm"
                label={overrideTone ? "Using colour" : "Using intent"}
                checked={overrideTone}
                onChange={(event) => setOverrideTone(event.target.checked)}
              />
            </Field>
            <Field label="Colour">
              <Select
                value={color}
                disabled={!overrideTone}
                onChange={(event) => setColor(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <Input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field label="Detail">
              <Textarea
                rows={2}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
            <Toggle
              size="sm"
              label="Sticky"
              checked={sticky}
              onChange={(event) => setSticky(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Progress"
              checked={withProgress}
              onChange={(event) => setWithProgress(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Loading"
              checked={loading}
              onChange={(event) => setLoading(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Actions"
              checked={withActions}
              onChange={(event) => setWithActions(event.target.checked)}
            />
          </div>

          <p className="text-xs opacity-70">
            <strong>Intent</strong> drives the tone, the icon and the
            screen-reader politeness, exactly as in Alert —{" "}
            {ALERT_INTENTS.map((each, i) => (
              <React.Fragment key={each}>
                {i > 0 ? ", " : ""}
                {each} <code>{ALERT_INTENT_CONFIG[each].live}</code>
              </React.Fragment>
            ))}
            . Sticky removes the auto-dismiss timer. Position and mode apply
            from the next raise.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <ToastViewport
            key={`vp-${retargetKey}-${livePosition}`}
            group={DEMO_GROUP}
            position={livePosition}
            mode={liveMode}
          />
          <Panel variant="outlined" tone="neutral" padding="md">
            <div className="flex flex-col gap-2">
              <Caption>Triggers</Caption>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="solid"
                  color="blue"
                  onClick={() => raise()}
                >
                  Show one toast
                </Button>
                <Button
                  size="sm"
                  variant="soft"
                  color="violet"
                  onClick={raiseDeck}
                >
                  Raise a deck of four
                </Button>
              </div>
              <span className="text-xs opacity-60">
                The toasts appear in the page corner ({position}, {mode}) —
                hover the deck to fan it out, press and drag a card to swipe
                it away.
              </span>
            </div>
          </Panel>
        </div>
      }
    />
  );
};
