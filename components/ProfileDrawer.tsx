import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../context/AuthContext";
import { Login } from "./Login";
import { SignUp } from "./SignUp";
import { UserCircle2, Mail, LogOut } from "lucide-react";

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
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full bg-gradient-to-b from-background to-secondary/20">
          <SheetHeader className="p-6 text-left border-b">
            <SheetTitle className="text-2xl font-bold">
              {userData ? "Mon Profil" : showSignUp ? "Créer un compte" : "Bienvenue"}
            </SheetTitle>
          </SheetHeader>

          {userData ? (
            <div className="flex-1">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.email}`} />
                    <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                      {getInitials(userData.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{userData.email.split('@')[0]}</h2>
                    <span className="mt-1">
                      Membre
                    </span>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail className="h-5 w-5" />
                    <span className="text-sm">{userData.email}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto p-6 pt-0">
                <Button
                  onClick={signOut}
                  variant="destructive"
                  className="w-full group"
                >
                  <LogOut className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                  Se déconnecter
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center text-center">
              <UserCircle2 className="h-16 w-16 mb-4 text-muted-foreground" />
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
