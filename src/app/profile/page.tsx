"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { changePassword } from "@/redux/reducers/authReducer";
import AuthGuard from "@/components/molecules/AuthGuard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(6, "New password must be at least 6 characters")
    .required("New password is required"),
});

type PasswordFormInputs = {
  currentPassword: string;
  newPassword: string;
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { token, user, loading, error } = useAppSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: PasswordFormInputs) => {
    if (token) {
      await dispatch(changePassword({ ...data, token }));
      reset();
    }
  };

  return (
    <AuthGuard>
      <div className="max-w-xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="mb-4">
          <div className="font-medium">Name: {user?.name}</div>
          <div className="font-medium">Email: {user?.email}</div>
        </div>
        <h2 className="text-lg font-semibold mb-2">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <Input
            label="New Password"
            type="password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" variant="primary" isLoading={loading}>
            Change Password
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
