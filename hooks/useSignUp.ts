// hooks/useSignUp.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormData, SignUpResponse } from "../types/signUp";
import { submitSignUp, submitConfirmation, handleApiError, loginUser } from "../utils/signUpUtils";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const router = useRouter();

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
        setApiSuccess("Inscription réussie ! Veuillez vérifier votre email pour confirmer.");
        setShowConfirmationForm(true);
      } else {
        setApiError(handleApiError(response));
      }
    } catch (error) {
      setApiError("Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    }
  };

  const onConfirmation = handleConfirmationSubmit(async (data) => {
    setApiError("");
    setApiSuccess("");
    const email = watch("email");
    const password = watch("password");

    try {
      // 1. First confirm the email
      const confirmationResponse = await submitConfirmation(email, data.code);
      if (!confirmationResponse.ok) {
        setApiError(handleApiError(confirmationResponse));
        return;
      }

      // 2. If confirmation is successful, log the user in
      const loginResponse = await loginUser(email, password);
      if (loginResponse.ok) {
        // Store tokens in localStorage or context
        localStorage.setItem("authTokens", JSON.stringify({
          access_token: loginResponse.access_token,
          refresh_token: loginResponse.refresh_token,
        }));

        setApiSuccess("Email confirmé et connexion réussie ! Redirection...");

        // Redirect to dashboard or home page after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setApiError(handleApiError(loginResponse));
      }
    } catch (error) {
      setApiError("Échec de la confirmation ou de la connexion. Veuillez réessayer.");
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
