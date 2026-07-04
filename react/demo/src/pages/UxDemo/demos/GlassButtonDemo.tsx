// @ts-nocheck
import React, { useState } from "react";
import { Button, IconButton } from "@cjlapao/ui-kit";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  GlassVibrancy,
  GlassOpacity,
  SpecularMode,
} from "@cjlapao/ui-kit";

const COLORS = ["blue", "brand", "red", "green", "purple"] as const;
const SPECULAR_MODES: SpecularMode[] = ["classic", "halo", "none"];
const OPACITY_PRESETS: GlassOpacity[] = ["frosted", "light", "clear"];
const VIBRANCY_LEVELS: GlassVibrancy[] = ["low", "medium", "high"];
const SIZES = ["sm", "md", "lg"] as const;

const opacityLabel = (o: GlassOpacity): string =>
  typeof o === "number" ? `${Math.round(o * 100)}%` : o;

const specularLabel = (m: SpecularMode): string =>
  m === "none" ? "No specular" : `Specular: ${m}`;

interface GlassButtonCardProps {
  label: string;
  children: React.ReactNode;
}

const GlassButtonCard: React.FC<GlassButtonCardProps> = ({ label, children }) => (
  <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-4 dark:border-slate-600 dark:bg-slate-800/50">
    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
      {label}
    </span>
    <div className="flex min-h-[48px] items-center justify-center gap-3">
      {children}
    </div>
  </div>
);

export const GlassButtonDemo: React.FC = () => {
  const [glassColor, setGlassColor] = useState<typeof COLORS[number]>("blue");
  const [glassVibrancy, setGlassVibrancy] = useState<GlassVibrancy>("medium");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [glassSpecular, setGlassSpecular] = useState<SpecularMode>("none");
  const [glassSize, setGlassSize] = useState<"xs" | "sm" | "md" | "lg" | "xl">(
    "md",
  );

  return (
    <>
    <PlaygroundSection
      title="Glass Buttons"
      label="[Glass]"
      description="Showcase of glass Button and IconButton variants with color, vibrancy, opacity, specular, and size combinations."
      controls={
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Color
              </span>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                      glassColor === c
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => setGlassColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Vibrancy
              </span>
              <div className="flex gap-2">
                {VIBRANCY_LEVELS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                      glassVibrancy === v
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => setGlassVibrancy(v)}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Opacity Preset
              </span>
              <div className="flex gap-2">
                {OPACITY_PRESETS.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                      glassOpacity === o
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => setGlassOpacity(o)}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Specular Mode
              </span>
              <div className="flex gap-2">
                {SPECULAR_MODES.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition ${
                      glassSpecular === m
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => setGlassSpecular(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-200">
                Size
              </span>
              <div className="flex gap-2">
                {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                      glassSize === s
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
                    }`}
                    onClick={() => setGlassSize(s)}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
      preview={
        <GlassButtonCard
          label={`${glassColor} · ${opacityLabel(glassOpacity)} · ${specularLabel(glassSpecular)} · ${glassVibrancy}`}
        >
          <Button
            variant="glass"
            color={glassColor}
            vibrancy={glassVibrancy}
            glassOpacity={glassOpacity}
            specularMode={glassSpecular}
            size={glassSize}
          >
            Glass Button
          </Button>
          <IconButton
            icon="Search"
            variant="glass"
            color={glassColor}
            vibrancy={glassVibrancy}
            glassOpacity={glassOpacity}
            specularMode={glassSpecular}
            size={glassSize}
          />
        </GlassButtonCard>
      }
    />
    <GlassButtonCard label="States">
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Button
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="glass"
                color={glassColor}
                vibrancy={glassVibrancy}
                glassOpacity={glassOpacity}
                specularMode={glassSpecular}
                size="sm"
              >
                Default
              </Button>
              <span className="text-[10px] text-slate-400">Default</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="scale-[1.02] brightness-105">
                <Button
                  variant="glass"
                  color={glassColor}
                  vibrancy={glassVibrancy}
                  glassOpacity={glassOpacity}
                  specularMode={glassSpecular}
                  size="sm"
                >
                  Hover
                </Button>
              </div>
              <span className="text-[10px] text-slate-400">Hover</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="scale-[0.98] brightness-90">
                <Button
                  variant="glass"
                  color={glassColor}
                  vibrancy={glassVibrancy}
                  glassOpacity={glassOpacity}
                  specularMode={glassSpecular}
                  size="sm"
                >
                  Active
                </Button>
              </div>
              <span className="text-[10px] text-slate-400">Active</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                variant="glass"
                color={glassColor}
                vibrancy={glassVibrancy}
                glassOpacity={glassOpacity}
                specularMode={glassSpecular}
                size="sm"
                disabled
              >
                Disabled
              </Button>
              <span className="text-[10px] text-slate-400">Disabled</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            IconButton
          </span>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <IconButton
                icon="Search"
                variant="glass"
                color={glassColor}
                vibrancy={glassVibrancy}
                glassOpacity={glassOpacity}
                specularMode={glassSpecular}
                size="sm"
              />
              <span className="text-[10px] text-slate-400">Default</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="scale-[1.02] brightness-105">
                <IconButton
                  icon="Search"
                  variant="glass"
                  color={glassColor}
                  vibrancy={glassVibrancy}
                  glassOpacity={glassOpacity}
                  specularMode={glassSpecular}
                  size="sm"
                />
              </div>
              <span className="text-[10px] text-slate-400">Hover</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="scale-[0.98] brightness-90">
                <IconButton
                  icon="Search"
                  variant="glass"
                  color={glassColor}
                  vibrancy={glassVibrancy}
                  glassOpacity={glassOpacity}
                  specularMode={glassSpecular}
                  size="sm"
                />
              </div>
              <span className="text-[10px] text-slate-400">Active</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconButton
                icon="Search"
                variant="glass"
                color={glassColor}
                vibrancy={glassVibrancy}
                glassOpacity={glassOpacity}
                specularMode={glassSpecular}
                size="sm"
                disabled
              />
              <span className="text-[10px] text-slate-400">Disabled</span>
            </div>
          </div>
        </div>
      </div>
    </GlassButtonCard>
    </>
  );
};