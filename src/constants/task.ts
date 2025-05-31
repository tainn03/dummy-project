// Task status constants as enum for better type checking
export enum TaskStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
}

// For backwards compatibility with existing code
export const TASK_STATUS = {
  PENDING: TaskStatus.PENDING,
  IN_PROGRESS: TaskStatus.IN_PROGRESS,
  COMPLETED: TaskStatus.COMPLETED,
} as const;

// Task status labels mapping for UI display
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: "Pending",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.COMPLETED]: "Completed",
};

// Task status color mapping for UI styling
export const TASK_STATUS_COLORS: Record<
  TaskStatus,
  { bg: string; text: string }
> = {
  [TaskStatus.PENDING]: { bg: "bg-yellow-100", text: "text-yellow-800" },
  [TaskStatus.IN_PROGRESS]: { bg: "bg-blue-100", text: "text-blue-800" },
  [TaskStatus.COMPLETED]: { bg: "bg-green-100", text: "text-green-800" },
};

// Status options for select inputs
export const TASK_STATUS_OPTIONS = Object.entries(TASK_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);
