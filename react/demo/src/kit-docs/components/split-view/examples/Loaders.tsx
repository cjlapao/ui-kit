import { SplitView, SPLIT_VIEW_LOADERS } from "@cjlapao/ui-kit";

const ITEMS = [
  { id: "a", label: "api-gateway", subtitle: "eu-west-1", panel: <div className="p-4 text-sm">Gateway</div> },
  { id: "b", label: "worker-pool", subtitle: "us-east-1", panel: <div className="p-4 text-sm">Worker</div> },
];

/**
 * The kit's three loader treatments, `skeleton` by default.
 *
 * The skeleton is shaped like the two panes, so the list keeps its width and
 * the layout does not jump when the data lands. The spinner and progress types
 * cover the view instead, which is right when the previous content should stay
 * readable underneath.
 */
export default function Loaders() {
  return (
    <div className="grid w-full gap-4 lg:grid-cols-3">
      {SPLIT_VIEW_LOADERS.map((loaderType) => (
        <div key={loaderType} className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-wide text-neutral-400">{loaderType}</span>
          <div className="h-64 overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700">
            <SplitView
              items={ITEMS}
              listTitle="Capsules"
              loading
              loaderType={loaderType}
              loadingProgress={62}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
