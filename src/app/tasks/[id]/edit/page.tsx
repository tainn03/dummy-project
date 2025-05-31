"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { TaskStatus, TASK_STATUS_LABELS } from "@/constants/task";
import { useTaskDetails, useUpdateTask } from "@/hooks/useTasks";
import { UpdateTaskRequest } from "@/services/taskService";

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Use React Query hooks for fetching and updating the task
  const {
    data: task,
    isLoading: isFetchLoading,
    error: fetchError,
  } = useTaskDetails(id);
  const updateMutation = useUpdateTask(id);

  // Untyped form to avoid TypeScript complexity
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      deadline: "",
    },
  });

  // Populate form when task data is fetched
  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description || "");
      setValue("status", task.status);
      setValue("deadline", task.deadline ? task.deadline.split("T")[0] : "");
    }
  }, [task, setValue]);

  const onSubmit = (data: {
    title: string;
    description?: string;
    status: string;
    deadline?: string;
  }) => {
    // Convert form data to match UpdateTaskRequest interface
    const updateData: UpdateTaskRequest = {
      title: data.title,
      description: data.description || undefined,
      status: data.status as TaskStatus,
      deadline: data.deadline || undefined,
    };

    updateMutation.mutate(updateData, {
      onSuccess: () => {
        router.push(`/tasks/${id}`);
      },
    });
  };

  if (isFetchLoading && !task) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            {...register("title", { required: "Title is required" })}
            error={errors.title?.message}
          />
          <Textarea
            label="Description"
            {...register("description")}
            error={errors.description?.message}
          />
          <Select
            label="Status"
            {...register("status")}
            options={Object.entries(TASK_STATUS_LABELS).map(
              ([value, label]) => ({ value, label })
            )}
            error={errors.status?.message}
          />
          <Input
            label="Deadline"
            type="date"
            {...register("deadline")}
            error={errors.deadline?.message}
          />
          {fetchError && (
            <div className="text-red-600 text-sm">{fetchError.toString()}</div>
          )}
          {updateMutation.error && (
            <div className="text-red-600 text-sm">
              {updateMutation.error.toString()}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={updateMutation.isPending}
            >
              Update Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/tasks/${id}`)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
