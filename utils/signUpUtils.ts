import axios from "axios";
import { SignUpFormData, SignUpResponse } from "../types/signUp";
import apiClient from "./apiClient";

export const submitSignUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  const formData = new FormData();
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.passwordConfirmation);
  formData.append("username", data.username);
  formData.append("phone_number", data.phone);

  if (data.profile_picture) {
    if (data.profile_picture instanceof FileList && data.profile_picture.length > 0) {
      console.log("Profile picture is a FileList, extracting first file");
      formData.append("profile_picture", data.profile_picture[0]);
    } else if (data.profile_picture instanceof File) {
      console.log("Profile picture is a File, appending directly");
      formData.append("profile_picture", data.profile_picture);
    } else {
      console.log("Profile picture is not a File or FileList, skipping");
    }
  } else {
    console.log("No profile picture provided");
  }

  for (const [key, value] of formData.entries()) {
    console.log(`FormData ${key}:`, value);
  }

  try {
    const response = await axios.post("https://api-prod.aio.events/api/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const responseData: SignUpResponse = response.data;
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      console.error("Sign-up error response:", JSON.stringify(responseData, null, 2));
      console.error("Sign-up error status:", error.response.status);
      console.error("Sign-up error headers:", error.response.headers);
      return { ...responseData, status: error.response.status, ok: false };
    }
    console.error("Sign-up error:", error.message);
    throw new Error("Failed to sign up: Network error or invalid response");
  }
};

export const submitConfirmation = async (email: string, code: string): Promise<SignUpResponse> => {
  const body = { email, code };

  try {
    const response = await apiClient.post("/user/mailconfopensession", body);
    const responseData: SignUpResponse = response.data;
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      return { ...responseData, status: error.response.status, ok: false };
    }
    throw new Error("Failed to confirm email: Network error or invalid response");
  }
};

export const submitOrganizerRequest = async (data: {
  is_org: boolean;
  details: string;
  organization_name: string;
  social_medias: { social_link: string; platform: string }[];
}): Promise<SignUpResponse> => {
  const body = {
    is_org: data.is_org,
    details: data.details,
    organization_name: data.organization_name,
    social_medias: data.social_medias,
  };

  console.log("Submitting organizer request with payload:", JSON.stringify(body, null, 2));

  const tokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
  const accessToken = tokens.access_token;

  if (!accessToken) {
    console.error("No access token found in localStorage");
    return { success: false, status: 401, ok: false, error: { details: "No access token available. Please log in again." } };
  }

  try {
    const response = await axios.post("https://api-prod.aio.events/api/normalaccount/reqTobeOrg", body, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    const responseData: SignUpResponse = response.data;
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      console.error("Organizer request error response:", JSON.stringify(responseData, null, 2));
      console.error("Organizer request error status:", error.response.status);
      console.error("Organizer request error headers:", error.response.headers);
      return { ...responseData, status: error.response.status, ok: false };
    }
    console.error("Organizer request error:", error.message);
    throw new Error("Failed to submit organizer request: Network error or invalid response");
  }
};

export const fetchOrganizerProfile = async (id: string): Promise<SignUpResponse> => {
  const tokens = JSON.parse(localStorage.getItem("authTokens") || "{}");
  const accessToken = tokens.access_token;

  if (!accessToken) {
    console.error("No access token found in localStorage");
    return { success: false, status: 401, ok: false, error: { details: "No access token available. Please log in again." } };
  }

  try {
    const response = await axios.get(`https://api-prod.aio.events/api/normalaccount/getorgprofilebyid/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });
    const responseData: SignUpResponse = response.data;
    console.log(responseData)
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      console.error("Fetch organizer profile error response:", JSON.stringify(responseData, null, 2));
      console.error("Fetch organizer profile error status:", error.response.status);
      console.error("Fetch organizer profile error headers:", error.response.headers);
      return { ...responseData, status: error.response.status, ok: false };
    }
    console.error("Fetch organizer profile error:", error.message);
    throw new Error("Failed to fetch organizer profile: Network error or invalid response");
  }
};

export const handleApiError = (response: SignUpResponse): string => {
  if (!response.ok) {
    if (response.error?.details) {
      return response.error.details;
    } else {
      switch (response.status) {
        case 400:
          return "Invalid request. Please check your input and try again.";
        case 401:
          return "Unauthorized. Please log in and try again.";
        case 422:
          return "Invalid data provided.";
        case 500:
          return "Server error. Please try again later.";
        default:
          return "An unexpected error occurred.";
      }
    }
  }
  return "";
};
