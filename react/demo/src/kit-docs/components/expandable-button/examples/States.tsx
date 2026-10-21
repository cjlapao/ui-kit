import { ExpandableButton } from "@cjlapao/ui-kit";
import type { ReactNode } from "react";

const Swatch = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    {children}
    <span className="text-[10px] uppercase tracking-wide opacity-60">
      {label}
    </span>
    {hint && <span className="text-[11px] opacity-50">{hint}</span>}
  </div>
);

const States = () => (
  <div className="flex w-full flex-col gap-4">
    <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
      Hover, focus and press these.
    </p>
    <div className="flex w-full flex-wrap items-end justify-center gap-4">
      <Swatch label="default">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="loading" hint="never expands">
        <ExpandableButton
          icon="Send"
          label="Sending"
          variant="solid"
          color="blue"
          size="lg"
          loading
          spinnerVariant="segments"
          srLabel="Sending"
        />
      </Swatch>
      <Swatch label="disabled" hint="never expands">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          disabled
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="accent" hint="the parent owns the fill">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="soft"
          color="blue"
          size="lg"
          accent
          accentColor="indigo"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="icon tint">
        <ExpandableButton
          icon="Star"
          label="Star"
          variant="soft"
          color="neutral"
          size="lg"
          iconColor="red"
          srLabel="Star"
        />
      </Swatch>
      <Swatch label="tooltip" hint="replaces the native title">
        <ExpandableButton
          icon="Send"
          label="Send"
          variant="solid"
          color="blue"
          size="lg"
          tooltip="Send the message"
          tooltipPosition="top"
          srLabel="Send"
        />
      </Swatch>
      <Swatch label="label before" hint="the glyph leads">
        <ExpandableButton
          icon="ArrowRight"
          label="Continue"
          variant="solid"
          color="blue"
          size="lg"
          labelPlacement="before"
          srLabel="Continue"
        />
      </Swatch>
    </div>
    <p className="text-center text-[11px] opacity-60">
      <code>loading</code> and <code>disabled</code> set the real{" "}
      <code>disabled</code> attribute, so the hover and focus triggers cannot
      open them — the spinner replaces the glyph and the button skips the usual
      dim so that spinner stays visible.
    </p>
  </div>
);

export default States;
