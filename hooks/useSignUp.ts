import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { SignUpFormData, SignUpResponse } from "../types/signUp";
import { submitSignUp, submitConfirmation, handleApiError, loginUser } from "../utils/signUpUtils";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useSignUp = () => {
  const [step, setStep] = useState(() => {
    const savedState = localStorage.getItem("signUpState");
    return savedState ? JSON.parse(savedState).step : 1;
  });
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");
  const [showConfirmationForm, setShowConfirmationForm] = useState(() => {
    const savedState = localStorage.getItem("signUpState");
    return savedState ? JSON.parse(savedState).showConfirmationForm : false;
  });
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
  const email = watch("email");

  // Load form data and state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("signUpFormData");
    const savedState = localStorage.getItem("signUpState");

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        if (key !== "profile_picture") {
          setValue(key as keyof SignUpFormData, parsedData[key]);
        }
      });
    }

    if (savedState) {
      const { step: savedStep, showConfirmationForm: savedConfirmation } = JSON.parse(savedState);
      setStep(savedStep);
      setShowConfirmationForm(savedConfirmation);
      if (savedConfirmation) {
        setApiSuccess("Vérifiez votre email pour le code de confirmation.");
      }
    }
  }, [setValue]);


  useEffect(() => {
    const subscription = watch((value) => {
      const dataToSave = { ...value, profile_picture: undefined };
      localStorage.setItem("signUpFormData", JSON.stringify(dataToSave));
      localStorage.setItem("signUpState", JSON.stringify({ step, showConfirmationForm }));
    });
    return () => subscription.unsubscribe();
  }, [watch, step, showConfirmationForm]);

  const onStep1Submit = async (data: SignUpFormData) => {
    setApiError("");
    setApiSuccess("");

    try {
      if (!data.username || !data.email || !data.phone || !data.password) {
        throw new Error("Please fill all required fields");
      }
      setStep(2);
    } catch (error) {
      setApiError((error as Error).message);
    }
  };

  const onStep2Submit = async (data: SignUpFormData) => {
    setApiError("");
    setApiSuccess("");

    try {

      const savedData = localStorage.getItem("signUpFormData");
      const savedState = localStorage.getItem("signUpState");
      if (savedData && savedState) {
        const { email: savedEmail } = JSON.parse(savedData);
        const { showConfirmationForm: savedConfirmation } = JSON.parse(savedState);
        if (savedEmail === data.email && savedConfirmation) {
          setShowConfirmationForm(true);
          setStep(1);
          setApiSuccess("Cet email attend déjà une confirmation. Vérifiez votre boîte de réception.");
          return;
        }
      }

      const response: SignUpResponse = await submitSignUp(data);
      console.log("Signup response:", response);

      if (response.ok) {
        setApiSuccess("Inscription réussie ! Vérifiez votre email pour confirmer.");
        setShowConfirmationForm(true);
        setStep(1);
      } else if (response.status === 422 && response.error?.details === "This email is already in use") {

        const wasPending = savedData && JSON.parse(savedData).email === data.email && savedState && JSON.parse(savedState).showConfirmationForm;
        if (wasPending) {
          setApiSuccess("Cet email est déjà enregistré mais non confirmé. Entrez le code de confirmation.");
          setShowConfirmationForm(true);
          setStep(1);
        } else {
          setApiError("Cet email est déjà utilisé par un compte existant. Veuillez vous connecter.");
        }
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

    try {
      const confirmationResponse = await submitConfirmation(email, data.code);
      if (!confirmationResponse.ok) {
        setApiError(handleApiError(confirmationResponse));
        return;
      }

      const loginResponse = await loginUser(email, password);
      console.log("Login response:", loginResponse);

      if (loginResponse.ok) {
        const authTokens = {
          access_token: loginResponse.access_token,
          refresh_token: loginResponse.refresh_token,
        };

        localStorage.setItem("authTokens", JSON.stringify(authTokens));

        if (loginResponse?.user_data) {
          localStorage.setItem("userData", JSON.stringify(loginResponse?.user_data));
        }

        localStorage.removeItem("signUpFormData");
        localStorage.removeItem("signUpState");

        refreshUserData();
        setApiSuccess("Email confirmé et connexion réussie ! Redirection...");

        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setApiError(handleApiError(loginResponse));
        setApiSuccess("Email confirmé mais connexion automatique échouée. Connectez-vous manuellement.");
      }
    } catch (error) {
      setApiError("Échec de la confirmation de l'email ou de la connexion. Réessayez.");
      console.error("Confirmation/Login error:", error);
    }
  });

  const onBackToStep1 = () => {
    setStep(1);
  };

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
    onBackToStep1,
  };
};
