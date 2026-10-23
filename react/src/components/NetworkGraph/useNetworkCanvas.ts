import { useCallback, useEffect, useRef, useState } from "react";
import { TRUE_COLOR_HEX } from "../chart/engine/theme";
import type { TrueColor } from "../../theme/Theme";
import {
  fitNetwork,
  zoomAt,
  type NetworkModel,
  type PositionedNode,
} from "./model";
import type { NetworkGraphViewport } from "./types";

interface CanvasOptions {
  active: boolean;
  model: NetworkModel;
  nodes: PositionedNode[];
  visible: Set<string>;
  selected: string | null;
  focused: string | null;
  highlighted: Set<string>;
  tone: TrueColor;
  showLabels: boolean;
  onViewportChange?: (view: NetworkGraphViewport) => void;
}

export function useNetworkCanvas(options: CanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const view = useRef<NetworkGraphViewport>({ x: 0, y: 0, zoom: 1 });
  const size = useRef({ width: 1, height: 1 });
  const latest = useRef(options);
  const frame = useRef<number | null>(null);
  const [zoom, setZoom] = useState(1);
  const colors = useRef(new Map<string, string>());
  const textColor = useRef("#737373");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const {
      model,
      nodes,
      visible,
      selected,
      focused,
      highlighted,
      tone,
      showLabels,
    } = latest.current;
    const { width, height } = size.current;
    const v = view.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (
      canvas.width !== Math.round(width * dpr) ||
      canvas.height !== Math.round(height * dpr)
    ) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.translate(v.x, v.y);
    ctx.scale(v.zoom, v.zoom);
    const groupTones = new Map(model.groups.map((g) => [g.id, g.tone]));
    const color = (t: TrueColor) => colors.current.get(t) ?? TRUE_COLOR_HEX[t];
    const nodeTone = (n: PositionedNode) =>
      n.tone ?? groupTones.get(n.community ?? "") ?? tone;
    const neighbors =
      selected !== null ? model.adjacency.get(selected) : undefined;
    const pathNodes = new Set<string>();
    if (highlighted.size)
      for (const edge of model.edges)
        if (highlighted.has(edge.id)) {
          pathNodes.add(edge.source);
          pathNodes.add(edge.target);
        }
    // Group edge strokes by paint to avoid a Canvas draw call for every edge.
    const batches = new Map<
      string,
      { color: string; active: boolean; edges: typeof model.edges }
    >();
    for (const edge of model.edges) {
      if (!visible.has(edge.source) || !visible.has(edge.target)) continue;
      const active =
        highlighted.has(edge.id) ||
        (selected !== null &&
          (edge.source === selected || edge.target === selected));
      const stroke = color(edge.tone ?? nodeTone(edge.from));
      const key = `${stroke}:${active}`;
      const batch = batches.get(key) ?? { color: stroke, active, edges: [] };
      batch.edges.push(edge);
      batches.set(key, batch);
    }
    for (const active of [false, true])
      for (const batch of batches.values()) {
        if (batch.active !== active) continue;
        ctx.beginPath();
        ctx.strokeStyle = batch.color;
        ctx.globalAlpha = active
          ? 0.95
          : selected !== null || highlighted.size
            ? 0.08
            : 0.28;
        ctx.lineWidth = (active ? 1.8 : 0.7) / v.zoom;
        for (const edge of batch.edges) {
          if (edge.source === edge.target) {
            ctx.moveTo(edge.from.x + 12, edge.from.y - 10);
            ctx.arc(edge.from.x, edge.from.y - 10, 12, 0, Math.PI * 2);
          } else {
            ctx.moveTo(edge.from.x, edge.from.y);
            ctx.lineTo(edge.to.x, edge.to.y);
          }
        }
        ctx.stroke();
      }
    for (const node of nodes) {
      const sx = node.x * v.zoom + v.x,
        sy = node.y * v.zoom + v.y;
      if (sx < -50 || sx > width + 50 || sy < -50 || sy > height + 50) continue;
      const active =
        node.id === selected ||
        node.id === focused ||
        neighbors?.has(node.id) ||
        pathNodes.has(node.id);
      ctx.globalAlpha =
        selected !== null || highlighted.size ? (active ? 1 : 0.22) : 1;
      ctx.fillStyle = color(nodeTone(node));
      ctx.beginPath();
      ctx.arc(
        node.x,
        node.y,
        Math.max(node.radius, 1.5 / v.zoom),
        0,
        Math.PI * 2,
      );
      ctx.fill();
      if (node.id === selected || node.id === focused) {
        ctx.strokeStyle = color(nodeTone(node));
        ctx.lineWidth = 1.5 / v.zoom;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 4 / v.zoom, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (
        node.id === selected ||
        node.id === focused ||
        (showLabels && v.zoom >= 0.8 && nodes.length <= 250)
      ) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = textColor.current;
        ctx.font = `${12 / v.zoom}px sans-serif`;
        ctx.fillText(
          node.label ?? node.id,
          node.x + node.radius + 7 / v.zoom,
          node.y + 4 / v.zoom,
        );
      }
    }
    ctx.globalAlpha = 1;
  }, []);
  const requestDraw = useCallback(() => {
    if (frame.current !== null) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = null;
      draw();
    });
  }, [draw]);
  const update = useCallback(
    (next: NetworkGraphViewport) => {
      view.current = next;
      setZoom(next.zoom);
      requestDraw();
      latest.current.onViewportChange?.({ ...next });
    },
    [requestDraw],
  );
  const fit = useCallback(
    () =>
      update(
        fitNetwork(
          latest.current.nodes,
          size.current.width,
          size.current.height,
        ),
      ),
    [update],
  );
  const zoomBy = useCallback(
    (factor: number, x = size.current.width / 2, y = size.current.height / 2) =>
      update(zoomAt(view.current, factor, x, y)),
    [update],
  );
  const focusNode = useCallback(
    (node: PositionedNode) => {
      update({
        ...view.current,
        x: size.current.width / 2 - node.x * view.current.zoom,
        y: size.current.height / 2 - node.y * view.current.zoom,
      });
    },
    [update],
  );

  useEffect(() => {
    latest.current = options;
    requestDraw();
  }, [options, requestDraw]);
  useEffect(() => {
    fit();
  }, [options.model, fit]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const measure = () => {
      const rect = canvas.getBoundingClientRect();
      const old = size.current;
      size.current = {
        width: Math.max(1, rect.width),
        height: Math.max(1, rect.height),
      };
      if (old.width === 1) fit();
      else
        update({
          ...view.current,
          x: view.current.x + (size.current.width - old.width) / 2,
          y: view.current.y + (size.current.height - old.height) / 2,
        });
    };
    const readColors = () => {
      const style = getComputedStyle(canvas);
      const dark = !!canvas.closest(".dark");
      colors.current = new Map(
        Object.keys(TRUE_COLOR_HEX).map((tone) => [
          tone,
          style
            .getPropertyValue(`--color-${tone}-${dark ? 400 : 600}`)
            .trim() || TRUE_COLOR_HEX[tone],
        ]),
      );
      textColor.current = style.color;
      requestDraw();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(canvas);
    measure();
    readColors();
    const theme = new MutationObserver(readColors);
    for (
      let element: HTMLElement | null = canvas;
      element;
      element = element.parentElement
    )
      theme.observe(element, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      theme.disconnect();
      window.removeEventListener("resize", measure);
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [fit, update, requestDraw, options.active]);
  return { canvasRef, view, zoom, update, fit, zoomBy, focusNode };
}
