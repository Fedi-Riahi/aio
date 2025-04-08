import { DeliveryDetails } from "./ticketDrawer";
export interface Coordinates {
    latitude: number;
    longitude: number;
  }

  export interface TicketData {
    ticket_id: string;
    name: string;
    ticket_index?: number;
    seat_index?: string;
  }

  export interface PaymentStepProps {
    paymentMode: string | null;
    handlePaymentModeChange: (mode: "delivery" | "online") => void;
    handleDeliveryChange: (field: keyof DeliveryDetails, value: string) => void;
    couponCode: string;
    handleCouponChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    applyCoupon: () => void;
    discount: number;
    calculateTotal: () => { subtotal: number; fee: number; total: number };
    eventId: string;
    ticketDataList: TicketData[];
    locationIndex?: number;
    periodIndex?: number;
    timeIndex?: number;
    extraFields?: { field: string }[];
    currency?: string;
    email?: string;
    phoneNumber?: string;
    mapRegion?: Coordinates;
    onPaymentSuccess: (response: any) => void;
    paymentMethods?: string[];
  }

  export interface OrderRequestBody {
    event_id: string;
    ticketDataList: TicketData[];
    location_index: number;
    period_index: number;
    time_index: number;
    delivery: boolean; // Changed to required boolean
    extraFields?: { field: string; value: string }[];
    data_related_to_delivery?: { // Optional if delivery is false, required if true
      name: string;
      address: string;
      province: string;
      city: string;
      phone: string;
    };
  }
