"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTrash, IconHourglass } from "@tabler/icons-react"; // Added IconHourglass
import { submitOrganizerRequest } from "@/utils/signUpUtils";
import { SignUpResponse } from "@/types/signUp";

type OrganizerFormData = {
  organization_name: string;
  details: string;
  social_medias: { social_link: string; platform: "instagram" | "facebook" | "tiktok" | "youtube" }[];
};

const CompleteOrganizerDetails = () => {
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrganizerFormData>({
    defaultValues: {
      organization_name: "",
      details: "",
      social_medias: [],
    },
  });

  const socialMedias = watch("social_medias") || [];
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = React.useState<string | null>(null);

  // Check if the organizer request is pending on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData.state === "Waiting") {
      setIsPending(true);
    }
  }, []);

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
      setApiError("At least one social media link is required.");
      return;
    }

    const urlPattern = /^(https?:\/\/)([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    const platformPatterns: { [key: string]: RegExp } = {
      instagram: /instagram\.com/,
      facebook: /facebook\.com/,
      tiktok: /tiktok\.com/,
      youtube: /youtube\.com/,
    };

    for (const social of data.social_medias) {
      if (!urlPattern.test(social.social_link)) {
        setApiError("All social media links must be valid URLs starting with http:// or https://.");
        return;
      }
      if (!platformPatterns[social.platform].test(social.social_link)) {
        setApiError(`The URL for ${social.platform} must be a valid ${social.platform} URL (e.g., https://${social.platform}.com/username).`);
        return;
      }
    }

    try {
      const response: SignUpResponse = await submitOrganizerRequest({
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      });

      if (!response.ok) {
        setApiError(response.error?.details || "Failed to submit organizer request.");
        return;
      }

      // Update userData with organizer details and assume state becomes "Waiting"
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = {
        ...userData,
        state: "Waiting", // Set explicitly, though backend might already do this
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));
      setIsPending(true);

      setApiSuccess("Your demand is pending admin approval!");
      setTimeout(() => {
        router.push("/"); // Redirect to homepage
      }, 2000);
    } catch (err) {
      setApiError("Network error. Please check your connection.");
      console.error("Organizer request error:", err);
    }
  });

  // If the request is pending, show the custom message with icon
  if (isPending) {
    return (
      <div className="my-40 w-full max-w-lg mx-auto space-y-6 text-center">
        <IconHourglass
          size={64}
          className="mx-auto text-gradient-to-r from-pink-500 to-blue-500"
        />
        <h2 className="text-3xl font-bold">Demande en cours</h2>
        <p className="text-gray-300 text-lg">
          Actuellement, nous pouvons uniquement accepter les comptes organisateurs via un processus de vérification manuelle. Assurez-vous toutefois de vérifier votre boîte de réception pour toute mise à jour concernant votre demande d’organisateur.
        </p>
        <Button
          onClick={() => router.push("/")}
          className="mt-4 py-3 text-md bg-main text-white rounded-lg hover:bg-main/90"
        >
          Return to Homepage
        </Button>
      </div>
    );
  }

  // Otherwise, show the form
  return (
    <div className="my-40 w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Complete Organizer Details</h2>
      <p className="text-center text-sm text-gray-600">
        Please provide your organizer details to request approval for publishing events.
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
            placeholder="Organization Name"
            {...register("organization_name", {
              required: "Organization name is required",
              minLength: { value: 3, message: "Organization name must be at least 3 characters" },
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
              required: "Description is required",
              minLength: { value: 10, message: "Description must be at least 10 characters" },
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
            Social Media Links
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
                placeholder={`Social URL (e.g., https://${social.platform}.com/username)`}
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
            Add Social Media
          </Button>
        </div>

        <Button
          type="submit"
          className="w-full py-3 text-md bg-main text-white rounded-lg hover:bg-main/90 focus:outline-none"
        >
          Submit Request
        </Button>
      </form>
    </div>
  );
};

export default CompleteOrganizerDetails;
