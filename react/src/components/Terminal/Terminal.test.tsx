import { createRef, StrictMode } from "react";
import {
  act,
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Terminal, TerminalTabs } from "./index";
import { getSurfaceCornerClass } from "../../theme/Theme";
import type { TerminalHandle, TerminalTabsHandle } from "./types";

const mock = vi.hoisted(() => ({
  instances: [] as Array<{
    options: Record<string, unknown>;
    write: ReturnType<typeof vi.fn>;
    writeln: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
    onInput?: (data: string) => void;
  }>,
}));
vi.mock("./engine", () => ({
  loadTerminalEngine: async () => ({
    Terminal: class {
      options: Record<string, unknown> = {};
      write = vi.fn();
      writeln = vi.fn();
      clear = vi.fn();
      reset = vi.fn();
      focus = vi.fn();
      dispose = vi.fn();
      onInput?: (data: string) => void;
      constructor() {
        mock.instances.push(this);
      }
      loadAddon = vi.fn();
      open = vi.fn();
      onData(callback: (data: string) => void) {
        this.onInput = callback;
        return { dispose: vi.fn() };
      }
      rows = 24;
      buffer = { active: { baseY: 0, viewportY: 0 } };
      scrollToLine = vi.fn();
      onScroll() {
        return { dispose: vi.fn() };
      }
      onWriteParsed() {
        return { dispose: vi.fn() };
      }
      onResize() {
        return { dispose: vi.fn() };
      }
    },
    FitAddon: class {
      fit = vi.fn();
    },
  }),
}));
beforeEach(() => {
  mock.instances.length = 0;
});

describe("Terminal", () => {
  it("queues early output, initializes once in StrictMode, and disposes the transport", async () => {
    const ref = createRef<TerminalHandle>();
    const ready = vi.fn();
    const dispose = vi.fn();
    const { unmount, container } = render(
      <StrictMode>
        <Terminal
          ref={ref}
          initialData="banner"
          onReady={ready}
          onDispose={dispose}
          variant="tonal"
          tone="violet"
          corner="rounded-xl"
          height={240}
        />
      </StrictMode>,
    );
    ref.current!.write("early bytes");
    await waitFor(() => expect(ready).toHaveBeenCalledOnce());
    expect(mock.instances).toHaveLength(1);
    expect(mock.instances[0].write.mock.calls).toEqual([
      ["banner"],
      ["early bytes"],
    ]);
    expect(container.firstChild).toHaveAttribute("data-variant", "tonal");
    expect(container.firstChild).toHaveAttribute("data-tone", "violet");
    expect(container.firstChild).toHaveClass(
      getSurfaceCornerClass("rounded-xl"),
    );
    expect(container.firstChild).toHaveStyle({ height: "240px" });
    unmount();
    expect(mock.instances[0].dispose).toHaveBeenCalledOnce();
    expect(dispose).toHaveBeenCalledOnce();
  });

  it("updates callbacks, read-only mode, and palette without replacing the engine", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Terminal initialData="once" onData={first} />);
    await waitFor(() => expect(mock.instances).toHaveLength(1));
    act(() => mock.instances[0].onInput?.("a"));
    expect(first).toHaveBeenCalledWith("a");
    rerender(
      <Terminal
        initialData="ignore"
        onData={second}
        readOnly
        scheme="dark"
        terminalTheme={{ green: "#00ff00" }}
        options={{ fontSize: 18 }}
      />,
    );
    act(() => mock.instances[0].onInput?.("b"));
    expect(second).toHaveBeenCalledWith("b");
    expect(mock.instances).toHaveLength(1);
    expect(mock.instances[0].options).toMatchObject({
      disableStdin: true,
      fontSize: 18,
      theme: { green: "#00ff00", foreground: "#e2e8f0" },
    });
    expect(mock.instances[0].write).toHaveBeenCalledOnce();
  });
});

describe("TerminalTabs", () => {
  it("closes an inactive session from its own tab without selecting it", async () => {
    const close = vi.fn();
    const change = vi.fn();
    render(
      <TerminalTabs
        sessions={sessions}
        onClose={close}
        onValueChange={change}
      />,
    );
    const button = screen.getByRole("button", {
      name: "Close terminal: Shell two",
    });
    expect(button.parentElement?.parentElement).toContainElement(
      screen.getByRole("tab", { name: "Shell two" }),
    );
    expect(button.closest('[role="tab"]')).toBeNull();
    fireEvent.click(button);
    expect(close).toHaveBeenCalledWith("two");
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole("tab", { name: "Shell one" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await waitFor(() => expect(mock.instances).toHaveLength(2));
  });

  const sessions = [
    { id: "one", label: "Shell one", initialData: "one" },
    { id: "two", label: "Shell two", initialData: "two" },
  ];
  it("keeps background sessions mounted and routes writes by id", async () => {
    const ref = createRef<TerminalTabsHandle>();
    const dispose = vi.fn();
    const { rerender } = render(
      <TerminalTabs ref={ref} sessions={sessions} onDispose={dispose} />,
    );
    await waitFor(() => expect(mock.instances).toHaveLength(2));
    fireEvent.click(screen.getByRole("tab", { name: "Shell two" }));
    expect(screen.getByRole("tabpanel")).toHaveAccessibleName("Shell two");
    ref.current!.getSession("one")!.write("background output");
    expect(mock.instances[0].write).toHaveBeenLastCalledWith(
      "background output",
    );
    expect(mock.instances[0].dispose).not.toHaveBeenCalled();
    rerender(
      <TerminalTabs ref={ref} sessions={[sessions[0]]} onDispose={dispose} />,
    );
    expect(dispose).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "Shell one" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(ref.current!.getSession("two")).toBeUndefined();
  });

  it("supports controlled selection and consumer-owned add/close actions", async () => {
    const change = vi.fn();
    const add = vi.fn();
    const close = vi.fn();
    render(
      <TerminalTabs
        sessions={sessions}
        value="one"
        onValueChange={change}
        onAdd={add}
        onClose={close}
      />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "Shell two" }));
    expect(change).toHaveBeenCalledWith("two");
    expect(screen.getByRole("tab", { name: "Shell one" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "New terminal" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Close terminal: Shell one" }),
    );
    expect(add).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith("one");
    await waitFor(() => expect(mock.instances).toHaveLength(2));
  });

  it("renders an empty state and add action with no sessions", () => {
    render(
      <TerminalTabs
        sessions={[]}
        onAdd={vi.fn()}
        emptyState="Start a session"
      />,
    );
    expect(screen.getByText("Start a session")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New terminal" }),
    ).toBeInTheDocument();
  });
});
