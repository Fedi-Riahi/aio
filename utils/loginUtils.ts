import apiClient from "./apiClient";
import { LoginFormData } from "../types/login";

export const handleLoginRequest = async (data: LoginFormData): Promise<{ error?: string; requiresConfirmation?: boolean }> => {
  try {
    const loginResponse = await apiClient.post("/user/login", {
      email: data.email,
      password: data.password,
    });

    const loginResult = loginResponse.data;
    console.log("Login response:", loginResult);
    if (!loginResult.success) {
      return { error: loginResult.error?.details || loginResult.clientMessage || "Invalid email or password" };
    }

    const { user_data, tokens } = loginResult.respond.data;

    const authTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };

    localStorage.setItem("authTokens", JSON.stringify(authTokens));
    localStorage.setItem("userData", JSON.stringify(user_data));
    localStorage.setItem("userTickets", JSON.stringify(user_data.events || []));

    return {};
  } catch (error: any) {
    console.log("Login error raw:", error.response?.data);
    if (error.response?.status === 401) {
      const errorData = error.response?.data?.respond || error.response?.data;
      const errorDetails = errorData?.error?.details || errorData?.clientMessage;
      const errorCode = errorData?.error?.code;

      if (errorCode === 1040 || errorDetails?.toLowerCase().includes("email is not confirmed")) {
        return {
          error: "Please verify your email address.",
          requiresConfirmation: true,
        };
      }
      return { error: errorDetails || "Invalid email or password" };
    }
    return { error: error.response?.data?.clientMessage || error.response?.data?.message || "Network error. Please check your connection." };
  }
};
