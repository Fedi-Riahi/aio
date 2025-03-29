import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export const useNavbar = () => {
  const { userData, unreadNotificationsCount } = useAuth();
  const router = useRouter();
  const [scrolling, setScrolling] = useState(false);
  const [openTicketDrawer, setOpenTicketDrawer] = useState(false);
  const [openProfileDrawer, setOpenProfileDrawer] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileAction = (action: "tickets" | "profile" | "publish") => {
    setIsMobileMenuOpen(false);
    if (action === "tickets") {
      setOpenTicketDrawer(true);
    } else if (action === "profile") {
      setOpenProfileDrawer(true);
    } else if (action === "publish") {
      handlePublishEvent();
    }
  };

  const handlePublishEvent = () => {
    if (!userData) {
      setOpenProfileDrawer(true);
      return;
    }

    const isOrg = userData.is_org ?? false;
    const hasOrganizerDetails =
      (userData.organization_name?.trim() || "") !== "" &&
      (userData.details?.trim() || "") !== "" &&
      (userData.social_medias?.length || 0) > 0;

    if (!isOrg || !hasOrganizerDetails) {
      router.push("/complete-organizer-details");
    } else {
      router.push("/");
    }
  };

  return {
    session: userData ? { user: { email: userData.email } } : null,
    scrolling,
    openTicketDrawer,
    setOpenTicketDrawer,
    openProfileDrawer,
    setOpenProfileDrawer,
    unreadNotificationsCount,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    handleMobileAction,
    handlePublishEvent,
  };
};
