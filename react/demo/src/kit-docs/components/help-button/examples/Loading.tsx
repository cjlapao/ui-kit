import { HelpButton } from "@cjlapao/ui-kit";

const CONTENT =
  "While help is fetching, the body is a pulsing skeleton shaped like the copy — no empty flash, no layout jump.";

/**
 * The left button is ready; the right one is `loading`, so its panel body is a
 * skeleton instead of the copy. Open both to compare.
 */
const Loading = () => (
  <div className="flex items-center gap-6">
    <div className="flex flex-col items-center gap-1">
      <HelpButton content={CONTENT} title="Ready" color="emerald" size="md" />
      <span className="text-xs opacity-70">ready</span>
    </div>
    <div className="flex flex-col items-center gap-1">
      <HelpButton content={CONTENT} title="Loading" color="amber" size="md" loading />
      <span className="text-xs opacity-70">loading</span>
    </div>
  </div>
);

export default Loading;
