/**
 * Gantt i18n + keyboard tests — copy resolves through the kit catalog
 * (`kit.gantt.*`), dates through the engine locale, and the focusable root
 * is navigable with arrows / Home / End / +/−.
 */
import { describe, it, expect, vi } from "vitest";
import { createElement as h, type ReactElement } from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { I18nProvider } from "../../i18n";
import { Gantt } from "./Gantt";
import { sampleGanttTasks, sampleGanttLanes, sampleGanttLinks } from "../../../../common/gantt";

const NOW = new Date("2026-08-30T12:00:00Z");
const tasks = sampleGanttTasks(NOW);
const links = sampleGanttLinks();

const withLocale = (locale: string, child: ReactElement) =>
  render(h(I18nProvider, { locale, locales: {} }, child));

describe("Gantt i18n", () => {
  it("renders translated chrome and aria strings under an FR provider", () => {
    const { container } = withLocale("fr", h(Gantt, { tasks, links, lanes: sampleGanttLanes }));
    // Root, toolbar and column header all come from the FR catalog.
    expect(container.querySelector('[aria-label="Graphique de Gantt"]')).toBeTruthy();
    expect(container.querySelector('[aria-label="Zoom avant"]')).toBeTruthy();
    expect(screen.getAllByText("Tâche").length).toBeGreaterThan(0);
    // The lane caret label and the bar aria (incl. FR month names) follow
    // the locale too.
    expect(container.querySelector('[aria-label="Réduire Design"]')).toBeTruthy();
    const barAria = container
      .querySelector('[data-gantt-bar="api"]')!
      .getAttribute("aria-label")!;
    expect(barAria).toContain("du ");
    expect(barAria).toMatch(/terminé|jalon/);
    expect(barAria).toMatch(/août|sept|huit|janv/);
  });

  it("the labels prop still overrides the catalog", () => {
    const { container } = withLocale(
      "fr",
      h(Gantt, { tasks, links, lanes: sampleGanttLanes, labels: { today: "Maintenant" } }),
    );
    expect(screen.getByText("Maintenant")).toBeTruthy();
    // Untouched keys keep the catalog value.
    expect(container.querySelector('[aria-label="Zoom avant"]')).toBeTruthy();
  });

  it("the locale prop drives date formatting independently of the UI strings", () => {
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} locale="de" />,
    );
    // UI stays English (no provider)…
    expect(container.querySelector('[aria-label="Zoom in"]')).toBeTruthy();
    // …but the bar aria uses German date formatting.
    const barAria = container
      .querySelector('[data-gantt-bar="api"]')!
      .getAttribute("aria-label")!;
    // German short dates render "26. Aug." — the trailing dot is locale-marked.
    expect(barAria).toContain("Aug.");
  });
});

describe("Gantt keyboard navigation", () => {
  it("ArrowDown walks the selection from the first row", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} onSelect={onSelect} />,
    );
    const root = container.querySelector('section[data-gantt]')!;
    fireEvent.keyDown(root, { key: "ArrowDown" });
    // The first visible row is the first lane header.
    expect(onSelect).toHaveBeenLastCalledWith("lane:design");
    fireEvent.keyDown(root, { key: "ArrowDown" });
    // Then the first task row underneath it.
    expect(onSelect).toHaveBeenLastCalledWith("research");
  });

  it("Home/End jump to the first/last row and End clamps", () => {
    const onSelect = vi.fn();
    const { container } = render(
      <Gantt tasks={tasks} links={links} lanes={sampleGanttLanes} onSelect={onSelect} />,
    );
    const root = container.querySelector('section[data-gantt]')!;
    fireEvent.keyDown(root, { key: "End" });
    expect(onSelect).toHaveBeenCalled();
    const lastId = onSelect.mock.calls[onSelect.mock.calls.length - 1][0];
    expect(lastId).toBeTruthy();
    // Stepping down from the last row is a no-op (clamped, not wrapped).
    onSelect.mockClear();
    fireEvent.keyDown(root, { key: "ArrowDown" });
    expect(onSelect).toHaveBeenLastCalledWith(lastId);
    fireEvent.keyDown(root, { key: "Home" });
    expect(onSelect).toHaveBeenLastCalledWith("lane:design");
  });

  it("+/- zoom from the root", () => {
    const onZoomChange = vi.fn();
    const { container } = render(
      <Gantt
        tasks={tasks}
        links={links}
        lanes={sampleGanttLanes}
        initialZoom={16}
        onZoomChange={onZoomChange}
      />,
    );
    const root = container.querySelector('section[data-gantt]')!;
    fireEvent.keyDown(root, { key: "+" });
    expect(onZoomChange).toHaveBeenLastCalledWith(20);
    fireEvent.keyDown(root, { key: "-" });
    // Controlled mode: the prop zoom never moved, so "-" recomputes 16/1.25.
    expect(onZoomChange).toHaveBeenLastCalledWith(16 / 1.25);
  });
});
