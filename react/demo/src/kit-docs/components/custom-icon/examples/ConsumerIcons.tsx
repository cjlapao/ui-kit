import type { SVGProps } from "react";
import { CustomIcon, registerIcons } from "@cjlapao/ui-kit";

// A file-based SVG import also works when your bundler transforms SVGs into
// React components, e.g. import MyLogo from "./my-logo.svg?react" with SVGR.
// A plain SVG URL is not a React component.
const MyLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" {...props}>
    <path d="m12 2 9 5v10l-9 5-9-5V7Z" stroke="currentColor" strokeWidth="2" />
    <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// Register once at app startup, outside render. Names are then usable by all
// kit components that accept icon names. The generated built-ins stay intact.
// Replacing an existing name requires registerIcons(icons, { override: true }).
// The returned function removes this registration when it is no longer needed.
const unregister = registerIcons({ "Demo.ProjectLogo": MyLogo }, { override: true });
if (import.meta.hot) import.meta.hot.dispose(unregister);

export default function ConsumerIcons() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <CustomIcon icon="Demo.ProjectLogo" size="xl" tone="blue" alt="Registered project logo" />
      <CustomIcon icon={MyLogo} size="lg" tone="emerald" alt="Direct project logo" />
      <CustomIcon icon="Demo.ProjectLogo" customSize={40} color="#8b5cf6" spin alt="Spinning project logo" />
    </div>
  );
}
