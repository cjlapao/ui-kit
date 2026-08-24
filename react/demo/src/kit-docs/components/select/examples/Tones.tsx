import { Select, TRUE_COLORS } from "@cjlapao/ui-kit";

const REGIONS = ["eu-west-1", "us-east-1", "ap-south-1", "sa-east-1"];

const Tones = () => (
  <div className="grid w-full gap-2 md:grid-cols-3 xl:grid-cols-4">
    {TRUE_COLORS.map((tone) => (
      <Select key={tone} size="sm" tone={tone} placeholder={tone} aria-label={tone}>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </Select>
    ))}
  </div>
);

export default Tones;
