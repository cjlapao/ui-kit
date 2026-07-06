<script setup>
/**
 * GlassPanel — a tintable "liquid glass" surface.
 *
 * Tailwind 4 handles layout/spacing on the outside; the glass material itself
 * (translucent tinted fill, backdrop blur/saturate, specular sheen, rim light)
 * lives in the scoped <style> below and is driven entirely by CSS variables that
 * are bound from props — so every instance can be tuned independently.
 *
 * Usage:
 *   <GlassPanel :tint="'#3094FF'" :frost="22" :vibrancy="200" class="p-6 rounded-[28px]">
 *     <h2 class="text-white text-xl font-semibold">Anything you like</h2>
 *   </GlassPanel>
 */
import { computed } from 'vue'

const props = defineProps({
  /** Tint colour of the glass (any CSS colour). */
  tint:         { type: String, default: '#F0803C' },
  /** How strongly the tint colours the fill, in % (0 = clear, ~55 = heavy). */
  tintStrength: { type: Number, default: 16 },
  /** Backdrop blur amount in px — the "frostiness". */
  frost:        { type: Number, default: 18 },
  /** Backdrop saturation in % — the "vibrancy" / liquid pop (100 = neutral). */
  vibrancy:     { type: Number, default: 180 },
  /** Border / rim-light intensity, 0–100. */
  borderGlow:   { type: Number, default: 55 },
  /** Corner radius in px. */
  radius:       { type: Number, default: 26 },
})

// Bind props to the CSS custom properties the material reads.
const glassVars = computed(() => ({
  '--lg-tint':     props.tint,
  '--lg-tint-amt': `${props.tintStrength}%`,
  '--lg-blur':     `${props.frost}px`,
  '--lg-sat':      `${props.vibrancy}%`,
  '--lg-rim':      `rgba(255,255,255,${(props.borderGlow / 100).toFixed(3)})`,
  '--lg-radius':   `${props.radius}px`,
}))
</script>

<template>
  <div class="glass-panel" :style="glassVars">
    <slot />
  </div>
</template>

<style scoped>
.glass-panel {
  position: relative;
  isolation: isolate;
  border-radius: var(--lg-radius, 26px);

  /* tinted translucent fill — slightly stronger at the top for depth */
  background: linear-gradient(
    150deg,
    color-mix(in oklab, var(--lg-tint, #F0803C) calc(var(--lg-tint-amt, 16%) + 6%), transparent),
    color-mix(in oklab, var(--lg-tint, #F0803C) var(--lg-tint-amt, 16%), transparent)
  );

  /* the frost + vibrancy */
  -webkit-backdrop-filter: blur(var(--lg-blur, 18px)) saturate(var(--lg-sat, 180%)) brightness(1.06);
  backdrop-filter: blur(var(--lg-blur, 18px)) saturate(var(--lg-sat, 180%)) brightness(1.06);

  /* rim + soft cool shadow */
  border: 1px solid var(--lg-rim, rgba(255, 255, 255, 0.45));
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.55),
    inset 0 -1px 1px rgba(255, 255, 255, 0.12),
    inset 0 0 24px rgba(255, 255, 255, 0.05),
    0 18px 50px rgba(0, 0, 0, 0.35);
}

/* top specular sheen — the light rolling across the upper edge */
.glass-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.28) 0%,
    rgba(255, 255, 255, 0.06) 14%,
    rgba(255, 255, 255, 0) 42%
  );
}

/* edge refraction highlight, tinted on the lower-right */
.glass-panel::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
  opacity: 0.7;
  box-shadow:
    inset -1px -1px 2px color-mix(in oklab, var(--lg-tint, #F0803C) 20%, rgba(255, 255, 255, 0.5)),
    inset  1px  1px 2px rgba(255, 255, 255, 0.35);
}
</style>
