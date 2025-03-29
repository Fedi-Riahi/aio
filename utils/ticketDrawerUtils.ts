import { Ticket, TicketType } from "@/types/eventDetails";


export const calculateTotal = (
  tickets: Ticket[],
  selectedTickets: { [key: string]: number },
  ticketType: TicketType[],
  paymentMode: "delivery" | "online" | null,
  discount: number
): { subtotal: number; reduction: number; fee: number; total: number } => {
  const subtotal = tickets.reduce((total, ticket) => {
    const quantity = selectedTickets[ticket.ticket_id] || 0;
    const ticketInfo = ticketType.find((t) => t.ticket._id === ticket.ticket_id);
    const price = ticketInfo ? ticketInfo.ticket.price : 0;
    return total + price * quantity;
  }, 0);

  const fee = paymentMode === "delivery" ? 8 : paymentMode === "online" ? 1.5 : 0;
  const reduction = (subtotal * discount) / 100;
  const total = subtotal + fee - reduction;

  return { subtotal, reduction, fee, total };
};

export const applyCoupon = (couponCode: string): number => {
  return couponCode === "DISCOUNT10" ? 10 : 0;
};

export const buildTicketDataList = (
  selectedTickets: { [key: string]: number },
  userNames: { [key: string]: string[] },
  tickets: Ticket[],
  ticketType: TicketType[],
  hasSeatTemplate: boolean | null,
  selectedSeats: string[]
): TicketData[] => {
  return Object.entries(selectedTickets)
    .filter(([, quantity]) => quantity > 0)
    .flatMap(([ticketId, quantity]) => {
      const ticket = tickets.find((t) => t.ticket_id === ticketId);
      return Array.from({ length: quantity }, (_, index) => ({
        ticket_id: ticketId,
        name: ticket?.type || ticketType.find((t) => t.ticket._id === ticketId)?.ticket.name || "Unknown Ticket",
        ticket_index: index,
        seat_index: hasSeatTemplate && selectedSeats[index] ? selectedSeats[index] : "N/A",
      }));
    });
};
