import { OrderRequestBody, PaymentStepProps } from "../types/paymentStep";

const isDev = process.env.NODE_ENV === "development"; 
export const createOrderRequestBody = (
  props: Pick<
    PaymentStepProps,
    | "eventId"
    | "ticketDataList"
    | "locationIndex"
    | "periodIndex"
    | "timeIndex"
    | "paymentMode"
    | "extraFields"
    | "email"
    | "phoneNumber"
    | "calculateTotal"
  > & {
    firstName: string;
    lastName: string;
  }
): OrderRequestBody => {
  const { total } = props.calculateTotal();
  return {
    event_id: props.eventId,
    ticketDataList: props.ticketDataList,
    location_index: props.locationIndex,
    period_index: props.periodIndex,
    time_index: props.timeIndex,
    delivery: props.paymentMode === "delivery",
    extraFields: props.extraFields || [],
    amount: total * 1000,
    email: props.email,
    phoneNumber: props.phoneNumber,
    currency: "TND",
    firstName: props.firstName,
    lastName: props.lastName,
  };
};

export const processOnlinePayment = async (orderRequestBody: OrderRequestBody): Promise<string> => {
  if (isDev) {
    console.log("Sending order request:", JSON.stringify(orderRequestBody, null, 2));
  }

  const paymentResponse = await fetch("/api/konnect/createPaymentLink", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderRequestBody),
  });

  if (!paymentResponse.ok) {
    const errorText = await paymentResponse.text();
    if (isDev) {
      console.error("Server Error Response:", errorText);
    }
    const errorData = JSON.parse(errorText);
    throw new Error(errorData.details || "Failed to create payment link");
  }

  const result = await paymentResponse.json();
  const { payment_link } = result;

  if (!payment_link) {
    throw new Error("No payment link received");
  }

  return payment_link;
};
