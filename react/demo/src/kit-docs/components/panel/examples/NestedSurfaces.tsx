import React from "react";
import { Panel } from "@cjlapao/ui-kit";

export default function NestedSurfaces() {
  return (
    <Panel variant="simple" tone="neutral" title="Workspace activity">
      <Panel variant="simple" tone="neutral">Ada rotated the signing keys</Panel>
      <Panel variant="simple" tone="neutral">Sales Bot closed as won</Panel>
      <Panel variant="simple" tone="neutral" nestedSurface={false}>Unchanged surface</Panel>
    </Panel>
  );
}
