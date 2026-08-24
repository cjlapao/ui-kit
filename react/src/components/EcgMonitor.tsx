import classNames from "classnames";
import React, { useEffect, useRef } from "react";

export type EcgMonitorState = "healthy" | "warning" | "unhealthy";

export const ECG_STATE_COLORS: Record<EcgMonitorState, string> = {
  healthy: "#4ade80",
  warning: "#fbbf24",
  unhealthy: "#ef4444",
};

const SAMPLE_RATE = 500;
const PX_PER_SECOND = 120;
const MIN_BPM = 20;
const MAX_BPM = 240;

const BEAT_WAVES = [
  { center: 0.16, sigma: 0.035, amplitude: 0.14 },
  { center: 0.225, sigma: 0.012, amplitude: -0.09 },
  { center: 0.245, sigma: 0.016, amplitude: 1 },
  { center: 0.27, sigma: 0.016, amplitude: -0.28 },
  { center: 0.42, sigma: 0.07, amplitude: 0.28 },
] as const;

const gaussian = (phase: number, center: number, sigma: number): number => {
  const d = phase - center;
  return Math.exp(-(d * d) / (2 * sigma * sigma));
};

const baselineNoise = (tMs: number): number => {
  const t = tMs / 1000;
  return (
    0.035 * Math.sin(2 * Math.PI * 0.7 * t + 1.3) +
    0.03 * Math.sin(2 * Math.PI * 9.3 * t + 4.2) +
    0.02 * Math.sin(2 * Math.PI * 17.7 * t + 2.1) +
    0.012 * Math.sin(2 * Math.PI * 29.3 * t + 0.6)
  );
};

export const sampleEcg = (
  phase: number,
  state: EcgMonitorState,
  tMs = 0,
): number => {
  if (state === "unhealthy") return 0;
  let value = 0;
  for (const wave of BEAT_WAVES) {
    value += wave.amplitude * gaussian(phase, wave.center, wave.sigma);
  }
  if (state === "warning") value += baselineNoise(tMs);
  return value;
};

export interface EcgMonitorProps
  extends React.HTMLAttributes<HTMLCanvasElement> {
  state?: EcgMonitorState;
  width?: number;
  height?: number;
  lineColor?: string;
  lineGlowIntensity?: number;
  lineWidth?: number;
  useFullWidth?: boolean;
  bpm?: number;
  showGrid?: boolean;
}

const EcgMonitor = React.forwardRef<HTMLCanvasElement, EcgMonitorProps>(
  (
    {
      state = "healthy",
      width = 600,
      height = 160,
      lineColor,
      lineGlowIntensity = 0.6,
      lineWidth = 2,
      useFullWidth = false,
      bpm = 60,
      showGrid = false,
      className,
      ...rest
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const setRefs = (node: HTMLCanvasElement | null) => {
      canvasRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const propsRef = useRef({
      state,
      lineColor,
      lineGlowIntensity,
      lineWidth,
      bpm,
      showGrid,
    });
    propsRef.current = {
      state,
      lineColor,
      lineGlowIntensity,
      lineWidth,
      bpm,
      showGrid,
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");

      let disposed = false;
      let rafId = 0;
      let lastTs = 0;
      let simMs = 0;
      let written = 0;
      let widthCss = 0;
      let heightCss = 0;
      let dpr = 1;
      let buffer = new Float32Array(0);
      let head = 0;

      const reduceMotion =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const sampleAt = (tMs: number): number => {
        const props = propsRef.current;
        const clampedBpm = Math.min(MAX_BPM, Math.max(MIN_BPM, props.bpm));
        const beatMs = 60000 / clampedBpm;
        const wrapped = ((tMs % beatMs) + beatMs) % beatMs;
        return sampleEcg(wrapped / beatMs, props.state, tMs);
      };

      const draw = () => {
        if (!ctx || !widthCss || !heightCss || buffer.length < 2) return;
        const props = propsRef.current;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, widthCss, heightCss);
        const color =
          props.lineColor ??
          ECG_STATE_COLORS[props.state] ??
          ECG_STATE_COLORS.healthy;
        const glow = Math.min(1, Math.max(0, props.lineGlowIntensity));
        const coreWidth = Math.min(8, Math.max(0.5, props.lineWidth));

        if (props.showGrid) {
          const minor = PX_PER_SECOND / 25;
          const major = minor * 5;
          ctx.save();
          ctx.lineWidth = 1;
          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.05;
          ctx.beginPath();
          for (let x = minor; x < widthCss; x += minor) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, heightCss);
          }
          for (let y = minor; y < heightCss; y += minor) {
            ctx.moveTo(0, y);
            ctx.lineTo(widthCss, y);
          }
          ctx.stroke();
          ctx.globalAlpha = 0.12;
          ctx.beginPath();
          for (let x = major; x < widthCss; x += major) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, heightCss);
          }
          for (let y = major; y < heightCss; y += major) {
            ctx.moveTo(0, y);
            ctx.lineTo(widthCss, y);
          }
          ctx.stroke();
          ctx.restore();
        }

        const size = buffer.length;
        const step = widthCss / size;
        const midY = heightCss * 0.55;
        const amplitude = heightCss * 0.34;

        const tracePath = () => {
          ctx.beginPath();
          for (let i = 0; i < size; i++) {
            const value = buffer[(head + i) % size];
            const x = i * step;
            const y = midY - value * amplitude;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
        };

        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        if (glow > 0) {
          tracePath();
          ctx.globalAlpha = 0.28 * glow;
          ctx.strokeStyle = color;
          ctx.lineWidth = coreWidth + glow * 6;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        tracePath();
        ctx.strokeStyle = color;
        ctx.lineWidth = coreWidth;
        ctx.shadowColor = color;
        ctx.shadowBlur = glow * 20;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      const resize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        widthCss = w;
        heightCss = h;
        dpr = window.devicePixelRatio || 1;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        const displaySeconds = Math.max(2, w / PX_PER_SECOND);
        const size = Math.ceil(displaySeconds * SAMPLE_RATE) + 4;
        buffer = new Float32Array(size);
        head = 0;
        for (let i = 0; i < size; i++) {
          buffer[i] = sampleAt(((written - size + i) / SAMPLE_RATE) * 1000);
        }
        if (reduceMotion) draw();
      };

      const frame = (ts: number) => {
        if (disposed) return;
        rafId = requestAnimationFrame(frame);
        if (!lastTs) lastTs = ts;
        const dtMs = Math.min(100, ts - lastTs);
        lastTs = ts;
        if (dtMs <= 0) return;
        simMs += dtMs;
        if (!buffer.length) return;
        const target = Math.floor((simMs / 1000) * SAMPLE_RATE);
        while (written < target) {
          buffer[head] = sampleAt((written / SAMPLE_RATE) * 1000);
          head = (head + 1) % buffer.length;
          written += 1;
        }
        draw();
      };

      const observer =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => resize());
      observer?.observe(canvas);
      resize();
      if (!reduceMotion && typeof requestAnimationFrame === "function") {
        rafId = requestAnimationFrame(frame);
      }

      return () => {
        disposed = true;
        if (typeof cancelAnimationFrame === "function") {
          cancelAnimationFrame(rafId);
        }
        observer?.disconnect();
      };
    }, []);

    return (
      <canvas
        ref={setRefs}
        role="img"
        aria-label={`ECG monitor, status: ${state}`}
        className={classNames("block", useFullWidth && "w-full", className)}
        style={{
          width: useFullWidth ? "100%" : width,
          height,
        }}
        {...rest}
      />
    );
  },
);

EcgMonitor.displayName = "EcgMonitor";

export default EcgMonitor;
