import { MultiProgressBar } from "@cjlapao/ui-kit";

/**
 * A series takes a `tone` from the shared palette. It used to take a raw
 * Tailwind class (`color: "bg-rose-500"`), which could not be dimmed or
 * safelisted with the rest; that prop still works but is deprecated.
 */
export default function Tones() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-8">
      <MultiProgressBar
        label="Auto-assigned from the palette"
        total={20}
        series={[
          { key: "a", label: "Running", value: 12 },
          { key: "b", label: "Paused", value: 5 },
          { key: "c", label: "Failed", value: 3 },
        ]}
      />
      <MultiProgressBar
        label="Explicit tones"
        total={20}
        series={[
          { key: "a", label: "Running", value: 12, tone: "emerald" },
          { key: "b", label: "Paused", value: 5, tone: "amber" },
          { key: "c", label: "Failed", value: 3, tone: "rose" },
        ]}
      />
    </div>
  );
}
