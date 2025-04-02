import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../types/login";
import { handleLoginRequest } from "../utils/loginUtils";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { resendMailVerifyToken, submitConfirmation } from "../utils/signUpUtils";

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
        }
      }
    } else {
      refreshUserData();
      router.push("/");
    }
  });

  const onConfirmCode = async () => {
    setError("");
    const result = await submitConfirmation(email, confirmationCode);
    console.log("Code verification response:", result);
    if (result.ok) {
      setIsConfirming(false);
      setError("Email confirmed! Please log in.");
    } else {
      setError(result.error?.details || "Invalid confirmation code.");
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
  };
};
