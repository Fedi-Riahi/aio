import { OrderRequestBody, TicketData } from '../types/paymentStep';

const API_BASE_URL = 'https://api-prod.aio.events/api/normalaccount';

interface TimerResponse {
  success: boolean;
  respond: {
    msg: string;
    data?: {
      timer: number;
    };
    error?: {
      code?: string;
      details?: string;
    };
  };
}

interface OrderResponse {
  success: boolean;
  data?: {
    order_id?: string;
    payUrl?: string;
    isFreeOrder?: boolean;
    delivery?: boolean;
  };
  msg?: string;
  error?: {
    code: string;
    details: string;
  };
}

const getAuthToken = (): string => {
  const authTokens = localStorage.getItem('authTokens');
  if (!authTokens) {
    throw new Error("User not authenticated");
  }
  const parsedTokens = JSON.parse(authTokens);
  const { access_token } = parsedTokens;
  if (!access_token) {
    throw new Error("Invalid authentication token");
  }
  return access_token;
};

export const createOrderRequestBody = ({
  eventId,
  ticketDataList,
  locationIndex = 0,
  periodIndex = 0,
  timeIndex = 0,
  paymentMode,
  extraFields,
  email,
  phoneNumber,
  firstName,
  lastName,
  couponCode,
  deliveryDetails,
  calculateTotal,
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
  deliveryDetails?: any;
  calculateTotal?: () => { subtotal: number; fee: number; total: number };
}): OrderRequestBody => {
  // Minimal payload to match Postman
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
  };

  // Optionally add other fields if needed (commented out for minimal test)
  // if (paymentMode && paymentMode !== null) body.paymentMode = paymentMode;
  // if (extraFields) body.extraFields = extraFields;
  // if (email) body.email = email;
  // if (phoneNumber) body.phoneNumber = phoneNumber;
  // if (firstName) body.firstName = firstName;
  // if (lastName) body.lastName = lastName;
  // if (couponCode) body.couponCode = couponCode;
  // if (deliveryDetails) body.deliveryDetails = deliveryDetails;
  // if (calculateTotal) body.total = calculateTotal().total;

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
    const access_token = getAuthToken();
    const requestDetails = {
      url: `${API_BASE_URL}/buyticket/limit/${requestBody.event_id}`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(requestBody, null, 2),
    };
    console.log("Sending timer request:", requestDetails);

    if (!requestBody.ticketDataList || requestBody.ticketDataList.length === 0) {
      throw new Error("ticketDataList is empty or undefined");
    }
    requestBody.ticketDataList.forEach((ticket, index) => {
      if (!ticket.ticket_id || !ticket.name) {
        throw new Error(`Invalid ticket at index ${index}: missing ticket_id or name`);
      }
    });

    const response = await fetch(requestDetails.url, {
      method: requestDetails.method,
      headers: requestDetails.headers,
      body: requestDetails.body,
    });

    let result: any;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("JSON parse error in startOrderTimer:", jsonError);
      const rawText = await response.text();
      console.log("Raw timer response text:", rawText);
      result = { success: false, message: `Invalid JSON response: ${rawText}` };
    }

    console.log("Timer response:", {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      body: result,
    });

    if (!response.ok) {
      const errorMsg =
        result?.respond?.error?.details ||
        result?.respond?.msg ||
        result?.message ||
        `Server error: ${response.status}`;
      throw new Error(errorMsg);
    }

    if (!result.success || !result.respond?.data?.timer) {
      throw new Error("Invalid timer response format: " + JSON.stringify(result));
    }

    return result as TimerResponse;
  } catch (error) {
    console.error("Timer start error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      respond: {
        msg: "Failed to start timer",
        error: {
          code: "TIMER_ERROR",
          details: error instanceof Error ? error.message : String(error),
        },
      },
    };
  }
};

export const processOrder = async (orderRequestBody: OrderRequestBody): Promise<OrderResponse> => {
  try {
    const access_token = getAuthToken();

    const timerRequest = {
      event_id: orderRequestBody.event_id,
      ticketDataList: orderRequestBody.ticketDataList,
      location_index: orderRequestBody.location_index ?? 0,
      period_index: orderRequestBody.period_index ?? 0,
      time_index: orderRequestBody.time_index ?? 0,
    };

    const timerResponse = await startOrderTimer(timerRequest);
    if (!timerResponse.success) {
      throw new Error(timerResponse.respond.error?.details || "Failed to initialize order timer");
    }

    const requestDetails = {
      url: `${API_BASE_URL}/order`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`,
      },
      body: JSON.stringify(orderRequestBody, null, 2),
    };
    console.log("Sending order request:", requestDetails);

    const response = await fetch(requestDetails.url, {
      method: requestDetails.method,
      headers: requestDetails.headers,
      body: requestDetails.body,
    });

    let result: any;
    try {
      result = await response.json();
    } catch (jsonError) {
      console.error("JSON parse error in processOrder:", jsonError);
      const rawText = await response.text();
      console.log("Raw order response text:", rawText);
      result = { success: false, message: `Invalid JSON response: ${rawText}` };
    }

    console.log("Order response:", {
      status: response.status,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries()),
      body: result,
    });

    if (!response.ok || !result.success) {
      const error = result.error || result.respond?.error || {
        code: "UNKNOWN_ERROR",
        details: result.respond?.msg || result.message || "Unknown error occurred",
      };
      return { success: false, error };
    }

    return {
      success: true,
      data: {
        payUrl: result.respond?.data?.payUrl,
        order_id: result.respond?.data?.order_id,
        isFreeOrder: result.respond?.data?.isFreeOrder,
        delivery: result.respond?.data?.delivery,
      },
      msg: result.respond?.msg,
    };
  } catch (error) {
    console.error("Order processing error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        details: error instanceof Error ? error.message : "Network request failed",
      },
    };
  }
};
