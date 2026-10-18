import React, { useState } from "react";
import {
  Input,
  MultiToggle,
  Shimmer,
  type ShimmerSpeed,
  type TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  shimmerSpeedOptions,
  shimmerToneOptions,
} from "../../shared/options";

const TYPE_SIZES = [
  { label: "Xs", value: "xs", className: "text-xs" },
  { label: "Sm", value: "sm", className: "text-sm" },
  { label: "Md", value: "md", className: "text-base" },
  { label: "Lg", value: "lg", className: "text-lg" },
  { label: "Xl", value: "xl", className: "text-2xl" },
] as const;
type TypeSize = (typeof TYPE_SIZES)[number]["value"];

/**
 * Speed and type size are short lists (MultiToggle); the tone select carries
 * Inherit plus the 21 tones, which would overflow a toggle row.
 */
export const ShimmerPlayground: React.FC = () => {
  const [speed, setSpeed] = useState<ShimmerSpeed>("normal");
  const [tone, setTone] = useState<TrueColor | "inherit">("inherit");
  const [typeSize, setTypeSize] = useState<TypeSize>("md");
  const [copy, setCopy] = useState("Thinking…");

  const sizeClass =
    TYPE_SIZES.find((size) => size.value === typeSize)?.className ??
    "text-base";

  return (
    <PlaygroundPanel
      previewClassName="w-full flex-col items-center gap-3"
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <Control label="Speed">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={shimmerSpeedOptions}
                        value={speed}
                        onChange={(v) => setSpeed(v as ShimmerSpeed)}
                      />
                    </Control>
                    <SelectControl
                      label="Tone"
                      options={shimmerToneOptions}
                      value={tone}
                      onChange={(v) =>
                        setTone(v as TrueColor | "inherit")
                      }
                    />
                    <Control label="Type size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={TYPE_SIZES.map(
                          ({ label, value }) => ({ label, value }),
                        )}
                        value={typeSize}
                        onChange={(v) => setTypeSize(v as TypeSize)}
                      />
                    </Control>
                  </>
                ),
              },
              {
                id: "content",
                title: "Content",
                controls: (
                  <Control label="Copy">
                    <Input
                      size="sm"
                      value={copy}
                      onChange={(event) => setCopy(event.target.value)}
                    />
                  </Control>
                ),
              },
            ]}
          />
        </div>
      }
      preview={
        <div className="flex flex-col items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 px-10 py-10 dark:from-neutral-800 dark:to-neutral-900">
            <Shimmer
              speed={speed}
              tone={tone === "inherit" ? undefined : tone}
              className={`${sizeClass} font-medium`}
            >
              {copy || "Thinking…"}
            </Shimmer>
          </div>
          <span className="text-xs opacity-70">
            {speed} · {tone} · {typeSize}
          </span>
        </div>
      }
    />
  );
};
