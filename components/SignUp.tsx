"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { DatePickerDemo } from "./DatePickerDemo";
import { IconLockOpen, IconUser, IconMail, IconBuildingEstate, IconPhone } from '@tabler/icons-react';
import { CheckboxDemo } from "./Checkbox";

type SignUpFormData = {
  username: string;
  email: string;
  phone: string;
  birthday: string;
  state: string;
  password: string;
  passwordConfirmation: string;
};

export const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignUpFormData>();

  const handleSignUp = async (data: SignUpFormData) => {
    console.log(data); 
  };

  const password = watch("password");

  return (
    <form
      onSubmit={handleSubmit(handleSignUp)}
      className=" my-8 w-full max-w-lg mx-auto space-y-4"
    >

      <div className="relative">
        <IconUser className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
          })}
          className="pl-10 bg-foreground/10 w-full  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.username && (
          <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
        )}
      </div>


      <div className="relative">
        <IconMail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
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
          className="bg-foreground/10 w-full pl-10  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

 
      <div className="relative">
      <IconPhone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="tel"
          placeholder="Phone"
          {...register("phone", {
            required: "Phone is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number",
            },
          })}
          className="bg-foreground/10 w-full pl-10  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

  
      <div>
        <DatePickerDemo />
        {errors.birthday && (
          <p className="text-red-500 text-sm mt-1">{errors.birthday.message}</p>
        )}
      </div>


      <div className="relative">
        <IconBuildingEstate className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="State"
          {...register("state", {
            required: "State is required",
          })}
          className="bg-foreground/10 w-full pl-10  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.state && (
          <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
        )}
      </div>


      <div className="relative">
        <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          })}
          className="bg-foreground/10 w-full pl-10  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

 
      <div className="relative">
        <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
        <Input
          type="password"
          placeholder="Confirm Password"
          {...register("passwordConfirmation", {
            required: "Password confirmation is required",
            validate: (value) => value === password || "Passwords do not match",
          })}
          className="bg-foreground/10 w-full pl-10  rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
        {errors.passwordConfirmation && (
          <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation.message}</p>
        )}
      </div>
            <CheckboxDemo />

  
      <Button type="submit" className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none">
        Sign Up
      </Button>

    </form>
  );
};
