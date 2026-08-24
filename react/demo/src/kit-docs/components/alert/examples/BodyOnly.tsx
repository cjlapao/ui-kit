import { Alert } from "@cjlapao/ui-kit";

export default function BodyOnly() {
  return (
    <Alert intent="info">
      A callout with no title at all. This copy comes through{" "}
      <code>children</code>, which the component used to accept and drop on
      the floor.
    </Alert>
  );
}
