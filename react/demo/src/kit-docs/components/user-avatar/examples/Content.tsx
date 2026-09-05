import { UserAvatar } from "@cjlapao/ui-kit";

// An offline-safe data-URI portrait so the image branch works without a CDN.
const PORTRAIT =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='64' height='64' fill='#6366f1'/><circle cx='32' cy='24' r='12' fill='#fff'/><ellipse cx='32' cy='62' rx='20' ry='14' fill='#fff'/></svg>",
  );

/**
 * The four contents PrimeVue's Avatar renders — label, icon, image — plus
 * children as its `template` slot. PrimeVue's precedence (label over icon
 * over image) is kept; our `user` object feeds the same image slot via
 * `user.avatarUrl` when no `image` is given.
 */
export default function Content() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <UserAvatar size="lg" tone="indigo" label="AR" />
      <UserAvatar size="lg" tone="amber" icon="User" />
      <UserAvatar size="lg" tone="sky" image={PORTRAIT} />
      <UserAvatar size="lg" tone="rose">
        <span className="text-lg" aria-hidden="true">
          🎨
        </span>
      </UserAvatar>
    </div>
  );
}
