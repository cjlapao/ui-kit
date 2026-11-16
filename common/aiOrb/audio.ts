export type AiOrbAudioSource = AnalyserNode | MediaStream;

export interface OrbAudio {
  /** Reused normalized waveform, with values in -1..1. */
  waveform: Float32Array;
  sample(): number;
  dispose(): void;
}

/** Borrows caller resources. Only a stream adapter owns an AudioContext. */
export function createOrbAudio(source: AiOrbAudioSource, onError?: (error: Error) => void): OrbAudio {
  let owned: AudioContext | undefined;
  let input: MediaStreamAudioSourceNode | undefined;
  let analyser: AnalyserNode | undefined;
  let buffer = new Uint8Array(0);
  const waveform = new Float32Array(128);
  let disposed = false;
  let failed = false;
  const report = (error: unknown) => {
    if (disposed || failed) return;
    failed = true;
    onError?.(error instanceof Error ? error : new Error(String(error)));
  };
  const closeOwned = () => {
    input?.disconnect();
    input = undefined;
    if (owned) {
      analyser?.disconnect();
      if (owned.state !== "closed") void owned.close().catch(() => {});
      owned = undefined;
    }
  };
  try {
    // Structural detection also supports resources from another window.
    if ("getByteTimeDomainData" in source) {
      analyser = source;
    } else {
      if (typeof AudioContext === "undefined") throw new Error("Web Audio is unavailable in this browser.");
      owned = new AudioContext();
      analyser = owned.createAnalyser();
      analyser.fftSize = 256;
      input = owned.createMediaStreamSource(source);
      input.connect(analyser);
      // Resume once. Autoplay restrictions leave a silent, ambient visual.
      if (owned.state === "suspended") void owned.resume().catch(() => {});
    }
    buffer = new Uint8Array(analyser.fftSize);
  } catch (error) {
    closeOwned();
    analyser = undefined;
    report(error);
  }
  return {
    waveform,
    sample() {
      if (disposed || failed || !analyser || analyser.context.state !== "running") {
        waveform.fill(0);
        return 0;
      }
      try {
        // Caller may change fftSize without replacing their analyser.
        if (buffer.length !== analyser.fftSize) buffer = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buffer);
        let sum = 0;
        for (let i = 0; i < waveform.length; i++) {
          const value = (buffer[Math.floor(i * buffer.length / waveform.length)] - 128) / 128;
          waveform[i] = value;
          sum += value * value;
        }
        return Math.min(1, Math.sqrt(sum / waveform.length) * 3);
      } catch (error) {
        report(error);
        waveform.fill(0);
        return 0;
      }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      closeOwned();
      analyser = undefined;
    },
  };
}
