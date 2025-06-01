"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/atoms/StatusBadge";
import { TaskStatus, TASK_STATUS_LABELS } from "@/constants/task";
import { useTaskList } from "@/hooks/useTasks";
import { TaskFilterParams, Task } from "@/services/taskService";

export default function DashboardPage() {
  const router = useRouter();

  // Local state for filters - replacing Redux state
  const [filters, setFilters] = useState<TaskFilterParams>({
    sortBy: "createdAt",
    sortDir: "desc",
  });

  // Use the React Query hook for fetching tasks with filters
  const { data: tasks, isLoading } = useTaskList(filters);

  // Handler for updating filter state
  const updateFilter = (newFilterValues: Partial<TaskFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilterValues }));
  };

  return (
    <AuthGuard>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button
            variant="primary"
            onClick={() => router.push("/tasks/create")}
          >
            + New Task
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            className="border rounded px-3 py-2"
            value={filters.status || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Only set valid TaskStatus values or undefined
              updateFilter({
                status: value ? (value as TaskStatus) : undefined,
              });
            }}
          >
            <option value="">All Statuses</option>
            {Object.entries(TASK_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={filters.sortBy || "createdAt"}
            onChange={(e) =>
              updateFilter({
                sortBy: e.target.value as "createdAt" | "deadline",
              })
            }
          >
            <option value="createdAt">Sort by Created</option>
            <option value="deadline">Sort by Deadline</option>
          </select>
          <select
            className="border rounded px-3 py-2"
            value={filters.sortDir || "desc"}
            onChange={(e) =>
              updateFilter({ sortDir: e.target.value as "asc" | "desc" })
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Deadline</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : !tasks || tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    No tasks found.
                  </td>
                </tr>
              ) : (
                tasks?.map((task: Task) => (
                  <tr key={task.id} className="border-t">
                    <td
                      className="px-4 py-2 cursor-pointer hover:underline"
                      onClick={() => router.push(`/tasks/${task.id}`)}
                    >
                      {task.title}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-4 py-2">
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2">
                      <Button
                        size="small"
                        variant="outline"
                        onClick={() => router.push(`/tasks/${task.id}`)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="secondary"
                        className="ml-2"
                        onClick={() => router.push(`/tasks/${task.id}/edit`)}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
