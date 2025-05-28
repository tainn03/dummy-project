"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  register as registerUser,
  resetAuthError,
} from "@/redux/reducers/authReducer";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    resolver: yupResolver(schema),
  });

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
    return () => {
      dispatch(resetAuthError());
    };
  }, [isAuthenticated, router, dispatch]);

  const onSubmit = (data: RegisterFormInputs) => {
    dispatch(registerUser(data));
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
          {...register("name")}
          error={errors.name?.message}
        />
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
          <div className="text-red-600 text-sm text-center">{error}</div>
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
