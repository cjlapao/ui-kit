import type { HTMLAttributes, ReactNode } from "react";
import classNames from "classnames";
import {
  CONTENT_ACTIONS_ALIGN,
  CONTENT_ACTIONS_GAPS,
  type ContentActionsLayoutProps,
} from "../../../common/components/contentActions";

export interface ContentActionsProps extends HTMLAttributes<HTMLDivElement>, ContentActionsLayoutProps {
  children?: ReactNode;
  actions?: ReactNode;
}

/** Content yields width to a single row of actions, without wrapping the row. */
export function ContentActions({
  children,
  actions,
  gap = "md",
  align = "start",
  contentClassName,
  actionsClassName,
  className,
  ...rest
}: ContentActionsProps) {
  const hasActions = actions != null && typeof actions !== "boolean";
  return (
    <div
      {...rest}
      data-slot="content-actions"
      className={classNames("flex min-w-0 flex-nowrap", CONTENT_ACTIONS_ALIGN[align], CONTENT_ACTIONS_GAPS[gap], className)}
    >
      <div data-slot="content-actions-content" className={classNames("min-w-0 flex-1", contentClassName)}>
        {children}
      </div>
      {hasActions && (
        <div
          data-slot="content-actions-actions"
          className={classNames(
            "flex min-w-0 flex-initial flex-nowrap items-center overflow-x-auto [&>*]:shrink-0",
            CONTENT_ACTIONS_GAPS[gap],
            actionsClassName,
          )}
        >
          {actions}
        </div>
      )}
    </div>
  );
}

export default ContentActions;
