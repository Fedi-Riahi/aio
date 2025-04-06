import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../types/login";
import { handleLoginRequest } from "../utils/loginUtils";
import { useAuth } from "../context/AuthContext";
import { resendMailVerifyToken, submitConfirmation } from "../utils/signUpUtils";
import toast from "react-hot-toast";

export const useLogin = () => {
  const { refreshUserData } = useAuth();

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = handleSubmit(async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await handleLoginRequest(data);

      if (result.error) {
        setError(result.error);
        toast.error(result.error);

        if (result.requiresConfirmation) {
          setEmail(data.email);
          setIsConfirming(true);
          toast.loading("Envoi du code de confirmation...");

          try {
            const resendResult = await resendMailVerifyToken(data.email);
            if (!resendResult.ok) {
              const errorMessage = resendResult.error?.details ||
                "Nous n'avons pas pu envoyer un nouveau code. Veuillez utiliser le code précédemment envoyé ou réessayer plus tard.";
              setError(errorMessage);
              toast.error(errorMessage);
            } else {
              toast.success("Un nouveau code a été envoyé à votre adresse e-mail.");
            }
          } catch (err) {
            toast.error("Une erreur est survenue lors de l'envoi du code.");
          } finally {
            toast.dismiss();
          }
        }
      } else {
        await refreshUserData();
        toast.success("Connexion réussie !");
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    } finally {
      setIsLoading(false);
    }
  });

  const onConfirmCode = async () => {
    if (!confirmationCode.trim()) {
      setError("Veuillez entrer le code de confirmation");
      toast.error("Veuillez entrer le code de confirmation");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const result = await submitConfirmation(email, confirmationCode);
      if (result.ok) {
        setIsConfirming(false);
        toast.success("E-mail confirmé avec succès ! Vous pouvez maintenant vous connecter.");
      } else {
        const errorMessage = result.error?.details || "Code de confirmation invalide. Veuillez vérifier et réessayer.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (err) {
      toast.error("Erreur lors de la confirmation du code");
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (!email) {
      toast.error("Aucun e-mail disponible pour renvoyer le code");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const resendResult = await resendMailVerifyToken(email);
      if (!resendResult.ok) {
        const errorMessage = resendResult.error?.details ||
          "Échec de l'envoi du code. Veuillez réessayer plus tard.";
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        toast.success("Un nouveau code a été envoyé à votre adresse e-mail !");
      }
    } catch (err) {
      toast.error("Erreur lors de l'envoi du code");
    } finally {
      setIsLoading(false);
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
    isLoading,
  };
};
