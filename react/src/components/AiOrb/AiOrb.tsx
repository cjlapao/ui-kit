import { memo, useEffect, useRef, type CSSProperties } from "react";
import { createOrbRenderer } from "../../../../common/aiOrb/renderer";
import { createOrbAudio, type AiOrbAudioSource, type OrbAudio } from "../../../../common/aiOrb/audio";
import { AI_ORB_QUALITY, resolveAppearance, type AiOrbAppearance, type AiOrbPreset, type AiOrbQuality, type AiOrbState } from "../../../../common/aiOrb/model";

export interface AiOrbProps {
  state?: AiOrbState;
  preset?: AiOrbPreset;
  appearance?: AiOrbAppearance;
  /** Borrowed audio resource. Never requests microphone access or plays audio. */
  audioSource?: AiOrbAudioSource | null;
  size?: number;
  quality?: AiOrbQuality;
  paused?: boolean;
  label?: string;
  onAudioError?: (error: Error) => void;
  className?: string;
  style?: CSSProperties;
}

/** Audio-reactive presence. Animation never updates React state. */
export const AiOrb = memo(function AiOrb({
  state = "idle", preset = "solar", appearance, audioSource, size = 240,
  quality = "balanced", paused = false, label, onAudioError, className, style,
}: AiOrbProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const audio = useRef<OrbAudio | undefined>(undefined);
  const options = useRef({ state, preset, quality, appearance, paused });
  const errorHandler = useRef(onAudioError);
  const wake = useRef<(() => void) | undefined>(undefined);
  useEffect(() => { errorHandler.current = onAudioError; }, [onAudioError]);
  useEffect(() => {
    options.current = { state, preset, quality, appearance, paused };
    wake.current?.();
  }, [state, preset, quality, appearance, paused, size, style]);
  useEffect(() => {
    if (!audioSource) return;
    const adapter = createOrbAudio(audioSource, error => errorHandler.current?.(error));
    audio.current = adapter;
    return () => { adapter.dispose(); if (audio.current === adapter) audio.current = undefined; };
  }, [audioSource]);
  useEffect(() => {
    const node = canvas.current;
    if (!node) return;
    const renderer = createOrbRenderer(node, options.current);
    if (!renderer) return;
    let frame: number | undefined;
    let last: number | undefined;
    let visible = true;
    let disposed = false;
    const media = typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : undefined;
    let reduced = media?.matches ?? false;
    const canAnimate = () => !disposed && !document.hidden && visible && !reduced && !options.current.paused
      && typeof requestAnimationFrame === "function" && typeof IntersectionObserver !== "undefined" && typeof ResizeObserver !== "undefined";
    const resize = () => renderer.resize(node.getBoundingClientRect().width || node.clientWidth || 240, window.devicePixelRatio || 1);
    const tick = (timestamp: number) => {
      frame = undefined;
      if (!canAnimate()) return;
      const interval = 1000 / AI_ORB_QUALITY[options.current.quality].fps;
      if (last === undefined || timestamp - last >= interval - 0.5) {
        renderer.draw(last === undefined ? interval / 1000 : (timestamp - last) / 1000, true, audio.current);
        last = timestamp;
      }
      frame = requestAnimationFrame(tick);
    };
    const refresh = () => {
      if (disposed) return;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined; last = undefined;
      renderer.update(options.current); resize();
      renderer.draw(0, canAnimate());
      if (canAnimate()) frame = requestAnimationFrame(tick);
    };
    wake.current = refresh;
    const motionChanged = () => { reduced = media?.matches ?? false; refresh(); };
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(refresh) : undefined;
    const intersection = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry) { visible = entry.isIntersecting; refresh(); }
    }) : undefined;
    resizeObserver?.observe(node); intersection?.observe(node);
    if (!resizeObserver) window.addEventListener("resize", refresh);
    media?.addEventListener?.("change", motionChanged);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      disposed = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      wake.current = undefined;
      resizeObserver?.disconnect(); intersection?.disconnect();
      window.removeEventListener("resize", refresh);
      media?.removeEventListener?.("change", motionChanged);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const colors = resolveAppearance(preset, appearance);
  const safeSize = Number.isFinite(size) && size > 0 ? size : 240;
  return (
    <span className={className} role={label ? "img" : undefined} aria-label={label || undefined} aria-hidden={label ? undefined : true}
      style={{ display: "inline-block", width: safeSize, maxWidth: "100%", aspectRatio: "1", position: "relative", verticalAlign: "middle", ...style }}>
      <span aria-hidden="true" style={{ position: "absolute", inset: "34%", borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, ${colors.coreColor}, ${colors.glowColor} 85%, ${colors.accentColor})` }} />
      <canvas ref={canvas} tabIndex={-1} aria-hidden="true" style={{ display: "block", position: "relative", width: "100%", height: "100%" }} />
    </span>
  );
});
