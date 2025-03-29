import { Settings, Bell, Shield, HelpCircle } from "lucide-react";
import { NavigationItem } from "../types/profileDrawer";

export const navigationItems: NavigationItem[] = [
  { label: "Account Settings", icon: Settings },
  { label: "Notifications", icon: Bell },
  { label: "Privacy", icon: Shield },
  { label: "Help & Support", icon: HelpCircle },
];

export const getInitials = (name?: string): string => {
  return name ? name[0]?.toUpperCase() || "U" : "U";
};
