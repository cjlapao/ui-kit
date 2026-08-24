import { Button, Input, InputGroup, Select } from "@cjlapao/ui-kit";

const Compound = () => (
  <div className="flex w-full max-w-sm flex-col gap-3">
    <InputGroup leadingAddon="Amount">
      <Input type="number" placeholder="0.00" />
      <Select aria-label="Currency" unstyled>
        <option>USD</option>
        <option>EUR</option>
        <option>GBP</option>
      </Select>
    </InputGroup>
    <InputGroup leadingAddon="Search">
      <Input placeholder="Find a resource" />
      <Button size="md" variant="solid" color="blue">
        Go
      </Button>
    </InputGroup>
  </div>
);

export default Compound;
