import React, { forwardRef, useState } from "react";
import classNames from "classnames";
import Panel, { type PanelProps } from "../Panel";
import Popover, { type PopoverProps } from "../Popover";
import TooltipWrapper from "../TooltipWrapper";
import type { StepperStep, StepStatus } from "../Stepper";
import { getCompactSurfacePaddingClass, getTrueColorDotClass, type ControlSize, type SurfaceCorner, type TrueColor } from "../../theme/Theme";
import { overflowStatus, planDotSteps } from "./plan";

export interface DotStepperStep extends StepperStep {
  /** Plain-text name for a title rendered as a React node. */
  tooltip?: string;
}

export interface DotStepperProps extends Pick<PanelProps, "variant" | "tone" | "padding" | "glassOpacity" | "transparency" | "vibrancy" | "specularMode" | "className" | "style"> {
  steps: DotStepperStep[];
  /** Zero-based. currentStepId takes precedence. */
  currentIndex?: number;
  currentStepId?: string;
  /** Actual steps; additional overflow stacks do not count. @default 5 */
  maxVisible?: number;
  /** Shared control density. @default "sm" */
  size?: ControlSize;
  /** Shared container corners, plus a capsule. @default "full" */
  corner?: SurfaceCorner | "full";
  doneColor?: TrueColor;
  nextColor?: TrueColor;
  errorColor?: TrueColor;
  /** Only the active dot pulses. Respects reduced motion. @default true */
  animated?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
  onStepSelect?: (step: DotStepperStep, index: number) => void;
  renderActiveContent?: (step: DotStepperStep, index: number) => React.ReactNode;
  popoverProps?: Omit<PopoverProps, "trigger" | "children" | "visible">;
}

const sizes: Record<ControlSize, { target: string; dot: string; gap: string; stack: string }> = {
  xs: { target: "h-4 w-4", dot: "h-1.5 w-1.5", gap: "gap-0.5", stack: "w-2" },
  sm: { target: "h-5 w-5", dot: "h-2 w-2", gap: "gap-0.5", stack: "w-2.5" },
  md: { target: "h-6 w-6", dot: "h-3 w-3", gap: "gap-1", stack: "w-3.5" },
  lg: { target: "h-8 w-8", dot: "h-4 w-4", gap: "gap-1", stack: "w-5" },
  xl: { target: "h-10 w-10", dot: "h-5 w-5", gap: "gap-1.5", stack: "w-6" },
};

// Forward Popover's ref and handlers to the real button; TooltipWrapper adds
// no layout wrapper or extra focus stop.
const DotTrigger = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { tooltip?: string }>(function DotTrigger({ tooltip, ...props }, ref) {
  return <TooltipWrapper text={tooltip}><button {...props} ref={ref} /></TooltipWrapper>;
});

function ActivePopover({ trigger, content, options }: { trigger: React.ReactElement; content: React.ReactNode; options?: DotStepperProps["popoverProps"] }) {
  const [open, setOpen] = useState(false);
  const { onOpenChange, ...rest } = options ?? {};
  // Hide the name tooltip while its richer content is open.
  const anchor = React.cloneElement(trigger as React.ReactElement<{ tooltip?: string }>, { tooltip: open ? undefined : (trigger.props as { tooltip?: string }).tooltip });
  return <Popover {...rest} trigger={anchor} visible={open} onOpenChange={value => { setOpen(value); onOpenChange?.(value); }}>{content}</Popover>;
}

/** A table-row-sized view of workflow progress, with no automatic advancement. */
export function DotStepper({ steps, currentIndex, currentStepId, maxVisible = 5, size = "sm", corner = "full", tone = "blue", variant = "tonal", padding = "none", doneColor = "emerald", nextColor = "neutral", errorColor = "rose", animated = true, disabled = false, onStepSelect, renderActiveContent, popoverProps, className, style, "aria-label": label = "Workflow progress", ...surface }: DotStepperProps) {
  const plan = planDotSteps(steps, currentIndex, currentStepId, maxVisible);
  const density = sizes[size];
  const fill = (status: StepStatus) => status === "completed" ? getTrueColorDotClass(doneColor) : status === "error" ? getTrueColorDotClass(errorColor) : status === "active" ? getTrueColorDotClass(tone) : classNames(getTrueColorDotClass(nextColor), "opacity-20 dark:opacity-25");
  const overflow = (side: "before" | "after", count: number) => count > 0 && <TooltipWrapper key={side} text={`${count} more steps ${side}`}>
    <span tabIndex={disabled ? -1 : 0} role="img" aria-label={`${count} more steps ${side}`} className={classNames("relative inline-flex shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2", density.target)}>
      <span aria-hidden="true" className={classNames("relative inline-flex items-center", density.stack)}>
        {[0, 1].map(index => <span key={index} className={classNames("absolute rounded-full", density.dot, fill(overflowStatus(side === "before" ? plan.statuses.slice(0, plan.start) : plan.statuses.slice(plan.end))))} style={{ left: index === 0 ? 0 : "35%", transform: "scale(.72)", filter: index === (side === "before" ? 0 : 1) ? "opacity(.55)" : undefined, zIndex: side === "before" ? index : 1 - index }} />)}
      </span>
    </span>
  </TooltipWrapper>;
  return <Panel {...surface} role="group" aria-label={label} aria-disabled={disabled || undefined} variant={variant} tone={tone} corner={corner === "full" ? "none" : corner} padding="none" className={classNames("align-middle", disabled && "opacity-50", className)} style={{ width: "max-content", overflow: "visible", ...(corner === "full" ? { borderRadius: 9999 } : {}), ...style }}>
    <div className={classNames("flex w-max items-center", density.gap, getCompactSurfacePaddingClass(padding))}>
      {overflow("before", plan.before)}
      {plan.indices.map(index => {
        const step = steps[index];
        const status = plan.statuses[index];
        const active = status === "active";
        const name = step.tooltip ?? (typeof step.title === "string" || typeof step.title === "number" ? String(step.title) : `Step ${index + 1}`);
        const locked = disabled || step.disabled;
        const content = active && !locked ? renderActiveContent?.(step, index) : undefined;
        const trigger = <DotTrigger tooltip={name} type="button" disabled={locked} aria-label={`${name}, step ${index + 1} of ${steps.length}, ${status}`} aria-current={active ? "step" : undefined} onClick={() => onStepSelect?.(step, index)} className={classNames("relative inline-flex shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed", density.target, onStepSelect || content ? "cursor-pointer" : "cursor-default")}>
          <span aria-hidden="true" className={classNames("relative block shrink-0 rounded-full", density.dot)}>
            {active && animated && <span data-dot-pulse="" className={classNames("pointer-events-none absolute inset-0 rounded-full motion-safe:animate-ping [animation-duration:1.6s] motion-reduce:hidden", getTrueColorDotClass(tone))} />}
            <span data-dot-status={status} className={classNames("absolute inset-0 rounded-full", fill(status))} />
          </span>
        </DotTrigger>;
        return <React.Fragment key={`${step.id ?? index}:${status}:${locked ? "disabled" : "enabled"}`}>{content !== undefined && content !== null ? <ActivePopover trigger={trigger} content={content} options={popoverProps} /> : trigger}</React.Fragment>;
      })}
      {overflow("after", plan.after)}
    </div>
  </Panel>;
}

export default DotStepper;
