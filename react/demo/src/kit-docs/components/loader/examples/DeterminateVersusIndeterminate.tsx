import { Loader } from "@cjlapao/ui-kit";

const DeterminateVersusIndeterminate = () => (
  <div className="grid w-full gap-6 md:grid-cols-2">
    <Loader variant="progress" size="md" progress={45} label="Known extent" />
    <Loader variant="progress" size="md" indeterminate label="Unknown extent" />
  </div>
);

export default DeterminateVersusIndeterminate;
