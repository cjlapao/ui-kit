import { useEffect, useState } from "react";
import { AiOrb } from "@cjlapao/ui-kit";

/** The host owns both permission and stream lifetime. */
export function MicrophoneOrb({ stream }: { stream: MediaStream | null }) {
  return <AiOrb state={stream ? "listening" : "idle"} audioSource={stream} label="Voice assistant" />;
}

/** Borrow an analyser from the application's existing playback graph. */
export function PlaybackOrb({ analyser, speaking }: { analyser: AnalyserNode | null; speaking: boolean }) {
  return <AiOrb state={speaking ? "speaking" : "idle"} audioSource={analyser} preset="ion" label="Voice assistant" />;
}

export default function CompactOrb() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setPaused(true), 5000);
    return () => clearTimeout(timer);
  }, []);
  return <div className="flex items-center gap-4">
    <AiOrb state="listening" preset="ember" size={96} paused={paused} />
    <span className="text-sm">Ready to listen. Compact preview pauses after five seconds.</span>
  </div>;
}
