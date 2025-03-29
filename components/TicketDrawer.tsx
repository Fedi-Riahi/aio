"use client";

import React from "react";
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
            <p className="text-center text-gray-500">Aucun plan de salle disponible. Passage à l&apos;étape suivante.</p>
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
              extraFields={[]}
              walletId="your-wallet-id"
              currency="USD"
              email="user@example.com"
              phoneNumber="1234567890"
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
                  }))
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
