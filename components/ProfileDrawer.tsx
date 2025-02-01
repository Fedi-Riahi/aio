"use client";

import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Login } from "@/components/Login";
import { SignUp } from "@/components/SignUp";
import {  LogOut, ChevronRight, Settings, Bell, Shield, HelpCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

interface CustomDrawerProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const navigationItems = [
  { label: "Account Settings", icon: Settings },
  { label: "Notifications", icon: Bell },
  { label: "Privacy", icon: Shield },
  { label: "Help & Support", icon: HelpCircle },
];

export const ProfileDrawer = ({ open, onOpenChange }: CustomDrawerProps) => {
  const { data: session, status } = useSession();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (open && status === "unauthenticated") {
      setIsSignUp(false);
    }
  }, [open, status]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpenChange(false);
      setIsClosing(false);
    }, 300);
  };

  if (status === "loading") return null;

  return (
    <>
      {/* Backdrop with blur effect */}
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-background shadow-2xl transition-all duration-300 ease-in-out border-l border-foreground/10 ${
          open && !isClosing ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="relative p-6 flex justify-between items-center  bg-muted/30">
            <h2 className="text-2xl font-semibold tracking-tight">
              {session ? "Profile" : isSignUp ? "Create Account" : "Welcome Back"}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="hover:bg-muted rounded-full text-md text-main hover:text-main/90 transition duration-300"
              aria-label="Close"
            >
              Close
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {!session ? (
                <>
                  <div className="text-center">

                    <p className="text-muted-foreground">
                      {isSignUp
                        ? "Create an account to get started"
                        : "Sign in to access your account"}
                    </p>
                  </div>
                  {/* Original Login and SignUp components */}
                  {isSignUp ? <SignUp /> : <Login />}
                </>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-16 w-16 ring-2 ring-main">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-primary/5">
                        {session.user?.name?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-lg">
                        {session.user?.name || "User"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {session.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {navigationItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <Button
                          key={index}
                          variant="ghost"
                          className="w-full justify-between h-14 px-4"
                        >
                          <span className="flex items-center">
                            <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                            {item.label}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      );
                    })}
                  </div>

                  <Separator />

                  <Button
                    variant="destructive"
                    className="w-full h-11 text-main hover:text-main/90"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4 text-foreground" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {!session && (
            <div className="p-6  bg-muted/30">
              <Button
                variant="outline"
                className="w-full h-11"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};