"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { IconTruckDelivery, IconCreditCard, IconDiscount, IconMapPin } from "@tabler/icons-react";
import { PaymentStepProps } from "../types/paymentStep";
import { usePaymentStep } from "../hooks/usePaymentStep";
import LocationMap from "./LocationMap";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useAuth } from "../context/AuthContext";

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
  locationIndex,
  periodIndex,
  timeIndex,
  extraFields = [],
  currency,
  email: propEmail,
  phoneNumber: propPhoneNumber,
  mapRegion,
  onPaymentSuccess,
}) => {
  const { userData } = useAuth();

  const email = userData?.email || propEmail || "";
  const phoneNumber = userData?.phone_number || propPhoneNumber || "";
  const firstName = userData?.username || deliveryDetails.name || "Client";
  const lastName = deliveryDetails.prename || "Client";

  const {
    isProcessingPayment,
    handleOnlinePayment,
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
    extraFields,
    email,
    phoneNumber,
    firstName,
    lastName,
    mapRegion,
    onPaymentSuccess,
  });

  const defaultPosition = { latitude: 36.8065, longitude: 10.1815 };
  const initialPosition = mapRegion || defaultPosition;

  const PaymentModeButton = ({ mode, label, icon: Icon, isActive }) => (
    <Button
      className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 text-lg shadow-sm hover:shadow-md font-medium rounded-lg transition duration-300 ${
        isActive
          ? "bg-main text-foreground border-main"
          : "bg-offwhite dark:bg-gray-700 text-foreground hover:bg-black/10 dark:hover:bg-gray-600"
      }`}
      onClick={() => handlePaymentModeChange(mode)}
      disabled={isProcessingPayment}
      aria-label={`Sélectionner le mode de paiement ${label}`}
    >
      <Icon stroke={1.5} size={24} />
      {label}
    </Button>
  );

  const InputField = ({ label, value, onChange, placeholder, name, disabled }) => (
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

  return (
    <div className="flex flex-col gap-8 p-6 bg-offwhite dark:bg-gray-800 rounded-lg shadow-md">
      {/* Sélection du mode de paiement */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Mode de paiement</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <PaymentModeButton
            mode="delivery"
            label="Livraison"
            icon={IconTruckDelivery}
            isActive={paymentMode === "delivery"}
          />
          <PaymentModeButton
            mode="online"
            label="En ligne"
            icon={IconCreditCard}
            isActive={paymentMode === "online"}
          />
        </div>
      </div>

      {paymentMode === "delivery" && (
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
                  <span className="text-sm font-medium text-foreground dark:text-gray-300">Adresse sélectionnée :</span>{" "}
                  {deliveryDetails.address || ""}
                </p>
              </div>
              {addressError && <p className="text-red-500 text-sm mt-1">{addressError}</p>}
            </div>
          </div>
        </div>
      )}

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

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Récapitulatif</h2>
        <div className="p-4 bg-offwhite dark:bg-gray-700 border rounded-lg">
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Sous-total</span>
            <span>
              {currency} {calculateTotal().subtotal}
            </span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Réduction</span>
            <span>
              {currency} {discount}
            </span>
          </div>
          <div className="flex justify-between text-sm text-foreground dark:text-gray-200">
            <span>Frais de livraison</span>
            <span>
              {currency} {calculateTotal().fee}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-foreground dark:text-gray-200">
            <span>Total</span>
            <span>
              {currency} {calculateTotal().total}
            </span>
          </div>
        </div>
      </div>

      <Button
        className="px-6 py-3 bg-main text-foreground rounded-lg hover:bg-main/90 transition-all"
        onClick={handleOnlinePayment}
        disabled={isProcessingPayment}
        aria-label="Procéder au paiement"
      >
        {isProcessingPayment ? "Traitement en cours..." : "Procéder au paiement"}
      </Button>

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
    </div>
  );
};

export default PaymentStep;
