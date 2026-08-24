import React, { useCallback, useRef, useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  InfiniteScrollPanel,
  MultiToggle,
  Select,
  Toggle,
  Button,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  ControlSize,
  GlassOpacity,
  GlassVibrancy,
  InfiniteScrollLayout,
  InfiniteScrollPanelVariant,
  PanelCorner,
  PanelPadding,
  PanelSpecularMode,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: InfiniteScrollPanelVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const variantOptions = [
  { label: "Plain", value: "plain" },
  ...panelVariantOptions,
];

const layoutOptions: { label: string; value: InfiniteScrollLayout }[] = [
  { label: "Masonry", value: "masonry" },
  { label: "Grid", value: "grid" },
  { label: "Columns", value: "columns" },
  { label: "List", value: "list" },
];

const gapOptions: { label: string; value: ControlSize }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const PAGE = 12;
const TOTAL = 60;

export const InfiniteScrollDemo: React.FC = () => {
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: PAGE }, (_, index) => index),
  );
  const [isLoading, setIsLoading] = useState(false);

  const [variant, setVariant] = useState<InfiniteScrollPanelVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [layout, setLayout] = useState<InfiniteScrollLayout>("masonry");
  const [gap, setGap] = useState<ControlSize>("md");
  const [maxColumns, setMaxColumns] = useState(4);
  const [failNext, setFailNext] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  // Read through a ref so `loadMore` keeps a stable identity — a changing
  // callback would tear down and rebuild the IntersectionObserver every page.
  const failRef = useRef(failNext);
  failRef.current = failNext;

  const hasMore = !empty && items.length < TOTAL;

  const loadMore = useCallback(async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsLoading(false);
    if (failRef.current) {
      throw new Error("Simulated network failure");
    }
    setItems((prev) => [
      ...prev,
      ...Array.from({ length: PAGE }, (_, index) => prev.length + index),
    ]);
  }, []);

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundSection
      title="Infinite Scroll Panel"
      label="[InfiniteScrollPanel]"
      description="A scrolling list that fetches the next page as the end comes into view, with masonry, grid, balanced-column and list layouts."
      controls={
        <div className="space-y-5 text-sm">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Variant">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as InfiniteScrollPanelVariant)
                }
              >
                {variantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Corner">
              <Select
                value={corner}
                disabled={variant === "plain"}
                onChange={(event) =>
                  setCorner(event.target.value as PanelCorner)
                }
              >
                {panelCornerOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Padding">
              <MultiToggle
                fullWidth
                size="sm"
                options={panelPaddingOptions}
                value={padding}
                onChange={(value) => setPadding(value as PanelPadding)}
              />
            </Field>
          </div>

          <Field label="Layout">
            <MultiToggle
              fullWidth
              size="sm"
              options={layoutOptions}
              value={layout}
              onChange={(value) => setLayout(value as InfiniteScrollLayout)}
            />
          </Field>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Gap">
              <MultiToggle
                fullWidth
                size="sm"
                options={gapOptions}
                value={gap}
                onChange={(value) => setGap(value as ControlSize)}
              />
            </Field>
            <Field label={`Max columns — ${maxColumns}`}>
              <input
                type="range"
                min={1}
                max={6}
                value={maxColumns}
                onChange={(event) => setMaxColumns(Number(event.target.value))}
                className="w-full accent-blue-500"
              />
            </Field>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Empty"
              checked={empty}
              onChange={(event) => setEmpty(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Next page fails"
              checked={failNext}
              onChange={(event) => setFailNext(event.target.checked)}
            />
            <Button
              size="xs"
              variant="soft"
              color={tone}
              onClick={() => {
                setItems(Array.from({ length: PAGE }, (_, i) => i));
                setEmpty(false);
                setFailNext(false);
              }}
            >
              Reset
            </Button>
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) =>
                    setSpecularMode(value as PanelSpecularMode)
                  }
                />
              </Field>
              <Field label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </Field>
              <Field label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(value) => setGlassOpacity(value as GlassOpacity)}
                />
              </Field>
            </div>
          )}

          <p className="text-xs opacity-70">
            {items.length} of {TOTAL} loaded. <strong>Columns</strong> fills
            each column top-to-bottom, so reading order runs down rather than
            across — <strong>grid</strong> keeps left-to-right order.{" "}
            <strong>Next page fails</strong> shows the retry state.
          </p>
        </div>
      }
      preview={
        <div className="p-4">
          <InfiniteScrollPanel<number>
            items={empty ? [] : items}
            isLoading={isLoading && items.length === 0}
            hasMore={hasMore}
            onLoadMore={loadMore}
            variant={variant}
            tone={tone}
            corner={corner}
            padding={padding}
            layout={layout}
            gap={gap}
            maxColumns={maxColumns}
            minColumnWidth={220}
            height={480}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={specularMode}
            getItemKey={(item) => item}
            renderItem={(item) => (
              <div
                className="w-full rounded-lg border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900/60"
                style={
                  layout === "masonry" || layout === "columns"
                    ? { height: `${90 + (item % 5) * 36}px` }
                    : undefined
                }
              >
                <div className="font-semibold">Item {item}</div>
                <div className="mt-1 text-xs opacity-60">
                  {layout === "masonry" || layout === "columns"
                    ? `${90 + (item % 5) * 36}px tall`
                    : "uniform height"}
                </div>
              </div>
            )}
          />
        </div>
      }
    />
  );
};
