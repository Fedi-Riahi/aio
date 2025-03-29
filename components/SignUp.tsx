"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { IconLockOpen, IconUser, IconMail, IconPhone, IconCamera } from "@tabler/icons-react";
import { useSignUp } from "../hooks/useSignUp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import the raw file content (you may need to adjust the paths)
import privacyPolicyContent from "@/lib/privacyPolicy.txt";
import termsAndConditionsContent from "@/lib/terms&conds.txt";

export const SignUp = () => {
  const {
    step,
    register,
    errors,
    password,
    onStep1Submit,
    onStep2Submit,
    registerConfirmation,
    confirmationErrors,
    onConfirmation,
    apiError,
    apiSuccess,
    showConfirmationForm,
    setValue,
  } = useSignUp();

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [dialogTitle, setDialogTitle] = useState("");

  const handleOpenTerms = () => {
    setDialogContent(termsAndConditionsContent);
    setDialogTitle("Termes et conditions");
    setOpenDialog(true);
  };

  const handleOpenPrivacy = () => {
    setDialogContent(privacyPolicyContent);
    setDialogTitle("Politique de confidentialité");
    setOpenDialog(true);
  };

  return (
    <div className="my-8 w-full max-w-lg mx-auto space-y-4">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-h-[80vh] overflow-y-auto max-w-4xl">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
          <div className="prose dark:prose-invert">
            <pre className="whitespace-pre-wrap font-sans text-sm">{dialogContent}</pre>
          </div>
        </DialogContent>
      </Dialog>

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
        <form onSubmit={onStep1Submit} className="space-y-4">
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

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(!!checked)}
              />
              <label htmlFor="terms" className="text-sm font-medium leading-none">
                J&apos;accepte les{" "}
                <button
                  type="button"
                  onClick={handleOpenTerms}
                  className="text-main hover:underline"
                >
                  termes et conditions
                </button>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="privacy"
                checked={acceptPrivacy}
                onCheckedChange={(checked) => setAcceptPrivacy(!!checked)}
              />
              <label htmlFor="privacy" className="text-sm font-medium leading-none">
                J&apos;accepte la{" "}
                <button
                  type="button"
                  onClick={handleOpenPrivacy}
                  className="text-main hover:underline"
                >
                  politique de confidentialité
                </button>
              </label>
            </div>
            {(!acceptTerms || !acceptPrivacy) && (
              <p className="text-red-500 text-sm">
                Vous devez accepter les termes et conditions et la politique de confidentialité pour continuer.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
            disabled={!acceptTerms || !acceptPrivacy}
          >
            Suivant
          </Button>
        </form>
      ) : step === 2 ? (
        <form onSubmit={onStep2Submit} className="space-y-4">
          {apiSuccess && (
            <p className="text-green-500 text-sm text-center">{apiSuccess}</p>
          )}
          {apiError && (
            <p className="text-red-500 text-sm text-center">{apiError}</p>
          )}

          <div className="relative">
            <IconCamera className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
            <Input
              type="file"
              accept="image/*"
              {...register("profile_picture")}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setValue("profile_picture", file);
                } else {
                  setValue("profile_picture", undefined);
                }
              }}
              className="bg-foreground/10 w-full pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
          >
            S&apos;inscrire (Passer si aucune image)
          </Button>
        </form>
      ) : null}
    </div>
  );
};
