import { Ticket, TicketType } from "@/types/eventDetails";

export const calculateTotal = (
  tickets: Ticket[],
  selectedTickets: { [key: string]: number },
  ticketType: TicketType[] = []
): number => {
  return tickets.reduce((total, ticket) => {
    const quantity = selectedTickets[ticket.ticket_id] || 0;
    const ticketInfo = ticketType.find((t) => t.ticket._id === ticket.ticket_id);
    const price = ticketInfo ? ticketInfo.ticket.price : 0;
    return total + quantity * price;
  }, 0);
};

export const getAvailableTicketCount = (
  ticket: Ticket,
  ticketIndex: number,
  ticketsGroups: TicketGroup[],
  periodIndex: number,
  locationIndex: number,
  timeIndex: number
): number => {
  const isSoloTicket = ticket.type.toLowerCase() === "solo";

  if (!isSoloTicket) {
    return 100;
  }

  if (!ticketsGroups || !Array.isArray(ticketsGroups)) return ticket.count;

  const ticketGroup = ticketsGroups.find((group) => {
    const id = group._id;
    return (
      id.ticket_ref === ticket.ticket_id &&
      id.period_index === String(periodIndex) &&
      id.location_index === String(locationIndex) &&
      id.time_index === String(timeIndex) &&
      id.ticket_index === String(ticketIndex)
    );
  });

  const takenCount = ticketGroup ? ticketGroup.count : 0;
  return ticket.count - takenCount;
};

export const getTicketInfo = (
  ticket: Ticket,
  ticketType: TicketType[] = []
): { name: string; price: number } => {
  const ticketInfo = ticketType.find((t) => t.ticket._id === ticket.ticket_id);
  return {
    name: ticketInfo ? ticketInfo.ticket.name : ticket.type,
    price: ticketInfo ? ticketInfo.ticket.price : 0,
  };
};
