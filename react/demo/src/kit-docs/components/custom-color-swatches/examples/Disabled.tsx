import { CustomColorSwatches } from "@cjlapao/ui-kit";

/**
 * Inert: the pills stay legible — border colour, hex label, the custom entry
 * in its remembered colour — but nothing is clickable and the popover stays
 * shut. `disabled` also marks the group `aria-disabled`.
 */
export default function Disabled() {
  return (
    <div className="flex w-full flex-col gap-3">
      <CustomColorSwatches
        mode="dual"
        disabled
        defaultValue={{
          border: { tone: "violet", hex: "#8b5cf6" },
          text: { mode: "auto" },
        }}
      />
      <CustomColorSwatches disabled defaultValue={{ tone: "teal", hex: "#14b8a6" }} />
    </div>
  );
}
