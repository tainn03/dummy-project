"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRegister } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { RegisterRequest } from "@/services/authService";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type RegisterFormInputs = RegisterRequest;

export default function RegisterPage() {
  const router = useRouter();
  const {
    mutate: register,
    isPending: loading,
    error,
    isSuccess,
  } = useRegister();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Check if registration was successful and redirect
    if (isSuccess) {
      router.push("/dashboard");
    }
    // Check if token already exists
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [isSuccess, router]);

  const onSubmit = (data: RegisterFormInputs) => {
    register(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-8 rounded shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">
          Register for Task Manager
        </h2>
        <Input
          label="Name"
          type="text"
          {...registerField("name")}
          error={errors.name?.message}
        />
        <Input
          label="Email"
          type="email"
          {...registerField("email")}
          error={errors.email?.message}
        />
        <Input
          label="Password"
          type="password"
          {...registerField("password")}
          error={errors.password?.message}
        />
        {error && (
          <div className="text-red-600 text-sm text-center">
            {error instanceof Error ? error.message : "Registration failed"}
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={loading}
        >
          Register
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
