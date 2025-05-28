// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  token: string;
  user: Omit<User, "password">;
}

interface TaskWithUser extends Task {
  user: {
    name: string;
    email: string;
  };
}

// Helper method to handle API errors
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Create headers with authentication token
const createHeaders = (token?: string) => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Authentication API
export const authApi = {
  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await handleApiError(response);
    return data.data as LoginResponse;
  },

  // Register user
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await handleApiError(response);
    return data.data as LoginResponse;
  },

  // Logout user
  logout: async (): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    await handleApiError(response);
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<void> => {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "PUT",
      headers: createHeaders(token),
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    await handleApiError(response);
  },
};

// Task API
export const taskApi = {
  // Get all tasks
  getTasks: async (
    token: string,
    status?: string,
    sortBy?: string,
    sortDir?: "asc" | "desc"
  ): Promise<TaskWithUser[]> => {
    const queryParams = new URLSearchParams();
    if (status) queryParams.append("status", status);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortDir) queryParams.append("sortDir", sortDir);

    const response = await fetch(`${API_URL}/tasks?${queryParams.toString()}`, {
      method: "GET",
      headers: createHeaders(token),
      credentials: "include",
    });

    const data = await handleApiError(response);
    return data.data as TaskWithUser[];
  },

  // Get task by ID
  getTask: async (id: string, token: string): Promise<TaskWithUser> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "GET",
      headers: createHeaders(token),
      credentials: "include",
    });

    const data = await handleApiError(response);
    return data.data as TaskWithUser;
  },

  // Create task
  createTask: async (
    task: {
      title: string;
      description?: string;
      status?: string;
      deadline?: string;
    },
    token: string
  ): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: createHeaders(token),
      credentials: "include",
      body: JSON.stringify(task),
    });

    const data = await handleApiError(response);
    return data.data as Task;
  },

  // Update task
  updateTask: async (
    id: string,
    task: {
      title?: string;
      description?: string;
      status?: string;
      deadline?: string;
    },
    token: string
  ): Promise<Task> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: createHeaders(token),
      credentials: "include",
      body: JSON.stringify(task),
    });

    const data = await handleApiError(response);
    return data.data as Task;
  },

  // Delete task
  deleteTask: async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: createHeaders(token),
      credentials: "include",
    });

    await handleApiError(response);
  },
};
