"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { useLogin } from "@/hooks/useAuth";
import { LoginRequest } from "@/services/authService";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

type LoginFormInputs = LoginRequest;

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending: loading, error, isSuccess } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Check if the login was successful and redirect
    if (isSuccess) {
      router.push("/dashboard");
    }
    // Check if token already exists
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [isSuccess, router]);

  const onSubmit = (data: LoginFormInputs) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Sign in to Task Manager
        </h2>
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />
        {error && (
          <div className="text-red-600 text-sm text-center">
            {error instanceof Error ? error.message : "Login failed"}
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={loading}
        >
          Login
        </Button>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
