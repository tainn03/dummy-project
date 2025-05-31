"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  taskService,
  TaskFilterParams,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/services/taskService";

// Get the auth token from localStorage (client-side only)
const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// Hook to fetch all tasks with filters
export const useTaskList = (filters?: TaskFilterParams) => {
  const token = getToken();

  return useQuery({
    queryKey: ["tasks", filters],
    queryFn: () =>
      token
        ? taskService.getAllTasks(token, filters)
        : Promise.reject("No auth token"),
    enabled: !!token,
  });
};

// Hook to fetch a single task by ID
export const useTaskDetails = (id: string) => {
  const token = getToken();

  return useQuery({
    queryKey: ["task", id],
    queryFn: () =>
      token
        ? taskService.getTaskById(id, token)
        : Promise.reject("No auth token"),
    enabled: !!token && !!id,
  });
};

// Hook to create a task
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (task: CreateTaskRequest) =>
      token
        ? taskService.createTask(task, token)
        : Promise.reject("No auth token"),
    onSuccess: () => {
      // Invalidate the tasks list query to refresh data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Hook to update a task
export const useUpdateTask = (id: string) => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (task: UpdateTaskRequest) =>
      token
        ? taskService.updateTask(id, task, token)
        : Promise.reject("No auth token"),
    onSuccess: (updatedTask) => {
      // Update the task in the cache
      queryClient.setQueryData(["task", id], updatedTask);
      // Invalidate the tasks list query to refresh list data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

// Hook to delete a task
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const token = getToken();

  return useMutation({
    mutationFn: (id: string) =>
      token
        ? taskService.deleteTask(id, token)
        : Promise.reject("No auth token"),
    onSuccess: (_, id) => {
      // Remove the task from the cache
      queryClient.removeQueries({ queryKey: ["task", id] });
      // Invalidate the tasks list query to refresh data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
