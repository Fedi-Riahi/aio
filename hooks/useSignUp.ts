import { useState } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormData, ConfirmationFormData } from "../types/signUp";
import { submitSignUp, submitConfirmation, handleApiError } from "../utils/signUpUtils";

export const useSignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
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
    register: registerConfirmation,
    handleSubmit: handleConfirmationSubmit,
    formState: { errors: confirmationErrors },
  } = useForm<ConfirmationFormData>({
    defaultValues: {
      code: "",
    },
  });

  const [step, setStep] = useState<number>(1);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccess, setApiSuccess] = useState<string | null>(null);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const password = watch("password");

  const onStep1Submit = handleSubmit(async (data: SignUpFormData) => {
    setApiError(null);
    setApiSuccess(null);
    setStep(2);
  });

  const onStep2Submit = handleSubmit(async (data: SignUpFormData) => {
    setApiError(null);
    setApiSuccess(null);

    try {

      const signUpResponse = await submitSignUp(data);
      if (!signUpResponse.ok) {
        setApiError(handleApiError(signUpResponse));
        return;
      }

      setUserEmail(data.email);
      setShowConfirmationForm(true);
      setStep(3);
      setApiSuccess("A confirmation code has been sent to your email.");
    } catch (err) {
      setApiError("Network error. Please check your connection.");
      console.error("Signup error:", err);
    }
  });

  const onConfirmation = handleConfirmationSubmit(async (data: ConfirmationFormData) => {
    setApiError(null);
    setApiSuccess(null);

    if (!userEmail) {
      setApiError("Email not found. Please sign up again.");
      return;
    }

    try {
      const response = await submitConfirmation(userEmail, data.code);
      if (!response.ok) {
        setApiError(handleApiError(response));
        return;
      }
      const { user_data, tokens } = response.respond!.data;
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      localStorage.setItem("userData", JSON.stringify(user_data));
      localStorage.setItem("userTickets", JSON.stringify(user_data.events || []));
      setApiSuccess(response.msg || "Account confirmation done! You are now logged in.");
    } catch (err) {
      setApiError("Network error. Please check your connection.");
    }
  });

  return {
    step,
    register,
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
  };
};
