"use client";

import React, { useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount, IconMapPin } from "@tabler/icons-react";
import { PaymentStepProps } from "../types/paymentStep";
import { usePaymentStep } from "../hooks/usePaymentStep";
import LocationMap from "./LocationMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import Timer from "@/components/Timer";
import { useNavbar } from "@/hooks/useNavbar";

// Local DeliveryDetails for the form (matches usePaymentStep expectation)
interface LocalDeliveryDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  province: string;
}

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (name: keyof LocalDeliveryDetails, value: string) => void;
  placeholder: string;
  name: keyof LocalDeliveryDetails;
  disabled?: boolean;
}

type PaymentMode = "delivery" | "online";

type PaymentOptions = {
  delivery: {
    label: string;
    icon: React.ComponentType<{ stroke?: number; size?: number }>;
  };
  online: {
    label: string;
    icon: React.ComponentType<{ stroke?: number; size?: number }>;
  };
};

const InputField = memo(({ label, value, onChange, placeholder, name, disabled }: InputFieldProps) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-main border border-gray-600 transition-all"
        disabled={disabled}
        aria-label={label}
      />
    </div>
  );
}, (prevProps, nextProps) => (
  prevProps.value === nextProps.value &&
  prevProps.disabled === nextProps.disabled &&
  prevProps.label === nextProps.label &&
  prevProps.placeholder === nextProps.placeholder
));
InputField.displayName = "InputField";

const PaymentStep: React.FC<PaymentStepProps & {
  timer: number | null;
  timerError: string | null;
}> = memo(({
  paymentMode,
  handlePaymentModeChange,
  handleDeliveryChange: parentHandleDeliveryChange,
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
  timer,
  timerError,
}) => {
  const { userData } = useAuth();
  const { setOpenTicketDrawer } = useNavbar();

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
  const [deliveryForm, setDeliveryForm] = useState<LocalDeliveryDetails>({
    firstName: firstName,
    lastName: lastName,
    phoneNumber: phoneNumber,
    address: "",
    city: "",
    province: "",
  });
  const [feedback, setFeedback] = useState({
    isOpen: false,
    title: "",
    message: "",
    isSuccess: false,
  });

  const memoizedHandleDeliveryChange = useCallback((field: keyof LocalDeliveryDetails, value: string) => {
    setDeliveryForm(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });

    // Map LocalDeliveryDetails fields to ImportedDeliveryDetails fields
    switch (field) {
      case "firstName":
        parentHandleDeliveryChange("prename", value);
        break;
      case "lastName":
        parentHandleDeliveryChange("name", value);
        break;
      case "address":
        parentHandleDeliveryChange("address", value);
        break;
      default:
        // phoneNumber, city, and province are not in ImportedDeliveryDetails, so they’re ignored
        break;
    }
  }, [parentHandleDeliveryChange]);

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
    handleDeliveryChange: memoizedHandleDeliveryChange,
    couponCode,
    handleCouponChange,
    applyCoupon,
    calculateTotal,
    eventId,
    ticketDataList,
    locationIndex,
    periodIndex,
    timeIndex,
    extraFields,
    email,
    phoneNumber: deliveryForm.phoneNumber,
    firstName: deliveryForm.firstName,
    lastName: deliveryForm.lastName,
    mapRegion,
    onPaymentSuccess: (response) => {
      if (response.success && response.data?.payUrl) {
        setPaymentUrl(response.data.payUrl);
        setIsPaymentDialogOpen(true);
      } else {
        setFeedback({
          isOpen: true,
          title: response.success ? "Succès !" : "Erreur",
          message: response.message ||
            (response.success
              ? "Votre commande a été passée avec succès !"
              : "Une erreur est survenue lors du traitement de votre commande."),
          isSuccess: response.success,
        });
      }

      if (typeof onPaymentSuccess === "function") {
        onPaymentSuccess(response);
      }
    },
    deliveryForm,
  });

  const defaultPosition = { latitude: 36.8065, longitude: 10.1815 };
  const initialPosition = mapRegion || defaultPosition;


  const PaymentModeButtonComponent = ({
    mode,
    label,
    icon: Icon,
    isActive
  }: {
    mode: PaymentMode;
    label: string;
    icon: React.ComponentType<{ stroke?: number; size?: number }>;
    isActive: boolean;
  }) => (
    <Button
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg font-medium rounded-lg transition-all ${
        isActive
          ? "bg-gradient-to-r from-main to-main/90 text-white shadow-lg"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
      }`}
      onClick={() => handlePaymentModeChange(mode)}
      disabled={isProcessingPayment || timer === 0}
      aria-label={`Sélectionner le mode de paiement ${label}`}
    >
      <Icon stroke={1.5} size={24} />
      {label}
    </Button>
  );

  PaymentModeButtonComponent.displayName = "PaymentModeButton";
  const PaymentModeButton = memo(PaymentModeButtonComponent);

  const ExtraFieldInputComponent = ({ field }: { field: { field: string } }) => (
    <InputField
      label={field.field}
      value={extraFieldValues[field.field] || ""}
      onChange={(_, value: string) => setExtraFieldValues(prev => {
        if (prev[field.field] === value) return prev;
        return { ...prev, [field.field]: value };
      })}
      placeholder={`Entrez ${field.field}`}
      name={field.field as keyof LocalDeliveryDetails} // Type assertion
      disabled={isProcessingPayment}
    />
  );

  ExtraFieldInputComponent.displayName = "ExtraFieldInput";
  const ExtraFieldInput = memo(ExtraFieldInputComponent);

  const paymentOptions: PaymentOptions = {
    delivery: { label: "Livraison", icon: IconTruckDelivery },
    online: { label: "En ligne", icon: IconCreditCard },
  };
  const handleProceedClick = useCallback(() => setIsConfirmDialogOpen(true), []);
  const handleConfirmPayment = useCallback(() => {
    setIsConfirmDialogOpen(false);
    handleOrderProcessing();
  }, [handleOrderProcessing]);

  return (
    <div className="flex flex-col gap-8 p-6 bg-gray-900 rounded-xl shadow-xl">
      {paymentMethods.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">Mode de paiement</h2>
          <div className="flex flex-col md:flex-row gap-4">
            {paymentMethods.map((method) => {
              const option = paymentOptions[method.toLowerCase() as PaymentMode];
              if (!option) return null;
              return (
                <PaymentModeButton
                  key={method}
                  mode={method.toLowerCase() as PaymentMode}
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
          <h2 className="text-xl font-semibold text-white">Détails de livraison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Prénom"
              value={deliveryForm.firstName}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre prénom"
              name="firstName"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Nom"
              value={deliveryForm.lastName}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre nom"
              name="lastName"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Numéro de téléphone"
              value={deliveryForm.phoneNumber}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre numéro de téléphone"
              name="phoneNumber"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Adresse"
              value={deliveryForm.address}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre adresse"
              name="address"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Ville"
              value={deliveryForm.city}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre ville"
              name="city"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Province"
              value={deliveryForm.province}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre province"
              name="province"
              disabled={isProcessingPayment}
            />
            <div className="flex flex-col gap-2 col-span-2">
              <label className="text-sm font-medium text-gray-300">Adresse sur la carte</label>
              <Button
                onClick={() => setIsMapOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-main to-main/90 text-white"
                disabled={isProcessingPayment}
                aria-label="Sélectionner une adresse sur la carte"
              >
                <IconMapPin stroke={1.5} size={20} />
                Sélectionner sur la carte
              </Button>
              {addressError && <p className="text-sm text-red-400 mt-1">{addressError}</p>}
            </div>
          </div>
        </div>
      )}

      {extraFields.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-white">Informations supplémentaires</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extraFields.map((field) => (
              <ExtraFieldInput key={field.field} field={field} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Code promo</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-lg">
            <IconDiscount stroke={1.5} size={24} className="text-main" />
            <input
              type="text"
              placeholder="Entrez votre code promo"
              value={couponCode}
              onChange={handleCouponChange}
              className="flex-1 p-2 bg-transparent text-white focus:outline-none"
              disabled={isProcessingPayment}
              aria-label="Code promo"
            />
          </div>
          <Button
            className="px-6 py-3 bg-gradient-to-r from-main to-main/90 text-white"
            onClick={applyCoupon}
            disabled={isProcessingPayment}
            aria-label="Appliquer le code promo"
          >
            Appliquer
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-white">Récapitulatif de commande</h2>
        <div className="p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3">
          <div className="flex justify-between text-gray-300">
            <span>Sous-total</span>
            <span>{calculateTotal().subtotal} {currency}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>Réduction</span>
              <span>-{discount} {currency}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-300">
            <span>Frais de livraison</span>
            <span>{calculateTotal().fee} {currency}</span>
          </div>
          <div className="border-t border-gray-700 pt-3 mt-2">
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{calculateTotal().total} {currency}</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="px-6 py-8 bg-gradient-to-r from-main to-main/90 text-white text-lg font-semibold"
        onClick={handleProceedClick}
        disabled={isProcessingPayment || timer === 0}
        aria-label="Procéder au paiement"
      >
        {isProcessingPayment ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </div>
        ) : (
          "Procéder au paiement"
        )}
      </Button>

      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-gray-200 text-center">
              Avez-vous tout vérifié ?
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4 text-foreground dark:text-gray-200">
            {paymentMode === "delivery" ? (
              <>
                <p className="">
                  Vous serez contacté(e) par téléphone au <span className="font-semibold">{deliveryForm.phoneNumber}</span>.
                </p>
                <p className="">Vos billets seront livrés à l&apos;adresse suivante :</p>
                <p>
                  {deliveryForm.address ? (
                    <span className="font-semibold">{`${deliveryForm.address}, ${deliveryForm.city}, ${deliveryForm.province}`}</span>
                  ) : (
                    <span className="text-gray-500">Aucune adresse sélectionnée</span>
                  )}
                </p>
                <p className="text-sm opacity-80 mt-4">
                  Vérifiez vos informations. En cas d&apos;erreur, vous pouvez les modifier dans vos{" "}
                  <span className="font-semibold text-main">Paramètres  Modifier le profil</span>{" "}
                  avant de confirmer.
                </p>
              </>
            ) : (
              <></>
            )}
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-main text-foreground hover:bg-main/90 py-6 text-lg"
            >
              Oui, c&apos;est fait !
            </Button>
            <Button
              onClick={() => setIsConfirmDialogOpen(false)}
              className="w-full bg-transparent text-foreground hover:text-main py-6 text-lg"
            >
              Vérifier à nouveau
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border border-gray-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Sélectionnez votre adresse</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <LocationMap
              initialPosition={selectedPosition || initialPosition}
              onLocationSelect={handleLocationSelect}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsMapOpen(false)}
              className="bg-gradient-to-r from-main to-main/90 text-white"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[80vw] max-h-[80vh] bg-gray-800 border border-gray-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-white">Finaliser le paiement</DialogTitle>
            <div className="pt-2">
              <Timer time={timer} timerError={timerError} />
            </div>
          </DialogHeader>
          {paymentUrl ? (
            <iframe
              src={paymentUrl}
              className="w-full h-[60vh] border-0 rounded-lg bg-white"
              title="Passerelle de paiement"
              sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation"
            />
          ) : (
            <div className="flex items-center justify-center h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={() => setIsPaymentDialogOpen(false)}
              className="bg-gray-700 text-white hover:bg-gray-600"
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={feedback.isOpen} onOpenChange={(open) => setFeedback(prev => ({ ...prev, isOpen: open }))}>
        <DialogContent className="sm:max-w-[500px] bg-gray-800 border border-gray-700 rounded-xl">
          <DialogHeader>
            <DialogTitle className={feedback.isSuccess ? "text-green-400" : "text-red-400"}>
              {feedback.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-gray-300 space-y-6">
            {paymentMode === "delivery" && feedback.isSuccess ? (
              <>
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-green-600/20 rounded-full">
                    <IconTruckDelivery size={48} className="text-green-400" />
                  </div>
                  <p className="text-center">
                    Un agent vous contactera sous peu au{" "}
                    <span className="font-semibold text-white">{deliveryForm.phoneNumber}</span>{" "}
                    pour confirmer votre commande ! Gardez votre téléphone à portée de main.
                  </p>
                  <p className="text-center text-sm text-gray-400">
                    En cas d&apos;erreur sur votre numéro, vous pouvez annuler la commande avant confirmation
                    et en passer une nouvelle pour la livraison. Pas de stress !
                  </p>
                </div>
              </>
            ) : (
              <>
                <p className="text-center">{feedback.message}</p>
                {feedback.message && (
                  <>
                    <p className="text-center text-sm text-gray-400">
                      Félicitations ! Votre commande a été traitée avec succès. Nous vous
                      remercions d&apos;avoir choisi d&apos;utiliser votre carte de crédit pour votre
                      achat.
                    </p>
                    <p className="text-center text-sm text-gray-400">
                      Vous pouvez voir vos billets dans la section Billets.
                    </p>
                  </>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setFeedback(prev => ({ ...prev, isOpen: false }));
                setOpenTicketDrawer(true);
              }}
              className={`w-full py-4 text-lg font-semibold ${
                feedback.isSuccess
                  ? "bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
                  : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
            >
              {paymentMode === "delivery" && feedback.isSuccess ? "Compris !" : "OK"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}, (prevProps, nextProps) => (
  prevProps.paymentMode === nextProps.paymentMode &&
  prevProps.couponCode === nextProps.couponCode &&
  prevProps.discount === nextProps.discount &&
  prevProps.timer === nextProps.timer &&
  prevProps.timerError === nextProps.timerError &&
  prevProps.ticketDataList === nextProps.ticketDataList
));

PaymentStep.displayName = "PaymentStep";
export default PaymentStep;