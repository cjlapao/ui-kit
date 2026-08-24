import React from "react";
import classNames from "classnames";
import { getPillColorClasses } from "../theme/Theme";
import {
  findDefinition,
  splitSmartValue,
} from "../utils/smartVariables";
import type { TrueColor } from "../theme/Theme";
import type {
  SmartVariable,
  SmartVariableGroup,
  SmartVariableResolver,
  SmartVariableState,
} from "../types/Variables";

/** How a token is shown: as itself, or as what it resolves to. */
export type SmartViewMode = "token" | "value";

/**
 * Tone per resolution state. Every renderer used its own literal palette
 * (`bg-green-50 text-green-700`, `bg-purple-50`, …) with no dark-mode partner,
 * so the badges were invisible on a dark page. These go through the shared
 * pill tokens instead.
 */
const STATE_TONES: Record<SmartVariableState, TrueColor> = {
  resolved: "emerald",
  runtime: "violet",
  missing: "rose",
};

/** Tone for a group that does not name one. */
const FALLBACK_TONE: TrueColor = "blue";

/** Declared, but resolved to nothing — a softer problem than "not found". */
const EMPTY_TONE: TrueColor = "amber";

export interface SmartVariableBadgeProps {
  variable: SmartVariable;
  groups?: SmartVariableGroup[];
  resolve?: SmartVariableResolver;
  mode?: SmartViewMode;
  /** Marks unresolvable tokens even in token mode. */
  flagMissing?: boolean;
  className?: string;
}

/** One token, rendered as a pill. */
export const SmartVariableBadge: React.FC<SmartVariableBadgeProps> = ({
  variable,
  groups = [],
  resolve,
  mode = "token",
  flagMissing = true,
  className,
}) => {
  const found = findDefinition(groups, variable);
  // With no groups the caller is driving everything through `resolve`, so a
  // token cannot be judged unknown — only unresolved.
  const unknown = groups.length > 0 && !found;
  const resolution = resolve?.(variable);
  const state: SmartVariableState =
    resolution?.state ?? (unknown ? "missing" : "resolved");
  // "No such variable" and "declared but has no value" are different problems
  // and used to render identically, so a typo looked the same as an unset
  // default.
  const empty = !unknown && state === "missing";

  const tone = (() => {
    if (unknown) return STATE_TONES.missing;
    if (mode === "token") return found?.group.tone ?? FALLBACK_TONE;
    return empty ? EMPTY_TONE : STATE_TONES[state];
  })();

  const pill = getPillColorClasses(tone, "soft");

  // In token mode the label names the variable; in value mode it *is* the
  // value, so an unknown or empty one has to say so rather than render blank.
  const label = (() => {
    if (mode === "token") {
      const prefix = variable.type === "env" ? "ENV" : "VAR";
      return `${prefix}:${variable.name}`;
    }
    if (unknown) return "not found";
    if (empty) return "empty";
    if (found?.definition.secret || variable.secret) return "••••••";
    return resolution?.value || "empty";
  })();

  const title = (() => {
    if (unknown) return `${variable.fullToken} — no such variable`;
    if (empty) return `${variable.fullToken} — no value`;
    if (resolution) return `${variable.fullToken} → ${resolution.value}`;
    return variable.fullToken;
  })();

  const flagged = unknown && flagMissing;

  return (
    <span
      title={title}
      className={classNames(
        "mx-0.5 inline-flex max-w-full items-center gap-1 truncate rounded border px-1.5 py-0.5 align-middle font-mono text-xs select-none",
        pill.base,
        pill.border,
        flagged && "border-dashed",
        className,
      )}
    >
      {flagged && (
        <span aria-hidden="true" className="font-sans">
          !
        </span>
      )}
      {label}
    </span>
  );
};

export interface SmartValuePartsProps
  extends Omit<SmartVariableBadgeProps, "variable"> {
  value: string;
  /** Rendered when `value` is empty. */
  placeholder?: React.ReactNode;
}

/**
 * A value split into literal text and token badges. One implementation for
 * `SmartInput`'s preview, `SmartValue`, and anything else that displays a
 * value containing tokens.
 */
export const SmartValueParts: React.FC<SmartValuePartsProps> = ({
  value,
  placeholder,
  ...badgeProps
}) => {
  if (!value) {
    return <>{placeholder}</>;
  }

  return (
    <>
      {splitSmartValue(value).map((part) =>
        part.kind === "text" ? (
          <span key={`t-${part.index}`}>{part.text}</span>
        ) : (
          <SmartVariableBadge
            key={`v-${part.index}`}
            variable={part.variable}
            {...badgeProps}
          />
        ),
      )}
    </>
  );
};
