import { GlassBackground, type TrueColor } from "@cjlapao/ui-kit";

const palettes: { label: string; color: TrueColor; colorSecondary: TrueColor }[] = [
  { label: "Blue · Indigo", color: "blue", colorSecondary: "indigo" },
  { label: "Rose · Red", color: "rose", colorSecondary: "red" },
  { label: "Emerald · Teal", color: "emerald", colorSecondary: "teal" },
  { label: "Amber · Orange", color: "amber", colorSecondary: "orange" },
  { label: "Violet · Purple", color: "violet", colorSecondary: "purple" },
  { label: "Cyan · Sky", color: "cyan", colorSecondary: "sky" },
];

export default function Palettes() {
  return (
  <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-3">
    {palettes.map(({ label, color, colorSecondary }) => (
      <div key={label} className="relative h-24 overflow-hidden rounded-lg">
        <GlassBackground
          position="absolute"
          color={color}
          colorSecondary={colorSecondary}
          direction="br"
          ambient
        />
        <span className="relative z-10 flex h-full items-center justify-center px-2 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
      </div>
    ))}
  </div>
  );
}
