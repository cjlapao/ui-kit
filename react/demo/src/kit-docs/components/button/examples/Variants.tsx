import { Button } from "@cjlapao/ui-kit";

export default function Variants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="solid" color="blue">
        Solid
      </Button>
      <Button variant="soft" color="blue">
        Soft
      </Button>
      <Button variant="outline" color="blue">
        Outline
      </Button>
      <Button variant="ghost" color="blue">
        Ghost
      </Button>
      <Button variant="link" color="blue">
        Link
      </Button>
      <Button variant="clear" color="blue">
        Clear
      </Button>
    </div>
  );
}
