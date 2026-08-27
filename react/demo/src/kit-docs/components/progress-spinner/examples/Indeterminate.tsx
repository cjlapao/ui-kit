import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Indeterminate = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ProgressSpinner />
    <ProgressSpinner color="emerald" ariaLabel="Syncing" />
    <ProgressSpinner color="violet" size="lg" ariaLabel="Processing" />
    <ProgressSpinner
      color="amber"
      size="xl"
      thickness="thick"
      ariaLabel="Uploading"
    />
  </div>
);

export default Indeterminate;
