import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormData, SignUpResponse } from "../types/signUp";
import { submitSignUp, submitConfirmation, handleApiError, loginUser } from "../utils/signUpUtils";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useSignUp = () => {
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const router = useRouter();
  const { refreshUserData } = useAuth();

  const methods = useForm<SignUpFormData>({
    defaultValues: {
      username: "",
      email: "",
      phone: "",
      password: "",
      passwordConfirmation: "",
      profile_picture: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    control,
  } = methods;

  const {
    register: registerConfirmation,
    handleSubmit: handleConfirmationSubmit,
    formState: { errors: confirmationErrors },
  } = useForm<{ code: string }>();

  const password = watch("password");

  const onStep1Submit = async (data: SignUpFormData) => {
    setApiError("");
    setApiSuccess("");

    try {
      if (!data.username || !data.email || !data.phone || !data.password) {
        throw new Error("Please fill all required fields");
      }
      setStep(2);
    } catch (error) {
      setApiError(error.message);
    }
  };

  const onStep2Submit = async (data: SignUpFormData) => {
    setApiError("");
    setApiSuccess("");

    try {
      const response: SignUpResponse = await submitSignUp(data);
      if (response.ok) {
        setApiSuccess("Registration successful! Please check your email to confirm.");
        setShowConfirmationForm(true);
      } else {
        setApiError(handleApiError(response));
      }
    } catch (error) {
      setApiError("An error occurred during registration. Please try again.");
    }
  };

  const onConfirmation = handleConfirmationSubmit(async (data) => {
    setApiError("");
    setApiSuccess("");
    const email = watch("email");
    const password = watch("password");

    try {
      const confirmationResponse = await submitConfirmation(email, data.code);
      if (!confirmationResponse.ok) {
        setApiError(handleApiError(confirmationResponse));
        return;
      }

      const loginResponse = await loginUser(email, password);
      console.log("Login response:", loginResponse); // Debugging

      if (loginResponse.ok) {
        const authTokens = {
          access_token: loginResponse.access_token,
          refresh_token: loginResponse.refresh_token,
        };


        localStorage.setItem("authTokens", JSON.stringify(authTokens));

        if (loginResponse.user_data) {
          localStorage.setItem("userData", JSON.stringify(loginResponse.user_data));
        }

        refreshUserData();
        setApiSuccess("Email confirmed and login successful! Redirecting...");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setApiError(handleApiError(loginResponse));
        setApiSuccess("Email confirmed but auto-login failed. Please log in manually.");
      }
    } catch (error) {
      setApiError("Failed to confirm email or login. Please try again.");
      console.error("Confirmation/Login error:", error);
    }
  });


  return {
    step,
    setStep,
    register,
    handleSubmit,
    errors,
    password,
    onStep1Submit,
    onStep2Submit,
    registerConfirmation,
    confirmationErrors,
    onConfirmation,
    apiError,
    apiSuccess,
    showConfirmationForm,
    setValue,
    watch,
    control,
    methods,
  };
};
