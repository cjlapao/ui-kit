import { INPUT_VARIANTS, Input, InputGroup } from "@cjlapao/ui-kit";

const Variants = () => (
  <div className="grid w-full gap-3 md:grid-cols-2">
    {INPUT_VARIANTS.map((variant) => (
      <InputGroup key={variant} variant={variant} leadingAddon={variant}>
        <Input placeholder="your-company" />
      </InputGroup>
    ))}
  </div>
);

export default Variants;
