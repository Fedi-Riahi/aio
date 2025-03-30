

export interface DeliveryDetails {
  name: string;
  prename: string;
  address: string;
  city?: string;
  province?: string;
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
  currency: string;
  email?: string;
  phoneNumber?: string;
  paymentMethods?: string[];
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
  data_related_to_delivery?: {
    name: string;
    address: string;
    province: string;
    city: string;
    phone: string;
  };
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  promoCode?: string;
  phoneNumber: string;
  currency: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
