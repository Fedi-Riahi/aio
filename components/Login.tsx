"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconLockOpen, IconUser, IconMail, IconEyeOff, IconEye } from "@tabler/icons-react";
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
    resendCode,
  } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    await resendCode();
    setIsResending(false);
  };

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
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              className="pl-10 pr-10 w-full bg-foreground/10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-4 h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showPassword ? (
                <IconEyeOff className="h-5 w-5" />
              ) : (
                <IconEye className="h-5 w-5" />
              )}
            </button>
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
            Un nouveau code de confirmation a été envoyé à votre email. Veuillez vérifier votre boîte de réception (et le dossier spam) et entrez-le ci-dessous :
          </p>
          <div className="relative">
            <IconMail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Code de confirmation"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              className="pl-10 w-full bg-foreground/10"
            />
          </div>
          <Button
            onClick={onConfirmCode}
            className="w-full text-md bg-main text-white rounded-lg hover:bg-main/90"
          >
            Vérifier le code
          </Button>
          <Button
            onClick={handleResendCode}
            disabled={isResending}
            className="w-full text-md  text-main rounded-lg hover:text-main/90 disabled:text-gray-400"
          >
            {isResending ? "Envoi en cours..." : "Renvoyer le code"}
          </Button>
        </div>
      )}
    </div>
  );
};
