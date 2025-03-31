import axios from "axios";
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
    const response = await axios.post("https://api-prod.aio.events/api/user/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
        ok: false,
        error: {
          details: error.response?.data?.message || error.message,
        },
      };
    }
    return {
      success: false,
      status: 500,
      ok: false,
      error: {
        details: "An unknown error occurred during signup",
      },
    };
  }
};

export const submitConfirmation = async (email: string, code: string): Promise<SignUpResponse> => {
  try {
    const response = await axios.post("https://api-prod.aio.events/api/user/mailconfopensession", {
      email,
      code,
    });
    return {
      ...response.data,
      status: response.status,
      ok: response.status >= 200 && response.status < 300,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        ...(error.response?.data || {}),
        status: error.response?.status || 500,
        ok: false,
        error: {
          details: error.response?.data?.message || error.message,
        },
      };
    }
    return {
      success: false,
      status: 500,
      ok: false,
      error: {
        details: "Failed to confirm email",
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

 

      // Extract tokens from the nested respond.data.tokens structure
      const tokens = response.data.respond?.data?.tokens || {};
      const accessToken = tokens.access_token;
      const refreshToken = tokens.refresh_token;


      return {
        ...response.data,
        status: response.status,
        ok: response.status >= 200 && response.status < 300,
        access_token: accessToken,
        refresh_token: refreshToken,
        user_data: response.data.respond?.data?.user_data, // Optional: if user data is included
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
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
      console.log("Unknown login error:", error);
      return {
        success: false,
        status: 500,
        ok: false,
        error: { details: "An unknown error occurred during login" },
      };
    }
  };
export const handleApiError = (response: SignUpResponse): string => {
  if (!response.ok) {
    return response.error?.details ||
      response.error?.message ||
      "An error occurred. Please try again.";
  }
  return "";
};
