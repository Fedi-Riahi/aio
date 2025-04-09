import { Ticket, TicketType, TicketGroup } from "../types/eventDetails";

export interface Seat {
  seat_index: string;
  is_removed: boolean;
  _id: string;
}

export interface SeatData {
  seats: { list_of_seat: Seat[] };
  room_name: string;
  taken: string[];
}

export interface TicketDrawerProps {
  tickets: Ticket[];
  isOpen: boolean;
  onClose: () => void;
  eventType: string;
  ticketType: TicketType[];
  eventId: string;
  periodIndex?: number;
  locationIndex?: number;
  timeIndex?: number;
  ticketIndex?: number;
  ticketsGroups?: TicketGroup[];
  paymentMethods?: string[];
  hasSeatTemplate?: boolean | null;
  extraFields?: { field: string; value?: string }[];
  seatData?: SeatData | null;
}

export interface DeliveryDetails {
  name: string;
  prename: string;
  address: string;
}

export interface TicketOrder {
  event_id: { id: string };
  period_index: number;
  location_index: number;
  time_index: number;
  takenSeats: string[];
}

export interface TicketData {
  ticket_id: string;
  name: string;
  ticket_index: number;
  seat_index: string;
}