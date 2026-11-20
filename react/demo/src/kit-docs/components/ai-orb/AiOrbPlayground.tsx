import { useState } from "react";
import {
  AI_ORB_PRESETS,
  AiOrb,
  Button,
  Input,
  type AiOrbPreset,
  type AiOrbQuality,
  type AiOrbState,
} from "@cjlapao/ui-kit";
import {
  ChoiceControl,
  Control,
  PlaygroundPanel,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  aiOrbPresetOptions,
  aiOrbQualityOptions,
  aiOrbStateOptions,
} from "../../shared/options";
import { useDemoAudio } from "./useDemoAudio";

const COLOR_KEYS = ["coreColor", "accentColor", "glowColor"] as const;
const COLOR_LABELS: Record<(typeof COLOR_KEYS)[number], string> = {
  coreColor: "Core",
  accentColor: "Accent",
  glowColor: "Glow",
};

export function AiOrbPlayground() {
  const [preset, setPreset] = useState<AiOrbPreset>("solar");
  const [state, setState] = useState<AiOrbState>("speaking");
  const [quality, setQuality] = useState<AiOrbQuality>("balanced");
  const [size, setSize] = useState(360);
  const [glow, setGlow] = useState(0.7);
  const [motion, setMotion] = useState(0.75);
  const [definition, setDefinition] = useState(1);
  const [colors, setColors] = useState(AI_ORB_PRESETS.solar);
  const [paused, setPaused] = useState(false);
  const audio = useDemoAudio();

  /** A preset is a full look — picking one reseeds every appearance field. */
  function choosePreset(value: AiOrbPreset) {
    const base = AI_ORB_PRESETS[value];
    setPreset(value);
    setColors(base);
    setGlow(base.glow);
    setMotion(base.motionIntensity);
    setDefinition(base.definition);
  }

  return (
    <PlaygroundPanel
      // The orb lives on its own dark stage; the shared image/gradient
      // backdrop would only fight the glow.
      hideBackgroundToggle
      previewClassName="items-center"
      controls={
        <>
          <ControlAccordion
            groups={[
              {
                id: "presence",
                title: "Presence",
                defaultOpen: true,
                controls: (
                  <>
                    <ChoiceControl
                      label="Preset"
                      options={aiOrbPresetOptions}
                      value={preset}
                      onChange={(value) => choosePreset(value as AiOrbPreset)}
                    />
                    <ChoiceControl
                      label="State"
                      options={aiOrbStateOptions}
                      value={state}
                      onChange={(value) => setState(value as AiOrbState)}
                    />
                    <ChoiceControl
                      label="Quality"
                      options={aiOrbQualityOptions}
                      value={quality}
                      onChange={(value) =>
                        setQuality(value as AiOrbQuality)
                      }
                    />
                    <ToggleRow
                      label="Pause animation"
                      checked={paused}
                      onChange={setPaused}
                    />
                  </>
                ),
              },
              {
                id: "size",
                title: "Size & motion",
                controls: (
                  <>
                    <Control label={`Size — ${size}px`}>
                      <input
                        type="range"
                        min={48}
                        max={640}
                        step={8}
                        value={size}
                        onChange={(event) => setSize(Number(event.target.value))}
                        className="w-full accent-blue-500"
                        aria-label="Orb size"
                      />
                    </Control>
                    <Control label={`Glow — ${Math.round(glow * 100)}%`}>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={glow}
                        onChange={(event) => setGlow(Number(event.target.value))}
                        className="w-full accent-blue-500"
                        aria-label="Glow"
                      />
                    </Control>
                    <Control
                      label={`Motion intensity — ${Math.round(motion * 100)}%`}
                    >
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={motion}
                        onChange={(event) =>
                          setMotion(Number(event.target.value))
                        }
                        className="w-full accent-blue-500"
                        aria-label="Motion intensity"
                      />
                    </Control>
                    <Control
                      label={`Compact definition — ${Math.round(
                        definition * 100,
                      )}%`}
                    >
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={definition}
                        onChange={(event) =>
                          setDefinition(Number(event.target.value))
                        }
                        className="w-full accent-blue-500"
                        aria-label="Compact definition"
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "colors",
                title: "Colors",
                controls: (
                  <div className="flex flex-col gap-3">
                    {COLOR_KEYS.map((key) => (
                      <Control key={key} label={`${COLOR_LABELS[key]} color`}>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={colors[key]}
                            onChange={(event) =>
                              setColors({ ...colors, [key]: event.target.value })
                            }
                            className="h-9 w-14 cursor-pointer rounded border border-neutral-300 bg-transparent p-1 dark:border-neutral-600"
                            aria-label={`${COLOR_LABELS[key]} color`}
                          />
                          <span className="font-mono text-sm opacity-70">
                            {colors[key]}
                          </span>
                        </div>
                      </Control>
                    ))}
                  </div>
                ),
              },
              {
                id: "audio",
                title: "Audio",
                controls: (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        color="neutral"
                        onClick={() => void audio.simulate()}
                      >
                        Simulate audio
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="neutral"
                        onClick={() => {
                          setState("listening");
                          void audio.microphone();
                        }}
                      >
                        Start microphone
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="neutral"
                        onClick={audio.stop}
                      >
                        Stop audio
                      </Button>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      The application owns permissions, tracks and playback —
                      the orb only borrows the source. Active source:{" "}
                      {audio.mode}.
                    </p>
                    {audio.error && (
                      <p
                        role="alert"
                        className="text-sm text-red-600 dark:text-red-400"
                      >
                        {audio.error}
                      </p>
                    )}
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Below 240px, definition strengthens waves and flares, enlarges the
            core, and softens surrounding glow. Zero restores proportional
            scaling.
          </p>
          <Control label="Independent input">
            <Input
              size="sm"
              placeholder="Try typing while the orb animates — uncontrolled"
            />
          </Control>
          <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
            Balanced: 30 FPS, 1.5× pixel density, 16 particles. Hidden or
            offscreen orbs pause. Reduced motion keeps a static visual.
          </p>
        </>
      }
      preview={
        <div className="flex min-h-[450px] w-full flex-col items-center justify-center gap-3 rounded-lg bg-[radial-gradient(ellipse_at_50%_50%,#18202a,#080d14_75%)] px-6 py-8">
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            A presence inside the machine
          </div>
          <AiOrb
            state={state}
            preset={preset}
            size={size}
            quality={quality}
            paused={paused}
            audioSource={audio.source}
            appearance={{
              ...colors,
              glow,
              motionIntensity: motion,
              definition,
            }}
            label={`Assistant ${state}`}
            onAudioError={(error) => audio.setError(error.message)}
          />
          <div
            className="text-[11px] uppercase tracking-[0.24em]"
            style={{ color: colors.accentColor }}
          >
            {paused ? "Paused" : state}
          </div>
        </div>
      }
    />
  );
}
