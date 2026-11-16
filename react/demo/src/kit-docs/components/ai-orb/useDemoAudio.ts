import { useCallback, useEffect, useRef, useState } from "react";
import type { AiOrbAudioSource } from "@cjlapao/ui-kit";

/** Demo owns permissions and its resources; AiOrb only borrows the source. */
export function useDemoAudio() {
  const [source, setSource] = useState<AiOrbAudioSource | null>(null);
  const [mode, setMode] = useState("Ambient only");
  const [error, setError] = useState("");
  const resource = useRef<{ context?: AudioContext; stream?: MediaStream } | null>(null);
  const generation = useRef(0);
  const release = useCallback(() => {
    generation.current++;
    resource.current?.stream?.getTracks().forEach(track => track.stop());
    const context = resource.current?.context;
    if (context && context.state !== "closed") void context.close().catch(() => {});
    resource.current = null;
  }, []);
  useEffect(() => release, [release]);
  const stop = () => { release(); setSource(null); setMode("Ambient only"); };
  const microphone = async () => {
    stop(); setError(""); setMode("Requesting microphone…");
    const request = generation.current;
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone access requires a supported browser and a secure page.");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (request !== generation.current) { stream.getTracks().forEach(track => track.stop()); return; }
      resource.current = { stream }; setSource(stream); setMode("Live microphone");
    } catch (cause) {
      if (request !== generation.current) return;
      setError(cause instanceof Error ? cause.message : String(cause)); setMode("Ambient only");
    }
  };
  const simulate = async () => {
    stop(); setError("");
    const request = generation.current;
    try {
      const context = new AudioContext(); resource.current = { context };
      const analyser = context.createAnalyser(); analyser.fftSize = 256;
      const voice = context.createOscillator(); voice.frequency.value = 170;
      const envelope = context.createGain(); envelope.gain.value = 0.13;
      const modulation = context.createOscillator(); modulation.frequency.value = 2.7;
      const depth = context.createGain(); depth.gain.value = 0.12;
      modulation.connect(depth).connect(envelope.gain);
      voice.connect(envelope).connect(analyser);
      // A muted sink keeps the demo graph processing without audible output.
      const mute = context.createGain(); mute.gain.value = 0;
      analyser.connect(mute).connect(context.destination);
      voice.start(); modulation.start(); await context.resume();
      if (request !== generation.current) return;
      setSource(analyser); setMode("Simulated audio · inaudible");
    } catch (cause) {
      if (request !== generation.current) return;
      release(); setError(cause instanceof Error ? cause.message : String(cause));
    }
  };
  return { source, mode, error, setError, stop, microphone, simulate };
}
