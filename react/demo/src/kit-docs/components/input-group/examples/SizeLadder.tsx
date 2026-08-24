import { CONTROL_SIZES, Input, InputGroup } from "@cjlapao/ui-kit";

const SizeLadder = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    {CONTROL_SIZES.map((size) => (
      <InputGroup
        key={size}
        size={size}
        leadingAddon="https://"
        trailingAddon={size}
      >
        <Input placeholder="your-company" />
      </InputGroup>
    ))}
  </div>
);

export default SizeLadder;
