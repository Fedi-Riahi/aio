"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconTrash } from "@tabler/icons-react";
import { submitOrganizerRequest } from "../utils/signUpUtils";
import { SignUpResponse } from "../types/signUp";

type OrganizerFormData = {
  is_org: boolean;
  organization_name: string;
  details: string;
  social_medias: { social_link: string; platform: "instagram" | "facebook" | "tiktok" | "youtube" }[];
};

export const CompleteOrganizerDetails = () => {
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


    if (data.social_medias.length === 0) {
      setApiError("At least one social media link is required.");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
    const invalidSocialLinks = data.social_medias.filter(
      (social) => !urlPattern.test(social.social_link)
    );
    if (invalidSocialLinks.length > 0) {
      setApiError("All social media links must be valid URLs.");
      return;
    }

    try {
      const response: SignUpResponse = await submitOrganizerRequest({
        is_org: true,
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      });

      if (!response.ok) {
        setApiError(response.error?.details || "Failed to submit organizer request.");
        return;
      }


      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const updatedUserData = {
        ...userData,
        is_org: true,
        organization_name: data.organization_name,
        details: data.details,
        social_medias: data.social_medias,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUserData));

      setApiSuccess("Organizer details submitted successfully!");
      setTimeout(() => {
        router.push("/publish-event");
      }, 1000);
    } catch (err) {
      setApiError("Network error. Please check your connection.");
      console.error("Organizer request error:", err);
    }
  });

  return (
    <div className="my-8 w-full max-w-lg mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center">Complete Organizer Details</h2>
      <p className="text-center text-sm text-gray-600">
        Please provide your organizer details to publish an event.
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
                placeholder="Social Media URL (e.g., https://instagram.com/username)"
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
          Submit Organizer Details
        </Button>
      </form>
    </div>
  );
};
