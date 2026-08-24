import React, { useState } from "react";
import { Button, MultiToggle, Rating } from "@cjlapao/ui-kit";
import type {
  RatingOrientation,
  RatingSize,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import {
  ratingOrientationOptions,
  trueColorOptions,
} from "../../shared/options";

const starCountOptions = [
  { label: "5", value: "5" },
  { label: "10", value: "10" },
];

const sizeOptions = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

const formatValue = (value: number) =>
  value % 1 === 0 ? String(value) : value.toFixed(1);

export const RatingPlayground: React.FC = () => {
  const [starCount, setStarCount] = useState(5);
  const [size, setSize] = useState<RatingSize>("md");
  const [tone, setTone] = useState<TrueColor>("amber");
  const [orientation, setOrientation] =
    useState<RatingOrientation>("horizontal");
  const [allowHalf, setAllowHalf] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState(3);

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Stars">
            <MultiToggle
              fullWidth
              size="sm"
              options={starCountOptions}
              value={String(starCount)}
              onChange={(v) => setStarCount(Number(v))}
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(v) => setSize(v as RatingSize)}
            />
          </Control>
          <Control label="Orientation">
            <MultiToggle
              fullWidth
              size="sm"
              options={ratingOrientationOptions}
              value={orientation}
              onChange={(v) => setOrientation(v as RatingOrientation)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Half stars" checked={allowHalf} onChange={setAllowHalf} />
            <ToggleRow label="Read only" checked={readOnly} onChange={setReadOnly} />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
      preview={
        <div className="flex w-full max-w-md flex-col items-center gap-3">
          <Rating
            stars={starCount}
            size={size}
            tone={tone}
            orientation={orientation}
            allowHalf={allowHalf}
            readOnly={readOnly}
            disabled={disabled}
            value={value}
            onChange={setValue}
            ariaLabel="Playground rating"
          />
          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              Value:{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {value ? formatValue(value) : "—"}
                {" / "}
                {starCount}
              </strong>
            </span>
            <Button variant="soft" size="sm" onClick={() => setValue(3)}>
              Reset
            </Button>
          </div>
        </div>
      }
    />
  );
};
