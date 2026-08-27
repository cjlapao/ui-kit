import { SmartValueParts } from "@cjlapao/ui-kit";
import type { SmartVariableGroup } from "@cjlapao/ui-kit";

const GROUPS: SmartVariableGroup[] = [
  {
    id: "app",
    label: "Environment",
    tone: "violet",
    variables: [
      { key: "REGION", value: "eu-west-1" },
      { key: "EMPTY", value: "" },
    ],
  },
];

/**
 * `SmartValueParts` is the shared renderer underneath `SmartValue` and
 * `SmartInput`'s preview — one implementation, so the two cannot drift.
 *
 * "No such variable" and "declared but has no value" are different problems
 * and used to render identically, so a typo looked the same as an unset
 * default.
 */
export default function States() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div>
        <span className="mr-2 text-xs uppercase tracking-wide opacity-60">tokens</span>
        <SmartValueParts value="{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}" groups={GROUPS} mode="token" />
      </div>
      <div>
        <span className="mr-2 text-xs uppercase tracking-wide opacity-60">values</span>
        <SmartValueParts value="{{env::app::REGION}} {{env::app::EMPTY}} {{env::app::NOPE}}" groups={GROUPS} mode="value" />
      </div>
    </div>
  );
}
