import React, { useLayoutEffect, useRef } from "react";
import { ScrollArea } from "./ScrollArea";

interface TableViewportProps {
  children: React.ReactElement<React.TableHTMLAttributes<HTMLTableElement>>;
  fullHeight?: boolean;
  maxHeight?: string | number;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  onScroll: () => void;
  guide?: React.ReactNode;
}

/** Separate vertical scrolling from the column header, sharing native column measurements. */
export function TableViewport({ children, fullHeight, maxHeight, viewportRef, onScroll, guide }: TableViewportProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerTableRef = useRef<HTMLTableElement>(null);
  const bodyTableRef = useRef<HTMLTableElement>(null);
  const parts = React.Children.toArray(children.props.children);
  const header = parts.filter((part) => React.isValidElement(part) && part.type === "thead");
  const body = parts.filter((part) => React.isValidElement(part) && part.type === "tbody");
  const columns = parts.filter((part) => React.isValidElement(part) && part.type === "colgroup");
  const hints = columns.flatMap((group) => React.isValidElement<{ children?: React.ReactNode }>(group)
    ? React.Children.toArray(group.props.children).filter(React.isValidElement<{ style?: React.CSSProperties }>) : []);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    const head = headerTableRef.current;
    const rows = bodyTableRef.current;
    if (!frame || !head || !rows) return;
    const measure = () => {
      // Restore natural layout before measuring, so a narrower parent can shrink columns again.
      for (const table of [head, rows]) {
        table.querySelectorAll("col").forEach((col, index) => {
          col.removeAttribute("style");
          Object.assign((col as HTMLElement).style, hints[index]?.props.style);
        });
        table.style.tableLayout = children.props.style?.tableLayout ?? "auto";
        table.style.width = "100%";
      }
      const headerCells = Array.from(head.querySelectorAll("th"));
      const bodyRow = Array.from(rows.rows).find((row) => row.cells.length === headerCells.length);
      const widths = headerCells.map((cell, index) => Math.max(
        cell.getBoundingClientRect().width,
        bodyRow?.cells[index]?.getBoundingClientRect().width ?? 0,
      ));
      const width = widths.reduce((sum, value) => sum + value, 0);
      if (!width) return;
      for (const table of [head, rows]) {
        table.querySelectorAll("col").forEach((col, index) => {
          (col as HTMLElement).style.width = `${widths[index]}px`;
        });
        table.style.tableLayout = "fixed";
        table.style.width = `${width}px`;
      }
    };
    const updateHeaderHeight = () => frame.style.setProperty("--table-header-height", `${head.getBoundingClientRect().height}px`);
    const count = head.querySelectorAll("th").length;
    for (const table of [head, rows]) {
      const group = table.querySelector("colgroup")!;
      while (group.children.length > count) group.lastElementChild?.remove();
      while (group.children.length < count) group.append(document.createElement("col"));
    }
    measure();
    updateHeaderHeight();
    let previousWidth = frame.clientWidth;
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => {
      if (frame.clientWidth === previousWidth) return;
      previousWidth = frame.clientWidth;
      measure();
      updateHeaderHeight();
    });
    observer?.observe(frame);
    return () => observer?.disconnect();
  });

  return (
    <div ref={frameRef} role="table" data-slot="table-viewport" className="flex min-h-0 min-w-0 flex-col" style={{ height: fullHeight ? "100%" : undefined, maxHeight }}>
      <div
        ref={headerRef}
        data-slot="table-header"
        className="relative shrink-0 overflow-hidden"
        onScroll={() => {
          // Focusing a clipped sort button can scroll the header independently.
          if (viewportRef.current && headerRef.current) viewportRef.current.scrollLeft = headerRef.current.scrollLeft;
        }}
      >
        <table {...children.props} role="presentation" ref={headerTableRef}><colgroup />{header}</table>
      </div>
      <ScrollArea
        className="min-h-0 min-w-0 flex-1"
        style={{
          flexBasis: fullHeight ? 0 : "auto",
          maxHeight: maxHeight != null
            ? `max(0px, calc(${typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight} - var(--table-header-height, 0px)))`
            : undefined,
        }}
        viewportRef={viewportRef}
        contentClassName="relative"
        onScrollCapture={() => {
          if (headerRef.current && viewportRef.current) headerRef.current.scrollLeft = viewportRef.current.scrollLeft;
          onScroll();
        }}
      >
        <table {...children.props} role="presentation" ref={bodyTableRef}><colgroup />{body}</table>
        {guide}
      </ScrollArea>
    </div>
  );
}
