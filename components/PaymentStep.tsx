"use client"
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount, IconMapPin } from "@tabler/icons-react";
import { PaymentStepProps } from "../types/paymentStep";
import { usePaymentStep } from "../hooks/usePaymentStep";
import LocationMap from "./LocationMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";

const PaymentStep: React.FC<PaymentStepProps & {
  timer: number | null; // Timer passed from parent
  timerError: string | null; // Error passed from parent
}> = ({
  paymentMode,
  handlePaymentModeChange,
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
  timer, // New prop
  timerError, // New prop
}) => {
  const { userData } = useAuth();

  const email = userData?.email || propEmail || "";
  const phoneNumber = String(userData?.phone_number) || propPhoneNumber || "";
  const firstName = userData?.username || "Client";
  const lastName = "Client";

  const [extraFieldValues, setExtraFieldValues] = useState<{ [key: string]: string }>(
    extraFields.reduce((acc, field) => ({ ...acc, [field.field]: "" }), {})
  );
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [deliveryForm, setDeliveryForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    city: "",
    province: "",
  });

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
    handleDeliveryChange: (field, value) => {
      setDeliveryForm((prev) => ({ ...prev, [field]: value }));
      handleDeliveryChange(field, value);
    },
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
    phoneNumber: deliveryForm.phoneNumber || phoneNumber,
    firstName: deliveryForm.firstName || firstName,
    lastName: deliveryForm.lastName || lastName,
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
    deliveryForm,
  });

  const defaultPosition = { latitude: 36.8065, longitude: 10.1815 };
  const initialPosition = mapRegion || defaultPosition;

  useEffect(() => {
    console.log("Current paymentMode:", paymentMode);
    console.log("paymentMethods:", paymentMethods);
    console.log("Delivery section should show:", paymentMode === "delivery" && paymentMethods.some(method => method.toLowerCase() === "delivery"));
  }, [paymentMode, paymentMethods]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const PaymentModeButton = ({ mode, label, icon: Icon, isActive }: { mode: string; label: string; icon: any; isActive: boolean }) => (
    <Button
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text disponibilité-lg shadow-sm hover:shadow-md font-medium rounded-lg transition duration-300 ${
        isActive
          ? "bg-main text-foreground border-main"
          : "bg-offwhite dark:bg-gray-700 text-foreground hover:bg-black/10 dark:hover:bg-gray-600"
      }`}
      onClick={() => {
        console.log(`Switching to payment mode: ${mode}`);
        handlePaymentModeChange(mode);
      }}
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

  const handleProceedClick = () => {
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmPayment = () => {
    setIsConfirmDialogOpen(false);
    handleOrderProcessing();
  };

  return (
    <div className="flex flex-col gap-8 p-6 bg-offwhite dark:bg-gray-800 rounded-lg shadow-md">
     

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

      {paymentMode === "delivery" && paymentMethods.some(method => method.toLowerCase() === "delivery") && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Détails de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nom"
              value={deliveryForm.firstName || firstName}
              onChange={handleDeliveryChange}
              placeholder="Votre nom"
              name="firstName"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Prénom"
              value={deliveryForm.lastName || lastName}
              onChange={handleDeliveryChange}
              placeholder="Votre prénom"
              name="lastName"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Numéro de téléphone"
              value={deliveryForm.phoneNumber}
              onChange={(name, value) =>
                setDeliveryForm(prev => ({ ...prev, [name]: String(value) }))
              }
              placeholder="Votre numéro de téléphone"
              name="phoneNumber"
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
              <InputField
                label="Adresse complète"
                value={deliveryForm.address}
                onChange={handleDeliveryChange}
                placeholder="Votre adresse complète"
                name="address"
                disabled={isProcessingPayment}
              />
              {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground dark:text-gray-300">Ville</label>
              <p className="p-3 bg-gray-200 dark:bg-gray-600 text-foreground dark:text-gray-200 rounded-lg">{deliveryForm.city || "Sélectionnez sur la carte"}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground dark:text-gray-300">Province</label>
              <p className="p-3 bg-gray-200 dark:bg-gray-600 text-foreground dark:text-gray-200 rounded-lg">{deliveryForm.province || "Sélectionnez sur la carte"}</p>
            </div>
          </div>
        </div>
      )}

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

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Code promo</h2>
        <div className="flex-col gap-4 md:flex-row space-y-4">
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

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Récapitulatif</h2>
        <div className="p-4 bg-offwhite dark:bg-gray-700 border rounded-lg">
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Sous-total</span>
            <span>{calculateTotal().subtotal} DT</span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Réduction</span>
            <span>{discount} DT</span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Frais de livraison</span>
            <span>{calculateTotal().fee} DT</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-foreground dark:text-gray-200">
            <span>Total</span>
            <span>{calculateTotal().total} DT</span>
          </div>
        </div>
      </div>

      <Button
        className="px-6 py-3 bg-main text-foreground rounded-lg hover:bg-main/90 transition-all"
        onClick={handleProceedClick}
        disabled={isProcessingPayment || timer === 0}
        aria-label="Procéder au paiement"
      >
        {isProcessingPayment ? "Traitement en cours..." : "Procéder au paiement"}
      </Button>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmation</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground dark:text-gray-200">
              Êtes-vous sûr de vouloir continuer avec ces détails ?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="bg-offwhite text-foreground hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmPayment}
              className="bg-main text-foreground hover:bg-main/90"
            >
              Continuer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
