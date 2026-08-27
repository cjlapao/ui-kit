import React, { useState } from "react";
import { Button, Tooltip, TOOLTIP_POSITIONS, TOOLTIP_VARIANTS } from "@cjlapao/ui-kit";
import type { TooltipPosition, TooltipVariant } from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";

const positionOptions = TOOLTIP_POSITIONS.map((value) => ({ label: value, value }));
const variantOptions = TOOLTIP_VARIANTS.map((value) => ({ label: value, value }));

export const TooltipPlayground: React.FC = () => {
  const [position, setPosition] = useState<TooltipPosition>("top");
  const [variant, setVariant] = useState<TooltipVariant>("surface");
  const [delay, setDelay] = useState(300);
  const [offset, setOffset] = useState(8);
  const [bounded, setBounded] = useState(true);
  // A callback ref in state, not `useRef`: `.current` is null during the first
  // render, so the boundary would silently not apply.
  const [box, setBox] = useState<HTMLDivElement | null>(null);

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
                    <SelectControl label="Preferred side" options={positionOptions} value={position}
                      onChange={(v) => setPosition(v as TooltipPosition)} />
                    <SelectControl label="Variant" options={variantOptions} value={variant}
                      onChange={(v) => setVariant(v as TooltipVariant)} />
                  </>
                ),
              },
              {
                id: "behavior",
                title: "Behavior",
                controls: (
                  <>
                    <Control label={`Delay — ${delay}ms`}>
                      <input type="range" min={0} max={1200} step={100} value={delay} className="w-full"
                        onChange={(e) => setDelay(Number(e.target.value))} />
                    </Control>
                    <Control label={`Gap — ${offset}px`}>
                      <input type="range" min={0} max={24} value={offset} className="w-full"
                        onChange={(e) => setOffset(Number(e.target.value))} />
                    </Control>
                    <Control label="Boundary">
                      <ToggleRow
                        label="Constrain to the box"
                        checked={bounded}
                        onChange={setBounded}
                      />
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            The side is a <strong>preference</strong>: each trigger keeps the
            side it can and flips when it cannot. Collision is measured against
            the <strong>viewport</strong> by default — so with the boundary
            off, these triggers have room in every direction and nothing flips,
            however close to the box edge they look. Turn it on to collide
            against the dashed area instead.
          </p>
        </div>
      }
      preview={
        <div
          ref={setBox}
          className="relative h-64 w-full rounded-lg border border-dashed border-neutral-300 dark:border-neutral-600"
        >
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs opacity-50">
            {bounded ? "boundary: this box" : "boundary: the whole window"}
          </span>
          <div className="absolute left-1/2 top-1 -translate-x-1/2">
            <Tooltip text="top edge of the boundary" position={position} variant={variant} delay={delay} offset={offset}
              boundary={bounded ? box : undefined}>
              <Button variant="soft" size="sm">top edge</Button>
            </Tooltip>
          </div>
          <div className="absolute left-1/2 bottom-1 -translate-x-1/2">
            <Tooltip text="bottom edge of the boundary" position={position} variant={variant} delay={delay} offset={offset}
              boundary={bounded ? box : undefined}>
              <Button variant="soft" size="sm">bottom edge</Button>
            </Tooltip>
          </div>
          <div className="absolute left-1 top-1/2 -translate-y-1/2">
            <Tooltip text="left edge — the box clamps, the arrow slides" position={position} variant={variant} delay={delay} offset={offset}
              boundary={bounded ? box : undefined}>
              <Button variant="soft" size="sm">left edge</Button>
            </Tooltip>
          </div>
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Tooltip text="right edge — same, mirrored" position={position} variant={variant} delay={delay} offset={offset}
              boundary={bounded ? box : undefined}>
              <Button variant="soft" size="sm">right edge</Button>
            </Tooltip>
          </div>
        </div>
      }
    />
  );
};
