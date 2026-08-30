/**
 * Permanent axe-core accessibility gate (Phase B).
 *
 * Renders a table of representative kit components — with realistic,
 * non-empty props where they need them — and runs axe-core over each,
 * asserting there are no `serious`/`critical` WCAG violations.
 *
 * Why this exists: the 2026-08-30 audit's one-off axe pass rendered 62/152
 * components with *no* props, so interactive states (open menus, filled
 * tables, populated lists) were never checked. This fixture table closes
 * most of that gap and stays in CI (`npm test`).
 *
 * Notes:
 * - `color-contrast` is disabled: jsdom has no computed layout/colour, so
 *   contrast checks are meaningless here (real contrast is asserted in
 *   Phase C against theme tokens).
 * - We fail on `serious` + `critical` only; `moderate`/`minor` are surfaced
 *   as a console note so they can be triaged without blocking.
 * - Each fixture is independent (fresh render + cleanup) so one bad
 *   component does not cascade.
 */
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup, type RenderResult } from "@testing-library/react";
import type { ReactElement } from "react";
import { useRef } from "react";
import { MemoryRouter } from "react-router-dom";
import axe from "axe-core";
import type { AxeResults, RunOptions } from "axe-core";
import {
  Accordion,
  Alert,
  Badge,
  Breadcrumb,
  Button,
  ButtonSelector,
  Carousel,
  Checkbox,
  CollapsiblePanel,
  Combobox,
  DatePicker,
  DetailItemCard,
  DropdownButton,
  DropdownMenu,
  EmptyState,
  FormField,
  IconButton,
  InfoRow,
  InlinePanel,
  Input,
  InputOtp,
  Loader,
  Modal,
  MultiProgressBar,
  MultiSelectPills,
  MultiToggle,
  Picker,
  Pill,
  Popover,
  Progress,
  Rating,
  SearchBar,
  Select,
  SideMenu,
  SidePanel,
  Slider,
  SpeedDial,
  Spinner,
  SplitView,
  Stepper,
  StatChartTile,
  TagPicker,
  Textarea,
  Toggle,
  Tree,
} from "../components";
import Panel from "../components/Panel";
import { Table } from "../components/Table";
import TreeView from "../components/TreeView/TreeView";

// ── Fixtures ──────────────────────────────────────────────────────────────────
// Each entry: a display name + a factory returning a rendered element with
// realistic props. Keep fixtures small but *real* (populated lists, open
// overlays, labelled controls) — that is the whole point of this gate.

type Fixture = { name: string; render: () => ReactElement };

// DropdownMenu needs a real anchor to position against — render it open
// from a labelled trigger button, as an app would.
function DropdownMenuOpen() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  return (
    <div>
      <button ref={anchorRef} type="button">
        Row actions
      </button>
      <DropdownMenu
        anchorRef={anchorRef}
        open
        onClose={noop}
        items={[
          { value: "duplicate", label: "Duplicate" },
          { value: "delete", label: "Delete", danger: true },
        ]}
      />
    </div>
  );
}

const noop = () => {};

const FIXTURES: Fixture[] = [
  { name: "Button (primary, labeled)", render: () => <Button>Save</Button> },
  { name: "IconButton (labelled)", render: () => <IconButton icon="Host" aria-label="Open host" /> },
  { name: "Toggle (labelled, checked)", render: () => <Toggle label="Enable notifications" checked onChange={noop} /> },
  { name: "Checkbox (labelled, checked)", render: () => <Checkbox label="Subscribe" checked onChange={noop} /> },
  { name: "Slider (range, labelled)", render: () => <Slider aria-label="Volume" defaultValue={40} /> },
  { name: "Rating (value 3 of 5)", render: () => <Rating value={3} onChange={noop} /> },
  { name: "Select (native options)", render: () => (
    <Select aria-label="Region">
      <option value="us">United States</option>
      <option value="eu">Europe</option>
    </Select>
  ) },
  {
    name: "Combobox (options, labelled)",
    render: () => (
      <Combobox
        aria-label="Pick a service"
        options={[{ label: "api", value: "api" }, { label: "web", value: "web" }]}
        onChange={noop}
      />
    ),
  },
  {
    name: "ButtonSelector (options, labelled)",
    render: () => (
      <ButtonSelector
        label="Density"
        options={[{ label: "Comfortable", value: "cozy" }, { label: "Compact", value: "compact" }]}
        value="cozy"
        onChange={noop}
      />
    ),
  },
  {
    name: "MultiSelectPills (options, values)",
    render: () => (
      <MultiSelectPills
        name="tags"
        legend="Tags"
        options={[{ label: "infra", value: "infra" }, { label: "app", value: "app" }]}
        value={["infra"]}
        onChange={noop}
      />
    ),
  },
  {
    name: "MultiToggle (options, value)",
    render: () => (
      <MultiToggle
        options={[{ label: "Running", value: "running" }, { label: "Queued", value: "queued" }]}
        value="running"
        onChange={noop}
      />
    ),
  },
  {
    name: "Accordion (items, one open)",
    render: () => (
      <Accordion
        items={[
          { id: "a", title: "Overview", content: <p>Summary text.</p> },
          { id: "b", title: "Details", content: <p>More text.</p> },
        ]}
        defaultOpenIds={["b"]}
      />
    ),
  },
  { name: "CollapsiblePanel (title, body)", render: () => <CollapsiblePanel title="Filters"><p>Body.</p></CollapsiblePanel> },
  { name: "Panel (title, body)", render: () => <Panel title="Settings"><p>Body.</p></Panel> },
  {
    name: "Modal (open, labelled, footer)",
    render: () => (
      <Modal isOpen onClose={noop} title="Edit host" footer={<Button>Apply</Button>}>
        <p>Host details.</p>
      </Modal>
    ),
  },
  {
    name: "InlinePanel (open, labelled)",
    render: () => (
      <InlinePanel isOpen onClose={noop} title="Filters">
        <p>Body.</p>
      </InlinePanel>
    ),
  },
  {
    name: "Popover (labelled trigger)",
    render: () => (
      <Popover trigger={<Button variant="outline">Details</Button>}>
        <p>Popover body.</p>
      </Popover>
    ),
  },
  {
    name: "DropdownMenu (open, items)",
    render: () => <DropdownMenuOpen />,
  },
  {
    name: "DropdownButton (options)",
    render: () => (
      <DropdownButton
        label="Actions"
        options={[
          { value: "duplicate", label: "Duplicate" },
          { value: "delete", label: "Delete" },
        ]}
      />
    ),
  },
  {
    name: "Picker (closed, items)",
    render: () => (
      <Picker
        items={[{ id: "a", title: "Alpha" }, { id: "b", title: "Beta" }]}
        selectedId="a"
        onSelect={noop}
      />
    ),
  },
  {
    name: "TagPicker (items, values)",
    render: () => (
      <TagPicker
        items={[{ id: "a", label: "infra" }, { id: "b", label: "app" }]}
        value={["a"]}
        onChange={noop}
      />
    ),
  },
  { name: "DatePicker (closed)", render: () => <DatePicker value={undefined} onChange={noop} /> },
  {
    name: "Tree (items, labelled)",
    render: () => (
      <Tree
        ariaLabel="File tree"
        items={[
          { id: "1", label: "src", children: [{ id: "2", label: "index.ts" }] },
        ]}
      />
    ),
  },
  {
    name: "TreeView (items)",
    render: () => (
      <TreeView
        items={[
          { id: "1", title: "src", children: [{ id: "2", title: "index.ts" }] },
        ]}
      />
    ),
  },
  {
    name: "Table (columns + rows, labelled headers)",
    render: () => (
      <Table
        columns={[
          { id: "name", header: "Name", accessor: "name" },
          { id: "status", header: "Status", accessor: "status" },
        ]}
        data={[
          { name: "web-01", status: "running" },
          { name: "db-01", status: "stopped" },
        ]}
      />
    ),
  },
  {
    name: "Stepper (steps, active)",
    render: () => (
      <Stepper
        steps={[
          { title: "Account" },
          { title: "Billing", status: "active" },
          { title: "Done", status: "completed" },
        ]}
      />
    ),
  },
  {
    name: "Carousel (slides)",
    render: () => (
      <Carousel
        items={["A", "B", "C"]}
        renderItem={(item) => <div key={item}>{item}</div>}
      />
    ),
  },
  {
    name: "SplitView (items, panels)",
    render: () => (
      <SplitView
        items={[
          { id: "1", label: "A", panel: <p>Panel A.</p> },
          { id: "2", label: "B", panel: <p>Panel B.</p> },
        ]}
      />
    ),
  },
  { name: "SearchBar (labelled)", render: () => <SearchBar onSearch={noop} placeholder="Search hosts" /> },
  { name: "Input (labelled via FormField)", render: () => <FormField label="Hostname"><Input placeholder="host" /></FormField> },
  { name: "Textarea (labelled via FormField)", render: () => <FormField label="Notes"><Textarea placeholder="notes" /></FormField> },
  { name: "InputOtp (6 digits, labelled)", render: () => <InputOtp length={6} aria-label="One-time code" /> },
  { name: "Alert (tone, title)", render: () => <Alert tone="amber" title="Degraded">Check the queue.</Alert> },
  { name: "EmptyState (title, subtitle)", render: () => <EmptyState title="No hosts" subtitle="Nothing here yet." /> },
  {
    name: "Breadcrumb (items, labelled)",
    render: () => (
      <Breadcrumb
        ariaLabel="Breadcrumb"
        items={[{ label: "Home", href: "/" }, { label: "Hosts", href: "/hosts" }]}
      />
    ),
  },
  { name: "Badge (text)", render: () => <Badge>4</Badge> },
  { name: "Pill (text)", render: () => <Pill>running</Pill> },
  { name: "Progress (value, labelled)", render: () => <Progress aria-label="Progress" value={60} /> },
  {
    name: "MultiProgressBar (segments, labelled)",
    render: () => (
      <MultiProgressBar
        aria-label="Usage"
        series={[
          { key: "cpu", label: "CPU", value: 40, tone: "blue" },
          { key: "mem", label: "Mem", value: 25, tone: "green" },
        ]}
      />
    ),
  },
  {
    name: "StatChartTile (data)",
    render: () => (
      <StatChartTile
        label="Regions"
        data={[
          {
            id: "regions",
            label: "Regions",
            centerLabel: "100",
            items: [
              { label: "us-east", value: 60, color: "blue" },
              { label: "eu-west", value: 40, color: "green" },
            ],
          },
        ]}
      />
    ),
  },
  { name: "InfoRow (label, value)", render: () => <InfoRow label="Region" value="us-east-1" /> },
  {
    name: "DetailItemCard (title, description)",
    render: () => <DetailItemCard title="CPU" description="42% average" />,
  },
  {
    name: "SpeedDial (items)",
    render: () => (
      <SpeedDial
        aria-label="Quick actions"
        items={[
          { icon: "Host", label: "New host", onClick: noop },
          { icon: "Container", label: "New container", onClick: noop },
        ]}
      />
    ),
  },
  { name: "Loader (labelled)", render: () => <Loader label="Loading" /> },
  { name: "Spinner (labelled)", render: () => <Spinner label="Loading" /> },
  {
    name: "SidePanel (open, labelled)",
    render: () => (
      <SidePanel isOpen onClose={noop} side="right" title="Details">
        <p>Body.</p>
      </SidePanel>
    ),
  },
  {
    name: "SideMenu (items, collapsed rail)",
    render: () => (
      <MemoryRouter>
        <SideMenu
          collapsed
          onToggleCollapse={noop}
          items={[
            { slug: "infra", label: "Infrastructure", path: "/infra", icon: "Host" },
            { slug: "deploy", label: "Deploy", path: "/deploy", icon: "Container" },
          ]}
        />
      </MemoryRouter>
    ),
  },
];

// ── Harness ───────────────────────────────────────────────────────────────────

const AXE_OPTIONS: RunOptions = {
  rules: {
    // jsdom computes no colours — contrast is asserted in Phase C instead.
    "color-contrast": { enabled: false },
  },
};

const failures: Array<{ name: string; detail: string }> = [];

afterEach(() => {
  cleanup();
});

describe("axe-core a11y gate (Phase B)", () => {
  it.each(FIXTURES.map((f) => [f.name, f.render]))(
    "%s has no serious/critical axe violations",
    async (_name, renderFn) => {
      const { container }: RenderResult = render(renderFn());
      const results: AxeResults = await axe.run(container, AXE_OPTIONS);

      const hard = results.violations.filter(
        (v) => v.impact === "serious" || v.impact === "critical",
      );

      const detail = results.violations
        .map((v) => `${v.id} [${v.impact}]: ${v.help} (${v.nodes.length} node(s))`)
        .join("\n  ");

      if (results.violations.length > 0) {
        failures.push({ name: _name, detail });
        // eslint-disable-next-line no-console
        console.warn(
          `[axe] ${_name}: ${results.violations.length} violation(s)\n  ${detail}`,
        );
      }

      expect(hard, `serious/critical violations:\n  ${detail}`).toEqual([]);
    },
  );
});
