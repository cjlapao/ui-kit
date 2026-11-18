/**
 * Sub-task resolution — the pure rule the card renders from.
 *
 * Each sub task takes its explicit `status`, else the `done` flag, else an
 * order-based inference: the first sub task that is neither stated nor
 * checked is the one being worked on (`active`); everything after it waits
 * (`pending`). So a plain checked list (`done: true/false`) reads as
 * "done dots, one pulsing dot, grey dots" with no ceremony, while an app
 * that tracks real states sets `status` and the heuristic steps aside.
 *
 * The strings match the stepper statuses 1:1, so the React card maps a
 * resolved list onto DotStepper steps without a translation layer.
 */

import type { TaskBoardSubtask, TaskBoardSubtaskStatus } from "./types";

export interface ResolvedSubtask {
  id: string;
  title: string;
  status: TaskBoardSubtaskStatus;
}

export interface ResolvedSubtasks {
  subtasks: ResolvedSubtask[];
  /** Sub tasks in state `completed`. */
  done: number;
  total: number;
}

export function resolveSubtasks(subtasks: TaskBoardSubtask[]): ResolvedSubtasks {
  let seenUnstated = false;
  let done = 0;
  const resolved = subtasks.map((subtask) => {
    const status: TaskBoardSubtaskStatus =
      subtask.status ?? (subtask.done ? "completed" : seenUnstated ? "pending" : "active");
    if (!subtask.status && !subtask.done && status === "active") seenUnstated = true;
    if (status === "completed") done += 1;
    return { id: subtask.id, title: subtask.title, status };
  });
  return { subtasks: resolved, done, total: resolved.length };
}
