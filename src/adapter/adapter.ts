// Mock data adapter for Task Manager Prototype

// Define types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

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

export interface LoginResponse {
  token: string;
  user: User;
}

// Generate a random ID (simple implementation)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock user data
const mockUser: User = {
  id: "user-123",
  name: "John Doe",
  email: "john@example.com",
  createdAt: new Date().toISOString(),
};

// Mock tasks data
let mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Complete project documentation",
    description: "Write comprehensive documentation for the project",
    status: "pending",
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUser.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    user: {
      name: mockUser.name,
      email: mockUser.email,
    },
  },
  {
    id: "task-2",
    title: "Fix login bug",
    description: "Resolve the authentication issue reported by users",
    status: "in-progress",
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUser.id,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: mockUser.name,
      email: mockUser.email,
    },
  },
  {
    id: "task-3",
    title: "Deploy to production",
    description: "Push the latest changes to the production server",
    status: "completed",
    deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUser.id,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: mockUser.name,
      email: mockUser.email,
    },
  },
  {
    id: "task-4",
    title: "Design new landing page",
    description: "Create a modern design for the landing page",
    status: "pending",
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUser.id,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: mockUser.name,
      email: mockUser.email,
    },
  },
  {
    id: "task-5",
    title: "User testing",
    description: "Conduct user testing for the new features",
    status: "in-progress",
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUser.id,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: mockUser.name,
      email: mockUser.email,
    },
  },
];

// Helper function to simulate async behavior
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Authentication API (with mock data)
export const authApi = {
  // Login user
  login: async (email: string, password: string): Promise<LoginResponse> => {
    await delay(500); // Simulate network delay

    // For demo purposes, accept any email with "password"
    if (password === "password") {
      return {
        token: "mock-token-xyz",
        user: mockUser,
      };
    }

    throw new Error("Invalid credentials");
  },

  // Register user
  register: async (
    name: string,
    email: string,
    _password: string
  ): Promise<LoginResponse> => {
    await delay(500); // Simulate network delay

    console.log("Registering user...", name, email, _password);
    // Create a "new" user (but actually return the mock user for simplicity)
    return {
      token: "mock-token-xyz",
      user: {
        ...mockUser,
        name,
        email,
      },
    };
  },

  // Logout user
  logout: async (): Promise<void> => {
    await delay(300); // Simulate network delay
    return;
  },

  // Change password
  changePassword: async (
    currentPassword: string,
    _newPassword: string,
    _token: string
  ): Promise<void> => {
    await delay(500); // Simulate network delay

    console.log("Changing password...", currentPassword, _newPassword, _token);
    // Mock validation - only "password" is valid current password
    if (currentPassword !== "password") {
      throw new Error("Current password is incorrect");
    }

    return;
  },
};

// Task API (with mock data)
export const taskApi = {
  // Get all tasks
  getTasks: async (
    _token: string,
    status?: string,
    sortBy: string = "createdAt",
    sortDir: "asc" | "desc" = "desc"
  ): Promise<Task[]> => {
    await delay(500); // Simulate network delay

    // Filter by status if provided
    let filteredTasks = [...mockTasks];
    if (status) {
      filteredTasks = filteredTasks.filter((task) => task.status === status);
    }

    // Sort tasks
    filteredTasks.sort((a, b) => {
      const fieldA = sortBy === "deadline" ? a.deadline || "" : a.createdAt;
      const fieldB = sortBy === "deadline" ? b.deadline || "" : b.createdAt;

      if (sortDir === "asc") {
        return fieldA.localeCompare(fieldB);
      } else {
        return fieldB.localeCompare(fieldA);
      }
    });

    return filteredTasks;
  },

  // Get task by ID
  getTask: async (id: string, _token: string): Promise<Task> => {
    await delay(300); // Simulate network delay

    console.log("Fetching task with ID:", id, _token);
    const task = mockTasks.find((task) => task.id === id);
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  },

  // Create task
  createTask: async (
    task: {
      title: string;
      description?: string;
      status?: string;
      deadline?: string;
    },
    _token: string
  ): Promise<Task> => {
    await delay(500); // Simulate network delay

    console.log("Creating task...", task, _token);
    const newTask: Task = {
      id: generateId(),
      title: task.title,
      description: task.description || null,
      status: task.status || "pending",
      deadline: task.deadline ? new Date(task.deadline).toISOString() : null,
      createdBy: mockUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {
        name: mockUser.name,
        email: mockUser.email,
      },
    };

    mockTasks.push(newTask);
    return newTask;
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
    _token: string
  ): Promise<Task> => {
    await delay(500); // Simulate network delay

    console.log("Updating task...", id, task, _token);
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    mockTasks[taskIndex] = {
      ...mockTasks[taskIndex],
      title: task.title || mockTasks[taskIndex].title,
      description:
        task.description !== undefined
          ? task.description
          : mockTasks[taskIndex].description,
      status: task.status || mockTasks[taskIndex].status,
      deadline: task.deadline
        ? new Date(task.deadline).toISOString()
        : mockTasks[taskIndex].deadline,
      updatedAt: new Date().toISOString(),
    };

    return mockTasks[taskIndex];
  },

  // Delete task
  deleteTask: async (id: string, _token: string): Promise<void> => {
    await delay(300); // Simulate network delay

    console.log("Deleting task with ID:", id, _token);
    const taskIndex = mockTasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }

    mockTasks = mockTasks.filter((task) => task.id !== id);
    return;
  },
};
