import { useState } from "react";
import {
  Terminal,
  type PanelCorner,
  type PanelPadding,
  type PanelVariant,
  type TrueColor,
  type GlassOpacity,
  type GlassVibrancy,
  type PanelSpecularMode,
} from "@cjlapao/ui-kit";
import { PageHeader } from "../../shared/PageHeader";
import { ExampleCard } from "../../shared/ExampleCard";
import { PlaygroundPanel, SelectControl } from "../../shared/PlaygroundPanel";
import {
  surfaceVariantOptions,
  panelCornerOptions,
  panelPaddingOptions,
  trueColorOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelSpecularOptions,
} from "../../shared/options";
import TabbedTerminal from "./examples/TabbedTerminal";
import tabbedCode from "./examples/TabbedTerminal.tsx?raw";

export default function TerminalPage() {
  const [variant, setVariant] = useState<PanelVariant>("outlined");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<PanelCorner>("rounded-md");
  const [padding, setPadding] = useState<PanelPadding>("sm");
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("light");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-8">
      <PageHeader
        name="Terminal"
        description="An xterm.js terminal with ANSI colors, streaming output and keyboard input. Use Terminal on its own or TerminalTabs for persistent sessions. Both use the kit's Panel variants, tones, corners and glass surfaces. Connect onData, onResize and the imperative handle to your own shell transport."
      />
      <PlaygroundPanel
        controls={
          <div className="flex flex-col gap-4">
            <SelectControl
              label="Variant"
              options={surfaceVariantOptions}
              value={variant}
              onChange={(value) => setVariant(value as PanelVariant)}
            />
            <SelectControl
              label="Tone"
              options={trueColorOptions}
              value={tone}
              onChange={(value) => setTone(value as TrueColor)}
            />
            <SelectControl
              label="Corner"
              options={panelCornerOptions}
              value={corner}
              onChange={(value) => setCorner(value as PanelCorner)}
            />
            <SelectControl
              label="Padding"
              options={panelPaddingOptions}
              value={padding}
              onChange={(value) => setPadding(value as PanelPadding)}
            />
            <SelectControl
              label="Glass opacity"
              options={glassOpacityOptions}
              value={glassOpacity}
              onChange={(value) => setGlassOpacity(value as GlassOpacity)}
            />
            <SelectControl
              label="Vibrancy"
              options={glassVibrancyOptions}
              value={vibrancy}
              onChange={(value) => setVibrancy(value as GlassVibrancy)}
            />
            <SelectControl
              label="Specular"
              options={panelSpecularOptions}
              value={specularMode}
              onChange={(value) => setSpecularMode(value as PanelSpecularMode)}
            />
          </div>
        }
        preview={
          <TabbedTerminal
            {...{
              variant,
              tone,
              corner,
              padding,
              glassOpacity,
              vibrancy,
              specularMode,
            }}
          />
        }
      />
      <ExampleCard
        title="Tabbed sessions"
        description="Local echo demonstrates input/output, add/close, ANSI colors and session persistence. A real application forwards input to a PTY and writes its output through the ref. This demo does not execute shell commands."
        code={tabbedCode}
        filename="TabbedTerminal.tsx"
      >
        <TabbedTerminal />
      </ExampleCard>
      <ExampleCard
        title="Read-only output"
        description="Terminal also works without tabs. initialData is written once; use ref.write() for subsequent streamed output. Configure fonts and cursor through options, and override ANSI colors with terminalTheme."
        code={
          '<Terminal readOnly initialData={"\\x1b[32m✓ Build complete\\x1b[0m\\r\\n"} />'
        }
        filename="ReadOnly.tsx"
      >
        <Terminal
          height={180}
          readOnly
          initialData={
            "\x1b[36m$ npm run build\x1b[0m\r\n\r\n\x1b[32m✓ TypeScript checked\r\n✓ Assets bundled\x1b[0m\r\n\x1b[33mBuild completed in 1.24s\x1b[0m\r\n"
          }
        />
      </ExampleCard>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Terminal ref: write, writeln, clear, reset, focus, fit. TerminalTabs
        ref: getSession(id). Each session keeps its output and connection until
        removed. onReady supplies the handle to wire incoming transport data;
        use onDispose to close your transport when its session unmounts. Include
        the kit stylesheet for xterm rendering.
      </p>
    </div>
  );
}
