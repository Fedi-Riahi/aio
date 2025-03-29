import { Ticket, TicketType } from "../types/eventDetails"; 

export interface EnterNamesStepProps {
  tickets: Ticket[];
  selectedTickets: { [key: string]: number };
  userNames: { [key: string]: string[] };
  handleNameChange: (ticketId: string, index: number, name: string) => void;
  ticketType: TicketType[];
}
