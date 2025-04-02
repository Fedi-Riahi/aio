"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLockOpen, IconUser, IconMail } from "@tabler/icons-react";
import { useLogin } from "@/hooks/useLogin";

export const Login = () => {
  const {
    register,
    errors,
    error,
    onLogin,
    isConfirming,
    confirmationCode,
    setConfirmationCode,
    onConfirmCode,
  } = useLogin();

  return (
    <div className="space-y-4 my-8">
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!isConfirming ? (
        <form onSubmit={onLogin} className="space-y-4">
          <div className="relative">
            <IconUser className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Adresse email invalide",
                },
              })}
              className="pl-10 w-full bg-foreground/10"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="relative">
            <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              className="pl-10 w-full bg-foreground/10"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            className="w-full text-md bg-main text-white rounded-lg hover:bg-main/90"
          >
            Connexion
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            A new confirmation code has been sent to your email. Please check your inbox (and spam folder) and enter it below:
          </p>
          <div className="relative">
            <IconMail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="pl-10 w-full bg-foreground/10"
            />
          </div>
          <Button
            onClick={onConfirmCode}
            className="w-full text-md bg-main text-white rounded-lg hover:bg-main/90"
          >
            Verify Code
          </Button>
        </div>
      )}
    </div>
  );
};
