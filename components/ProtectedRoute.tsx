
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { decodeJwt } from "jose";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authTokens, refreshToken, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (loading) {
        return;
      }

      console.log("authTokens in ProtectedRoute:", authTokens);

      if (!authTokens?.access_token) {
        console.log("Not Authorized: No access token");
        router.push("/");
        return;
      }

      try {
        const decoded = decodeJwt(authTokens.access_token);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Access token expired, attempting to refresh...");
          const newTokens = await refreshToken();
          if (newTokens) {
            const newDecoded = decodeJwt(newTokens.access_token);

            if (newDecoded.exp && newDecoded.exp >= currentTime) {
              console.log("New token is valid, authorizing...");

              setIsAuthorized(true);
            } else {
              console.log("New token is still expired or invalid");
              router.push("/");
            }
          } else {
            console.log("Token refresh failed");
            router.push("/");
          }
        } else {
          console.log("Access token is valid, authorizing...");
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Token decoding error:", error);
        const newTokens = await refreshToken();
        if (newTokens) {
          try {
            const newDecoded = decodeJwt(newTokens.access_token);
            const currentTime = Math.floor(Date.now() / 1000);
            if (newDecoded.exp && newDecoded.exp >= currentTime) {
              console.log("New token is valid after refresh, authorizing...");

              setIsAuthorized(true);
            } else {
              console.log("New token is still expired or invalid after refresh");
              router.push("/");
            }
          } catch (retryError) {
            console.error("Error decoding new token after refresh:", retryError);
            router.push("/");
          }
        } else {
          console.log("Token refresh failed after decoding error");
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [authTokens, refreshToken, router, loading]);

  if (loading || isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;

  return <>{children}</>;
};

export default ProtectedRoute;
