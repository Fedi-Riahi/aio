"use client";
import React, { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/types/event";
import SelectQuantityStep from "@/components/SelectQuantityStep";
import EnterNamesStep from "@/components/EnterNamesStep";
import PaymentStep from "@/components/PaymentStep";
import ConfirmationStep from "@/components/ConfirmationStep";
import { XIcon } from "lucide-react";

interface TicketDrawerProps {
  tickets: Ticket[];
  isOpen: boolean;
  onClose: () => void;
}

const TicketDrawer: React.FC<TicketDrawerProps> = ({ tickets, isOpen, onClose }) => {
  const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({});
  const [userNames, setUserNames] = useState<{ [key: string]: string[] }>({});
  const [step, setStep] = useState<"selectQuantity" | "enterNames" | "payment" | "confirmation">("selectQuantity");
  const [paymentMode, setPaymentMode] = useState<"delivery" | "online" | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<{ name: string; prename: string; address: string }>({ name: "", prename: "", address: "" });
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (ticketId: string, quantity: number) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [ticketId]: quantity,
    }));
  };

  const handleNameChange = (ticketId: string, index: number, name: string) => {
    setUserNames((prev) => {
      const updatedNames = [...(prev[ticketId] || [])];
      updatedNames[index] = name;
      return {
        ...prev,
        [ticketId]: updatedNames,
      };
    });
  };

  const handlePaymentModeChange = (mode: "delivery" | "online") => {
    setPaymentMode(mode);
  };

  const handleDeliveryChange = (field: keyof typeof deliveryDetails, value: string) => {
    setDeliveryDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCouponChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    if (couponCode === "DISCOUNT10") {
      setDiscount(10); 
    }
  };

  const calculateTotal = () => {
    const subtotal = tickets.reduce((total, ticket) => {
      const quantity = selectedTickets[ticket.ticket_id] || 0;
      return total + ticket.price * quantity;
    }, 0);

    const fee = paymentMode === "delivery" ? 8 : 0 || paymentMode === "online" ? 1.5 : 0;
    const reduction = (subtotal * discount) / 100;
    const total = subtotal + fee - reduction;

    return { subtotal, reduction, fee, total };
  };

  const handleCancel = () => {
    setSelectedTickets({});
    setUserNames({});
    setStep("selectQuantity");
    setPaymentMode(null);
    setCouponCode("");
    setDiscount(0);
    onClose();
  };

  const handleContinue = () => {
    if (step === "selectQuantity") {
      const hasSelectedTickets = Object.values(selectedTickets).some((quantity) => quantity > 0);
      if (hasSelectedTickets) {
        setStep("enterNames");
      } else {
        alert("Please select at least one ticket.");
      }
    } else if (step === "enterNames") {
      const allNamesEntered = Object.entries(selectedTickets).every(([ticketId, quantity]) => {
        const ticketUsers = userNames[ticketId] || [];
        return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
      });

      if (allNamesEntered) {
        setStep("payment");
      } else {
        alert("Please enter names for all selected tickets.");
      }
    } else if (step === "payment") {
      setStep("confirmation");
    }
  };

  const handleBack = () => {
    if (step === "enterNames") {
      setStep("selectQuantity");
    } else if (step === "payment") {
      setStep("enterNames");
    } else if (step === "confirmation") {
      setStep("payment");
    }
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <DrawerContent className="bg-background flex items-center justify-center">
        <DrawerHeader className="w-full md:w-1/2">
          <div className="flex justify-between items-center w-full">
            <DrawerTitle className="text-foreground relative text-xl md:text-2xl">
              {step === "selectQuantity"
                ? "Select Ticket Quantity"
                : step === "enterNames"
                ? "Enter User Names"
                : step === "payment"
                ? "Payment"
                : "Confirmation"}
            </DrawerTitle>
            <XIcon className="w-6 h-6 text-foreground hover:text-foreground/90 cursor-pointer" onClick={handleCancel}/>
          </div>
        </DrawerHeader>

        <div className="p-4 flex flex-col gap-4 w-full md:w-1/2">
          {step === "selectQuantity" && (
            <SelectQuantityStep
              tickets={tickets}
              selectedTickets={selectedTickets}
              handleQuantityChange={handleQuantityChange}
            />
          )}

          {step === "enterNames" && (
            <EnterNamesStep
              tickets={tickets}
              selectedTickets={selectedTickets}
              userNames={userNames}
              handleNameChange={handleNameChange}
            />
          )}

          {step === "payment" && (
            <PaymentStep
              paymentMode={paymentMode}
              handlePaymentModeChange={handlePaymentModeChange}
              deliveryDetails={deliveryDetails}
              handleDeliveryChange={handleDeliveryChange}
              couponCode={couponCode}
              handleCouponChange={handleCouponChange}
              applyCoupon={applyCoupon}
              discount={discount}
              calculateTotal={calculateTotal}
            />
          )}

          {step === "confirmation" && (
            <ConfirmationStep handleCancel={handleCancel} />
          )}
        </div>

        <DrawerFooter className="w-full md:w-1/2">
          <div className="flex gap-4">
            {step && (
              <Button
                onClick={handleBack}
                className={`text-foreground transition duration-300 ${step === "selectQuantity" ? "cursor-not-allowed" : "hover:bg-black/10 hover:border-transparent"}`}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleContinue}
              className="bg-main text-foreground hover:bg-main/90"
              disabled={
                (step === "selectQuantity" && Object.values(selectedTickets).every((quantity) => quantity === 0)) ||
                (step === "enterNames" && !Object.entries(selectedTickets).every(([ticketId, quantity]) => {
                  const ticketUsers = userNames[ticketId] || [];
                  return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
                }))
              }
            >
              {step === "confirmation" ? "Finish" : "Next"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TicketDrawer;