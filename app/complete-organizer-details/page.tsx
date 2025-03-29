"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { submitOrganizerRequest } from "@/utils/signUpUtils";
import { SignUpResponse } from "@/types/signUp";

type OrganizerFormData = {
  is_org: boolean;
  organization_name: string;
  details: string;
  social_medias: { social_link: string; platform: "instagram" | "facebook" | "tiktok" | "youtube" }[];
};

const CompleteOrganizerDetails = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrganizerFormData>({
    defaultValues: {
      is_org: true,
      organization_name: "",
      details: "",
      social_medias: [],
    },
  });

  const socialMedias = watch("social_medias") || [];
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = React.useState<string | null>(null);

  const addSocialMedia = () => {
    const newSocialMedias = [...socialMedias, { social_link: "", platform: "instagram" as const }];
    setValue("social_medias", newSocialMedias);
  };

  const updateSocialMedia = (index: number, field: "social_link" | "platform", value: string) => {
    const newSocialMedias = [...socialMedias];
    newSocialMedias[index] = { ...newSocialMedias[index], [field]: value };
    setValue("social_medias", newSocialMedias);
  };

  const removeSocialMedia = (index: number) => {
    const newSocialMedias = socialMedias.filter((_, i) => i !== index);
    setValue("social_medias", newSocialMedias);
  };

  const onSubmit = handleSubmit(async (data: OrganizerFormData) => {
    setApiError(null);
    setApiSuccess(null);

    // Validate social_medias
    if (data.social_medias.length === 0) {
      setApiError("Au moins un lien vers un réseau social est requis.");
      return;
    }

    // Validate social_link URLs and ensure they match the platform
    const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    const platformPatterns: { [key: string]: RegExp } = {
      instagram: /instagram\.com/,
      facebook: /facebook\.com/,
      tiktok: /tiktok\.com/,
      youtube: /youtube\.com/,
    };

    for (const social of data.social_medias) {
      if (!urlPattern.test(social.social_link)) {
        setApiError("Tous les liens vers les réseaux sociaux doivent être des URL valides commençant par http:// ou https://.");
        return;
      }
      if (!platformPatterns[social.platform].test(social.social_link)) {
        setApiError(`L'URL pour ${social.platform} doit être une URL ${social.platform} valide (par exemple, https://${social.platform}.com/nomdutilisateur).`);
        return;
      }
    }

    try {
      const response: SignUpResponse = await submitOrganizerRequest({
        is_org: true,
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      });

      if (!response.ok) {
        setApiError(response.error?.details || "Échec de la soumission de la demande d'organisateur.");
        return;
      }

      // Update userData in localStorage with the new organizer details
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = {
        ...userData,
        is_org: true,
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setApiSuccess("Détails de l'organisateur soumis avec succès !");
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
      }, 1000);
    } catch (err) {
      setApiError("Erreur réseau. Veuillez vérifier votre connexion.");
      console.error("Erreur de demande d'organisateur :", err);
    }
  });

  return (
    <div className="my-40    w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Compléter les détails de l&apos;organisateur</h2>
      <p className="text-center text-sm text-gray-600">
        Veuillez fournir vos détails d&apos;organisateur pour publier un événement.
      </p>

      <form onSubmit={onSubmit} className="space-y-4">
        {apiSuccess && (
          <p className="text-green-500 text-sm text-center">{apiSuccess}</p>
        )}
        {apiError && (
          <p className="text-red-500 text-sm text-center">{apiError}</p>
        )}

        <div className="relative">
          <Input
            type="text"
            placeholder="Nom de l'organisation"
            {...register("organization_name", {
              required: "Le nom de l'organisation est requis",
              minLength: { value: 3, message: "Le nom de l'organisation doit contenir au moins 3 caractères" },
            })}
            className="bg-foreground/10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          {errors.organization_name && (
            <p className="text-red-500 text-sm mt-1">{errors.organization_name.message}</p>
          )}
        </div>

        <div className="relative">
          <textarea
            placeholder="Description"
            {...register("details", {
              required: "La description est requise",
              minLength: { value: 10, message: "La description doit contenir au moins 10 caractères" },
            })}
            className="bg-foreground/10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-2"
            rows={4}
          />
          {errors.details && (
            <p className="text-red-500 text-sm mt-1">{errors.details.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Liens vers les réseaux sociaux
          </label>
          {socialMedias.map((social, index) => (
            <div key={index} className="flex space-x-2 items-center">
              <select
                value={social.platform}
                onChange={(e) => updateSocialMedia(index, "platform", e.target.value)}
                className="bg-foreground/10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 w-1/3"
              >
                <option value="instagram">Instagram</option>
                <option value="facebook">Facebook</option>
                <option value="tiktok">TikTok</option>
                <option value="youtube">YouTube</option>
              </select>
              <Input
                type="url"
                placeholder={`URL du réseau social (ex: https://${social.platform}.com/nomdutilisateur)`}
                value={social.social_link}
                onChange={(e) => updateSocialMedia(index, "social_link", e.target.value)}
                className="bg-foreground/10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={() => removeSocialMedia(index)}
                className="text-red-500 hover:text-red-700"
              >
                <IconTrash className="h-5 w-5" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={addSocialMedia}
            className="text-blue-500 hover:text-blue-700"
          >
            Ajouter un réseau social
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
        >
          Soumettre les détails
        </Button>
      </form>
    </div>
  );
};

export default CompleteOrganizerDetails;
