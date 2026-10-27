import { useEffect, useState } from "react";
import CustomIcon from "../CustomIcon";
import { sanitizeSvg } from "../../utils/sanitizeSvg";

/** Local URLs stay inside the preview and are revoked on replacement/unmount. */
export function ImagePreview({ file, src, alt, className }: { file?: File; src?: string; alt: string; className?: string }) {
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  useEffect(() => {
    if (!file) return;
    let active = true;
    let url: string | undefined;
    const load = async () => {
      try {
        let blob: Blob = file;
        if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
          const cleaned = sanitizeSvg(await file.text());
          if (!cleaned) return;
          blob = new Blob([cleaned], { type: "image/svg+xml" });
        } else if (!file.type.startsWith("image/") && !/\.(png|jpe?g|gif|webp|avif)$/i.test(file.name)) return;
        if (!active || typeof URL.createObjectURL !== "function") return;
        url = URL.createObjectURL(blob);
        setPreview({ file, url });
      } catch { /* Unsupported or invalid previews fall back to the file glyph. */ }
    };
    void load();
    return () => { active = false; if (url) URL.revokeObjectURL(url); };
  }, [file]);
  const url = file ? preview?.file === file ? preview.url : undefined : src;
  return url && url !== failed
    ? <img src={url} alt={alt} className={className} onError={() => setFailed(url)} />
    : <span role="img" aria-label={alt} className={className}><CustomIcon icon="File" className="h-full w-full" /></span>;
}
