import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../types/login";
import { handleLoginRequest } from "../utils/loginUtils";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { resendMailVerifyToken, submitConfirmation } from "../utils/signUpUtils";
import toast from "react-hot-toast"; // Add this import

export const useLogin = () => {
  const { refreshUserData } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [error, setError] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [confirmationCode, setConfirmationCode] = useState<string>("");

  const onLogin = handleSubmit(async (data: LoginFormData) => {
    setError("");
    const result = await handleLoginRequest(data);
    console.log("Login result:", result);
    if (result.error) {
      setError(result.error);
      toast.error(result.error); // Add error toast
      if (result.requiresConfirmation) {
        setEmail(data.email);
        setIsConfirming(true);
        console.log("Requesting confirmation code for:", data.email);
        const resendResult = await resendMailVerifyToken(data.email);
        console.log("Resend API response:", resendResult);
        if (!resendResult.ok) {
          setError(
            resendResult.error?.details ||
              "Failed to send a new confirmation code. Please enter the code previously sent or try again later."
          );
          toast.error(
            resendResult.error?.details ||
              "Failed to send confirmation code"
          );
        } else {
          toast.success("Code de confirmation envoyé à votre adresse e-mail.");
        }
      }
    } else {
      refreshUserData();
      toast.success("Connexion réussie !");
    }
  });

  const onConfirmCode = async () => {
    setError("");
    const result = await submitConfirmation(email, confirmationCode);
    if (result.ok) {
      setIsConfirming(false);
      setError("Email confirmed! Please log in.");
      toast.success("E-mail confirmé avec succès !");
    } else {
      setError(result.error?.details || "Invalid confirmation code.");
      toast.error(result.error?.details || "Code de confirmation invalide.");
    }
  };

  const resendCode = async () => {
    setError("");
    if (!email) {
      setError("No email available to resend the code.");
      toast.error("Aucun e-mail disponible.");
      return;
    }
    const resendResult = await resendMailVerifyToken(email);
    if (!resendResult.ok) {
      setError(
        resendResult.error?.details ||
          "Failed to send a new confirmation code. Please try again later."
      );
      toast.error(
        resendResult.error?.details ||
          "Échec de l’envoi du code de confirmation."
      );
    } else {
      setError("A new code has been sent to your email.");
      toast.success("Nouveau code de confirmation envoyé !");
    }
  };

  return {
    register,
    errors,
    error,
    onLogin,
    isConfirming,
    confirmationCode,
    setConfirmationCode,
    onConfirmCode,
    resendCode,
  };
};
