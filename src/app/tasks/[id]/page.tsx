"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/atoms/StatusBadge";
import { useTaskDetails, useDeleteTask } from "@/hooks/useTasks";

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Use React Query hooks for fetching and deleting tasks
  const { data: task, isLoading } = useTaskDetails(id);
  const deleteMutation = useDeleteTask();

  const handleDelete = async () => {
    if (id && confirm("Are you sure you want to delete this task?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          router.push("/dashboard");
        },
      });
    }
  };

  if (isLoading || !task) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
        <div className="mb-2">
          <StatusBadge status={task.status} />
        </div>
        <div className="mb-2 text-gray-600">
          Deadline:{" "}
          {task.deadline ? new Date(task.deadline).toLocaleDateString() : "-"}
        </div>
        <div className="mb-4">
          {task.description || (
            <span className="text-gray-400">No description</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/tasks/${task.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
