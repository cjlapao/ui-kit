import React, { useState } from "react";
import { Button, Input, Modal, MultiToggle } from "@cjlapao/ui-kit";
import type {
  ModalPosition,
  PanelCorner,
  PanelSpecularMode,
  PanelVariant,
  Size,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  Control,
  PlaygroundPanel,
  SelectControl,
  ToggleRow,
} from "../../shared/PlaygroundPanel";
import { ControlAccordion } from "../../shared/ControlAccordion";
import {
  controlSizeOptions,
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelSpecularOptions,
  surfaceVariantOptions,
  trueColorOptions,
} from "../../shared/options";

const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

const positionOptions = [
  { label: "Center", value: "center" },
  { label: "Top", value: "top" },
  { label: "Bottom", value: "bottom" },
  { label: "Left", value: "left" },
  { label: "Right", value: "right" },
  { label: "Top left", value: "top-left" },
  { label: "Top right", value: "top-right" },
  { label: "Bottom left", value: "bottom-left" },
  { label: "Bottom right", value: "bottom-right" },
];

const DEFAULT_CORNER: PanelCorner = "rounded-md";

// The pickers only offer the string presets; a bare `GlassVibrancy` /
// `GlassOpacity` would carry `| number`, which a MultiToggle value can't take.
type VibrancyPreset = "low" | "medium" | "high";
type OpacityPreset = "frosted" | "light" | "clear";

export const ModalPlayground: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Rename environment");
  const [description, setDescription] = useState(
    "Pick a new name for the staging environment.",
  );
  const [size, setSize] = useState<Size>("md");
  const [position, setPosition] = useState<ModalPosition>("center");
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("blue");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_CORNER);
  const [draggable, setDraggable] = useState(true);
  const [showMaximizeButton, setShowMaximizeButton] = useState(true);
  const [showMaximized, setShowMaximized] = useState(false);
  const [headless, setHeadless] = useState(false);
  const [responsive, setResponsive] = useState(true);
  const [darkOverlay, setDarkOverlay] = useState(false);
  const [withFooter, setWithFooter] = useState(true);
  const [specularMode, setSpecularMode] = useState<PanelSpecularMode>("classic");
  const [vibrancy, setVibrancy] = useState<VibrancyPreset>("medium");
  const [glassOpacity, setGlassOpacity] = useState<OpacityPreset>("frosted");

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundPanel
      controls={
        <div className="space-y-3">
          <ControlAccordion
            groups={[
              {
                id: "core",
                title: "Core",
                controls: (
                  <>
                    <SelectControl
                      label="Surface"
                      options={surfaceVariantOptions}
                      value={variant}
                      onChange={(value) => setVariant(value as PanelVariant)}
                    />
                    <Control label="Size">
                      <MultiToggle
                        fullWidth
                        size="sm"
                        options={controlSizeOptions}
                        value={size}
                        onChange={(value) => setSize(value as Size)}
                      />
                    </Control>
                    <SelectControl
                      label="Position"
                      options={positionOptions}
                      value={position}
                      onChange={(value) => setPosition(value as ModalPosition)}
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
                  </>
                ),
              },
              {
                id: "options",
                title: "Options",
                controls: (
                  <div className="grid grid-cols-2 gap-2">
                    <ToggleRow label="Draggable" checked={draggable} onChange={setDraggable} />
                    <ToggleRow
                      label="Maximize button"
                      checked={showMaximizeButton}
                      onChange={setShowMaximizeButton}
                    />
                    <ToggleRow
                      label="Open maximized"
                      checked={showMaximized}
                      onChange={setShowMaximized}
                    />
                    <ToggleRow label="Headless" checked={headless} onChange={setHeadless} />
                    <ToggleRow label="Responsive" checked={responsive} onChange={setResponsive} />
                    <ToggleRow
                      label="Dark overlay"
                      checked={darkOverlay}
                      onChange={setDarkOverlay}
                    />
                    <ToggleRow label="Footer" checked={withFooter} onChange={setWithFooter} />
                  </div>
                ),
              },
              ...(isGlass
                ? [
                    {
                      id: "glass",
                      title: "Glass",
                      controls: (
                        <div className="flex flex-col gap-3">
                          <Control label="Specular">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={panelSpecularOptions}
                              value={specularMode}
                              onChange={(value) => setSpecularMode(value as PanelSpecularMode)}
                            />
                          </Control>
                          <Control label="Vibrancy">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassVibrancyOptions}
                              value={vibrancy}
                              onChange={(value) => setVibrancy(value as VibrancyPreset)}
                            />
                          </Control>
                          <Control label="Glass opacity">
                            <MultiToggle
                              fullWidth
                              size="sm"
                              options={glassOpacityOptions}
                              value={glassOpacity}
                              onChange={(value) => setGlassOpacity(value as OpacityPreset)}
                            />
                          </Control>
                        </div>
                      ),
                    },
                  ]
                : []),
              {
                id: "content",
                title: "Content",
                controls: (
                  <div className="grid grid-cols-1 gap-3">
                    <Control label="Title">
                      <Input
                        size="sm"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                      />
                    </Control>
                    <Control label="Description">
                      <Input
                        size="sm"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                      />
                    </Control>
                  </div>
                ),
              },
            ]}
          />
          <p className="text-xs opacity-70">
            Drag the dialog by its header. <strong>Responsive</strong> makes it
            fill the screen below 640px and disables dragging — a window dragged
            half off a phone cannot be recovered. Tab is trapped inside, and
            Escape closes only the innermost dialog.
          </p>
        </div>
      }
      preview={
        <>
          <Button variant="solid" color="blue" onClick={() => setIsOpen(true)}>
            Open modal
          </Button>
          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={title}
            description={description}
            icon="Edit"
            variant={variant}
            size={size}
            tone={tone}
            position={position}
            corner={corner}
            draggable={draggable}
            showMaximizeButton={showMaximizeButton}
            showMaximized={showMaximized}
            headless={headless}
            responsive={responsive}
            darkOverlay={darkOverlay}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={isGlass ? specularMode : "none"}
            actions={
              withFooter ? (
                <>
                  <Button
                    variant="ghost"
                    color="blue"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="solid" color="blue" onClick={() => setIsOpen(false)}>
                    Save
                  </Button>
                </>
              ) : undefined
            }
          >
            <div className="flex flex-col gap-3">
              <Input placeholder="environment-name" leadingIcon="Edit" />
              <p className="text-xs leading-5 text-neutral-500 dark:text-neutral-400">
                Lowercase letters, numbers and dashes. This name appears in URLs
                and in the CLI.
              </p>
              {headless && (
                <Button variant="ghost" color="blue" onClick={() => setIsOpen(false)}>
                  Close (headless has no header)
                </Button>
              )}
            </div>
          </Modal>
        </>
      }
    >
    </PlaygroundPanel>
  );
};
