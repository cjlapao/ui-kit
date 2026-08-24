import React, { useCallback, useRef, useState } from "react";
import {
  Button,
  DEFAULT_SURFACE_CORNER,
  InfiniteScrollPanel,
  MultiToggle,
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
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  infiniteScrollLayoutOptions,
  infiniteScrollVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  panelSpecularOptions,
  trueColorOptions,
} from "../../shared/options";

/** Variants whose surface is see-through, so the glass controls apply. */
const GLASS_VARIANTS: InfiniteScrollPanelVariant[] = [
  "glass",
  "liquid-glass",
  "default",
];

const PAGE = 12;
const TOTAL = 60;

export const InfiniteScrollPanelPlayground: React.FC = () => {
  const [items, setItems] = useState<number[]>(() =>
    Array.from({ length: PAGE }, (_, index) => index),
  );
  const [isLoading, setIsLoading] = useState(false);

  const [variant, setVariant] =
    useState<InfiniteScrollPanelVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] =
    useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
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
    <PlaygroundPanel
      controls={
        <>
          <SelectControl
            label="Variant"
            options={infiniteScrollVariantOptions}
            value={variant}
            onChange={(v) => setVariant(v as InfiniteScrollPanelVariant)}
          />
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <SelectControl
            label="Corner"
            options={panelCornerOptions}
            value={corner}
            onChange={(v) => setCorner(v as PanelCorner)}
          />
          <Control label="Padding">
            <MultiToggle
              fullWidth
              size="sm"
              options={panelPaddingOptions}
              value={padding}
              onChange={(v) => setPadding(v as PanelPadding)}
            />
          </Control>
          <Control label="Layout">
            <MultiToggle
              fullWidth
              size="sm"
              options={infiniteScrollLayoutOptions}
              value={layout}
              onChange={(v) => setLayout(v as InfiniteScrollLayout)}
            />
          </Control>
          <Control label="Gap">
            <MultiToggle
              fullWidth
              size="sm"
              options={controlSizeOptions}
              value={gap}
              onChange={(v) => setGap(v as ControlSize)}
            />
          </Control>
          <Control label={`Max columns — ${maxColumns}`}>
            <input
              type="range"
              min={1}
              max={6}
              value={maxColumns}
              onChange={(event) => setMaxColumns(Number(event.target.value))}
              className="w-full accent-blue-500"
            />
          </Control>
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Empty" checked={empty} onChange={setEmpty} />
            <ToggleRow
              label="Next page fails"
              checked={failNext}
              onChange={setFailNext}
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
            <>
              <Control label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(v) => setSpecularMode(v as PanelSpecularMode)}
                />
              </Control>
              <Control label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(v) => setVibrancy(v as GlassVibrancy)}
                />
              </Control>
              <Control label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(v) => setGlassOpacity(v as GlassOpacity)}
                />
              </Control>
            </>
          )}
          <p className="text-xs opacity-70">
            {items.length} of {TOTAL} loaded. <strong>Columns</strong> fills
            each column top-to-bottom, so reading order runs down rather than
            across — <strong>grid</strong> keeps left-to-right order.{" "}
            <strong>Next page fails</strong> shows the retry state.
          </p>
        </>
      }
      preview={
        <div className="w-full">
          <div className="w-full rounded-lg bg-gradient-to-br from-indigo-100 via-neutral-50 to-rose-100 p-4 dark:from-slate-900 dark:via-neutral-950 dark:to-indigo-950">
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
        </div>
      }
    >
    </PlaygroundPanel>
  );
};
