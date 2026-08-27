import { UserAvatar } from "@cjlapao/ui-kit";

/**
 * Three states: an initial from whichever identifier exists, the generic
 * glyph when the user is unknown, and the initial again when an image URL
 * fails to load. All three carry an accessible name.
 */
export default function Fallbacks() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <UserAvatar size="lg" tone="violet" user={{ name: "Ada Lovelace" }} />
      <UserAvatar size="lg" tone="sky" user={{ email: "grace@example.com" }} />
      <UserAvatar size="lg" tone="emerald" />
      <UserAvatar
        size="lg"
        tone="rose"
        user={{ name: "Broken", avatarUrl: "https://example.invalid/x.png" }}
      />
    </div>
  );
}
