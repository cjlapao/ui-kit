import React from "react";
import {
  Breadcrumb,
  type BreadcrumbItem,
  type ControlSize,
  type TrueColor,
} from "@cjlapao/ui-kit";
import { controlSizeOptions, trueColorOptions } from "../../shared/options";
import { Playground } from "../../shared/playground/Playground";
import { usePlayground } from "../../shared/playground/state";
import type { PlaygroundConfig, PlaygroundPreviewProps } from "../../shared/playground/schema";

/**
 * Breadcrumb's playground as data.
 *
 * Every `default` below is the component's own, read from
 * `src/components/Breadcrumb.tsx`: `color` "blue" (:72), `size` "md" (:73),
 * `ariaLabel` "Breadcrumb" (:74), and no `home` crumb at all (:82 — the crumb is
 * prepended only when the prop is truthy). So the playground opens wearing the
 * kit's defaults and the Code view opens saying nothing but the trail.
 *
 * What is *not* here is as deliberate as what is. There is no collapse control,
 * no "items before the ellipsis" slider and no max-anything, because
 * `Breadcrumb.tsx` measures nothing: the ellipsis is an ordinary crumb the app
 * writes itself, which is why "Ellipsis" below is an item, not an option.
 */

const TRAIL: BreadcrumbItem[] = [
  { label: "Products", to: "/products" },
  { icon: "Cog", label: "Electronics", to: "/products/electronics" },
  { label: "Laptops", to: "/products/electronics/laptops" },
  { label: "Dell", current: true },
];

/**
 * The same trail with its first crumb standing in for everything above it: an
 * icon with no label, so it has to be named for a screen reader by hand.
 */
const TRAIL_WITH_ELLIPSIS: BreadcrumbItem[] = [
  { icon: "Dots", to: "/products", ariaLabel: "Skipped items" },
  ...TRAIL.slice(1),
];

const HOME: BreadcrumbItem = { icon: "Dashboard", to: "/", ariaLabel: "Home" };

const SEPARATOR_OPTIONS = [
  // "Chevron" is the component's own fallback (`separator ?? renderIcon(...)`,
  // :150) — choosing it must therefore print *nothing*, not `separator="…"`.
  { value: "chevron", label: "Chevron" },
  { value: "slash", label: "Slash — /" },
  { value: "dot", label: "Dot — ·" },
];

const SEPARATOR_GLYPH: Record<string, string> = { slash: "/", dot: "·" };

export const breadcrumbConfig: PlaygroundConfig = {
  groups: [
    { id: "trail", title: "The trail", defaultOpen: true },
    { id: "look", title: "Look", defaultOpen: true },
  ],
  fields: [
    {
      kind: "toggle",
      id: "showHome",
      label: "Home crumb",
      group: "trail",
      // `home` has no default — the crumb appears only when it is passed — so
      // the switch opens off, and the trail opens as four crumbs.
      default: false,
      // The lever itself is not a prop; `home` below is the data source that is.
      prop: null,
    },
    {
      kind: "toggle",
      id: "ellipsis",
      label: "Ellipsis for the hidden levels",
      group: "trail",
      default: false,
      prop: null,
    },
    {
      kind: "choice",
      id: "separator",
      label: "Separator",
      group: "look",
      options: SEPARATOR_OPTIONS,
      default: "chevron",
      emit: (value) =>
        value === "chevron" ? null : `separator="${SEPARATOR_GLYPH[value as string]}"`,
    },
    {
      kind: "choice",
      id: "size",
      label: "Size",
      group: "look",
      options: controlSizeOptions,
      default: "md",
      control: "segments",
    },
    {
      kind: "choice",
      id: "color",
      label: "Tone",
      group: "look",
      options: trueColorOptions,
      default: "blue",
      control: "select",
    },
    {
      kind: "text",
      id: "ariaLabel",
      label: "Navigation label",
      group: "look",
      default: "Breadcrumb",
      placeholder: "Breadcrumb",
    },
  ],
  data: [
    {
      id: "items",
      prop: "items",
      label: "The trail",
      note: "the crumbs, last one marked current — the ellipsis is just another crumb",
      emit: "literal",
      value: (state) => (state.ellipsis ? TRAIL_WITH_ELLIPSIS : TRAIL),
    },
    {
      id: "home",
      prop: "home",
      label: "Home crumb",
      note: "icon-only, so it carries the aria-label a text label would have given",
      emit: "literal",
      value: () => HOME,
      when: (state) => state.showHome === true,
    },
  ],
};

const Preview: React.FC<PlaygroundPreviewProps> = ({ state, data }) => (
  <div className="flex w-full flex-col items-center gap-3">
    <Breadcrumb
      items={data.items as BreadcrumbItem[]}
      home={state.showHome === true ? (data.home as BreadcrumbItem) : undefined}
      separator={
        state.separator === "chevron" ? undefined : SEPARATOR_GLYPH[state.separator as string]
      }
      size={state.size as ControlSize}
      color={state.color as TrueColor}
      ariaLabel={state.ariaLabel as string}
    />
  </div>
);

export const BreadcrumbPlayground: React.FC = () => {
  const playground = usePlayground(breadcrumbConfig);
  return (
    <Playground
      playground={playground}
      preview={Preview}
      component={{ tag: "Breadcrumb", imports: ["Breadcrumb"] }}
      filename="Breadcrumb.tsx"
      hint={
        <>
          The crumbs, the home crumb and the separator glyph are printed as the
          source that renders them — turn a switch and watch its lines appear.
          <code>size</code> is the one prop with five jobs: the trail&rsquo;s text
          size, the crumb&rsquo;s padding, the icon&ndash;label gap, the crumb icon
          and the separator glyph all follow it. <code>color</code> is quiet at
          rest — it tints a crumb only on hover, on focus and when it is the
          current page.
        </>
      }
    />
  );
};
