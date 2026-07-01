import * as React$1 from 'react';
import React__default, { ButtonHTMLAttributes, ReactNode, ReactElement, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, SVGProps } from 'react';
import { T as ThemeColor, B as ButtonVariant, a as ButtonColor, b as ButtonSize, c as TooltipPosition, d as ThemeSize, e as ButtonProps, I as IconName, M as ModalSize, H as HelpButtonProps, C as CapsuleBlueprintParameter } from './CapsuleBlueprint-8eZ4K2lf.js';
export { f as Button, g as CapsuleBlueprintValueType, h as ThemeMultiColor, i as Tooltip, j as TooltipProps, k as configureTheme, l as getAlertColorClasses, m as getBadgeColorClasses, n as getButtonActiveClasses, o as getButtonActiveHoverClasses, p as getButtonBaseClasses, q as getButtonColorClasses, r as getButtonHoverClasses, s as getCheckboxColorClasses, t as getLoaderProgressColors, u as getMultiToggleColorTokens, v as getMultiToggleVariantTokens, w as getPanelToneStyles, x as getPillColorClasses, y as getSpinnerColorTokens, z as getStatTileColorClasses, A as getStepperTonePalette, D as getTabsColorTokens, E as getToggleColorClasses, F as iconRegistry, G as resetTheme, J as resolveColor } from './CapsuleBlueprint-8eZ4K2lf.js';
import { CapsuleBlueprintParameter as CapsuleBlueprintParameter$1 } from '@cjlapao/ui-kit';

type AlertVariant = "subtle" | "solid" | "outline";
interface AlertProps extends React__default.HTMLAttributes<HTMLDivElement> {
    tone?: ThemeColor;
    color?: ThemeColor;
    variant?: AlertVariant;
    title?: string;
    description?: string;
    icon?: string | React__default.ReactElement | false;
    actions?: React__default.ReactNode;
    dismissible?: boolean;
    onDismiss?: () => void;
}
declare const Alert: React__default.ForwardRefExoticComponent<AlertProps & React__default.RefAttributes<HTMLDivElement>>;

interface AppDividerProps {
    /** Height of the divider in pixels or as CSS value */
    height?: number | string;
    /** Width of the divider in pixels */
    width?: number;
    /** Margin around the divider */
    margin?: number | string;
    /** Additional CSS classes */
    className?: string;
}
/**
 * A vertical divider for separating header sections
 */
declare const AppDivider: React__default.FC<AppDividerProps>;

interface BadgeProps {
    /**
     * Content to display inside the badge
     */
    count?: number | string;
    /**
     * Show only a dot indicator (no count)
     */
    dot?: boolean;
    /**
     * Max count to display before showing "+"
     * @default 99
     */
    maxCount?: number;
    /**
     * Badge color variant
     * @default "danger"
     */
    tone?: ThemeColor;
    /**
     * Additional class names
     */
    className?: string;
    /**
     * Additional styles
     */
    style?: React__default.CSSProperties;
}
/**
 * Badge component for displaying notification counts or indicators
 */
declare const Badge: React__default.FC<BadgeProps>;

type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
type SpinnerColor = ThemeColor;
type SpinnerVariant = "solid" | "segments";
type SpinnerThickness = "thin" | "normal" | "thick";
interface SpinnerProps extends React__default.HTMLAttributes<HTMLSpanElement> {
    size?: SpinnerSize;
    color?: SpinnerColor;
    variant?: SpinnerVariant;
    thickness?: SpinnerThickness;
    label?: string;
}
declare const Spinner: React__default.ForwardRefExoticComponent<SpinnerProps & React__default.RefAttributes<HTMLSpanElement>>;

type IconButtonRounded = "md" | "lg" | "xl" | "full";
interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "color"> {
    icon: string | React__default.ReactElement;
    variant?: ButtonVariant;
    color?: ButtonColor;
    size?: ButtonSize;
    rounded?: IconButtonRounded;
    customSizeClass?: string;
    iconClassName?: string;
    loading?: boolean;
    spinnerVariant?: "solid" | "segments";
    spinnerColor?: SpinnerColor;
    srLabel?: string;
    accent?: boolean;
    accentColor?: ButtonColor;
    /** When set, a styled tooltip is shown on hover (replaces the native title attribute). */
    tooltip?: string;
    /** Position of the tooltip relative to the button. Defaults to 'top'. */
    tooltipPosition?: TooltipPosition;
}
declare const IconButton: React__default.ForwardRefExoticComponent<IconButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

type BadgePosition = "top-start" | "top-end" | "bottom-start" | "bottom-end";
interface BadgeIconProps extends IconButtonProps {
    /**
     * Optional custom badge node. When provided, overrides count/dot rendering.
     */
    badgeContent?: React__default.ReactNode;
    /**
     * Numeric badge count. Ignored when `badgeContent` is supplied.
     */
    badgeCount?: number;
    /**
     * Show a small dot indicator instead of a number. Ignored when `badgeContent` is supplied.
     */
    badgeDot?: boolean;
    /**
     * Tailwind position for the badge relative to the button.
     */
    badgePosition?: BadgePosition;
    /**
     * Additional props forwarded to the underlying `Badge`.
     */
    badgeProps?: Omit<BadgeProps, "count" | "dot">;
    /**
     * Extra class applied to the outer wrapper span.
     */
    wrapperClassName?: string;
    /**
     * Expands the control to fill the available width.
     */
    fullWidth?: boolean;
}
declare const BadgeIcon: React__default.ForwardRefExoticComponent<BadgeIconProps & React__default.RefAttributes<HTMLButtonElement>>;

type PillVariant = "solid" | "soft" | "outline";
type PillSize = "xs" | "sm" | "md" | "lg";
type PillTone = ThemeColor;
interface PillProps extends React__default.HTMLAttributes<HTMLDivElement> {
    tone?: PillTone;
    variant?: PillVariant;
    size?: PillSize;
    uppercase?: boolean;
    icon?: React__default.ReactNode;
    dot?: boolean;
}
declare const Pill: React__default.FC<PillProps>;

type ProgressSize = "xs" | "sm" | "md" | "lg";
type ProgressMotion = "none" | "shimmer" | "pulse" | "shimmer-pulse" | "stripes" | "stripes-shimmer";
type ProgressMotionSpeed = "slow" | "normal" | "fast";
type ProgressMotionDirection = "forward" | "reverse";
interface ProgressProps extends React__default.HTMLAttributes<HTMLDivElement> {
    value?: number;
    size?: ProgressSize;
    color?: SpinnerColor;
    motion?: ProgressMotion;
    motionSpeed?: ProgressMotionSpeed;
    motionDirection?: ProgressMotionDirection;
    /**
     * @deprecated Use `motion="shimmer"` or `motion="none"` instead.
     */
    showShimmer?: boolean;
}
declare const Progress: React__default.ForwardRefExoticComponent<ProgressProps & React__default.RefAttributes<HTMLDivElement>>;

interface MultiProgressBarSeries {
    key: string;
    label: string;
    labelClassName?: string;
    value: number;
    /** Tailwind bg color class e.g., 'bg-rose-500'. Omit to auto-assign from the theme palette. */
    color?: string;
    /** Custom formatted value to display in legend, if omitted `value` is used */
    displayValue?: React__default.ReactNode;
}
interface MultiProgressBarProps {
    label: string;
    labelClassName?: string;
    secondaryLabel?: React__default.ReactNode;
    secondaryLabelClassName?: string;
    totalLabel?: React__default.ReactNode;
    total: number;
    series: MultiProgressBarSeries[];
    className?: string;
}
declare const MultiProgressBar: React__default.FC<MultiProgressBarProps>;

type StatusSpinnerIntent = "neutral" | "info" | "success" | "warning" | "danger";
type StatusSpinnerSize = "xs" | "sm" | "md" | "lg";
interface StatusSpinnerProps extends React__default.HTMLAttributes<HTMLSpanElement> {
    intent?: StatusSpinnerIntent;
    size?: StatusSpinnerSize;
    animated?: boolean;
    label?: string;
}
declare const StatusSpinner: React__default.ForwardRefExoticComponent<StatusSpinnerProps & React__default.RefAttributes<HTMLSpanElement>>;

type LoaderVariant = "spinner" | "progress";
type LoaderSize = "sm" | "md" | "lg";
type GlassBlurIntensity = "none" | "low" | "medium" | "high";
type LoaderColor = SpinnerColor;
interface LoaderProps {
    variant?: LoaderVariant;
    size?: LoaderSize;
    color?: LoaderColor;
    spinnerVariant?: SpinnerProps["variant"];
    spinnerThickness?: SpinnerProps["thickness"];
    title?: ReactNode;
    label?: ReactNode;
    progress?: number;
    className?: string;
    overlay?: boolean;
    glass?: boolean;
    glassBlurIntensity?: GlassBlurIntensity;
}
declare const Loader: React__default.FC<LoaderProps>;

type IconSize = "xs" | "sm" | "md" | "lg" | "xl";
/**
 * Base icon name type - apps can extend this with their own icon names
 */
type BaseIconName = string;
/**
 * Icon renderer function type
 */
type IconRenderer$1 = (icon: BaseIconName | ReactElement | undefined, size: IconSize | undefined, className?: string) => ReactNode;
/**
 * Default no-op icon renderer - returns null for string icons
 */
declare const defaultIconRenderer: IconRenderer$1;

type TextSize = "xs" | "sm" | "md" | "lg" | "xl";
/** Accepts all theme colors. The original five semantic names (neutral/info/success/warning/danger) are preserved unchanged. */
type EmptyStateTone = ThemeColor;
interface EmptyStateProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "title"> {
    title: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    actionVariant?: ButtonVariant;
    actionColor?: ButtonColor;
    icon?: string | React__default.ReactElement;
    iconSize?: IconSize;
    iconColor?: ThemeColor;
    textSize?: TextSize;
    showIcon?: boolean;
    tone?: EmptyStateTone;
    disableBorder?: boolean;
    transparentBackground?: boolean;
    fullWidth?: boolean;
    fullHeight?: boolean;
    actionSize?: ButtonSize;
    actionLeadingIcon?: string | React__default.ReactElement;
    size?: ThemeSize;
}
declare const EmptyState: React__default.FC<EmptyStateProps>;

declare const iconAccentRing: Record<ThemeColor, string>;
declare const iconAccentHover: Record<ThemeColor, string>;
declare const iconAccentActive: Record<ThemeColor, string>;

type RandomIntensity = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
interface RandomThemeColorValue {
    color: string;
    intensity: RandomIntensity;
    token: string;
}
/**
 * Returns a random Tailwind color token based on the ui-kit theme palette,
 * like `blue-500` or `emerald-300`.
 */
declare const getRandomThemeColorValue: () => RandomThemeColorValue;
/**
 * Returns a random Tailwind utility class for a theme color token.
 * Example: `getRandomThemeColorClass('bg')` -> `bg-blue-500`.
 */
declare const getRandomThemeColorClass: (prefix?: "bg" | "text" | "border") => string;
/**
 * Returns an array of `count` Tailwind color utility classes.
 * Uses ThemeMultiColor values in order (at intensity 500) for the first N items,
 * then falls back to `getRandomThemeColorClass` for any overflow.
 *
 * @example
 * getColorPalette(5)           // ['bg-red-500', 'bg-orange-500', ...]
 * getColorPalette(5, 'text')   // ['text-red-500', 'text-orange-500', ...]
 */
declare const getColorPalette: (count: number, prefix?: "bg" | "text" | "border") => string[];
/**
 * Returns an array of `count` ThemeColor names (e.g. `'red'`, `'orange'`, `'blue'`).
 * Uses ThemeMultiColor values in order for the first N items,
 * then falls back to random colors from RANDOM_THEME_COLORS for overflow.
 * Useful when components construct their own Tailwind class strings via template literals.
 *
 * @example
 * getColorPaletteNames(3) // ['red', 'orange', 'amber']
 */
declare const getColorPaletteNames: (count: number) => ThemeColor[];

type PanelVariant = "elevated" | "outlined" | "subtle" | "tonal" | "default" | "glass" | "simple" | "liquid-glass";
type PanelTone = ThemeColor;
type PanelDecoration = "none" | "gradient" | "shapes" | "both";
type PanelMediaPlacement = "top" | "start" | "end" | "overlay";
type PanelPadding = "none" | "xs" | "sm" | "md" | "lg";
type PanelCorner = "rounded" | "rounded-sm" | "rounded-md" | "rounded-lg" | "rounded-full" | "pill" | "none";
type PanelActionLayout = "auto" | "stacked" | "inline";
type PanelLoaderType = Exclude<LoaderProps["variant"], undefined>;
interface PanelAction extends Pick<ButtonProps, "variant" | "color" | "size" | "weight" | "leadingIcon" | "trailingIcon" | "loading" | "disabled" | "accent" | "accentColor"> {
    id?: string;
    label: React__default.ReactNode;
    onClick?: ButtonProps["onClick"];
    className?: string;
}
interface PanelProps extends Omit<React__default.HTMLAttributes<HTMLElement>, "title"> {
    title?: React__default.ReactNode;
    titleClassName?: string;
    subtitle?: React__default.ReactNode;
    subtitleClassName?: string;
    description?: React__default.ReactNode;
    descriptionClassName?: string;
    badge?: React__default.ReactNode;
    media?: React__default.ReactNode;
    mediaPlacement?: PanelMediaPlacement;
    actions?: PanelAction[];
    actionLayout?: PanelActionLayout;
    variant?: PanelVariant;
    tone?: ThemeColor;
    padding?: PanelPadding;
    corner?: PanelCorner;
    fullWidth?: boolean;
    disabled?: boolean;
    flexBody?: boolean;
    maxWidth?: string | number;
    minHeight?: string | number;
    bodyClassName?: string;
    bodyStyle?: React__default.CSSProperties;
    children?: React__default.ReactNode;
    loading?: boolean;
    loaderType?: PanelLoaderType;
    loaderTitle?: React__default.ReactNode;
    loaderMessage?: React__default.ReactNode;
    loaderProgress?: number;
    loaderColor?: LoaderProps["color"];
    hoverShadow?: boolean;
    decoration?: PanelDecoration;
    /**
     * Adds a subtle background tint on hover and lightens any decoration elements.
     * Defaults to `true` when an `onClick` handler is present, otherwise `false`.
     */
    hoverable?: boolean;
    color?: ThemeColor;
    /**
     * Override the default hover color.
     * If not provided, it defaults to the `color` prop if available, or a neutral tint.
     */
    hoverColor?: ThemeColor;
    /**
     * Override the default border color.
     * If not provided, it defaults to the `tone` or `color` prop depending on variant.
     */
    borderColor?: ThemeColor;
    /**
     * Override the default background color.
     */
    backgroundColor?: ThemeColor;
    /**
     * controls if the panel body should be scrollable
     * @default true
     */
    scrollable?: boolean;
    /**
     * Backdrop vibrancy for the liquid-glass variant.
     * Preset takes priority over a numeric value when both are provided.
     */
    vibrancy?: "low" | "medium" | "high" | number;
    /**
     * Glass fill opacity for the liquid-glass variant.
     * Preset takes priority over a numeric value when both are provided.
     * @default "frosted"
     */
    glassOpacity?: "frosted" | "light" | "clear" | number;
    /**
     * Whether the liquid-glass variant shows a specular highlight at the top.
     * @default true
     */
    specularHighlight?: boolean;
}
declare const Panel: React__default.FC<PanelProps>;

type HeroTitleSize = "xs" | "sm" | "md" | "lg" | "xl";
type HeroSubtitleSize = "xs" | "sm" | "md";
type HeroPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
interface HeroProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "title"> {
    /** Main heading text. */
    title: React__default.ReactNode;
    /** Supporting text rendered below the title at lower opacity. */
    subtitle?: React__default.ReactNode;
    /** Icon name from the registry, or a pre-built React element. When omitted the icon slot is not rendered. */
    icon?: IconName | React__default.ReactElement;
    /** Colour tone — drives the gradient background. Defaults to `"parallels"`. */
    tone?: ThemeColor;
    /** Size of the title text. Colour is always white. Defaults to `"sm"`. */
    titleSize?: HeroTitleSize;
    /** Size of the subtitle text. Colour is always white/75. Defaults to `"xs"`. */
    subtitleSize?: HeroSubtitleSize;
    /** Internal padding. Defaults to `"none"`. */
    padding?: HeroPadding;
    /** Whether to apply `rounded-xl` corner rounding. Defaults to `true`. */
    rounded?: boolean;
    /**
     * Decorative layer inside the banner:
     * - `"shapes"`   — three floating circles at low white opacity
     * - `"gradient"` — a diagonal white-to-transparent light wash
     * - `"both"`     — circles + wash (default)
     * - `"none"`     — no decoration
     */
    decoration?: PanelDecoration;
}
declare const Hero: React__default.FC<HeroProps>;

interface DynamicImgProps {
    base64: string;
    fill?: string;
    stroke?: string;
    className?: string;
    title?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    style?: React__default.CSSProperties;
}
declare const DynamicImg: React__default.FC<DynamicImgProps>;

interface DropdownMenuOption {
    label: ReactNode;
    value: string;
    description?: ReactNode;
    icon?: string | React__default.ReactElement;
    disabled?: boolean;
    danger?: boolean;
}
interface DropdownMenuProps {
    anchorRef: React__default.RefObject<HTMLElement | null>;
    open: boolean;
    onClose: () => void;
    items: DropdownMenuOption[];
    onSelect?: (item: DropdownMenuOption) => void;
    align?: "start" | "end";
    side?: "auto" | "top" | "bottom";
    width?: number | "trigger";
    maxHeight?: number;
    className?: string;
    itemClassName?: string;
}
declare const DropdownMenu: React__default.FC<DropdownMenuProps>;

interface DropdownButtonOption extends DropdownMenuOption {
    value: string;
}
interface DropdownButtonProps extends Omit<ButtonProps, "children" | "leadingIcon" | "trailingIcon" | "iconOnly" | "fullWidth"> {
    label: React__default.ReactNode;
    options: DropdownButtonOption[];
    onPrimaryClick?: (event: React__default.MouseEvent<HTMLButtonElement>) => void;
    onOptionSelect?: (option: DropdownButtonOption) => void;
    dropdownIcon?: ButtonProps["leadingIcon"];
    fullWidth?: boolean;
    split?: boolean;
    /**
     * Hide the dropdown caret trigger when there are no menu options.
     * Defaults to true so empty split buttons render as a single clean button.
     */
    hideDropdownTriggerWhenEmpty?: boolean;
    menuWidth?: number | "trigger";
    menuClassName?: string;
}
declare const DropdownButton: React__default.FC<DropdownButtonProps>;

interface TooltipWrapperProps {
    /** Tooltip text. When omitted no tooltip is shown but the child is rendered unchanged. */
    text?: string;
    /** Delay in ms before the tooltip appears. Defaults to 500. */
    delay?: number;
    /** Where to place the tooltip relative to the child. Defaults to 'top'. */
    position?: TooltipPosition;
    /** The element to attach the tooltip to. Must accept onMouseEnter / onMouseLeave. */
    children: React__default.ReactElement<React__default.HTMLAttributes<Element>>;
}
/**
 * Attaches a styled tooltip to any child element without adding any wrapper
 * element to the DOM. The tooltip is rendered via a React portal directly into
 * document.body and positioned with `position: fixed`, so it has zero impact on
 * the child's layout or spacing.
 *
 * Includes edge collision detection: when the tooltip would overflow the
 * viewport, it is shifted inward and its caret is repositioned to still point
 * at the trigger element.
 *
 * The component always renders a Fragment so that switching `text` between
 * undefined and a string value never causes the child element to unmount —
 * important when the child holds a ref (e.g. for truncation detection).
 */
declare const TooltipWrapper: React__default.FC<TooltipWrapperProps>;

type InputValidationStatus = "none" | "error" | "success";
type InputSize = "sm" | "md" | "lg";
type InputVariant = "flat" | "elevated" | "ghost" | "underline";
type IconRenderer = string | React__default.ReactElement;
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color"> {
    size?: InputSize;
    tone?: ButtonColor;
    /** Visual surface style. Defaults to `flat`. */
    variant?: InputVariant;
    validationStatus?: InputValidationStatus;
    leadingIcon?: IconRenderer;
    trailingIcon?: IconRenderer;
    /** When provided, the trailing icon renders as an interactive button instead of a static decoration. */
    onTrailingIconClick?: React__default.MouseEventHandler<HTMLButtonElement>;
    wrapperClassName?: string;
    unstyled?: boolean;
    fullHeight?: boolean;
}
declare const Input: React__default.ForwardRefExoticComponent<InputProps & React__default.RefAttributes<HTMLInputElement>>;

type PasswordInputProps = Omit<InputProps, "type" | "trailingIcon" | "onTrailingIconClick">;
declare const PasswordInput: React$1.ForwardRefExoticComponent<PasswordInputProps & React$1.RefAttributes<HTMLInputElement>>;

type TextareaSize = "sm" | "md" | "lg";
type TextareaValidationStatus = "none" | "error" | "success";
type TextareaResize = "none" | "vertical" | "horizontal" | "both";
interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size" | "color"> {
    size?: TextareaSize;
    tone?: ThemeColor;
    validationStatus?: TextareaValidationStatus;
    resize?: TextareaResize;
    helpText?: ReactNode;
}
declare const Textarea: React$1.ForwardRefExoticComponent<TextareaProps & React$1.RefAttributes<HTMLTextAreaElement>>;

type SelectSize = "sm" | "md" | "lg";
type SelectValidationStatus = "none" | "error" | "success";
interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size" | "color"> {
    size?: SelectSize;
    tone?: ThemeColor;
    validationStatus?: SelectValidationStatus;
    placeholder?: ReactNode;
    leadingIcon?: string | React__default.ReactElement;
    hideCaret?: boolean;
    unstyled?: boolean;
}
declare const Select: React__default.ForwardRefExoticComponent<SelectProps & React__default.RefAttributes<HTMLSelectElement>>;

interface ComboboxProps {
    value?: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    emptyMessage?: string;
    color?: ThemeColor;
}
declare const Combobox: React__default.FC<ComboboxProps>;

type TreeTone = ThemeColor;
interface TreeReorderEvent {
    id: string;
    oldOrder: number;
    newOrder: number;
}
interface TreeItemData {
    id: string;
    icon?: React__default.ReactNode;
    iconClassName?: string;
    title?: React__default.ReactNode;
    titleClassName?: string;
    subtitle?: React__default.ReactNode;
    subtitleClassName?: string;
    description?: React__default.ReactNode;
    descriptionClassName?: string;
    /** Optional badge/status slot rendered below description, without tone-derived text styling. */
    badge?: React__default.ReactNode;
    tone?: TreeTone;
    active?: boolean;
    body?: React__default.ReactNode;
    defaultExpanded?: boolean;
    actions?: React__default.ReactNode;
    hoverActions?: React__default.ReactNode;
    children?: TreeItemData[];
}
interface TreeViewProps {
    root?: TreeItemData;
    items: TreeItemData[];
    tone?: TreeTone;
    rootTone?: TreeTone;
    rootActive?: boolean;
    animated?: boolean;
    showLine?: boolean;
    showConnectors?: boolean;
    connectorStyle?: "rings" | "dots";
    branchColorMode?: "item" | "parent";
    junctionStyle?: "rounded" | "dot";
    showCenterDot?: boolean;
    connectorHalf?: boolean;
    connectorBorderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    dotSpacing?: number;
    indent?: "xs" | "sm" | "md" | "lg";
    rootChildIndentExtra?: number;
    rowGap?: number;
    stubHeight?: number;
    className?: string;
    loading?: boolean;
    loadingState?: React__default.ReactNode;
    emptyState?: React__default.ReactNode;
    error?: React__default.ReactNode;
    errorState?: React__default.ReactNode;
    onRetry?: () => void;
    reorderable?: boolean;
    onReorder?: (event: TreeReorderEvent) => void;
}
interface TreeItemCardProps {
    icon?: React__default.ReactNode;
    iconClassName?: string;
    title?: React__default.ReactNode;
    titleClassName?: string;
    /** When true, the title wraps on word boundaries up to 10 lines instead of truncating. Default: false */
    titleWrap?: boolean;
    /** When true, the title stays on one line and scrolls horizontally — no wrapping, no truncation. Default: false */
    titleScroll?: boolean;
    subtitle?: React__default.ReactNode;
    subtitleClassName?: string;
    description?: React__default.ReactNode;
    descriptionClassName?: string;
    /** Optional badge/status slot rendered below description, without tone-derived text styling. */
    badge?: React__default.ReactNode;
    tone?: TreeTone;
    body?: React__default.ReactNode;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onToggleExpanded?: () => void;
    forceToggle?: boolean;
    actions?: React__default.ReactNode;
    hoverActions?: React__default.ReactNode;
    dragHandle?: React__default.ReactNode;
    isDragging?: boolean;
    index?: number;
    className?: string;
    /** When true, show a subtle hover lift effect (shadow + translate-y). Default: false */
    hoverable?: boolean;
    /** When true, overlay a pulsing background animation using the item's tone color. Default: false */
    activePulse?: boolean;
}
interface TreeFlowSvgProps {
    cardHeights: number[];
    cardAnchors?: number[];
    mode?: "tree" | "bracket";
    parentAnchorY?: number;
    parentOffset?: number;
    toneList: TreeTone[];
    activeList: boolean[];
    rootTone?: TreeTone;
    rootActive?: boolean;
    rowGap: number;
    stubHeight?: number;
    depth?: number;
    rootChildIndentExtra?: number;
    indent?: "xs" | "sm" | "md" | "lg";
    showLine?: boolean;
    showConnectors?: boolean;
    connectorStyle?: "rings" | "dots";
    branchColorMode?: "item" | "parent";
    junctionStyle?: "rounded" | "dot";
    showCenterDot?: boolean;
    connectorHalf?: boolean;
    connectorBorderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    dotSpacing?: number;
    style?: React__default.CSSProperties;
    className?: string;
    animated?: boolean;
}

interface PickerTag {
    label: string;
    tone?: TreeTone;
}
interface PickerItem {
    id: string;
    /** Optional leading icon element */
    icon?: React__default.ReactNode;
    title: string;
    subtitle?: string;
    description?: string;
    /** Tags rendered as Pills at the trailing edge of each row */
    tags?: PickerTag[];
}
interface PickerFilter {
    /** Label shown on the filter toggle when active (e.g. "Stopped") */
    label: string;
    /** Predicate that returns true for items included in the filtered view */
    predicate: (item: PickerItem) => boolean;
}
interface PickerProps {
    items: PickerItem[];
    loading?: boolean;
    /** Single-select: the currently selected item id */
    selectedId?: string;
    /** Called when an item is clicked (single mode: closes dropdown; multi mode: toggles) */
    onSelect?: (item: PickerItem) => void;
    /** Placeholder shown on the trigger button when nothing is selected */
    placeholder?: string;
    /** Placeholder text inside the search input */
    searchPlaceholder?: string;
    emptyMessage?: string;
    loadingMessage?: string;
    /**
     * When provided, a filter toggle is shown that restricts the list to items
     * matching the predicate. The user can toggle it off to see all items.
     */
    defaultFilter?: PickerFilter;
    /**
     * When true, the dropdown ignores any clipping ancestor (e.g. a modal's
     * overflow container) and positions itself against the viewport instead.
     * Useful when the picker is inside a constrained modal or panel.
     * Default: false
     */
    escapeBoundary?: boolean;
    className?: string;
    color?: ThemeColor;
    /** Enable multi-select mode. Use selectedIds + onMultiChange instead of selectedId + onSelect. */
    multi?: boolean;
    /** Multi-select: the currently selected item ids */
    selectedIds?: string[];
    /** Called with the new selection array whenever the user toggles an item */
    onMultiChange?: (ids: string[]) => void;
    /** Max individual pills shown in the trigger before collapsing to "N selected". Default: 3 */
    maxPillsShown?: number;
    /** 'sm' renders a compact trigger suitable for toolbars. Default: 'md' */
    size?: "sm" | "md";
    /** When true, the picker fills all available horizontal space. Default: true */
    fullWidth?: boolean;
    /** When true, the picker fills all available vertical space. Default: false */
    fullHeight?: boolean;
}
declare const Picker: React__default.FC<PickerProps>;

/** A known option in the dropdown list */
interface TagPickerItem {
    id: string;
    label: string;
    /** Optional leading icon */
    icon?: React__default.ReactNode;
    /** Optional Pills rendered at the trailing edge of each row */
    tags?: PickerTag[];
}
interface TagPickerProps {
    /** Known options shown in the dropdown */
    items: TagPickerItem[];
    /**
     * Controlled array of selected values.
     * For known items this is the item's `id`.
     * For free-text entries created via `allowCreate`, this is the raw text itself.
     */
    value: string[];
    onChange: (values: string[]) => void;
    /**
     * Show a "Create '…'" row when the search query doesn't match any existing item.
     * Default: false
     */
    allowCreate?: boolean;
    /**
     * Called when the user confirms a new free-text value.
     * If omitted, the raw text is added to value[] directly via onChange.
     */
    onCreateItem?: (label: string) => void;
    /**
     * When false, behaves as single-select: picking a new item replaces the current value.
     * Default: true (multi-select with tag pills)
     */
    multi?: boolean;
    /** Placeholder shown in the trigger when nothing is selected */
    placeholder?: string;
    /** Placeholder inside the search input */
    searchPlaceholder?: string;
    emptyMessage?: string;
    loading?: boolean;
    loadingMessage?: string;
    color?: ThemeColor;
    itemColor?: ThemeColor;
    /**
     * When true, the dropdown positions against the viewport instead of a clipping ancestor.
     * Useful when the component is inside a modal or constrained panel.
     * Default: false
     */
    escapeBoundary?: boolean;
    /**
     * Maximum number of tag pills shown before a "+N" overflow pill appears.
     * Set to 0 or undefined to show all tags. Default: 3
     */
    tagLimit?: number;
    /**
     * When true, items added during this session (not present in the initial value)
     * are highlighted with an emerald color cue — both in the trigger pills and in
     * the dropdown list. Default: true
     */
    highlightNew?: boolean;
    className?: string;
    disabled?: boolean;
    /** When true, hides the remove (×) button on tag pills and prevents adding/removing items via the dropdown. @default false */
    readOnly?: boolean;
    /**
     * Optional function to normalize a value before it is added.
     * Applied to both free-text creations and known-item selections.
     * The return value is what gets stored in `value[]`.
     * Example: `(v) => v.toUpperCase()`
     */
    normalizeValue?: (value: string) => string;
}
declare const TagPicker: React__default.FC<TagPickerProps>;

type SectionSize = "xs" | "sm" | "md" | "lg";
type SectionVariant = 
/** Bold neutral title, no extra decoration (clean default). */
"default"
/** Lighter muted title — lower visual weight. */
 | "subtle"
/** Tiny all-caps + wide letter-spacing (matches standard detail-panel style). */
 | "uppercase"
/** Same as `default` but with a bottom border separating header from body. */
 | "bordered"
/** Subtle filled background on the header strip. */
 | "filled";
interface SectionProps {
    /** Section heading. */
    title: React__default.ReactNode;
    /** Optional secondary line below the title. */
    subtitle?: React__default.ReactNode;
    children?: React__default.ReactNode;
    /** Controls header padding and title/subtitle font size. Defaults to `'md'`. */
    size?: SectionSize;
    /** Visual style of the section header. Defaults to `'uppercase'`. */
    variant?: SectionVariant;
    /** Optional content rendered on the right side of the header (e.g. icon buttons). */
    actions?: React__default.ReactNode;
    /**
     * Override title text size independently from `size`.
     * Accepts any Tailwind text-size class, e.g. `"text-xs"` or `"text-sm"`.
     */
    titleSize?: string;
    /**
     * Override title text colour / weight independently from `variant`.
     * e.g. `"text-sky-600 font-bold"`
     * Merged after variant styles so it wins on conflicts.
     */
    titleColor?: string;
    /**
     * Override subtitle text size independently from `size`.
     * e.g. `"text-[10px]"`
     */
    subtitleSize?: string;
    /**
     * Override subtitle text colour / weight.
     * e.g. `"text-neutral-600 dark:text-neutral-300"`
     */
    subtitleColor?: string;
    /** Extra classes for the title span. */
    titleClassName?: string;
    /** Extra classes for the subtitle span. */
    subtitleClassName?: string;
    /** Extra classes for the body wrapper div. */
    bodyClassName?: string;
    /** Extra classes for the header wrapper div. */
    headerClassName?: string;
    className?: string;
    /** Whether to remove all padding from the section. */
    noPadding?: boolean;
}
declare const Section: React__default.FC<SectionProps>;

interface TagPanelTag {
    id?: string;
    label: string;
    /** Pill tone. Defaults to `'neutral'`. */
    tone?: ThemeColor;
    /** Pill variant. Defaults to `'soft'`. */
    variant?: PillVariant;
    /** Pill size. Defaults to `'sm'`. */
    size?: PillSize;
    /** Optional leading icon inside the pill. */
    icon?: React__default.ReactNode;
    children?: React__default.ReactNode;
}
interface TagPanelProps {
    /** Section heading. Omit entirely to hide the header. */
    title?: React__default.ReactNode;
    /** Optional secondary line below the title. */
    subtitle?: React__default.ReactNode;
    /** Tags to render as pills. */
    tags: TagPanelTag[];
    /**
     * Maximum number of pills shown before a `+N` overflow pill appears.
     * Set to `0` to always show all. Default: `5`.
     */
    tagLimit?: number;
    /**
     * Tone used for the `+N` overflow pill.
     * Defaults to `'neutral'`.
     */
    overflowTone?: ThemeColor;
    /** Rendered when `tags` is empty. */
    emptyState?: React__default.ReactNode;
    /** Optional actions rendered on the right side of the section header. */
    actions?: React__default.ReactNode;
    /** Controls header padding and font size. Defaults to `'md'`. */
    size?: SectionSize;
    /** Visual style of the section header. Defaults to `'uppercase'`. */
    variant?: SectionVariant;
    /** Extra classes for the root element. */
    className?: string;
    /** Extra classes for the tags container. */
    bodyClassName?: string;
    /** Remove all padding from the section header. */
    noPadding?: boolean;
}
declare const TagPanel: React__default.FC<TagPanelProps>;

type CheckboxDescriptionPlacement = "bottom" | "inline";
type CheckboxAlign = "left" | "right";
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "children"> {
    /**
     * Optional label rendered next to the checkbox control.
     */
    label?: ReactNode;
    /**
     * Optional description displayed under the label.
     */
    description?: ReactNode;
    /**
     * Controls if the description is stacked under the label (default) or inline beside it.
     */
    descriptionPlacement?: CheckboxDescriptionPlacement;
    /**
     * Adjusts checkbox dimensions and typography.
     */
    size?: ThemeSize;
    /**
     * Accent color applied to the checkbox.
     */
    color?: ThemeColor;
    /**
     * Enables the native indeterminate visual state.
     */
    indeterminate?: boolean;
    /**
     * When true the container will stretch to the available width.
     */
    fullWidth?: boolean;
    /**
     * Renders the checkbox control on the left (default) or right side of the label block.
     */
    controlAlign?: CheckboxAlign;
    /**
     * Additional classes applied to the root label element.
     */
    className?: string;
    /**
     * Additional classes applied directly to the input element.
     */
    inputClassName?: string;
}
/**
 * Accessible checkbox control styled exclusively with Tailwind utilities.
 */
declare const Checkbox: React$1.ForwardRefExoticComponent<CheckboxProps & React$1.RefAttributes<HTMLInputElement>>;

type ToggleSize = "sm" | "md" | "lg";
type ToggleAlign = "left" | "right";
type ToggleDescriptionPlacement = "inline" | "stacked";
type TogglePadding = "none" | "xs" | "sm" | "md" | "lg" | "xl";
interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color" | "children"> {
    label?: ReactNode;
    description?: ReactNode;
    descriptionPlacement?: ToggleDescriptionPlacement;
    size?: ToggleSize;
    padding?: TogglePadding;
    color?: ThemeColor;
    alignLabel?: ToggleAlign;
    iconOn?: string | React.ReactElement;
    iconOff?: string | React.ReactElement;
    fullWidth?: boolean;
    className?: string;
    /** When set, a styled tooltip is shown on hover. */
    tooltip?: string;
    /** Position of the tooltip relative to the toggle. Defaults to 'top'. */
    tooltipPosition?: TooltipPosition;
}
declare const Toggle: React$1.ForwardRefExoticComponent<ToggleProps & React$1.RefAttributes<HTMLInputElement>>;

type MultiToggleSize = "sm" | "md" | "lg";
type MultiToggleShape = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
type MultiToggleVariant = "theme" | "solid" | "soft";
type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>);
type MultiToggleOptionWidth = number | LiteralUnion<"auto">;
type MultiToggleActiveWidthStrategy = "auto" | "max";
interface MultiToggleOption {
    value: string;
    label?: ReactNode;
    icon?: string | React__default.ReactElement;
    disabled?: boolean;
    width?: MultiToggleOptionWidth;
}
interface MultiToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange" | "value"> {
    options: MultiToggleOption[];
    value: string;
    rounded?: MultiToggleShape;
    onChange: (value: string) => void;
    size?: MultiToggleSize;
    color?: ThemeColor;
    fullWidth?: boolean;
    className?: string;
    showOnlyActiveLabel?: boolean;
    truncateOverflow?: boolean;
    adaptiveWidth?: boolean;
    optionMaxWidth?: number | string;
    activeWidthStrategy?: MultiToggleActiveWidthStrategy;
    variant?: MultiToggleVariant;
    /** When set, overrides the active option's text color with this color's active-text token. */
    accentColor?: ThemeColor;
}
declare const MultiToggle: React__default.FC<MultiToggleProps>;

type ButtonSelectorMode = "single" | "multi";
interface ButtonSelectorOption<T extends string = string> {
    value: T;
    label: string;
    description?: string;
    /** Icon name (string from icon registry) or a ReactElement */
    icon?: string | React__default.ReactElement;
    disabled?: boolean;
}
interface ButtonSelectorProps<T extends string = string> {
    options: ButtonSelectorOption<T>[];
    /** In single mode: a single value. In multi mode: an array of values. */
    value: T | T[];
    onChange: (value: T | T[]) => void;
    /** "single" enforces radio-like behaviour; "multi" allows multiple selections (default). */
    mode?: ButtonSelectorMode;
    color?: ThemeColor;
    /** Number of grid columns (default: 2) */
    cols?: 1 | 2 | 3 | 4;
    /** Tailwind gap class applied to the grid (default: "gap-2") */
    gap?: string;
    /** Optional label rendered above the grid */
    label?: string;
    /** Icon size passed to the icon renderer (default: "sm") */
    iconSize?: IconSize;
    className?: string;
    disabled?: boolean;
}
declare function ButtonSelector<T extends string = string>(props: ButtonSelectorProps<T>): React__default.ReactElement;

type FormFieldLayout = "stacked" | "inline";
type FormFieldValidationStatus = "none" | "error" | "success";
type FormFieldWidth = "auto" | "full";
interface FormFieldProps {
    label?: ReactNode;
    labelFor?: string;
    description?: ReactNode;
    hint?: ReactNode;
    error?: ReactNode;
    validationStatus?: FormFieldValidationStatus;
    required?: boolean;
    optionalLabel?: ReactNode;
    labelAction?: ReactNode;
    layout?: FormFieldLayout;
    children: ReactNode;
    className?: string;
    helpText?: ReactNode;
    width?: FormFieldWidth;
}
declare const FormField: React__default.FC<FormFieldProps>;

type FormLayoutColumns = 1 | 2 | 3;
type FormLayoutGap = "sm" | "md" | "lg";
interface FormLayoutProps {
    columns?: FormLayoutColumns;
    gap?: FormLayoutGap;
    verticalPadding?: FormLayoutGap;
    children: ReactNode;
    className?: string;
}
declare const FormLayout: React__default.FC<FormLayoutProps>;

interface FormSectionProps {
    title?: ReactNode;
    description?: ReactNode;
    footer?: ReactNode;
    children: ReactNode;
    className?: string;
    padding?: "sm" | "md" | "lg";
}
declare const FormSection: React__default.FC<FormSectionProps>;

type InputGroupSize = "sm" | "md" | "lg";
type InputGroupValidationStatus = "none" | "error" | "success";
interface InputGroupProps {
    leadingAddon?: ReactNode;
    trailingAddon?: ReactNode;
    children: ReactNode;
    tone?: ButtonColor;
    size?: InputGroupSize;
    className?: string;
    validationStatus?: InputGroupValidationStatus;
    disabled?: boolean;
}
declare const InputGroup: React__default.FC<InputGroupProps>;

type MultiSelectPillOption = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};
interface MultiSelectPillsProps {
    /**
     * Used as the name for the generated hidden inputs (e.g. `${name}[]`).
     */
    name: string;
    /**
     * Options rendered as pills.
     */
    options: MultiSelectPillOption[];
    /**
     * Optional legend displayed above the pill list.
     */
    legend?: React__default.ReactNode;
    /**
     * Optional helper text rendered below the legend.
     */
    description?: React__default.ReactNode;
    /**
     * Current selected values when using the component in a controlled way.
     */
    value?: string[];
    /**
     * Default selected values for uncontrolled usage.
     */
    defaultValue?: string[];
    /**
     * Called whenever the selected values change.
     */
    onChange?: (selectedValues: string[]) => void;
    /**
     * Optional class applied to the fieldset wrapper.
     */
    className?: string;
    /**
     * Disable the whole control.
     */
    disabled?: boolean;
    /**
     * Tailwind size token controlling text size and padding.
     */
    size?: "xs" | "sm" | "base" | "lg";
    /**
     * Theme color used when a pill is selected.
     * Accepts any ThemeColor value. Defaults to "blue".
     */
    color?: ThemeColor;
    /**
     * Border radius of the pills.
     * Defaults to "full" (fully rounded).
     */
    rounded?: "none" | "sm" | "md" | "lg" | "full";
    /**
     * Gap between pills.
     * Defaults to "2".
     */
    gap?: "1" | "1.5" | "2" | "3" | "4";
    /**
     * Selection behaviour. Defaults to multi-select.
     */
    selectionMode?: "multiple" | "single";
}
declare const MultiSelectPills: React__default.FC<MultiSelectPillsProps>;

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string, signal?: AbortSignal) => void;
    onClear?: () => void;
    debounceMs?: number;
    autoSearch?: boolean;
    className?: string;
    disabled?: boolean;
    initialValue?: string;
    shouldClear?: boolean;
    leadingIcon?: string | React__default.ReactElement;
    variant?: "default" | "gradient";
    /** Accent colour for focus ring, icon highlight, and clear-button hover. Default: 'blue' */
    color?: ThemeColor;
    /**
     * Start (darker) colour of the gradient glow (gradient variant only).
     * Defaults to the -600 shade of `color` when omitted.
     */
    gradientFrom?: string;
    /**
     * End (lighter) colour of the gradient glow (gradient variant only).
     * Defaults to the -400 shade of `color` when omitted.
     */
    gradientTo?: string;
    /**
     * Controls how prominent the gradient glow is (gradient variant only).
     * - `subtle`  – barely visible; a hint of colour at the border
     * - `soft`    – gentle glow, low key (default)
     * - `medium`  – clearly visible glow
     * - `strong`  – bold, wide glow
     */
    glowIntensity?: "subtle" | "soft" | "medium" | "strong";
}
declare const SearchBar: React__default.FC<SearchBarProps>;

interface TruncatedTextProps {
    /** The text to display, truncated with an ellipsis when it overflows. */
    text: string;
    /** Extra classes applied to the text element. */
    className?: string;
    /** Delay in ms before the tooltip becomes visible. Defaults to 2000. */
    delay?: number;
    /** Render as a different element. Defaults to "div". */
    as?: "div" | "span" | "p";
    /** Where to place the tooltip. Defaults to 'top'. */
    tooltipPosition?: TooltipPosition;
    /**
     * When true, the outer `<div class="min-w-0">` wrapper is omitted and the
     * TooltipWrapper is returned directly. Use this when TruncatedText is a flex
     * child and you control sizing via `className` (e.g. `"min-w-0 flex-1"`).
     */
    noWrapper?: boolean;
}
declare const TruncatedText: React__default.FC<TruncatedTextProps>;

type InfoRowSize = "xs" | "sm" | "md" | "lg";
type InfoRowPadding = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
interface InfoRowProps {
    /** Row label (left side). Accepts ReactNode for composed/styled labels. */
    label: React__default.ReactNode;
    /**
     * Override label text size independently from `size`.
     * When omitted the shared `size` prop drives label size.
     */
    labelSize?: InfoRowSize;
    /**
     * Extra classes for the label span — use for custom colour, weight, etc.
     * e.g. `labelClassName="text-emerald-600 font-semibold"`
     */
    labelClassName?: string;
    /**
     * Fixed width class for the label column (e.g. `"w-32"`).
     * Defaults to a size-appropriate width (`w-16` / `w-20` / `w-24` / `w-28`).
     * Pass `""` to let the label size naturally.
     */
    labelWidth?: string;
    /**
     * Row value (right side).
     * - `string` / `number` — rendered as text, copy button enabled automatically.
     * - `boolean` — rendered as "Yes" / "No" with copy enabled.
     * - `ReactNode` — rendered as-is, copy button suppressed.
     * - `null` / `undefined` / `''` — treated as empty (see `hideIfEmpty`).
     */
    value?: React__default.ReactNode;
    /**
     * Override value text size independently from `size`.
     * When omitted the shared `size` prop drives value size.
     */
    valueSize?: InfoRowSize;
    /**
     * Extra classes for the value span — use for custom colour, weight, etc.
     * e.g. `valueClassName="text-sky-500"`
     */
    valueClassName?: string;
    /** Controls both label and value text size when individual overrides are absent. Defaults to `'md'`. */
    size?: InfoRowSize;
    /**
     * Vertical padding override. Accepts the full size scale including `'none'`.
     * When omitted, padding is derived from `size` (xs→py-1, sm→py-1.5, md→py-2, lg→py-2.5).
     */
    padding?: InfoRowPadding;
    /**
     * Show a copy-to-clipboard button.
     * Defaults to `true` — shown automatically when the resolved value is a string or number.
     * Pass `false` to suppress the button entirely.
     */
    copyable?: boolean;
    /**
     * Render the value in a monospace font.
     * Shorthand for `valueClassName="font-mono"`.
     */
    mono?: boolean;
    /**
     * Hide the row entirely when `value` is `null`, `undefined`, or `''`.
     * Defaults to `true`. Set to `false` to show the `emptyText` placeholder instead.
     */
    hideIfEmpty?: boolean;
    /**
     * Placeholder text shown when `hideIfEmpty` is `false` and the value is empty.
     * Defaults to `'—'`.
     */
    emptyText?: string;
    /**
     * Allow the value to wrap to multiple lines instead of truncating.
     * Defaults to `false`.
     */
    wrap?: boolean;
    /**
     * Show a tooltip with the full value when the text is truncated.
     * Only active when `wrap` is `false` and the value is a string or number.
     * Defaults to `true`.
     */
    tooltipOnTruncate?: boolean;
    /** Remove the bottom border (e.g. for the last row when handled externally). */
    noBorder?: boolean;
    /**
     * Remove the default horizontal padding (`px-3`/`px-4`).
     * Useful when the parent already provides horizontal spacing.
     */
    noPadding?: boolean;
    /**
     * Add a subtle hover background and rounded corners (matches classic detail-panel row style).
     * Defaults to `false`.
     */
    hoverable?: boolean;
    className?: string;
}
declare const InfoRow: React__default.FC<InfoRowProps>;

type SectionCardVariant = "glass" | "elevated" | "subtle" | "flat";
type SectionCardSize = "sm" | "md" | "lg";
interface SectionCardProps {
    /** Section heading displayed above the content area. */
    title: string;
    titleClassName?: string;
    actions?: React__default.ReactNode;
    /**
     * Visual treatment of the card container.
     * - `glass`    — frosted glass (default)
     * - `elevated` — white/dark surface with shadow
     * - `subtle`   — very light tinted background, no border
     * - `flat`     — no background or border; title + content only
     */
    variant?: SectionCardVariant;
    /** Body padding size. Defaults to 'md'. */
    size?: SectionCardSize;
    /** Blur the body content (e.g. to indicate unavailable data). */
    blur?: boolean;
    className?: string;
    bodyClassName?: string;
    children?: React__default.ReactNode;
}
declare const SectionCard: React__default.FC<SectionCardProps>;

interface PagedPanelProps extends PanelProps {
    /** One entry per page — rendered one at a time. */
    pages: React__default.ReactNode[];
    /**
     * Static title shown in the header, OR an array of per-page titles.
     * When an array is supplied its length should match `pages`.
     */
    title?: React__default.ReactNode | React__default.ReactNode[];
    /** Optional subtitle shown below the title (static). */
    subtitle?: React__default.ReactNode;
    /** Show a loading overlay over the whole panel. */
    error?: string | null;
    /**
     * When true, renders without the Panel wrapper (no border, background or
     * shadow). Use this when embedding PagedPanel inside an existing Panel.
     */
    bare?: boolean;
}
declare const PagedPanel: React__default.FC<PagedPanelProps>;

interface CollapsiblePanelProps extends Omit<PanelProps, "title" | "subtitle" | "actions" | "children" | "onToggle"> {
    title: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    actions?: React__default.ReactNode;
    defaultExpanded?: boolean;
    expanded?: boolean;
    onToggle?: (expanded: boolean) => void;
    minExpandedHeight?: number | string;
    children: React__default.ReactNode;
    contentClassName?: string;
    contentMaxHeight?: number;
    /** When true, the expanded content grows to fill available space instead of scrolling. */
    fillHeight?: boolean;
}
declare const CollapsiblePanel: React__default.FC<CollapsiblePanelProps>;

interface HeaderGroupProps {
    children: ReactNode;
    className?: string;
}
declare const HeaderGroup: React__default.FC<HeaderGroupProps>;

interface DetailItemCardProps {
    title: string;
    subtitle?: string;
    description?: string;
    badges?: ReactNode;
    children?: ReactNode;
    defaultExpanded?: boolean;
    onClick?: () => void;
    className?: string;
    badgesAlignment?: "bottom" | "right" | "bottom-end";
}
declare const DetailItemCard: React__default.FC<DetailItemCardProps>;

interface InfiniteScrollPanelProps<T> {
    items: T[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => Promise<void>;
    renderItem: (item: T, index: number) => React__default.ReactNode;
    loadingComponent?: React__default.ReactNode;
    emptyComponent?: React__default.ReactNode;
    className?: string;
    threshold?: number;
    debounceMs?: number;
    useFixedColumns?: boolean;
    minColumnWidthPx?: number;
    maxColumns?: number;
    columnTemplate?: string;
    masonry?: boolean;
}
declare function InfiniteScrollPanel<T>({ items, isLoading, hasMore, onLoadMore, renderItem, loadingComponent, emptyComponent, className, threshold, debounceMs, useFixedColumns, minColumnWidthPx, maxColumns, columnTemplate, masonry, }: InfiniteScrollPanelProps<T>): React__default.JSX.Element;
declare namespace InfiniteScrollPanel {
    var displayName: string;
}

interface CollapsibleHelpTextProps extends React__default.HTMLAttributes<HTMLDivElement> {
    title?: string;
    text: string;
    maxLength?: number;
    children?: React__default.ReactNode;
    showIcon?: boolean;
    icon?: string;
    tone?: ThemeColor;
    variant?: "card" | "plain";
    renderMarkdown?: (text: string) => React__default.ReactNode;
}
declare const CollapsibleHelpText: React__default.FC<CollapsibleHelpTextProps>;

interface UserAvatarUser {
    name?: string;
    username?: string;
    email?: string;
    avatarUrl?: string;
}
interface UserAvatarProps {
    user?: UserAvatarUser | null;
    size?: number;
    className?: string;
    variant?: "circle" | "rounded" | "square";
}
declare const UserAvatar: {
    ({ user, size, className, variant, }: UserAvatarProps): React$1.JSX.Element;
    displayName: string;
};

interface UseAccordionOptions {
    defaultOpenIds?: string[];
    openIds?: string[];
    multiple?: boolean;
    onChange?: (openIds: string[]) => void;
}
interface UseAccordionResult {
    openIds: string[];
    isOpen: (id: string) => boolean;
    toggle: (id: string) => void;
    open: (id: string) => void;
    close: (id: string) => void;
    setOpenIds: (ids: string[]) => void;
}
declare function useAccordion({ defaultOpenIds, openIds: controlledOpenIds, multiple, onChange, }?: UseAccordionOptions): UseAccordionResult;

type AccordionVariant = "default" | "bordered" | "minimal" | "tonal" | "ghost";
type AccordionSize = "sm" | "md" | "lg";
type AccordionIndicator = "chevron" | "plus-minus" | "caret" | "none";
type AccordionChevronPlacement = "left" | "right";
interface AccordionItem {
    id: string;
    title: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    description?: React__default.ReactNode;
    icon?: string | React__default.ReactElement;
    badge?: React__default.ReactNode;
    actions?: React__default.ReactNode;
    content: React__default.ReactNode;
    disabled?: boolean;
    loading?: boolean;
}
interface AccordionProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "onChange">, UseAccordionOptions {
    items: AccordionItem[];
    variant?: AccordionVariant;
    tone?: PanelTone;
    size?: AccordionSize;
    indicator?: AccordionIndicator;
    chevronPlacement?: AccordionChevronPlacement;
    divider?: boolean;
    animated?: boolean;
    transitionMs?: number;
    onItemToggle?: (id: string, isOpen: boolean) => void;
    iconClassName?: string;
    itemClassName?: string;
    headerClassName?: string;
    contentClassName?: string;
    ariaLabel?: string;
    loading?: boolean;
    loaderTitle?: React__default.ReactNode;
    loaderMessage?: React__default.ReactNode;
    loaderType?: LoaderProps["variant"];
    loaderProgress?: number;
    loaderColor?: LoaderProps["color"];
}
declare const Accordion: React__default.FC<AccordionProps>;

type TabsVariant = "underline" | "soft" | "pill" | "segmented" | "minimal";
type TabsSize = "sm" | "md" | "lg";
type TabsOrientation = "horizontal" | "vertical";
type TabsJustify = "start" | "center" | "end" | "between";
interface TabItemAction {
    id?: string;
    label?: ReactNode;
    /** Render a fully custom React node in the tab bar. When set, `icon` and `onClick` are ignored. */
    node?: ReactNode;
    icon?: string | React__default.ReactElement;
    onClick?: () => void;
    color?: ThemeColor;
    active?: boolean;
}
interface TabItem {
    id: string;
    label: ReactNode;
    icon?: string | React__default.ReactElement;
    description?: ReactNode;
    badge?: string | number;
    disabled?: boolean;
    panel?: ReactNode;
    badgeColor?: ThemeColor;
    actions?: TabItemAction[];
}
interface TabsProps {
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    onChange?: (id: string, item: TabItem) => void;
    variant?: TabsVariant;
    size?: TabsSize;
    color?: ThemeColor;
    orientation?: TabsOrientation;
    justify?: TabsJustify;
    fullWidth?: boolean;
    className?: string;
    listClassName?: string;
    allowReselect?: boolean;
    panelIdPrefix?: string;
    showDividers?: boolean;
    hideUnderlineContainer?: boolean;
    /** Override the variant's container class (e.g. to customise the underline border color). Takes precedence over hideUnderlineContainer. */
    containerClassName?: string;
    panelClassName?: string;
    /**
     * When true, renders a gradient fade at the top of each panel's scroll area so
     * content doesn't hard-clip against the tab bar when scrolled. Default: true.
     * Pass a Tailwind `from-*` colour to match your panel background (default: white / neutral-900 dark).
     */
    scrollFade?: boolean;
    scrollFadeFrom?: string;
}
declare const Tabs: React__default.FC<TabsProps>;

type ModalActionsAlign = "start" | "center" | "end" | "between";
interface ModalActionsProps {
    children: ReactNode;
    align?: ModalActionsAlign;
    className?: string;
}
declare const ModalActions: React__default.FC<ModalActionsProps>;
interface ModalProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    icon?: IconName | React__default.ReactElement;
    children: ReactNode;
    bodyHeader?: ReactNode;
    bodyClassName?: string;
    footer?: ReactNode;
    actions?: ReactNode;
    size?: ModalSize;
    maxWidth?: number | string;
    minWidth?: number | string;
    minHeight?: number | string;
    backgroundClassName?: string;
    background_color?: string;
    darkOverlay?: boolean;
    dark_overlay?: boolean;
    closeOnBackdropClick?: boolean;
    closeOnEsc?: boolean;
    preventScroll?: boolean;
    overlayClassName?: string;
    showFooterDivider?: boolean;
    headerActions?: ButtonProps[];
    header_actions?: ButtonProps[];
    headerTabs?: TabsProps;
    header_tabs?: TabsProps;
    loading?: boolean;
    loadingTitle?: ReactNode;
    loadingLabel?: ReactNode;
    hideCloseButton?: boolean;
    /** When provided, a back arrow button is shown on the left of the header. */
    onBack?: () => void;
    /** Tooltip for the back button. Defaults to "Go back". */
    backTooltip?: string;
    initialFocusRef?: React__default.RefObject<HTMLElement>;
    ariaLabel?: string;
    role?: "dialog" | "alertdialog";
}
declare const Modal: React__default.FC<ModalProps>;
interface ConfirmModalProps extends Omit<ModalProps, "footer" | "actions" | "children" | "onClose" | "title"> {
    title: ReactNode;
    children?: ReactNode;
    onClose: () => void;
    onConfirm: () => void;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    confirmVariant?: ButtonVariant;
    confirmColor?: ButtonColor;
    isConfirmDisabled?: boolean;
    confirmButtonProps?: ButtonProps;
    cancelButtonProps?: ButtonProps;
    description?: ReactNode;
}
declare const ConfirmModal: React__default.FC<ConfirmModalProps>;
interface DeleteConfirmModalProps extends Omit<ConfirmModalProps, "confirmLabel" | "confirmVariant" | "confirmColor"> {
    /** The exact string the user must type to enable the delete button. */
    confirmValue: string;
    /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
    confirmValueLabel?: string;
    confirmLabel?: ReactNode;
}
declare const DeleteConfirmModal: React__default.FC<DeleteConfirmModalProps>;
interface ApplyConfirmModalProps extends Omit<ConfirmModalProps, "confirmLabel" | "confirmVariant" | "confirmColor"> {
    /** The exact string the user must type to enable the apply button. */
    confirmValue: string;
    /** Human-readable label shown in the instruction, e.g. "key name". Default: "name" */
    confirmValueLabel?: string;
    confirmLabel?: ReactNode;
}
declare const ApplyConfirmModal: React__default.FC<ApplyConfirmModalProps>;
type ModalComponentType = typeof Modal & {
    Actions: typeof ModalActions;
    Confirm: typeof ConfirmModal;
    DeleteConfirm: typeof DeleteConfirmModal;
    ApplyConfirm: typeof ApplyConfirmModal;
};

declare const _default: ModalComponentType;

/** Where the panel is anchored inside its positioned ancestor. */
type InlinePanelAnchor = "top" | "bottom" | "center" | "fill";
interface InlinePanelProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "title" | "children"> {
    isOpen: boolean;
    onClose: () => void;
    title: ReactNode;
    description?: ReactNode;
    /** Icon name string or a React element rendered in the header. */
    icon?: IconName | React__default.ReactElement;
    children: ReactNode;
    bodyHeader?: ReactNode;
    bodyClassName?: string;
    /** Slot rendered in the footer bar (use alongside actions). */
    footer?: ReactNode;
    /** Alias for footer — matches Modal API. */
    actions?: ReactNode;
    /**
     * Width preset for the content card. Only meaningful when anchor is
     * "top" or "bottom". Ignored for "fill". Default: "md".
     */
    size?: ModalSize;
    maxWidth?: number | string;
    minWidth?: number | string;
    height?: number | string;
    maxHeight?: number | string;
    minHeight?: number | string;
    /**
     * "fill"   — covers the entire parent (absolute inset-0).
     * "top"    — slides in from the top edge.
     * "bottom" — slides up from the bottom edge.
     *
     * The parent element MUST have `position: relative` (or any non-static
     * position) for the overlay to clip correctly.
     *
     * @default "fill"
     */
    anchor?: InlinePanelAnchor;
    /** z-index of the panel relative to its positioned parent. @default 20 */
    zIndex?: number;
    /** Press Escape to close. @default true */
    closeOnEsc?: boolean;
    /**
     * Click the backdrop behind the panel card to close.
     * Only relevant when anchor is "top" or "bottom".
     * @default false  (more conservative than Modal — inline forms are higher-risk to dismiss accidentally)
     */
    closeOnBackdropClick?: boolean;
    /** Show a semi-transparent backdrop behind the card (top/bottom only). @default false */
    showBackdrop?: boolean;
    loading?: boolean;
    loadingTitle?: ReactNode;
    loadingLabel?: ReactNode;
    headerActions?: ButtonProps[];
    onBack?: () => void;
    backTooltip?: string;
    hideCloseButton?: boolean;
    showFooterDivider?: boolean;
    /** Ref to the element that should receive focus when the panel opens. */
    initialFocusRef?: React__default.RefObject<HTMLElement | null>;
    ariaLabel?: string;
    role?: "dialog" | "alertdialog";
}
declare const InlinePanel: React__default.FC<InlinePanelProps>;
interface ConfirmInlinePanelProps extends Omit<InlinePanelProps, "actions" | "footer" | "role" | "children"> {
    children?: ReactNode;
    onConfirm: () => void;
    confirmLabel?: ReactNode;
    cancelLabel?: ReactNode;
    confirmVariant?: ButtonVariant;
    confirmColor?: ButtonColor;
    isConfirmDisabled?: boolean;
}
declare const ConfirmInlinePanel: React__default.FC<ConfirmInlinePanelProps>;
interface DeleteConfirmInlinePanelProps extends Omit<ConfirmInlinePanelProps, "confirmLabel" | "confirmVariant" | "confirmColor"> {
    /** The exact string the user must type to enable the delete button. */
    confirmValue: string;
    /** Human-readable label shown in the instruction, e.g. "snapshot name". @default "name" */
    confirmValueLabel?: string;
    confirmLabel?: ReactNode;
}
declare const DeleteConfirmInlinePanel: React__default.FC<DeleteConfirmInlinePanelProps>;

interface SideMenuGuardClaim {
    type: "claim";
    claim: string;
}
interface SideMenuGuardAnyClaim {
    type: "anyClaim";
    claims: string[];
}
interface SideMenuGuardAllClaims {
    type: "allClaims";
    claims: string[];
}
interface SideMenuGuardRole {
    type: "role";
    role: string;
}
interface SideMenuGuardAnyRole {
    type: "anyRole";
    roles: string[];
}
interface SideMenuGuardModule {
    type: "module";
    module: string;
}
interface SideMenuGuardAnyModule {
    type: "anyModule";
    modules: string[];
}
interface SideMenuGuardCustom {
    type: "custom";
    fn: () => boolean;
}
type SideMenuItemGuard = SideMenuGuardClaim | SideMenuGuardAnyClaim | SideMenuGuardAllClaims | SideMenuGuardRole | SideMenuGuardAnyRole | SideMenuGuardModule | SideMenuGuardAnyModule | SideMenuGuardCustom;
interface SideMenuItemBase {
    /** When true, the item is not rendered in the menu */
    hidden?: boolean;
    slug: string;
    /** Guard rules — ALL must pass (AND logic). */
    guards?: SideMenuItemGuard[];
}
interface SideMenuSettings {
    /** When true, the menu is collapsed */
    collapsed?: boolean;
}
interface SideMenuItemLink extends SideMenuItemBase {
    color?: ThemeColor;
    type?: "link";
    label: string;
    path: string;
    icon?: IconName;
    groupName?: string;
    /** Optional badge rendered to the right of the label (e.g. active job count). */
    badge?: React__default.ReactNode;
}
interface SideMenuItemGroup extends SideMenuItemBase {
    type: "group";
    label: string;
    /** When true, renders a divider line immediately before the group header. */
    hasDivider?: boolean;
}
interface SideMenuItemDivider extends SideMenuItemBase {
    type: "divider";
    groupName?: string;
}
type SideMenuItem = SideMenuItemLink | SideMenuItemGroup | SideMenuItemDivider;
interface SideMenuProps {
    color?: ThemeColor;
    title?: string;
    /** Icon element shown in the logo area (always visible, collapsed or expanded) */
    logoIcon?: React__default.ReactNode;
    /** Text element shown next to the logoIcon when expanded */
    logoText?: React__default.ReactNode;
    items: SideMenuItem[];
    className?: string;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
    mobileOpen?: boolean;
    onCloseMobile?: () => void;
    /** When true, the desktop sidebar uses h-full instead of a fixed calc height. */
    fullHeight?: boolean;
    /** Called with item.guards; return true = show. Omit to show all. */
    guardEvaluator?: (guards: SideMenuItemGuard[]) => boolean;
    /**
     * Active module view filter (e.g. 'all' | 'host' | 'orchestrator').
     * When set to a non-'all' value, items whose module/anyModule guards reference
     * a module listed in `moduleViewOptions` must match this value to be shown.
     * Modules NOT in `moduleViewOptions` (e.g. 'reverse_proxy', 'api') are never
     * subject to the view filter and behave as before.
     * Items with no module guard are always shown.
     */
    activeModuleView?: string;
    /**
     * The set of module names that are treated as view-selectable
     * (e.g. ['host', 'orchestrator']). Only module guards whose value appears
     * in this list are subject to the activeModuleView filter.
     * Defaults to [] (no view filtering on any module).
     */
    moduleViewOptions?: readonly string[];
}
declare const SideMenu: ({ title, logoIcon, logoText, items, className, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, fullHeight, guardEvaluator, activeModuleView, moduleViewOptions, color, }: SideMenuProps) => React__default.JSX.Element;

interface SideMenuLayoutProps {
    /** Props passed to the SideMenu component (including color). */
    sideMenuProps: SideMenuProps;
    /** Content rendered in the fixed header bar at the top of the main area */
    header?: React__default.ReactNode;
    /** Main scrollable body content */
    children?: React__default.ReactNode;
    /** Additional class name for the root container */
    className?: string;
    /** Additional class name for the header section */
    headerClassName?: string;
    /** Additional class name for the scrollable body */
    bodyClassName?: string;
    /**
     * Per-item actions from the list/sidebar (e.g. edit/delete buttons for the active item).
     * Consumed by the header via `useSideMenuActions`.
     */
    sideItemActions?: React__default.ReactNode;
    /**
     * Actions from the detail/side panel (e.g. PageHeader action buttons).
     * Consumed by the header via `useSideMenuActions`.
     */
    sidePanelActions?: React__default.ReactNode;
}
declare const SideMenuLayout: ({ sideMenuProps, header, children, className, headerClassName, bodyClassName, sideItemActions, sidePanelActions, }: SideMenuLayoutProps) => React__default.JSX.Element;

type SplitViewSize = "sm" | "md" | "lg";
interface SplitViewItemBadge {
    label: React__default.ReactNode;
    tone?: ThemeColor;
    variant?: "solid" | "soft" | "outline";
}
interface SplitViewItem {
    id: string;
    /** Primary label */
    label: React__default.ReactNode;
    /** Secondary line shown below the label */
    subtitle?: React__default.ReactNode;
    /** Badges/pills rendered after the subtitle */
    badges?: SplitViewItemBadge[];
    /** Content to render in the detail pane when this item is selected */
    panel: React__default.ReactNode;
    /** Disable selection */
    disabled?: boolean;
    /** Hide the item entirely */
    hidden?: boolean;
    /** Optional icon rendered before the label */
    icon?: IconName;
    /** Action buttons shown on the right side of the item row (visible on hover) */
    actions?: React__default.ReactNode;
    /** Extra content rendered below the item row when it is the active selection */
    subContent?: React__default.ReactNode;
    tags?: string[];
    /** When true, renders the item with an intense accent background and a pulsing dot to signal new content */
    highlight?: boolean;
}
type SplitViewHeaderSlot<T> = T | ((activeItem: SplitViewItem) => T);
interface SplitViewHeaderDetails {
    title?: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    description?: React__default.ReactNode;
    /** Right-aligned tag/badge area. Accepts any React node(s). */
    tags?: React__default.ReactNode;
    /**
     * Custom body content rendered as the Panel children.
     * When provided, it overrides title/subtitle/description/tags content.
     */
    headerBody?: React__default.ReactNode;
    tone?: ThemeColor;
    variant?: PanelVariant;
    /** Alias for `variant` */
    variants?: PanelVariant;
    decoration?: PanelDecoration;
    /** Alias for `decoration` */
    decorations?: PanelDecoration;
    /** Optional divider between header row and details block (default: true). */
    bordered?: boolean;
    className?: string;
}
interface SplitViewPanelHeaderProps {
    /** Full icon node (left side) */
    icon?: SplitViewHeaderSlot<React__default.ReactNode>;
    /** Defaults to the active item's label when omitted */
    title?: SplitViewHeaderSlot<React__default.ReactNode>;
    subtitle?: SplitViewHeaderSlot<React__default.ReactNode>;
    /** Right side actions in the main row */
    actions?: SplitViewHeaderSlot<React__default.ReactNode>;
    /** Extra customizable content rendered between identity and search */
    body?: SplitViewHeaderSlot<React__default.ReactNode>;
    search?: SplitViewHeaderSlot<React__default.ReactNode>;
    searchWidth?: string;
    /** Second row, right-aligned actions */
    bottomActions?: SplitViewHeaderSlot<React__default.ReactNode>;
    /** Optional details block rendered below the header row and styled like a Panel. */
    headerDetails?: SplitViewHeaderSlot<SplitViewHeaderDetails | null | undefined>;
    /** Optional help button inserted after title */
    helper?: SplitViewHeaderSlot<HelpButtonProps | undefined>;
    border?: boolean;
    className?: string;
}
interface SplitViewProps {
    items: SplitViewItem[];
    /** Controlled selected id */
    value?: string;
    /** Uncontrolled default */
    defaultValue?: string;
    onChange?: (id: string, item: SplitViewItem) => void;
    /** Title shown above the item list (e.g. "LIBRARIES (3)") */
    listTitle?: React__default.ReactNode;
    /** Placeholder for the search input */
    searchPlaceholder?: string;
    /** Width of the list panel – Tailwind class (when not resizable) or initial px value for resizable */
    listWidth?: string;
    /** Accent color used for active item highlight */
    color?: ThemeColor;
    size?: SplitViewSize;
    /** Deprecated: one visible item is now always shown as detail-only (list hidden). */
    autoHideList?: boolean;
    /** Allow collapsing the list panel */
    collapsible?: boolean;
    /** Controlled collapsed state */
    collapsed?: boolean;
    /** Uncontrolled initial collapsed state */
    defaultCollapsed?: boolean;
    /** Callback when collapsed state changes */
    onCollapsedChange?: (collapsed: boolean) => void;
    /** Allow drag-to-resize the list panel */
    resizable?: boolean;
    /** Minimum list width in px when resizable (default: 180) */
    minListWidth?: number;
    /** Maximum list width in px when resizable (default: 50% of container) */
    maxListWidth?: number;
    /** Extra class for the root container */
    className?: string;
    /** Extra class for the list panel */
    listClassName?: string;
    /** Extra class for the detail panel */
    panelClassName?: string;
    /** Content rendered above the detail panel (header area) */
    panelHeader?: React__default.ReactNode | ((activeItem: SplitViewItem) => React__default.ReactNode);
    /**
     * Built-in SplitView header renderer (PageHeader-like) with support for dynamic slots.
     * When provided, this takes precedence over `panelHeader`.
     */
    panelHeaderProps?: SplitViewPanelHeaderProps | ((activeItem: SplitViewItem) => SplitViewPanelHeaderProps | null | undefined);
    /** Rendered when no items match the search filter in the list */
    emptyState?: React__default.ReactNode;
    /** Action buttons rendered in the list header row (e.g. an "Add" button) */
    listActions?: React__default.ReactNode;
    /** Content shown in the detail panel when no item is selected. Defaults to a generic EmptyState. Pass `null` to render nothing. */
    panelEmptyState?: React__default.ReactNode | null;
    /** When true, shows a loading state instead of the normal content */
    loading?: boolean;
    /** Custom loading content. Defaults to a centered Spinner with "Loading..." label. */
    loadingState?: React__default.ReactNode;
    /** When truthy, shows an error state instead of the normal content. Pass a string to use as the error subtitle. */
    error?: React__default.ReactNode;
    /** Custom error content. Defaults to a danger-toned EmptyState. */
    errorState?: React__default.ReactNode;
    /** Callback for the default error state's retry button */
    onRetry?: () => void;
    /** When true, renders a left border on the SplitView container to visually separate it from adjacent content (e.g. a side menu) */
    borderLeft?: boolean;
    /**
     * When true (default), the detail panel body scrolls automatically — panels can render
     * content of any height and the wrapper handles overflow.
     * When false, the panel body uses `overflow-hidden` so that panels which manage their
     * own internal scroll (e.g. a sticky-header + scrollable table layout) fill the space
     * correctly without a double-scroll or broken `h-full` percentage height.
     */
    panelScrollable?: boolean;
    /**
     * When true (default), clicking a list item immediately opens its detail panel —
     * the current behaviour.
     * When false, clicking a row only highlights it; the detail panel only opens when
     * the user explicitly clicks the expand (→) button on that row.
     */
    autoExpand?: boolean;
    /** Controlled expanded id (only meaningful when autoExpand=false) */
    expandedValue?: string;
    /** Callback fired when the expanded item changes (only when autoExpand=false) */
    onExpand?: (id: string, item: SplitViewItem) => void;
}
declare const SplitView: React__default.FC<SplitViewProps>;

interface SmartInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    globalParameters?: CapsuleBlueprintParameter[];
    serviceNames?: string[];
    context?: {
        slug?: string;
        enable_https?: boolean;
    };
    multiline?: boolean;
}
declare const SmartInput: React__default.FC<SmartInputProps>;

interface SmartValueProps {
    value: string;
    globalParameters?: CapsuleBlueprintParameter[];
    serviceNames?: string[];
    context?: {
        slug?: string;
        enable_https?: boolean;
    };
    className?: string;
}
declare const SmartValue: React__default.FC<SmartValueProps>;

interface StartupStage {
    id: string;
    label: string;
    title: string;
    status: StartupStageStatus;
    errorMessage?: string;
    errorType?: string;
    description?: string;
    statusMessage?: string;
    retryCount?: number;
    maxRetryCount?: number;
    progress?: {
        percentage: number;
        currentMessage?: string;
        details?: string;
    };
}
type StartupStageStatus = "pending" | "in-progress" | "has-error" | "is-ok";

type StartupStageStepperProps = {
    stages: StartupStage[];
    currentStageId?: string;
    className?: string;
    detailClassName?: string;
    onStageSelect?: (stage: StartupStage) => void;
    showHistoryToggle?: boolean;
    defaultShowHistory?: boolean;
    title?: string;
    variant?: "minimal" | "panel";
    size?: StartupStageStepperSize;
};
type StartupStageStepperSize = "sm" | "md" | "lg";
declare const StartupStageStepper: React__default.FC<StartupStageStepperProps>;

interface StatTileTrend {
    value: string | number;
    direction: "up" | "down" | "neutral";
    label?: string;
}
interface StatTileMeta {
    text: React__default.ReactNode;
    icon?: IconName;
    variant?: "text" | "badge";
    color?: ThemeColor;
}
interface StatTileError {
    icon?: IconName;
    message?: string;
    onRetry?: () => void;
}
interface StatTileProgress {
    value: number;
    label?: string;
    color?: ThemeColor;
}
interface StatTileProps {
    title?: React__default.ReactNode;
    value?: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    body?: React__default.ReactNode;
    icon?: IconName;
    color?: ThemeColor;
    trend?: StatTileTrend;
    progress?: StatTileProgress;
    meta?: StatTileMeta[];
    footer?: React__default.ReactNode;
    actions?: React__default.ReactNode;
    className?: string;
    onClick?: () => void;
    withDecoration?: boolean;
    withHoverEffect?: boolean;
    textColor?: ThemeColor;
    loading?: boolean;
    spinnerVariant?: "solid" | "segments";
    spinnerThickness?: "thin" | "normal" | "thick";
    spinnerColor?: ThemeColor;
    error?: StatTileError | null;
}
declare const StatTile: React__default.FC<StatTileProps>;

interface StatChartItem {
    label: string;
    value: number;
    /** Omit to auto-assign from the theme palette. */
    color?: ThemeColor;
    intensity?: string;
    onClick?: () => void;
}
interface StatChartDataset {
    id: string | number;
    label: string;
    centerLabel: string;
    items: StatChartItem[];
}
interface StatChartTileProps extends Omit<StatTileProps, "body" | "title" | "value" | "subtitle"> {
    data: StatChartDataset[];
}
declare const StatChartTile: React__default.FC<StatChartTileProps>;

interface StatCountTileBreakdown {
    label: string;
    value: string | number;
    color?: ThemeColor;
}
interface StatCountTileProps {
    title?: React__default.ReactNode;
    count?: React__default.ReactNode;
    breakdown?: StatCountTileBreakdown[];
    icon?: IconName;
    color?: ThemeColor;
    className?: string;
    onClick?: () => void;
    withDecoration?: boolean;
    withHoverEffect?: boolean;
    textColor?: ThemeColor;
    loading?: boolean;
    spinnerVariant?: "solid" | "segments";
    spinnerThickness?: "thin" | "normal" | "thick";
    spinnerColor?: ThemeColor;
    error?: {
        icon?: IconName;
        message?: string;
        onRetry?: () => void;
        variant?: "text" | "badge";
    } | null;
}
declare const StatCountTile: React__default.FC<StatCountTileProps>;

interface StatGoalItem {
    value: number;
    label: string;
    icon: IconName;
    /** Omit to auto-assign from the theme palette. */
    color?: ThemeColor;
    tooltip?: string;
}
interface StatGoalTileProps extends Omit<StatTileProps, "body" | "value" | "subtitle"> {
    goals: StatGoalItem[];
}
declare const StatGoalTile: React__default.FC<StatGoalTileProps>;

interface StatGraphSeries {
    key: string;
    label: string;
    /** Omit to auto-assign from the theme palette. */
    color?: ThemeColor;
}
interface StatGraphTileProps extends Omit<StatTileProps, "body" | "progress" | "trend" | "meta" | "footer"> {
    data: any[];
    variant: "bar" | "sparkline";
    series: StatGraphSeries[];
    height?: number;
    showLegend?: boolean;
    showAxes?: boolean;
    showGrid?: boolean;
    showTooltip?: boolean;
    /** Y-axis domain for sparkline. Defaults to [0, 'auto']. Use ['auto', 'auto'] for auto-scaling. */
    yDomain?: [number | string, number | string];
    /** Enable chart enter/update animation. Keep disabled for high-frequency realtime updates. */
    chartAnimation?: boolean;
    /** Animation duration when chartAnimation is enabled. */
    chartAnimationDuration?: number;
    /** Optional cap for rendered data points to reduce chart redraw work. */
    maxDataPoints?: number;
}
declare const StatGraphTile: React__default.FC<StatGraphTileProps>;

type StepStatus = "pending" | "active" | "completed" | "error";
interface StepperStep {
    id?: string;
    title: React__default.ReactNode;
    subtitle?: React__default.ReactNode;
    description?: React__default.ReactNode;
    content?: React__default.ReactNode;
    icon?: IconName | React__default.ReactElement;
    optionalLabel?: React__default.ReactNode;
    status?: StepStatus;
    disabled?: boolean;
}
type Step = StepperStep;
type StepperOrientation = "horizontal" | "vertical";
type StepperVariant = "card" | "minimal";
type StepperSize = "sm" | "md" | "lg";
type StepperConnector = "line" | "progress" | "none";
type StepperProgressBarPosition = "top" | "bottom";
type StepperConnectorAlign = "left" | "center" | "right";
interface StepperProps extends Omit<React__default.HTMLAttributes<HTMLDivElement>, "onChange"> {
    steps: StepperStep[];
    currentIndex?: number;
    currentStepId?: string;
    defaultCurrentIndex?: number;
    defaultCurrentStepId?: string;
    completedStepIds?: string[];
    orientation?: StepperOrientation;
    variant?: StepperVariant;
    size?: StepperSize;
    tone?: PanelTone;
    connector?: StepperConnector;
    interactive?: boolean;
    readOnly?: boolean;
    animated?: boolean;
    transitionMs?: number;
    showProgressSummary?: boolean;
    showProgressBar?: boolean;
    progressBarPosition?: "top" | "bottom";
    progressPrecision?: number;
    progressLabel?: React__default.ReactNode;
    onChange?: (index: number, stepId?: string) => void;
    onStepClick?: (step: StepperStep, index: number) => void;
    renderActions?: (step: StepperStep, index: number) => React__default.ReactNode;
    loaderStepIds?: string[];
    loading?: boolean;
    loaderTitle?: React__default.ReactNode;
    loaderMessage?: React__default.ReactNode;
    loaderType?: LoaderProps["variant"];
    loaderProgress?: number;
    loaderColor?: LoaderProps["color"];
    wrapperClassName?: string;
    headerClassName?: string;
    stepClassName?: string;
    contentClassName?: string;
    stepMaxHeight?: number | string;
    connectNodes?: boolean;
    connectorAlign?: StepperConnectorAlign;
    /** Override whether the underline bar is shown beneath each step's title/subtitle. When omitted the variant default is used (`card` → true, `minimal` → false). */
    showStepUnderline?: boolean;
}
declare const Stepper: React__default.FC<StepperProps>;

type SortDirection = "asc" | "desc";
interface TableSortState {
    columnId: string;
    direction: SortDirection;
}
interface TablePaginationState {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
}
/** Unified snapshot of all user-configurable table preferences. */
interface TableSettings {
    columnVisibility?: Record<string, boolean>;
    columnWidths?: Record<string, number>;
    activeView?: "table" | "panel";
    groupBy?: string | null;
    showGroupHeader?: boolean;
    stickyColumns?: Record<string, "left" | "right">;
}
type AccessorFn<T> = (row: T, index: number) => React__default.ReactNode;
interface TableColumn<T> {
    id: string;
    header: React__default.ReactNode;
    accessor?: keyof T | AccessorFn<T>;
    render?: (row: T, index: number) => React__default.ReactNode;
    /** Override the value used for sorting when render returns a non-primitive (e.g. an icon). */
    sortValue?: (row: T) => string | number;
    width?: string | number;
    minWidth?: string | number;
    maxWidth?: string | number;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    tooltip?: string;
    className?: string;
    headerClassName?: string;
    sticky?: "left" | "right";
    /** When true, this column is excluded from user preference menus (hide/show, group-by, sticky). */
    isActionsColumn?: boolean;
    /** When true, the column starts hidden by default but can still be enabled from the Columns menu. */
    defaultHidden?: boolean;
    /** When false, this column cannot be hidden via the column visibility toggle. Defaults to true. */
    hideable?: boolean;
    /** When false, this column will not appear in the group-by picker. Defaults to true. */
    groupable?: boolean;
    /** When false, this column cannot be resized even when `resizableColumns` is set on the table. Defaults to true. */
    resizable?: boolean;
    /**
     * Returns a plain string used as the group key and header label when this column is the active
     * group-by. Use this when `render` returns JSX (which would otherwise give "[object Object]").
     * Falls back to: accessor result → sortValue → render result (only if a primitive string/number).
     */
    groupValue?: (row: T) => string;
    /**
     * Background Tailwind class(es) applied to sticky cells so they remain opaque over scrolled
     * content. Defaults to `'bg-white dark:bg-neutral-900'`. Pass `'bg-transparent'` to let the
     * row/table background show through instead.
     */
    stickyBackground?: string;
    /**
     * Per-row variant of `stickyBackground`. When provided, takes precedence over `stickyBackground`
     * for the matching row. Return `undefined` to fall back to the static `stickyBackground`.
     */
    stickyBackgroundFn?: (row: T, index: number) => string | undefined;
}
type Column<T> = TableColumn<T>;
type TableVariant = "default" | "compact" | "minimal" | "bordered" | "flat";
interface TableProps<T> {
    columns?: TableColumn<T>[];
    data: T[];
    selectedItems?: T[];
    rowKey?: (row: T, index: number) => string | number;
    variant?: TableVariant;
    tone?: PanelTone;
    /** Theme color applied to action buttons, sort indicators, group dot, badges, and pagination. */
    color?: ThemeColor;
    striped?: boolean;
    noBorders?: boolean;
    hoverable?: boolean;
    stickyHeader?: boolean;
    /**
     * When true, the last column is pinned to the right edge and stays visible
     * while the other columns scroll horizontally. A left border separator is
     * added automatically to distinguish it from the scrolling content.
     */
    stickyActions?: boolean;
    loading?: boolean;
    loadingMessage?: string;
    loaderType?: "spinner" | "progress";
    loaderProgress?: number;
    emptyState?: React__default.ReactNode;
    sortState?: TableSortState;
    defaultSort?: TableSortState;
    onSortChange?: (sort: TableSortState | null) => void;
    headerActions?: React__default.ReactNode;
    footer?: React__default.ReactNode;
    pagination?: TablePaginationState;
    maxHeight?: string | number;
    onRowClick?: (row: T, index: number) => void;
    rowClassName?: (row: T, index: number) => string;
    /** When provided and returns true for a row, that row is rendered with an intense accent background and a pulsing left-border indicator to signal new/updated content. */
    rowHighlight?: (row: T, index: number) => boolean;
    className?: string;
    tableClassName?: string;
    bodyClassName?: string;
    style?: React__default.CSSProperties;
    fullHeight?: boolean;
    manualSorting?: boolean;
    /** When true, wraps the table in a rounded border regardless of the variant. */
    rounded?: boolean;
    /** Title shown in the header bar alongside headerActions / view toggle. Defaults to empty. */
    headerTitle?: string;
    /**
     * Initial column visibility map (`columnId → visible`).
     * Serialise with `JSON.stringify` to save; parse and pass back to restore.
     */
    columnVisibility?: Record<string, boolean>;
    /** Called whenever the user changes column visibility. Receives the full current config. */
    onColumnVisibilityChange?: (visibility: Record<string, boolean>) => void;
    /**
     * When true, shows the column visibility toggle button in the header bar.
     * Defaults to false — the icon is hidden unless this prop is explicitly set.
     */
    showColumnSelector?: boolean;
    /**
     * Enables drag-to-resize column headers. Each column can opt out via `column.resizable = false`.
     */
    resizableColumns?: boolean;
    /**
     * Initial column width map (`columnId → pixels`).
     * Serialise with `JSON.stringify` to save; parse and pass back to restore.
     */
    columnWidths?: Record<string, number>;
    /** Called when the user finishes resizing a column. Receives the full updated widths map. */
    onColumnWidthChange?: (widths: Record<string, number>) => void;
    /** Renders each row as a panel card. When provided alongside columns, a view toggle appears in the header. */
    panelItem?: (row: T, index: number) => React__default.ReactNode;
    /** Initial view when both columns and panelItem are provided. Defaults to "table". */
    defaultView?: "table" | "panel";
    /** Called whenever the user switches between table and panel view. */
    onViewChange?: (view: "table" | "panel") => void;
    /** CSS class(es) for the panel grid container. Defaults to a 1–3 column responsive grid. */
    panelGridClassName?: string;
    /**
     * Minimum width of each panel card. The grid uses CSS `auto-fill` to place
     * as many columns as fit the container — adapts to the parent width with no
     * hard breakpoints. Accepts a CSS length string ("280px", "20rem") or a
     * number treated as px. When set, takes precedence over the column layout in
     * `panelGridClassName` (extra classes from `panelGridClassName` still apply).
     */
    panelMinItemWidth?: string | number;
    /**
     * Gap between panel cards when `panelMinItemWidth` is set. Accepts a CSS
     * length string ("1rem", "16px") or a number treated as px. Defaults to
     * "1rem" (= `gap-4`). The value is applied via inline style so it cannot be
     * accidentally overridden by a conflicting Tailwind class.
     */
    panelGap?: string | number;
    /**
     * Maximum width of each panel card when `panelMinItemWidth` is set. Prevents cards from
     * growing too wide on large containers. Accepts a CSS length string ("480px", "30rem") or
     * a number treated as px. When omitted, cards stretch to fill available space (`1fr`).
     */
    panelMaxItemWidth?: string | number;
    /**
     * When provided, the panel view only renders the first row for each unique key value.
     * Use this when `data` is a flattened list but panels should show one card per logical entity.
     * Example: `panelDeduplicateBy={(row) => row.manifest.id}`
     */
    panelDeduplicateBy?: (row: T) => string | number;
    /**
     * Column id to group rows by (code-defined).
     * Always applied; the user cannot override this via the UI.
     */
    groupBy?: string;
    /**
     * When true, a grouping control is shown in the header letting the user
     * configure grouping at runtime. Only effective when `groupBy` is not set.
     */
    groupable?: boolean;
    /**
     * Initial user-configured group column id (uncontrolled).
     * Pass the persisted value here on mount to restore previous state.
     * Only used when `groupable` is true and `groupBy` is not set.
     */
    defaultGroupBy?: string;
    /** Whether to show a header row for each group value. Defaults to true. */
    showGroupHeader?: boolean;
    /** Whether groups start expanded. Defaults to true. */
    defaultGroupExpanded?: boolean;
    /** Called when the user changes the group column (null = no grouping). Use for persistence. */
    onGroupByChange?: (columnId: string | null) => void;
    /**
     * When true, a sticky-column picker is shown in the header bar letting the
     * user pin individual columns to the left or right at runtime.
     */
    userStickyColumns?: boolean;
    /**
     * Initial user-configured sticky map (`columnId → 'left' | 'right'`).
     * Pass the persisted value here on mount to restore previous state.
     */
    defaultStickyColumns?: Record<string, "left" | "right">;
    /** Called when the user changes column stickiness. Use for persistence. */
    onStickyColumnsChange?: (config: Record<string, "left" | "right">) => void;
    /**
     * Unified table settings snapshot. Fields here take precedence over the
     * individual initial-value props (`columnVisibility`, `columnWidths`,
     * `defaultView`, `defaultGroupBy`, `defaultStickyColumns`).
     * Pass a previously persisted value to restore all settings on mount.
     */
    tableSettings?: TableSettings;
    /**
     * Called whenever any user-configurable table setting changes (visibility,
     * widths, view, group-by, sticky columns). Use a single handler to persist
     * the full settings object instead of wiring up all individual callbacks.
     */
    onTableSettingsChange?: (settings: TableSettings) => void;
}
declare function Table<T>(props: TableProps<T>): React__default.ReactElement;

interface AccessMatrixPermission {
    group: string;
    resource: string;
    action: string;
    enabled: boolean;
}
interface AccessMatrixProps {
    permissions: AccessMatrixPermission[];
    /** Number of groups visible before the "Show more" button appears. Defaults to 5. */
    limit?: number;
    variant?: TableVariant;
    tone?: PanelTone;
    striped?: boolean;
    /** Forwards to Table: remove inner row borders/dividers. */
    noBorders?: boolean;
    /** Forwards to Table: make the table fill parent height and scroll internally. */
    fullHeight?: boolean;
    className?: string;
    hoverable?: boolean;
    /**
     * Background Tailwind class(es) applied to the sticky Resource column cells so they remain
     * opaque over scrolled action columns. Defaults to `'bg-white dark:bg-neutral-900'`.
     * Pass `'bg-transparent'` when the table sits inside a container whose background should
     * show through (e.g. a tinted panel or card).
     */
    stickyBackground?: string;
}
declare const AccessMatrix: React__default.FC<AccessMatrixProps>;

type SmartVariableType = "var" | "env";
type SmartVariableSource = "global" | "system" | "service";
interface SmartVariable {
    fullToken: string;
    type: SmartVariableType;
    source: SmartVariableSource;
    name: string;
    description?: string;
    defaultValue?: string;
}
declare const SYSTEM_VARIABLES: SmartVariable[];

interface VariablePickerProps {
    onSelect: (variable: SmartVariable) => void;
    onClose?: () => void;
    globalParameters: CapsuleBlueprintParameter[];
    serviceNames: string[];
}
declare const VariablePicker: React__default.FC<VariablePickerProps>;

interface KeyValuePair {
    key: string;
    value: string;
}
interface KeyValueArrayFieldProps {
    label: string;
    hint?: string;
    value: KeyValuePair[];
    onChange: (value: KeyValuePair[]) => void;
    error?: string;
    help?: string;
    isVisible?: boolean;
    addLabel?: string;
}
declare const KeyValueArrayField: React__default.FC<KeyValueArrayFieldProps>;

interface ApiErrorStateProps extends Omit<EmptyStateProps, "title" | "tone" | "icon" | "onAction" | "buttonText"> {
    onRetry?: () => void;
    title?: React__default.ReactNode;
    isError?: boolean;
    buttonText?: string;
}
declare const ApiErrorState: React__default.FC<ApiErrorStateProps>;

interface CustomIconProps {
    /** Name of the icon to display */
    icon: IconName;
    /** Alternative text for accessibility */
    alt?: string;
    /** Size of the icon in pixels */
    customSize?: number | string;
    /** Size of the icon: xs, sm, md, lg, xl */
    size?: IconSize;
    /** Additional CSS class names */
    className?: string;
    /** Click handler */
    onClick?: (e: React__default.MouseEvent<HTMLElement>) => void;
    /** Whether the icon should use color or be monochrome */
    colored?: boolean;
    /** Primary color to use for the icon */
    color?: string;
    /** Hover color for the icon */
    hoverColor?: string;
    /** @deprecated No longer used with component-based icons */
    forceSvg?: boolean;
}
declare const CustomIcon: React__default.FC<CustomIconProps>;

type DynamicValue = string | boolean;
interface DynamicFormFieldProps {
    parameter: CapsuleBlueprintParameter$1;
    value: DynamicValue;
    onChange: (serviceName: string, key: string, value: DynamicValue, triggerDependencyEvaluation?: boolean) => void;
    error?: string;
    className?: string;
    isVisible?: boolean;
}
declare const DynamicFormField: React__default.FC<DynamicFormFieldProps>;

type NotificationType = "success" | "error" | "warning" | "info";
interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: React__default.ReactNode;
    type?: NotificationType;
    actionLabel?: string;
    onAction?: () => void;
    secondaryActionLabel?: string;
    onSecondaryAction?: () => void;
}
declare const NotificationModal: React__default.FC<NotificationModalProps>;

type ToastType = "success" | "error" | "info" | "warning" | "loading";
interface ToastAction {
    label: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "danger";
    icon?: IconName;
    customIcon?: React__default.ReactNode;
    keepOpen?: boolean;
}
interface ToastProgress {
    percent: number;
    status: "running" | "paused" | "completed" | "error";
    indeterminate: boolean;
}
interface Toast {
    id: string;
    type: ToastType;
    message: string | React__default.ReactNode;
    duration?: number;
    description?: string;
    label?: string;
    icon?: IconName;
    details?: React__default.ReactNode;
    actions?: ToastAction[];
    channel?: string;
    timestamp: number;
    isRead?: boolean;
    updatedAt?: number;
    _updateTimestamp?: number;
    progress?: ToastProgress;
    autoClose?: boolean;
    autoCloseDuration?: number;
    dismissible?: boolean;
    showIcon?: boolean;
    _remove?: boolean;
}

interface SidePanelProps {
    /** Whether the panel is open */
    isOpen: boolean;
    /** Called when the user clicks the close button */
    onClose?: () => void;
    /** Panel title */
    title?: React__default.ReactNode;
    /** Secondary line rendered below the title */
    subtitle?: React__default.ReactNode;
    /** Width of the panel in px (default: 420) */
    width?: number;
    /** Optional icon rendered to the left of the title */
    icon?: React__default.ReactNode;
    /** Extra nodes rendered in the header next to the close button */
    headerActions?: React__default.ReactNode;
    /** Sticky footer rendered at the bottom of the panel */
    footer?: React__default.ReactNode;
    children?: React__default.ReactNode;
    className?: string;
    closeIconSize?: IconSize;
    /** Allow the user to drag the left edge to resize the panel. @default false */
    resizable?: boolean;
    /** Minimum width in px when resizable. @default 280 */
    minWidth?: number;
    /** Maximum width in px when resizable. @default 900 */
    maxWidth?: number;
    /** color for the resizer */
    color?: ThemeColor;
}
/**
 * SidePanel — slides in from the right as a fixed overlay.
 *
 * Because it uses `position: fixed` it never affects the page layout,
 * so no horizontal scrollbar artifacts occur during the animation.
 *
 * ```tsx
 * <SidePanel isOpen={open} onClose={() => setOpen(false)} title="Details">
 *   …detail content…
 * </SidePanel>
 * ```
 */
declare const SidePanel: React__default.FC<SidePanelProps>;

interface TimelinePanelAction {
    label: React__default.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    color?: ThemeColor;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
}
interface TimelinePanelOverflowItem {
    label: React__default.ReactNode;
    value: string;
    icon?: string | React__default.ReactElement;
    danger?: boolean;
    disabled?: boolean;
    onClick?: () => void;
}
interface TimelinePanelItem {
    id: string;
    /** Icon shown in a rounded box next to the content */
    icon?: React__default.ReactNode;
    /** draws a background for the icon */
    iconBackground?: boolean;
    /** Primary label */
    title: React__default.ReactNode;
    /** Secondary line (date, size, etc.) */
    subtitle?: React__default.ReactNode;
    /**
     * When true the item is rendered as a "current state" badge row instead of
     * a normal content row. The title becomes the badge text.
     */
    isCurrent?: boolean;
    /**
     * When true the dot on the timeline line is larger/filled — use for root or
     * first items to visually anchor the timeline.
     */
    isRoot?: boolean;
    /** Inline action buttons rendered on the right side. Pass a `React.ReactNode` for fully custom content, or a `TimelinePanelAction[]` for the built-in button layout. */
    actions?: TimelinePanelAction[] | React__default.ReactNode;
    /** Items for the overflow (⋮) dropdown menu */
    overflowActions?: TimelinePanelOverflowItem[];
    /**
     * Optional depth (0-based) for subtle left-indentation of content inside
     * each row. The dot and icon always stay on the left rail.
     */
    depth?: number;
}
interface TimelinePanelHeaderAction {
    label: React__default.ReactNode;
    onClick?: () => void;
    variant?: ButtonVariant;
    color?: ThemeColor;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    leadingIcon?: string | React__default.ReactElement;
}
interface TimelinePanelProps {
    /** Panel title rendered in the header */
    title?: React__default.ReactNode;
    /** Optional content rendered at the right of the header. Pass a `React.ReactNode` for fully custom content, or a `TimelinePanelHeaderAction` for the built-in button layout. */
    headerAction?: TimelinePanelHeaderAction | React__default.ReactNode;
    /** Timeline items */
    items: TimelinePanelItem[];
    variant?: PanelVariant;
    tone?: ThemeColor;
    padding?: PanelPadding;
    corner?: PanelCorner;
    /** Color of the connecting vertical line */
    lineColor?: string;
    /** Render a small dot on the trunk line at every item's midpoint (solid segment only). @default false */
    showTrunkDots?: boolean;
    loading?: boolean;
    /** Node to show when items is empty */
    emptyState?: React__default.ReactNode;
    className?: string;
    loaderProps?: LoaderProps;
}

declare const TimelinePanel: React__default.FC<TimelinePanelProps>;

type ConnectionState = "flowing" | "stopped" | "disabled";
interface ConnectionFlowConnectorConfig {
    /** Active flow state for this connector */
    state?: ConnectionState;
    /** Optional React element to render in the middle (e.g. an icon) */
    icon?: React__default.ReactNode;
    /** Width of the connector band in px (default: 56) */
    width?: number;
    /** Whether to animate the flowing dots (default: true) */
    animated?: boolean;
    /** target px per dot cycle (default: 60) */
    dotSpacing?: number;
    /** Connector ring border width (default: 'xs') */
    borderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    /** Whether to draw half-rings (default: true) */
    halfRing?: boolean;
    /** Show the horizontal line between rings (default: true) */
    showLine?: boolean;
    /** Override — force the source-side ring tone instead of inheriting from source item */
    sourceTone?: TreeTone;
    /** Override — force the target-side ring tone instead of inheriting from this item */
    targetTone?: TreeTone;
    /** Source ring background fill color (CSS string, e.g. '#22c55e' or 'rgba(...)') */
    sourceFill?: string;
    /** Source ring stroke/border color */
    sourceBorder?: string;
    /** Source ring center dot color */
    sourceDot?: string;
    /** Target ring background fill color */
    targetFill?: string;
    /** Target ring stroke/border color */
    targetBorder?: string;
    /** Target ring center dot color */
    targetDot?: string;
    /** Animated dot color (overrides what is derived from targetTone) */
    dotColor?: string;
    /**
     * When true, flowing dots are shown even when this connector's state is `'stopped'`
     * (i.e. already-traversed / completed edges also animate).
     * Default: false
     */
    animateCompleted?: boolean;
}
interface ConnectionFlowItem {
    id: string;
    icon?: React__default.ReactNode;
    iconClassName?: string;
    title?: React__default.ReactNode;
    titleClassName?: string;
    /** When true, the card title wraps on word boundaries up to 10 lines instead of truncating. Default: false */
    titleWrap?: boolean;
    /** When true, the card title stays on one line and scrolls horizontally. Default: false */
    titleScroll?: boolean;
    subtitle?: React__default.ReactNode;
    subtitleClassName?: string;
    description?: React__default.ReactNode;
    descriptionClassName?: string;
    /** Optional badge/status slot rendered below description, without tone-derived text styling. */
    badge?: React__default.ReactNode;
    tone?: TreeTone;
    body?: React__default.ReactNode;
    defaultExpanded?: boolean;
    actions?: React__default.ReactNode;
    hoverActions?: React__default.ReactNode;
    /**
     * Connector config for the edge leading INTO this item.
     * If not provided, inherits from the ConnectionFlow's default state.
     * Ignored for the first item (it has no predecessor).
     */
    connector?: ConnectionFlowConnectorConfig;
    /**
     * Children render vertically below this item's card using TreeView-style
     * SVG connectors. The connector between this item and the next sibling
     * spans the full column height (parent + children).
     */
    children?: ConnectionFlowItem[];
    /**
     * When true, this item has NO right-side connector to the next sibling
     * (it terminates the horizontal flow after itself).
     * Default: false
     */
    terminal?: boolean;
    /**
     * Active state — drives the vertical sub-tree dot animation color.
     * Default: false
     */
    active?: boolean;
    /**
     * When true, this item is part of a parallel group. Consecutive items with
     * parallel=true are rendered as a single vertical column instead of separate
     * horizontal nodes. Fan-out (1→N) and fan-in (N→1) connectors are added automatically.
     * Default: false
     */
    parallel?: boolean;
    /**
     * When true, the card shows a subtle hover lift effect (shadow + translate-y).
     * Default: false
     */
    hoverable?: boolean;
    /**
     * When true, overlays a pulsing background animation on the card (uses the item's tone).
     * Typically combined with `active: true` to indicate in-progress steps.
     * Default: false
     */
    activePulse?: boolean;
    /**
     * When true, this step was skipped — the execution flow bypassed it.
     * A visual bypass arc is drawn from the last non-skipped predecessor to the
     * first non-skipped successor, arching over all consecutive skipped items.
     * Default: false
     */
    skipped?: boolean;
}
interface ConnectionFlowProps {
    /** The nodes to render horizontally */
    items: ConnectionFlowItem[];
    /**
     * Fallback state applied to any connector that doesn't have its own `state`.
     * Default: 'flowing'
     */
    flowState?: ConnectionState;
    /**
     * Fallback icon shown in the middle of connectors (overridden per-item).
     */
    flowIcon?: React__default.ReactNode;
    /**
     * Fallback connector width in px.
     * Default: 56
     */
    connectorWidth?: number;
    /**
     * Whether flowing-dot animation is enabled globally.
     * Default: true
     */
    animated?: boolean;
    /**
     * Target px between dots globally.
     * Default: 60
     */
    dotSpacing?: number;
    /**
     * Ring border size globally.
     * Default: 'xs'
     */
    connectorBorderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    /**
     * Draw half-rings (matching TreeView half-connector style).
     * Default: true
     */
    connectorHalf?: boolean;
    /**
     * Show the horizontal line between connectors.
     * Default: true
     */
    showLine?: boolean;
    /** Indent size for children sub-trees. Default: 'xs' */
    childIndent?: "xs" | "sm" | "md" | "lg";
    /** Row gap in px between children. Default: 8 */
    childRowGap?: number;
    /**
     * If true, allows the flow to scroll horizontally/vertically if the container is smaller than the flow.
     * Default: false
     */
    allowScroll?: boolean;
    /**
     * Set a fixed width for all items in the flow (e.g. 250, '300px').
     * Primarily useful when `allowScroll` is enabled.
     */
    itemWidth?: number | string;
    /**
     * When true, automatically scales the entire flow down to fit the container width.
     * Once the scale would go below `minScale`, the flow is clamped and allowed to scroll.
     * Default: false
     */
    autoScale?: boolean;
    /**
     * Minimum CSS scale factor applied when `autoScale` is true.
     * Below this value the flow falls back to horizontal scroll instead of shrinking further.
     * Default: 0.55
     */
    minScale?: number;
    className?: string;
    /** Extra content to render to the right of the entire flow (e.g. an expand toggle) */
    rightAction?: React__default.ReactNode;
    /**
     * When true, connectors stretch to fill all remaining width instead of using a fixed
     * pixel size. Card columns collapse to their natural content width. The connector icon
     * is always positioned at the exact midpoint of the expanded connector.
     * Default: false
     */
    fullWidthConnectors?: boolean;
    /**
     * When true, all cards in the flow show a hover lift effect.
     * Default: false
     */
    hoverable?: boolean;
    /**
     * When true, flowing dots are rendered on `'stopped'` (completed / already-traversed)
     * connectors in addition to `'flowing'` ones. Bypass arcs over skipped steps always
     * animate when `animated` is true, regardless of this flag.
     * Default: false
     */
    animateCompleted?: boolean;
    /**
     * When true, the engine automatically manages connector states and skipped detection
     * based purely on each item's `tone`:
     *
     * - **Connector state** (when no explicit `connector.state` is set):
     *   - Non-neutral source tone → `'stopped'` (solid toned line — step was traversed)
     *   - Neutral source tone     → `'disabled'` (dashed gray  — step not yet reached)
     *
     * - **Skipped detection**: a neutral-tone item that has at least one non-neutral
     *   successor is automatically treated as skipped — a bypass arc is drawn over it.
     *
     * Explicit per-item `connector.state` or `item.skipped` values always take precedence.
     * Default: false
     */
    autoConnectorState?: boolean;
}

declare const ConnectionFlow: React__default.FC<ConnectionFlowProps>;

interface ConnectionFlowConnectorProps {
    state?: ConnectionState;
    sourceTone?: TreeTone;
    targetTone?: TreeTone;
    middleIcon?: React__default.ReactNode;
    width?: number;
    halfRing?: boolean;
    showLine?: boolean;
    animated?: boolean;
    dotSpacing?: number;
    borderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    sourceFill?: string;
    sourceBorder?: string;
    sourceDot?: string;
    targetFill?: string;
    targetBorder?: string;
    targetDot?: string;
    dotColor?: string;
    /**
     * Multi-source mode: Y offsets from the TOP of the connector space for each
     * source card's centre (parent first, then children).
     * When provided and length > 1, a vertical trunk is drawn on the left side
     * connecting all source rings, and each source gets its own dotted line to
     * the RIGHT entry ring.
     */
    leftAnchors?: number[];
    /**
     * Total height the connector should occupy.
     * Defaults to the source column height; pass max(source, target) when heights differ.
     */
    connectorHeight?: number;
    /**
     * Y offset of the TARGET card's centre from the top of the connector space.
     * When different from the source anchor, a bezier curve is drawn between the
     * two ring positions instead of a straight horizontal line.
     * Defaults to the source anchor (straight line).
     */
    rightAnchorY?: number;
    /**
     * Tones for extra source rings (index 0 = parent, already set via sourceTone).
     * Used to colour child source rings independently.
     */
    extraSourceTones?: TreeTone[];
    /**
     * Fan-out mode: Y offsets from the TOP of the connector space for each TARGET card's centre.
     * When provided and length > 1, a vertical trunk is drawn on the RIGHT side
     * connecting all target rings, and each target gets its own dotted line from the LEFT entry ring.
     */
    rightAnchors?: number[];
    /**
     * Tones for each right-side ring in fan-out mode.
     * Index i corresponds to rightAnchors[i]. Falls back to targetTone.
     */
    rightAnchorTones?: TreeTone[];
    /**
     * Per-lane active state for fan-out mode.
     * Index i corresponds to rightAnchors[i]. When provided, each lane's animation is
     * controlled independently. Falls back to the overall `state`.
     */
    rightAnchorStates?: ConnectionState[];
    /**
     * When true, flowing dots are shown even when `state` is `'stopped'`
     * (already-traversed / completed connectors also animate).
     * Default: false
     */
    animateCompleted?: boolean;
    /**
     * When true, the connector stretches to fill available flex space instead of using a
     * fixed pixel width. The SVG geometry is recalculated from the measured container width
     * so rings stay at correct positions and the middle icon stays at the exact midpoint.
     * Default: false
     */
    fullWidth?: boolean;
}
declare const ConnectionFlowConnector: React__default.FC<ConnectionFlowConnectorProps>;

interface ColumnGeometry {
    /** Total rendered height of the whole column (parent + gap + all children). */
    totalHeight: number;
    /**
     * Y offsets (from the TOP of the column) to the centre of each source card.
     * anchors[0] = parent card, anchors[1..] = child cards (or parallel items).
     */
    anchors: number[];
    /** True when this geometry represents a parallel group (not a single-item column). */
    isParallelGroup?: boolean;
}
interface ConnectionFlowColumnProps {
    item: ConnectionFlowItem;
    globalTone?: TreeTone;
    childIndent?: "xs" | "sm" | "md" | "lg";
    childRowGap?: number;
    animated?: boolean;
    showLine?: boolean;
    connectorHalf?: boolean;
    connectorBorderSize?: "fit" | "xs" | "sm" | "md" | "lg";
    dotSpacing?: number;
    itemWidth?: number | string;
    /** Reports geometry so ConnectionFlow can build a multi-source connector. */
    onGeometryChange?: (geo: ColumnGeometry) => void;
    /** When true, forces all child branches to animate (mirrors parent connection state). */
    flowActive?: boolean;
    /** When true, cards show a hover lift effect. */
    hoverable?: boolean;
}
declare const ConnectionFlowColumn: React__default.FC<ConnectionFlowColumnProps>;

interface ConnectionFlowParallelGroupProps {
    items: ConnectionFlowItem[];
    globalTone?: TreeTone;
    itemWidth?: number | string;
    hoverable?: boolean;
    onGeometryChange?: (geo: ColumnGeometry) => void;
}
declare const ConnectionFlowParallelGroup: React__default.FC<ConnectionFlowParallelGroupProps>;

declare const TreeView: React__default.FC<TreeViewProps>;

declare const TreeItemCard: React__default.FC<TreeItemCardProps>;

declare const INDENT_PX: Record<"xs" | "sm" | "md" | "lg", number>;
declare const TreeFlowSvg: React__default.FC<TreeFlowSvgProps>;

interface TreeColorTokens {
    bg: string;
    pulseBg: string;
    border: string;
    headerText: string;
    labelText: string;
    trunk: readonly [string, string];
    connFill: readonly [string, string];
    connBorder: readonly [string, string];
    connDot: readonly [string, string];
}
declare const NEUTRAL_TOKENS: TreeColorTokens;
declare function getTreeColorTokens(tone: ThemeColor | undefined): TreeColorTokens;

interface IconContextValue {
    renderIcon: IconRenderer$1;
}
declare const IconContext: React__default.Context<IconContextValue>;
interface IconProviderProps {
    renderIcon: IconRenderer$1;
    children: ReactNode;
}
/**
 * Provider for customizing icon rendering in ui-kit components.
 * Wrap your app with this provider to supply a custom icon renderer.
 */
declare const IconProvider: React__default.FC<IconProviderProps>;
/**
 * Hook to access the icon renderer from context
 */
declare const useIconRenderer: () => IconRenderer$1;

interface SideMenuActionsContextValue {
    /** Per-item / list actions (e.g. "Add" button in the list panel header). */
    sideItemActions?: React__default.ReactNode;
    /** Detail panel actions (e.g. PageHeader action buttons). */
    sidePanelActions?: React__default.ReactNode;
    /** Push new list/item actions into the header. Pass `undefined` to clear. */
    setSideItemActions: (actions: React__default.ReactNode | undefined) => void;
    /** Push new panel actions into the header. Pass `undefined` to clear. */
    setSidePanelActions: (actions: React__default.ReactNode | undefined) => void;
}
interface SideMenuActionsProviderProps {
    initialSideItemActions?: React__default.ReactNode;
    initialSidePanelActions?: React__default.ReactNode;
    children: React__default.ReactNode;
}
declare const SideMenuActionsProvider: React__default.FC<SideMenuActionsProviderProps>;
declare const useSideMenuActions: () => SideMenuActionsContextValue;

interface BottomSheetControls {
    dismiss: () => void;
}
type BottomSheetRenderable = ReactNode | ((controls: BottomSheetControls) => ReactNode);
interface BottomSheetOptions {
    id?: string;
    title?: ReactNode;
    description?: ReactNode;
    content?: BottomSheetRenderable;
    actions?: BottomSheetRenderable;
    showCloseButton?: boolean;
    backdropDismiss?: boolean;
    className?: string;
    onClose?: () => void;
}
interface BottomSheetContextValue {
    presentSheet: (options: BottomSheetOptions) => void;
    dismissSheet: () => void;
    isOpen: boolean;
    currentSheet: BottomSheetOptions | null;
}

declare const BottomSheetProvider: React__default.FC<{
    children: React__default.ReactNode;
}>;
declare const useBottomSheet: () => BottomSheetContextValue;

interface UseResizableOptions {
    /** Initial width in pixels */
    initialWidth: number;
    /** Minimum width in pixels */
    minWidth?: number;
    /** Maximum width in pixels (or function returning max) */
    maxWidth?: number | (() => number);
    /** Called on every resize frame */
    onResize?: (width: number) => void;
    /** Called when drag ends */
    onResizeEnd?: (width: number) => void;
    /** Whether resizing is enabled */
    enabled?: boolean;
}
interface UseResizableReturn {
    /** Current width in pixels */
    width: number;
    /** Whether the user is currently dragging */
    isDragging: boolean;
    /** Props to spread onto the resize handle element */
    handleProps: {
        onPointerDown: (e: React.PointerEvent) => void;
        onKeyDown: (e: React.KeyboardEvent) => void;
        role: "separator";
        "aria-orientation": "vertical";
        "aria-valuenow": number;
        "aria-valuemin": number;
        "aria-valuemax": number;
        tabIndex: number;
    };
}
declare function useResizable({ initialWidth, minWidth, maxWidth: maxWidthOpt, onResize, onResizeEnd, enabled, }: UseResizableOptions): UseResizableReturn;

interface StepperState<TStep extends {
    id?: string;
}> {
    steps: TStep[];
    currentIndex: number;
    currentStepId?: string;
    progressPercent: number;
    goToIndex: (index: number) => void;
    goToStep: (id: string) => void;
    goToNext: () => void;
    goToPrev: () => void;
    isActive: (id: string, index: number) => boolean;
    isCompleted: (id: string, index: number) => boolean;
}
interface UseStepperOptions {
    defaultCurrentIndex?: number;
    defaultCurrentStepId?: string;
    currentIndex?: number;
    currentStepId?: string;
    onChange?: (index: number, stepId?: string) => void;
    completedStepIds?: string[];
}
declare function useStepper<TStep extends {
    id?: string;
}>(steps: TStep[], { defaultCurrentIndex, defaultCurrentStepId, currentIndex, currentStepId, onChange, completedStepIds, }?: UseStepperOptions): StepperState<TStep>;

type ThemeMode = "light" | "dark" | "system";
/**
 * Hook for managing the demo app's color theme.
 *
 * Modes:
 *  - `"system"` — follow OS `prefers-color-scheme` (reactive).
 *  - `"light"`  — force light.
 *  - `"dark"`   — force dark.
 *
 * The hook applies `class="dark"` to `<html>` which, combined with the
 * `@custom-variant dark (&:where(.dark, .dark *))` directive in
 * `demo/src/index.css`, cascades dark-mode styles to all `.dark:` descendants.
 * Persists the choice in `localStorage` and re-applies on OS preference
 * changes when in `system` mode.
 *
 * First visit defaults to `"light"`.
 */
declare function useTheme(): {
    theme: ThemeMode;
    effectiveTheme: "dark" | "light";
    setTheme: React$1.Dispatch<React$1.SetStateAction<ThemeMode>>;
};

declare const widthTokenRegex: RegExp;
declare const heightTokenRegex: RegExp;
declare const mergeClassTokens: (...groups: Array<string | undefined>) => string;
declare const hasExplicitSize: (value?: string) => boolean;

/**
 * Utility functions for handling focus events with intelligent reconnection logic
 */
interface FocusHandlerOptions {
    debounceMs?: number;
    checkConnection?: () => boolean;
    onReconnect?: () => void;
    onSkip?: () => void;
}
/**
 * Creates a debounced focus handler that only triggers reconnection when necessary
 * @param options Configuration options for the focus handler
 * @returns A function that can be used as an event listener
 */
declare function createIntelligentFocusHandler(options?: FocusHandlerOptions): () => void;
/**
 * Cleanup function for focus handlers
 * @param handler The focus handler function
 * @param timeoutRef Reference to the timeout
 */
declare function cleanupFocusHandler(handler: () => void, timeoutRef: ReturnType<typeof setTimeout> | null): void;
/**
 * Hook for managing focus events with intelligent reconnection
 * @param options Configuration options
 * @returns Cleanup function
 */
declare function useIntelligentFocusHandler(options?: FocusHandlerOptions): () => void;

declare function toBoolean(value: string | undefined): boolean;
declare function normalizeString(subject: string): string;
declare function normalizeStringToUpper(name: string): string;
declare function isDevelopment(environment: string): boolean;
declare function formatDate(iso?: string | null): string;
declare function formatLogTime(iso: string): string;
declare function formatMB(mb?: number): string;

/**
 * Duration formatting utilities.
 * All functions operate on whole minutes as the base unit.
 */
interface FormatDurationOptions {
    /**
     * Maximum number of unit parts to include in the output.
     * e.g. maxParts=2 → "1 day and 5 hours" (minutes dropped)
     * Defaults to 3.
     */
    maxParts?: number;
    /**
     * String to return when the input is zero or negative.
     * Defaults to "0 minutes".
     */
    zeroLabel?: string;
}
/**
 * Converts a number of minutes into a human-readable duration string.
 *
 * @example
 * formatDuration(1)            // "1 minute"
 * formatDuration(45)           // "45 minutes"
 * formatDuration(60)           // "1 hour"
 * formatDuration(85)           // "1 hour and 25 minutes"
 * formatDuration(1440)         // "1 day"
 * formatDuration(1525)         // "1 day and 25 minutes"
 * formatDuration(1860)         // "1 day and 7 hours"      (maxParts=2 default trims minutes)
 * formatDuration(7785)         // "5 days, 9 hours and 45 minutes"
 * formatDuration(46080)        // "1 month and 2 days"
 * formatDuration(530985)       // "1 year, 1 month and 2 days"
 * formatDuration(0)            // "0 minutes"
 * formatDuration(-5)           // "0 minutes"
 */
declare function formatDuration(totalMinutes: number, options?: FormatDurationOptions): string;
/**
 * Like `formatDuration` but accepts seconds instead of minutes.
 * Values under 60 seconds are shown as "less than a minute" by default.
 */
declare function formatDurationFromSeconds(totalSeconds: number, options?: FormatDurationOptions & {
    subMinuteLabel?: string;
}): string;
/**
 * Like `formatDuration` but accepts milliseconds instead of minutes.
 * Values under 60 000 ms are shown as "less than a minute" by default.
 */
declare function formatDurationFromMs(totalMs: number, options?: FormatDurationOptions & {
    subMinuteLabel?: string;
}): string;

/**
 * Byte / data-size formatting utilities.
 *
 * All functions that accept a unit parameter use `DataSizeUnit` which maps
 * directly to the `action_value_unit` field returned by the API.
 */
type DataSizeUnit = "B" | "KB" | "MB" | "GB" | "TB";
/**
 * Normalize a raw unit string from the API (e.g. `"bytes"`, `"MB"`, `"Gigabytes"`)
 * to a canonical `DataSizeUnit`. Falls back to `'B'` for unknown values.
 */
declare function normalizeDataSizeUnit(raw: string | undefined): DataSizeUnit;
/**
 * Pick the largest unit in which `referenceBytes` is >= 1.
 * Falls back to 'B' when the value is 0 or less.
 */
declare function pickBestUnit(referenceBytes: number): DataSizeUnit;
/**
 * Format a raw byte value using the given display unit, up to `decimals`
 * significant decimal places (trailing zeros are stripped).
 */
declare function formatBytesAs(bytes: number, unit: DataSizeUnit, decimals?: number): string;
/**
 * Format `value` and `total` — both expressed in `inputUnit` — using the
 * same human-friendly display unit derived from `total`.
 *
 * @example
 * // total = 1.5 GB → picks GB
 * formatProgressBytes(0.45, 1.5, 'GB')
 * // → { valueLabel: '0.45', totalLabel: '1.5', unit: 'GB', line: '0.45 / 1.5 GB' }
 *
 * // total = 1_500_000_000 bytes → picks GB
 * formatProgressBytes(450_000_000, 1_500_000_000, 'B')
 * // → { valueLabel: '0.42', totalLabel: '1.4', unit: 'GB', line: '0.42 / 1.4 GB' }
 */
declare function formatProgressBytes(value: number, total: number, inputUnit?: DataSizeUnit, decimals?: number): {
    valueLabel: string;
    totalLabel: string;
    unit: DataSizeUnit;
    line: string;
};
/**
 * Format a single byte value to the most appropriate unit, with up to
 * `decimals` decimal places.
 *
 * @example
 * formatBytes(1_500_000)   // "1.43 MB"
 * formatBytes(2_684_354_560) // "2.5 GB"
 */
declare function formatBytes(bytes: number, decimals?: number): string;

declare const renderIcon: IconRenderer$1;

interface DependencyCondition {
    field_name: string;
    field_value: string;
    operator: string;
    condition?: "and" | "or";
}
interface FileUploadData {
    files: File | File[];
    names: string;
    count: number;
}
interface FormData {
    [key: string]: string | boolean | Array<{
        key: string;
        value: string;
    }> | string[] | FileUploadData;
}
/**
 * Evaluates if a field should be visible based on its dependencies
 * @param fieldName - The name of the field being evaluated
 * @param dependencies - Array of dependency conditions
 * @param formData - Current form data
 * @returns boolean indicating if the field should be visible
 */
declare function evaluateFieldVisibility(_fieldName: string, dependencies: DependencyCondition[], formData: FormData): boolean;
/**
 * Evaluates visibility for all fields in a form
 * @param parameters - Array of parameters with dependencies
 * @param formData - Current form data
 * @returns Object mapping field names to visibility states
 */
declare function evaluateAllFieldVisibility(parameters: Array<{
    key: string;
    dependencies?: DependencyCondition[];
}>, formData: FormData): Record<string, boolean>;

/**
 * Returns a Gravatar URL for the given email.
 *
 * @param email - The user's email address.
 * @param size  - Image size in pixels (default 200).
 * @param defaultImage - Gravatar fallback when no image exists.
 *   Common values: `'404'` (return HTTP 404), `'mp'` (mystery-person silhouette),
 *   `'identicon'` (geometric pattern), `'retro'` (8-bit style).
 *   Defaults to `'mp'` so a valid image is always returned.
 */
declare const getGravatarUrl: (email: string, size?: number, defaultImage?: string) => string;

declare function getToastTimestamp(toast: Toast): number;

declare const SMART_VAR_REGEX: RegExp;
declare const parseSmartVariable: (token: string) => SmartVariable | null;
declare const createSmartToken: (type: SmartVariableType, source: SmartVariableSource, name: string) => string;
/**
 * Extracts all unique variables from a given text string.
 */
declare const extractVariables: (text: string) => SmartVariable[];

interface VariableContext {
    globalParameters?: CapsuleBlueprintParameter[];
    serviceNames?: string[];
    context?: {
        slug?: string;
        enable_https?: boolean;
    };
}
declare const resolveVariable: (value: string, ctx: VariableContext) => {
    value: string;
    isResolved: boolean;
    isRuntime: boolean;
};

interface MetricBarProps extends React__default.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string;
    percentage: number;
    color?: SpinnerColor;
    showShimmer?: boolean;
}
declare const MetricBar: React__default.FC<MetricBarProps>;

declare const Sun: React$1.ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & React$1.RefAttributes<SVGSVGElement>>;

declare const Moon: React$1.ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & React$1.RefAttributes<SVGSVGElement>>;

declare const ThemeAuto: React$1.ForwardRefExoticComponent<Omit<SVGProps<SVGSVGElement>, "ref"> & React$1.RefAttributes<SVGSVGElement>>;

export { AccessMatrix, type AccessMatrixPermission, type AccessMatrixProps, Accordion, type AccordionItem, type AccordionProps, Alert, type AlertProps, type AlertVariant, ApiErrorState, type ApiErrorStateProps, AppDivider, type AppDividerProps, ApplyConfirmModal, type ApplyConfirmModalProps, Badge, BadgeIcon, type BadgeIconProps, type BadgeProps, type BaseIconName, BottomSheetProvider, ButtonColor, ButtonProps, ButtonSelector, type ButtonSelectorMode, type ButtonSelectorOption, type ButtonSelectorProps, ButtonSize, ButtonVariant, CapsuleBlueprintParameter, Checkbox, type CheckboxProps, CollapsibleHelpText, type CollapsibleHelpTextProps, CollapsiblePanel, type CollapsiblePanelProps, type Column, Combobox, type ComboboxProps, ConfirmInlinePanel, type ConfirmInlinePanelProps, ConfirmModal, ConnectionFlow, ConnectionFlowColumn, ConnectionFlowConnector, type ConnectionFlowConnectorConfig, type ConnectionFlowItem, ConnectionFlowParallelGroup, type ConnectionFlowProps, type ConnectionState, CustomIcon, type CustomIconProps, type DataSizeUnit, DeleteConfirmInlinePanel, type DeleteConfirmInlinePanelProps, DeleteConfirmModal, type DeleteConfirmModalProps, type DependencyCondition, DetailItemCard, type DetailItemCardProps, DropdownButton, type DropdownButtonOption, type DropdownButtonProps, DropdownMenu, type DropdownMenuOption, type DropdownMenuProps, DynamicFormField, type DynamicFormFieldProps, DynamicImg, type DynamicImgProps, EmptyState, type EmptyStateProps, type EmptyStateTone, type FileUploadData, type FocusHandlerOptions, type FormData, FormField, type FormFieldProps, FormLayout, type FormLayoutProps, FormSection, type FormSectionProps, type FormatDurationOptions, HeaderGroup, type HeaderGroupProps, Hero, type HeroPadding, type HeroProps, type HeroSubtitleSize, type HeroTitleSize, IconButton, type IconButtonProps, IconContext, IconName, IconProvider, type IconProviderProps, type IconRenderer$1 as IconRenderer, type IconSize, InfiniteScrollPanel, type InfiniteScrollPanelProps, InfoRow, type InfoRowPadding, type InfoRowProps, type InfoRowSize, InlinePanel, type InlinePanelAnchor, type InlinePanelProps, Input, InputGroup, type InputGroupProps, type InputProps, type InputVariant, KeyValueArrayField, type KeyValueArrayFieldProps, type KeyValuePair, Loader, type LoaderProps, MetricBar, type MetricBarProps, _default as Modal, ModalActions, type ModalProps, ModalSize, Moon, MultiProgressBar, type MultiProgressBarProps, type MultiProgressBarSeries, MultiSelectPills, type MultiSelectPillsProps, MultiToggle, type MultiToggleOption, type MultiToggleProps, type MultiToggleVariant, NotificationModal, type NotificationModalProps, type NotificationType, PagedPanel, type PagedPanelProps, Panel, type PanelDecoration, type PanelProps, type PanelTone, PasswordInput, type PasswordInputProps, Picker, type PickerFilter, type PickerItem, type PickerProps, type PickerTag, Pill, type PillProps, Progress, type ProgressMotion, type ProgressMotionDirection, type ProgressMotionSpeed, type ProgressProps, type RandomThemeColorValue, SMART_VAR_REGEX, SYSTEM_VARIABLES, SearchBar, type SearchBarProps, Section, SectionCard, type SectionCardProps, type SectionCardSize, type SectionCardVariant, type SectionProps, type SectionSize, type SectionVariant, Select, type SelectProps, SideMenu, type SideMenuActionsContextValue, SideMenuActionsProvider, type SideMenuActionsProviderProps, type SideMenuGuardAllClaims, type SideMenuGuardAnyClaim, type SideMenuGuardAnyModule, type SideMenuGuardAnyRole, type SideMenuGuardClaim, type SideMenuGuardCustom, type SideMenuGuardModule, type SideMenuGuardRole, type SideMenuItem, type SideMenuItemGuard, SideMenuLayout, type SideMenuLayoutProps, type SideMenuProps, type SideMenuSettings, SidePanel, type SidePanelProps, SmartInput, type SmartInputProps, SmartValue, type SmartValueProps, type SmartVariable, type SmartVariableSource, type SmartVariableType, Spinner, type SpinnerColor, type SpinnerProps, type SpinnerSize, type SpinnerVariant, SplitView, type SplitViewHeaderDetails, type SplitViewHeaderSlot, type SplitViewItem, type SplitViewItemBadge, type SplitViewPanelHeaderProps, type SplitViewProps, type SplitViewSize, type StartupStage, type StartupStageStatus, StartupStageStepper, type StartupStageStepperProps, type StatChartDataset, type StatChartItem, StatChartTile, type StatChartTileProps, StatCountTile, type StatCountTileBreakdown, type StatCountTileProps, type StatGoalItem, StatGoalTile, type StatGoalTileProps, type StatGraphSeries, StatGraphTile, type StatGraphTileProps, StatTile, type StatTileProps, StatusSpinner, type StatusSpinnerIntent, type StatusSpinnerProps, type Step, type StepStatus, Stepper, type StepperConnector, type StepperConnectorAlign, type StepperOrientation, type StepperProgressBarPosition, type StepperProps, type StepperSize, type StepperState, type StepperVariant, Sun, INDENT_PX as TREE_INDENT_PX, NEUTRAL_TOKENS as TREE_NEUTRAL_TOKENS, type TabItem, type TabItemAction, Table, type TableColumn, type TablePaginationState, type TableProps, type TableSettings, type TableSortState, type TableVariant, Tabs, type TabsProps, TagPanel, type TagPanelProps, type TagPanelTag, TagPicker, type TagPickerItem, type TagPickerProps, Textarea, type TextareaProps, ThemeAuto, ThemeColor, type ThemeMode, ThemeSize, TimelinePanel, type TimelinePanelAction, type PanelCorner as TimelinePanelCorner, type TimelinePanelHeaderAction, type TimelinePanelItem, type TimelinePanelOverflowItem, type PanelPadding as TimelinePanelPadding, type TimelinePanelProps, type PanelVariant as TimelinePanelVariant, type Toast, type ToastAction, type ToastProgress, type ToastType, Toggle, type ToggleProps, TooltipPosition, TooltipWrapper, type TooltipWrapperProps, TreeFlowSvg, type TreeFlowSvgProps, TreeItemCard, type TreeItemCardProps, type TreeItemData, type TreeReorderEvent, type TreeTone, TreeView, type TreeViewProps, TruncatedText, type TruncatedTextProps, type UseAccordionOptions, type UseAccordionResult, type UseResizableOptions, type UseResizableReturn, type UseStepperOptions, UserAvatar, type UserAvatarProps, type UserAvatarUser, VariablePicker, cleanupFocusHandler, createIntelligentFocusHandler, createSmartToken, defaultIconRenderer, evaluateAllFieldVisibility, evaluateFieldVisibility, extractVariables, formatBytes, formatBytesAs, formatDate, formatDuration, formatDurationFromMs, formatDurationFromSeconds, formatLogTime, formatMB, formatProgressBytes, getColorPalette, getColorPaletteNames, getGravatarUrl, getRandomThemeColorClass, getRandomThemeColorValue, getToastTimestamp, getTreeColorTokens, hasExplicitSize, heightTokenRegex, iconAccentActive, iconAccentHover, iconAccentRing, isDevelopment, mergeClassTokens, normalizeDataSizeUnit, normalizeString, normalizeStringToUpper, parseSmartVariable, pickBestUnit, renderIcon, resolveVariable, toBoolean, useAccordion, useBottomSheet, useIconRenderer, useIntelligentFocusHandler, useResizable, useSideMenuActions, useStepper, useTheme, widthTokenRegex };
