// ./components/TicketDrawer.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import SelectQuantityStep from "@/components/SelectQuantityStep";
import EnterNamesStep from "@/components/EnterNamesStep";
import PaymentStep from "@/components/PaymentStep";
import TheatreView from "@/components/TheatreView";
import Timer from "@/components/Timer";
import { TicketDrawerProps } from "@/types/ticketDrawer";
import { useTicketDrawer } from "@/hooks/useTicketDrawer";
import { startOrderTimer } from "@/utils/paymentStepUtils";
import { TicketType as EventTicketType } from "@/types/eventDetails";
import { Seat as EventSeat } from "@/types/eventDetails";

interface TheatreSeat {
  seat_index: string;
  is_removed: boolean;
  _id: string;
}
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
    ticketType as EventTicketType[],
    eventId,
    periodIndex,
    locationIndex,
    timeIndex,
    hasSeatTemplate,
    seatData, // Type matches SeatData from ticketDrawer.ts
    onClose
  );

  const [timer, setTimer] = useState<number | null>(null);
  const [timerError, setTimerError] = useState<string | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = async () => {
    try {
      const ticketDataListForTimer = tickets
        .filter((ticket) => selectedTickets[ticket.ticket_id] > 0)
        .map((ticket) => ({
          ticket_id: ticket.ticket_id,
          name: ticket?.type || "Billet inconnu",
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
      const response = await startOrderTimer(requestBody);
      if (response.success && response.respond.data?.timer) {
        setTimer(response.respond.data.timer);
        setTimerError(null);
      } else {
        const errorMsg = response.respond.error?.details || "Échec de récupération du minuteur";
        setTimerError(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Erreur inconnue du minuteur";
      setTimerError(errorMsg);
    }
  };

  useEffect(() => {
    if (isOpen && step === "enterNames" && timer === null && !timerError) {
      startTimer();
    }
  }, [isOpen, step, timer, timerError, eventId, selectedTickets, locationIndex, periodIndex, timeIndex]);

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
            handleCancel();
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
  }, [timer, isOpen, handleCancel]);

  useEffect(() => {
    if (!isOpen && timer !== null) {
      setTimer(null);
      setTimerError(null);
    }
  }, [isOpen]);
// Transform EventSeat[] to TheatreSeat[]
const transformedSeats: TheatreSeat[] = seatData?.seats.list_of_seat.map((seat: EventSeat) => ({
  _id: seat.id,
  seat_index: `${seat.row}-${seat.number}`, // Example transformation; adjust as needed
  is_removed: false, // Default value; adjust if data provides this
})) || [];
  const stepTitles = {
    selectQuantity: "Sélectionner la quantité",
    selectSeats: "Choisir vos places",
    enterNames: "Informations des participants",
    payment: "Méthode de paiement",
    confirmation: "Confirmation de commande",
  };

  const stepDescriptions = {
    selectQuantity: "Sélectionnez le nombre de billets dont vous avez besoin",
    selectSeats: "Choisissez vos places préférées sur le plan de la salle",
    enterNames: "Entrez les informations pour chaque participant",
    payment: "Finalisez votre achat en toute sécurité",
    confirmation: "Votre commande a été confirmée",
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />
      <DrawerContent className="bg-gray-900 border-gray-800 max-h-[90vh] rounded-t-2xl">
        <DrawerHeader className="text-left px-6 pt-6 pb-4 border-b border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <DrawerTitle className="text-2xl font-bold text-white">{stepTitles[step]}</DrawerTitle>
              <p className="text-gray-400 mt-1 text-sm">{stepDescriptions[step]}</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Fermer le tiroir"
            >
              <XIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            {Object.keys(stepTitles).map((key) => (
              <div
                key={key}
                className={`h-1 flex-1 rounded-full ${step === key ? "bg-main" : "bg-gray-700"}`}
              />
            ))}
          </div>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto flex-1">
          {(step === "enterNames" || step === "payment") && timer !== null && (
            <div className="mb-6">
              <Timer time={timer} timerError={timerError} />
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
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Chargement du plan de salle...</p>
            </div>
          )}

          {step === "selectSeats" && hasSeatTemplate === false && (
            <div className="bg-gray-800/50 rounded-lg p-6 text-center">
              <p className="text-gray-400">Aucun plan de salle disponible. Passage à l&apos;étape suivante.</p>
            </div>
          )}

          {step === "selectSeats" && hasSeatTemplate === true && seatData && (
            <TheatreView
              order={order}
              ticketIndex={ticketIndex.toString()}
              seats={transformedSeats}
              roomName={seatData.room_name}
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
              maxSeats={maxSeats}
              takenSeats={seatData.taken || []}
            />
          )}

          {step === "enterNames" && timer === null && !timerError && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-400">Préparation de votre réservation...</p>
            </div>
          )}

          {step === "enterNames" && timer !== null && !timerError && (
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

          {step === "enterNames" && timerError && (
            <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
              <p className="text-red-400">Erreur de chargement du minuteur : {timerError}</p>
            </div>
          )}

          {step === "payment" && timer !== null && !timerError && (
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
              timer={timer}
              timerError={timerError}
              paymentMethods={paymentMethods}
            />
          )}
        </div>

        <DrawerFooter className="px-6 pb-6 pt-4 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <div className="flex gap-3 w-full">
            {step !== "selectQuantity" && step !== "payment" && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 bg-transparent text-white border-gray-700 hover:bg-gray-800 hover:border-gray-600"
              >
                Retour
              </Button>
            )}
            <Button
              onClick={step === "payment" ? handleCancel : handleContinue}
              className={`flex-1 ${
                step === "payment"
                  ? "bg-transparent border border-gray-700 text-white hover:bg-gray-800"
                  : "bg-main hover:bg-main/90"
              }`}
              disabled={
                (step === "selectSeats" && selectedSeats.length !== maxSeats) ||
                (step === "selectQuantity" && Object.values(selectedTickets).every((quantity) => quantity === 0)) ||
                (step === "enterNames" &&
                  !Object.entries(selectedTickets).every(([ticketId, quantity]) => {
                    const ticketUsers = userNames[ticketId] || [];
                    return ticketUsers.length === quantity && ticketUsers.every((name) => name.trim() !== "");
                  })) ||
                timer === 0 ||
                timerError !== null
              }
            >
              {step === "payment" ? "Annuler" : "Continuer"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TicketDrawer;