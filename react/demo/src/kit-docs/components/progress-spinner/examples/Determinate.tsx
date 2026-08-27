import { ProgressSpinner } from "@cjlapao/ui-kit";

export const Determinate = () => (
  <div className="flex flex-wrap items-center gap-4">
    <ProgressSpinner value={25} size="lg" ariaLabel="Downloading" />
    <ProgressSpinner value={50} size="lg" color="emerald" ariaLabel="Downloading" />
    <ProgressSpinner value={75} size="lg" color="violet" ariaLabel="Downloading" />
    <ProgressSpinner value={100} size="lg" color="amber" ariaLabel="Downloading" />
  </div>
);

export default Determinate;
