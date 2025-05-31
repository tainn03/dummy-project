"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { TaskStatus, TASK_STATUS_LABELS } from "@/constants/task";
import { useCreateTask } from "@/hooks/useTasks";
import { CreateTaskRequest } from "@/services/taskService";

export default function CreateTaskPage() {
  const router = useRouter();
  const createMutation = useCreateTask();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: TaskStatus.PENDING,
      deadline: "",
    },
  });

  const onSubmit = (data: {
    title: string;
    description?: string;
    status: string;
    deadline?: string;
  }) => {
    // Convert form data to match CreateTaskRequest interface
    const createData: CreateTaskRequest = {
      title: data.title,
      description: data.description,
      status: data.status as TaskStatus,
      deadline: data.deadline,
    };

    createMutation.mutate(createData, {
      onSuccess: () => {
        router.push("/dashboard");
      },
    });
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
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
          {createMutation.error && (
            <div className="text-red-600 text-sm">
              {createMutation.error.toString()}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending}
            >
              Create Task
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
