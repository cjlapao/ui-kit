import React, { useState } from "react";
import { TruncatedText } from "@cjlapao/ui-kit";
import { PlaygroundPanel, SelectControl, Control } from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";

const LONG =
  "sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08 — a digest long enough to need truncating";

const asOptions = ["div", "span", "p"].map((value) => ({ label: value, value }));
const positionOptions = ["top", "bottom"].map((value) => ({ label: value, value }));

export const TruncatedTextPlayground: React.FC = () => {
  const [as, setAs] = useState<"div" | "span" | "p">("div");
  const [position, setPosition] = useState<"top" | "bottom">("top");
  const [width, setWidth] = useState(280);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "options",
                title: "Options",
                controls: (
                  <>
                    <SelectControl label="Element" options={asOptions} value={as}
                      onChange={(v) => setAs(v as "div" | "span" | "p")} />
                    <SelectControl label="Tooltip side" options={positionOptions} value={position}
                      onChange={(v) => setPosition(v as "top" | "bottom")} />
                    <Control label="Container width">
                      <input type="range" min={120} max={600} value={width} className="w-full"
                        onChange={(e) => setWidth(Number(e.target.value))} />
                    </Control>
                  </>
                ),
              },
            ]}
          />
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Widen the container until the ellipsis disappears — the tooltip and
            the tab stop go with it. The element is focusable{" "}
            <strong>only while actually truncated</strong>, so a page of short
            labels gains no dead tab stops. Try tabbing to it.
          </p>
        </div>
      }
      preview={
        <div style={{ width }} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
          <TruncatedText text={LONG} as={as} tooltipPosition={position} delay={300} />
        </div>
      }
    />
  );
};
