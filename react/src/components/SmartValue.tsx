import React, { useMemo, useState } from "react";
import classNames from "classnames";
import IconButton from "./IconButton";
import { SmartValueParts, type SmartViewMode } from "./SmartVariableParts";
import { createDefaultResolver, hasSmartVariables } from "../utils/smartVariables";
import type { TrueColor } from "../theme/Theme";
import type {
  SmartVariableGroup,
  SmartVariableResolver,
} from "../types/Variables";

export interface SmartValueProps {
  value: string;
  /** The variable groups the tokens are resolved against. */
  groups?: SmartVariableGroup[];
  /** Turns a token into a display value. Defaults to a lookup over `groups`. */
  resolve?: SmartVariableResolver;
  /** Which view to open in. @default "token" */
  defaultViewMode?: SmartViewMode;
  /** Marks unresolvable tokens in both views. @default true */
  flagMissing?: boolean;
  /** Accent colour for the toggle. @default "blue" */
  tone?: TrueColor;
  /** Keeps the toggle visible instead of revealing it on hover. */
  alwaysShowToggle?: boolean;
  className?: string;
}

/**
 * The read-only twin of `SmartInput`: renders a value's tokens as badges with
 * a toggle between the token and its resolved value.
 *
 * Both now render through `SmartValueParts`, so they cannot drift — this
 * component used to carry its own copy of the split loop and its own badge
 * palette, and the two had already disagreed about colours and labels.
 */
export const SmartValue: React.FC<SmartValueProps> = ({
  value = "",
  groups = [],
  resolve,
  defaultViewMode = "token",
  flagMissing = true,
  tone = "blue",
  alwaysShowToggle = false,
  className,
}) => {
  const [viewMode, setViewMode] = useState<SmartViewMode>(defaultViewMode);

  const resolver = useMemo<SmartVariableResolver>(
    () => resolve ?? createDefaultResolver(groups),
    [resolve, groups],
  );

  if (!hasSmartVariables(value)) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={classNames("group inline-flex items-start gap-1", className)}>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-y-1">
        <SmartValueParts
          value={value}
          groups={groups}
          resolve={resolver}
          mode={viewMode}
          flagMissing={flagMissing}
        />
      </span>
      <IconButton
        icon={viewMode === "token" ? "EyeOpen" : "EyeClosed"}
        variant="ghost"
        color={tone}
        size="xs"
        onClick={(event) => {
          event.stopPropagation();
          setViewMode((prev) => (prev === "token" ? "value" : "token"));
        }}
        srLabel={viewMode === "token" ? "Show values" : "Show tokens"}
        tooltip={viewMode === "token" ? "Show values" : "Show tokens"}
        className={classNames(
          "shrink-0",
          !alwaysShowToggle &&
            "opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
        )}
      />
    </span>
  );
};

export default SmartValue;
