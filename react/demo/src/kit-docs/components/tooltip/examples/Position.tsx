import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Position() {
  return (
    <>
      <Tooltip text="I appear above the trigger." position="top">
        <Button variant="soft" color="blue">
          Position: top
        </Button>
      </Tooltip>
      <Tooltip text="I appear below the trigger." position="bottom">
        <Button variant="soft" color="blue">
          Position: bottom
        </Button>
      </Tooltip>
    </>
  );
}
