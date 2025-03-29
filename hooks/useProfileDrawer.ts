import { useState, useEffect, useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { CustomDrawerProps } from "../types/profileDrawer";

export const useProfileDrawer = ({ open, onOpenChange }: CustomDrawerProps) => {
  const { data: session, status } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open && status === "unauthenticated") {
      setIsSignUp(false);
    }
  }, [open, status]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
    }, 300);
  }, [onOpenChange]);

  const toggleSignUp = useCallback(() => {
    setIsSignUp((prev) => !prev);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut();
  }, []);

  return {
    session,
    status,
    isSignUp,
    isClosing,
    handleClose,
    toggleSignUp,
    handleSignOut,
  };
};
