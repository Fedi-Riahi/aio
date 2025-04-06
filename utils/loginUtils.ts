import apiClient from "./apiClient";
import { LoginFormData } from "../types/login";

export const handleLoginRequest = async (
  data: LoginFormData
): Promise<{
  error?: string;
  requiresConfirmation?: boolean;
  clientMessage?: string;
}> => {
  try {
    const loginResponse = await apiClient.post("/user/login", {
      email: data.email,
      password: data.password,
    });

    const loginResult = loginResponse.data;

    if (!loginResult.success) {
      return {
        error: loginResult.error?.details ||
              loginResult.clientMessage ||
              "Email ou mot de passe incorrect",
        clientMessage: loginResult.clientMessage
      };
    }

    const { user_data, tokens } = loginResult.respond.data;

    // Store authentication data
    const authTokens = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };

    localStorage.setItem("authTokens", JSON.stringify(authTokens));
    localStorage.setItem("userData", JSON.stringify(user_data));
    localStorage.setItem("userTickets", JSON.stringify(user_data.events || []));

    return {};
  } catch (error: any) {
    console.error("Login error:", error);

    if (!error.response) {
      return {
        error: "Problème de connexion. Veuillez vérifier votre accès internet.",
        clientMessage: "Network error"
      };
    }

    const status = error.response?.status;
    const errorData = error.response?.data?.respond || error.response?.data;
    const errorDetails = errorData?.error?.details || errorData?.clientMessage;
    const errorCode = errorData?.error?.code;

    // Handle specific cases
    if (status === 401) {
      if (errorCode === 1040 || errorDetails?.toLowerCase().includes("email is not confirmed")) {
        return {
          error: "Veuillez vérifier votre adresse e-mail avant de vous connecter.",
          requiresConfirmation: true,
          clientMessage: "Email not confirmed"
        };
      }
      return {
        error: errorDetails || "Email ou mot de passe incorrect",
        clientMessage: errorDetails
      };
    }

    if (status === 429) {
      return {
        error: "Trop de tentatives de connexion. Veuillez réessayer plus tard.",
        clientMessage: "Too many attempts"
      };
    }

    if (status >= 500) {
      return {
        error: "Problème avec le serveur. Veuillez réessayer plus tard.",
        clientMessage: "Server error"
      };
    }

    return {
      error: error.response?.data?.clientMessage ||
            error.response?.data?.message ||
            "Une erreur est survenue. Veuillez réessayer.",
      clientMessage: error.response?.data?.clientMessage
    };
  }
};
