import { useRef, useCallback } from "react";
import { TicketDrawer } from "../types/ticketsSheet";
import { generateTicketPDF, getUserTickets } from "../utils/ticketsSheetUtils";

export const useTicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const ticketRefs = useRef<Array<HTMLDivElement | null>>([]);
  const ticketData = getUserTickets();

  const closeDrawer = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleDownloadPDF = useCallback(
    (index: number) => {
      const ref = ticketRefs.current[index];
      const ticket = ticketData[index];
      if (ref) {
        generateTicketPDF(ref, ticket);
      }
    },
    [ticketData]
  );

  return {
    open,
    closeDrawer,
    ticketRefs,
    handleDownloadPDF,
    ticketData,
  };
};
