
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginFormData } from "../types/login";
import { handleLoginRequest } from "../utils/loginUtils";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

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

  const onLogin = handleSubmit(async (data: LoginFormData) => {
    setError("");
    const result = await handleLoginRequest(data);
    if (result.error) {
      setError(result.error);
    } else {
      refreshUserData();
      setTimeout(() => {
        router.push("/");
      }, 100);
    }
  });

  return {
    register,
    errors,
    error,
    onLogin,
  };
};
