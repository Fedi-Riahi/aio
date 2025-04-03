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
  onPaymentSuccess,
  deliveryForm,
}: Omit<PaymentStepProps, "discount" | "walletId" | "currency"> & {
  mapRegion?: Coordinates;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  deliveryForm: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    city: string;
    province: string;
  };
}) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Coordinates | null>(null);

  const fetchAddress = useCallback(async (position: Coordinates) => {
    if (!position || !position.latitude || !position.longitude) {
      setAddressError("Location not selected.");
      return;
    }

    const apiKey = "ZcbGjTXz-jafgmOq_0vUDlS1xZOe-55AAz6q3Y2Io_c";
    const url = `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${position.latitude}%2C${position.longitude}&lang=fr-FR&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        const address = data.items[0].address.label || "Unknown Address";
        const city = data.items[0].address.city || "Unknown City";
        const province = data.items[0].address.state || data.items[0].address.city;

        handleDeliveryChange("address", address);
        handleDeliveryChange("city", city);
        handleDeliveryChange("province", province);
        setAddressError(null);
      } else {
        setAddressError("No address found for the selected location.");
        handleDeliveryChange("address", "Unknown Address");
        handleDeliveryChange("city", "Unknown City");
        handleDeliveryChange("province", "Unknown Province");
      }
    } catch (error) {
      setAddressError("Failed to fetch address. Please try again.");
      handleDeliveryChange("address", "Unknown Address");
      handleDeliveryChange("city", "Unknown City");
      handleDeliveryChange("province", "Unknown Province");
    }
  }, [handleDeliveryChange]);

  useEffect(() => {
    if (selectedPosition) {
      fetchAddress(selectedPosition);
    }
  }, [selectedPosition, fetchAddress]);

  const handleLocationSelect = useCallback(async (coords: Coordinates) => {
    setSelectedPosition(coords);
    setIsMapOpen(false);
  }, []);

  const handleOrderProcessing = useCallback(async () => {
    setIsProcessingPayment(true);

    try {
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
        calculateTotal,
      });

      if (orderRequestBody.delivery) {
        const deliveryData = {
          name: `${deliveryForm.firstName || firstName} ${deliveryForm.lastName || lastName}`.trim(),
          address: deliveryForm.address || "",
          city: deliveryForm.city || "",
          province: deliveryForm.province || "",
          phone: deliveryForm.phoneNumber || phoneNumber || "",
        };

        if (!deliveryData.name || !deliveryData.address || !deliveryData.city || !deliveryData.province || !deliveryData.phone) {
          throw new Error("All delivery fields (name, address, city, province, phone) must be provided");
        }

        orderRequestBody.data_related_to_delivery = deliveryData;
      }

      console.log("Order Request Body:", JSON.stringify(orderRequestBody, null, 2));

      const response = await processOrder(orderRequestBody);

      if (response.success) {
        // Check for "Order Finished" message (adjust based on actual response structure)
        const isOrderFinished = response.data?.message === "Order Finished" || response.data?.status === "finished";
        onPaymentSuccess({
          ...response,
          nextStep: isOrderFinished ? "confirmation" : undefined, // Signal to move to confirmation
        });
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
    calculateTotal,
    onPaymentSuccess,
    deliveryForm,
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
