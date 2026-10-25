# Side panel surface variants

Approved direction: SidePanel offers the same eight surface variants as Panel and WorkflowTrackerRail. The shared Panel renderer owns fill, tone, border, backdrop, and specular highlights; the existing SidePanel shell owns docking, corner geometry, width animation, and clipping. Shadows remain outside the clipping shell.

The default is outlined, matching the workflow rail. SIDE_PANEL_VARIANTS aliases SURFACE_VARIANTS. Existing sidebar, inset, floating, and floating-glass names remain accepted and preserve their existing surfaces and automatic inset geometry. The shared glass variant now follows Panel styling.

Existing left/right positioning, inset overrides, content-facing corner radii, mouse and keyboard resizing, controlled/uncontrolled collapse, overlay dismissal, header/footer content, noise, and mounted child state remain intact. Glass opacity, vibrancy, and specular mode forward to Panel.

The React playground exposes the shared variant family. Vue is outside this change: its SidePanel does not yet implement the React positioning and collapse API.

Validation: existing SidePanel tests plus a variant matrix that exercises docking, corners, keyboard resizing, collapse/expand, and retained child state. Run React TypeScript and targeted lint checks.
