/**
 * TaskBoard — public surface.
 *
 * The `TaskBoard` component plus the framework-agnostic engine (re-exported
 * from `common/taskboard`) so consumers import the data model, the move rules
 * and the collaboration helpers from one place:
 *
 * ```tsx
 * import { TaskBoard, sampleTaskBoard, createBroadcastChannelTransport } from "@cjlapao/ui-kit";
 * ```
 */

export { TaskBoard } from "./TaskBoard";
export type { TaskBoardProps, TaskBoardVariant, TaskBoardCorner, TaskBoardPadding } from "./TaskBoard";
export type { TaskBoardCardState, TaskBoardContextMenuPayload } from "./context";

export {
  sampleTaskBoard,
  bucketCards,
  bucketKey,
  applyMove,
  validateMove,
  createTaskBoardHistory,
  createBroadcastChannelTransport,
  presenceReducer,
  emptyPresence,
  expirePresence,
  holderOf,
  peerColor,
  PRESENCE_HEARTBEAT_MS,
  LOCK_TTL_MS,
  HOVER_THROTTLE_MS,
  DEFAULT_TASKBOARD_LABELS,
  TASKBOARD_LAYOUTS,
  TASKBOARD_CARD_LAYOUTS,
} from "../../../../common/taskboard";
export type {
  TaskBoardCard,
  TaskBoardColumn,
  TaskBoardLane,
  TaskBoardPriority,
  TaskBoardUser,
  TaskBoardTag,
  TaskBoardSlot,
  TaskBoardMove,
  TaskBoardLayout,
  TaskBoardCardLayout,
  TaskBoardLabels,
  TaskBoardTransport,
  TaskBoardCollabEvent,
  TaskBoardHistory,
  TaskBoardSample,
  PresenceState,
  MoveVerdict,
  MoveContext,
} from "../../../../common/taskboard";
