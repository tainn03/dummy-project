import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { taskApi } from "../../adapter/adapter";

// Define Task type
interface Task {
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

// Define task state
interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string | null;
    sortBy: string;
    sortDir: "asc" | "desc";
  };
}

// Initial state
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
  filters: {
    status: null,
    sortBy: "createdAt",
    sortDir: "desc",
  },
};

// Async thunks for tasks
export const fetchTasks = createAsyncThunk(
  "task/fetchTasks",
  async (
    {
      token,
      status,
      sortBy,
      sortDir,
    }: {
      token: string;
      status?: string;
      sortBy?: string;
      sortDir?: "asc" | "desc";
    },
    { rejectWithValue }
  ) => {
    try {
      return await taskApi.getTasks(token, status, sortBy, sortDir);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch tasks");
    }
  }
);

export const fetchTask = createAsyncThunk(
  "task/fetchTask",
  async ({ id, token }: { id: string; token: string }, { rejectWithValue }) => {
    try {
      return await taskApi.getTask(id, token);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch task");
    }
  }
);

export const createTask = createAsyncThunk(
  "task/createTask",
  async (
    {
      task,
      token,
    }: {
      task: {
        title: string;
        description?: string;
        status?: string;
        deadline?: string;
      };
      token: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const newTask = await taskApi.createTask(task, token);
      dispatch(fetchTasks({ token }));
      return newTask;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create task");
    }
  }
);

export const updateTask = createAsyncThunk(
  "task/updateTask",
  async (
    {
      id,
      task,
      token,
    }: {
      id: string;
      task: {
        title?: string;
        description?: string;
        status?: string;
        deadline?: string;
      };
      token: string;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const updatedTask = await taskApi.updateTask(id, task, token);
      dispatch(fetchTasks({ token }));
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update task");
    }
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (
    { id, token }: { id: string; token: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await taskApi.deleteTask(id, token);
      dispatch(fetchTasks({ token }));
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete task");
    }
  }
);

// Task slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskFilters: (
      state,
      action: PayloadAction<{
        status?: string | null;
        sortBy?: string;
        sortDir?: "asc" | "desc";
      }>
    ) => {
      if (action.payload.status !== undefined) {
        state.filters.status = action.payload.status;
      }
      if (action.payload.sortBy) {
        state.filters.sortBy = action.payload.sortBy;
      }
      if (action.payload.sortDir) {
        state.filters.sortDir = action.payload.sortDir;
      }
    },
    resetTaskError: (state) => {
      state.error = null;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(fetchTasks.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch task
      .addCase(fetchTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.currentTask = action.payload;
        state.error = null;
      })
      .addCase(fetchTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteTask.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTaskFilters, resetTaskError, clearCurrentTask } =
  taskSlice.actions;
export default taskSlice.reducer;
