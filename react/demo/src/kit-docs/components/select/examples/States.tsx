import { Select } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const regionOptions = REGIONS.map((region) => (
  <option key={region} value={region}>
    {region}
  </option>
));

const States = () => (
  <div className="grid w-full gap-3 md:grid-cols-2 xl:grid-cols-3">
    <Select validationStatus="error" placeholder="Error" aria-label="error">
      {regionOptions}
    </Select>
    <Select validationStatus="success" placeholder="Success" aria-label="success">
      {regionOptions}
    </Select>
    <Select disabled placeholder="Disabled" aria-label="disabled">
      {regionOptions}
    </Select>
    <Select leadingIcon="Globe" placeholder="Leading icon" aria-label="leading icon">
      {regionOptions}
    </Select>
    <Select hideCaret placeholder="Hidden caret" aria-label="hidden caret">
      {regionOptions}
    </Select>
    <Select multiple placeholder="Multiple" aria-label="multiple">
      {regionOptions}
    </Select>
  </div>
);

export default States;
