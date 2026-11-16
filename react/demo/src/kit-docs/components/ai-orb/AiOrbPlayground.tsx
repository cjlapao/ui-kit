import { useState } from "react";
import { AiOrb, AI_ORB_PRESETS, type AiOrbPreset, type AiOrbQuality, type AiOrbState } from "@cjlapao/ui-kit";
import { useDemoAudio } from "./useDemoAudio";

const control = "w-full rounded-md border border-neutral-300 bg-white p-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";
const button = "rounded-md border border-neutral-400 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800";

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
  function choosePreset(value: AiOrbPreset) {
    setPreset(value); setColors(AI_ORB_PRESETS[value]); setGlow(AI_ORB_PRESETS[value].glow); setMotion(AI_ORB_PRESETS[value].motionIntensity); setDefinition(AI_ORB_PRESETS[value].definition);
  }
  return <section className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" }}>
      <div style={{ background: "radial-gradient(ellipse at 50% 50%, #18202a, #080d14 75%)", minHeight: 450, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
        <div style={{ color: "#9aa8b8", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>A presence inside the machine</div>
        <AiOrb state={state} preset={preset} size={size} quality={quality} paused={paused} audioSource={audio.source}
          appearance={{ ...colors, glow, motionIntensity: motion, definition }} label={`Assistant ${state}`} onAudioError={error => audio.setError(error.message)} />
        <div style={{ color: colors.accentColor, letterSpacing: "0.24em", fontSize: 11, textTransform: "uppercase" }}>{paused ? "Paused" : state}</div>
        <p style={{ color: "#9aa8b8", fontSize: 12, marginTop: 12 }}>{audio.mode}</p>
      </div>
      <div className="flex flex-col gap-4 p-6">
        <h2 className="text-base font-semibold">Personalize your presence</h2>
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm">Preset<select className={control} value={preset} onChange={e => choosePreset(e.target.value as AiOrbPreset)}>{["solar", "ion", "ember"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm">State<select className={control} value={state} onChange={e => setState(e.target.value as AiOrbState)}>{["idle", "listening", "speaking"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm">Quality<select className={control} value={quality} onChange={e => setQuality(e.target.value as AiOrbQuality)}>{["low", "balanced", "high"].map(value => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm">Size · {size}px<input className="w-full" type="range" min="48" max="640" step="8" value={size} onChange={e => setSize(+e.target.value)} /></label>
        </div>
        <div className="flex flex-wrap gap-4">{(["coreColor", "accentColor", "glowColor"] as const).map((key, i) => <label key={key} className="flex flex-col gap-1 text-xs">{["Core color", "Accent color", "Glow color"][i]}<input type="color" value={colors[key]} onChange={e => setColors({ ...colors, [key]: e.target.value })} /></label>)}</div>
        <label className="text-sm">Glow · {Math.round(glow * 100)}%<input className="w-full" type="range" min="0" max="1" step="0.01" value={glow} onChange={e => setGlow(+e.target.value)} /></label>
        <label className="text-sm">Motion intensity · {Math.round(motion * 100)}%<input className="w-full" type="range" min="0" max="1" step="0.01" value={motion} onChange={e => setMotion(+e.target.value)} /></label>
        <label className="text-sm">Compact definition · {Math.round(definition * 100)}%<input className="w-full" type="range" min="0" max="1" step="0.01" value={definition} onChange={e => setDefinition(+e.target.value)} /></label>
        <p className="text-xs text-neutral-500">Below 240px, definition strengthens waves and flares, enlarges the core, and softens surrounding glow. Zero restores proportional scaling.</p>
        <label className="flex gap-2 text-sm"><input type="checkbox" checked={paused} onChange={e => setPaused(e.target.checked)} />Pause animation</label>
        <div className="flex flex-wrap gap-2">
          <button className={button} onClick={() => void audio.simulate()}>Simulate audio</button>
          <button className={button} onClick={() => { setState("listening"); void audio.microphone(); }}>Start microphone</button>
          <button className={button} onClick={audio.stop}>Stop audio</button>
        </div>
        {audio.error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{audio.error}</p>}
        <label className="text-sm">Try typing while the orb animates<input className={control} placeholder="An independent, uncontrolled input" /></label>
        <p className="text-xs text-neutral-500">Balanced: 30 FPS, 1.5× pixel density, 16 particles. Hidden or offscreen orbs pause. Reduced motion keeps a static visual.</p>
      </div>
    </div>
  </section>;
}
