import React, { useState } from "react";
import { Carousel } from "@cjlapao/ui-kit";
import type { CarouselOrientation, TrueColor } from "@cjlapao/ui-kit";
import {
  Control,
  MultiToggle,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  carouselOrientationOptions,
  trueColorOptions,
} from "../../shared/options";

const numVisibleOptions = [1, 2, 3, 4, 5].map((n) => ({ label: String(n), value: String(n) }));
const numScrollOptions = [1, 2, 3].map((n) => ({ label: String(n), value: String(n) }));
const autoplayOptions = [
  { label: "Off", value: "0" },
  { label: "1s", value: "1000" },
  { label: "2s", value: "2000" },
  { label: "3s", value: "3000" },
];

const DEMO_ITEMS = Array.from({ length: 8 }, (_, i) => `Slide ${i + 1}`);

export const CarouselPlayground: React.FC = () => {
  const [numVisible, setNumVisible] = useState(1);
  const [numScroll, setNumScroll] = useState(1);
  const [orientation, setOrientation] = useState<CarouselOrientation>("horizontal");
  const [color, setColor] = useState<TrueColor>("blue");
  const [circular, setCircular] = useState(false);
  const [autoplay, setAutoplay] = useState(0);
  const [showNavigators, setShowNavigators] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);

  const renderSlide = (label: string, index: number) => (
    <div
      key={index}
      className="flex h-56 items-center justify-center rounded-xl bg-neutral-100 text-sm font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
    >
      {label}
    </div>
  );

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Items visible">
            <MultiToggle
              fullWidth
              size="sm"
              options={numVisibleOptions}
              value={String(numVisible)}
              onChange={(v) => setNumVisible(Number(v))}
            />
          </Control>
          <Control label="Items per scroll">
            <MultiToggle
              fullWidth
              size="sm"
              options={numScrollOptions}
              value={String(numScroll)}
              onChange={(v) => setNumScroll(Number(v))}
            />
          </Control>
          <Control label="Orientation">
            <MultiToggle
              fullWidth
              size="sm"
              options={carouselOrientationOptions}
              value={orientation}
              onChange={(v) => setOrientation(v as CarouselOrientation)}
            />
          </Control>
          <Control label="Autoplay">
            <MultiToggle
              fullWidth
              size="sm"
              options={autoplayOptions}
              value={String(autoplay)}
              onChange={(v) => setAutoplay(Number(v))}
            />
          </Control>
          <SelectControl
            label="Color"
            options={trueColorOptions}
            value={color}
            onChange={(v) => setColor(v as TrueColor)}
          />
          <ToggleRow label="Circular" checked={circular} onChange={setCircular} />
          <ToggleRow label="Show navigators" checked={showNavigators} onChange={setShowNavigators} />
          <ToggleRow label="Show indicators" checked={showIndicators} onChange={setShowIndicators} />
        </>
      }
      preview={
        <Carousel
          numVisible={numVisible}
          numScroll={numScroll}
          orientation={orientation}
          color={color}
          circular={circular}
          autoplayInterval={autoplay}
          showNavigators={showNavigators}
          showIndicators={showIndicators}
          viewportHeight={orientation === "vertical" ? "320px" : undefined}
          items={DEMO_ITEMS.map(renderSlide)}
        />
      }
    />
  );
};
