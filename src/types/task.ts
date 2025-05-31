// Task types for the application

// Main Task interface
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
}

// Type for task creation payload
export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
}

// Type for task update payload
export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: string;
  deadline?: string | null;
}
