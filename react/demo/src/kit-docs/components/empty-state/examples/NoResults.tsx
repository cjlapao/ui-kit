import { Button, EmptyState } from "@cjlapao/ui-kit";

const NoResults = () => (
  <div className="w-full max-w-lg">
    <EmptyState
      icon="Search"
      title="No results for “orchestrator”"
      subtitle="Try a broader term, or clear the filters you have applied."
      fullWidth
      actions={
        <>
          <Button size="sm" variant="soft" color="blue">
            Clear filters
          </Button>
          <Button size="sm" variant="ghost" color="slate">
            Browse all
          </Button>
        </>
      }
    />
  </div>
);

export default NoResults;
