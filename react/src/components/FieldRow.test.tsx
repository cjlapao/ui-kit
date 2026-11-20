import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FieldRow from "./FieldRow";
import FormField from "./FormField";
import Input from "./Input";
import Select from "./Select";
import Combobox from "./Combobox";
import SearchBar from "./SearchBar";
import Picker, { type PickerItem } from "./Picker";
import Button from "./Button";
import {
  CONTROL_SIZES,
  FIELD_LINE_MIN_HEIGHTS,
  getFieldMinHeightClass,
} from "../theme/Theme";

const SUBTITLE_ITEMS: PickerItem[] = [
  { id: "a", title: "aeon/cmd/aeon/action.go", subtitle: "file · action.go:1" },
];
const PLAIN_ITEMS: PickerItem[] = [{ id: "a", title: "action" }];

describe("FieldRow — band layout", () => {
  it("lays the row out as three shared bands", () => {
    render(
      <FieldRow>
        <div>child</div>
      </FieldRow>,
    );
    const row = document.querySelector("[data-field-row]");
    expect(row).not.toBeNull();
    expect(row!.className).toContain("grid");
    expect(row!.className).toContain("grid-flow-col");
    expect(row!.className).toContain("[grid-template-rows:auto_1fr_auto]");
    // Default gap on the shared control scale.
    expect(row!.className).toContain("gap-x-4");
  });

  it("maps the gap scale", () => {
    render(
      <FieldRow gap="sm">
        <div>child</div>
      </FieldRow>,
    );
    expect(document.querySelector("[data-field-row]")!.className).toContain(
      "gap-x-3",
    );
  });

  it("lets FormField be a direct grid item spanning the bands via subgrid", () => {
    render(
      <FieldRow>
        <FormField label="Symbol">
          <input />
        </FormField>
      </FieldRow>,
    );
    const row = document.querySelector("[data-field-row]")!;
    const field = row.firstElementChild!;
    // No cell wrapper — the subgrid element *is* the parent grid's item.
    expect(field.className).toContain("[grid-row:span_3]");
    expect(field.className).toContain("[grid-template-rows:subgrid]");
  });

  it("drops the stretch spacer inside a row but keeps it outside", () => {
    const { unmount } = render(
      <FieldRow>
        <FormField label="Kind">
          <input />
        </FormField>
      </FieldRow>,
    );
    const field = document.querySelector("[data-field-row]")!
      .firstElementChild as HTMLElement;
    // Label block + control block only: the spacer would claim a band row.
    expect(field.children).toHaveLength(2);
    unmount();

    const stacked = render(
      <FormField label="Kind">
        <input />
      </FormField>,
    );
    expect(
      stacked.container.querySelector('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it("wraps a bare Button in a control-band-only cell", () => {
    render(
      <FieldRow>
        <Button>Explore</Button>
      </FieldRow>,
    );
    const button = screen.getByRole("button", { name: "Explore" });
    const cell = button.parentElement!;
    expect(cell.className).toContain("[grid-row:2]");
    // Flex cell: the default cross-axis stretch sizes the button to the band.
    expect(cell.className).toContain("flex");
    expect(cell.className).toContain("self-stretch");
  });
});

describe("FieldRow — controls fill the control band", () => {
  it("Input grows in a row, not outside one", () => {
    render(
      <FieldRow>
        <Input aria-label="q" />
      </FieldRow>,
    );
    expect(screen.getByLabelText("q").parentElement!.className).toContain(
      "h-full",
    );
  });

  it("Select grows in a row", () => {
    render(
      <FieldRow>
        <Select aria-label="kind" placeholder="Any kind">
          <option value="file">file</option>
        </Select>
      </FieldRow>,
    );
    const wrapper = document.querySelector("select")!.parentElement!;
    expect(wrapper.className).toContain("h-full");
  });

  it("Combobox grows in a row (wrapper and Input box both)", () => {
    render(
      <FieldRow>
        <Combobox aria-label="kind" options={[]} onChange={() => {}} />
      </FieldRow>,
    );
    const field = screen.getByRole("combobox").parentElement!;
    expect(field.className).toContain("h-full");
    // The dropdown-positioning wrapper must pass the band down too —
    // `h-full` on the field box cannot resolve through a content-sized div.
    expect(field.parentElement!.className).toContain("h-full");
  });

  it("SearchBar grows in a row", () => {
    const { container } = render(
      <FieldRow>
        <SearchBar onSearch={() => {}} />
      </FieldRow>,
    );
    const bar = container.querySelector("input")!.closest("div")!;
    expect(bar.className).toContain("h-full");
  });

  it("Picker grows in a row", () => {
    render(
      <FieldRow>
        <Picker items={PLAIN_ITEMS} />
      </FieldRow>,
    );
    expect(screen.getByRole("button").className).toContain("h-full");
  });

  it("keeps standalone boxes content-sized outside a row", () => {
    const input = render(<Input aria-label="q" />);
    expect(input.container.querySelector("span")!.className).not.toContain(
      "h-full",
    );
    const bar = render(<SearchBar onSearch={() => {}} />);
    expect(
      bar.container.querySelector("input")!.closest("div")!.className,
    ).not.toContain("h-full");
  });
});

describe("Picker — line reservation", () => {
  it("reserves the second line when any item has a subtitle", () => {
    render(<Picker items={SUBTITLE_ITEMS} />);
    expect(screen.getByRole("button").className).toContain("min-h-[54px]");
  });

  it("reserves the second line when an item carries a custom body", () => {
    render(<Picker items={[{ id: "a", body: <span>x</span> }]} />);
    expect(screen.getByRole("button").className).toContain("min-h-[54px]");
  });

  it("stays compact for plain items", () => {
    render(<Picker items={PLAIN_ITEMS} />);
    expect(screen.getByRole("button").className).not.toContain("min-h-[");
  });

  it("lets lines={1} opt out of the auto reservation", () => {
    render(<Picker items={SUBTITLE_ITEMS} lines={1} />);
    expect(screen.getByRole("button").className).not.toContain("min-h-[");
  });

  it("lets lines={2} force it, at the size's scale", () => {
    render(<Picker items={PLAIN_ITEMS} lines={2} size="sm" />);
    expect(screen.getByRole("button").className).toContain("min-h-[46px]");
  });
});

describe("lines — standalone floor on plain fields", () => {
  it("Input", () => {
    render(<Input aria-label="q" lines={2} />);
    expect(screen.getByLabelText("q").parentElement!.className).toContain(
      "min-h-[54px]",
    );
  });

  it("Select", () => {
    render(
      <Select aria-label="kind" lines={2}>
        <option value="a">a</option>
      </Select>,
    );
    expect(document.querySelector("select")!.parentElement!.className).toContain(
      "min-h-[54px]",
    );
  });

  it("SearchBar", () => {
    const { container } = render(<SearchBar onSearch={() => {}} lines={2} />);
    expect(
      container.querySelector("input")!.closest("div")!.className,
    ).toContain("min-h-[54px]");
  });

  it("Combobox (forwarded to its Input)", () => {
    render(
      <Combobox aria-label="kind" options={[]} onChange={() => {}} lines={2} />,
    );
    expect(screen.getByRole("combobox").parentElement!.className).toContain(
      "min-h-[54px]",
    );
  });
});

describe("field line height tokens", () => {
  it("cover the whole control scale with literal classes", () => {
    for (const size of CONTROL_SIZES) {
      for (const lines of [1, 2] as const) {
        expect(getFieldMinHeightClass(size, lines)).toMatch(/^min-h-\[\d+px\]$/);
        expect(FIELD_LINE_MIN_HEIGHTS[size][lines]).toBe(
          getFieldMinHeightClass(size, lines),
        );
      }
    }
  });

  it("fall back to md for an unreachable size", () => {
    expect(getFieldMinHeightClass("nonsense" as never, 2)).toBe("min-h-[54px]");
  });
});
