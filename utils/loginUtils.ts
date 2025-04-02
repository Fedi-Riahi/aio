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

    const { user_data } = loginResult.respond.data;

    // No token storage; assume server sets auth cookie
    localStorage.setItem("userData", JSON.stringify(user_data)); // Optional: keep user data
    localStorage.setItem("userTickets", JSON.stringify(user_data.events || [])); // Optional

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