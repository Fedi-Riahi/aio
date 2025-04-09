// types/ticketsSheet.ts
export interface Order {
  _id: string;
  order_id: string;
  ticketsCount: number;
  totalPrice: number;
  paymentMethod: string;
  event_name: string;
  owners: string;
  paymentState: string;
  deliveryState: number;
}

export interface TicketData {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  location: string;
  referenceCode: string;
  orderId: string;
  background_thumbnail : string,
}

export interface TicketDrawer {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}