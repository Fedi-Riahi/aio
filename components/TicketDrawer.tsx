"use client";

import React, { useState, useEffect, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import SelectQuantityStep from "@/components/SelectQuantityStep";
import EnterNamesStep from "@/components/EnterNamesStep";
import PaymentStep from "@/components/PaymentStep";
import ConfirmationStep from "@/components/ConfirmationStep";
import TheatreView from "@/components/TheatreView";
import { TicketDrawerProps } from "@/types/ticketDrawer";
import { useTicketDrawer } from "@/hooks/useTicketDrawer";
import { startOrderTimer } from "@/utils/paymentStepUtils";

const TicketDrawer: React.FC<TicketDrawerProps> = ({
  tickets,
  isOpen,
  onClose,
  ticketType,
  eventId,
  periodIndex = 0,
  locationIndex = 0,
  timeIndex = 0,
  ticketIndex = 0,
  ticketsGroups = [],
  hasSeatTemplate = null,
  seatData = null,
  paymentMethods = [],
  extraFields = [],
}) => {
  const {
    selectedTickets,
    handleQuantityChange,
    userNames,
    handleNameChange,
    step,
    paymentMode,
    handlePaymentModeChange,
    deliveryDetails,
    handleDeliveryChange,
    couponCode,
    handleCouponChange,
    handleApplyCoupon,
    discount,
    selectedSeats,
    setSelectedSeats,
    maxSeats,
    handleCancel,
    handleContinue,
    handleBack,
    order,
    total,
    ticketDataList,
  } = useTicketDrawer(
    tickets,
    ticketType,
    eventId,
    periodIndex,
    locationIndex,
    timeIndex,
    hasSeatTemplate,
    seatData,
    onClose
  );

  const [timer, setTimer] = useState<number | null>(null);
  const [timerError, setTimerError] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store interval ID

  const startTimer = async () => {
    try {
      const ticketDataListForTimer = tickets
        .filter((ticket) => selectedTickets[ticket.ticket_id] > 0)
        .map((ticket) => ({
          ticket_id: ticket.ticket_id,
          name: ticket.name || "Unknown Ticket", // Adjust based on your ticket structure
          ticket_index: 0,
          seat_index: "N/A",
        }));

      const requestBody = {
        event_id: eventId,
        ticketDataList: ticketDataListForTimer,
        location_index: locationIndex,
        period_index: periodIndex,
        time_index: timeIndex,
      };
      console.log("Starting timer with requestBody:", JSON.stringify(requestBody, null, 2));
      const response = await startOrderTimer(requestBody);
      if (response.success && response.respond.data?.timer) {
        setTimer(response.respond.data.timer);
        setTimerError(null);
      } else {
        const errorMsg = response.respond.error?.details || "Failed to retrieve timer value";
        setTimerError(errorMsg);
      }
    } catch (error) {
      console.error("Failed to start timer:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown timer error";
      setTimerError(errorMsg);
    }
  };

  // Start timer when entering "enterNames" step and drawer is open
  useEffect(() => {
    if (isOpen && step === "enterNames" && timer === null && !timerError) {
      startTimer();
    }
  }, [isOpen, step, timer, timerError, eventId, selectedTickets, locationIndex, periodIndex, timeIndex]);

  // Countdown logic
  useEffect(() => {
    if (timer === null || timer <= 0 || !isOpen) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev !== null && prev > 0) {
          const newTimer = prev - 1;
          if (newTimer === 0) {
            onClose(); // Close the drawer when timer hits 0
          }
          return newTimer;
        }
        return 0;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [timer, isOpen, onClose]);

  // Reset timer when drawer closes
  useEffect(() => {
    if (!isOpen && timer !== null) {
      setTimer(null);
      setTimerError(null);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  }, [isOpen]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div
        className={`fixed inset-0 bg-background/10 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      <DrawerContent className="bg-background flex items-center justify-center border border-offwhite">
        <DrawerHeader className="w-full md:w-3/4 lg:w-2/3">
          <div className="flex justify-between items-center w-full">
            <DrawerTitle className="text-foreground relative text-xl md:text-2xl">
              {step === "selectQuantity"
                ? "Sélectionner la quantité"
                : step === "selectSeats"
                ? "Choisir vos places"
                : step === "enterNames"
                ? "Saisir les noms"
                : step === "payment"
                ? "Paiement"
                : "Confirmation"}
            </DrawerTitle>
            <XIcon
              className="w-6 h-6 text-foreground hover:text-foreground/90 cursor-pointer"
              onClick={handleCancel}
            />
          </div>
        </DrawerHeader>

        <div className="p-4 flex flex-col gap-4 w-full md:w-3/4 lg:w-2/3 max-h-[70vh] overflow-y-auto">
          {(step === "enterNames" || step === "payment") && timer !== null && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Temps restant</h2>
              <p className={`text-lg font-medium ${timer > 0 ? "text-red-500" : "text-gray-500"}`}>
                {timer > 0 ? formatTime(timer) : "Temps écoulé"}
              </p>
              {timerError && <p className="text-sm text-red-500">{timerError}</p>}
            </div>
          )}

          {step === "selectQuantity" && (
            <SelectQuantityStep
              tickets={tickets}
              selectedTickets={selectedTickets}
              handleQuantityChange={handleQuantityChange}
              ticketType={ticketType}
              ticketsGroups={ticketsGroups}
              periodIndex={periodIndex}
              locationIndex={locationIndex}
              timeIndex={timeIndex}
            />
          )}

          {step === "selectSeats" && hasSeatTemplate === null && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
          )}

          {step === "selectSeats" && hasSeatTemplate === false && (
            <p className="text-center text-gray-500">Aucun plan de salle disponible. Passage à l'étape suivante.</p>
          )}

          {step === "selectSeats" && hasSeatTemplate === true && seatData && (
            <TheatreView
              order={order}
              ticketIndex={ticketIndex.toString()}
              seats={seatData.seats.list_of_seat}
              roomName={seatData.room_name}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              maxSeats={maxSeats}
              takenSeats={seatData.taken || []}
            />
          )}

          {step === "enterNames" && (
            <EnterNamesStep
              tickets={tickets}
              selectedTickets={selectedTickets}
              userNames={userNames}
              handleNameChange={handleNameChange}
              ticketType={ticketType}
              eventId={eventId}
              locationIndex={locationIndex}
              periodIndex={periodIndex}
              timeIndex={timeIndex}
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
              applyCoupon={handleApplyCoupon}
              discount={discount}
              calculateTotal={() => total}
              eventId={eventId}
              ticketDataList={ticketDataList}
              locationIndex={locationIndex}
              periodIndex={periodIndex}
              timeIndex={timeIndex}
              extraFields={extraFields}
              walletId="your-wallet-id"
              currency="USD"
              email="user@example.com"
              phoneNumber="1234567890"
              paymentMethods={paymentMethods}
              timer={timer}
              timerError={timerError}
            />
          )}

          {step === "confirmation" && (
            <ConfirmationStep
              tickets={tickets}
              selectedTickets={selectedTickets}
              userNames={userNames}
              paymentMode={paymentMode}
              deliveryDetails={deliveryDetails}
              calculateTotal={() => total}
            />
          )}
        </div>

        <DrawerFooter className="w-full md:w-3/4 lg:w-2/3">
          <div className="flex gap-4">
            <Button
              onClick={handleBack}
              className="text-foreground transition duration-300 hover:bg-black/10 hover:border-transparent"
            >
              Retour
            </Button>
            <Button
              onClick={handleContinue}
              className="bg-main text-foreground hover:bg-main/90"
              disabled={
                (step === "selectSeats" && selectedSeats.length !== maxSeats) ||
                (step === "selectQuantity" && Object.values(selectedTickets).every((quantity) => quantity === 0)) ||
                (step === "enterNames" &&
                  !Object.entries(selectedTickets).every(([ticketId, quantity]) => {
                    const ticketUsers = userNames[ticketId] || [];
                    return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
                  })) ||
                (timer === 0)
              }
            >
              {step === "confirmation" ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TicketDrawer;
