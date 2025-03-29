
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdVideoPopupProps {
  videoUrl: string;
  onClose: () => void;
}

export const AdVideoPopup: React.FC<AdVideoPopupProps> = ({ videoUrl, onClose }) => {
  return (
    <>

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />


      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative bg-background rounded-xl shadow-2xl max-w-3xl w-full p-6">

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 hover:bg-muted rounded-full"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative aspect-video">
            <video
              src={videoUrl}
              autoPlay
              controls
              className="w-full h-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </>
  );
};
