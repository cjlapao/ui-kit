import { CONTROL_SIZES, InfoRow, Panel } from "@cjlapao/ui-kit";

/**
 * The full shared control scale. The component used to declare its own
 * `xs | sm | md | lg`, so it could not be set to `xl` beside an `xl` Button.
 */
export default function Sizes() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      {CONTROL_SIZES.map((size) => (
        <Panel key={size} variant="outlined" padding="sm">
          <InfoRow label="Size" value={size} size={size} />
          <InfoRow label="Region" value="eu-west-1" size={size} />
          <InfoRow label="Replicas" value={3} size={size} />
        </Panel>
      ))}
    </div>
  );
}
