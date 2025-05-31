import { API_BASE_URL, handleApiResponse, getAuthHeaders } from "./api";
import { TaskStatus } from "@/constants/task";

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
    // Build query string from filters
    const queryParams = new URLSearchParams();
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.sortBy) queryParams.append("sortBy", filters.sortBy);
    if (filters?.sortDir) queryParams.append("sortDir", filters.sortDir);

    const response = await fetch(
      `${API_BASE_URL}/tasks?${queryParams.toString()}`,
      {
        method: "GET",
        headers: getAuthHeaders(token),
        credentials: "include",
      }
    );

    return handleApiResponse<Task[]>(response);
  },

  // Get task by ID
  getTaskById: async (id: string, token: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "GET",
      headers: getAuthHeaders(token),
      credentials: "include",
    });

    return handleApiResponse<Task>(response);
  },

  // Create new task
  createTask: async (task: CreateTaskRequest, token: string): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: getAuthHeaders(token),
      credentials: "include",
      body: JSON.stringify(task),
    });

    return handleApiResponse<Task>(response);
  },

  // Update task
  updateTask: async (
    id: string,
    task: UpdateTaskRequest,
    token: string
  ): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      credentials: "include",
      body: JSON.stringify(task),
    });

    return handleApiResponse<Task>(response);
  },

  // Delete task
  deleteTask: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
      credentials: "include",
    });

    await handleApiResponse<void>(response);
  },
};
