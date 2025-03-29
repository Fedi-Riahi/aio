import { Ticket, TicketType } from "../types/eventDetails";

export const getTicketInfo = (
  ticket: Ticket,
  ticketType: TicketType[]
): { name: string; price: number } => {
  const ticketInfo = ticketType.find((t) => t.ticket._id === ticket.ticket_id);
  return {
    name: ticketInfo ? ticketInfo.ticket.name : ticket.type,
    price: ticketInfo ? ticketInfo.ticket.price : 0,
  };
};
