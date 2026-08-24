import { CollapsibleHelpText } from "@cjlapao/ui-kit";

const LONG_COPY =
  "We ask for usage feedback a few weeks after onboarding. Your responses help us prioritize features like Git integration, remote builds, and workspace sharing. The score is anonymous unless you choose to leave your name in the comment field. Feel free to mention bugs, friction, or workflows you would like us to streamline.";

export default function ReviewQuestion() {
  return (
    <div className="w-full max-w-2xl">
      <CollapsibleHelpText
        title="Why we ask for reviews"
        text={LONG_COPY}
        showIcon
        tone="emerald"
        variant="card"
      />
    </div>
  );
}
