import React__default, { ButtonHTMLAttributes, ReactNode } from 'react';

type TooltipPosition = "top" | "bottom";
interface TooltipProps {
    /** Text shown in the tooltip. When omitted the component renders children as-is. */
    text?: string;
    /** How long to wait (ms) before showing the tooltip. Defaults to 500. */
    delay?: number;
    /** Where to place the tooltip relative to the trigger. Defaults to 'top'. */
    position?: TooltipPosition;
    /** Extra classes applied to the outer wrapper element. */
    wrapperClassName?: string;
    children: React__default.ReactNode;
}
declare const Tooltip: React__default.FC<TooltipProps>;

type ButtonColor = ThemeColor;
type ButtonVariant = "solid" | "soft" | "outline" | "ghost" | "link" | "clear" | "icon";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";
type ButtonWeight = "normal" | "medium" | "semibold" | "bold";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    color?: ThemeColor;
    size?: ButtonSize;
    weight?: ButtonWeight;
    fullWidth?: boolean;
    leadingIcon?: string | React__default.ReactElement;
    trailingIcon?: string | React__default.ReactElement;
    loading?: boolean;
    iconOnly?: boolean;
    accent?: boolean;
    accentColor?: ThemeColor;
    /** When true, renders in a persistent lighter "on" state with hover suppressed. accentColor overrides the active color. */
    active?: boolean;
    className?: string;
    children?: ReactNode;
    /** When set, a styled tooltip is shown on hover. */
    tooltip?: string;
    /** Position of the tooltip relative to the button. Defaults to 'top'. */
    tooltipPosition?: TooltipPosition;
}
declare const Button: React__default.ForwardRefExoticComponent<ButtonProps & React__default.RefAttributes<HTMLButtonElement>>;

type ThemeMultiColor = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "rose" | "slate" | "gray" | "zinc" | "neutral" | "stone";
type ThemeColor = "red" | "orange" | "amber" | "yellow" | "lime" | "green" | "emerald" | "teal" | "cyan" | "sky" | "blue" | "indigo" | "violet" | "purple" | "fuchsia" | "pink" | "rose" | "slate" | "gray" | "zinc" | "neutral" | "stone" | "white" | "brand" | "info" | "success" | "warning" | "danger" | "theme" | "parallels";
type ThemeSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "2xl" | "3xl" | "full";
type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "xxxl" | "2xl" | "3xl" | "full";
type ButtonTheme = Record<ButtonVariant, Record<ThemeColor, string>>;
type ButtonHoverTheme = Record<ButtonVariant, Record<ThemeColor, string>>;
type ButtonActiveTheme = Record<ButtonVariant, Record<ThemeColor, string>>;
type ButtonActiveHoverTheme = Record<ButtonVariant, Record<ThemeColor, string>>;
type ToggleTheme = Record<ThemeColor, string>;
type CheckboxTheme = Record<ThemeColor, string>;
type SpinnerTheme = Record<ThemeColor, [string, string, string, string]>;
type LoaderTheme = Record<ThemeColor, {
    track: string;
    bar: string;
}>;
type MultiToggleTheme = Record<ThemeColor, {
    active: string;
    activeText: string;
    indicator: string;
    hover: string;
}>;
type MultiToggleVariantTokens = {
    softIndicator: string;
    activeText: string;
    hover: string;
};
type MultiToggleVariantTheme = Record<ThemeColor, MultiToggleVariantTokens>;
type TabsColorTokens = {
    hoverText: string;
    activeText: string;
    onAccentText: string;
    focusRing: string;
    accentBg: string;
    subtleBg: string;
    subtleHoverBg: string;
    segmentedContainer: string;
    badgeSubtle: string;
    badgeStrong: string;
    badgeOnAccent: string;
    underlineActive: string;
};
type TabsTheme = Record<ThemeColor, TabsColorTokens>;
type PanelToneConfig = {
    border: string;
    heading: string;
    muted: string;
    badge: string;
    subtleBg: string;
    tonalBg: string;
    glassBg: string;
    glassBorder: string;
    liquidBg: string;
    liquidBorder: string;
    liquidShadow: string;
    liquidHeading: string;
    overlayGradient: string;
    decorationShape: string;
    decorationGradient: string;
};
type PanelTheme = Record<ThemeColor, PanelToneConfig>;
type StepperToneConfig = {
    activeBg: string;
    activeText: string;
    completedBg: string;
    completedText: string;
    pendingBorder: string;
    pendingText: string;
    underlineBase: string;
};
type StepperTheme = Record<ThemeColor, StepperToneConfig>;
type BadgeTheme = Record<ThemeColor, string>;
type PillTheme = Record<ThemeColor, Record<"solid" | "soft" | "outline", {
    base: string;
    border?: string;
}>>;
type AlertTheme = Record<ThemeColor, {
    subtle: string;
    solid: string;
    outline: string;
    icon: string;
    text: string;
    border: string;
    dismiss: string;
}>;
type StatTileTheme = Record<ThemeColor, {
    decorationBg: string;
    iconColor: string;
    divider: string;
}>;
type ButtonSelectorColorTokens = {
    selectedBorder: string;
    selectedBg: string;
    selectedIcon: string;
    selectedLabel: string;
    selectedIndicatorBg: string;
    selectedIndicatorBorder: string;
    selectedIndicatorDot: string;
};
type ButtonSelectorTheme = Record<ThemeColor, ButtonSelectorColorTokens>;
interface ThemeDefinition {
    button: ButtonTheme;
    buttonHover: ButtonHoverTheme;
    buttonActive: ButtonActiveTheme;
    buttonActiveHover: ButtonActiveHoverTheme;
    toggle: ToggleTheme;
    checkbox: CheckboxTheme;
    spinner: SpinnerTheme;
    loader: LoaderTheme;
    multiToggle: MultiToggleTheme;
    multiToggleVariant: MultiToggleVariantTheme;
    tabs: TabsTheme;
    panel: PanelTheme;
    stepper: StepperTheme;
    badge: BadgeTheme;
    pill: PillTheme;
    alert: AlertTheme;
    statTile: StatTileTheme;
    buttonSelector: ButtonSelectorTheme;
}
declare const resolveColor: (color: ThemeColor) => string;
type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};
declare const configureTheme: (overrides: DeepPartial<ThemeDefinition>) => void;
declare const resetTheme: () => void;
declare const getButtonColorClasses: (variant: ButtonVariant, color: ThemeColor) => string;
declare const getButtonHoverClasses: (variant: ButtonVariant, color: ThemeColor) => string;
declare const getButtonActiveClasses: (variant: ButtonVariant, color: ThemeColor) => string;
declare const getButtonActiveHoverClasses: (variant: ButtonVariant, color: ThemeColor) => string;
declare const getButtonBaseClasses: (variant: ButtonVariant, color: ThemeColor) => string;
declare const getToggleColorClasses: (color: ThemeColor) => string;
declare const getCheckboxColorClasses: (color: ThemeColor) => string;
declare const getSpinnerColorTokens: (color: ThemeColor) => [string, string, string, string];
declare const getLoaderProgressColors: (color: ThemeColor) => {
    track: string;
    bar: string;
};
declare const getMultiToggleColorTokens: (color: ThemeColor) => {
    active: string;
    activeText: string;
    indicator: string;
    hover: string;
};
declare const getMultiToggleVariantTokens: (color: ThemeColor) => MultiToggleVariantTokens;
declare const getTabsColorTokens: (color: ThemeColor) => TabsColorTokens;
declare const getPanelToneStyles: (tone: ThemeColor) => PanelToneConfig;
declare const getStepperTonePalette: (tone: ThemeColor) => StepperToneConfig;
declare const getBadgeColorClasses: (color: ThemeColor) => string;
declare const getPillColorClasses: (color: ThemeColor, variant: "solid" | "soft" | "outline") => {
    base: string;
    border?: string;
};
declare const getAlertColorClasses: (color: ThemeColor) => AlertTheme[ThemeColor];
declare const getStatTileColorClasses: (color: ThemeColor) => StatTileTheme[ThemeColor];

type IconName = "Add" | "ArrowDown" | "ArrowLeft" | "ArrowRight" | "ArrowUp" | "Attached" | "Attachment" | "Back" | "Blueprint" | "Bug" | "Chat" | "CheckCircle" | "ChevronLeft" | "ChevronRight" | "Clean" | "Close" | "Close1" | "CloudOff" | "Cog" | "Complete" | "Container" | "CopyClipboard" | "Dashboard" | "Details" | "Docker copy" | "Docker" | "Dots" | "Download" | "Edit" | "Equal" | "Error" | "Export" | "EyeClosed" | "EyeOpen" | "Globe" | "Help" | "Idea" | "Image" | "Info" | "Key" | "LXC-Old" | "LXC" | "Log" | "Moon" | "Notification" | "Official" | "Offline" | "OpenApp" | "Parameter" | "Pause" | "Praise" | "ReportFeedback" | "Reset" | "Restart" | "Rocket" | "Run" | "Save" | "Scale" | "Script" | "Search" | "Send" | "Settings" | "Shop" | "Star" | "Stop" | "Sun" | "Suspend" | "ThemeAuto" | "ThemeDark" | "ThemeLight" | "Trash" | "UX" | "User" | "Users" | "Verified" | "ViewGrid" | "ViewRows" | "Library" | "Host" | "VirtualMachine" | "Role" | "Roles" | "Cache" | "Claim" | "Claims" | "KeyManagement" | "Windows" | "Ubuntu" | "Debian" | "Apple" | "KaliLinux" | "RedHat" | "Fedora" | "CentOS" | "Clone" | "Copy" | "Live" | "HealthCheck" | "ReverseProxy" | "ReverseProxyCORS" | "ReverseProxyRoutes" | "ReverseProxyFrom" | "ReverseProxyHeadersRequest" | "ReverseProxyHeadersResponse" | "ReverseProxyHTTP" | "ReverseProxyTo" | "ReverseProxyTLS" | "ReverseProxyTCP" | "Refresh" | "Calendar" | "Folder" | "Jobs" | "Warning" | "Artifactory" | "Azure" | "Minio" | "Aws" | "Orchestrator" | "Podman" | "PodmanDesktop" | "Group" | "Pin" | "Database" | "RemoteHost" | "Login" | "Logout" | "Snapshot" | "Revert" | "CleanBrush" | "Pull" | "Push" | "CatalogVersion" | "File" | "Revoke" | "Taint" | "Unlock" | "Check" | "ArrowChevronLeft" | "ArrowChevronRight" | "Drag";
declare const iconRegistry: Record<IconName, React__default.ForwardRefExoticComponent<React__default.SVGProps<SVGSVGElement>>>;

type HelpButtonPlacement = "top" | "bottom" | "left" | "right" | "auto";
interface HelpButtonProps {
    /**
     * Help content to display in the panel.
     * Pass a `string` to render as Markdown (tables and URLs supported).
     * Pass a `ReactNode` to render arbitrary JSX directly.
     */
    content: string | React__default.ReactNode;
    /** Optional title shown in the panel header. Defaults to "Help". */
    title?: React__default.ReactNode;
    /**
     * Preferred placement of the floating panel relative to the trigger button.
     * "auto" (default) picks the side with the most available space.
     */
    placement?: HelpButtonPlacement;
    /** Accent color for the trigger button and the panel header stripe. */
    color?: ThemeColor;
    /** Size of the trigger icon button. */
    size?: "xs" | "sm" | "md" | "lg";
    /** Icon for the trigger button. Defaults to "Help". */
    icon?: IconName;
    /** Maximum width of the floating panel in px. Defaults to 360. */
    maxWidth?: number;
    /** Extra class applied to the root wrapper. */
    className?: string;
}
declare const HelpButton: React__default.FC<HelpButtonProps>;

declare enum CapsuleBlueprintValueType {
    String = "string",
    Int = "int",
    Boolean = "boolean",
    Select = "select",
    List = "list",
    Map = "map"
}
interface CapsuleBlueprintParameter {
    name: string;
    key: string;
    description?: string;
    type?: string;
    value_type?: CapsuleBlueprintValueType;
    default?: any;
    required?: boolean;
    is_required?: boolean;
    is_secret?: boolean;
    options?: any;
    hint?: string;
    help?: string;
    service_name?: string;
    depends_on?: string[];
    [key: string]: any;
}

export { getStepperTonePalette as A, type ButtonVariant as B, type CapsuleBlueprintParameter as C, getTabsColorTokens as D, getToggleColorClasses as E, iconRegistry as F, resetTheme as G, type HelpButtonProps as H, type IconName as I, resolveColor as J, HelpButton as K, type ModalSize as M, type ThemeColor as T, type ButtonColor as a, type ButtonSize as b, type TooltipPosition as c, type ThemeSize as d, type ButtonProps as e, Button as f, CapsuleBlueprintValueType as g, type ThemeMultiColor as h, Tooltip as i, type TooltipProps as j, configureTheme as k, getAlertColorClasses as l, getBadgeColorClasses as m, getButtonActiveClasses as n, getButtonActiveHoverClasses as o, getButtonBaseClasses as p, getButtonColorClasses as q, getButtonHoverClasses as r, getCheckboxColorClasses as s, getLoaderProgressColors as t, getMultiToggleColorTokens as u, getMultiToggleVariantTokens as v, getPanelToneStyles as w, getPillColorClasses as x, getSpinnerColorTokens as y, getStatTileColorClasses as z };
