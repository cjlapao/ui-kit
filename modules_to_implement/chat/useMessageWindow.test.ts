import { describe, it, expect } from "vitest";
import { nextTick, ref } from "vue";
import {
  useMessageWindow,
  estimateHeightFor,
  sumRange,
  indexAtOffset,
  type Viewport,
} from "./useMessageWindow";
import type { Message } from "./types";

const H = 66; // estimateHeightFor for our fixed-length content

function mkMessages(n: number): Message[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `m${i}`,
    role: i % 2 ? ("assistant" as const) : ("user" as const),
    content: "x".repeat(70),
    createdAt: new Date(i).toISOString(),
  }));
}

const atBottom = (client: number) => ({
  scrollTop: 100 * H - client,
  clientHeight: client,
  scrollHeight: 100 * H,
}) satisfies Viewport;

describe("useMessageWindow helpers", () => {
  it("estimates height from text, capped", () => {
    expect(estimateHeightFor("")).toBe(44);
    expect(estimateHeightFor("hello")).toBe(66);
    expect(estimateHeightFor("a".repeat(10000))).toBe(400);
  });

  it("sums a range of heights", () => {
    const arr = mkMessages(10);
    expect(sumRange(arr, 0, 3, () => H)).toBe(3 * H);
    expect(sumRange(arr, 5, 10, () => H)).toBe(5 * H);
    expect(sumRange(arr, -2, 2, () => H)).toBe(2 * H); // clamps from below 0
  });

  it("indexAtOffset returns the index under the offset", () => {
    const arr = mkMessages(100);
    const h = () => H;
    expect(indexAtOffset(arr, 100 * H - 1, h, 75, 2)).toBe(75); // near bottom -> maxStart
    expect(indexAtOffset(arr, 0, h, 75, 2)).toBe(0);
    expect(indexAtOffset(arr, 5 * H, h, 75, 2)).toBe(3);
  });
});

describe("useMessageWindow", () => {
  it("mounts the bottom window and computes spacers when scrolled up", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });

    // Start at top (startIndex 0): 25 mounted, bottom spacer covers the rest.
    expect(w.startIndex.value).toBe(0);
    expect(w.windowMessages.value.length).toBe(25);
    expect(w.topSpacer.value).toBe(0);
    expect(w.bottomSpacer.value).toBe(75 * H);

    // Scroll to roughly the 10th message.
    w.onScroll({ scrollTop: 10 * H, clientHeight: 10 * H, scrollHeight: 100 * H });
    await nextTick();

    expect(w.isAtBottom.value).toBe(false);
    expect(w.showJump.value).toBe(true);
    expect(w.startIndex.value).toBe(8); // keep 2 lead above
    expect(w.topSpacer.value).toBe(8 * H);
    expect(w.windowMessages.value[0].index).toBe(8);
    expect(w.bottomSpacer.value).toBe((100 - 33) * H);
  });

  it("keeps the bottom window when new messages arrive while stuck to bottom", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });

    w.onScroll(atBottom(10 * H));
    await nextTick();
    expect(w.isAtBottom.value).toBe(true);
    expect(w.startIndex.value).toBe(75);

    messages.value.push({ id: "m100", role: "user", content: "x".repeat(70), createdAt: new Date(100).toISOString() });
    await nextTick();

    expect(w.isAtBottom.value).toBe(true);
    expect(w.startIndex.value).toBe(76);
    const items = w.windowMessages.value;
    expect(items[items.length - 1]?.index).toBe(100);
  });

  it("does not yank the scroll up when appended while scrolled up", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });

    w.onScroll({ scrollTop: 10 * H, clientHeight: 10 * H, scrollHeight: 100 * H });
    await nextTick();
    expect(w.isAtBottom.value).toBe(false);
    expect(w.startIndex.value).toBe(8);

    messages.value.push({ id: "m100", role: "user", content: "x".repeat(70), createdAt: new Date(100).toISOString() });
    await nextTick();

    expect(w.startIndex.value).toBe(8); // unchanged
    expect(w.isAtBottom.value).toBe(false);
  });

  it("jumpToBottom moves the window to the end and hides the button", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });

    w.onScroll({ scrollTop: 10 * H, clientHeight: 10 * H, scrollHeight: 100 * H });
    await nextTick();
    expect(w.showJump.value).toBe(true);

    w.jumpToBottom();
    await nextTick();
    expect(w.startIndex.value).toBe(75);
    expect(w.isAtBottom.value).toBe(true);
    expect(w.showJump.value).toBe(false);
  });

  it("resets to the bottom when the whole message array is replaced (chat switch)", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });
    w.onScroll({ scrollTop: 10 * H, clientHeight: 10 * H, scrollHeight: 100 * H });
    await nextTick();
    expect(w.startIndex.value).toBe(8);

    messages.value = mkMessages(5);
    await nextTick();

    expect(w.startIndex.value).toBe(0); // maxStart for 5 messages
    expect(w.isAtBottom.value).toBe(true);
    expect(w.windowMessages.value.length).toBe(5);
  });

  it("follows a growing trailing message while stuck to the bottom (streaming)", async () => {
    const messages = ref(mkMessages(3));
    const w = useMessageWindow(messages, { targetCount: 25 });

    // Minimal fake scroll element: we control its scrollHeight to simulate reflow.
    const fake = {
      scrollTop: 0,
      clientHeight: 200,
      scrollHeight: 100,
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelectorAll: () => [] as unknown as NodeListOf<HTMLElement>,
    };

    w.bindScroll(() => fake as unknown as HTMLElement);
    await nextTick();
    expect(w.isAtBottom.value).toBe(true);

    // Simulate a streaming assistant message growing in place (content changes, length stays).
    messages.value[messages.value.length - 1].content = "a".repeat(4000);
    fake.scrollHeight = 1500; // DOM grew
    await nextTick();
    await nextTick(); // content watcher -> scrollToBottom -> nextTick scroll assignment

    expect(fake.scrollTop).toBe(1500);
    expect(w.isAtBottom.value).toBe(true);
  });

  it("does not yank the user down when a trailing message grows while scrolled up", async () => {
    const messages = ref(mkMessages(100));
    const w = useMessageWindow(messages, { targetCount: 25 });

    const fake = {
      scrollTop: 10 * H,
      clientHeight: 10 * H,
      scrollHeight: 100 * H,
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelectorAll: () => [] as unknown as NodeListOf<HTMLElement>,
    };

    w.bindScroll(() => fake as unknown as HTMLElement);
    await nextTick();
    w.onScroll({ scrollTop: 10 * H, clientHeight: 10 * H, scrollHeight: 100 * H });
    await nextTick();
    expect(w.isAtBottom.value).toBe(false);

    // Growing the trailing message must NOT re-anchor / scroll the user down.
    const before = fake.scrollTop;
    messages.value[messages.value.length - 1].content = "a".repeat(4000);
    await nextTick();
    expect(fake.scrollTop).toBe(before);
    expect(w.isAtBottom.value).toBe(false);
  });

  it("uses measured heights when provided", async () => {
    const messages = ref(mkMessages(30));
    const w = useMessageWindow(messages, { targetCount: 25 });

    w.setHeight(0, 1000); // measured much taller than estimate
    await nextTick();
    expect(w.windowMessages.value.length).toBe(25);
    // top 0 spacer still 0 at top; bottom covers the measured msg 25..30 region
    expect(w.bottomSpacer.value).toBe(sumRange(messages.value, 25, 30, (i) => (i === 0 ? 1000 : H)));
  });
});
