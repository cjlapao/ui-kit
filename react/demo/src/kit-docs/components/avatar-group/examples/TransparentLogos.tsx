import { AvatarGroup, type AvatarGroupItem } from "@cjlapao/ui-kit";

/**
 * Transparent marks, one SVG per logo — no backdrop of their own, so the
 * chip shows through. The first three let the art sit on the page; the last
 * asks for `background: true` and rides on a solid indigo pad, which reads
 * through the mark's own transparency.
 */
const logo = (shape: string, color: string) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>${shape.replace("C", color)}</svg>`,
  );

const LOGOS: AvatarGroupItem[] = [
  {
    name: "Ember",
    image: logo("<circle cx='32' cy='32' r='22' fill='C'/>", "#f97316"),
    tone: "orange",
  },
  {
    name: "Willow",
    image: logo(
      "<path d='M32 8 56 52H8Z' fill='C'/>",
      "#10b981",
    ),
    tone: "emerald",
  },
  {
    name: "Quartz",
    image: logo(
      "<rect x='12' y='12' width='40' height='40' rx='10' fill='none' stroke='C' stroke-width='8'/>",
      "#0ea5e9",
    ),
    tone: "sky",
  },
  {
    name: "Nocturne",
    image: logo(
      "<circle cx='32' cy='32' r='20' fill='C'/><circle cx='40' cy='26' r='16' fill='#fff' fill-opacity='0'/>",
      "#6366f1",
    ),
    tone: "indigo",
    background: true,
  },
];

export default function TransparentLogos() {
  return <AvatarGroup items={LOGOS} size="lg" rounded="lg" />;
}
