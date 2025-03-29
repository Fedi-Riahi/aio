
import apiClient from "./apiClient";
import { LoginFormData } from "../types/login";

export const handleLoginRequest = async (data: LoginFormData): Promise<{ error?: string }> => {
  try {
    const loginResponse = await apiClient.post("/user/login", {
      email: data.email,
      password: data.password,
    });

    const loginResult = loginResponse.data;


    if (!loginResult.success) {
      return { error: loginResult.error?.message || "Invalid email or password" };
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
    return { error: error.response?.data?.message || "Network error. Please check your connection." };
  }
};
