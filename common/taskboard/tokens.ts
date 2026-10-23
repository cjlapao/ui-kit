/**
 * TaskBoard colour tokens — TrueColor → Tailwind class maps.
 *
 * Every dynamic class produced here is emitted by
 * `scripts/generate-safelist.mjs` (TaskBoard section), because the scanner
 * only sees static strings.
 */

import { TRUE_COLORS, type TrueColor } from "../theme/Theme";

export interface TaskBoardColumnTokens {
  /** Coloured top edge of a column well. */
  edge: string;
  /** WIP readout when the column is at or over its limit. */
  wipFull: string;
}

export function getTaskBoardColumnTokens(c: TrueColor): TaskBoardColumnTokens {
  return {
    edge: `border-t-${c}-500`,
    wipFull: `text-${c}-600 dark:text-${c}-400`,
  };
}

export interface TaskBoardChipTokens {
  /** Priority chips and coloured tags. */
  chip: string;
}

export function getTaskBoardChipTokens(c: TrueColor): TaskBoardChipTokens {
  return { chip: `bg-${c}-100 text-${c}-700 dark:bg-${c}-500/20 dark:text-${c}-300` };
}

export interface TaskBoardCardToneTokens {
  /** Tinted card on a solid board — opaque in both schemes, so the drag
   *  clone (portaled over anything) can use it too. */
  solid: string;
  /** Tinted card on a translucent (glass) board. */
  glass: string;
}

export function getTaskBoardCardToneTokens(c: TrueColor): TaskBoardCardToneTokens {
  return {
    solid: `bg-${c}-50 ring-${c}-200 dark:bg-${c}-950 dark:ring-${c}-500/30`,
    glass: `bg-${c}-100/60 ring-${c}-300/50 dark:bg-${c}-500/15 dark:ring-${c}-400/30`,
  };
}

export interface TaskBoardPeerTokens {
  /** Ring on a card a peer is holding. */
  ring: string;
  /** The remote ghost card in the peer's target slot. */
  ghost: string;
  /** The name tag riding the ghost / held card. */
  label: string;
}

export function getTaskBoardPeerTokens(c: TrueColor): TaskBoardPeerTokens {
  return {
    ring: `ring-${c}-500`,
    ghost: `border-${c}-500 bg-${c}-500/10`,
    label: `bg-${c}-500 text-white`,
  };
}

export interface TaskBoardSelectionTokens {
  /** Selected card ring. */
  ring: string;
  /** Drop insertion line. */
  line: string;
  /** Floating drag clone ring. */
  clone: string;
}

export function getTaskBoardSelectionTokens(c: TrueColor): TaskBoardSelectionTokens {
  return {
    ring: `ring-2 ring-${c}-500`,
    line: `bg-${c}-500`,
    clone: `ring-2 ring-${c}-400/50`,
  };
}

// Peers get the saturated hues only — grey peers would read as "disabled".
const PEER_PALETTE = TRUE_COLORS.filter(
  (c) => !["slate", "gray", "zinc", "neutral", "stone"].includes(c),
) as TrueColor[];

/** A stable colour for a user id (FNV-1a over the id). */
export function peerColor(userId: string): TrueColor {
  let h = 0x811c9dc5;
  for (let i = 0; i < userId.length; i++) {
    h ^= userId.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return PEER_PALETTE[(h >>> 0) % PEER_PALETTE.length];
}
