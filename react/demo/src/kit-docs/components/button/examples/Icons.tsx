import { Button } from "@cjlapao/ui-kit";

export default function Icons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button leadingIcon="Search">
        Search
      </Button>
      <Button trailingIcon="ArrowRight" variant="soft">
        Continue
      </Button>
      <Button variant="icon" leadingIcon="Close" aria-label="Close" />
    </div>
  );
}
