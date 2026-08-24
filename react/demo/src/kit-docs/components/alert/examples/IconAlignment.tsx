import { Alert } from "@cjlapao/ui-kit";

const LONG_BODY =
  "Rollout is held at 12% of traffic. The error budget for this window is " +
  "spent, so the next attempt needs either a fix or an explicit override from " +
  "someone on the release rota. Nothing is being served from the new build.";

export default function IconAlignment() {
  return (
    <div className="flex flex-col gap-3">
      {(["top", "center", "bottom"] as const).map((each) => (
        <div key={each} className="flex flex-col gap-1.5">
          <Alert
            intent="warning"
            size="lg"
            iconAlign={each}
            title={`Icon aligned to the ${each}`}
            description={LONG_BODY}
          />
          <span className="text-[10px] uppercase tracking-wide opacity-60">
            {each}
          </span>
        </div>
      ))}
    </div>
  );
}
