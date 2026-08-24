import { GlassBackground, type GradientDirection } from "@cjlapao/ui-kit";

const directions: { code: GradientDirection; label: string }[] = [
  { code: "t", label: "Top" },
  { code: "tr", label: "Top right" },
  { code: "r", label: "Right" },
  { code: "br", label: "Bottom right" },
  { code: "b", label: "Bottom" },
  { code: "bl", label: "Bottom left" },
  { code: "l", label: "Left" },
  { code: "tl", label: "Top left" },
];

export default function Directions() {
  return (
  <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:grid-cols-4">
    {directions.map(({ code, label }) => (
      <div key={code} className="relative h-20 overflow-hidden rounded-lg">
        <GlassBackground position="absolute" direction={code} ambient={false} />
        <span className="relative z-10 flex h-full items-center justify-center px-1 text-[10px] font-semibold text-neutral-700 dark:text-neutral-200">
          {label}
        </span>
      </div>
    ))}
  </div>
  );
}
