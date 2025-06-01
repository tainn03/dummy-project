import { TaskStatus } from "@/constants/task";
import { taskApi } from "@/adapter/adapter";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  deadline?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  deadline?: string;
}

export interface TaskFilterParams {
  status?: TaskStatus;
  sortBy?: "createdAt" | "deadline";
  sortDir?: "asc" | "desc";
}

export const taskService = {
  // Get all tasks with filters
  getAllTasks: async (
    token: string,
    filters?: TaskFilterParams
  ): Promise<Task[]> => {
    return taskApi.getTasks(
      token,
      filters?.status,
      filters?.sortBy,
      filters?.sortDir
    ) as Promise<Task[]>;
  },

  // Get task by ID
  getTaskById: async (id: string, token: string): Promise<Task> => {
    return taskApi.getTask(id, token) as Promise<Task>;
  },

  // Create new task
  createTask: async (task: CreateTaskRequest, token: string): Promise<Task> => {
    return taskApi.createTask(task, token) as Promise<Task>;
  },

  // Update task
  updateTask: async (
    id: string,
    task: UpdateTaskRequest,
    token: string
  ): Promise<Task> => {
    return taskApi.updateTask(id, task, token) as Promise<Task>;
  },

  // Delete task
  deleteTask: async (id: string, token: string): Promise<void> => {
    return taskApi.deleteTask(id, token);
  },
};
