import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Basic() {
  return (
    <Tooltip text="Tooltips show a helpful hint when the trigger is hovered.">
      <Button variant="solid" color="blue">
        Hover me
      </Button>
    </Tooltip>
  );
}
