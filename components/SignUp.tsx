"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLockOpen, IconUser, IconMail, IconPhone, IconCamera } from "@tabler/icons-react";
import { useSignUp } from "../hooks/useSignUp";
import Link from "next/link";

export const SignUp = () => {
  const {
    step,
    register,
    errors,
    password,
    handleSubmit,
    onStep1Submit,
    onStep2Submit,
    registerConfirmation,
    confirmationErrors,
    onConfirmation,
    apiError,
    apiSuccess,
    showConfirmationForm,
    setValue,
    watch,
    methods,
  } = useSignUp();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showAcceptanceError, setShowAcceptanceError] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Watch form values
  const profilePicture = watch("profile_picture");
  console.log("Current profile picture state:", profilePicture);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    console.log("Selected file:", file);
    setSelectedFile(file);
    setValue("profile_picture", file);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms || !acceptedPrivacy) {
      setShowAcceptanceError(true);
      return;
    }
    setShowAcceptanceError(false);
    methods.handleSubmit(onStep1Submit)();
  };

  return (
    <div className="my-8 w-full max-w-lg mx-auto space-y-4">
      {showConfirmationForm ? (
        <form onSubmit={onConfirmation} className="space-y-4">
          {apiSuccess && (
            <p className="text-green-500 text-sm text-center">{apiSuccess}</p>
          )}
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <div className="relative">
            <Input
              type="text"
              placeholder="Entrez le code de confirmation"
              {...registerConfirmation("code", {
                required: "Le code de confirmation est requis",
                minLength: { value: 6, message: "Le code doit contenir au moins 6 caractères" },
              })}
              className="bg-foreground/10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {confirmationErrors.code && (
              <p className="text-red-500 text-sm mt-1">{confirmationErrors.code.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
          >
            Confirmer l&apos;email
          </Button>
        </form>
      ) : step === 1 ? (
        <form onSubmit={handleStep1Submit} className="space-y-4">
          {apiSuccess && (
            <p className="text-green-500 text-sm text-center">{apiSuccess}</p>
          )}
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <div className="relative">
            <IconUser className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Nom d'utilisateur"
              {...register("username", {
                required: "Le nom d'utilisateur est requis",
                minLength: { value: 3, message: "Le nom d'utilisateur doit contenir au moins 3 caractères" },
              })}
              className="pl-10 bg-foreground/10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                required: "L'email est requis",
                pattern: {
                  value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Adresse email invalide",
                },
              })}
              className="bg-foreground/10 w-full pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="relative">
            <IconPhone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="tel"
              placeholder="Téléphone"
              {...register("phone", {
                required: "Le numéro de téléphone est requis",
                pattern: {
                  value: /^[0-9]{8,15}$/,
                  message: "Numéro de téléphone invalide (8-15 chiffres)",
                },
              })}
              className="bg-foreground/10 w-full pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          <div className="relative">
            <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Mot de passe"
              {...register("password", {
                required: "Le mot de passe est requis",
                minLength: {
                  value: 8,
                  message: "Le mot de passe doit contenir au moins 8 caractères",
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: "Le mot de passe doit contenir des lettres, chiffres et caractères spéciaux",
                },
              })}
              className="bg-foreground/10 w-full pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <IconLockOpen className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="password"
              placeholder="Confirmez le mot de passe"
              {...register("passwordConfirmation", {
                required: "La confirmation du mot de passe est requise",
                validate: (value) => value === password || "Les mots de passe ne correspondent pas",
              })}
              className="bg-foreground/10 w-full pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {errors.passwordConfirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation.message}</p>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked)}
                className="h-5 w-5 mt-0.5 rounded border-gray-300 text-main focus:ring-main"
              />
              <label htmlFor="terms" className="text-sm text-gray-600 leading-tight">
                J&apos;accepte les{' '}
                <Link href="/legal#terms" className="text-main hover:underline">
                  Conditions d&apos;utilisation
                </Link>
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="privacy"
                checked={acceptedPrivacy}
                onCheckedChange={(checked) => setAcceptedPrivacy(checked)}
                className="h-5 w-5 mt-0.5 rounded border-gray-300 text-main focus:ring-main"
              />
              <label htmlFor="privacy" className="text-sm text-gray-600 leading-tight">
                J&apos;accepte la{' '}
                <Link href="/legal#privacy" className="text-main hover:underline">
                  Politique de confidentialité
                </Link>
              </label>
            </div>

            {showAcceptanceError && (
              <p className="text-red-500 text-sm">
                Vous devez accepter les conditions et la politique de confidentialité pour continuer
              </p>
            )}
          </div>

          <Button
            type="submit"
            className={`w-full py-3 text-md rounded-lg focus:outline-none mt-4 ${
              acceptedTerms && acceptedPrivacy
                ? "bg-main text-white hover:bg-main/90"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!acceptedTerms || !acceptedPrivacy}
          >
            Suivant
          </Button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={handleSubmit(onStep2Submit)} className="space-y-4">
          {apiSuccess && (
            <p className="text-green-500 text-sm text-center">{apiSuccess}</p>
          )}
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <div className="relative">
            <IconCamera className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <div className="relative">
              <input
                type="file"
                id="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="bg-foreground/10 w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 flex items-center">
                <span className="text-gray-500 truncate">
                  {selectedFile?.name || "Sélectionnez une image de profil"}
                </span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
          >
            S&apos;inscrire {selectedFile ? "" : "(Passer si aucune image)"}
          </Button>
        </form>
      ) : null}
    </div>
  );
};

export default SignUp;
