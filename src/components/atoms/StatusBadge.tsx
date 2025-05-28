"use client";

import React from "react";
import { TASK_STATUS_LABELS } from "@/constants/task";

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}
    >
      {TASK_STATUS_LABELS[status as keyof typeof TASK_STATUS_LABELS] || status}
    </span>
  );
};

export default StatusBadge;
