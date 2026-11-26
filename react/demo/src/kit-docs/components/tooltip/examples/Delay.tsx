import { Button, Tooltip } from "@cjlapao/ui-kit";

export default function Delay() {
  return (
    <>
      <Tooltip text="No delay — I show the instant you hover." delay={0}>
        <Button variant="outline" color="blue">
          Delay: 0ms
        </Button>
      </Tooltip>
      <Tooltip text="Half a second of patience." delay={500}>
        <Button variant="outline" color="blue">
          Delay: 500ms
        </Button>
      </Tooltip>
      <Tooltip text="The kit default — a full second of patience." delay={1000}>
        <Button variant="outline" color="blue">
          Delay: 1000ms (default)
        </Button>
      </Tooltip>
    </>
  );
}
