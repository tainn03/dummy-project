"use client";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { fetchTask, deleteTask } from "@/redux/reducers/taskReducer";
import { useRouter, useParams } from "next/navigation";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/atoms/StatusBadge";

export default function TaskDetailPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const { token } = useAppSelector((state) => state.auth);
  const { currentTask, loading } = useAppSelector((state) => state.task);
  const id = params?.id as string;

  useEffect(() => {
    if (token && id) {
      dispatch(fetchTask({ id, token }));
    }
  }, [dispatch, token, id]);

  const handleDelete = async () => {
    if (token && id && confirm("Are you sure you want to delete this task?")) {
      await dispatch(deleteTask({ id, token }));
      router.push("/dashboard");
    }
  };

  if (loading || !currentTask) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">{currentTask.title}</h1>
        <div className="mb-2">
          <StatusBadge status={currentTask.status} />
        </div>
        <div className="mb-2 text-gray-600">
          Deadline:{" "}
          {currentTask.deadline
            ? new Date(currentTask.deadline).toLocaleDateString()
            : "-"}
        </div>
        <div className="mb-4">
          {currentTask.description || (
            <span className="text-gray-400">No description</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => router.push(`/tasks/${currentTask.id}/edit`)}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Back
          </Button>
        </div>
      </div>
    </AuthGuard>
  );
}
