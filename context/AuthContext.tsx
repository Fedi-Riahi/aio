
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface UserData {
  username: string;
  profile_picture: string | null;
  city: string;
  birthday: string;
  phone_number: string;
  email: string;
  following: number;
  friends: number;
  unread_tickets_count: number;
  unread_notifications_count: number;
  state: string;
  premuim_status: boolean;
  events: number;
  _id: string;
  id_org: string | null;
  e_account_id: string;
  n_account_id: string;
  liked_events: string[];
}

interface AuthContextType {
  userData: UserData | null;
  authTokens: AuthTokens | null;
  unreadNotificationsCount: number;
  signOut: () => Promise<void>;
  refreshUserData: () => void;
  refreshToken: () => Promise<AuthTokens | null>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUserData = localStorage.getItem("userData");
        const storedTokens = localStorage.getItem("authTokens");

        if (storedUserData) {
          const parsedUserData: UserData = JSON.parse(storedUserData);
          setUserData(parsedUserData);
          setUnreadNotificationsCount(parsedUserData.unread_notifications_count || 0);
        } else {
          setUserData(null);
          setUnreadNotificationsCount(0);
        }

        if (storedTokens) {
          setAuthTokens(JSON.parse(storedTokens));
        } else {
          setAuthTokens(null);
        }
      } catch (error) {
        setUserData(null);
        setAuthTokens(null);
        setUnreadNotificationsCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const refreshUserData = () => {
    try {
      const storedUserData = localStorage.getItem("userData");
      const storedTokens = localStorage.getItem("authTokens");

      console.log("RefreshUserData - storedTokens:", storedTokens); // Debug log

      if (storedUserData) {
        const parsedUserData: UserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setUnreadNotificationsCount(parsedUserData.unread_notifications_count || 0);
      }

      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens);
        console.log("Parsed tokens:", parsedTokens); // Debug log
        setAuthTokens(parsedTokens);
      } else {
        setAuthTokens(null);
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
      setUserData(null);
      setAuthTokens(null);
      setUnreadNotificationsCount(0);
    }
  };

  const refreshToken = async (): Promise<AuthTokens | null> => {
    const storedTokens = localStorage.getItem("authTokens");
    if (!storedTokens) {
      return null;
    }

    const tokens: AuthTokens = JSON.parse(storedTokens);
    try {
      const response = await axios.post("/api/user/token", {
        refresh_token: tokens.refresh_token,
      });

      const newTokens: AuthTokens = {
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token || tokens.refresh_token,
      };

      localStorage.setItem("authTokens", JSON.stringify(newTokens));
      setAuthTokens(newTokens);
      return newTokens;
    } catch (error) {
      localStorage.removeItem("authTokens");
      localStorage.removeItem("userData");
      localStorage.removeItem("userTickets");
      setUserData(null);
      setAuthTokens(null);
      setUnreadNotificationsCount(0);
      window.location.href = "/";
      return null;
    }
  };

  const signOut = async () => {
    localStorage.removeItem("authTokens");
    localStorage.removeItem("userData");
    localStorage.removeItem("userTickets");
    setUserData(null);
    setAuthTokens(null);
    setUnreadNotificationsCount(0);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        authTokens,
        unreadNotificationsCount,
        signOut,
        refreshUserData,
        refreshToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
