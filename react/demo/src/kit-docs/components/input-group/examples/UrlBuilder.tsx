import { Input, InputGroup } from "@cjlapao/ui-kit";

const UrlBuilder = () => (
  <div className="w-full max-w-sm">
    <InputGroup leadingAddon="https://" trailingAddon=".com">
      <Input placeholder="your-company" defaultValue="your-company" />
    </InputGroup>
  </div>
);

export default UrlBuilder;
