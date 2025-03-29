import React from "react";
import { Button } from "@/components/ui/button";

interface ConfirmationStepProps {
  handleCancel: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ handleCancel }) => {
  return (
    <div>
      <Button
        className="w-full px-8 py-2 bg-main text-white"
        onClick={handleCancel}
      >
        Annuler
      </Button>
    </div>
  );
};

export default ConfirmationStep;
