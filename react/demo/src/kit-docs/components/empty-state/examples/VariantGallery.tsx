import { EMPTY_STATE_VARIANTS, EmptyState } from "@cjlapao/ui-kit";

const VariantGallery = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    {EMPTY_STATE_VARIANTS.map((variant) => (
      <EmptyState
        key={variant}
        variant={variant}
        tone="blue"
        size="xs"
        icon="Add"
        title={variant}
        actionLabel="Create"
        onAction={() => undefined}
        fullWidth
      />
    ))}
  </div>
);

export default VariantGallery;
