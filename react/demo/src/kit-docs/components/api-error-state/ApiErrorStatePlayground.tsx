import React, { useState } from "react";
import { ApiErrorState } from "@cjlapao/ui-kit";
import type {
  ApiErrorKind,
  ControlSize,
  EmptyStateVariant,
  SurfaceCorner,
  SurfacePadding,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  apiErrorKindOptions,
  controlSizeOptions,
  emptyStateVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  trueColorOptions,
} from "../../shared/options";

export const ApiErrorStatePlayground: React.FC = () => {
  const [kind, setKind] = useState<ApiErrorKind>("unknown");
  const [variant, setVariant] = useState<EmptyStateVariant>("outlined");
  const [size, setSize] = useState<ControlSize>("md");
  const [tone, setTone] = useState<TrueColor | "">("");
  const [corner, setCorner] = useState<SurfaceCorner>("rounded-xl");
  const [padding, setPadding] = useState<SurfacePadding>("lg");

  const [showRetry, setShowRetry] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [dashed, setDashed] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [iconBackground, setIconBackground] = useState(true);
  const [isError, setIsError] = useState(true);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Kind"
                      options={apiErrorKindOptions}
                      value={kind}
                      onChange={(value) => setKind(value as ApiErrorKind)}
                    />
                    <SelectControl
                      label="Variant"
                      options={emptyStateVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as EmptyStateVariant)}
                    />
                    <SelectControl
                      label="Size"
                      options={controlSizeOptions}
                      value={size}
                      onChange={(value) => setSize(value as ControlSize)}
                    />
                    <SelectControl
                      label="Tone override"
                      options={[{ label: "From the kind", value: "" }, ...trueColorOptions]}
                      value={tone}
                      onChange={(value) => setTone(value as TrueColor | "")}
                    />
                    <SelectControl
                      label="Corner"
                      options={panelCornerOptions}
                      value={corner}
                      onChange={(value) => setCorner(value as SurfaceCorner)}
                    />
                    <SelectControl
                      label="Padding"
                      options={panelPaddingOptions}
                      value={padding}
                      onChange={(value) => setPadding(value as SurfacePadding)}
                    />
                  </>
                ),
              },
              {
                id: "states",
                title: "States",
                controls: (
                  <Control label="State">
                    <div className="space-y-1.5">
                      <ToggleRow
                        label="Retry button"
                        checked={showRetry}
                        onChange={setShowRetry}
                      />
                      <ToggleRow
                        label="Retrying"
                        checked={retrying}
                        onChange={setRetrying}
                      />
                      <ToggleRow label="Dashed rule" checked={dashed} onChange={setDashed} />
                      <ToggleRow label="Icon" checked={showIcon} onChange={setShowIcon} />
                      <ToggleRow
                        label="Icon disc"
                        checked={iconBackground}
                        onChange={setIconBackground}
                      />
                      <ToggleRow
                        label="Is error"
                        checked={isError}
                        onChange={setIsError}
                      />
                    </div>
                  </Control>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            <strong>Kind</strong> picks the tone, the glyph and the copy from
            one table — anything you state explicitly still wins, which is what
            the tone override shows. <strong>Retrying</strong> spins the button
            and blocks it, so a slow request cannot be fired twice.{" "}
            <strong>Is error</strong> renders nothing at all, for a call site
            that would otherwise need a ternary.
          </p>
        </div>
      }
      preview={
        <div className="w-full">
          <ApiErrorState
            kind={kind}
            variant={variant}
            size={size}
            tone={tone === "" ? undefined : tone}
            corner={corner}
            padding={padding}
            dashed={dashed}
            showIcon={showIcon}
            iconBackground={iconBackground}
            isError={isError}
            retrying={retrying}
            onRetry={showRetry ? () => {} : undefined}
          />
          {!isError && (
            <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
              Nothing rendered — `isError` is false.
            </p>
          )}
        </div>
      }
    />
  );
};
