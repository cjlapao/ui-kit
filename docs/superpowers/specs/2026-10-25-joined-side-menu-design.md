# Joined side menu layout

Approved direction: a permanent icon rail and an expanded contextual menu form one navigation assembly, matching the supplied references. Add multiMenuMode="joined" to SideMenuLayout alongside secondarySideMenuProps. The default hover multi-menu mode and opposite-edge dual menus continue to work as before.

The rail is 68px wide and never expands on hover or shows a collapse control. The adjoining panel occupies the remaining 256px of a 324px navigation assembly; on narrow viewports it can shrink. The expanded menu and application body share one borderless surface with top/bottom insets and rounded left corners at the icon rail. The rail has a quieter neutral background. The expanded menu paints no independent fill or outline, so its right edge flows into the application body without squared corners, top/bottom border segments, or a vertical seam. Detached margins, independent shadows, and logo-header seams are suppressed. The primary variant selects the panel surface family; each menu keeps its content and accent.

SideMenu's joinedRole composition prop pins its desktop state and applies the joined geometry. Existing menus retain their current state rules. Optional activeItemSlug and onItemSelect let consumers switch contextual content without changing routes; the callback receives the click event and can prevent navigation. Route selection remains the default.

Both navigation levels retain independent scrolling, accessible link labels, footer dropdowns, search, guards, loading, and CTA/footer content. On mobile the assembly opens as one width-constrained drawer with a backdrop, localized close button, and Escape dismissal. Rail selection keeps it open; selecting a secondary link dismisses it.

The documentation includes a live joined example with three switchable sections, search, CTA, local active selection, and an account dropdown. It disables the viewport drawer behavior so the desktop composition remains visible in the documentation's narrow preview; the library defaults to responsive behavior.

Validation covers fixed widths despite conflicting collapse props, hover suppression, active selection callbacks, footer dropdown operation, mobile open/dismiss behavior, breakpoint changes, and the existing single/dual/multi menu tests. Inspect the live example in light and dark mode and rebuild kit CSS to include new utility classes.
