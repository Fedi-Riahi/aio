import axios from "axios";
import { SignUpFormData, SignUpResponse } from "../types/signUp";
import apiClient from "./apiClient";

export const submitSignUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  // Create FormData object
  const formData = new FormData();

  // Add standard form fields
  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.passwordConfirmation);
  formData.append("username", data.username);
  formData.append("phone_number", data.phone);

  // Handle profile picture
  console.group("Profile Picture Debugging");
  try {
    if (data.profile_picture && data.profile_picture instanceof File) {
      console.log("Profile picture found:", {
        name: data.profile_picture.name,
        size: data.profile_picture.size,
        type: data.profile_picture.type,
        lastModified: new Date(data.profile_picture.lastModified).toISOString(),
      });

      // Validate file before upload
      if (data.profile_picture.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("File size exceeds 5MB limit");
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(data.profile_picture.type)) {
        throw new Error("Only JPEG, PNG, and WebP images are allowed");
      }

      formData.append("profile_picture", data.profile_picture, data.profile_picture.name);
      console.log("Successfully appended file to FormData");
    } else {
      console.log("No profile picture provided - this is optional");
    }
  } catch (error) {
    console.error("Error processing profile picture:", error);
    // Continue with submission without profile picture if it's optional
  }
  console.groupEnd();

  // Debug FormData contents before sending
  console.group("FormData Contents");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}:`, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(`${key}:`, value);
    }
  }
  console.groupEnd();

  try {
    console.log("Submitting signup request...");
    const response = await axios.post("https://api-prod.aio.events/api/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // 30 second timeout
    });

    console.log("Signup successful, response:", {
      status: response.status,
      data: response.data,
    });

    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    console.group("Signup Error");
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data,
        config: error.config,
      });

      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
        ok: false,
        error: {
          details: error.response?.data?.message || error.message,
          code: error.code,
        },
      };
    } else if (error instanceof Error) {
      console.error("Unexpected error:", error);
      return {
        success: false,
        status: 500,
        ok: false,
        error: {
          details: error.message,
        },
      };
    }

    console.error("Unknown error occurred:", error);
    return {
      success: false,
      status: 500,
      ok: false,
      error: {
        details: "An unknown error occurred during signup",
      },
    };
    console.groupEnd();
  }
};

// Rest of the file remains unchanged
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
    console.log(responseData);
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
export const loginUser = async (email: string, password: string): Promise<SignUpResponse> => {
    try {
      const response = await axios.post("https://api-prod.aio.events/api/user/login", {
        email,
        password,
      });

      return {
        ...response.data,
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          ...(error.response?.data || {}),
          status: error.response?.status || 500,
          ok: false,
          error: {
            details: error.response?.data?.message || error.message,
            code: error.code,
          },
        };
      }
      return {
        success: false,
        status: 500,
        ok: false,
        error: {
          details: "An unknown error occurred during login",
        },
      };
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
