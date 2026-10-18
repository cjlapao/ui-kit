import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createToastStore, TOAST_EXIT_MS } from "./toastStore";
import {
  ALERT_INTENT_CONFIG,
  DEFAULT_TOAST_LIFE_MS,
} from "../../theme/Theme";

/**
 * The store is the service: ids, defaults, life timers with pause/resume,
 * groups, and the exit-window splice. Everything here runs on fake timers so
 * the 5-second default life and the 350ms exit window are instant.
 */
describe("toastStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const messages = (store: ReturnType<typeof createToastStore>) =>
    store.getSnapshot().messages;

  const only = (store: ReturnType<typeof createToastStore>) => {
    const list = messages(store);
    if (list.length !== 1) {
      throw new Error(`expected exactly one message, got ${list.length}`);
    }
    return list[0];
  };

  /** Wait out the exit window so a closed message is fully spliced. */
  const settle = () => vi.advanceTimersByTime(TOAST_EXIT_MS + 50);

  describe("show", () => {
    it("assigns increasing ids and resolves defaults from the shared intent config", () => {
      const store = createToastStore();
      const a = store.show({ title: "A" });
      const b = store.show({ title: "B", intent: "danger" });

      expect(b).toBe(a + 1);
      const [first] = messages(store);
      expect(first.intent).toBe("neutral");
      expect(first.color).toBe(ALERT_INTENT_CONFIG.neutral.tone);
      expect(first.icon).toBe(ALERT_INTENT_CONFIG.neutral.icon);
      expect(first.variant).toBe("glass");
      expect(first.size).toBe("md");
      expect(first.life).toBe(DEFAULT_TOAST_LIFE_MS);
      expect(first.sticky).toBe(false);
      expect(first.closable).toBe(true);
      expect(first.loading).toBe(false);

      const second = messages(store)[1];
      expect(second.color).toBe(ALERT_INTENT_CONFIG.danger.tone);
      expect(second.icon).toBe(ALERT_INTENT_CONFIG.danger.icon);
    });

    it("resolves the tone from the intent but keeps an explicit color", () => {
      const store = createToastStore();
      store.show({ intent: "warning", color: "orange", title: "t" });
      expect(only(store).color).toBe("orange");
    });

    it("keeps a per-message onClick and meta verbatim", () => {
      const store = createToastStore();
      const onClick = () => {};
      store.show({ title: "t", onClick, meta: { run: 7 } });
      const m = only(store);
      expect(m.onClick).toBe(onClick);
      expect(m.meta).toEqual({ run: 7 });
    });

    it("is snapshot-stable between changes (useSyncExternalStore contract)", () => {
      const store = createToastStore();
      const s1 = store.getSnapshot();
      expect(store.getSnapshot()).toBe(s1);
      store.show({ title: "x" });
      expect(store.getSnapshot()).not.toBe(s1);
    });
  });

  describe("life timers", () => {
    it("auto-dismisses after `life` with a life-end event, then splices", () => {
      const store = createToastStore();
      const seen: string[] = [];
      store.onLifeEnd((m) => seen.push(`${m.title}:${m.life}`));
      const id = store.show({ title: "timed", life: 1000 });

      expect(messages(store).some((m) => m.id === id)).toBe(true);
      vi.advanceTimersByTime(999);
      expect(only(store).removing).toBeFalsy();

      vi.advanceTimersByTime(1);
      expect(only(store).removing).toBe(true);
      expect(seen).toEqual(["timed:1000"]);

      settle();
      expect(messages(store)).toEqual([]);
    });

    it("does not fire twice", () => {
      const store = createToastStore();
      let fires = 0;
      store.onLifeEnd(() => fires++);
      store.show({ title: "once", life: 500 });
      vi.advanceTimersByTime(5000);
      settle();
      expect(fires).toBe(1);
    });

    it("sticky and life:0 never get a timer", () => {
      const store = createToastStore();
      store.show({ title: "sticky", sticky: true });
      store.show({ title: "zero", life: 0 });
      vi.advanceTimersByTime(60_000);
      expect(messages(store).length).toBe(2);
      expect(messages(store).every((m) => !m.removing)).toBe(true);
    });

    it("pauses with the remaining time and resumes from it", () => {
      const store = createToastStore();
      const id = store.show({ title: "paused", life: 1000 });

      vi.advanceTimersByTime(400);
      store.pauseGroup();
      // A full life spent while paused must not fire.
      vi.advanceTimersByTime(10_000);
      expect(only(store).removing).toBeFalsy();

      store.resumeGroup();
      // 400ms already elapsed → 600ms remain.
      vi.advanceTimersByTime(599);
      expect(only(store).removing).toBeFalsy();
      vi.advanceTimersByTime(1);
      expect(messages(store)[0]?.id).toBe(id);
      expect(messages(store)[0]?.removing).toBe(true);
    });

    it("a manual close wins: no life-end afterwards", () => {
      const store = createToastStore();
      const lifeEnds: number[] = [];
      store.onLifeEnd((m) => lifeEnds.push(m.id));
      const id = store.show({ title: "manual", life: 1000 });
      vi.advanceTimersByTime(200);
      store.close(id);
      settle();
      expect(lifeEnds).toEqual([]);
      expect(messages(store)).toEqual([]);
    });

    it("a life changed via update re-tunes the timer", () => {
      const store = createToastStore();
      const id = store.show({ title: "retimed", life: 1000 });
      vi.advanceTimersByTime(900);
      store.update(id, { life: 5000 });
      // re-timed from now: fires at t=900+5000
      vi.advanceTimersByTime(4999);
      expect(messages(store)[0]?.removing).toBeFalsy();
      vi.advanceTimersByTime(1);
      expect(messages(store)[0]?.removing).toBe(true);
    });
  });

  describe("close / groups / clear", () => {
    it("close marks removing once, emits close, and splices after the exit window", () => {
      const store = createToastStore();
      const closed: string[] = [];
      store.onClose((m) => closed.push(String(m.title)));
      const id = store.show({ title: "bye" });

      store.close(id);
      store.close(id); // idempotent
      expect(closed).toEqual(["bye"]);
      expect(only(store).removing).toBe(true);

      settle();
      expect(messages(store)).toEqual([]);
    });

    it("closeGroup closes only that group; ungrouped pauseGroup pauses only ungrouped", () => {
      const store = createToastStore();
      const ungrouped = store.show({ title: "u", life: 10_000 });
      store.show({ title: "a", group: "a", life: 10_000 });

      store.closeGroup("a");
      settle();
      expect(messages(store).map((m) => m.id)).toEqual([ungrouped]);

      store.pauseGroup();
      // a full lifetime spent while paused must not fire
      vi.advanceTimersByTime(60_000);
      expect(messages(store)[0]?.removing).toBeFalsy();

      const b = store.show({ title: "b", group: "b", life: 1 });
      store.resumeGroup(); // only ungrouped resumes; b was never running
      vi.advanceTimersByTime(10);
      expect(messages(store).find((m) => m.id === b)?.removing).toBe(true);
    });

    it("clear closes everything", () => {
      const store = createToastStore();
      store.show({ title: "1" });
      store.show({ title: "2" });
      store.clear();
      expect(messages(store).every((m) => m.removing)).toBe(true);
      settle();
      expect(messages(store)).toEqual([]);
    });
  });

  describe("update", () => {
    it("patches live fields (the progress path)", () => {
      const store = createToastStore();
      const id = store.show({ title: "downloading", progress: 10 });
      store.update(id, { progress: 42, detail: "42%" });
      expect(only(store).progress).toBe(42);
      expect(only(store).detail).toBe("42%");
      expect(only(store).title).toBe("downloading");
    });

    it("ignores undefined patch fields", () => {
      const store = createToastStore();
      const id = store.show({ title: "keep", detail: "d" });
      store.update(id, { detail: undefined });
      expect(only(store).detail).toBe("d");
      expect(id).toBe(only(store).id);
    });

    it("ignores updates to removing messages", () => {
      const store = createToastStore();
      const id = store.show({ title: "leaving" });
      store.close(id);
      store.update(id, { progress: 99 });
      expect(only(store).progress).toBeUndefined();
    });
  });

  describe("events", () => {
    it("unsubscribing stops the events", () => {
      const store = createToastStore();
      let hits = 0;
      const off = store.onClose(() => hits++);
      off();
      store.show({ title: "x" });
      store.clear();
      settle();
      expect(hits).toBe(0);
    });
  });
});
