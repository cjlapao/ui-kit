# Surface background transparency

User-approved scale: `none`, `low`, `medium`, `high`. High preserves each
variant's current alpha; none is fully opaque. Low and medium are one third
and two thirds of the way from opaque to the existing transparency. No level
can make an already opaque fill translucent.

Glass, liquid-glass and subtle retain their current defaults (high); other
shared Panel variants default to none. Preserve the visual tint of the newly
opaque backgrounds by precomposing their original fill over white in light
mode and neutral-900 in dark mode. Text, borders, shadows and decorations do
not receive component-level opacity.

Expose `transparency?: SurfaceTransparency` and `SURFACE_TRANSPARENCIES` from
the shared theme. Use one framework-independent class helper and shared CSS,
with generated Tailwind variable utilities for all tones and alpha values.
Existing glassOpacity still selects the original glass fill, then transparency
can reduce its transparency. Custom style/class background overrides remain
consumer-owned.

Apply defaults in React/Vue Panel and the shared surface-class helper, including
React Toolbar. Forward the optional property through Panel-backed React controls,
SidePanel, shared PageHeader variants, Menu and Popover. Popover arrows use the
same transformed fill as their panel. Defaults automatically apply to the other
controls that render Panel or consume the shared helper.

The Panel demo exposes automatic/default plus all four levels and includes a
striped backdrop comparison. Test variant defaults, original-alpha cap, hover,
nested panels, custom backgrounds and matching popover edge paint. Build CSS
and inspect actual computed background alpha in both themes.
