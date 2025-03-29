import { Ticket, TicketType, TicketGroup } from "@/types/eventDetails"; 

export interface SelectQuantityStepProps {
  tickets: Ticket[];
  selectedTickets: { [key: string]: number };
  handleQuantityChange: (ticketId: string, quantity: number) => void;
  ticketType?: TicketType[];
  ticketsGroups: TicketGroup[];
  periodIndex: number;
  locationIndex: number;
  timeIndex: number;
}
