import React, { useState } from "react";
import { Button, InputOtp, MultiToggle } from "@cjlapao/ui-kit";
import type {
  InputOtpSize,
  InputOtpVariant,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { otpVariantOptions, trueColorOptions } from "../../shared/options";

const lengthOptions = [
  { label: "4", value: "4" },
  { label: "6", value: "6" },
  { label: "8", value: "8" },
];

const sizeOptions = [
  { label: "Small", value: "sm" },
  { label: "Medium", value: "md" },
  { label: "Large", value: "lg" },
];

export const InputOtpPlayground: React.FC = () => {
  const [length, setLength] = useState(6);
  const [variant, setVariant] = useState<InputOtpVariant>("outlined");
  const [size, setSize] = useState<InputOtpSize>("md");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [mask, setMask] = useState(false);
  const [integerOnly, setIntegerOnly] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [value, setValue] = useState("");

  return (
    <PlaygroundPanel
      controls={
        <>
          <Control label="Length">
            <MultiToggle
              fullWidth
              size="sm"
              options={lengthOptions}
              value={String(length)}
              onChange={(v) => setLength(Number(v))}
            />
          </Control>
          <Control label="Variant">
            <MultiToggle
              fullWidth
              size="sm"
              options={otpVariantOptions}
              value={variant}
              onChange={(v) => setVariant(v as InputOtpVariant)}
            />
          </Control>
          <Control label="Size">
            <MultiToggle
              fullWidth
              size="sm"
              options={sizeOptions}
              value={size}
              onChange={(v) => setSize(v as InputOtpSize)}
            />
          </Control>
          <SelectControl
            label="Tone"
            options={trueColorOptions}
            value={tone}
            onChange={(v) => setTone(v as TrueColor)}
          />
          <div className="grid grid-cols-1 gap-2">
            <ToggleRow label="Mask" checked={mask} onChange={setMask} />
            <ToggleRow
              label="Integer only"
              checked={integerOnly}
              onChange={setIntegerOnly}
            />
            <ToggleRow label="Disabled" checked={disabled} onChange={setDisabled} />
          </div>
        </>
      }
      preview={
        <div className="flex w-full max-w-sm flex-col items-center gap-3">
          <InputOtp
            length={length}
            variant={variant}
            size={size}
            tone={tone}
            mask={mask}
            integerOnly={integerOnly}
            disabled={disabled}
            value={value}
            onChange={setValue}
          />
          <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
            <span>
              Value:{" "}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {value || "—"}
              </strong>
            </span>
            <Button variant="soft" size="sm" onClick={() => setValue("")}>
              Reset
            </Button>
          </div>
        </div>
      }
    />
  );
};
