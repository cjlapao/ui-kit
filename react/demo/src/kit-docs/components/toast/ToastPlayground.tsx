import React, { useState } from "react";
import {
  Button,
  Input,
  MultiToggle,
  Panel,
  Textarea,
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
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  alertIntentOptions,
  alertVariantOptions,
  controlSizeOptions,
  toastModeOptions,
  toastPositionOptions,
  trueColorOptions,
} from "../../shared/options";

/** Demo presets for the auto-dismiss window. */
const LIFE_OPTIONS: { label: string; value: string }[] = [
  { label: "5 s (default)", value: "5000" },
  { label: "2 s", value: "2000" },
  { label: "10 s", value: "10000" },
  { label: "Sticky", value: "0" },
];

const PLAYGROUND_GROUP = "toast-playground";

export const ToastPlayground: React.FC = () => (
  <ToastProvider>
    <Controls />
  </ToastProvider>
);

const Controls: React.FC = () => {
  const { toast } = useToast();
  const [intent, setIntent] = useState<AlertIntent>("success");
  const [variant, setVariant] = useState<AlertVariant>("glass");
  const [size, setSize] = useState<ControlSize>("md");
  const [position, setPosition] = useState<ToastPosition>("bottom-right");
  const [mode, setMode] = useState<ToastMode>("stacked");
  const [overrideTone, setOverrideTone] = useState(false);
  const [color, setColor] = useState<TrueColor>("emerald");
  const [life, setLife] = useState("5000");
  const [closable, setClosable] = useState(true);
  const [withProgress, setWithProgress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withActions, setWithActions] = useState(false);
  const [title, setTitle] = useState("Build 482 shipped");
  const [detail, setDetail] = useState("All 12 services are healthy.");

  const fire = () => {
    const id = toast.show({
      group: PLAYGROUND_GROUP,
      intent,
      variant,
      size,
      color: overrideTone ? color : undefined,
      title: title || undefined,
      detail: detail || undefined,
      closable,
      loading,
      progress: withProgress ? 62 : undefined,
      actions: withActions
        ? [
            {
              label: "Acknowledge",
              onClick: () => toast.close(id),
            },
          ]
        : undefined,
      life: life === "0" ? undefined : Number(life),
      sticky: life === "0",
    });
    // The viewport is immutable about its corner once mounted; re-target it
    // only when the corner changed, so a stacked deck doesn't remount (and
    // replay entries) on every raise.
    if (position !== livePosition || mode !== liveMode) {
      setLivePosition(position);
      setLiveMode(mode);
      setRetargetKey((k) => k + 1);
    }
  };

  // A viewport is immutable about its corner once mounted, so the playground
  // re-targets by remounting the corner viewport (same group, fresh element).
  const [retargetKey, setRetargetKey] = useState(0);
  const [livePosition, setLivePosition] = useState<ToastPosition>(position);
  const [liveMode, setLiveMode] = useState<ToastMode>(mode);

  return (
    <>
      <PlaygroundPanel
        controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <Control label="Intent">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={alertIntentOptions}
                        value={intent}
                        onChange={(value) => setIntent(value as AlertIntent)}
                      />
                    </Control>
                    <SelectControl
                      label="Variant"
                      options={alertVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as AlertVariant)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Control label="Size">
                        <MultiToggle
                          fullWidth
                          size="sm"
                          options={controlSizeOptions}
                          value={size}
                          onChange={(value) =>
                            setSize(value as ControlSize)
                          }
                        />
                      </Control>
                      <SelectControl
                        label="Mode"
                        options={toastModeOptions}
                        value={mode}
                        onChange={(value) => setMode(value as ToastMode)}
                      />
                    </div>
                    <SelectControl
                      label="Position"
                      options={toastPositionOptions}
                      value={position}
                      onChange={(value) =>
                        setPosition(value as ToastPosition)
                      }
                    />
                  </>
                ),
              },
              {
                id: "tone",
                title: "Tone",
                controls: (
                  <>
                    <ToggleRow
                      label="Override the intent's tone"
                      checked={overrideTone}
                      onChange={setOverrideTone}
                    />
                    {overrideTone && (
                      <SelectControl
                        label="Colour"
                        options={trueColorOptions}
                        value={color}
                        onChange={(value) => setColor(value as TrueColor)}
                      />
                    )}
                  </>
                ),
              },
              {
                id: "behavior",
                title: "Behavior",
                controls: (
                  <>
                    <SelectControl
                      label="Auto-dismiss"
                      options={LIFE_OPTIONS}
                      value={life}
                      onChange={setLife}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <ToggleRow
                        label="Closable"
                        checked={closable}
                        onChange={setClosable}
                      />
                      <ToggleRow
                        label="Progress"
                        checked={withProgress}
                        onChange={setWithProgress}
                      />
                      <ToggleRow
                        label="Loading"
                        checked={loading}
                        onChange={setLoading}
                      />
                      <ToggleRow
                        label="Actions"
                        checked={withActions}
                        onChange={setWithActions}
                      />
                    </div>
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <>
                    <Control label="Title">
                      <Input
                        size="sm"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Control>
                    <Control label="Detail">
                      <Textarea
                        size="sm"
                        rows={3}
                        value={detail}
                        onChange={(event) => setDetail(event.target.value)}
                      />
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            The toast lands in <strong>{livePosition}</strong> as{" "}
            <strong>{liveMode}</strong> — pick a new corner, then raise again.
            Fire a few to watch the deck stack; hover it to fan out.
          </p>
        </div>
      }
      preview={
        <div className="flex h-full w-full items-start justify-center p-4">
          <Panel variant="outlined" tone="neutral" padding="md">
            <div className="flex flex-col items-start gap-3">
              <Button variant="solid" color="blue" onClick={fire}>
                Show toast
              </Button>
              <span className="text-xs opacity-60">
                It appears in the corner of the page, not here — toasts are
                fixed-position and escape the page content on purpose.
              </span>
            </div>
          </Panel>
        </div>
        }
      />
      {/*
        The corner viewport is remounted when the position/mode change so the
        raise always lands where the controls say.
      */}
      <ToastViewport
        key={`vp-${retargetKey}-${livePosition}`}
        group={PLAYGROUND_GROUP}
        position={livePosition}
        mode={liveMode}
      />
    </>
  );
};
