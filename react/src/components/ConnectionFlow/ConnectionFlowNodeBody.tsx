import React from "react";
import classNames from "classnames";

import CustomIcon from "../CustomIcon";
import Progress from "../Progress";
import ProgressSpinner from "../ProgressSpinner";
import {
  getToneClasses,
  itemGlyph,
  itemHasBar,
  itemTone,
  itemsReserveGlyph,
  nodeIcon,
  nodeIsActive,
  visibleItems,
  type ConnectionFlowLayoutOptions,
  type ConnectionFlowNodeItem,
  type LaidOutNode,
  type NodeMetrics,
} from "../../connectionFlow";
import type { IconName } from "../../icons/registry";

export interface ConnectionFlowNodeBodyProps {
  node: LaidOutNode;
  metrics: NodeMetrics;
  /** Whether a node's own progress bar is drawn. */
  showProgress: boolean;
  /** The layout's options, for the item cap. */
  options: ConnectionFlowLayoutOptions;
  /** Whether the card's body scrolls, which changes how it fills the box. */
  scrollable?: boolean;
  /** Nodes whose item list is expanded. */
  expanded: ReadonlySet<string>;
  onToggleExpanded: (id: string) => void;
}

/** One row of a card. */
const Item: React.FC<{
  item: ConnectionFlowNodeItem;
  metrics: NodeMetrics;
  fallbackProgress: "none" | "bar" | "spinner";
  reserveGlyph: boolean;
  nodeTone: LaidOutNode["tone"];
}> = ({ item, metrics, fallbackProgress, reserveGlyph, nodeTone }) => {
  const itemToneName = itemTone(item, nodeTone);
  const tone = getToneClasses(itemToneName);
  const glyph = itemGlyph(item, fallbackProgress);

  return (
    <div className="flex min-w-0 flex-col" style={{ gap: metrics.gap }}>
      <div className="flex min-w-0 items-center" style={{ gap: metrics.gap }}>
        {reserveGlyph && (
          // The slot is reserved for the whole list, so a title does not step
          // sideways when its neighbour's spinner finishes.
          <div
            className="flex shrink-0 items-center justify-center"
            style={{ width: metrics.glyph, height: metrics.glyph }}
          >
            {glyph.kind === "spinner" && (
              <ProgressSpinner
                size={metrics.glyphSize}
                value={glyph.value * 100}
                color={itemToneName}
                showValue={false}
              />
            )}
            {glyph.kind === "icon" && (
              <CustomIcon
                icon={glyph.name as IconName}
                customSize={metrics.glyph}
                className={tone.body}
              />
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div
            className={classNames("truncate font-medium", tone.heading)}
            style={{
              fontSize: metrics.body,
              lineHeight: `${metrics.titleLine}px`,
            }}
          >
            {item.title}
          </div>
          {item.subtitle && (
            <div
              className={classNames("truncate", tone.body)}
              style={{
                fontSize: metrics.body,
                lineHeight: `${metrics.bodyLine}px`,
              }}
            >
              {item.subtitle}
            </div>
          )}
        </div>
      </div>
      {itemHasBar(item, fallbackProgress) && (
        <Progress
          size={metrics.barSize}
          value={(item.progress ?? 0) * 100}
          color={itemToneName}
          motion={(item.progress ?? 0) < 1 ? "shimmer" : "none"}
        />
      )}
    </div>
  );
};

/**
 * The default contents of a node card.
 *
 * Rendered at its natural size and scaled by one transform on the wrapper, so
 * type, padding, gaps and the progress bar all zoom together — and, more
 * importantly, the height the DOM produces here is the same number
 * `measureNode` computed, at any zoom. Scaling each property individually left
 * the bar and the glyph at a fixed size while the box shrank.
 *
 * Every dimension comes from `metrics`. The previous version hardcoded
 * `text-[13px]`, `text-[11px]` and a 10px inset, so `size` changed the box and
 * nothing inside it.
 */
const ConnectionFlowNodeBody: React.FC<ConnectionFlowNodeBodyProps> = ({
  node,
  metrics,
  showProgress,
  options,
  scrollable = false,
  expanded,
  onToggleExpanded,
}) => {
  const tone = getToneClasses(node.tone);
  const glyph = nodeIcon(node.node);
  const hasHeader = Boolean(node.node.title || node.node.subtitle);
  const allItems = node.node.items ?? [];
  const fallbackProgress = node.node.itemProgress ?? options.itemProgress;
  const reserveGlyph = itemsReserveGlyph(allItems, fallbackProgress);
  const shown = visibleItems(node.node, options, expanded);

  return (
    <div
      className={classNames(
        "flex min-w-0 flex-col",
        // Centring content that overflows its scroll container puts the first
        // row above the scrollable area, where it can never be reached. A
        // scrolling body starts at the top and takes its natural height.
        scrollable ? "h-auto justify-start" : "h-full justify-center",
      )}
      style={{ gap: metrics.gap }}
    >
      {hasHeader && (
        <div
          className="flex min-w-0 items-center"
          style={{ gap: metrics.gap }}
        >
          {glyph && (
            <CustomIcon
              icon={glyph as IconName}
              customSize={metrics.glyph}
              className={classNames("shrink-0", tone.body)}
            />
          )}
          <div className="min-w-0 flex-1">
            {node.node.title && (
              <div
                className={classNames("truncate font-semibold", tone.heading)}
                style={{
                  fontSize: metrics.title,
                  lineHeight: `${metrics.titleLine}px`,
                }}
              >
                {node.node.title}
              </div>
            )}
            {node.node.subtitle && (
              <div
                className={classNames("truncate", tone.body)}
                style={{
                  fontSize: metrics.body,
                  lineHeight: `${metrics.bodyLine}px`,
                }}
              >
                {node.node.subtitle}
              </div>
            )}
          </div>
        </div>
      )}
      {shown.items.length > 0 && (
        <div className="flex min-w-0 flex-col" style={{ gap: metrics.itemGap }}>
          {shown.items.map((item) => (
            <Item
              key={item.id}
              item={item}
              metrics={metrics}
              fallbackProgress={fallbackProgress}
              reserveGlyph={reserveGlyph}
              nodeTone={node.tone}
            />
          ))}
          {(shown.hidden > 0 || expanded.has(node.id)) && (
            // `stopPropagation` rather than lifting the card out of
            // `role="button"`: the click must not also select the card.
            <button
              type="button"
              className={classNames(
                "truncate text-left font-medium underline-offset-2 hover:underline",
                tone.body,
              )}
              style={{
                fontSize: metrics.body,
                lineHeight: `${metrics.moreRow}px`,
              }}
              onClick={(event) => {
                event.stopPropagation();
                onToggleExpanded(node.id);
              }}
            >
              {shown.hidden > 0 ? `Show ${shown.hidden} more` : "Show less"}
            </button>
          )}
        </div>
      )}
      {node.node.description && (
        <div
          className={classNames("truncate", tone.body)}
          style={{
            fontSize: metrics.body,
            lineHeight: `${metrics.bodyLine}px`,
          }}
        >
          {node.node.description}
        </div>
      )}
      {showProgress && node.node.progress !== undefined && (
        <Progress
          size={metrics.barSize}
          value={node.node.progress * 100}
          color={node.tone}
          motion={nodeIsActive(node.node) ? "shimmer" : "none"}
        />
      )}
    </div>
  );
};

ConnectionFlowNodeBody.displayName = "ConnectionFlowNodeBody";

export default ConnectionFlowNodeBody;
