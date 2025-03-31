import apiClient from "./apiClient"; // Assuming apiClient is in the same directory
import { SignUpFormData, SignUpResponse } from "../types/signUp";

export const submitSignUp = async (data: SignUpFormData): Promise<SignUpResponse> => {
  const formData = new FormData();

  formData.append("email", data.email);
  formData.append("password", data.password);
  formData.append("password_confirmation", data.passwordConfirmation);
  formData.append("username", data.username);
  formData.append("phone_number", data.phone);

  if (data.profile_picture && data.profile_picture instanceof File) {
    formData.append("profile_picture", data.profile_picture, data.profile_picture.name);
  }

  try {
    const response = await apiClient.post("/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error: any) {
    return {
      ...(error.response?.data || {}),
      status: error.response?.status || 500,
      ok: false,
      error: {
        details: error.response?.data?.message || error.message,
      },
    };
  }
};

export const submitConfirmation = async (email: string, code: string): Promise<SignUpResponse> => {
  try {
    const response = await apiClient.post("/user/mailconfopensession", {
      email,
      code,
    });
    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error: any) {
    return {
      ...(error.response?.data || {}),
      status: error.response?.status || 500,
      ok: false,
      error: {
        details: error.response?.data?.message || error.message,
      },
    };
  }
};

export const submitOrganizerRequest = async (data: {
  details: string;
  organization_name: string;
  social_medias: { social_link: string; platform: string }[];
}): Promise<SignUpResponse> => {
  const body = {
    details: data.details,
    organization_name: data.organization_name,
    social_medias: data.social_medias,
  };

  console.log("Submitting organizer request with payload:", JSON.stringify(body, null, 2));

  try {
    const response = await apiClient.post("/normalaccount/reqTobeOrg", body);
    const responseData: SignUpResponse = response.data;
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error: any) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      console.error("Organizer request error response:", JSON.stringify(responseData, null, 2));
      return { ...responseData, status: error.response.status, ok: false };
    }
    console.error("Organizer request error:", error.message);
    throw new Error("Failed to submit organizer request: Network error or invalid response");
  }
};

export const fetchOrganizerProfile = async (id: string): Promise<SignUpResponse> => {
  try {
    const response = await apiClient.get(`/normalaccount/getorgprofilebyid/${id}`);
    const responseData: SignUpResponse = response.data;
    console.log(responseData);
    return { ...responseData, status: response.status, ok: response.status >= 200 && response.status < 300 };
  } catch (error: any) {
    if (error.response) {
      const responseData: SignUpResponse = error.response.data;
      console.error("Fetch organizer profile error response:", JSON.stringify(responseData, null, 2));
      return { ...responseData, status: error.response.status, ok: false };
    }
    console.error("Fetch organizer profile error:", error.message);
    throw new Error("Failed to fetch organizer profile: Network error or invalid response");
  }
};

export const loginUser = async (email: string, password: string): Promise<SignUpResponse> => {
  try {
    const response = await apiClient.post("/user/login", {
      email,
      password,
    });

    const tokens = response.data.respond?.data?.tokens || {};
    const accessToken = tokens.access_token;
    const refreshToken = tokens.refresh_token;

    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
      access_token: accessToken,
      refresh_token: refreshToken,
      user_data: response.data.respond?.data?.user_data,
    };
  } catch (error: any) {
    console.log("Login error response:", error.response?.data);
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
};

export const handleApiError = (response: SignUpResponse): string => {
  if (!response.ok) {
    return response.error?.details || response.error?.message || "An error occurred. Please try again.";
  }
  return "";
};
