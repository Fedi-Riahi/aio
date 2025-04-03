"use client";

import React, { useEffect, useState, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount, IconMapPin } from "@tabler/icons-react";
import { PaymentStepProps } from "../types/paymentStep";
import { usePaymentStep } from "../hooks/usePaymentStep";
import LocationMap from "./LocationMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";
import Timer from "@/components/Timer";
import { useNavbar } from "@/hooks/useNavbar";

const InputField = memo(({ label, value, onChange, placeholder, name, disabled }: any) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(name, e.target.value);
    },
    [name, onChange]
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground dark:text-gray-300">{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="p-3 bg-offwhite dark:bg-gray-700 text-foreground dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
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
  const [deliveryForm, setDeliveryForm] = useState({
    firstName,
    lastName,
    phoneNumber,
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

  const memoizedHandleDeliveryChange = useCallback((field: string, value: string) => {
    setDeliveryForm(prev => {
      if (prev[field] === value) return prev;
      return { ...prev, [field]: value };
    });
    parentHandleDeliveryChange(field, value);
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
    phoneNumber: deliveryForm.phoneNumber || phoneNumber,
    firstName: deliveryForm.firstName || firstName,
    lastName: deliveryForm.lastName || lastName,
    mapRegion,
    onPaymentSuccess: (response) => {
      if (response.success && response.data?.payUrl) {
        setPaymentUrl(response.data.payUrl);
        setIsPaymentDialogOpen(true);
      } else {
        setFeedback({
          isOpen: true,
          title: response.success ? "Succès!" : "Erreur",
          message: response.message ||
            (response.success
              ? "Votre commande a été passée avec succès!"
              : "Une erreur s'est produite lors du traitement de votre commande."),
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

  const PaymentModeButton = memo(({ mode, label, icon: Icon, isActive }: {
    mode: string;
    label: string;
    icon: any;
    isActive: boolean
  }) => (
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
  ));

  const ExtraFieldInput = memo(({ field }: { field: { field: string } }) => (
    <InputField
      label={field.field}
      value={extraFieldValues[field.field] || ""}
      onChange={(_, value: string) => setExtraFieldValues(prev => {
        if (prev[field.field] === value) return prev;
        return { ...prev, [field.field]: value };
      })}
      placeholder={`Entrez ${field.field}`}
      name={field.field}
      disabled={isProcessingPayment}
    />
  ));

  const paymentOptions = {
    delivery: { label: "Livraison", icon: IconTruckDelivery },
    online: { label: "En ligne", icon: IconCreditCard },
  };

  const handleProceedClick = useCallback(() => setIsConfirmDialogOpen(true), []);
  const handleConfirmPayment = useCallback(() => {
    setIsConfirmDialogOpen(false);
    handleOrderProcessing();
  }, [handleOrderProcessing]);

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
              value={deliveryForm.firstName}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre nom"
              name="firstName"
              disabled={isProcessingPayment}
            />
            <InputField
              label="Prénom"
              value={deliveryForm.lastName}
              onChange={memoizedHandleDeliveryChange}
              placeholder="Votre prénom"
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
                onChange={memoizedHandleDeliveryChange}
                placeholder="Votre adresse complète"
                name="address"
                disabled={isProcessingPayment}
              />
              {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
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
        <DialogContent className="sm:max-w-[500px] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className="text-foreground dark:text-gray-200 text-center">
              Avez-vous tout vérifié ?
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4 text-foreground dark:text-gray-200">
            <p className="">
              Vous serez contacté(e) par téléphone au <span className="font-semibold">{deliveryForm.phoneNumber || phoneNumber}</span>.
            </p>
            <p className="">Vos billets seront livrés à l'adresse suivante :</p>
            <p>
              {deliveryForm.address ? (
                <span className="font-semibold">{deliveryForm.address}</span>
              ) : (
                <span className="text-gray-500">Aucune adresse sélectionnée</span>
              )}
            </p>
            <p className="text-sm opacity-80 mt-4">
              Vérifiez votre numéro de téléphone. En cas d'erreur, vous pouvez le modifier dans vos{" "}
              <span className="font-semibold text-main">Paramètres &gt; Modifier le profil</span>{" "}
              avant de commander vos billets.
            </p>
          </div>
          <DialogFooter className="flex flex-col gap-2">
            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-main text-foreground hover:bg-main/90 py-6 text-lg"
            >
              Oui, c'est fait !
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
        <DialogContent className="sm:max-w-[600px] bg-background border border-offwhite">
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
            <Timer time={timer} timerError={timerError} />
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

      <Dialog open={feedback.isOpen} onOpenChange={(open) => setFeedback(prev => ({...prev, isOpen: open}))}>
        <DialogContent className="sm:max-w-[500px] bg-background border border-offwhite">
          <DialogHeader>
            <DialogTitle className={feedback.isSuccess ? "text-main" : "text-main"}>
              {paymentMode !== "delivery" && (
                  <span>{feedback.message}</span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-foreground dark:text-gray-200 space-y-4">
            {paymentMode === "delivery" && feedback.isSuccess ? (
              <>
              <div className="flex items-center justify-center">
                  <IconTruckDelivery size={80} className="text-main"/>
              </div>
                <p className="text-center">
                  Un agent vous contactera sous peu au{" "}
                  <span className="font-semibold">{deliveryForm.phoneNumber || phoneNumber}</span>{" "}
                  pour confirmer votre commande ! Gardez votre téléphone à portée de main.
                </p>
                <p className="text-center text-sm opacity-80">
                  En cas d'erreur sur votre numéro, vous pouvez toujours annuler la commande avant sa confirmation
                  et en repasser une pour la livraison. Pas de stress !
                </p>
              </>
            ) : (
              <>
                <p className="text-center">{feedback.message}</p>
                {feedback.message && (
                  <p className="text-center text-sm opacity-80">
                    Vous pouvez voir vos tickets dans la partie Billets.
                  </p>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setFeedback(prev => ({...prev, isOpen: false}));
                setOpenTicketDrawer(true);
              }}
              className="w-full bg-main hover:bg-main/90 py-6 text-lg"
            >
              {paymentMode === "delivery" && feedback.isSuccess ? "Parfait" : "OK"}
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
  prevProps.isProcessingPayment === nextProps.isProcessingPayment &&
  prevProps.ticketDataList === nextProps.ticketDataList
));

PaymentStep.displayName = "PaymentStep";
export default PaymentStep;
