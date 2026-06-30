// src/components/MarkdownEditor.tsx
import React67, { useMemo as useMemo30, useState as useState53, useRef as useRef34 } from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import classNames67 from "classnames";

// src/components/VariablePicker.tsx
import { useMemo as useMemo29, useState as useState52 } from "react";

// src/components/Alert.tsx
import React2 from "react";
import classNames from "classnames";

// src/contexts/IconContext.tsx
import { createContext, useContext } from "react";

// src/types/Icon.ts
var defaultIconRenderer = (icon, _size, _className) => {
  if (!icon) return null;
  if (typeof icon === "string") {
    return null;
  }
  return icon;
};

// src/contexts/IconContext.tsx
import { jsx } from "react/jsx-runtime";
var IconContext = createContext({
  renderIcon: defaultIconRenderer
});
var useIconRenderer = () => {
  const context = useContext(IconContext);
  return context.renderIcon;
};

// src/theme/Theme.ts
var colors = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "white",
  "brand",
  "info",
  "success",
  "warning",
  "danger",
  "theme",
  "parallels"
];
var resolveColor = (color) => {
  switch (color) {
    case "brand":
      return "blue";
    case "info":
      return "sky";
    case "success":
      return "emerald";
    case "warning":
      return "amber";
    case "danger":
      return "rose";
    case "theme":
      return "neutral";
    case "parallels":
      return "red";
    default:
      return color;
  }
};
var createTheme = () => {
  const empty = () => ({});
  const theme = {
    button: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty()
    },
    buttonHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty()
    },
    buttonActive: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty()
    },
    buttonActiveHover: {
      solid: empty(),
      soft: empty(),
      outline: empty(),
      ghost: empty(),
      link: empty(),
      clear: empty(),
      icon: empty()
    },
    toggle: {},
    checkbox: {},
    spinner: {},
    loader: {},
    multiToggle: {},
    multiToggleVariant: {},
    tabs: {},
    panel: {},
    stepper: {},
    badge: {},
    pill: {},
    alert: {},
    statTile: {},
    buttonSelector: {}
  };
  colors.forEach((color) => {
    const c = resolveColor(color);
    const isWhite = color === "white";
    const isTheme = color === "theme";
    if (isWhite) {
      theme.button.solid[color] = "bg-white text-slate-900 shadow-sm hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700";
      theme.button.soft[color] = "bg-white/80 text-slate-800 ring-1 ring-inset ring-slate-200 hover:bg-white focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 dark:bg-white/10 dark:text-white dark:ring-white/20";
      theme.button.outline[color] = "border border-white/60 text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 dark:border-white/20 dark:text-white";
      theme.button.ghost[color] = "text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 dark:text-white/90";
      theme.button.link[color] = "text-white hover:text-white/80 hover:underline dark:text-white";
      theme.button.clear[color] = "text-white hover:text-white/80 dark:text-white";
      theme.button.icon[color] = "text-white bg-white/20 hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 dark:text-white";
    } else if (isTheme) {
      theme.button.solid[color] = "bg-white text-neutral-800 border border-neutral-200 shadow-sm hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus-visible:ring-neutral-500";
      theme.button.soft[color] = "bg-theme-background text-theme-foreground ring-1 ring-inset ring-theme-border hover:bg-theme-muted focus-visible:ring-2 focus-visible:ring-theme-secondary focus-visible:ring-offset-2 dark:bg-theme-surface dark:text-theme-foreground dark:ring-theme-border/60";
      theme.button.outline[color] = "border border-theme-border text-theme-foreground hover:bg-theme-muted focus-visible:ring-2 focus-visible:ring-theme-secondary focus-visible:ring-offset-2 dark:border-theme-border/80 dark:text-theme-foreground dark:hover:bg-theme-surface";
      theme.button.ghost[color] = "text-theme-foreground hover:bg-theme-muted focus-visible:ring-2 focus-visible:ring-theme-secondary focus-visible:ring-offset-2 dark:text-theme-foreground dark:hover:bg-theme-surface/80";
      theme.button.link[color] = "text-theme-foreground hover:text-theme-primary hover:underline";
      theme.button.clear[color] = "text-theme-foreground hover:text-theme-primary";
      theme.button.icon[color] = "text-theme-foreground bg-theme-muted hover:bg-theme-muted/80 focus-visible:ring-2 focus-visible:ring-theme-secondary focus-visible:ring-offset-2 dark:bg-theme-surface dark:text-theme-foreground";
    } else {
      theme.button.solid[color] = `bg-${c}-500 text-white shadow-sm hover:bg-${c}-400 focus-visible:ring-2 focus-visible:ring-${c}-500 focus-visible:ring-offset-2 dark:bg-${c}-400 dark:hover:bg-${c}-300`;
      theme.button.soft[color] = `bg-${c}-50 text-${c}-600 ring-1 ring-inset ring-${c}-200 hover:bg-${c}-100 focus-visible:ring-2 focus-visible:ring-${c}-400 focus-visible:ring-offset-2 dark:bg-${c}-500/10 dark:text-${c}-200 dark:ring-${c}-500/40`;
      theme.button.outline[color] = `border border-${c}-200 text-${c}-600 hover:bg-${c}-200 focus-visible:ring-2 focus-visible:ring-${c}-400 focus-visible:ring-offset-2 dark:border-${c}-500/50 dark:text-${c}-200 dark:hover:bg-${c}-500/10`;
      theme.button.ghost[color] = `text-${c}-600 hover:bg-${c}-100 focus-visible:ring-2 focus-visible:ring-${c}-400 focus-visible:ring-offset-2 dark:text-${c}-200 dark:hover:bg-${c}-500/5`;
      theme.button.link[color] = `text-${c}-600 hover:text-${c}-500 hover:underline dark:text-${c}-200`;
      theme.button.clear[color] = `text-${c}-600 hover:text-${c}-500 dark:text-${c}-200`;
      theme.button.icon[color] = `text-${c}-600 bg-${c}-50 hover:bg-${c}-100 focus-visible:ring-2 focus-visible:ring-${c}-400 focus-visible:ring-offset-2 dark:text-${c}-200 dark:bg-${c}-500/10 dark:hover:bg-${c}-500/20`;
    }
    if (isWhite) {
      theme.buttonHover.solid[color] = "hover:bg-slate-50 dark:hover:bg-slate-700";
      theme.buttonHover.soft[color] = "hover:bg-white";
      theme.buttonHover.outline[color] = "hover:bg-white/10";
      theme.buttonHover.ghost[color] = "hover:bg-white/10";
      theme.buttonHover.link[color] = "hover:text-white/80 hover:underline";
      theme.buttonHover.clear[color] = "hover:text-white/80";
      theme.buttonHover.icon[color] = "hover:bg-white/30";
    } else if (isTheme) {
      theme.buttonHover.solid[color] = "hover:bg-neutral-50 dark:hover:bg-neutral-700";
      theme.buttonHover.soft[color] = "hover:bg-theme-muted";
      theme.buttonHover.outline[color] = "hover:bg-theme-muted dark:hover:bg-theme-surface";
      theme.buttonHover.ghost[color] = "hover:bg-theme-muted dark:hover:bg-theme-surface/80";
      theme.buttonHover.link[color] = "hover:text-theme-primary hover:underline";
      theme.buttonHover.clear[color] = "hover:text-theme-primary";
      theme.buttonHover.icon[color] = "hover:bg-theme-muted/80";
    } else {
      theme.buttonHover.solid[color] = `hover:bg-${c}-400 dark:hover:bg-${c}-300`;
      theme.buttonHover.soft[color] = `hover:bg-${c}-100`;
      theme.buttonHover.outline[color] = `hover:bg-${c}-50 dark:hover:bg-${c}-500/10`;
      theme.buttonHover.ghost[color] = `hover:bg-${c}-100 dark:hover:bg-${c}-500/5`;
      theme.buttonHover.link[color] = `hover:text-${c}-500 hover:underline`;
      theme.buttonHover.clear[color] = `hover:text-${c}-500`;
      theme.buttonHover.icon[color] = `hover:bg-${c}-100 dark:hover:bg-${c}-500/20`;
    }
    if (isWhite) {
      theme.buttonActive.solid[color] = "bg-slate-100 text-slate-700 shadow-sm";
      theme.buttonActive.soft[color] = "bg-white text-slate-700 ring-1 ring-inset ring-slate-300";
      theme.buttonActive.outline[color] = "border border-white/80 bg-white/20 text-white";
      theme.buttonActive.ghost[color] = "bg-white/20 text-white";
      theme.buttonActive.link[color] = "text-white/70 underline";
      theme.buttonActive.clear[color] = "text-white/70";
      theme.buttonActive.icon[color] = "bg-white/30 text-white";
    } else if (isTheme) {
      theme.buttonActive.solid[color] = "bg-neutral-100 text-neutral-700 border border-neutral-300 shadow-sm dark:bg-neutral-700 dark:text-neutral-100 dark:border-neutral-500";
      theme.buttonActive.soft[color] = "bg-theme-muted text-theme-foreground ring-1 ring-inset ring-theme-border";
      theme.buttonActive.outline[color] = "border border-theme-border bg-theme-muted text-theme-foreground dark:bg-theme-surface";
      theme.buttonActive.ghost[color] = "bg-theme-muted text-theme-foreground dark:bg-theme-surface/80";
      theme.buttonActive.link[color] = "text-theme-primary underline";
      theme.buttonActive.clear[color] = "text-theme-primary";
      theme.buttonActive.icon[color] = "bg-theme-muted/80 text-theme-foreground";
    } else {
      theme.buttonActive.solid[color] = `bg-${c}-200 text-${c}-800 shadow-sm dark:bg-${c}-300 dark:text-${c}-900`;
      theme.buttonActive.soft[color] = `bg-${c}-100 text-${c}-700 ring-1 ring-inset ring-${c}-300 dark:bg-${c}-500/20 dark:text-${c}-100 dark:ring-${c}-400/50`;
      theme.buttonActive.outline[color] = `border border-${c}-300 bg-${c}-50 text-${c}-700 dark:border-${c}-400/60 dark:bg-${c}-500/15 dark:text-${c}-100`;
      theme.buttonActive.ghost[color] = `bg-${c}-100 text-${c}-700 dark:bg-${c}-500/15 dark:text-${c}-100`;
      theme.buttonActive.link[color] = `text-${c}-400 underline dark:text-${c}-300`;
      theme.buttonActive.clear[color] = `text-${c}-400 dark:text-${c}-300`;
      theme.buttonActive.icon[color] = `bg-${c}-100 text-${c}-700 dark:bg-${c}-500/20 dark:text-${c}-200`;
    }
    if (isWhite) {
      theme.buttonActiveHover.solid[color] = "hover:bg-slate-200 dark:hover:bg-slate-600";
      theme.buttonActiveHover.soft[color] = "hover:bg-slate-100";
      theme.buttonActiveHover.outline[color] = "hover:bg-white/30";
      theme.buttonActiveHover.ghost[color] = "hover:bg-white/30";
      theme.buttonActiveHover.link[color] = "hover:text-white/90";
      theme.buttonActiveHover.clear[color] = "hover:text-white/90";
      theme.buttonActiveHover.icon[color] = "hover:bg-white/40";
    } else if (isTheme) {
      theme.buttonActiveHover.solid[color] = "hover:bg-neutral-200 dark:hover:bg-neutral-600";
      theme.buttonActiveHover.soft[color] = "hover:bg-theme-muted/80";
      theme.buttonActiveHover.outline[color] = "hover:bg-theme-muted/80 dark:hover:bg-theme-surface/80";
      theme.buttonActiveHover.ghost[color] = "hover:bg-theme-muted/80 dark:hover:bg-theme-surface";
      theme.buttonActiveHover.link[color] = "hover:text-theme-primary/80";
      theme.buttonActiveHover.clear[color] = "hover:text-theme-primary/80";
      theme.buttonActiveHover.icon[color] = "hover:bg-theme-muted";
    } else {
      theme.buttonActiveHover.solid[color] = `hover:bg-${c}-300 dark:hover:bg-${c}-400`;
      theme.buttonActiveHover.soft[color] = `hover:bg-${c}-200 dark:hover:bg-${c}-500/30`;
      theme.buttonActiveHover.outline[color] = `hover:bg-${c}-100 dark:hover:bg-${c}-500/25`;
      theme.buttonActiveHover.ghost[color] = `hover:bg-${c}-200 dark:hover:bg-${c}-500/25`;
      theme.buttonActiveHover.link[color] = `hover:text-${c}-500 dark:hover:text-${c}-200`;
      theme.buttonActiveHover.clear[color] = `hover:text-${c}-500 dark:hover:text-${c}-200`;
      theme.buttonActiveHover.icon[color] = `hover:bg-${c}-200 dark:hover:bg-${c}-500/30`;
    }
    if (isWhite) {
      theme.toggle[color] = "peer-checked:bg-white peer-checked:border-white peer-focus:ring-neutral-300 dark:peer-checked:bg-neutral-200";
    } else if (isTheme) {
      theme.toggle[color] = "peer-checked:bg-theme-primary peer-checked:border-theme-primary peer-focus:ring-theme-secondary dark:peer-checked:bg-theme-secondary";
    } else {
      theme.toggle[color] = `peer-checked:bg-${c}-500 peer-checked:border-${c}-500 peer-focus:ring-${c}-400 dark:peer-checked:bg-${c}-400`;
    }
    if (isWhite || isTheme) {
      theme.checkbox[color] = "accent-neutral-600 focus-visible:ring-neutral-500 dark:focus-visible:ring-neutral-400";
    } else {
      theme.checkbox[color] = `accent-${c}-600 focus-visible:ring-${c}-500 dark:focus-visible:ring-${c}-400`;
    }
    if (isWhite || isTheme) {
      theme.spinner[color] = [
        "border-t-white dark:border-t-neutral-300",
        "border-r-neutral-300 dark:border-r-neutral-200",
        "border-b-neutral-200 dark:border-b-neutral-100/60",
        "border-l-neutral-100 dark:border-l-neutral-100/40"
      ];
    } else {
      theme.spinner[color] = [
        `border-t-${c}-500 dark:border-t-${c}-300`,
        `border-r-${c}-300 dark:border-r-${c}-200`,
        `border-b-${c}-200 dark:border-b-${c}-100/60`,
        `border-l-${c}-100 dark:border-l-${c}-100/40`
      ];
    }
    if (isWhite || isTheme) {
      theme.loader[color] = {
        track: "bg-neutral-100/60 dark:bg-neutral-800/60",
        bar: "bg-neutral-500"
      };
    } else {
      theme.loader[color] = {
        track: `bg-${c}-100/60 dark:bg-${c}-900/40`,
        bar: `bg-${c}-500`
      };
    }
    if (isWhite || isTheme) {
      theme.multiToggle[color] = {
        active: "bg-white/90 dark:bg-neutral-200/90",
        activeText: "text-neutral-900 dark:text-neutral-900",
        indicator: "bg-neutral-500/15 dark:bg-neutral-200/20 border border-neutral-500/40 dark:border-neutral-200/30",
        hover: "hover:text-neutral-700 dark:hover:text-neutral-200"
      };
    } else {
      theme.multiToggle[color] = {
        active: `bg-${c}-500/90 dark:bg-${c}-400/90`,
        activeText: `text-${c}-700 dark:text-${c}-200`,
        indicator: `bg-${c}-500/15 dark:bg-${c}-400/20 border border-${c}-400/40 dark:border-${c}-300/20`,
        hover: `hover:text-${c}-600 dark:hover:text-${c}-300`
      };
    }
    if (isWhite || isTheme) {
      theme.multiToggleVariant[color] = {
        softIndicator: "bg-neutral-200 dark:bg-neutral-600",
        activeText: "text-neutral-700 dark:text-neutral-200",
        hover: "hover:text-neutral-700 dark:hover:text-neutral-200"
      };
    } else {
      theme.multiToggleVariant[color] = {
        softIndicator: `bg-${c}-100 dark:bg-${c}-900/30`,
        activeText: `text-${c}-600 dark:text-${c}-400`,
        hover: `hover:text-${c}-600 dark:hover:text-${c}-400`
      };
    }
    if (isWhite) {
      theme.tabs[color] = {
        hoverText: "hover:text-slate-700 dark:hover:text-slate-200",
        activeText: "text-slate-900 dark:text-slate-100",
        onAccentText: "text-slate-900 dark:text-slate-100",
        focusRing: "focus-visible:ring-slate-400",
        accentBg: "bg-white dark:bg-slate-900/80",
        subtleBg: "bg-slate-100 dark:bg-slate-800/70",
        subtleHoverBg: "hover:bg-slate-200 dark:hover:bg-slate-800/60",
        segmentedContainer: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900/40",
        badgeSubtle: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
        badgeStrong: "bg-slate-300 text-slate-800 dark:bg-white/20 dark:text-white",
        badgeOnAccent: "bg-white text-slate-700 dark:bg-white/20 dark:text-white",
        underlineActive: "after:bg-slate-400 dark:after:bg-slate-200"
      };
    } else if (isTheme) {
      theme.tabs[color] = {
        hoverText: "hover:text-neutral-700 dark:hover:text-neutral-200",
        activeText: "text-neutral-800 dark:text-neutral-100",
        onAccentText: "text-neutral-900 dark:text-neutral-100",
        focusRing: "focus-visible:ring-neutral-400",
        accentBg: "bg-white dark:bg-neutral-800",
        subtleBg: "bg-neutral-100 dark:bg-neutral-800/70",
        subtleHoverBg: "hover:bg-neutral-200 dark:hover:bg-neutral-700/60",
        segmentedContainer: "border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/40",
        badgeSubtle: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
        badgeStrong: "bg-neutral-300 text-neutral-800 dark:bg-neutral-600/60 dark:text-white",
        badgeOnAccent: "bg-white/20 text-neutral-800 dark:bg-white/20 dark:text-white",
        underlineActive: "after:bg-neutral-500 dark:after:bg-neutral-200"
      };
    } else {
      theme.tabs[color] = {
        hoverText: `hover:text-${c}-500 dark:hover:text-${c}-200`,
        activeText: `text-${c}-600 dark:text-${c}-300`,
        onAccentText: "text-white dark:text-white",
        focusRing: `focus-visible:ring-${c}-400`,
        accentBg: `bg-${c}-500 dark:bg-${c}-400`,
        subtleBg: `bg-${c}-50 dark:bg-${c}-500/10`,
        subtleHoverBg: `hover:bg-${c}-100 dark:hover:bg-${c}-500/20`,
        segmentedContainer: `border-${c}-200 bg-${c}-50 dark:border-${c}-500/40 dark:bg-${c}-700/10`,
        badgeSubtle: `bg-${c}-100 text-${c}-600 dark:bg-${c}-500/20 dark:text-${c}-200`,
        badgeStrong: `bg-${c}-200 text-${c}-700 dark:bg-${c}-500/40 dark:text-${c}-100`,
        badgeOnAccent: "bg-white/20 text-white",
        underlineActive: `after:bg-${c}-500 dark:after:bg-${c}-400`
      };
    }
    if (color === "neutral") {
      theme.panel[color] = {
        border: "border-neutral-200 dark:border-neutral-700",
        heading: "text-neutral-900 dark:text-neutral-100",
        muted: "text-neutral-600 dark:text-neutral-300",
        badge: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        subtleBg: "bg-neutral-50/80 dark:bg-neutral-900/70",
        tonalBg: "bg-neutral-100/80 dark:bg-neutral-800/70",
        glassBg: "bg-white/70 dark:bg-neutral-900/70",
        glassBorder: "border-neutral-200 dark:border-neutral-700",
        overlayGradient: "from-neutral-900/70 via-neutral-900/30 to-neutral-900/20",
        decorationShape: "bg-neutral-200/15 dark:bg-neutral-100/5",
        decorationGradient: "from-neutral-200/15 to-transparent dark:from-neutral-600/10 dark:to-transparent"
      };
    } else if (color === "slate") {
      theme.panel[color] = {
        border: "border-neutral-200 dark:border-neutral-700",
        heading: "text-neutral-900 dark:text-neutral-100",
        muted: "text-neutral-600 dark:text-neutral-300",
        badge: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
        subtleBg: "bg-neutral-50/80 dark:bg-neutral-900/70",
        tonalBg: "bg-neutral-100/80 dark:bg-neutral-800/70",
        glassBg: "bg-white/70 dark:bg-neutral-900/70",
        glassBorder: "border-neutral-200 dark:border-neutral-700",
        overlayGradient: "from-neutral-900/70 via-neutral-900/30 to-neutral-900/20",
        decorationShape: "bg-neutral-200/15 dark:bg-neutral-100/5",
        decorationGradient: "from-neutral-200/15 to-transparent dark:from-neutral-600/10 dark:to-transparent"
      };
    } else {
      theme.panel[color] = {
        border: `border-${c}-300 dark:border-${c}-500/50`,
        heading: `text-${c}-700 dark:text-${c}-200`,
        muted: `text-${c}-600/90 dark:text-${c}-200/85`,
        badge: `bg-${c}-100 text-${c}-700 dark:bg-${c}-500/20 dark:text-${c}-100`,
        subtleBg: `bg-${c}-50/80 dark:bg-${c}-500/10`,
        tonalBg: `bg-${c}-100/80 dark:bg-${c}-500/15`,
        glassBg: `bg-${c}-50/50 dark:bg-${c}-500/15`,
        glassBorder: `border-${c}-500 dark:border-${c}-400`,
        overlayGradient: `from-${c}-900/70 via-${c}-900/40 to-${c}-900/15`,
        decorationShape: `bg-${c}-400/10 dark:bg-${c}-300/5`,
        decorationGradient: `from-${c}-100/60 to-transparent dark:from-${c}-500/10 dark:to-transparent`
      };
    }
    if (isTheme || isWhite || color === "neutral") {
      theme.stepper[color] = {
        activeBg: "bg-neutral-900 dark:bg-neutral-100",
        activeText: "text-white dark:text-neutral-900",
        completedBg: "bg-neutral-200 dark:bg-neutral-700",
        completedText: "text-neutral-800 dark:text-neutral-100",
        pendingBorder: "border-neutral-300 dark:border-neutral-700",
        pendingText: "text-neutral-500 dark:text-neutral-400",
        underlineBase: "bg-neutral-200 dark:bg-neutral-700"
      };
    } else {
      theme.stepper[color] = {
        activeBg: `bg-${c}-600 dark:bg-${c}-400`,
        activeText: "text-white",
        completedBg: `bg-${c}-100 dark:bg-${c}-600/60`,
        completedText: `text-${c}-700 dark:text-${c}-100`,
        pendingBorder: `border-${c}-200 dark:border-${c}-700/60`,
        pendingText: `text-${c}-500 dark:text-${c}-200`,
        underlineBase: `bg-${c}-100 dark:bg-${c}-700/40`
      };
    }
    if (isWhite || isTheme) {
      theme.badge[color] = "bg-slate-600 text-white dark:bg-slate-500";
    } else {
      theme.badge[color] = `bg-${c}-500 text-white dark:bg-${c}-400`;
    }
    if (isWhite || isTheme || color === "neutral") {
      theme.pill[color] = {
        solid: { base: "bg-neutral-800 text-white" },
        soft: {
          base: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800/80 dark:text-neutral-100"
        },
        outline: {
          base: "text-neutral-700 dark:text-neutral-100",
          border: "border border-neutral-300 dark:border-neutral-600"
        }
      };
    } else {
      theme.pill[color] = {
        solid: { base: `bg-${c}-500 text-white` },
        soft: {
          base: `bg-${c}-50 text-${c}-700 dark:bg-${c}-500/15 dark:text-${c}-100`
        },
        outline: {
          base: `text-${c}-600 dark:text-${c}-200`,
          border: `border border-${c}-200 dark:border-${c}-500/40`
        }
      };
    }
    if (isWhite || isTheme || color === "neutral") {
      theme.alert[color] = {
        subtle: "bg-neutral-100 text-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-100",
        solid: "bg-neutral-800 text-white dark:bg-neutral-100 dark:text-neutral-800",
        outline: "bg-white text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100",
        icon: "text-neutral-500 dark:text-neutral-300",
        text: "text-neutral-700 dark:text-neutral-200",
        border: "border-neutral-200 dark:border-neutral-700",
        dismiss: "hover:text-neutral-900 dark:hover:text-white"
      };
    } else {
      theme.alert[color] = {
        subtle: `bg-${c}-50 text-${c}-800 dark:bg-${c}-900/40 dark:text-${c}-100`,
        solid: `bg-${c}-600 text-white dark:bg-${c}-500 dark:text-white`,
        outline: `bg-white text-${c}-700 dark:bg-${c}-900/60 dark:text-${c}-100`,
        icon: `text-${c}-500 dark:text-${c}-300`,
        text: `text-${c}-700 dark:text-${c}-100`,
        border: `border-${c}-200 dark:border-${c}-700`,
        dismiss: `hover:text-${c}-700 dark:hover:text-${c}-100`
      };
    }
    if (isWhite || isTheme || color === "neutral") {
      theme.statTile[color] = {
        decorationBg: "bg-neutral-300/40 dark:bg-neutral-600/20",
        iconColor: "text-neutral-800 dark:text-neutral-200",
        divider: "border-neutral-200 dark:border-neutral-700"
      };
    } else {
      theme.statTile[color] = {
        decorationBg: `bg-${c}-300/40 dark:bg-${c}-400/20`,
        iconColor: `text-${c}-800 dark:text-${c}-300`,
        divider: `border-${c}-200 dark:border-${c}-800`
      };
    }
    if (isWhite || isTheme) {
      theme.buttonSelector[color] = {
        selectedBorder: "border-neutral-400/70 dark:border-neutral-400/40",
        selectedBg: "bg-neutral-100/80 dark:bg-neutral-500/10",
        selectedIcon: "text-neutral-700 dark:text-neutral-300",
        selectedLabel: "text-neutral-800 dark:text-neutral-200",
        selectedIndicatorBg: "bg-neutral-600",
        selectedIndicatorBorder: "border-neutral-600",
        selectedIndicatorDot: "bg-white"
      };
    } else {
      theme.buttonSelector[color] = {
        selectedBorder: `border-${c}-300/70 dark:border-${c}-500/40`,
        selectedBg: `bg-${c}-50/80 dark:bg-${c}-500/10`,
        selectedIcon: `text-${c}-600 dark:text-${c}-400`,
        selectedLabel: `text-${c}-700 dark:text-${c}-300`,
        selectedIndicatorBg: `bg-${c}-500`,
        selectedIndicatorBorder: `border-${c}-500`,
        selectedIndicatorDot: "bg-white"
      };
    }
  });
  return theme;
};
var defaultTheme = createTheme();
var currentTheme = defaultTheme;
var getButtonColorClasses = (variant, color) => {
  const variantTheme = currentTheme.button[variant] ?? currentTheme.button.solid;
  const fallbackVariant = currentTheme.button.solid;
  return variantTheme[color] ?? variantTheme.blue ?? fallbackVariant[color] ?? fallbackVariant.blue;
};
var getButtonHoverClasses = (variant, color) => {
  const variantTheme = currentTheme.buttonHover[variant] ?? currentTheme.buttonHover.solid;
  const fallbackVariant = currentTheme.buttonHover.solid;
  return variantTheme[color] ?? variantTheme.blue ?? fallbackVariant[color] ?? fallbackVariant.blue;
};
var getButtonActiveClasses = (variant, color) => {
  const variantTheme = currentTheme.buttonActive[variant] ?? currentTheme.buttonActive.solid;
  const fallbackVariant = currentTheme.buttonActive.solid;
  return variantTheme[color] ?? variantTheme.blue ?? fallbackVariant[color] ?? fallbackVariant.blue;
};
var getButtonActiveHoverClasses = (variant, color) => {
  const variantTheme = currentTheme.buttonActiveHover[variant] ?? currentTheme.buttonActiveHover.solid;
  const fallbackVariant = currentTheme.buttonActiveHover.solid;
  return variantTheme[color] ?? variantTheme.blue ?? fallbackVariant[color] ?? fallbackVariant.blue;
};
var getButtonBaseClasses = (variant, color) => {
  const all = getButtonColorClasses(variant, color);
  return all.split(" ").filter((cls) => !cls.includes("hover:")).join(" ");
};
var getToggleColorClasses = (color) => currentTheme.toggle[color] ?? currentTheme.toggle.blue;
var getCheckboxColorClasses = (color) => currentTheme.checkbox[color] ?? currentTheme.checkbox.blue;
var getSpinnerColorTokens = (color) => currentTheme.spinner[color] ?? currentTheme.spinner.blue;
var getLoaderProgressColors = (color) => currentTheme.loader[color] ?? currentTheme.loader.blue;
var getMultiToggleVariantTokens = (color) => currentTheme.multiToggleVariant[color] ?? currentTheme.multiToggleVariant.blue;
var getTabsColorTokens = (color) => currentTheme.tabs[color] ?? currentTheme.tabs.blue;
var getPanelToneStyles = (tone) => currentTheme.panel[tone] ?? currentTheme.panel.neutral;
var getBadgeColorClasses = (color) => currentTheme.badge[color] ?? currentTheme.badge.danger;
var getPillColorClasses = (color, variant) => currentTheme.pill[color]?.[variant] ?? currentTheme.pill.info[variant];
var getAlertColorClasses = (color) => currentTheme.alert[color] ?? currentTheme.alert.neutral;

// src/components/Alert.tsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var defaultIcons = {
  neutral: "Info",
  info: "Info",
  success: "CheckCircle",
  warning: "Chat",
  danger: "Error",
  theme: "Info"
};
var Alert = React2.forwardRef(
  ({
    tone,
    color,
    variant = "subtle",
    title,
    description,
    icon,
    actions,
    dismissible = false,
    onDismiss,
    className,
    ...rest
  }, ref) => {
    const renderIcon2 = useIconRenderer();
    const effectiveColor = color ?? tone ?? "neutral";
    const tokens = getAlertColorClasses(effectiveColor);
    const base = classNames(
      "relative flex w-full gap-3 rounded-2xl border px-4 py-3 shadow-sm transition",
      variant === "subtle" && tokens.subtle,
      variant === "solid" && tokens.solid,
      variant === "outline" && [tokens.outline, tokens.border],
      className
    );
    const resolvedIcon = icon === false ? null : icon ?? defaultIcons[effectiveColor];
    return /* @__PURE__ */ jsxs("div", { ref, className: base, role: "alert", ...rest, children: [
      resolvedIcon && /* @__PURE__ */ jsx2("div", { className: classNames("flex-shrink-0 pt-1", tokens.icon), children: renderIcon2(resolvedIcon, "md") }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col gap-1 text-sm", children: [
        title && /* @__PURE__ */ jsx2("div", { className: "text-sm font-semibold leading-tight text-current", children: title }),
        description && /* @__PURE__ */ jsx2("div", { className: classNames("leading-relaxed", tokens.text), children: description }),
        actions && /* @__PURE__ */ jsx2("div", { className: "pt-2 text-sm", children: actions })
      ] }),
      dismissible && /* @__PURE__ */ jsx2(
        "button",
        {
          type: "button",
          onClick: onDismiss,
          className: classNames(
            "ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
            tokens.dismiss
          ),
          "aria-label": "Dismiss alert",
          children: renderIcon2("Close", "sm")
        }
      )
    ] });
  }
);
Alert.displayName = "Alert";

// src/components/AppDivider.tsx
import { jsx as jsx3 } from "react/jsx-runtime";

// src/components/Badge.tsx
import classNames2 from "classnames";
import { jsx as jsx4 } from "react/jsx-runtime";
var Badge = ({
  count,
  dot = false,
  maxCount = 99,
  tone = "neutral",
  className = "",
  style
}) => {
  if (count === 0 && !dot) {
    return null;
  }
  const colorClass = getBadgeColorClasses(tone);
  let content;
  if (dot) {
    content = /* @__PURE__ */ jsx4(
      "span",
      {
        className: classNames2("h-2 w-2 rounded-full", colorClass),
        "aria-hidden": "true"
      }
    );
  } else {
    const displayValue = count !== void 0 ? Number(count) > maxCount ? `${maxCount}+` : count : "";
    content = displayValue;
  }
  const badgeClasses = classNames2(
    "inline-grid place-items-center text-center rounded-full text-[10px] font-semibold leading-4",
    "min-h-[1.125rem] min-w-[1.125rem] border border-white/80 dark:border-neutral-900/60",
    dot ? "px-1 py-1 bg-transparent text-transparent" : "px-1.5",
    !dot && colorClass,
    className
  );
  const badgeStyle = { ...style };
  if (dot) {
    return /* @__PURE__ */ jsx4("span", { className: badgeClasses, style: badgeStyle, "aria-hidden": "true", children: /* @__PURE__ */ jsx4(
      "span",
      {
        className: classNames2("block h-2 w-2 rounded-full", colorClass),
        "aria-hidden": "true"
      }
    ) });
  }
  return /* @__PURE__ */ jsx4("span", { className: badgeClasses, style: badgeStyle, "aria-hidden": "true", children: content });
};
var Badge_default = Badge;

// src/components/BadgeIcon.tsx
import classNames6 from "classnames";
import { forwardRef as forwardRef2 } from "react";

// src/components/IconButton.tsx
import classNames5 from "classnames";
import { forwardRef } from "react";

// src/components/Spinner.tsx
import classNames3 from "classnames";
import React3 from "react";
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var sizeTokens = {
  xs: {
    diameter: "h-4 w-4",
    border: { thin: "border", normal: "border-[2px]", thick: "border-[4px]" }
  },
  sm: {
    diameter: "h-5 w-5",
    border: {
      thin: "border-[1.5px]",
      normal: "border-2",
      thick: "border-[4px]"
    }
  },
  md: {
    diameter: "h-6 w-6",
    border: {
      thin: "border-3",
      normal: "border-[3.5px]",
      thick: "border-[4.5px]"
    }
  },
  lg: {
    diameter: "h-8 w-8",
    border: {
      thin: "border-[3.5px]",
      normal: "border-[4px]",
      thick: "border-[5px]"
    }
  },
  xl: {
    diameter: "h-10 w-10",
    border: {
      thin: "border-[4px]",
      normal: "border-[4.5px]",
      thick: "border-[5.5px]"
    }
  }
};
var Spinner = React3.forwardRef(
  ({
    size = "md",
    color = "blue",
    variant = "solid",
    thickness = "normal",
    label,
    className,
    ...rest
  }, ref) => {
    const sizeStyles6 = sizeTokens[size] ?? sizeTokens.md;
    const borderThickness = sizeStyles6.border[thickness] ?? sizeStyles6.border.thin;
    const colorStyles = getSpinnerColorTokens(color);
    const spinnerBase = classNames3(
      "inline-flex rounded-full border-solid border-transparent",
      sizeStyles6.diameter,
      borderThickness,
      className
    );
    const spinnerClass = classNames3(
      spinnerBase,
      "transition-all duration-150 ease-in-out",
      variant === "segments" ? ["animate-[spin_1s_linear_infinite]", ...colorStyles] : ["animate-spin", colorStyles[0]]
    );
    return /* @__PURE__ */ jsxs2(
      "span",
      {
        className: "inline-flex items-center gap-2",
        role: "status",
        "aria-live": "polite",
        children: [
          /* @__PURE__ */ jsx5("span", { ref, className: spinnerClass, ...rest }),
          label && /* @__PURE__ */ jsx5("span", { className: "text-sm font-medium text-neutral-600 dark:text-neutral-300", children: label }),
          /* @__PURE__ */ jsx5("span", { className: "sr-only", children: label ?? "Loading" })
        ]
      }
    );
  }
);
Spinner.displayName = "Spinner";
var Spinner_default = Spinner;

// src/theme/ButtonTypes.ts
var colors2 = [
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "white",
  "brand",
  "info",
  "success",
  "warning",
  "danger",
  "theme",
  "parallels"
];
var createIconAccentRing = () => {
  const rings = {};
  colors2.forEach((color) => {
    const c = resolveColor(color);
    if (color === "white") {
      rings[color] = "focus-visible:ring-slate-200";
    } else if (color === "theme") {
      rings[color] = "focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500";
    } else {
      rings[color] = `focus-visible:ring-${c}-500`;
    }
  });
  return rings;
};
var createIconAccentHover = () => {
  const hovers = {};
  colors2.forEach((color) => {
    const c = resolveColor(color);
    if (color === "white") {
      hovers[color] = "hover:text-white dark:hover:text-neutral-100";
    } else if (color === "theme") {
      hovers[color] = "hover:text-neutral-800 dark:hover:text-neutral-100";
    } else {
      hovers[color] = `hover:text-${c}-500 dark:hover:text-${c}-300`;
    }
  });
  return hovers;
};
var createIconAccentActive = () => {
  const actives = {};
  colors2.forEach((color) => {
    const c = resolveColor(color);
    if (color === "white") {
      actives[color] = "!text-white !dark:text-neutral-100";
    } else if (color === "theme") {
      actives[color] = "!text-neutral-800 !dark:text-neutral-100";
    } else {
      actives[color] = `!text-${c}-500 !dark:text-${c}-300`;
    }
  });
  return actives;
};
var iconAccentRing = createIconAccentRing();
var iconAccentHover = createIconAccentHover();
var iconAccentActive = createIconAccentActive();

// src/components/TooltipWrapper.tsx
import React4, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import classNames4 from "classnames";
import { Fragment, jsx as jsx6, jsxs as jsxs3 } from "react/jsx-runtime";
var VIEWPORT_PADDING = 8;
var TooltipWrapper = ({
  text,
  delay = 500,
  position = "top",
  children
}) => {
  const timerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [triggerCenter, setTriggerCenter] = useState({ top: 0, left: 0 });
  const [finalLeft, setFinalLeft] = useState(null);
  const [caretOffset, setCaretOffset] = useState("50%");
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  useEffect(() => {
    if (!text && visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setVisible(false);
      setFinalLeft(null);
    }
  }, [text, visible]);
  useLayoutEffect(() => {
    if (!visible || !tooltipRef.current || finalLeft !== null) return;
    const el = tooltipRef.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    let left = triggerCenter.left;
    if (rect.right > vw - VIEWPORT_PADDING) {
      left = triggerCenter.left - (rect.right - (vw - VIEWPORT_PADDING));
    } else if (rect.left < VIEWPORT_PADDING) {
      left = triggerCenter.left + (VIEWPORT_PADDING - rect.left);
    }
    const tooltipEdge = left - rect.width / 2;
    const caretPct = (triggerCenter.left - tooltipEdge) / rect.width * 100;
    setCaretOffset(`${Math.max(8, Math.min(92, caretPct))}%`);
    setFinalLeft(left);
  }, [visible, triggerCenter, finalLeft]);
  const show = useCallback(
    (e) => {
      if (text) {
        const rect = e.currentTarget.getBoundingClientRect();
        setTriggerCenter({
          top: position === "top" ? rect.top : rect.bottom,
          left: rect.left + rect.width / 2
        });
        setFinalLeft(null);
        setCaretOffset("50%");
        timerRef.current = setTimeout(() => setVisible(true), delay);
      }
      children.props.onMouseEnter?.(e);
    },
    [text, delay, position, children.props]
  );
  const hide = useCallback(
    (e) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setVisible(false);
      setFinalLeft(null);
      setCaretOffset("50%");
      if (e) children.props.onMouseLeave?.(e);
    },
    [children.props]
  );
  const isTop = position === "top";
  const renderLeft = finalLeft ?? triggerCenter.left;
  const child = React4.cloneElement(children, {
    onMouseEnter: show,
    onMouseLeave: hide
  });
  return /* @__PURE__ */ jsxs3(Fragment, { children: [
    child,
    visible && text && createPortal(
      /* @__PURE__ */ jsxs3(
        "div",
        {
          ref: tooltipRef,
          role: "tooltip",
          style: {
            position: "fixed",
            top: triggerCenter.top,
            left: renderLeft,
            transform: isTop ? "translate(-50%, calc(-100% - 8px))" : "translate(-50%, 8px)",
            // Hide until collision detection has run to avoid a 1-frame flash
            // at the wrong position when near the viewport edge
            visibility: finalLeft === null ? "hidden" : "visible",
            zIndex: 9999
          },
          className: "pointer-events-none whitespace-nowrap rounded-md bg-neutral-900 px-2.5 py-1.5 text-xs leading-snug text-white shadow-lg dark:bg-neutral-700",
          children: [
            text,
            /* @__PURE__ */ jsx6(
              "span",
              {
                style: { left: caretOffset },
                className: classNames4(
                  "absolute -translate-x-1/2 border-4 border-transparent",
                  isTop ? "top-full border-t-neutral-900 dark:border-t-neutral-700" : "bottom-full border-b-neutral-900 dark:border-b-neutral-700"
                )
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
};
var TooltipWrapper_default = TooltipWrapper;

// src/components/IconButton.tsx
import { jsx as jsx7, jsxs as jsxs4 } from "react/jsx-runtime";
var sizeTokens2 = {
  xs: { button: "h-7 w-7 leading-none", icon: "h-4 w-4", spinner: "xs" },
  sm: { button: "h-8 w-8 leading-none", icon: "h-5 w-5", spinner: "xs" },
  md: { button: "h-10 w-10 leading-none", icon: "h-6 w-6", spinner: "sm" },
  lg: { button: "h-12 w-12 leading-none", icon: "h-7 w-7", spinner: "md" },
  xl: { button: "h-14 w-14 leading-none", icon: "h-8 w-8", spinner: "lg" }
};
var roundedMap = {
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full"
};
var baseClasses = "inline-flex items-center justify-center select-none transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";
var IconButton = forwardRef(
  ({
    icon,
    variant = "icon",
    color = "blue",
    size = "md",
    rounded = "full",
    customSizeClass,
    iconClassName,
    loading = false,
    spinnerVariant = "segments",
    spinnerColor,
    srLabel,
    accent = false,
    accentColor,
    className,
    disabled,
    tooltip,
    tooltipPosition,
    ...rest
  }, ref) => {
    const renderIcon2 = useIconRenderer();
    const sizeConfig = sizeTokens2[size] ?? sizeTokens2.md;
    const baseColorClasses = getButtonColorClasses(variant, color);
    const accentTone = accentColor ?? color;
    const accentRing = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHover = iconAccentHover[accentTone] ?? iconAccentHover.blue;
    const accentClasses = accent ? classNames5(
      "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
      accentRing,
      accentHover
    ) : null;
    const nonAccentHover = !accent && accentColor && variant !== "solid" ? iconAccentHover[accentColor] ?? null : null;
    const dimensionClass = customSizeClass ?? sizeConfig.button;
    const spinnerColorToken = spinnerColor ?? color;
    const computedClassName = classNames5(
      baseClasses,
      dimensionClass,
      roundedMap[rounded] ?? roundedMap.full,
      accentClasses ?? baseColorClasses,
      nonAccentHover,
      className
    );
    const iconContent = renderIcon2(
      icon,
      size,
      classNames5("flex-shrink-0", sizeConfig.icon, iconClassName)
    );
    const { "aria-label": ariaLabel, title, ...restProps } = rest;
    const computedAriaLabel = ariaLabel ?? srLabel;
    const computedTitle = tooltip ? void 0 : title ?? computedAriaLabel;
    const button = /* @__PURE__ */ jsxs4(
      "button",
      {
        ref,
        className: computedClassName,
        "data-variant": variant,
        "data-color": color,
        "data-size": size,
        disabled: disabled || loading,
        "aria-label": computedAriaLabel,
        title: computedTitle,
        ...restProps,
        children: [
          loading ? /* @__PURE__ */ jsx7(
            Spinner_default,
            {
              size: sizeConfig.spinner,
              color: spinnerColorToken,
              variant: spinnerVariant,
              "aria-hidden": "true"
            }
          ) : iconContent,
          /* @__PURE__ */ jsx7("span", { className: "sr-only", children: srLabel ?? rest["aria-label"] ?? "Icon button" })
        ]
      }
    );
    if (tooltip) {
      return /* @__PURE__ */ jsx7(TooltipWrapper_default, { text: tooltip, position: tooltipPosition, children: button });
    }
    return button;
  }
);
IconButton.displayName = "IconButton";
var IconButton_default = IconButton;

// src/components/BadgeIcon.tsx
import { jsx as jsx8, jsxs as jsxs5 } from "react/jsx-runtime";
var POSITION_CLASSES = {
  "top-start": "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
  "top-end": "top-0 right-0 translate-x-1/2 -translate-y-1/2",
  "bottom-start": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
  "bottom-end": "bottom-0 right-0 translate-x-1/2 translate-y-1/2"
};
var shouldRenderBadge = ({
  badgeContent,
  badgeCount,
  badgeDot
}) => {
  if (badgeContent) {
    return true;
  }
  if (badgeDot) {
    return true;
  }
  if (typeof badgeCount === "number" && badgeCount !== 0) {
    return true;
  }
  return false;
};
var BadgeIcon = forwardRef2(
  ({
    badgeContent,
    badgeCount,
    badgeDot = false,
    badgePosition = "top-end",
    badgeProps,
    wrapperClassName,
    className,
    fullWidth = false,
    ...iconButtonProps
  }, ref) => {
    const showBadge = shouldRenderBadge({ badgeContent, badgeCount, badgeDot });
    const badgeNode = badgeContent ?? (showBadge ? /* @__PURE__ */ jsx8(Badge_default, { count: badgeCount, dot: badgeDot, ...badgeProps }) : null);
    return /* @__PURE__ */ jsxs5(
      "span",
      {
        className: classNames6(
          "relative inline-flex",
          fullWidth && "w-full",
          wrapperClassName
        ),
        children: [
          /* @__PURE__ */ jsx8(
            IconButton_default,
            {
              ref,
              accent: true,
              className: classNames6(fullWidth && "w-full", className),
              ...iconButtonProps
            }
          ),
          showBadge && badgeNode && /* @__PURE__ */ jsx8(
            "span",
            {
              className: classNames6(
                "pointer-events-none absolute",
                POSITION_CLASSES[badgePosition]
              ),
              children: badgeNode
            }
          )
        ]
      }
    );
  }
);
BadgeIcon.displayName = "BadgeIcon";

// src/components/Pill.tsx
import classNames7 from "classnames";
import { jsx as jsx9, jsxs as jsxs6 } from "react/jsx-runtime";
var sizeStyles = {
  xs: "text-[11px] h-4 px-2",
  sm: "text-[12px] h-5 px-2.5",
  md: "text-xs h-6 px-3",
  lg: "text-sm h-7 px-4"
};
var Pill = ({
  tone = "info",
  variant = "soft",
  size = "md",
  uppercase = false,
  icon,
  dot = false,
  className,
  children,
  ...rest
}) => {
  const toneTokens9 = getPillColorClasses(tone, variant);
  const sizeToken = sizeStyles[size];
  const pillClasses = classNames7(
    "inline-flex items-center justify-center rounded-full  leading-none",
    sizeToken,
    toneTokens9.base,
    toneTokens9.border,
    uppercase && "uppercase tracking-wide",
    dot && "px-0 h-2 w-2 min-w-[0.5rem]",
    dot && "rounded-full",
    className
  );
  return /* @__PURE__ */ jsxs6("span", { className: pillClasses, ...rest, children: [
    icon && !dot ? /* @__PURE__ */ jsx9("span", { className: "mr-1.5 flex items-center text-inherit", children: icon }) : null,
    !dot ? children : null
  ] });
};
var Pill_default = Pill;

// src/components/Progress.tsx
import React7 from "react";
import classNames8 from "classnames";
import { jsx as jsx10, jsxs as jsxs7 } from "react/jsx-runtime";
var heightTokens = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3"
};
var speedSeconds = {
  slow: "2.4s",
  normal: "1.8s",
  fast: "1.2s"
};
var Progress = React7.forwardRef(
  ({
    value = 0,
    size = "md",
    color = "blue",
    motion,
    motionSpeed = "normal",
    motionDirection = "forward",
    showShimmer = true,
    className,
    ...rest
  }, ref) => {
    const clamped = Math.min(100, Math.max(0, Math.round(value)));
    const palette = getLoaderProgressColors(color);
    const trackHeight = heightTokens[size] ?? heightTokens.md;
    const resolvedMotion = motion ?? (showShimmer ? "shimmer" : "none");
    const showShimmerOverlay = resolvedMotion === "shimmer" || resolvedMotion === "shimmer-pulse" || resolvedMotion === "stripes-shimmer";
    const showStripesOverlay = resolvedMotion === "stripes" || resolvedMotion === "stripes-shimmer";
    const pulseBar = resolvedMotion === "pulse" || resolvedMotion === "shimmer-pulse";
    const duration = speedSeconds[motionSpeed] ?? speedSeconds.normal;
    const direction = motionDirection === "reverse" ? "reverse" : "normal";
    return /* @__PURE__ */ jsx10(
      "div",
      {
        ref,
        className: classNames8(
          "relative w-full overflow-hidden rounded-full shadow-inner",
          trackHeight,
          palette.track,
          className
        ),
        role: "progressbar",
        "aria-valuenow": clamped,
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        ...rest,
        children: /* @__PURE__ */ jsxs7(
          "div",
          {
            className: classNames8(
              "relative h-full overflow-hidden rounded-full transition-[width] duration-300 ease-out",
              pulseBar && "animate-pulse",
              palette.bar
            ),
            style: { width: `${clamped}%` },
            children: [
              showShimmerOverlay && /* @__PURE__ */ jsx10(
                "span",
                {
                  className: "absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent",
                  style: {
                    animation: `progress-shimmer ${duration} linear infinite`,
                    animationDirection: direction
                  }
                }
              ),
              showStripesOverlay && /* @__PURE__ */ jsx10(
                "span",
                {
                  className: "absolute inset-0",
                  style: {
                    backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.4) 0px, rgba(255,255,255,0.4) 12px, transparent 12px, transparent 24px)",
                    backgroundSize: "34px 34px",
                    animation: `progress-stripes ${duration} linear infinite`,
                    animationDirection: direction
                  }
                }
              )
            ]
          }
        )
      }
    );
  }
);
Progress.displayName = "Progress";
var Progress_default = Progress;

// src/components/MultiProgressBar.tsx
import { useMemo, useRef as useRef2, useState as useState2 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import classNames9 from "classnames";
import { jsx as jsx11, jsxs as jsxs8 } from "react/jsx-runtime";

// src/components/StatusSpinner.tsx
import classNames10 from "classnames";
import React9 from "react";
import { jsx as jsx12, jsxs as jsxs9 } from "react/jsx-runtime";
var SIZE_TOKENS = {
  xs: { wrapper: "h-4 w-4", dot: "h-1.5 w-1.5", border: "border-[1.5px]" },
  sm: { wrapper: "h-5 w-5", dot: "h-2 w-2", border: "border-[2px]" },
  md: { wrapper: "h-6 w-6", dot: "h-2.5 w-2.5", border: "border-[2.5px]" },
  lg: { wrapper: "h-8 w-8", dot: "h-3 w-3", border: "border-[3px]" }
};
var INTENT_TOKENS = {
  neutral: {
    dot: "bg-slate-400 shadow-[0_0_6px_rgba(148,163,184,0.55)] dark:bg-slate-300",
    accent: "rgb(148,163,184)",
    track: "rgba(148,163,184,0.25)"
  },
  info: {
    dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.65)]",
    accent: "rgb(56,189,248)",
    track: "rgba(56,189,248,0.25)"
  },
  success: {
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.65)]",
    accent: "rgb(16,185,129)",
    track: "rgba(16,185,129,0.23)"
  },
  warning: {
    dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]",
    accent: "rgb(251,191,36)",
    track: "rgba(251,191,36,0.3)"
  },
  danger: {
    dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.7)]",
    accent: "rgb(251,113,133)",
    track: "rgba(251,113,133,0.28)"
  }
};
var StatusSpinner = React9.forwardRef(
  ({
    intent = "info",
    size = "md",
    animated = true,
    label,
    className,
    ...rest
  }, ref) => {
    const palette = INTENT_TOKENS[intent] ?? INTENT_TOKENS.info;
    const sizeToken = SIZE_TOKENS[size] ?? SIZE_TOKENS.md;
    const spinnerStyle = animated ? {
      borderTopColor: palette.accent,
      borderRightColor: palette.track,
      borderBottomColor: palette.track,
      borderLeftColor: palette.track
    } : {
      borderColor: palette.track
    };
    return /* @__PURE__ */ jsxs9(
      "span",
      {
        ref,
        className: classNames10("inline-flex items-center gap-2", className),
        ...rest,
        children: [
          /* @__PURE__ */ jsxs9(
            "span",
            {
              className: classNames10(
                "relative inline-flex shrink-0 items-center justify-center",
                sizeToken.wrapper
              ),
              role: "status",
              "aria-live": "polite",
              children: [
                /* @__PURE__ */ jsx12(
                  "span",
                  {
                    className: classNames10(
                      "absolute inset-0 rounded-full border-solid border-transparent transition-all duration-200 ease-out",
                      sizeToken.border,
                      animated && "animate-spin motion-reduce:animate-none"
                    ),
                    style: spinnerStyle
                  }
                ),
                /* @__PURE__ */ jsx12(
                  "span",
                  {
                    className: classNames10(
                      "relative rounded-full ring-1 ring-white/40 transition-shadow duration-200 dark:ring-black/40",
                      sizeToken.dot,
                      palette.dot
                    )
                  }
                )
              ]
            }
          ),
          label && /* @__PURE__ */ jsx12("span", { className: "text-xs font-medium text-neutral-600 dark:text-neutral-300", children: label }),
          /* @__PURE__ */ jsx12("span", { className: "sr-only", children: label ?? "Loading status" })
        ]
      }
    );
  }
);
StatusSpinner.displayName = "StatusSpinner";

// src/components/Loader.tsx
import classNames11 from "classnames";
import { jsx as jsx13, jsxs as jsxs10 } from "react/jsx-runtime";
var sizeMap = {
  sm: { spinner: "sm", title: "text-sm", label: "text-xs" },
  md: { spinner: "md", title: "text-base", label: "text-sm" },
  lg: { spinner: "lg", title: "text-lg", label: "text-sm" }
};
var Loader = ({
  variant = "spinner",
  spinnerVariant = "segments",
  spinnerThickness = "normal",
  size = "md",
  color = "blue",
  title,
  label,
  progress = 0,
  className,
  overlay = false,
  glass = false,
  glassBlurIntensity = "medium"
}) => {
  const resolvedSize = sizeMap[size] ?? sizeMap.md;
  const blurIntensityMap = {
    none: "backdrop-blur-none",
    low: "backdrop-blur-md",
    medium: "backdrop-blur-lg",
    high: "backdrop-blur-2xl"
  };
  const containerClass = classNames11(
    "inline-flex flex-col items-center justify-center gap-3 text-center",
    overlay && (glass ? `absolute inset-0 z-50 rounded-[inherit] bg-white/70 p-6 ${blurIntensityMap[glassBlurIntensity]} dark:bg-neutral-900/60` : `absolute inset-0 z-50 rounded-[inherit] bg-white/85 p-6 ${blurIntensityMap[glassBlurIntensity]} dark:bg-neutral-900/80`),
    className
  );
  const renderBody = () => {
    if (variant === "progress") {
      return /* @__PURE__ */ jsx13("div", { className: "w-full min-w-[12rem] space-y-3", children: /* @__PURE__ */ jsx13(Progress_default, { value: progress, size: "md", color }) });
    }
    return /* @__PURE__ */ jsx13(
      Spinner_default,
      {
        size: resolvedSize.spinner,
        color,
        variant: spinnerVariant,
        thickness: spinnerThickness
      }
    );
  };
  return /* @__PURE__ */ jsxs10("div", { className: containerClass, children: [
    title && /* @__PURE__ */ jsx13(
      "div",
      {
        className: classNames11(
          "font-semibold text-neutral-800 dark:text-neutral-100",
          resolvedSize.title
        ),
        children: title
      }
    ),
    renderBody(),
    label && /* @__PURE__ */ jsx13(
      "div",
      {
        className: classNames11(
          "text-neutral-600 dark:text-neutral-300",
          resolvedSize.label
        ),
        children: label
      }
    )
  ] });
};
var Loader_default = Loader;

// src/components/EmptyState.tsx
import classNames13 from "classnames";
import React11 from "react";

// src/components/Button.tsx
import {
  forwardRef as forwardRef3
} from "react";
import classNames12 from "classnames";
import { jsx as jsx14, jsxs as jsxs11 } from "react/jsx-runtime";
var baseClasses2 = "inline-flex items-center justify-center rounded-md transition-colors duration-150 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 select-none";
var sizeStyles2 = {
  xs: {
    base: "px-2 py-1 text-xs",
    iconOnly: "p-1.5 text-xs",
    gap: "gap-1.5",
    icon: "h-4 w-4",
    spinner: "h-4 w-4"
  },
  sm: {
    base: "px-3 py-2 text-xs",
    iconOnly: "p-2 text-xs",
    gap: "gap-1.5",
    icon: "h-5 w-5",
    spinner: "h-4 w-4"
  },
  md: {
    base: "px-3.5 py-2.5 text-sm",
    iconOnly: "p-2.5 text-sm",
    gap: "gap-2",
    icon: "h-6 w-6",
    spinner: "h-6 w-6"
  },
  lg: {
    base: "px-4 py-2.5 text-base",
    iconOnly: "p-3 text-base",
    gap: "gap-2.5",
    icon: "h-7 w-7",
    spinner: "h-7 w-7"
  },
  xl: {
    base: "px-5 py-3 text-base",
    iconOnly: "p-3.5 text-base",
    gap: "gap-3",
    icon: "h-8 w-8",
    spinner: "h-8 w-8"
  }
};
var weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold"
};
var Button = forwardRef3(
  ({
    variant = "solid",
    color = "brand",
    size = "md",
    weight = "normal",
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    loading = false,
    iconOnly = false,
    accent = false,
    accentColor,
    active = false,
    className,
    children,
    disabled,
    onClick,
    tooltip,
    tooltipPosition,
    ...props
  }, ref) => {
    const renderIcon2 = useIconRenderer();
    const sizeConfig = sizeStyles2[size] ?? sizeStyles2.md;
    const baseColorClasses = getButtonColorClasses(variant, color);
    const isIconMode = iconOnly || variant === "icon";
    const accentTone = accentColor ?? color;
    const accentRingClass = iconAccentRing[accentTone] ?? iconAccentRing.blue;
    const accentHoverClass = iconAccentHover[accentTone] ?? iconAccentHover.blue;
    const accentClasses = isIconMode && accent ? classNames12(
      "bg-transparent text-inherit hover:bg-transparent focus-visible:ring-2 focus-visible:ring-offset-2",
      accentRingClass,
      accentHoverClass
    ) : null;
    const isEffectivelyDisabled = (disabled ?? false) || loading;
    const colorClasses = (() => {
      if (active) {
        const activeColor = accentColor ?? color;
        const activeBase = getButtonActiveClasses(variant, activeColor);
        return isEffectivelyDisabled ? activeBase : classNames12(
          activeBase,
          getButtonActiveHoverClasses(variant, activeColor)
        );
      }
      if (!isIconMode && accentColor && !isEffectivelyDisabled)
        return classNames12(
          getButtonBaseClasses(variant, color),
          getButtonHoverClasses(variant, accentColor)
        );
      return baseColorClasses;
    })();
    const computedClassName = classNames12(
      baseClasses2,
      sizeConfig.gap,
      isIconMode ? sizeConfig.iconOnly : sizeConfig.base,
      accentClasses ?? colorClasses,
      weightClasses[weight],
      fullWidth && "w-full",
      className
    );
    const spinner = /* @__PURE__ */ jsx14(
      "span",
      {
        className: classNames12(
          "inline-flex animate-spin rounded-full border-2 border-current border-t-transparent",
          sizeConfig.spinner
        ),
        "aria-hidden": "true"
      }
    );
    const isDisabled = disabled ?? false;
    const ariaLabel = props["aria-label"];
    const srOnlyContent = typeof children === "string" ? children : ariaLabel ? ariaLabel : void 0;
    const handleClick = (event) => {
      onClick?.(event);
    };
    const button = /* @__PURE__ */ jsxs11(
      "button",
      {
        ref,
        className: computedClassName,
        disabled: isDisabled || loading,
        "data-variant": variant,
        "data-color": color,
        "data-size": size,
        "aria-busy": loading || void 0,
        onClick: handleClick,
        ...props,
        children: [
          loading ? spinner : renderIcon2(
            leadingIcon,
            size,
            classNames12(" flex-shrink-0", sizeConfig.icon)
          ),
          isIconMode ? /* @__PURE__ */ jsx14("span", { className: "sr-only", children: srOnlyContent ?? "Button" }) : children,
          !loading && renderIcon2(
            trailingIcon,
            size,
            classNames12("flex-shrink-0", sizeConfig.icon)
          )
        ]
      }
    );
    if (tooltip) {
      return /* @__PURE__ */ jsx14(TooltipWrapper_default, { text: tooltip, position: tooltipPosition, children: button });
    }
    return button;
  }
);
Button.displayName = "Button";
var Button_default = Button;

// src/components/EmptyState.tsx
import { jsx as jsx15, jsxs as jsxs12 } from "react/jsx-runtime";
var iconSizes = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
};
var textSizes = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-lg",
  lg: "text-xl",
  xl: "text-2xl"
};
var resolveColor2 = (color) => {
  switch (color) {
    case "brand":
      return "blue";
    case "info":
      return "sky";
    case "success":
      return "emerald";
    case "warning":
      return "amber";
    case "danger":
      return "rose";
    case "theme":
      return "neutral";
    case "parallels":
      return "red";
    default:
      return color;
  }
};
var semanticTones = {
  neutral: {
    border: "border-slate-300/70 dark:border-slate-700/60",
    text: "text-slate-600 dark:text-slate-300",
    bg: "bg-white/80 dark:bg-slate-900/40",
    icon: "text-slate-400 dark:text-slate-500"
  },
  info: {
    border: "border-blue-300/60 dark:border-blue-500/40",
    text: "text-blue-700 dark:text-blue-200",
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    icon: "text-blue-500 dark:text-blue-300"
  },
  success: {
    border: "border-emerald-300/60 dark:border-emerald-500/40",
    text: "text-emerald-700 dark:text-emerald-200",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  warning: {
    border: "border-amber-300/60 dark:border-amber-500/40",
    text: "text-amber-700 dark:text-amber-200",
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    icon: "text-amber-500 dark:text-amber-300"
  },
  danger: {
    border: "border-rose-300/60 dark:border-rose-500/40",
    text: "text-rose-700 dark:text-rose-200",
    bg: "bg-rose-50/60 dark:bg-rose-950/20",
    icon: "text-rose-500 dark:text-rose-300"
  },
  parallels: {
    border: "border-red-300/60 dark:border-red-500/40",
    text: "text-red-700 dark:text-red-200",
    bg: "bg-red-50/60 dark:bg-red-950/20",
    icon: "text-red-500 dark:text-red-300"
  },
  brand: {
    border: "border-blue-300/60 dark:border-blue-500/40",
    text: "text-blue-700 dark:text-blue-200",
    bg: "bg-blue-50/60 dark:bg-blue-950/20",
    icon: "text-blue-500 dark:text-blue-300"
  },
  theme: {
    border: "border-slate-300/60 dark:border-slate-500/40",
    text: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-50/60 dark:bg-slate-950/20",
    icon: "text-slate-500 dark:text-slate-300"
  },
  white: {
    border: "border-slate-300/60 dark:border-slate-500/40",
    text: "text-slate-700 dark:text-slate-200",
    bg: "bg-slate-50/60 dark:bg-slate-950/20",
    icon: "text-slate-500 dark:text-slate-300"
  }
};
var sizes = {
  xs: "h-[30%] w-[30%]",
  sm: "h-[35%] w-[35%]",
  md: "h-[40%] w-[40%]",
  lg: "h-[45%] w-[45%]",
  xl: "h-[50%] w-[50%]",
  xxl: "h-[55%] w-[55%]",
  xxxl: "h-[60%] w-[60%]",
  full: "h-full w-full",
  "2xl": "h-[65%] w-[65%]",
  "3xl": "h-[70%] w-[70%]"
};
function buildToneClasses(color) {
  if (semanticTones[color]) return semanticTones[color];
  if (color === "white" || color === "theme") return semanticTones.neutral;
  const c = resolveColor2(color);
  return {
    border: `border-${c}-200 dark:border-${c}-500/40`,
    text: `text-${c}-700 dark:text-${c}-200`,
    bg: `bg-${c}-50/80 dark:bg-${c}-500/10`,
    icon: `text-${c}-500 dark:text-${c}-300`
  };
}
var EmptyState = ({
  title,
  subtitle,
  actionLabel,
  onAction,
  actionVariant = "soft",
  actionColor = "blue",
  icon = "Plus",
  iconSize = "xl",
  iconColor,
  textSize = "md",
  showIcon = true,
  tone = "neutral",
  fullWidth = false,
  fullHeight = false,
  actionSize = "sm",
  size = "md",
  actionLeadingIcon,
  className,
  disableBorder = false,
  transparentBackground = false,
  ...rest
}) => {
  const renderIcon2 = useIconRenderer();
  const palette = buildToneClasses(tone);
  const subtitleTextSize = textSize === "xs" ? "xs" : textSize === "sm" ? "xs" : textSize === "md" ? "sm" : textSize === "lg" ? "md" : "lg";
  const iconPallete = !iconColor ? palette : buildToneClasses(iconColor);
  return /* @__PURE__ */ jsxs12(
    "section",
    {
      className: classNames13(
        "flex flex-col items-center justify-center gap-1 rounded-3xl px-6 py-10 text-center transition",
        !disableBorder && "border-2 border-dashed shadow-sm",
        palette.border,
        !transparentBackground && palette.bg,
        sizes[size],
        fullWidth && "w-full",
        fullHeight && "h-full",
        className
      ),
      ...rest,
      children: [
        showIcon && /* @__PURE__ */ jsx15("div", { className: classNames13("p-2 dark:bg-white/5", iconPallete.icon), children: React11.isValidElement(icon) ? icon : renderIcon2(icon, iconSize, iconSizes[iconSize]) }),
        /* @__PURE__ */ jsxs12("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx15(
            "p",
            {
              className: classNames13(
                textSizes[textSize],
                "font-semibold",
                palette.text
              ),
              children: title
            }
          ),
          subtitle && /* @__PURE__ */ jsx15(
            "p",
            {
              className: classNames13(
                textSizes[subtitleTextSize],
                "leading-relaxed break-all",
                palette.text
              ),
              children: subtitle
            }
          )
        ] }),
        actionLabel && onAction && /* @__PURE__ */ jsx15("div", { className: "mt-4", children: /* @__PURE__ */ jsx15(
          Button_default,
          {
            size: actionSize,
            variant: actionVariant,
            color: actionColor,
            onClick: onAction,
            leadingIcon: actionLeadingIcon,
            children: actionLabel
          }
        ) })
      ]
    }
  );
};
var EmptyState_default = EmptyState;

// src/components/Hero.tsx
import classNames14 from "classnames";

// src/components/CustomIcon.tsx
import { useMemo as useMemo2 } from "react";

// src/icons/components/Add.tsx
import { forwardRef as forwardRef4 } from "react";
import { jsx as jsx16 } from "react/jsx-runtime";
var Add = forwardRef4(
  (props, ref) => /* @__PURE__ */ jsx16(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx16(
        "path",
        {
          d: "M5.15186 12C5.15186 11.7952 5.2238 11.6209 5.36768 11.4771C5.51709 11.3276 5.69141 11.2529 5.89062 11.2529H11.2612V5.89062C11.2612 5.69141 11.3332 5.51986 11.4771 5.37598C11.6209 5.22656 11.7952 5.15186 12 5.15186C12.2048 5.15186 12.3791 5.22656 12.5229 5.37598C12.6724 5.51986 12.7471 5.69141 12.7471 5.89062V11.2529H18.1094C18.3086 11.2529 18.4801 11.3276 18.624 11.4771C18.7734 11.6209 18.8481 11.7952 18.8481 12C18.8481 12.2048 18.7734 12.3791 18.624 12.5229C18.4801 12.6668 18.3086 12.7388 18.1094 12.7388H12.7471V18.1094C12.7471 18.3086 12.6724 18.4801 12.5229 18.624C12.3791 18.7734 12.2048 18.8481 12 18.8481C11.7952 18.8481 11.6209 18.7734 11.4771 18.624C11.3332 18.4801 11.2612 18.3086 11.2612 18.1094V12.7388H5.89062C5.69141 12.7388 5.51709 12.6668 5.36768 12.5229C5.2238 12.3791 5.15186 12.2048 5.15186 12Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Add.displayName = "Add";

// src/icons/components/ArrowDown.tsx
import { forwardRef as forwardRef5 } from "react";
import { jsx as jsx17 } from "react/jsx-runtime";
var ArrowDown = forwardRef5(
  (props, ref) => /* @__PURE__ */ jsx17(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx17(
        "path",
        {
          d: "M12.146 16.157c-.27 0-.516-.11-.739-.328L6.26 10.565a1.013 1.013 0 0 1-.198-.293.95.95 0 0 1-.062-.35.925.925 0 0 1 .451-.8.91.91 0 0 1 .465-.122.93.93 0 0 1 .67.28l4.874 5.004h-.622l4.86-5.004a.93.93 0 0 1 1.128-.157.909.909 0 0 1 .458.8c0 .25-.089.462-.266.636l-5.134 5.27c-.11.11-.226.191-.349.246a1.08 1.08 0 0 1-.39.082z",
          fill: "currentColor"
        }
      )
    }
  )
);
ArrowDown.displayName = "ArrowDown";

// src/icons/components/ArrowLeft.tsx
import { forwardRef as forwardRef6 } from "react";
import { jsx as jsx18 } from "react/jsx-runtime";
var ArrowLeft = forwardRef6(
  (props, ref) => /* @__PURE__ */ jsx18(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx18("path", { d: "M 11,7 A 1,1 0 0 0 10.292969,7.2929687 L 6.2929687,11.292969 A 1,1 0 0 0 6,12 1,1 0 0 0 6.2929687,12.707031 l 4.0000003,4 a 1,1 0 0 0 1.414062,0 1,1 0 0 0 0,-1.414062 L 9.4140625,13 H 17 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 H 9.4140625 L 11.707031,8.7070313 a 1,1 0 0 0 0,-1.4140626 A 1,1 0 0 0 11,7 Z" })
    }
  )
);
ArrowLeft.displayName = "ArrowLeft";

// src/icons/components/ArrowRight.tsx
import { forwardRef as forwardRef7 } from "react";
import { jsx as jsx19 } from "react/jsx-runtime";
var ArrowRight = forwardRef7(
  (props, ref) => /* @__PURE__ */ jsx19(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx19(
        "path",
        {
          d: "m 13,7 a 1,1 0 0 0 -0.707031,0.2929687 1,1 0 0 0 0,1.4140626 L 14.585938,11 H 7 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 7.585938 l -2.292969,2.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.414062,0 l 4,-4 a 1,1 0 0 0 0.259766,-0.447265 1,1 0 0 0 0,-0.179688 A 1,1 0 0 0 18,12 a 1,1 0 0 0 -0.0332,-0.166016 1,1 0 0 0 -0.02734,-0.142578 1,1 0 0 0 -0.232422,-0.398437 l -4,-4.0000003 A 1,1 0 0 0 13,7 Z",
          id: "Vector"
        }
      )
    }
  )
);
ArrowRight.displayName = "ArrowRight";

// src/icons/components/ArrowUp.tsx
import { forwardRef as forwardRef8 } from "react";
import { jsx as jsx20 } from "react/jsx-runtime";
var ArrowUp = forwardRef8(
  (props, ref) => /* @__PURE__ */ jsx20(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx20(
        "path",
        {
          d: "m 12.137985,8.9997632 c 0.27,0 0.516,0.11 0.739,0.328 l 5.147,5.2639998 a 1.013,1.013 0 0 1 0.198,0.293 0.95,0.95 0 0 1 0.062,0.35 0.925,0.925 0 0 1 -0.451,0.8 0.91,0.91 0 0 1 -0.465,0.122 0.93,0.93 0 0 1 -0.67,-0.28 l -4.874,-5.004 h 0.622 l -4.8600002,5.004 a 0.93,0.93 0 0 1 -1.128,0.157 0.909,0.909 0 0 1 -0.458,-0.8 c 0,-0.25 0.089,-0.462 0.266,-0.636 L 11.399985,9.3277632 c 0.11,-0.11 0.226,-0.191 0.349,-0.246 a 1.08,1.08 0 0 1 0.39,-0.082 z",
          fill: "currentColor"
        }
      )
    }
  )
);
ArrowUp.displayName = "ArrowUp";

// src/icons/components/Attached.tsx
import { forwardRef as forwardRef9 } from "react";
import { jsx as jsx21 } from "react/jsx-runtime";
var Attached = forwardRef9(
  (props, ref) => /* @__PURE__ */ jsx21(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx21(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M9.5 7.45C9.5 5.54462 11.0446 4 12.95 4C14.8554 4 16.4 5.54462 16.4 7.45V14.7C16.4 17.2957 14.2957 19.4 11.7 19.4C9.10426 19.4 7 17.2957 7 14.7V8.2C7 7.8134 7.3134 7.5 7.7 7.5C8.0866 7.5 8.4 7.8134 8.4 8.2V14.7C8.4 16.5225 9.87746 18 11.7 18C13.5225 18 15 16.5225 15 14.7V7.45C15 6.31782 14.0822 5.4 12.95 5.4C11.8178 5.4 10.9 6.31782 10.9 7.45V14.2C10.9 14.6418 11.2582 15 11.7 15C12.1418 15 12.5 14.6418 12.5 14.2V8.2C12.5 7.8134 12.8134 7.5 13.2 7.5C13.5866 7.5 13.9 7.8134 13.9 8.2V14.2C13.9 15.415 12.915 16.4 11.7 16.4C10.485 16.4 9.5 15.415 9.5 14.2V7.45Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Attached.displayName = "Attached";

// src/icons/components/Attachment.tsx
import { forwardRef as forwardRef10 } from "react";
import { jsx as jsx22 } from "react/jsx-runtime";
var Attachment = forwardRef10(
  (props, ref) => /* @__PURE__ */ jsx22(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx22(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M9.5 7.45C9.5 5.54462 11.0446 4 12.95 4C14.8554 4 16.4 5.54462 16.4 7.45V14.7C16.4 17.2957 14.2957 19.4 11.7 19.4C9.10426 19.4 7 17.2957 7 14.7V8.2C7 7.8134 7.3134 7.5 7.7 7.5C8.0866 7.5 8.4 7.8134 8.4 8.2V14.7C8.4 16.5225 9.87746 18 11.7 18C13.5225 18 15 16.5225 15 14.7V7.45C15 6.31782 14.0822 5.4 12.95 5.4C11.8178 5.4 10.9 6.31782 10.9 7.45V14.2C10.9 14.6418 11.2582 15 11.7 15C12.1418 15 12.5 14.6418 12.5 14.2V8.2C12.5 7.8134 12.8134 7.5 13.2 7.5C13.5866 7.5 13.9 7.8134 13.9 8.2V14.2C13.9 15.415 12.915 16.4 11.7 16.4C10.485 16.4 9.5 15.415 9.5 14.2V7.45Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Attachment.displayName = "Attachment";

// src/icons/components/Back.tsx
import { forwardRef as forwardRef11 } from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
var Back = forwardRef11(
  (props, ref) => /* @__PURE__ */ jsx23(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx23(
        "path",
        {
          d: "M4 10L3.29289 10.7071L2.58579 10L3.29289 9.29289L4 10ZM21 18C21 18.5523 20.5523 19 20 19C19.4477 19 19 18.5523 19 18L21 18ZM8.29289 15.7071L3.29289 10.7071L4.70711 9.29289L9.70711 14.2929L8.29289 15.7071ZM3.29289 9.29289L8.29289 4.29289L9.70711 5.70711L4.70711 10.7071L3.29289 9.29289ZM4 9L14 9L14 11L4 11L4 9ZM21 16L21 18L19 18L19 16L21 16ZM14 9C17.866 9 21 12.134 21 16L19 16C19 13.2386 16.7614 11 14 11L14 9Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Back.displayName = "Back";

// src/icons/components/Blueprint.tsx
import { forwardRef as forwardRef12 } from "react";
import { jsx as jsx24, jsxs as jsxs13 } from "react/jsx-runtime";
var Blueprint = forwardRef12(
  (props, ref) => /* @__PURE__ */ jsxs13(
    "svg",
    {
      fill: "currentColor",
      version: "1.1",
      id: "Layer_1",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 512 512",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx24("path", { d: "M508.489,48.861c-2.213-1.67-5.078-2.201-7.741-1.442L338.391,93.808L176.035,47.419c-1.585-0.453-3.265-0.453-4.85,0 L6.403,94.5C2.613,95.584,0,99.047,0,102.989v353.103c0,2.769,1.301,5.379,3.511,7.047c1.55,1.169,3.42,1.781,5.318,1.781 c0.811,0,1.627-0.112,2.425-0.339l162.356-46.388l162.356,46.388c1.585,0.453,3.265,0.453,4.85,0l164.782-47.08 c3.79-1.084,6.403-4.547,6.403-8.489V55.908C512,53.137,510.699,50.529,508.489,48.861z M164.782,273.268 c-3.205,2.046-4.834,6.018-3.736,9.862c0.614,2.15,1.989,3.863,3.736,4.982v43.621l-88.276,25.221v-40.49l10.573-3.02 c4.688-1.338,7.402-6.225,6.063-10.912c-1.339-4.688-6.229-7.405-10.913-6.062l-5.723,1.633v-69.474 c20.122-4.1,35.31-21.935,35.31-43.249c0-4.876-3.952-8.828-8.828-8.828s-8.828,3.951-8.828,8.828 c0,11.508-7.381,21.319-17.655,24.964v-46.89l88.276-25.222V273.268z M164.782,119.87l-99.529,28.435 c-3.79,1.084-6.402,4.547-6.402,8.489v152.802v0.005v59.055c0,2.771,1.299,5.379,3.511,7.047 c2.212,1.668,5.076,2.205,7.741,1.441l94.679-27.05v52.257L17.655,444.389V109.647l147.126-42.036V119.87z M329.563,444.388 l-147.126-42.037v-52.258l147.126,42.036V444.388z M329.563,238.977v0.005v134.788l-147.126-42.036V138.231l64.736,18.496v11 c0,4.876,3.952,8.828,8.828,8.828s8.828-3.951,8.828-8.828v-5.956l64.736,18.496V238.977z M329.563,161.907l-147.126-42.036 V67.612l147.126,42.037V161.907z M347.218,245.844l10.573-3.02c4.688-1.338,7.402-6.225,6.063-10.912 c-1.339-4.687-6.228-7.409-10.913-6.062l-5.723,1.633v-47.216l88.276-25.221v47.602c-3.205,2.046-4.834,6.018-3.736,9.862 c0.614,2.15,1.989,3.863,3.736,4.982v65.88c-20.122,4.1-35.31,21.935-35.31,43.249c0,4.876,3.952,8.828,8.828,8.828 s8.828-3.951,8.828-8.828c0-11.508,7.38-21.319,17.655-24.964v46.89l-88.276,25.222V245.844z M494.345,402.353l-147.126,42.036 V392.13l99.528-28.435c3.79-1.084,6.403-4.547,6.403-8.489V143.344c0-2.771-1.301-5.379-3.511-7.047 c-2.212-1.669-5.079-2.207-7.741-1.441l-94.679,27.05v-52.258l147.126-42.037V402.353z" }),
        " ",
        /* @__PURE__ */ jsx24("path", { d: "M414.784,217.361c-1.339-4.687-6.228-7.406-10.913-6.062l-16.976,4.85c-4.688,1.339-7.402,6.225-6.063,10.912 c1.108,3.876,4.641,6.404,8.483,6.404c0.803,0,1.62-0.111,2.431-0.343l16.976-4.85 C413.409,226.934,416.123,222.048,414.784,217.361z" }),
        " ",
        /* @__PURE__ */ jsx24("path", { d: "M110.118,297.68c1.108,3.877,4.642,6.404,8.483,6.404c0.803,0,1.62-0.111,2.429-0.343l16.976-4.85 c4.688-1.339,7.402-6.225,6.063-10.912c-1.338-4.686-6.224-7.407-10.912-6.062l-16.976,4.85 C111.492,288.108,108.778,292.993,110.118,297.68z" }),
        " ",
        /* @__PURE__ */ jsx24("path", { d: "M223.971,298.971c-1.339,4.687,1.375,9.574,6.063,10.913l47.08,13.453c0.81,0.232,1.627,0.342,2.429,0.342 c3.841,0,7.375-2.528,8.484-6.405c1.341-4.687-1.375-9.573-6.063-10.912l-47.08-13.453 C230.202,291.567,225.312,294.284,223.971,298.971z" }),
        " ",
        /* @__PURE__ */ jsx24("path", { d: "M256,229.52c4.875,0,8.828-3.951,8.828-8.828v-17.655c0-4.876-3.952-8.828-8.828-8.828s-8.828,3.951-8.828,8.828v17.655 C247.172,225.568,251.125,229.52,256,229.52z" }),
        " ",
        /* @__PURE__ */ jsx24("path", { d: "M256,282.485c4.875,0,8.828-3.951,8.828-8.828v-17.655c0-4.876-3.952-8.828-8.828-8.828s-8.828,3.951-8.828,8.828v17.655 C247.172,278.534,251.125,282.485,256,282.485z" })
      ]
    }
  )
);
Blueprint.displayName = "Blueprint";

// src/icons/components/Bug.tsx
import { forwardRef as forwardRef13 } from "react";
import { jsx as jsx25 } from "react/jsx-runtime";
var Bug = forwardRef13(
  (props, ref) => /* @__PURE__ */ jsx25(
    "svg",
    {
      viewBox: "-1.44 -1.44 26.88 26.88",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx25(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M17.3859 2.64323C17.7411 2.43012 17.8562 1.96943 17.6431 1.61424C17.43 1.25906 16.9693 1.14388 16.6141 1.35699L14.2687 2.76426C13.582 2.43471 12.8126 2.25011 12 2.25011C11.1874 2.25011 10.418 2.43471 9.73131 2.76426L7.38587 1.35699C7.03069 1.14388 6.56999 1.25906 6.35688 1.61424C6.14377 1.96943 6.25894 2.43012 6.61413 2.64323L8.37676 3.70081C7.37449 4.65692 6.75 6.00559 6.75 7.50011V7.79077C6.49339 7.92641 6.25088 8.08518 6.02526 8.2643C5.95652 8.19683 5.87356 8.14157 5.77854 8.10356L3.77854 7.30356C3.39396 7.14973 2.95748 7.33679 2.80364 7.72137C2.64981 8.10596 2.83687 8.54244 3.22146 8.69628L4.99257 9.40472C4.52263 10.1351 4.25 11.0045 4.25 11.9376V13.2501H2C1.58579 13.2501 1.25 13.5859 1.25 14.0001C1.25 14.4143 1.58579 14.7501 2 14.7501H4.25V15.0001C4.25 16.2791 4.55983 17.4858 5.10854 18.5491L3.22146 19.304C2.83687 19.4578 2.64981 19.8943 2.80364 20.2789C2.95748 20.6634 3.39396 20.8505 3.77854 20.6967L5.77854 19.8967C5.83233 19.8752 5.88225 19.8481 5.92792 19.8164C7.34764 21.6039 9.53996 22.7501 12 22.7501C14.46 22.7501 16.6524 21.6039 18.0721 19.8164C18.1177 19.8481 18.1677 19.8752 18.2215 19.8967L20.2215 20.6967C20.606 20.8505 21.0425 20.6634 21.1964 20.2789C21.3502 19.8943 21.1631 19.4578 20.7785 19.304L18.8915 18.5491C19.4402 17.4858 19.75 16.2791 19.75 15.0001V14.7501H22C22.4142 14.7501 22.75 14.4143 22.75 14.0001C22.75 13.5859 22.4142 13.2501 22 13.2501H19.75V11.9376C19.75 11.0045 19.4774 10.1351 19.0074 9.40472L20.7785 8.69628C21.1631 8.54244 21.3502 8.10596 21.1964 7.72137C21.0425 7.33679 20.606 7.14973 20.2215 7.30356L18.2215 8.10356C18.1264 8.14157 18.0435 8.19683 17.9747 8.2643C17.7491 8.08518 17.5066 7.92641 17.25 7.79077V7.50011C17.25 6.00559 16.6255 4.65692 15.6232 3.70081L17.3859 2.64323ZM5.75 15.0001V11.9376C5.75 10.1772 7.17709 8.75011 8.9375 8.75011H15.0625C16.8229 8.75011 18.25 10.1772 18.25 11.9376V15.0001C18.25 18.1981 15.8482 20.8351 12.75 21.2056V15.0001C12.75 14.5859 12.4142 14.2501 12 14.2501C11.5858 14.2501 11.25 14.5859 11.25 15.0001V21.2056C8.15183 20.8351 5.75 18.1981 5.75 15.0001ZM12 3.75011C14.0037 3.75011 15.6404 5.32165 15.7447 7.2994C15.522 7.26693 15.2942 7.25011 15.0625 7.25011H8.9375C8.70578 7.25011 8.47799 7.26693 8.25528 7.2994C8.35958 5.32165 9.99627 3.75011 12 3.75011Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Bug.displayName = "Bug";

// src/icons/components/Chat.tsx
import { forwardRef as forwardRef14 } from "react";
import { jsx as jsx26 } from "react/jsx-runtime";
var Chat = forwardRef14(
  (props, ref) => /* @__PURE__ */ jsx26(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx26(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M3 13.7344V13H4.53906V13.6797C4.53906 14.4036 4.71875 14.9505 5.07812 15.3203C5.43229 15.6849 5.97917 15.8672 6.71875 15.8672H11.5781C11.8177 15.8672 12.0104 15.8958 12.1562 15.9531C12.2969 16.0052 12.4505 16.1146 12.6172 16.2812L15.0938 18.7344V16.5078C15.0938 16.2734 15.1458 16.1094 15.25 16.0156C15.349 15.9167 15.5078 15.8672 15.7266 15.8672H16.7969C17.5312 15.8672 18.0781 15.6849 18.4375 15.3203C18.7917 14.9505 18.9688 14.4036 18.9688 13.6797V7.71875C18.9688 7 18.7917 6.45833 18.4375 6.09375C18.0781 5.72396 17.5312 5.53906 16.7969 5.53906H14.75V4H16.8359C17.6224 4 18.2891 4.14583 18.8359 4.4375C19.3776 4.72917 19.7917 5.14844 20.0781 5.69531C20.3646 6.23698 20.5078 6.89583 20.5078 7.67188V13.7344C20.5078 14.5104 20.3646 15.1719 20.0781 15.7188C19.7865 16.2604 19.3724 16.6771 18.8359 16.9688C18.2943 17.2604 17.6458 17.4062 16.8906 17.4062H16.4688V19.3281C16.4688 19.6771 16.3828 19.9531 16.2109 20.1562C16.0339 20.3594 15.7891 20.4609 15.4766 20.4609C15.2578 20.4609 15.0521 20.4036 14.8594 20.2891C14.6667 20.1797 14.4375 20.0078 14.1719 19.7734L11.5 17.4062H6.67188C5.89062 17.4062 5.22656 17.2604 4.67969 16.9688C4.13281 16.6771 3.71615 16.2604 3.42969 15.7188C3.14323 15.1719 3 14.5104 3 13.7344ZM10.75 4H12.35V11H10.75V4ZM5.8498 4.2002C4.30341 4.2002 3.0498 5.4538 3.0498 7.0002V11.0002H4.6498V9.3002H7.5498V11.0002H9.14981V7.0002C9.14981 5.4538 7.8962 4.2002 6.3498 4.2002H5.8498ZM7.5498 7.7002V7.0002C7.5498 6.33745 7.01255 5.8002 6.3498 5.8002H5.8498C5.18706 5.8002 4.6498 6.33745 4.6498 7.0002V7.7002H7.5498Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Chat.displayName = "Chat";

// src/icons/components/CheckCircle.tsx
import { forwardRef as forwardRef15 } from "react";
import { jsx as jsx27 } from "react/jsx-runtime";
var CheckCircle = forwardRef15(
  (props, ref) => /* @__PURE__ */ jsx27(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx27(
        "path",
        {
          d: "M12.148 20.297a7.862 7.862 0 0 1-3.164-.64 8.291 8.291 0 0 1-2.601-1.75 8.198 8.198 0 0 1-1.75-2.595A7.947 7.947 0 0 1 4 12.149c0-1.125.21-2.18.633-3.164a8.227 8.227 0 0 1 4.352-4.352A7.946 7.946 0 0 1 12.147 4c1.125 0 2.18.21 3.165.633a8.134 8.134 0 0 1 2.593 1.758 8.198 8.198 0 0 1 1.75 2.593c.427.985.64 2.04.64 3.164 0 1.125-.213 2.18-.64 3.165a8.196 8.196 0 0 1-4.343 4.343c-.985.427-2.04.64-3.165.64zm0-1.79a6.283 6.283 0 0 0 4.492-1.86 6.49 6.49 0 0 0 1.368-2.03c.333-.77.5-1.594.5-2.469 0-.88-.167-1.703-.5-2.468a6.373 6.373 0 0 0-1.367-2.032 6.284 6.284 0 0 0-4.493-1.859c-.88 0-1.705.164-2.476.492a6.399 6.399 0 0 0-3.39 3.399 6.2 6.2 0 0 0-.493 2.468c0 .875.164 1.698.492 2.47a6.398 6.398 0 0 0 3.39 3.398c.772.328 1.597.492 2.477.492zm-.843-2.648a.855.855 0 0 1-.414-.101 1.276 1.276 0 0 1-.344-.297l-1.805-2.188c-.146-.182-.219-.367-.219-.554 0-.209.073-.386.22-.531a.714.714 0 0 1 .523-.22.71.71 0 0 1 .336.079c.099.052.197.138.296.258l1.391 1.75L14.25 9.28c.177-.281.398-.422.664-.422.198 0 .375.065.531.196.157.13.235.3.235.508a.67.67 0 0 1-.063.273 1.515 1.515 0 0 1-.14.273l-3.43 5.344c-.182.271-.43.406-.742.406z",
          fill: "currentColor"
        }
      )
    }
  )
);
CheckCircle.displayName = "CheckCircle";

// src/icons/components/ChevronLeft.tsx
import { forwardRef as forwardRef16 } from "react";
import { jsx as jsx28 } from "react/jsx-runtime";
var ChevronLeft = forwardRef16(
  (props, ref) => /* @__PURE__ */ jsx28(
    "svg",
    {
      viewBox: "0 0 20 20",
      fill: "none",
      version: "1.1",
      id: "svg1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx28(
        "path",
        {
          fill: "currentColor",
          d: "m 13,3 a 1,1 0 0 0 -0.707031,0.2929688 l -6.0000003,6 a 1.0001,1.0001 0 0 0 0,1.4140622 l 6.0000003,6 a 1,1 0 0 0 1.414062,0 1,1 0 0 0 0,-1.414062 L 8.4140625,10 13.707031,4.7070312 a 1,1 0 0 0 0,-1.4140624 A 1,1 0 0 0 13,3 Z"
        }
      )
    }
  )
);
ChevronLeft.displayName = "ChevronLeft";

// src/icons/components/ChevronRight.tsx
import { forwardRef as forwardRef17 } from "react";
import { jsx as jsx29 } from "react/jsx-runtime";
var ChevronRight = forwardRef17(
  (props, ref) => /* @__PURE__ */ jsx29(
    "svg",
    {
      viewBox: "0 0 20 20",
      fill: "none",
      version: "1.1",
      id: "svg1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx29(
        "path",
        {
          d: "m 7,3 a 1,1 0 0 0 -0.7070313,0.2929688 1,1 0 0 0 0,1.4140624 L 11.585938,10 6.2929687,15.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140625,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.4140622 l -5.9999998,-6 A 1,1 0 0 0 7,3 Z",
          fill: "currentColor"
        }
      )
    }
  )
);
ChevronRight.displayName = "ChevronRight";

// src/icons/components/Clean.tsx
import { forwardRef as forwardRef18 } from "react";
import { jsx as jsx30 } from "react/jsx-runtime";
var Clean = forwardRef18(
  (props, ref) => /* @__PURE__ */ jsx30(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx30(
        "path",
        {
          d: "M20.0967 12.3593C20.0967 13.3645 19.9274 14.3124 19.5889 15.203C19.2503 16.0937 18.7764 16.8983 18.167 17.6171C17.5628 18.3306 16.8519 18.9244 16.0342 19.3983C15.2217 19.8775 14.3389 20.203 13.3857 20.3749V21.3202C13.3857 21.5181 13.3389 21.6666 13.2451 21.7655C13.1566 21.8645 13.042 21.9114 12.9014 21.9062C12.7607 21.9062 12.6149 21.8515 12.4639 21.7421L9.91699 19.8827C9.74512 19.7577 9.65918 19.6067 9.65918 19.4296C9.66439 19.2577 9.75033 19.1093 9.91699 18.9843L12.4717 17.1249C12.6175 17.0207 12.7607 16.966 12.9014 16.9608C13.042 16.9556 13.1566 17.0051 13.2451 17.1093C13.3389 17.2082 13.3857 17.3541 13.3857 17.5468V18.5312C14.0889 18.3749 14.7399 18.1093 15.3389 17.7343C15.9378 17.3541 16.4587 16.8905 16.9014 16.3437C17.3441 15.7916 17.6878 15.1796 17.9326 14.5077C18.1826 13.8306 18.3076 13.1145 18.3076 12.3593C18.3076 11.5155 18.1488 10.7213 17.8311 9.97646C17.5133 9.23167 17.0785 8.58063 16.5264 8.02334C16.3232 7.77855 16.2321 7.54417 16.2529 7.32021C16.279 7.09626 16.3649 6.91136 16.5107 6.76553C16.6774 6.59886 16.891 6.51032 17.1514 6.4999C17.4118 6.48949 17.641 6.60146 17.8389 6.83584C18.5368 7.53896 19.0863 8.36709 19.4873 9.32021C19.8936 10.2681 20.0967 11.2812 20.0967 12.3593ZM3.7998 12.3593C3.7998 11.3541 3.96908 10.4062 4.30762 9.51553C4.64616 8.61969 5.12012 7.81501 5.72949 7.10146C6.33887 6.38271 7.0498 5.78636 7.8623 5.3124C8.6748 4.83324 9.55762 4.51032 10.5107 4.34365V3.39834C10.5107 3.19521 10.555 3.04417 10.6436 2.94521C10.7373 2.84626 10.8545 2.79938 10.9951 2.80459C11.1357 2.80459 11.279 2.85928 11.4248 2.96865L13.9795 4.83584C14.1514 4.96084 14.2373 5.11188 14.2373 5.28896C14.2373 5.46084 14.1514 5.60928 13.9795 5.73428L11.4248 7.59365C11.279 7.69782 11.1357 7.75251 10.9951 7.75771C10.8545 7.76292 10.7373 7.71605 10.6436 7.61709C10.555 7.51292 10.5107 7.36449 10.5107 7.17178V6.1874C9.80762 6.34365 9.15658 6.61188 8.55762 6.99209C7.95866 7.36709 7.43522 7.83063 6.9873 8.38271C6.5446 8.92959 6.20085 9.54157 5.95605 10.2187C5.71126 10.8905 5.58887 11.6041 5.58887 12.3593C5.58887 13.203 5.74772 13.9973 6.06543 14.7421C6.38314 15.4869 6.81803 16.1353 7.37012 16.6874C7.57324 16.9374 7.66178 17.1744 7.63574 17.3983C7.6097 17.6223 7.52637 17.8046 7.38574 17.9452C7.21908 18.1119 7.00553 18.2004 6.74512 18.2108C6.4847 18.2265 6.25293 18.1171 6.0498 17.8827C5.35189 17.1744 4.80241 16.3463 4.40137 15.3983C4.00033 14.4452 3.7998 13.4322 3.7998 12.3593Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Clean.displayName = "Clean";

// src/icons/components/Close.tsx
import { forwardRef as forwardRef19 } from "react";
import { jsx as jsx31 } from "react/jsx-runtime";
var Close = forwardRef19(
  (props, ref) => /* @__PURE__ */ jsx31(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx31(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M10.9393 12L6.9696 15.9697L8.03026 17.0304L12 13.0607L15.9697 17.0304L17.0304 15.9697L13.0607 12L17.0303 8.03039L15.9696 6.96973L12 10.9393L8.03038 6.96973L6.96972 8.03039L10.9393 12Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Close.displayName = "Close";

// src/icons/components/Close1.tsx
import { forwardRef as forwardRef20 } from "react";
import { jsx as jsx32 } from "react/jsx-runtime";
var Close1 = forwardRef20(
  (props, ref) => /* @__PURE__ */ jsx32(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx32(
        "path",
        {
          d: "M 7.1576421,16.842346 C 7.0128266,16.697531 6.9404471,16.523413 6.9405037,16.319992 6.9404401,16.108631 7.010882,15.932547 7.1517448,15.791685 L 10.949318,11.994111 7.1576138,8.2024065 C 7.016751,8.0615437 6.9463585,7.8893279 6.9463727,7.6858367 6.9423987,7.4784988 7.0128266,7.3024292 7.1576421,7.1576138 7.3024575,7.0127983 7.4785271,6.9423705 7.685865,6.9463444 c 0.2074509,-0.00397 0.381576,0.064509 0.5224387,0.2053721 l 3.7917043,3.7917045 3.791719,-3.7917186 c 0.140856,-0.1408557 0.314945,-0.2093037 0.52241,-0.2053439 0.207324,-0.00396 0.383394,0.066468 0.528209,0.2112836 0.144816,0.1448154 0.215244,0.320885 0.211284,0.5282087 0,0.2035053 -0.07036,0.3756859 -0.211213,0.5165415 l -3.791719,3.7917187 3.797588,3.797588 c 0.140856,0.140855 0.209304,0.314945 0.205344,0.52241 0.004,0.207324 -0.06647,0.383393 -0.211284,0.528209 -0.144815,0.144815 -0.320885,0.215243 -0.528209,0.211283 -0.203505,0 -0.375685,-0.07036 -0.516541,-0.211212 l -3.797588,-3.797588 -3.7975733,3.797574 c -0.1408627,0.140862 -0.3150372,0.213213 -0.5224387,0.21711 -0.2034205,5.6e-5 -0.3775385,-0.07232 -0.5223539,-0.217139 z",
          fill: "#000000"
        }
      )
    }
  )
);
Close1.displayName = "Close1";

// src/icons/components/CloudOff.tsx
import { forwardRef as forwardRef21 } from "react";
import { jsx as jsx33 } from "react/jsx-runtime";
var CloudOff = forwardRef21(
  (props, ref) => /* @__PURE__ */ jsx33(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      version: "1.1",
      id: "svg1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx33(
        "path",
        {
          fill: "currentColor",
          d: "m 3,2 a 1,1 0 0 0 -0.7070312,0.2929688 1,1 0 0 0 0,1.4140625 L 6.421875,7.8359375 C 3.7890261,8.6864035 2,11.020131 2,13.648438 2,17.148958 4.8825427,20 8.4003906,20 H 16.5 c 0.603655,0 1.13929,-0.219048 1.685547,-0.400391 l 2.107422,2.107422 a 1,1 0 0 0 1.414062,0 1,1 0 0 0 0,-1.414062 L 3.7070313,2.2929688 A 1,1 0 0 0 3,2 Z m 9.689453,2 C 11.95139,4 11.239375,4.1262891 10.576172,4.3554687 A 1,1 0 0 0 9.9570313,5.6269531 1,1 0 0 0 11.228516,6.2460937 C 11.688112,6.0872734 12.177916,6 12.689453,6 c 2.477673,0 4.473176,1.9035485 4.611328,4.306641 a 1.0001,1.0001 0 0 0 0.597656,0.859375 C 19.094175,11.688836 20,13.050483 20,14.496094 c 0,0.221516 -0.01982,0.437827 -0.05859,0.646484 a 1,1 0 0 0 0.800781,1.166016 1,1 0 0 0 1.164063,-0.800781 C 21.967272,15.17947 22,14.840578 22,14.496094 22,12.476021 20.840455,10.737125 19.185547,9.7519531 18.765591,6.5230229 16.041315,4 12.689453,4 Z M 7.890625,9.3046875 16.570312,17.984375 C 16.545108,17.984904 16.525359,18 16.5,18 H 8.4003906 C 5.9535585,18 4,16.058117 4,13.648438 4,11.689193 5.4282505,9.8479795 7.6601562,9.4863281 A 1.0001,1.0001 0 0 0 7.890625,9.3046875 Z"
        }
      )
    }
  )
);
CloudOff.displayName = "CloudOff";

// src/icons/components/Cog.tsx
import { forwardRef as forwardRef22 } from "react";
import { jsx as jsx34, jsxs as jsxs14 } from "react/jsx-runtime";
var Cog = forwardRef22(
  (props, ref) => /* @__PURE__ */ jsxs14(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx34("path", { d: "M.63 11.08zm.21.41v-.1zm.23.38L1 11.68zM1 11.68l-.11-.19zm-.21-.29c-.06-.1-.11-.21-.16-.31.05.1.1.21.16.31zm.32.54v-.06z" }),
        /* @__PURE__ */ jsx34("path", { d: "m11.26 12.63 1.83 1.09a7.34 7.34 0 0 0 1-.94 7.48 7.48 0 0 0 1.56-2.86l-1.74-1A5.29 5.29 0 0 0 14 8a5.29 5.29 0 0 0-.08-.9l1.74-1a7.45 7.45 0 0 0-1.33-2.58 7.54 7.54 0 0 0-1.24-1.22l-1.83 1.04a6 6 0 0 0-1.11-.53v-2A8.55 8.55 0 0 0 7.94.53a8.39 8.39 0 0 0-2.26.3v2a7.23 7.23 0 0 0-1.12.54L2.78 2.28A7.46 7.46 0 0 0 .2 6.06l1.72 1a5.29 5.29 0 0 0-.08.9 5.29 5.29 0 0 0 .08.9l-1.73 1a8 8 0 0 0 .43 1.15c.05.1.1.21.16.31v.1l.11.19.12.19v.06a7.69 7.69 0 0 0 1.64 1.78l1.81-1.08a7.23 7.23 0 0 0 1.12.54v2a8.39 8.39 0 0 0 2.26.31 8.56 8.56 0 0 0 2.22-.3v-2a6 6 0 0 0 1.2-.48zm-2.39 1.52a7.57 7.57 0 0 1-.95.06 7.73 7.73 0 0 1-1-.06v-1.69a4.92 4.92 0 0 1-2.53-1.27l-1.54.92a6.22 6.22 0 0 1-1.08-1.61l1.56-.93a4.27 4.27 0 0 1 0-3.17l-1.56-.92a6.11 6.11 0 0 1 1.12-1.62l1.56.93A5 5 0 0 1 7 3.53V1.82a7.73 7.73 0 0 1 1-.06 7.57 7.57 0 0 1 .95.06v1.72a4.9 4.9 0 0 1 2.4 1.26l1.59-.94a6.31 6.31 0 0 1 1.11 1.62l-1.6.94a4.35 4.35 0 0 1 .3 1.58 4.44 4.44 0 0 1-.29 1.55l1.56.93a6.43 6.43 0 0 1-1.11 1.61l-1.58-.93a5 5 0 0 1-2.49 1.28z" }),
        /* @__PURE__ */ jsx34("path", { d: "M7.92 5.49A2.59 2.59 0 0 0 5.25 8a2.59 2.59 0 0 0 2.67 2.51A2.6 2.6 0 0 0 10.6 8a2.6 2.6 0 0 0-2.68-2.51zM8 9.2A1.35 1.35 0 0 1 6.55 8 1.35 1.35 0 0 1 8 6.7 1.35 1.35 0 0 1 9.39 8 1.35 1.35 0 0 1 8 9.2z" })
      ]
    }
  )
);
Cog.displayName = "Cog";

// src/icons/components/Complete.tsx
import { forwardRef as forwardRef23 } from "react";
import { jsx as jsx35 } from "react/jsx-runtime";
var Complete = forwardRef23(
  (props, ref) => /* @__PURE__ */ jsx35(
    "svg",
    {
      fill: "#000000",
      viewBox: "0 0 1920 1920",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx35(
        "path",
        {
          d: "M960 1807.059c-467.125 0-847.059-379.934-847.059-847.059 0-467.125 379.934-847.059 847.059-847.059 467.125 0 847.059 379.934 847.059 847.059 0 467.125-379.934 847.059-847.059 847.059M960 0C430.645 0 0 430.645 0 960s430.645 960 960 960 960-430.645 960-960S1489.355 0 960 0M854.344 1157.975 583.059 886.69l-79.85 79.85 351.135 351.133L1454.4 717.617l-79.85-79.85-520.206 520.208Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Complete.displayName = "Complete";

// src/icons/components/Container.tsx
import { forwardRef as forwardRef24 } from "react";
import { jsx as jsx36, jsxs as jsxs15 } from "react/jsx-runtime";
var Container = forwardRef24(
  (props, ref) => /* @__PURE__ */ jsxs15(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 36 36",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx36("path", { d: "M32,30H4a2,2,0,0,1-2-2V8A2,2,0,0,1,4,6H32a2,2,0,0,1,2,2V28A2,2,0,0,1,32,30ZM4,8V28H32V8Z" }),
        /* @__PURE__ */ jsx36("path", { d: "M9,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,9,25.3Z" }),
        /* @__PURE__ */ jsx36("path", { d: "M14.92,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,14.92,25.3Z" }),
        /* @__PURE__ */ jsx36("path", { d: "M21,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,21,25.3Z" }),
        /* @__PURE__ */ jsx36("path", { d: "M27,25.3a.8.8,0,0,1-.8-.8v-13a.8.8,0,0,1,1.6,0v13A.8.8,0,0,1,27,25.3Z" })
      ]
    }
  )
);
Container.displayName = "Container";

// src/icons/components/CopyClipboard.tsx
import { forwardRef as forwardRef25 } from "react";
import { jsx as jsx37 } from "react/jsx-runtime";
var CopyClipboard = forwardRef25(
  (props, ref) => /* @__PURE__ */ jsx37(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx37(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M15 1.25H10.9436C9.10583 1.24998 7.65019 1.24997 6.51098 1.40314C5.33856 1.56076 4.38961 1.89288 3.64124 2.64124C2.89288 3.38961 2.56076 4.33856 2.40314 5.51098C2.24997 6.65019 2.24998 8.10582 2.25 9.94357V16C2.25 17.8722 3.62205 19.424 5.41551 19.7047C5.55348 20.4687 5.81753 21.1208 6.34835 21.6517C6.95027 22.2536 7.70814 22.5125 8.60825 22.6335C9.47522 22.75 10.5775 22.75 11.9451 22.75H15.0549C16.4225 22.75 17.5248 22.75 18.3918 22.6335C19.2919 22.5125 20.0497 22.2536 20.6517 21.6517C21.2536 21.0497 21.5125 20.2919 21.6335 19.3918C21.75 18.5248 21.75 17.4225 21.75 16.0549V10.9451C21.75 9.57754 21.75 8.47522 21.6335 7.60825C21.5125 6.70814 21.2536 5.95027 20.6517 5.34835C20.1208 4.81753 19.4687 4.55348 18.7047 4.41551C18.424 2.62205 16.8722 1.25 15 1.25ZM17.1293 4.27117C16.8265 3.38623 15.9876 2.75 15 2.75H11C9.09318 2.75 7.73851 2.75159 6.71085 2.88976C5.70476 3.02502 5.12511 3.27869 4.7019 3.7019C4.27869 4.12511 4.02502 4.70476 3.88976 5.71085C3.75159 6.73851 3.75 8.09318 3.75 10V16C3.75 16.9876 4.38624 17.8265 5.27117 18.1293C5.24998 17.5194 5.24999 16.8297 5.25 16.0549V10.9451C5.24998 9.57754 5.24996 8.47522 5.36652 7.60825C5.48754 6.70814 5.74643 5.95027 6.34835 5.34835C6.95027 4.74643 7.70814 4.48754 8.60825 4.36652C9.47522 4.24996 10.5775 4.24998 11.9451 4.25H15.0549C15.8297 4.24999 16.5194 4.24998 17.1293 4.27117ZM7.40901 6.40901C7.68577 6.13225 8.07435 5.9518 8.80812 5.85315C9.56347 5.75159 10.5646 5.75 12 5.75H15C16.4354 5.75 17.4365 5.75159 18.1919 5.85315C18.9257 5.9518 19.3142 6.13225 19.591 6.40901C19.8678 6.68577 20.0482 7.07435 20.1469 7.80812C20.2484 8.56347 20.25 9.56458 20.25 11V16C20.25 17.4354 20.2484 18.4365 20.1469 19.1919C20.0482 19.9257 19.8678 20.3142 19.591 20.591C19.3142 20.8678 18.9257 21.0482 18.1919 21.1469C17.4365 21.2484 16.4354 21.25 15 21.25H12C10.5646 21.25 9.56347 21.2484 8.80812 21.1469C8.07435 21.0482 7.68577 20.8678 7.40901 20.591C7.13225 20.3142 6.9518 19.9257 6.85315 19.1919C6.75159 18.4365 6.75 17.4354 6.75 16V11C6.75 9.56458 6.75159 8.56347 6.85315 7.80812C6.9518 7.07435 7.13225 6.68577 7.40901 6.40901Z",
          fill: "currentColor"
        }
      )
    }
  )
);
CopyClipboard.displayName = "CopyClipboard";

// src/icons/components/Dashboard.tsx
import { forwardRef as forwardRef26 } from "react";
import { jsx as jsx38 } from "react/jsx-runtime";
var Dashboard = forwardRef26(
  (props, ref) => /* @__PURE__ */ jsx38(
    "svg",
    {
      viewBox: "0 0 24 24",
      id: "meteor-icon-kit__solid-dashboard",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx38(
        "path",
        {
          d: "M2 0H7C8.10457 0 9 0.89543 9 2V7C9 8.10457 8.10457 9 7 9H2C0.89543 9 0 8.10457 0 7V2C0 0.89543 0.89543 0 2 0ZM2 11H7C8.10457 11 9 11.8954 9 13V22C9 23.1046 8.10457 24 7 24H2C0.89543 24 0 23.1046 0 22V13C0 11.8954 0.89543 11 2 11ZM13 0H22C23.1046 0 24 0.89543 24 2V13C24 14.1046 23.1046 15 22 15H13C11.8954 15 11 14.1046 11 13V2C11 0.89543 11.8954 0 13 0ZM13 17H22C23.1046 17 24 17.8954 24 19V22C24 23.1046 23.1046 24 22 24H13C11.8954 24 11 23.1046 11 22V19C11 17.8954 11.8954 17 13 17Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Dashboard.displayName = "Dashboard";

// src/icons/components/Details.tsx
import { forwardRef as forwardRef27 } from "react";
import { jsx as jsx39, jsxs as jsxs16 } from "react/jsx-runtime";
var Details = forwardRef27(
  (props, ref) => /* @__PURE__ */ jsxs16(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 36 36",
      version: "1.1",
      preserveAspectRatio: "xMidYMid meet",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx39(
          "path",
          {
            d: "M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H32a2,2,0,0,0,2-2V8A2,2,0,0,0,32,6Zm0,22H4V8H32Z",
            className: "clr-i-outline clr-i-outline-path-1"
          }
        ),
        /* @__PURE__ */ jsx39(
          "path",
          {
            d: "M9,14H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z",
            className: "clr-i-outline clr-i-outline-path-2"
          }
        ),
        /* @__PURE__ */ jsx39(
          "path",
          {
            d: "M9,18H27a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z",
            className: "clr-i-outline clr-i-outline-path-3"
          }
        ),
        /* @__PURE__ */ jsx39(
          "path",
          {
            d: "M9,22H19a1,1,0,0,0,0-2H9a1,1,0,0,0,0,2Z",
            className: "clr-i-outline clr-i-outline-path-4"
          }
        ),
        /* @__PURE__ */ jsx39("rect", { x: "0", y: "0", width: "36", height: "36", "fill-opacity": "0" })
      ]
    }
  )
);
Details.displayName = "Details";

// src/icons/components/DockerCopy.tsx
import { forwardRef as forwardRef28 } from "react";
import { jsx as jsx40 } from "react/jsx-runtime";
var DockerCopy = forwardRef28(
  (props, ref) => /* @__PURE__ */ jsx40(
    "svg",
    {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx40(
        "path",
        {
          fill: "#ff0000",
          d: "M12.342 4.536l.15-.227.262.159.116.083c.28.216.869.768.996 1.684.223-.04.448-.06.673-.06.534 0 .893.124 1.097.227l.105.057.068.045.191.156-.066.2a2.044 2.044 0 01-.47.73c-.29.299-.8.652-1.609.698l-.178.005h-.148c-.37.977-.867 2.078-1.702 3.066a7.081 7.081 0 01-1.74 1.488 7.941 7.941 0 01-2.549.968c-.644.125-1.298.187-1.953.185-1.45 0-2.73-.288-3.517-.792-.703-.449-1.243-1.182-1.606-2.177a8.25 8.25 0 01-.461-2.83.516.516 0 01.432-.516l.068-.005h10.54l.092-.007.149-.016c.256-.034.646-.11.92-.27-.328-.543-.421-1.178-.268-1.854a3.3 3.3 0 01.3-.81l.108-.187zM2.89 5.784l.04.007a.127.127 0 01.077.082l.006.04v1.315l-.006.041a.127.127 0 01-.078.082l-.039.006H1.478a.124.124 0 01-.117-.088l-.007-.04V5.912l.007-.04a.127.127 0 01.078-.083l.039-.006H2.89zm1.947 0l.039.007a.127.127 0 01.078.082l.006.04v1.315l-.007.041a.127.127 0 01-.078.082l-.039.006H3.424a.125.125 0 01-.117-.088L3.3 7.23V5.913a.13.13 0 01.085-.123l.039-.007h1.413zm1.976 0l.039.007a.127.127 0 01.077.082l.007.04v1.315l-.007.041a.127.127 0 01-.078.082l-.039.006H5.4a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.039-.006h1.413zm1.952 0l.039.007a.127.127 0 01.078.082l.007.04v1.315a.13.13 0 01-.085.123l-.04.006H7.353a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.04-.006h1.412zm1.97 0l.039.007a.127.127 0 01.078.082l.006.04v1.315a.13.13 0 01-.085.123l-.039.006H9.322a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.04-.006h1.411zM4.835 3.892l.04.007a.127.127 0 01.077.081l.007.041v1.315a.13.13 0 01-.085.123l-.039.007H3.424a.125.125 0 01-.117-.09l-.007-.04V4.021a.13.13 0 01.085-.122l.039-.007h1.412zm1.976 0l.04.007a.127.127 0 01.077.081l.007.041v1.315a.13.13 0 01-.085.123l-.039.007H5.4a.125.125 0 01-.117-.09l-.006-.04V4.021l.006-.04a.127.127 0 01.078-.082l.039-.007h1.412zm1.953 0c.054 0 .1.037.117.088l.007.041v1.315a.13.13 0 01-.085.123l-.04.007H7.353a.125.125 0 01-.117-.09l-.006-.04V4.021l.006-.04a.127.127 0 01.078-.082l.04-.007h1.412zm0-1.892c.054 0 .1.037.117.088l.007.04v1.316a.13.13 0 01-.085.123l-.04.006H7.353a.124.124 0 01-.117-.088l-.006-.04V2.128l.006-.04a.127.127 0 01.078-.082L7.353 2h1.412z"
        }
      )
    }
  )
);
DockerCopy.displayName = "DockerCopy";

// src/icons/components/Docker.tsx
import { forwardRef as forwardRef29 } from "react";
import { jsx as jsx41 } from "react/jsx-runtime";
var Docker = forwardRef29(
  (props, ref) => /* @__PURE__ */ jsx41(
    "svg",
    {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "#ff0000",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx41(
        "path",
        {
          fill: "currentColor",
          d: "M12.342 4.536l.15-.227.262.159.116.083c.28.216.869.768.996 1.684.223-.04.448-.06.673-.06.534 0 .893.124 1.097.227l.105.057.068.045.191.156-.066.2a2.044 2.044 0 01-.47.73c-.29.299-.8.652-1.609.698l-.178.005h-.148c-.37.977-.867 2.078-1.702 3.066a7.081 7.081 0 01-1.74 1.488 7.941 7.941 0 01-2.549.968c-.644.125-1.298.187-1.953.185-1.45 0-2.73-.288-3.517-.792-.703-.449-1.243-1.182-1.606-2.177a8.25 8.25 0 01-.461-2.83.516.516 0 01.432-.516l.068-.005h10.54l.092-.007.149-.016c.256-.034.646-.11.92-.27-.328-.543-.421-1.178-.268-1.854a3.3 3.3 0 01.3-.81l.108-.187zM2.89 5.784l.04.007a.127.127 0 01.077.082l.006.04v1.315l-.006.041a.127.127 0 01-.078.082l-.039.006H1.478a.124.124 0 01-.117-.088l-.007-.04V5.912l.007-.04a.127.127 0 01.078-.083l.039-.006H2.89zm1.947 0l.039.007a.127.127 0 01.078.082l.006.04v1.315l-.007.041a.127.127 0 01-.078.082l-.039.006H3.424a.125.125 0 01-.117-.088L3.3 7.23V5.913a.13.13 0 01.085-.123l.039-.007h1.413zm1.976 0l.039.007a.127.127 0 01.077.082l.007.04v1.315l-.007.041a.127.127 0 01-.078.082l-.039.006H5.4a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.039-.006h1.413zm1.952 0l.039.007a.127.127 0 01.078.082l.007.04v1.315a.13.13 0 01-.085.123l-.04.006H7.353a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.04-.006h1.412zm1.97 0l.039.007a.127.127 0 01.078.082l.006.04v1.315a.13.13 0 01-.085.123l-.039.006H9.322a.124.124 0 01-.117-.088l-.006-.04V5.912l.006-.04a.127.127 0 01.078-.083l.04-.006h1.411zM4.835 3.892l.04.007a.127.127 0 01.077.081l.007.041v1.315a.13.13 0 01-.085.123l-.039.007H3.424a.125.125 0 01-.117-.09l-.007-.04V4.021a.13.13 0 01.085-.122l.039-.007h1.412zm1.976 0l.04.007a.127.127 0 01.077.081l.007.041v1.315a.13.13 0 01-.085.123l-.039.007H5.4a.125.125 0 01-.117-.09l-.006-.04V4.021l.006-.04a.127.127 0 01.078-.082l.039-.007h1.412zm1.953 0c.054 0 .1.037.117.088l.007.041v1.315a.13.13 0 01-.085.123l-.04.007H7.353a.125.125 0 01-.117-.09l-.006-.04V4.021l.006-.04a.127.127 0 01.078-.082l.04-.007h1.412zm0-1.892c.054 0 .1.037.117.088l.007.04v1.316a.13.13 0 01-.085.123l-.04.006H7.353a.124.124 0 01-.117-.088l-.006-.04V2.128l.006-.04a.127.127 0 01.078-.082L7.353 2h1.412z"
        }
      )
    }
  )
);
Docker.displayName = "Docker";

// src/icons/components/Dots.tsx
import { forwardRef as forwardRef30 } from "react";
import { jsx as jsx42 } from "react/jsx-runtime";
var Dots = forwardRef30(
  (props, ref) => /* @__PURE__ */ jsx42(
    "svg",
    {
      viewBox: "0 0 25 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx42(
        "path",
        {
          d: "M6.555 14.008c-.308 0-.586-.073-.836-.219a1.75 1.75 0 0 1-.602-.601 1.613 1.613 0 0 1-.219-.829c0-.307.073-.586.22-.836.15-.25.35-.447.6-.593.25-.151.53-.227.837-.227.302 0 .578.076.828.227.25.146.448.343.594.593.15.25.226.53.226.836 0 .303-.075.579-.226.829a1.614 1.614 0 0 1-1.422.82zm5.86 0c-.303 0-.58-.073-.83-.219a1.75 1.75 0 0 1-.6-.601 1.613 1.613 0 0 1-.22-.829c0-.307.073-.586.22-.836.15-.25.35-.447.6-.593a1.57 1.57 0 0 1 .83-.227c.301 0 .577.076.827.227.255.146.456.343.602.593.15.25.226.53.226.836 0 .303-.075.579-.226.829-.146.25-.347.45-.602.601-.25.146-.526.219-.828.219zm5.866 0c-.307 0-.586-.073-.836-.219a1.75 1.75 0 0 1-.601-.601 1.613 1.613 0 0 1-.219-.829c0-.307.073-.586.219-.836.15-.25.351-.447.601-.593.25-.151.529-.227.836-.227.302 0 .578.076.828.227.25.146.45.343.602.593.151.25.227.53.227.836 0 .303-.076.579-.227.829a1.75 1.75 0 0 1-.602.601c-.25.146-.526.219-.828.219z",
          fill: "currentColor"
        }
      )
    }
  )
);
Dots.displayName = "Dots";

// src/icons/components/Download.tsx
import { forwardRef as forwardRef31 } from "react";
import { jsx as jsx43 } from "react/jsx-runtime";
var Download = forwardRef31(
  (props, ref) => /* @__PURE__ */ jsx43(
    "svg",
    {
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx43(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M10.553 2.695a.64.64 0 0 0-.469-.195.633.633 0 0 0-.475.195.625.625 0 0 0-.195.456v6.478l.052.957-.326-.436-.865-.931a.58.58 0 0 0-.443-.189.598.598 0 0 0-.41.156.515.515 0 0 0-.176.404c0 .156.06.297.182.423l2.136 2.05a.709.709 0 0 0 .26.177.665.665 0 0 0 .514 0 .788.788 0 0 0 .26-.176l2.136-2.051a.595.595 0 0 0 .182-.423c0-.165-.056-.3-.169-.404a.598.598 0 0 0-.41-.156.6.6 0 0 0-.45.189l-.872.93-.325.437.059-.957V3.15a.625.625 0 0 0-.196-.456zM4.726 16.257c.378.373.927.56 1.648.56h7.513c.72 0 1.267-.187 1.64-.56.378-.374.567-.916.567-1.628V8.288c0-.716-.19-1.259-.567-1.628-.373-.373-.92-.56-1.64-.56h-1.862v1.446h1.738c.282 0 .499.073.65.22.153.144.229.366.229.665v6.048c0 .3-.076.521-.228.664-.152.148-.369.222-.651.222H6.49c-.287 0-.506-.074-.658-.222-.147-.143-.221-.364-.221-.664V8.431c0-.3.074-.52.221-.664.152-.148.371-.221.658-.221h1.738V6.1H6.374c-.72 0-1.27.187-1.648.56-.373.37-.56.912-.56 1.628v6.34c0 .713.187 1.255.56 1.628z",
          fill: "currentColor"
        }
      )
    }
  )
);
Download.displayName = "Download";

// src/icons/components/Edit.tsx
import { forwardRef as forwardRef32 } from "react";
import { jsx as jsx44, jsxs as jsxs17 } from "react/jsx-runtime";
var Edit = forwardRef32(
  (props, ref) => /* @__PURE__ */ jsxs17(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      version: "1.1",
      id: "svg2",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx44("path", { d: "m 19.472656,1.1640625 c -0.44982,0.00947 -0.894876,0.1094418 -1.304687,0.2949219 -0.409924,0.1854726 -0.776127,0.4535327 -1.080078,0.7851562 L 17.109375,2.21875 7.5585937,11.769531 C 6.8612273,12.466898 6.546933,13.495805 6.3828125,14.5 c -0.08206,0.502097 -0.1135749,0.992864 -0.072266,1.447266 0.041309,0.454402 0.112561,0.897717 0.4980468,1.283203 0.3861895,0.386189 0.8305249,0.457876 1.2851563,0.498047 0.4546314,0.04017 0.9472152,0.0073 1.4492188,-0.07617 1.0040072,-0.16687 2.0301232,-0.485202 2.7265622,-1.181641 L 21.785156,6.9550781 C 22.117681,6.6519719 22.385677,6.2842429 22.572266,5.875 22.758696,5.4658203 22.860378,5.0221149 22.871094,4.5722656 22.88181,4.1223759 22.801586,3.6754052 22.634766,3.2578125 22.46785,2.8399944 22.21798,2.4610707 21.900391,2.1425781 21.58274,1.8240241 21.202454,1.5723647 20.785156,1.4042969 20.367832,1.2362182 19.922349,1.1546014 19.472656,1.1640625 Z m 0.03125,1.5 c 0.247107,-0.0052 0.491428,0.038518 0.720703,0.1308594 0.229303,0.092352 0.438732,0.231204 0.613282,0.40625 0.17461,0.1751074 0.310659,0.3837793 0.402343,0.6132812 0.09178,0.2297473 0.136743,0.475646 0.13086,0.7226563 -0.0059,0.2470507 -0.06149,0.4897234 -0.164063,0.7148437 -0.102611,0.2250571 -0.248965,0.4272363 -0.43164,0.59375 A 0.750075,0.750075 0 0 0 20.75,5.8691406 l -9.541016,9.5410154 c -0.253561,0.253561 -1.111101,0.628589 -1.912109,0.761719 -0.4005039,0.06657 -0.7912664,0.08733 -1.0722656,0.0625 -0.2809992,-0.02483 -0.4247051,-0.135643 -0.3535157,-0.06445 0.070486,0.07049 -0.040841,-0.0762 -0.066406,-0.357422 -0.025566,-0.281223 -0.00685,-0.671863 0.058594,-1.072266 0.1308796,-0.800805 0.505179,-1.657522 0.7578126,-1.910156 L 18.169922,3.28125 a 0.750075,0.750075 0 0 0 0.02344,-0.025391 c 0.167049,-0.1822565 0.368474,-0.3277601 0.59375,-0.4296875 0.225189,-0.10192 0.469618,-0.1569034 0.716797,-0.1621094 z" }),
        /* @__PURE__ */ jsx44("path", { d: "M 6,3.25 C 4.74051,3.25 3.531209,3.750041 2.640625,4.640625 1.7500557,5.5312062 1.25,6.740477 1.25,8 v 10 c 0,1.259547 0.5000374,2.468835 1.390625,3.359375 C 3.5312156,22.250025 4.7405194,22.75 6,22.75 h 11 c 1.30862,0 2.362743,-0.60616 2.957031,-1.515625 C 20.55132,20.32491 20.75,19.189773 20.75,18 V 13 A 0.75,0.75 0 0 0 20,12.25 0.75,0.75 0 0 0 19.25,13 v 5 c 0,1.010227 -0.195616,1.873528 -0.548828,2.414062 C 18.34796,20.954597 17.90138,21.25 17,21.25 H 6 C 5.1377406,21.25 4.3108813,20.908578 3.7011719,20.298828 3.0914795,19.689168 2.75,18.862253 2.75,18 V 8 C 2.75,7.137783 3.0914612,6.3108907 3.7011719,5.7011719 4.3108879,5.0914558 5.13775,4.75 6,4.75 h 5 A 0.75,0.75 0 0 0 11.75,4 0.75,0.75 0 0 0 11,3.25 Z" })
      ]
    }
  )
);
Edit.displayName = "Edit";

// src/icons/components/Equal.tsx
import { forwardRef as forwardRef33 } from "react";
import { jsx as jsx45, jsxs as jsxs18 } from "react/jsx-runtime";
var Equal = forwardRef33(
  (props, ref) => /* @__PURE__ */ jsxs18(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      version: "1.1",
      id: "svg2",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx45(
          "path",
          {
            fill: "currentColor",
            d: "m 9,9 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 6 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          }
        ),
        /* @__PURE__ */ jsx45(
          "path",
          {
            fill: "currentColor",
            d: "m 9,13 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 6 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z"
          }
        )
      ]
    }
  )
);
Equal.displayName = "Equal";

// src/icons/components/Error.tsx
import { forwardRef as forwardRef34 } from "react";
import { jsx as jsx46 } from "react/jsx-runtime";
var Error2 = forwardRef34(
  (props, ref) => /* @__PURE__ */ jsx46(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx46(
        "path",
        {
          d: "M6.084 20c-.433 0-.804-.095-1.115-.284-.31-.19-.55-.448-.717-.774A2.298 2.298 0 0 1 4 17.86c0-.384.1-.752.298-1.105L10.22 6.082a1.96 1.96 0 0 1 .771-.806C11.313 5.092 11.65 5 12 5s.684.092 1 .276c.32.18.58.448.779.806l5.923 10.673c.097.174.17.355.222.545a2.298 2.298 0 0 1-.176 1.642 1.916 1.916 0 0 1-.718.774c-.31.19-.681.284-1.114.284H6.084zm5.924-5.282c.397 0 .598-.215.603-.647l.114-4.295a.658.658 0 0 0-.206-.513A.692.692 0 0 0 12 9.05a.715.715 0 0 0-.527.205.683.683 0 0 0-.19.513l.099 4.303c.01.432.219.647.626.647zm0 2.645a.826.826 0 0 0 .595-.245.793.793 0 0 0 .26-.6.793.793 0 0 0-.26-.6.813.813 0 0 0-.595-.252.821.821 0 0 0-.603.252.82.82 0 0 0-.252.6c0 .237.084.437.252.6a.852.852 0 0 0 .603.245z",
          fill: "currentColor"
        }
      )
    }
  )
);
Error2.displayName = "Error";

// src/icons/components/Export.tsx
import { forwardRef as forwardRef35 } from "react";
import { jsx as jsx47 } from "react/jsx-runtime";
var Export = forwardRef35(
  (props, ref) => /* @__PURE__ */ jsx47(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx47(
        "path",
        {
          d: "M7.64062 21.0547C6.77604 21.0547 6.11719 20.8307 5.66406 20.3828C5.21615 19.9349 4.99219 19.2839 4.99219 18.4297V10.8203C4.99219 9.96094 5.21615 9.3099 5.66406 8.86719C6.11719 8.41927 6.77604 8.19531 7.64062 8.19531H9.86719V9.92969H7.78125C7.4375 9.92969 7.17448 10.0182 6.99219 10.1953C6.8151 10.3672 6.72656 10.6328 6.72656 10.9922V18.25C6.72656 18.6094 6.8151 18.875 6.99219 19.0469C7.17448 19.224 7.4375 19.3125 7.78125 19.3125H16.5078C16.8464 19.3125 17.1068 19.224 17.2891 19.0469C17.4714 18.875 17.5625 18.6094 17.5625 18.25V10.9922C17.5625 10.6328 17.4714 10.3672 17.2891 10.1953C17.1068 10.0182 16.8464 9.92969 16.5078 9.92969H14.4219V8.19531H16.6562C17.5208 8.19531 18.1771 8.41927 18.625 8.86719C19.0781 9.3099 19.3047 9.96094 19.3047 10.8203V18.4297C19.3047 19.2839 19.0781 19.9349 18.625 20.3828C18.1771 20.8307 17.5208 21.0547 16.6562 21.0547H7.64062ZM12.1406 14.625C11.9219 14.625 11.7344 14.5469 11.5781 14.3906C11.4219 14.2344 11.3438 14.0521 11.3438 13.8438V6.07031L11.4141 4.92188L11.0234 5.44531L9.97656 6.5625C9.83073 6.71354 9.65104 6.78906 9.4375 6.78906C9.25 6.78906 9.08594 6.72656 8.94531 6.60156C8.8099 6.47656 8.74219 6.3151 8.74219 6.11719C8.74219 5.92969 8.8151 5.76042 8.96094 5.60938L11.5234 3.14844C11.6328 3.04427 11.737 2.97396 11.8359 2.9375C11.9349 2.89583 12.0365 2.875 12.1406 2.875C12.25 2.875 12.3542 2.89583 12.4531 2.9375C12.5573 2.97396 12.6615 3.04427 12.7656 3.14844L15.3281 5.60938C15.474 5.76042 15.5469 5.92969 15.5469 6.11719C15.5469 6.3151 15.4766 6.47656 15.3359 6.60156C15.1953 6.72656 15.0312 6.78906 14.8438 6.78906C14.6302 6.78906 14.4531 6.71354 14.3125 6.5625L13.2734 5.44531L12.8828 4.92188L12.9453 6.07031V13.8438C12.9453 14.0521 12.8672 14.2344 12.7109 14.3906C12.5599 14.5469 12.3698 14.625 12.1406 14.625Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Export.displayName = "Export";

// src/icons/components/EyeClosed.tsx
import { forwardRef as forwardRef36 } from "react";
import { jsx as jsx48 } from "react/jsx-runtime";
var EyeClosed = forwardRef36(
  (props, ref) => /* @__PURE__ */ jsx48(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      version: "1.1",
      id: "svg1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx48(
        "path",
        {
          fill: "currentColor",
          d: "m 3,2.25 a 0.75,0.75 0 0 0 -0.53125,0.21875 0.75,0.75 0 0 0 0,1.0625 l 18,18 a 0.75,0.75 0 0 0 1.0625,0 0.75,0.75 0 0 0 0,-1.0625 l -18,-18 A 0.75,0.75 0 0 0 3,2.25 Z m 9,2 c -0.370699,0 -0.734042,0.02108 -1.087891,0.0625 -0.372135,0.043564 -0.733865,0.1094654 -1.0859371,0.1933594 A 0.75,0.75 0 0 0 9.2695313,5.4101562 0.75,0.75 0 0 0 10.173828,5.9648437 C 10.470556,5.8941377 10.775626,5.83929 11.087891,5.8027344 11.384842,5.7679745 11.688299,5.75 12,5.75 c 5.519095,0 8.746379,5.65946 9.082031,6.261719 -0.149,0.272042 -0.564523,1.085755 -1.648437,2.330078 a 0.75,0.75 0 0 0 0.07422,1.056641 0.75,0.75 0 0 0 1.058594,-0.07227 c 1.366418,-1.568633 2.09961,-2.980469 2.09961,-2.980469 a 0.750075,0.750075 0 0 0 0,-0.691406 C 22.666016,11.654297 18.913603,4.25 12,4.25 Z m 0,4 A 0.75,0.75 0 0 0 11.25,9 0.75,0.75 0 0 0 12,9.75 c 0.264818,0 0.516006,0.044247 0.75,0.1269531 C 13.387645,10.102328 13.89765,10.612336 14.123047,11.25 14.205757,11.484134 14.25,11.735253 14.25,12 A 0.75,0.75 0 0 0 15,12.75 0.75,0.75 0 0 0 15.75,12 c 0,-0.436453 -0.0746,-0.858534 -0.212891,-1.25 C 15.159906,9.6828644 14.317155,8.8400755 13.25,8.4628906 12.858394,8.3244766 12.436382,8.25 12,8.25 Z m -7.8945313,0.00195 A 0.75,0.75 0 0 0 3.5878906,8.5 C 3.2657323,8.8600661 2.9766988,9.2119003 2.7226563,9.5429688 h 0.00195 C 1.8221237,10.719 1.3339844,11.654297 1.3339844,11.654297 a 0.750075,0.750075 0 0 0 0,0.691406 c 0,0 3.7523759,7.404297 10.6660156,7.404297 0.370655,0 0.733981,-0.02106 1.087891,-0.0625 a 0.75,0.75 0 0 0 0.65625,-0.832031 0.75,0.75 0 0 0 -0.832032,-0.658203 C 12.615219,18.232028 12.311745,18.25 12,18.25 6.4709663,18.25 3.2352034,12.56067 2.9101563,11.976563 3.0416824,11.738675 3.247073,11.326187 3.9140625,10.457031 4.14742,10.15292 4.4107565,9.8289539 4.7050781,9.5 A 0.75,0.75 0 0 0 4.6464844,8.4414063 0.75,0.75 0 0 0 4.1054687,8.2519531 Z M 8.9179688,11.759766 A 0.75,0.75 0 0 0 8.3027344,12.625 c 0.036111,0.215265 0.088994,0.423684 0.1601562,0.625 C 8.8400772,14.31716 9.6828662,15.159907 10.75,15.537109 11.141466,15.675399 11.563547,15.75 12,15.75 A 0.75,0.75 0 0 0 12.75,15 0.75,0.75 0 0 0 12,14.25 c -0.264747,0 -0.515866,-0.04424 -0.75,-0.126953 C 10.612334,13.897649 10.102327,13.38764 9.8769531,12.75 9.8344349,12.629716 9.8028791,12.503935 9.78125,12.375 A 0.75,0.75 0 0 0 8.9179688,11.759766 Z"
        }
      )
    }
  )
);
EyeClosed.displayName = "EyeClosed";

// src/icons/components/EyeOpen.tsx
import { forwardRef as forwardRef37 } from "react";
import { jsx as jsx49, jsxs as jsxs19 } from "react/jsx-runtime";
var EyeOpen = forwardRef37(
  (props, ref) => /* @__PURE__ */ jsxs19(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      version: "1.1",
      id: "svg2",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx49(
          "path",
          {
            fill: "currentColor",
            d: "m 12,4.25 c -6.9136397,0 -10.6660156,7.404297 -10.6660156,7.404297 a 0.750075,0.750075 0 0 0 0,0.691406 c 0,0 3.7523759,7.404297 10.6660156,7.404297 6.913603,0 10.666016,-7.404297 10.666016,-7.404297 a 0.750075,0.750075 0 0 0 0,-0.691406 C 22.666016,11.654297 18.913603,4.25 12,4.25 Z m 0,1.5 c 5.509197,0 8.728011,5.629731 9.074219,6.25 C 20.728011,12.620269 17.509197,18.25 12,18.25 6.4907618,18.25 3.2719846,12.620269 2.9257813,12 3.2719846,11.379731 6.4907618,5.75 12,5.75 Z"
          }
        ),
        /* @__PURE__ */ jsx49(
          "path",
          {
            fill: "currentColor",
            d: "m 12,8.25 c -2.0622051,0 -3.75,1.6877949 -3.75,3.75 0,2.062205 1.6877949,3.75 3.75,3.75 2.062205,0 3.75,-1.687795 3.75,-3.75 0,-2.0622051 -1.687795,-3.75 -3.75,-3.75 z m 0,1.5 c 1.251595,0 2.25,0.998405 2.25,2.25 0,1.251595 -0.998405,2.25 -2.25,2.25 -1.251595,0 -2.25,-0.998405 -2.25,-2.25 0,-1.251595 0.998405,-2.25 2.25,-2.25 z"
          }
        )
      ]
    }
  )
);
EyeOpen.displayName = "EyeOpen";

// src/icons/components/Globe.tsx
import { forwardRef as forwardRef38 } from "react";
import { jsx as jsx50 } from "react/jsx-runtime";
var Globe = forwardRef38(
  (props, ref) => /* @__PURE__ */ jsx50(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      version: "1.1",
      id: "svg3",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx50("path", { d: "M 12 1.9999805 C 6.4889971 1.9999805 1.9999805 6.4889971 1.9999805 12 C 1.9999805 17.511003 6.4889971 22.00002 12 22.00002 C 17.511003 22.00002 22.00002 17.511003 22.00002 12 C 22.00002 6.4889971 17.511003 1.9999805 12 1.9999805 z M 9.7852734 4.3109766 C 9.0156782 5.4315159 8.4068848 6.6714576 7.9985742 7.9999805 L 5.0673633 7.9999805 C 6.0900495 6.2262937 7.7728525 4.8864357 9.7852734 4.3109766 z M 14.215605 4.3112109 C 16.22764 4.8868084 17.910099 6.2265506 18.932637 7.9999805 L 16.002187 7.9999805 C 15.593899 6.671553 14.985141 5.4316872 14.215605 4.3112109 z M 12.000352 4.6819336 C 12.802406 5.6669552 13.444958 6.7859498 13.890996 7.9999805 L 10.109766 7.9999805 C 10.555785 6.7859498 11.198306 5.6669552 12.000352 4.6819336 z M 4.2503906 10.00002 L 7.5475781 10.00002 C 7.4512896 10.65291 7.4003906 11.320575 7.4003906 12.000117 C 7.4003906 12.679594 7.451242 13.347144 7.5475195 13.99998 L 4.2503906 13.99998 C 4.0869542 13.361092 4.0000195 12.691034 4.0000195 12 C 4.0000195 11.308966 4.0869542 10.638908 4.2503906 10.00002 z M 9.575625 10.00002 L 14.425137 10.00002 C 14.538123 10.650072 14.600391 11.317601 14.600391 12.000117 C 14.600391 12.682566 14.538164 13.349987 14.425195 13.99998 L 9.5755664 13.99998 C 9.4626035 13.349987 9.4003711 12.682566 9.4003711 12.000117 C 9.4003711 11.317601 9.4626451 10.650072 9.575625 10.00002 z M 16.453184 10.00002 L 19.749609 10.00002 C 19.913046 10.638908 19.99998 11.308966 19.99998 12 C 19.99998 12.691034 19.913046 13.361092 19.749609 13.99998 L 16.453242 13.99998 C 16.54952 13.347143 16.600371 12.679594 16.600371 12.000117 C 16.600371 11.320574 16.549474 10.652911 16.453184 10.00002 z M 5.0673633 16.00002 L 7.9985742 16.00002 C 8.4068805 17.328528 9.0156658 18.568482 9.7852734 19.689023 C 7.7728525 19.113564 6.0900495 17.773706 5.0673633 16.00002 z M 10.109707 16.00002 L 13.891055 16.00002 C 13.445014 17.214108 12.802482 18.333184 12.00041 19.318242 C 11.198313 18.333184 10.555738 17.214108 10.109707 16.00002 z M 16.002187 16.00002 L 18.932637 16.00002 C 17.91011 17.773429 16.227668 19.113122 14.215664 19.68873 C 14.985177 18.568263 15.593915 17.328417 16.002187 16.00002 z " })
    }
  )
);
Globe.displayName = "Globe";

// src/icons/components/Help.tsx
import { forwardRef as forwardRef39 } from "react";
import { jsx as jsx51 } from "react/jsx-runtime";
var Help = forwardRef39(
  (props, ref) => /* @__PURE__ */ jsx51(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx51(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21ZM12.75 15V16.5H11.25V15H12.75ZM10.5 10.4318C10.5 9.66263 11.1497 9 12 9C12.8503 9 13.5 9.66263 13.5 10.4318C13.5 10.739 13.3151 11.1031 12.9076 11.5159C12.5126 11.9161 12.0104 12.2593 11.5928 12.5292L11.25 12.7509V14.25H12.75V13.5623C13.1312 13.303 13.5828 12.9671 13.9752 12.5696C14.4818 12.0564 15 11.3296 15 10.4318C15 8.79103 13.6349 7.5 12 7.5C10.3651 7.5 9 8.79103 9 10.4318H10.5Z"
        }
      )
    }
  )
);
Help.displayName = "Help";

// src/icons/components/Idea.tsx
import { forwardRef as forwardRef40 } from "react";
import { jsx as jsx52 } from "react/jsx-runtime";
var Idea = forwardRef40(
  (props, ref) => /* @__PURE__ */ jsx52(
    "svg",
    {
      fill: "currentColor",
      viewBox: "-4 0 19 19",
      xmlns: "http://www.w3.org/2000/svg",
      className: "cf-icon-svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx52("path", { d: "M10.328 6.83a5.903 5.903 0 0 1-1.439 3.64 2.874 2.874 0 0 0-.584 1v1.037a.95.95 0 0 1-.95.95h-3.71a.95.95 0 0 1-.95-.95V11.47a2.876 2.876 0 0 0-.584-1A5.903 5.903 0 0 1 .67 6.83a4.83 4.83 0 0 1 9.28-1.878 4.796 4.796 0 0 1 .38 1.88zm-.95 0a3.878 3.878 0 0 0-7.756 0c0 2.363 2.023 3.409 2.023 4.64v1.037h3.71V11.47c0-1.231 2.023-2.277 2.023-4.64zM7.83 14.572a.475.475 0 0 1-.475.476h-3.71a.475.475 0 0 1 0-.95h3.71a.475.475 0 0 1 .475.474zm-.64 1.262a.238.238 0 0 1-.078.265 2.669 2.669 0 0 1-3.274 0 .237.237 0 0 1 .145-.425h2.983a.238.238 0 0 1 .225.16z" })
    }
  )
);
Idea.displayName = "Idea";

// src/icons/components/Image.tsx
import { forwardRef as forwardRef41 } from "react";
import { jsx as jsx53, jsxs as jsxs20 } from "react/jsx-runtime";
var Image = forwardRef41(
  (props, ref) => /* @__PURE__ */ jsxs20(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx53("rect", { width: "24", height: "24", fill: "white" }),
        /* @__PURE__ */ jsx53(
          "path",
          {
            d: "M21 16V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V18M21 16V4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V18M21 16L15.4829 12.3219C15.1843 12.1228 14.8019 12.099 14.4809 12.2595L3 18",
            stroke: "#000000",
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsx53("circle", { cx: "8", cy: "9", r: "2", stroke: "#000000", strokeLinejoin: "round" })
      ]
    }
  )
);
Image.displayName = "Image";

// src/icons/components/Info.tsx
import { forwardRef as forwardRef42 } from "react";
import { jsx as jsx54, jsxs as jsxs21 } from "react/jsx-runtime";
var Info = forwardRef42(
  (props, ref) => /* @__PURE__ */ jsxs21(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx54("path", { d: "M 12 1.25 C 6.0718224 1.25 1.25 6.0718224 1.25 12 1.25 17.928178 6.0718224 22.75 12 22.75 17.928178 22.75 22.75 17.928178 22.75 12 22.75 6.0718224 17.928178 1.25 12 1.25 Z m 0 1.5 c 5.117517 0 9.25 4.1324826 9.25 9.25 0 5.117517 -4.132483 9.25 -9.25 9.25 C 6.8824826 21.25 2.75 17.117517 2.75 12 2.75 6.8824826 6.8824826 2.75 12 2.75 Z" }),
        /* @__PURE__ */ jsx54("path", { d: "M 12 10.25 A 0.75 0.75 0 0 0 11.25 11 v 6 A 0.75 0.75 0 0 0 12 17.75 0.75 0.75 0 0 0 12.75 17 V 11 A 0.75 0.75 0 0 0 12 10.25 Z" }),
        /* @__PURE__ */ jsx54(
          "path",
          {
            transform: "matrix(1 0 0 -1 11 9)",
            d: "M 2 1 A 1 1 0 0 1 1 2 1 1 0 0 1 0 1 1 1 0 0 1 1 0 1 1 0 0 1 2 1 Z"
          }
        )
      ]
    }
  )
);
Info.displayName = "Info";

// src/icons/components/Key.tsx
import { forwardRef as forwardRef43 } from "react";
import { jsx as jsx55 } from "react/jsx-runtime";
var Key = forwardRef43(
  (props, ref) => /* @__PURE__ */ jsx55(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx55(
        "path",
        {
          d: "M18.9771 5.02291L19.5074 4.49258V4.49258L18.9771 5.02291ZM18.9771 14.7904L19.5074 15.3207L18.9771 14.7904ZM7.14558 12.6684L6.61525 12.138L6.61525 12.138L7.14558 12.6684ZM3.43349 16.3804L3.96382 16.9108L3.96382 16.9108L3.43349 16.3804ZM7.61956 20.5665L7.08923 20.0362L7.08923 20.0362L7.61956 20.5665ZM11.3319 16.8541L10.8016 16.3238L11.3319 16.8541ZM3.00906 17.5904L2.26365 17.6732L3.00906 17.5904ZM3.24113 19.679L2.49572 19.7618L2.49572 19.7618L3.24113 19.679ZM4.32101 20.7589L4.23819 21.5043H4.23819L4.32101 20.7589ZM6.4096 20.9909L6.49242 20.2455H6.49242L6.4096 20.9909ZM3.52408 20.2677L4.05441 19.7374L4.05441 19.7374L3.52408 20.2677ZM3.73229 20.4759L3.20196 21.0062L3.20196 21.0063L3.73229 20.4759ZM7.40432 11.6311L6.67789 11.8177H6.67789L7.40432 11.6311ZM12.3689 16.5957L12.1823 17.3221L12.3689 16.5957ZM7.63832 17.063C7.34382 16.7717 6.86895 16.7743 6.57767 17.0688C6.2864 17.3633 6.28901 17.8382 6.58351 18.1294L7.63832 17.063ZM20.0119 8.20635C20.1258 8.60458 20.5411 8.83502 20.9393 8.72105C21.3375 8.60709 21.5679 8.19187 21.454 7.79365L20.0119 8.20635ZM21.3916 12.2267C21.5167 11.8318 21.2981 11.4103 20.9033 11.2851C20.5085 11.1599 20.0869 11.3785 19.9617 11.7733L21.3916 12.2267ZM13.1161 10.8839C12.628 10.3957 12.628 9.60427 13.1161 9.11612L12.0555 8.05546C10.9815 9.1294 10.9815 10.8706 12.0555 11.9445L13.1161 10.8839ZM14.8839 10.8839C14.3957 11.372 13.6043 11.372 13.1161 10.8839L12.0555 11.9445C13.1294 13.0185 14.8706 13.0185 15.9445 11.9445L14.8839 10.8839ZM14.8839 9.11612C15.372 9.60427 15.372 10.3957 14.8839 10.8839L15.9445 11.9445C17.0185 10.8706 17.0185 9.1294 15.9445 8.05546L14.8839 9.11612ZM15.9445 8.05546C14.8706 6.98151 13.1294 6.98151 12.0555 8.05546L13.1161 9.11612C13.6043 8.62796 14.3957 8.62796 14.8839 9.11612L15.9445 8.05546ZM19.5074 4.49258C16.5173 1.50247 11.6694 1.50247 8.67928 4.49258L9.73994 5.55324C12.1443 3.14892 16.0424 3.14892 18.4468 5.55324L19.5074 4.49258ZM6.61525 12.138L2.90316 15.8501L3.96382 16.9108L7.67591 13.1987L6.61525 12.138ZM8.14989 21.0968L9.39029 19.8564L8.32963 18.7958L7.08923 20.0362L8.14989 21.0968ZM9.39029 19.8564L11.8623 17.3845L10.8016 16.3238L8.32963 18.7958L9.39029 19.8564ZM2.26365 17.6732L2.49572 19.7618L3.98654 19.5962L3.75447 17.5076L2.26365 17.6732ZM4.23819 21.5043L6.32678 21.7364L6.49242 20.2455L4.40384 20.0135L4.23819 21.5043ZM2.99375 20.798L3.20196 21.0062L4.26263 19.9456L4.05441 19.7374L2.99375 20.798ZM4.40384 20.0135C4.35042 20.0075 4.30062 19.9836 4.26262 19.9456L3.20196 21.0063C3.48081 21.2851 3.84626 21.4607 4.23819 21.5043L4.40384 20.0135ZM2.49572 19.7618C2.53926 20.1537 2.7149 20.5192 2.99375 20.798L4.05441 19.7374C4.01641 19.6994 3.99248 19.6496 3.98654 19.5962L2.49572 19.7618ZM7.08923 20.0362C6.93242 20.193 6.71283 20.27 6.49242 20.2455L6.32678 21.7364C7.00007 21.8112 7.67087 21.5759 8.14989 21.0968L7.08923 20.0362ZM2.90316 15.8501C2.42414 16.3291 2.18884 16.9999 2.26365 17.6732L3.75447 17.5076C3.72999 17.2872 3.80701 17.0676 3.96382 16.9108L2.90316 15.8501ZM8.13075 11.4446C7.60655 9.4033 8.14412 7.14906 9.73994 5.55324L8.67928 4.49258C6.69321 6.47865 6.02725 9.28401 6.67789 11.8177L8.13075 11.4446ZM18.4468 14.2601C16.8509 15.8559 14.5967 16.3934 12.5554 15.8693L12.1823 17.3221C14.716 17.9728 17.5214 17.3068 19.5074 15.3207L18.4468 14.2601ZM11.8623 17.3845C11.9181 17.3287 12.0324 17.2836 12.1823 17.3221L12.5554 15.8693C11.9675 15.7183 11.2845 15.8409 10.8016 16.3238L11.8623 17.3845ZM7.67591 13.1987C8.15857 12.716 8.28182 12.0329 8.13075 11.4446L6.67789 11.8177C6.7163 11.9672 6.67127 12.082 6.61525 12.138L7.67591 13.1987ZM9.38736 18.7929L7.63832 17.063L6.58351 18.1294L8.33255 19.8593L9.38736 18.7929ZM18.4468 5.55324C19.213 6.3195 19.734 7.23555 20.0119 8.20635L21.454 7.79365C21.1079 6.58425 20.4583 5.4435 19.5074 4.49258L18.4468 5.55324ZM19.9617 11.7733C19.6735 12.6821 19.1692 13.5376 18.4468 14.2601L19.5074 15.3207C20.4038 14.4244 21.0325 13.3592 21.3916 12.2267L19.9617 11.7733Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Key.displayName = "Key";

// src/icons/components/LXCOld.tsx
import { forwardRef as forwardRef44 } from "react";
import { jsx as jsx56, jsxs as jsxs22 } from "react/jsx-runtime";
var LXCOld = forwardRef44(
  (props, ref) => /* @__PURE__ */ jsx56(
    "svg",
    {
      version: "1.1",
      baseProfile: "full",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsxs22("g", { stroke: "white", children: [
        /* @__PURE__ */ jsxs22("g", { transform: "rotate(30) skewX(30)", children: [
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "110",
              y: "-72",
              width: "175",
              height: "75",
              fill: "currentColor",
              transform: "skewX(-50)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "110",
              y: "3",
              width: "87.5",
              height: "75",
              fill: "currentColor",
              transform: "skewX(-50)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "16.5",
              y: "78.9",
              width: "87.5",
              height: "25",
              fill: "currentColor"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "16.5",
              y: "104.5",
              width: "175",
              height: "25",
              fill: "currentColor"
            }
          ),
          /* @__PURE__ */ jsx56("rect", { x: "16.5", y: "130", width: "175", height: "50", fill: "currentColor" }),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "104",
              y: "166",
              width: "89.5",
              height: "25",
              fill: "currentColor",
              transform: "skewY(-40)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "228.3",
              y: "29.5",
              width: "87.5",
              height: "75",
              fill: "currentColor",
              transform: "skewX(-50)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "191.8",
              y: "266",
              width: "89.5",
              height: "25",
              fill: "currentColor",
              transform: "skewY(-40)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "192",
              y: "291",
              width: "179.5",
              height: "50",
              fill: "currentColor",
              transform: "skewY(-40)"
            }
          ),
          /* @__PURE__ */ jsx56(
            "rect",
            {
              x: "282.3",
              y: "240",
              width: "89.1",
              height: "50",
              fill: "currentColor",
              transform: "skewY(-40)"
            }
          ),
          /* @__PURE__ */ jsx56("rect", { x: "194", y: "3.7", width: "87.5", height: "25", fill: "currentColor" })
        ] }),
        /* @__PURE__ */ jsx56("line", { x1: "93", y1: "57", x2: "93", y2: "88" }),
        /* @__PURE__ */ jsx56("line", { x1: "169", y1: "131", x2: "92", y2: "88" }),
        /* @__PURE__ */ jsx56("line", { x1: "92", y1: "88", x2: "14", y2: "128" })
      ] })
    }
  )
);
LXCOld.displayName = "LXCOld";

// src/icons/components/LXC.tsx
import { forwardRef as forwardRef45 } from "react";
import { jsx as jsx57 } from "react/jsx-runtime";
var LXC = forwardRef45(
  (props, ref) => /* @__PURE__ */ jsx57(
    "svg",
    {
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx57(
        "path",
        {
          fill: "currentColor",
          d: "M12 6v-4l-4-2-4 2v4l-4 2v5l4 2 4-2 4 2 4-2v-5zM8.090 1.12l2.91 1.44-2.6 1.3-2.91-1.44zM5 2.78l3 1.5v3.6l-3-1.5v-3.6zM4 13.88l-3-1.5v-3.6l3 1.5v3.6zM4.28 9.88l-2.88-1.46 2.6-1.3 2.88 1.44zM12 13.88l-3-1.5v-3.6l3 1.5v3.6zM12.28 9.88l-2.88-1.46 2.6-1.3 2.88 1.44z"
        }
      )
    }
  )
);
LXC.displayName = "LXC";

// src/icons/components/Log.tsx
import { forwardRef as forwardRef46 } from "react";
import { jsx as jsx58 } from "react/jsx-runtime";
var Log = forwardRef46(
  (props, ref) => /* @__PURE__ */ jsx58(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx58(
        "path",
        {
          d: "M8.46484 7.16797C8.27669 7.16797 8.11621 7.10433 7.9834 6.97705C7.85612 6.84977 7.79248 6.69206 7.79248 6.50391C7.79248 6.31576 7.85612 6.15804 7.9834 6.03076C8.11621 5.89795 8.27669 5.83154 8.46484 5.83154H19.8037C19.9919 5.83154 20.1496 5.89795 20.2769 6.03076C20.4097 6.15804 20.4761 6.31576 20.4761 6.50391C20.4761 6.69206 20.4097 6.84977 20.2769 6.97705C20.1496 7.10433 19.9919 7.16797 19.8037 7.16797H8.46484ZM8.46484 12.7734C8.27669 12.7734 8.11621 12.7098 7.9834 12.5825C7.85612 12.4497 7.79248 12.2892 7.79248 12.1011C7.79248 11.9129 7.85612 11.7552 7.9834 11.6279C8.11621 11.5007 8.27669 11.437 8.46484 11.437H19.8037C19.9919 11.437 20.1496 11.5007 20.2769 11.6279C20.4097 11.7552 20.4761 11.9129 20.4761 12.1011C20.4761 12.2892 20.4097 12.4497 20.2769 12.5825C20.1496 12.7098 19.9919 12.7734 19.8037 12.7734H8.46484ZM8.23877 18.1597C8.05062 18.1597 7.89014 18.096 7.75732 17.9688C7.63005 17.8415 7.56641 17.6838 7.56641 17.4956C7.56641 17.3075 7.63005 17.1497 7.75732 17.0225C7.89014 16.8896 8.05062 16.8232 8.23877 16.8232H19.5776C19.7658 16.8232 19.9235 16.8896 20.0508 17.0225C20.1836 17.1497 20.25 17.3075 20.25 17.4956C20.25 17.6838 20.1836 17.8415 20.0508 17.9688C19.9235 18.096 19.7658 18.1597 19.5776 18.1597H8.23877ZM4.7959 7.5415C4.50814 7.5415 4.26188 7.44189 4.05713 7.24268C3.85238 7.03792 3.75 6.79167 3.75 6.50391C3.75 6.21061 3.85238 5.96436 4.05713 5.76514C4.26188 5.56038 4.50814 5.45801 4.7959 5.45801C5.08366 5.45801 5.32992 5.56038 5.53467 5.76514C5.73942 5.96436 5.8418 6.21061 5.8418 6.50391C5.8418 6.79167 5.73942 7.03792 5.53467 7.24268C5.32992 7.44189 5.08366 7.5415 4.7959 7.5415ZM4.7959 13.147C4.50814 13.147 4.26188 13.0446 4.05713 12.8398C3.85238 12.6351 3.75 12.3888 3.75 12.1011C3.75 11.8133 3.85238 11.5671 4.05713 11.3623C4.26188 11.1576 4.50814 11.0552 4.7959 11.0552C5.08366 11.0552 5.32992 11.1576 5.53467 11.3623C5.73942 11.5671 5.8418 11.8133 5.8418 12.1011C5.8418 12.3888 5.73942 12.6351 5.53467 12.8398C5.32992 13.0446 5.08366 13.147 4.7959 13.147ZM4.56982 18.5415C4.28206 18.5415 4.03581 18.4391 3.83105 18.2344C3.6263 18.0296 3.52393 17.7834 3.52393 17.4956C3.52393 17.2023 3.6263 16.9561 3.83105 16.7568C4.03581 16.5521 4.28206 16.4497 4.56982 16.4497C4.85758 16.4497 5.10384 16.5521 5.30859 16.7568C5.51335 16.9561 5.61572 17.2023 5.61572 17.4956C5.61572 17.7834 5.51335 18.0296 5.30859 18.2344C5.10384 18.4391 4.85758 18.5415 4.56982 18.5415Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Log.displayName = "Log";

// src/icons/components/Moon.tsx
import { forwardRef as forwardRef47 } from "react";
import { jsx as jsx59 } from "react/jsx-runtime";
var Moon = forwardRef47(
  (props, ref) => /* @__PURE__ */ jsx59(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx59(
        "path",
        {
          d: "M9.272 2.406a1 1 0 0 0-1.23-1.355C6.59 1.535 5.432 2.487 4.37 3.55a11.399 11.399 0 0 0 0 16.182c4.518 4.519 11.51 4.261 15.976-.205 1.062-1.062 2.014-2.22 2.498-3.673A1 1 0 0 0 21.55 14.6c-3.59 1.322-7.675.734-10.434-2.025-2.765-2.766-3.328-6.83-1.844-10.168Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Moon.displayName = "Moon";

// src/icons/components/Notification.tsx
import { forwardRef as forwardRef48 } from "react";
import { jsx as jsx60 } from "react/jsx-runtime";
var Notification = forwardRef48(
  (props, ref) => /* @__PURE__ */ jsx60(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx60(
        "path",
        {
          d: "M4.41992 17.5781C4.41992 17.3021 4.49284 17.0391 4.63867 16.7891C4.78451 16.5339 4.9694 16.2891 5.19336 16.0547C5.42253 15.8203 5.6543 15.5885 5.88867 15.3594C6.07096 15.1823 6.21159 14.9505 6.31055 14.6641C6.41471 14.3776 6.49284 14.0625 6.54492 13.7188C6.59701 13.375 6.63867 13.0234 6.66992 12.6641C6.70117 11.6797 6.82357 10.8073 7.03711 10.0469C7.25586 9.28646 7.57878 8.64844 8.00586 8.13281C8.43815 7.61719 8.99544 7.23698 9.67773 6.99219C9.82357 6.47656 10.1022 6.04427 10.5137 5.69531C10.9251 5.34635 11.4199 5.17188 11.998 5.17188C12.5814 5.17188 13.0788 5.34635 13.4902 5.69531C13.9017 6.04427 14.1803 6.47656 14.3262 6.99219C15.0085 7.23698 15.5632 7.61719 15.9902 8.13281C16.4225 8.64844 16.7454 9.28646 16.959 10.0469C17.1777 10.8073 17.3027 11.6797 17.334 12.6641C17.3652 13.0234 17.4069 13.375 17.459 13.7188C17.5111 14.0625 17.5866 14.3776 17.6855 14.6641C17.7897 14.9505 17.9329 15.1823 18.1152 15.3594C18.3496 15.5885 18.5788 15.8203 18.8027 16.0547C19.0319 16.2891 19.2194 16.5339 19.3652 16.7891C19.5111 17.0391 19.584 17.3021 19.584 17.5781C19.584 17.9115 19.4668 18.1797 19.2324 18.3828C19.0033 18.5807 18.6855 18.6797 18.2793 18.6797H15.0605C15.0397 19.1849 14.8965 19.6536 14.6309 20.0859C14.3704 20.5234 14.0137 20.875 13.5605 21.1406C13.1126 21.4115 12.5918 21.5469 11.998 21.5469C11.4095 21.5469 10.8887 21.4115 10.4355 21.1406C9.98763 20.875 9.63086 20.5234 9.36523 20.0859C9.10482 19.6536 8.96419 19.1849 8.94336 18.6797H5.72461C5.31836 18.6797 4.99805 18.5807 4.76367 18.3828C4.53451 18.1797 4.41992 17.9115 4.41992 17.5781ZM6.28711 17.25H17.6934V17.1562C17.6257 17.0885 17.5371 16.9974 17.4277 16.8828C17.3184 16.7682 17.196 16.6432 17.0605 16.5078C16.9303 16.3672 16.8001 16.224 16.6699 16.0781C16.5345 15.9271 16.4173 15.7448 16.3184 15.5312C16.2194 15.3125 16.1361 15.0677 16.0684 14.7969C16.0007 14.5208 15.9434 14.2214 15.8965 13.8984C15.8548 13.5755 15.8236 13.2266 15.8027 12.8516C15.7715 11.7995 15.6517 10.9609 15.4434 10.3359C15.235 9.70573 14.959 9.23698 14.6152 8.92969C14.2767 8.61719 13.8965 8.40365 13.4746 8.28906C13.3861 8.26823 13.3132 8.23177 13.2559 8.17969C13.2038 8.1224 13.1751 8.04167 13.1699 7.9375C13.1491 7.54167 13.0345 7.22135 12.8262 6.97656C12.623 6.73177 12.347 6.60938 11.998 6.60938C11.6595 6.60938 11.3861 6.73177 11.1777 6.97656C10.9694 7.22135 10.8548 7.54167 10.834 7.9375C10.8288 8.04167 10.7975 8.1224 10.7402 8.17969C10.6882 8.23177 10.6152 8.26823 10.5215 8.28906C10.0996 8.40365 9.7194 8.61719 9.38086 8.92969C9.04232 9.23698 8.76888 9.70573 8.56055 10.3359C8.35221 10.9609 8.23242 11.7995 8.20117 12.8516C8.18034 13.2266 8.14648 13.5755 8.09961 13.8984C8.05794 14.2214 8.00065 14.5208 7.92773 14.7969C7.86003 15.0677 7.77669 15.3125 7.67773 15.5312C7.57878 15.7448 7.46159 15.9271 7.32617 16.0781C7.20117 16.224 7.07096 16.3672 6.93555 16.5078C6.80013 16.6432 6.67513 16.7682 6.56055 16.8828C6.44596 16.9974 6.35482 17.0885 6.28711 17.1562V17.25ZM10.4199 18.6797C10.446 19.1745 10.6048 19.5677 10.8965 19.8594C11.1934 20.151 11.5605 20.2969 11.998 20.2969C12.446 20.2969 12.8132 20.151 13.0996 19.8594C13.3913 19.5677 13.5527 19.1745 13.584 18.6797H10.4199Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Notification.displayName = "Notification";

// src/icons/components/Official.tsx
import { forwardRef as forwardRef49 } from "react";
import { jsx as jsx61, jsxs as jsxs23 } from "react/jsx-runtime";
var Official = forwardRef49(
  (props, ref) => /* @__PURE__ */ jsxs23(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx61("path", { d: "M17.03 9.78a.75.75 0 00-1.06-1.06l-5.47 5.47-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6-6z" }),
        /* @__PURE__ */ jsx61(
          "path",
          {
            fillRule: "evenodd",
            d: "M14.136 1.2a3.61 3.61 0 00-4.272 0L8.489 2.21a2.11 2.11 0 01-.929.384l-1.686.259a3.61 3.61 0 00-3.021 3.02L2.594 7.56a2.11 2.11 0 01-.384.929L1.2 9.864a3.61 3.61 0 000 4.272l1.01 1.375c.2.274.333.593.384.929l.259 1.686a3.61 3.61 0 003.02 3.021l1.687.259c.336.051.655.183.929.384l1.375 1.01a3.61 3.61 0 004.272 0l1.375-1.01a2.11 2.11 0 01.929-.384l1.686-.259a3.61 3.61 0 003.021-3.02l.259-1.687a2.11 2.11 0 01.384-.929l1.01-1.375a3.61 3.61 0 000-4.272l-1.01-1.375a2.11 2.11 0 01-.384-.929l-.259-1.686a3.61 3.61 0 00-3.02-3.021l-1.687-.259a2.11 2.11 0 01-.929-.384L14.136 1.2zm-3.384 1.209a2.11 2.11 0 012.496 0l1.376 1.01a3.61 3.61 0 001.589.658l1.686.258a2.11 2.11 0 011.765 1.766l.26 1.686a3.61 3.61 0 00.657 1.59l1.01 1.375a2.11 2.11 0 010 2.496l-1.01 1.376a3.61 3.61 0 00-.658 1.589l-.258 1.686a2.11 2.11 0 01-1.766 1.765l-1.686.26a3.61 3.61 0 00-1.59.657l-1.375 1.01a2.11 2.11 0 01-2.496 0l-1.376-1.01a3.61 3.61 0 00-1.589-.658l-1.686-.258a2.11 2.11 0 01-1.766-1.766l-.258-1.686a3.61 3.61 0 00-.658-1.59l-1.01-1.375a2.11 2.11 0 010-2.496l1.01-1.376a3.61 3.61 0 00.658-1.589l.258-1.686a2.11 2.11 0 011.766-1.766l1.686-.258a3.61 3.61 0 001.59-.658l1.375-1.01z"
          }
        )
      ]
    }
  )
);
Official.displayName = "Official";

// src/icons/components/Offline.tsx
import { forwardRef as forwardRef50 } from "react";
import { jsx as jsx62, jsxs as jsxs24 } from "react/jsx-runtime";
var Offline = forwardRef50(
  (props, ref) => /* @__PURE__ */ jsxs24(
    "svg",
    {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx62(
          "path",
          {
            d: "m 8 1.992188 c -2.617188 0 -5.238281 0.933593 -7.195312 2.808593 l -0.496094 0.480469 c -0.3984378 0.378906 -0.410156 1.011719 -0.03125 1.410156 c 0.382812 0.398438 1.015625 0.410156 1.414062 0.027344 l 0.5 -0.476562 c 3.085938 -2.953126 8.53125 -2.953126 11.617188 0 l 0.5 0.476562 c 0.398437 0.382812 1.03125 0.371094 1.414062 -0.027344 c 0.378906 -0.398437 0.367188 -1.03125 -0.03125 -1.410156 l -0.496094 -0.480469 c -1.957031 -1.875 -4.578124 -2.808593 -7.195312 -2.808593 z m -0.03125 4.007812 c -1.570312 0.011719 -3.128906 0.628906 -4.207031 1.8125 l -0.5 0.550781 c -0.375 0.40625 -0.347657 1.042969 0.0625 1.414063 c 0.410156 0.371094 1.042969 0.339844 1.414062 -0.070313 l 0.5 -0.542969 c 1.242188 -1.363281 3.992188 -1.492187 5.398438 -0.128906 c 0.121093 -0.023437 0.242187 -0.035156 0.363281 -0.035156 c 0.53125 0 1.039062 0.210938 1.414062 0.585938 l 0.222657 0.222656 c 0.011719 -0.011719 0.023437 -0.019532 0.039062 -0.03125 c 0.40625 -0.371094 0.4375 -1.007813 0.0625 -1.414063 l -0.5 -0.550781 c -1.125 -1.230469 -2.703125 -1.824219 -4.269531 -1.8125 z m 0.03125 4 c -0.511719 0 -1.023438 0.195312 -1.414062 0.585938 c -0.78125 0.78125 -0.78125 2.046874 0 2.828124 s 2.046874 0.78125 2.828124 0 c 0.210938 -0.210937 0.359376 -0.453124 0.457032 -0.714843 l -0.285156 -0.285157 c -0.554688 -0.554687 -0.707032 -1.367187 -0.46875 -2.070312 c -0.335938 -0.226562 -0.726563 -0.34375 -1.117188 -0.34375 z m 0 0",
            "fill-opacity": "0.34902"
          }
        ),
        /* @__PURE__ */ jsx62("path", { d: "m 11 10 c -0.265625 0 -0.519531 0.105469 -0.707031 0.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 l 1.292969 1.292969 l -1.292969 1.292969 c -0.390625 0.390625 -0.390625 1.023437 0 1.414062 s 1.023437 0.390625 1.414062 0 l 1.292969 -1.292969 l 1.292969 1.292969 c 0.390625 0.390625 1.023437 0.390625 1.414062 0 s 0.390625 -1.023437 0 -1.414062 l -1.292969 -1.292969 l 1.292969 -1.292969 c 0.390625 -0.390625 0.390625 -1.023437 0 -1.414062 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 s -0.519531 0.105469 -0.707031 0.292969 l -1.292969 1.292969 l -1.292969 -1.292969 c -0.1875 -0.1875 -0.441406 -0.292969 -0.707031 -0.292969 z m 0 0" })
      ]
    }
  )
);
Offline.displayName = "Offline";

// src/icons/components/OpenApp.tsx
import { forwardRef as forwardRef51 } from "react";
import { jsx as jsx63 } from "react/jsx-runtime";
var OpenApp = forwardRef51(
  (props, ref) => /* @__PURE__ */ jsx63(
    "svg",
    {
      viewBox: "0 0 25 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx63(
        "path",
        {
          d: "M7.14 18.727c-.864 0-1.523-.224-1.976-.672-.448-.443-.672-1.091-.672-1.946V6.617c0-.854.224-1.505.672-1.953.453-.448 1.112-.672 1.977-.672h9.437c.865 0 1.521.224 1.969.672.453.448.68 1.099.68 1.953v9.492c0 .854-.227 1.503-.68 1.946-.448.448-1.104.672-1.969.672H7.141zm.141-1.735h9.157c.338 0 .599-.086.78-.258.183-.177.274-.445.274-.804V6.805c0-.36-.091-.628-.273-.805-.183-.177-.443-.266-.782-.266H7.281c-.343 0-.607.089-.789.266-.177.177-.265.445-.265.805v9.125c0 .36.088.627.265.804.182.172.446.258.79.258zm5.79-7.805c.182-.156.361-.229.538-.218.183.005.331.067.446.187.114.12.174.268.18.446.005.177-.07.354-.227.53l-1.297 1.446-2.625 2.625a.798.798 0 0 1-.586.242.735.735 0 0 1-.758-.766.78.78 0 0 1 .242-.554l2.641-2.633 1.445-1.305zm.53 2.344.266-2.226-2.14.304h-1.243c-.229 0-.414-.062-.554-.187a.645.645 0 0 1-.211-.508c0-.213.067-.383.203-.508.14-.125.328-.187.562-.187h3.618c.27 0 .484.073.64.219.162.145.242.367.242.664v3.593c0 .23-.062.414-.187.555a.636.636 0 0 1-.5.21.657.657 0 0 1-.508-.202c-.125-.14-.187-.326-.187-.555v-1.172z",
          fill: "currentColor"
        }
      )
    }
  )
);
OpenApp.displayName = "OpenApp";

// src/icons/components/Parameter.tsx
import { forwardRef as forwardRef52 } from "react";
import { jsx as jsx64, jsxs as jsxs25 } from "react/jsx-runtime";
var Parameter = forwardRef52(
  (props, ref) => /* @__PURE__ */ jsxs25(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 32 32",
      id: "icon",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx64(
          "path",
          {
            d: "M28,13V8a2.0023,2.0023,0,0,0-2-2H23V8h3v5a3.9756,3.9756,0,0,0,1.3823,3A3.9756,3.9756,0,0,0,26,19v5H23v2h3a2.0023,2.0023,0,0,0,2-2V19a2.0023,2.0023,0,0,1,2-2V15A2.0023,2.0023,0,0,1,28,13Z",
            id: "path1"
          }
        ),
        /* @__PURE__ */ jsx64(
          "path",
          {
            d: "M17,9l-.857,3h2L19,9h2l-.857,3H22v2H19.572l-1.143,4H21v2H17.857L17,23H15l.857-3h-2L13,23H11l.857-3H10V18h2.429l1.143-4H11V12h3.143L15,9Zm.572,5h-2l-1.143,4h2Z",
            id: "path2"
          }
        ),
        /* @__PURE__ */ jsx64(
          "path",
          {
            d: "M6,13V8H9V6H6A2.0023,2.0023,0,0,0,4,8v5a2.0023,2.0023,0,0,1-2,2v2a2.0023,2.0023,0,0,1,2,2v5a2.0023,2.0023,0,0,0,2,2H9V24H6V19a3.9756,3.9756,0,0,0-1.3823-3A3.9756,3.9756,0,0,0,6,13Z",
            id: "path3"
          }
        )
      ]
    }
  )
);
Parameter.displayName = "Parameter";

// src/icons/components/Pause.tsx
import { forwardRef as forwardRef53 } from "react";
import { jsx as jsx65 } from "react/jsx-runtime";
var Pause = forwardRef53(
  (props, ref) => /* @__PURE__ */ jsx65(
    "svg",
    {
      viewBox: "0 0 24 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx65(
        "path",
        {
          d: "M8.66368 19.9984C8.39536 19.9984 8.16985 19.9099 7.98715 19.7329C7.81016 19.5616 7.72168 19.3447 7.72168 19.0821V6.49347C7.72168 6.23085 7.81016 6.01389 7.98715 5.84262C8.16985 5.66563 8.39536 5.57715 8.66368 5.57715C8.93201 5.57715 9.15467 5.66563 9.33166 5.84262C9.51434 6.01389 9.60569 6.23085 9.60569 6.49347V19.0821C9.60569 19.3447 9.51434 19.5616 9.33166 19.7329C9.15467 19.9099 8.93201 19.9984 8.66368 19.9984ZM14.6155 19.9984C14.3528 19.9984 14.1302 19.9099 13.9475 19.7329C13.7705 19.5616 13.682 19.3447 13.682 19.0821V6.49347C13.682 6.23085 13.7705 6.01389 13.9475 5.84262C14.1302 5.66563 14.3528 5.57715 14.6155 5.57715C14.8838 5.57715 15.1093 5.66563 15.292 5.84262C15.4747 6.01389 15.566 6.23085 15.566 6.49347V19.0821C15.566 19.3447 15.4747 19.5616 15.292 19.7329C15.1093 19.9099 14.8838 19.9984 14.6155 19.9984Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Pause.displayName = "Pause";

// src/icons/components/Praise.tsx
import { forwardRef as forwardRef54 } from "react";
import { jsx as jsx66 } from "react/jsx-runtime";
var Praise = forwardRef54(
  (props, ref) => /* @__PURE__ */ jsx66(
    "svg",
    {
      viewBox: "0 0 1024 1024",
      fill: "currentColor",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx66(
        "path",
        {
          d: "M253.6 912.8H104.8c-13.6 0-24-10.4-24-24v-448c0-13.6 10.4-24 24-24h141.6v-1.6C363.2 400 450.4 304.8 453.6 186.4v-0.8c0-3.2-0.8-6.4-0.8-9.6 0-52.8 42.4-95.2 95.2-95.2 44.8 0 82.4 30.4 92.8 73.6l2.4 12c4.8 23.2 6.4 47.2 6.4 70.4 0 42.4-7.2 84.8-20.8 124.8l-4.8 17.6h232c32.8 1.6 62.4 18.4 80 45.6 8 12.8 12.8 28.8 14.4 44 1.6 16.8-2.4 32-6.4 48-4.8 21.6-9.6 42.4-14.4 64-6.4 28-12.8 56.8-19.2 84.8L891.2 752c-4.8 22.4-10.4 44.8-15.2 68-3.2 15.2-6.4 31.2-14.4 44.8-8 12.8-18.4 24-31.2 32-14.4 8.8-30.4 14.4-47.2 15.2H258.4c-2.4 0.8-3.2 0.8-4.8 0.8z m248.8-746.4l-0.8 3.2v10.4c0 0.8 0.8 28.8-4.8 56.8-1.6 8-4 16-6.4 24.8l-2.4 7.2C457.6 360 381.6 432 288 456l-10.4 2.4v406.4H769.6c18.4 0 33.6-2.4 45.6-17.6 8.8-11.2 10.4-27.2 13.6-40.8 4.8-22.4 10.4-44.8 15.2-68 6.4-28.8 13.6-58.4 20-87.2l19.2-86.4c3.2-15.2 7.2-30.4 10.4-45.6 1.6-7.2 3.2-15.2 4.8-22.4 1.6-7.2 4-15.2 3.2-22.4 0-3.2-0.8-5.6-1.6-8-0.8-5.6-3.2-10.4-5.6-15.2-11.2-17.6-28.8-24-48.8-23.2H587.2c-13.6 0-24-10.4-24-24 0-4 0.8-7.2 2.4-10.4l4.8-9.6c12-24.8 21.6-51.2 27.2-79.2l1.6-4c0.8-2.4 5.6-23.2 5.6-62.4 0-32-5.6-60.8-5.6-60.8 0-25.6-21.6-47.2-48-47.2-23.2-1.6-43.2 14.4-48.8 36zM128.8 464.8V864h101.6V464l-101.6 0.8z",
          fill: "currentColor"
        }
      )
    }
  )
);
Praise.displayName = "Praise";

// src/icons/components/ReportFeedback.tsx
import { forwardRef as forwardRef55 } from "react";
import { jsx as jsx67 } from "react/jsx-runtime";
var ReportFeedback = forwardRef55((props, ref) => /* @__PURE__ */ jsx67(
  "svg",
  {
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 42 42",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx67("path", { d: "M6.5,25.5v4c0.016,2.812,1.344,2.375,2.328,1.531L14.5,25.91v2.59c0,2.43,0.56,3,3,3h9c0,0,5.209,6.125,5.25,6.084 c0.75,0.916,2.781,0.604,2.75-1.084v-5h3c2.45,0,3-0.609,3-3v-15c0-2.4-0.59-3-3-3h-10v-2c0-2.47-0.46-3-3-3h-21c-2.36,0-3,0.51-3,3 v13c0,2.439,0.55,4,3,4H6.5z M31.5,28.5v4.721l-4-4.721h-9c-0.75,0-1-0.27-1-1v-13c0-0.67,0.31-1,1-1h18c0.689,0,1,0.37,1,0.94V27.5 c0,0.721-0.359,1-1,1H31.5z" })
  }
));
ReportFeedback.displayName = "ReportFeedback";

// src/icons/components/Reset.tsx
import { forwardRef as forwardRef56 } from "react";
import { jsx as jsx68 } from "react/jsx-runtime";
var Reset = forwardRef56(
  (props, ref) => /* @__PURE__ */ jsx68(
    "svg",
    {
      viewBox: "0 0 24 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx68(
        "path",
        {
          d: "M12.0731 20.9542C10.9156 20.9542 9.83119 20.7352 8.81979 20.2971C7.80837 19.8645 6.91864 19.264 6.15061 18.496C5.38258 17.7334 4.77952 16.8463 4.34142 15.835C3.90873 14.8182 3.69238 13.731 3.69238 12.5736C3.69238 11.4161 3.90873 10.3317 4.34142 9.32028C4.77952 8.30344 5.38258 7.41102 6.15061 6.64299C6.91864 5.87496 7.80837 5.2746 8.81979 4.84191C9.83119 4.40922 10.9156 4.19287 12.0731 4.19287C13.2305 4.19287 14.315 4.40922 15.3263 4.84191C16.3432 5.2746 17.2357 5.87496 18.0037 6.64299C18.7717 7.41102 19.3721 8.30344 19.8047 9.32028C20.2429 10.3317 20.4619 11.4161 20.4619 12.5736C20.4619 13.731 20.2429 14.8182 19.8047 15.835C19.3721 16.8463 18.7717 17.7334 18.0037 18.496C17.2357 19.264 16.3432 19.8645 15.3263 20.2971C14.315 20.7352 13.2305 20.9542 12.0731 20.9542ZM12.0731 19.2993C13.0034 19.2993 13.8742 19.1235 14.6855 18.7719C15.4967 18.4257 16.2107 17.9443 16.8272 17.3278C17.4493 16.7112 17.9333 15.9972 18.2795 15.186C18.6257 14.3747 18.7987 13.5039 18.7987 12.5736C18.7987 11.6433 18.6257 10.7725 18.2795 9.9612C17.9333 9.14449 17.4493 8.43055 16.8272 7.81938C16.2107 7.20279 15.4967 6.72142 14.6855 6.37527C13.8742 6.0237 13.0034 5.84791 12.0731 5.84791C11.1482 5.84791 10.2774 6.0237 9.46071 6.37527C8.6494 6.72142 7.93546 7.20279 7.31887 7.81938C6.7023 8.43055 6.21822 9.14449 5.86666 9.9612C5.52051 10.7725 5.34742 11.6433 5.34742 12.5736C5.34742 13.5039 5.52051 14.3747 5.86666 15.186C6.21822 15.9972 6.7023 16.7112 7.31887 17.3278C7.93546 17.9443 8.6494 18.4257 9.46071 18.7719C10.2774 19.1235 11.1482 19.2993 12.0731 19.2993ZM8.36545 11.673L13.1521 8.81727C13.3685 8.68746 13.5983 8.63067 13.8417 8.6469C14.0851 8.65771 14.2906 8.74425 14.4583 8.90652C14.6314 9.06877 14.7179 9.30946 14.7179 9.62857V15.5104C14.7179 15.8242 14.6314 16.0621 14.4583 16.2244C14.2906 16.3867 14.0851 16.476 13.8417 16.4922C13.5983 16.503 13.3685 16.4407 13.1521 16.3056L8.35734 13.4741C8.13559 13.3443 7.98414 13.1631 7.90302 12.9306C7.8273 12.698 7.8273 12.4654 7.90302 12.2328C7.97874 11.9949 8.13288 11.8083 8.36545 11.673ZM9.85824 12.4924C9.82579 12.5087 9.80956 12.5357 9.80956 12.5736C9.80956 12.6114 9.82849 12.6412 9.86635 12.6628L13.0953 14.5613C13.1386 14.5883 13.1737 14.5964 13.2008 14.5856C13.2332 14.5694 13.2495 14.5423 13.2495 14.5045V10.6346C13.2495 10.5913 13.2332 10.5643 13.2008 10.5534C13.1737 10.5426 13.1386 10.548 13.0953 10.5697L9.85824 12.4924Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Reset.displayName = "Reset";

// src/icons/components/Restart.tsx
import { forwardRef as forwardRef57 } from "react";
import { jsx as jsx69 } from "react/jsx-runtime";
var Restart = forwardRef57(
  (props, ref) => /* @__PURE__ */ jsx69(
    "svg",
    {
      viewBox: "0 0 24 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx69(
        "path",
        {
          d: "M18.887 13.3433C18.887 14.2423 18.7188 15.0837 18.3822 15.8673C18.0456 16.6509 17.5794 17.3409 16.9831 17.937C16.3918 18.5331 15.7044 18.9995 14.9207 19.3361C14.137 19.6727 13.2957 19.8408 12.3966 19.8408C11.5024 19.8408 10.6611 19.6727 9.87259 19.3361C9.08893 18.9995 8.39904 18.5331 7.80288 17.937C7.21154 17.3409 6.7476 16.6509 6.41106 15.8673C6.07452 15.0837 5.90625 14.2423 5.90625 13.3433C5.90625 13.0981 5.98317 12.8986 6.13703 12.7448C6.29087 12.5909 6.48558 12.514 6.72116 12.514C6.95673 12.514 7.14663 12.5909 7.29087 12.7448C7.43509 12.8986 7.50721 13.0981 7.50721 13.3433C7.50721 14.0164 7.63221 14.6486 7.88221 15.2399C8.13702 15.8313 8.48797 16.3505 8.93509 16.7976C9.38701 17.2448 9.90865 17.5956 10.5 17.8505C11.0913 18.1053 11.7235 18.2327 12.3966 18.2327C13.0745 18.2327 13.7067 18.1053 14.2933 17.8505C14.8846 17.5956 15.4038 17.2448 15.8509 16.7976C16.3029 16.3505 16.6539 15.8313 16.9038 15.2399C17.1587 14.6486 17.286 14.0164 17.286 13.3433C17.286 12.6702 17.1587 12.038 16.9038 11.4467C16.6539 10.8553 16.3029 10.3361 15.8509 9.88898C15.4038 9.43706 14.8846 9.08609 14.2933 8.8361C13.7067 8.58129 13.0745 8.45388 12.3966 8.45388C12.1995 8.45388 12.0096 8.4611 11.8269 8.47551C11.649 8.48994 11.4832 8.51397 11.3293 8.54763L13.125 10.3217C13.1971 10.3938 13.2524 10.4731 13.2909 10.5597C13.3293 10.6462 13.3486 10.7447 13.3486 10.8553C13.3486 11.0717 13.2716 11.2568 13.1178 11.4106C12.9687 11.5596 12.7861 11.6342 12.5697 11.6342C12.3534 11.6342 12.1707 11.562 12.0216 11.4178L9.06491 8.43225C8.98317 8.35052 8.92068 8.26157 8.87741 8.16542C8.83895 8.06445 8.81971 7.95869 8.81971 7.84811C8.81971 7.63176 8.90144 7.43705 9.06491 7.26398L12.0216 4.26398C12.1659 4.11014 12.3486 4.0332 12.5697 4.0332C12.7909 4.0332 12.976 4.11014 13.125 4.26398C13.274 4.41782 13.3486 4.60532 13.3486 4.82648C13.3486 4.93224 13.3293 5.03081 13.2909 5.12216C13.2524 5.20869 13.1995 5.28801 13.1322 5.36013L11.5168 6.93945C11.6514 6.91542 11.7909 6.89619 11.9351 6.88176C12.0841 6.86253 12.238 6.85292 12.3966 6.85292C13.2957 6.85292 14.137 7.02119 14.9207 7.35773C15.7044 7.69427 16.3918 8.16062 16.9831 8.75676C17.5794 9.35292 18.0456 10.0428 18.3822 10.8265C18.7188 11.6101 18.887 12.4491 18.887 13.3433Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Restart.displayName = "Restart";

// src/icons/components/Rocket.tsx
import { forwardRef as forwardRef58 } from "react";
import { jsx as jsx70, jsxs as jsxs26 } from "react/jsx-runtime";
var Rocket = forwardRef58(
  (props, ref) => /* @__PURE__ */ jsxs26(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx70(
          "path",
          {
            d: "M9.03429 5.96305L6.49114 8.49856C6.02369 8.9646 5.59488 9.3921 5.25624 9.77856C5.03877 10.0267 4.82145 10.2984 4.63737 10.5985L4.61259 10.5738C4.56555 10.5269 4.54201 10.5034 4.51839 10.4805C4.07636 10.0516 3.55641 9.71062 2.98636 9.47575C2.9559 9.4632 2.92498 9.45095 2.86314 9.42645L2.48449 9.27641C1.97153 9.07315 1.83482 8.41279 2.22514 8.02365C3.34535 6.90684 4.69032 5.56594 5.33941 5.29662C5.91185 5.05911 6.53023 4.98008 7.12664 5.06822C7.67311 5.14898 8.19006 5.42968 9.03429 5.96305Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx70(
          "path",
          {
            d: "M13.3767 19.3132C13.5816 19.5212 13.7177 19.6681 13.8408 19.8251C14.0031 20.0322 14.1483 20.2523 14.2748 20.4829C14.4172 20.7426 14.5278 21.02 14.749 21.5748C14.929 22.0265 15.5272 22.1459 15.8746 21.7995L15.9586 21.7157C17.0788 20.5988 18.4237 19.2579 18.6938 18.6108C18.9321 18.04 19.0113 17.4235 18.9229 16.8289C18.8419 16.2841 18.5605 15.7688 18.0256 14.9273L15.474 17.4713C14.9959 17.9479 14.5576 18.385 14.1612 18.7273C13.9236 18.9325 13.6637 19.1376 13.3767 19.3132Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx70(
          "path",
          {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M14.4467 16.3769L20.2935 10.5476C21.1356 9.70811 21.5566 9.28836 21.7783 8.75458C22.0001 8.22081 22.0001 7.62719 22.0001 6.43996V5.87277C22.0001 4.04713 22.0001 3.13431 21.4312 2.56715C20.8624 2 19.9468 2 18.1157 2H17.5468C16.356 2 15.7606 2 15.2252 2.2211C14.6898 2.4422 14.2688 2.86195 13.4268 3.70146L7.57991 9.53078C6.59599 10.5117 5.98591 11.12 5.74966 11.7075C5.67502 11.8931 5.6377 12.0767 5.6377 12.2692C5.6377 13.0713 6.2851 13.7168 7.57991 15.0077L7.75393 15.1812L9.79245 13.1123C10.0832 12.8172 10.558 12.8137 10.8531 13.1044C11.1481 13.3951 11.1516 13.87 10.8609 14.1651L8.8162 16.2403L8.95326 16.3769C10.2481 17.6679 10.8955 18.3133 11.7 18.3133C11.8777 18.3133 12.0478 18.2818 12.2189 18.2188C12.8222 17.9966 13.438 17.3826 14.4467 16.3769ZM17.1935 9.5312C16.435 10.2874 15.2053 10.2874 14.4468 9.5312C13.6883 8.775 13.6883 7.54895 14.4468 6.79274C15.2053 6.03653 16.435 6.03653 17.1935 6.79274C17.952 7.54895 17.952 8.775 17.1935 9.5312Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
Rocket.displayName = "Rocket";

// src/icons/components/Run.tsx
import { forwardRef as forwardRef59 } from "react";
import { jsx as jsx71 } from "react/jsx-runtime";
var Run = forwardRef59(
  (props, ref) => /* @__PURE__ */ jsx71(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx71(
        "path",
        {
          d: "M6.79932 18.3247V6.2328C6.79932 5.75894 6.91921 5.40783 7.15899 5.17946C7.39878 4.9511 7.68423 4.83691 8.01536 4.83691C8.31224 4.83691 8.60911 4.9197 8.90599 5.08526L19.0197 10.9942C19.3851 11.2055 19.6477 11.4053 19.8076 11.5937C19.9731 11.7821 20.0559 12.0104 20.0559 12.2788C20.0559 12.5414 19.9731 12.7698 19.8076 12.9639C19.6477 13.1523 19.3851 13.3521 19.0197 13.5633L8.90599 19.4723C8.60911 19.6378 8.31224 19.7206 8.01536 19.7206C7.68423 19.7206 7.39878 19.6036 7.15899 19.3695C6.91921 19.1412 6.79932 18.7929 6.79932 18.3247ZM8.48637 17.4512C8.48637 17.5312 8.51491 17.5883 8.572 17.6225C8.6348 17.6568 8.70331 17.6511 8.77753 17.6054L17.6581 12.4329C17.7266 12.393 17.7609 12.3416 17.7609 12.2788C17.7609 12.2046 17.7266 12.1532 17.6581 12.1246L8.77753 6.95215C8.70331 6.90648 8.6348 6.90077 8.572 6.93502C8.51491 6.96928 8.48637 7.02637 8.48637 7.10629V17.4512Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Run.displayName = "Run";

// src/icons/components/Save.tsx
import { forwardRef as forwardRef60 } from "react";
import { jsx as jsx72 } from "react/jsx-runtime";
var Save = forwardRef60(
  (props, ref) => /* @__PURE__ */ jsx72(
    "svg",
    {
      viewBox: "-6.72 -6.72 45.44 45.44",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx72(
        "path",
        {
          transform: "translate(-154.000000, -517.000000)",
          fill: "currentColor",
          d: "M172,522 C172,521.447 172.448,521 173,521 C173.552,521 174,521.447 174,522 L174,526 C174,526.553 173.552,527 173,527 C172.448,527 172,526.553 172,526 L172,522 L172,522 Z M163,529 L177,529 C177.552,529 178,528.553 178,528 L178,517 L162,517 L162,528 C162,528.553 162.448,529 163,529 L163,529 Z M182,517 L180,517 L180,529 C180,530.104 179.104,531 178,531 L162,531 C160.896,531 160,530.104 160,529 L160,517 L158,517 C155.791,517 154,518.791 154,521 L154,545 C154,547.209 155.791,549 158,549 L182,549 C184.209,549 186,547.209 186,545 L186,521 C186,518.791 184.209,517 182,517 L182,517 Z"
        }
      )
    }
  )
);
Save.displayName = "Save";

// src/icons/components/Scale.tsx
import { forwardRef as forwardRef61 } from "react";
import { jsx as jsx73 } from "react/jsx-runtime";
var Scale = forwardRef61(
  (props, ref) => /* @__PURE__ */ jsx73(
    "svg",
    {
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx73("path", { d: "M15.81 10l-2.5-5h0.69c0.276 0 0.5-0.224 0.5-0.5s-0.224-0.5-0.5-0.5h-0.79c-1.056-1.145-2.541-1.881-4.198-1.95l-0.012-0.050c0-0.552-0.448-1-1-1s-1 0.448-1 1v0.050c-1.681 0.073-3.178 0.807-4.247 1.947l-0.753 0.003c-0.276 0-0.5 0.224-0.5 0.5s0.224 0.5 0.5 0.5h0.69l-2.5 5h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19l-2.55-5.090c0.064-0.039 0.118-0.089 0.159-0.148 0.873-1.019 2.148-1.669 3.575-1.702l0.006 10.94h-1v1h-2v1h8v-1h-2v-1h-1v-10.94c1.418 0.030 2.679 0.682 3.524 1.693 0.053 0.084 0.117 0.145 0.193 0.186l-2.527 5.061h-0.19c0 1.1 1.34 2 3 2s3-0.9 3-2h-0.19zM5 10h-4l2-3.94zM11 10l2-3.94 2 3.94h-4z" })
    }
  )
);
Scale.displayName = "Scale";

// src/icons/components/Script.tsx
import { forwardRef as forwardRef62 } from "react";
import { jsx as jsx74, jsxs as jsxs27 } from "react/jsx-runtime";
var Script = forwardRef62(
  (props, ref) => /* @__PURE__ */ jsxs27(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 32 32",
      id: "icon",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx74("polygon", { points: "18.83 26 21.41 23.42 20 22 16 26 20 30 21.42 28.59 18.83 26" }),
        /* @__PURE__ */ jsx74("polygon", { points: "27.17 26 24.59 28.58 26 30 30 26 26 22 24.58 23.41 27.17 26" }),
        /* @__PURE__ */ jsx74("path", { d: "M14,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v6h2V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2h6ZM18,4.4,23.6,10H18Z" })
      ]
    }
  )
);
Script.displayName = "Script";

// src/icons/components/Search.tsx
import { forwardRef as forwardRef63 } from "react";
import { jsx as jsx75 } from "react/jsx-runtime";
var Search = forwardRef63(
  (props, ref) => /* @__PURE__ */ jsx75(
    "svg",
    {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx75(
        "path",
        {
          d: "m 10,2 c -4.4064311,0 -8,3.5935689 -8,8 0,4.40644 3.5935706,8 8,8 1.837571,0 3.455411,-0.729126 4.808594,-1.777344 l 5.484375,5.484375 a 1,1 0 0 0 1.414062,0 1,1 0 0 0 0,-1.414062 L 16.222656,14.808594 C 17.270874,13.455411 18,11.837571 18,10 18,5.5935706 14.40644,2 10,2 Z m 0,2 c 3.32556,0 6,2.6744494 6,6 0,3.325562 -2.674438,6 -6,6 C 6.6744494,16 4,13.32556 4,10 4,6.6744511 6.6744511,4 10,4 Z",
          id: "Vector"
        }
      )
    }
  )
);
Search.displayName = "Search";

// src/icons/components/Send.tsx
import { forwardRef as forwardRef64 } from "react";
import { jsx as jsx76, jsxs as jsxs28 } from "react/jsx-runtime";
var Send = forwardRef64(
  (props, ref) => /* @__PURE__ */ jsxs28(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx76(
          "path",
          {
            d: "M11.7812 21.3672C11.4167 21.3672 11.1536 21.237 10.9922 20.9766C10.8307 20.7161 10.6927 20.3906 10.5781 20L9.33594 15.875C9.26302 15.6146 9.23698 15.4062 9.25781 15.25C9.27865 15.0885 9.36458 14.9271 9.51562 14.7656L17.4922 6.16406C17.5391 6.11719 17.5625 6.0651 17.5625 6.00781C17.5625 5.95052 17.5417 5.90365 17.5 5.86719C17.4583 5.83073 17.4089 5.8125 17.3516 5.8125C17.2995 5.80729 17.25 5.82812 17.2031 5.875L8.63281 13.8828C8.46094 14.0391 8.29427 14.1276 8.13281 14.1484C7.97135 14.1641 7.76562 14.1328 7.51562 14.0547L3.29688 12.7734C2.92188 12.6589 2.61198 12.5234 2.36719 12.3672C2.1224 12.2057 2 11.9453 2 11.5859C2 11.3047 2.11198 11.0625 2.33594 10.8594C2.5599 10.6562 2.83594 10.4922 3.16406 10.3672L16.6016 5.21875C16.7839 5.15104 16.9531 5.09896 17.1094 5.0625C17.2708 5.02083 17.4167 5 17.5469 5C17.8021 5 18.0026 5.07292 18.1484 5.21875C18.2943 5.36458 18.3672 5.5651 18.3672 5.82031C18.3672 5.95573 18.3464 6.10156 18.3047 6.25781C18.2682 6.41406 18.2161 6.58333 18.1484 6.76562L13.0312 20.1328C12.8854 20.5078 12.7109 20.8073 12.5078 21.0312C12.3047 21.2552 12.0625 21.3672 11.7812 21.3672Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx76(
          "path",
          {
            d: "M11.7812 21.3672C11.4167 21.3672 11.1536 21.237 10.9922 20.9766C10.8307 20.7161 10.6927 20.3906 10.5781 20L9.33594 15.875C9.26302 15.6146 9.23698 15.4062 9.25781 15.25C9.27865 15.0885 9.36458 14.9271 9.51562 14.7656L17.4922 6.16406C17.5391 6.11719 17.5625 6.0651 17.5625 6.00781C17.5625 5.95052 17.5417 5.90365 17.5 5.86719C17.4583 5.83073 17.4089 5.8125 17.3516 5.8125C17.2995 5.80729 17.25 5.82812 17.2031 5.875L8.63281 13.8828C8.46094 14.0391 8.29427 14.1276 8.13281 14.1484C7.97135 14.1641 7.76562 14.1328 7.51562 14.0547L3.29688 12.7734C2.92188 12.6589 2.61198 12.5234 2.36719 12.3672C2.1224 12.2057 2 11.9453 2 11.5859C2 11.3047 2.11198 11.0625 2.33594 10.8594C2.5599 10.6562 2.83594 10.4922 3.16406 10.3672L16.6016 5.21875C16.7839 5.15104 16.9531 5.09896 17.1094 5.0625C17.2708 5.02083 17.4167 5 17.5469 5C17.8021 5 18.0026 5.07292 18.1484 5.21875C18.2943 5.36458 18.3672 5.5651 18.3672 5.82031C18.3672 5.95573 18.3464 6.10156 18.3047 6.25781C18.2682 6.41406 18.2161 6.58333 18.1484 6.76562L13.0312 20.1328C12.8854 20.5078 12.7109 20.8073 12.5078 21.0312C12.3047 21.2552 12.0625 21.3672 11.7812 21.3672Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
Send.displayName = "Send";

// src/icons/components/Settings.tsx
import { forwardRef as forwardRef65 } from "react";
import { jsx as jsx77, jsxs as jsxs29 } from "react/jsx-runtime";
var Settings = forwardRef65(
  (props, ref) => /* @__PURE__ */ jsx77(
    "svg",
    {
      viewBox: "0 0 24 24",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx77("g", { stroke: "none", strokeWidth: "1", fill: "none", fillRule: "evenodd", children: /* @__PURE__ */ jsx77("g", { id: "System", transform: "translate(-1200.000000, 0.000000)", children: /* @__PURE__ */ jsxs29("g", { id: "settings_2_line", transform: "translate(1200.000000, 0.000000)", children: [
        /* @__PURE__ */ jsx77(
          "path",
          {
            d: "M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z",
            id: "MingCute",
            fillRule: "nonzero",
            children: " "
          }
        ),
        /* @__PURE__ */ jsx77(
          "path",
          {
            d: "M18,4 C18,3.44772 17.5523,3 17,3 C16.4477,3 16,3.44772 16,4 L16,5 L4,5 C3.44772,5 3,5.44772 3,6 C3,6.55228 3.44772,7 4,7 L16,7 L16,8 C16,8.55228 16.4477,9 17,9 C17.5523,9 18,8.55228 18,8 L18,7 L20,7 C20.5523,7 21,6.55228 21,6 C21,5.44772 20.5523,5 20,5 L18,5 L18,4 Z M4,11 C3.44772,11 3,11.4477 3,12 C3,12.5523 3.44772,13 4,13 L6,13 L6,14 C6,14.5523 6.44772,15 7,15 C7.55228,15 8,14.5523 8,14 L8,13 L20,13 C20.5523,13 21,12.5523 21,12 C21,11.4477 20.5523,11 20,11 L8,11 L8,10 C8,9.44772 7.55228,9 7,9 C6.44772,9 6,9.44772 6,10 L6,11 L4,11 Z M3,18 C3,17.4477 3.44772,17 4,17 L16,17 L16,16 C16,15.4477 16.4477,15 17,15 C17.5523,15 18,15.4477 18,16 L18,17 L20,17 C20.5523,17 21,17.4477 21,18 C21,18.5523 20.5523,19 20,19 L18,19 L18,20 C18,20.5523 17.5523,21 17,21 C16.4477,21 16,20.5523 16,20 L16,19 L4,19 C3.44772,19 3,18.5523 3,18 Z",
            fill: "currentColor",
            children: " "
          }
        )
      ] }) }) })
    }
  )
);
Settings.displayName = "Settings";

// src/icons/components/Shop.tsx
import { forwardRef as forwardRef66 } from "react";
import { jsx as jsx78 } from "react/jsx-runtime";
var Shop = forwardRef66(
  (props, ref) => /* @__PURE__ */ jsx78(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx78(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M6.16222 5.6H17.8377C18.4403 5.6 18.9753 5.9856 19.1658 6.55728L20.125 9.43468C20.2301 9.74999 19.9182 10.044 19.6096 9.92061C18.6026 9.5178 17.4854 9.48497 16.4565 9.82795L15.4427 10.1659C15.1553 10.2617 14.8446 10.2617 14.5572 10.1659L13.4546 9.79833C12.5104 9.48359 11.4895 9.48359 10.5453 9.79833L9.44266 10.1659C9.15529 10.2617 8.8446 10.2617 8.55723 10.1659L7.54344 9.82795C6.5145 9.48497 5.39731 9.5178 4.39029 9.92061C4.08169 10.044 3.76983 9.74999 3.87494 9.43468L4.83407 6.55728C5.02463 5.9856 5.55962 5.6 6.16222 5.6ZM3.31617 6.05131C3.72452 4.82629 4.87093 4 6.16222 4H17.8377C19.129 4 20.2754 4.82629 20.6837 6.05132L21.6429 8.92871C22.0886 10.266 21.0633 11.5283 19.8002 11.5527V17C19.8002 18.5464 18.5466 19.8 17.0002 19.8H7.0002C5.4538 19.8 4.2002 18.5464 4.2002 17V11.5527C2.93688 11.5286 1.91122 10.2662 2.35704 8.92871L3.31617 6.05131ZM5.8002 11.2071V17C5.8002 17.6627 6.33745 18.2 7.0002 18.2H17.0002C17.6629 18.2 18.2002 17.6627 18.2002 17V11.2071C17.7855 11.1661 17.3637 11.2121 16.9624 11.3458L15.9486 11.6838C15.3328 11.889 14.6671 11.889 14.0513 11.6838L12.9486 11.3162C12.3328 11.111 11.6671 11.111 11.0513 11.3162L9.94863 11.6838C9.33283 11.889 8.66706 11.889 8.05126 11.6838L7.03747 11.3458C6.6364 11.2122 6.21474 11.1662 5.8002 11.2071Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Shop.displayName = "Shop";

// src/icons/components/Star.tsx
import { forwardRef as forwardRef67 } from "react";
import { jsx as jsx79 } from "react/jsx-runtime";
var Star = forwardRef67(
  (props, ref) => /* @__PURE__ */ jsx79(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx79(
        "path",
        {
          d: "M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Star.displayName = "Star";

// src/icons/components/Stop.tsx
import { forwardRef as forwardRef68 } from "react";
import { jsx as jsx80 } from "react/jsx-runtime";
var Stop = forwardRef68(
  (props, ref) => /* @__PURE__ */ jsx80(
    "svg",
    {
      viewBox: "0 0 24 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx80(
        "path",
        {
          d: "M4.72266 18.0033V7.01596C4.72266 6.44896 4.88356 6.00711 5.20539 5.6904C5.53231 5.37369 5.98438 5.21533 6.5616 5.21533H17.4646C18.0418 5.21533 18.4913 5.37369 18.8131 5.6904C19.1401 6.00711 19.3034 6.44896 19.3034 7.01596V18.0033C19.3034 18.5601 19.1401 18.9967 18.8131 19.3135C18.4913 19.6353 18.0418 19.7962 17.4646 19.7962H6.5616C5.98438 19.7962 5.53231 19.6353 5.20539 19.3135C4.88356 18.9967 4.72266 18.5601 4.72266 18.0033ZM6.23212 17.5665C6.23212 17.8014 6.29598 17.9853 6.42369 18.1182C6.55138 18.2458 6.72762 18.3097 6.95238 18.3097H17.0968C17.3266 18.3097 17.5028 18.2458 17.6254 18.1182C17.7532 17.9853 17.8169 17.8014 17.8169 17.5665V7.44505C17.8169 7.21518 17.7532 7.03639 17.6254 6.9087C17.5028 6.77589 17.3266 6.70947 17.0968 6.70947H6.95238C6.72762 6.70947 6.55138 6.77589 6.42369 6.9087C6.29598 7.03639 6.23212 7.21518 6.23212 7.44505V17.5665Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Stop.displayName = "Stop";

// src/icons/components/Sun.tsx
import { forwardRef as forwardRef69 } from "react";
import { jsx as jsx81 } from "react/jsx-runtime";
var Sun = forwardRef69(
  (props, ref) => /* @__PURE__ */ jsx81(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx81("path", { d: "M12 0a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V1a1 1 0 0 1 1-1ZM4.929 3.515a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 0 0 1.414-1.414L4.93 3.515ZM1 11a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2H1ZM18 12a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM17.657 16.243a1 1 0 0 0-1.414 1.414l2.828 2.828a1 1 0 1 0 1.414-1.414l-2.828-2.828ZM7.757 17.657a1 1 0 1 0-1.414-1.414L3.515 19.07a1 1 0 1 0 1.414 1.414l2.828-2.828ZM20.485 4.929a1 1 0 0 0-1.414-1.414l-2.828 2.828a1 1 0 1 0 1.414 1.414l2.828-2.828ZM13 19a1 1 0 1 0-2 0v4a1 1 0 1 0 2 0v-4ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z" })
    }
  )
);
Sun.displayName = "Sun";

// src/icons/components/Suspend.tsx
import { forwardRef as forwardRef70 } from "react";
import { jsx as jsx82 } from "react/jsx-runtime";
var Suspend = forwardRef70(
  (props, ref) => /* @__PURE__ */ jsx82(
    "svg",
    {
      viewBox: "0 0 24 25",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx82(
        "path",
        {
          d: "M16.1479 14.9733C16.4441 14.9733 16.7353 14.958 17.0213 14.9274C17.3125 14.8916 17.5858 14.8456 17.8412 14.7894C18.1018 14.7281 18.329 14.6541 18.5231 14.5672C18.6356 14.5213 18.7301 14.4906 18.8066 14.4753C18.8884 14.46 18.9676 14.4523 19.0442 14.4523C19.1975 14.4523 19.3354 14.5085 19.4579 14.6209C19.5857 14.7332 19.6495 14.8865 19.6495 15.0806C19.6495 15.1368 19.6393 15.2134 19.6189 15.3105C19.6036 15.4075 19.5704 15.5148 19.5193 15.6322C19.1005 16.5927 18.5282 17.4202 17.803 18.1149C17.0827 18.8146 16.2449 19.351 15.2897 19.7239C14.3345 20.1019 13.3052 20.2909 12.2018 20.2909C11.032 20.2909 9.95676 20.0892 8.976 19.6857C7.99523 19.2871 7.14216 18.7278 6.41681 18.0076C5.69655 17.2822 5.1372 16.4292 4.73877 15.4484C4.34033 14.4676 4.14111 13.3923 4.14111 12.2226C4.14111 11.1448 4.34799 10.1155 4.76175 9.13469C5.17551 8.14881 5.74763 7.28298 6.4781 6.53718C7.21368 5.78628 8.05908 5.21672 9.01431 4.8285C9.13691 4.77743 9.23907 4.74422 9.32079 4.72889C9.40764 4.70846 9.47405 4.69824 9.52002 4.69824C9.71924 4.69824 9.88014 4.7672 10.0027 4.90512C10.1253 5.04305 10.1866 5.19374 10.1866 5.35719C10.1866 5.44914 10.1739 5.53854 10.1483 5.62538C10.1279 5.70711 10.0845 5.80928 10.0181 5.93187C9.87503 6.20771 9.7601 6.58061 9.67326 7.05056C9.59153 7.52051 9.55067 8.03643 9.55067 8.59833C9.55067 9.91113 9.81884 11.0451 10.3552 12.0004C10.8916 12.9505 11.6527 13.6835 12.6386 14.1994C13.6244 14.7154 14.7942 14.9733 16.1479 14.9733ZM5.61993 12.1766C5.61993 13.1421 5.78339 14.0283 6.11031 14.8354C6.43724 15.6426 6.89697 16.3449 7.48952 16.9425C8.08718 17.5351 8.78955 17.9949 9.59664 18.3217C10.4037 18.6538 11.2849 18.8197 12.2401 18.8197C12.9859 18.8197 13.7011 18.7099 14.3856 18.4903C15.0752 18.2707 15.6983 17.9539 16.2551 17.5402C16.817 17.1264 17.2844 16.6335 17.6573 16.0614C17.3917 16.1584 17.1133 16.2274 16.8221 16.2682C16.5361 16.3092 16.2271 16.3296 15.895 16.3296C14.2859 16.3296 12.9042 16.0282 11.7497 15.4254C10.6004 14.8175 9.71669 13.9491 9.0986 12.8202C8.48561 11.6913 8.17913 10.3402 8.17913 8.7669C8.17913 8.3889 8.20466 8.02877 8.25575 7.68653C8.31194 7.33917 8.39111 7.0097 8.49327 6.69809C7.90073 7.09653 7.3899 7.58436 6.96083 8.16158C6.53174 8.73881 6.1997 9.37223 5.96472 10.0618C5.73486 10.7514 5.61993 11.4564 5.61993 12.1766Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Suspend.displayName = "Suspend";

// src/icons/components/ThemeAuto.tsx
import { forwardRef as forwardRef71 } from "react";
import { jsx as jsx83 } from "react/jsx-runtime";
var ThemeAuto = forwardRef71(
  (props, ref) => /* @__PURE__ */ jsx83(
    "svg",
    {
      focusable: "false",
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx83(
        "path",
        {
          fill: "currentColor",
          d: "M10.85 12.65h2.3L12 9zM20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12zM14.3 16l-.7-2h-3.2l-.7 2H7.8L11 7h2l3.2 9z"
        }
      )
    }
  )
);
ThemeAuto.displayName = "ThemeAuto";

// src/icons/components/ThemeDark.tsx
import { forwardRef as forwardRef72 } from "react";
import { jsx as jsx84 } from "react/jsx-runtime";
var ThemeDark = forwardRef72(
  (props, ref) => /* @__PURE__ */ jsx84(
    "svg",
    {
      focusable: "false",
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx84(
        "path",
        {
          fill: "currentColor",
          d: "M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6"
        }
      )
    }
  )
);
ThemeDark.displayName = "ThemeDark";

// src/icons/components/ThemeLight.tsx
import { forwardRef as forwardRef73 } from "react";
import { jsx as jsx85 } from "react/jsx-runtime";
var ThemeLight = forwardRef73(
  (props, ref) => /* @__PURE__ */ jsx85(
    "svg",
    {
      focusable: "false",
      "aria-hidden": "true",
      viewBox: "0 0 24 24",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx85(
        "path",
        {
          fill: "currentColor",
          d: "M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6m0-10c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4"
        }
      )
    }
  )
);
ThemeLight.displayName = "ThemeLight";

// src/icons/components/Trash.tsx
import { forwardRef as forwardRef74 } from "react";
import { jsx as jsx86 } from "react/jsx-runtime";
var Trash = forwardRef74(
  (props, ref) => /* @__PURE__ */ jsx86(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx86(
        "path",
        {
          d: "M10.43 17.781a.576.576 0 0 1-.414-.148.577.577 0 0 1-.164-.406l-.235-8.063a.5.5 0 0 1 .149-.398.56.56 0 0 1 .414-.157.56.56 0 0 1 .414.157c.11.099.166.229.172.39L11 17.22a.55.55 0 0 1-.156.406.56.56 0 0 1-.414.156zm3.14-.11a.57.57 0 0 1-.422-.155.525.525 0 0 1-.148-.407l.234-8.054c.006-.167.06-.3.164-.399a.56.56 0 0 1 .415-.156c.177 0 .315.052.414.156a.5.5 0 0 1 .148.399l-.227 8.062a.561.561 0 0 1-.171.406.566.566 0 0 1-.407.149zM8.36 6.329V4.672c0-.615.187-1.094.562-1.438.38-.343.909-.515 1.586-.515h2.976c.678 0 1.204.172 1.579.515.38.344.57.823.57 1.438v1.656h-1.594V4.742a.552.552 0 0 0-.187-.437c-.12-.115-.282-.172-.485-.172h-2.742a.7.7 0 0 0-.492.172.564.564 0 0 0-.18.437v1.586H8.36zM4.968 7.352a.759.759 0 0 1-.547-.22.729.729 0 0 1-.227-.546.72.72 0 0 1 .227-.54.759.759 0 0 1 .547-.218h14.07c.214 0 .393.073.54.219.15.14.226.32.226.539a.742.742 0 0 1-.22.547.742.742 0 0 1-.546.219H4.97zm3.437 13.171c-.63 0-1.133-.174-1.508-.523-.375-.349-.575-.838-.601-1.469L5.766 7.195h1.57l.523 11.024c.01.229.081.414.211.554.136.141.31.211.524.211h6.804c.22 0 .394-.07.524-.21.135-.136.208-.32.219-.555l.507-11.024h1.594l-.531 11.328c-.026.636-.23 1.128-.61 1.477-.374.349-.874.523-1.5.523H8.407z",
          fill: "currentColor"
        }
      )
    }
  )
);
Trash.displayName = "Trash";

// src/icons/components/UX.tsx
import { forwardRef as forwardRef75 } from "react";
import { jsx as jsx87 } from "react/jsx-runtime";
var UX = forwardRef75(
  (props, ref) => /* @__PURE__ */ jsx87(
    "svg",
    {
      viewBox: "0 0 32 32",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "#000000",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx87(
        "path",
        {
          d: "m27 0c2.7614237 0 5 2.23857625 5 5v22c0 2.7614237-2.2385763 5-5 5h-21c-3.23839694 0-5.87757176-2.5655749-5.99586153-5.7750617l-.00413847-.2249383v-8c0-3.2383969 2.56557489-5.8775718 5.77506174-5.9958615l.22493826-.0041385h6v-7c0-2.76142375 2.2385763-5 5-5zm-15 14h-6c-2.14219539 0-3.89107888 1.6839685-3.99510469 3.8003597l-.00489531.1996403v8c0 2.1421954 1.68396847 3.8910789 3.80035966 3.9951047l.19964034.0048953 7.0005351.0011995c-.6282342-.835866-1.0005351-1.875055-1.0005351-3.0011995zm5.0856015-11.99929704-.0856015-.00070296c-1.5976809 0-2.9036609 1.24891996-2.9949073 2.82372721l-.0050927.17627279v22c0 1.5976809 1.24892 2.9036609 2.8237272 2.9949073l.1762728.0050927h10c1.5976809 0 2.9036609-1.24892 2.9949073-2.8237272l.0050927-.1762728v-22c0-1.59768088-1.24892-2.90366088-2.8237272-2.99490731l-.1762728-.00509269-.0856015.00070296c-.2061166.58222896-.7615518.99929704-1.4143985.99929704h-7c-.6528467 0-1.2082819-.41706808-1.4143985-.99929704zm8.9143985 12.99929704c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-8c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1zm-3-5c.5522847 0 1 .4477153 1 1s-.4477153 1-1 1h-5c-.5522847 0-1-.4477153-1-1s.4477153-1 1-1z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
UX.displayName = "UX";

// src/icons/components/User.tsx
import { forwardRef as forwardRef76 } from "react";
import { jsx as jsx88, jsxs as jsxs30 } from "react/jsx-runtime";
var User = forwardRef76(
  (props, ref) => /* @__PURE__ */ jsxs30(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx88(
          "path",
          {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M12 1C8.96243 1 6.5 3.46243 6.5 6.5C6.5 9.53757 8.96243 12 12 12C15.0376 12 17.5 9.53757 17.5 6.5C17.5 3.46243 15.0376 1 12 1ZM8.5 6.5C8.5 4.567 10.067 3 12 3C13.933 3 15.5 4.567 15.5 6.5C15.5 8.433 13.933 10 12 10C10.067 10 8.5 8.433 8.5 6.5Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx88(
          "path",
          {
            d: "M8 14C4.68629 14 2 16.6863 2 20V22C2 22.5523 2.44772 23 3 23C3.55228 23 4 22.5523 4 22V20C4 17.7909 5.79086 16 8 16H16C18.2091 16 20 17.7909 20 20V22C20 22.5523 20.4477 23 21 23C21.5523 23 22 22.5523 22 22V20C22 16.6863 19.3137 14 16 14H8Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
User.displayName = "User";

// src/icons/components/Users.tsx
import { forwardRef as forwardRef77 } from "react";
import { jsx as jsx89, jsxs as jsxs31 } from "react/jsx-runtime";
var Users = forwardRef77(
  (props, ref) => /* @__PURE__ */ jsxs31(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx89(
          "path",
          {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M9 0C5.96243 0 3.5 2.46243 3.5 5.5C3.5 8.53757 5.96243 11 9 11C12.0376 11 14.5 8.53757 14.5 5.5C14.5 2.46243 12.0376 0 9 0ZM5.5 5.5C5.5 3.567 7.067 2 9 2C10.933 2 12.5 3.567 12.5 5.5C12.5 7.433 10.933 9 9 9C7.067 9 5.5 7.433 5.5 5.5Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx89(
          "path",
          {
            d: "M15.5 0C14.9477 0 14.5 0.447715 14.5 1C14.5 1.55228 14.9477 2 15.5 2C17.433 2 19 3.567 19 5.5C19 7.433 17.433 9 15.5 9C14.9477 9 14.5 9.44771 14.5 10C14.5 10.5523 14.9477 11 15.5 11C18.5376 11 21 8.53757 21 5.5C21 2.46243 18.5376 0 15.5 0Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx89(
          "path",
          {
            d: "M19.0837 14.0157C19.3048 13.5096 19.8943 13.2786 20.4004 13.4997C22.5174 14.4246 24 16.538 24 19V21C24 21.5523 23.5523 22 23 22C22.4477 22 22 21.5523 22 21V19C22 17.3613 21.0145 15.9505 19.5996 15.3324C19.0935 15.1113 18.8625 14.5217 19.0837 14.0157Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx89(
          "path",
          {
            d: "M6 13C2.68629 13 0 15.6863 0 19V21C0 21.5523 0.447715 22 1 22C1.55228 22 2 21.5523 2 21V19C2 16.7909 3.79086 15 6 15H12C14.2091 15 16 16.7909 16 19V21C16 21.5523 16.4477 22 17 22C17.5523 22 18 21.5523 18 21V19C18 15.6863 15.3137 13 12 13H6Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
Users.displayName = "Users";

// src/icons/components/Verified.tsx
import { forwardRef as forwardRef78 } from "react";
import { jsx as jsx90 } from "react/jsx-runtime";
var Verified = forwardRef78(
  (props, ref) => /* @__PURE__ */ jsx90(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx90(
        "path",
        {
          fillRule: "evenodd",
          clipRule: "evenodd",
          d: "M9.5924 3.20027C9.34888 3.4078 9.22711 3.51158 9.09706 3.59874C8.79896 3.79854 8.46417 3.93721 8.1121 4.00672C7.95851 4.03705 7.79903 4.04977 7.48008 4.07522C6.6787 4.13918 6.278 4.17115 5.94371 4.28923C5.17051 4.56233 4.56233 5.17051 4.28923 5.94371C4.17115 6.278 4.13918 6.6787 4.07522 7.48008C4.04977 7.79903 4.03705 7.95851 4.00672 8.1121C3.93721 8.46417 3.79854 8.79896 3.59874 9.09706C3.51158 9.22711 3.40781 9.34887 3.20027 9.5924C2.67883 10.2043 2.4181 10.5102 2.26522 10.8301C1.91159 11.57 1.91159 12.43 2.26522 13.1699C2.41811 13.4898 2.67883 13.7957 3.20027 14.4076C3.40778 14.6511 3.51158 14.7729 3.59874 14.9029C3.79854 15.201 3.93721 15.5358 4.00672 15.8879C4.03705 16.0415 4.04977 16.201 4.07522 16.5199C4.13918 17.3213 4.17115 17.722 4.28923 18.0563C4.56233 18.8295 5.17051 19.4377 5.94371 19.7108C6.278 19.8288 6.6787 19.8608 7.48008 19.9248C7.79903 19.9502 7.95851 19.963 8.1121 19.9933C8.46417 20.0628 8.79896 20.2015 9.09706 20.4013C9.22711 20.4884 9.34887 20.5922 9.5924 20.7997C10.2043 21.3212 10.5102 21.5819 10.8301 21.7348C11.57 22.0884 12.43 22.0884 13.1699 21.7348C13.4898 21.5819 13.7957 21.3212 14.4076 20.7997C14.6511 20.5922 14.7729 20.4884 14.9029 20.4013C15.201 20.2015 15.5358 20.0628 15.8879 19.9933C16.0415 19.963 16.201 19.9502 16.5199 19.9248C17.3213 19.8608 17.722 19.8288 18.0563 19.7108C18.8295 19.4377 19.4377 18.8295 19.7108 18.0563C19.8288 17.722 19.8608 17.3213 19.9248 16.5199C19.9502 16.201 19.963 16.0415 19.9933 15.8879C20.0628 15.5358 20.2015 15.201 20.4013 14.9029C20.4884 14.7729 20.5922 14.6511 20.7997 14.4076C21.3212 13.7957 21.5819 13.4898 21.7348 13.1699C22.0884 12.43 22.0884 11.57 21.7348 10.8301C21.5819 10.5102 21.3212 10.2043 20.7997 9.5924C20.5922 9.34887 20.4884 9.22711 20.4013 9.09706C20.2015 8.79896 20.0628 8.46417 19.9933 8.1121C19.963 7.95851 19.9502 7.79903 19.9248 7.48008C19.8608 6.6787 19.8288 6.278 19.7108 5.94371C19.4377 5.17051 18.8295 4.56233 18.0563 4.28923C17.722 4.17115 17.3213 4.13918 16.5199 4.07522C16.201 4.04977 16.0415 4.03705 15.8879 4.00672C15.5358 3.93721 15.201 3.79854 14.9029 3.59874C14.7729 3.51158 14.6511 3.40781 14.4076 3.20027C13.7957 2.67883 13.4898 2.41811 13.1699 2.26522C12.43 1.91159 11.57 1.91159 10.8301 2.26522C10.5102 2.4181 10.2043 2.67883 9.5924 3.20027ZM16.3735 9.86314C16.6913 9.5453 16.6913 9.03 16.3735 8.71216C16.0557 8.39433 15.5403 8.39433 15.2225 8.71216L10.3723 13.5624L8.77746 11.9676C8.45963 11.6498 7.94432 11.6498 7.62649 11.9676C7.30866 12.2854 7.30866 12.8007 7.62649 13.1186L9.79678 15.2889C10.1146 15.6067 10.6299 15.6067 10.9478 15.2889L16.3735 9.86314Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Verified.displayName = "Verified";

// src/icons/components/ViewGrid.tsx
import { forwardRef as forwardRef79 } from "react";
import { jsx as jsx91 } from "react/jsx-runtime";
var ViewGrid = forwardRef79(
  (props, ref) => /* @__PURE__ */ jsx91(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx91(
        "path",
        {
          d: "M5.853 10.903c-.626 0-1.092-.15-1.4-.453C4.151 10.143 4 9.668 4 9.027v-3.15c0-.636.151-1.108.453-1.416.308-.307.774-.461 1.4-.461h3.205c.62 0 1.082.154 1.384.461.308.308.461.78.461 1.416v3.15c0 .641-.153 1.116-.46 1.423-.303.302-.764.454-1.385.454H5.853zm.008-1.447h3.181c.138 0 .242-.034.31-.103.07-.07.104-.178.104-.326V5.869c0-.143-.034-.25-.103-.318-.07-.069-.173-.103-.31-.103H5.86c-.138 0-.241.034-.31.103-.069.069-.103.175-.103.318v3.158c0 .148.034.257.103.326.069.069.172.103.31.103zm8.089 1.447c-.626 0-1.093-.15-1.4-.453-.302-.307-.454-.782-.454-1.423v-3.15c0-.636.152-1.108.454-1.416.307-.307.774-.461 1.4-.461h3.197c.626 0 1.09.154 1.392.461.307.308.461.78.461 1.416v3.15c0 .641-.154 1.116-.461 1.423-.303.302-.767.454-1.392.454H13.95zm.008-1.447h3.18c.144 0 .247-.034.311-.103.069-.07.103-.178.103-.326V5.869c0-.143-.034-.25-.103-.318-.064-.069-.167-.103-.31-.103h-3.181c-.144 0-.25.034-.319.103-.063.069-.095.175-.095.318v3.158c0 .148.032.257.095.326.07.069.175.103.319.103zM5.853 19c-.626 0-1.092-.154-1.4-.461-.302-.308-.453-.78-.453-1.416v-3.15c0-.641.151-1.113.453-1.415.308-.308.774-.461 1.4-.461h3.205c.62 0 1.082.153 1.384.46.308.303.461.775.461 1.416v3.15c0 .636-.153 1.108-.46 1.416-.303.307-.764.461-1.385.461H5.853zm.008-1.448h3.181c.138 0 .242-.034.31-.103.07-.069.104-.175.104-.318v-3.165c0-.144-.034-.25-.103-.319-.07-.069-.173-.103-.31-.103H5.86c-.138 0-.241.034-.31.103-.069.07-.103.175-.103.319v3.165c0 .143.034.25.103.318.069.069.172.103.31.103zM13.95 19c-.626 0-1.093-.154-1.4-.461-.302-.308-.454-.78-.454-1.416v-3.15c0-.641.152-1.113.454-1.415.307-.308.774-.461 1.4-.461h3.197c.626 0 1.09.153 1.392.46.307.303.461.775.461 1.416v3.15c0 .636-.154 1.108-.461 1.416-.303.307-.767.461-1.392.461H13.95zm.008-1.448h3.18c.144 0 .247-.034.311-.103.069-.069.103-.175.103-.318v-3.165c0-.144-.034-.25-.103-.319-.064-.069-.167-.103-.31-.103h-3.181c-.144 0-.25.034-.319.103-.063.07-.095.175-.095.319v3.165c0 .143.032.25.095.318.07.069.175.103.319.103z",
          fill: "currentColor"
        }
      )
    }
  )
);
ViewGrid.displayName = "ViewGrid";

// src/icons/components/ViewRows.tsx
import { forwardRef as forwardRef80 } from "react";
import { jsx as jsx92 } from "react/jsx-runtime";
var ViewRows = forwardRef80(
  (props, ref) => /* @__PURE__ */ jsx92(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx92(
        "path",
        {
          d: "M5.853 10.903c-.626 0-1.092-.15-1.4-.453C4.151 10.143 4 9.668 4 9.027v-3.15c0-.636.151-1.108.453-1.416.308-.307.774-.461 1.4-.461h11.294c.62 0 1.082.154 1.384.461.307.308.461.78.461 1.416v3.15c0 .641-.154 1.116-.461 1.423-.302.302-.764.454-1.384.454H5.853zm.008-1.447h11.27c.138 0 .241-.034.31-.103.07-.07.104-.178.104-.326V5.869c0-.143-.035-.25-.104-.318-.069-.069-.172-.103-.31-.103H5.861c-.138 0-.241.034-.31.103-.069.069-.103.175-.103.318v3.158c0 .148.034.257.103.326.069.069.172.103.31.103zM5.853 19c-.626 0-1.092-.154-1.4-.461-.302-.308-.453-.78-.453-1.416v-3.15c0-.641.151-1.113.453-1.415.308-.308.774-.461 1.4-.461h11.294c.62 0 1.082.153 1.384.46.307.303.461.775.461 1.416v3.15c0 .636-.154 1.108-.461 1.416-.302.307-.764.461-1.384.461H5.853zm.008-1.448h11.27c.138 0 .241-.034.31-.103.07-.069.104-.175.104-.318v-3.165c0-.144-.035-.25-.104-.319-.069-.069-.172-.103-.31-.103H5.861c-.138 0-.241.034-.31.103-.069.07-.103.175-.103.319v3.165c0 .143.034.25.103.318.069.069.172.103.31.103z",
          fill: "currentColor"
        }
      )
    }
  )
);
ViewRows.displayName = "ViewRows";

// src/icons/components/Library.tsx
import { forwardRef as forwardRef81 } from "react";
import { jsx as jsx93, jsxs as jsxs32 } from "react/jsx-runtime";
var Library = forwardRef81(
  (props, ref) => /* @__PURE__ */ jsxs32(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx93("title", { children: "Library" }),
        /* @__PURE__ */ jsx93(
          "g",
          {
            id: "Library",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx93(
              "path",
              {
                d: "M14.0083644,0.939560224 L14.0083644,13.8893447 L13.6610723,14.0007356 L7.65153252,15.9282414 L7.4982496,15.9774055 L7.34507468,15.9279058 L1.38047408,14.0004001 L1.03422406,13.8885067 L1.03422406,0.942580109 L1.60961539,1.03034254 C4.43406394,1.4611458 6.3457687,2.00700515 7.38381906,2.71598132 L7.50622406,2.80462601 L7.6373061,2.7149727 C8.64753858,2.05347306 10.4414399,1.52507801 13.0519567,1.09196389 L13.4304464,1.03073453 L14.0083644,0.939560224 Z M13.0082241,2.11262601 L12.8871089,2.1344342 C10.2880887,2.58738735 8.62348941,3.13786595 7.93659592,3.73617771 L7.85254932,3.81448555 L7.66722406,3.99956022 L8,4 L7.99922406,14.7665602 L13.0082241,13.158626 L13.0082241,2.11262601 Z M2.03422406,2.11062601 L2.03422406,13.160626 L6.99922406,14.7645602 L7,4 L7.31822406,3.99956022 L7.13402945,3.80304568 C6.53919545,3.16845709 4.8632229,2.59037382 2.15686043,2.13119177 L2.03422406,2.11062601 Z",
                id: "Combined-Shape",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Library.displayName = "Library";

// src/icons/components/Host.tsx
import { forwardRef as forwardRef82 } from "react";
import { jsx as jsx94, jsxs as jsxs33 } from "react/jsx-runtime";
var Host = forwardRef82(
  (props, ref) => /* @__PURE__ */ jsxs33(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx94("title", { children: "catalog_provider" }),
        /* @__PURE__ */ jsx94(
          "g",
          {
            id: "catalog_provider",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx94(
              "path",
              {
                d: "M5,2 C5.55228475,2 6,2.44771525 6,3 L6,14 C6,14.5522847 5.55228475,15 5,15 L3,15 C2.44771525,15 2,14.5522847 2,14 L2,3 C2,2.44771525 2.44771525,2 3,2 L5,2 Z M11,2 C11.5522847,2 12,2.44771525 12,3 L12,14 C12,14.5522847 11.5522847,15 11,15 L9,15 C8.44771525,15 8,14.5522847 8,14 L8,3 C8,2.44771525 8.44771525,2 9,2 L11,2 Z M4,11 C3.44771525,11 3,11.4477153 3,12 C3,12.5522847 3.44771525,13 4,13 C4.55228475,13 5,12.5522847 5,12 C5,11.4477153 4.55228475,11 4,11 Z M10,11 C9.44771525,11 9,11.4477153 9,12 C9,12.5522847 9.44771525,13 10,13 C10.5522847,13 11,12.5522847 11,12 C11,11.4477153 10.5522847,11 10,11 Z",
                id: "Combined-Shape",
                fill: "currentColor"
              }
            )
          }
        )
      ]
    }
  )
);
Host.displayName = "Host";

// src/icons/components/VirtualMachine.tsx
import { forwardRef as forwardRef83 } from "react";
import { jsx as jsx95, jsxs as jsxs34 } from "react/jsx-runtime";
var VirtualMachine = forwardRef83((props, ref) => /* @__PURE__ */ jsxs34(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx95("title", { children: "virtual_machine" }),
      /* @__PURE__ */ jsx95(
        "g",
        {
          id: "virtual_machine",
          stroke: "none",
          strokeWidth: "1",
          fill: "none",
          fillRule: "evenodd",
          children: /* @__PURE__ */ jsx95(
            "path",
            {
              d: "M4.5,14 C4.22385763,14 4,13.7761424 4,13.5 C4,13.2238576 4.22385763,13 4.5,13 L6,13 L6,12 L3,12 C1.8954305,12 1,11.1045695 1,10 L1,4 C1,2.8954305 1.8954305,2 3,2 L13,2 C14.1045695,2 15,2.8954305 15,4 L15,10 C15,11.1045695 14.1045695,12 13,12 L10,12 L10,13 L11.5,13 C11.7761424,13 12,13.2238576 12,13.5 C12,13.7761424 11.7761424,14 11.5,14 L4.5,14 Z M13,3 L3,3 C2.44771525,3 2,3.44771525 2,4 L2,10 C2,10.5522847 2.44771525,11 3,11 L13,11 C13.5522847,11 14,10.5522847 14,10 L14,4 C14,3.44771525 13.5522847,3 13,3 Z",
              id: "Shape",
              fill: "currentColor"
            }
          )
        }
      )
    ]
  }
));
VirtualMachine.displayName = "VirtualMachine";

// src/icons/components/Role.tsx
import { forwardRef as forwardRef84 } from "react";
import { jsx as jsx96, jsxs as jsxs35 } from "react/jsx-runtime";
var Role = forwardRef84(
  (props, ref) => /* @__PURE__ */ jsxs35(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx96("title", { children: "remote_hosts_management_role" }),
        /* @__PURE__ */ jsx96(
          "g",
          {
            id: "remote_hosts_management_role",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx96(
              "path",
              {
                d: "M8.52261263,14.0549475 L8.09072524,14.0549475 L7.99886963,13.9359472 L7.68109348,13.7817024 C7.11085943,13.4937372 6.56212167,13.1703049 6.03543684,12.8115392 L5.64456683,12.5358421 C4.79772025,11.9175832 4.16798291,11.3225072 3.6742663,10.6203175 C3.19022463,9.93193302 2.93238191,9.22212152 2.93172116,8.45186088 L2.93148896,3.37214596 C2.93162198,2.9107786 3.16134138,2.60235027 3.60212938,2.4682822 C3.98782224,2.35091617 3.98782224,2.35091617 4.37355953,2.23348466 C6.24828124,1.66275476 7.07927705,1.41073863 8.11895509,1.09906136 C8.31648258,1.03985 8.54512169,1.04042748 8.74276011,1.09969537 C9.4370912,1.30794988 9.99208789,1.47601303 11.2395016,1.85495311 C12.2320199,2.1564609 12.6747209,2.29067371 13.2255636,2.45666557 C13.5641452,2.55870558 13.8076311,2.76575932 13.9099763,3.10859064 L13.9308696,3.25161795 L13.9215557,8.74578657 C13.9197741,8.75514753 13.9197741,8.75514753 13.9171313,8.76989039 L13.9112585,8.80242216 C13.9079619,8.81956542 13.9045576,8.83418977 13.8943445,8.87806283 C13.8771617,8.94386498 13.8640946,8.99907101 13.8350916,9.12591984 C13.7617028,9.44689511 13.7222086,9.59334119 13.6476519,9.77970142 C13.3614875,10.4949556 12.8956813,11.0908136 12.1913459,11.737816 C11.3488645,12.511698 10.3718181,13.1660603 9.21205213,13.7635735 C9.1233448,13.8092799 9.05237926,13.8456306 8.89349015,13.9268577 C8.81933562,13.9647673 8.81933562,13.9647673 8.75048972,14 L8.52186963,13.5549475 L8.52261263,14.0549475 Z M8.43014272,2.054942 L8.4061031,2.05694758 C7.36824847,2.36807823 6.53815952,2.61981934 4.67183698,3.18799224 C4.60968732,3.20691271 4.56245045,3.22129321 4.52083671,3.23396169 L4.32063439,3.29490613 C4.20815461,3.32914333 4.1136551,3.35789946 3.89315624,3.42499708 L3.93086963,3.41294716 L3.93172079,8.45100026 C3.93213245,8.93088525 4.07552677,9.38547738 4.3611679,9.84688122 L4.49229237,10.0451364 C4.91455435,10.6456995 5.46849712,11.1691528 6.23420684,11.7281759 C6.95490279,12.2543101 7.72202877,12.7063782 8.53376045,13.0839497 L8.43586963,13.0369472 C8.56503229,12.9716751 8.63509088,12.9358146 8.7028274,12.9009878 L8.75404358,12.8746257 C9.83930862,12.3154955 10.7434411,11.7099662 11.5148531,11.0013668 C12.1186093,10.4467564 12.4977433,9.96176932 12.7192001,9.40824863 C12.7679461,9.28640413 12.7984751,9.17320127 12.8599634,8.90427423 L12.880941,8.81304101 C12.8992173,8.73424375 12.911303,8.68470851 12.9267276,8.62563979 C12.9274428,8.62275741 12.9274428,8.62275741 12.932586,8.59475763 L12.9308696,8.60094716 L12.9308696,3.41194716 L12.8009622,3.37311511 C12.3524442,3.23784094 11.9414784,3.11327484 11.1894271,2.88485859 L10.9532005,2.81310365 C9.70254685,2.43317935 9.14829994,2.26534325 8.45549314,2.05754592 C8.4444007,2.05421952 8.4154478,2.05414639 8.4061031,2.05694758 L8.43014272,2.054942 Z",
                id: "Fill-1",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Role.displayName = "Role";

// src/icons/components/Roles.tsx
import { forwardRef as forwardRef85 } from "react";
import { jsx as jsx97, jsxs as jsxs36 } from "react/jsx-runtime";
var Roles = forwardRef85(
  (props, ref) => /* @__PURE__ */ jsxs36(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx97("title", { children: "remote_hosts_management_roles" }),
        /* @__PURE__ */ jsx97(
          "g",
          {
            id: "remote_hosts_management_roles",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx97(
              "path",
              {
                d: "M10.2546711,5.03500986 L13.3928001,5.93970436 C13.6738768,6.02038003 13.8859552,6.19213778 13.9766765,6.48156078 L13.9995665,6.63111359 L13.9995665,10.2298539 L13.9823406,10.3672931 L13.8977254,10.7110561 C13.8610139,10.855936 13.8330477,10.9441749 13.787333,11.0530013 C13.5751887,11.5579958 13.2343522,11.9732312 12.7243458,12.4194139 C12.2094938,12.8698233 11.6255613,13.2597113 10.9511789,13.6161073 L10.1792011,14 L9.69478706,14 L9.60756646,13.8919997 L9.35510065,13.7747987 C8.99227803,13.5974771 8.64174688,13.4006979 8.30381537,13.1845274 L7.97009516,12.9618957 C7.36452611,12.5408395 6.91164465,12.1332639 6.55400513,11.6488318 C6.19468899,11.1621605 6.00066283,10.6534635 6.00016261,10.0981077 L6,6.71141034 C6.00011718,6.32433038 6.21060953,6.05517466 6.58217015,5.94754401 L9.74446495,5.03458147 C9.90699992,4.98817966 10.0922604,4.98862529 10.2546711,5.03500986 Z M12.9995665,6.86699973 L9.998,6.001 L7.0605359,6.85005612 L6.99956646,6.86699973 L7.0001622,10.097204 C7.00041217,10.3747271 7.08678916,10.6407425 7.26293433,10.9162413 L7.35850446,11.0548782 C7.64204687,11.4389438 8.01774149,11.7770544 8.54095904,12.140851 C8.93834482,12.4171424 9.35631709,12.6623774 9.79417017,12.8763639 L10.0025665,12.9729997 L10.1658359,12.8938943 C10.9147059,12.5264477 11.5368442,12.1296212 12.0659073,11.6667794 C12.4715666,11.3118854 12.7221883,11.0065573 12.8653777,10.6657049 L12.8977581,10.5760199 C12.9030457,10.5589368 12.9084427,10.5402479 12.914195,10.5191463 L12.9995665,10.1769997 L12.9995665,6.86699973 Z M6.25467113,2.03500986 L9.39280014,2.93970436 C9.67387677,3.02038003 9.88595519,3.19213778 9.97667646,3.48156078 L9.99956646,3.63111359 L9.999,4 L8.999,4 L8.99956646,3.86699973 L5.998,3.001 L3.0605359,3.85005612 L2.99956646,3.86699973 L3.0001622,7.09720405 C3.00041217,7.37472711 3.08678916,7.64074246 3.26293433,7.91624132 L3.35850446,8.05487823 C3.64204687,8.43894382 4.01774149,8.77705437 4.54095904,9.14085096 C4.69094012,9.24512871 4.84385366,9.34498261 4.99966171,9.44040232 L5,10.592 C4.75999056,10.4641364 4.52910305,10.3286411 4.30381537,10.1845274 L3.97009516,9.96189568 C3.36452611,9.54083955 2.91164465,9.13326386 2.55400513,8.64883178 C2.19468899,8.16216047 2.00066283,7.65346349 2.00016261,7.09810771 L2,3.71141034 C2.00011718,3.32433038 2.21060953,3.05517466 2.58217015,2.94754401 L5.74446495,2.03458147 C5.90699992,1.98817966 6.0922604,1.98862529 6.25467113,2.03500986 Z",
                id: "Shape",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Roles.displayName = "Role";

// src/icons/components/Cache.tsx
import { forwardRef as forwardRef86 } from "react";
import { jsx as jsx98, jsxs as jsxs37 } from "react/jsx-runtime";
var Cache = forwardRef86(
  (props, ref) => /* @__PURE__ */ jsxs37(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx98("title", { children: "catalog_cache" }),
        /* @__PURE__ */ jsx98(
          "g",
          {
            id: "catalog_cache",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx98(
              "path",
              {
                d: "M8.5,1 C12.0898509,1 15,3.91014913 15,7.5 C15,11.0898509 12.0898509,14 8.5,14 C4.91014913,14 2,11.0898509 2,7.5 C2,3.91014913 4.91014913,1 8.5,1 Z M8.5,2 C5.46243388,2 3,4.46243388 3,7.5 C3,10.5375661 5.46243388,13 8.5,13 C11.5375661,13 14,10.5375661 14,7.5 C14,4.46243388 11.5375661,2 8.5,2 Z M9.0001365,4 L8.99872252,7 L12,7 L12,8 L8,8 L8,4 L9.0001365,4 Z",
                id: "Combined-Shape",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Cache.displayName = "Cache";

// src/icons/components/Claim.tsx
import { forwardRef as forwardRef87 } from "react";
import { jsx as jsx99, jsxs as jsxs38 } from "react/jsx-runtime";
var Claim = forwardRef87(
  (props, ref) => /* @__PURE__ */ jsxs38(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx99("title", { children: "remote_hosts_management_claim" }),
        /* @__PURE__ */ jsx99(
          "g",
          {
            id: "remote_hosts_management_claim",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx99(
              "path",
              {
                d: "M8,1 C9.65685425,1 11,2.34314575 11,4 L11,6 C12.1045695,6 13,6.8954305 13,8 L13,12 C13,13.1045695 12.1045695,14 11,14 L4,14 C2.8954305,14 2,13.1045695 2,12 L2,8 C2,6.8954305 2.8954305,6 4,6 L4,4 C4,2.34314575 5.34314575,1 7,1 L8,1 Z M11,7 L4,7 C3.44771525,7 3,7.44771525 3,8 L3,12 C3,12.5522847 3.44771525,13 4,13 L11,13 C11.5522847,13 12,12.5522847 12,12 L12,8 C12,7.44771525 11.5522847,7 11,7 Z M8,2 L7,2 C5.8954305,2 5,2.8954305 5,4 L5,6 L10,6 L10,4 C10,2.9456382 9.18412221,2.08183488 8.14926234,2.00548574 L8,2 Z",
                id: "Shape",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Claim.displayName = "Claim";

// src/icons/components/Claims.tsx
import { forwardRef as forwardRef88 } from "react";
import { jsx as jsx100, jsxs as jsxs39 } from "react/jsx-runtime";
var Claims = forwardRef88(
  (props, ref) => /* @__PURE__ */ jsxs39(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx100("title", { children: "remote_hosts_management_claims" }),
        /* @__PURE__ */ jsx100(
          "g",
          {
            id: "remote_hosts_management_claims",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx100(
              "path",
              {
                d: "M10.5,4 C11.8807119,4 13,5.11928813 13,6.5 L13,8 C13.5522847,8 14,8.44771525 14,9 L14,13 C14,13.5522847 13.5522847,14 13,14 L8,14 C7.44771525,14 7,13.5522847 7,13 L7,9 C7,8.44771525 7.44771525,8 8,8 L8,6.5 C8,5.11928813 9.11928813,4 10.5,4 Z M13,9 L8,9 L8,13 L13,13 L13,9 Z M5.5,2 C6.4721012,2 7.31461527,2.55482847 7.72814766,3.36509085 C7.27104161,3.95546042 7,4.69607763 7,5.5 L7,4.5 C7,3.72030388 6.40511192,3.07955132 5.64446001,3.00686658 L5.5,3 C4.67157288,3 4,3.67157288 4,4.5 L4,6 L7,6 L7,6.26756439 C6.848186,6.35538405 6.70898693,6.46258595 6.58578644,6.58578644 C6.46249782,6.70907505 6.35523069,6.84838515 6.26737596,7.00032581 L3,7 L3,11 L6,11 L6,12 L3,12 C2.44771525,12 2,11.5522847 2,11 L2,7 C2,6.44771525 2.44771525,6 3,6 L3,4.5 C3,3.11928813 4.11928813,2 5.5,2 Z M10.5,5 C9.67157288,5 9,5.67157288 9,6.5 L9,8 L12,8 L12,6.5 C12,5.72030388 11.4051119,5.07955132 10.64446,5.00686658 L10.5,5 Z",
                id: "Shape",
                fill: "currentColor",
                fillRule: "nonzero"
              }
            )
          }
        )
      ]
    }
  )
);
Claims.displayName = "Claims";

// src/icons/components/KeyManagement.tsx
import { forwardRef as forwardRef89 } from "react";
import { jsx as jsx101, jsxs as jsxs40 } from "react/jsx-runtime";
var KeyManagement = forwardRef89(
  (props, ref) => /* @__PURE__ */ jsxs40(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx101("title", { children: "remote_hosts_management_key" }),
        /* @__PURE__ */ jsx101(
          "g",
          {
            id: "remote_hosts_management_key",
            stroke: "none",
            strokeWidth: "1",
            fill: "none",
            fillRule: "evenodd",
            children: /* @__PURE__ */ jsx101(
              "path",
              {
                d: "M6,2 C8.209139,2 10,3.790861 10,6 C10,6.36113362 9.95214232,6.71108947 9.86242313,7.04387141 L13.9739242,11.1563871 L14.0065031,14.0173931 L11.1454971,13.9848142 L7.0268506,9.86697151 C6.69916388,9.95375886 6.35498204,10 6,10 C3.790861,10 2,8.209139 2,6 C2,3.790861 3.790861,2 6,2 Z M6,3 C4.34314575,3 3,4.34314575 3,6 C3,7.65685425 4.34314575,9 6,9 C6.26363661,9 6.52188668,8.96623246 6.77082915,8.9003004 L7.32700996,8.75299672 L7.73388837,9.15979572 L11.564,12.989 L12.994,13.005 L12.978,11.575 L9.15522912,7.75089095 L8.74636182,7.34192276 L8.89689778,6.78356233 C8.9650682,6.53070804 9,6.26814159 9,6 C9,4.34314575 7.65685425,3 6,3 Z",
                id: "Combined-Shape",
                fill: "currentColor",
                fillRule: "nonzero",
                transform: "translate(8.0033, 8.0087) scale(-1, 1) translate(-8.0033, -8.0087)"
              }
            )
          }
        )
      ]
    }
  )
);
KeyManagement.displayName = "KeyManagement";

// src/icons/components/Windows.tsx
import { forwardRef as forwardRef90 } from "react";
import { jsx as jsx102 } from "react/jsx-runtime";
var Windows = forwardRef90(
  (props, ref) => /* @__PURE__ */ jsx102(
    "svg",
    {
      viewBox: "0 0 20 20",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx102(
        "g",
        {
          id: "Dribbble-Light-Preview",
          transform: "translate(-60.000000, -7439.000000)",
          fill: "currentColor",
          children: /* @__PURE__ */ jsx102("g", { id: "icons", transform: "translate(56.000000, 160.000000)", children: /* @__PURE__ */ jsx102("path", { d: "M13.1458647,7289.43426 C13.1508772,7291.43316 13.1568922,7294.82929 13.1619048,7297.46884 C16.7759398,7297.95757 20.3899749,7298.4613 23.997995,7299 C23.997995,7295.84873 24.002005,7292.71146 23.997995,7289.71311 C20.3809524,7289.71311 16.7649123,7289.43426 13.1458647,7289.43426 M4,7289.43526 L4,7296.22153 C6.72581454,7296.58933 9.45162907,7296.94113 12.1724311,7297.34291 C12.1774436,7294.71736 12.1704261,7292.0908 12.1704261,7289.46524 C9.44661654,7289.47024 6.72380952,7289.42627 4,7289.43526 M4,7281.84344 L4,7288.61071 C6.72581454,7288.61771 9.45162907,7288.57673 12.1774436,7288.57973 C12.1754386,7285.96017 12.1754386,7283.34361 12.1724311,7280.72405 C9.44461153,7281.06486 6.71679198,7281.42567 4,7281.84344 M24,7288.47179 C20.3879699,7288.48578 16.7759398,7288.54075 13.1619048,7288.55175 C13.1598997,7285.88921 13.1598997,7283.22967 13.1619048,7280.56914 C16.7689223,7280.01844 20.3839599,7279.50072 23.997995,7279 C24,7282.15826 23.997995,7285.31353 24,7288.47179" }) })
        }
      )
    }
  )
);
Windows.displayName = "Windows";

// src/icons/components/Ubuntu.tsx
import { forwardRef as forwardRef91 } from "react";
import { jsx as jsx103 } from "react/jsx-runtime";
var Ubuntu = forwardRef91(
  (props, ref) => /* @__PURE__ */ jsx103(
    "svg",
    {
      fill: "currentColor",
      viewBox: "-5 0 32 32",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx103("path", { d: "M16.469 9.375c-1.063-0.594-1.406-1.938-0.813-3 0.406-0.719 1.156-1.094 1.906-1.094 0.375 0 0.75 0.094 1.094 0.281 1.063 0.625 1.406 1.969 0.813 3-0.406 0.719-1.156 1.094-1.906 1.094-0.375 0-0.75-0.094-1.094-0.281zM21.938 15.594h-3.625c-0.125-1.688-0.969-3.188-2.25-4.156-0.219-0.156-0.438-0.313-0.688-0.469-0.813-0.438-1.75-0.688-2.75-0.688-1.031 0-1.969 0.25-2.813 0.719l-2-3.031c1.406-0.844 3.031-1.313 4.813-1.313 0.688 0 1.375 0.063 2.063 0.219-0.25 1.219 0.281 2.5 1.406 3.156 0.438 0.25 0.938 0.375 1.469 0.375 0.719 0 1.406-0.25 1.938-0.719 1.438 1.563 2.344 3.625 2.438 5.906zM7.125 8.438l2 3.031c-1.25 0.969-2.094 2.438-2.188 4.125-0.031 0.125-0.031 0.25-0.031 0.406 0 0.125 0 0.281 0.031 0.406 0.125 1.781 1.063 3.313 2.438 4.281l-1.906 3.094c-1.813-1.188-3.188-3-3.813-5.125 0.875-0.5 1.5-1.469 1.5-2.563s-0.625-2.094-1.563-2.594c0.594-2.063 1.844-3.844 3.531-5.063zM2.188 13.906c1.219 0 2.219 0.969 2.219 2.188s-1 2.219-2.219 2.219-2.188-1-2.188-2.219 0.969-2.188 2.188-2.188zM8.188 24.219l1.906-3.125c0.75 0.375 1.625 0.594 2.531 0.594 1 0 1.938-0.25 2.781-0.719 0.25-0.125 0.469-0.281 0.688-0.469 1.25-0.938 2.094-2.406 2.219-4.094h3.625c-0.094 2.375-1.094 4.531-2.656 6.125-0.469-0.344-1.063-0.531-1.656-0.531-0.531 0-1.031 0.125-1.469 0.375-1 0.594-1.531 1.656-1.469 2.719-0.688 0.156-1.375 0.25-2.063 0.25-1.625 0-3.125-0.406-4.438-1.125zM17.625 22.75c0.75 0 1.5 0.375 1.906 1.094 0.594 1.063 0.219 2.438-0.813 3.031-0.344 0.188-0.719 0.281-1.094 0.281-0.781 0-1.5-0.375-1.906-1.094-0.625-1.063-0.25-2.406 0.813-3.031 0.344-0.188 0.719-0.281 1.094-0.281z" })
    }
  )
);
Ubuntu.displayName = "Ubuntu";

// src/icons/components/Debian.tsx
import { forwardRef as forwardRef92 } from "react";
import { jsx as jsx104 } from "react/jsx-runtime";
var Debian = forwardRef92(
  (props, ref) => /* @__PURE__ */ jsx104(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 32 32",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx104("path", { d: "M3.973 10.755c0.085-0.271 0.171-0.624 0.24-0.984l0.010-0.066c-0.437 0.55-0.212 0.662-0.25 1.037zM4.761 7.43c0.087 0.712-0.537 1 0.137 0.525 0.375-0.825-0.137-0.225-0.125-0.525zM16.562 1.154c0.327-0.062 0.734-0.115 1.146-0.147l0.041-0.003c-0.462 0.038-0.925 0.063-1.375 0.125l0.187 0.025zM27.378 14.53l-0.087 0.187c-0.145 1.031-0.448 1.963-0.885 2.814l0.023-0.049c0.472-0.854 0.803-1.852 0.933-2.912l0.004-0.040zM13.701 17.507c-0.153-0.187-0.283-0.401-0.381-0.633l-0.007-0.017c0.134 0.419 0.316 0.784 0.546 1.113l-0.009-0.013-0.15-0.45zM12.926 17.545l-0.062 0.35c0.298 0.477 0.628 0.89 1 1.262l-0-0c-0.3-0.587-0.525-0.825-0.937-1.625zM25.276 13.968c-0.028 0.687-0.2 1.328-0.487 1.901l0.012-0.027-0.437 0.226c-0.35 0.675 0.038 0.437-0.212 0.975-0.602 0.595-1.264 1.13-1.976 1.596l-0.048 0.030c-0.251 0 0.175-0.312 0.237-0.425-0.739 0.5-0.601 0.75-1.713 1.062l-0.038-0.075c-0.468 0.16-1.008 0.253-1.569 0.253-2.759 0-4.996-2.237-4.996-4.996 0-0.020 0-0.041 0-0.061l-0 0.003c-0.037 0.212-0.087 0.162-0.15 0.25-0.010-0.112-0.016-0.242-0.016-0.374 0-1.752 1.015-3.268 2.49-3.989l0.026-0.012c0.55-0.283 1.2-0.448 1.888-0.448 1.066 0 2.040 0.397 2.78 1.052l-0.004-0.004c-0.771-0.993-1.965-1.626-3.306-1.626-0.033 0-0.066 0-0.099 0.001l0.005-0c-1.417 0.013-2.649 0.792-3.303 1.943l-0.010 0.019c-0.75 0.475-0.837 1.837-1.162 2.076-0.068 0.337-0.107 0.724-0.107 1.12 0 2.225 1.232 4.161 3.051 5.165l0.030 0.015c0.337 0.237 0.1 0.262 0.15 0.437-0.752-0.362-1.388-0.85-1.906-1.443l-0.006-0.007c0.28 0.439 0.611 0.814 0.992 1.131l0.008 0.006c-0.687-0.225-1.587-1.625-1.849-1.687 1.162 2.074 4.724 3.65 6.574 2.874-0.164 0.012-0.355 0.019-0.547 0.019-0.845 0-1.658-0.135-2.419-0.385l0.055 0.016c-0.412-0.2-0.962-0.637-0.875-0.712 0.83 0.359 1.796 0.567 2.811 0.567 1.736 0 3.329-0.61 4.577-1.627l-0.013 0.010c0.55-0.437 1.162-1.175 1.337-1.187-0.25 0.4 0.050 0.2-0.15 0.55 0.55-0.9-0.25-0.375 0.575-1.55l0.3 0.412c-0.112-0.75 0.925-1.651 0.825-2.827 0.237-0.375 0.25 0.375 0 1.212 0.362-0.925 0.1-1.062 0.187-1.824 0.1 0.215 0.198 0.476 0.277 0.745l0.011 0.042c-0.015-0.121-0.023-0.262-0.023-0.405 0-0.581 0.138-1.13 0.382-1.615l-0.009 0.021c-0.112-0.062-0.35 0.375-0.4-0.662 0-0.462 0.125-0.25 0.175-0.35-0.252-0.292-0.423-0.66-0.474-1.066l-0.001-0.010c0.1-0.162 0.275 0.412 0.425 0.425-0.111-0.386-0.2-0.845-0.247-1.316l-0.003-0.034c-0.425-0.85-0.15 0.125-0.5-0.375-0.425-1.363 0.375-0.312 0.425-0.925 0.533 0.885 0.956 1.911 1.212 3.002l0.014 0.073c-0.151-0.837-0.363-1.575-0.64-2.28l0.028 0.081c0.2 0.087-0.325-1.551 0.262-0.462-0.805-2.376-2.428-4.295-4.526-5.464l-0.050-0.025c0.225 0.212 0.525 0.487 0.412 0.525-0.937-0.562-0.775-0.6-0.912-0.837-0.762-0.312-0.812 0.025-1.325 0-0.865-0.449-1.877-0.854-2.933-1.158l-0.119-0.029 0.062 0.287c-0.962-0.312-1.125 0.125-2.162 0-0.063-0.050 0.337-0.175 0.662-0.225-0.926 0.125-0.876-0.175-1.788 0.038 0.194-0.132 0.419-0.265 0.652-0.384l0.035-0.016c-0.75 0.050-1.799 0.437-1.475 0.087-1.776 0.642-3.315 1.483-4.697 2.52l0.046-0.033-0.036-0.275c-0.562 0.675-2.449 2.013-2.599 2.888l-0.164 0.037c-0.287 0.5-0.475 1.062-0.712 1.576-0.375 0.65-0.562 0.25-0.5 0.35-0.534 1.086-1.027 2.373-1.408 3.708l-0.041 0.169c0.074 0.691 0.116 1.493 0.116 2.305 0 0.402-0.010 0.802-0.031 1.199l0.002-0.056c-0.003 0.111-0.005 0.242-0.005 0.374 0 6.747 4.321 12.485 10.347 14.597l0.108 0.033c0.811 0.203 1.743 0.32 2.702 0.32 0.144 0 0.288-0.003 0.43-0.008l-0.021 0.001c-1.237-0.35-1.4-0.187-2.599-0.612-0.875-0.4-1.062-0.875-1.675-1.412l0.25 0.437c-1.213-0.425-0.712-0.525-1.701-0.837l0.262-0.337c-0.519-0.189-0.94-0.545-1.206-1.001l-0.006-0.011-0.425 0.012c-0.512-0.626-0.787-1.088-0.762-1.451l-0.139 0.25c-0.162-0.262-1.899-2.376-1-1.888-0.258-0.179-0.469-0.409-0.62-0.677l-0.005-0.010 0.175-0.212c-0.364-0.413-0.633-0.918-0.77-1.476l-0.005-0.024c0.131 0.198 0.326 0.345 0.555 0.411l0.007 0.002c-1.1-2.714-1.162-0.15-2.001-2.752l0.187-0.025c-0.104-0.174-0.213-0.383-0.309-0.599l-0.016-0.039 0.075-0.75c-0.787-0.925-0.225-3.876-0.112-5.501 0.338-0.964 0.709-1.781 1.142-2.559l-0.043 0.083-0.262-0.050c0.5-0.887 2.925-3.589 4.050-3.45 0.537-0.687-0.112 0-0.225-0.175 1.2-1.238 1.575-0.875 2.376-1.1 0.875-0.501-0.75 0.2-0.337-0.189 1.5-0.375 1.062-0.875 3.025-1.062 0.2 0.125-0.487 0.175-0.65 0.325 0.719-0.231 1.545-0.365 2.403-0.365 1.194 0 2.328 0.259 3.349 0.723l-0.051-0.021c2.392 1.275 4.071 3.617 4.408 6.373l0.004 0.040 0.1 0.025c0.024 0.284 0.038 0.615 0.038 0.949 0 0.863-0.091 1.705-0.264 2.517l0.014-0.079 0.25-0.525zM17 1.542l-0.187 0.037 0.175-0.012v-0.025zM16.475 1.392c0.25 0.050 0.562 0.087 0.525 0.15 0.287-0.062 0.35-0.125-0.537-0.15zM22.001 13.632c0.062-0.901-0.175-0.626-0.25-0.276 0.087 0.050 0.162 0.625 0.25 0.275zM21.025 16.194c0.274-0.375 0.479-0.82 0.583-1.302l0.004-0.023c-0.099 0.347-0.24 0.65-0.42 0.925l0.008-0.013c-0.937 0.587-0.087-0.337 0-0.7-1 1.262-0.137 0.75-0.175 1.112zM18.349 16.856c-0.5 0 0.1 0.25 0.751 0.35 0.18-0.135 0.339-0.27 0.489-0.414l-0.002 0.002c-0.242 0.056-0.52 0.087-0.805 0.087-0.152 0-0.302-0.009-0.45-0.027l0.018 0.002z" })
    }
  )
);
Debian.displayName = "Debian";

// src/icons/components/Apple.tsx
import { forwardRef as forwardRef93 } from "react";
import { jsx as jsx105 } from "react/jsx-runtime";
var Apple = forwardRef93(
  (props, ref) => /* @__PURE__ */ jsx105(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx105("path", { d: "M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" })
    }
  )
);
Apple.displayName = "Apple";

// src/icons/components/KaliLinux.tsx
import { forwardRef as forwardRef94 } from "react";
import { jsx as jsx106 } from "react/jsx-runtime";
var KaliLinux = forwardRef94(
  (props, ref) => /* @__PURE__ */ jsx106(
    "svg",
    {
      fill: "currentColor",
      viewBox: "-2.88 -2.88 37.76 37.76",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx106("path", { d: "M16.85 8.081l-0.187-0.606c-1.436-0.223-3.092-0.35-4.778-0.35-0.879 0-1.75 0.035-2.611 0.103l0.114-0.007c-3.096 0.294-5.941 0.915-8.648 1.835l0.265-0.078c3.126-0.78 6.714-1.228 10.407-1.228 1.917 0 3.805 0.121 5.659 0.355l-0.221-0.023zM30.992 23.819s0.39-4.471-6.636-5.502c-0.944-0.144-2.037-0.228-3.148-0.234l-0.006-0c-5.631 0.075-5.836-6.494-1.593-6.826 2.193 0.12 4.213 0.758 5.973 1.793l-0.062-0.034c-0.006 0.040-0.009 0.085-0.009 0.132 0 0.209 0.067 0.403 0.181 0.561l-0.002-0.003c0.293 0.215 0.628 0.402 0.985 0.545l0.031 0.011c0.492 0.288 0.911 0.642 1.261 1.055l0.006 0.007c0.241-0.236 0.509-0.447 0.797-0.628l0.020-0.012c-0.214-0.019-0.411-0.072-0.593-0.153l0.012 0.005c-0.35-0.164-0.649-0.378-0.902-0.638l-0.001-0.001c-0.012-0.027-0.019-0.069 0.075-0.087 0.074-0.061-0.090-0.259-0.162-0.331s-0.556-0.895-0.567-0.912c-0.010-0.026-0.027-0.047-0.050-0.062l-0-0c-0.020-0.001-0.044-0.001-0.067-0.001-0.18 0-0.355 0.019-0.524 0.054l0.017-0.003c-0.446-0.244-0.786-0.632-0.962-1.102l-0.005-0.014c0.004 0.134-0.124 0.28 0 0.586-0.463-0.208-0.811-0.604-0.949-1.088l-0.003-0.012c-0.044 0.091-0.070 0.198-0.070 0.312s0.026 0.221 0.072 0.316l-0.002-0.004c-0.506-0.15-0.892-0.55-1.022-1.052l-0.002-0.010c-0.046 0.085-0.073 0.186-0.073 0.293s0.027 0.208 0.075 0.296l-0.002-0.003c-1.069-0.483-2.318-0.765-3.633-0.765-0.071 0-0.142 0.001-0.212 0.002l0.011-0c-1.603-0.147-1.937-2.967-1.787-3.441-2.007-0.913-4.336-1.539-6.784-1.751l-0.080-0.006c-1.356-0.169-2.926-0.265-4.518-0.265-1.326 0-2.636 0.067-3.928 0.197l0.163-0.013c0.395-0.014 0.859-0.022 1.325-0.022 4.728 0 9.263 0.824 13.469 2.337l-0.278-0.087c0.367 1.327 0.789 2.458 1.294 3.541l-0.058-0.138c-1.376 0.702-2.309 2.094-2.344 3.707l-0 0.005c-0.001 0.039-0.002 0.085-0.002 0.131 0 2.398 1.944 4.343 4.343 4.343 0 0 0 0 0 0h-0c0.162-0.007 0.352-0.011 0.543-0.011 1.981 0 3.859 0.438 5.544 1.222l-0.081-0.034c2.145 1.673 3.533 4.23 3.611 7.114l0 0.013c0.165-2.136-0.636-6.727-4.374-8.12 5.225 0.915 5.685 4.789 5.685 4.789zM26.683 13.223c0.049-0.085 0.207 0.271 0.329 0.421 0.005 0.030 0.012 0.049-0.056 0.034-0.002-0.015-0.007-0.029-0.016-0.040l0 0c-0.084-0.049-0.157-0.106-0.221-0.171l-0-0c-0.030-0.045-0.048-0.1-0.048-0.159 0-0.030 0.005-0.060 0.013-0.087l-0.001 0.002zM26.158 12.299l0.321-0.021c-1.421-1.523-3.226-2.67-5.262-3.287l-0.084-0.022c1.974 0.757 3.653 1.891 5.020 3.325l0.005 0.005zM16.972 8.431c-2.388 0.009-4.675 0.43-6.798 1.194l0.142-0.044c-2.553 0.762-4.779 1.865-6.768 3.28l0.070-0.047c3.932-2.105 8.557-3.461 13.469-3.755l0.092-0.004z" })
    }
  )
);
KaliLinux.displayName = "KaliLinux";

// src/icons/components/RedHat.tsx
import { forwardRef as forwardRef95 } from "react";
import { jsx as jsx107 } from "react/jsx-runtime";
var RedHat = forwardRef95(
  (props, ref) => /* @__PURE__ */ jsx107(
    "svg",
    {
      fill: "currentColor",
      viewBox: "-3.2 -3.2 38.40 38.40",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx107("path", { d: "M26.135 15.933c0.136 0.467 0.233 1.011 0.271 1.572l0.001 0.024c0 2.206-2.479 3.43-5.74 3.43-7.367 0.005-13.821-4.313-13.821-7.165 0-0.002 0-0.004 0-0.005 0-0.416 0.087-0.811 0.245-1.169l-0.007 0.019c-2.648 0.132-6.080 0.606-6.080 3.634 0 4.96 11.753 11.073 21.058 11.073 7.135 0 8.934-3.227 8.934-5.773 0-2.006-1.733-4.28-4.857-5.638zM21.010 17.732c1.971 0 4.824-0.407 4.824-2.752 0.001-0.020 0.001-0.043 0.001-0.067 0-0.167-0.019-0.33-0.054-0.486l0.003 0.015-1.175-5.099c-0.27-1.122-0.507-1.631-2.477-2.615-1.684-0.889-3.637-1.604-5.692-2.045l-0.151-0.027c-0.916 0-1.183 1.182-2.277 1.182-1.052 0-1.833-0.882-2.818-0.882-0.946 0-1.562 0.644-2.037 1.969 0 0-1.325 3.736-1.496 4.279-0.023 0.080-0.036 0.172-0.036 0.267 0 0.014 0 0.028 0.001 0.042l-0-0.002c0 1.452 5.72 6.216 13.384 6.216z" })
    }
  )
);
RedHat.displayName = "RedHat";

// src/icons/components/Fedora.tsx
import { forwardRef as forwardRef96 } from "react";
import { jsx as jsx108 } from "react/jsx-runtime";
var Fedora = forwardRef96(
  (props, ref) => /* @__PURE__ */ jsx108(
    "svg",
    {
      fill: "currentColor",
      viewBox: "-3.52 -3.52 39.04 39.04",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx108("path", { d: "M8.903 29.322s0.112 0.009 0.342 0.031q-0.171-0.017-0.342-0.032zM8.618 29.272l0.187 0.031zM7.31 25.209c0.211 0.166 0.448 0.315 0.702 0.437l0.023 0.010-0.031 0.006-0.022-0.019c-0.255-0.131-0.475-0.275-0.678-0.44l0.007 0.005zM3.121 24.879c1.178 1.095 2.314 2.184 3.472 3.299l0.025 0.025c0.099 0.257 0.237 0.478 0.41 0.666l-0.001-0.002c-1.8-0.747-3.195-2.169-3.889-3.941l-0.016-0.048zM2.649 22.737q2.087 1.912 4.116 3.885c-0.136 0.244-0.226 0.532-0.25 0.839l-0 0.007c-0.002 0.031-0.003 0.067-0.003 0.104s0.001 0.073 0.003 0.109l-0-0.005c-1.15-1.105-2.319-2.224-3.599-3.387-0.138-0.456-0.234-0.986-0.268-1.533l-0.001-0.020zM2.736 21.125c1.65 1.486 3.164 2.945 4.724 4.447l0.219 0.207c-0.298 0.135-0.547 0.332-0.739 0.577l-0.003 0.004q-2.116-2.049-4.308-4.018c-0-0.013-0-0.029-0-0.045 0-0.415 0.039-0.822 0.114-1.215l-0.006 0.040zM21.316 18.009l0.55 0.442c-0.326 0.072-0.704 0.118-1.092 0.129l-0.008 0h-0.020c0.23-0.151 0.42-0.341 0.567-0.564l0.005-0.007zM23.465 17.896l-0.062 0.029zM21.3 16.953l-0.034 0.331zM5.406 16.762q1.234 1.14 2.447 2.304c-1.032 0.618-1.75 1.669-1.906 2.895l-0.002 0.020q-1.341-1.261-2.719-2.482-0.060 0.136-0.114 0.275c0.971 0.872 1.902 1.738 2.814 2.608 0.018 0.634 0.182 1.225 0.46 1.747l-0.010-0.021q-1.757-1.679-3.574-3.293c0.034-0.135 0.050-0.271 0.092-0.404 0.191-0.684 0.468-1.283 0.827-1.823l-0.015 0.023c0.862 0.776 1.687 1.551 2.502 2.324q0.061-0.148 0.134-0.29-1.225-1.153-2.482-2.273c0.199-0.286 0.4-0.536 0.617-0.771l-0.004 0.005q1.216 1.111 2.406 2.252c0.067-0.075 0.137-0.152 0.21-0.222q-1.197-1.135-2.424-2.237c0.226-0.222 0.467-0.431 0.721-0.623l0.018-0.013zM21.527 16.331c0.591 0.525 1.197 1.057 1.842 1.606-0.319 0.159-0.696 0.305-1.087 0.416l-0.047 0.011-0.771-0.622c0.105-0.231 0.167-0.501 0.167-0.786 0-0.224-0.038-0.44-0.108-0.64l0.004 0.014zM6.504 16.076c0.9 0.842 1.781 1.683 2.667 2.537-0.384 0.049-0.732 0.155-1.052 0.311l0.020-0.009c-0.8-0.762-1.625-1.537-2.497-2.331 0.244-0.169 0.527-0.338 0.82-0.488l0.042-0.020zM7.791 15.576l0.777 0.74c-0.069 0.19-0.108 0.41-0.108 0.639 0 0.239 0.043 0.469 0.123 0.68l-0.004-0.013c-0.585-0.555-1.175-1.116-1.789-1.684 0.275-0.127 0.608-0.25 0.952-0.348l0.052-0.013zM8.129 15.483l-0.159 0.040 0.159-0.037zM9.371 15.308l-0.025 0.018h-0.016l0.005 0.005c-0.265 0.176-0.48 0.407-0.632 0.678l-0.005 0.010-0.562-0.534c0.363-0.091 0.787-0.153 1.222-0.174l0.016-0.001zM21.925 14.998q1.286 1.146 2.609 2.249c-0.264 0.191-0.564 0.375-0.878 0.537l-0.039 0.018q-1.433-1.226-2.819-2.506c-0.030 0.002-0.062 0.001-0.092 0.004l-0.032-0.019c0.459-0.036 0.885-0.137 1.282-0.294l-0.030 0.010zM22.999 14.255q1.236 1.088 2.506 2.137c-0.234 0.246-0.482 0.474-0.744 0.683l-0.015 0.011q-1.296-1.083-2.553-2.212c0.274-0.147 0.51-0.324 0.715-0.531l0-0c0.034-0.027 0.059-0.059 0.091-0.087zM23.753 13.236c0.805 0.7 1.65 1.413 2.553 2.149-0.204 0.305-0.409 0.571-0.631 0.821l0.006-0.007q-1.262-1.043-2.487-2.131c0.22-0.239 0.407-0.513 0.55-0.812l0.009-0.020zM23.668 9.789c1.122 1 2.319 2.028 3.646 3.105-0.079 0.414-0.184 0.776-0.317 1.123l0.015-0.045q-1.466-1.197-2.883-2.453l0.003 0.069c0 0.095-0.005 0.19-0.012 0.282 0.879 0.765 1.8 1.546 2.799 2.356-0.153 0.367-0.312 0.676-0.492 0.971l0.018-0.031q-1.307-1.071-2.574-2.189c0.157-0.407 0.248-0.878 0.248-1.37 0-0.664-0.166-1.29-0.458-1.838l0.010 0.021zM23.011 7.502q2.153 1.972 4.411 3.824c0 0.089 0.019 0.175 0.016 0.262 0 0.017 0 0.036 0 0.056 0 0.339-0.027 0.672-0.080 0.997l0.005-0.036q-2.627-2.15-5.101-4.479c0.305-0.146 0.557-0.358 0.746-0.619l0.004-0.006zM23.378 6.14q1.816 1.664 3.706 3.244c-0.017-0.055-0.041-0.109-0.061-0.162 0.195 0.515 0.329 1.111 0.375 1.731l0.001 0.021q-2.172-1.797-4.236-3.718l0.019-0.041c0.108-0.221 0.18-0.478 0.2-0.75l0-0.007c0.003-0.037 0.004-0.080 0.004-0.123s-0.002-0.086-0.005-0.129l0 0.006c-0-0.026-0.002-0.050-0.005-0.075l0 0.003zM22.816 4.972c1.83 0.723 3.268 2.108 4.043 3.852l0.018 0.047q-1.852-1.576-3.628-3.239c-0.11-0.255-0.255-0.473-0.433-0.659l0.001 0.001zM21.286 4.622l0.162 0.030zM20.405 4.557c0.042-0.001 0.091-0.002 0.14-0.002 0.48 0 0.948 0.054 1.398 0.156l-0.042-0.008c0.668 0.302 1.125 0.961 1.127 1.728v0c-0.031 0.869-0.743 1.561-1.616 1.561-0.038 0-0.076-0.001-0.113-0.004l0.005 0c-0.27-0.071-0.58-0.112-0.9-0.112h-0c-2.065 0.026-3.728 1.706-3.728 3.774 0 0.125 0.006 0.249 0.018 0.371l-0.001-0.015c0.030 0.995-0.055 2.001 0.041 2.989 0.416 0.571 1.233 0.225 1.843 0.32 0.345 0 0.702 0.009 1.062 0.010 0.016 0.006 0.034 0.009 0.052 0.010h0c0.893 0.001 1.616 0.725 1.616 1.618s-0.725 1.618-1.618 1.618c-0.003 0-0.005 0-0.008-0h0c-0 0-0.001 0-0.001 0-0.027 0-0.052 0.006-0.075 0.017l0.001-0c-0.971 0.004-1.941 0-2.912 0.003 0.038 0.484 0.059 1.049 0.059 1.618 0 1.568-0.163 3.098-0.472 4.574l0.025-0.144c-1.007 2.775-3.621 4.722-6.689 4.722-0.591 0-1.165-0.072-1.714-0.208l0.049 0.010c-0.644-0.291-1.084-0.928-1.085-1.667v-0c0.039-0.877 0.759-1.572 1.642-1.572 0.096 0 0.191 0.008 0.282 0.024l-0.010-0.001c0.094 0.008 0.141 0.015 0.21 0.025 0.219 0.049 0.471 0.077 0.73 0.077 0.708 0 1.366-0.211 1.916-0.574l-0.013 0.008c1.088-0.736 1.794-1.965 1.794-3.359 0-0.223-0.018-0.441-0.053-0.654l0.003 0.023c-0.025-0.858 0.054-1.73-0.041-2.582-0.416-0.57-1.23-0.225-1.839-0.32h-1c-0.023-0.012-0.050-0.019-0.078-0.019-0.002 0-0.003 0-0.005 0h0c-0.001 0-0.001 0-0.002 0-0.894 0-1.618-0.725-1.618-1.618 0-0.891 0.72-1.614 1.61-1.618h0c0.029-0 0.056-0.008 0.080-0.020l-0.001 0h2.894c-0.028-0.462-0.044-1.002-0.044-1.546 0-1.449 0.113-2.872 0.33-4.26l-0.020 0.154c0.875-2.967 3.571-5.098 6.766-5.106h0.001zM16.006 1.006c-6.164 0.012-11.457 3.731-13.768 9.045l-0.038 0.097c-0.779 1.915-1.232 4.136-1.232 6.463 0 0.463 0.018 0.922 0.053 1.376l-0.004-0.060c0.012 3.332-0.025 6.667 0.019 9.996 0.223 1.743 1.697 3.076 3.482 3.076 0.153 0 0.304-0.010 0.451-0.029l-0.018 0.002c4.070-0.025 8.14 0.055 12.209-0.042 7.764-0.617 13.832-7.070 13.832-14.94 0-8.276-6.709-14.984-14.984-14.984-0.001 0-0.002 0-0.003 0h0z" })
    }
  )
);
Fedora.displayName = "Fedora";

// src/icons/components/CentOS.tsx
import { forwardRef as forwardRef97 } from "react";
import { jsx as jsx109 } from "react/jsx-runtime";
var CentOS = forwardRef97(
  (props, ref) => /* @__PURE__ */ jsx109(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 32 32",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx109("path", { d: "M 15.996094 3 L 13 6.0039062 L 15 6.0039062 L 15 12 L 16 13 L 17 12 L 17 6.0039062 L 19 6.0039062 L 15.996094 3 z M 7 7 L 7 11 L 8.2929688 9.7070312 L 12.585938 14 L 14 14 L 14 12.585938 L 9.7070312 8.2929688 L 11 7 L 7 7 z M 12.414062 7 L 11.121094 8.2929688 L 14 11.171875 L 14 7 L 12.414062 7 z M 18 7 L 18 11.171875 L 20.878906 8.2929688 L 19.585938 7 L 18 7 z M 21 7 L 22.292969 8.2929688 L 18 12.585938 L 18 14 L 19.414062 14 L 23.707031 9.7070312 L 25 11 L 25 7 L 21 7 z M 8.2929688 11.121094 L 7 12.414062 L 7 14 L 11.171875 14 L 8.2929688 11.121094 z M 23.707031 11.121094 L 20.828125 14 L 25 14 L 25 12.414062 L 23.707031 11.121094 z M 6.0039062 13 L 3 16.003906 L 6.0039062 19 L 6.0039062 17 L 12 17 L 13 16 L 12 15 L 6.0039062 15 L 6.0039062 13 z M 25.996094 13 L 25.996094 15 L 20 15 L 19 16 L 20 17 L 25.996094 17 L 25.996094 19 L 29 15.996094 L 25.996094 13 z M 7 18 L 7 19.585938 L 8.2929688 20.878906 L 11.171875 18 L 7 18 z M 12.585938 18 L 8.2929688 22.292969 L 7 21 L 7 25 L 11 25 L 9.7070312 23.707031 L 14 19.414062 L 14 18 L 12.585938 18 z M 18 18 L 18 19.414062 L 22.292969 23.707031 L 21 25 L 25 25 L 25 21 L 23.707031 22.292969 L 19.414062 18 L 18 18 z M 20.828125 18 L 23.707031 20.878906 L 25 19.585938 L 25 18 L 20.828125 18 z M 16 19 L 15 20 L 15 25.996094 L 13 25.996094 L 16.003906 29 L 19 25.996094 L 17 25.996094 L 17 20 L 16 19 z M 14 20.828125 L 11.121094 23.707031 L 12.414062 25 L 14 25 L 14 20.828125 z M 18 20.828125 L 18 25 L 19.585938 25 L 20.878906 23.707031 L 18 20.828125 z" })
    }
  )
);
CentOS.displayName = "CentOS";

// src/icons/components/Clone.tsx
import { forwardRef as forwardRef98 } from "react";
import { jsx as jsx110, jsxs as jsxs41 } from "react/jsx-runtime";
var Clone = forwardRef98(
  (props, ref) => /* @__PURE__ */ jsxs41(
    "svg",
    {
      fill: "currentColor",
      viewBox: "0 0 36 36",
      version: "1.1",
      preserveAspectRatio: "xMidYMid meet",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx110("path", { d: "M6,6H22v4h2V6a2,2,0,0,0-2-2H6A2,2,0,0,0,4,6V22a2,2,0,0,0,2,2h4V22H6Z" }),
        /* @__PURE__ */ jsx110("path", { d: "M30,12H14a2,2,0,0,0-2,2V30a2,2,0,0,0,2,2H30a2,2,0,0,0,2-2V14A2,2,0,0,0,30,12Zm0,18H14V14H30Z" }),
        /* @__PURE__ */ jsx110("polygon", { points: "21 28 23 28 23 23 28 23 28 21 23 21 23 16 21 16 21 21 16 21 16 23 21 23 21 28" }),
        /* @__PURE__ */ jsx110("rect", { x: "0", y: "0", width: "36", height: "36", "fill-opacity": "0" })
      ]
    }
  )
);
Clone.displayName = "Clone";

// src/icons/components/Copy.tsx
import { forwardRef as forwardRef99 } from "react";
import { jsx as jsx111, jsxs as jsxs42 } from "react/jsx-runtime";
var Copy = forwardRef99(
  (props, ref) => /* @__PURE__ */ jsxs42(
    "svg",
    {
      viewBox: "0 0 1024 1024",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx111("path", { d: "M768 832a128 128 0 0 1-128 128H192A128 128 0 0 1 64 832V384a128 128 0 0 1 128-128v64a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64h64z" }),
        /* @__PURE__ */ jsx111("path", { d: "M384 128a64 64 0 0 0-64 64v448a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64V192a64 64 0 0 0-64-64H384zm0-64h448a128 128 0 0 1 128 128v448a128 128 0 0 1-128 128H384a128 128 0 0 1-128-128V192A128 128 0 0 1 384 64z" })
      ]
    }
  )
);
Copy.displayName = "Copy";

// src/icons/components/Live.tsx
import { forwardRef as forwardRef100 } from "react";
import { jsx as jsx112 } from "react/jsx-runtime";
var Live = forwardRef100(
  (props, ref) => /* @__PURE__ */ jsx112(
    "svg",
    {
      viewBox: "0 0 24 24",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx112("path", { d: "M6.34277267,4.93867691 C6.73329697,5.3292012 6.73329697,5.96236618 6.34277267,6.35289047 C3.21757171,9.47809143 3.21757171,14.5450433 6.34277267,17.6702443 C6.73329697,18.0607686 6.73329697,18.6939336 6.34277267,19.0844579 C5.95224838,19.4749821 5.3190834,19.4749821 4.92855911,19.0844579 C1.02230957,15.1782083 1.02230957,8.84492646 4.92855911,4.93867691 C5.3190834,4.54815262 5.95224838,4.54815262 6.34277267,4.93867691 Z M19.0743401,4.93867691 C22.9805896,8.84492646 22.9805896,15.1782083 19.0743401,19.0844579 C18.6838158,19.4749821 18.0506508,19.4749821 17.6601265,19.0844579 C17.2696022,18.6939336 17.2696022,18.0607686 17.6601265,17.6702443 C20.7853275,14.5450433 20.7853275,9.47809143 17.6601265,6.35289047 C17.2696022,5.96236618 17.2696022,5.3292012 17.6601265,4.93867691 C18.0506508,4.54815262 18.6838158,4.54815262 19.0743401,4.93867691 Z M9.3094225,7.81205295 C9.69994679,8.20257725 9.69994679,8.83574222 9.3094225,9.22626652 C7.77845993,10.7572291 7.77845993,13.2394099 9.3094225,14.7703724 C9.69994679,15.1608967 9.69994679,15.7940617 9.3094225,16.184586 C8.91889821,16.5751103 8.28573323,16.5751103 7.89520894,16.184586 C5.58319778,13.8725748 5.58319778,10.1240641 7.89520894,7.81205295 C8.28573323,7.42152866 8.91889821,7.42152866 9.3094225,7.81205295 Z M16.267742,7.81205295 C18.5797531,10.1240641 18.5797531,13.8725748 16.267742,16.184586 C15.8772177,16.5751103 15.2440527,16.5751103 14.8535284,16.184586 C14.4630041,15.7940617 14.4630041,15.1608967 14.8535284,14.7703724 C16.384491,13.2394099 16.384491,10.7572291 14.8535284,9.22626652 C14.4630041,8.83574222 14.4630041,8.20257725 14.8535284,7.81205295 C15.2440527,7.42152866 15.8772177,7.42152866 16.267742,7.81205295 Z M12.0814755,10.5814755 C12.9099026,10.5814755 13.5814755,11.2530483 13.5814755,12.0814755 C13.5814755,12.9099026 12.9099026,13.5814755 12.0814755,13.5814755 C11.2530483,13.5814755 10.5814755,12.9099026 10.5814755,12.0814755 C10.5814755,11.2530483 11.2530483,10.5814755 12.0814755,10.5814755 Z" })
    }
  )
);
Live.displayName = "Live";

// src/icons/components/HealthCheck.tsx
import { forwardRef as forwardRef101 } from "react";
import { jsx as jsx113, jsxs as jsxs43 } from "react/jsx-runtime";
var HealthCheck = forwardRef101(
  (props, ref) => /* @__PURE__ */ jsxs43(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx113(
          "path",
          {
            d: "M18 11.9999H17.1986C16.3689 11.9999 15.9541 11.9999 15.6102 12.1946C15.2664 12.3893 15.0529 12.745 14.6261 13.4564L14.5952 13.5079C14.1976 14.1706 13.9987 14.502 13.7095 14.4965C13.4202 14.4911 13.2339 14.1525 12.8615 13.4753L11.1742 10.4075C10.8269 9.77606 10.6533 9.46034 10.3759 9.44537C10.0986 9.43039 9.892 9.72558 9.47875 10.3159L9.19573 10.7203C8.75681 11.3473 8.53734 11.6608 8.21173 11.8303C7.88612 11.9999 7.50342 11.9999 6.73803 11.9999H6",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        ),
        /* @__PURE__ */ jsx113(
          "path",
          {
            d: "M8.96173 18.9108L9.42605 18.3219L8.96173 18.9108ZM12 5.5006L11.4596 6.0207C11.601 6.1676 11.7961 6.2506 12 6.2506C12.2039 6.2506 12.399 6.1676 12.5404 6.0207L12 5.5006ZM15.0383 18.9109L15.5026 19.4999V19.4999L15.0383 18.9109ZM12 20.4859L12 19.7359L12 20.4859ZM2.65666 13.3964C2.87558 13.748 3.33811 13.8556 3.68974 13.6367C4.04137 13.4178 4.14895 12.9552 3.93003 12.6036L2.65666 13.3964ZM6.52969 15.7718C6.23645 15.4793 5.76158 15.4798 5.46903 15.7731C5.17649 16.0663 5.17706 16.5412 5.47031 16.8337L6.52969 15.7718ZM2.75 9.13707C2.75 6.33419 4.00722 4.59507 5.57921 3.99711C7.15546 3.39753 9.35129 3.8302 11.4596 6.0207L12.5404 4.9805C10.1489 2.49583 7.3447 1.72069 5.04591 2.59512C2.74286 3.47116 1.25 5.88785 1.25 9.13707H2.75ZM15.5026 19.4999C16.9949 18.3234 18.7837 16.7461 20.2061 14.9838C21.6126 13.2412 22.75 11.2089 22.75 9.13703H21.25C21.25 10.688 20.3777 12.3829 19.0389 14.0417C17.716 15.6807 16.0239 17.1788 14.574 18.3219L15.5026 19.4999ZM22.75 9.13703C22.75 5.88784 21.2571 3.47115 18.9541 2.59511C16.6553 1.7207 13.8511 2.49583 11.4596 4.9805L12.5404 6.0207C14.6487 3.8302 16.8445 3.39753 18.4208 3.99711C19.9928 4.59506 21.25 6.33418 21.25 9.13703H22.75ZM8.49742 19.4998C9.77172 20.5044 10.6501 21.2359 12 21.2359L12 19.7359C11.2693 19.7359 10.8157 19.4174 9.42605 18.3219L8.49742 19.4998ZM14.574 18.3219C13.1843 19.4174 12.7307 19.7359 12 19.7359L12 21.2359C13.3499 21.2359 14.2283 20.5044 15.5026 19.4999L14.574 18.3219ZM3.93003 12.6036C3.18403 11.4054 2.75 10.2312 2.75 9.13707H1.25C1.25 10.617 1.83054 12.0695 2.65666 13.3964L3.93003 12.6036ZM9.42605 18.3219C8.50908 17.599 7.49093 16.7307 6.52969 15.7718L5.47031 16.8337C6.48347 17.8445 7.54819 18.7515 8.49742 19.4998L9.42605 18.3219Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
HealthCheck.displayName = "HealthCheck";

// src/icons/components/ReverseProxy.tsx
import { forwardRef as forwardRef102 } from "react";
import { jsx as jsx114 } from "react/jsx-runtime";
var ReverseProxy = forwardRef102(
  (props, ref) => /* @__PURE__ */ jsx114(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx114(
        "path",
        {
          d: "M4,15 L4,14 L8,14 L8,13 L9,13 L9,14 L13,14 L13,15 L4,15 Z M12,2 C13.1045695,2 14,2.8954305 14,4 L14,9 C14,10.1045695 13.1045695,11 12,11 L5,11 C3.8954305,11 3,10.1045695 3,9 L3,4 C3,2.8954305 3.8954305,2 5,2 L12,2 Z M4,7 L4,9.1 C4,9.65228475 4.44771525,10.1 5,10.1 L12,10.1 C12.5522847,10.1 13,9.65228475 13,9.1 L13,7 L4,7 Z M7,4 L7,5 L6,5 L6,4 L7,4 Z M4,6 L13,6 L13,3.9 C13,3.34771525 12.5522847,2.9 12,2.9 L5,2.9 C4.44771525,2.9 4,3.34771525 4,3.9 L4,6 Z",
          fill: "currentColor"
        }
      )
    }
  )
);
ReverseProxy.displayName = "ReverseProxy";

// src/icons/components/ReverseProxyRoutes.tsx
import { forwardRef as forwardRef103 } from "react";
import { jsx as jsx115, jsxs as jsxs44 } from "react/jsx-runtime";
var ReverseProxyRoutes = forwardRef103((props, ref) => /* @__PURE__ */ jsxs44(
  "svg",
  {
    fill: "currentColor",
    height: "200px",
    width: "200px",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 512 512",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx115("path", { d: "M132.741,108.06C59.546,108.06,0,167.606,0,240.801c0,34.903,16.315,85.856,41.556,129.805 c28.759,50.069,61.991,78.787,91.185,78.787c29.194,0,62.426-28.718,91.185-78.787c25.241-43.949,41.555-94.903,41.555-129.805 C265.482,167.606,205.935,108.06,132.741,108.06z M132.741,430.431c-41.194,0-113.778-109.625-113.778-189.63 c0-62.736,51.037-113.778,113.778-113.778c62.741,0,113.778,51.042,113.778,113.778 C246.518,320.805,173.935,430.431,132.741,430.431z" }),
      /* @__PURE__ */ jsx115("path", { d: "M132.741,174.431c-36.593,0-66.37,29.773-66.37,66.37c0,36.597,29.778,66.37,66.37,66.37s66.37-29.773,66.37-66.37 C199.111,204.204,169.333,174.431,132.741,174.431z M132.741,288.208c-26.139,0-47.407-21.269-47.407-47.407 c0-26.139,21.269-47.407,47.407-47.407c26.139,0,47.407,21.268,47.407,47.407C180.148,266.94,158.88,288.208,132.741,288.208z" }),
      /* @__PURE__ */ jsx115("path", { d: "M417.185,13.245c-52.278,0-94.815,42.532-94.815,94.815c0,47.736,57.62,142.222,94.815,142.222S512,155.796,512,108.06 C512,55.778,469.463,13.245,417.185,13.245z M417.185,231.319c-19.907,0-75.852-77.81-75.852-123.259 c0-41.824,34.028-75.852,75.852-75.852c41.824,0,75.852,34.028,75.852,75.852C493.037,153.509,437.093,231.319,417.185,231.319z" }),
      /* @__PURE__ */ jsx115("path", { d: "M417.185,60.653c-26.139,0-47.407,21.268-47.407,47.407c0,26.139,21.269,47.407,47.407,47.407 c26.139,0,47.407-21.269,47.407-47.407C464.593,81.921,443.324,60.653,417.185,60.653z M417.185,136.505 c-15.685,0-28.444-12.759-28.444-28.444c0-15.685,12.759-28.444,28.444-28.444s28.444,12.759,28.444,28.444 C445.63,123.745,432.87,136.505,417.185,136.505z" }),
      /* @__PURE__ */ jsx115("path", { d: "M347.407,366.259c-11.426-9.514-16.685-19.546-16.102-30.671c1.296-24.805,32.018-50.611,43.741-58.458 c4.343-2.912,5.518-8.796,2.611-13.148c-2.907-4.357-8.806-5.537-13.139-2.625c-2.046,1.361-50.046,33.801-52.148,73.19 c-0.926,17.278,6.778,32.852,22.889,46.278c35.158,29.301,54.657,58.958,49.667,75.56c-4.259,14.153-26.63,19.509-44.639,21.514 c-81.602,9.079-146.278-17.986-146.935-18.259c-4.824-2.069-10.38,0.181-12.435,4.991c-2.056,4.815,0.167,10.38,4.981,12.44 c2.389,1.028,51.5,21.685,119.88,21.685c11.676,0,23.935-0.602,36.602-2.014c34.472-3.829,54.889-15.57,60.704-34.898 C413.371,427.62,372.611,387.268,347.407,366.259z" })
    ]
  }
));
ReverseProxyRoutes.displayName = "ReverseProxyRoutes";

// src/icons/components/ReverseProxyCORS.tsx
import { forwardRef as forwardRef104 } from "react";
import { jsx as jsx116, jsxs as jsxs45 } from "react/jsx-runtime";
var ReverseProxyCORS = forwardRef104((props, ref) => /* @__PURE__ */ jsxs45(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx116(
        "path",
        {
          d: "M14,3 L14,14 L9.01449382,14 L9.79949382,13.003 L13.0232075,13.0036634 L13.0232075,4.01062736 L9.81849382,4.01 L9.01449382,3 L14,3 Z M6.25052955,2.68829789 L9.07895667,5.51672502 L6.25052955,8.34515214 L5.54342276,7.63804536 L7.18849382,5.99229789 L2.01449382,5.99309336 L2.01449382,4.99309336 L7.14049382,4.99229789 L5.54342276,3.39540467 L6.25052955,2.68829789 Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx116(
        "path",
        {
          d: "M6.25052955,8.68829789 L9.07895667,11.516725 L6.25052955,14.3451521 L5.54342276,13.6380454 L7.18849382,11.9922979 L2.01449382,11.9930934 L2.01449382,10.9930934 L7.14049382,10.9922979 L5.54342276,9.39540467 L6.25052955,8.68829789 Z",
          fill: "currentColor"
        }
      )
    ]
  }
));
ReverseProxyCORS.displayName = "ReverseProxyCORS";

// src/icons/components/ReverseProxyFrom.tsx
import { forwardRef as forwardRef105 } from "react";
import { jsx as jsx117 } from "react/jsx-runtime";
var ReverseProxyFrom = forwardRef105((props, ref) => /* @__PURE__ */ jsx117(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx117(
      "path",
      {
        d: "M10.227436,5.63934145 L13.0558631,8.46776857 L10.227436,11.2961957 L9.52032918,10.5890889 L11.1654002,8.94334145 L5.99140023,8.94413691 L5.99181061,8.65768667 C5.91300669,9.41199683 5.2751711,10 4.5,10 C3.67157288,10 3,9.32842712 3,8.5 C3,7.67157288 3.67157288,7 4.5,7 C5.27520319,7 5.9130595,7.58805186 5.9918204,8.34240702 L5.99140023,7.94413691 L11.1174002,7.94334145 L9.52032918,6.34644823 L10.227436,5.63934145 Z M4.5,8 C4.22385763,8 4,8.22385763 4,8.5 C4,8.77614237 4.22385763,9 4.5,9 C4.77614237,9 5,8.77614237 5,8.5 C5,8.22385763 4.77614237,8 4.5,8 Z",
        fill: "currentColor"
      }
    )
  }
));
ReverseProxyFrom.displayName = "ReverseProxyFrom";

// src/icons/components/ReverseProxyHeadersRequest.tsx
import { forwardRef as forwardRef106 } from "react";
import { jsx as jsx118, jsxs as jsxs46 } from "react/jsx-runtime";
var ReverseProxyHeadersRequest = forwardRef106((props, ref) => /* @__PURE__ */ jsxs46(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx118(
        "path",
        {
          d: "M6.25052955,2.68829789 L9.07895667,5.51672502 L6.25052955,8.34515214 L5.54342276,7.63804536 L7.18849382,5.99229789 L2.01449382,5.99309336 L2.01449382,4.99309336 L7.14049382,4.99229789 L5.54342276,3.39540467 L6.25052955,2.68829789 Z M14,3 L14,8 L9.01449382,8 L9.79949382,7.003 L13.0232075,7.00366338 L13.0232075,4.01062736 L9.82349382,4.01 L9.01449382,3 L14,3 Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx118(
        "path",
        {
          d: "M14,9 L14,14 L2,14 L2,9 L14,9 Z M13,10 L3,10 L3,13 L13,13 L13,10 Z",
          "fill-opacity": "0.5",
          fill: "currentColor"
        }
      )
    ]
  }
));
ReverseProxyHeadersRequest.displayName = "ReverseProxyHeadersRequest";

// src/icons/components/ReverseProxyHeadersResponse.tsx
import { forwardRef as forwardRef107 } from "react";
import { jsx as jsx119, jsxs as jsxs47 } from "react/jsx-runtime";
var ReverseProxyHeadersResponse = forwardRef107((props, ref) => /* @__PURE__ */ jsxs47(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx119(
        "path",
        {
          d: "M11.2505295,2.68829789 L14.0789567,5.51672502 L11.2505295,8.34515214 L10.5434228,7.63804536 L12.1884938,5.99229789 L7.01449382,5.99309336 L7.01449382,4.99309336 L12.1404938,4.99229789 L10.5434228,3.39540467 L11.2505295,2.68829789 Z M9,3 L9,4.01 L3,4.01062736 L3,7.00366338 L9,7.003 L9,8 L2,8 L2,3 L9,3 Z",
          fill: "currentColor"
        }
      ),
      /* @__PURE__ */ jsx119(
        "path",
        {
          d: "M14,9 L14,14 L2,14 L2,9 L14,9 Z M13,10 L3,10 L3,13 L13,13 L13,10 Z",
          "fill-opacity": "0.5",
          fill: "currentColor"
        }
      )
    ]
  }
));
ReverseProxyHeadersResponse.displayName = "ReverseProxyHeadersResponse";

// src/icons/components/ReverseProxyHTTP.tsx
import { forwardRef as forwardRef108 } from "react";
import { jsx as jsx120, jsxs as jsxs48 } from "react/jsx-runtime";
var ReverseProxyHTTP = forwardRef108((props, ref) => /* @__PURE__ */ jsxs48(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx120(
        "polygon",
        {
          "fill-opacity": "0.5",
          fill: "currentColor",
          points: "13 5 13 3 3 3 3 5 2 5 2 2 14 2 14 6 3 6 3 13 7 13 7 14 2 14 2 5"
        }
      ),
      /* @__PURE__ */ jsx120(
        "path",
        {
          d: "M6,9 L7,9 L7,10 L6,10 L6,9 Z M6,11 L7,11 L7,12 L6,12 L6,11 Z M10.0052414,6.97597605 L10.9947586,7.12039149 L9.9801732,14.0722077 L8.99065605,13.9277923 L10.0052414,6.97597605 Z M12.9822964,6.97965987 L13.9728609,7.11670767 L13.0110545,14.0685239 L12.0204901,13.9314761 L12.9822964,6.97965987 Z",
          fill: "currentColor"
        }
      )
    ]
  }
));
ReverseProxyHTTP.displayName = "ReverseProxyHTTP";

// src/icons/components/ReverseProxyTLS.tsx
import { forwardRef as forwardRef109 } from "react";
import { jsx as jsx121 } from "react/jsx-runtime";
var ReverseProxyTLS = forwardRef109((props, ref) => /* @__PURE__ */ jsx121(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx121(
      "path",
      {
        d: "M8.52261263,14.0549475 L8.09072524,14.0549475 L7.99886963,13.9359472 L7.68109348,13.7817024 C7.11085943,13.4937372 6.56212167,13.1703049 6.03543684,12.8115392 L5.64456683,12.5358421 C4.79772025,11.9175832 4.16798291,11.3225072 3.6742663,10.6203175 C3.19022463,9.93193302 2.93238191,9.22212152 2.93172116,8.45186088 L2.93148896,3.37214596 C2.93162198,2.9107786 3.16134138,2.60235027 3.60212938,2.4682822 C3.98782224,2.35091617 3.98782224,2.35091617 4.37355953,2.23348466 C6.24828124,1.66275476 7.07927705,1.41073863 8.11895509,1.09906136 C8.31648258,1.03985 8.54512169,1.04042748 8.74276011,1.09969537 C9.4370912,1.30794988 9.99208789,1.47601303 11.2395016,1.85495311 C12.2320199,2.1564609 12.6747209,2.29067371 13.2255636,2.45666557 C13.5641452,2.55870558 13.8076311,2.76575932 13.9099763,3.10859064 L13.9308696,3.25161795 L13.9215557,8.74578657 C13.9197741,8.75514753 13.9197741,8.75514753 13.9171313,8.76989039 L13.9112585,8.80242216 C13.9079619,8.81956542 13.9045576,8.83418977 13.8943445,8.87806283 C13.8771617,8.94386498 13.8640946,8.99907101 13.8350916,9.12591984 C13.7617028,9.44689511 13.7222086,9.59334119 13.6476519,9.77970142 C13.3614875,10.4949556 12.8956813,11.0908136 12.1913459,11.737816 C11.3488645,12.511698 10.3718181,13.1660603 9.21205213,13.7635735 C9.1233448,13.8092799 9.05237926,13.8456306 8.89349015,13.9268577 C8.81933562,13.9647673 8.81933562,13.9647673 8.75048972,14 L8.52186963,13.5549475 L8.52261263,14.0549475 Z M8.43014272,2.054942 L8.4061031,2.05694758 C7.36824847,2.36807823 6.53815952,2.61981934 4.67183698,3.18799224 C4.60968732,3.20691271 4.56245045,3.22129321 4.52083671,3.23396169 L4.32063439,3.29490613 C4.20815461,3.32914333 4.1136551,3.35789946 3.89315624,3.42499708 L3.93086963,3.41294716 L3.93172079,8.45100026 C3.93213245,8.93088525 4.07552677,9.38547738 4.3611679,9.84688122 L4.49229237,10.0451364 C4.91455435,10.6456995 5.46849712,11.1691528 6.23420684,11.7281759 C6.95490279,12.2543101 7.72202877,12.7063782 8.53376045,13.0839497 L8.43586963,13.0369472 C8.56503229,12.9716751 8.63509088,12.9358146 8.7028274,12.9009878 L8.75404358,12.8746257 C9.83930862,12.3154955 10.7434411,11.7099662 11.5148531,11.0013668 C12.1186093,10.4467564 12.4977433,9.96176932 12.7192001,9.40824863 C12.7679461,9.28640413 12.7984751,9.17320127 12.8599634,8.90427423 L12.880941,8.81304101 C12.8992173,8.73424375 12.911303,8.68470851 12.9267276,8.62563979 C12.9274428,8.62275741 12.9274428,8.62275741 12.932586,8.59475763 L12.9308696,8.60094716 L12.9308696,3.41194716 L12.8009622,3.37311511 C12.3524442,3.23784094 11.9414784,3.11327484 11.1894271,2.88485859 L10.9532005,2.81310365 C9.70254685,2.43317935 9.14829994,2.26534325 8.45549314,2.05754592 C8.4444007,2.05421952 8.4154478,2.05414639 8.4061031,2.05694758 L8.43014272,2.054942 Z",
        fill: "currentColor"
      }
    )
  }
));
ReverseProxyTLS.displayName = "ReverseProxyTLS";

// src/icons/components/ReverseProxyTo.tsx
import { forwardRef as forwardRef110 } from "react";
import { jsx as jsx122 } from "react/jsx-runtime";
var ReverseProxyTo = forwardRef110((props, ref) => /* @__PURE__ */ jsx122(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx122(
      "path",
      {
        d: "M6.22743596,5.63934145 L9.05586309,8.46776857 L6.22743596,11.2961957 L5.52032918,10.5890889 L7.16540023,8.94334145 L1.99140023,8.94413691 L1.99140023,7.94413691 L7.11740023,7.94334145 L5.52032918,6.34644823 L6.22743596,5.63934145 Z M12.5,7 C13.3284271,7 14,7.67157288 14,8.5 C14,9.32842712 13.3284271,10 12.5,10 C11.6715729,10 11,9.32842712 11,8.5 C11,7.67157288 11.6715729,7 12.5,7 Z M12.5,8 C12.2238576,8 12,8.22385763 12,8.5 C12,8.77614237 12.2238576,9 12.5,9 C12.7761424,9 13,8.77614237 13,8.5 C13,8.22385763 12.7761424,8 12.5,8 Z",
        fill: "currentColor"
      }
    )
  }
));
ReverseProxyTo.displayName = "ReverseProxyTo";

// src/icons/components/ReverseProxyTCP.tsx
import { forwardRef as forwardRef111 } from "react";
import { jsx as jsx123, jsxs as jsxs49 } from "react/jsx-runtime";
var ReverseProxyTCP = forwardRef111((props, ref) => /* @__PURE__ */ jsxs49(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 100 100",
    width: "100%",
    height: "100%",
    ...props,
    ref,
    children: [
      /* @__PURE__ */ jsx123(
        "path",
        {
          d: "M 40 90 H 15 V 15 H 85 V 35 H 15",
          stroke: "currentColor",
          strokeWidth: "10",
          strokeLinejoin: "miter",
          strokeLinecap: "square",
          strokeOpacity: "0.5",
          fill: "none"
        }
      ),
      /* @__PURE__ */ jsxs49("g", { fill: "currentColor", children: [
        /* @__PURE__ */ jsx123("path", { d: "M 30 48 H 47 V 55 H 42 V 80 H 35 V 55 H 30 Z" }),
        /* @__PURE__ */ jsx123("path", { d: "M 69 48 H 52 V 80 H 69 V 73 H 59 V 55 H 69 Z" }),
        /* @__PURE__ */ jsx123("path", { d: "M 74 48 V 80 H 81 V 68 H 91 V 48 Z M 81 55 H 84 V 61 H 81 Z" })
      ] })
    ]
  }
));
ReverseProxyTCP.displayName = "ReverseProxyTCP";

// src/icons/components/Refresh.tsx
import { forwardRef as forwardRef112 } from "react";
import { jsx as jsx124, jsxs as jsxs50 } from "react/jsx-runtime";
var Refresh = forwardRef112(
  (props, ref) => /* @__PURE__ */ jsxs50(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx124("polyline", { points: "23 4 23 10 17 10" }),
        /* @__PURE__ */ jsx124("polyline", { points: "1 20 1 14 7 14" }),
        /* @__PURE__ */ jsx124("path", { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" })
      ]
    }
  )
);
Refresh.displayName = "Refresh";

// src/icons/components/Calendar.tsx
import { forwardRef as forwardRef113 } from "react";
import { jsx as jsx125 } from "react/jsx-runtime";
var Calendar = forwardRef113(
  (props, ref) => /* @__PURE__ */ jsx125(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx125(
        "path",
        {
          d: "M3 10H21M7 3V5M17 3V5M6.2 21H17.8C18.9201 21 19.4802 21 19.908 20.782C20.2843 20.5903 20.5903 20.2843 20.782 19.908C21 19.4802 21 18.9201 21 17.8V8.2C21 7.07989 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  )
);
Calendar.displayName = "Calendar";

// src/icons/components/Folder.tsx
import { forwardRef as forwardRef114 } from "react";
import { jsx as jsx126 } from "react/jsx-runtime";
var Folder = forwardRef114(
  (props, ref) => /* @__PURE__ */ jsx126(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx126(
        "path",
        {
          d: "M3 8.2C3 7.07989 3 6.51984 3.21799 6.09202C3.40973 5.71569 3.71569 5.40973 4.09202 5.21799C4.51984 5 5.0799 5 6.2 5H9.67452C10.1637 5 10.4083 5 10.6385 5.05526C10.8425 5.10425 11.0376 5.18506 11.2166 5.29472C11.4184 5.4184 11.5914 5.59135 11.9373 5.93726L12.0627 6.06274C12.4086 6.40865 12.5816 6.5816 12.7834 6.70528C12.9624 6.81494 13.1575 6.89575 13.3615 6.94474C13.5917 7 13.8363 7 14.3255 7H17.8C18.9201 7 19.4802 7 19.908 7.21799C20.2843 7.40973 20.5903 7.71569 20.782 8.09202C21 8.51984 21 9.0799 21 10.2V15.8C21 16.9201 21 17.4802 20.782 17.908C20.5903 18.2843 20.2843 18.5903 19.908 18.782C19.4802 19 18.9201 19 17.8 19H6.2C5.07989 19 4.51984 19 4.09202 18.782C3.71569 18.5903 3.40973 18.2843 3.21799 17.908C3 17.4802 3 16.9201 3 15.8V8.2Z",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round"
        }
      )
    }
  )
);
Folder.displayName = "Folder";

// src/icons/components/Jobs.tsx
import { forwardRef as forwardRef115 } from "react";
import { jsx as jsx127, jsxs as jsxs51 } from "react/jsx-runtime";
var Jobs = forwardRef115(
  (props, ref) => /* @__PURE__ */ jsxs51(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx127(
          "path",
          {
            d: "M2.27749 5.24694C2.38823 4.84781 2.80157 4.61402 3.2007 4.72476L4.9044 5.19744C5.82129 5.45183 6.5469 6.15866 6.80003 7.07489L8.95106 14.8609L9.10935 15.4075C9.74249 15.6438 10.2863 16.0866 10.6314 16.6747L10.9414 16.579L19.8115 14.2739C20.2124 14.1697 20.6219 14.4102 20.7261 14.8111C20.8303 15.212 20.5897 15.6214 20.1888 15.7256L11.3515 18.0223L11.0228 18.1238C11.0161 19.3947 10.1392 20.5555 8.81236 20.9003C7.22189 21.3136 5.58709 20.3982 5.16092 18.8556C4.73476 17.313 5.67861 15.7274 7.26908 15.3141C7.3479 15.2936 7.42682 15.2764 7.5057 15.2623L5.35419 7.47433C5.24592 7.08242 4.92897 6.76092 4.50338 6.64284L2.79968 6.17016C2.40054 6.05942 2.16675 5.64608 2.27749 5.24694Z",
            fill: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx127(
          "path",
          {
            opacity: "0.5",
            d: "M9.56443 8.73049L10.0789 10.5926C10.5639 12.3481 10.8064 13.2259 11.5194 13.6252C12.2323 14.0244 13.1374 13.7892 14.9474 13.3188L16.8673 12.8199C18.6774 12.3495 19.5824 12.1143 19.9941 11.4227C20.4057 10.7312 20.1632 9.85344 19.6782 8.09788L19.1638 6.2358C18.6788 4.48023 18.4363 3.60244 17.7233 3.20319C17.0103 2.80394 16.1052 3.03915 14.2952 3.50955L12.3753 4.00849C10.5652 4.47889 9.66021 4.71409 9.24856 5.40562C8.83692 6.09714 9.07942 6.97493 9.56443 8.73049Z",
            fill: "currentColor"
          }
        )
      ]
    }
  )
);
Jobs.displayName = "Jobs";

// src/icons/components/Warning.tsx
import { forwardRef as forwardRef116 } from "react";
import { jsx as jsx128, jsxs as jsxs52 } from "react/jsx-runtime";
var Warning = forwardRef116(
  (props, ref) => /* @__PURE__ */ jsxs52(
    "svg",
    {
      viewBox: "0 0 60.601 60.601",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m30.295 9.0586-25.144 43.554h50.289l-25.145-43.554",
            fill: "none"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m29.932 19.858 6.2807 3.3256-2.14 3.724-4.2756 1.0652-3.6058-5.9844z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m25.922 29.038 0.80466 1.4636-0.80466 2.6588-2.6706 0.26848-1.7355-1.9962 0.13049-1.5979z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m27.392 34.226 1.605 0.13423 0.53499 1.4636-1.605 2.1261-1.6006-0.13423-0.26967-2.793z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m20.176 44.467 0.4045 1.4636-0.26966 1.5979-2.5401 1.0652-1.0656-1.1995 0.66547-2.6588z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m13.365 46.731 1.4701 0.52828-0.40451 1.5979-1.3353 0.93099-0.93514-0.39838v-1.5979z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128(
          "path",
          {
            d: "m20.446 36.755 3.8754 1.7278 0.40016 2.6588-4.1408 1.3337-1.3396-0.93533-1.4701-4.1224z",
            fillRule: "evenodd",
            strokeLinejoin: "bevel",
            strokeMiterlimit: "10",
            strokeWidth: ".13332",
            stroke: "currentColor"
          }
        ),
        /* @__PURE__ */ jsx128("path", { d: "m30.297 3.6289c-1.2075 0-2.2599 0.65852-2.8262 1.6348l-27.027 46.809c-0.56625 0.9775-0.61211 2.2213-0.0059 3.2676 0.605 1.05 1.702 1.6328 2.832 1.6328h54.062c1.1275 0 2.227-0.58281 2.832-1.6328 0.60625-1.0462 0.5601-2.2901-4e-3 -3.2676l-27.035-46.809c-0.56625-0.97625-1.6194-1.6348-2.8281-1.6348zm0.03515 5.4551 8.2871 14.369-1.6055 6.3809-3.0703 1.3301-1.3398 4.9238-3.8711 3.8574-1.4707 5.4531-3.6094 3.7285-18.574 3.4551z" })
      ]
    }
  )
);
Warning.displayName = "Warning";

// src/icons/components/Artifactory.tsx
import { forwardRef as forwardRef117 } from "react";
import { jsx as jsx129, jsxs as jsxs53 } from "react/jsx-runtime";
var Artifactory = forwardRef117(
  (props, ref) => /* @__PURE__ */ jsxs53(
    "svg",
    {
      viewBox: "0 0 48 48",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx129("rect", { x: "5", y: "42.4", width: "38", height: "2.92" }),
        /* @__PURE__ */ jsx129("path", { d: "M23.93,34.48A16.24,16.24,0,1,1,40.17,18.24,16.25,16.25,0,0,1,23.93,34.48Zm0-29.38A13.14,13.14,0,1,0,37.07,18.24,13.16,13.16,0,0,0,23.93,5.1Z" })
      ]
    }
  )
);
Artifactory.displayName = "Artifactory";

// src/icons/components/Azure.tsx
import { forwardRef as forwardRef118 } from "react";
import { jsx as jsx130 } from "react/jsx-runtime";
var Azure = forwardRef118(
  (props, ref) => /* @__PURE__ */ jsx130(
    "svg",
    {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx130("path", { d: "M7.47 12.412l3.348-.592.031-.007-1.722-2.049a291.474 291.474 0 01-1.723-2.058c0-.01 1.779-4.909 1.789-4.926a788.95 788.95 0 012.934 5.066l2.95 5.115.023.039-10.948-.001 3.317-.587zM.9 11.788c0-.003.811-1.412 1.803-3.131L4.507 5.53l2.102-1.764C7.765 2.797 8.714 2 8.717 2a.37.37 0 01-.033.085L6.4 6.981 4.16 11.789l-1.63.002c-.897.001-1.63 0-1.63-.003z" })
    }
  )
);
Azure.displayName = "Azure";

// src/icons/components/Minio.tsx
import { forwardRef as forwardRef119 } from "react";
import { jsx as jsx131 } from "react/jsx-runtime";
var Minio = forwardRef119(
  (props, ref) => /* @__PURE__ */ jsx131(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "256",
      height: "256",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx131(
        "path",
        {
          fill: "currentColor",
          d: "M13.207.006a2.16 2.16 0 0 0-1.62.582a2.15 2.15 0 0 0-.095 3.035l3.408 3.55a3.042 3.042 0 0 1-.663 4.688l-.463.239V7.285a15.42 15.42 0 0 0-8.018 10.486v.018l6.549-3.328v7.621L13.779 24V13.682l.897-.463a4.443 4.443 0 0 0 1.22-7.03l-3.37-3.525a.749.749 0 0 1 .037-1.055a.752.752 0 0 1 1.056.038l.467.486l-.006.006l4.07 4.244a.057.057 0 0 0 .082 0a.06.06 0 0 0 0-.07l-3.14-5.143l-.149.143l.149-.145C14.494.393 13.829.054 13.207.006Zm-.902 9.865v2.994l-4.152 2.149a13.979 13.979 0 0 1 2.767-3.928a14.178 14.178 0 0 1 1.385-1.215z"
        }
      )
    }
  )
);
Minio.displayName = "Minio";

// src/icons/components/Aws.tsx
import { forwardRef as forwardRef120 } from "react";
import { jsx as jsx132, jsxs as jsxs54 } from "react/jsx-runtime";
var Aws = forwardRef120(
  (props, ref) => /* @__PURE__ */ jsxs54(
    "svg",
    {
      viewBox: "0 0 16 16",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx132("path", { d: "M4.51 7.687c0 .197.02.357.058.475.042.117.096.245.17.384a.233.233 0 01.037.123c0 .053-.032.107-.1.16l-.336.224a.255.255 0 01-.138.048c-.054 0-.107-.026-.16-.074a1.652 1.652 0 01-.192-.251 4.137 4.137 0 01-.164-.315c-.416.491-.937.737-1.565.737-.447 0-.804-.129-1.064-.385-.261-.256-.394-.598-.394-1.025 0-.454.16-.822.484-1.1.325-.278.756-.416 1.304-.416.18 0 .367.016.564.042.197.027.4.07.612.118v-.39c0-.406-.085-.689-.25-.854-.17-.166-.458-.246-.868-.246-.186 0-.377.022-.574.07a4.23 4.23 0 00-.575.181 1.525 1.525 0 01-.186.07.326.326 0 01-.085.016c-.075 0-.112-.054-.112-.166v-.262c0-.085.01-.15.037-.186a.399.399 0 01.15-.113c.185-.096.409-.176.67-.24.26-.07.537-.101.83-.101.633 0 1.096.144 1.394.432.293.288.442.726.442 1.314v1.73h.01zm-2.161.811c.175 0 .356-.032.548-.096.192-.064.362-.182.505-.342a.848.848 0 00.181-.341c.032-.129.054-.283.054-.465V7.03a4.43 4.43 0 00-.49-.09 3.996 3.996 0 00-.5-.033c-.357 0-.617.07-.793.214-.176.144-.26.347-.26.614 0 .25.063.437.196.566.128.133.314.197.559.197zm4.273.577c-.096 0-.16-.016-.202-.054-.043-.032-.08-.106-.112-.208l-1.25-4.127a.938.938 0 01-.048-.214c0-.085.042-.133.127-.133h.522c.1 0 .17.016.207.053.043.032.075.107.107.208l.894 3.535.83-3.535c.026-.106.058-.176.101-.208a.365.365 0 01.213-.053h.426c.1 0 .17.016.212.053.043.032.08.107.102.208l.84 3.578.92-3.578a.459.459 0 01.107-.208.347.347 0 01.208-.053h.495c.085 0 .133.043.133.133 0 .027-.006.054-.01.086a.768.768 0 01-.038.133l-1.283 4.127c-.031.107-.069.177-.111.209a.34.34 0 01-.203.053h-.457c-.101 0-.17-.016-.213-.053-.043-.038-.08-.107-.101-.214L8.213 5.37l-.82 3.439c-.026.107-.058.176-.1.213-.043.038-.118.054-.213.054h-.458zm6.838.144a3.51 3.51 0 01-.82-.096c-.266-.064-.473-.134-.612-.214-.085-.048-.143-.101-.165-.15a.38.38 0 01-.031-.149v-.272c0-.112.042-.166.122-.166a.3.3 0 01.096.016c.032.011.08.032.133.054.18.08.378.144.585.187.213.042.42.064.633.064.336 0 .596-.059.777-.176a.575.575 0 00.277-.508.52.52 0 00-.144-.373c-.095-.102-.276-.193-.537-.278l-.772-.24c-.388-.123-.676-.305-.851-.545a1.275 1.275 0 01-.266-.774c0-.224.048-.422.143-.593.096-.17.224-.32.384-.438.16-.122.34-.213.553-.277.213-.064.436-.091.67-.091.118 0 .24.005.357.021.122.016.234.038.346.06.106.026.208.052.303.085.096.032.17.064.224.096a.461.461 0 01.16.133.289.289 0 01.047.176v.251c0 .112-.042.171-.122.171a.552.552 0 01-.202-.064 2.428 2.428 0 00-1.022-.208c-.303 0-.543.048-.708.15-.165.1-.25.256-.25.475 0 .149.053.277.16.379.106.101.303.202.585.293l.756.24c.383.123.66.294.825.513.165.219.244.47.244.748 0 .23-.047.437-.138.619a1.435 1.435 0 01-.388.47c-.165.133-.362.23-.591.299-.24.075-.49.112-.761.112z" }),
        /* @__PURE__ */ jsx132(
          "path",
          {
            fillRule: "evenodd",
            d: "M14.465 11.813c-1.75 1.297-4.294 1.986-6.481 1.986-3.065 0-5.827-1.137-7.913-3.027-.165-.15-.016-.353.18-.235 2.257 1.313 5.04 2.109 7.92 2.109 1.941 0 4.075-.406 6.039-1.239.293-.133.543.192.255.406z",
            "clip-rule": "evenodd"
          }
        ),
        /* @__PURE__ */ jsx132(
          "path",
          {
            fillRule: "evenodd",
            d: "M15.194 10.98c-.223-.287-1.479-.138-2.048-.069-.17.022-.197-.128-.043-.24 1-.705 2.645-.502 2.836-.267.192.24-.053 1.89-.99 2.68-.143.123-.281.06-.217-.1.212-.53.686-1.72.462-2.003z",
            "clip-rule": "evenodd"
          }
        )
      ]
    }
  )
);
Aws.displayName = "Aws";

// src/icons/components/Orchestrator.tsx
import { forwardRef as forwardRef121 } from "react";
import { jsx as jsx133 } from "react/jsx-runtime";
var Orchestrator = forwardRef121(
  (props, ref) => /* @__PURE__ */ jsx133(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx133(
        "path",
        {
          d: "M2.93984699,5.04722482 C3.45032393,5.22930038 3.71753343,5.78325199 3.53916992,6.28968026 L2.18116652,10.2121429 C2.1477435,10.3046831 2.15895191,10.4072402 2.21159877,10.4905982 C2.26424564,10.5739562 2.3525593,10.6289766 2.45138148,10.6399856 L6.14778358,11.0507147 L7,16 L5.96071169,16 C5.66920876,15.997325 5.41541793,15.8026111 5.34060299,15.5242388 L4.58538682,12.8408089 L1.43634323,12.4985347 C0.943506392,12.4342967 0.506124506,12.1542667 0.245442025,11.7360705 C-0.0152404569,11.3178743 -0.0715227002,10.8059506 0.0921970146,10.3422071 L1.72041537,5.65989568 C1.799705,5.41875465 1.97280198,5.21866664 2.20154903,5.10373879 C2.43029607,4.98881094 2.6959128,4.96847897 2.93984699,5.04722482 Z M14.7760189,8.14393564 C14.999906,8.27857079 15.1588898,8.49425219 15.2175778,8.74296527 L15.9511321,11.9038371 C16.0861912,12.43211 15.9372096,12.9906928 15.5548378,13.3896796 C15.1724659,13.7886665 14.6081578,13.9743677 14.0537657,13.8836489 L11.3382043,13.3852825 L10.7668783,15.5255272 C10.6900323,15.8055868 10.4279253,16.0004105 10.128545,16 L9,16 L9.85698889,11.1221528 L13.4154325,11.7741253 C13.525236,11.7930528 13.6375135,11.7572706 13.7142185,11.6789038 C13.7909236,11.600537 13.8217742,11.4900904 13.7963164,11.3849899 L13.2955246,9.20037005 C13.1644054,8.68133222 13.4903336,8.15708398 14.0255521,8.02613688 C14.2819254,7.96688689 14.5521319,8.00930049 14.7760189,8.14393564 Z M7.5,5 C8.88663968,5 10,6.11708483 10,7.5 C10,8.88291517 8.88663968,10 7.5,10 C6.11336032,10 5,8.88291517 5,7.5 C5,6.11708483 6.11336032,5 7.5,5 Z M11.2454613,0.0490332115 C11.3653238,-0.0148740908 11.5037495,-0.016378144 11.6246672,0.044912983 C11.7214013,0.0939458847 11.799265,0.179282324 11.8460594,0.285176849 L13.9244034,6.16119904 C13.9963415,6.29145315 14.018116,6.44949292 13.98465,6.59846902 C13.9511839,6.74744512 13.8654024,6.87433657 13.7473065,6.94955672 C13.4858777,7.09318464 13.2525596,6.91444768 13.1260618,6.61123319 L11.0796086,0.80866531 C11.0059855,0.685051715 10.9820058,0.531777817 11.0136294,0.386936906 C11.0452529,0.242095994 11.1295104,0.119287533 11.2454613,0.0490332115 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Orchestrator.displayName = "Orchestrator";

// src/icons/components/Podman.tsx
import { forwardRef as forwardRef122 } from "react";
import { jsx as jsx134 } from "react/jsx-runtime";
var Podman = forwardRef122(
  (props, ref) => /* @__PURE__ */ jsx134(
    "svg",
    {
      role: "img",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx134(
        "path",
        {
          fill: "currentColor",
          d: "M17.2.275L6.75.308a.259.259 0 0 0-.203.098L.056 8.602a.259.259 0 0 0-.05.219l2.356 10.194a.26.26 0 0 0 .14.174l9.43 4.511a.258.258 0 0 0 .224-.002l9.401-4.566a.259.259 0 0 0 .141-.175L23.993 8.75a.258.258 0 0 0-.051-.22L17.403.374A.259.259 0 0 0 17.2.275zm-.123.517l6.385 7.966-2.242 9.964-9.177 4.457-9.205-4.402L.54 8.827 6.875.824zM11.46 2.857c-.933 0-1.84.1-2.426.332h-.002c-1.554.569-2.725 2.105-3.074 3.952v.004c-.309 1.463-.392 2.703-.556 3.824-.07.481-.159.94-.283 1.387-.628.497-1.079 1.263-1.244 2.138v.004c-.116.547-.181 1.04-.237 1.5h-.644v.518h8.891c-.061.464-.122.996-.181 1.42H7.596v.517h7.939c-.242-.078-.486-.218-.756-.502h-.697l-.85.488-.232-.396.162-.092h-1.069c.113-.776.17-1.601.373-2.564v-.004c.22-1.164.96-2.112 1.895-2.453l.004-.002h.002c.318-.127.928-.205 1.543-.205.613 0 1.244.075 1.622.207.935.341 1.676 1.29 1.895 2.453v.004c.204.963.26 1.788.373 2.564h-.742l.162.092-.233.396-.85-.488h-.75c-.219.25-.474.412-.747.502h4.392v-.518h-.842c-.103-.743-.181-1.67-.382-2.623v-.002a4.14 4.14 0 0 0-.264-.863h1.863v-.517h-2.13a3.488 3.488 0 0 0-.8-.906h1.8v-.518H17.95a8.862 8.862 0 0 1-.193-.775h1.484v-.518h-1.576c-.013-.081-.027-.161-.039-.244-.164-1.12-.246-2.36-.555-3.824v-.004c-.348-1.848-1.52-3.383-3.075-3.952l-.002-.002h-.002c-.65-.227-1.596-.33-2.531-.33zm0 .386c.904 0 1.833.11 2.404.309h.002c1.4.514 2.5 1.934 2.826 3.666v.003c.303 1.436.385 2.66.552 3.805.076.515.173 1.013.315 1.505-.449-.135-1.05-.197-1.648-.197-.12 0-.236.003-.352.008l-1.863-1.865a2.17 2.17 0 0 0 .11-.246l2.13 1.23.13-.224-2.185-1.262c.016-.069.027-.14.036-.21l2.302.616.068-.248-2.354-.63c-.02-1.153-1.008-2.078-2.208-2.078-1.205 0-2.196.931-2.206 2.091l-2.303.617.066.25 2.252-.605c.01.076.024.151.041.224L7.436 11.24l.129.222 2.087-1.207c.034.089.074.176.12.258l-1.266 1.266a6.959 6.959 0 0 0-1.045-.075c-.603 0-1.186.064-1.578.22a2.668 2.668 0 0 0-.285.124c.076-.335.137-.675.187-1.021.168-1.144.248-2.37.551-3.805l.002-.001v-.002c.326-1.733 1.426-3.153 2.828-3.666h.002l.004-.002c.488-.194 1.381-.307 2.287-.307zM8.473 5.194a1.295 1.295 0 0 0-.965.502l-.117.153.306.236.12-.152a.923.923 0 0 1 .673-.352.92.92 0 0 1 .67.262l.139.134.271-.275-.136-.137a1.293 1.293 0 0 0-.961-.37zm6.39 0a1.289 1.289 0 0 0-.96.371l-.138.137.274.275.136-.134a.923.923 0 0 1 .672-.262.923.923 0 0 1 .674.352l.119.152.307-.236-.12-.153c-.23-.3-.587-.486-.964-.502zM8.53 6.708c-.642 0-1.164.538-1.164 1.19 0 .65.522 1.187 1.164 1.187.643 0 1.164-.536 1.164-1.188 0-.651-.521-1.19-1.164-1.19zm6.273 0c-.643 0-1.162.538-1.162 1.19 0 .65.52 1.187 1.162 1.187.643 0 1.164-.536 1.164-1.188 0-.651-.521-1.19-1.164-1.19zm-6.273.387c.428 0 .776.355.776.802 0 .447-.348.8-.776.8a.785.785 0 0 1-.775-.8c0-.035.002-.07.006-.103.07.191.248.318.445.318a.487.487 0 0 0 .477-.496.49.49 0 0 0-.383-.486.759.759 0 0 1 .23-.035zm6.273 0c.428 0 .777.355.777.802 0 .447-.349.8-.777.8a.785.785 0 0 1-.77-.9c.072.19.248.315.444.315a.486.486 0 0 0 .479-.496.491.491 0 0 0-.383-.484.755.755 0 0 1 .23-.037zm-3.08.716c1.012 0 1.819.775 1.819 1.723 0 .947-.807 1.722-1.819 1.722s-1.82-.775-1.82-1.722c0-.948.808-1.723 1.82-1.723zm-.002.528c-.142 0-.258.043-.355.076a.804.804 0 0 1-.232.054c-.107 0-.2.047-.268.127a.568.568 0 0 0-.104.207c-.04.134-.062.268-.08.315a.276.276 0 0 0 .032.25c.033.056.071.1.117.146.09.092.206.183.322.268.12.088.237.166.326.224l-.008.09c-.043.036-.14.102-.324.178a.533.533 0 0 1-.299.025.43.43 0 0 1-.236-.172c.015-.138.044-.293.068-.449l-.376-.095c-.05.238-.067.43-.094.64l.037.059c.143.224.318.344.506.392a.908.908 0 0 0 .52-.033 1.57 1.57 0 0 0 .444-.242c.088.067.244.174.446.242a.908.908 0 0 0 .52.033.868.868 0 0 0 .507-.392l.037-.059a6.292 6.292 0 0 0-.096-.637l-.377.092c.032.148.051.32.07.451a.434.434 0 0 1-.237.17.533.533 0 0 1-.3-.025c-.178-.068-.272-.14-.325-.178l-.006-.084c.09-.058.209-.137.336-.23.115-.085.231-.176.322-.268a.72.72 0 0 0 .117-.146.273.273 0 0 0 .031-.25c-.018-.047-.039-.181-.08-.315a.564.564 0 0 0-.103-.207.343.343 0 0 0-.268-.127.815.815 0 0 1-.234-.054c-.097-.033-.212-.076-.354-.076zm.002.386c.057 0 .134.024.23.057.09.03.208.07.337.076.04.102.06.237.09.338a.361.361 0 0 1-.041.045 2.66 2.66 0 0 1-.276.228c-.165.122-.271.188-.342.233a5.287 5.287 0 0 1-.34-.233 2.557 2.557 0 0 1-.275-.228.34.34 0 0 1-.04-.047c.035-.119.046-.234.089-.34.08.012.246-.042.336-.072a.837.837 0 0 1 .232-.057zm-3.234.61a.635.635 0 0 0-.611.517l1.084-.289a.614.614 0 0 0-.473-.228zm6.336 0a.61.61 0 0 0-.436.187c.352.096.69.184 1.033.275a.632.632 0 0 0-.597-.462zm-.623.607c-.007.035-.002.07-.002.103l.921.532a.648.648 0 0 0 .276-.313l-1.195-.322zm-5.086.05l-1.18.315c.078.15.207.264.362.316l.797-.46c.018-.059.015-.12.021-.17zm4.441.714l1.656 1.658a4.19 4.19 0 0 0-.826.146l-.95-1.647a2.51 2.51 0 0 0 .12-.157zm-3.646.03c.04.055.083.118.129.169l-.658 1.134a2.656 2.656 0 0 0-.276-.119l-.002-.002a3.3 3.3 0 0 0-.292-.082zm3.338.317l.892 1.547c-.623.251-1.149.725-1.523 1.33h-1.652c-.262-.75-.741-1.38-1.358-1.764l.623-1.082c.394.347.919.559 1.492.559a2.25 2.25 0 0 0 1.526-.59zM7.46 12.09c.574 0 1.167.073 1.518.195.867.319 1.555 1.203 1.76 2.285l.001.002v.002c.109.513.173.98.227 1.424H9.86a.386.386 0 0 0-.494 0H9.11a1.351 1.351 0 0 0-.078-.418.799.799 0 0 0 .569.238c.45 0 .814-.375.814-.828a.824.824 0 0 0-.814-.828.822.822 0 0 0-.791 1.016 1.495 1.495 0 0 0-1.18-.559c-.798 0-1.46.611-1.48 1.38h-.342a.386.386 0 0 0-.494 0H4.028c.054-.445.116-.912.224-1.425l.002-.002v-.002c.205-1.084.894-1.97 1.764-2.287h.002l.004-.002c.295-.117.863-.191 1.437-.19zm-1.91 1.105a.898.898 0 0 0-.67.348l-.119.154.307.237.119-.155a.525.525 0 0 1 .379-.197.52.52 0 0 1 .377.147l.138.136.272-.275-.137-.137a.895.895 0 0 0-.666-.258zm4.094 0a.9.9 0 0 0-.668.258l-.137.137.273.275.137-.136a.522.522 0 0 1 .377-.147.525.525 0 0 1 .379.197l.119.155.307-.237-.12-.154a.894.894 0 0 0-.667-.348zm4.222.735a.947.947 0 0 0-.707.365l-.117.154.306.237.12-.155a.568.568 0 0 1 .413-.213.571.571 0 0 1 .414.159l.14.136.27-.275-.138-.137a.942.942 0 0 0-.701-.271zm4.374 0a.942.942 0 0 0-.7.271l-.14.137.272.275.139-.136a.571.571 0 0 1 .414-.159.568.568 0 0 1 .414.213l.119.155.306-.237-.117-.154a.947.947 0 0 0-.707-.365zm-12.65.232a.824.824 0 0 0-.815.828c0 .453.365.828.814.828.45 0 .815-.375.815-.828a.824.824 0 0 0-.815-.828zm5.518.285h1.242a4.137 4.137 0 0 0-.263.864v.002c-.05.237-.092.464-.127.685h-.602a16.77 16.77 0 0 0-.236-1.5l-.002-.002c-.003-.016-.009-.032-.012-.049zm-5.519.102a.43.43 0 0 1 .426.441.43.43 0 0 1-.426.442c-.22 0-.4-.171-.422-.397a.298.298 0 0 0 .215.092.31.31 0 0 0 .305-.316.317.317 0 0 0-.129-.258c.01-.001.02-.004.031-.004zm4.014 0c.235 0 .427.193.427.441a.433.433 0 0 1-.427.442.427.427 0 0 1-.422-.405.3.3 0 0 0 .256.145.31.31 0 0 0 .304-.317.314.314 0 0 0-.207-.298c.023-.004.045-.008.069-.008zm4.304.414a.865.865 0 0 0-.856.87c0 .478.382.874.856.874a.868.868 0 0 0 .857-.873.867.867 0 0 0-.857-.871zm4.292 0a.867.867 0 0 0-.814 1.14 1.597 1.597 0 0 0-1.295-.652c-.846 0-1.546.65-1.568 1.463l-1.525.408.066.248 1.477-.394c.004.028.009.06.015.087l-1.418.817.131.222 1.367-.789c.235.552.801.94 1.455.94.66 0 1.233-.397 1.463-.957l1.398.806.13-.222-1.45-.836c.005-.025.008-.053.012-.078l1.511.404.067-.248-1.563-.418a1.438 1.438 0 0 0-.107-.5c.157.186.39.303.648.303a.867.867 0 0 0 .856-.873.865.865 0 0 0-.856-.871zm-10.567.043c.598 0 1.071.444 1.092.992h-.41c.007-.01.016-.02.023-.033a.24.24 0 0 0 .025-.22c-.005-.016-.021-.102-.05-.196a.416.416 0 0 0-.078-.156.282.282 0 0 0-.225-.108.499.499 0 0 1-.129-.031c-.062-.021-.142-.05-.248-.05-.106 0-.188.029-.25.05a.49.49 0 0 1-.127.031.29.29 0 0 0-.225.108.424.424 0 0 0-.08.156c-.029.094-.043.18-.048.195a.242.242 0 0 0 .023.22c.008.014.017.023.025.034h-.41c.02-.548.494-.992 1.092-.992zm6.275.344c.259 0 .47.211.47.484a.477.477 0 0 1-.47.486.472.472 0 0 1-.467-.453.322.322 0 0 0 .246.115c.18 0 .326-.15.326-.338a.34.34 0 0 0-.156-.289c.017-.002.033-.005.05-.005zm4.292 0c.26 0 .469.211.469.484 0 .272-.21.486-.469.486a.477.477 0 0 1-.47-.486c0-.016.002-.031.004-.047a.33.33 0 0 0 .312.24c.18 0 .326-.15.326-.338a.338.338 0 0 0-.256-.332.475.475 0 0 1 .084-.007zm-10.567.24c.021 0 .063.01.125.031.086.03.117.039.186.049.012.041.022.088.033.129a1.475 1.475 0 0 1-.168.138c-.038.028-.064.045-.088.061h-.176c-.024-.016-.052-.033-.09-.06a1.602 1.602 0 0 1-.168-.14l.034-.128c.107-.014.146-.04.185-.049a.504.504 0 0 1 .127-.031zm8.458.25c.661 0 1.184.502 1.184 1.113 0 .156-.035.304-.096.44l-.002-.024-.022-.156a2.443 2.443 0 0 0-.04-.24l-.377.093.044.274a.24.24 0 0 1-.115.074.299.299 0 0 1-.168-.014c-.087-.03-.132-.063-.18-.094.057-.037.13-.084.198-.134.08-.06.16-.123.226-.19a.542.542 0 0 0 .092-.111.245.245 0 0 0 .026-.225c-.008-.019-.022-.112-.053-.21a.444.444 0 0 0-.084-.163.286.286 0 0 0-.23-.107.566.566 0 0 1-.14-.037c-.065-.022-.152-.055-.263-.055-.11 0-.195.032-.262.055a.575.575 0 0 1-.14.037.294.294 0 0 0-.23.107.436.436 0 0 0-.083.162c-.03.1-.045.192-.052.211a.246.246 0 0 0 .025.225.534.534 0 0 0 .09.111c.066.067.146.13.226.19.068.05.138.095.194.132a.57.57 0 0 1-.18.096.305.305 0 0 1-.17.014.237.237 0 0 1-.111-.076c.008-.09.026-.177.04-.272l-.376-.094c-.032.146-.045.286-.063.409a1.052 1.052 0 0 1-.09-.428c0-.611.521-1.113 1.182-1.113zm0 .623c.026 0 .074.01.14.033.066.025.169.052.206.055l.035.156c-.04.04-.112.1-.184.152-.095.07-.14.095-.197.131-.056-.036-.1-.061-.195-.13a1.236 1.236 0 0 1-.184-.157l.035-.152a1.04 1.04 0 0 0 .206-.055.523.523 0 0 1 .138-.033zm-2.22.353a.43.43 0 0 0-.385.272l.656-.176a.416.416 0 0 0-.271-.096zm4.333 0a.414.414 0 0 0-.22.07l.603.16a.426.426 0 0 0-.383-.23zm-4.054.567l-.607.162a.436.436 0 0 0 .125.113zm3.925.002l.407.234a.443.443 0 0 0 .087-.102zm-1.986.234c.067.047.165.108.285.148a.68.68 0 0 0 .389.024.57.57 0 0 0 .232-.121 1.201 1.201 0 0 1-.904.394c-.356 0-.67-.145-.885-.375a.58.58 0 0 0 .207.102c.144.036.28.014.391-.024.12-.04.218-.1.285-.148zm-9.524 1.61v.517h6.214v-.518zm3.619 1.292v.517H15.3v-.517z"
        }
      )
    }
  )
);
Podman.displayName = "Podman";

// src/icons/components/PodmanDesktop.tsx
import { forwardRef as forwardRef123 } from "react";
import { jsx as jsx135, jsxs as jsxs55 } from "react/jsx-runtime";
var PodmanDesktop = forwardRef123(
  (props, ref) => /* @__PURE__ */ jsxs55(
    "svg",
    {
      width: "645",
      height: "642.17",
      fill: "none",
      version: "1.1",
      viewBox: "0 0 645 642.17",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m327.87 17.267c-3.379-1.689-7.355-1.689-10.734 0l-290.5 145.25c-4.065 2.033-6.633 6.188-6.633 10.733v287.67c0 4.545 2.568 8.7 6.633 10.733l290.5 145.25c3.379 1.689 7.355 1.689 10.734 0l290.5-145.25c4.065-2.033 6.633-6.188 6.633-10.733v-287.67c0-4.545-2.568-8.7-6.633-10.733z",
            "clip-rule": "evenodd",
            fill: "url(#paint1_linear_1_2)",
            fillRule: "evenodd",
            style: { fill: "url(#paint1_linear_1_2)" }
          }
        ),
        /* @__PURE__ */ jsxs55(
          "g",
          {
            transform: "translate(-189 -194.42)",
            filter: "url(#filter0_d_1_2)",
            "shape-rendering": "crispEdges",
            children: [
              /* @__PURE__ */ jsx135(
                "path",
                {
                  d: "m506.13 211.68c3.379-1.689 7.355-1.689 10.734 0l290.5 145.25c4.065 2.033 6.633 6.188 6.633 10.733v287.67c0 4.545-2.568 8.7-6.633 10.733l-290.5 145.25c-3.379 1.689-7.355 1.689-10.734 0l-290.5-145.25c-4.065-2.033-6.633-6.188-6.633-10.733v-287.67c0-4.545 2.568-8.7 6.633-10.733z",
                  fill: "url(#paint2_linear_1_2)",
                  "fill-opacity": ".2",
                  style: { fill: "url(#paint2_linear_1_2)" }
                }
              ),
              /* @__PURE__ */ jsx135(
                "path",
                {
                  d: "m506.13 211.68c3.379-1.689 7.355-1.689 10.734 0l290.5 145.25c4.065 2.033 6.633 6.188 6.633 10.733v287.67c0 4.545-2.568 8.7-6.633 10.733l-290.5 145.25c-3.379 1.689-7.355 1.689-10.734 0l-290.5-145.25c-4.065-2.033-6.633-6.188-6.633-10.733v-287.67c0-4.545 2.568-8.7 6.633-10.733z",
                  stroke: "url(#paint3_linear_1_2)",
                  strokeLinecap: "square",
                  strokeLinejoin: "round",
                  strokeWidth: "32",
                  style: { stroke: "url(#paint3_linear_1_2)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx135("g", { transform: "translate(-189 -194.42)", filter: "url(#filter1_i_1_2)", children: /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m512.5 227 285.5 144v282.5l-287.5 142-285.5-142v-282.5z",
            fill: "url(#paint4_linear_1_2)",
            "fill-opacity": ".2",
            style: { fill: "url(#paint4_linear_1_2)" }
          }
        ) }),
        /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m322 33.584-286 142.5 286 145.5 287-145.5z",
            fill: "url(#paint5_linear_1_2)",
            "fill-opacity": ".3",
            style: { fill: "url(#paint5_linear_1_2)" }
          }
        ),
        /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m107.91 390.82h428.23",
            stroke: "url(#paint6_linear_1_2)",
            style: { stroke: "url(#paint6_linear_1_2)" }
          }
        ),
        /* @__PURE__ */ jsx135("g", { transform: "translate(-189 -194.42)", filter: "url(#filter2_dd_1_2)", children: /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m297.09 421.02c0-7.732 6.268-14 14-14h400.58c7.732 0 14 6.268 14 14v186.29c0 7.732-6.268 14-14 14h-400.58c-7.732 0-14-6.268-14-14zm35.714 26.715c0-2.762 2.239-5 5-5h25.715c2.762 0 5 2.238 5 5v97.145c0 2.761-2.238 5-5 5h-25.715c-2.761 0-5-2.239-5-5zm76.43-5c-2.761 0-5 2.238-5 5v97.145c0 2.761 2.239 5 5 5h25.715c2.761 0 5-2.239 5-5v-97.145c0-2.762-2.239-5-5-5zm66.43 5c0-2.762 2.239-5 5-5h25.715c2.761 0 5 2.238 5 5v97.145c0 2.761-2.239 5-5 5h-25.715c-2.761 0-5-2.239-5-5zm76.601-5.161c-2.762 0-5 2.238-5 5v97.145c0 2.761 2.238 5 5 5h25.715c2.761 0 5-2.239 5-5v-97.145c0-2.762-2.239-5-5-5z",
            "clip-rule": "evenodd",
            fill: "url(#paint7_linear_1_2)",
            fillRule: "evenodd",
            style: { fill: "url(#paint7_linear_1_2)" }
          }
        ) }),
        /* @__PURE__ */ jsx135(
          "path",
          {
            d: "m108.09 391.18h428.58v23.714c0 6.628-5.372 12-12 12h-404.58c-6.628 0-12-5.372-12-12z",
            fill: "#472ea8"
          }
        ),
        /* @__PURE__ */ jsxs55("defs", { children: [
          /* @__PURE__ */ jsxs55(
            "filter",
            {
              id: "filter0_d_1_2",
              x: "189",
              y: "194.42",
              width: "645",
              height: "642.17",
              "color-interpolation-filters": "sRGB",
              filterUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
                /* @__PURE__ */ jsx135(
                  "feColorMatrix",
                  {
                    in: "SourceAlpha",
                    result: "hardAlpha",
                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  }
                ),
                /* @__PURE__ */ jsx135("feOffset", { dy: "4" }),
                /* @__PURE__ */ jsx135("feGaussianBlur", { stdDeviation: "2" }),
                /* @__PURE__ */ jsx135("feComposite", { in2: "hardAlpha", operator: "out" }),
                /* @__PURE__ */ jsx135("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" }),
                /* @__PURE__ */ jsx135("feBlend", { in2: "BackgroundImageFix", result: "effect1_dropShadow_1_2" }),
                /* @__PURE__ */ jsx135(
                  "feBlend",
                  {
                    in: "SourceGraphic",
                    in2: "effect1_dropShadow_1_2",
                    result: "shape"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "filter",
            {
              id: "filter1_i_1_2",
              x: "225",
              y: "227",
              width: "573",
              height: "568.5",
              "color-interpolation-filters": "sRGB",
              filterUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
                /* @__PURE__ */ jsx135("feBlend", { in: "SourceGraphic", in2: "BackgroundImageFix", result: "shape" }),
                /* @__PURE__ */ jsx135(
                  "feColorMatrix",
                  {
                    in: "SourceAlpha",
                    result: "hardAlpha",
                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  }
                ),
                /* @__PURE__ */ jsx135("feOffset", {}),
                /* @__PURE__ */ jsx135("feGaussianBlur", { stdDeviation: "8" }),
                /* @__PURE__ */ jsx135("feComposite", { in2: "hardAlpha", k2: "-1", k3: "1", operator: "arithmetic" }),
                /* @__PURE__ */ jsx135("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" }),
                /* @__PURE__ */ jsx135("feBlend", { in2: "shape", result: "effect1_innerShadow_1_2" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "filter",
            {
              id: "filter2_dd_1_2",
              x: "286.09",
              y: "392.02",
              width: "450.58",
              height: "237.29",
              "color-interpolation-filters": "sRGB",
              filterUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("feFlood", { "flood-opacity": "0", result: "BackgroundImageFix" }),
                /* @__PURE__ */ jsx135(
                  "feColorMatrix",
                  {
                    in: "SourceAlpha",
                    result: "hardAlpha",
                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  }
                ),
                /* @__PURE__ */ jsx135("feOffset", { dy: "-4" }),
                /* @__PURE__ */ jsx135("feGaussianBlur", { stdDeviation: "5.5" }),
                /* @__PURE__ */ jsx135("feComposite", { in2: "hardAlpha", operator: "out" }),
                /* @__PURE__ */ jsx135("feColorMatrix", { values: "0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.14 0" }),
                /* @__PURE__ */ jsx135("feBlend", { in2: "BackgroundImageFix", result: "effect1_dropShadow_1_2" }),
                /* @__PURE__ */ jsx135(
                  "feColorMatrix",
                  {
                    in: "SourceAlpha",
                    result: "hardAlpha",
                    values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  }
                ),
                /* @__PURE__ */ jsx135("feOffset", { dy: "4" }),
                /* @__PURE__ */ jsx135("feGaussianBlur", { stdDeviation: "2" }),
                /* @__PURE__ */ jsx135("feComposite", { in2: "hardAlpha", operator: "out" }),
                /* @__PURE__ */ jsx135("feColorMatrix", { values: "0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" }),
                /* @__PURE__ */ jsx135(
                  "feBlend",
                  {
                    in2: "effect1_dropShadow_1_2",
                    result: "effect2_dropShadow_1_2"
                  }
                ),
                /* @__PURE__ */ jsx135(
                  "feBlend",
                  {
                    in: "SourceGraphic",
                    in2: "effect2_dropShadow_1_2",
                    result: "shape"
                  }
                )
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint1_linear_1_2",
              x1: "511.5",
              x2: "511.5",
              y1: "210.42",
              y2: "812.58",
              gradientTransform: "translate(-189 -194.42)",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#2E114A", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#07051B", offset: ".9434" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint2_linear_1_2",
              x1: "271.39",
              x2: "271.39",
              y1: "814",
              y2: "209",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": ".73", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#F1F1F1", "stop-opacity": ".94", offset: "1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint3_linear_1_2",
              x1: "172.13",
              x2: "814",
              y1: "251.54",
              y2: "814",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#6AD2FA", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#7669FA", offset: ".49479" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#8850E4", offset: ".74479" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#CE0EBB", offset: "1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint4_linear_1_2",
              x1: "284.3",
              x2: "284.3",
              y1: "792",
              y2: "227",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": ".73", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#F1F1F1", "stop-opacity": ".94", offset: "1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint5_linear_1_2",
              x1: "513.91",
              x2: "513.91",
              y1: "230",
              y2: "395.12",
              gradientTransform: "translate(-189 -194.42)",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#621EA6", "stop-opacity": ".89", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#CCCAD1", "stop-opacity": "0", offset: "1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint6_linear_1_2",
              x1: "512.46",
              x2: "512.46",
              y1: "585.23",
              y2: "586.23",
              gradientTransform: "translate(-189 -194.42)",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": "0", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": ".37", offset: ".22917" }),
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": ".046875", offset: ".64583" }),
                /* @__PURE__ */ jsx135("stop", { "stop-opacity": "0", offset: "1" })
              ]
            }
          ),
          /* @__PURE__ */ jsxs55(
            "linearGradient",
            {
              id: "paint7_linear_1_2",
              x1: "511.38",
              x2: "511.38",
              y1: "407.02",
              y2: "621.31",
              gradientUnits: "userSpaceOnUse",
              children: [
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#E9E9E9", offset: "0" }),
                /* @__PURE__ */ jsx135("stop", { "stop-color": "#A59ADE", offset: "1" })
              ]
            }
          )
        ] })
      ]
    }
  )
);
PodmanDesktop.displayName = "PodmanDesktop";

// src/icons/components/Group.tsx
import { forwardRef as forwardRef124 } from "react";
import { jsx as jsx136, jsxs as jsxs56 } from "react/jsx-runtime";
var Group = forwardRef124(
  (props, ref) => /* @__PURE__ */ jsxs56(
    "svg",
    {
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "currentColor",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx136("path", { d: "M4 5h1V4h8v5h1V3H5V2H2v3h1v9h6v-1H4zM3 3h1v1H3zM2 22h3v-3H2zm1-2h1v1H3zM19 2v3h3V2zm2 2h-1V3h1zm0 6H10v11h9v1h3v-3h-1zm-2 10h-8v-9h9v8h-1zm2 1h-1v-1h1z" }),
        /* @__PURE__ */ jsx136("path", { fill: "none", d: "M0 0h24v24H0z" })
      ]
    }
  )
);
Group.displayName = "Group";

// src/icons/components/Pin.tsx
import { forwardRef as forwardRef125 } from "react";
import { jsx as jsx137 } from "react/jsx-runtime";
var Pin = forwardRef125(
  (props, ref) => /* @__PURE__ */ jsx137(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx137(
        "path",
        {
          d: "m 15.298529,6.3788907 2.338848,2.3412219 c 0.742684,0.7433849 1.344499,1.3458184 1.731948,1.8686014 0.399022,0.538493 0.656953,1.105513 0.516967,1.75281 -0.139986,0.647296 -0.609185,1.056934 -1.195003,1.382093 -0.56879,0.315651 -1.365655,0.615083 -2.348948,0.984472 l -1.457357,0.54756 c -0.585597,0.220041 -0.745117,0.288596 -0.863652,0.391282 -0.05964,0.0516 -0.113006,0.110057 -0.159004,0.17419 -0.09155,0.127602 -0.145441,0.293019 -0.311522,0.896603 l -0.0091,0.0331 c -0.168588,0.612798 -0.307763,1.11856 -0.460207,1.498269 -0.154655,0.385459 -0.363491,0.750499 -0.738704,0.964643 -0.260658,0.148758 -0.555668,0.226749 -0.855764,0.226306 C 11.05491,19.439379 10.69304,19.225088 10.368301,18.966493 10.048379,18.711657 9.6777884,18.340646 9.2288236,17.891202 L 8.0587581,16.719935 5.0196264,19.762178 c -0.215795,0.215986 -0.5658556,0.216207 -0.7818718,3.68e-4 -0.2160161,-0.215765 -0.2161931,-0.565841 -3.98e-4,-0.781827 L 7.2772844,15.937665 6.145868,14.805099 C 5.6997117,14.35853 5.3314434,13.989878 5.0781714,13.671648 4.8210882,13.3487 4.6079617,12.989263 4.6052563,12.560091 c -0.00193,-0.305773 0.077446,-0.606532 0.2300295,-0.871466 0.2142397,-0.371969 0.5771047,-0.579257 0.960094,-0.732954 0.3772838,-0.151486 0.8794344,-0.289924 1.4876986,-0.45759 l 0.032862,-0.0091 c 0.6046964,-0.166715 0.7702027,-0.220763 0.897679,-0.312539 0.06571,-0.04731 0.1254935,-0.102391 0.1780453,-0.164054 0.102015,-0.1197067 0.169568,-0.2805541 0.3855252,-0.8699619 L 9.3053551,7.7009135 C 9.6697092,6.7064091 9.9648148,5.9009114 10.277774,5.3257897 c 0.322049,-0.591833 0.730065,-1.0673944 1.380015,-1.2107859 0.650024,-0.1434137 1.220067,0.1164485 1.760992,0.5180068 0.525518,0.3901693 1.131608,0.9968781 1.879748,1.7458801 z M 12.759616,5.5208191 C 12.315332,5.1909787 12.080106,5.1541577 11.895964,5.1947677 11.711823,5.2354071 11.513675,5.3679551 11.249036,5.8543011 10.979901,6.3488442 10.711871,7.0762107 10.327348,8.1256554 L 9.8154302,9.5228681 c -0.00986,0.026906 -0.019571,0.053481 -0.029162,0.079723 C 9.6136337,10.074917 9.480297,10.439743 9.2332465,10.729659 9.1230196,10.858956 8.9975852,10.974542 8.8596707,11.073837 8.5505296,11.296384 8.176106,11.399291 7.6916471,11.532495 c -0.026928,0.0074 -0.054203,0.01489 -0.081817,0.02248 -0.6494418,0.179056 -1.0903642,0.301497 -1.4024982,0.426814 -0.3131954,0.125759 -0.3883337,0.214365 -0.413854,0.258668 -0.054712,0.09502 -0.083203,0.202865 -0.08251,0.312628 3.244e-4,0.05138 0.022041,0.165712 0.2323589,0.429983 0.2095956,0.263312 0.5325878,0.587881 1.0088937,1.064674 l 3.0346351,3.037746 c 0.4793434,0.479815 0.8055864,0.805195 1.0703724,1.016022 0.265671,0.211637 0.380299,0.23272 0.431531,0.232794 0.107257,2.21e-4 0.212744,-0.02772 0.305994,-0.08094 0.04467,-0.02551 0.134015,-0.100696 0.260658,-0.416125 0.126127,-0.314323 0.249306,-0.758607 0.429246,-1.412833 0.0076,-0.0275 0.01504,-0.0547 0.02241,-0.0816 0.132688,-0.483722 0.235226,-0.857386 0.456815,-1.166254 0.09649,-0.134531 0.208468,-0.257194 0.333563,-0.365556 0.287491,-0.248864 0.650172,-0.384795 1.119445,-0.560754 0.02609,-0.0097 0.05249,-0.01961 0.07917,-0.02971 l 1.413275,-0.530973 c 1.037916,-0.389956 1.756864,-0.661598 2.245303,-0.932724 0.479889,-0.266334 0.611029,-0.464482 0.650909,-0.649065 0.03995,-0.184658 0.0024,-0.419442 -0.324644,-0.860704 C 18.148151,10.797991 17.605752,10.25296 16.821787,9.4682354 L 14.549726,7.1938018 C 13.760084,6.403379 13.211419,5.8562545 12.759616,5.5208191 Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Pin.displayName = "Pin";

// src/icons/components/Database.tsx
import { forwardRef as forwardRef126 } from "react";
import { jsx as jsx138 } from "react/jsx-runtime";
var Database = forwardRef126(
  (props, ref) => /* @__PURE__ */ jsx138(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx138(
        "path",
        {
          fillRule: "evenodd",
          "clip-rule": "evenodd",
          d: "M3.25 6C3.25 4.45831 4.48029 3.26447 6.00774 2.50075C7.58004 1.7146 9.69967 1.25 12 1.25C14.3003 1.25 16.42 1.7146 17.9923 2.50075C19.5197 3.26447 20.75 4.45831 20.75 6V18C20.75 19.5417 19.5197 20.7355 17.9923 21.4992C16.42 22.2854 14.3003 22.75 12 22.75C9.69967 22.75 7.58004 22.2854 6.00774 21.4992C4.48029 20.7355 3.25 19.5417 3.25 18V6ZM4.75 6C4.75 5.33255 5.31057 4.52639 6.67856 3.84239C8.00168 3.18083 9.88205 2.75 12 2.75C14.118 2.75 15.9983 3.18083 17.3214 3.84239C18.6894 4.52639 19.25 5.33255 19.25 6C19.25 6.66745 18.6894 7.47361 17.3214 8.15761C15.9983 8.81917 14.118 9.25 12 9.25C9.88205 9.25 8.00168 8.81917 6.67856 8.15761C5.31057 7.47361 4.75 6.66745 4.75 6ZM4.75 18C4.75 18.6674 5.31057 19.4736 6.67856 20.1576C8.00168 20.8192 9.88205 21.25 12 21.25C14.118 21.25 15.9983 20.8192 17.3214 20.1576C18.6894 19.4736 19.25 18.6674 19.25 18V14.7072C18.8733 15.0077 18.4459 15.2724 17.9923 15.4992C16.42 16.2854 14.3003 16.75 12 16.75C9.69967 16.75 7.58004 16.2854 6.00774 15.4992C5.55414 15.2724 5.12675 15.0077 4.75 14.7072V18ZM19.25 8.70722V12C19.25 12.6674 18.6894 13.4736 17.3214 14.1576C15.9983 14.8192 14.118 15.25 12 15.25C9.88205 15.25 8.00168 14.8192 6.67856 14.1576C5.31057 13.4736 4.75 12.6674 4.75 12V8.70722C5.12675 9.00772 5.55414 9.27245 6.00774 9.49925C7.58004 10.2854 9.69967 10.75 12 10.75C14.3003 10.75 16.42 10.2854 17.9923 9.49925C18.4459 9.27245 18.8733 9.00772 19.25 8.70722Z",
          fill: "currentColor"
        }
      )
    }
  )
);
Database.displayName = "Database";

// src/icons/components/RemoteHost.tsx
import { forwardRef as forwardRef127 } from "react";
import { jsx as jsx139 } from "react/jsx-runtime";
var RemoteHost = forwardRef127(
  (props, ref) => /* @__PURE__ */ jsx139(
    "svg",
    {
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx139(
        "path",
        {
          fillRule: "evenodd",
          "clip-rule": "evenodd",
          d: "M22 18.2105C22 17.8399 21.6876 17.5395 21.3023 17.5395H13.7252C13.5364 17.0909 13.164 16.7327 12.6977 16.5511V13.7368H18.5116C20.0529 13.7368 21.3023 12.5351 21.3023 11.0526C21.3023 9.57018 20.0529 8.36842 18.5116 8.36842C20.0529 8.36842 21.3023 7.16666 21.3023 5.68421C21.3023 4.20176 20.0529 3 18.5116 3H5.48837C3.94711 3 2.69767 4.20176 2.69767 5.68421C2.69767 7.16666 3.94711 8.36842 5.48837 8.36842C3.94711 8.36842 2.69767 9.57018 2.69767 11.0526C2.69767 12.5351 3.94711 13.7368 5.48837 13.7368H11.3023V16.5511C10.836 16.7327 10.4636 17.0909 10.2748 17.5395H2.69767C2.31236 17.5395 2 17.8399 2 18.2105C2 18.5811 2.31236 18.8816 2.69767 18.8816H10.2748C10.5508 19.5374 11.2192 20 12 20C12.7808 20 13.4492 19.5374 13.7252 18.8816H21.3023C21.6876 18.8816 22 18.5811 22 18.2105ZM12.2326 5.68421C12.2326 5.3136 12.5449 5.01316 12.9302 5.01316H18.5116C18.8969 5.01316 19.2093 5.3136 19.2093 5.68421C19.2093 6.05482 18.8969 6.35526 18.5116 6.35526H12.9302C12.5449 6.35526 12.2326 6.05482 12.2326 5.68421ZM12.2326 11.0526C12.2326 10.682 12.5449 10.3816 12.9302 10.3816H18.5116C18.8969 10.3816 19.2093 10.682 19.2093 11.0526C19.2093 11.4232 18.8969 11.7237 18.5116 11.7237H12.9302C12.5449 11.7237 12.2326 11.4232 12.2326 11.0526ZM6.4186 6.57895C6.93236 6.57895 7.34884 6.17836 7.34884 5.68421C7.34884 5.19006 6.93236 4.78947 6.4186 4.78947C5.90485 4.78947 5.48837 5.19006 5.48837 5.68421C5.48837 6.17836 5.90485 6.57895 6.4186 6.57895ZM6.4186 11.9474C6.93236 11.9474 7.34884 11.5468 7.34884 11.0526C7.34884 10.5585 6.93236 10.1579 6.4186 10.1579C5.90485 10.1579 5.48837 10.5585 5.48837 11.0526C5.48837 11.5468 5.90485 11.9474 6.4186 11.9474Z",
          fill: "currentColor"
        }
      )
    }
  )
);
RemoteHost.displayName = "RemoteHost";

// src/icons/components/Login.tsx
import { forwardRef as forwardRef128 } from "react";
import { jsx as jsx140, jsxs as jsxs57 } from "react/jsx-runtime";
var Login = forwardRef128(
  (props, ref) => /* @__PURE__ */ jsxs57(
    "svg",
    {
      width: "800px",
      height: "800px",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx140(
          "path",
          {
            fill: "currentColor",
            d: "m 12.443359,8.2519531 a 0.75,0.75 0 0 0 -0.511718,0.2597657 0.75,0.75 0 0 0 0.08203,1.0566406 l 1.958984,1.6796876 H 2.0019531 a 0.75,0.75 0 0 0 -0.75,0.75 0.75,0.75 0 0 0 0.75,0.75 H 13.976563 l -1.962891,1.681641 a 0.75,0.75 0 0 0 -0.08203,1.05664 0.75,0.75 0 0 0 1.05664,0.08203 l 3.5,-3 a 0.75,0.75 0 0 0 0.02539,-0.03125 0.75,0.75 0 0 0 0.0293,-0.03711 0.75,0.75 0 0 0 0.02734,-0.01367 0.75,0.75 0 0 0 0.02734,-0.05664 0.75,0.75 0 0 0 0.111328,-0.230469 0.75,0.75 0 0 0 0.02734,-0.09766 0.75,0.75 0 0 0 0.0078,-0.08399 0.75,0.75 0 0 0 0.0078,-0.01953 0.75,0.75 0 0 0 -0.02344,-0.115234 0.75,0.75 0 0 0 -0.01953,-0.126954 0.75,0.75 0 0 0 -0.01172,-0.02148 0.75,0.75 0 0 0 -0.06445,-0.111328 0.75,0.75 0 0 0 -0.0625,-0.111328 0.75,0.75 0 0 0 -0.01563,-0.0078 0.75,0.75 0 0 0 -0.05273,-0.05469 0.75,0.75 0 0 0 -0.01367,-0.01953 l -3.5,-3.0000005 A 0.75,0.75 0 0 0 12.443359,8.2519531 Z"
          }
        ),
        /* @__PURE__ */ jsx140(
          "path",
          {
            fill: "currentColor",
            d: "m 15,1.25 c -1.4142,0 -2.488723,-0.00407 -3.390625,0.1171875 C 10.707473,1.4884456 9.9292663,1.7660661 9.3476563,2.3476563 8.8390637,2.8562488 8.558327,3.5218998 8.4199219,4.2753906 8.2815168,5.0288814 8.2580656,5.898247 8.2519531,6.9960937 A 0.75,0.75 0 0 0 8.9980469,7.75 0.75,0.75 0 0 0 9.7519531,7.0039062 C 9.7579506,5.926723 9.7895888,5.1181917 9.8945313,4.546875 9.9994737,3.9755583 10.150369,3.6679905 10.410156,3.4082031 10.707256,3.1111133 11.076619,2.9519275 11.808594,2.8535156 12.540569,2.7551037 13.5858,2.75 15,2.75 h 1 c 1.4142,0 2.45942,0.0051 3.191406,0.1035156 0.731987,0.098412 1.103365,0.2576345 1.400391,0.5546875 0.29709,0.2970832 0.456274,0.6684153 0.554687,1.4003906 C 21.244898,5.5405691 21.25,6.585785 21.25,8 v 8 c 0,1.4142 -0.0051,2.459435 -0.103516,3.191406 -0.09841,0.731972 -0.257591,1.103295 -0.554687,1.400391 -0.297028,0.297061 -0.668406,0.456273 -1.400391,0.554687 C 18.459422,21.244898 17.4142,21.25 16,21.25 h -1 c -1.4142,0 -2.459433,-0.0051 -3.191406,-0.103516 -0.731973,-0.09841 -1.101336,-0.257589 -1.398438,-0.554687 C 10.150363,20.331996 9.9994736,20.024438 9.8945313,19.453125 9.7895889,18.881812 9.7579506,18.073262 9.7519531,16.996094 A 0.75,0.75 0 0 0 8.9980469,16.25 0.75,0.75 0 0 0 8.2519531,17.003906 c 0.00611,1.097832 0.029564,1.965263 0.1679688,2.71875 0.1384051,0.753487 0.4191481,1.421088 0.9277344,1.929688 0.5816084,0.581602 1.3598147,0.859207 2.2617187,0.980468 C 12.511279,22.754074 13.5858,22.75 15,22.75 h 1 c 1.4142,0 2.490663,0.0041 3.392578,-0.117188 0.901915,-0.12126 1.678193,-0.39883 2.259766,-0.980468 0.581604,-0.581604 0.859207,-1.357863 0.980468,-2.259766 C 22.754074,18.490675 22.75,17.4142 22.75,16 V 8 c 0,-1.414215 0.0041,-2.490671 -0.117188,-3.3925781 C 22.511551,3.7055148 22.233954,2.9292531 21.652344,2.3476563 21.07077,1.7660293 20.294492,1.4884454 19.392578,1.3671875 18.490665,1.2459296 17.4142,1.25 16,1.25 Z"
          }
        )
      ]
    }
  )
);
Login.displayName = "Login";

// src/icons/components/Logout.tsx
import { forwardRef as forwardRef129 } from "react";
import { jsx as jsx141, jsxs as jsxs58 } from "react/jsx-runtime";
var Logout = forwardRef129(
  (props, ref) => /* @__PURE__ */ jsxs58(
    "svg",
    {
      width: "800px",
      height: "800px",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx141(
          "path",
          {
            fill: "currentColor",
            d: "m 15,1.25 c -1.4142,0 -2.488723,-0.00407 -3.390625,0.1171875 C 10.707473,1.4884456 9.9292663,1.7660661 9.3476563,2.3476563 8.8390637,2.8562488 8.558327,3.5218998 8.4199219,4.2753906 8.2815168,5.0288814 8.2580656,5.898247 8.2519531,6.9960937 A 0.75,0.75 0 0 0 8.9980469,7.75 0.75,0.75 0 0 0 9.7519531,7.0039062 C 9.7579506,5.926723 9.7895888,5.1181917 9.8945313,4.546875 9.9994737,3.9755583 10.150369,3.6679905 10.410156,3.4082031 10.707256,3.1111133 11.076619,2.9519275 11.808594,2.8535156 12.540569,2.7551037 13.5858,2.75 15,2.75 h 1 c 1.4142,0 2.45942,0.0051 3.191406,0.1035156 0.731987,0.098412 1.103365,0.2576345 1.400391,0.5546875 0.29709,0.2970832 0.456274,0.6684153 0.554687,1.4003906 C 21.244898,5.5405691 21.25,6.585785 21.25,8 v 8 c 0,1.4142 -0.0051,2.459435 -0.103516,3.191406 -0.09841,0.731972 -0.257591,1.103295 -0.554687,1.400391 -0.297028,0.297061 -0.668406,0.456273 -1.400391,0.554687 C 18.459422,21.244898 17.4142,21.25 16,21.25 h -1 c -1.4142,0 -2.459433,-0.0051 -3.191406,-0.103516 -0.731973,-0.09841 -1.101336,-0.257589 -1.398438,-0.554687 C 10.150363,20.331996 9.9994736,20.024438 9.8945313,19.453125 9.7895889,18.881812 9.7579506,18.073262 9.7519531,16.996094 A 0.75,0.75 0 0 0 8.9980469,16.25 0.75,0.75 0 0 0 8.2519531,17.003906 c 0.00611,1.097832 0.029564,1.965263 0.1679688,2.71875 0.1384051,0.753487 0.4191481,1.421088 0.9277344,1.929688 0.5816084,0.581602 1.3598147,0.859207 2.2617187,0.980468 C 12.511279,22.754074 13.5858,22.75 15,22.75 h 1 c 1.4142,0 2.490663,0.0041 3.392578,-0.117188 0.901915,-0.12126 1.678193,-0.39883 2.259766,-0.980468 0.581604,-0.581604 0.859207,-1.357863 0.980468,-2.259766 C 22.754074,18.490675 22.75,17.4142 22.75,16 V 8 c 0,-1.414215 0.0041,-2.490671 -0.117188,-3.3925781 C 22.511551,3.7055148 22.233954,2.9292531 21.652344,2.3476563 21.07077,1.7660293 20.294492,1.4884454 19.392578,1.3671875 18.490665,1.2459296 17.4142,1.25 16,1.25 Z"
          }
        ),
        /* @__PURE__ */ jsx141(
          "path",
          {
            fill: "currentColor",
            d: "M 5.5566406,8.2519531 A 0.75,0.75 0 0 0 5.0117187,8.4296875 l -3.5,3.0000005 a 0.75,0.75 0 0 0 -0.013672,0.02734 0.75,0.75 0 0 0 -0.041016,0.04102 0.75,0.75 0 0 0 -0.027344,0.01367 0.75,0.75 0 0 0 -0.074219,0.226562 0.75,0.75 0 0 0 -0.09375,0.234375 A 0.75,0.75 0 0 0 1.25,12 a 0.75,0.75 0 0 0 0.011719,0.02734 0.75,0.75 0 0 0 0.09375,0.234375 0.75,0.75 0 0 0 0.074219,0.226562 0.75,0.75 0 0 0 0.027344,0.01367 0.75,0.75 0 0 0 0.041016,0.04102 0.75,0.75 0 0 0 0.013672,0.02734 l 3.5,3 a 0.75,0.75 0 0 0 1.0585938,-0.08203 0.75,0.75 0 0 0 -0.082031,-1.058593 L 4.0292969,12.75 H 15 A 0.75,0.75 0 0 0 15.75,12 0.75,0.75 0 0 0 15,11.25 H 4.0292969 L 5.9882812,9.5703125 A 0.75,0.75 0 0 0 6.0703125,8.5117188 0.75,0.75 0 0 0 5.5566406,8.2519531 Z"
          }
        )
      ]
    }
  )
);
Logout.displayName = "Logout";

// src/icons/components/Snapshot.tsx
import { forwardRef as forwardRef130 } from "react";
import { jsx as jsx142 } from "react/jsx-runtime";
var Snapshot = forwardRef130(
  (props, ref) => /* @__PURE__ */ jsx142(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx142(
        "path",
        {
          d: "M13,5 C14.1045695,5 15,5.8954305 15,7 L15,12 C15,13.1045695 14.1045695,14 13,14 L6,14 C4.8954305,14 4,13.1045695 4,12 L4,7 C4,5.8954305 4.8954305,5 6,5 L13,5 Z M13,6 L6,6 C5.44771525,6 5,6.44771525 5,7 L5,12 C5,12.5522847 5.44771525,13 6,13 L13,13 C13.5522847,13 14,12.5522847 14,12 L14,7 C14,6.44771525 13.5522847,6 13,6 Z M10,2 C11.1045695,2 12,2.8954305 12,4 L11,4 C11,3.48716416 10.6139598,3.06449284 10.1166211,3.00672773 L10,3 L3,3 C2.44771525,3 2,3.44771525 2,4 L2,9 C2,9.55228475 2.44771525,10 3,10 L3,11 C1.8954305,11 1,10.1045695 1,9 L1,4 C1,2.8954305 1.8954305,2 3,2 L10,2 Z",
          id: "Combined-Shape",
          fill: "currentColor"
        }
      )
    }
  )
);
Snapshot.displayName = "Snapshot";

// src/icons/components/Revert.tsx
import { forwardRef as forwardRef131 } from "react";
import { jsx as jsx143 } from "react/jsx-runtime";
var Revert = forwardRef131(
  (props, ref) => /* @__PURE__ */ jsx143(
    "svg",
    {
      viewBox: "0 0 25 25",
      fill: "none",
      version: "1.1",
      id: "svg2",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx143(
        "path",
        {
          fill: "currentColor",
          d: "M 8.5761719 4.5761719 L 4.1523438 9 L 8.5761719 13.423828 L 9.4238281 12.576172 L 6.4472656 9.5996094 L 14.5 9.5996094 C 16.661041 9.5996094 18.400391 11.338959 18.400391 13.5 C 18.400391 15.661041 16.661041 17.400391 14.5 17.400391 L 5 17.400391 L 5 18.599609 L 14.5 18.599609 C 17.309559 18.599609 19.599609 16.309559 19.599609 13.5 C 19.599609 10.690441 17.309559 8.4003906 14.5 8.4003906 L 6.4472656 8.4003906 L 9.4238281 5.4238281 L 8.5761719 4.5761719 z "
        }
      )
    }
  )
);
Revert.displayName = "Revert";

// src/icons/components/CleanBrush.tsx
import { forwardRef as forwardRef132 } from "react";
import { jsx as jsx144 } from "react/jsx-runtime";
var CleanBrush = forwardRef132(
  (props, ref) => /* @__PURE__ */ jsx144(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx144(
        "path",
        {
          d: "M11.5,1.53589838 C12.2174389,1.95011195 12.4632517,2.86749756 12.0490381,3.58493649 L10.2990381,6.6160254 L12.8971143,8.1160254 L11.3971143,10.7141016 L11.0838897,10.5355535 C11.1781923,11.5900484 11.4477907,12.4981215 11.8896336,13.2634139 L12.3226476,14.0134143 L3.0540923,14.0134143 L2.9380998,13.6759335 C2.10148654,11.2418023 2.42825412,8.7993538 3.90177275,6.38744616 L3.60288568,6.21410162 L5.10288568,3.6160254 L7.70096189,5.1160254 L9.45096189,2.08493649 C9.86517546,1.36749756 10.7825611,1.12168482 11.5,1.53589838 Z M4.76910324,6.88768603 L4.84656206,6.76169205 C3.56240522,8.79245371 3.1907041,10.7956476 3.7177794,12.8032376 L3.77720324,13.012462 L5.23281189,13.0140072 C5.03908437,12.5922102 4.95204684,12.0567372 4.96727143,11.421927 L5.96698396,11.445903 C5.94512853,12.3571957 6.15298858,12.8402948 6.55399878,13.0136098 L10.6542032,13.012462 L10.6235758,12.9411802 C10.2761203,12.0808769 10.0861676,11.1066418 10.0516516,10.0209402 L10.0501032,9.93568603 L4.76910324,6.88768603 Z M10.3169873,2.58493649 L8.0669873,6.48205081 L5.46810324,4.98168603 L4.96710324,5.84968603 L5.26710324,6.02368603 L10.5499819,9.06959056 L11.0311032,9.34668603 L11.5301032,8.48168603 L8.9330127,6.98205081 L11.1830127,3.08493649 C11.3210839,2.84579018 11.2391463,2.53999498 11,2.40192379 C10.7608537,2.2638526 10.4550585,2.34579018 10.3169873,2.58493649 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
CleanBrush.displayName = "CleanBrush";

// src/icons/components/Pull.tsx
import { forwardRef as forwardRef133 } from "react";
import { jsx as jsx145 } from "react/jsx-runtime";
var Pull = forwardRef133(
  (props, ref) => /* @__PURE__ */ jsx145(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx145(
        "path",
        {
          d: "M4,10 L4,10.999 L3,11 C2.44771525,11 2,11.4477153 2,12 L2,13 C2,13.5522847 2.44771525,14 3,14 L12,14 C12.5522847,14 13,13.5522847 13,13 L13,12 C13,11.4477153 12.5522847,11 12,11 L11,11 L11,10 L12,10 C13.1045695,10 14,10.8954305 14,12 L14,13 C14,14.1045695 13.1045695,15 12,15 L3,15 C1.8954305,15 1,14.1045695 1,13 L1,12 C1,10.8954305 1.8954305,10 3,10 L4,10 Z M8,1.93553715 L7.99920454,9.11 L9.64495201,7.46446609 L10.3520588,8.17157288 L7.52363166,11 L4.69520454,8.17157288 L5.40231132,7.46446609 L6.99920454,9.062 L7,1.93553715 L8,1.93553715 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Pull.displayName = "Pull";

// src/icons/components/Push.tsx
import { forwardRef as forwardRef134 } from "react";
import { jsx as jsx146 } from "react/jsx-runtime";
var Push = forwardRef134(
  (props, ref) => /* @__PURE__ */ jsx146(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx146(
        "path",
        {
          d: "M4,10 L4,10.999 L3,11 C2.44771525,11 2,11.4477153 2,12 L2,13 C2,13.5522847 2.44771525,14 3,14 L12,14 C12.5522847,14 13,13.5522847 13,13 L13,12 C13,11.4477153 12.5522847,11 12,11 L11,11 L11,10 L12,10 C13.1045695,10 14,10.8954305 14,12 L14,13 C14,14.1045695 13.1045695,15 12,15 L3,15 C1.8954305,15 1,14.1045695 1,13 L1,12 C1,10.8954305 1.8954305,10 3,10 L4,10 Z M7.52363166,1.93553715 L10.3520588,4.76396427 L9.64495201,5.47107105 L8,3.82653715 L8,11 L7,11 L7,3.87253715 L5.40231132,5.47107105 L4.69520454,4.76396427 L7.52363166,1.93553715 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Push.displayName = "Push";

// src/icons/components/CatalogVersion.tsx
import { forwardRef as forwardRef135 } from "react";
import { jsx as jsx147 } from "react/jsx-runtime";
var CatalogVersion = forwardRef135((props, ref) => /* @__PURE__ */ jsx147(
  "svg",
  {
    width: "16px",
    height: "16px",
    viewBox: "0 0 16 16",
    version: "1.1",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx147(
      "path",
      {
        d: "M13.9988247,5.96187171 L13.9988247,11.918465 L4.99882467,14.086909 L4.998,11.7778717 L5.998,11.6668717 L5.99882467,12.816626 L12.9988247,11.129626 L12.9988247,7.08862601 L12.7385366,7.12251872 C12.4857601,7.15518994 12.2393797,7.18838655 11.9994167,7.22209366 L11.9982788,6.21226472 C12.304139,6.17008654 12.6196593,6.12875664 12.944877,6.08824889 L13.9988247,5.96187171 Z M10.9988247,1.96187171 L10.9988247,8.91846498 L1.99882467,11.086909 L1.99882467,4.21148719 L2.19833363,4.06147226 C3.2602385,3.26300394 5.69995691,2.63635153 9.5852642,2.13388792 L10.9988247,1.96187171 Z M9.99882467,8.12962601 L9.99882467,3.08862601 L9.73853659,3.12251872 C6.41390091,3.552226 4.19571179,4.07282047 3.13221035,4.65040211 L2.99882467,4.72662601 L2.99882467,9.81662601 L9.99882467,8.12962601 Z",
        fill: "currentColor",
        fillRule: "nonzero"
      }
    )
  }
));
CatalogVersion.displayName = "CatalogVersion";

// src/icons/components/File.tsx
import { forwardRef as forwardRef136 } from "react";
import { jsx as jsx148 } from "react/jsx-runtime";
var File = forwardRef136(
  (props, ref) => /* @__PURE__ */ jsx148(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx148(
        "path",
        {
          d: "M5,2 C3.8954305,2 3,2.8954305 3,4 L3,12 C3,13.1045695 3.8954305,14 5,14 L11,14 C12.1045695,14 13,13.1045695 13,12 L13,5.73681369 C13,5.26122834 12.8305251,4.80120737 12.5219837,4.43929079 L10.4424373,2 L5,2 Z M5,3 L9.982,3 L11.7609918,5.08805224 C11.9152626,5.26901053 12,5.49902102 12,5.73681369 L12,12 C12,12.5522847 11.5522847,13 11,13 L5,13 C4.44771525,13 4,12.5522847 4,12 L4,4 C4,3.44771525 4.44771525,3 5,3 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
File.displayName = "File";

// src/icons/components/Revoke.tsx
import { forwardRef as forwardRef137 } from "react";
import { jsx as jsx149 } from "react/jsx-runtime";
var Revoke = forwardRef137(
  (props, ref) => /* @__PURE__ */ jsx149(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx149(
        "path",
        {
          d: "M8,2 C11.3137085,2 14,4.6862915 14,8 C14,9.47139954 13.4703539,10.8190936 12.5913132,11.8628307 L12.6345189,11.9066914 L11.9302132,12.6165882 L11.8858196,12.5718535 C10.8389186,13.4625313 9.48222558,14 8,14 C4.6862915,14 2,11.3137085 2,8 C2,6.53471952 2.52525,5.19211776 3.39773801,4.15020669 L3.36000654,4.11387771 L4.06431234,3.40398099 L4.10123046,3.43919545 C5.14988186,2.54191547 6.51165536,2 8,2 Z M3,8 C3,10.7614237 5.23857625,13 8,13 C9.20436215,13 10.3092701,12.574186 11.1723859,11.8648958 L4.11068395,4.85756444 C3.41605172,5.71622139 3,6.80952365 3,8 Z M8,3 C6.78915781,3 5.67884291,3.43040853 4.81370321,4.14657771 L11.8779482,11.1564363 C12.5794066,10.2956779 13,9.19695639 13,8 C13,5.23857625 10.7614237,3 8,3 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Revoke.displayName = "Revoke";

// src/icons/components/Taint.tsx
import { forwardRef as forwardRef138 } from "react";
import { jsx as jsx150 } from "react/jsx-runtime";
var Taint = forwardRef138(
  (props, ref) => /* @__PURE__ */ jsx150(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx150(
        "path",
        {
          d: "M13.9106454,7.91865116 C13.4206479,7.63313742 12.8300029,7.83741895 12.2319998,7.96540944 C11.1178003,8.20553745 9.67721708,7.71318009 10.568586,6.43272613 C11.068988,5.71380616 12.538793,5.02759868 12.9228939,4.19297255 C13.3361931,3.29484301 13.2725473,2.18559207 11.8828151,1.39443009 C10.9504607,0.863709904 9.60272152,1.21220091 8.84272159,2.18847443 C8.08262793,3.16470219 8.31408203,4.61837224 8.02594194,5.83042735 C7.58777967,7.68001008 6.18171419,6.44517061 6.16083481,5.10061846 C6.13540931,3.3477549 6.62050916,0.863435394 3.58971886,1.00586056 C3.35489032,1.01711549 3.13594979,1.04520706 2.93348311,1.08819082 C0.249370127,1.66363333 0.532800047,4.89942518 2.72077592,6.00581664 C4.30793661,6.80782178 6.30387377,7.12428657 6.39927214,8.00946837 C6.37670554,8.93918948 3.37905041,6.701998 2.18433295,8.81794737 C1.26451557,10.4481276 2.42389509,13.1347385 4.23163666,11.8743009 C4.56732361,11.6402807 4.92904533,11.279208 5.32059808,10.781818 C6.80961867,9.0801506 7.78977768,10.0873065 6.18323737,11.4378064 C4.92253078,12.497554 5.79470756,14.056453 6.68211621,14.5174476 C7.80885267,15.103779 8.94941497,15.2895082 10.1662538,14.3022771 C11.110489,13.5361871 10.9360958,12.4714526 10.4441534,11.9458566 C9.05435083,10.4608924 8.79770556,8.811565 10.4208603,9.46272665 C11.4996281,9.89565249 12.3738905,11.5382086 13.7026718,11.5088131 C15.2777642,11.0734167 15.5030318,8.74570537 13.9106454,7.91865116 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Taint.displayName = "Taint";

// src/icons/components/Unlock.tsx
import { forwardRef as forwardRef139 } from "react";
import { jsx as jsx151 } from "react/jsx-runtime";
var Unlock = forwardRef139(
  (props, ref) => /* @__PURE__ */ jsx151(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx151(
        "path",
        {
          d: "M8,0.5 C9.93299662,0.5 11.5,2.06700338 11.5,4 L10.5,4 C10.5,2.61928813 9.38071187,1.5 8,1.5 L7,1.5 C5.61928813,1.5 4.5,2.61928813 4.5,4 L4.5,6 L11,6 C12.1045695,6 13,6.8954305 13,8 L13,12 C13,13.1045695 12.1045695,14 11,14 L4,14 C2.8954305,14 2,13.1045695 2,12 L2,8 C2,7.06808721 2.63737692,6.28504178 3.49998077,6.06301369 L3.5,4 C3.5,2.06700338 5.06700338,0.5 7,0.5 L8,0.5 Z M11,7 L4,7 C3.44771525,7 3,7.44771525 3,8 L3,12 C3,12.5522847 3.44771525,13 4,13 L11,13 C11.5522847,13 12,12.5522847 12,12 L12,8 C12,7.44771525 11.5522847,7 11,7 Z",
          fill: "currentColor",
          fillRule: "nonzero"
        }
      )
    }
  )
);
Unlock.displayName = "Unlock";

// src/icons/components/Check.tsx
import { forwardRef as forwardRef140 } from "react";
import { jsx as jsx152 } from "react/jsx-runtime";
var Check = forwardRef140(
  (props, ref) => /* @__PURE__ */ jsx152(
    "svg",
    {
      viewBox: "-2.88 -2.88 29.76 29.76",
      fill: "none",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: /* @__PURE__ */ jsx152(
        "path",
        {
          fill: "currentColor",
          d: "M 19.556641,5.34375 A 1,1 0 0 0 18.849609,5.6367187 L 8.9492188,15.535156 4.7070312,11.292969 a 1,1 0 0 0 -1.4140624,0 1,1 0 0 0 0,1.414062 l 4.9492187,4.949219 a 1.0001,1.0001 0 0 0 1.4140625,0 L 20.263672,7.0507812 a 1,1 0 0 0 0,-1.4140625 A 1,1 0 0 0 19.556641,5.34375 Z"
        }
      )
    }
  )
);
Check.displayName = "Check";

// src/icons/components/ArrowChevronLeft.tsx
import { forwardRef as forwardRef141 } from "react";
import { jsx as jsx153 } from "react/jsx-runtime";
var ArrowChevronLeft = forwardRef141((props, ref) => /* @__PURE__ */ jsx153(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx153(
      "path",
      {
        transform: "rotate(90 12 12)",
        d: "M12.146 16.157c-.27 0-.516-.11-.739-.328L6.26 10.565a1.013 1.013 0 0 1-.198-.293.95.95 0 0 1-.062-.35.925.925 0 0 1 .451-.8.91.91 0 0 1 .465-.122.93.93 0 0 1 .67.28l4.874 5.004h-.622l4.86-5.004a.93.93 0 0 1 1.128-.157.909.909 0 0 1 .458.8c0 .25-.089.462-.266.636l-5.134 5.27c-.11.11-.226.191-.349.246a1.08 1.08 0 0 1-.39.082z",
        fill: "currentColor"
      }
    )
  }
));
ArrowChevronLeft.displayName = "ArrowChevronLeft";

// src/icons/components/ArrowChevronRight.tsx
import { forwardRef as forwardRef142 } from "react";
import { jsx as jsx154 } from "react/jsx-runtime";
var ArrowChevronRight = forwardRef142((props, ref) => /* @__PURE__ */ jsx154(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
    ref,
    children: /* @__PURE__ */ jsx154(
      "path",
      {
        transform: "rotate(-90 12 12)",
        d: "M12.146 16.157c-.27 0-.516-.11-.739-.328L6.26 10.565a1.013 1.013 0 0 1-.198-.293.95.95 0 0 1-.062-.35.925.925 0 0 1 .451-.8.91.91 0 0 1 .465-.122.93.93 0 0 1 .67.28l4.874 5.004h-.622l4.86-5.004a.93.93 0 0 1 1.128-.157.909.909 0 0 1 .458.8c0 .25-.089.462-.266.636l-5.134 5.27c-.11.11-.226.191-.349.246a1.08 1.08 0 0 1-.39.082z",
        fill: "currentColor"
      }
    )
  }
));
ArrowChevronRight.displayName = "ArrowChevronRight";

// src/icons/components/Drag.tsx
import { forwardRef as forwardRef143 } from "react";
import { jsx as jsx155, jsxs as jsxs59 } from "react/jsx-runtime";
var Drag = forwardRef143(
  (props, ref) => /* @__PURE__ */ jsxs59(
    "svg",
    {
      viewBox: "0 0 20 20",
      fill: "currentColor",
      xmlns: "http://www.w3.org/2000/svg",
      ...props,
      ref,
      children: [
        /* @__PURE__ */ jsx155("circle", { cx: "6", cy: "5", r: "1.1" }),
        /* @__PURE__ */ jsx155("circle", { cx: "6", cy: "10", r: "1.1" }),
        /* @__PURE__ */ jsx155("circle", { cx: "6", cy: "15", r: "1.1" }),
        /* @__PURE__ */ jsx155("circle", { cx: "12", cy: "5", r: "1.1" }),
        /* @__PURE__ */ jsx155("circle", { cx: "12", cy: "10", r: "1.1" }),
        /* @__PURE__ */ jsx155("circle", { cx: "12", cy: "15", r: "1.1" })
      ]
    }
  )
);
Drag.displayName = "Drag";

// src/icons/registry.ts
var iconRegistry = {
  Add,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Attached,
  Attachment,
  Back,
  Blueprint,
  Bug,
  Chat,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clean,
  Close,
  Close1,
  CloudOff,
  Cog,
  Complete,
  Container,
  CopyClipboard,
  Dashboard,
  Details,
  "Docker copy": DockerCopy,
  Docker,
  Dots,
  Download,
  Edit,
  Equal,
  Error: Error2,
  Export,
  EyeClosed,
  EyeOpen,
  Globe,
  Help,
  Idea,
  Image,
  Info,
  Key,
  "LXC-Old": LXCOld,
  LXC,
  Log,
  Moon,
  Notification,
  Official,
  Offline,
  OpenApp,
  Parameter,
  Pause,
  Praise,
  ReportFeedback,
  Reset,
  Restart,
  Rocket,
  Run,
  Save,
  Scale,
  Script,
  Search,
  Send,
  Settings,
  Shop,
  Star,
  Stop,
  Sun,
  Suspend,
  ThemeAuto,
  ThemeDark,
  ThemeLight,
  Trash,
  UX,
  User,
  Users,
  Verified,
  ViewGrid,
  ViewRows,
  Library,
  Host,
  VirtualMachine,
  Role,
  Roles,
  Cache,
  Claim,
  Claims,
  KeyManagement,
  Windows,
  Ubuntu,
  Debian,
  Apple,
  KaliLinux,
  RedHat,
  Fedora,
  CentOS,
  Clone,
  Copy,
  Live,
  HealthCheck,
  ReverseProxy,
  ReverseProxyCORS,
  ReverseProxyRoutes,
  ReverseProxyFrom,
  ReverseProxyHeadersRequest,
  ReverseProxyHeadersResponse,
  ReverseProxyHTTP,
  ReverseProxyTo,
  ReverseProxyTLS,
  ReverseProxyTCP,
  Refresh,
  Calendar,
  Folder,
  Jobs,
  Warning,
  Artifactory,
  Azure,
  Minio,
  Aws,
  Orchestrator,
  Podman,
  PodmanDesktop,
  Group,
  Pin,
  Database,
  RemoteHost,
  Login,
  Logout,
  Snapshot,
  Revert,
  CleanBrush,
  Pull,
  Push,
  CatalogVersion,
  File,
  Revoke,
  Taint,
  Unlock,
  Check,
  ArrowChevronLeft,
  ArrowChevronRight,
  Drag
};

// src/utils/iconUtils.ts
var widthTokenRegex = /^(?:min-|max-)?w-/;
var heightTokenRegex = /^(?:min-|max-)?h-/;
var mergeClassTokens = (...groups) => {
  const tokens = [];
  const addToken = (token) => {
    if (widthTokenRegex.test(token)) {
      for (let i = tokens.length - 1; i >= 0; i -= 1) {
        if (widthTokenRegex.test(tokens[i])) {
          tokens.splice(i, 1);
        }
      }
    }
    if (heightTokenRegex.test(token)) {
      for (let i = tokens.length - 1; i >= 0; i -= 1) {
        if (heightTokenRegex.test(tokens[i])) {
          tokens.splice(i, 1);
        }
      }
    }
    if (!tokens.includes(token)) {
      tokens.push(token);
    }
  };
  groups.filter(Boolean).forEach((group) => group.split(/\s+/).filter(Boolean).forEach(addToken));
  return tokens.join(" ");
};
var hasExplicitSize = (value) => Boolean(value) && /\b(?:min-|max-)?(?:w|h)-/.test(value);

// src/components/CustomIcon.tsx
import { jsx as jsx156 } from "react/jsx-runtime";
var SIZE_CLASS_MAP = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
  xl: "h-8 w-8"
};
var CustomIcon = ({
  icon,
  alt = "",
  customSize = void 0,
  size = "md",
  className = "",
  onClick,
  colored = false,
  color,
  hoverColor
}) => {
  const IconComponent = iconRegistry[icon];
  const dimension = useMemo2(() => {
    if (!customSize) {
      return void 0;
    }
    if (typeof customSize === "number") {
      return `${customSize}px`;
    }
    return customSize;
  }, [customSize]);
  const baseStyle = useMemo2(() => {
    const style = {};
    if (dimension) {
      style.width = dimension;
      style.height = dimension;
    }
    if (color && !colored) {
      style["--icon-color"] = color;
    }
    if (hoverColor && !colored) {
      style["--icon-hover-color"] = hoverColor;
    }
    return style;
  }, [dimension, color, hoverColor, colored]);
  const fallbackSizeClass = !dimension && !hasExplicitSize(className) ? SIZE_CLASS_MAP[size] : void 0;
  const iconClass = mergeClassTokens(
    "inline-flex items-center justify-center flex-shrink-0 [&>svg]:h-full [&>svg]:w-full",
    !colored ? "fill-current" : "",
    fallbackSizeClass,
    className
  );
  if (!IconComponent) {
    console.warn(`Icon not found in registry: ${icon}`);
    return /* @__PURE__ */ jsx156(
      "span",
      {
        className: `flex items-center justify-center rounded bg-neutral-100 text-xs font-bold uppercase text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 ${className}`,
        style: baseStyle,
        onClick,
        children: icon?.charAt(0) || "?"
      }
    );
  }
  return /* @__PURE__ */ jsx156("span", { className: iconClass, style: baseStyle, onClick, children: /* @__PURE__ */ jsx156(IconComponent, { className: "w-full h-full", "aria-label": alt }) });
};
var CustomIcon_default = CustomIcon;

// src/components/Hero.tsx
import { Fragment as Fragment2, jsx as jsx157, jsxs as jsxs60 } from "react/jsx-runtime";

// src/components/DynamicImg.tsx
import { Fragment as Fragment3, jsx as jsx158 } from "react/jsx-runtime";
var sizeClasses = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10"
};
var DynamicImg = ({
  base64,
  fill,
  stroke,
  className,
  title,
  size = "md",
  style
}) => {
  const renderIcon2 = useIconRenderer();
  if (!base64) {
    return /* @__PURE__ */ jsx158(Fragment3, { children: renderIcon2("Chat", size) });
  }
  if (base64.toLowerCase().includes("data:image/png;base64,")) {
    return /* @__PURE__ */ jsx158(
      "img",
      {
        src: base64,
        alt: "Dynamic Image",
        className,
        style,
        title
      }
    );
  }
  if (!base64.toLowerCase().includes("data:image/svg+xml;base64,")) {
    return /* @__PURE__ */ jsx158(Fragment3, { children: renderIcon2("Chat", size) });
  }
  const svgDecoded = atob(base64.replace(/^data:image\/svg\+xml;base64,/, ""));
  const svgStyled = svgDecoded.replace(/fill=".*?"/g, `fill="${fill || "currentColor"}"`).replace(/stroke=".*?"/g, `stroke="${stroke || "currentColor"}"`);
  return /* @__PURE__ */ jsx158(
    "div",
    {
      className: `inline-flex select-none items-center justify-center p-[5px] text-current [&>svg]:h-full [&>svg]:w-full [&>svg_*]:fill-current [&>svg_*]:stroke-current ${sizeClasses[size]} ${className ?? ""}`,
      style,
      title,
      dangerouslySetInnerHTML: { __html: svgStyled }
    }
  );
};
DynamicImg.displayName = "DynamicImg";

// src/components/DropdownButton.tsx
import { useEffect as useEffect3, useMemo as useMemo3, useRef as useRef4, useState as useState4 } from "react";
import classNames16 from "classnames";

// src/components/DropdownMenu.tsx
import {
  useCallback as useCallback2,
  useEffect as useEffect2,
  useLayoutEffect as useLayoutEffect2,
  useRef as useRef3,
  useState as useState3
} from "react";
import { createPortal as createPortal3 } from "react-dom";
import classNames15 from "classnames";
import { jsx as jsx159, jsxs as jsxs61 } from "react/jsx-runtime";
var PORTAL_ROOT = typeof document !== "undefined" ? document.body : null;
var viewportBounds = () => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight
});
var isClippingParent = (element) => {
  const style = window.getComputedStyle(element);
  const values = [style.overflow, style.overflowX, style.overflowY].join(" ");
  return /(auto|scroll|hidden|clip)/.test(values);
};
var resolveBoundaryBounds = (anchor) => {
  let node = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent(node)) {
      const rect = node.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      };
    }
    node = node.parentElement;
  }
  return viewportBounds();
};
var resolveAnchorLayerZIndex = (anchor) => {
  let node = anchor;
  let highest = null;
  while (node && node !== document.body) {
    const zIndex = window.getComputedStyle(node).zIndex;
    if (zIndex && zIndex !== "auto") {
      const parsed = Number(zIndex);
      if (Number.isFinite(parsed)) {
        highest = highest === null ? parsed : Math.max(highest, parsed);
      }
    }
    node = node.parentElement;
  }
  const base = highest ?? 20;
  return Math.max(1, base + 1);
};
var DropdownMenu = ({
  anchorRef,
  open,
  onClose,
  items,
  onSelect,
  align = "end",
  side = "auto",
  width = "trigger",
  maxHeight = 288,
  className,
  itemClassName
}) => {
  const renderIcon2 = useIconRenderer();
  const menuRef = useRef3(null);
  const [style, setStyle] = useState3();
  const [computedMaxHeight, setComputedMaxHeight] = useState3(maxHeight);
  const handleSelect = useCallback2(
    (item) => {
      if (item.disabled) {
        return;
      }
      onSelect?.(item);
      onClose();
    },
    [onClose, onSelect]
  );
  useEffect2(() => {
    if (!open) {
      return;
    }
    const handlePointer = (event) => {
      if (menuRef.current?.contains(event.target) || anchorRef.current?.contains(event.target)) {
        return;
      }
      onClose();
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef]);
  useEffect2(() => {
    if (!open) {
      setStyle(void 0);
      setComputedMaxHeight(maxHeight);
    }
  }, [maxHeight, open]);
  const updatePosition = useCallback2(() => {
    if (!open || !anchorRef.current || !menuRef.current) {
      return;
    }
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const caretElement = anchorRef.current.querySelector(
      "[data-dropdown-caret]"
    );
    const alignReferenceRect = caretElement?.getBoundingClientRect() ?? anchorRect;
    const menuRect = menuRef.current.getBoundingClientRect();
    const boundary = resolveBoundaryBounds(anchorRef.current);
    const zIndex = resolveAnchorLayerZIndex(anchorRef.current);
    const offset = 8;
    const minMargin = 8;
    const maxAllowedWidth = Math.max(120, boundary.width - minMargin * 2);
    const unclampedWidth = typeof width === "number" ? width : width === "trigger" ? Math.max(anchorRect.width, menuRect.width) : menuRect.width;
    const computedWidth = Math.min(unclampedWidth, maxAllowedWidth);
    const computedHeight = menuRect.height;
    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;
    const overflowForTop = (top) => {
      const overflowTop = Math.max(0, boundary.top + minMargin - top);
      const overflowBottom = Math.max(
        0,
        top + computedHeight - (boundary.bottom - minMargin)
      );
      return overflowTop + overflowBottom;
    };
    const chooseTop = () => {
      if (side === "top") return { top: aboveTop, isTopSide: true };
      if (side === "bottom") return { top: belowTop, isTopSide: false };
      const belowOverflow = overflowForTop(belowTop);
      const aboveOverflow = overflowForTop(aboveTop);
      if (aboveOverflow < belowOverflow)
        return { top: aboveTop, isTopSide: true };
      return { top: belowTop, isTopSide: false };
    };
    const verticalChoice = chooseTop();
    const clampedTop = Math.min(
      Math.max(verticalChoice.top, boundary.top + minMargin),
      Math.max(
        boundary.top + minMargin,
        boundary.bottom - computedHeight - minMargin
      )
    );
    const availableBelow = Math.max(
      120,
      boundary.bottom - minMargin - belowTop
    );
    const availableAbove = Math.max(
      120,
      anchorRect.top - offset - (boundary.top + minMargin)
    );
    const nextMaxHeight = Math.max(
      120,
      Math.min(
        maxHeight,
        verticalChoice.isTopSide ? availableAbove : availableBelow
      )
    );
    const startLeft = alignReferenceRect.left;
    const endLeft = alignReferenceRect.right - computedWidth;
    const overflowForLeft = (left) => {
      const overflowLeft = Math.max(0, boundary.left + minMargin - left);
      const overflowRight = Math.max(
        0,
        left + computedWidth - (boundary.right - minMargin)
      );
      return overflowLeft + overflowRight;
    };
    const preferredLeft = align === "start" ? startLeft : endLeft;
    const alternateLeft = align === "start" ? endLeft : startLeft;
    const leftCandidate = overflowForLeft(preferredLeft) <= overflowForLeft(alternateLeft) ? preferredLeft : alternateLeft;
    const clampedLeft = Math.min(
      Math.max(leftCandidate, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin
      )
    );
    const nextStyle = {
      top: `${clampedTop}px`,
      left: `${clampedLeft}px`,
      maxWidth: `${maxAllowedWidth}px`,
      zIndex
    };
    if (typeof width === "number") {
      nextStyle.width = computedWidth;
    } else if (width === "trigger") {
      nextStyle.minWidth = computedWidth;
    }
    setComputedMaxHeight(nextMaxHeight);
    setStyle((prev) => {
      const prevTop = typeof prev?.top === "string" ? prev.top : "";
      const prevLeft = typeof prev?.left === "string" ? prev.left : "";
      const prevWidth = typeof prev?.width === "number" ? prev.width : void 0;
      const prevMinWidth = typeof prev?.minWidth === "number" ? prev.minWidth : void 0;
      const prevMaxWidth = typeof prev?.maxWidth === "string" ? prev.maxWidth : "";
      const prevZIndex = typeof prev?.zIndex === "number" ? prev.zIndex : void 0;
      if (prevTop === nextStyle.top && prevLeft === nextStyle.left && prevWidth === nextStyle.width && prevMinWidth === nextStyle.minWidth && prevMaxWidth === nextStyle.maxWidth && prevZIndex === nextStyle.zIndex) {
        return prev;
      }
      return nextStyle;
    });
  }, [align, anchorRef, maxHeight, open, side, width]);
  useLayoutEffect2(() => {
    updatePosition();
  }, [updatePosition]);
  useEffect2(() => {
    if (!open) return;
    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };
    const handleResize = () => scheduleUpdate();
    const handleScroll = () => scheduleUpdate();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => scheduleUpdate()) : void 0;
    if (resizeObserver) {
      if (anchorRef.current) resizeObserver.observe(anchorRef.current);
      if (menuRef.current) resizeObserver.observe(menuRef.current);
    }
    scheduleUpdate();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
      resizeObserver?.disconnect();
    };
  }, [anchorRef, open, updatePosition]);
  if (!open || !PORTAL_ROOT) {
    return null;
  }
  const resolvedStyle = style ?? { visibility: "hidden" };
  return createPortal3(
    /* @__PURE__ */ jsx159(
      "div",
      {
        ref: menuRef,
        style: resolvedStyle,
        role: "menu",
        className: classNames15(
          "fixed min-w-[10rem] overflow-hidden rounded-lg border border-neutral-200 bg-white/95 p-1 text-sm shadow-xl ring-1 ring-black/5 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/95",
          !style && "invisible opacity-0",
          className
        ),
        children: /* @__PURE__ */ jsx159(
          "ul",
          {
            className: "overflow-auto",
            style: { maxHeight: computedMaxHeight },
            onClick: (event) => event.stopPropagation(),
            children: items.map((item) => /* @__PURE__ */ jsx159("li", { children: /* @__PURE__ */ jsxs61(
              "button",
              {
                type: "button",
                role: "menuitem",
                disabled: item.disabled,
                onClick: (event) => {
                  event.stopPropagation();
                  handleSelect(item);
                },
                className: classNames15(
                  "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
                  item.disabled ? "cursor-not-allowed opacity-50" : item.danger ? "text-rose-600 hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/10" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  itemClassName
                ),
                children: [
                  item.icon && /* @__PURE__ */ jsx159("span", { className: "mt-0.5 flex h-4 w-4 items-center justify-center text-neutral-400 dark:text-neutral-300", children: typeof item.icon === "string" ? renderIcon2(item.icon, "sm") : item.icon }),
                  /* @__PURE__ */ jsxs61("span", { className: "flex min-w-0 flex-1 flex-col", children: [
                    /* @__PURE__ */ jsx159("span", { className: "truncate font-medium text-neutral-900 dark:text-neutral-100", children: item.label }),
                    item.description && /* @__PURE__ */ jsx159("span", { className: "text-xs text-neutral-500 dark:text-neutral-400", children: item.description })
                  ] })
                ]
              }
            ) }, item.value))
          }
        )
      }
    ),
    PORTAL_ROOT
  );
};
DropdownMenu.displayName = "DropdownMenu";
var DropdownMenu_default = DropdownMenu;

// src/components/DropdownButton.tsx
import { jsx as jsx160, jsxs as jsxs62 } from "react/jsx-runtime";
var DropdownButton = ({
  label,
  options,
  onPrimaryClick,
  onOptionSelect,
  dropdownIcon = "ArrowDown",
  variant = "solid",
  color = "blue",
  size = "md",
  className,
  disabled,
  fullWidth = false,
  split = true,
  hideDropdownTriggerWhenEmpty = true,
  menuWidth = 220,
  menuClassName,
  ...buttonProps
}) => {
  const [open, setOpen] = useState4(false);
  const caretRef = useRef4(null);
  const anchorRef = useRef4(null);
  const containerClasses = classNames16(
    "inline-flex items-stretch",
    fullWidth && "w-full",
    className
  );
  const handleSelect = (option) => {
    onOptionSelect?.(option);
    setOpen(false);
  };
  const { onClick: restOnClick, ...restButtonProps } = buttonProps;
  const handlePrimaryClick = (event) => {
    restOnClick?.(event);
    onPrimaryClick?.(event);
  };
  const handleCaretToggle = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((prev) => !prev);
  };
  const menuOptions = useMemo3(() => options ?? [], [options]);
  const hasOptions = menuOptions.length > 0;
  const showCaret = hasOptions || !hideDropdownTriggerWhenEmpty;
  useEffect3(() => {
    if (!hasOptions && open) {
      setOpen(false);
    }
  }, [hasOptions, open]);
  const caretWidthMap = {
    xs: "min-w-[2rem]",
    sm: "min-w-[2.25rem]",
    md: "min-w-[2.5rem]",
    lg: "min-w-[2.75rem]",
    xl: "min-w-[3rem]"
  };
  const caretIconClassMap = {
    xs: "[&>svg]:h-3 [&>svg]:w-3 [&>svg]:min-w-[0.75rem]",
    sm: "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:min-w-[0.875rem]",
    md: "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:min-w-4",
    lg: "[&>svg]:h-4.5 [&>svg]:w-4.5 [&>svg]:min-w-[1.125rem]",
    xl: "[&>svg]:h-5 [&>svg]:w-5 [&>svg]:min-w-[1.25rem]"
  };
  const renderCaretButton = () => /* @__PURE__ */ jsx160(
    Button_default,
    {
      ref: caretRef,
      type: "button",
      variant,
      color,
      size,
      iconOnly: true,
      "aria-label": "Toggle dropdown menu",
      leadingIcon: dropdownIcon,
      "data-dropdown-caret": true,
      className: classNames16(
        "rounded-l-none border-l border-white/20 text-inherit dark:border-white/10",
        split && caretWidthMap[size],
        caretIconClassMap[size]
      ),
      onClick: handleCaretToggle,
      disabled: disabled || options.length === 0
    }
  );
  const mainButton = /* @__PURE__ */ jsx160(
    Button_default,
    {
      type: "button",
      variant,
      color,
      size,
      className: classNames16(
        split && showCaret && "rounded-r-none",
        fullWidth ? "flex-1" : ""
      ),
      disabled,
      onClick: handlePrimaryClick,
      ...restButtonProps,
      children: label
    }
  );
  return /* @__PURE__ */ jsxs62("div", { ref: anchorRef, className: containerClasses, children: [
    mainButton,
    showCaret ? renderCaretButton() : null,
    /* @__PURE__ */ jsx160(
      DropdownMenu_default,
      {
        anchorRef,
        open: open && hasOptions && showCaret,
        onClose: () => setOpen(false),
        items: menuOptions,
        onSelect: handleSelect,
        width: menuWidth,
        align: "end",
        side: "auto",
        className: menuClassName
      }
    )
  ] });
};
DropdownButton.displayName = "DropdownButton";

// src/components/Tooltip.tsx
import { useRef as useRef5, useState as useState5 } from "react";
import { createPortal as createPortal4 } from "react-dom";
import classNames17 from "classnames";
import { Fragment as Fragment4, jsx as jsx161, jsxs as jsxs63 } from "react/jsx-runtime";

// src/components/Input.tsx
import classNames18 from "classnames";
import React16, {
  forwardRef as forwardRef144
} from "react";
import { jsx as jsx162, jsxs as jsxs64 } from "react/jsx-runtime";
var sizeStyles3 = {
  sm: {
    input: "px-3 py-1.5 text-sm",
    leadingPadding: "pl-8",
    trailingPadding: "pr-8",
    iconSize: "h-3.5 w-3.5",
    iconLeft: "left-2.5",
    iconRight: "right-2.5"
  },
  md: {
    input: "px-3.5 py-2.5 text-sm",
    leadingPadding: "pl-10",
    trailingPadding: "pr-10",
    iconSize: "h-4 w-4",
    iconLeft: "left-3.5",
    iconRight: "right-3.5"
  },
  lg: {
    input: "px-4 py-3 text-base",
    leadingPadding: "pl-11",
    trailingPadding: "pr-11",
    iconSize: "h-5 w-5",
    iconLeft: "left-4",
    iconRight: "right-4"
  }
};
var toneTokens = {
  parallels: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  },
  brand: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  },
  theme: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  },
  red: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  },
  orange: {
    focusRing: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/60",
    focusBorder: "focus:border-orange-500",
    icon: "text-orange-500 dark:text-orange-300"
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    focusBorder: "focus:border-amber-500",
    icon: "text-amber-500 dark:text-amber-300"
  },
  yellow: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    focusBorder: "focus:border-yellow-500",
    icon: "text-yellow-500 dark:text-yellow-300"
  },
  lime: {
    focusRing: "focus:border-lime-400 focus:ring-2 focus:ring-lime-400/60",
    focusBorder: "focus:border-lime-500",
    icon: "text-lime-500 dark:text-lime-300"
  },
  green: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  emerald: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  teal: {
    focusRing: "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/60",
    focusBorder: "focus:border-teal-500",
    icon: "text-teal-500 dark:text-teal-300"
  },
  cyan: {
    focusRing: "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/60",
    focusBorder: "focus:border-cyan-500",
    icon: "text-cyan-500 dark:text-cyan-300"
  },
  sky: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    focusBorder: "focus:border-sky-500",
    icon: "text-sky-500 dark:text-sky-300"
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    focusBorder: "focus:border-blue-500",
    icon: "text-blue-500 dark:text-blue-300"
  },
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    focusBorder: "focus:border-indigo-500",
    icon: "text-indigo-500 dark:text-indigo-300"
  },
  violet: {
    focusRing: "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/60",
    focusBorder: "focus:border-violet-500",
    icon: "text-violet-500 dark:text-violet-300"
  },
  purple: {
    focusRing: "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/60",
    focusBorder: "focus:border-purple-500",
    icon: "text-purple-500 dark:text-purple-300"
  },
  fuchsia: {
    focusRing: "focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/60",
    focusBorder: "focus:border-fuchsia-500",
    icon: "text-fuchsia-500 dark:text-fuchsia-300"
  },
  pink: {
    focusRing: "focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60",
    focusBorder: "focus:border-pink-500",
    icon: "text-pink-500 dark:text-pink-300"
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    focusBorder: "focus:border-slate-600",
    icon: "text-slate-500 dark:text-slate-200"
  },
  gray: {
    focusRing: "focus:border-gray-400 focus:ring-2 focus:ring-gray-400/60",
    focusBorder: "focus:border-gray-500",
    icon: "text-gray-500 dark:text-gray-300"
  },
  zinc: {
    focusRing: "focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/60",
    focusBorder: "focus:border-zinc-500",
    icon: "text-zinc-500 dark:text-zinc-300"
  },
  neutral: {
    focusRing: "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/60 dark:focus:border-neutral-500 dark:focus:ring-neutral-500/60",
    focusBorder: "focus:border-neutral-600 dark:focus:border-neutral-400",
    icon: "text-neutral-500 dark:text-neutral-300"
  },
  stone: {
    focusRing: "focus:border-stone-400 focus:ring-2 focus:ring-stone-400/60",
    focusBorder: "focus:border-stone-500",
    icon: "text-stone-500 dark:text-stone-300"
  },
  white: {
    focusRing: "focus:border-slate-400 focus:ring-2 focus:ring-slate-400/60",
    focusBorder: "focus:border-slate-500",
    icon: "text-slate-400 dark:text-slate-200"
  },
  info: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    focusBorder: "focus:border-sky-500",
    icon: "text-sky-500 dark:text-sky-300"
  },
  success: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    focusBorder: "focus:border-emerald-500",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  warning: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    focusBorder: "focus:border-yellow-500",
    icon: "text-yellow-500 dark:text-yellow-300"
  },
  danger: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    focusBorder: "focus:border-rose-500",
    icon: "text-rose-500 dark:text-rose-300"
  }
};
var statusClasses = {
  error: "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 placeholder:text-neutral-400 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 placeholder:text-neutral-400 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100"
};
var unstyledStatusClasses = {
  error: "text-neutral-900 dark:text-neutral-100",
  success: "text-neutral-900 dark:text-neutral-100"
};
var disabledClasses = "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";
var variantStyles = {
  flat: "rounded-lg border border-neutral-300 bg-white dark:border-neutral-700 dark:bg-neutral-900",
  elevated: "rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
  ghost: "rounded-lg border border-transparent bg-neutral-100/80 hover:border-neutral-300 hover:bg-white dark:bg-neutral-800/60 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
  underline: "rounded-none border-0 border-b border-neutral-300 bg-transparent px-0 transition-colors dark:border-neutral-600"
};
var Input = forwardRef144(function Input2({
  size = "md",
  tone = "blue",
  variant = "flat",
  validationStatus = "none",
  leadingIcon,
  trailingIcon,
  onTrailingIconClick,
  className,
  wrapperClassName,
  disabled,
  unstyled = false,
  fullHeight = false,
  ...rest
}, ref) {
  const renderIcon2 = useIconRenderer();
  const sizeToken = sizeStyles3[size] ?? sizeStyles3.md;
  const tokens = toneTokens[tone] ?? toneTokens.theme;
  const hasLeadingIcon = Boolean(leadingIcon);
  const hasTrailingIcon = Boolean(trailingIcon);
  const isUnstyled = unstyled;
  const renderVisual = (visual, iconClassName) => {
    if (!visual) {
      return null;
    }
    if (typeof visual === "string") {
      return renderIcon2(visual, void 0, iconClassName);
    }
    if (React16.isValidElement(visual)) {
      return React16.cloneElement(visual, {
        className: classNames18(iconClassName, visual.props.className)
      });
    }
    return /* @__PURE__ */ jsx162("span", { className: iconClassName, children: visual });
  };
  const baseInputClasses = classNames18(
    "block w-full text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
    sizeToken.input,
    !isUnstyled && variantStyles[variant],
    disabledClasses,
    hasLeadingIcon && sizeToken.leadingPadding,
    hasTrailingIcon && sizeToken.trailingPadding,
    className
  );
  const unstyledClasses = isUnstyled ? classNames18(
    "border-0 bg-transparent focus:border-transparent focus:ring-0 dark:bg-transparent",
    sizeToken.input,
    hasLeadingIcon && sizeToken.leadingPadding,
    hasTrailingIcon && sizeToken.trailingPadding
  ) : "";
  const statusClass = validationStatus !== "none" ? isUnstyled ? unstyledStatusClasses[validationStatus] : statusClasses[validationStatus] : void 0;
  const mergedInputClasses = classNames18(
    isUnstyled ? unstyledClasses : baseInputClasses,
    !isUnstyled && (variant === "underline" ? tokens.focusBorder : tokens.focusRing),
    fullHeight && "h-full"
  );
  const renderIconWrapper = (visual, position, onClick) => {
    if (!visual) {
      return null;
    }
    const positionClass = position === "left" ? sizeToken.iconLeft : sizeToken.iconRight;
    if (onClick) {
      return /* @__PURE__ */ jsx162(
        "button",
        {
          type: "button",
          tabIndex: -1,
          onClick,
          className: classNames18(
            "absolute flex items-center justify-center rounded",
            positionClass,
            sizeToken.iconSize,
            tokens.icon,
            validationStatus === "error" && "text-rose-500 dark:text-rose-400",
            validationStatus === "success" && "text-emerald-500 dark:text-emerald-400",
            "cursor-pointer p-0.5 transition-colors duration-150 hover:text-neutral-700 dark:hover:text-neutral-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
          ),
          children: renderVisual(visual, sizeToken.iconSize)
        }
      );
    }
    const iconClassName = classNames18(
      "pointer-events-none absolute flex items-center justify-center text-neutral-400 dark:text-neutral-500",
      positionClass,
      sizeToken.iconSize,
      tokens.icon,
      validationStatus === "error" && "text-rose-500 dark:text-rose-400",
      validationStatus === "success" && "text-emerald-500 dark:text-emerald-400"
    );
    return /* @__PURE__ */ jsx162("span", { className: iconClassName, children: renderVisual(visual, sizeToken.iconSize) });
  };
  return /* @__PURE__ */ jsxs64(
    "span",
    {
      className: classNames18(
        "relative flex w-full items-center",
        disabled && "opacity-70",
        fullHeight && "h-full",
        wrapperClassName
      ),
      children: [
        leadingIcon && renderIconWrapper(leadingIcon, "left"),
        /* @__PURE__ */ jsx162(
          "input",
          {
            ref,
            className: classNames18(mergedInputClasses, statusClass),
            disabled,
            "aria-invalid": validationStatus === "error" ? "true" : rest["aria-invalid"],
            ...rest
          }
        ),
        trailingIcon && renderIconWrapper(trailingIcon, "right", onTrailingIconClick)
      ]
    }
  );
});
Input.displayName = "Input";
Input.__UI_INPUT = true;
var Input_default = Input;

// src/components/PasswordInput.tsx
import { useState as useState6, forwardRef as forwardRef145 } from "react";
import { jsx as jsx163 } from "react/jsx-runtime";
var PasswordInput = forwardRef145(
  function PasswordInput2(props, ref) {
    const [showPassword, setShowPassword] = useState6(false);
    return /* @__PURE__ */ jsx163(
      Input_default,
      {
        ...props,
        ref,
        type: showPassword ? "text" : "password",
        trailingIcon: showPassword ? /* @__PURE__ */ jsx163(EyeClosed, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx163(EyeOpen, { className: "w-4 h-4" }),
        onTrailingIconClick: () => setShowPassword((v) => !v)
      }
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// src/components/Textarea.tsx
import classNames19 from "classnames";
import {
  forwardRef as forwardRef146,
  useMemo as useMemo4
} from "react";
import { jsx as jsx164 } from "react/jsx-runtime";
var sizeTokens3 = {
  sm: { padding: "px-3 py-2", text: "text-sm", minHeight: "min-h-[6rem]" },
  md: { padding: "px-3.5 py-2.5", text: "text-sm", minHeight: "min-h-[7rem]" },
  lg: { padding: "px-4 py-3", text: "text-base", minHeight: "min-h-[8rem]" }
};
var toneTokens2 = {
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  emerald: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  white: {
    focusRing: "focus:border-slate-400 focus:ring-2 focus:ring-slate-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  theme: {
    focusRing: "focus:border-neutral-400 focus:ring-2 focus:ring-neutral-400/60 dark:focus:border-neutral-500 dark:focus:ring-neutral-500/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  brand: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  success: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  warning: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  danger: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  info: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  },
  neutral: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    border: "border-neutral-300",
    darkBorder: "dark:border-neutral-700",
    background: "bg-white",
    darkBackground: "dark:bg-neutral-900"
  }
};
var statusClasses2 = {
  error: "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100"
};
var disabledClasses2 = "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";
var resizeClasses = {
  none: "resize-none",
  vertical: "resize-y",
  horizontal: "resize-x",
  both: "resize"
};
var Textarea = forwardRef146(
  function Textarea2({
    size = "md",
    tone = "theme",
    validationStatus = "none",
    className,
    resize = "vertical",
    disabled,
    ...rest
  }, ref) {
    const sizeToken = sizeTokens3[size] ?? sizeTokens3.md;
    const tokens = toneTokens2[tone] ?? toneTokens2.theme;
    const resizeClass = resizeClasses[resize] ?? resizeClasses.vertical;
    const classes = useMemo4(
      () => classNames19(
        "block w-full rounded-lg border bg-white text-sm text-neutral-900 placeholder:text-neutral-400 shadow-sm focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
        sizeToken.padding,
        sizeToken.text,
        sizeToken.minHeight,
        tokens.border,
        tokens.darkBorder,
        tokens.background,
        tokens.darkBackground,
        tokens.focusRing,
        disabledClasses2,
        resizeClass,
        validationStatus !== "none" ? statusClasses2[validationStatus] : null,
        className
      ),
      [
        className,
        resizeClass,
        sizeToken.minHeight,
        sizeToken.padding,
        sizeToken.text,
        tokens.background,
        tokens.border,
        tokens.darkBackground,
        tokens.darkBorder,
        tokens.focusRing,
        validationStatus
      ]
    );
    return /* @__PURE__ */ jsx164("textarea", { ref, className: classes, disabled, ...rest });
  }
);
Textarea.displayName = "Textarea";
Textarea.__UI_INPUT = true;

// src/components/Select.tsx
import classNames20 from "classnames";
import React17, {
  forwardRef as forwardRef147,
  useMemo as useMemo5
} from "react";
import { jsx as jsx165, jsxs as jsxs65 } from "react/jsx-runtime";
var sizeStyles4 = {
  sm: {
    select: "px-3 py-1.5 text-sm pr-9",
    iconSize: "h-4 w-4",
    iconRight: "right-3"
  },
  md: {
    select: "px-3.5 py-2.5 text-sm pr-10",
    iconSize: "h-5 w-5",
    iconRight: "right-3.5"
  },
  lg: {
    select: "px-4 py-3 text-base pr-11",
    iconSize: "h-5 w-5",
    iconRight: "right-4"
  }
};
var toneTokens3 = {
  parallels: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300"
  },
  theme: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300"
  },
  brand: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300"
  },
  red: {
    focusRing: "focus:border-red-400 focus:ring-2 focus:ring-red-400/60",
    icon: "text-red-500 dark:text-red-300"
  },
  orange: {
    focusRing: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/60",
    icon: "text-orange-500 dark:text-orange-300"
  },
  amber: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    icon: "text-amber-500 dark:text-amber-300"
  },
  yellow: {
    focusRing: "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/60",
    icon: "text-yellow-500 dark:text-yellow-300"
  },
  lime: {
    focusRing: "focus:border-lime-400 focus:ring-2 focus:ring-lime-400/60",
    icon: "text-lime-500 dark:text-lime-300"
  },
  green: {
    focusRing: "focus:border-green-400 focus:ring-2 focus:ring-green-400/60",
    icon: "text-green-500 dark:text-green-300"
  },
  emerald: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  teal: {
    focusRing: "focus:border-teal-400 focus:ring-2 focus:ring-teal-400/60",
    icon: "text-teal-500 dark:text-teal-300"
  },
  cyan: {
    focusRing: "focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/60",
    icon: "text-cyan-500 dark:text-cyan-300"
  },
  sky: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    icon: "text-sky-500 dark:text-sky-300"
  },
  blue: {
    focusRing: "focus:border-blue-400 focus:ring-2 focus:ring-blue-400/60",
    icon: "text-blue-500 dark:text-blue-300"
  },
  indigo: {
    focusRing: "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/60",
    icon: "text-indigo-500 dark:text-indigo-300"
  },
  violet: {
    focusRing: "focus:border-violet-400 focus:ring-2 focus:ring-violet-400/60",
    icon: "text-violet-500 dark:text-violet-300"
  },
  purple: {
    focusRing: "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/60",
    icon: "text-purple-500 dark:text-purple-300"
  },
  fuchsia: {
    focusRing: "focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/60",
    icon: "text-fuchsia-500 dark:text-fuchsia-300"
  },
  pink: {
    focusRing: "focus:border-pink-400 focus:ring-2 focus:ring-pink-400/60",
    icon: "text-pink-500 dark:text-pink-300"
  },
  rose: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    icon: "text-rose-500 dark:text-rose-300"
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/60",
    icon: "text-slate-500 dark:text-slate-200"
  },
  gray: {
    focusRing: "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200"
  },
  zinc: {
    focusRing: "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200"
  },
  neutral: {
    focusRing: "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200"
  },
  stone: {
    focusRing: "focus:border-neutral-500 focus:ring-2 focus:ring-neutral-500/60",
    icon: "text-neutral-500 dark:text-neutral-200"
  },
  white: {
    focusRing: "focus:border-slate-400 focus:ring-2 focus:ring-slate-400/60",
    icon: "text-slate-400 dark:text-slate-200"
  },
  success: {
    focusRing: "focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/60",
    icon: "text-emerald-500 dark:text-emerald-300"
  },
  warning: {
    focusRing: "focus:border-amber-400 focus:ring-2 focus:ring-amber-400/60",
    icon: "text-amber-500 dark:text-amber-300"
  },
  danger: {
    focusRing: "focus:border-rose-400 focus:ring-2 focus:ring-rose-400/60",
    icon: "text-rose-500 dark:text-rose-300"
  },
  info: {
    focusRing: "focus:border-sky-400 focus:ring-2 focus:ring-sky-400/60",
    icon: "text-sky-500 dark:text-sky-300"
  }
};
var statusClasses3 = {
  error: "border-rose-500 focus:border-rose-500 focus:ring-rose-500/60 text-neutral-900 dark:border-rose-400 dark:focus:border-rose-400 dark:focus:ring-rose-400/60 dark:text-neutral-100",
  success: "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/60 text-neutral-900 dark:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400/60 dark:text-neutral-100"
};
var disabledClasses3 = "disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:shadow-none dark:disabled:border-neutral-700 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-500";
var Select = forwardRef147(function Select2({
  size = "md",
  tone = "blue",
  validationStatus = "none",
  className,
  placeholder,
  leadingIcon,
  hideCaret = false,
  disabled,
  children,
  unstyled = false,
  multiple,
  ...rest
}, ref) {
  const renderIcon2 = useIconRenderer();
  const sizeToken = sizeStyles4[size] ?? sizeStyles4.md;
  const tokens = toneTokens3[tone] ?? toneTokens3.theme;
  const hasLeadingIcon = Boolean(leadingIcon);
  const showCaret = !hideCaret && !multiple;
  const renderVisual = (visual, iconClassName) => {
    if (!visual) {
      return null;
    }
    if (typeof visual === "string") {
      return renderIcon2(visual, void 0, iconClassName);
    }
    if (React17.isValidElement(visual)) {
      return React17.cloneElement(visual, {
        className: classNames20(iconClassName, visual.props.className)
      });
    }
    return /* @__PURE__ */ jsx165("span", { className: iconClassName, children: visual });
  };
  const baseClasses3 = classNames20(
    "block w-full appearance-none text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-500",
    multiple ? "py-2 pr-3" : sizeToken.select,
    !unstyled && "rounded-lg border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    disabledClasses3,
    className
  );
  const statusClass = validationStatus !== "none" && !unstyled ? statusClasses3[validationStatus] : void 0;
  const focusClass = !unstyled ? tokens.focusRing : "focus:ring-0 focus:border-transparent";
  const computed = classNames20(
    baseClasses3,
    focusClass,
    statusClass,
    multiple && "min-h-[3.25rem]"
  );
  const caret = useMemo5(
    () => showCaret ? /* @__PURE__ */ jsx165(
      "span",
      {
        className: classNames20(
          "pointer-events-none absolute inset-y-0 flex items-center",
          sizeToken.iconRight,
          tokens.icon
        ),
        children: renderIcon2("ArrowDown", void 0, sizeToken.iconSize)
      }
    ) : null,
    [
      showCaret,
      sizeToken.iconRight,
      sizeToken.iconSize,
      tokens.icon,
      renderIcon2
    ]
  );
  const leading = hasLeadingIcon ? /* @__PURE__ */ jsx165("span", { className: "pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400 dark:text-neutral-500", children: renderVisual(leadingIcon, sizeToken.iconSize) }) : null;
  return /* @__PURE__ */ jsxs65("span", { className: "relative flex w-full items-center", children: [
    leading,
    /* @__PURE__ */ jsxs65(
      "select",
      {
        ref,
        className: classNames20(
          computed,
          hasLeadingIcon && !multiple && "pl-9",
          showCaret && !multiple && "pr-10"
        ),
        disabled,
        "aria-invalid": validationStatus === "error" ? "true" : rest["aria-invalid"],
        ...rest,
        children: [
          placeholder !== void 0 && /* @__PURE__ */ jsx165("option", { value: "", disabled: true, hidden: true, children: placeholder }),
          children
        ]
      }
    ),
    caret
  ] });
});
Select.displayName = "Select";
Select.__UI_SELECT = true;

// src/components/Combobox.tsx
import { useState as useState7, useRef as useRef6, useEffect as useEffect4, useMemo as useMemo6 } from "react";
import classNames21 from "classnames";
import { jsx as jsx166, jsxs as jsxs66 } from "react/jsx-runtime";
var toneTokens4 = {
  parallels: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  },
  brand: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  },
  theme: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  },
  red: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  },
  orange: {
    focusRing: "focus:border-orange-500 focus:ring-orange-200 dark:focus:border-orange-400 dark:focus:ring-orange-900/40",
    optionHover: "hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-900/30 dark:hover:text-orange-300",
    optionSelected: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
  },
  amber: {
    focusRing: "focus:border-amber-500 focus:ring-amber-200 dark:focus:border-amber-400 dark:focus:ring-amber-900/40",
    optionHover: "hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-900/30 dark:hover:text-amber-300",
    optionSelected: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
  },
  yellow: {
    focusRing: "focus:border-yellow-500 focus:ring-yellow-200 dark:focus:border-yellow-400 dark:focus:ring-yellow-900/40",
    optionHover: "hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300",
    optionSelected: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
  },
  lime: {
    focusRing: "focus:border-lime-500 focus:ring-lime-200 dark:focus:border-lime-400 dark:focus:ring-lime-900/40",
    optionHover: "hover:bg-lime-50 hover:text-lime-700 dark:hover:bg-lime-900/30 dark:hover:text-lime-300",
    optionSelected: "bg-lime-50 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300"
  },
  green: {
    focusRing: "focus:border-emerald-500 focus:ring-emerald-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40",
    optionHover: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300",
    optionSelected: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
  },
  emerald: {
    focusRing: "focus:border-emerald-500 focus:ring-emerald-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40",
    optionHover: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300",
    optionSelected: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
  },
  teal: {
    focusRing: "focus:border-teal-500 focus:ring-teal-200 dark:focus:border-teal-400 dark:focus:ring-teal-900/40",
    optionHover: "hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-900/30 dark:hover:text-teal-300",
    optionSelected: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300"
  },
  cyan: {
    focusRing: "focus:border-cyan-500 focus:ring-cyan-200 dark:focus:border-cyan-400 dark:focus:ring-cyan-900/40",
    optionHover: "hover:bg-cyan-50 hover:text-cyan-700 dark:hover:bg-cyan-900/30 dark:hover:text-cyan-300",
    optionSelected: "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
  },
  sky: {
    focusRing: "focus:border-sky-500 focus:ring-sky-200 dark:focus:border-sky-400 dark:focus:ring-sky-900/40",
    optionHover: "hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900/30 dark:hover:text-sky-300",
    optionSelected: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
  },
  blue: {
    focusRing: "focus:border-blue-500 focus:ring-blue-200 dark:focus:border-blue-400 dark:focus:ring-blue-900/40",
    optionHover: "hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300",
    optionSelected: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
  },
  indigo: {
    focusRing: "focus:border-indigo-500 focus:ring-indigo-200 dark:focus:border-indigo-400 dark:focus:ring-indigo-900/40",
    optionHover: "hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-300",
    optionSelected: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
  },
  violet: {
    focusRing: "focus:border-violet-500 focus:ring-violet-200 dark:focus:border-violet-400 dark:focus:ring-violet-900/40",
    optionHover: "hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:hover:text-violet-300",
    optionSelected: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
  },
  purple: {
    focusRing: "focus:border-purple-500 focus:ring-purple-200 dark:focus:border-purple-400 dark:focus:ring-purple-900/40",
    optionHover: "hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-900/30 dark:hover:text-purple-300",
    optionSelected: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
  },
  fuchsia: {
    focusRing: "focus:border-fuchsia-500 focus:ring-fuchsia-200 dark:focus:border-fuchsia-400 dark:focus:ring-fuchsia-900/40",
    optionHover: "hover:bg-fuchsia-50 hover:text-fuchsia-700 dark:hover:bg-fuchsia-900/30 dark:hover:text-fuchsia-300",
    optionSelected: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300"
  },
  pink: {
    focusRing: "focus:border-pink-500 focus:ring-pink-200 dark:focus:border-pink-400 dark:focus:ring-pink-900/40",
    optionHover: "hover:bg-pink-50 hover:text-pink-700 dark:hover:bg-pink-900/30 dark:hover:text-pink-300",
    optionSelected: "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
  },
  rose: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  },
  slate: {
    focusRing: "focus:border-slate-500 focus:ring-slate-200 dark:focus:border-slate-400 dark:focus:ring-slate-900/40",
    optionHover: "hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-900/30 dark:hover:text-slate-300",
    optionSelected: "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
  },
  gray: {
    focusRing: "focus:border-gray-500 focus:ring-gray-200 dark:focus:border-gray-400 dark:focus:ring-gray-900/40",
    optionHover: "hover:bg-gray-50 hover:text-gray-700 dark:hover:bg-gray-900/30 dark:hover:text-gray-300",
    optionSelected: "bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
  },
  zinc: {
    focusRing: "focus:border-zinc-500 focus:ring-zinc-200 dark:focus:border-zinc-400 dark:focus:ring-zinc-900/40",
    optionHover: "hover:bg-zinc-50 hover:text-zinc-700 dark:hover:bg-zinc-900/30 dark:hover:text-zinc-300",
    optionSelected: "bg-zinc-50 text-zinc-700 dark:bg-zinc-900/30 dark:text-zinc-300"
  },
  neutral: {
    focusRing: "focus:border-neutral-500 focus:ring-neutral-200 dark:focus:border-neutral-400 dark:focus:ring-neutral-900/40",
    optionHover: "hover:bg-neutral-50 hover:text-neutral-700 dark:hover:bg-neutral-900/30 dark:hover:text-neutral-300",
    optionSelected: "bg-neutral-50 text-neutral-700 dark:bg-neutral-900/30 dark:text-neutral-300"
  },
  stone: {
    focusRing: "focus:border-stone-500 focus:ring-stone-200 dark:focus:border-stone-400 dark:focus:ring-stone-900/40",
    optionHover: "hover:bg-stone-50 hover:text-stone-700 dark:hover:bg-stone-900/30 dark:hover:text-stone-300",
    optionSelected: "bg-stone-50 text-stone-700 dark:bg-stone-900/30 dark:text-stone-300"
  },
  white: {
    focusRing: "focus:border-slate-500 focus:ring-slate-200 dark:focus:border-slate-400 dark:focus:ring-slate-900/40",
    optionHover: "hover:bg-slate-50 hover:text-slate-700 dark:hover:bg-slate-900/30 dark:hover:text-slate-300",
    optionSelected: "bg-slate-50 text-slate-700 dark:bg-slate-900/30 dark:text-slate-300"
  },
  info: {
    focusRing: "focus:border-sky-500 focus:ring-sky-200 dark:focus:border-sky-400 dark:focus:ring-sky-900/40",
    optionHover: "hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-900/30 dark:hover:text-sky-300",
    optionSelected: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300"
  },
  success: {
    focusRing: "focus:border-emerald-500 focus:ring-emerald-200 dark:focus:border-emerald-400 dark:focus:ring-emerald-900/40",
    optionHover: "hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-300",
    optionSelected: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
  },
  warning: {
    focusRing: "focus:border-yellow-500 focus:ring-yellow-200 dark:focus:border-yellow-400 dark:focus:ring-yellow-900/40",
    optionHover: "hover:bg-yellow-50 hover:text-yellow-700 dark:hover:bg-yellow-900/30 dark:hover:text-yellow-300",
    optionSelected: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
  },
  danger: {
    focusRing: "focus:border-rose-500 focus:ring-rose-200 dark:focus:border-rose-400 dark:focus:ring-rose-900/40",
    optionHover: "hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/30 dark:hover:text-rose-300",
    optionSelected: "bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
  }
};
var Combobox = ({
  value = "",
  onChange,
  options = [],
  placeholder,
  className,
  disabled = false,
  error = false,
  emptyMessage = "No matching options found. You can keep typing to create a custom one.",
  color = "blue"
}) => {
  const renderIcon2 = useIconRenderer();
  const [isOpen, setIsOpen] = useState7(false);
  const [filter, setFilter] = useState7("");
  const containerRef = useRef6(null);
  const inputRef = useRef6(null);
  const colorTokens2 = toneTokens4[color] ?? toneTokens4.theme;
  useEffect4(() => {
    setFilter(value);
  }, [value]);
  const filteredOptions = useMemo6(() => {
    if (!filter) return options;
    const lowerFilter = filter.toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(lowerFilter));
  }, [options, filter]);
  useEffect4(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setFilter(newValue);
    onChange(newValue);
    setIsOpen(true);
  };
  const handleOptionClick = (option) => {
    onChange(option);
    setFilter(option);
    setIsOpen(false);
  };
  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };
  return /* @__PURE__ */ jsxs66(
    "div",
    {
      ref: containerRef,
      className: classNames21("relative w-full", className),
      children: [
        /* @__PURE__ */ jsxs66("div", { className: "relative", children: [
          /* @__PURE__ */ jsx166(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: filter,
              onChange: handleInputChange,
              onFocus: handleInputFocus,
              placeholder,
              disabled,
              className: classNames21(
                "block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500",
                error ? "border-red-300 focus:border-red-500 focus:ring-red-200" : `border-gray-300 ${colorTokens2.focusRing}`
              )
            }
          ),
          /* @__PURE__ */ jsxs66("div", { className: "absolute inset-y-0 right-0 flex items-center pr-2", children: [
            filter && !disabled && /* @__PURE__ */ jsx166(
              IconButton_default,
              {
                icon: "Close",
                variant: "ghost",
                size: "sm",
                className: "text-gray-400 hover:text-gray-600",
                onClick: () => {
                  onChange("");
                  setFilter("");
                  inputRef.current?.focus();
                },
                "aria-label": "Clear"
              }
            ),
            /* @__PURE__ */ jsx166("div", { className: "pointer-events-none text-gray-400 pl-1", children: renderIcon2("ArrowDown", "sm", "h-4 w-4") })
          ] })
        ] }),
        isOpen && !disabled && /* @__PURE__ */ jsx166("div", { className: "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-neutral-800", children: filteredOptions.length > 0 ? filteredOptions.map((option, index) => /* @__PURE__ */ jsx166(
          "div",
          {
            onClick: () => handleOptionClick(option),
            className: classNames21(
              `cursor-pointer px-4 py-2 text-sm ${colorTokens2.optionHover}`,
              option === value ? `${colorTokens2.optionSelected} font-medium` : "text-gray-900 dark:text-gray-100"
            ),
            children: option
          },
          index
        )) : /* @__PURE__ */ jsx166("div", { className: "px-4 py-2 text-sm text-gray-500 italic dark:text-gray-400", children: emptyMessage }) })
      ]
    }
  );
};
Combobox.displayName = "Combobox";

// src/components/Picker.tsx
import {
  useCallback as useCallback3,
  useEffect as useEffect5,
  useLayoutEffect as useLayoutEffect3,
  useMemo as useMemo7,
  useRef as useRef7,
  useState as useState8
} from "react";
import { createPortal as createPortal5 } from "react-dom";
import classNames22 from "classnames";
import { Fragment as Fragment5, jsx as jsx167, jsxs as jsxs67 } from "react/jsx-runtime";
var toneTokens5 = {
  parallels: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  },
  brand: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  },
  theme: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  },
  red: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  },
  orange: {
    triggerOpen: "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-400",
    filterActive: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    optionSelectedBg: "bg-orange-50 dark:bg-orange-900/20",
    optionSelectedText: "text-orange-700 dark:text-orange-300",
    optionSelectedIcon: "text-orange-500 dark:text-orange-400"
  },
  amber: {
    triggerOpen: "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400",
    filterActive: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    optionSelectedBg: "bg-amber-50 dark:bg-amber-900/20",
    optionSelectedText: "text-amber-700 dark:text-amber-300",
    optionSelectedIcon: "text-amber-500 dark:text-amber-400"
  },
  yellow: {
    triggerOpen: "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    filterActive: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400"
  },
  lime: {
    triggerOpen: "border-lime-500 ring-2 ring-lime-500/20 dark:border-lime-400",
    filterActive: "bg-lime-100 text-lime-600 dark:bg-lime-900/40 dark:text-lime-400",
    optionSelectedBg: "bg-lime-50 dark:bg-lime-900/20",
    optionSelectedText: "text-lime-700 dark:text-lime-300",
    optionSelectedIcon: "text-lime-500 dark:text-lime-400"
  },
  green: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    filterActive: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400"
  },
  emerald: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    filterActive: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400"
  },
  teal: {
    triggerOpen: "border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-400",
    filterActive: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
    optionSelectedBg: "bg-teal-50 dark:bg-teal-900/20",
    optionSelectedText: "text-teal-700 dark:text-teal-300",
    optionSelectedIcon: "text-teal-500 dark:text-teal-400"
  },
  cyan: {
    triggerOpen: "border-cyan-500 ring-2 ring-cyan-500/20 dark:border-cyan-400",
    filterActive: "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-400",
    optionSelectedBg: "bg-cyan-50 dark:bg-cyan-900/20",
    optionSelectedText: "text-cyan-700 dark:text-cyan-300",
    optionSelectedIcon: "text-cyan-500 dark:text-cyan-400"
  },
  sky: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    filterActive: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400"
  },
  blue: {
    triggerOpen: "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400",
    filterActive: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    optionSelectedBg: "bg-blue-50 dark:bg-blue-900/20",
    optionSelectedText: "text-blue-700 dark:text-blue-300",
    optionSelectedIcon: "text-blue-500 dark:text-blue-400"
  },
  indigo: {
    triggerOpen: "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400",
    filterActive: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    optionSelectedBg: "bg-indigo-50 dark:bg-indigo-900/20",
    optionSelectedText: "text-indigo-700 dark:text-indigo-300",
    optionSelectedIcon: "text-indigo-500 dark:text-indigo-400"
  },
  violet: {
    triggerOpen: "border-violet-500 ring-2 ring-violet-500/20 dark:border-violet-400",
    filterActive: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
    optionSelectedBg: "bg-violet-50 dark:bg-violet-900/20",
    optionSelectedText: "text-violet-700 dark:text-violet-300",
    optionSelectedIcon: "text-violet-500 dark:text-violet-400"
  },
  purple: {
    triggerOpen: "border-purple-500 ring-2 ring-purple-500/20 dark:border-purple-400",
    filterActive: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    optionSelectedBg: "bg-purple-50 dark:bg-purple-900/20",
    optionSelectedText: "text-purple-700 dark:text-purple-300",
    optionSelectedIcon: "text-purple-500 dark:text-purple-400"
  },
  fuchsia: {
    triggerOpen: "border-fuchsia-500 ring-2 ring-fuchsia-500/20 dark:border-fuchsia-400",
    filterActive: "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400",
    optionSelectedBg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    optionSelectedText: "text-fuchsia-700 dark:text-fuchsia-300",
    optionSelectedIcon: "text-fuchsia-500 dark:text-fuchsia-400"
  },
  pink: {
    triggerOpen: "border-pink-500 ring-2 ring-pink-500/20 dark:border-pink-400",
    filterActive: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
    optionSelectedBg: "bg-pink-50 dark:bg-pink-900/20",
    optionSelectedText: "text-pink-700 dark:text-pink-300",
    optionSelectedIcon: "text-pink-500 dark:text-pink-400"
  },
  rose: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  },
  slate: {
    triggerOpen: "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    filterActive: "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400"
  },
  gray: {
    triggerOpen: "border-gray-500 ring-2 ring-gray-500/20 dark:border-gray-400",
    filterActive: "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400",
    optionSelectedBg: "bg-gray-50 dark:bg-gray-900/20",
    optionSelectedText: "text-gray-700 dark:text-gray-300",
    optionSelectedIcon: "text-gray-500 dark:text-gray-400"
  },
  zinc: {
    triggerOpen: "border-zinc-500 ring-2 ring-zinc-500/20 dark:border-zinc-400",
    filterActive: "bg-zinc-100 text-zinc-600 dark:bg-zinc-900/40 dark:text-zinc-400",
    optionSelectedBg: "bg-zinc-50 dark:bg-zinc-900/20",
    optionSelectedText: "text-zinc-700 dark:text-zinc-300",
    optionSelectedIcon: "text-zinc-500 dark:text-zinc-400"
  },
  neutral: {
    triggerOpen: "border-neutral-500 ring-2 ring-neutral-500/20 dark:border-neutral-400",
    filterActive: "bg-neutral-100 text-neutral-600 dark:bg-neutral-900/40 dark:text-neutral-400",
    optionSelectedBg: "bg-neutral-50 dark:bg-neutral-900/20",
    optionSelectedText: "text-neutral-700 dark:text-neutral-300",
    optionSelectedIcon: "text-neutral-500 dark:text-neutral-400"
  },
  stone: {
    triggerOpen: "border-stone-500 ring-2 ring-stone-500/20 dark:border-stone-400",
    filterActive: "bg-stone-100 text-stone-600 dark:bg-stone-900/40 dark:text-stone-400",
    optionSelectedBg: "bg-stone-50 dark:bg-stone-900/20",
    optionSelectedText: "text-stone-700 dark:text-stone-300",
    optionSelectedIcon: "text-stone-500 dark:text-stone-400"
  },
  white: {
    triggerOpen: "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    filterActive: "bg-slate-100 text-slate-600 dark:bg-slate-900/40 dark:text-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400"
  },
  info: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    filterActive: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400"
  },
  success: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    filterActive: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400"
  },
  warning: {
    triggerOpen: "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    filterActive: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400"
  },
  danger: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    filterActive: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400"
  }
};
var viewportBounds2 = () => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight
});
var isClippingParent2 = (el) => /(auto|scroll|hidden|clip)/.test(
  [
    getComputedStyle(el).overflow,
    getComputedStyle(el).overflowX,
    getComputedStyle(el).overflowY
  ].join(" ")
);
var resolveBoundaryBounds2 = (anchor) => {
  let node = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent2(node)) {
      const r = node.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height
      };
    }
    node = node.parentElement;
  }
  return viewportBounds2();
};
var resolveZIndex = (anchor) => {
  let node = anchor;
  let highest = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n))
        highest = highest === null ? n : Math.max(highest, n);
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};
var PORTAL_ROOT2 = typeof document !== "undefined" ? document.body : null;
var MAX_DROPDOWN_HEIGHT = 280;
var Picker = ({
  items,
  loading = false,
  selectedId,
  onSelect,
  placeholder = "Select an item\u2026",
  searchPlaceholder,
  emptyMessage = "No items found.",
  loadingMessage = "Loading\u2026",
  defaultFilter,
  escapeBoundary = false,
  className,
  color = "blue",
  multi = false,
  selectedIds: selectedIdsProp,
  onMultiChange,
  maxPillsShown = 3,
  size = "md",
  fullWidth = true,
  fullHeight = false
}) => {
  const triggerRef = useRef7(null);
  const dropdownRef = useRef7(null);
  const searchRef = useRef7(null);
  const [open, setOpen] = useState8(false);
  const [query, setQuery] = useState8("");
  const [filterActive, setFilterActive] = useState8(true);
  const [style, setStyle] = useState8();
  const [computedMaxHeight, setComputedMaxHeight] = useState8(MAX_DROPDOWN_HEIGHT);
  const colorTokens2 = toneTokens5[color] ?? toneTokens5.theme;
  const effectiveSelectedIds = useMemo7(
    () => multi ? selectedIdsProp ?? [] : selectedId ? [selectedId] : [],
    [multi, selectedIdsProp, selectedId]
  );
  const selectedItem = useMemo7(
    () => items.find((o) => o.id === selectedId),
    [items, selectedId]
  );
  const baseItems = useMemo7(
    () => filterActive && defaultFilter ? items.filter(defaultFilter.predicate) : items,
    [items, filterActive, defaultFilter]
  );
  const filtered = useMemo7(() => {
    const q = query.trim().toLowerCase();
    if (!q) return baseItems;
    return baseItems.filter(
      (item) => item.title.toLowerCase().includes(q) || (item.subtitle ?? "").toLowerCase().includes(q) || (item.description ?? "").toLowerCase().includes(q) || (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q))
    );
  }, [baseItems, query]);
  const updatePosition = useCallback3(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;
    const anchorRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    const boundary = escapeBoundary ? viewportBounds2() : resolveBoundaryBounds2(triggerRef.current);
    const zIndex = resolveZIndex(triggerRef.current);
    const offset = 4;
    const minMargin = 8;
    const computedWidth = Math.min(
      Math.max(anchorRect.width, menuRect.width),
      boundary.width - minMargin * 2
    );
    const computedHeight = menuRect.height;
    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;
    const overflowFor = (top) => Math.max(0, boundary.top + minMargin - top) + Math.max(0, top + computedHeight - (boundary.bottom - minMargin));
    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, boundary.top + minMargin),
      Math.max(
        boundary.top + minMargin,
        boundary.bottom - computedHeight - minMargin
      )
    );
    const availableSpace = isTopSide ? Math.max(120, anchorRect.top - offset - (boundary.top + minMargin)) : Math.max(120, boundary.bottom - minMargin - belowTop);
    const nextMaxHeight = Math.min(MAX_DROPDOWN_HEIGHT, availableSpace);
    const startLeft = anchorRect.left;
    const clampedLeft = Math.min(
      Math.max(startLeft, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin
      )
    );
    setComputedMaxHeight(Math.max(120, nextMaxHeight));
    setStyle({
      position: "fixed",
      top: clampedTop,
      left: clampedLeft,
      width: computedWidth,
      zIndex
    });
  }, [open]);
  useLayoutEffect3(() => {
    updatePosition();
  }, [updatePosition]);
  useEffect5(() => {
    if (!open) {
      setStyle(void 0);
      return;
    }
    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : void 0;
    if (ro) {
      if (triggerRef.current) ro.observe(triggerRef.current);
      if (dropdownRef.current) ro.observe(dropdownRef.current);
    }
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    };
  }, [open, updatePosition]);
  useEffect5(() => {
    if (!open) return;
    const handlePointer = (e) => {
      if (dropdownRef.current?.contains(e.target) || triggerRef.current?.contains(e.target))
        return;
      setOpen(false);
      setQuery("");
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);
  useEffect5(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);
  const handleSelect = (item) => {
    if (multi) {
      const next = effectiveSelectedIds.includes(item.id) ? effectiveSelectedIds.filter((id) => id !== item.id) : [...effectiveSelectedIds, item.id];
      onMultiChange?.(next);
    } else {
      onSelect?.(item);
      setOpen(false);
      setQuery("");
    }
  };
  const handleClearMulti = () => {
    onMultiChange?.([]);
  };
  const resolvedSearchPlaceholder = searchPlaceholder ?? (defaultFilter ? filterActive ? `Search ${defaultFilter.label.toLowerCase()} items\u2026` : "Search all items\u2026" : "Search\u2026");
  const dropdown = open && PORTAL_ROOT2 ? createPortal5(
    /* @__PURE__ */ jsxs67(
      "div",
      {
        ref: dropdownRef,
        style: style ?? { visibility: "hidden" },
        className: classNames22(
          "fixed overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900",
          !style && "invisible opacity-0"
        ),
        children: [
          /* @__PURE__ */ jsxs67("div", { className: "flex items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsxs67(
              "svg",
              {
                className: "h-4 w-4 shrink-0 text-neutral-400",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 2,
                children: [
                  /* @__PURE__ */ jsx167("circle", { cx: "11", cy: "11", r: "8" }),
                  /* @__PURE__ */ jsx167("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
                ]
              }
            ),
            /* @__PURE__ */ jsx167(
              "input",
              {
                ref: searchRef,
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                onKeyDown: (e) => e.key === "Escape" && (setOpen(false), setQuery("")),
                placeholder: resolvedSearchPlaceholder,
                className: "min-w-0 flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
              }
            ),
            query && /* @__PURE__ */ jsx167(
              "button",
              {
                type: "button",
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => setQuery(""),
                className: "shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
                children: /* @__PURE__ */ jsx167(
                  "svg",
                  {
                    className: "h-3.5 w-3.5",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /* @__PURE__ */ jsx167("path", { strokeLinecap: "round", d: "M18 6 6 18M6 6l12 12" })
                  }
                )
              }
            ),
            defaultFilter && /* @__PURE__ */ jsx167(
              "button",
              {
                type: "button",
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => setFilterActive((v) => !v),
                className: classNames22(
                  "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
                  filterActive ? colorTokens2.filterActive : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400"
                ),
                children: filterActive ? defaultFilter.label : "All"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs67(
            "ul",
            {
              className: "divide-y divide-neutral-50 overflow-y-auto dark:divide-neutral-800/60",
              style: { maxHeight: computedMaxHeight },
              children: [
                multi && effectiveSelectedIds.length > 0 && /* @__PURE__ */ jsxs67(
                  "li",
                  {
                    onMouseDown: (e) => e.preventDefault(),
                    onClick: handleClearMulti,
                    className: "flex cursor-pointer select-none items-center justify-between px-4 py-1.5 text-xs text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800",
                    children: [
                      /* @__PURE__ */ jsxs67("span", { children: [
                        effectiveSelectedIds.length,
                        " selected"
                      ] }),
                      /* @__PURE__ */ jsx167("span", { className: "text-rose-500 dark:text-rose-400 hover:underline", children: "Clear" })
                    ]
                  }
                ),
                filtered.length === 0 ? /* @__PURE__ */ jsx167("li", { className: "px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500", children: baseItems.length === 0 ? emptyMessage : "No items match your search." }) : filtered.map((item) => {
                  const isSelected = effectiveSelectedIds.includes(item.id);
                  return /* @__PURE__ */ jsxs67(
                    "li",
                    {
                      onMouseDown: (e) => e.preventDefault(),
                      onClick: () => handleSelect(item),
                      className: classNames22(
                        "flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors",
                        isSelected ? colorTokens2.optionSelectedBg : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      ),
                      children: [
                        multi ? /* @__PURE__ */ jsx167(
                          "span",
                          {
                            className: classNames22(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                              isSelected ? classNames22(
                                colorTokens2.optionSelectedBg,
                                "border-current",
                                colorTokens2.optionSelectedIcon
                              ) : "border-neutral-300 dark:border-neutral-600"
                            ),
                            children: isSelected && /* @__PURE__ */ jsx167(
                              "svg",
                              {
                                className: classNames22(
                                  "h-3.5 w-3.5",
                                  colorTokens2.optionSelectedIcon
                                ),
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: 2.5,
                                children: /* @__PURE__ */ jsx167(
                                  "path",
                                  {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    d: "m5 13 4 4L19 7"
                                  }
                                )
                              }
                            )
                          }
                        ) : isSelected ? /* @__PURE__ */ jsx167("span", { className: "flex h-4 w-4 shrink-0 items-center justify-center", children: /* @__PURE__ */ jsx167(
                          "svg",
                          {
                            className: classNames22(
                              "h-3.5 w-3.5",
                              colorTokens2.optionSelectedIcon
                            ),
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: 2.5,
                            children: /* @__PURE__ */ jsx167(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "m5 13 4 4L19 7"
                              }
                            )
                          }
                        ) }) : null,
                        item.icon && /* @__PURE__ */ jsx167(
                          "span",
                          {
                            className: classNames22(
                              "shrink-0",
                              isSelected ? colorTokens2.optionSelectedIcon : "text-neutral-400 dark:text-neutral-500"
                            ),
                            children: item.icon
                          }
                        ),
                        /* @__PURE__ */ jsxs67("div", { className: "min-w-0 flex-1", children: [
                          /* @__PURE__ */ jsx167(
                            "p",
                            {
                              className: classNames22(
                                "truncate text-sm font-medium",
                                isSelected ? colorTokens2.optionSelectedText : "text-neutral-800 dark:text-neutral-200"
                              ),
                              children: item.title
                            }
                          ),
                          item.subtitle && /* @__PURE__ */ jsx167("p", { className: "truncate text-xs text-neutral-400 dark:text-neutral-500", children: item.subtitle }),
                          item.description && /* @__PURE__ */ jsx167("p", { className: "truncate text-xs text-neutral-400 dark:text-neutral-500 mt-0.5", children: item.description })
                        ] }),
                        item.tags && item.tags.length > 0 && /* @__PURE__ */ jsx167("div", { className: "flex shrink-0 flex-wrap gap-1", children: item.tags.map((tag, ti) => /* @__PURE__ */ jsx167(
                          Pill_default,
                          {
                            size: "sm",
                            tone: tag.tone ?? "neutral",
                            variant: "soft",
                            children: tag.label
                          },
                          ti
                        )) })
                      ]
                    },
                    item.id
                  );
                })
              ]
            }
          )
        ]
      }
    ),
    PORTAL_ROOT2
  ) : null;
  const sm = size === "sm";
  const triggerPadding = sm ? "px-2 py-1" : "px-3 py-2.5";
  const triggerText = sm ? "text-xs" : "text-sm";
  const triggerGap = sm ? "gap-1.5" : "gap-3";
  const triggerRadius = "rounded-lg";
  const chevronSize = sm ? "h-3 w-3" : "h-4 w-4";
  const multiTriggerContent = multi ? (() => {
    if (effectiveSelectedIds.length === 0) {
      return /* @__PURE__ */ jsx167(
        "span",
        {
          className: classNames22(
            "flex-1",
            triggerText,
            "text-neutral-400 dark:text-neutral-500"
          ),
          children: placeholder
        }
      );
    }
    const visibleIds = effectiveSelectedIds.slice(0, maxPillsShown);
    const overflow = effectiveSelectedIds.length - visibleIds.length;
    return /* @__PURE__ */ jsxs67("div", { className: "flex flex-1 min-w-0 flex-wrap gap-1", children: [
      visibleIds.map((id) => {
        const it = items.find((o) => o.id === id);
        if (!it) return null;
        return /* @__PURE__ */ jsx167(
          "span",
          {
            className: classNames22(
              "inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none",
              sm ? "text-[10px]" : "text-xs",
              colorTokens2.filterActive
            ),
            children: it.title
          },
          id
        );
      }),
      overflow > 0 && /* @__PURE__ */ jsxs67(
        "span",
        {
          className: classNames22(
            "inline-flex items-center rounded px-1.5 py-0.5 font-medium leading-none",
            sm ? "text-[10px]" : "text-xs",
            "bg-neutral-100 text-neutral-500 dark:bg-neutral-700/50 dark:text-neutral-400"
          ),
          children: [
            "+",
            overflow
          ]
        }
      )
    ] });
  })() : null;
  return /* @__PURE__ */ jsxs67(
    "div",
    {
      className: classNames22(
        fullWidth ? "w-full" : "w-fit",
        fullHeight && "h-full"
      ),
      children: [
        /* @__PURE__ */ jsxs67(
          "button",
          {
            ref: triggerRef,
            type: "button",
            onClick: () => setOpen((prev) => !prev),
            className: classNames22(
              "flex w-full items-center border text-left transition-colors bg-white dark:bg-neutral-900",
              fullHeight && "h-full",
              triggerPadding,
              triggerText,
              triggerGap,
              triggerRadius,
              open ? colorTokens2.triggerOpen : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
              className
            ),
            children: [
              loading ? /* @__PURE__ */ jsxs67(Fragment5, { children: [
                /* @__PURE__ */ jsxs67(
                  "svg",
                  {
                    className: "h-4 w-4 animate-spin shrink-0 text-neutral-400",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    children: [
                      /* @__PURE__ */ jsx167(
                        "circle",
                        {
                          className: "opacity-25",
                          cx: "12",
                          cy: "12",
                          r: "10",
                          stroke: "currentColor",
                          strokeWidth: "4"
                        }
                      ),
                      /* @__PURE__ */ jsx167(
                        "path",
                        {
                          className: "opacity-75",
                          fill: "currentColor",
                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx167("span", { className: classNames22(triggerText, "text-neutral-400"), children: loadingMessage })
              ] }) : multi ? multiTriggerContent : selectedItem ? /* @__PURE__ */ jsxs67(Fragment5, { children: [
                selectedItem.icon && /* @__PURE__ */ jsx167("span", { className: "shrink-0 text-neutral-500 dark:text-neutral-400", children: selectedItem.icon }),
                /* @__PURE__ */ jsxs67("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsx167(
                    "span",
                    {
                      className: classNames22(
                        "block truncate font-medium text-neutral-800 dark:text-neutral-100",
                        triggerText
                      ),
                      children: selectedItem.title
                    }
                  ),
                  selectedItem.subtitle && /* @__PURE__ */ jsx167("span", { className: "block truncate text-xs text-neutral-400 dark:text-neutral-500", children: selectedItem.subtitle })
                ] }),
                selectedItem.tags && selectedItem.tags.length > 0 && /* @__PURE__ */ jsx167("div", { className: "flex shrink-0 flex-wrap gap-1", children: selectedItem.tags.map((tag, ti) => /* @__PURE__ */ jsx167(
                  Pill_default,
                  {
                    size: "sm",
                    tone: tag.tone ?? "neutral",
                    variant: "soft",
                    children: tag.label
                  },
                  ti
                )) })
              ] }) : /* @__PURE__ */ jsx167(
                "span",
                {
                  className: classNames22(
                    "flex-1",
                    triggerText,
                    "text-neutral-400 dark:text-neutral-500"
                  ),
                  children: placeholder
                }
              ),
              /* @__PURE__ */ jsx167(
                "svg",
                {
                  className: classNames22(
                    chevronSize,
                    "shrink-0 text-neutral-400 transition-transform",
                    open && "rotate-180"
                  ),
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 2,
                  children: /* @__PURE__ */ jsx167("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m6 9 6 6 6-6" })
                }
              )
            ]
          }
        ),
        dropdown
      ]
    }
  );
};
Picker.displayName = "Picker";

// src/components/TagPicker.tsx
import {
  useCallback as useCallback4,
  useEffect as useEffect6,
  useId,
  useLayoutEffect as useLayoutEffect4,
  useMemo as useMemo8,
  useRef as useRef8,
  useState as useState9
} from "react";
import { createPortal as createPortal6 } from "react-dom";
import classNames23 from "classnames";
import { Fragment as Fragment6, jsx as jsx168, jsxs as jsxs68 } from "react/jsx-runtime";
var toneTokens6 = {
  parallels: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  },
  brand: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  },
  theme: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  },
  red: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  },
  orange: {
    triggerOpen: "border-orange-500 ring-2 ring-orange-500/20 dark:border-orange-400",
    optionSelectedBg: "bg-orange-50 dark:bg-orange-900/20",
    optionSelectedText: "text-orange-700 dark:text-orange-300",
    optionSelectedIcon: "text-orange-500 dark:text-orange-400",
    focusedBg: "bg-orange-50/60 dark:bg-orange-900/10",
    createRowIcon: "text-orange-500 dark:text-orange-400",
    createRowLabel: "text-orange-700 dark:text-orange-300"
  },
  amber: {
    triggerOpen: "border-amber-500 ring-2 ring-amber-500/20 dark:border-amber-400",
    optionSelectedBg: "bg-amber-50 dark:bg-amber-900/20",
    optionSelectedText: "text-amber-700 dark:text-amber-300",
    optionSelectedIcon: "text-amber-500 dark:text-amber-400",
    focusedBg: "bg-amber-50/60 dark:bg-amber-900/10",
    createRowIcon: "text-amber-500 dark:text-amber-400",
    createRowLabel: "text-amber-700 dark:text-amber-300"
  },
  yellow: {
    triggerOpen: "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400",
    focusedBg: "bg-yellow-50/60 dark:bg-yellow-900/10",
    createRowIcon: "text-yellow-500 dark:text-yellow-400",
    createRowLabel: "text-yellow-700 dark:text-yellow-300"
  },
  lime: {
    triggerOpen: "border-lime-500 ring-2 ring-lime-500/20 dark:border-lime-400",
    optionSelectedBg: "bg-lime-50 dark:bg-lime-900/20",
    optionSelectedText: "text-lime-700 dark:text-lime-300",
    optionSelectedIcon: "text-lime-500 dark:text-lime-400",
    focusedBg: "bg-lime-50/60 dark:bg-lime-900/10",
    createRowIcon: "text-lime-500 dark:text-lime-400",
    createRowLabel: "text-lime-700 dark:text-lime-300"
  },
  green: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300"
  },
  emerald: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300"
  },
  teal: {
    triggerOpen: "border-teal-500 ring-2 ring-teal-500/20 dark:border-teal-400",
    optionSelectedBg: "bg-teal-50 dark:bg-teal-900/20",
    optionSelectedText: "text-teal-700 dark:text-teal-300",
    optionSelectedIcon: "text-teal-500 dark:text-teal-400",
    focusedBg: "bg-teal-50/60 dark:bg-teal-900/10",
    createRowIcon: "text-teal-500 dark:text-teal-400",
    createRowLabel: "text-teal-700 dark:text-teal-300"
  },
  cyan: {
    triggerOpen: "border-cyan-500 ring-2 ring-cyan-500/20 dark:border-cyan-400",
    optionSelectedBg: "bg-cyan-50 dark:bg-cyan-900/20",
    optionSelectedText: "text-cyan-700 dark:text-cyan-300",
    optionSelectedIcon: "text-cyan-500 dark:text-cyan-400",
    focusedBg: "bg-cyan-50/60 dark:bg-cyan-900/10",
    createRowIcon: "text-cyan-500 dark:text-cyan-400",
    createRowLabel: "text-cyan-700 dark:text-cyan-300"
  },
  sky: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400",
    focusedBg: "bg-sky-50/60 dark:bg-sky-900/10",
    createRowIcon: "text-sky-500 dark:text-sky-400",
    createRowLabel: "text-sky-700 dark:text-sky-300"
  },
  blue: {
    triggerOpen: "border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-400",
    optionSelectedBg: "bg-blue-50 dark:bg-blue-900/20",
    optionSelectedText: "text-blue-700 dark:text-blue-300",
    optionSelectedIcon: "text-blue-500 dark:text-blue-400",
    focusedBg: "bg-blue-50/60 dark:bg-blue-900/10",
    createRowIcon: "text-blue-500 dark:text-blue-400",
    createRowLabel: "text-blue-700 dark:text-blue-300"
  },
  indigo: {
    triggerOpen: "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400",
    optionSelectedBg: "bg-indigo-50 dark:bg-indigo-900/20",
    optionSelectedText: "text-indigo-700 dark:text-indigo-300",
    optionSelectedIcon: "text-indigo-500 dark:text-indigo-400",
    focusedBg: "bg-indigo-50/60 dark:bg-indigo-900/10",
    createRowIcon: "text-indigo-500 dark:text-indigo-400",
    createRowLabel: "text-indigo-700 dark:text-indigo-300"
  },
  violet: {
    triggerOpen: "border-violet-500 ring-2 ring-violet-500/20 dark:border-violet-400",
    optionSelectedBg: "bg-violet-50 dark:bg-violet-900/20",
    optionSelectedText: "text-violet-700 dark:text-violet-300",
    optionSelectedIcon: "text-violet-500 dark:text-violet-400",
    focusedBg: "bg-violet-50/60 dark:bg-violet-900/10",
    createRowIcon: "text-violet-500 dark:text-violet-400",
    createRowLabel: "text-violet-700 dark:text-violet-300"
  },
  purple: {
    triggerOpen: "border-purple-500 ring-2 ring-purple-500/20 dark:border-purple-400",
    optionSelectedBg: "bg-purple-50 dark:bg-purple-900/20",
    optionSelectedText: "text-purple-700 dark:text-purple-300",
    optionSelectedIcon: "text-purple-500 dark:text-purple-400",
    focusedBg: "bg-purple-50/60 dark:bg-purple-900/10",
    createRowIcon: "text-purple-500 dark:text-purple-400",
    createRowLabel: "text-purple-700 dark:text-purple-300"
  },
  fuchsia: {
    triggerOpen: "border-fuchsia-500 ring-2 ring-fuchsia-500/20 dark:border-fuchsia-400",
    optionSelectedBg: "bg-fuchsia-50 dark:bg-fuchsia-900/20",
    optionSelectedText: "text-fuchsia-700 dark:text-fuchsia-300",
    optionSelectedIcon: "text-fuchsia-500 dark:text-fuchsia-400",
    focusedBg: "bg-fuchsia-50/60 dark:bg-fuchsia-900/10",
    createRowIcon: "text-fuchsia-500 dark:text-fuchsia-400",
    createRowLabel: "text-fuchsia-700 dark:text-fuchsia-300"
  },
  pink: {
    triggerOpen: "border-pink-500 ring-2 ring-pink-500/20 dark:border-pink-400",
    optionSelectedBg: "bg-pink-50 dark:bg-pink-900/20",
    optionSelectedText: "text-pink-700 dark:text-pink-300",
    optionSelectedIcon: "text-pink-500 dark:text-pink-400",
    focusedBg: "bg-pink-50/60 dark:bg-pink-900/10",
    createRowIcon: "text-pink-500 dark:text-pink-400",
    createRowLabel: "text-pink-700 dark:text-pink-300"
  },
  rose: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  },
  slate: {
    triggerOpen: "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400",
    focusedBg: "bg-slate-50/60 dark:bg-slate-900/10",
    createRowIcon: "text-slate-500 dark:text-slate-400",
    createRowLabel: "text-slate-700 dark:text-slate-300"
  },
  gray: {
    triggerOpen: "border-gray-500 ring-2 ring-gray-500/20 dark:border-gray-400",
    optionSelectedBg: "bg-gray-50 dark:bg-gray-900/20",
    optionSelectedText: "text-gray-700 dark:text-gray-300",
    optionSelectedIcon: "text-gray-500 dark:text-gray-400",
    focusedBg: "bg-gray-50/60 dark:bg-gray-900/10",
    createRowIcon: "text-gray-500 dark:text-gray-400",
    createRowLabel: "text-gray-700 dark:text-gray-300"
  },
  zinc: {
    triggerOpen: "border-zinc-500 ring-2 ring-zinc-500/20 dark:border-zinc-400",
    optionSelectedBg: "bg-zinc-50 dark:bg-zinc-900/20",
    optionSelectedText: "text-zinc-700 dark:text-zinc-300",
    optionSelectedIcon: "text-zinc-500 dark:text-zinc-400",
    focusedBg: "bg-zinc-50/60 dark:bg-zinc-900/10",
    createRowIcon: "text-zinc-500 dark:text-zinc-400",
    createRowLabel: "text-zinc-700 dark:text-zinc-300"
  },
  neutral: {
    triggerOpen: "border-neutral-500 ring-2 ring-neutral-500/20 dark:border-neutral-400",
    optionSelectedBg: "bg-neutral-100 dark:bg-neutral-800",
    optionSelectedText: "text-neutral-700 dark:text-neutral-300",
    optionSelectedIcon: "text-neutral-500 dark:text-neutral-400",
    focusedBg: "bg-neutral-50 dark:bg-neutral-800/60",
    createRowIcon: "text-neutral-500 dark:text-neutral-400",
    createRowLabel: "text-neutral-700 dark:text-neutral-300"
  },
  stone: {
    triggerOpen: "border-stone-500 ring-2 ring-stone-500/20 dark:border-stone-400",
    optionSelectedBg: "bg-stone-50 dark:bg-stone-900/20",
    optionSelectedText: "text-stone-700 dark:text-stone-300",
    optionSelectedIcon: "text-stone-500 dark:text-stone-400",
    focusedBg: "bg-stone-50/60 dark:bg-stone-900/10",
    createRowIcon: "text-stone-500 dark:text-stone-400",
    createRowLabel: "text-stone-700 dark:text-stone-300"
  },
  white: {
    triggerOpen: "border-slate-500 ring-2 ring-slate-500/20 dark:border-slate-400",
    optionSelectedBg: "bg-slate-50 dark:bg-slate-900/20",
    optionSelectedText: "text-slate-700 dark:text-slate-300",
    optionSelectedIcon: "text-slate-500 dark:text-slate-400",
    focusedBg: "bg-slate-50/60 dark:bg-slate-900/10",
    createRowIcon: "text-slate-500 dark:text-slate-400",
    createRowLabel: "text-slate-700 dark:text-slate-300"
  },
  info: {
    triggerOpen: "border-sky-500 ring-2 ring-sky-500/20 dark:border-sky-400",
    optionSelectedBg: "bg-sky-50 dark:bg-sky-900/20",
    optionSelectedText: "text-sky-700 dark:text-sky-300",
    optionSelectedIcon: "text-sky-500 dark:text-sky-400",
    focusedBg: "bg-sky-50/60 dark:bg-sky-900/10",
    createRowIcon: "text-sky-500 dark:text-sky-400",
    createRowLabel: "text-sky-700 dark:text-sky-300"
  },
  success: {
    triggerOpen: "border-emerald-500 ring-2 ring-emerald-500/20 dark:border-emerald-400",
    optionSelectedBg: "bg-emerald-50 dark:bg-emerald-900/20",
    optionSelectedText: "text-emerald-700 dark:text-emerald-300",
    optionSelectedIcon: "text-emerald-500 dark:text-emerald-400",
    focusedBg: "bg-emerald-50/60 dark:bg-emerald-900/10",
    createRowIcon: "text-emerald-500 dark:text-emerald-400",
    createRowLabel: "text-emerald-700 dark:text-emerald-300"
  },
  warning: {
    triggerOpen: "border-yellow-500 ring-2 ring-yellow-500/20 dark:border-yellow-400",
    optionSelectedBg: "bg-yellow-50 dark:bg-yellow-900/20",
    optionSelectedText: "text-yellow-700 dark:text-yellow-300",
    optionSelectedIcon: "text-yellow-500 dark:text-yellow-400",
    focusedBg: "bg-yellow-50/60 dark:bg-yellow-900/10",
    createRowIcon: "text-yellow-500 dark:text-yellow-400",
    createRowLabel: "text-yellow-700 dark:text-yellow-300"
  },
  danger: {
    triggerOpen: "border-rose-500 ring-2 ring-rose-500/20 dark:border-rose-400",
    optionSelectedBg: "bg-rose-50 dark:bg-rose-900/20",
    optionSelectedText: "text-rose-700 dark:text-rose-300",
    optionSelectedIcon: "text-rose-500 dark:text-rose-400",
    focusedBg: "bg-rose-50/60 dark:bg-rose-900/10",
    createRowIcon: "text-rose-500 dark:text-rose-400",
    createRowLabel: "text-rose-700 dark:text-rose-300"
  }
};
var viewportBounds3 = () => ({
  top: 0,
  left: 0,
  right: window.innerWidth,
  bottom: window.innerHeight,
  width: window.innerWidth,
  height: window.innerHeight
});
var isClippingParent3 = (el) => /(auto|scroll|hidden|clip)/.test(
  [
    getComputedStyle(el).overflow,
    getComputedStyle(el).overflowX,
    getComputedStyle(el).overflowY
  ].join(" ")
);
var resolveBoundaryBounds3 = (anchor) => {
  let node = anchor.parentElement;
  while (node && node !== document.body) {
    if (isClippingParent3(node)) {
      const r = node.getBoundingClientRect();
      return {
        top: r.top,
        left: r.left,
        right: r.right,
        bottom: r.bottom,
        width: r.width,
        height: r.height
      };
    }
    node = node.parentElement;
  }
  return viewportBounds3();
};
var resolveZIndex2 = (anchor) => {
  let node = anchor;
  let highest = null;
  while (node && node !== document.body) {
    const z = getComputedStyle(node).zIndex;
    if (z && z !== "auto") {
      const n = Number(z);
      if (Number.isFinite(n))
        highest = highest === null ? n : Math.max(highest, n);
    }
    node = node.parentElement;
  }
  return Math.max(1, (highest ?? 20) + 1);
};
var PORTAL_ROOT3 = typeof document !== "undefined" ? document.body : null;
var MAX_DROPDOWN_HEIGHT2 = 280;
var TagPicker = ({
  items,
  value,
  onChange,
  allowCreate = false,
  onCreateItem,
  multi = true,
  placeholder = "Select\u2026",
  searchPlaceholder = "Search\u2026",
  emptyMessage = "No items found.",
  loading = false,
  loadingMessage = "Loading\u2026",
  color = "blue",
  itemColor = null,
  escapeBoundary = false,
  tagLimit = 3,
  highlightNew = true,
  className,
  disabled = false,
  readOnly = false,
  normalizeValue
}) => {
  const uid = useId();
  const triggerRef = useRef8(null);
  const dropdownRef = useRef8(null);
  const searchRef = useRef8(null);
  const [open, setOpen] = useState9(false);
  const [query, setQuery] = useState9("");
  const [focusedIndex, setFocusedIndex] = useState9(-1);
  const [style, setStyle] = useState9();
  const [computedMaxHeight, setComputedMaxHeight] = useState9(MAX_DROPDOWN_HEIGHT2);
  const [showAllTags, setShowAllTags] = useState9(false);
  const colorTokens2 = toneTokens6[color] ?? toneTokens6.blue;
  if (!itemColor) {
    itemColor = color;
  }
  const initialValueRef = useRef8(new Set(value));
  const sessionAddedSet = useMemo8(
    () => highlightNew ? new Set(value.filter((v) => !initialValueRef.current.has(v))) : /* @__PURE__ */ new Set(),
    [value, highlightNew]
  );
  const selectedSet = useMemo8(() => new Set(value), [value]);
  const labelFor = useCallback4(
    (v) => items.find((i) => i.id === v)?.label ?? v,
    [items]
  );
  const filtered = useMemo8(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || (item.tags ?? []).some((t) => t.label.toLowerCase().includes(q))
    );
  }, [items, query]);
  const showCreate = useMemo8(() => {
    if (!allowCreate || !query.trim()) return false;
    const q = query.trim().toLowerCase();
    return !items.some((item) => item.label.toLowerCase() === q) && !value.includes(query.trim());
  }, [allowCreate, query, items, value]);
  const maxFocusIndex = filtered.length - 1 + (showCreate ? 1 : 0);
  const updatePosition = useCallback4(() => {
    if (!open || !triggerRef.current || !dropdownRef.current) return;
    const anchorRect = triggerRef.current.getBoundingClientRect();
    const menuRect = dropdownRef.current.getBoundingClientRect();
    const boundary = escapeBoundary ? viewportBounds3() : resolveBoundaryBounds3(triggerRef.current);
    const zIndex = resolveZIndex2(triggerRef.current);
    const offset = 4;
    const minMargin = 8;
    const vp = viewportBounds3();
    const computedWidth = Math.min(
      Math.max(anchorRect.width, menuRect.width),
      Math.min(boundary.width, vp.width) - minMargin * 2
    );
    const computedHeight = menuRect.height || MAX_DROPDOWN_HEIGHT2;
    const belowTop = anchorRect.bottom + offset;
    const aboveTop = anchorRect.top - offset - computedHeight;
    const overflowFor = (top) => Math.max(0, vp.top + minMargin - top) + Math.max(0, top + computedHeight - (vp.bottom - minMargin));
    const isTopSide = overflowFor(aboveTop) < overflowFor(belowTop);
    const rawTop = isTopSide ? aboveTop : belowTop;
    const clampedTop = Math.min(
      Math.max(rawTop, vp.top + minMargin),
      Math.max(vp.top + minMargin, vp.bottom - computedHeight - minMargin)
    );
    const availableSpace = isTopSide ? Math.max(120, anchorRect.top - offset - (vp.top + minMargin)) : Math.max(120, vp.bottom - minMargin - belowTop);
    const startLeft = anchorRect.left;
    const clampedLeft = Math.min(
      Math.max(startLeft, boundary.left + minMargin),
      Math.max(
        boundary.left + minMargin,
        boundary.right - computedWidth - minMargin
      )
    );
    setComputedMaxHeight(
      Math.max(120, Math.min(MAX_DROPDOWN_HEIGHT2, availableSpace))
    );
    setStyle({
      position: "fixed",
      top: clampedTop,
      left: clampedLeft,
      width: computedWidth,
      zIndex
    });
  }, [open, escapeBoundary]);
  useLayoutEffect4(() => {
    updatePosition();
  }, [updatePosition]);
  useEffect6(() => {
    if (!open) {
      setStyle(void 0);
      return;
    }
    let frame = 0;
    const schedule = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        updatePosition();
        frame = 0;
      });
    };
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : void 0;
    if (ro) {
      if (triggerRef.current) ro.observe(triggerRef.current);
      if (dropdownRef.current) ro.observe(dropdownRef.current);
    }
    schedule();
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      ro?.disconnect();
    };
  }, [open, updatePosition]);
  useEffect6(() => {
    if (!open) return;
    const handlePointer = (e) => {
      if (dropdownRef.current?.contains(e.target) || triggerRef.current?.contains(e.target))
        return;
      setOpen(false);
      setQuery("");
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);
  useEffect6(() => {
    if (open) requestAnimationFrame(() => searchRef.current?.focus());
  }, [open]);
  useEffect6(() => {
    setFocusedIndex(-1);
  }, [query]);
  const normalize = useCallback4(
    (v) => normalizeValue ? normalizeValue(v) : v,
    [normalizeValue]
  );
  const handleToggle = useCallback4(
    (item) => {
      const id = normalize(item.id);
      if (!multi) {
        onChange([id]);
        setOpen(false);
        setQuery("");
        return;
      }
      if (selectedSet.has(item.id)) {
        onChange(value.filter((v) => v !== item.id));
      } else {
        onChange([...value, id]);
      }
    },
    [multi, normalize, onChange, selectedSet, value]
  );
  const handleRemove = useCallback4(
    (v) => onChange(value.filter((x) => x !== v)),
    [onChange, value]
  );
  const handleCreate = useCallback4(() => {
    const label = normalize(query.trim());
    if (!label) return;
    if (onCreateItem) {
      onCreateItem(label);
    } else if (!multi) {
      onChange([label]);
      setOpen(false);
    } else {
      onChange([...value, label]);
    }
    setQuery("");
  }, [query, normalize, onCreateItem, multi, onChange, value]);
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, maxFocusIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        handleToggle(filtered[focusedIndex]);
      } else if (showCreate && focusedIndex === filtered.length) {
        handleCreate();
      } else if (query.trim()) {
        if (filtered.length > 0) handleToggle(filtered[0]);
        else if (showCreate) handleCreate();
      }
    } else if (e.key === "Backspace" && !query && value.length > 0 && multi) {
      onChange(value.slice(0, -1));
    }
  };
  const dropdown = open && PORTAL_ROOT3 ? createPortal6(
    /* @__PURE__ */ jsxs68(
      "div",
      {
        ref: dropdownRef,
        style: style ?? { visibility: "hidden" },
        className: classNames23(
          "fixed overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-xl ring-1 ring-black/5 dark:border-neutral-700 dark:bg-neutral-900",
          !style && "invisible opacity-0"
        ),
        children: [
          /* @__PURE__ */ jsxs68("div", { className: "flex items-center gap-2 border-b border-neutral-100 px-3 py-2 dark:border-neutral-800", children: [
            /* @__PURE__ */ jsxs68(
              "svg",
              {
                className: "h-4 w-4 shrink-0 text-neutral-400",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: 2,
                children: [
                  /* @__PURE__ */ jsx168("circle", { cx: "11", cy: "11", r: "8" }),
                  /* @__PURE__ */ jsx168("path", { strokeLinecap: "round", d: "m21 21-4.35-4.35" })
                ]
              }
            ),
            /* @__PURE__ */ jsx168(
              "input",
              {
                ref: searchRef,
                id: `${uid}-search`,
                role: "combobox",
                "aria-expanded": open,
                "aria-controls": `${uid}-listbox`,
                "aria-autocomplete": "list",
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                onKeyDown: handleKeyDown,
                placeholder: searchPlaceholder,
                className: "min-w-0 flex-1 bg-transparent text-sm text-neutral-700 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-500"
              }
            ),
            query && /* @__PURE__ */ jsx168(
              "button",
              {
                type: "button",
                onMouseDown: (e) => e.preventDefault(),
                onClick: () => setQuery(""),
                className: "shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
                children: /* @__PURE__ */ jsx168(
                  "svg",
                  {
                    className: "h-3.5 w-3.5",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: 2,
                    children: /* @__PURE__ */ jsx168("path", { strokeLinecap: "round", d: "M18 6 6 18M6 6l12 12" })
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxs68(
            "ul",
            {
              id: `${uid}-listbox`,
              role: "listbox",
              "aria-multiselectable": multi,
              className: "overflow-y-auto divide-y divide-neutral-50 dark:divide-neutral-800/60",
              style: { maxHeight: computedMaxHeight },
              children: [
                loading ? /* @__PURE__ */ jsxs68("li", { className: "flex items-center justify-center gap-2 px-4 py-5 text-sm text-neutral-400 dark:text-neutral-500", children: [
                  /* @__PURE__ */ jsxs68(
                    "svg",
                    {
                      className: "h-4 w-4 animate-spin",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      children: [
                        /* @__PURE__ */ jsx168(
                          "circle",
                          {
                            className: "opacity-25",
                            cx: "12",
                            cy: "12",
                            r: "10",
                            stroke: "currentColor",
                            strokeWidth: "4"
                          }
                        ),
                        /* @__PURE__ */ jsx168(
                          "path",
                          {
                            className: "opacity-75",
                            fill: "currentColor",
                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          }
                        )
                      ]
                    }
                  ),
                  loadingMessage
                ] }) : filtered.length === 0 && !showCreate ? /* @__PURE__ */ jsx168("li", { className: "px-4 py-5 text-center text-sm text-neutral-400 dark:text-neutral-500", children: items.length === 0 ? emptyMessage : "No items match your search." }) : filtered.map((item, index) => {
                  const isSelected = selectedSet.has(item.id);
                  const isFocused = index === focusedIndex;
                  const isNew = sessionAddedSet.has(item.id);
                  return /* @__PURE__ */ jsxs68(
                    "li",
                    {
                      role: "option",
                      "aria-selected": isSelected,
                      onMouseDown: (e) => e.preventDefault(),
                      onMouseEnter: () => setFocusedIndex(index),
                      onClick: () => {
                        if (!readOnly) handleToggle(item);
                      },
                      className: classNames23(
                        "flex cursor-pointer select-none items-center gap-3 px-4 py-2.5 transition-colors",
                        isSelected ? isNew ? "bg-emerald-50 dark:bg-emerald-900/20" : colorTokens2.optionSelectedBg : isFocused ? colorTokens2.focusedBg : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                      ),
                      children: [
                        /* @__PURE__ */ jsx168("span", { className: "flex h-4 w-4 shrink-0 items-center justify-center", children: isSelected && /* @__PURE__ */ jsx168(
                          "svg",
                          {
                            className: classNames23(
                              "h-3.5 w-3.5",
                              isNew ? "text-emerald-500 dark:text-emerald-400" : colorTokens2.optionSelectedIcon
                            ),
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: 2.5,
                            children: /* @__PURE__ */ jsx168(
                              "path",
                              {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                d: "m5 13 4 4L19 7"
                              }
                            )
                          }
                        ) }),
                        item.icon && /* @__PURE__ */ jsx168(
                          "span",
                          {
                            className: classNames23(
                              "shrink-0",
                              isSelected ? isNew ? "text-emerald-500 dark:text-emerald-400" : colorTokens2.optionSelectedIcon : "text-neutral-400 dark:text-neutral-500"
                            ),
                            children: item.icon
                          }
                        ),
                        /* @__PURE__ */ jsx168(
                          "span",
                          {
                            className: classNames23(
                              "min-w-0 flex-1 truncate text-sm font-medium",
                              isSelected ? isNew ? "text-emerald-700 dark:text-emerald-300" : colorTokens2.optionSelectedText : "text-neutral-800 dark:text-neutral-200"
                            ),
                            children: item.label
                          }
                        ),
                        isNew && /* @__PURE__ */ jsx168("span", { className: "shrink-0 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400", children: "new" }),
                        item.tags && item.tags.length > 0 && /* @__PURE__ */ jsx168("div", { className: "flex shrink-0 flex-wrap gap-1", children: item.tags.map((tag, ti) => /* @__PURE__ */ jsx168(
                          Pill_default,
                          {
                            size: "sm",
                            tone: tag.tone ?? "neutral",
                            variant: "soft",
                            children: tag.label
                          },
                          ti
                        )) })
                      ]
                    },
                    item.id
                  );
                }),
                showCreate && /* @__PURE__ */ jsxs68(
                  "li",
                  {
                    role: "option",
                    "aria-selected": false,
                    onMouseDown: (e) => e.preventDefault(),
                    onMouseEnter: () => setFocusedIndex(filtered.length),
                    onClick: handleCreate,
                    className: classNames23(
                      "flex cursor-pointer select-none items-center gap-2 border-t border-neutral-100 px-4 py-2.5 text-sm transition-colors dark:border-neutral-700/60",
                      focusedIndex === filtered.length ? colorTokens2.focusedBg : "hover:bg-neutral-50 dark:hover:bg-neutral-800/60"
                    ),
                    children: [
                      /* @__PURE__ */ jsx168(
                        "svg",
                        {
                          className: classNames23(
                            "h-3.5 w-3.5 shrink-0",
                            colorTokens2.createRowIcon
                          ),
                          viewBox: "0 0 24 24",
                          fill: "none",
                          stroke: "currentColor",
                          strokeWidth: 2,
                          children: /* @__PURE__ */ jsx168(
                            "path",
                            {
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              d: "M12 5v14M5 12h14"
                            }
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxs68("span", { className: "text-neutral-500 dark:text-neutral-400", children: [
                        "Create",
                        " ",
                        /* @__PURE__ */ jsxs68(
                          "span",
                          {
                            className: classNames23(
                              "font-medium",
                              colorTokens2.createRowLabel
                            ),
                            title: query.trim(),
                            children: [
                              "\u201C",
                              query.trim(),
                              "\u201D"
                            ]
                          }
                        )
                      ] })
                    ]
                  }
                )
              ]
            }
          )
        ]
      }
    ),
    PORTAL_ROOT3
  ) : null;
  return /* @__PURE__ */ jsxs68(Fragment6, { children: [
    /* @__PURE__ */ jsxs68(
      "button",
      {
        ref: triggerRef,
        type: "button",
        disabled,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        "aria-controls": open ? `${uid}-listbox` : void 0,
        onClick: () => {
          if (!disabled && !readOnly) setOpen((prev) => !prev);
        },
        className: classNames23(
          "flex w-full min-h-10.5 flex-wrap items-start gap-1.5 rounded-lg border px-3 py-2 text-left transition-colors",
          "bg-white dark:bg-neutral-900",
          open ? colorTokens2.triggerOpen : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
          disabled && "cursor-not-allowed opacity-50",
          readOnly && "cursor-default border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50",
          className
        ),
        children: [
          loading ? /* @__PURE__ */ jsxs68(Fragment6, { children: [
            /* @__PURE__ */ jsxs68(
              "svg",
              {
                className: "h-4 w-4 animate-spin shrink-0 text-neutral-400",
                viewBox: "0 0 24 24",
                fill: "none",
                children: [
                  /* @__PURE__ */ jsx168(
                    "circle",
                    {
                      className: "opacity-25",
                      cx: "12",
                      cy: "12",
                      r: "10",
                      stroke: "currentColor",
                      strokeWidth: "4"
                    }
                  ),
                  /* @__PURE__ */ jsx168(
                    "path",
                    {
                      className: "opacity-75",
                      fill: "currentColor",
                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx168("span", { className: "text-sm text-neutral-400", children: loadingMessage })
          ] }) : value.length > 0 ? /* @__PURE__ */ jsxs68("span", { className: "flex flex-1 flex-wrap items-center gap-1.5", children: [
            (multi && tagLimit > 0 && !showAllTags ? value.slice(0, tagLimit) : value).map((v) => /* @__PURE__ */ jsxs68("span", { className: "inline-flex items-center", children: [
              /* @__PURE__ */ jsx168(
                Pill_default,
                {
                  size: "sm",
                  tone: sessionAddedSet.has(v) ? "emerald" : itemColor ?? color,
                  variant: "soft",
                  children: labelFor(v)
                }
              ),
              multi && !readOnly && /* @__PURE__ */ jsx168(
                "button",
                {
                  type: "button",
                  "aria-label": `Remove ${labelFor(v)}`,
                  onPointerDown: (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  },
                  onClick: (e) => {
                    e.stopPropagation();
                    handleRemove(v);
                  },
                  className: "-ml-0.5 flex h-4 w-4 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-200 hover:text-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-neutral-300",
                  children: /* @__PURE__ */ jsx168(
                    "svg",
                    {
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: 2.5,
                      className: "h-2.5 w-2.5",
                      children: /* @__PURE__ */ jsx168("path", { strokeLinecap: "round", d: "M18 6 6 18M6 6l12 12" })
                    }
                  )
                }
              )
            ] }, v)),
            multi && tagLimit > 0 && value.length > tagLimit && !showAllTags && /* @__PURE__ */ jsx168(
              "button",
              {
                type: "button",
                onPointerDown: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                },
                onClick: (e) => {
                  e.stopPropagation();
                  setShowAllTags(true);
                },
                className: "inline-flex",
                "aria-label": `Show ${value.length - tagLimit} more tags`,
                children: /* @__PURE__ */ jsxs68(Pill_default, { size: "sm", tone: "neutral", variant: "soft", children: [
                  "+",
                  value.length - tagLimit
                ] })
              }
            ),
            multi && tagLimit > 0 && showAllTags && value.length > tagLimit && /* @__PURE__ */ jsx168(
              "button",
              {
                type: "button",
                onPointerDown: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                },
                onClick: (e) => {
                  e.stopPropagation();
                  setShowAllTags(false);
                },
                className: "text-xs text-neutral-400 underline-offset-2 hover:underline dark:text-neutral-500",
                children: "Show less"
              }
            )
          ] }) : /* @__PURE__ */ jsx168("span", { className: "flex-1 text-sm text-neutral-400 dark:text-neutral-500", children: placeholder }),
          /* @__PURE__ */ jsx168(
            "svg",
            {
              className: classNames23(
                "ml-auto mt-1 h-4 w-4 shrink-0 self-start text-neutral-400 transition-transform",
                open && "rotate-180"
              ),
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              children: /* @__PURE__ */ jsx168("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "m6 9 6 6 6-6" })
            }
          )
        ]
      }
    ),
    dropdown
  ] });
};
TagPicker.displayName = "TagPicker";

// src/components/TagPanel.tsx
import { useState as useState10 } from "react";
import classNames25 from "classnames";

// src/components/Section.tsx
import classNames24 from "classnames";
import { jsx as jsx169, jsxs as jsxs69 } from "react/jsx-runtime";

// src/components/TagPanel.tsx
import { Fragment as Fragment7, jsx as jsx170, jsxs as jsxs70 } from "react/jsx-runtime";

// src/components/Checkbox.tsx
import {
  forwardRef as forwardRef148,
  useCallback as useCallback5,
  useEffect as useEffect7,
  useId as useId2,
  useRef as useRef9
} from "react";
import classNames26 from "classnames";
import { jsx as jsx171, jsxs as jsxs71 } from "react/jsx-runtime";
var sizeTokens4 = {
  xs: {
    gap: "gap-1",
    control: "h-3 w-3",
    label: "text-xs",
    description: "text-xs",
    descriptionOffset: "",
    checkboxOffset: "mt-0.5"
  },
  sm: {
    gap: "gap-1.5",
    control: "h-4 w-4",
    label: "text-sm",
    description: "text-xs",
    descriptionOffset: "",
    checkboxOffset: "mt-1"
  },
  md: {
    gap: "gap-1.5",
    control: "h-5 w-5",
    label: "text-md",
    description: "text-xs",
    descriptionOffset: "mt-0.5",
    checkboxOffset: "mt-0.5"
  },
  lg: {
    gap: "gap-1.5",
    control: "h-6 w-6",
    label: "text-base",
    description: "text-sm",
    descriptionOffset: "mt-1",
    checkboxOffset: "mt-0.2"
  },
  xl: {
    gap: "gap-2",
    control: "h-7 w-7",
    label: "text-lg",
    description: "text-sm",
    descriptionOffset: "mt-1.5",
    checkboxOffset: "mt-0.5"
  },
  xxl: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5"
  },
  xxxl: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5"
  },
  "2xl": {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5"
  },
  "3xl": {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5"
  },
  full: {
    gap: "gap-2.5",
    control: "h-8 w-8",
    label: "text-xl",
    description: "text-sm",
    descriptionOffset: "mt-2",
    checkboxOffset: "mt-0.5"
  }
};
var Checkbox = forwardRef148(
  ({
    id,
    label,
    description,
    descriptionPlacement = "bottom",
    size = "md",
    color = "blue",
    indeterminate = false,
    fullWidth = false,
    controlAlign = "left",
    className,
    inputClassName,
    disabled,
    ...inputProps
  }, forwardedRef) => {
    const generatedId = useId2();
    const controlId = id ?? generatedId;
    const descriptionId = description ? `${controlId}-description` : void 0;
    const innerRef = useRef9(null);
    useEffect7(() => {
      if (!innerRef.current) return;
      innerRef.current.indeterminate = Boolean(indeterminate);
    }, [indeterminate]);
    const setRefs = useCallback5(
      (node) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );
    const sizeStyles6 = sizeTokens4[size] ?? sizeTokens4.md;
    const colorStyles = getCheckboxColorClasses(color);
    const descriptionNode = description ? descriptionPlacement === "inline" ? /* @__PURE__ */ jsx171(
      "span",
      {
        id: descriptionId,
        className: classNames26(
          sizeStyles6.description,
          "text-neutral-500 dark:text-neutral-400",
          disabled && "text-neutral-400 dark:text-neutral-500"
        ),
        children: description
      }
    ) : /* @__PURE__ */ jsx171(
      "span",
      {
        id: descriptionId,
        className: classNames26(
          sizeStyles6.description,
          sizeStyles6.descriptionOffset,
          "block text-neutral-500 dark:text-neutral-400",
          disabled && "text-neutral-400 dark:text-neutral-500"
        ),
        children: description
      }
    ) : null;
    const controlNode = /* @__PURE__ */ jsx171(
      "input",
      {
        id: controlId,
        ref: setRefs,
        type: "checkbox",
        "aria-describedby": descriptionId,
        disabled,
        className: classNames26(
          `peer ${sizeStyles6.checkboxOffset} shrink-0 rounded border border-neutral-300 bg-white text-white transition-colors duration-150`,
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "checked:border-transparent hover:border-neutral-400",
          "dark:border-neutral-600 dark:bg-neutral-900 dark:hover:border-neutral-500",
          "disabled:border-neutral-200 disabled:bg-neutral-100 disabled:hover:border-neutral-200",
          sizeStyles6.control,
          colorStyles,
          inputClassName
        ),
        ...inputProps
      }
    );
    const textNode = label || descriptionNode ? /* @__PURE__ */ jsxs71(
      "span",
      {
        className: classNames26(
          "min-w-0",
          descriptionPlacement === "inline" && Boolean(label) && "flex flex-wrap items-center gap-1",
          descriptionPlacement === "inline" && !label && "flex items-center"
        ),
        children: [
          label && /* @__PURE__ */ jsx171(
            "span",
            {
              className: classNames26(
                sizeStyles6.label,
                "font-medium text-neutral-900 dark:text-neutral-100",
                disabled && "text-neutral-500 dark:text-neutral-400"
              ),
              children: label
            }
          ),
          descriptionNode
        ]
      }
    ) : null;
    return /* @__PURE__ */ jsxs71(
      "label",
      {
        className: classNames26(
          "group flex items-start",
          controlAlign === "right" && "flex-row-reverse",
          sizeStyles6.gap,
          fullWidth && "w-full",
          disabled && "cursor-not-allowed opacity-60",
          !disabled && "cursor-pointer",
          className
        ),
        children: [
          controlNode,
          textNode
        ]
      }
    );
  }
);
Checkbox.displayName = "Checkbox";

// src/components/Toggle.tsx
import {
  forwardRef as forwardRef149,
  useCallback as useCallback6,
  useId as useId3,
  useRef as useRef10
} from "react";
import classNames27 from "classnames";
import { jsx as jsx172, jsxs as jsxs72 } from "react/jsx-runtime";
var paddingStyles = {
  none: "",
  xs: "p-0.5",
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
  xl: "p-3"
};
var sizeTokens5 = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-4 w-4",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-4",
    gap: "gap-2",
    font: "text-sm",
    description: "text-xs"
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-5 w-5",
    thumbOffset: "top-0.5 left-0.5",
    thumbTranslate: "peer-checked:translate-x-5",
    gap: "gap-3",
    font: "text-sm",
    description: "text-xs"
  },
  lg: {
    track: "h-7 w-14",
    thumb: "h-6 w-6",
    thumbOffset: "top-1 left-1",
    thumbTranslate: "peer-checked:translate-x-6",
    gap: "gap-3.5",
    font: "text-base",
    description: "text-sm"
  }
};
var iconWrapSize = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
};
var Toggle = forwardRef149(
  ({
    id,
    label,
    description,
    descriptionPlacement = "stacked",
    size = "md",
    padding = "sm",
    color = "blue",
    alignLabel = "right",
    iconOn,
    iconOff,
    fullWidth = false,
    className,
    disabled,
    onChange,
    tooltip,
    tooltipPosition,
    ...inputProps
  }, forwardedRef) => {
    const renderIcon2 = useIconRenderer();
    const generatedId = useId3();
    const toggleId = id ?? generatedId;
    const descriptionId = description ? `${toggleId}-description` : void 0;
    const inputRef = useRef10(null);
    const mergeRefs = useCallback6(
      (node) => {
        inputRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      },
      [forwardedRef]
    );
    const sizeStyles6 = sizeTokens5[size] ?? sizeTokens5.md;
    const colorStyles = getToggleColorClasses(color);
    const labelBlock = label || description ? /* @__PURE__ */ jsxs72(
      "span",
      {
        className: classNames27(
          "min-w-0",
          descriptionPlacement === "inline" ? "flex flex-wrap items-center gap-2 text-neutral-900 dark:text-neutral-100" : "flex flex-col",
          descriptionPlacement === "inline" && !label && "text-neutral-400 dark:text-neutral-300"
        ),
        children: [
          label && /* @__PURE__ */ jsx172(
            "span",
            {
              className: classNames27(
                sizeStyles6.font,
                "font-medium text-neutral-900 dark:text-neutral-100",
                disabled && "text-neutral-400 dark:text-neutral-300"
              ),
              children: label
            }
          ),
          description && /* @__PURE__ */ jsx172(
            "span",
            {
              id: descriptionId,
              className: classNames27(
                sizeStyles6.description,
                "text-neutral-400 dark:text-neutral-300",
                descriptionPlacement === "stacked" && "mt-1",
                disabled && "text-neutral-300 dark:text-neutral-400"
              ),
              children: description
            }
          )
        ]
      }
    ) : null;
    const toggle = /* @__PURE__ */ jsxs72(
      "label",
      {
        className: classNames27(
          "group flex select-none items-center",
          alignLabel === "left" ? "flex-row-reverse" : "flex-row",
          sizeStyles6.gap,
          paddingStyles[padding],
          fullWidth && "w-full",
          disabled && "cursor-not-allowed opacity-60",
          inputProps.readOnly && !disabled && "cursor-default",
          !disabled && !inputProps.readOnly && "cursor-pointer",
          className
        ),
        onClick: (e) => {
          if (inputProps.readOnly) {
            e.preventDefault();
          }
        },
        children: [
          /* @__PURE__ */ jsxs72("span", { className: "relative inline-flex shrink-0", children: [
            /* @__PURE__ */ jsx172(
              "input",
              {
                id: toggleId,
                ref: mergeRefs,
                type: "checkbox",
                role: "switch",
                className: classNames27(
                  "peer sr-only",
                  disabled ? "cursor-not-allowed" : inputProps.readOnly ? "cursor-default" : "cursor-pointer"
                ),
                "aria-describedby": descriptionId,
                disabled,
                onChange,
                onClick: (e) => {
                  if (inputProps.readOnly) {
                    e.preventDefault();
                  }
                },
                ...inputProps
              }
            ),
            /* @__PURE__ */ jsx172(
              "span",
              {
                "aria-hidden": "true",
                className: classNames27(
                  "block rounded-full border border-transparent bg-neutral-200 transition-colors duration-200 ease-in-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 dark:bg-neutral-600",
                  sizeStyles6.track,
                  colorStyles,
                  disabled && "opacity-70 peer-checked:opacity-70 dark:opacity-50"
                )
              }
            ),
            iconOff && /* @__PURE__ */ jsx172(
              "span",
              {
                className: classNames27(
                  "pointer-events-none absolute inset-y-0 left-1 flex items-center text-neutral-400 transition-opacity duration-200 ease-in-out",
                  iconWrapSize[size],
                  "peer-checked:opacity-0"
                ),
                children: renderIcon2(iconOff, "sm")
              }
            ),
            iconOn && /* @__PURE__ */ jsx172(
              "span",
              {
                className: classNames27(
                  "pointer-events-none text-black absolute inset-y-0 right-1 flex items-center text-black opacity-0 transition-opacity duration-200 ease-in-out",
                  iconWrapSize[size],
                  "peer-checked:opacity-100"
                ),
                children: renderIcon2(iconOn, "sm")
              }
            ),
            /* @__PURE__ */ jsx172(
              "span",
              {
                className: classNames27(
                  "pointer-events-none absolute transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out dark:bg-neutral-200",
                  "translate-x-0",
                  sizeStyles6.thumb,
                  sizeStyles6.thumbOffset,
                  sizeStyles6.thumbTranslate
                )
              }
            )
          ] }),
          labelBlock
        ]
      }
    );
    if (tooltip) {
      return /* @__PURE__ */ jsx172(TooltipWrapper_default, { text: tooltip, position: tooltipPosition, children: toggle });
    }
    return toggle;
  }
);
Toggle.displayName = "Toggle";

// src/components/MultiToggle.tsx
import {
  useCallback as useCallback7,
  useLayoutEffect as useLayoutEffect5,
  useMemo as useMemo9,
  useRef as useRef11,
  useState as useState11
} from "react";
import classNames28 from "classnames";
import { jsx as jsx173, jsxs as jsxs73 } from "react/jsx-runtime";
var toneTokens7 = {
  parallels: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  },
  brand: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  },
  theme: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  },
  red: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  },
  orange: {
    activeText: "text-orange-700 dark:text-orange-200",
    indicator: "bg-orange-500/15 dark:bg-orange-400/20 border border-orange-400/40 dark:border-orange-300/20",
    hover: "hover:text-orange-600 dark:hover:text-orange-300"
  },
  amber: {
    activeText: "text-amber-700 dark:text-amber-200",
    indicator: "bg-amber-500/15 dark:bg-amber-400/20 border border-amber-400/40 dark:border-amber-300/20",
    hover: "hover:text-amber-600 dark:hover:text-amber-300"
  },
  yellow: {
    activeText: "text-yellow-700 dark:text-yellow-200",
    indicator: "bg-yellow-500/15 dark:bg-yellow-400/20 border border-yellow-400/40 dark:border-yellow-300/20",
    hover: "hover:text-yellow-600 dark:hover:text-yellow-300"
  },
  lime: {
    activeText: "text-lime-700 dark:text-lime-200",
    indicator: "bg-lime-500/15 dark:bg-lime-400/20 border border-lime-400/40 dark:border-lime-300/20",
    hover: "hover:text-lime-600 dark:hover:text-lime-300"
  },
  green: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator: "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300"
  },
  emerald: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator: "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300"
  },
  teal: {
    activeText: "text-teal-700 dark:text-teal-200",
    indicator: "bg-teal-500/15 dark:bg-teal-400/20 border border-teal-400/40 dark:border-teal-300/20",
    hover: "hover:text-teal-600 dark:hover:text-teal-300"
  },
  cyan: {
    activeText: "text-cyan-700 dark:text-cyan-200",
    indicator: "bg-cyan-500/15 dark:bg-cyan-400/20 border border-cyan-400/40 dark:border-cyan-300/20",
    hover: "hover:text-cyan-600 dark:hover:text-cyan-300"
  },
  sky: {
    activeText: "text-sky-700 dark:text-sky-200",
    indicator: "bg-sky-500/15 dark:bg-sky-400/20 border border-sky-400/40 dark:border-sky-300/20",
    hover: "hover:text-sky-600 dark:hover:text-sky-300"
  },
  blue: {
    activeText: "text-blue-700 dark:text-blue-200",
    indicator: "bg-blue-500/15 dark:bg-blue-400/20 border border-blue-400/40 dark:border-blue-300/20",
    hover: "hover:text-blue-600 dark:hover:text-blue-300"
  },
  indigo: {
    activeText: "text-indigo-700 dark:text-indigo-200",
    indicator: "bg-indigo-500/15 dark:bg-indigo-400/20 border border-indigo-400/40 dark:border-indigo-300/20",
    hover: "hover:text-indigo-600 dark:hover:text-indigo-300"
  },
  violet: {
    activeText: "text-violet-700 dark:text-violet-200",
    indicator: "bg-violet-500/15 dark:bg-violet-400/20 border border-violet-400/40 dark:border-violet-300/20",
    hover: "hover:text-violet-600 dark:hover:text-violet-300"
  },
  purple: {
    activeText: "text-purple-700 dark:text-purple-200",
    indicator: "bg-purple-500/15 dark:bg-purple-400/20 border border-purple-400/40 dark:border-purple-300/20",
    hover: "hover:text-purple-600 dark:hover:text-purple-300"
  },
  fuchsia: {
    activeText: "text-fuchsia-700 dark:text-fuchsia-200",
    indicator: "bg-fuchsia-500/15 dark:bg-fuchsia-400/20 border border-fuchsia-400/40 dark:border-fuchsia-300/20",
    hover: "hover:text-fuchsia-600 dark:hover:text-fuchsia-300"
  },
  pink: {
    activeText: "text-pink-700 dark:text-pink-200",
    indicator: "bg-pink-500/15 dark:bg-pink-400/20 border border-pink-400/40 dark:border-pink-300/20",
    hover: "hover:text-pink-600 dark:hover:text-pink-300"
  },
  rose: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  },
  slate: {
    activeText: "text-slate-700 dark:text-slate-200",
    indicator: "bg-slate-500/15 dark:bg-slate-400/20 border border-slate-400/40 dark:border-slate-300/20",
    hover: "hover:text-slate-600 dark:hover:text-slate-300"
  },
  gray: {
    activeText: "text-gray-700 dark:text-gray-200",
    indicator: "bg-gray-500/15 dark:bg-gray-400/20 border border-gray-400/40 dark:border-gray-300/20",
    hover: "hover:text-gray-600 dark:hover:text-gray-300"
  },
  zinc: {
    activeText: "text-zinc-700 dark:text-zinc-200",
    indicator: "bg-zinc-500/15 dark:bg-zinc-400/20 border border-zinc-400/40 dark:border-zinc-300/20",
    hover: "hover:text-zinc-600 dark:hover:text-zinc-300"
  },
  neutral: {
    activeText: "text-neutral-700 dark:text-neutral-200",
    indicator: "bg-neutral-500/15 dark:bg-neutral-400/20 border border-neutral-400/40 dark:border-neutral-300/20",
    hover: "hover:text-neutral-600 dark:hover:text-neutral-300"
  },
  stone: {
    activeText: "text-stone-700 dark:text-stone-200",
    indicator: "bg-stone-500/15 dark:bg-stone-400/20 border border-stone-400/40 dark:border-stone-300/20",
    hover: "hover:text-stone-600 dark:hover:text-stone-300"
  },
  white: {
    activeText: "text-slate-700 dark:text-slate-200",
    indicator: "bg-slate-400/15 dark:bg-slate-300/20 border border-slate-300/40 dark:border-slate-200/20",
    hover: "hover:text-slate-600 dark:hover:text-slate-300"
  },
  info: {
    activeText: "text-sky-700 dark:text-sky-200",
    indicator: "bg-sky-500/15 dark:bg-sky-400/20 border border-sky-400/40 dark:border-sky-300/20",
    hover: "hover:text-sky-600 dark:hover:text-sky-300"
  },
  success: {
    activeText: "text-emerald-700 dark:text-emerald-200",
    indicator: "bg-emerald-500/15 dark:bg-emerald-400/20 border border-emerald-400/40 dark:border-emerald-300/20",
    hover: "hover:text-emerald-600 dark:hover:text-emerald-300"
  },
  warning: {
    activeText: "text-yellow-700 dark:text-yellow-200",
    indicator: "bg-yellow-500/15 dark:bg-yellow-400/20 border border-yellow-400/40 dark:border-yellow-300/20",
    hover: "hover:text-yellow-600 dark:hover:text-yellow-300"
  },
  danger: {
    activeText: "text-rose-700 dark:text-rose-200",
    indicator: "bg-rose-500/15 dark:bg-rose-400/20 border border-rose-400/40 dark:border-rose-300/20",
    hover: "hover:text-rose-600 dark:hover:text-rose-300"
  }
};
var sizeTokens6 = {
  sm: {
    track: "h-8 text-xs",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2 py-1",
    gap: "gap-1",
    label: "text-xs",
    icon: "h-4 w-4",
    paddingY: "py-0.5"
  },
  md: {
    track: "h-9 text-sm",
    indicatorInset: "inset-y-[0px]",
    cell: "px-2.5 py-1.5",
    gap: "gap-1.5",
    label: "text-sm",
    icon: "h-5 w-5",
    paddingY: "py-0.5"
  },
  lg: {
    track: "h-11 text-base",
    indicatorInset: "inset-y-[0px]",
    cell: "px-3.5 py-2",
    gap: "gap-2",
    label: "text-base",
    icon: "h-6 w-6",
    paddingY: "py-0.5"
  }
};
var CONTAINER_HORIZONTAL_PADDING = 2;
var INDICATOR_MARGIN = 1;
var computeInset = (segmentWidth) => {
  if (segmentWidth <= 0) {
    return 0;
  }
  const proportional = segmentWidth / 16;
  return Math.min(INDICATOR_MARGIN, proportional);
};
var toCssDimension = (value) => {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};
var MultiToggle = ({
  options,
  value,
  onChange,
  size = "md",
  color = "blue",
  fullWidth = false,
  className,
  showOnlyActiveLabel = false,
  truncateOverflow,
  adaptiveWidth = false,
  optionMaxWidth,
  disabled,
  rounded = "lg",
  style: sharedButtonStyle,
  activeWidthStrategy = "auto",
  variant = "theme",
  accentColor,
  ...buttonProps
}) => {
  const renderIcon2 = useIconRenderer();
  const containerRef = useRef11(null);
  const optionRefs = useRef11([]);
  const measurementRefs = useRef11([]);
  const hasCustomWidths = adaptiveWidth || options.some((option) => option.width !== void 0);
  const [indicatorInlineStyle, setIndicatorInlineStyle] = useState11();
  const [maxOptionWidth, setMaxOptionWidth] = useState11();
  const parsedOptionMaxWidth = toCssDimension(optionMaxWidth);
  const shouldLockToMaxWidth = hasCustomWidths && activeWidthStrategy === "max";
  const controlRounded = rounded === "none" ? "" : rounded === "xs" ? "rounded-xs" : rounded === "sm" ? "rounded-sm" : rounded === "md" ? "rounded-md" : rounded === "lg" ? "rounded-lg" : rounded === "xl" ? "rounded-xl" : "rounded-full";
  const indicatorRounded = rounded === "none" || rounded === "xs" ? "" : rounded === "sm" ? "rounded-xs" : rounded === "md" ? "rounded-sm" : rounded === "lg" ? "rounded-md" : rounded === "xl" ? "rounded-lg" : "rounded-full";
  const optionCount = options.length ?? 0;
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const sizeStyles6 = sizeTokens6[size] ?? sizeTokens6.md;
  const colorStyles = toneTokens7[color] ?? toneTokens7.theme;
  const variantTokens = getMultiToggleVariantTokens(color);
  const isVariantMode = variant === "solid" || variant === "soft";
  const activeTextClass = accentColor ? isVariantMode ? getMultiToggleVariantTokens(accentColor).activeText : (toneTokens7[accentColor] ?? toneTokens7.theme).activeText : isVariantMode ? variantTokens.activeText : colorStyles.activeText;
  const usesSegmentLayout = !hasCustomWidths && !shouldLockToMaxWidth;
  optionRefs.current.length = optionCount;
  measurementRefs.current.length = optionCount;
  const indicatorStyle = useMemo9(() => {
    const segmentExpression = `(100% - ${CONTAINER_HORIZONTAL_PADDING * 2}px) / ${optionCount}`;
    const margin = INDICATOR_MARGIN;
    if (usesSegmentLayout) {
      return {
        width: `calc(${segmentExpression} - ${margin * 2}px)`,
        transform: `translateX(calc(${CONTAINER_HORIZONTAL_PADDING}px + ${activeIndex} * (${segmentExpression}) + ${margin}px))`
      };
    }
    const widthPercent = 100 / optionCount;
    return {
      width: `calc(${widthPercent}% - ${margin * 2}px)`,
      transform: `translateX(calc(${activeIndex} * (100% / ${optionCount}) + ${margin}px))`
    };
  }, [activeIndex, optionCount, usesSegmentLayout]);
  const updateIndicatorPosition = useCallback7(() => {
    const container = containerRef.current;
    const activeButton = optionRefs.current[activeIndex];
    if (!container || !activeButton) {
      return;
    }
    const containerStyles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
    const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
    const containerInnerWidth = Math.max(
      0,
      container.clientWidth - paddingLeft - paddingRight
    );
    if (usesSegmentLayout) {
      const segmentWidth = containerInnerWidth / optionCount;
      const inset2 = computeInset(segmentWidth);
      const indicatorWidth2 = Math.max(0, segmentWidth - inset2 * 2);
      const offset2 = paddingLeft + activeIndex * segmentWidth + inset2;
      setIndicatorInlineStyle({
        width: `${indicatorWidth2}px`,
        transform: `translateX(${offset2}px)`
      });
      return;
    }
    const baseWidth = shouldLockToMaxWidth && maxOptionWidth ? maxOptionWidth : activeButton.offsetWidth;
    const inset = computeInset(baseWidth);
    const indicatorWidth = Math.max(
      0,
      Math.min(baseWidth, containerInnerWidth) - inset * 2
    );
    let offset = activeButton.offsetLeft + inset;
    const maxOffset = Math.max(
      inset,
      container.clientWidth - indicatorWidth - inset
    );
    offset = Math.min(Math.max(offset, inset), maxOffset);
    setIndicatorInlineStyle({
      width: `${indicatorWidth}px`,
      transform: `translateX(${offset}px)`
    });
  }, [
    activeIndex,
    shouldLockToMaxWidth,
    maxOptionWidth,
    optionCount,
    usesSegmentLayout
  ]);
  const optionsSignature = useMemo9(
    () => options.map((option) => {
      const labelSignature = typeof option.label === "string" ? option.label : option.label !== void 0 ? "node" : "";
      return `${option.value}:${option.width ?? ""}:${labelSignature}`;
    }).join("|"),
    [options]
  );
  useLayoutEffect5(() => {
    if (!shouldLockToMaxWidth) {
      setMaxOptionWidth(void 0);
      return;
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const containerStyles = window.getComputedStyle(container);
    const paddingLeft = parseFloat(containerStyles?.paddingLeft ?? "0") || 0;
    const paddingRight = parseFloat(containerStyles?.paddingRight ?? "0") || 0;
    const containerInnerWidth = Math.max(
      0,
      container.clientWidth - paddingLeft - paddingRight
    );
    const widths = measurementRefs.current.map(
      (node) => node?.offsetWidth ?? 0
    );
    const largestWidth = widths.reduce(
      (currentMax, width) => width > currentMax ? width : currentMax,
      0
    );
    const constrainedWidth = Math.min(largestWidth, containerInnerWidth);
    setMaxOptionWidth(constrainedWidth || void 0);
  }, [shouldLockToMaxWidth, optionsSignature, size, optionMaxWidth]);
  useLayoutEffect5(() => {
    if (typeof window === "undefined") {
      return;
    }
    updateIndicatorPosition();
    const handleWindowResize = () => {
      updateIndicatorPosition();
    };
    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateIndicatorPosition();
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      optionRefs.current.forEach((button) => {
        if (button) {
          resizeObserver?.observe(button);
        }
      });
    }
    window.addEventListener("resize", handleWindowResize);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
      resizeObserver?.disconnect();
    };
  }, [
    optionsSignature,
    optionMaxWidth,
    updateIndicatorPosition,
    shouldLockToMaxWidth,
    maxOptionWidth
  ]);
  const shouldTruncate = truncateOverflow ?? true;
  const computedIndicatorStyle = indicatorInlineStyle ?? indicatorStyle;
  return /* @__PURE__ */ jsxs73(
    "div",
    {
      ref: containerRef,
      className: classNames28(
        "relative inline-flex select-none items-center p-0.5",
        isVariantMode ? "bg-neutral-100 dark:bg-neutral-700" : "bg-neutral-100 shadow-inner dark:bg-neutral-600",
        controlRounded,
        sizeStyles6.track,
        fullWidth && "w-full",
        disabled && "opacity-60 cursor-not-allowed",
        className
      ),
      role: "radiogroup",
      "aria-disabled": disabled,
      children: [
        /* @__PURE__ */ jsx173(
          "span",
          {
            className: classNames28(
              "pointer-events-none absolute left-0 flex items-center justify-center transition-transform duration-200 ease-out",
              sizeStyles6.indicatorInset,
              sizeStyles6.paddingY
            ),
            style: computedIndicatorStyle ?? indicatorStyle,
            children: /* @__PURE__ */ jsx173(
              "span",
              {
                className: classNames28(
                  "h-full w-full",
                  indicatorRounded,
                  variant === "solid" && "bg-white dark:bg-neutral-800 shadow-sm",
                  variant === "soft" && variantTokens.softIndicator,
                  variant === "theme" && colorStyles.indicator
                )
              }
            )
          }
        ),
        shouldLockToMaxWidth && /* @__PURE__ */ jsx173(
          "div",
          {
            "aria-hidden": true,
            style: {
              position: "absolute",
              visibility: "hidden",
              pointerEvents: "none",
              whiteSpace: "nowrap",
              height: 0,
              overflow: "hidden"
            },
            children: options.map((option, index) => {
              const measurementStyle = {};
              if (option.width && option.width !== "auto") {
                const targetWidth = toCssDimension(option.width);
                if (targetWidth) {
                  measurementStyle.width = targetWidth;
                }
              }
              if (parsedOptionMaxWidth) {
                measurementStyle.maxWidth = parsedOptionMaxWidth;
              }
              return /* @__PURE__ */ jsx173(
                "div",
                {
                  ref: (node) => {
                    measurementRefs.current[index] = node;
                  },
                  className: classNames28(
                    "inline-flex min-w-0 items-center justify-center rounded-full",
                    sizeStyles6.cell,
                    sizeStyles6.gap
                  ),
                  style: measurementStyle,
                  children: /* @__PURE__ */ jsxs73(
                    "span",
                    {
                      className: classNames28(
                        "flex min-w-0 items-center justify-center",
                        sizeStyles6.gap
                      ),
                      children: [
                        option.icon && renderIcon2(option.icon, size, sizeStyles6.icon),
                        option.label && /* @__PURE__ */ jsx173("span", { className: classNames28(sizeStyles6.label, "min-w-0"), children: option.label })
                      ]
                    }
                  )
                },
                `measure-${option.value}`
              );
            })
          }
        ),
        options.map((option, index) => {
          const isActive = option.value == value;
          const optionDisabled = disabled || option.disabled;
          const applyCustomWidth = hasCustomWidths && (!showOnlyActiveLabel || isActive);
          const customWidthValue = option.width !== void 0 ? option.width : adaptiveWidth && applyCustomWidth ? "auto" : void 0;
          let buttonStyle;
          if (applyCustomWidth) {
            buttonStyle = {
              flex: "0 1 auto",
              minWidth: 0
            };
            if (customWidthValue && customWidthValue !== "auto") {
              const targetWidth = toCssDimension(customWidthValue);
              if (targetWidth) {
                buttonStyle.flex = "0 0 auto";
                buttonStyle.width = targetWidth;
              }
            }
            if (parsedOptionMaxWidth) {
              buttonStyle.maxWidth = parsedOptionMaxWidth;
            }
          }
          if (shouldLockToMaxWidth && isActive && maxOptionWidth) {
            if (!buttonStyle) {
              buttonStyle = {
                flex: "0 0 auto",
                minWidth: 0
              };
            } else {
              buttonStyle.flex = "0 0 auto";
            }
            buttonStyle.width = `${maxOptionWidth}px`;
            if (parsedOptionMaxWidth) {
              buttonStyle.maxWidth = parsedOptionMaxWidth;
            }
          }
          const mergedStyle = sharedButtonStyle || buttonStyle ? {
            ...sharedButtonStyle ?? {},
            ...buttonStyle ?? {}
          } : void 0;
          return /* @__PURE__ */ jsx173(
            "button",
            {
              ref: (node) => {
                optionRefs.current[index] = node;
              },
              type: "button",
              className: classNames28(
                "relative z-[1] flex min-w-0 items-center justify-center transition-colors duration-150",
                controlRounded,
                sizeStyles6.cell,
                sizeStyles6.gap,
                hasCustomWidths ? "flex-none" : "flex-1",
                optionDisabled ? "text-neutral-400 dark:text-neutral-500 cursor-not-allowed" : classNames28(
                  "cursor-pointer",
                  isActive ? activeTextClass : "text-neutral-600 dark:text-neutral-300",
                  isVariantMode ? variantTokens.hover : colorStyles.hover
                )
              ),
              onClick: () => {
                if (optionDisabled || option.value === value) {
                  return;
                }
                onChange(option.value);
              },
              disabled: optionDisabled,
              "aria-pressed": isActive,
              role: "radio",
              "aria-checked": isActive,
              tabIndex: optionDisabled ? -1 : isActive ? 0 : -1,
              style: mergedStyle,
              ...buttonProps,
              children: /* @__PURE__ */ jsxs73(
                "span",
                {
                  className: classNames28(
                    "flex min-w-0 items-center justify-center",
                    sizeStyles6.gap
                  ),
                  children: [
                    option.icon && renderIcon2(option.icon, size, sizeStyles6.icon),
                    option.label && (!showOnlyActiveLabel || isActive) && /* @__PURE__ */ jsx173(
                      "span",
                      {
                        className: classNames28(
                          sizeStyles6.label,
                          "min-w-0 px-1 text-center leading-tight block",
                          shouldTruncate ? "truncate" : "whitespace-nowrap"
                        ),
                        title: shouldTruncate && typeof option.label === "string" ? option.label : void 0,
                        children: option.label
                      }
                    )
                  ]
                }
              )
            },
            option.value
          );
        })
      ]
    }
  );
};
MultiToggle.displayName = "MultiToggle";

// src/components/ButtonSelector.tsx
import { useId as useId4 } from "react";
import classNames29 from "classnames";
import { jsx as jsx174, jsxs as jsxs74 } from "react/jsx-runtime";

// src/components/FormField.tsx
import classNames30 from "classnames";
import React24, { useId as useId5 } from "react";
import { jsx as jsx175, jsxs as jsxs75 } from "react/jsx-runtime";

// src/components/FormLayout.tsx
import classNames31 from "classnames";
import { jsx as jsx176 } from "react/jsx-runtime";

// src/components/FormSection.tsx
import classNames32 from "classnames";
import { jsx as jsx177, jsxs as jsxs76 } from "react/jsx-runtime";

// src/components/InputGroup.tsx
import classNames33 from "classnames";
import React25, {
  isValidElement
} from "react";
import { jsx as jsx178, jsxs as jsxs77 } from "react/jsx-runtime";

// src/components/MultiSelectPills.tsx
import React26, { useEffect as useEffect8, useId as useId6, useMemo as useMemo10, useState as useState12 } from "react";
import { jsx as jsx179, jsxs as jsxs78 } from "react/jsx-runtime";
var sizeMap2 = {
  xs: { text: "text-xs", padding: "px-2 py-1" },
  sm: { text: "text-sm", padding: "px-3 py-1.5" },
  base: { text: "text-base", padding: "px-4 py-2" },
  lg: { text: "text-lg", padding: "px-5 py-2.5" }
};
var roundedMap2 = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full"
};
var gapMap = {
  "1": "gap-1",
  "1.5": "gap-1.5",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4"
};
var colorTokens = {
  parallels: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  },
  brand: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  },
  theme: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  },
  red: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  },
  orange: {
    selected: "border-orange-500 bg-orange-500 text-white dark:bg-orange-500 dark:border-orange-500",
    ring: "focus-visible:ring-orange-400"
  },
  amber: {
    selected: "border-amber-500 bg-amber-500 text-white dark:bg-amber-400 dark:border-amber-400",
    ring: "focus-visible:ring-amber-400"
  },
  yellow: {
    selected: "border-yellow-500 bg-yellow-500 text-white dark:bg-yellow-400 dark:border-yellow-400",
    ring: "focus-visible:ring-yellow-400"
  },
  lime: {
    selected: "border-lime-500 bg-lime-500 text-white dark:bg-lime-500 dark:border-lime-500",
    ring: "focus-visible:ring-lime-400"
  },
  green: {
    selected: "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400"
  },
  emerald: {
    selected: "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400"
  },
  teal: {
    selected: "border-teal-500 bg-teal-500 text-white dark:bg-teal-500 dark:border-teal-500",
    ring: "focus-visible:ring-teal-400"
  },
  cyan: {
    selected: "border-cyan-500 bg-cyan-500 text-white dark:bg-cyan-500 dark:border-cyan-500",
    ring: "focus-visible:ring-cyan-400"
  },
  sky: {
    selected: "border-sky-500 bg-sky-500 text-white dark:bg-sky-500 dark:border-sky-500",
    ring: "focus-visible:ring-sky-400"
  },
  blue: {
    selected: "border-blue-500 bg-blue-500 text-white dark:bg-blue-500 dark:border-blue-500",
    ring: "focus-visible:ring-blue-400"
  },
  indigo: {
    selected: "border-indigo-600 bg-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500",
    ring: "focus-visible:ring-indigo-400"
  },
  violet: {
    selected: "border-violet-500 bg-violet-500 text-white dark:bg-violet-500 dark:border-violet-500",
    ring: "focus-visible:ring-violet-400"
  },
  purple: {
    selected: "border-purple-500 bg-purple-500 text-white dark:bg-purple-500 dark:border-purple-500",
    ring: "focus-visible:ring-purple-400"
  },
  fuchsia: {
    selected: "border-fuchsia-500 bg-fuchsia-500 text-white dark:bg-fuchsia-500 dark:border-fuchsia-500",
    ring: "focus-visible:ring-fuchsia-400"
  },
  pink: {
    selected: "border-pink-500 bg-pink-500 text-white dark:bg-pink-500 dark:border-pink-500",
    ring: "focus-visible:ring-pink-400"
  },
  rose: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  },
  slate: {
    selected: "border-slate-600 bg-slate-600 text-white dark:bg-slate-500 dark:border-slate-500",
    ring: "focus-visible:ring-slate-400"
  },
  gray: {
    selected: "border-gray-600 bg-gray-600 text-white dark:bg-gray-500 dark:border-gray-500",
    ring: "focus-visible:ring-gray-400"
  },
  zinc: {
    selected: "border-zinc-600 bg-zinc-600 text-white dark:bg-zinc-500 dark:border-zinc-500",
    ring: "focus-visible:ring-zinc-400"
  },
  neutral: {
    selected: "border-neutral-600 bg-neutral-600 text-white dark:bg-neutral-500 dark:border-neutral-500",
    ring: "focus-visible:ring-neutral-400"
  },
  stone: {
    selected: "border-stone-600 bg-stone-600 text-white dark:bg-stone-500 dark:border-stone-500",
    ring: "focus-visible:ring-stone-400"
  },
  white: {
    selected: "border-slate-400 bg-slate-100 text-slate-700 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200",
    ring: "focus-visible:ring-slate-300"
  },
  info: {
    selected: "border-sky-500 bg-sky-500 text-white dark:bg-sky-500 dark:border-sky-500",
    ring: "focus-visible:ring-sky-400"
  },
  success: {
    selected: "border-emerald-600 bg-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500",
    ring: "focus-visible:ring-emerald-400"
  },
  warning: {
    selected: "border-amber-500 bg-amber-500 text-white dark:bg-amber-400 dark:border-amber-400",
    ring: "focus-visible:ring-amber-400"
  },
  danger: {
    selected: "border-rose-500 bg-rose-500 text-white dark:bg-rose-500 dark:border-rose-500",
    ring: "focus-visible:ring-rose-400"
  }
};
var MultiSelectPills = ({
  name,
  options,
  legend,
  description,
  value,
  defaultValue = [],
  onChange,
  className,
  disabled = false,
  size = "sm",
  color = "blue",
  rounded = "full",
  gap = "2",
  selectionMode = "multiple"
}) => {
  const generatedId = useId6();
  const isControlled = value !== void 0;
  const [internalSelected, setInternalSelected] = useState12(defaultValue);
  useEffect8(() => {
    if (!isControlled) return;
    setInternalSelected(value ?? []);
  }, [isControlled, value]);
  useEffect8(() => {
    if (isControlled) return;
    setInternalSelected(defaultValue);
  }, [defaultValue, isControlled]);
  const selectedValues = useMemo10(
    () => isControlled ? value ?? [] : internalSelected,
    [isControlled, value, internalSelected]
  );
  const selectedSet = useMemo10(() => new Set(selectedValues), [selectedValues]);
  const sizeClasses2 = sizeMap2[size];
  const roundedClass = roundedMap2[rounded];
  const gapClass = gapMap[gap];
  const colorClasses = colorTokens[color] ?? colorTokens.blue;
  const handleToggle = (optionValue, optionDisabled) => {
    if (disabled || optionDisabled) return;
    const isAlreadySelected = selectedSet.has(optionValue);
    let nextSelected;
    if (selectionMode === "single") {
      nextSelected = isAlreadySelected ? [] : [optionValue];
    } else {
      nextSelected = isAlreadySelected ? selectedValues.filter((item) => item !== optionValue) : [...selectedValues, optionValue];
    }
    if (!isControlled) setInternalSelected(nextSelected);
    onChange?.(nextSelected);
  };
  return /* @__PURE__ */ jsxs78(
    "fieldset",
    {
      className: ["flex flex-col", className ?? ""].filter(Boolean).join(" "),
      disabled,
      children: [
        legend && /* @__PURE__ */ jsx179(
          "legend",
          {
            className: `text-sm font-medium text-neutral-800 dark:text-neutral-200 ${!description ? "pb-3" : ""}`,
            children: legend
          }
        ),
        description && /* @__PURE__ */ jsx179("p", { className: "text-xs text-neutral-500 dark:text-neutral-400 pb-2", children: description }),
        /* @__PURE__ */ jsx179("div", { className: `flex flex-wrap ${gapClass}`, children: options.map((option, index) => {
          const optionId = `${generatedId}-${name}-${index}`;
          const isSelected = selectedSet.has(option.value);
          const isOptionDisabled = option.disabled ?? false;
          return /* @__PURE__ */ jsxs78(React26.Fragment, { children: [
            /* @__PURE__ */ jsx179(
              "input",
              {
                type: "checkbox",
                id: optionId,
                name: `${name}[]`,
                value: option.value,
                checked: isSelected,
                readOnly: true,
                className: "sr-only",
                tabIndex: -1
              }
            ),
            /* @__PURE__ */ jsxs78(
              "button",
              {
                type: "button",
                onClick: () => handleToggle(option.value, option.disabled),
                className: [
                  "inline-flex items-center border font-medium transition focus:outline-none focus-visible:ring-2",
                  sizeClasses2.text,
                  sizeClasses2.padding,
                  roundedClass,
                  isSelected ? colorClasses.selected : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:border-neutral-600",
                  disabled || isOptionDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                  colorClasses.ring
                ].filter(Boolean).join(" "),
                "aria-pressed": isSelected,
                "aria-disabled": disabled || isOptionDisabled,
                disabled: disabled || isOptionDisabled,
                children: [
                  option.label,
                  option.description && /* @__PURE__ */ jsx179("span", { className: "ml-2 text-xs text-neutral-500 dark:text-neutral-400", children: option.description })
                ]
              }
            )
          ] }, option.value);
        }) })
      ]
    }
  );
};
MultiSelectPills.displayName = "MultiSelectPills";

// src/components/SearchBar.tsx
import { useCallback as useCallback8, useEffect as useEffect9, useRef as useRef12, useState as useState13 } from "react";
import classNames34 from "classnames";
import { jsx as jsx180, jsxs as jsxs79 } from "react/jsx-runtime";
var COLOR_TOKENS = {
  blue: {
    border: "focus-within:border-blue-500",
    ring: "focus-within:ring-blue-400/40",
    icon: "group-focus-within:text-blue-500",
    btnHover: "hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/40 dark:hover:text-blue-400"
  },
  indigo: {
    border: "focus-within:border-indigo-500",
    ring: "focus-within:ring-indigo-400/40",
    icon: "group-focus-within:text-indigo-500",
    btnHover: "hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-indigo-900/40 dark:hover:text-indigo-400"
  },
  violet: {
    border: "focus-within:border-violet-500",
    ring: "focus-within:ring-violet-400/40",
    icon: "group-focus-within:text-violet-500",
    btnHover: "hover:bg-violet-100 hover:text-violet-600 dark:hover:bg-violet-900/40 dark:hover:text-violet-400"
  },
  purple: {
    border: "focus-within:border-purple-500",
    ring: "focus-within:ring-purple-400/40",
    icon: "group-focus-within:text-purple-500",
    btnHover: "hover:bg-purple-100 hover:text-purple-600 dark:hover:bg-purple-900/40 dark:hover:text-purple-400"
  },
  fuchsia: {
    border: "focus-within:border-fuchsia-500",
    ring: "focus-within:ring-fuchsia-400/40",
    icon: "group-focus-within:text-fuchsia-500",
    btnHover: "hover:bg-fuchsia-100 hover:text-fuchsia-600 dark:hover:bg-fuchsia-900/40 dark:hover:text-fuchsia-400"
  },
  pink: {
    border: "focus-within:border-pink-500",
    ring: "focus-within:ring-pink-400/40",
    icon: "group-focus-within:text-pink-500",
    btnHover: "hover:bg-pink-100 hover:text-pink-600 dark:hover:bg-pink-900/40 dark:hover:text-pink-400"
  },
  rose: {
    border: "focus-within:border-rose-500",
    ring: "focus-within:ring-rose-400/40",
    icon: "group-focus-within:text-rose-500",
    btnHover: "hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 dark:hover:text-rose-400"
  },
  red: {
    border: "focus-within:border-red-500",
    ring: "focus-within:ring-red-400/40",
    icon: "group-focus-within:text-red-500",
    btnHover: "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/40 dark:hover:text-red-400"
  },
  orange: {
    border: "focus-within:border-orange-500",
    ring: "focus-within:ring-orange-400/40",
    icon: "group-focus-within:text-orange-500",
    btnHover: "hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-900/40 dark:hover:text-orange-400"
  },
  amber: {
    border: "focus-within:border-amber-500",
    ring: "focus-within:ring-amber-400/40",
    icon: "group-focus-within:text-amber-500",
    btnHover: "hover:bg-amber-100 hover:text-amber-600 dark:hover:bg-amber-900/40 dark:hover:text-amber-400"
  },
  yellow: {
    border: "focus-within:border-yellow-500",
    ring: "focus-within:ring-yellow-400/40",
    icon: "group-focus-within:text-yellow-500",
    btnHover: "hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-900/40 dark:hover:text-yellow-400"
  },
  lime: {
    border: "focus-within:border-lime-500",
    ring: "focus-within:ring-lime-400/40",
    icon: "group-focus-within:text-lime-500",
    btnHover: "hover:bg-lime-100 hover:text-lime-600 dark:hover:bg-lime-900/40 dark:hover:text-lime-400"
  },
  green: {
    border: "focus-within:border-green-500",
    ring: "focus-within:ring-green-400/40",
    icon: "group-focus-within:text-green-500",
    btnHover: "hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/40 dark:hover:text-green-400"
  },
  emerald: {
    border: "focus-within:border-emerald-500",
    ring: "focus-within:ring-emerald-400/40",
    icon: "group-focus-within:text-emerald-500",
    btnHover: "hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400"
  },
  teal: {
    border: "focus-within:border-teal-500",
    ring: "focus-within:ring-teal-400/40",
    icon: "group-focus-within:text-teal-500",
    btnHover: "hover:bg-teal-100 hover:text-teal-600 dark:hover:bg-teal-900/40 dark:hover:text-teal-400"
  },
  cyan: {
    border: "focus-within:border-cyan-500",
    ring: "focus-within:ring-cyan-400/40",
    icon: "group-focus-within:text-cyan-500",
    btnHover: "hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/40 dark:hover:text-cyan-400"
  },
  sky: {
    border: "focus-within:border-sky-500",
    ring: "focus-within:ring-sky-400/40",
    icon: "group-focus-within:text-sky-500",
    btnHover: "hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/40 dark:hover:text-sky-400"
  },
  slate: {
    border: "focus-within:border-slate-500",
    ring: "focus-within:ring-slate-400/40",
    icon: "group-focus-within:text-slate-500",
    btnHover: "hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
  },
  gray: {
    border: "focus-within:border-gray-500",
    ring: "focus-within:ring-gray-400/40",
    icon: "group-focus-within:text-gray-500",
    btnHover: "hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
  }
};
var DEFAULT_TOKENS = COLOR_TOKENS.blue;
function getTokens(color) {
  return COLOR_TOKENS[color] ?? DEFAULT_TOKENS;
}
var GRADIENT_MAP = {
  blue: ["#2563eb", "#60a5fa"],
  indigo: ["#4f46e5", "#818cf8"],
  violet: ["#7c3aed", "#a78bfa"],
  purple: ["#9333ea", "#c084fc"],
  fuchsia: ["#c026d3", "#e879f9"],
  pink: ["#db2777", "#f472b6"],
  rose: ["#e11d48", "#fb7185"],
  red: ["#dc2626", "#f87171"],
  orange: ["#ea580c", "#fb923c"],
  amber: ["#d97706", "#fbbf24"],
  yellow: ["#ca8a04", "#facc15"],
  lime: ["#65a30d", "#a3e635"],
  green: ["#16a34a", "#4ade80"],
  emerald: ["#059669", "#34d399"],
  teal: ["#0d9488", "#2dd4bf"],
  cyan: ["#0891b2", "#22d3ee"],
  sky: ["#0284c7", "#38bdf8"],
  slate: ["#475569", "#94a3b8"],
  gray: ["#4b5563", "#9ca3af"],
  zinc: ["#52525b", "#a1a1aa"],
  neutral: ["#525252", "#a3a3a3"],
  stone: ["#57534e", "#a8a29e"]
};
function resolveGradient(color, from, to) {
  const pair = GRADIENT_MAP[color] ?? GRADIENT_MAP.blue;
  return [from ?? pair[0], to ?? pair[1]];
}
var SearchBar = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  debounceMs = 400,
  autoSearch = true,
  className,
  disabled = false,
  initialValue = "",
  shouldClear = false,
  leadingIcon = "Search",
  variant = "default",
  color = "blue",
  gradientFrom,
  gradientTo,
  glowIntensity = "soft"
}) => {
  const [resolvedFrom, resolvedTo] = resolveGradient(
    color,
    gradientFrom,
    gradientTo
  );
  const glowConfig = {
    subtle: {
      inset: "-inset-px",
      blur: "blur-sm",
      idleOpacity: 0.06,
      focusOpacity: 0.14
    },
    soft: {
      inset: "-inset-0.5",
      blur: "blur-sm",
      idleOpacity: 0.1,
      focusOpacity: 0.22
    },
    medium: {
      inset: "-inset-0.5",
      blur: "blur",
      idleOpacity: 0.2,
      focusOpacity: 0.4
    },
    strong: {
      inset: "-inset-1",
      blur: "blur-md",
      idleOpacity: 0.3,
      focusOpacity: 0.55
    }
  };
  const glow = glowConfig[glowIntensity];
  const tokens = getTokens(color);
  const renderIcon2 = useIconRenderer();
  const [query, setQuery] = useState13(initialValue);
  const [focused, setFocused] = useState13(false);
  const debounceRef = useRef12(null);
  const abortRef = useRef12(null);
  const inputRef = useRef12(null);
  const generationRef = useRef12(0);
  const onSearchRef = useRef12(onSearch);
  useEffect9(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);
  const clearPendingSearch = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };
  const triggerSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) {
      onSearchRef.current("");
      return;
    }
    abortRef.current = new AbortController();
    onSearchRef.current(trimmed, abortRef.current?.signal);
  };
  useEffect9(() => {
    if (!autoSearch) {
      return void 0;
    }
    clearPendingSearch();
    if (!query.trim()) {
      onSearchRef.current("");
      return void 0;
    }
    const myGeneration = ++generationRef.current;
    debounceRef.current = setTimeout(() => {
      if (myGeneration !== generationRef.current) {
        return;
      }
      triggerSearch(query);
    }, debounceMs);
    return () => clearPendingSearch();
  }, [query, autoSearch, debounceMs]);
  const handleInput = useCallback8(
    (event) => {
      setQuery(event.target.value);
      if (!event.target.value) {
        clearPendingSearch();
        onSearchRef.current("");
      }
    },
    []
  );
  const handleClear = useCallback8(() => {
    clearPendingSearch();
    setQuery("");
    onClear?.();
    inputRef.current?.focus();
  }, [onClear]);
  useEffect9(() => {
    if (shouldClear) {
      handleClear();
    }
  }, [shouldClear, handleClear]);
  const handleKeyDown = useCallback8(
    (event) => {
      if (event.key === "Escape") {
        handleClear();
      }
      if (event.key === "Enter") {
        clearPendingSearch();
        generationRef.current += 1;
        triggerSearch(event.currentTarget.value);
      }
    },
    [handleClear]
  );
  const showClear = !!(query && !disabled);
  const clearBtn = showClear ? /* @__PURE__ */ jsx180(
    "button",
    {
      type: "button",
      onClick: handleClear,
      className: classNames34(
        "absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition",
        "focus-visible:outline-none focus-visible:ring-2",
        tokens.ring.replace("focus-within:", "focus-visible:"),
        "bg-slate-200/80 text-slate-400 dark:bg-slate-700/80 dark:text-slate-400",
        tokens.btnHover
      ),
      "aria-label": "Clear search",
      children: renderIcon2("Close", "xs")
    }
  ) : null;
  const clearBtnGradient = showClear ? /* @__PURE__ */ jsx180(
    "button",
    {
      type: "button",
      onClick: handleClear,
      className: classNames34(
        "absolute right-3 top-1/2 -translate-y-1/2 inline-flex h-5 w-5 items-center justify-center rounded-full transition",
        "focus-visible:outline-none focus-visible:ring-2",
        tokens.ring.replace("focus-within:", "focus-visible:"),
        "bg-slate-200 text-slate-500",
        tokens.btnHover
      ),
      "aria-label": "Clear search",
      children: renderIcon2("Close", "xs")
    }
  ) : null;
  if (variant === "gradient") {
    return /* @__PURE__ */ jsxs79("div", { className: classNames34("relative w-full group", className), children: [
      /* @__PURE__ */ jsx180(
        "div",
        {
          className: classNames34(
            "absolute rounded-2xl transition-opacity duration-500 leading-none",
            glow.inset,
            glow.blur
          ),
          style: {
            background: `linear-gradient(to right, ${resolvedFrom}, ${resolvedTo})`,
            opacity: focused ? glow.focusOpacity : glow.idleOpacity
          },
          "aria-hidden": true
        }
      ),
      /* @__PURE__ */ jsxs79("div", { className: "relative flex w-full items-center rounded-xl bg-white/80 backdrop-blur-xl border border-white/20 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition", children: [
        /* @__PURE__ */ jsx180(
          "span",
          {
            className: classNames34(
              "mr-2 inline-flex hrink-0 items-center text-slate-400 transition-colors",
              tokens.icon
            ),
            children: renderIcon2(leadingIcon, "xs")
          }
        ),
        /* @__PURE__ */ jsx180(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: query,
            onChange: handleInput,
            onKeyDown: handleKeyDown,
            onFocus: () => setFocused(true),
            onBlur: () => setFocused(false),
            placeholder,
            disabled,
            className: "text-sm flex-1 border-none bg-transparent text-slate-900 placeholder-slate-400 outline-none leading-5"
          }
        ),
        clearBtnGradient
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs79(
    "div",
    {
      className: classNames34(
        "group relative flex w-full items-center rounded-lg border border-slate-200/80 bg-white/80 px-3 py-1.5 shadow-sm transition",
        "focus-within:ring-2",
        tokens.border,
        tokens.ring,
        "dark:border-slate-700/60 dark:bg-slate-900/60",
        disabled && "opacity-60",
        className
      ),
      children: [
        /* @__PURE__ */ jsx180("span", { className: "mr-2 inline-flex shrink-0 items-center text-slate-400 dark:text-slate-500", children: renderIcon2(leadingIcon, "sm") }),
        /* @__PURE__ */ jsx180(
          "input",
          {
            ref: inputRef,
            type: "text",
            value: query,
            onChange: handleInput,
            onKeyDown: handleKeyDown,
            placeholder,
            disabled,
            className: "flex-1 border-none bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-200 dark:placeholder-slate-500"
          }
        ),
        clearBtn
      ]
    }
  );
};
var SearchBar_default = SearchBar;

// src/components/TruncatedText.tsx
import { useEffect as useEffect10, useRef as useRef13, useState as useState14 } from "react";
import { jsx as jsx181 } from "react/jsx-runtime";

// src/components/InfoRow.tsx
import { useRef as useRef14, useState as useState15 } from "react";
import classNames35 from "classnames";
import { jsx as jsx182, jsxs as jsxs80 } from "react/jsx-runtime";

// src/components/SectionCard.tsx
import classNames36 from "classnames";
import { jsx as jsx183, jsxs as jsxs81 } from "react/jsx-runtime";
var variantStyles2 = {
  glass: [
    "bg-white/95 dark:bg-neutral-900/90",
    "backdrop-blur-xl",
    "border border-neutral-200 dark:border-neutral-800",
    "rounded-xl"
  ].join(" "),
  elevated: [
    "bg-white dark:bg-neutral-900",
    "border border-neutral-200 dark:border-neutral-800",
    "shadow-sm",
    "rounded-xl"
  ].join(" "),
  subtle: ["bg-neutral-50 dark:bg-neutral-800/50", "rounded-xl"].join(" "),
  flat: ""
};

// src/components/PagedPanel.tsx
import { useState as useState16 } from "react";
import classNames38 from "classnames";

// src/components/Panel.tsx
import classNames37 from "classnames";
import { Fragment as Fragment8, jsx as jsx184, jsxs as jsxs82 } from "react/jsx-runtime";
var variantBaseStyles = {
  elevated: "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 text-neutral-900 dark:text-neutral-100",
  outlined: "bg-white/90 text-neutral-900 ring-1 dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/10",
  subtle: "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  tonal: "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  default: "bg-white/80 backdrop-blur-xl text-neutral-900 shadow-2xl ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  glass: "backdrop-blur-xl text-neutral-900 ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  simple: "text-neutral-900  ring-transparent dark:text-neutral-100 dark:ring-white/5"
};
var paddingStyles2 = {
  none: "p-0",
  xs: "p-2 sm:p-3",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10"
};
var cornerStyles = {
  rounded: "rounded-sm",
  "rounded-sm": "rounded-lg",
  "rounded-md": "rounded-2xl",
  "rounded-lg": "rounded-3xl",
  "rounded-full": "rounded-full",
  pill: "rounded-3xl",
  none: "rounded-none"
};
var actionButtonWidth = {
  auto: "w-full sm:w-auto",
  stacked: "w-full",
  inline: "w-auto"
};
var actionWrapperLayout = {
  auto: "flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center",
  stacked: "flex-col gap-3",
  inline: "flex-wrap items-center gap-3"
};
var defaultActionColor = "theme";
var Panel = ({
  title,
  subtitle,
  description,
  badge,
  media,
  mediaPlacement = "top",
  actions,
  actionLayout = "auto",
  variant = "elevated",
  tone = "neutral",
  padding = "md",
  corner = "rounded-sm",
  fullWidth,
  maxWidth,
  minHeight,
  className,
  bodyClassName,
  bodyStyle,
  style,
  children,
  loading = false,
  disabled = false,
  flexBody = false,
  loaderType = "spinner",
  loaderTitle,
  loaderMessage,
  loaderProgress,
  loaderColor,
  hoverShadow = false,
  decoration = "none",
  hoverable,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
  color,
  hoverColor,
  borderColor,
  backgroundColor,
  scrollable = true,
  ...rest
}) => {
  const palette = getPanelToneStyles(tone);
  const colorPalette = color ? getPanelToneStyles(color) : palette;
  const isHoverable = hoverable ?? Boolean(rest.onClick);
  const effectiveHoverColor = hoverColor ?? (color && color !== "neutral" ? color : void 0);
  const hoverColorName = effectiveHoverColor ? resolveColor(effectiveHoverColor) : void 0;
  const borderPalette = borderColor ? getPanelToneStyles(borderColor) : void 0;
  const effectiveBorderClass = borderPalette?.border;
  const bgPalette = backgroundColor ? getPanelToneStyles(backgroundColor) : void 0;
  const effectiveBgClass = (() => {
    if (!backgroundColor) return void 0;
    if (backgroundColor === "white") return "bg-white dark:bg-neutral-900";
    if (bgPalette) {
      if (variant === "glass") return bgPalette.glassBg;
      if (variant === "subtle") return bgPalette.subtleBg;
      if (variant === "simple") return bgPalette.tonalBg;
      if (variant === "tonal") return bgPalette.tonalBg;
      return bgPalette.tonalBg;
    }
    return void 0;
  })();
  const isOverlay = mediaPlacement === "overlay" && Boolean(media);
  const hasMedia = Boolean(media);
  const showDecorationGradient = !isOverlay && (decoration === "gradient" || decoration === "both");
  const showDecorationShapes = !isOverlay && (decoration === "shapes" || decoration === "both");
  const resolvedStyle = (() => {
    const styles = { ...style };
    if (maxWidth !== void 0) {
      styles.maxWidth = typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth;
    }
    if (minHeight !== void 0) {
      styles.minHeight = typeof minHeight === "number" ? `${minHeight}px` : minHeight;
    }
    return styles;
  })();
  const variantClasses2 = (() => {
    switch (variant) {
      case "outlined":
        return classNames37(
          variantBaseStyles.outlined,
          effectiveBorderClass ?? palette.border
        );
      case "subtle":
        return classNames37(
          variantBaseStyles.subtle,
          effectiveBorderClass ?? palette.border,
          effectiveBgClass ?? palette.subtleBg
        );
      case "tonal":
        return classNames37(
          variantBaseStyles.tonal,
          effectiveBgClass ?? palette.tonalBg,
          effectiveBorderClass
        );
      case "default":
        return classNames37(
          variantBaseStyles.default,
          effectiveBorderClass ?? "border border-white/40"
        );
      case "glass":
        return classNames37(
          variantBaseStyles.glass,
          "border",
          effectiveBorderClass ?? colorPalette.glassBorder,
          effectiveBgClass ?? palette.glassBg
        );
      case "simple":
        return classNames37(
          variantBaseStyles.simple,
          effectiveBgClass ?? palette.tonalBg,
          effectiveBorderClass
        );
      case "elevated":
        return classNames37(
          !effectiveBgClass && variantBaseStyles.elevated,
          effectiveBgClass && "text-neutral-900 shadow-xl ring-1 ring-black/5 dark:text-neutral-100 dark:ring-white/10",
          effectiveBorderClass,
          effectiveBgClass
        );
      default:
        return classNames37(
          !effectiveBgClass && variantBaseStyles.elevated,
          effectiveBgClass && "text-neutral-900 shadow-xl ring-1 ring-black/5 dark:text-neutral-100 dark:ring-white/10",
          effectiveBorderClass,
          effectiveBgClass
        );
    }
  })();
  const overlayClasses = isOverlay ? "relative overflow-hidden text-white shadow-xl ring-0" : void 0;
  const headingClass = isOverlay ? "text-white" : palette.heading;
  const subtitleClass = isOverlay ? "text-white/80" : palette.muted;
  const descriptionClass = isOverlay ? "text-white/75" : palette.muted;
  const badgeNode = typeof badge === "string" ? /* @__PURE__ */ jsx184(
    "span",
    {
      className: classNames37(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-wide",
        isOverlay ? "bg-white/15 text-white/90 backdrop-blur-sm" : palette.badge
      ),
      children: badge
    }
  ) : badge;
  const titleNode = typeof title === "string" ? /* @__PURE__ */ jsx184(
    "h3",
    {
      className: classNames37(
        "text-xl font-semibold leading-7",
        headingClass,
        titleClassName
      ),
      children: title
    }
  ) : title;
  const subtitleNode = typeof subtitle === "string" ? /* @__PURE__ */ jsx184(
    "p",
    {
      className: classNames37(
        "text-base font-medium leading-6",
        subtitleClass,
        subtitleClassName
      ),
      children: subtitle
    }
  ) : subtitle;
  const descriptionNode = typeof description === "string" ? /* @__PURE__ */ jsx184(
    "p",
    {
      className: classNames37(
        "text-sm leading-6",
        descriptionClass,
        descriptionClassName
      ),
      children: description
    }
  ) : description;
  const headerSection = badgeNode || titleNode || subtitleNode || descriptionNode ? /* @__PURE__ */ jsxs82("div", { className: `space-y-3${flexBody ? " flex flex-col" : ""}`, children: [
    badge && /* @__PURE__ */ jsx184("div", { children: badgeNode }),
    title && /* @__PURE__ */ jsx184("div", { className: "space-y-2", children: titleNode }),
    subtitle && /* @__PURE__ */ jsx184("div", { children: subtitleNode }),
    description && /* @__PURE__ */ jsx184("div", { children: descriptionNode })
  ] }) : null;
  const bodyContent = children ? /* @__PURE__ */ jsx184(
    "div",
    {
      className: classNames37(
        padding === "none" ? "" : "space-y-3 leading-6",
        flexBody ? "flex-1 flex flex-col w-full" : "",
        isOverlay ? "text-white/80" : "text-neutral-700 dark:text-neutral-300",
        bodyClassName
      ),
      style: bodyStyle,
      children
    }
  ) : null;
  const bodySection = bodyContent ? /* @__PURE__ */ jsx184(
    "div",
    {
      className: classNames37(
        flexBody ? "flex-1 flex flex-col w-full" : "",
        "min-h-0 flex-1",
        scrollable ? "overflow-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent" : "",
        padding === "none" ? "" : "pr-1"
      ),
      children: bodyContent
    }
  ) : null;
  const actionsSection = actions && actions.length > 0 ? /* @__PURE__ */ jsx184(
    "div",
    {
      className: classNames37(
        "flex pt-3",
        actionWrapperLayout[actionLayout],
        bodySection ? "mt-auto" : "mt-4"
      ),
      children: actions.map((action, index) => {
        const {
          id,
          label,
          className: actionClassName,
          color: color2,
          size,
          ...buttonProps
        } = action;
        const key = id ?? `${index}`;
        const responsiveWidth = actionButtonWidth[actionLayout];
        return /* @__PURE__ */ jsx184(
          Button_default,
          {
            color: color2 ?? defaultActionColor,
            size: size ?? "md",
            className: classNames37(responsiveWidth, actionClassName),
            ...buttonProps,
            children: label
          },
          key
        );
      })
    }
  ) : null;
  const mediaTopNode = hasMedia && mediaPlacement === "top" ? /* @__PURE__ */ jsx184("div", { className: "overflow-hidden", children: media }) : null;
  const mediaSideNode = hasMedia && (mediaPlacement === "start" || mediaPlacement === "end") ? /* @__PURE__ */ jsx184("div", { className: "w-full overflow-hidden rounded-xl border border-black/5 dark:border-white/10 sm:w-1/3 sm:min-w-[14rem]", children: media }) : null;
  const contentSection = (() => {
    if (mediaPlacement === "start" || mediaPlacement === "end") {
      return /* @__PURE__ */ jsxs82(
        "div",
        {
          className: classNames37(
            "flex min-h-0 flex-1 flex-col gap-6 sm:flex-row",
            mediaPlacement === "end" ? "sm:flex-row-reverse" : "sm:flex-row",
            hasMedia ? "sm:items-start" : void 0
          ),
          children: [
            mediaSideNode,
            /* @__PURE__ */ jsxs82("div", { className: "flex min-h-0 flex-1 flex-col gap-4", children: [
              headerSection,
              bodySection,
              actionsSection
            ] })
          ]
        }
      );
    }
    return /* @__PURE__ */ jsxs82("div", { className: "flex min-h-0 flex-1 flex-col gap-4", children: [
      mediaTopNode,
      headerSection,
      bodySection,
      actionsSection
    ] });
  })();
  return /* @__PURE__ */ jsxs82(
    "section",
    {
      className: classNames37(
        "relative flex w-full min-h-0 flex-col overflow-hidden shrink-0",
        variantClasses2,
        paddingStyles2[padding],
        cornerStyles[corner],
        fullWidth ? "w-full" : void 0,
        isOverlay ? overlayClasses : void 0,
        hoverShadow && "transition-shadow duration-200 hover:shadow-xl hover:-translate-y-[1px]",
        isHoverable && "group cursor-pointer",
        isHoverable && hoverColorName && `hover:bg-${hoverColorName}-50 dark:hover:bg-${hoverColorName}-900/20`,
        className
      ),
      style: resolvedStyle,
      "data-variant": variant,
      "data-tone": tone,
      "aria-busy": loading,
      ...rest,
      children: [
        isOverlay && /* @__PURE__ */ jsxs82(Fragment8, { children: [
          /* @__PURE__ */ jsx184("div", { className: "absolute inset-0 overflow-hidden", children: /* @__PURE__ */ jsx184("div", { className: "h-full w-full", children: media }) }),
          /* @__PURE__ */ jsx184(
            "div",
            {
              className: classNames37(
                "pointer-events-none absolute inset-0 bg-gradient-to-br",
                palette.overlayGradient
              )
            }
          )
        ] }),
        showDecorationGradient && /* @__PURE__ */ jsx184(
          "div",
          {
            className: classNames37(
              "pointer-events-none absolute inset-0 bg-gradient-to-br",
              palette.decorationGradient,
              isHoverable && "transition-opacity duration-200 group-hover:opacity-50"
            ),
            "aria-hidden": "true"
          }
        ),
        showDecorationShapes && /* @__PURE__ */ jsxs82(Fragment8, { children: [
          /* @__PURE__ */ jsx184(
            "div",
            {
              className: classNames37(
                "pointer-events-none absolute -right-10 -top-10 w-52 h-52 rounded-full",
                palette.decorationShape,
                isHoverable && "transition-opacity duration-200 group-hover:opacity-50"
              ),
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx184(
            "div",
            {
              className: classNames37(
                "pointer-events-none absolute -left-8 -bottom-10 w-36 h-36 rounded-full opacity-70",
                palette.decorationShape,
                isHoverable && "transition-opacity duration-200 group-hover:opacity-40"
              ),
              "aria-hidden": "true"
            }
          ),
          /* @__PURE__ */ jsx184(
            "div",
            {
              className: classNames37(
                "pointer-events-none absolute right-10 bottom-8 w-16 h-16 rounded-full opacity-50",
                palette.decorationShape,
                isHoverable && "transition-opacity duration-200 group-hover:opacity-25"
              ),
              "aria-hidden": "true"
            }
          )
        ] }),
        isHoverable && !hoverColorName && /* @__PURE__ */ jsx184(
          "div",
          {
            className: "pointer-events-none absolute inset-0 rounded-[inherit] bg-transparent transition-colors duration-200 group-hover:bg-black/[0.025] dark:group-hover:bg-white/[0.04]",
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsxs82(
          "div",
          {
            className: classNames37(
              "relative z-10 flex min-h-0 flex-1 flex-col gap-4",
              isOverlay && "backdrop-blur-sm"
            ),
            children: [
              disabled && /* @__PURE__ */ jsx184(
                "div",
                {
                  className: "absolute inset-0 z-10 bg-white/70 dark:bg-slate-900/70",
                  "aria-hidden": "true"
                }
              ),
              contentSection
            ]
          }
        ),
        loading && /* @__PURE__ */ jsx184(
          Loader_default,
          {
            overlay: true,
            variant: loaderType,
            title: loaderTitle,
            label: loaderMessage,
            progress: loaderProgress,
            color: loaderColor
          }
        )
      ]
    }
  );
};
var Panel_default = Panel;

// src/components/PagedPanel.tsx
import { jsx as jsx185, jsxs as jsxs83 } from "react/jsx-runtime";

// src/components/CollapsiblePanel.tsx
import { useState as useState17 } from "react";
import classNames39 from "classnames";
import { jsx as jsx186, jsxs as jsxs84 } from "react/jsx-runtime";

// src/components/HeaderGroup.tsx
import { jsx as jsx187 } from "react/jsx-runtime";
var HeaderGroup = ({
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsx187(
    "div",
    {
      className: `flex
        items-center
        text-black
        dark:text-white
        h-full
        relative
        [&+&]:ml-2
        [&+&::before]:content-['']
        [&+&::before]:absolute
        [&+&::before]:left-[-4px]
        [&+&::before]:top-1/2
        [&+&::before]:-translate-y-1/2
        [&+&::before]:transform
        [&+&::before]:h-1/2
        [&+&::before]:w-[2px]
        [&+&::before]:bg-neutral-300
        ${className}`,
      children: /* @__PURE__ */ jsx187("div", { className: "flex items-center px-1", children })
    }
  );
};
HeaderGroup.displayName = "HeaderGroup";

// src/components/DetailItemCard.tsx
import { useState as useState18 } from "react";
import { jsx as jsx188, jsxs as jsxs85 } from "react/jsx-runtime";
var DetailItemCard = ({
  title,
  subtitle,
  description,
  badges,
  children,
  defaultExpanded = false,
  onClick,
  className = "",
  badgesAlignment = "right"
}) => {
  const [expanded, setExpanded] = useState18(defaultExpanded);
  const hasDetails = !!children;
  const handleToggleExpand = (e) => {
    if (hasDetails) {
      e.stopPropagation();
      setExpanded((prev) => !prev);
    }
  };
  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick();
    }
  };
  return /* @__PURE__ */ jsxs85(
    "div",
    {
      className: `flex w-full flex-col gap-2.5 ${expanded ? "expanded" : ""} ${className}`,
      onClick: handleClick,
      children: [
        /* @__PURE__ */ jsxs85("div", { className: "flex flex-1 flex-row items-center justify-between gap-1.5", children: [
          hasDetails && /* @__PURE__ */ jsx188("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx188(
            Button_default,
            {
              variant: "icon",
              className: "h-6 w-6",
              onClick: handleToggleExpand,
              "aria-expanded": expanded,
              "aria-label": expanded ? "Collapse details" : "Expand details",
              children: /* @__PURE__ */ jsx188(
                "span",
                {
                  className: `flex items-center justify-center text-lg font-bold transition-transform duration-200 ${expanded ? "rotate-0" : "rotate-0"}`,
                  children: expanded ? "\u2212" : "+"
                }
              )
            }
          ) }),
          /* @__PURE__ */ jsxs85("div", { className: "flex flex-1 flex-col leading-normal", children: [
            /* @__PURE__ */ jsx188("div", { className: "text-base font-normal text-neutral-900 dark:text-neutral-100", children: title }),
            subtitle && /* @__PURE__ */ jsx188("div", { className: "text-xs font-semibold text-neutral-500 dark:text-neutral-400", children: subtitle }),
            description && /* @__PURE__ */ jsx188("div", { className: "text-xs text-neutral-500 dark:text-neutral-400", children: description }),
            badgesAlignment == "bottom" && /* @__PURE__ */ jsx188("div", { className: "flex flex-row justify-start gap-px", children: badges }),
            badgesAlignment == "bottom-end" && /* @__PURE__ */ jsx188("div", { className: "flex flex-row justify-end gap-px", children: badges })
          ] }),
          badgesAlignment == "right" && /* @__PURE__ */ jsx188("div", { className: "flex flex-col justify-end gap-px", children: badges })
        ] }),
        hasDetails && expanded && /* @__PURE__ */ jsx188("div", { className: "flex flex-col gap-2.5 px-[30px] text-sm text-neutral-500 dark:text-neutral-400", children })
      ]
    }
  );
};
DetailItemCard.displayName = "DetailItemCard";

// src/components/InfiniteScrollPanel.tsx
import { useEffect as useEffect11, useState as useState19, useRef as useRef15, useCallback as useCallback9 } from "react";
import classNames40 from "classnames";
import { Fragment as Fragment9, jsx as jsx189, jsxs as jsxs86 } from "react/jsx-runtime";
function InfiniteScrollPanel({
  items,
  isLoading,
  hasMore,
  onLoadMore,
  renderItem,
  loadingComponent,
  emptyComponent,
  className = "",
  threshold = 3,
  debounceMs = 100,
  useFixedColumns = false,
  minColumnWidthPx = 300,
  maxColumns,
  columnTemplate,
  masonry = false
}) {
  const [isLoadingMore, setIsLoadingMore] = useState19(false);
  const containerRef = useRef15(null);
  const itemsContainerRef = useRef15(null);
  const itemRefs = useRef15([]);
  const loadingRef = useRef15(null);
  const debounceTimeoutRef = useRef15(null);
  const resizeObserversRef = useRef15([]);
  const rafIdRef = useRef15(null);
  const delayedTimerRef = useRef15(null);
  const [columnCount, setColumnCount] = useState19(1);
  const handleLoadMore = useCallback9(async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } catch (error) {
      console.error("Error loading more items:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onLoadMore]);
  const handleScroll = useCallback9(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      if (!containerRef.current || !loadingRef.current) return;
      const container = containerRef.current;
      const loadingElement = loadingRef.current;
      const containerRect = container.getBoundingClientRect();
      const loadingRect = loadingElement.getBoundingClientRect();
      const isVisible = loadingRect.top <= containerRect.bottom + threshold * 50;
      if (isVisible && hasMore && !isLoadingMore && !isLoading) {
        void handleLoadMore();
      }
    }, debounceMs);
  }, [
    hasMore,
    isLoadingMore,
    isLoading,
    threshold,
    debounceMs,
    handleLoadMore
  ]);
  useEffect11(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [handleScroll]);
  useEffect11(() => {
    if (items.length > 0 && items.length < threshold && hasMore && !isLoadingMore && !isLoading) {
      void handleLoadMore();
    }
  }, [
    items.length,
    threshold,
    hasMore,
    isLoadingMore,
    isLoading,
    handleLoadMore
  ]);
  useEffect11(() => {
    if (!isLoading && !isLoadingMore) {
      handleScroll();
    }
  }, [isLoading, isLoadingMore, items.length, handleScroll]);
  const defaultLoadingComponent = /* @__PURE__ */ jsxs86("div", { className: "flex flex-col items-center justify-center gap-4", children: [
    /* @__PURE__ */ jsx189(Spinner_default, { thickness: "thick", color: "blue", size: "lg", variant: "segments" }),
    /* @__PURE__ */ jsx189("span", { className: "text-md", children: "Loading more..." })
  ] });
  const defaultEmptyComponent = /* @__PURE__ */ jsx189("div", { className: "flex items-center justify-center p-12 text-center text-base text-neutral-500 dark:text-neutral-400", children: /* @__PURE__ */ jsx189("span", { children: "No items found" }) });
  const recomputeMasonrySpans = useCallback9(() => {
    const grid = itemsContainerRef.current;
    if (!grid) return;
    const computed = window.getComputedStyle(grid);
    const rowGap = parseFloat(computed.rowGap || "0");
    const rowHeight = parseFloat(
      computed.getPropertyValue("--masonry-row-height") || "8"
    );
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const contentHeight = el.getBoundingClientRect().height;
      const rowSpan = Math.max(
        1,
        Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap))
      );
      const current = el.style.gridRowEnd;
      const next = `span ${rowSpan}`;
      if (current !== next) {
        el.style.gridRowEnd = next;
      }
    });
  }, []);
  const scheduleRecompute = useCallback9(
    (delayMs = 60) => {
      if (delayedTimerRef.current) {
        clearTimeout(delayedTimerRef.current);
        delayedTimerRef.current = null;
      }
      delayedTimerRef.current = setTimeout(() => {
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          recomputeMasonrySpans();
          rafIdRef.current = null;
        });
      }, delayMs);
    },
    [recomputeMasonrySpans]
  );
  useEffect11(() => {
    if (useFixedColumns) return;
    resizeObserversRef.current.forEach((ro) => ro.disconnect());
    resizeObserversRef.current = [];
    itemRefs.current.forEach((el) => {
      if (!el) return;
      const ro = new ResizeObserver(() => scheduleRecompute());
      ro.observe(el);
      resizeObserversRef.current.push(ro);
    });
    scheduleRecompute(0);
    const handler = () => scheduleRecompute(0);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("resize", handler);
      resizeObserversRef.current.forEach((ro) => ro.disconnect());
      resizeObserversRef.current = [];
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (delayedTimerRef.current) {
        clearTimeout(delayedTimerRef.current);
        delayedTimerRef.current = null;
      }
    };
  }, [items, scheduleRecompute, useFixedColumns]);
  useEffect11(() => {
    if (!useFixedColumns) return;
    const computeColumns = () => {
      const container = containerRef.current;
      if (!container) return;
      const gap = 16;
      const width = container.clientWidth;
      const cols = Math.max(
        1,
        Math.floor((width + gap) / (minColumnWidthPx + gap))
      );
      setColumnCount(maxColumns ? Math.min(cols, maxColumns) : cols);
    };
    computeColumns();
    window.addEventListener("resize", computeColumns);
    return () => window.removeEventListener("resize", computeColumns);
  }, [useFixedColumns, minColumnWidthPx, maxColumns]);
  return /* @__PURE__ */ jsx189(
    "div",
    {
      ref: containerRef,
      className: classNames40(
        "relative flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto",
        "scrollbar-thin scrollbar-track-neutral-100 scrollbar-thumb-neutral-300 hover:scrollbar-thumb-neutral-400",
        "dark:scrollbar-track-neutral-800 dark:scrollbar-thumb-neutral-600 dark:hover:scrollbar-thumb-neutral-500",
        "[&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded",
        className
      ),
      children: items.length === 0 && !isLoading ? emptyComponent || defaultEmptyComponent : /* @__PURE__ */ jsxs86(Fragment9, { children: [
        useFixedColumns ? /* @__PURE__ */ jsx189(
          "div",
          {
            className: classNames40(
              "mb-5 grid gap-4",
              columnCount === 1 && "grid-cols-1",
              columnCount === 2 && "grid-cols-2",
              columnCount === 3 && "grid-cols-3",
              columnCount === 4 && "grid-cols-4",
              columnCount >= 5 && "grid-cols-5"
            ),
            children: Array.from({ length: columnCount }).map((_, colIdx) => /* @__PURE__ */ jsx189("div", { className: "flex flex-col gap-4", children: items.map((item, index) => ({ item, index })).filter(({ index }) => index % columnCount === colIdx).map(({ item, index }) => /* @__PURE__ */ jsx189(
              "div",
              {
                className: "flex items-start justify-center",
                children: renderItem(item, index)
              },
              index
            )) }, colIdx))
          }
        ) : /* @__PURE__ */ jsx189(
          "div",
          {
            ref: itemsContainerRef,
            className: classNames40(
              "mb-[60px] grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] items-start gap-2.5 py-4",
              masonry && "[--masonry-row-height:8px] auto-rows-[var(--masonry-row-height)]"
            ),
            style: {
              gridTemplateColumns: columnTemplate
            },
            children: items.map((item, index) => /* @__PURE__ */ jsx189(
              "div",
              {
                className: "flex items-start justify-center",
                ref: (el) => {
                  itemRefs.current[index] = el;
                },
                children: renderItem(item, index)
              },
              index
            ))
          }
        ),
        items.length > 0 && (hasMore || isLoadingMore) && /* @__PURE__ */ jsx189(
          "div",
          {
            ref: loadingRef,
            className: `flex min-h-[100px] ${!loadingComponent ? " items-center justify-center p-8" : ""}`,
            children: loadingComponent || defaultLoadingComponent
          }
        )
      ] })
    }
  );
}
InfiniteScrollPanel.displayName = "InfiniteScrollPanel";

// src/components/CollapsibleHelpText.tsx
import { useState as useState20 } from "react";
import classNames41 from "classnames";
import { Fragment as Fragment10, jsx as jsx190, jsxs as jsxs87 } from "react/jsx-runtime";
var toneTokens8 = {
  blue: {
    border: "border-blue-100 dark:border-blue-500/40",
    accent: "text-blue-600 dark:text-blue-300",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-700 dark:text-blue-200",
    focusRing: "focus-visible:ring-blue-200 dark:focus-visible:ring-blue-500/40",
    hover: "hover:bg-blue-50/60 dark:hover:bg-blue-500/5"
  },
  indigo: {
    border: "border-indigo-100 dark:border-indigo-500/40",
    accent: "text-indigo-600 dark:text-indigo-300",
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    text: "text-indigo-700 dark:text-indigo-200",
    focusRing: "focus-visible:ring-indigo-200 dark:focus-visible:ring-indigo-500/40",
    hover: "hover:bg-indigo-50/60 dark:hover:bg-indigo-500/5"
  },
  emerald: {
    border: "border-emerald-100 dark:border-emerald-500/40",
    accent: "text-emerald-600 dark:text-emerald-300",
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-700 dark:text-emerald-200",
    focusRing: "focus-visible:ring-emerald-200 dark:focus-visible:ring-emerald-500/40",
    hover: "hover:bg-emerald-50/60 dark:hover:bg-emerald-500/5"
  },
  amber: {
    border: "border-amber-100 dark:border-amber-500/40",
    accent: "text-amber-600 dark:text-amber-300",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-700 dark:text-amber-200",
    focusRing: "focus-visible:ring-amber-200 dark:focus-visible:ring-amber-500/40",
    hover: "hover:bg-amber-50/60 dark:hover:bg-amber-500/5"
  },
  rose: {
    border: "border-rose-100 dark:border-rose-500/40",
    accent: "text-rose-600 dark:text-rose-300",
    iconBg: "bg-rose-50 dark:bg-rose-500/10",
    text: "text-rose-700 dark:text-rose-200",
    focusRing: "focus-visible:ring-rose-200 dark:focus-visible:ring-rose-500/40",
    hover: "hover:bg-rose-50/60 dark:hover:bg-rose-500/5"
  },
  slate: {
    border: "border-slate-200 dark:border-slate-700",
    accent: "text-slate-600 dark:text-slate-300",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    focusRing: "focus-visible:ring-slate-200 dark:focus-visible:ring-slate-600",
    hover: "hover:bg-slate-50 dark:hover:bg-slate-800/80"
  },
  white: {
    border: "border-slate-200 dark:border-slate-700",
    accent: "text-slate-600 dark:text-slate-300",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    focusRing: "focus-visible:ring-slate-200 dark:focus-visible:ring-slate-600",
    hover: "hover:bg-slate-50 dark:hover:bg-slate-800/80"
  },
  theme: {
    border: "border-slate-200 dark:border-slate-700",
    accent: "text-slate-600 dark:text-slate-300",
    iconBg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-200",
    focusRing: "focus-visible:ring-slate-200 dark:focus-visible:ring-slate-600",
    hover: "hover:bg-slate-50 dark:hover:bg-slate-800/80"
  }
};
var truncate = (value, limit) => {
  if (value.length <= limit) {
    return value;
  }
  return `${value.slice(0, limit).trim()}...`;
};
var CollapsibleHelpText = ({
  title,
  text,
  maxLength = 160,
  showIcon = false,
  icon = "Help",
  children,
  className,
  tone = "blue",
  variant = "card",
  renderMarkdown,
  ...rest
}) => {
  const renderIcon2 = useIconRenderer();
  const sanitized = text?.trim() ?? "";
  const needsTruncation = sanitized.length > maxLength;
  const [expanded, setExpanded] = useState20(false);
  const colorTokens2 = toneTokens8[tone] ?? toneTokens8.theme;
  const displayText = expanded || !needsTruncation ? sanitized : truncate(sanitized, maxLength);
  const textContent = renderMarkdown ? renderMarkdown(displayText) : /* @__PURE__ */ jsx190("div", { className: "prose prose-sm max-w-none text-slate-600 prose-p:my-1 prose-ul:my-1 dark:text-slate-200", children: /* @__PURE__ */ jsx190("p", { children: displayText }) });
  const headerContent = /* @__PURE__ */ jsxs87(Fragment10, { children: [
    showIcon && /* @__PURE__ */ jsx190(
      "span",
      {
        className: classNames41(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
          colorTokens2.iconBg,
          colorTokens2.accent
        ),
        children: renderIcon2(icon, "sm", "text-inherit")
      }
    ),
    /* @__PURE__ */ jsxs87("div", { className: "flex flex-1 flex-col gap-1 text-left", children: [
      title && /* @__PURE__ */ jsx190("p", { className: classNames41("text-sm font-semibold", colorTokens2.text), children: title }),
      textContent
    ] }),
    needsTruncation && /* @__PURE__ */ jsx190(
      "span",
      {
        className: classNames41(
          "ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition dark:border-slate-700 dark:text-slate-200",
          colorTokens2.accent
        ),
        "aria-hidden": "true",
        children: renderIcon2(
          "ArrowDown",
          "sm",
          classNames41(
            "transition-transform duration-200",
            expanded && "rotate-180"
          )
        )
      }
    )
  ] });
  const containerClasses = classNames41(
    "w-full transition",
    variant === "card" ? classNames41(
      "rounded-2xl border bg-white/90 p-4 shadow-sm dark:bg-slate-900/80",
      colorTokens2.border
    ) : "rounded-xl border border-transparent bg-transparent p-0 shadow-none",
    className
  );
  const triggerClasses = classNames41(
    "flex w-full items-start gap-3 rounded-2xl px-1 py-1 text-left transition",
    variant === "plain" && "rounded-xl px-0 py-0",
    colorTokens2.hover,
    colorTokens2.focusRing
  );
  return /* @__PURE__ */ jsxs87("div", { className: containerClasses, ...rest, children: [
    needsTruncation ? /* @__PURE__ */ jsx190(
      "button",
      {
        type: "button",
        className: triggerClasses,
        onClick: () => setExpanded((prev) => !prev),
        "aria-expanded": expanded,
        children: headerContent
      }
    ) : /* @__PURE__ */ jsx190("div", { className: "flex items-start gap-3", children: headerContent }),
    children && /* @__PURE__ */ jsx190("div", { className: "mt-3 text-sm text-slate-500 dark:text-slate-300", children })
  ] });
};
CollapsibleHelpText.displayName = "CollapsibleHelpText";

// src/components/UserAvatar.tsx
import { useState as useState21, useEffect as useEffect12 } from "react";
import { jsx as jsx191 } from "react/jsx-runtime";
var UserAvatar = ({
  user,
  size = 32,
  className = "",
  variant = "circle"
}) => {
  const renderIcon2 = useIconRenderer();
  const [hasError, setHasError] = useState21(false);
  const [imgSrc, setImgSrc] = useState21(null);
  useEffect12(() => {
    setHasError(false);
    if (user?.avatarUrl) {
      setImgSrc(user.avatarUrl);
    } else {
      setImgSrc(null);
    }
  }, [user?.avatarUrl, size]);
  const roundedClass = variant === "circle" ? "rounded-full" : variant === "rounded" ? "rounded-md" : "rounded-none";
  const baseClasses3 = `flex items-center justify-center font-bold text-slate-600 overflow-hidden ${roundedClass} ${className}`;
  const renderFallback = () => {
    const identifier = user?.name || user?.username || user?.email;
    if (identifier) {
      return /* @__PURE__ */ jsx191(
        "div",
        {
          className: `w-full h-full bg-slate-200 flex items-center justify-center text-xs dark:bg-slate-700 dark:text-slate-300 ${roundedClass}`,
          children: identifier[0].toUpperCase()
        }
      );
    }
    return /* @__PURE__ */ jsx191(
      "div",
      {
        className: `w-full h-full bg-slate-200 flex items-center justify-center text-xs dark:bg-slate-700 dark:text-slate-300 ${roundedClass}`,
        children: renderIcon2("User", "xs")
      }
    );
  };
  if (!user || !user.avatarUrl) {
    return /* @__PURE__ */ jsx191("div", { className: baseClasses3, style: { width: size, height: size }, children: renderFallback() });
  }
  return /* @__PURE__ */ jsx191(
    "div",
    {
      className: `${baseClasses3} bg-transparent`,
      style: { width: size, height: size },
      children: !hasError && imgSrc ? /* @__PURE__ */ jsx191(
        "img",
        {
          src: imgSrc,
          alt: user?.name || user?.username || "User Avatar",
          className: `h-full w-full object-cover ${roundedClass}`,
          onError: () => setHasError(true)
        }
      ) : renderFallback()
    }
  );
};
UserAvatar.displayName = "UserAvatar";

// src/components/Accordion.tsx
import { useMemo as useMemo12 } from "react";
import classNames42 from "classnames";

// src/hooks/useAccordion.ts
import { useCallback as useCallback10, useMemo as useMemo11, useState as useState22 } from "react";
function useAccordion({
  defaultOpenIds,
  openIds: controlledOpenIds,
  multiple = false,
  onChange
} = {}) {
  const [internalOpenIds, setInternalOpenIds] = useState22(
    defaultOpenIds ?? []
  );
  const resolvedOpenIds = controlledOpenIds ?? internalOpenIds;
  const emitChange = useCallback10(
    (next) => {
      if (!controlledOpenIds) {
        setInternalOpenIds(next);
      }
      onChange?.(next);
    },
    [controlledOpenIds, onChange]
  );
  const toggle = useCallback10(
    (id) => {
      const isCurrentlyOpen = resolvedOpenIds.includes(id);
      if (isCurrentlyOpen) {
        emitChange(resolvedOpenIds.filter((item) => item !== id));
        return;
      }
      if (multiple) {
        emitChange([...resolvedOpenIds, id]);
      } else {
        emitChange([id]);
      }
    },
    [emitChange, multiple, resolvedOpenIds]
  );
  const open = useCallback10(
    (id) => {
      if (resolvedOpenIds.includes(id)) {
        return;
      }
      if (multiple) {
        emitChange([...resolvedOpenIds, id]);
      } else {
        emitChange([id]);
      }
    },
    [emitChange, multiple, resolvedOpenIds]
  );
  const close = useCallback10(
    (id) => {
      if (!resolvedOpenIds.includes(id)) {
        return;
      }
      emitChange(resolvedOpenIds.filter((item) => item !== id));
    },
    [emitChange, resolvedOpenIds]
  );
  const api = useMemo11(
    () => ({
      openIds: resolvedOpenIds,
      isOpen: (id) => resolvedOpenIds.includes(id),
      toggle,
      open,
      close,
      setOpenIds: emitChange
    }),
    [resolvedOpenIds, toggle, open, close, emitChange]
  );
  return api;
}

// src/components/Accordion.tsx
import { jsx as jsx192, jsxs as jsxs88 } from "react/jsx-runtime";
var sizeTokens7 = {
  sm: {
    header: "px-4 py-3 gap-3",
    title: "text-sm font-semibold",
    subtitle: "text-xs font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-xs text-neutral-500 dark:text-neutral-400",
    content: "px-4 pb-4",
    badge: "text-xs",
    iconSize: 16
  },
  md: {
    header: "px-5 py-4 gap-3",
    title: "text-base font-semibold",
    subtitle: "text-sm font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    content: "px-5 pb-5",
    badge: "text-xs",
    iconSize: 20
  },
  lg: {
    header: "px-6 py-5 gap-4",
    title: "text-lg font-semibold",
    subtitle: "text-base font-medium text-neutral-500 dark:text-neutral-400",
    description: "text-sm text-neutral-500 dark:text-neutral-400",
    content: "px-6 pb-6",
    badge: "text-sm",
    iconSize: 24
  }
};
var variantClasses = {
  default: {
    root: "rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900/90",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800",
    header: "hover:bg-neutral-50/80 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-neutral-50/60 dark:bg-neutral-900/40"
  },
  bordered: {
    root: "rounded-2xl border border-neutral-300 bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
    item: "border-t first:border-t-0 border-neutral-300 dark:border-neutral-700",
    header: "hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-white dark:bg-neutral-900/60"
  },
  minimal: {
    root: "rounded-xl border border-transparent bg-transparent",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800",
    header: "hover:bg-neutral-100/70 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-transparent"
  },
  tonal: {
    root: "rounded-2xl border border-transparent bg-neutral-50/80 dark:bg-neutral-900/80",
    item: "border-b border-neutral-200 last:border-0 dark:border-neutral-800/80",
    header: "hover:bg-white/60 dark:hover:bg-neutral-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-white/60 dark:bg-neutral-900/60"
  },
  ghost: {
    root: "rounded-xl border border-transparent bg-transparent",
    item: "border-b border-transparent",
    header: "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-500",
    content: "bg-transparent"
  }
};
var toneClasses = {
  neutral: {
    header: "bg-neutral-50/50 text-neutral-900 shadow-sm hover:bg-neutral-100/80 dark:bg-neutral-900/40 dark:text-neutral-100 dark:hover:bg-neutral-800/60",
    indicator: "text-neutral-400 dark:text-neutral-500",
    icon: "text-neutral-500 dark:text-neutral-400",
    badge: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
  },
  info: {
    header: "bg-blue-50/50 text-blue-900 shadow-sm hover:bg-blue-100/60 ring-1 ring-blue-100/50 dark:bg-blue-950/20 dark:text-blue-100 dark:ring-blue-900/30 dark:hover:bg-blue-900/30",
    indicator: "text-blue-400 dark:text-blue-500",
    icon: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
  },
  success: {
    header: "bg-emerald-50/50 text-emerald-900 shadow-sm hover:bg-emerald-100/60 ring-1 ring-emerald-100/50 dark:bg-emerald-950/20 dark:text-emerald-100 dark:ring-emerald-900/30 dark:hover:bg-emerald-900/30",
    indicator: "text-emerald-500 dark:text-emerald-500",
    icon: "text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
  },
  warning: {
    header: "bg-amber-50/50 text-amber-900 shadow-sm hover:bg-amber-100/60 ring-1 ring-amber-100/50 dark:bg-amber-950/20 dark:text-amber-100 dark:ring-amber-900/30 dark:hover:bg-amber-900/30",
    indicator: "text-amber-500 dark:text-amber-500",
    icon: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
  },
  danger: {
    header: "bg-rose-50/50 text-rose-900 shadow-sm hover:bg-rose-100/60 ring-1 ring-rose-100/50 dark:bg-rose-950/20 dark:text-rose-100 dark:ring-rose-900/30 dark:hover:bg-rose-900/30",
    indicator: "text-rose-500 dark:text-rose-500",
    icon: "text-rose-600 dark:text-rose-400",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300"
  },
  brand: {
    header: "bg-indigo-50/50 text-indigo-900 shadow-sm hover:bg-indigo-100/60 ring-1 ring-indigo-100/50 dark:bg-indigo-950/20 dark:text-indigo-100 dark:ring-indigo-900/30 dark:hover:bg-indigo-900/30",
    indicator: "text-indigo-400 dark:text-indigo-500",
    icon: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300"
  }
};
var indicatorIconMap = {
  chevron: "ArrowDown",
  caret: "ArrowDown",
  "plus-minus": "Plus",
  none: void 0
};
var indicatorRotationClass = {
  chevron: "transition-transform duration-200",
  caret: "transition-transform duration-200",
  "plus-minus": "transition-transform duration-200",
  none: ""
};
var contentTransitionClass = "transition-all duration-200 ease-out";
var Accordion = ({
  items,
  variant = "default",
  tone = "neutral",
  size = "md",
  indicator = "chevron",
  chevronPlacement = "right",
  divider = false,
  animated = true,
  transitionMs = 220,
  onItemToggle,
  iconClassName,
  itemClassName,
  headerClassName,
  contentClassName,
  ariaLabel,
  loading = false,
  loaderTitle,
  loaderMessage,
  loaderType = "spinner",
  loaderProgress,
  loaderColor,
  defaultOpenIds,
  openIds,
  onChange,
  multiple,
  className,
  style,
  ...rest
}) => {
  const renderIcon2 = useIconRenderer();
  const accordion = useAccordion({
    defaultOpenIds,
    openIds,
    onChange,
    multiple
  });
  const sizeToken = sizeTokens7[size];
  const variantToken = variantClasses[variant];
  const toneToken = toneClasses[tone] ?? toneClasses.neutral;
  const indicatorIcon = indicatorIconMap[indicator];
  const showIndicator = indicator !== "none";
  const computedItems = useMemo12(() => items ?? [], [items]);
  return /* @__PURE__ */ jsxs88(
    "div",
    {
      className: classNames42(
        "relative flex w-full flex-col overflow-hidden",
        variantToken.root,
        divider && "divide-y divide-neutral-200 dark:divide-neutral-800",
        className
      ),
      style,
      "aria-busy": loading,
      role: "presentation",
      ...rest,
      children: [
        /* @__PURE__ */ jsx192("div", { role: "group", "aria-label": ariaLabel, className: "flex flex-col", children: computedItems.map((item) => {
          const isOpen = accordion.isOpen(item.id);
          const isDisabled = Boolean(item.disabled);
          const isLoading = Boolean(item.loading);
          const indicatorRotation = indicator === "plus-minus" ? isOpen ? "rotate-45" : "" : isOpen ? "-rotate-180" : "";
          const indicatorButton = showIndicator && indicatorIcon ? /* @__PURE__ */ jsx192(
            IconButton_default,
            {
              icon: indicatorIcon,
              size: "sm",
              variant: "icon",
              color: "slate",
              rounded: "full",
              className: classNames42(
                "pointer-events-none text-neutral-400 dark:text-neutral-300",
                toneToken.indicator,
                indicatorRotationClass[indicator],
                indicatorRotation
              ),
              "aria-hidden": "true",
              tabIndex: -1
            }
          ) : null;
          return /* @__PURE__ */ jsxs88(
            "div",
            {
              "data-item-id": item.id,
              className: classNames42(
                "relative flex flex-col",
                variantToken.item,
                isDisabled && "opacity-60",
                itemClassName
              ),
              children: [
                /* @__PURE__ */ jsxs88(
                  "button",
                  {
                    type: "button",
                    className: classNames42(
                      "flex w-full items-start gap-4 text-left transition-colors duration-150",
                      sizeToken.header,
                      variantToken.header,
                      toneToken.header,
                      headerClassName,
                      isDisabled && "cursor-not-allowed"
                    ),
                    "aria-expanded": isOpen,
                    "aria-controls": `${item.id}-content`,
                    id: `${item.id}-trigger`,
                    disabled: isDisabled,
                    onClick: () => {
                      accordion.toggle(item.id);
                      onItemToggle?.(item.id, !isOpen);
                    },
                    children: [
                      chevronPlacement === "left" && indicatorButton ? /* @__PURE__ */ jsx192("div", { className: "mt-1 flex items-center", children: indicatorButton }) : null,
                      /* @__PURE__ */ jsxs88("div", { className: "flex flex-1 items-start gap-3", children: [
                        item.icon ? /* @__PURE__ */ jsx192(
                          "div",
                          {
                            className: classNames42(
                              "mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800",
                              toneToken.icon,
                              iconClassName
                            ),
                            children: renderIcon2(item.icon, "md")
                          }
                        ) : null,
                        /* @__PURE__ */ jsxs88("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
                          /* @__PURE__ */ jsxs88("div", { className: "flex flex-wrap items-center gap-2", children: [
                            /* @__PURE__ */ jsx192("span", { className: sizeToken.title, children: item.title }),
                            item.badge ? /* @__PURE__ */ jsx192(
                              "span",
                              {
                                className: classNames42(
                                  "inline-flex items-center rounded-full px-2 py-0.5 font-medium",
                                  sizeToken.badge,
                                  toneToken.badge
                                ),
                                children: item.badge
                              }
                            ) : null
                          ] }),
                          item.subtitle ? /* @__PURE__ */ jsx192("div", { className: classNames42(sizeToken.subtitle), children: item.subtitle }) : null,
                          item.description ? /* @__PURE__ */ jsx192("div", { className: classNames42(sizeToken.description), children: item.description }) : null
                        ] })
                      ] }),
                      item.actions ? /* @__PURE__ */ jsx192("div", { className: "flex shrink-0 items-center gap-2 text-neutral-500 dark:text-neutral-300", children: item.actions }) : null,
                      chevronPlacement === "right" && indicatorButton ? /* @__PURE__ */ jsx192("div", { className: "mt-1 flex items-center", children: indicatorButton }) : null
                    ]
                  }
                ),
                /* @__PURE__ */ jsx192(
                  "div",
                  {
                    id: `${item.id}-content`,
                    role: "region",
                    "aria-labelledby": `${item.id}-trigger`,
                    className: classNames42(
                      "overflow-hidden",
                      animated && contentTransitionClass,
                      contentClassName,
                      animated && `duration-[${transitionMs}ms]`
                    ),
                    style: animated ? { maxHeight: void 0 } : void 0,
                    "data-open": isOpen,
                    children: /* @__PURE__ */ jsx192(
                      "div",
                      {
                        className: classNames42(
                          "grid transition-all duration-200 ease-out",
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        ),
                        children: /* @__PURE__ */ jsx192("div", { className: classNames42("min-h-0", variantToken.content), children: /* @__PURE__ */ jsx192(
                          "div",
                          {
                            className: classNames42(
                              "overflow-hidden",
                              sizeToken.content,
                              "text-sm leading-6 text-neutral-600 dark:text-neutral-300"
                            ),
                            children: item.content
                          }
                        ) })
                      }
                    )
                  }
                ),
                isLoading && /* @__PURE__ */ jsx192(
                  Loader_default,
                  {
                    overlay: true,
                    title: "Loading",
                    className: "rounded-none",
                    size: "md",
                    color: "blue"
                  }
                )
              ]
            },
            item.id
          );
        }) }),
        loading && /* @__PURE__ */ jsx192(
          Loader_default,
          {
            overlay: true,
            title: loaderTitle,
            label: loaderMessage,
            variant: loaderType,
            progress: loaderProgress,
            color: loaderColor
          }
        )
      ]
    }
  );
};
Accordion.displayName = "Accordion";

// src/components/Tabs.tsx
import React36, { useEffect as useEffect13, useMemo as useMemo13, useState as useState23 } from "react";
import classNames43 from "classnames";
import { Fragment as Fragment11, jsx as jsx193, jsxs as jsxs89 } from "react/jsx-runtime";
var joinClasses = (...parts) => parts.filter(Boolean).join(" ");
var baseTabClasses = "group relative inline-flex items-center transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60";
var focusOffset = "focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0";
var focusRing = (color) => getTabsColorTokens(color).focusRing;
var sizeStyles5 = {
  sm: {
    padding: "px-3 py-1.5",
    text: "text-sm font-medium",
    gap: "gap-1.5",
    icon: "h-4 w-4"
  },
  md: {
    padding: "px-4 py-2",
    text: "text-md",
    gap: "gap-2",
    icon: "h-5 w-5"
  },
  lg: {
    padding: "px-5 py-2.5",
    text: "text-base",
    gap: "gap-2.5",
    icon: "h-5 w-5"
  }
};
var neutralTextInactive = "text-neutral-600 dark:text-neutral-300";
var buildVariantConfig = (variant, color, orientation, hideUnderlineContainer) => {
  const tokens = getTabsColorTokens(color);
  const hoverAccentText = tokens.hoverText;
  const activeAccentText = tokens.activeText;
  const activeOnAccent = tokens.onAccentText;
  const accentBgStrong = tokens.accentBg;
  const subtleBg = tokens.subtleBg;
  const subtleHoverBg = tokens.subtleHoverBg;
  const badgeSubtle = tokens.badgeSubtle;
  const badgeStrong = tokens.badgeStrong;
  const badgeOnAccent = tokens.badgeOnAccent;
  const underlineActive = tokens.underlineActive;
  const segmentedContainer = tokens.segmentedContainer;
  switch (variant) {
    case "soft":
      return {
        container: joinClasses(
          "rounded-full",
          subtleBg,
          orientation === "vertical" ? "p-1.5" : "p-1"
        ),
        list: "gap-1",
        base: joinClasses(
          "rounded-full font-medium",
          neutralTextInactive,
          hoverAccentText,
          "hover:bg-white/70 dark:hover:bg-white/10"
        ),
        active: joinClasses("shadow-sm", accentBgStrong, activeOnAccent),
        inactive: "",
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle
      };
    case "pill":
      return {
        container: "gap-2",
        list: "gap-2",
        base: joinClasses(
          "rounded-full border border-transparent font-medium",
          neutralTextInactive,
          hoverAccentText,
          "hover:border-current"
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent"
        ),
        inactive: "border-slate-200 dark:border-slate-700",
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle
      };
    case "segmented":
      return {
        container: joinClasses("rounded-lg border", segmentedContainer),
        list: classNames43(
          "gap-0 overflow-hidden",
          orientation === "vertical" ? "flex-col" : "flex-row"
        ),
        base: joinClasses(
          "font-medium border border-transparent first:rounded-l-lg last:rounded-r-lg first:rounded-t-lg last:rounded-b-lg",
          neutralTextInactive,
          hoverAccentText,
          orientation === "horizontal" ? "-ml-px first:ml-0" : "-mt-px first:mt-0"
        ),
        active: joinClasses(
          accentBgStrong,
          activeOnAccent,
          "shadow-sm border-transparent dark:shadow-none"
        ),
        inactive: joinClasses("bg-transparent", subtleHoverBg),
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeOnAccent,
        badgeInactive: badgeSubtle
      };
    case "minimal":
      return {
        container: "gap-2",
        list: "gap-0",
        base: joinClasses(
          "font-medium rounded-lg",
          neutralTextInactive,
          hoverAccentText,
          "hover:bg-neutral-900/5 dark:hover:bg-neutral-100/10",
          "px-2 py-1"
        ),
        active: joinClasses(activeAccentText, "font-medium "),
        inactive: "text-neutral-900/20 dark:text-neutral-500",
        disabled: "text-slate-300 dark:text-slate-600",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle
      };
    case "underline":
    default:
      return {
        container: hideUnderlineContainer ? void 0 : "",
        list: classNames43("gap-3", orientation === "vertical" && "gap-3"),
        base: joinClasses(
          "rounded-none font-medium",
          "pb-3 pt-2",
          "border-b-2 border-transparent",
          "after:absolute after:inset-x-1.5 after:bottom-0 after:h-[3px] after:rounded-full after:opacity-0 after:transition-all after:duration-200",
          tokens.underlineActive,
          "group-hover:after:opacity-100",
          neutralTextInactive,
          hoverAccentText
        ),
        active: joinClasses(
          activeAccentText,
          underlineActive,
          "after:opacity-100"
        ),
        inactive: "",
        disabled: "text-slate-300 dark:text-slate-600 border-transparent",
        badge: badgeSubtle,
        badgeActive: badgeStrong,
        badgeInactive: badgeSubtle
      };
  }
};
var Tabs = ({
  items,
  value,
  defaultValue,
  onChange,
  variant = "underline",
  size = "md",
  color = "blue",
  orientation = "horizontal",
  justify = "start",
  fullWidth = false,
  className,
  listClassName,
  allowReselect = false,
  panelIdPrefix = "tab-panel",
  showDividers = false,
  hideUnderlineContainer = false,
  containerClassName,
  panelClassName,
  scrollFade = true,
  scrollFadeFrom = "from-white dark:from-neutral-900"
}) => {
  const renderIcon2 = useIconRenderer();
  const [internalValue, setInternalValue] = useState23(
    defaultValue ?? items[0]?.id
  );
  const activeId = value ?? internalValue;
  useEffect13(() => {
    if (value !== void 0) {
      return;
    }
    if (!items.some((item) => item.id === internalValue)) {
      setInternalValue(items[0]?.id);
    }
  }, [items, value, internalValue]);
  const config = useMemo13(
    () => buildVariantConfig(variant, color, orientation, hideUnderlineContainer),
    [variant, color, orientation, hideUnderlineContainer]
  );
  const sizeConfig = sizeStyles5[size] ?? sizeStyles5.md;
  const iconClasses = classNames43("flex-shrink-0", sizeConfig.icon);
  const shouldShowDividers = showDividers && (variant === "underline" || variant === "minimal");
  const baseList = classNames43(
    "relative flex",
    orientation === "vertical" ? "flex-col" : "items-center",
    justify === "center" && orientation === "horizontal" && "justify-center",
    justify === "end" && orientation === "horizontal" && "justify-end",
    justify === "between" && orientation === "horizontal" && "justify-between w-full",
    fullWidth && "w-full",
    config.list,
    shouldShowDividers && "gap-0",
    listClassName
  );
  const resolvedContainer = containerClassName !== void 0 ? containerClassName : config.container;
  const rootClass = classNames43(
    "tabs",
    "flex",
    orientation === "vertical" ? "flex-row h-full" : "flex-col h-full",
    "overflow-hidden min-h-0",
    resolvedContainer,
    className
  );
  const renderTabIcon = (icon) => {
    if (!icon) {
      return null;
    }
    if (typeof icon === "string") {
      return renderIcon2(icon, void 0, iconClasses);
    }
    if (React36.isValidElement(icon)) {
      return React36.cloneElement(icon, {
        className: classNames43(iconClasses, icon.props.className)
      });
    }
    return /* @__PURE__ */ jsx193("span", { className: iconClasses, children: icon });
  };
  return /* @__PURE__ */ jsxs89("div", { className: rootClass, children: [
    /* @__PURE__ */ jsxs89(
      "div",
      {
        role: "tablist",
        "aria-orientation": orientation,
        className: classNames43(baseList, "flex-shrink-0 z-10"),
        children: [
          items.map((item, index) => {
            const isActive = item.id === activeId;
            const isDisabled = item.disabled;
            const controlsId = `${panelIdPrefix}-${item.id}`;
            const baseClassesForItem = classNames43(
              baseTabClasses,
              sizeConfig.padding,
              sizeConfig.text,
              sizeConfig.gap,
              focusRing(color),
              focusOffset,
              config.base,
              isActive ? config.active : config.inactive,
              isDisabled && config.disabled,
              fullWidth && "flex-1 justify-center"
            );
            const showDividerAfter = shouldShowDividers && index < items.length - 1;
            return /* @__PURE__ */ jsxs89(React36.Fragment, { children: [
              /* @__PURE__ */ jsxs89(
                "button",
                {
                  type: "button",
                  role: "tab",
                  id: `tab-${item.id}`,
                  "aria-selected": isActive,
                  "aria-controls": controlsId,
                  disabled: isDisabled,
                  className: baseClassesForItem,
                  onClick: () => {
                    if (isDisabled) {
                      return;
                    }
                    if (!allowReselect && item.id === activeId) {
                      return;
                    }
                    if (value === void 0) {
                      setInternalValue(item.id);
                    }
                    onChange?.(item.id, item);
                  },
                  tabIndex: isActive ? 0 : -1,
                  children: [
                    renderTabIcon(item.icon),
                    /* @__PURE__ */ jsxs89("span", { className: "flex min-w-0 flex-col text-left", children: [
                      /* @__PURE__ */ jsx193("span", { className: "truncate", children: item.label }),
                      item.description ? /* @__PURE__ */ jsx193("span", { className: "mt-1 text-xs text-slate-500 dark:text-slate-400", children: item.description }) : null
                    ] }),
                    item.badge ? /* @__PURE__ */ jsx193(Badge_default, { count: item.badge, tone: item.badgeColor }) : null
                  ]
                }
              ),
              showDividerAfter ? /* @__PURE__ */ jsx193(
                "span",
                {
                  "aria-hidden": "true",
                  className: classNames43(
                    "pointer-events-none",
                    orientation === "vertical" ? "mx-0 my-2 h-[2px] rounded-full w-full bg-slate-200 dark:bg-neutral-100/2" : "mx-2 h-5 rounded-full w-[2px] bg-slate-300 dark:bg-neutral-400"
                  )
                }
              ) : null
            ] }, item.id);
          }),
          /* @__PURE__ */ jsx193("div", { className: "flex-grow" }),
          /* @__PURE__ */ jsx193(
            "div",
            {
              id: "tab-item-actions-end",
              className: "flex items-center gap-1 pr-2 text-neutral-400 dark:text-neutral-500",
              children: items.find((item) => item.id === activeId)?.actions?.map(
                (action, idx) => action.node ? /* @__PURE__ */ jsx193(React36.Fragment, { children: action.node }, action.id ?? `tab-action-${idx}`) : action.icon ? /* @__PURE__ */ jsx193(
                  IconButton_default,
                  {
                    accent: true,
                    color: action.color ?? color,
                    accentColor: action.color ?? color,
                    icon: action.icon,
                    size,
                    "aria-pressed": action.active || void 0,
                    "aria-label": typeof action.label === "string" ? action.label : `Action ${idx + 1}`,
                    onClick: action.onClick ?? (() => void 0),
                    className: classNames43(
                      `${action.active && iconAccentActive[action.color ?? color]}`
                    )
                  },
                  action.id ?? `tab-action-${idx}`
                ) : null
              )
            }
          )
        ]
      }
    ),
    items.map((item) => {
      if (item.panel === void 0) {
        return null;
      }
      const controlsId = `${panelIdPrefix}-${item.id}`;
      const isActive = item.id === activeId;
      return /* @__PURE__ */ jsx193(
        "div",
        {
          role: "tabpanel",
          id: controlsId,
          "aria-labelledby": `tab-${item.id}`,
          hidden: !isActive,
          "aria-hidden": !isActive,
          className: classNames43(
            "focus:outline-none flex-1 min-h-0",
            scrollFade ? "relative overflow-hidden" : "overflow-auto scrollbar-thin",
            isActive ? panelClassName : "hidden"
          ),
          children: scrollFade ? /* @__PURE__ */ jsxs89(Fragment11, { children: [
            /* @__PURE__ */ jsx193(
              "div",
              {
                "aria-hidden": true,
                className: classNames43(
                  "pointer-events-none absolute inset-x-0 top-0 h-8 z-10 bg-gradient-to-b to-transparent",
                  scrollFadeFrom
                )
              }
            ),
            /* @__PURE__ */ jsx193("div", { className: "overflow-auto h-full scrollbar-thin", children: item.panel })
          ] }) : item.panel
        },
        controlsId
      );
    })
  ] });
};
Tabs.displayName = "Tabs";
var Tabs_default = Tabs;

// src/components/Modal.tsx
import classNames44 from "classnames";
import {
  useCallback as useCallback11,
  useEffect as useEffect14,
  useId as useId7,
  useMemo as useMemo14,
  useRef as useRef16,
  useState as useState24
} from "react";
import { createPortal as createPortal7 } from "react-dom";

// src/utils/renderIcon.tsx
import React37, { cloneElement } from "react";
import { jsx as jsx194, jsxs as jsxs90 } from "react/jsx-runtime";
var renderIcon = (icon, size, className) => {
  if (!icon) {
    return null;
  }
  const resolvedSize = size ?? "md";
  if (typeof icon === "string") {
    return /* @__PURE__ */ jsx194(
      CustomIcon_default,
      {
        icon,
        className,
        size: resolvedSize
      }
    );
  }
  if (React37.isValidElement(icon)) {
    return cloneElement(icon, {
      className: mergeClassTokens(icon.props.className, className)
    });
  }
  return /* @__PURE__ */ jsxs90("span", { className, children: [
    " ",
    icon,
    " "
  ] });
};

// src/components/Modal.tsx
import { jsx as jsx195, jsxs as jsxs91 } from "react/jsx-runtime";
var sizePresets = {
  xs: { width: 320, className: "sm:max-w-[320px]" },
  sm: { width: 400, className: "sm:max-w-[400px]" },
  md: { width: 600, className: "sm:max-w-[600px]" },
  lg: { width: 800, className: "sm:max-w-[800px]" },
  xl: { width: 1e3, className: "sm:max-w-[1000px]" },
  xxl: { width: 1120, className: "sm:max-w-[1120px]" },
  "2xl": { width: 1120, className: "sm:max-w-[1120px]" },
  xxxl: { width: 1280, className: "sm:max-w-[1280px]" },
  "3xl": { width: 1280, className: "sm:max-w-[1280px]" },
  full: { className: "sm:max-w-none sm:w-full" }
};
var toCssDimension2 = (value) => {
  if (value === void 0 || value === null) {
    return void 0;
  }
  if (typeof value === "number") {
    return `${value}px`;
  }
  return value;
};
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
var alignmentClassMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between"
};
var ModalActions = ({
  children,
  align = "end",
  className
}) => {
  const alignmentClass = alignmentClassMap[align] ?? alignmentClassMap.end;
  return /* @__PURE__ */ jsx195(
    "div",
    {
      className: classNames44(
        "flex w-full flex-wrap items-center gap-2",
        alignmentClass,
        className
      ),
      children
    }
  );
};
var Modal = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  bodyHeader,
  bodyClassName,
  footer,
  actions,
  size = "md",
  maxWidth,
  minWidth,
  minHeight,
  backgroundClassName,
  background_color,
  darkOverlay,
  dark_overlay,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  preventScroll = true,
  className,
  overlayClassName,
  style,
  headerActions,
  header_actions,
  headerTabs,
  loading,
  loadingTitle,
  loadingLabel,
  hideCloseButton = false,
  onBack,
  backTooltip = "Go back",
  initialFocusRef,
  ariaLabel,
  role = "dialog",
  showFooterDivider,
  onMouseDown,
  onClick,
  onKeyDown,
  ...rest
}) => {
  const hasDom = isBrowser;
  const contentRef = useRef16(null);
  const closeButtonRef = useRef16(null);
  const previouslyFocusedRef = useRef16(null);
  const headingId = useId7();
  const bodyId = useId7();
  const isDarkOverlay = darkOverlay ?? dark_overlay ?? false;
  const footerContent = footer ?? actions;
  const effectiveHeaderActions = headerActions ?? header_actions ?? [];
  const tabsConfig = useMemo14(() => {
    if (headerTabs) {
      return headerTabs;
    }
  }, [headerTabs]);
  const presetForSize = typeof size === "string" ? sizePresets[size] : void 0;
  const fallbackPreset = sizePresets.md;
  const resolvedPreset = presetForSize ?? fallbackPreset;
  const isFullWidth = size === "full";
  const explicitSize = typeof size === "number" || typeof size === "string" && presetForSize === void 0 && !isFullWidth;
  const sizeClass = !explicitSize ? resolvedPreset.className : void 0;
  const presetWidth = !explicitSize && !isFullWidth ? resolvedPreset.width : void 0;
  const presetWidthValue = presetWidth ? toCssDimension2(presetWidth) : void 0;
  const explicitWidthValue = explicitSize ? toCssDimension2(size) : void 0;
  const resolvedMaxWidth = maxWidth !== void 0 ? toCssDimension2(maxWidth) : isFullWidth ? "100%" : explicitWidthValue ?? presetWidthValue;
  const resolvedWidth = isFullWidth ? "100%" : explicitWidthValue ? `min(100%, ${explicitWidthValue})` : presetWidthValue ? `min(100%, ${presetWidthValue})` : void 0;
  const overlayClasses = classNames44(
    "fixed inset-0 z-[1600] flex min-h-full items-start justify-center overflow-y-auto px-4 py-6 sm:px-8 sm:py-12 sm:items-center",
    isDarkOverlay ? "bg-neutral-950/70" : "bg-neutral-900/40",
    "backdrop-blur-sm",
    overlayClassName
  );
  const contentClasses = classNames44(
    "relative flex w-full max-h-[90vh] sm:max-h-[85vh] flex-col overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white shadow-2xl transition-all duration-200 ease-out dark:border-neutral-700/60 dark:bg-neutral-800",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-0",
    sizeClass,
    backgroundClassName,
    background_color,
    className
  );
  const showFooterDividerClass = showFooterDivider ? "border-t border-neutral-200/70 dark:border-neutral-700/60" : "";
  const contentStyle = {
    ...resolvedWidth ? { width: resolvedWidth } : void 0,
    ...resolvedMaxWidth ? { maxWidth: resolvedMaxWidth } : void 0,
    ...minWidth !== void 0 ? { minWidth: toCssDimension2(minWidth) } : void 0,
    ...minHeight !== void 0 ? { minHeight: toCssDimension2(minHeight) } : void 0,
    ...style
  };
  const ariaLabelValue = ariaLabel ?? (typeof title === "string" ? title : void 0);
  const ariaLabelledBy = ariaLabelValue ? void 0 : headingId;
  const ariaDescribedBy = description || bodyHeader ? bodyId : void 0;
  const handleKeyDown = useCallback11(
    (event) => {
      if (closeOnEsc && event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    },
    [closeOnEsc, onClose]
  );
  useEffect14(() => {
    if (!hasDom) {
      return;
    }
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      const focusTarget = initialFocusRef?.current ?? (!hideCloseButton ? closeButtonRef.current : null) ?? contentRef.current;
      const focusFrame = requestAnimationFrame(() => {
        focusTarget?.focus({ preventScroll: true });
      });
      return () => {
        cancelAnimationFrame(focusFrame);
      };
    }
  }, [hasDom, isOpen, hideCloseButton, initialFocusRef]);
  useEffect14(() => {
    if (!hasDom) {
      return;
    }
    if (isOpen) {
      if (closeOnEsc) {
        document.addEventListener("keydown", handleKeyDown);
      }
      if (preventScroll) {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.removeEventListener("keydown", handleKeyDown);
          document.body.style.overflow = originalOverflow;
        };
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeOnEsc, handleKeyDown, hasDom, isOpen, preventScroll]);
  useEffect14(() => {
    if (!hasDom) {
      return;
    }
    if (!isOpen && previouslyFocusedRef.current) {
      const node = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      node.focus({ preventScroll: true });
    }
  }, [hasDom, isOpen]);
  const handleBackdropMouseDown = useCallback11(
    (event) => {
      if (!closeOnBackdropClick) {
        return;
      }
      if (event.target === event.currentTarget) {
        event.stopPropagation();
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );
  const handleContentMouseDown = useCallback11(
    (event) => {
      event.stopPropagation();
      onMouseDown?.(event);
    },
    [onMouseDown]
  );
  const handleContentClick = useCallback11(
    (event) => {
      event.stopPropagation();
      onClick?.(event);
    },
    [onClick]
  );
  const handleContentKeyDown = useCallback11(
    (event) => {
      onKeyDown?.(event);
    },
    [onKeyDown]
  );
  if (!hasDom || !isOpen) {
    return null;
  }
  const content = /* @__PURE__ */ jsx195("div", { className: overlayClasses, onMouseDown: handleBackdropMouseDown, children: /* @__PURE__ */ jsxs91(
    "div",
    {
      ref: contentRef,
      className: contentClasses,
      style: contentStyle,
      role,
      "aria-modal": "true",
      "aria-labelledby": ariaLabelledBy,
      "aria-label": ariaLabelValue,
      "aria-describedby": ariaDescribedBy,
      "aria-busy": loading ? "true" : void 0,
      tabIndex: -1,
      onMouseDown: handleContentMouseDown,
      onClick: handleContentClick,
      onKeyDown: handleContentKeyDown,
      ...rest,
      children: [
        /* @__PURE__ */ jsxs91("div", { className: "flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200/70 pl-4 pr-3 py-4 dark:border-neutral-700/60", children: [
          onBack && /* @__PURE__ */ jsx195("div", { className: "flex shrink-0 items-center self-center", children: /* @__PURE__ */ jsx195(
            IconButton_default,
            {
              icon: "ArrowChevronLeft",
              variant: "ghost",
              color: "slate",
              size: "sm",
              tooltip: backTooltip,
              tooltipPosition: "bottom",
              "aria-label": backTooltip,
              onClick: onBack
            }
          ) }),
          /* @__PURE__ */ jsxs91("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
            /* @__PURE__ */ jsxs91("div", { className: "flex min-w-0 items-center gap-3", children: [
              icon && /* @__PURE__ */ jsx195("div", { className: "flex shrink-0 items-center justify-center text-neutral-600 dark:text-neutral-200", children: renderIcon(icon, "sm") }),
              /* @__PURE__ */ jsx195("div", { className: "min-w-0", children: /* @__PURE__ */ jsx195(
                "h2",
                {
                  id: headingId,
                  className: "truncate text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100",
                  children: title
                }
              ) })
            ] }),
            description && /* @__PURE__ */ jsx195("p", { className: "text-sm text-neutral-600 dark:text-neutral-300", children: description })
          ] }),
          /* @__PURE__ */ jsxs91("div", { className: "flex shrink-0 items-center gap-2", children: [
            effectiveHeaderActions.map((action, index) => /* @__PURE__ */ jsx195(Button_default, { ...action }, `modal-header-action-${index}`)),
            !hideCloseButton && /* @__PURE__ */ jsx195(
              IconButton_default,
              {
                ref: closeButtonRef,
                icon: "Close",
                variant: "ghost",
                color: "slate",
                size: "sm",
                "aria-label": "Close dialog",
                onClick: onClose
              }
            )
          ] })
        ] }),
        tabsConfig && /* @__PURE__ */ jsx195("div", { className: "shrink-0 border-b border-neutral-200/70 px-6 py-2 dark:border-neutral-700/60", children: /* @__PURE__ */ jsx195(
          Tabs_default,
          {
            ...tabsConfig,
            className: classNames44(
              "w-full overflow-x-auto",
              tabsConfig.className
            )
          }
        ) }),
        bodyHeader && /* @__PURE__ */ jsxs91("div", { className: "shrink-0 border-b border-neutral-200/70 bg-neutral-50 px-6 py-3 dark:border-neutral-700/60 dark:bg-neutral-800/60", children: [
          " ",
          bodyHeader
        ] }),
        /* @__PURE__ */ jsxs91("div", { className: "relative flex flex-1 min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-800/60", children: [
          loading && /* @__PURE__ */ jsx195(
            Loader_default,
            {
              overlay: true,
              title: loadingTitle,
              label: loadingLabel,
              className: "z-30"
            }
          ),
          /* @__PURE__ */ jsx195(
            "div",
            {
              id: bodyId,
              className: classNames44(
                "relative flex-1 min-h-0 overflow-y-auto px-6 py-5",
                "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 hover:[&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:hover:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-transparent",
                bodyClassName,
                loading && "pointer-events-none"
              ),
              children: /* @__PURE__ */ jsx195("div", { className: "flex flex-col gap-4", children })
            }
          )
        ] }),
        footerContent && /* @__PURE__ */ jsx195(
          "div",
          {
            className: classNames44(
              "flex shrink-0 items-center  justify-end gap-3 bg-neutral-50 px-6 py-4 dark:bg-neutral-800/60",
              showFooterDividerClass
            ),
            children: footerContent
          }
        )
      ]
    }
  ) });
  return createPortal7(content, document.body);
};
var ConfirmModal = ({
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onClose,
  confirmVariant = "solid",
  isConfirmDisabled = false,
  confirmButtonProps,
  cancelButtonProps,
  children,
  ...props
}) => {
  return /* @__PURE__ */ jsx195(
    Modal,
    {
      ...props,
      onClose,
      footer: /* @__PURE__ */ jsxs91(ModalActions, { children: [
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: "soft",
            color: "slate",
            onClick: onClose,
            ...cancelButtonProps,
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: confirmVariant,
            color: props.confirmColor || "blue",
            onClick: onConfirm,
            disabled: isConfirmDisabled,
            ...confirmButtonProps,
            children: confirmLabel
          }
        )
      ] }),
      children
    }
  );
};
var DeleteConfirmModal = ({
  confirmValue,
  confirmValueLabel = "name",
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  isConfirmDisabled,
  children,
  cancelLabel = "Cancel",
  cancelButtonProps,
  confirmButtonProps,
  ...props
}) => {
  const [inputValue, setInputValue] = useState24("");
  const inputRef = useRef16(null);
  const isMatch = inputValue === confirmValue;
  useEffect14(() => {
    if (!props.isOpen) setInputValue("");
  }, [props.isOpen]);
  return /* @__PURE__ */ jsxs91(
    Modal,
    {
      ...props,
      onClose,
      role: "alertdialog",
      initialFocusRef: inputRef,
      footer: /* @__PURE__ */ jsxs91(ModalActions, { children: [
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: "soft",
            color: "slate",
            onClick: onClose,
            ...cancelButtonProps,
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: "solid",
            color: "danger",
            onClick: onConfirm,
            disabled: !isMatch || isConfirmDisabled,
            ...confirmButtonProps,
            children: confirmLabel
          }
        )
      ] }),
      children: [
        children,
        /* @__PURE__ */ jsxs91("div", { className: "flex flex-col gap-2 pt-1", children: [
          /* @__PURE__ */ jsxs91("label", { className: "text-sm text-neutral-600 dark:text-neutral-400", children: [
            "Type the ",
            confirmValueLabel,
            " ",
            /* @__PURE__ */ jsx195("span", { className: "font-mono font-semibold text-neutral-800 dark:text-neutral-200", children: confirmValue }),
            " ",
            "to confirm:"
          ] }),
          /* @__PURE__ */ jsx195(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && isMatch && !isConfirmDisabled) onConfirm();
              },
              placeholder: confirmValue,
              className: "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30",
              autoComplete: "off",
              spellCheck: false
            }
          )
        ] })
      ]
    }
  );
};
var ApplyConfirmModal = ({
  confirmValue,
  confirmValueLabel = "name",
  confirmLabel = "Apply",
  onConfirm,
  onClose,
  isConfirmDisabled,
  children,
  cancelLabel = "Cancel",
  cancelButtonProps,
  confirmButtonProps,
  ...props
}) => {
  const [inputValue, setInputValue] = useState24("");
  const inputRef = useRef16(null);
  const isMatch = inputValue === confirmValue;
  useEffect14(() => {
    if (!props.isOpen) setInputValue("");
  }, [props.isOpen]);
  return /* @__PURE__ */ jsxs91(
    Modal,
    {
      ...props,
      onClose,
      role: "alertdialog",
      initialFocusRef: inputRef,
      footer: /* @__PURE__ */ jsxs91(ModalActions, { children: [
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: "soft",
            color: "slate",
            onClick: onClose,
            ...cancelButtonProps,
            children: cancelLabel
          }
        ),
        /* @__PURE__ */ jsx195(
          Button_default,
          {
            variant: "solid",
            color: "brand",
            onClick: onConfirm,
            disabled: !isMatch || isConfirmDisabled,
            ...confirmButtonProps,
            children: confirmLabel
          }
        )
      ] }),
      children: [
        children,
        /* @__PURE__ */ jsxs91("div", { className: "flex flex-col gap-2 pt-1", children: [
          /* @__PURE__ */ jsxs91("label", { className: "text-sm text-neutral-600 dark:text-neutral-400", children: [
            "Type the ",
            confirmValueLabel,
            " ",
            /* @__PURE__ */ jsx195("span", { className: "font-mono font-semibold text-neutral-800 dark:text-neutral-200", children: confirmValue }),
            " ",
            "to confirm:"
          ] }),
          /* @__PURE__ */ jsx195(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && isMatch && !isConfirmDisabled) onConfirm();
              },
              placeholder: confirmValue,
              className: "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30",
              autoComplete: "off",
              spellCheck: false
            }
          )
        ] })
      ]
    }
  );
};
Modal.Actions = ModalActions;
Modal.Confirm = ConfirmModal;
Modal.DeleteConfirm = DeleteConfirmModal;
Modal.ApplyConfirm = ApplyConfirmModal;

// src/components/InlinePanel.tsx
import classNames45 from "classnames";
import {
  useCallback as useCallback12,
  useEffect as useEffect15,
  useId as useId8,
  useMemo as useMemo15,
  useRef as useRef17,
  useState as useState25
} from "react";
import { Fragment as Fragment12, jsx as jsx196, jsxs as jsxs92 } from "react/jsx-runtime";
var sizePresets2 = {
  xs: { maxWidth: "320px", className: "max-w-[320px]" },
  sm: { maxWidth: "400px", className: "max-w-[400px]" },
  md: { maxWidth: "600px", className: "max-w-[600px]" },
  lg: { maxWidth: "800px", className: "max-w-[800px]" },
  xl: { maxWidth: "1000px", className: "max-w-[1000px]" },
  xxl: { maxWidth: "1120px", className: "max-w-[1120px]" },
  "2xl": { maxWidth: "1120px", className: "max-w-[1120px]" },
  xxxl: { maxWidth: "1280px", className: "max-w-[1280px]" },
  "3xl": { maxWidth: "1280px", className: "max-w-[1280px]" },
  full: { className: "w-full max-w-none" }
};
var InlinePanel = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  bodyHeader,
  bodyClassName,
  footer,
  actions,
  size = "md",
  maxWidth,
  minWidth,
  height,
  maxHeight,
  minHeight,
  anchor = "fill",
  zIndex = 20,
  closeOnEsc = true,
  closeOnBackdropClick = false,
  showBackdrop = false,
  loading,
  loadingTitle,
  loadingLabel,
  headerActions = [],
  onBack,
  backTooltip = "Go back",
  hideCloseButton = false,
  showFooterDivider,
  initialFocusRef,
  ariaLabel,
  role = "dialog",
  className,
  style,
  ...rest
}) => {
  const contentRef = useRef17(null);
  const closeButtonRef = useRef17(null);
  const previouslyFocusedRef = useRef17(null);
  const prevOpenRef = useRef17(isOpen);
  const headingId = useId8();
  const bodyId = useId8();
  const [mounted, setMounted] = useState25(isOpen);
  useEffect15(() => {
    if (isOpen && !prevOpenRef.current) {
      setMounted(true);
    }
    prevOpenRef.current = isOpen;
  }, [isOpen]);
  const handleTransitionEnd = useCallback12(
    (e) => {
      if (e.target !== e.currentTarget) return;
      if (!isOpen) setMounted(false);
    },
    [isOpen]
  );
  useEffect15(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement;
      const focusTarget = initialFocusRef?.current ?? (!hideCloseButton ? closeButtonRef.current : null) ?? contentRef.current;
      const frame = requestAnimationFrame(
        () => focusTarget?.focus({ preventScroll: true })
      );
      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen, hideCloseButton, initialFocusRef]);
  useEffect15(() => {
    if (!isOpen && previouslyFocusedRef.current) {
      const node = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      node.focus({ preventScroll: true });
    }
  }, [isOpen]);
  useEffect15(() => {
    if (!isOpen || !closeOnEsc) return;
    const handler = (e) => {
      if (e.key === "Escape" && !e.defaultPrevented) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeOnEsc, onClose]);
  useEffect15(() => {
    if (process.env.NODE_ENV !== "production" && isOpen && contentRef.current) {
      const parent = contentRef.current.parentElement;
      if (parent) {
        const { position } = getComputedStyle(parent);
        if (position === "static") {
          console.warn(
            "[InlinePanel] The parent element has `position: static`. Add `position: relative` (or any non-static position) so the panel clips to the intended container."
          );
        }
      }
    }
  }, [isOpen]);
  const shellPositionClass = useMemo15(() => {
    switch (anchor) {
      case "top":
        return "absolute top-0 inset-x-0 flex justify-center items-start";
      case "bottom":
        return "absolute bottom-0 inset-x-0 flex justify-center items-end";
      case "center":
        return "absolute inset-0 flex justify-center items-center";
      case "fill":
      default:
        return "absolute inset-0";
    }
  }, [anchor]);
  const transitionBase = "transition-[transform,opacity,scale] duration-200 ease-out";
  const shellTransitionClass = useMemo15(() => {
    if (anchor === "fill") {
      return isOpen ? "opacity-100" : "opacity-0 pointer-events-none";
    }
    if (anchor === "top") {
      return isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none";
    }
    if (anchor === "bottom") {
      return isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none";
    }
    return isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none";
  }, [anchor, isOpen]);
  const preset = sizePresets2[size] ?? sizePresets2.md;
  const isFill = anchor === "fill";
  const isCenter = anchor === "center";
  const cardSizeClass = isFill ? "w-full h-full" : preset.className;
  const cardStyle = {
    ...maxWidth !== void 0 ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth } : !isFill ? { maxWidth: preset.maxWidth } : void 0,
    ...minWidth !== void 0 ? { minWidth: typeof minWidth === "number" ? `${minWidth}px` : minWidth } : void 0,
    ...height !== void 0 ? { height: typeof height === "number" ? `${height}px` : height } : void 0,
    ...maxHeight !== void 0 ? {
      maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight
    } : void 0,
    ...minHeight !== void 0 ? {
      minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight
    } : void 0,
    ...style
  };
  const footerContent = footer ?? actions;
  const showFooterDividerClass = showFooterDivider ? "border-t border-neutral-200/70 dark:border-neutral-700/60" : "";
  const ariaLabelValue = ariaLabel ?? (typeof title === "string" ? title : void 0);
  const ariaLabelledBy = ariaLabelValue ? void 0 : headingId;
  const ariaDescribedBy = description || bodyHeader ? bodyId : void 0;
  if (!mounted) return null;
  return (
    // ── Positioning shell ──────────────────────────────────────────────────
    /* @__PURE__ */ jsxs92(
      "div",
      {
        className: classNames45(
          shellPositionClass,
          transitionBase,
          shellTransitionClass
        ),
        style: { zIndex },
        onTransitionEnd: handleTransitionEnd,
        children: [
          !isFill && showBackdrop && /* @__PURE__ */ jsx196(
            "div",
            {
              "aria-hidden": "true",
              className: "absolute inset-0 bg-neutral-900/30 backdrop-blur-sm",
              onMouseDown: closeOnBackdropClick ? onClose : void 0
            }
          ),
          /* @__PURE__ */ jsxs92(
            "div",
            {
              ref: contentRef,
              className: classNames45(
                "relative flex flex-col overflow-hidden border border-neutral-200/70 bg-white shadow-2xl dark:border-neutral-700/60 dark:bg-neutral-800",
                isFill ? "rounded-[inherit] w-full h-full" : isCenter ? "rounded-[28px] w-full mx-4" : "rounded-[28px] w-full",
                cardSizeClass,
                "focus-visible:outline-none",
                className
              ),
              style: cardStyle,
              role,
              "aria-modal": "true",
              "aria-labelledby": ariaLabelledBy,
              "aria-label": ariaLabelValue,
              "aria-describedby": ariaDescribedBy,
              "aria-busy": loading ? "true" : void 0,
              tabIndex: -1,
              ...rest,
              children: [
                /* @__PURE__ */ jsxs92("div", { className: "flex shrink-0 items-start justify-between gap-4 border-b border-neutral-200/70 pl-4 pr-3 py-4 dark:border-neutral-700/60", children: [
                  onBack && /* @__PURE__ */ jsx196("div", { className: "flex shrink-0 items-center self-center", children: /* @__PURE__ */ jsx196(
                    IconButton_default,
                    {
                      icon: "ArrowChevronLeft",
                      variant: "ghost",
                      color: "slate",
                      size: "sm",
                      tooltip: backTooltip,
                      tooltipPosition: "bottom",
                      "aria-label": backTooltip,
                      onClick: onBack
                    }
                  ) }),
                  /* @__PURE__ */ jsxs92("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [
                    /* @__PURE__ */ jsxs92("div", { className: "flex min-w-0 items-center gap-3", children: [
                      icon && /* @__PURE__ */ jsx196("div", { className: "flex shrink-0 items-center justify-center text-neutral-600 dark:text-neutral-200", children: renderIcon(icon, "sm") }),
                      /* @__PURE__ */ jsx196("div", { className: "min-w-0", children: /* @__PURE__ */ jsx196(
                        "h2",
                        {
                          id: headingId,
                          className: "truncate text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100",
                          children: title
                        }
                      ) })
                    ] }),
                    description && /* @__PURE__ */ jsx196("p", { className: "text-sm text-neutral-600 dark:text-neutral-300", children: description })
                  ] }),
                  /* @__PURE__ */ jsxs92("div", { className: "flex shrink-0 items-center gap-2", children: [
                    headerActions.map((action, i) => /* @__PURE__ */ jsx196(Button_default, { ...action }, `inline-panel-action-${i}`)),
                    !hideCloseButton && /* @__PURE__ */ jsx196(
                      IconButton_default,
                      {
                        ref: closeButtonRef,
                        icon: "Close",
                        variant: "ghost",
                        color: "slate",
                        size: "sm",
                        "aria-label": "Close",
                        onClick: onClose
                      }
                    )
                  ] })
                ] }),
                bodyHeader && /* @__PURE__ */ jsx196(
                  "div",
                  {
                    id: bodyId,
                    className: "shrink-0 border-b border-neutral-200/70 bg-neutral-50 px-6 py-3 dark:border-neutral-700/60 dark:bg-neutral-800/60",
                    children: bodyHeader
                  }
                ),
                /* @__PURE__ */ jsxs92("div", { className: "relative flex flex-1 min-h-0 overflow-hidden bg-neutral-50 dark:bg-neutral-800/60", children: [
                  loading && /* @__PURE__ */ jsx196(
                    Loader_default,
                    {
                      overlay: true,
                      title: loadingTitle,
                      label: loadingLabel,
                      className: "z-30"
                    }
                  ),
                  /* @__PURE__ */ jsx196(
                    "div",
                    {
                      id: bodyHeader ? void 0 : bodyId,
                      className: classNames45(
                        "relative flex-1 min-h-0 overflow-y-auto px-6 py-5",
                        "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-neutral-200 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700",
                        bodyClassName,
                        loading && "pointer-events-none"
                      ),
                      children: /* @__PURE__ */ jsx196("div", { className: "flex flex-col gap-4", children })
                    }
                  )
                ] }),
                footerContent && /* @__PURE__ */ jsx196(
                  "div",
                  {
                    className: classNames45(
                      "flex shrink-0 items-center justify-end gap-3 bg-neutral-50 px-6 py-4 dark:bg-neutral-800/60",
                      showFooterDividerClass
                    ),
                    children: footerContent
                  }
                )
              ]
            }
          )
        ]
      }
    )
  );
};
InlinePanel.displayName = "InlinePanel";
var ConfirmInlinePanel = ({
  onConfirm,
  onClose,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "solid",
  confirmColor = "blue",
  isConfirmDisabled = false,
  anchor = "center",
  showBackdrop = true,
  size = "sm",
  children,
  ...props
}) => /* @__PURE__ */ jsx196(
  InlinePanel,
  {
    ...props,
    anchor,
    showBackdrop,
    size,
    onClose,
    role: "alertdialog",
    actions: /* @__PURE__ */ jsxs92(Fragment12, { children: [
      /* @__PURE__ */ jsx196(Button_default, { variant: "soft", color: "slate", size: "sm", onClick: onClose, children: cancelLabel }),
      /* @__PURE__ */ jsx196(
        Button_default,
        {
          variant: confirmVariant,
          color: confirmColor,
          size: "sm",
          disabled: isConfirmDisabled,
          onClick: onConfirm,
          children: confirmLabel
        }
      )
    ] }),
    children: children ?? null
  }
);
ConfirmInlinePanel.displayName = "ConfirmInlinePanel";
var DeleteConfirmInlinePanel = ({
  confirmValue,
  confirmValueLabel = "name",
  confirmLabel = "Delete",
  onConfirm,
  onClose,
  isConfirmDisabled,
  children,
  cancelLabel = "Cancel",
  ...props
}) => {
  const [inputValue, setInputValue] = useState25("");
  const inputRef = useRef17(null);
  const isMatch = inputValue === confirmValue;
  useEffect15(() => {
    if (!props.isOpen) setInputValue("");
  }, [props.isOpen]);
  return /* @__PURE__ */ jsxs92(
    ConfirmInlinePanel,
    {
      ...props,
      onClose,
      onConfirm,
      confirmLabel,
      cancelLabel,
      confirmVariant: "solid",
      confirmColor: "danger",
      isConfirmDisabled: !isMatch || isConfirmDisabled,
      initialFocusRef: inputRef,
      children: [
        children,
        /* @__PURE__ */ jsxs92("div", { className: "flex flex-col gap-2 pt-1", children: [
          /* @__PURE__ */ jsxs92("label", { className: "text-sm text-neutral-600 dark:text-neutral-400", children: [
            "Type the ",
            confirmValueLabel,
            " ",
            /* @__PURE__ */ jsx196("span", { className: "font-mono font-semibold text-neutral-800 dark:text-neutral-200", children: confirmValue }),
            " ",
            "to confirm:"
          ] }),
          /* @__PURE__ */ jsx196(
            "input",
            {
              ref: inputRef,
              type: "text",
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && isMatch && !isConfirmDisabled) onConfirm();
              },
              placeholder: confirmValue,
              className: "w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30",
              autoComplete: "off",
              spellCheck: false
            }
          )
        ] })
      ]
    }
  );
};
DeleteConfirmInlinePanel.displayName = "DeleteConfirmInlinePanel";

// src/components/SideMenu.tsx
import { Link, useLocation } from "react-router-dom";
import React40, { useMemo as useMemo16, useState as useState26 } from "react";
import { Fragment as Fragment13, jsx as jsx197, jsxs as jsxs93 } from "react/jsx-runtime";

// src/components/SideMenuLayout.tsx
import { useState as useState28 } from "react";
import classNames46 from "classnames";

// src/contexts/SideMenuActionsContext.tsx
import { createContext as createContext2, useCallback as useCallback13, useContext as useContext2, useState as useState27 } from "react";
import { jsx as jsx198 } from "react/jsx-runtime";
var noop = () => {
};
var SideMenuActionsContext = createContext2({
  setSideItemActions: noop,
  setSidePanelActions: noop
});

// src/components/SideMenuLayout.tsx
import { jsx as jsx199, jsxs as jsxs94 } from "react/jsx-runtime";

// src/components/SplitView.tsx
import {
  useCallback as useCallback16,
  useEffect as useEffect18,
  useMemo as useMemo17,
  useRef as useRef20,
  useState as useState31
} from "react";
import classNames48 from "classnames";

// src/hooks/useResizable.ts
import { useCallback as useCallback14, useEffect as useEffect16, useRef as useRef18, useState as useState29 } from "react";
function useResizable({
  initialWidth,
  minWidth = 100,
  maxWidth: maxWidthOpt = 600,
  onResize,
  onResizeEnd,
  enabled = true
}) {
  const [width, setWidth] = useState29(initialWidth);
  const [isDragging, setIsDragging] = useState29(false);
  const startXRef = useRef18(0);
  const startWidthRef = useRef18(0);
  const getMaxWidth = useCallback14(() => {
    return typeof maxWidthOpt === "function" ? maxWidthOpt() : maxWidthOpt;
  }, [maxWidthOpt]);
  const clamp = useCallback14(
    (value) => Math.max(minWidth, Math.min(getMaxWidth(), value)),
    [minWidth, getMaxWidth]
  );
  useEffect16(() => {
    if (!isDragging) return;
    const handlePointerMove = (e) => {
      const delta = e.clientX - startXRef.current;
      const newWidth = clamp(startWidthRef.current + delta);
      setWidth(newWidth);
      onResize?.(newWidth);
    };
    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setWidth((w) => {
        onResizeEnd?.(w);
        return w;
      });
    };
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, clamp, onResize, onResizeEnd]);
  const onPointerDown = useCallback14(
    (e) => {
      if (!enabled) return;
      e.preventDefault();
      startXRef.current = e.clientX;
      startWidthRef.current = width;
      setIsDragging(true);
    },
    [enabled, width]
  );
  const onKeyDown = useCallback14(
    (e) => {
      if (!enabled) return;
      const step = 20;
      let newWidth = width;
      if (e.key === "ArrowRight") {
        newWidth = clamp(width + step);
      } else if (e.key === "ArrowLeft") {
        newWidth = clamp(width - step);
      } else {
        return;
      }
      e.preventDefault();
      setWidth(newWidth);
      onResize?.(newWidth);
      onResizeEnd?.(newWidth);
    },
    [enabled, width, clamp, onResize, onResizeEnd]
  );
  const resolvedMax = getMaxWidth();
  return {
    width,
    isDragging,
    handleProps: {
      onPointerDown,
      onKeyDown,
      role: "separator",
      "aria-orientation": "vertical",
      "aria-valuenow": width,
      "aria-valuemin": minWidth,
      "aria-valuemax": resolvedMax,
      tabIndex: enabled ? 0 : -1
    }
  };
}

// src/components/HelpButton.tsx
import { useCallback as useCallback15, useEffect as useEffect17, useRef as useRef19, useState as useState30 } from "react";
import { createPortal as createPortal8 } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import classNames47 from "classnames";
import { jsx as jsx200, jsxs as jsxs95 } from "react/jsx-runtime";
var toneMap = {
  blue: {
    strip: "border-t-blue-500    bg-blue-50/70    dark:bg-blue-950/40",
    accent: "text-blue-700    dark:text-blue-300",
    iconBg: "bg-blue-100/80    dark:bg-blue-900/40"
  },
  indigo: {
    strip: "border-t-indigo-500  bg-indigo-50/70  dark:bg-indigo-950/40",
    accent: "text-indigo-700  dark:text-indigo-300",
    iconBg: "bg-indigo-100/80  dark:bg-indigo-900/40"
  },
  violet: {
    strip: "border-t-violet-500  bg-violet-50/70  dark:bg-violet-950/40",
    accent: "text-violet-700  dark:text-violet-300",
    iconBg: "bg-violet-100/80  dark:bg-violet-900/40"
  },
  sky: {
    strip: "border-t-sky-500     bg-sky-50/70     dark:bg-sky-950/40",
    accent: "text-sky-700     dark:text-sky-300",
    iconBg: "bg-sky-100/80     dark:bg-sky-900/40"
  },
  cyan: {
    strip: "border-t-cyan-500    bg-cyan-50/70    dark:bg-cyan-950/40",
    accent: "text-cyan-700    dark:text-cyan-300",
    iconBg: "bg-cyan-100/80    dark:bg-cyan-900/40"
  },
  teal: {
    strip: "border-t-teal-500    bg-teal-50/70    dark:bg-teal-950/40",
    accent: "text-teal-700    dark:text-teal-300",
    iconBg: "bg-teal-100/80    dark:bg-teal-900/40"
  },
  emerald: {
    strip: "border-t-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40",
    accent: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40"
  },
  green: {
    strip: "border-t-green-500   bg-green-50/70   dark:bg-green-950/40",
    accent: "text-green-700   dark:text-green-300",
    iconBg: "bg-green-100/80   dark:bg-green-900/40"
  },
  amber: {
    strip: "border-t-amber-500   bg-amber-50/70   dark:bg-amber-950/40",
    accent: "text-amber-700   dark:text-amber-300",
    iconBg: "bg-amber-100/80   dark:bg-amber-900/40"
  },
  orange: {
    strip: "border-t-orange-500  bg-orange-50/70  dark:bg-orange-950/40",
    accent: "text-orange-700  dark:text-orange-300",
    iconBg: "bg-orange-100/80  dark:bg-orange-900/40"
  },
  rose: {
    strip: "border-t-rose-500    bg-rose-50/70    dark:bg-rose-950/40",
    accent: "text-rose-700    dark:text-rose-300",
    iconBg: "bg-rose-100/80    dark:bg-rose-900/40"
  },
  pink: {
    strip: "border-t-pink-500    bg-pink-50/70    dark:bg-pink-950/40",
    accent: "text-pink-700    dark:text-pink-300",
    iconBg: "bg-pink-100/80    dark:bg-pink-900/40"
  },
  slate: {
    strip: "border-t-slate-400   bg-slate-50/80   dark:bg-slate-800/50",
    accent: "text-slate-700   dark:text-slate-300",
    iconBg: "bg-slate-100/80   dark:bg-slate-800"
  },
  // Semantic aliases
  info: {
    strip: "border-t-sky-500     bg-sky-50/70     dark:bg-sky-950/40",
    accent: "text-sky-700     dark:text-sky-300",
    iconBg: "bg-sky-100/80     dark:bg-sky-900/40"
  },
  success: {
    strip: "border-t-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40",
    accent: "text-emerald-700 dark:text-emerald-300",
    iconBg: "bg-emerald-100/80 dark:bg-emerald-900/40"
  },
  warning: {
    strip: "border-t-amber-500   bg-amber-50/70   dark:bg-amber-950/40",
    accent: "text-amber-700   dark:text-amber-300",
    iconBg: "bg-amber-100/80   dark:bg-amber-900/40"
  },
  danger: {
    strip: "border-t-rose-500    bg-rose-50/70    dark:bg-rose-950/40",
    accent: "text-rose-700    dark:text-rose-300",
    iconBg: "bg-rose-100/80    dark:bg-rose-900/40"
  },
  brand: {
    strip: "border-t-blue-500    bg-blue-50/70    dark:bg-blue-950/40",
    accent: "text-blue-700    dark:text-blue-300",
    iconBg: "bg-blue-100/80    dark:bg-blue-900/40"
  }
};
var fallbackTone = {
  strip: "border-t-neutral-400 bg-neutral-50/80 dark:bg-neutral-800/50",
  accent: "text-neutral-700 dark:text-neutral-300",
  iconBg: "bg-neutral-100 dark:bg-neutral-800"
};
var mdComponents = {
  a: ({ href, children }) => /* @__PURE__ */ jsx200(
    "a",
    {
      href,
      target: "_blank",
      rel: "noopener noreferrer",
      className: "text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-150",
      children
    }
  ),
  p: ({ children }) => /* @__PURE__ */ jsx200("p", { className: "text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed mb-2 last:mb-0", children }),
  h1: ({ children }) => /* @__PURE__ */ jsx200("h1", { className: "text-base font-bold text-neutral-900 dark:text-neutral-100 mb-2 mt-3 first:mt-0", children }),
  h2: ({ children }) => /* @__PURE__ */ jsx200("h2", { className: "text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1.5 mt-3 first:mt-0", children }),
  h3: ({ children }) => /* @__PURE__ */ jsx200("h3", { className: "text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1 mt-2 first:mt-0", children }),
  ul: ({ children }) => /* @__PURE__ */ jsx200("ul", { className: "list-disc list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4", children }),
  ol: ({ children }) => /* @__PURE__ */ jsx200("ol", { className: "list-decimal list-outside text-sm text-neutral-700 dark:text-neutral-300 space-y-0.5 mb-2 pl-4", children }),
  li: ({ children }) => /* @__PURE__ */ jsx200("li", { className: "leading-relaxed", children }),
  blockquote: ({ children }) => /* @__PURE__ */ jsx200("blockquote", { className: "border-l-[3px] border-neutral-300 dark:border-neutral-600 pl-3 my-2 text-neutral-500 dark:text-neutral-400 italic", children }),
  hr: () => /* @__PURE__ */ jsx200("hr", { className: "my-3 border-neutral-200 dark:border-neutral-700" }),
  strong: ({ children }) => /* @__PURE__ */ jsx200("strong", { className: "font-semibold text-neutral-900 dark:text-neutral-100", children }),
  em: ({ children }) => /* @__PURE__ */ jsx200("em", { className: "italic text-neutral-600 dark:text-neutral-400", children }),
  /**
   * Inline code has no className; fenced block code has a language-* class.
   * We style them differently — inline is a subtle chip, block is a scrollable box.
   */
  code: ({ className, children }) => {
    const isBlock = Boolean(className);
    if (isBlock) {
      return /* @__PURE__ */ jsx200("code", { className: "block bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre", children });
    }
    return /* @__PURE__ */ jsx200("code", { className: "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded px-1.5 py-0.5 text-xs font-mono", children });
  },
  pre: ({ children }) => /* @__PURE__ */ jsx200("pre", { className: "my-2 rounded-lg overflow-hidden", children }),
  // remark-gfm table support
  table: ({ children }) => /* @__PURE__ */ jsx200("div", { className: "overflow-x-auto my-3 rounded-xl border border-neutral-200 dark:border-neutral-700", children: /* @__PURE__ */ jsx200("table", { className: "min-w-full divide-y divide-neutral-200 dark:divide-neutral-700 text-xs", children }) }),
  thead: ({ children }) => /* @__PURE__ */ jsx200("thead", { className: "bg-neutral-100 dark:bg-neutral-800", children }),
  tbody: ({ children }) => /* @__PURE__ */ jsx200("tbody", { className: "divide-y divide-neutral-100 dark:divide-neutral-800/80", children }),
  tr: ({ children }) => /* @__PURE__ */ jsx200("tr", { className: "transition-colors duration-100 hover:bg-neutral-50 dark:hover:bg-neutral-800/40", children }),
  th: ({ children }) => /* @__PURE__ */ jsx200("th", { className: "px-3 py-2 text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300 whitespace-nowrap", children }),
  td: ({ children }) => /* @__PURE__ */ jsx200("td", { className: "px-3 py-2 text-neutral-600 dark:text-neutral-400", children })
};
var ESTIMATED_HEIGHT = 320;
var GAP = 8;
function computePopoverPosition(rect, placement, maxWidth) {
  const vpW = window.innerWidth;
  const vpH = window.innerHeight;
  const W = Math.min(maxWidth, vpW - 16);
  const spaceBelow = vpH - rect.bottom - GAP;
  const spaceAbove = rect.top - GAP;
  let resolved;
  if (placement === "auto" || placement === "bottom") {
    resolved = spaceBelow >= ESTIMATED_HEIGHT || spaceBelow >= spaceAbove ? "bottom" : "top";
  } else if (placement === "top") {
    resolved = spaceAbove >= ESTIMATED_HEIGHT || spaceAbove >= spaceBelow ? "top" : "bottom";
  } else {
    resolved = placement;
  }
  const style = { width: W };
  if (resolved === "bottom") {
    style.top = rect.bottom + GAP;
    style.left = Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8)
    );
  } else if (resolved === "top") {
    style.bottom = vpH - rect.top + GAP;
    style.left = Math.max(
      8,
      Math.min(rect.left + rect.width / 2 - W / 2, vpW - W - 8)
    );
  } else if (resolved === "right") {
    style.left = Math.min(rect.right + GAP, vpW - W - 8);
    style.top = Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8
      )
    );
  } else {
    style.left = Math.max(8, rect.left - W - GAP);
    style.top = Math.max(
      8,
      Math.min(
        rect.top + rect.height / 2 - ESTIMATED_HEIGHT / 2,
        vpH - ESTIMATED_HEIGHT - 8
      )
    );
  }
  return { style, resolvedPlacement: resolved };
}
var originClass = {
  bottom: "origin-top",
  top: "origin-bottom",
  left: "origin-right",
  right: "origin-left"
};
var HelpButton = ({
  content,
  title,
  placement = "auto",
  color = "info",
  size = "xs",
  icon = "Help",
  maxWidth = 360,
  className
}) => {
  const [open, setOpen] = useState30(false);
  const [popoverStyle, setPopoverStyle] = useState30({});
  const [resolvedPlacement, setResolvedPlacement] = useState30("bottom");
  const buttonRef = useRef19(null);
  const panelRef = useRef19(null);
  const recompute = useCallback15(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const { style, resolvedPlacement: rp } = computePopoverPosition(
      rect,
      placement,
      maxWidth
    );
    setPopoverStyle(style);
    setResolvedPlacement(rp);
  }, [placement, maxWidth]);
  const toggle = useCallback15(() => {
    if (!open) recompute();
    setOpen((v) => !v);
  }, [open, recompute]);
  const close = useCallback15(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);
  useEffect17(() => {
    if (!open) return;
    const handler = (e) => {
      if (!buttonRef.current?.contains(e.target) && !panelRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
  useEffect17(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, close]);
  useEffect17(() => {
    if (!open) return;
    window.addEventListener("scroll", recompute, true);
    window.addEventListener("resize", recompute);
    return () => {
      window.removeEventListener("scroll", recompute, true);
      window.removeEventListener("resize", recompute);
    };
  }, [open, recompute]);
  const tone = toneMap[color] ?? fallbackTone;
  const isMarkdown = typeof content === "string";
  return /* @__PURE__ */ jsxs95("span", { className: classNames47("inline-flex items-center", className), children: [
    /* @__PURE__ */ jsx200(
      IconButton_default,
      {
        ref: buttonRef,
        icon,
        size,
        variant: "ghost",
        color,
        onClick: toggle,
        "aria-label": "Show help",
        "aria-expanded": open,
        "aria-haspopup": "dialog"
      }
    ),
    createPortal8(
      /* @__PURE__ */ jsxs95(
        "div",
        {
          ref: panelRef,
          role: "dialog",
          "aria-modal": "false",
          "aria-label": typeof title === "string" ? title : "Help",
          style: { ...popoverStyle, position: "fixed" },
          className: classNames47(
            "z-[2000] rounded-2xl border shadow-xl dark:shadow-neutral-950/60",
            "bg-white dark:bg-neutral-900",
            "border-neutral-200/70 dark:border-neutral-700/60",
            // Animation — opacity + scale, origin tracks resolved placement
            "transition-[opacity,transform] duration-200 ease-out",
            originClass[resolvedPlacement],
            open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          ),
          children: [
            /* @__PURE__ */ jsxs95(
              "div",
              {
                className: classNames47(
                  "flex items-center justify-between gap-2 px-3 py-2 rounded-t-2xl border-t-[3px]",
                  tone.strip
                ),
                children: [
                  /* @__PURE__ */ jsxs95(
                    "div",
                    {
                      className: classNames47(
                        "flex items-center gap-2 min-w-0",
                        tone.accent
                      ),
                      children: [
                        /* @__PURE__ */ jsx200(
                          "span",
                          {
                            className: classNames47(
                              "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full",
                              tone.iconBg
                            ),
                            children: /* @__PURE__ */ jsx200(CustomIcon_default, { icon: "Info", className: "h-3 w-3" })
                          }
                        ),
                        /* @__PURE__ */ jsx200("span", { className: "text-xs font-semibold truncate", children: title ?? "Help" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx200(
                    IconButton_default,
                    {
                      icon: "Close",
                      size: "xs",
                      variant: "ghost",
                      color: "slate",
                      onClick: close,
                      "aria-label": "Close help"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx200("div", { className: "px-4 py-3 overflow-y-auto max-h-[55vh] scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700", children: isMarkdown ? /* @__PURE__ */ jsx200(
              ReactMarkdown,
              {
                remarkPlugins: [remarkGfm],
                components: mdComponents,
                children: content
              }
            ) : /* @__PURE__ */ jsx200("div", { className: "text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed", children: content }) })
          ]
        }
      ),
      document.body
    )
  ] });
};
HelpButton.displayName = "HelpButton";
var HelpButton_default = HelpButton;

// src/components/SplitView.tsx
import { Fragment as Fragment14, jsx as jsx201, jsxs as jsxs96 } from "react/jsx-runtime";
var sizeTokens8 = {
  sm: {
    item: "px-4 py-2.5",
    label: "text-sm",
    subtitle: "text-xs",
    badge: "text-[10px] px-1.5 py-0"
  },
  md: {
    item: "px-4 py-3",
    label: "text-sm",
    subtitle: "text-xs",
    badge: "text-[11px] px-2 py-0.5"
  },
  lg: {
    item: "px-5 py-4",
    label: "text-base",
    subtitle: "text-sm",
    badge: "text-xs px-2.5 py-0.5"
  }
};
var iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6"
};
var neutralActive = {
  bg: "bg-neutral-100 dark:bg-neutral-800/40",
  border: "border-l-neutral-500",
  text: "text-neutral-900 dark:text-neutral-100",
  subtitle: "text-neutral-600 dark:text-neutral-400",
  resizer: "bg-neutral-400/40"
};
var activeColors = {
  red: {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-l-red-600",
    text: "text-red-900 dark:text-red-100",
    subtitle: "text-red-600 dark:text-red-400",
    resizer: "bg-red-400"
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/30",
    border: "border-l-orange-600",
    text: "text-orange-900 dark:text-orange-100",
    subtitle: "text-orange-600 dark:text-orange-400",
    resizer: "bg-orange-400"
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-l-amber-600",
    text: "text-amber-900 dark:text-amber-100",
    subtitle: "text-amber-600 dark:text-amber-400",
    resizer: "bg-amber-400"
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-900/30",
    border: "border-l-yellow-600",
    text: "text-yellow-900 dark:text-yellow-100",
    subtitle: "text-yellow-600 dark:text-yellow-400",
    resizer: "bg-yellow-400"
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-900/30",
    border: "border-l-lime-600",
    text: "text-lime-900 dark:text-lime-100",
    subtitle: "text-lime-600 dark:text-lime-400",
    resizer: "bg-lime-400"
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/30",
    border: "border-l-green-600",
    text: "text-green-900 dark:text-green-100",
    subtitle: "text-green-600 dark:text-green-400",
    resizer: "bg-green-400"
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-l-emerald-600",
    text: "text-emerald-900 dark:text-emerald-100",
    subtitle: "text-emerald-600 dark:text-emerald-400",
    resizer: "bg-emerald-400"
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-900/30",
    border: "border-l-teal-600",
    text: "text-teal-900 dark:text-teal-100",
    subtitle: "text-teal-600 dark:text-teal-400",
    resizer: "bg-teal-400"
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/30",
    border: "border-l-cyan-600",
    text: "text-cyan-900 dark:text-cyan-100",
    subtitle: "text-cyan-600 dark:text-cyan-400",
    resizer: "bg-cyan-400"
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    border: "border-l-sky-600",
    text: "text-sky-900 dark:text-sky-100",
    subtitle: "text-sky-600 dark:text-sky-400",
    resizer: "bg-sky-400"
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-l-blue-600",
    text: "text-blue-900 dark:text-blue-100",
    subtitle: "text-blue-600 dark:text-blue-400",
    resizer: "bg-blue-400"
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/30",
    border: "border-l-indigo-600",
    text: "text-indigo-900 dark:text-indigo-100",
    subtitle: "text-indigo-600 dark:text-indigo-400",
    resizer: "bg-indigo-400"
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-900/30",
    border: "border-l-violet-600",
    text: "text-violet-900 dark:text-violet-100",
    subtitle: "text-violet-600 dark:text-violet-400",
    resizer: "bg-violet-400"
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/30",
    border: "border-l-purple-600",
    text: "text-purple-900 dark:text-purple-100",
    subtitle: "text-purple-600 dark:text-purple-400",
    resizer: "bg-purple-400"
  },
  fuchsia: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-900/30",
    border: "border-l-fuchsia-600",
    text: "text-fuchsia-900 dark:text-fuchsia-100",
    subtitle: "text-fuchsia-600 dark:text-fuchsia-400",
    resizer: "bg-fuchsia-400"
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-900/30",
    border: "border-l-pink-600",
    text: "text-pink-900 dark:text-pink-100",
    subtitle: "text-pink-600 dark:text-pink-400",
    resizer: "bg-pink-400"
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-l-rose-600",
    text: "text-rose-900 dark:text-rose-100",
    subtitle: "text-rose-600 dark:text-rose-400",
    resizer: "bg-rose-400"
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-900/30",
    border: "border-l-slate-600",
    text: "text-slate-900 dark:text-slate-100",
    subtitle: "text-slate-600 dark:text-slate-400",
    resizer: "bg-slate-400"
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-900/30",
    border: "border-l-gray-600",
    text: "text-gray-900 dark:text-gray-100",
    subtitle: "text-gray-600 dark:text-gray-400",
    resizer: "bg-gray-400"
  },
  zinc: {
    bg: "bg-zinc-50 dark:bg-zinc-900/30",
    border: "border-l-zinc-600",
    text: "text-zinc-900 dark:text-zinc-100",
    subtitle: "text-zinc-600 dark:text-zinc-400",
    resizer: "bg-zinc-400"
  },
  neutral: neutralActive,
  stone: neutralActive,
  white: neutralActive,
  // Semantic aliases
  brand: {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    border: "border-l-blue-600",
    text: "text-blue-900 dark:text-blue-100",
    subtitle: "text-blue-600 dark:text-blue-400",
    resizer: "bg-blue-400"
  },
  info: {
    bg: "bg-sky-50 dark:bg-sky-900/30",
    border: "border-l-sky-600",
    text: "text-sky-900 dark:text-sky-100",
    subtitle: "text-sky-600 dark:text-sky-400",
    resizer: "bg-sky-400"
  },
  success: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    border: "border-l-emerald-600",
    text: "text-emerald-900 dark:text-emerald-100",
    subtitle: "text-emerald-600 dark:text-emerald-400",
    resizer: "bg-emerald-400"
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-900/30",
    border: "border-l-amber-600",
    text: "text-amber-900 dark:text-amber-100",
    subtitle: "text-amber-600 dark:text-amber-400",
    resizer: "bg-amber-400"
  },
  danger: {
    bg: "bg-rose-50 dark:bg-rose-900/30",
    border: "border-l-rose-600",
    text: "text-rose-900 dark:text-rose-100",
    subtitle: "text-rose-600 dark:text-rose-400",
    resizer: "bg-rose-400"
  },
  theme: neutralActive,
  parallels: {
    bg: "bg-red-50 dark:bg-red-900/30",
    border: "border-l-red-600",
    text: "text-red-900 dark:text-red-100",
    subtitle: "text-red-600 dark:text-red-400",
    resizer: "bg-red-400"
  }
};
var neutralHighlight = {
  bg: "bg-neutral-100 dark:bg-neutral-700/50",
  dot: "bg-neutral-500"
};
var highlightColors = {
  red: { bg: "bg-red-100 dark:bg-red-900/50", dot: "bg-red-500" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/50", dot: "bg-orange-500" },
  amber: { bg: "bg-amber-100 dark:bg-amber-900/50", dot: "bg-amber-500" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/50", dot: "bg-yellow-500" },
  lime: { bg: "bg-lime-100 dark:bg-lime-900/50", dot: "bg-lime-500" },
  green: { bg: "bg-green-100 dark:bg-green-900/50", dot: "bg-green-500" },
  emerald: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    dot: "bg-emerald-500"
  },
  teal: { bg: "bg-teal-100 dark:bg-teal-900/50", dot: "bg-teal-500" },
  cyan: { bg: "bg-cyan-100 dark:bg-cyan-900/50", dot: "bg-cyan-500" },
  sky: { bg: "bg-sky-100 dark:bg-sky-900/50", dot: "bg-sky-500" },
  blue: { bg: "bg-blue-100 dark:bg-blue-900/50", dot: "bg-blue-500" },
  indigo: { bg: "bg-indigo-100 dark:bg-indigo-900/50", dot: "bg-indigo-500" },
  violet: { bg: "bg-violet-100 dark:bg-violet-900/50", dot: "bg-violet-500" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/50", dot: "bg-purple-500" },
  fuchsia: {
    bg: "bg-fuchsia-100 dark:bg-fuchsia-900/50",
    dot: "bg-fuchsia-500"
  },
  pink: { bg: "bg-pink-100 dark:bg-pink-900/50", dot: "bg-pink-500" },
  rose: { bg: "bg-rose-100 dark:bg-rose-900/50", dot: "bg-rose-500" },
  slate: { bg: "bg-slate-100 dark:bg-slate-800/50", dot: "bg-slate-500" },
  gray: { bg: "bg-gray-100 dark:bg-gray-800/50", dot: "bg-gray-500" },
  zinc: { bg: "bg-zinc-100 dark:bg-zinc-800/50", dot: "bg-zinc-500" },
  neutral: neutralHighlight,
  stone: neutralHighlight,
  white: neutralHighlight,
  brand: { bg: "bg-blue-100 dark:bg-blue-900/50", dot: "bg-blue-500" },
  info: { bg: "bg-sky-100 dark:bg-sky-900/50", dot: "bg-sky-500" },
  success: {
    bg: "bg-emerald-100 dark:bg-emerald-900/50",
    dot: "bg-emerald-500"
  },
  warning: { bg: "bg-amber-100 dark:bg-amber-900/50", dot: "bg-amber-500" },
  danger: { bg: "bg-rose-100 dark:bg-rose-900/50", dot: "bg-rose-500" },
  theme: neutralHighlight,
  parallels: { bg: "bg-red-100 dark:bg-red-900/50", dot: "bg-red-500" }
};
var SplitView = ({
  items,
  value,
  defaultValue,
  onChange,
  listTitle,
  searchPlaceholder = "Search...",
  listWidth,
  color = "blue",
  size = "md",
  autoHideList = true,
  collapsible = false,
  collapsed: controlledCollapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  resizable = false,
  minListWidth = 180,
  maxListWidth: maxListWidthProp,
  className,
  listClassName,
  panelClassName,
  panelHeader,
  panelHeaderProps,
  emptyState,
  listActions,
  panelEmptyState,
  loading = false,
  loadingState,
  error,
  errorState,
  onRetry,
  borderLeft = false,
  autoExpand = true,
  expandedValue,
  onExpand,
  panelScrollable = true
}) => {
  const visibleItems = useMemo17(() => items.filter((i) => !i.hidden), [items]);
  const isSingleVisibleItem = visibleItems.length === 1;
  const isNoVisibleItems = visibleItems.length === 0;
  const shouldHideList = isSingleVisibleItem || autoHideList && visibleItems.length === 1 || isNoVisibleItems;
  const [internalValue, setInternalValue] = useState31(
    defaultValue ?? visibleItems[0]?.id
  );
  const activeId = value ?? internalValue;
  const [internalExpandedId, setInternalExpandedId] = useState31(autoExpand ? defaultValue ?? visibleItems[0]?.id : void 0);
  const expandedId = autoExpand ? activeId : expandedValue ?? internalExpandedId;
  const [filter, setFilter] = useState31("");
  const [internalCollapsed, setInternalCollapsed] = useState31(defaultCollapsed);
  const isCollapsedControlled = typeof controlledCollapsed === "boolean";
  const isCollapsed = collapsible && !shouldHideList && (isCollapsedControlled ? controlledCollapsed : internalCollapsed);
  const toggleCollapsed = useCallback16(() => {
    const next = !isCollapsed;
    if (!isCollapsedControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  }, [isCollapsed, isCollapsedControlled, onCollapsedChange]);
  const containerRef = useRef20(null);
  const getMaxWidth = useCallback16(() => {
    if (maxListWidthProp) return maxListWidthProp;
    if (containerRef.current)
      return Math.floor(containerRef.current.offsetWidth * 0.5);
    return 600;
  }, [maxListWidthProp]);
  const initialPxWidth = listWidth ? parseInt(listWidth, 10) : 288;
  const validInitialWidth = isNaN(initialPxWidth) ? 288 : initialPxWidth;
  const {
    width: resizableWidth,
    isDragging,
    handleProps
  } = useResizable({
    initialWidth: validInitialWidth,
    minWidth: minListWidth,
    maxWidth: getMaxWidth,
    enabled: resizable && !isCollapsed && !shouldHideList
  });
  useEffect18(() => {
    if (value !== void 0) return;
    if (!visibleItems.some((i) => i.id === internalValue)) {
      setInternalValue(visibleItems[0]?.id);
    }
  }, [visibleItems, value, internalValue]);
  useEffect18(() => {
    if (shouldHideList && visibleItems[0] && activeId !== visibleItems[0].id) {
      if (value === void 0) {
        setInternalValue(visibleItems[0].id);
      }
    }
  }, [shouldHideList, visibleItems, activeId, value]);
  const filteredItems = useMemo17(() => {
    if (!filter) return visibleItems;
    const lower = filter.toLowerCase();
    return visibleItems.filter((item) => {
      const labelText = typeof item.label === "string" ? item.label : "";
      const subtitleText = typeof item.subtitle === "string" ? item.subtitle : "";
      return labelText.toLowerCase().includes(lower) || subtitleText.toLowerCase().includes(lower);
    });
  }, [visibleItems, filter]);
  const activeItem = visibleItems.find((i) => i.id === activeId);
  const tokens = sizeTokens8[size];
  const accent = activeColors[color];
  const highlightAccent = highlightColors[color];
  const resizerColor = accent.resizer;
  const handleSelect = (item) => {
    if (item.disabled) return;
    if (value === void 0) {
      setInternalValue(item.id);
    }
    onChange?.(item.id, item);
  };
  const handleExpand = (item) => {
    if (item.disabled) return;
    const isAlreadyExpanded = expandedId === item.id;
    if (isAlreadyExpanded) {
      if (expandedValue === void 0) setInternalExpandedId(void 0);
      onExpand?.(item.id, item);
      return;
    }
    if (value === void 0) setInternalValue(item.id);
    onChange?.(item.id, item);
    if (expandedValue === void 0) setInternalExpandedId(item.id);
    onExpand?.(item.id, item);
  };
  const listWidthClass = listWidth ?? "w-72";
  const renderBadge = (badge, idx) => {
    const pillTokens = getPillColorClasses(
      badge.tone ?? "info",
      badge.variant ?? "soft"
    );
    return /* @__PURE__ */ jsx201(
      "span",
      {
        className: classNames48(
          "inline-flex items-center rounded-full font-medium leading-none",
          tokens.badge,
          pillTokens.base,
          pillTokens.border
        ),
        children: badge.label
      },
      idx
    );
  };
  const resolveHeaderSlot = (slot, item) => {
    if (typeof slot === "function") {
      return slot(item);
    }
    return slot;
  };
  const renderBuiltInHeader = (item, options) => {
    if (panelHeaderProps === void 0) return null;
    const headerProps = typeof panelHeaderProps === "function" ? panelHeaderProps(item) : panelHeaderProps;
    if (!headerProps) return null;
    const icon = resolveHeaderSlot(headerProps.icon, item);
    const title = resolveHeaderSlot(headerProps.title, item) ?? item.label;
    const subtitle = resolveHeaderSlot(headerProps.subtitle, item);
    const body = resolveHeaderSlot(headerProps.body, item);
    const search = resolveHeaderSlot(headerProps.search, item);
    const helper = resolveHeaderSlot(headerProps.helper, item);
    const bottomActions = resolveHeaderSlot(headerProps.bottomActions, item);
    const headerDetails = resolveHeaderSlot(headerProps.headerDetails, item);
    const customActions = resolveHeaderSlot(headerProps.actions, item);
    const promotedActions = options?.promoteItemActions ? item.actions : void 0;
    const promotedListActions = options?.promoteItemActions ? listActions : void 0;
    const mergedActions = customActions || promotedActions || promotedListActions ? /* @__PURE__ */ jsxs96(Fragment14, { children: [
      customActions,
      promotedActions,
      promotedListActions
    ] }) : void 0;
    const border = headerProps.border ?? true;
    const detailsVariant = headerDetails?.variant ?? headerDetails?.variants ?? "subtle";
    const detailsDecoration = headerDetails?.decoration ?? headerDetails?.decorations ?? "none";
    const detailsTone = headerDetails?.tone ?? "neutral";
    const hasCustomHeaderBody = headerDetails?.headerBody !== void 0 && headerDetails?.headerBody !== null;
    const hasHeaderDetailsContent = Boolean(
      hasCustomHeaderBody || headerDetails?.title || headerDetails?.subtitle || headerDetails?.description || headerDetails?.tags
    );
    const isDetailsBordered = headerDetails?.bordered ?? true;
    return /* @__PURE__ */ jsxs96("div", { className: classNames48("flex-none", border, headerProps.className), children: [
      /* @__PURE__ */ jsxs96("div", { className: "flex items-center gap-3 px-4 py-3", children: [
        icon && /* @__PURE__ */ jsx201("div", { className: "shrink-0", children: icon }),
        /* @__PURE__ */ jsxs96("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs96("h2", { className: "flex items-center gap-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100 truncate", children: [
            /* @__PURE__ */ jsx201("span", { children: title }),
            helper && /* @__PURE__ */ jsx201(HelpButton_default, { ...helper })
          ] }),
          subtitle && /* @__PURE__ */ jsx201("p", { className: "mt-0.5 text-xs text-neutral-500 dark:text-neutral-400 truncate", children: subtitle })
        ] }),
        body && /* @__PURE__ */ jsx201("div", { className: "shrink-0", children: body }),
        search && /* @__PURE__ */ jsx201("div", { className: classNames48("shrink-0", headerProps.searchWidth), children: search }),
        mergedActions && /* @__PURE__ */ jsx201("div", { className: "flex items-center gap-1 shrink-0", children: mergedActions })
      ] }),
      bottomActions && /* @__PURE__ */ jsx201("div", { className: "flex items-center justify-end gap-2 px-4 pb-3", children: bottomActions }),
      headerDetails && hasHeaderDetailsContent && /* @__PURE__ */ jsx201(
        "div",
        {
          className: classNames48(
            isDetailsBordered && "border-t border-b border-neutral-200 dark:border-neutral-700"
          ),
          children: /* @__PURE__ */ jsx201(
            Panel_default,
            {
              variant: detailsVariant,
              tone: detailsTone,
              decoration: detailsDecoration,
              corner: "none",
              padding: "none",
              className: classNames48(
                "w-full shadow-none px-3 py-4",
                headerDetails.className
              ),
              children: hasCustomHeaderBody ? headerDetails.headerBody : /* @__PURE__ */ jsxs96("div", { className: "flex items-start justify-between gap-4", children: [
                /* @__PURE__ */ jsxs96("div", { className: "min-w-0", children: [
                  headerDetails.title && /* @__PURE__ */ jsx201("div", { className: "text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400", children: headerDetails.title }),
                  headerDetails.subtitle && /* @__PURE__ */ jsx201("div", { className: "mt-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100", children: headerDetails.subtitle }),
                  headerDetails.description && /* @__PURE__ */ jsx201("div", { className: "mt-1 text-[12px] text-neutral-600 dark:text-neutral-400", children: headerDetails.description })
                ] }),
                headerDetails.tags && /* @__PURE__ */ jsx201("div", { className: "flex items-center justify-end gap-2 flex-wrap", children: headerDetails.tags })
              ] })
            }
          )
        }
      )
    ] });
  };
  const renderPanelHeader = (item, options) => {
    if (panelHeaderProps !== void 0) {
      return renderBuiltInHeader(item, options);
    }
    if (!panelHeader) return null;
    return typeof panelHeader === "function" ? panelHeader(item) : panelHeader;
  };
  const singleItem = shouldHideList ? visibleItems[0] : void 0;
  const singleHeader = singleItem ? renderPanelHeader(singleItem, { promoteItemActions: true }) : null;
  const activeHeader = activeItem ? renderPanelHeader(activeItem, { promoteItemActions: false }) : null;
  const listPanelStyle = isCollapsed ? { width: 48 } : resizable ? { width: resizableWidth } : void 0;
  const listPanelWidthClass = isCollapsed || resizable ? void 0 : listWidthClass;
  const renderOverlay = () => {
    if (loading) {
      return /* @__PURE__ */ jsx201("div", { className: "absolute inset-0 z-50 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md dark:bg-neutral-900/50", children: loadingState ?? /* @__PURE__ */ jsx201(
        Loader_default,
        {
          size: "lg",
          label: "Please wait...",
          color,
          variant: "spinner",
          title: "Loading...",
          spinnerThickness: "thick",
          spinnerVariant: "segments"
        }
      ) });
    }
    if (error) {
      return /* @__PURE__ */ jsx201("div", { className: "absolute inset-0 z-40 flex items-center justify-center rounded-[inherit] bg-white/60 backdrop-blur-md p-6 dark:bg-neutral-900/50", children: errorState ?? /* @__PURE__ */ jsx201(
        EmptyState_default,
        {
          icon: "Error",
          title: "Something went wrong",
          subtitle: typeof error === "string" ? error : "An unexpected error occurred.",
          showIcon: true,
          actionLabel: onRetry ? "Retry" : void 0,
          onAction: onRetry,
          actionVariant: "solid",
          actionColor: color,
          disableBorder: true,
          transparentBackground: true,
          iconColor: "danger",
          size: "lg"
        }
      ) });
    }
    return null;
  };
  if (shouldHideList) {
    return /* @__PURE__ */ jsxs96(
      "div",
      {
        className: classNames48(
          "relative flex h-full min-h-0 overflow-hidden",
          borderLeft && "border-l border-gray-200 dark:border-gray-700",
          className
        ),
        children: [
          renderOverlay(),
          /* @__PURE__ */ jsx201(
            "div",
            {
              className: classNames48(
                "flex flex-1 flex-col min-w-0 h-full overflow-hidden",
                panelClassName
              ),
              children: singleItem ? /* @__PURE__ */ jsxs96(Fragment14, { children: [
                singleHeader ? /* @__PURE__ */ jsx201("div", { className: "shrink-0", children: singleHeader }) : listActions ? /* @__PURE__ */ jsx201("div", { className: "shrink-0 flex items-center justify-end gap-1 px-4 py-2 border-b border-neutral-200 dark:border-neutral-700", children: listActions }) : null,
                /* @__PURE__ */ jsx201(
                  "div",
                  {
                    className: classNames48(
                      "flex-1",
                      panelScrollable ? "overflow-y-auto" : "overflow-hidden"
                    ),
                    children: singleItem.panel
                  }
                )
              ] }) : panelEmptyState !== null && /* @__PURE__ */ jsx201("div", { className: "flex flex-1 items-center justify-center p-6", children: panelEmptyState ?? /* @__PURE__ */ jsx201(
                EmptyState_default,
                {
                  icon: "Info",
                  title: "No items",
                  subtitle: "There are no items to display.",
                  showIcon: true,
                  disableBorder: true,
                  color
                }
              ) })
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs96(
    "div",
    {
      ref: containerRef,
      className: classNames48(
        "relative flex h-full min-h-0 overflow-hidden",
        borderLeft && "border-l border-gray-200 dark:border-gray-700",
        className
      ),
      children: [
        renderOverlay(),
        /* @__PURE__ */ jsx201(
          "div",
          {
            style: listPanelStyle,
            className: classNames48(
              "flex flex-col shrink-0 border-r border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-900/80 h-full overflow-hidden",
              isCollapsed && "transition-[width] duration-300 ease-in-out",
              listPanelWidthClass,
              listClassName
            ),
            children: isCollapsed ? (
              /* ---- Collapsed: just an expand button ---- */
              /* @__PURE__ */ jsx201("div", { className: "flex items-center justify-center pt-3", children: /* @__PURE__ */ jsx201(
                IconButton_default,
                {
                  tooltip: "Expand View",
                  icon: "ArrowChevronRight",
                  variant: "ghost",
                  color,
                  size: "xs",
                  onClick: toggleCollapsed,
                  "aria-label": "Expand list"
                }
              ) })
            ) : /* @__PURE__ */ jsxs96(Fragment14, { children: [
              (listTitle || listActions || collapsible) && /* @__PURE__ */ jsxs96("div", { className: "shrink-0 px-4 pt-4 pb-2 flex items-center justify-between gap-2", children: [
                listTitle && /* @__PURE__ */ jsx201("h3", { className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: listTitle }),
                /* @__PURE__ */ jsxs96("div", { className: "flex items-center gap-1 ml-auto", children: [
                  listActions,
                  collapsible && /* @__PURE__ */ jsx201(
                    IconButton_default,
                    {
                      tooltip: "Collapse View",
                      icon: "ArrowChevronLeft",
                      variant: "ghost",
                      color,
                      size: "xs",
                      onClick: toggleCollapsed,
                      "aria-label": "Collapse list"
                    }
                  )
                ] })
              ] }),
              visibleItems.length > 1 && /* @__PURE__ */ jsx201("div", { className: "shrink-0 px-3 pb-2 pt-1", children: /* @__PURE__ */ jsx201(
                SearchBar_default,
                {
                  placeholder: searchPlaceholder,
                  variant: "gradient",
                  glowIntensity: "subtle",
                  color,
                  onSearch: setFilter
                }
              ) }),
              /* @__PURE__ */ jsx201("div", { className: "flex-1 overflow-y-auto", children: filteredItems.length === 0 ? /* @__PURE__ */ jsx201("div", { className: "px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500", children: emptyState ?? "No items found" }) : filteredItems.map((item) => {
                const isActive = item.id === activeId;
                const isExpanded = item.id === expandedId;
                const hasExpandControl = !autoExpand && item.subContent !== void 0;
                return /* @__PURE__ */ jsxs96("div", { children: [
                  /* @__PURE__ */ jsx201(
                    "div",
                    {
                      role: "button",
                      tabIndex: item.disabled ? -1 : 0,
                      "aria-disabled": item.disabled,
                      onClick: () => {
                        if (!item.disabled) handleSelect(item);
                      },
                      onKeyDown: (e) => {
                        if (!item.disabled && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          handleSelect(item);
                        }
                      },
                      className: classNames48(
                        "group/item w-full text-left border-l-3 transition-all duration-150 outline-none cursor-default",
                        item.disabled && "opacity-50 cursor-not-allowed pointer-events-none",
                        tokens.item,
                        isActive ? classNames48(
                          accent.bg,
                          accent.border,
                          "border-l-[3px]"
                        ) : item.highlight ? classNames48(
                          highlightAccent.bg,
                          accent.border,
                          "border-l-[3px]"
                        ) : "border-l-[3px] border-l-transparent hover:bg-gray-100/80 dark:hover:bg-gray-800/60"
                      ),
                      children: /* @__PURE__ */ jsxs96("div", { className: "flex items-start gap-2 min-w-0", children: [
                        /* @__PURE__ */ jsx201("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs96("div", { className: "flex min-w-0 items-start gap-2", children: [
                          item.icon && /* @__PURE__ */ jsx201("div", { className: "flex items-start", children: /* @__PURE__ */ jsx201(
                            CustomIcon_default,
                            {
                              icon: item.icon,
                              className: classNames48(
                                "shrink-0",
                                iconSizeClasses[size]
                              )
                            }
                          ) }),
                          /* @__PURE__ */ jsxs96("div", { className: "min-w-0 flex-1", children: [
                            /* @__PURE__ */ jsx201(
                              "div",
                              {
                                className: classNames48(
                                  "font-semibold leading-tight truncate",
                                  tokens.label,
                                  isActive || item.highlight ? accent.text : "text-gray-900 dark:text-gray-100"
                                ),
                                children: item.label
                              }
                            ),
                            item.subtitle && /* @__PURE__ */ jsx201(
                              "div",
                              {
                                className: classNames48(
                                  "mt-0.5 leading-tight truncate",
                                  tokens.subtitle,
                                  isActive ? accent.subtitle : "text-gray-500 dark:text-gray-400"
                                ),
                                children: item.subtitle
                              }
                            ),
                            item.badges && item.badges.length > 0 && /* @__PURE__ */ jsx201("div", { className: "mt-1.5 flex flex-wrap gap-1.5", children: item.badges.map(
                              (badge, idx) => renderBadge(badge, idx)
                            ) })
                          ] })
                        ] }) }),
                        (item.actions || hasExpandControl || item.highlight) && /* @__PURE__ */ jsxs96("div", { className: "shrink-0 flex items-center gap-0.5", children: [
                          item.actions && /* @__PURE__ */ jsx201(
                            "div",
                            {
                              className: "flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-150",
                              onClick: (e) => e.stopPropagation(),
                              onMouseDown: (e) => e.stopPropagation(),
                              children: item.actions
                            }
                          ),
                          item.highlight && /* @__PURE__ */ jsx201(
                            "span",
                            {
                              className: classNames48(
                                "h-2 w-2 shrink-0 rounded-full",
                                highlightAccent.dot,
                                !isActive && "animate-pulse"
                              )
                            }
                          ),
                          hasExpandControl && /* @__PURE__ */ jsx201(
                            "div",
                            {
                              className: "flex items-center",
                              onClick: (e) => e.stopPropagation(),
                              onMouseDown: (e) => e.stopPropagation(),
                              children: /* @__PURE__ */ jsx201(
                                "button",
                                {
                                  type: "button",
                                  disabled: item.disabled,
                                  onClick: () => handleExpand(item),
                                  title: isExpanded ? "Collapse details" : "Expand details",
                                  "aria-label": isExpanded ? "Collapse details" : "Expand details",
                                  "aria-expanded": isExpanded,
                                  className: classNames48(
                                    "rounded p-1 transition-colors duration-150",
                                    isExpanded ? classNames48(accent.text, "opacity-100") : "text-gray-400 opacity-0 group-hover/item:opacity-100 hover:text-gray-700 dark:hover:text-gray-200"
                                  ),
                                  children: /* @__PURE__ */ jsx201(
                                    "svg",
                                    {
                                      className: classNames48(
                                        "h-4 w-4 transition-transform duration-200 ease-in-out",
                                        isExpanded ? "rotate-90" : "rotate-0"
                                      ),
                                      viewBox: "0 0 24 24",
                                      fill: "none",
                                      stroke: "currentColor",
                                      strokeWidth: 2,
                                      children: /* @__PURE__ */ jsx201(
                                        "path",
                                        {
                                          strokeLinecap: "round",
                                          strokeLinejoin: "round",
                                          d: "M9 5l7 7-7 7"
                                        }
                                      )
                                    }
                                  )
                                }
                              )
                            }
                          )
                        ] })
                      ] })
                    }
                  ),
                  item.subContent !== void 0 && /* @__PURE__ */ jsx201(
                    "div",
                    {
                      className: classNames48(
                        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
                        // When autoExpand=false, subContent is gated by the expand button (isExpanded),
                        // not by row selection (isActive) — fixes both the auto-expand and sticky-collapse bugs.
                        (autoExpand ? isActive : isExpanded) ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      ),
                      children: /* @__PURE__ */ jsx201("div", { className: "overflow-hidden", children: /* @__PURE__ */ jsx201(
                        "div",
                        {
                          className: classNames48(
                            "border-l-[3px]",
                            (autoExpand ? isActive : isExpanded) ? accent.border : "border-l-transparent"
                          ),
                          children: item.subContent
                        }
                      ) })
                    }
                  )
                ] }, item.id);
              }) })
            ] })
          }
        ),
        resizable && !isCollapsed && /* @__PURE__ */ jsx201(
          "div",
          {
            ...handleProps,
            className: classNames48(
              "w-1.5 shrink-0 cursor-col-resize transition-all duration-150",
              resizerColor,
              isDragging ? "opacity-100" : "opacity-0 hover:opacity-30 active:opacity-100"
            )
          }
        ),
        /* @__PURE__ */ jsx201(
          "div",
          {
            className: classNames48(
              "flex flex-1 flex-col min-w-0 h-full bg-white overflow-hidden",
              panelClassName
            ),
            children: activeItem ? /* @__PURE__ */ jsxs96(Fragment14, { children: [
              activeHeader && /* @__PURE__ */ jsx201("div", { className: "shrink-0", children: activeHeader }),
              /* @__PURE__ */ jsx201(
                "div",
                {
                  className: classNames48(
                    "flex-1",
                    panelScrollable ? "overflow-y-auto" : "overflow-hidden"
                  ),
                  children: activeItem.panel
                }
              )
            ] }) : panelEmptyState !== null && /* @__PURE__ */ jsx201("div", { className: "flex flex-1 items-center justify-center p-6", children: panelEmptyState ?? /* @__PURE__ */ jsx201(
              EmptyState_default,
              {
                icon: "Info",
                title: "No item selected",
                subtitle: "Select an item from the list to view its details.",
                showIcon: true,
                disableBorder: true,
                color
              }
            ) })
          }
        )
      ]
    }
  );
};
SplitView.displayName = "SplitView";

// src/components/SmartInput.tsx
import React45, { useState as useState32, useRef as useRef21, useEffect as useEffect19 } from "react";

// src/utils/smartVariables.ts
var SMART_VAR_REGEX = /\{\{\s*(var|env)::(global|system|service)::([a-zA-Z0-9_\-.]+)\s*\}\}/g;
var createSmartToken = (type, source, name) => {
  return `{{ ${type}::${source}::${name} }}`;
};

// src/components/SmartInput.tsx
import { createPortal as createPortal9 } from "react-dom";
import { jsx as jsx202, jsxs as jsxs97 } from "react/jsx-runtime";

// src/components/SmartValue.tsx
import { useState as useState33 } from "react";
import { jsx as jsx203, jsxs as jsxs98 } from "react/jsx-runtime";

// src/components/StartupStageStepper.tsx
import React47, { useEffect as useEffect20, useMemo as useMemo18, useState as useState34 } from "react";
import classNames49 from "classnames";
import { jsx as jsx204, jsxs as jsxs99 } from "react/jsx-runtime";

// src/components/StatChartTile.tsx
import { useState as useState35, useMemo as useMemo19 } from "react";
import classNames51 from "classnames";

// src/components/StatTile.tsx
import classNames50 from "classnames";
import { Fragment as Fragment15, jsx as jsx205, jsxs as jsxs100 } from "react/jsx-runtime";

// src/components/StatChartTile.tsx
import { jsx as jsx206, jsxs as jsxs101 } from "react/jsx-runtime";

// src/components/StatCountTile.tsx
import classNames52 from "classnames";
import { Fragment as Fragment16, jsx as jsx207, jsxs as jsxs102 } from "react/jsx-runtime";

// src/components/StatGoalTile.tsx
import React49, { useMemo as useMemo20 } from "react";
import classNames53 from "classnames";
import { jsx as jsx208, jsxs as jsxs103 } from "react/jsx-runtime";

// src/components/StatGraphTile.tsx
import {
  useRef as useRef22,
  useState as useState36,
  useCallback as useCallback17,
  useMemo as useMemo21,
  useEffect as useEffect21
} from "react";
import { createPortal as createPortal10 } from "react-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip as RechartsTooltip
} from "recharts";
import { Fragment as Fragment17, jsx as jsx209, jsxs as jsxs104 } from "react/jsx-runtime";

// src/components/Stepper.tsx
import { useLayoutEffect as useLayoutEffect6, useMemo as useMemo23, useRef as useRef23, useState as useState38 } from "react";
import classNames54 from "classnames";

// src/hooks/useStepper.ts
import { useCallback as useCallback18, useMemo as useMemo22, useState as useState37 } from "react";

// src/components/Stepper.tsx
import { Fragment as Fragment18, jsx as jsx210, jsxs as jsxs105 } from "react/jsx-runtime";

// src/components/Table.tsx
import React52, { useEffect as useEffect22, useMemo as useMemo24, useRef as useRef24, useState as useState39 } from "react";
import classNames55 from "classnames";
import { Fragment as Fragment19, jsx as jsx211, jsxs as jsxs106 } from "react/jsx-runtime";

// src/components/AccessMatrix.tsx
import { useMemo as useMemo25, useState as useState40 } from "react";
import classNames56 from "classnames";
import { jsx as jsx212, jsxs as jsxs107 } from "react/jsx-runtime";

// src/components/KeyValueArrayField.tsx
import { useEffect as useEffect23, useState as useState41 } from "react";
import { jsx as jsx213, jsxs as jsxs108 } from "react/jsx-runtime";

// src/components/ApiErrorState.tsx
import { jsx as jsx214 } from "react/jsx-runtime";

// src/components/DynamicFormField.tsx
import { useMemo as useMemo26 } from "react";
import { CapsuleBlueprintValueType } from "@cjlapao/ui-kit";
import { CollapsibleHelpText as CollapsibleHelpText2, Input as Input3, Checkbox as Checkbox2, Select as Select3 } from "@cjlapao/ui-kit";
import classNames57 from "classnames";
import { jsx as jsx215, jsxs as jsxs109 } from "react/jsx-runtime";

// src/components/NotificationModal.tsx
import { jsx as jsx216, jsxs as jsxs110 } from "react/jsx-runtime";

// src/components/SidePanel.tsx
import { useCallback as useCallback19, useEffect as useEffect24, useRef as useRef25, useState as useState42 } from "react";
import classNames58 from "classnames";
import { jsx as jsx217, jsxs as jsxs111 } from "react/jsx-runtime";

// src/components/TimelinePanel/TimelinePanel.tsx
import React57, {
  useCallback as useCallback20,
  useEffect as useEffect25,
  useLayoutEffect as useLayoutEffect7,
  useRef as useRef26,
  useState as useState43
} from "react";
import classNames59 from "classnames";

// src/components/TreeView/toneColors.ts
var NEUTRAL_TOKENS = {
  bg: "bg-neutral-50 dark:bg-neutral-800/50",
  pulseBg: "bg-neutral-100 dark:bg-neutral-700/60",
  border: "border-neutral-200 dark:border-neutral-700",
  headerText: "text-neutral-600 dark:text-neutral-400",
  labelText: "text-neutral-500 dark:text-neutral-400",
  trunk: ["#d4d4d4", "#525252"],
  connFill: ["#fafafa", "#171717"],
  connBorder: ["#e5e5e5", "#404040"],
  connDot: ["#737373", "#a3a3a3"]
};
var BASE_TOKENS = {
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    pulseBg: "bg-red-100 dark:bg-red-800/60",
    border: "border-red-200 dark:border-red-800",
    headerText: "text-red-800 dark:text-red-200",
    labelText: "text-red-600 dark:text-red-400",
    trunk: ["#fca5a5", "#b91c1c"],
    connFill: ["#fef2f2", "#450a0a"],
    connBorder: ["#fecaca", "#991b1b"],
    connDot: ["#dc2626", "#f87171"]
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    pulseBg: "bg-orange-100 dark:bg-orange-800/60",
    border: "border-orange-200 dark:border-orange-800",
    headerText: "text-orange-800 dark:text-orange-200",
    labelText: "text-orange-600 dark:text-orange-400",
    trunk: ["#fdba74", "#c2410c"],
    connFill: ["#fff7ed", "#431407"],
    connBorder: ["#fed7aa", "#9a3412"],
    connDot: ["#ea580c", "#fb923c"]
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    pulseBg: "bg-amber-100 dark:bg-amber-800/60",
    border: "border-amber-200 dark:border-amber-800",
    headerText: "text-amber-800 dark:text-amber-200",
    labelText: "text-amber-600 dark:text-amber-400",
    trunk: ["#fcd34d", "#b45309"],
    connFill: ["#fffbeb", "#451a03"],
    connBorder: ["#fde68a", "#92400e"],
    connDot: ["#d97706", "#fbbf24"]
  },
  yellow: {
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    pulseBg: "bg-yellow-100 dark:bg-yellow-800/60",
    border: "border-yellow-200 dark:border-yellow-800",
    headerText: "text-yellow-800 dark:text-yellow-200",
    labelText: "text-yellow-600 dark:text-yellow-400",
    trunk: ["#fde047", "#a16207"],
    connFill: ["#fefce8", "#422006"],
    connBorder: ["#fef08a", "#854d0e"],
    connDot: ["#ca8a04", "#facc15"]
  },
  lime: {
    bg: "bg-lime-50 dark:bg-lime-950/30",
    pulseBg: "bg-lime-100 dark:bg-lime-800/60",
    border: "border-lime-200 dark:border-lime-800",
    headerText: "text-lime-800 dark:text-lime-200",
    labelText: "text-lime-600 dark:text-lime-400",
    trunk: ["#bef264", "#4d7c0f"],
    connFill: ["#f7fee7", "#1a2e05"],
    connBorder: ["#d9f99d", "#3f6212"],
    connDot: ["#65a30d", "#a3e635"]
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    pulseBg: "bg-green-100 dark:bg-green-800/60",
    border: "border-green-200 dark:border-green-800",
    headerText: "text-green-800 dark:text-green-200",
    labelText: "text-green-600 dark:text-green-400",
    trunk: ["#86efac", "#15803d"],
    connFill: ["#f0fdf4", "#052e16"],
    connBorder: ["#bbf7d0", "#166534"],
    connDot: ["#16a34a", "#4ade80"]
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    pulseBg: "bg-emerald-100 dark:bg-emerald-800/60",
    border: "border-emerald-200 dark:border-emerald-800",
    headerText: "text-emerald-800 dark:text-emerald-200",
    labelText: "text-emerald-600 dark:text-emerald-400",
    trunk: ["#6ee7b7", "#047857"],
    connFill: ["#ecfdf5", "#022c22"],
    connBorder: ["#a7f3d0", "#065f46"],
    connDot: ["#059669", "#34d399"]
  },
  teal: {
    bg: "bg-teal-50 dark:bg-teal-950/30",
    pulseBg: "bg-teal-100 dark:bg-teal-800/60",
    border: "border-teal-200 dark:border-teal-800",
    headerText: "text-teal-800 dark:text-teal-200",
    labelText: "text-teal-600 dark:text-teal-400",
    trunk: ["#5eead4", "#0f766e"],
    connFill: ["#f0fdfa", "#042f2e"],
    connBorder: ["#99f6e4", "#115e59"],
    connDot: ["#0d9488", "#2dd4bf"]
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    pulseBg: "bg-cyan-100 dark:bg-cyan-800/60",
    border: "border-cyan-200 dark:border-cyan-800",
    headerText: "text-cyan-800 dark:text-cyan-200",
    labelText: "text-cyan-600 dark:text-cyan-400",
    trunk: ["#67e8f9", "#0e7490"],
    connFill: ["#ecfeff", "#083344"],
    connBorder: ["#a5f3fc", "#155e75"],
    connDot: ["#0891b2", "#22d3ee"]
  },
  sky: {
    bg: "bg-sky-50 dark:bg-sky-950/30",
    pulseBg: "bg-sky-100 dark:bg-sky-800/60",
    border: "border-sky-200 dark:border-sky-800",
    headerText: "text-sky-800 dark:text-sky-200",
    labelText: "text-sky-600 dark:text-sky-400",
    trunk: ["#7dd3fc", "#0369a1"],
    connFill: ["#f0f9ff", "#082f49"],
    connBorder: ["#bae6fd", "#075985"],
    connDot: ["#0284c7", "#38bdf8"]
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    pulseBg: "bg-blue-100 dark:bg-blue-800/60",
    border: "border-blue-200 dark:border-blue-800",
    headerText: "text-blue-800 dark:text-blue-200",
    labelText: "text-blue-600 dark:text-blue-400",
    trunk: ["#93c5fd", "#1d4ed8"],
    connFill: ["#eff6ff", "#172554"],
    connBorder: ["#bfdbfe", "#1e40af"],
    connDot: ["#2563eb", "#60a5fa"]
  },
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    pulseBg: "bg-indigo-100 dark:bg-indigo-800/60",
    border: "border-indigo-200 dark:border-indigo-800",
    headerText: "text-indigo-800 dark:text-indigo-200",
    labelText: "text-indigo-600 dark:text-indigo-400",
    trunk: ["#a5b4fc", "#4338ca"],
    connFill: ["#eef2ff", "#1e1b4b"],
    connBorder: ["#c7d2fe", "#3730a3"],
    connDot: ["#4f46e5", "#818cf8"]
  },
  violet: {
    bg: "bg-violet-50 dark:bg-violet-950/30",
    pulseBg: "bg-violet-100 dark:bg-violet-800/60",
    border: "border-violet-200 dark:border-violet-800",
    headerText: "text-violet-800 dark:text-violet-200",
    labelText: "text-violet-600 dark:text-violet-400",
    trunk: ["#c4b5fd", "#6d28d9"],
    connFill: ["#f5f3ff", "#2e1065"],
    connBorder: ["#ddd6fe", "#4c1d95"],
    connDot: ["#7c3aed", "#a78bfa"]
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/30",
    pulseBg: "bg-purple-100 dark:bg-purple-800/60",
    border: "border-purple-200 dark:border-purple-800",
    headerText: "text-purple-800 dark:text-purple-200",
    labelText: "text-purple-600 dark:text-purple-400",
    trunk: ["#d8b4fe", "#7e22ce"],
    connFill: ["#faf5ff", "#3b0764"],
    connBorder: ["#e9d5ff", "#6b21a8"],
    connDot: ["#9333ea", "#c084fc"]
  },
  fuchsia: {
    bg: "bg-fuchsia-50 dark:bg-fuchsia-950/30",
    pulseBg: "bg-fuchsia-100 dark:bg-fuchsia-800/60",
    border: "border-fuchsia-200 dark:border-fuchsia-800",
    headerText: "text-fuchsia-800 dark:text-fuchsia-200",
    labelText: "text-fuchsia-600 dark:text-fuchsia-400",
    trunk: ["#f0abfc", "#a21caf"],
    connFill: ["#fdf4ff", "#4a044e"],
    connBorder: ["#f5d0fe", "#86198f"],
    connDot: ["#c026d3", "#e879f9"]
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/30",
    pulseBg: "bg-pink-100 dark:bg-pink-800/60",
    border: "border-pink-200 dark:border-pink-800",
    headerText: "text-pink-800 dark:text-pink-200",
    labelText: "text-pink-600 dark:text-pink-400",
    trunk: ["#f9a8d4", "#be185d"],
    connFill: ["#fdf2f8", "#500724"],
    connBorder: ["#fbcfe8", "#9d174d"],
    connDot: ["#db2777", "#f472b6"]
  },
  rose: {
    bg: "bg-rose-50 dark:bg-rose-950/30",
    pulseBg: "bg-rose-100 dark:bg-rose-800/60",
    border: "border-rose-200 dark:border-rose-800",
    headerText: "text-rose-800 dark:text-rose-200",
    labelText: "text-rose-600 dark:text-rose-400",
    trunk: ["#fca5a5", "#be123c"],
    connFill: ["#fff1f2", "#4c0519"],
    connBorder: ["#fecdd3", "#9f1239"],
    connDot: ["#e11d48", "#fb7185"]
  },
  slate: {
    bg: "bg-slate-50 dark:bg-slate-800/50",
    pulseBg: "bg-slate-100 dark:bg-slate-700/60",
    border: "border-slate-200 dark:border-slate-700",
    headerText: "text-slate-700 dark:text-slate-300",
    labelText: "text-slate-500 dark:text-slate-400",
    trunk: ["#cbd5e1", "#334155"],
    connFill: ["#f8fafc", "#020617"],
    connBorder: ["#e2e8f0", "#1e293b"],
    connDot: ["#475569", "#94a3b8"]
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-800/50",
    pulseBg: "bg-gray-100 dark:bg-gray-700/60",
    border: "border-gray-200 dark:border-gray-700",
    headerText: "text-gray-700 dark:text-gray-300",
    labelText: "text-gray-500 dark:text-gray-400",
    trunk: ["#d1d5db", "#374151"],
    connFill: ["#f9fafb", "#030712"],
    connBorder: ["#e5e7eb", "#1f2937"],
    connDot: ["#4b5563", "#9ca3af"]
  },
  zinc: {
    bg: "bg-zinc-50 dark:bg-zinc-800/50",
    pulseBg: "bg-zinc-100 dark:bg-zinc-700/60",
    border: "border-zinc-200 dark:border-zinc-700",
    headerText: "text-zinc-700 dark:text-zinc-300",
    labelText: "text-zinc-500 dark:text-zinc-400",
    trunk: ["#d4d4d8", "#3f3f46"],
    connFill: ["#fafafa", "#09090b"],
    connBorder: ["#e4e4e7", "#27272a"],
    connDot: ["#52525b", "#a1a1aa"]
  },
  neutral: NEUTRAL_TOKENS,
  stone: {
    bg: "bg-stone-50 dark:bg-stone-800/50",
    pulseBg: "bg-stone-100 dark:bg-stone-700/60",
    border: "border-stone-200 dark:border-stone-700",
    headerText: "text-stone-700 dark:text-stone-300",
    labelText: "text-stone-500 dark:text-stone-400",
    trunk: ["#d6d3d1", "#44403c"],
    connFill: ["#fafaf9", "#0c0a09"],
    connBorder: ["#e7e5e4", "#292524"],
    connDot: ["#57534e", "#a8a29e"]
  }
};
function resolveBaseColor(color) {
  switch (color) {
    case "brand":
      return "blue";
    case "info":
      return "sky";
    case "success":
      return "emerald";
    case "warning":
      return "amber";
    case "danger":
      return "rose";
    case "theme":
    case "white":
      return "neutral";
    case "parallels":
      return "red";
    default:
      return color;
  }
}
function getTreeColorTokens(tone) {
  if (!tone) return NEUTRAL_TOKENS;
  const base = resolveBaseColor(tone);
  return BASE_TOKENS[base] ?? NEUTRAL_TOKENS;
}

// src/components/TimelinePanel/TimelinePanel.tsx
import { Fragment as Fragment20, jsx as jsx218, jsxs as jsxs112 } from "react/jsx-runtime";
function useIsDark() {
  const detect = () => {
    if (typeof document === "undefined") return false;
    const probe = document.createElement("div");
    probe.className = "hidden dark:block";
    document.body.appendChild(probe);
    const dark = window.getComputedStyle(probe).display === "block";
    probe.remove();
    return dark;
  };
  const [isDark, setIsDark] = useState43(() => detect());
  useEffect25(() => {
    const update = () => setIsDark(detect());
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, { attributeFilter: ["class"] });
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    update();
    return () => {
      media.removeEventListener("change", update);
      obs.disconnect();
    };
  }, []);
  return isDark;
}
var SVG_W = 28;
var TRUNK_X = 12;
var ITEM_DEPTH_PX = 44;
var ICON_W = 32;
var L_CORNER_R = 6;
var L_GAP = 6;
var ROOT_RING_R = 6.5;
var BW = 1.5;
var TimelineSvg = ({
  items,
  itemHeights,
  isDark,
  tone,
  showTrunkDots
}) => {
  const ci = isDark ? 1 : 0;
  const tok = getTreeColorTokens(tone);
  const trunkColor = tok.trunk[ci];
  const branchColor = tok.trunk[ci];
  const rootFill = tok.connDot[ci];
  const rootBorder = tok.trunk[ci];
  const rootDot = tok.connFill[ci];
  const curFill = tok.connFill[ci];
  const curBorder = tok.trunk[ci];
  const midYs = [];
  let cumY = 0;
  for (let i = 0; i < items.length; i++) {
    const h = itemHeights[i] ?? 44;
    midYs.push(cumY + h / 2);
    cumY += h;
  }
  const totalSvgH = cumY;
  if (totalSvgH === 0 || midYs.length === 0) return null;
  const d0Indices = items.map(
    (it, idx) => (it.depth ?? 0) === 0 || it.isRoot || it.isCurrent ? idx : -1
  ).filter((idx) => idx >= 0);
  const ANCHOR_GAP = ROOT_RING_R + L_GAP;
  const currentIdx = items.findIndex((it) => it.isCurrent);
  const trunkSegments = d0Indices.slice(0, -1).map((fromIdx, i) => {
    const toIdx = d0Indices[i + 1];
    const dashed = currentIdx >= 0 && fromIdx >= currentIdx;
    return {
      y1: midYs[fromIdx] + ANCHOR_GAP,
      y2: midYs[toIdx] - ANCHOR_GAP,
      dashed
    };
  });
  return /* @__PURE__ */ jsxs112(
    "svg",
    {
      width: SVG_W,
      height: totalSvgH,
      viewBox: `0 0 ${SVG_W} ${totalSvgH}`,
      overflow: "visible",
      "aria-hidden": "true",
      style: { position: "absolute", left: 0, top: 0, pointerEvents: "none" },
      children: [
        trunkSegments.map(({ y1, y2, dashed }, i) => /* @__PURE__ */ jsx218(
          "line",
          {
            x1: TRUNK_X,
            y1,
            x2: TRUNK_X,
            y2,
            stroke: trunkColor,
            strokeWidth: 2,
            strokeLinecap: "round",
            ...dashed ? { strokeDasharray: "3 4" } : {}
          },
          i
        )),
        showTrunkDots && midYs.map((my, i) => {
          const item = items[i];
          if (!item || item.isRoot || item.isCurrent) return null;
          const onSolid = currentIdx < 0 || i < currentIdx;
          if (!onSolid) return null;
          return /* @__PURE__ */ jsx218(
            "circle",
            {
              cx: TRUNK_X,
              cy: my,
              r: 3,
              fill: trunkColor
            },
            `td-${item.id}`
          );
        }),
        midYs.map((my, i) => {
          const item = items[i];
          if (!item) return null;
          if (item.isRoot) {
            const dashY2 = i < items.length - 1 ? totalSvgH : my + ROOT_RING_R + 20;
            return /* @__PURE__ */ jsxs112("g", { children: [
              /* @__PURE__ */ jsx218("circle", { cx: TRUNK_X, cy: my, r: ROOT_RING_R, fill: rootFill }),
              /* @__PURE__ */ jsx218(
                "circle",
                {
                  cx: TRUNK_X,
                  cy: my,
                  r: ROOT_RING_R,
                  stroke: rootBorder,
                  strokeWidth: BW,
                  fill: "none"
                }
              ),
              /* @__PURE__ */ jsx218("circle", { cx: TRUNK_X, cy: my, r: "2.5", fill: rootDot }),
              item.isCurrent && /* @__PURE__ */ jsx218(
                "line",
                {
                  x1: TRUNK_X,
                  y1: my + ROOT_RING_R + 4,
                  x2: TRUNK_X,
                  y2: dashY2,
                  stroke: trunkColor,
                  strokeWidth: 1.5,
                  strokeLinecap: "round",
                  strokeDasharray: "2 3"
                }
              )
            ] }, item.id);
          }
          if (item.isCurrent) {
            const hasItemsAfter = i < items.length - 1;
            const dashY2 = hasItemsAfter ? totalSvgH : my + ROOT_RING_R + 20;
            const curDepth = Math.min(item.depth ?? 0, 3);
            let lPath2 = null;
            if (curDepth > 0) {
              const lx2 = SVG_W + (curDepth - 1) * ITEM_DEPTH_PX + ICON_W / 2;
              let prevRefIdxC = i - 1;
              while (prevRefIdxC > 0 && (items[prevRefIdxC]?.depth ?? 0) > curDepth)
                prevRefIdxC--;
              const prevDepth2 = items[prevRefIdxC] ? items[prevRefIdxC].depth ?? 0 : 0;
              const topGap2 = prevDepth2 < curDepth ? ICON_W / 2 + L_GAP : -L_CORNER_R;
              const topY2 = (midYs[prevRefIdxC] ?? my) + topGap2;
              const rightX2 = SVG_W + curDepth * ITEM_DEPTH_PX - L_GAP;
              const cornerY2 = Math.max(topY2, my - L_CORNER_R);
              lPath2 = [
                `M ${lx2} ${topY2}`,
                `L ${lx2} ${cornerY2}`,
                `A ${L_CORNER_R} ${L_CORNER_R} 0 0 0 ${lx2 + L_CORNER_R} ${my}`,
                `L ${rightX2} ${my}`
              ].join(" ");
            }
            return /* @__PURE__ */ jsxs112("g", { children: [
              /* @__PURE__ */ jsx218("circle", { cx: TRUNK_X, cy: my, r: ROOT_RING_R, fill: curFill }),
              /* @__PURE__ */ jsx218(
                "circle",
                {
                  cx: TRUNK_X,
                  cy: my,
                  r: ROOT_RING_R,
                  stroke: curBorder,
                  strokeWidth: BW,
                  fill: "none"
                }
              ),
              lPath2 && /* @__PURE__ */ jsx218(
                "path",
                {
                  d: lPath2,
                  stroke: branchColor,
                  strokeWidth: 1.5,
                  strokeLinecap: "round",
                  fill: "none"
                }
              ),
              /* @__PURE__ */ jsx218(
                "line",
                {
                  x1: TRUNK_X,
                  y1: my + ROOT_RING_R + 4,
                  x2: TRUNK_X,
                  y2: dashY2,
                  stroke: trunkColor,
                  strokeWidth: 1.5,
                  strokeLinecap: "round",
                  strokeDasharray: "2 3"
                }
              )
            ] }, item.id);
          }
          const depth = Math.min(item.depth ?? 0, 3);
          if (depth === 0) return null;
          const lx = SVG_W + (depth - 1) * ITEM_DEPTH_PX + ICON_W / 2;
          let prevRefIdx = i - 1;
          while (prevRefIdx > 0 && (items[prevRefIdx]?.depth ?? 0) > depth)
            prevRefIdx--;
          const prevDepth = items[prevRefIdx] ? items[prevRefIdx].depth ?? 0 : 0;
          const topGap = prevDepth < depth ? ICON_W / 2 + L_GAP : -L_CORNER_R;
          const topY = (midYs[prevRefIdx] ?? my) + topGap;
          const rightX = SVG_W + depth * ITEM_DEPTH_PX - L_GAP;
          const cornerY = Math.max(topY, my - L_CORNER_R);
          const lPath = [
            `M ${lx} ${topY}`,
            `L ${lx} ${cornerY}`,
            `A ${L_CORNER_R} ${L_CORNER_R} 0 0 0 ${lx + L_CORNER_R} ${my}`,
            `L ${rightX} ${my}`
          ].join(" ");
          return /* @__PURE__ */ jsx218("g", { children: /* @__PURE__ */ jsx218(
            "path",
            {
              d: lPath,
              stroke: branchColor,
              strokeWidth: 1.5,
              strokeLinecap: "round",
              fill: "none"
            }
          ) }, item.id);
        })
      ]
    }
  );
};
var variantShellStyles = {
  elevated: "bg-white shadow-xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10 text-neutral-900 dark:text-neutral-100",
  outlined: "bg-white/90 text-neutral-900 ring-1 dark:bg-neutral-900/80 dark:text-neutral-100 dark:ring-white/10",
  subtle: "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  tonal: "text-neutral-900 shadow-sm ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  default: "bg-white/80 backdrop-blur-xl text-neutral-900 shadow-2xl ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  glass: "backdrop-blur-xl text-neutral-900 ring-1 ring-transparent dark:text-neutral-100 dark:ring-white/5",
  simple: "text-neutral-900 ring-transparent dark:text-neutral-100 dark:ring-white/5"
};
var cornerStyles2 = {
  rounded: "rounded-sm",
  "rounded-sm": "rounded-lg",
  "rounded-md": "rounded-2xl",
  "rounded-lg": "rounded-3xl",
  "rounded-full": "rounded-full",
  pill: "rounded-3xl",
  none: "rounded-none"
};
var OverflowButton = ({
  options,
  onSelect
}) => {
  const [open, setOpen] = useState43(false);
  const ref = useRef26(null);
  if (options.length === 0) return null;
  return /* @__PURE__ */ jsxs112(Fragment20, { children: [
    /* @__PURE__ */ jsx218(
      "button",
      {
        ref,
        type: "button",
        "aria-label": "More actions",
        onClick: () => setOpen((v) => !v),
        className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300",
        children: /* @__PURE__ */ jsxs112(
          "svg",
          {
            width: "16",
            height: "16",
            viewBox: "0 0 16 16",
            fill: "currentColor",
            "aria-hidden": "true",
            children: [
              /* @__PURE__ */ jsx218("circle", { cx: "2.5", cy: "8", r: "1.5" }),
              /* @__PURE__ */ jsx218("circle", { cx: "8", cy: "8", r: "1.5" }),
              /* @__PURE__ */ jsx218("circle", { cx: "13.5", cy: "8", r: "1.5" })
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsx218(
      DropdownMenu_default,
      {
        anchorRef: ref,
        open,
        onClose: () => setOpen(false),
        items: options,
        onSelect: (opt) => {
          onSelect(opt);
          setOpen(false);
        },
        align: "end",
        width: 180
      }
    )
  ] });
};
var TimelineItemRow = ({
  item,
  color,
  itemRef,
  actionSize
}) => {
  const depth = Math.min(item.depth ?? 0, 3);
  const depthPx = depth * ITEM_DEPTH_PX;
  const overflowOptions = (item.overflowActions ?? []).map((a) => ({
    label: a.label,
    value: a.value,
    icon: a.icon,
    danger: a.danger,
    disabled: a.disabled
  }));
  const handleOverflowSelect = (option) => {
    item.overflowActions?.find((a) => a.value === option.value)?.onClick?.();
  };
  const iconColorClasses = classNames59(
    item.iconBackground ? `rounded-full bg-${color}-100` : ""
  );
  return (
    // paddingLeft = SVG_W + depthPx so the whole row is column-shifted (total inside parent)
    /* @__PURE__ */ jsxs112(
      "div",
      {
        ref: itemRef,
        className: "flex items-center gap-2 py-2.5",
        style: { paddingLeft: SVG_W + depthPx },
        children: [
          /* @__PURE__ */ jsxs112("div", { className: "flex min-w-0 flex-1 items-center gap-3", children: [
            item.icon && /* @__PURE__ */ jsx218(
              "div",
              {
                className: classNames59(
                  "flex h-8 w-8 shrink-0 items-center justify-center text-blue-500 dark:bg-neutral-800 dark:text-neutral-400",
                  iconColorClasses
                ),
                children: item.icon
              }
            ),
            /* @__PURE__ */ jsxs112("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsx218("div", { className: "truncate text-sm font-medium text-neutral-900 dark:text-neutral-100", children: item.title }),
              item.subtitle && /* @__PURE__ */ jsx218("div", { className: "mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400", children: item.subtitle })
            ] })
          ] }),
          (item.actions !== void 0 && item.actions !== null && (!Array.isArray(item.actions) || item.actions.length > 0) || overflowOptions.length > 0) && /* @__PURE__ */ jsxs112("div", { className: "flex shrink-0 items-center gap-1.5", children: [
            Array.isArray(item.actions) ? item.actions.map((action, idx) => /* @__PURE__ */ jsx218(
              Button_default,
              {
                variant: action.variant ?? "outline",
                color: action.color ?? color,
                size: action.size ?? actionSize ?? "sm",
                onClick: action.onClick,
                disabled: action.disabled,
                loading: action.loading,
                children: action.label
              },
              idx
            )) : item.actions,
            /* @__PURE__ */ jsx218(
              OverflowButton,
              {
                options: overflowOptions,
                onSelect: handleOverflowSelect
              }
            )
          ] })
        ]
      }
    )
  );
};
function isHeaderActionObject(v) {
  return typeof v === "object" && v !== null && !React57.isValidElement(v) && "label" in v;
}
var TimelinePanel = ({
  title,
  headerAction,
  items,
  variant = "simple",
  tone = "neutral",
  padding = "sm",
  corner = "none",
  loading = false,
  emptyState,
  className,
  loaderProps,
  showTrunkDots = false
}) => {
  const isDark = useIsDark();
  const palette = getPanelToneStyles(tone);
  const itemEls = useRef26([]);
  const [itemHeights, setItemHeights] = useState43([]);
  const measureHeights = useCallback20(() => {
    const heights = itemEls.current.map((el) => el?.offsetHeight ?? 0);
    setItemHeights(
      (prev) => prev.length === heights.length && prev.every((h, i) => h === heights[i]) ? prev : heights
    );
  }, []);
  useLayoutEffect7(() => {
    itemEls.current = itemEls.current.slice(0, items.length);
    measureHeights();
    const ro = new ResizeObserver(measureHeights);
    itemEls.current.forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, [measureHeights, items]);
  const variantClass = (() => {
    switch (variant) {
      case "outlined":
        return classNames59(variantShellStyles.outlined, palette.border);
      case "subtle":
        return classNames59(
          variantShellStyles.subtle,
          palette.border,
          palette.subtleBg
        );
      case "tonal":
        return classNames59(variantShellStyles.tonal, palette.tonalBg);
      case "glass":
        return classNames59(
          variantShellStyles.glass,
          "border",
          palette.glassBorder,
          palette.glassBg
        );
      case "simple":
        return classNames59(variantShellStyles.simple);
      default:
        return variantShellStyles[variant] ?? variantShellStyles.elevated;
    }
  })();
  return /* @__PURE__ */ jsxs112(
    "section",
    {
      className: classNames59(
        "relative flex w-full flex-col overflow-hidden",
        paddingStyles2[padding],
        variantClass,
        cornerStyles2[corner],
        className
      ),
      "aria-busy": loading,
      children: [
        (title || headerAction) && /* @__PURE__ */ jsxs112("div", { className: classNames59("flex items-center justify-between gap-4"), children: [
          title && /* @__PURE__ */ jsx218(
            "h3",
            {
              className: classNames59(
                "text-lg font-semibold leading-2",
                palette.heading
              ),
              children: title
            }
          ),
          headerAction && (() => {
            if (isHeaderActionObject(headerAction)) {
              return /* @__PURE__ */ jsx218(
                Button_default,
                {
                  variant: headerAction.variant ?? "solid",
                  color: headerAction.color ?? tone,
                  size: headerAction.size ?? "sm",
                  onClick: headerAction.onClick,
                  disabled: headerAction.disabled,
                  loading: headerAction.loading,
                  leadingIcon: headerAction.leadingIcon,
                  weight: "semibold",
                  children: headerAction.label
                }
              );
            }
            return /* @__PURE__ */ jsx218("div", { className: "flex shrink-0 gap-2", children: headerAction });
          })()
        ] }),
        /* @__PURE__ */ jsx218("div", { className: "relative", children: loading && items.length === 0 ? (
          /* No items yet — centred spinner */
          /* @__PURE__ */ jsx218("div", { className: "flex items-center justify-center min-h-30 w-full h-full", children: /* @__PURE__ */ jsx218(
            Loader_default,
            {
              spinnerThickness: loaderProps?.spinnerThickness,
              color: tone,
              glass: loaderProps?.glass,
              glassBlurIntensity: loaderProps?.glassBlurIntensity,
              label: loaderProps?.label,
              size: loaderProps?.size,
              spinnerVariant: loaderProps?.spinnerVariant,
              title: loaderProps?.title,
              variant: loaderProps?.variant
            }
          ) })
        ) : items.length === 0 && emptyState ? /* @__PURE__ */ jsx218("div", { className: "py-4", children: emptyState }) : /* @__PURE__ */ jsxs112("div", { className: "relative", children: [
          itemHeights.length === items.length && items.length > 0 && /* @__PURE__ */ jsx218(
            TimelineSvg,
            {
              items,
              itemHeights,
              isDark,
              tone,
              showTrunkDots
            }
          ),
          /* @__PURE__ */ jsx218("div", { className: classNames59(loading && "pointer-events-none"), children: items.map((item, i) => /* @__PURE__ */ jsx218(
            TimelineItemRow,
            {
              color: tone,
              item,
              itemRef: (el) => {
                itemEls.current[i] = el;
              },
              actionSize: "sm"
            },
            item.id
          )) }),
          loading && /* @__PURE__ */ jsx218(
            Loader_default,
            {
              overlay: true,
              glass: true,
              color: tone,
              spinnerThickness: loaderProps?.spinnerThickness,
              glassBlurIntensity: loaderProps?.glassBlurIntensity ?? "low",
              label: loaderProps?.label,
              size: loaderProps?.size,
              spinnerVariant: loaderProps?.spinnerVariant,
              title: loaderProps?.title,
              variant: loaderProps?.variant,
              className: "absolute inset-0 rounded-[inherit]"
            }
          )
        ] }) })
      ]
    }
  );
};
TimelinePanel.displayName = "TimelinePanel";

// src/components/ConnectionFlow/ConnectionFlow.tsx
import React64, {
  useCallback as useCallback23,
  useEffect as useEffect32,
  useLayoutEffect as useLayoutEffect9,
  useMemo as useMemo28,
  useRef as useRef32,
  useState as useState50
} from "react";
import classNames65 from "classnames";

// src/components/ConnectionFlow/ConnectionFlowConnector.tsx
import { useEffect as useEffect26, useLayoutEffect as useLayoutEffect8, useRef as useRef27, useState as useState44 } from "react";
import { Fragment as Fragment21, jsx as jsx219, jsxs as jsxs113 } from "react/jsx-runtime";

// src/components/ConnectionFlow/ConnectionFlowColumn.tsx
import { useCallback as useCallback22, useEffect as useEffect30, useRef as useRef30, useState as useState48 } from "react";
import classNames63 from "classnames";

// src/components/TreeView/TreeItemCard.tsx
import { useEffect as useEffect28, useRef as useRef29, useState as useState46 } from "react";
import classNames62 from "classnames";

// src/contexts/BottomSheetContext.tsx
import {
  createContext as createContext3,
  useCallback as useCallback21,
  useContext as useContext3,
  useEffect as useEffect27,
  useMemo as useMemo27,
  useRef as useRef28,
  useState as useState45
} from "react";
import { createPortal as createPortal11 } from "react-dom";
import classNames60 from "classnames";
import { jsx as jsx220, jsxs as jsxs114 } from "react/jsx-runtime";
var BottomSheetContext = createContext3(null);

// src/utils/gravatar.ts
import CryptoJS from "crypto-js";

// src/types/Variables.ts
var SYSTEM_VARIABLES = [
  {
    fullToken: "{{ var::system::capsule_id }}",
    type: "var",
    source: "system",
    name: "capsule_id",
    description: "The unique identifier of the capsule instance."
  },
  {
    fullToken: "{{ var::system::capsule_name }}",
    type: "var",
    source: "system",
    name: "capsule_name",
    description: "The name of the capsule."
  },
  {
    fullToken: "{{ var::system::host_ip }}",
    type: "var",
    source: "system",
    name: "host_ip",
    description: "The IP address of the host machine."
  },
  {
    fullToken: "{{ var::system::app_url }}",
    type: "var",
    source: "system",
    name: "app_url",
    description: "The main URL for the application."
  },
  // Runtime Variables
  {
    fullToken: "{{ var::system::name }}",
    type: "var",
    source: "system",
    name: "name",
    description: "Capsule Name (Runtime)"
  },
  {
    fullToken: "{{ var::system::reverse_proxy_host }}",
    type: "var",
    source: "system",
    name: "reverse_proxy_host",
    description: "IP of the caddy reverse host (Runtime)"
  },
  {
    fullToken: "{{ var::system::ip_address }}",
    type: "var",
    source: "system",
    name: "ip_address",
    description: "IP of the VM (Runtime)"
  },
  {
    fullToken: "{{ var::system::host_gateway_ip }}",
    type: "var",
    source: "system",
    name: "host_gateway_ip",
    description: "IP of the docker gateway (Runtime)"
  },
  // Derived Variables
  {
    fullToken: "{{ var::system::sub_domain }}",
    type: "var",
    source: "system",
    name: "sub_domain",
    description: "The subdomain value (derived from slug)"
  },
  {
    fullToken: "{{ var::system::domain }}",
    type: "var",
    source: "system",
    name: "domain",
    description: "The domain suffix (parallels.private)"
  },
  {
    fullToken: "{{ var::system::host_url }}",
    type: "var",
    source: "system",
    name: "host_url",
    description: "The full URL (derived from sub_domain and domain)"
  }
];

// src/components/MetricBar.tsx
import classNames61 from "classnames";
import { jsx as jsx221, jsxs as jsxs115 } from "react/jsx-runtime";
var MetricBar = ({
  label,
  value,
  percentage,
  color = "blue",
  showShimmer = false,
  className,
  ...rest
}) => {
  return /* @__PURE__ */ jsxs115(
    "div",
    {
      className: classNames61("flex flex-col gap-1.5 w-full", className),
      ...rest,
      children: [
        /* @__PURE__ */ jsxs115("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx221("span", { className: "text-xs font-medium text-neutral-500 dark:text-neutral-400", children: label }),
          /* @__PURE__ */ jsx221("span", { className: "text-xs text-neutral-600 dark:text-neutral-300", children: value })
        ] }),
        /* @__PURE__ */ jsx221(
          Progress_default,
          {
            value: percentage,
            size: "sm",
            color,
            showShimmer
          }
        )
      ]
    }
  );
};
MetricBar.displayName = "MetricBar";

// src/components/TreeView/TreeItemCard.tsx
import { jsx as jsx222, jsxs as jsxs116 } from "react/jsx-runtime";

// src/components/TreeView/TreeFlowSvg.tsx
import { useEffect as useEffect29, useState as useState47 } from "react";
import { Fragment as Fragment22, jsx as jsx223, jsxs as jsxs117 } from "react/jsx-runtime";

// src/components/ConnectionFlow/ConnectionFlowColumn.tsx
import { jsx as jsx224, jsxs as jsxs118 } from "react/jsx-runtime";

// src/components/ConnectionFlow/ConnectionFlowParallelGroup.tsx
import { useEffect as useEffect31, useRef as useRef31, useState as useState49 } from "react";
import classNames64 from "classnames";
import { jsx as jsx225 } from "react/jsx-runtime";

// src/components/ConnectionFlow/ConnectionFlow.tsx
import { jsx as jsx226, jsxs as jsxs119 } from "react/jsx-runtime";

// src/components/TreeView/TreeView.tsx
import {
  useCallback as useCallback24,
  useEffect as useEffect33,
  useLayoutEffect as useLayoutEffect10,
  useRef as useRef33,
  useState as useState51
} from "react";
import classNames66 from "classnames";
import { jsx as jsx227, jsxs as jsxs120 } from "react/jsx-runtime";

// src/components/VariablePicker.tsx
import { jsx as jsx228, jsxs as jsxs121 } from "react/jsx-runtime";
var VariablePicker = ({
  onSelect,
  onClose,
  globalParameters,
  serviceNames
}) => {
  const [searchTerm, setSearchTerm] = useState52("");
  const [activeTab, setActiveTab] = useState52("global");
  const globalVars = useMemo29(() => {
    return globalParameters.map((p) => ({
      fullToken: createSmartToken(
        p.type === "env" ? "env" : "var",
        "global",
        p.key
      ),
      type: p.type === "env" ? "env" : "var",
      source: "global",
      name: p.key,
      description: p.name || p.help,
      defaultValue: p.default_value
    }));
  }, [globalParameters]);
  const serviceVars = useMemo29(() => {
    return serviceNames.map((name) => ({
      fullToken: createSmartToken("var", "service", name),
      type: "var",
      source: "service",
      name,
      description: `Reference to service: ${name}`
    }));
  }, [serviceNames]);
  const filterVars = (vars) => {
    if (!searchTerm) return vars;
    const lower = searchTerm.toLowerCase();
    return vars.filter(
      (v) => v.name.toLowerCase().includes(lower) || v.description && v.description.toLowerCase().includes(lower)
    );
  };
  const renderList = (vars, emptyMsg) => {
    const filtered = filterVars(vars);
    if (filtered.length === 0) {
      return /* @__PURE__ */ jsx228("div", { className: "p-4 text-center text-slate-500 italic", children: emptyMsg });
    }
    return /* @__PURE__ */ jsx228("div", { className: "flex flex-col gap-1 p-2", children: filtered.map((v) => /* @__PURE__ */ jsxs121(
      "button",
      {
        onClick: () => onSelect(v),
        className: "flex flex-col items-start p-2 hover:bg-slate-100 rounded text-left group transition-colors",
        children: [
          /* @__PURE__ */ jsxs121("div", { className: "flex items-center gap-2 w-full", children: [
            /* @__PURE__ */ jsx228("span", { className: "font-mono text-xs font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100", children: v.name }),
            v.defaultValue && /* @__PURE__ */ jsxs121("span", { className: "text-xs text-slate-400 ml-auto truncate max-w-[150px]", children: [
              "Def: ",
              v.defaultValue
            ] })
          ] }),
          v.description && /* @__PURE__ */ jsx228("span", { className: "text-xs text-slate-500 mt-1 line-clamp-1 group-hover:text-slate-700", children: v.description }),
          /* @__PURE__ */ jsx228("span", { className: "text-[10px] text-slate-300 mt-0.5 font-mono hidden group-hover:block", children: v.fullToken })
        ]
      },
      v.fullToken
    )) });
  };
  const tabs = [
    {
      id: "global",
      label: "Global",
      icon: "Globe",
      panel: /* @__PURE__ */ jsx228("div", { className: "h-64 overflow-y-auto", children: renderList(globalVars, "No global parameters found.") })
    },
    {
      id: "system",
      label: "System",
      icon: "Cog",
      panel: /* @__PURE__ */ jsx228("div", { className: "h-64 overflow-y-auto", children: renderList(SYSTEM_VARIABLES, "No system variables found.") })
    },
    {
      id: "services",
      label: "Services",
      icon: "Container",
      panel: /* @__PURE__ */ jsx228("div", { className: "h-64 overflow-y-auto", children: renderList(serviceVars, "No services found.") })
    }
  ];
  return /* @__PURE__ */ jsxs121("div", { className: "w-[400px] bg-white rounded-lg shadow-xl border border-slate-200 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxs121("div", { className: "flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50", children: [
      /* @__PURE__ */ jsx228("h3", { className: "text-sm font-semibold text-slate-900", children: "Insert Variable" }),
      onClose && /* @__PURE__ */ jsx228(
        IconButton_default,
        {
          icon: "Close",
          size: "xs",
          variant: "ghost",
          onClick: onClose
        }
      )
    ] }),
    /* @__PURE__ */ jsx228("div", { className: "p-2 border-b border-slate-100", children: /* @__PURE__ */ jsx228(
      Input_default,
      {
        placeholder: "Search variables...",
        value: searchTerm,
        onChange: (e) => setSearchTerm(e.target.value),
        autoFocus: true,
        className: "text-sm"
      }
    ) }),
    /* @__PURE__ */ jsx228("div", { className: "flex-1", children: /* @__PURE__ */ jsx228(
      Tabs_default,
      {
        items: tabs,
        value: activeTab,
        onChange: setActiveTab,
        variant: "minimal",
        className: "h-full flex flex-col"
      }
    ) })
  ] });
};

// src/components/MarkdownEditor.tsx
import { createPortal as createPortal12 } from "react-dom";
import { Fragment as Fragment23, jsx as jsx229, jsxs as jsxs122 } from "react/jsx-runtime";
var MarkdownEditor = ({
  value = "",
  onChange,
  height = 200,
  className,
  placeholder,
  readOnly = false,
  preview = "live",
  globalParameters = [],
  serviceNames = [],
  context = {}
}) => {
  const [showPicker, setShowPicker] = useState53(false);
  const [pickerPos, setPickerPos] = useState53({ top: 0, left: 0 });
  const selectionRef = useRef34({
    start: 0,
    end: 0
  });
  const resolveVariable2 = (source, name) => {
    if (source === "global" || source === "env") {
      let param = globalParameters.find((p) => p.key === name);
      if (!param) {
        param = globalParameters.find(
          (p) => p.key.toLowerCase() === name.toLowerCase()
        );
      }
      if (param) {
        return { value: param.default_value || "", isResolved: true };
      }
      return { value: "", isResolved: false };
    }
    if (source === "service") {
      return { value: name, isResolved: true };
    }
    if (source === "system") {
      const lowerName = name.toLowerCase();
      if (lowerName === "sub_domain") {
        return { value: context.slug || "", isResolved: true };
      }
      if (lowerName === "domain") {
        return { value: "parallels.private", isResolved: true };
      }
      if (lowerName === "host_url") {
        const protocol = context.enable_https ? "https" : "http";
        const domain = "parallels.private";
        const sub = context.slug || "";
        if (sub) {
          return { value: `${protocol}://${sub}.${domain}`, isResolved: true };
        }
        return { value: "", isResolved: false };
      }
      const runtimeVars = [
        "name",
        "reverse_proxy_host",
        "ip_address",
        "host_gateway_ip",
        "capsule_id",
        "capsule_name",
        "host_ip",
        "app_url"
      ];
      if (runtimeVars.includes(lowerName)) {
        return { value: `[${lowerName}]`, isResolved: true, isRuntime: true };
      }
      return { value: `[System: ${name}]`, isResolved: true, isRuntime: true };
    }
    return { value: "", isResolved: false };
  };
  const SAFE_VAR_PATTERN = "SVAR(\\w+)SVAR(\\w+)SVAR([a-zA-Z0-9_\\-\\.]+)END";
  const preprocess = React67.useCallback((text) => {
    const regex = new RegExp(SMART_VAR_REGEX, "gi");
    return text.replace(
      regex,
      (_match, type, source, name) => {
        return `SVAR${type}SVAR${source}SVAR${name}END`;
      }
    );
  }, []);
  const replaceVariablesInString = React67.useCallback(
    (text) => {
      const combined = new RegExp(
        `${SAFE_VAR_PATTERN}|${SMART_VAR_REGEX.source}`,
        "gi"
      );
      return text.replace(combined, (_match, _t1, s1, n1, _t2, s2, n2) => {
        const source = s1 || s2;
        const name = n1 || n2;
        const { value: value2 } = resolveVariable2(source, name);
        return value2 || "";
      });
    },
    [resolveVariable2]
  );
  const renderWithVariables = (text) => {
    if (!text) return null;
    const parts = [];
    let lastIndex = 0;
    let match;
    const combinedRegex = new RegExp(
      `${SAFE_VAR_PATTERN}|${SMART_VAR_REGEX.source}`,
      "gi"
    );
    while ((match = combinedRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const source = match[2] || match[5];
      const name = match[3] || match[6];
      const type = match[1] || match[4];
      if (source && name) {
        const { value: resolvedVal, isResolved } = resolveVariable2(
          source,
          name
        );
        if (isResolved) {
          parts.push(
            /* @__PURE__ */ jsx229(
              "span",
              {
                title: `Variable: ${source}::${name}
Original: ${match[0]}`,
                className: "cursor-help border-b border-dotted border-gray-400 decoration-gray-400",
                children: resolvedVal
              },
              `var-${match.index}`
            )
          );
        } else {
          const displayToken = match[0].startsWith("SVAR") ? `{{ ${type}::${source}::${name} }}` : match[0];
          const badgeClass = "bg-red-50 text-red-700 border-red-200";
          parts.push(
            /* @__PURE__ */ jsx229(
              "span",
              {
                className: `mx-0.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono border ${badgeClass} select-none align-baseline`,
                title: "Variable not found",
                children: displayToken
              },
              `var-${match.index}`
            )
          );
        }
      } else {
        parts.push(match[0]);
      }
      lastIndex = combinedRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
    return /* @__PURE__ */ jsx229(Fragment23, { children: parts });
  };
  const createVariableRenderer = (TagName) => {
    const VariableRenderer = (props) => {
      const { children, node, ...rest } = props;
      return /* @__PURE__ */ jsx229(TagName, { ...rest, children: React67.Children.map(children, (child) => {
        if (typeof child === "string") {
          return renderWithVariables(child);
        }
        return child;
      }) });
    };
    return VariableRenderer;
  };
  const ListRenderer = (TagName, defaultClass) => {
    return (props) => {
      const { children, className: className2, node, ...rest } = props;
      return /* @__PURE__ */ jsx229(TagName, { className: classNames67(defaultClass, className2), ...rest, children });
    };
  };
  const CodeRenderer = ({ children, className: className2, node, ...props }) => {
    return /* @__PURE__ */ jsx229("code", { className: className2, ...props, children: React67.Children.map(children, (child) => {
      if (typeof child === "string") {
        return renderWithVariables(child);
      }
      return child;
    }) });
  };
  const LinkRenderer = (props) => {
    const { href, children, ...rest } = props;
    const resolvedHref = href ? replaceVariablesInString(href) : href;
    return /* @__PURE__ */ jsx229("a", { href: resolvedHref, ...rest, children: React67.Children.map(children, (child) => {
      if (typeof child === "string") {
        return renderWithVariables(child);
      }
      return child;
    }) });
  };
  const components = useMemo30(
    () => ({
      p: createVariableRenderer("p"),
      li: createVariableRenderer("li"),
      ul: ListRenderer("ul", "list-disc pl-6 mb-4"),
      ol: ListRenderer("ol", "list-decimal pl-6 mb-4"),
      h1: createVariableRenderer("h1"),
      h2: createVariableRenderer("h2"),
      h3: createVariableRenderer("h3"),
      h4: createVariableRenderer("h4"),
      h5: createVariableRenderer("h5"),
      h6: createVariableRenderer("h6"),
      blockquote: createVariableRenderer("blockquote"),
      a: LinkRenderer,
      strong: createVariableRenderer("strong"),
      em: createVariableRenderer("em"),
      del: createVariableRenderer("del"),
      span: createVariableRenderer("span"),
      code: CodeRenderer
    }),
    [globalParameters, serviceNames, context]
  );
  const variableCommand = useMemo30(
    () => ({
      name: "variable",
      keyCommand: "variable",
      buttonProps: {
        "aria-label": "Insert Variable",
        title: "Insert Variable"
      },
      icon: /* @__PURE__ */ jsx229(
        "svg",
        {
          width: "12",
          height: "12",
          viewBox: "0 0 20 20",
          style: { marginTop: "2px" },
          children: /* @__PURE__ */ jsx229(
            "path",
            {
              fill: "currentColor",
              d: "M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"
            }
          )
        }
      ),
      execute: (state) => {
        selectionRef.current = {
          start: state.selection.start,
          end: state.selection.end
        };
        const textarea = document.querySelector(".w-md-editor-text-input");
        if (textarea) {
          const rect = textarea.getBoundingClientRect();
          setPickerPos({
            top: rect.top + window.scrollY + 50,
            left: rect.left + window.scrollX + 50
          });
        } else {
          setPickerPos({
            top: window.scrollY + 100,
            left: window.scrollX + 100
          });
        }
        setShowPicker(true);
      }
    }),
    []
  );
  const handleSelectVariable = (variable) => {
    const token = variable.fullToken;
    const start = selectionRef.current.start;
    const end = selectionRef.current.end;
    const newValue = value.substring(0, start) + token + value.substring(end);
    onChange?.(newValue);
    setShowPicker(false);
  };
  return /* @__PURE__ */ jsxs122(
    "div",
    {
      className: classNames67("markdown-editor-wrapper relative", className),
      "data-color-mode": "light",
      children: [
        /* @__PURE__ */ jsx229(
          MDEditor,
          {
            value,
            onChange,
            height,
            preview,
            visibleDragbar: false,
            commands: [
              commands.bold,
              commands.italic,
              commands.strikethrough,
              commands.hr,
              commands.title,
              commands.divider,
              commands.link,
              commands.quote,
              commands.code,
              commands.divider,
              commands.unorderedListCommand,
              commands.orderedListCommand,
              commands.checkedListCommand,
              commands.divider,
              variableCommand
              // Plug our custom command here
            ],
            textareaProps: {
              placeholder,
              disabled: readOnly
            },
            previewOptions: {
              components
            },
            renderPreview: React67.useCallback(
              (source) => /* @__PURE__ */ jsx229(
                MDEditor.Markdown,
                {
                  source: preprocess(source),
                  components,
                  style: {
                    backgroundColor: "white",
                    color: "#334155",
                    minHeight: "100%"
                  }
                }
              ),
              [preprocess, components]
            ),
            className: classNames67(
              "rounded-lg overflow-hidden border border-slate-300",
              {
                "pointer-events-none opacity-60": readOnly
              }
            ),
            style: {
              backgroundColor: "white",
              color: "#334155"
              // slate-700
            }
          }
        ),
        showPicker && createPortal12(
          /* @__PURE__ */ jsx229(
            "div",
            {
              style: {
                position: "absolute",
                top: pickerPos.top,
                left: pickerPos.left,
                zIndex: 9999
              },
              children: /* @__PURE__ */ jsx229(
                VariablePicker,
                {
                  onSelect: handleSelectVariable,
                  onClose: () => setShowPicker(false),
                  globalParameters,
                  serviceNames
                }
              )
            }
          ),
          document.body
        )
      ]
    }
  );
};
var MarkdownEditor_default = MarkdownEditor;
export {
  HelpButton_default as HelpButton,
  MarkdownEditor_default as MarkdownEditor
};
//# sourceMappingURL=markdown.js.map