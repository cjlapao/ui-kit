import type { TrueColor } from "./Theme";

const colors: TrueColor[] = [
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
  "rose",
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
];

const createIconAccentRing = (): Record<TrueColor, string> => {
  const rings: Record<string, string> = {};
  colors.forEach((color) => {
    rings[color] = `focus-visible:ring-${color}-500`;
  });
  return rings as Record<TrueColor, string>;
};

const createIconAccentHover = (): Record<TrueColor, string> => {
  const hovers: Record<string, string> = {};
  colors.forEach((color) => {
    hovers[color] = `hover:text-${color}-500 dark:hover:text-${color}-300`;
  });
  return hovers as Record<TrueColor, string>;
};

const createIconAccentActive = (): Record<TrueColor, string> => {
  const actives: Record<string, string> = {};
  colors.forEach((color) => {
    actives[color] = `!text-${color}-500 !dark:text-${color}-300`;
  });
  return actives as Record<TrueColor, string>;
};

export const iconAccentRing: Record<TrueColor, string> =
  createIconAccentRing();
export const iconAccentHover: Record<TrueColor, string> =
  createIconAccentHover();
export const iconAccentActive: Record<TrueColor, string> =
  createIconAccentActive();