import { INPUT_VARIANTS, Select } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const Variants = () => (
  <div className="grid w-full gap-3 md:grid-cols-2">
    {INPUT_VARIANTS.map((variant) => (
      <Select
        key={variant}
        variant={variant}
        size="md"
        placeholder={variant}
        aria-label={variant}
      >
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    ))}
  </div>
);

export default Variants;
