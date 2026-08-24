import React, { useState } from "react";
import { PlaygroundSection } from "../PlaygroundSection";
import {
  Button,
  Input,
  Modal,
  MultiToggle,
  Select,
  Toggle,
  MODAL_POSITIONS,
  DEFAULT_SURFACE_CORNER,
} from "@cjlapao/ui-kit";
import type {
  GlassOpacity,
  GlassVibrancy,
  ModalPosition,
  PanelCorner,
  PanelSpecularMode,
  PanelVariant,
  Size,
  TrueColor,
} from "@cjlapao/ui-kit";
import {
  glassOpacityOptions,
  glassVibrancyOptions,
  panelCornerOptions,
  panelSpecularOptions,
  panelVariantOptions,
  trueColorOptions,
} from "../constants";

const GLASS_VARIANTS: PanelVariant[] = ["glass", "liquid-glass", "default"];

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <label className="flex flex-col gap-2">
    <span className="text-xs font-medium uppercase tracking-wide opacity-70">
      {label}
    </span>
    {children}
  </label>
);

const sizeOptions: { label: string; value: Size }[] = [
  { label: "XS", value: "xs" },
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
  { label: "XL", value: "xl" },
];

const positionOptions = MODAL_POSITIONS.map((value) => ({
  label: value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
  value,
}));

export const ModalDemo: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("Deploy orchestrator-api");
  const [description, setDescription] = useState(
    "Review the change before it goes out.",
  );
  const [size, setSize] = useState<Size>("md");
  const [position, setPosition] = useState<ModalPosition>("center");
  const [variant, setVariant] = useState<PanelVariant>("elevated");
  const [tone, setTone] = useState<TrueColor>("neutral");
  const [corner, setCorner] = useState<PanelCorner>(DEFAULT_SURFACE_CORNER);
  const [draggable, setDraggable] = useState(true);
  const [showMaximizeButton, setShowMaximizeButton] = useState(true);
  const [showMaximized, setShowMaximized] = useState(false);
  const [headless, setHeadless] = useState(false);
  const [responsive, setResponsive] = useState(true);
  const [darkOverlay, setDarkOverlay] = useState(false);
  const [withFooter, setWithFooter] = useState(true);
  const [glassOpacity, setGlassOpacity] = useState<GlassOpacity>("frosted");
  const [vibrancy, setVibrancy] = useState<GlassVibrancy>("medium");
  const [specularMode, setSpecularMode] =
    useState<PanelSpecularMode>("classic");

  const isGlass = GLASS_VARIANTS.includes(variant);

  return (
    <PlaygroundSection
      title="Modal"
      label="[Modal]"
      description="A dialog that behaves like a window — draggable by its header, placeable in any corner, and able to fill the screen."
      controls={
        <div className="space-y-5 text-sm">
          <Button fullWidth onClick={() => setIsOpen(true)}>
            Open modal
          </Button>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Position">
              <Select
                value={position}
                onChange={(event) =>
                  setPosition(event.target.value as ModalPosition)
                }
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Size">
              <MultiToggle
                fullWidth
                size="sm"
                options={sizeOptions}
                value={size}
                onChange={(value) => setSize(value as Size)}
              />
            </Field>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Surface">
              <Select
                value={variant}
                onChange={(event) =>
                  setVariant(event.target.value as PanelVariant)
                }
              >
                {panelVariantOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Tone">
              <Select
                value={tone}
                onChange={(event) => setTone(event.target.value as TrueColor)}
              >
                {trueColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Corner">
            <Select
              value={corner}
              onChange={(event) =>
                setCorner(event.target.value as PanelCorner)
              }
            >
              {panelCornerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
            <Toggle
              size="sm"
              label="Draggable"
              checked={draggable}
              onChange={(event) => setDraggable(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Maximise button"
              checked={showMaximizeButton}
              onChange={(event) => setShowMaximizeButton(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Open maximised"
              checked={showMaximized}
              onChange={(event) => setShowMaximized(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Headless"
              checked={headless}
              onChange={(event) => setHeadless(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Responsive"
              checked={responsive}
              onChange={(event) => setResponsive(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Dark overlay"
              checked={darkOverlay}
              onChange={(event) => setDarkOverlay(event.target.checked)}
            />
            <Toggle
              size="sm"
              label="Footer"
              checked={withFooter}
              onChange={(event) => setWithFooter(event.target.checked)}
            />
          </div>

          {isGlass && (
            <div className="grid gap-3 rounded-xl border border-black/10 p-3 md:grid-cols-3 dark:border-white/10">
              <Field label="Specular">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={panelSpecularOptions}
                  value={specularMode}
                  onChange={(value) =>
                    setSpecularMode(value as PanelSpecularMode)
                  }
                />
              </Field>
              <Field label="Vibrancy">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassVibrancyOptions}
                  value={vibrancy as string}
                  onChange={(value) => setVibrancy(value as GlassVibrancy)}
                />
              </Field>
              <Field label="Glass opacity">
                <MultiToggle
                  fullWidth
                  size="sm"
                  options={glassOpacityOptions}
                  value={glassOpacity as string}
                  onChange={(value) => setGlassOpacity(value as GlassOpacity)}
                />
              </Field>
            </div>
          )}

          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Title">
              <Input
                size="sm"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </Field>
            <Field label="Description">
              <Input
                size="sm"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
          </div>

          <p className="text-xs opacity-70">
            Drag the dialog by its header. <strong>Responsive</strong> makes it
            fill the screen below 640px and disables dragging — a window dragged
            half off a phone cannot be recovered. Tab is trapped inside, and
            Escape closes only the innermost dialog.
          </p>
        </div>
      }
      preview={
        <div className="flex min-h-40 items-center justify-center p-4">
          <Button variant="soft" onClick={() => setIsOpen(true)}>
            Open modal
          </Button>

          <Modal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            title={title}
            description={description}
            icon="Rocket"
            size={size}
            position={position}
            variant={variant}
            tone={tone}
            corner={corner}
            draggable={draggable}
            showMaximizeButton={showMaximizeButton}
            showMaximized={showMaximized}
            headless={headless}
            responsive={responsive}
            darkOverlay={darkOverlay}
            glassOpacity={glassOpacity}
            vibrancy={vibrancy}
            specularMode={specularMode}
            footer={
              withFooter ? (
                <Modal.Actions>
                  <Button
                    variant="soft"
                    color="slate"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button color="blue" onClick={() => setIsOpen(false)}>
                    Deploy
                  </Button>
                </Modal.Actions>
              ) : undefined
            }
          >
            <p>
              This dialog is draggable by its header, can sit in any of nine
              positions, and can fill the screen.
            </p>
            <p className="font-mono text-xs opacity-70">
              image: ghcr.io/acme/orchestrator-api:2.14.0
            </p>
            {headless && (
              <Button variant="soft" onClick={() => setIsOpen(false)}>
                Close (headless has no header)
              </Button>
            )}
          </Modal>
        </div>
      }
    />
  );
};
