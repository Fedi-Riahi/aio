import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount, IconMapPin } from "@tabler/icons-react";
import { PaymentStepProps } from "../types/paymentStep";
import { usePaymentStep } from "../hooks/usePaymentStep";
import LocationMap from "./LocationMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import { startOrderTimer } from "@/utils/paymentStepUtils";

const PaymentStep: React.FC<PaymentStepProps> = ({
  paymentMode,
  handlePaymentModeChange,
  deliveryDetails,
  handleDeliveryChange,
  couponCode,
  handleCouponChange,
  applyCoupon,
  discount,
  calculateTotal,
  eventId,
  ticketDataList,
  locationIndex = 0,
  periodIndex = 0,
  timeIndex = 0,
  extraFields = [],
  currency = "DT",
  email: propEmail,
  phoneNumber: propPhoneNumber,
  mapRegion,
  onPaymentSuccess,
  paymentMethods = [],
}) => {
  const { userData } = useAuth();

  const email = userData?.email || propEmail || "";
  const phoneNumber = userData?.phone_number || propPhoneNumber || "";
  const firstName = userData?.username || deliveryDetails.name || "Client";
  const lastName = deliveryDetails.prename || "Client";

  const [extraFieldValues, setExtraFieldValues] = useState<{ [key: string]: string }>(
    extraFields.reduce((acc, field) => ({ ...acc, [field.field]: "" }), {})
  );
  const [timer, setTimer] = useState<number | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [timerError, setTimerError] = useState<string | null>(null);

  const {
    isProcessingPayment,
    handleOrderProcessing,
    addressError,
    isMapOpen,
    setIsMapOpen,
    selectedPosition,
    handleLocationSelect,
  } = usePaymentStep({
    paymentMode,
    handlePaymentModeChange,
    deliveryDetails,
    handleDeliveryChange,
    couponCode,
    handleCouponChange,
    applyCoupon,
    calculateTotal,
    eventId,
    ticketDataList,
    locationIndex,
    periodIndex,
    timeIndex,
    extraFields: Object.entries(extraFieldValues).map(([field, value]) => ({ field, value })),
    email,
    phoneNumber,
    firstName,
    lastName,
    mapRegion,
    onPaymentSuccess: (response) => {
      if (response.success && response.data?.payUrl) {
        setPaymentUrl(response.data.payUrl);
        setIsPaymentDialogOpen(true);
      }
      if (typeof onPaymentSuccess === "function") {
        onPaymentSuccess(response);
      } else {
        console.log("Payment success, no callback provided:", response);
      }
    },
  });

  const defaultPosition = { latitude: 36.8065, longitude: 10.1815 };
  const initialPosition = mapRegion || defaultPosition;

  const startTimer = useCallback(async () => {
    try {
      const requestBody = {
        event_id: eventId,
        ticketDataList,
        location_index: locationIndex,
        period_index: periodIndex,
        time_index: timeIndex,
      };
      const response = await startOrderTimer(requestBody);
      if (response.success && response.respond.data?.timer) {
        setTimer(response.respond.data.timer);
        setTimerError(null);
      } else {
        setTimerError("Failed to retrieve timer value");
      }
    } catch (error) {
      console.error("Failed to start timer:", error);
      setTimerError(error instanceof Error ? error.message : "Unknown timer error");
    }
  }, [eventId, ticketDataList, locationIndex, periodIndex, timeIndex]);

  useEffect(() => {
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    if (timer === null || timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const PaymentModeButton = ({ mode, label, icon: Icon, isActive }: { mode: string; label: string; icon: any; isActive: boolean }) => (
    <Button
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium rounded-lg transition duration-300 ${
        isActive
          ? "bg-main text-foreground border-main"
          : "bg-offwhite dark:bg-gray-700 text-foreground hover:bg-black/10 dark:hover:bg-gray-600"
      }`}
      onClick={() => handlePaymentModeChange(mode)}
      disabled={isProcessingPayment || timer === 0}
      aria-label={`Sélectionner le mode de paiement ${label}`}
    >
      <Icon stroke={1.5} size={24} />
      {label}
    </Button>
  );

  const InputField = ({ label, value, onChange, placeholder, name, disabled }: any) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground dark:text-gray-300">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        className="p-3 bg-offwhite dark:bg-gray-700 text-foreground dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );

  const ExtraFieldInput = ({ field }: { field: { field: string } }) => (
    <InputField
      label={field.field}
      value={extraFieldValues[field.field] || ""}
      onChange={(_, value: string) => setExtraFieldValues((prev) => ({ ...prev, [field.field]: value }))}
      placeholder={`Entrez ${field.field}`}
      name={field.field}
      disabled={isProcessingPayment}
    />
  );

  const paymentOptions = {
    delivery: { label: "Livraison", icon: IconTruckDelivery },
    online: { label: "En ligne", icon: IconCreditCard },
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-offwhite dark:bg-gray-800 rounded-lg shadow-md">
      {/* Timer Display */}
      {timer !== null && (
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Temps restant</h2>
          <p className={`text-lg font-medium ${timer > 0 ? "text-red-500" : "text-gray-500"}`}>
            {timer > 0 ? formatTime(timer) : "Temps écoulé"}
          </p>
          {timerError && <p className="text-sm text-red-500">{timerError}</p>}
        </div>
      )}

      {/* Payment Methods */}
      {paymentMethods.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Mode de paiement</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {paymentMethods.map((method) => {
              const option = paymentOptions[method.toLowerCase()];
              if (!option) return null;
              return (
                <PaymentModeButton
                  key={method}
                  mode={method.toLowerCase()}
                  label={option.label}
                  icon={option.icon}
                  isActive={paymentMode === method.toLowerCase()}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Delivery Details */}
      {paymentMode === "delivery" && paymentMethods.includes("delivery") && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Détails de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nom"
              value={deliveryDetails.name}
              onChange={handleDeliveryChange}
              placeholder="Votre nom"
              name="name"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Prénom"
              value={deliveryDetails.prename}
              onChange={handleDeliveryChange}
              placeholder="Votre prénom"
              name="prename"
              disabled={isProcessingPayment}
            />
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-foreground dark:text-gray-300">Adresse</label>
              <Button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center gap-2 bg-main text-foreground hover:bg-main/90"
                disabled={isProcessingPayment}
                aria-label="Sélectionner une adresse sur la carte"
              >
                <IconMapPin stroke={1.5} size={20} />
                Sélectionner sur la carte
              </Button>
              <div className="mt-2 p-3 bg-offwhite rounded-lg">
                <p className="text-sm text-foreground">
                  <span className="font-medium">Adresse sélectionnée :</span>{" "}
                  {deliveryDetails.address || "Aucune adresse sélectionnée"}
                </p>
              </div>
              {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Extra Fields */}
      {extraFields.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Informations supplémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraFields.map((field) => (
              <ExtraFieldInput key={field.field} field={field} />
            ))}
          </div>
        </div>
      )}

      {/* Coupon Code */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Code promo</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex items-center gap-2 p-3 border border-gray-500 rounded-lg">
            <IconDiscount stroke={1.5} size={24} className="text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Entrez votre code promo"
              value={couponCode}
              onChange={handleCouponChange}
              className="flex-1 p-3 rounded-lg focus:outline-none text-foreground dark:text-gray-200 bg-offwhite dark:bg-gray-700"
              disabled={isProcessingPayment}
              aria-label="Code promo"
            />
          </div>
          <Button
            className="px-6 py-3 bg-main text-foreground rounded-lg hover:bg-main/90 transition-all"
            onClick={applyCoupon}
            disabled={isProcessingPayment}
            aria-label="Appliquer le code promo"
          >
            Appliquer
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Récapitulatif</h2>
        <div className="p-4 bg-offwhite dark:bg-gray-700 border rounded-lg">
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Sous-total</span>
            <span>{calculateTotal().subtotal} {currency}</span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Réduction</span>
            <span>{discount} {currency}</span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Frais de livraison</span>
            <span>{calculateTotal().fee} {currency}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-foreground dark:text-gray-200">
            <span>Total</span>
            <span>{calculateTotal().total} {currency}</span>
          </div>
        </div>
      </div>

      {/* Process Payment Button */}
      <Button
        className="px-6 py-3 bg-main text-foreground rounded-lg hover:bg-main/90 transition-all"
        onClick={handleOrderProcessing}
        disabled={isProcessingPayment || timer === 0}
        aria-label="Procéder au paiement"
      >
        {isProcessingPayment ? "Traitement en cours..." : "Procéder au paiement"}
      </Button>

      {/* Map Dialog */}
      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className="text-white">Sélectionnez votre adresse</DialogTitle>
            {timer !== null && (
              <div className="flex items-center gap-2">
                <DialogTitle className="text-white">Temps Restant</DialogTitle>
                <p className={`text-lg font-medium ${timer > 0 ? "text-red-500" : "text-gray-500"}`}>
                  {timer > 0 ? formatTime(timer) : "Temps écoulé"}
                </p>
              </div>
            )}
          </DialogHeader>
          <div className="py-4">
            <LocationMap
              initialPosition={selectedPosition || initialPosition}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsMapOpen(false)} variant="outline" className="bg-main border-none">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[80vw] max-h-[80vh] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className="text-white">Finaliser le paiement</DialogTitle>
            {timer !== null && (
              <div className="flex items-center gap-2">
                <DialogTitle className="text-white">Temps Restant</DialogTitle>
                <p className={`text-lg font-medium ${timer > 0 ? "text-red-500" : "text-gray-500"}`}>
                  {timer > 0 ? formatTime(timer) : "Temps écoulé"}
                </p>
              </div>
            )}
          </DialogHeader>
          {paymentUrl ? (
            <iframe
              src={paymentUrl}
              className="w-full h-[60vh] border-0"
              title="Payment Gateway"
              sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
            />
          ) : (
            <p className="text-gray-500">Chargement du paiement...</p>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPaymentDialogOpen(false)} variant="outline" className="bg-main border-none">
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentStep;
