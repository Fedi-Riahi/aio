import html2pdf from "html2pdf.js";
import { TicketData } from "../types/ticketsSheet";

export const generateTicketPDF = (element: HTMLDivElement, ticket: TicketData) => {
  html2pdf()
    .set({
      margin: [10, 10, 10, 10],
      filename: `ticket_${ticket.referenceCode}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
};

export const getUserTickets = (): TicketData[] => {
  const tickets = localStorage.getItem("userTickets");
  if (!tickets) return [];

  const events = JSON.parse(tickets);
  return events.map((event: any) => ({
    eventName: event.name || "Unknown Event",
    date: event.date || "Unknown Date",
    time: event.time || "Unknown Time",
    location: event.location || "Unknown Location",
    referenceCode: event.referenceCode || `REF-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
  }));
};
