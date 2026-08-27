import { CONTROL_SIZES, UserAvatar } from "@cjlapao/ui-kit";

/**
 * The shared control ladder. `size` was a bare pixel number, so an avatar
 * could not be told to match the `sm` Button beside it. A number still works.
 */
export default function Sizes() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {CONTROL_SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-1">
          <UserAvatar size={size} user={{ name: "Ada" }} />
          <span className="text-[11px] opacity-60">{size}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-1">
        <UserAvatar size={72} user={{ name: "Ada" }} />
        <span className="text-[11px] opacity-60">72px</span>
      </div>
    </div>
  );
}
