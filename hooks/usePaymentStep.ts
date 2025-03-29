import { useState, useEffect, useCallback } from "react";
import { PaymentStepProps, Coordinates } from "../types/paymentStep";
import { createOrderRequestBody, processOnlinePayment } from "../utils/paymentStepUtils";

export const usePaymentStep = ({
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
}: Omit<PaymentStepProps, "discount" | "walletId" | "currency"> & {
  mapRegion?: Coordinates;
  firstName: string;
  lastName: string;
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Coordinates | null>(mapRegion || null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!selectedPosition || !selectedPosition.latitude || !selectedPosition.longitude) {
        setAddressError("Location not selected.");
        return;
      }

      const apiKey = "ZcbGjTXz-jafgmOq_0vUDlS1xZOe-55AAz6q3Y2Io_c";
      const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${selectedPosition.latitude}%2C${selectedPosition.longitude}&lang=fr-FR&apiKey=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.items && data.items.length > 0) {
          const address = data.items[0].address.label;
          handleDeliveryChange("address", address);
          setAddressError(null);
        } else {
          setAddressError("No address found for the selected location.");
          handleDeliveryChange("address", "");
        }
      } catch (error) {
        setAddressError("Failed to fetch address. Please try again.");
        handleDeliveryChange("address", "");
      }
    };

    fetchAddress();
  }, [selectedPosition, handleDeliveryChange]);

  const handleLocationSelect = (coords: Coordinates) => {
    setSelectedPosition(coords);
    setIsMapOpen(false);
  };

  const handleOnlinePayment = useCallback(async () => {
    setIsProcessingPayment(true);

    if (!eventId || !ticketDataList || ticketDataList.length === 0 || !email) {
      alert("Error: Required fields (event ID, ticket data, or email) are missing.");
      setIsProcessingPayment(false);
      return;
    }

    try {
      const orderRequestBody = createOrderRequestBody({
        eventId,
        ticketDataList,
        locationIndex,
        periodIndex,
        timeIndex,
        paymentMode,
        extraFields,
        email,
        phoneNumber,
        firstName,
        lastName,
        calculateTotal,
      });

      const paymentLink = await processOnlinePayment(orderRequestBody);
      window.open(paymentLink, "_blank");

      if (onPaymentSuccess) {
        onPaymentSuccess(ticketDataList);
      }
    } catch (error) {
      alert(`An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsProcessingPayment(false);
    }
  }, [
    eventId,
    ticketDataList,
    locationIndex,
    periodIndex,
    timeIndex,
    paymentMode,
    extraFields,
    email,
    phoneNumber,
    firstName,
    lastName,
    calculateTotal,
    onPaymentSuccess,
  ]);

  return {
    isProcessingPayment,
    handleOnlinePayment,
    addressError,
    isMapOpen,
    setIsMapOpen,
    selectedPosition,
    handleLocationSelect,
  };
};
