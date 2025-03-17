"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import TicketComponent from "@/components/Ticket";
import html2pdf from "html2pdf.js";

interface TicketDrawer {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const TicketsSheet = ({ open, onOpenChange }: TicketDrawer) => {
  const closeDrawer = () => {
    onOpenChange(false);
  };

  const ticketData = [
    {
      eventName: "HARDWAVE TEK SECOND RELEASE",
      date: "18/02/2025",
      time: "20:00",
      location: "CERCLE - GAMMARTH CLUB",
      referenceCode: "S.BRTV0C",
    },
    {
      eventName: "ELECTRO BEAT FESTIVAL",
      date: "20/02/2025",
      time: "19:30",
      location: "CITY ARENA",
      referenceCode: "E.BTFV1X",
    },
    {
      eventName: "UN PARFAIT INCONNU LIVE",
      date: "22/02/2025",
      time: "21:00",
      location: "THEATER HALL",
      referenceCode: "U.PIV2Z",
    },
  ];

  const ticketRefs = useRef<Array<HTMLDivElement | null>>([]);

  const handleDownloadPDF = (index: number) => {
    const ref = ticketRefs.current[index];
    const ticket = ticketData[index];

    if (ref) {
      html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `ticket_${ticket.referenceCode}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(ref)
        .save();
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{
          backdropFilter: open ? "blur(4px)" : "none",
          transition: "opacity 0.3s ease-in-out, backdrop-filter 0.3s ease-in-out",
        }}
        onClick={closeDrawer}
      ></div>

      <div
        className={`fixed top-0 right-0 z-50 w-full sm:w-96 h-full bg-background shadow-lg transition-transform transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          transitionDuration: "0.3s",
          transitionProperty: "transform",
        }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Tickets</h2>
            <Button
              onClick={closeDrawer}
              variant="ghost"
              size="icon"
              className="hover:bg-muted rounded-full text-md text-main hover:text-main/90 transition duration-300"
            >
              Close
            </Button>
          </div>

          <div className="bg-muted/20 p-6 rounded-lg transition duration-300 hover:shadow-md bg-offwhite flex-1 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {ticketData.map((ticket, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div
                    ref={(el) => {
                      ticketRefs.current[index] = el;
                    }}
                  >
                    <TicketComponent
                      eventName={ticket.eventName}
                      date={ticket.date}
                      time={ticket.time}
                      location={ticket.location}
                      referenceCode={ticket.referenceCode}
                      qrValue={`https://your-ticket-validation-site.com/ticket/${encodeURIComponent(
                        ticket.referenceCode
                      )}`}
                      className="w-full max-w-[280px] mx-auto"
                    />
                  </div>
                  <Button
                    className="w-full max-w-[280px] bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
                    onClick={() => handleDownloadPDF(index)}
                  >
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-muted">
            <Button className="w-full bg-primary text-white hover:bg-primary/90 transition-colors duration-200">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketsSheet;