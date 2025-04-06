import apiClient from "./apiClient";
import { OrderRequestBody, TicketData } from "../types/paymentStep";

interface TimerResponse {
  success: boolean;
  respond: {
    msg: string;
    data?: { timer: number };
    error?: { code?: string; details?: string };
  };
}

interface OrderResponse {
  success: boolean;
  data?: { order_id?: string; payUrl?: string; isFreeOrder?: boolean; delivery?: boolean };
  msg?: string;
  error?: { code: string; details: string };
}

export const createOrderRequestBody = ({
  eventId,
  ticketDataList,
  locationIndex = 0,
  periodIndex = 0,
  timeIndex = 0,
  paymentMode,
  extraFields,
  phoneNumber,
  firstName,
  lastName,
}: {
  eventId: string;
  ticketDataList: TicketData[];
  locationIndex?: number;
  periodIndex?: number;
  timeIndex?: number;
  paymentMode?: string | null;
  extraFields?: { field: string; value: string }[];
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  couponCode?: string;
  calculateTotal?: () => { subtotal: number; fee: number; total: number };
}): OrderRequestBody => {
  const body: OrderRequestBody = {
    event_id: eventId,
    ticketDataList: ticketDataList.map((ticket) => ({
      ticket_id: ticket.ticket_id,
      name: ticket.name,
      ticket_index: ticket.ticket_index ?? 0,
      seat_index: ticket.seat_index || "N/A",
    })),
    location_index: locationIndex,
    period_index: periodIndex,
    time_index: timeIndex,
    delivery: paymentMode === "delivery",
  };

  if (body.delivery) {
    if (!firstName || !lastName || !phoneNumber) {
      throw new Error("Delivery requires firstName, lastName, and phoneNumber");
    }
    body.data_related_to_delivery = {
      name: `${firstName} ${lastName}`.trim(),
      address: "",
      province: "",
      city: "",
      phone: String(phoneNumber),
    };
  }

  if (extraFields && extraFields.length > 0) {
    body.extraFields = extraFields;
  }

  console.log("Final Order Request Body:", JSON.stringify(body, null, 2));
  return body;
};

export const startOrderTimer = async (requestBody: {
  event_id: string;
  ticketDataList: TicketData[];
  location_index: number;
  period_index: number;
  time_index: number;
}): Promise<TimerResponse> => {
  try {
    if (!requestBody.ticketDataList || requestBody.ticketDataList.length === 0) {
      throw new Error("ticketDataList is empty or undefined");
    }
    requestBody.ticketDataList.forEach((ticket, index) => {
      if (!ticket.ticket_id || !ticket.name) {
        throw new Error(`Invalid ticket at index ${index}: missing ticket_id or name`);
      }
    });

    const response = await apiClient.post(`/normalaccount/buyticket/limit/${requestBody.event_id}`, requestBody);

    console.log("Timer response:", response.data);

    if (!response.data.success || !response.data.respond?.data?.timer) {
      throw new Error("Invalid timer response format: " + JSON.stringify(response.data));
    }

    return response.data as TimerResponse;
  } catch (error: any) {
    return {
      success: false,
      respond: {
        msg: "Failed to start timer",
        error: {
          code: "TIMER_ERROR",
          details: error.message,
        },
      },
    };
  }
};

export const processOrder = async (orderRequestBody: OrderRequestBody): Promise<OrderResponse> => {
    try {
      const timerRequest = {
        event_id: orderRequestBody.event_id,
        ticketDataList: orderRequestBody.ticketDataList,
        location_index: orderRequestBody.location_index ?? 0,
        period_index: orderRequestBody.period_index ?? 0,
        time_index: orderRequestBody.time_index ?? 0,
      };

      const timerResponse = await startOrderTimer(timerRequest);
      if (!timerResponse.success) {
        // Handle order limit specifically
        if (timerResponse.respond.error?.code === "ORDER_LIMIT_EXCEEDED") {
          return {
            success: false,
            error: {
              code: "ORDER_LIMIT_EXCEEDED",
              details: "Vous avez atteint la limite de commandes autorisées pour cet événement"
            }
          };
        }
        throw new Error(timerResponse.respond.error?.details || "Failed to initialize order timer");
      }

      const response = await apiClient.post("/normalaccount/order", orderRequestBody);

      if (!response.data.success) {
        const error = response.data.error || response.data.respond?.error || {
          code: "UNKNOWN_ERROR",
          details: response.data.respond?.msg || "Unknown error occurred",
        };
        return { success: false, error };
      }

      return {
        success: true,
        data: {
          payUrl: response.data.respond?.data?.payUrl,
          order_id: response.data.respond?.data?.order_id,
          isFreeOrder: response.data.respond?.data?.isFreeOrder,
          delivery: response.data.respond?.data?.delivery,
        },
        msg: response.data.respond?.msg,
      };
    } catch (error: any) {
      console.error("Order processing error:", error);
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          details: error.message || "Network request failed",
        },
      };
    }
  };
