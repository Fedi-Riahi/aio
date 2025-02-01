"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have Shadcn's Input component available
import { IconLockOpen, IconUser } from '@tabler/icons-react';


type LoginFormData = {
  email: string;
  password: string;
};

export const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const [error, setError] = React.useState<string>("");

  // Handle form submission
  const handleLogin = async (data: LoginFormData) => {
    setError(""); // Reset error state on submit

    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleLogin)} className="space-y-4 my-8">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Email input with icon */}
      <div className="relative">
        <IconUser className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          className="pl-10 w-full bg-foreground/10"
        />
      </div>
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      {/* Password input with icon */}
      <div className="relative">
        <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
          })}
          className="pl-10 w-full bg-foreground/10"
        />
      </div>
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

      <Button type="submit" className="w-full text-md bg-main text-white rounded-lg hover:bg-main/90">
        Login
      </Button>
    </form>
  );
};
