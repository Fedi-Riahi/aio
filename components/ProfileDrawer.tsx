import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { UserCircle2, Mail, LogOut, User } from "lucide-react";
import { IconBrandMyOppo } from "@tabler/icons-react";

interface ProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProfileDrawer = ({ open, onOpenChange }: ProfileDrawerProps) => {
  const { userData, signOut } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const handleToggleForm = () => {
    setShowSignUp((prev) => !prev);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 border-0">
        <div className="flex flex-col h-full bg-gradient-to-b from-background to-secondary/20">
          <SheetHeader className="p-6 text-left">
            <SheetTitle className="text-2xl font-bold">
              {userData ? "Mon Profil" : showSignUp ? "Créer un compte" : "Bienvenue"}
            </SheetTitle>
          </SheetHeader>

          {userData ? (
            <div className="flex-1 bg-gradient-to-b from-gray-900/50 to-gray-900">
            <div className="p-8">
              {/* Header Section */}
              <div className="flex items-center gap-6 mb-8">
                <Avatar className="h-20 w-20 ring-2 ring-purple-500/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={userData?.profile_picture} />
                  <AvatarFallback className="text-xl bg-purple-600 text-white">
                    {getInitials(userData.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {userData.username}
                  </h2>
                  <div className="flex items-center gap-2 mt-1 text-main">
                    <IconBrandMyOppo size={14} />
                    <span className="text-sm font-medium">{userData.premuim_status ? "Premium Account" : "Normal Account"}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-white/10" />

              {/* Info Section */}
              <div className="space-y-6">
                <div className="group">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </label>
                  <div className="flex items-center gap-3 mt-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <Mail className="h-5 w-5 text-main" />
                    <span className="text-sm text-white">{userData.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="mt-auto p-8 pt-0">
              <Button
                onClick={signOut}
                variant="destructive"
                className="w-full bg-main hover:bg-red-main/90 text-foreground group"
              >
                <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Se déconnecter
              </Button>
            </div>
          </div>
          ) : (
            <div className="p-6 flex flex-col items-center text-center">
              <User className="h-16 w-16 mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">
                {showSignUp ? "Créer un compte" : "Connectez-vous à votre compte"}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                {showSignUp
                  ? "Créez un compte pour commencer"
                  : "Accédez à votre profil et gérez votre compte"}
              </p>
              <div className="w-full space-y-4">
                {showSignUp ? <SignUp /> : <Login />}
                <Button
                  onClick={handleToggleForm}
                  variant="outline"
                  className="w-full"
                >
                  {showSignUp ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
