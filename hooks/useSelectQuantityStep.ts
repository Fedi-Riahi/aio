import { useCallback } from "react";
import { Ticket } from "@/types/eventDetails";
import { getAvailableTicketCount } from "@/utils/selectQuantityStepUtils";

export const useSelectQuantityStep = (
  tickets: Ticket[],
  selectedTickets: { [key: string]: number },
  handleQuantityChange: (ticketId: string, quantity: number) => void,
  ticketsGroups: TicketGroup[],
  periodIndex: number,
  locationIndex: number,
  timeIndex: number
) => {
  const handleQuantityUpdate = useCallback(
    (ticket: Ticket, ticketIndex: number, delta: number) => {
      const ticketId = ticket.ticket_id;
      const currentQuantity = selectedTickets[ticketId] || 0;
      const availableCount = getAvailableTicketCount(ticket, ticketIndex, ticketsGroups, periodIndex, locationIndex, timeIndex);
      const newQuantity = Math.max(0, Math.min(availableCount, currentQuantity + delta));

      if (newQuantity !== currentQuantity) {
        handleQuantityChange(ticketId, newQuantity);
      }
    },
    [selectedTickets, handleQuantityChange, ticketsGroups, periodIndex, locationIndex, timeIndex]
  );

  return { handleQuantityUpdate };
};
