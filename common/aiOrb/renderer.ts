import { AI_ORB_QUALITY, backingSize, resolveAppearance, type AiOrbAppearance, type AiOrbPreset, type AiOrbQuality, type AiOrbState } from "./model";
import type { OrbAudio } from "./audio";

export interface OrbRenderOptions {
  state: AiOrbState;
  preset: AiOrbPreset;
  quality: AiOrbQuality;
  appearance?: AiOrbAppearance;
}

/** No DOM listeners, animation scheduling, or React dependencies. */
export function createOrbRenderer(canvas: HTMLCanvasElement, options: OrbRenderOptions) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let settings = options;
  let colors = resolveAppearance(options.preset, options.appearance);
  let budget = AI_ORB_QUALITY[options.quality];
  let level = 0;
  let listen = options.state === "listening" ? 1 : 0;
  let speak = options.state === "speaking" ? 1 : 0;
  let time = 0;
  const core = document.createElement("canvas");
  const halo = document.createElement("canvas");
  core.width = core.height = 256;
  halo.width = halo.height = 480;
  const seeds = new Float32Array(24);
  for (let i = 0; i < seeds.length; i++) seeds[i] = ((i * 0.61803398875) % 1) * Math.PI * 2;
  function textures() {
    const c = core.getContext("2d"), h = halo.getContext("2d");
    if (c) {
      c.clearRect(0, 0, 256, 256);
      const g = c.createRadialGradient(92, 82, 4, 128, 128, 123);
      g.addColorStop(0, colors.coreColor);
      g.addColorStop(0.48, colors.coreColor);
      g.addColorStop(0.9, colors.glowColor);
      g.addColorStop(1, colors.accentColor);
      c.fillStyle = g;
      c.beginPath(); c.arc(128, 128, 123, 0, Math.PI * 2); c.fill();
    }
    if (h) {
      h.clearRect(0, 0, 480, 480);
      const g = h.createRadialGradient(240, 240, 60, 240, 240, 230);
      g.addColorStop(0, colors.glowColor + "70");
      g.addColorStop(0.4, colors.glowColor + "30");
      g.addColorStop(1, colors.glowColor + "00");
      h.fillStyle = g; h.fillRect(0, 0, 480, 480);
    }
  }
  textures();
  return {
    update(next: OrbRenderOptions) {
      const nextColors = resolveAppearance(next.preset, next.appearance);
      const changed = nextColors.coreColor !== colors.coreColor || nextColors.accentColor !== colors.accentColor || nextColors.glowColor !== colors.glowColor;
      settings = next; colors = nextColors; budget = AI_ORB_QUALITY[next.quality];
      if (changed) textures();
    },
    resize(size: number, dpr: number) {
      const pixels = backingSize(size, dpr, settings.quality);
      if (canvas.width !== pixels || canvas.height !== pixels) canvas.width = canvas.height = pixels;
    },
    draw(delta: number, animated: boolean, audio?: OrbAudio) {
      if (!ctx) return;
      const dt = animated ? Math.min(0.1, Math.max(0, delta)) : 0;
      time += dt * colors.motionIntensity;
      const mix = animated ? Math.min(1, dt / 0.25) : 1;
      listen += ((settings.state === "listening" ? 1 : 0) - listen) * mix;
      speak += ((settings.state === "speaking" ? 1 : 0) - speak) * mix;
      const target = animated && settings.state !== "idle" ? audio?.sample() ?? 0 : 0;
      level += (target - level) * (animated ? Math.min(1, dt * 14) : 1);
      const energy = level * colors.motionIntensity;
      const radius = 75 + Math.sin(time * 1.8) * 2 + energy * 12;
      ctx.setTransform(canvas.width / 480, 0, 0, canvas.height / 480, 0, 0);
      ctx.clearRect(0, 0, 480, 480);
      ctx.globalAlpha = colors.glow * (0.65 + energy * 0.35);
      ctx.drawImage(halo, 0, 0);
      ctx.globalAlpha = 1;
      if (listen > 0.001) {
        for (let ring = 0; ring < budget.rings; ring++) {
          ctx.beginPath();
          for (let i = 0; i <= 128; i++) {
            const angle = i / 128 * Math.PI * 2;
            // A taper joins waveform endpoints without a visible seam.
            const sample = animated ? audio?.waveform[i % 128] ?? 0 : 0;
            const wave = sample * Math.sin(angle / 2) * 40 * colors.motionIntensity;
            const r = 112 + ring * 15 + wave + Math.sin(angle * 7 + time * 2 + ring) * 3 * colors.motionIntensity;
            const x = 240 + Math.cos(angle) * r, y = 240 + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          }
          ctx.closePath(); ctx.strokeStyle = colors.accentColor; ctx.globalAlpha = listen * (0.65 - ring * 0.15); ctx.lineWidth = 1.4; ctx.stroke();
        }
      }
      if (speak > 0.001) {
        ctx.strokeStyle = colors.accentColor;
        for (let i = 0; i < budget.flares; i++) {
          const angle = seeds[i] + time * 0.07;
          const length = 10 + (Math.sin(time * 1.7 + seeds[i]) + 1) * 7 * colors.motionIntensity + energy * 18;
          ctx.save(); ctx.translate(240, 240); ctx.rotate(angle);
          ctx.globalAlpha = speak * (0.25 + colors.glow * 0.4);
          ctx.beginPath(); ctx.ellipse(radius + length * 0.45, 0, length, 4 + energy * 3, 0, 0, Math.PI * 2); ctx.lineWidth = 1.3; ctx.stroke(); ctx.restore();
        }
        ctx.fillStyle = colors.coreColor;
        for (let i = 0; i < budget.particles; i++) {
          const phase = (time * 0.12 + i * 0.173) % 1;
          const angle = seeds[i] + time * 0.035;
          const r = radius + 22 + phase * 85;
          ctx.globalAlpha = speak * (1 - phase) * (0.3 + energy * 0.5);
          ctx.beginPath(); ctx.arc(240 + Math.cos(angle) * r, 240 + Math.sin(angle) * r, 1 + i % 3 * 0.65, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.drawImage(core, 240 - radius, 240 - radius, radius * 2, radius * 2);
      ctx.save(); ctx.beginPath(); ctx.arc(240, 240, radius * 0.95, 0, Math.PI * 2); ctx.clip();
      ctx.strokeStyle = colors.accentColor;
      for (let i = 0; i < 10; i++) {
        ctx.globalAlpha = 0.12 + speak * 0.07;
        ctx.beginPath(); ctx.ellipse(240 + Math.sin(seeds[i] + time * 0.16) * 54, 240 + Math.cos(seeds[i] * 2 + time * 0.1) * 54, 22 + i * 2, 8 + i % 4, seeds[i] + time * 0.1, 0, Math.PI * 2); ctx.lineWidth = 1; ctx.stroke();
      }
      ctx.restore(); ctx.globalAlpha = 1;
    },
  };
}
