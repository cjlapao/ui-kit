import { afterEach, describe, expect, it, vi } from "vitest";
import { createOrbAudio } from "../../../../common/aiOrb/audio";

function analyser(value = 128) {
  return { fftSize: 256, context: { state: "running" }, disconnect: vi.fn(),
    getByteTimeDomainData: vi.fn((data: Uint8Array) => data.fill(value)) };
}

afterEach(() => vi.unstubAllGlobals());

describe("AiOrb audio ownership", () => {
  it("samples into a reused waveform and preserves a borrowed analyser", () => {
    const node = analyser(160);
    const audio = createOrbAudio(node as unknown as AnalyserNode);
    const waveform = audio.waveform;
    expect(audio.sample()).toBe(0.75);
    expect(audio.waveform[0]).toBe(0.25);
    node.fftSize = 512;
    expect(audio.sample()).toBe(0.75);
    expect(audio.waveform).toBe(waveform);
    audio.dispose(); audio.dispose();
    expect(node.disconnect).not.toHaveBeenCalled();
    expect(audio.sample()).toBe(0);
    expect(node.fftSize).toBe(512);
  });
  it("closes stream-owned nodes once without stopping caller tracks", async () => {
    const node = analyser();
    const input = { connect: vi.fn(), disconnect: vi.fn() };
    const close = vi.fn().mockResolvedValue(undefined);
    const resume = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("AudioContext", class {
      state = "suspended";
      createAnalyser = () => node;
      createMediaStreamSource = () => input;
      close = close;
      resume = resume;
    });
    const stop = vi.fn();
    const audio = createOrbAudio({ getTracks: () => [{ stop }] } as unknown as MediaStream);
    expect(input.connect).toHaveBeenCalledWith(node);
    expect(resume).toHaveBeenCalledOnce();
    audio.dispose(); audio.dispose();
    await Promise.resolve();
    expect(close).toHaveBeenCalledOnce();
    expect(input.disconnect).toHaveBeenCalledOnce();
    expect(node.disconnect).toHaveBeenCalledOnce();
    expect(stop).not.toHaveBeenCalled();
  });
  it("disposes partial setup and reports a failure once", () => {
    const close = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("AudioContext", class {
      state = "running";
      close = close;
      createAnalyser = () => analyser();
      createMediaStreamSource() { throw new Error("ended stream"); }
    });
    const error = vi.fn();
    const audio = createOrbAudio({} as MediaStream, error);
    expect(error).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledOnce();
    expect(audio.sample()).toBe(0);
    audio.dispose();
    expect(close).toHaveBeenCalledOnce();
  });
  it("does not sample a suspended context or repeatedly report a sampling failure", () => {
    const node = analyser();
    const error = vi.fn();
    const audio = createOrbAudio(node as unknown as AnalyserNode, error);
    node.context.state = "suspended";
    expect(audio.sample()).toBe(0);
    expect(node.getByteTimeDomainData).not.toHaveBeenCalled();
    node.context.state = "running";
    node.getByteTimeDomainData.mockImplementation(() => { throw new Error("unavailable"); });
    audio.sample(); audio.sample();
    expect(error).toHaveBeenCalledOnce();
  });
});
