export interface DeliveryDetails {
    name: string;
    prename: string;
    address: string;
  }

  export interface TicketData {
    ticket_id: string;
    name: string;
    ticket_index: number;
    seat_index: string;
  }

  export interface ExtraField {
    field: string;
    value: string;
  }

  export interface PaymentStepProps {
    paymentMode: "delivery" | "online" | null;
    handlePaymentModeChange: (mode: "delivery" | "online") => void;
    deliveryDetails: DeliveryDetails;
    handleDeliveryChange: (field: keyof DeliveryDetails, value: string) => void;
    couponCode: string;
    handleCouponChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    applyCoupon: () => void;
    discount: number;
    calculateTotal: () => { subtotal: number; reduction: number; fee: number; total: number };
    eventId: string;
    ticketDataList: TicketData[];
    locationIndex: number;
    periodIndex: number;
    timeIndex: number;
    extraFields?: ExtraField[];
    walletId: string;
    currency: string;
    email: string;
    phoneNumber: string;
    mapRegion?: { latitude: number; longitude: number };
    onPaymentSuccess?: (ticketDataList: TicketData[]) => void;
  }

  export interface OrderRequestBody {
    event_id: string;
    ticketDataList: TicketData[];
    location_index: number;
    period_index: number;
    time_index: number;
    delivery: boolean;
    extraFields: ExtraField[];
    amount: number;
    firstName: string; // Added for Konnect payload
  lastName: string; // Added for Konnect payload
    email: string;
    phoneNumber: string;
    currency: string;
  }

  export interface Coordinates {
    latitude: number;
    longitude: number;
  }
