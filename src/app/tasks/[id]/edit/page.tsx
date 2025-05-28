"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchTask, updateTask } from "@/redux/reducers/taskReducer";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import { TASK_STATUS, TASK_STATUS_LABELS } from "@/constants/task";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().oneOf(Object.values(TASK_STATUS)),
  deadline: yup.string().nullable(),
});

type TaskFormInputs = {
  title: string;
  description?: string;
  status?: string;
  deadline?: string;
};

export default function EditTaskPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { token } = useAppSelector((state) => state.auth);
  const { currentTask, loading, error } = useAppSelector((state) => state.task);
  const id = params?.id as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token && id) {
      dispatch(fetchTask({ id, token }));
    }
  }, [dispatch, token, id]);

  useEffect(() => {
    if (currentTask) {
      setValue("title", currentTask.title);
      setValue("description", currentTask.description || "");
      setValue("status", currentTask.status);
      setValue(
        "deadline",
        currentTask.deadline ? currentTask.deadline.split("T")[0] : ""
      );
    }
  }, [currentTask, setValue]);

  const onSubmit = async (data: TaskFormInputs) => {
    if (token && id) {
      await dispatch(updateTask({ id, task: data, token }));
      router.push(`/tasks/${id}`);
    }
  };

  if (loading && !currentTask) {
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
            {...register("title")}
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
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" variant="primary" isLoading={loading}>
            Update Task
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
