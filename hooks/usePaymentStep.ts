import { useState, useEffect, useCallback } from "react";
import { PaymentStepProps, Coordinates } from "../types/paymentStep";
import { createOrderRequestBody, processOrder } from "../utils/paymentStepUtils";

export const usePaymentStep = ({
  paymentMode,
  handleDeliveryChange,
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
  couponCode,
  deliveryDetails,
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
          const city = data.items[0].address.city || "";
          const province = data.items[0].address.state || "";

          handleDeliveryChange("address", address);
          handleDeliveryChange("city", city);
          handleDeliveryChange("province", province);
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

  const handleOrderProcessing = useCallback(async () => {
    setIsProcessingPayment(true);

    try {
      // Validate required fields
      if (!eventId || !ticketDataList || ticketDataList.length === 0) {
        throw new Error("Event ID and at least one ticket are required");
      }

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
        couponCode,
        deliveryDetails,
        calculateTotal,
      });

      const response = await processOrder(orderRequestBody);

      if (response.success) {
        // Pass the entire response to onPaymentSuccess for PaymentStep to handle
        onPaymentSuccess(response);
      } else {
        alert(response.error?.details || "Failed to process order");
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unknown error occurred");
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
    couponCode,
    deliveryDetails,
    calculateTotal,
    onPaymentSuccess,
  ]);

  return {
    isProcessingPayment,
    handleOrderProcessing,
    addressError,
    isMapOpen,
    setIsMapOpen,
    selectedPosition,
    handleLocationSelect,
  };
};
