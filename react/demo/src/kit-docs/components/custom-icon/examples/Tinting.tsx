import { CustomIcon } from "@cjlapao/ui-kit";
import type { TrueColor } from "@cjlapao/ui-kit";

const TONES: TrueColor[] = ["blue", "rose", "amber"];

export default function Tinting() {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Theme tones
        </p>
        <div className="flex items-end gap-4">
          {TONES.map((tone) => (
            <div key={tone} className="flex flex-col items-center gap-2">
              <CustomIcon icon="Globe" size="lg" tone={tone} />
              <span className="text-[11px] opacity-60">{tone}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Raw colour — wins over tone
        </p>
        <div className="flex items-end gap-4">
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Globe" size="lg" color="#f43f5e" />
            <span className="text-[11px] opacity-60">color="#f43f5e"</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CustomIcon icon="Globe" size="lg" color="#0ea5e9" hoverColor="#f43f5e" />
            <span className="text-[11px] opacity-60">hover → rose</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
          Keep own colours — no tinting at all
        </p>
        <CustomIcon icon="Globe" size="lg" colored />
      </div>
    </div>
  );
}
